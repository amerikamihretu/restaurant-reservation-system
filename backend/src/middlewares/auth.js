import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { accessCookie } from '../utils/cookies.js';
export const authenticate = (req, res, next) => {
    const token = req.cookies?.[accessCookie];
    if (!token) return next(Object.assign(new Error('Authentication required'), { statusCode: 401 }));
    try {
        const payload = verifyAccessToken(token);
        req.user = {
            userId: payload.userId,
            role: payload.role,
        };
        User.findById(payload.userId).select('status role').then((user) => {
            if (!user || user.status !== 'ACTIVE') {
                res.status(403).json({ status: 'error', message: 'This account is not active' });
                return;
            }
            req.user.role = user.role;
            next();
        }).catch(next);
    }
    catch (error) {
        error.statusCode = 401;
        next(error);
    }

};
