import { Table } from '../models/Table.js';
import { Restaurant, ApprovalStatus } from '../models/Restaurant.js';
import { generateDailyTimeSlots } from '../utils/slotGenerator.js';
// @desc    Add a table to restaurant (RESTAURANT_OWNER)
// @route   POST /api/v1/restaurants/mine/tables
export const createTable = async (req, res, next) => {
    try {
        const ownerId = req.user?.userId;
        const restaurant = await Restaurant.findOne({ owner: ownerId });
        if (!restaurant || restaurant.approvalStatus !== ApprovalStatus.APPROVED) {
            res.status(404).json({ status: 'error', message: 'Restaurant profile not found' });
            return;
        }
        const newTable = await Table.create({
            ...req.body,
            restaurant: restaurant._id,
        });
        res.status(201).json({
            status: 'success',
            message: 'Table added successfully',
            data: { table: newTable },
        });
    }
    catch (error) { next(error); }
};

export const updateTable = async (req, res, next) => {
 try {
    const restaurant = await Restaurant.findOne({ owner: req.user.userId });
    if (!restaurant || restaurant.approvalStatus !== ApprovalStatus.APPROVED) return res.status(404).json({ status: 'error', message: 'Approved restaurant profile not found' });
    const table = await Table.findOne({ _id: req.params.id, restaurant: restaurant._id });
    if (!table) return res.status(404).json({ status: 'error', message: 'Table not found' });
    const nextCapacity = req.body.capacity ?? table.capacity;
    const nextMinSeats = req.body.minSeats ?? table.minSeats;
    if (nextMinSeats > nextCapacity) return res.status(400).json({ status: 'error', message: 'Minimum seats cannot exceed capacity' });
    Object.assign(table, req.body);
    await table.save();
    res.status(200).json({ status: 'success', data: { table } });
 } catch (error) { next(error); }
};

export const deleteTable = async (req, res, next) => {
 try {
    const restaurant = await Restaurant.findOne({ owner: req.user.userId });
    if (!restaurant || restaurant.approvalStatus !== ApprovalStatus.APPROVED) return res.status(404).json({ status: 'error', message: 'Approved restaurant profile not found' });
    const table = await Table.findOneAndDelete({ _id: req.params.id, restaurant: restaurant._id });
    if (!table) return res.status(404).json({ status: 'error', message: 'Table not found' });
    res.status(200).json({ status: 'success', message: 'Table deleted successfully' });
 } catch (error) { next(error); }
};
// @desc    Get all tables for owner's restaurant
// @route   GET /api/v1/restaurants/mine/tables
export const getMyTables = async (req, res, next) => {
    try {
        const ownerId = req.user?.userId;
        const restaurant = await Restaurant.findOne({ owner: ownerId });
        if (!restaurant || restaurant.approvalStatus !== ApprovalStatus.APPROVED) {
            res.status(404).json({ status: 'error', message: 'Restaurant profile not found' });
            return;
        }
        const tables = await Table.find({ restaurant: restaurant._id }).sort({ tableNumber: 1 });
        res.status(200).json({
            status: 'success',
            data: { tables },
        });
    }
    catch (error) { next(error); }
};
// @desc    Get available slots for a restaurant on a given date & guest count
// @route   GET /api/v1/restaurants/:restaurantId/available-slots
export const getAvailableSlots = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { date, partySize } = req.query;
        if (!date || !partySize) {
            res.status(400).json({ status: 'error', message: 'Date (YYYY-MM-DD) and partySize are required' });
            return;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
            res.status(400).json({ status: 'error', message: 'Date must be a valid YYYY-MM-DD date' });
            return;
        }
        const restaurant = await Restaurant.findOne({ _id: restaurantId, approvalStatus: 'APPROVED' });
        if (!restaurant) {
            res.status(404).json({ status: 'error', message: 'Restaurant not found' });
            return;
        }
        // Determine Day of Week for the requested date
        const queryDate = new Date(date);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[queryDate.getUTCDay()];
        const daySchedule = restaurant.operatingHours.find((h) => h.day === dayName);
        if (!daySchedule || !daySchedule.isOpen) {
            res.status(200).json({
                status: 'success',
                data: { slots: [], message: `Restaurant is closed on ${dayName}s` },
            });
            return;
        }
        // Find active tables capable of accommodating the party size
        const guestCount = parseInt(partySize, 10);
        if (!Number.isInteger(guestCount) || guestCount < 1) {
            res.status(400).json({ status: 'error', message: 'Party size must be a positive integer' });
            return;
        }
        const suitableTables = await Table.find({
            restaurant: restaurantId,
            isActive: true,
            capacity: { $gte: guestCount },
            minSeats: { $lte: guestCount },
        });
        if (suitableTables.length === 0) {
            res.status(200).json({
                status: 'success',
                data: { slots: [], message: 'No tables available matching this party size' },
            });
            return;
        }
        // Generate base time slots based on operating hours
        const slots = generateDailyTimeSlots(daySchedule.openTime, daySchedule.closeTime);
        const { Reservation, ReservationStatus } = await import('../models/Reservation.js');
        const reservations = await Reservation.find({
            restaurant: restaurantId,
            date,
            status: { $in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
        }).select('table startTime endTime');
        const availableSlots = slots.map((slot) => {
            const table = suitableTables.find((candidate) => !reservations.some((reservation) => reservation.table.toString() === candidate._id.toString() && reservation.startTime < slot.endTime && reservation.endTime > slot.startTime));
            return table ? { ...slot, tableId: table._id.toString() } : null;
        }).filter(Boolean);
        res.status(200).json({
            status: 'success',
            data: {
                date,
                dayOfWeek: dayName,
                partySize: guestCount,
                suitableTablesCount: suitableTables.length,
                slots: availableSlots,
            },
        });
    }
    catch (error) { next(error); }
};
