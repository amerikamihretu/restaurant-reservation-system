import { Reservation, ReservationStatus } from '../models/Reservation.js';
import { Table } from '../models/Table.js';
import { Restaurant, ApprovalStatus } from '../models/Restaurant.js';

const activeStatuses = [ReservationStatus.PENDING, ReservationStatus.CONFIRMED];
const slotsFor = (startTime) => {
    const start = Number(startTime.slice(0, 2)) * 60 + Number(startTime.slice(3));
    return [0, 30, 60].map((offset) => {
        const minutes = start + offset;
        return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
    });
};
const fail = (message, statusCode) => Object.assign(new Error(message), { statusCode });
const isRealDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return date.toISOString().slice(0, 10) === value;
};

export const createReservation = async (req, res, next) => {
    try {
        const { restaurantId, tableId, date, startTime, endTime, partySize, specialRequests } = req.body;
        if (!isRealDate(date) || date < new Date().toISOString().slice(0, 10)) return next(fail('Reservation date must be today or later', 400));
        const restaurant = await Restaurant.findOne({ _id: restaurantId, approvalStatus: ApprovalStatus.APPROVED });
        if (!restaurant) return next(fail('Approved restaurant not found', 404));
        const table = await Table.findOne({ _id: tableId, restaurant: restaurantId, isActive: true });
        if (!table) return next(fail('Table not found or inactive', 404));
        if (partySize < table.minSeats || partySize > table.capacity) return next(fail('Party size does not fit this table', 400));
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(`${date}T00:00:00Z`).getUTCDay()];
        const schedule = restaurant.operatingHours.find((hours) => hours.day === dayName);
        if (!schedule?.isOpen || startTime < schedule.openTime || endTime > schedule.closeTime) return next(fail('Reservation is outside restaurant hours', 400));
        const slotKeys = slotsFor(startTime);
        const conflict = await Reservation.findOne({ table: tableId, date, status: { $in: activeStatuses }, startTime: { $lt: endTime }, endTime: { $gt: startTime } });
        if (conflict) return next(fail('This table is already reserved for the selected time window', 409));
        try {
            const reservation = await Reservation.create({ customer: req.user.userId, restaurant: restaurantId, table: tableId, date, startTime, endTime, partySize, specialRequests, slotKeys });
            return res.status(201).json({ status: 'success', message: 'Reservation submitted successfully', data: { reservation } });
        } catch (error) {
            if (error.code === 11000) return next(fail('This table is already reserved for the selected time window', 409));
            throw error;
        }
    } catch (error) { next(error); }
};

export const getMyReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find({ customer: req.user.userId }).populate('restaurant', 'name address phone coverImage').populate('table', 'tableNumber location capacity').sort({ date: -1, startTime: -1 });
        res.json({ status: 'success', data: { reservations } });
    } catch (error) { next(error); }
};

export const getOwnerReservations = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user.userId });
        if (!restaurant || restaurant.approvalStatus !== ApprovalStatus.APPROVED) return next(fail('An approved restaurant is required before managing reservations', 403));
        const filter = { restaurant: restaurant._id };
        if (req.query.date) filter.date = req.query.date;
        if (req.query.status) filter.status = req.query.status;
        const reservations = await Reservation.find(filter).populate('customer', 'name email').populate('table', 'tableNumber location').sort({ date: 1, startTime: 1 });
        res.json({ status: 'success', data: { reservations } });
    } catch (error) { next(error); }
};

export const updateReservationStatus = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return next(fail('Reservation not found', 404));
        const { status } = req.body;
        if (req.user.role === 'CUSTOMER') {
            if (reservation.customer.toString() !== req.user.userId || status !== ReservationStatus.CANCELLED) return next(fail('Customers can only cancel their own reservations', 403));
            if (!activeStatuses.includes(reservation.status)) return next(fail('Only pending or confirmed reservations can be cancelled', 400));
        } else if (req.user.role === 'RESTAURANT_OWNER') {
            const restaurant = await Restaurant.findOne({ owner: req.user.userId });
            if (!restaurant || restaurant.approvalStatus !== ApprovalStatus.APPROVED || reservation.restaurant.toString() !== restaurant._id.toString()) return next(fail('Not authorized for this restaurant', 403));
            const allowed = { PENDING: ['CONFIRMED', 'CANCELLED'], CONFIRMED: ['COMPLETED', 'CANCELLED'] };
            if (!allowed[reservation.status]?.includes(status)) return next(fail('Invalid reservation status transition', 400));
        }
        reservation.status = status;
        await reservation.save();
        res.json({ status: 'success', data: { reservation } });
    } catch (error) { next(error); }
};
