/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { reservationApi } from '../api/reservation.api';
import { Calendar, Clock, Users, Phone, Mail } from 'lucide-react';
export const OwnerReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError('');
            const params = {};
            if (selectedDate)
                params.date = selectedDate;
            if (selectedStatus)
                params.status = selectedStatus;
            const response = await reservationApi.getOwnerReservations(params);
            setReservations(response.data.reservations);
        }
        catch (err) {
            setError(err.message || 'Failed to fetch customer bookings');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchReservations();
    }, [selectedDate, selectedStatus]);
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            setUpdatingId(id);
            await reservationApi.updateStatus(id, newStatus);
            await fetchReservations();
        }
        catch (err) {
            alert(err.message || 'Failed to update reservation status');
        }
        finally {
            setUpdatingId(null);
        }
    };
    return (_jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900 mb-2", children: "Restaurant Reservations" }), _jsx("p", { className: "text-slate-600", children: "Review, confirm, and update customer table bookings in real time." })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-500 uppercase mb-1", children: "Filter Date" }), _jsx("input", { type: "date", value: selectedDate, onChange: (e) => setSelectedDate(e.target.value), className: "px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-500 uppercase mb-1", children: "Filter Status" }), _jsxs("select", { value: selectedStatus, onChange: (e) => setSelectedStatus(e.target.value), className: "px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "PENDING", children: "Pending" }), _jsx("option", { value: "CONFIRMED", children: "Confirmed" }), _jsx("option", { value: "COMPLETED", children: "Completed" }), _jsx("option", { value: "CANCELLED", children: "Cancelled" })] })] }), (selectedDate || selectedStatus) && (_jsx("button", { onClick: () => {
                            setSelectedDate('');
                            setSelectedStatus('');
                        }, className: "mt-5 text-sm text-orange-600 font-medium hover:underline cursor-pointer", children: "Clear Filters" }))] }), error && _jsx("div", { className: "p-4 mb-6 bg-red-50 text-red-700 rounded-lg border border-red-200", children: error }), loading ? (_jsx("div", { className: "text-center py-12 text-slate-500", children: "Loading restaurant bookings..." })) : reservations.length === 0 ? (_jsx("div", { className: "text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500", children: "No bookings found matching your selected filters." })) : (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500", children: [_jsx("th", { className: "p-4", children: "Customer" }), _jsx("th", { className: "p-4", children: "Date & Time" }), _jsx("th", { className: "p-4", children: "Table & Party" }), _jsx("th", { className: "p-4", children: "Status" }), _jsx("th", { className: "p-4 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-200 text-sm", children: reservations.map((res) => {
                                const customerObj = typeof res.customer === 'object' ? res.customer : null;
                                return (_jsxs("tr", { className: "hover:bg-slate-50", children: [_jsxs("td", { className: "p-4", children: [_jsx("div", { className: "font-bold text-slate-900", children: customerObj?.name || 'Customer' }), _jsxs("div", { className: "text-xs text-slate-500 flex items-center gap-1 mt-0.5", children: [_jsx(Mail, { className: "w-3 h-3" }), " ", customerObj?.email] }), customerObj?.phone && (_jsxs("div", { className: "text-xs text-slate-500 flex items-center gap-1 mt-0.5", children: [_jsx(Phone, { className: "w-3 h-3" }), " ", customerObj.phone] }))] }), _jsxs("td", { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-1 text-slate-900 font-medium", children: [_jsx(Calendar, { className: "w-3.5 h-3.5 text-orange-600" }), " ", res.date] }), _jsxs("div", { className: "flex items-center gap-1 text-slate-500 text-xs mt-0.5", children: [_jsx(Clock, { className: "w-3.5 h-3.5 text-orange-600" }), " ", res.startTime, " - ", res.endTime] })] }), _jsxs("td", { className: "p-4", children: [_jsxs("div", { className: "font-medium text-slate-900", children: ["Table ", res.table.tableNumber] }), _jsxs("div", { className: "text-xs text-slate-500 flex items-center gap-1 mt-0.5", children: [_jsx(Users, { className: "w-3 h-3 text-orange-600" }), " ", res.partySize, " Guests"] })] }), _jsx("td", { className: "p-4", children: _jsx("span", { className: `inline-block text-xs px-2.5 py-1 rounded-full font-semibold ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                    res.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                                        res.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`, children: res.status }) }), _jsxs("td", { className: "p-4 text-right space-x-2", children: [res.status === 'PENDING' && (_jsx("button", { onClick: () => handleStatusUpdate(res._id, 'CONFIRMED'), disabled: updatingId === res._id, className: "px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer", children: "Confirm" })), res.status === 'CONFIRMED' && (_jsx("button", { onClick: () => handleStatusUpdate(res._id, 'COMPLETED'), disabled: updatingId === res._id, className: "px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer", children: "Mark Seated" })), (res.status === 'PENDING' || res.status === 'CONFIRMED') && (_jsx("button", { onClick: () => handleStatusUpdate(res._id, 'CANCELLED'), disabled: updatingId === res._id, className: "px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer", children: "Cancel" }))] })] }, res._id));
                            }) })] }) }))] }));
};
