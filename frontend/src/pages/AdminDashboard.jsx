/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { restaurantApi, ApprovalStatus } from '../api/restaurant.api';
export const AdminDashboard = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [statusFilter, setStatusFilter] = useState(ApprovalStatus.PENDING);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Rejection Modal State
    const [selectedRestId, setSelectedRestId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await restaurantApi.getAdminRestaurants(statusFilter || undefined);
            setRestaurants(res.data.restaurants);
        }
        catch (err) {
            setError(err.message || 'Failed to fetch restaurants list');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRestaurants();
    }, [statusFilter]);
    const handleApprove = async (id) => {
        try {
            await restaurantApi.updateApprovalStatus(id, ApprovalStatus.APPROVED);
            fetchRestaurants();
        }
        catch (err) {
            alert(err.message || 'Failed to approve restaurant');
        }
    };
    const handleRejectSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRestId || !rejectionReason.trim())
            return;
        try {
            await restaurantApi.updateApprovalStatus(selectedRestId, ApprovalStatus.REJECTED, rejectionReason);
            setSelectedRestId(null);
            setRejectionReason('');
            fetchRestaurants();
        }
        catch (err) {
            alert(err.message || 'Failed to reject restaurant');
        }
    };
    return (_jsxs("div", { style: { maxWidth: '1000px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }, children: [_jsx("h2", { children: "Admin Approval Portal" }), _jsxs("div", { style: { marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }, children: [_jsx("label", { children: _jsx("strong", { children: "Filter Status:" }) }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), style: { padding: '0.5rem' }, children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: ApprovalStatus.PENDING, children: "Pending" }), _jsx("option", { value: ApprovalStatus.APPROVED, children: "Approved" }), _jsx("option", { value: ApprovalStatus.REJECTED, children: "Rejected" })] })] }), error && _jsx("div", { style: { color: 'red', marginBottom: '1rem' }, children: error }), loading ? (_jsx("div", { children: "Loading restaurants..." })) : restaurants.length === 0 ? (_jsx("p", { children: "No restaurants found for this filter." })) : (_jsxs("table", { style: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }, children: [_jsx("th", { style: { padding: '0.75rem' }, children: "Name" }), _jsx("th", { style: { padding: '0.75rem' }, children: "Cuisine" }), _jsx("th", { style: { padding: '0.75rem' }, children: "Location" }), _jsx("th", { style: { padding: '0.75rem' }, children: "Status" }), _jsx("th", { style: { padding: '0.75rem' }, children: "Actions" })] }) }), _jsx("tbody", { children: restaurants.map((rest) => (_jsxs("tr", { style: { borderBottom: '1px solid #e2e8f0' }, children: [_jsxs("td", { style: { padding: '0.75rem' }, children: [_jsx("strong", { children: rest.name }), _jsx("br", {}), _jsx("small", { children: rest.phone })] }), _jsx("td", { style: { padding: '0.75rem' }, children: rest.cuisine.join(', ') }), _jsxs("td", { style: { padding: '0.75rem' }, children: [rest.address.city, ", ", rest.address.state] }), _jsx("td", { style: { padding: '0.75rem' }, children: _jsx("span", { style: {
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem',
                                            backgroundColor: rest.approvalStatus === ApprovalStatus.APPROVED ? '#c6f6d5' : rest.approvalStatus === ApprovalStatus.REJECTED ? '#fed7d7' : '#feebc8'
                                        }, children: rest.approvalStatus }) }), _jsxs("td", { style: { padding: '0.75rem' }, children: [rest.approvalStatus !== ApprovalStatus.APPROVED && (_jsx("button", { onClick: () => handleApprove(rest._id), style: { marginRight: '0.5rem', padding: '0.4rem 0.75rem', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }, children: "Approve" })), rest.approvalStatus !== ApprovalStatus.REJECTED && (_jsx("button", { onClick: () => setSelectedRestId(rest._id), style: { padding: '0.4rem 0.75rem', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }, children: "Reject" }))] })] }, rest._id))) })] })), selectedRestId && (_jsx("div", { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsxs("div", { style: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '500px', width: '100%' }, children: [_jsx("h3", { children: "Reject Restaurant Submission" }), _jsxs("form", { onSubmit: handleRejectSubmit, children: [_jsx("label", { children: "Provide reason for rejection:" }), _jsx("textarea", { value: rejectionReason, onChange: (e) => setRejectionReason(e.target.value), required: true, rows: 4, style: { width: '100%', margin: '1rem 0', padding: '0.5rem' } }), _jsxs("div", { style: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' }, children: [_jsx("button", { type: "button", onClick: () => setSelectedRestId(null), style: { padding: '0.5rem 1rem' }, children: "Cancel" }), _jsx("button", { type: "submit", style: { padding: '0.5rem 1rem', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px' }, children: "Confirm Rejection" })] })] })] }) }))] }));
};
