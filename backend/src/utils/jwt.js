import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
const getJwtSecrets = () => {
    const secret = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
    if (!secret) {
        throw new Error('FATAL CONFIG ERROR: JWT_SECRET environment variable is missing.');
    }
    if (!refreshSecret) {
        throw new Error('FATAL CONFIG ERROR: JWT_REFRESH_SECRET environment variable is missing.');
    }
    if (!expiresIn) {
        throw new Error('FATAL CONFIG ERROR: JWT_EXPIRES_IN environment variable is missing.');
    }
    if (!refreshExpiresIn) {
        throw new Error('FATAL CONFIG ERROR: JWT_REFRESH_EXPIRES_IN environment variable is missing.');
    }
    return { secret, refreshSecret, expiresIn, refreshExpiresIn };
};
export const generateAccessToken = (payload) => {
    const { secret, expiresIn } = getJwtSecrets();
    return jwt.sign(payload, secret, { expiresIn: expiresIn, jwtid: crypto.randomUUID() });
};
export const generateRefreshToken = (payload) => {
    const { refreshSecret, refreshExpiresIn } = getJwtSecrets();
    return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn, jwtid: crypto.randomUUID() });
};
export const verifyAccessToken = (token) => {
    const { secret } = getJwtSecrets();
    return jwt.verify(token, secret);
};
export const verifyRefreshToken = (token) => {
    const { refreshSecret } = getJwtSecrets();
    return jwt.verify(token, refreshSecret);
};
