import { z } from 'zod';
import { UserRole } from '../models/User.js';
export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    role: z.enum(Object.values(UserRole), { errorMap: () => ({ message: 'Invalid account role' }) }).default(UserRole.CUSTOMER),
});
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});
export const refreshSchema = z.object({});
