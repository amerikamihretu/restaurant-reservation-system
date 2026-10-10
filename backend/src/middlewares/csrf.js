import crypto from 'node:crypto';
import { csrfCookie } from '../utils/cookies.js';

export const csrfProtection = (req, res, next) => {
    let token = req.cookies?.[csrfCookie];
    if (!token) {
        token = crypto.randomBytes(32).toString('hex');
        res.cookie(csrfCookie, token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
    }
    const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
    const isAuthEndpoint = req.path === '/login' || req.path === '/register' || req.path === '/refresh';
    if (!safeMethod && !isAuthEndpoint && req.headers['x-csrf-token'] !== token) {
        const error = new Error('CSRF validation failed');
        error.statusCode = 403;
        return next(error);
    }
    return next();
};
