import crypto from 'node:crypto';
import { User, AccountStatus } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { accessCookie, refreshCookie, cookieOptions, clearCookieOptions } from '../utils/cookies.js';

const refreshMaxAge = 7 * 24 * 60 * 60 * 1000;
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, status: user.status });

const issueSession = async (res, user, oldTokenHash = null) => {
    const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id.toString(), role: user.role });
    const tokenHash = hashToken(refreshToken);
    const payload = verifyRefreshToken(refreshToken);
    await RefreshToken.create({ tokenHash, userId: user._id, expiresAt: new Date(payload.exp * 1000) });
    if (oldTokenHash) await RefreshToken.findOneAndUpdate({ tokenHash: oldTokenHash, revokedAt: null }, { revokedAt: new Date(), replacedByHash: tokenHash });
    res.cookie(accessCookie, accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie(refreshCookie, refreshToken, cookieOptions(refreshMaxAge));
    return { user: publicUser(user) };
};

export const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (role === 'ADMIN' && process.env.NODE_ENV === 'production') {
            return next(Object.assign(new Error('Administrator self-registration is disabled in production'), { statusCode: 403 }));
        }
        if (role === 'ADMIN' && process.env.ALLOW_ADMIN_REGISTRATION !== 'true') {
            return next(Object.assign(new Error('Administrator self-registration is disabled'), { statusCode: 403 }));
        }
        const user = await User.create({ name, email, password, role });
        res.status(201).json({ status: 'success', data: await issueSession(res, user) });
    } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select('+password');
        if (!user || !(await user.comparePassword(req.body.password))) {
            return next(Object.assign(new Error('Invalid credentials'), { statusCode: 401 }));
        }
        if (user.status !== AccountStatus.ACTIVE) {
            return next(Object.assign(new Error('This account is suspended'), { statusCode: 403 }));
        }
        res.status(200).json({ status: 'success', data: await issueSession(res, user) });
    } catch (error) { next(error); }
};

export const refresh = async (req, res, next) => {
    try {
        const token = req.cookies?.[refreshCookie];
        if (!token) return next(Object.assign(new Error('Refresh session is required'), { statusCode: 401 }));
        const tokenHash = hashToken(token);
        const stored = await RefreshToken.findOne({ tokenHash, revokedAt: null });
        if (!stored) return next(Object.assign(new Error('Refresh session is invalid'), { statusCode: 401 }));
        const payload = verifyRefreshToken(token);
        const user = await User.findById(payload.userId);
        if (!user || user.status !== AccountStatus.ACTIVE) {
            await RefreshToken.findOneAndUpdate({ tokenHash }, { revokedAt: new Date() });
            return next(Object.assign(new Error('This account is not active'), { statusCode: 403 }));
        }
        res.status(200).json({ status: 'success', data: await issueSession(res, user, tokenHash) });
    } catch (error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return next(Object.assign(new Error('Refresh session is invalid or expired'), { statusCode: 401 }));
        }
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const token = req.cookies?.[refreshCookie];
        if (token) await RefreshToken.findOneAndUpdate({ tokenHash: hashToken(token), revokedAt: null }, { revokedAt: new Date() });
        res.clearCookie(accessCookie, clearCookieOptions());
        res.clearCookie(refreshCookie, clearCookieOptions());
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) { next(error); }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return next(Object.assign(new Error('User account not found'), { statusCode: 404 }));
        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) { next(error); }
};
