import { apiFetch } from './client';
export const loginApi = async (credentials) => {
    return apiFetch('/auth/login', {
        method: 'POST',
        data: credentials,
    });
};
export const registerApi = async (data) => {
    return apiFetch('/auth/register', {
        method: 'POST',
        data,
    });
};
export const logoutApi = () => apiFetch('/auth/logout', { method: 'POST' });
export const currentUserApi = () => apiFetch('/auth/me');
export const refreshApi = () => apiFetch('/auth/refresh', { method: 'POST' });
