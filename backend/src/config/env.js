import { z } from 'zod';
const envSchema = z.object({
    PORT: z.string().min(1, 'PORT must be explicitly defined (e.g. 5000)'),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    CLIENT_ORIGINS: z.string().min(1, 'CLIENT_ORIGINS must contain at least one trusted frontend origin').optional(),
    CLIENT_ORIGIN: z.string().url('CLIENT_ORIGIN must be a valid URL (e.g. http://localhost:5173)').optional(),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI connection string is required'),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
    JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters long'),
    JWT_EXPIRES_IN: z.string().min(1, 'JWT_EXPIRES_IN is required (e.g. 15m)'),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1, 'JWT_REFRESH_EXPIRES_IN is required (e.g. 7d)'),
    ALLOW_ADMIN_REGISTRATION: z.enum(['true', 'false']).default('false'),
}).superRefine((value, context) => {
    if (!value.CLIENT_ORIGINS && !value.CLIENT_ORIGIN) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['CLIENT_ORIGINS'],
            message: 'Set CLIENT_ORIGINS or CLIENT_ORIGIN',
        });
    }
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
