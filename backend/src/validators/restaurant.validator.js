import { z } from 'zod';
import { ApprovalStatus } from '../models/Restaurant.js';
const dayEnum = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
const dayScheduleSchema = z.object({
    day: dayEnum,
    openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
    closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
    isOpen: z.boolean(),
}).refine(({ isOpen, openTime, closeTime }) => !isOpen || openTime < closeTime, {
    message: 'Closing time must be after opening time',
    path: ['closeTime'],
});
export const createRestaurantSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
    cuisine: z.array(z.string().min(1)).min(1, 'At least one cuisine type is required'),
    address: z.object({
        street: z.string().min(1, 'Street is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        zipCode: z.string().min(1, 'Zip code is required'),
    }),
    phone: z.string().min(7, 'Phone number must be at least 7 digits'),
    operatingHours: z.array(dayScheduleSchema).min(1, 'Operating hours are required'),
    coverImage: z.string().url('Cover image must be a valid URL').optional(),
});
export const updateRestaurantSchema = createRestaurantSchema.partial();
export const updateApprovalStatusSchema = z.object({
    status: z.enum([ApprovalStatus.APPROVED, ApprovalStatus.REJECTED]),
    rejectionReason: z.string().min(1).max(500).optional(),
}).refine((value) => value.status !== ApprovalStatus.REJECTED || Boolean(value.rejectionReason?.trim()), {
    message: 'A rejection reason is required',
    path: ['rejectionReason'],
});
