import { apiFetch } from './client';
export const reservationApi = {
    createReservation: (data) => {
        return apiFetch('/reservations', {
            method: 'POST',
            data,
        });
    },
    getMyReservations: () => {
        return apiFetch('/reservations/mine');
    },
    getOwnerReservations: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiFetch(`/reservations/owner/list?${query}`);
    },
    updateStatus: (id, status) => {
        return apiFetch(`/reservations/${id}/status`, {
            method: 'PATCH',
            data: { status },
        });
    },
};
