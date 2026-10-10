/* eslint-disable react-hooks/set-state-in-effect */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { reservationApi } from '../api/reservation.api';
import { Calendar, Clock, MapPin, Users, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
export const CustomerDashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);
    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await reservationApi.getMyReservations();
            setReservations(response.data.reservations);
        }
        catch (err) {
            setError(err.message || 'Failed to load your reservations');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchReservations();
    }, []);
    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?'))
            return;
        try {
            setCancellingId(id);
            await reservationApi.updateStatus(id, 'CANCELLED');
            await fetchReservations();
        }
        catch (err) {
            alert(err.message || 'Failed to cancel reservation');
        }
        finally {
            setCancellingId(null);
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-800 font-semibold", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " Confirmed"] }));
            case 'PENDING':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold", children: [_jsx(AlertCircle, { className: "w-3.5 h-3.5" }), " Pending"] }));
            case 'CANCELLED':
                return (_jsxs("span", { className: "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-semibold", children: [_jsx(XCircle, { className: "w-3.5 h-3.5" }), " Cancelled"] }));
            case 'COMPLETED':
                return (_jsx("span", { className: "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold", children: "Completed" }));
        }
    };
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900 mb-2", children: "My Reservations" }), _jsx("p", { className: "text-slate-600", children: "View and manage your upcoming and past dining bookings." })] }), error && _jsx("div", { className: "p-4 mb-6 bg-red-50 text-red-700 rounded-lg border border-red-200", children: error }), loading ? (_jsx("div", { className: "text-center py-12 text-slate-500", children: "Loading your reservations..." })) : reservations.length === 0 ? (_jsx("div", { className: "text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500", children: "You haven't made any table reservations yet." })) : (_jsx("div", { className: "space-y-4", children: reservations.map((res) => (_jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h3", { className: "text-xl font-bold text-slate-900", children: res.restaurant.name }), getStatusBadge(res.status)] }), _jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-slate-600", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-4 h-4 text-orange-600" }), _jsx("span", { children: res.date })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { className: "w-4 h-4 text-orange-600" }), _jsxs("span", { children: [res.startTime, " - ", res.endTime] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Users, { className: "w-4 h-4 text-orange-600" }), _jsxs("span", { children: [res.partySize, " ", res.partySize === 1 ? 'Guest' : 'Guests'] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { className: "w-4 h-4 text-orange-600" }), _jsxs("span", { children: ["Table ", res.table.tableNumber, " (", res.table.location || 'Indoor', ")"] })] })] }), res.specialRequests && (_jsxs("p", { className: "text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100", children: ["\"", res.specialRequests, "\""] }))] }), (res.status === 'PENDING' || res.status === 'CONFIRMED') && (_jsx("button", { onClick: () => handleCancel(res._id), disabled: cancellingId === res._id, className: "px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer self-start md:self-center", children: cancellingId === res._id ? 'Cancelling...' : 'Cancel Reservation' }))] }, res._id))) }))] }));
};
