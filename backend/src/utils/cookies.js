export const accessCookie = 'rr_access';
export const refreshCookie = 'rr_refresh';
export const csrfCookie = 'rr_csrf';

export const cookieOptions = (maxAge, httpOnly = true) => ({
    httpOnly,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
});

export const clearCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
});
