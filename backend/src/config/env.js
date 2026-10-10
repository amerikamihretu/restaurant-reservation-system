import { z } from 'zod';
const envSchema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CLIENT_ORIGINS: z.string().optional().default('http://localhost:3000,http://127.0.0.1:3000'),
    CLIENT_ORIGIN: z.string().optional(),
    MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/restaurant-reservation'),
    JWT_SECRET: z.string().min(32).default('restoreserve-super-secret-jwt-key-2026-production-ready'),
    JWT_REFRESH_SECRET: z.string().min(32).default('restoreserve-super-secret-jwt-refresh-key-2026-production'),
    JWT_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    ALLOW_ADMIN_REGISTRATION: z.enum(['true', 'false']).default('false'),
});
export const validateEnv = () => {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('\n==================================================');
        console.error('  FATAL CONFIGURATION ERROR: ENVIRONMENT FAIL-FAST');
        console.error('==================================================');
        const formattedErrors = result.error.format();
        Object.entries(formattedErrors).forEach(([key, value]) => {
            if (key !== '_errors' && value && '_errors' in value && value._errors.length > 0) {
                console.error(`  x ${key}: ${value._errors.join(', ')}`);
            }
        });
        console.error('==================================================\n');
        process.exit(1);
    }
    return result.data;
};
