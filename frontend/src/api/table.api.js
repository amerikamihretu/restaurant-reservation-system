import { apiFetch } from './client';
export const tableApi = {
    getAvailableSlots: (restaurantId, date, partySize) => {
        return apiFetch(`/tables/${restaurantId}/available-slots?date=${date}&partySize=${partySize}`);
    },
    getMyTables: () => {
        return apiFetch('/tables/mine/tables');
    },
    createTable: (data) => {
        return apiFetch('/tables/mine/tables', {
            method: 'POST',
            data,
        });
    },
    updateTable: (id, data) => apiFetch(`/tables/mine/tables/${id}`, {
        method: 'PATCH',
        data,
    }),
    deleteTable: (id) => apiFetch(`/tables/mine/tables/${id}`, {
        method: 'DELETE',
    }),
};
