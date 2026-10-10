import { apiFetch } from './client';
export const adminApi = {
    getAnalytics: () => {
        return apiFetch('/admin/analytics');
    },
    getUsers: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiFetch(`/admin/users?${query}`);
    },
    updateUserStatus: (id, status) => {
        return apiFetch(`/admin/users/${id}/status`, {
            method: 'PATCH',
            data: { status },
        });
    },
};
