import { z } from 'zod';
import { ReservationStatus } from '../models/Reservation.js';
export const createReservationSchema = z.object({
    restaurantId: z.string().min(1, 'Restaurant ID is required'),
    tableId: z.string().min(1, 'Table ID is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
    partySize: z.number().int().min(1, 'Party size must be at least 1').max(50),
    specialRequests: z.string().max(500, 'Special requests cannot exceed 500 characters').optional(),
}).refine(({ startTime, endTime }) => startTime < endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
}).refine(({ date }) => date >= new Date().toISOString().slice(0, 10), {
    message: 'Reservation date cannot be in the past',
    path: ['date'],
}).refine(({ startTime, endTime }) => {
    const minutes = (value) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
    return minutes(endTime) - minutes(startTime) === 90 && minutes(startTime) % 30 === 0;
}, {
    message: 'Reservations must be 90 minutes and start on a 30-minute boundary',
    path: ['startTime'],
});
export const updateReservationStatusSchema = z.object({
    status: z.enum([
        ReservationStatus.CONFIRMED,
        ReservationStatus.CANCELLED,
        ReservationStatus.COMPLETED,
    ]),
});
