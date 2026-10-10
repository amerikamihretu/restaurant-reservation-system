import { z } from 'zod';
import { AccountStatus } from '../models/User.js';
export const updateUserStatusSchema = z.object({
    status: z.enum([AccountStatus.ACTIVE, AccountStatus.SUSPENDED]),
});
