import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import testRoutes from './routes/test.routes.js';
import restaurantRoutes from './routes/restaurant.routes.js';
import tableRoutes from './routes/table.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { csrfProtection } from './middlewares/csrf.js';
import { handleError } from './middlewares/handleError.js';
const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(csrfProtection);
// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/tables', tableRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api', (_req, res) => {
    res.status(404).json({ status: 'error', message: 'API endpoint not found' });
});
app.use(handleError);
export default app;
