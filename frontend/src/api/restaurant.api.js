import { apiFetch } from './client';
export const ApprovalStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
};
export const restaurantApi = {
    // Public
    getApprovedRestaurants: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiFetch(`/restaurants?${query}`);
    },
    getRestaurantById: (id) => {
        return apiFetch(`/restaurants/${id}`);
    },
    // Owner
    getMyRestaurant: () => {
        return apiFetch('/restaurants/mine/profile');
    },
    createRestaurant: (data) => {
        return apiFetch('/restaurants', {
            method: 'POST',
            data,
        });
    },
    updateMyRestaurant: (data) => {
        return apiFetch('/restaurants/mine/profile', {
            method: 'PUT',
            data,
        });
    },
    // Admin
    getAdminRestaurants: (status) => {
        const query = status ? `?status=${status}` : '';
        return apiFetch(`/restaurants/admin/list${query}`);
    },
    updateApprovalStatus: (id, status, rejectionReason) => {
        return apiFetch(`/restaurants/${id}/approval`, {
            method: 'PATCH',
            data: { status, rejectionReason },
        });
    },
};
