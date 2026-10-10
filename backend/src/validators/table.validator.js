import { z } from 'zod';
const tableFields = {
    tableNumber: z.string().min(1, 'Table number is required'),
    capacity: z.number().int().min(1, 'Capacity must be at least 1'),
    minSeats: z.number().int().min(1, 'Minimum seats must be at least 1').optional(),
    location: z.string().optional(),
    isActive: z.boolean().optional(),
};
export const createTableSchema = z.object(tableFields).refine((value) => value.minSeats === undefined || value.minSeats <= value.capacity, { message: 'Minimum seats cannot exceed capacity', path: ['minSeats'] });
export const updateTableSchema = z.object(tableFields).partial().refine((value) => value.minSeats === undefined || value.capacity === undefined || value.minSeats <= value.capacity, { message: 'Minimum seats cannot exceed capacity', path: ['minSeats'] });
