/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantApi } from '../api/restaurant.api';
import { tableApi } from '../api/table.api';
import { reservationApi } from '../api/reservation.api';
import { useAuth } from '../hooks/useAuth';
import { MapPin, Phone, Clock, Calendar, Users, CheckCircle2 } from 'lucide-react';
export const RestaurantDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // Booking Form State
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [partySize, setPartySize] = useState(2);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [specialRequests, setSpecialRequests] = useState('');
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    useEffect(() => {
        if (!id)
            return;
        const loadDetails = async () => {
            try {
                setLoading(true);
                const res = await restaurantApi.getRestaurantById(id);
                setRestaurant(res.data.restaurant);
            }
            catch (err) {
                setError(err.message || 'Failed to load restaurant details');
            }
            finally {
                setLoading(false);
            }
        };
        loadDetails();
    }, [id]);
    const handleFetchSlots = async () => {
        if (!id)
            return;
        try {
            setLoadingSlots(true);
            setBookingError('');
            setSelectedSlot(null);
            const res = await tableApi.getAvailableSlots(id, date, partySize);
            setAvailableSlots(res.data.slots);
            if (res.data.slots.length === 0) {
                setBookingError(res.data.message || 'No available slots for this date and party size.');
            }
        }
        catch (err) {
            setBookingError(err.message || 'Failed to check available slots');
        }
        finally {
            setLoadingSlots(false);
        }
    };
    useEffect(() => {
        if (restaurant) {
            handleFetchSlots();
        }
    }, [date, partySize, restaurant]);
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!id || !selectedSlot) {
            setBookingError('Please select an available time slot');
            return;
        }
        try {
            setBookingError('');
            const slotsRes = await tableApi.getAvailableSlots(id, date, partySize);
            const currentSlot = slotsRes.data.slots.find((slot) => slot.startTime === selectedSlot.startTime);
            if (!currentSlot?.tableId) {
                setBookingError('Slot no longer available.');
                return;
            }
            await reservationApi.createReservation({
                restaurantId: id,
                tableId: currentSlot.tableId,
                date,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime,
                partySize,
                specialRequests,
            });
            setBookingSuccess(true);
        }
        catch (err) {
            setBookingError(err.message || 'Failed to complete reservation booking');
        }
    };
    if (loading)
        return _jsx("div", { className: "text-center py-12 text-slate-500", children: "Loading details..." });
    if (error || !restaurant)
        return _jsx("div", { className: "p-4 max-w-xl mx-auto my-8 bg-red-50 text-red-700 rounded-lg border border-red-200", children: error || 'Restaurant not found' });
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8", children: [_jsx("div", { className: "h-64 sm:h-80 bg-slate-100 relative", children: _jsx("img", { src: restaurant.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', alt: restaurant.name, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-3xl font-extrabold text-slate-900 mb-2", children: restaurant.name }), _jsxs("div", { className: "flex flex-wrap gap-4 text-slate-600 text-sm mb-4", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { className: "w-4 h-4 text-orange-600" }), _jsxs("span", { children: [restaurant.address.street, ", ", restaurant.address.city, ", ", restaurant.address.state, " ", restaurant.address.zipCode] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Phone, { className: "w-4 h-4 text-orange-600" }), _jsx("span", { children: restaurant.phone })] })] }), _jsx("p", { className: "text-slate-700", children: restaurant.description })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit", children: [_jsxs("h2", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5 text-orange-600" }), "Operating Hours"] }), _jsx("div", { className: "space-y-2 text-sm", children: restaurant.operatingHours.map((schedule) => (_jsxs("div", { className: "flex justify-between py-1 border-b border-slate-100", children: [_jsx("span", { className: "font-medium text-slate-700", children: schedule.day }), _jsx("span", { className: schedule.isOpen ? 'text-slate-600' : 'text-red-500 font-medium', children: schedule.isOpen ? `${schedule.openTime} - ${schedule.closeTime}` : 'Closed' })] }, schedule.day))) })] }), _jsxs("div", { className: "lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm", children: [_jsx("h2", { className: "text-xl font-bold text-slate-900 mb-6", children: "Reserve a Table" }), bookingSuccess ? (_jsxs("div", { className: "p-6 bg-green-50 rounded-xl border border-green-200 text-center", children: [_jsx(CheckCircle2, { className: "w-12 h-12 text-green-600 mx-auto mb-3" }), _jsx("h3", { className: "text-xl font-bold text-green-900 mb-2", children: "Reservation Request Received!" }), _jsx("p", { className: "text-green-700 mb-6", children: "Your table booking is pending confirmation. You can view its live status on your customer dashboard." }), _jsx("button", { onClick: () => navigate('/customer/dashboard'), className: "px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer", children: "Go to My Reservations" })] })) : (_jsxs("form", { onSubmit: handleBookingSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-4 h-4 text-orange-600" }), "Reservation Date"] }), _jsx("input", { type: "date", required: true, value: date, min: new Date().toISOString().split('T')[0], onChange: (e) => setDate(e.target.value), className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5", children: [_jsx(Users, { className: "w-4 h-4 text-orange-600" }), "Number of Guests"] }), _jsx("select", { value: partySize, onChange: (e) => setPartySize(Number(e.target.value)), className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500", children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (_jsxs("option", { value: num, children: [num, " ", num === 1 ? 'Guest' : 'Guests'] }, num))) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Select Available Time Slot" }), loadingSlots ? (_jsx("div", { className: "text-sm text-slate-500 py-4", children: "Checking slot availability..." })) : availableSlots.length === 0 ? (_jsx("div", { className: "p-3 bg-slate-50 text-slate-600 text-sm rounded-lg border border-slate-200", children: bookingError || 'No available slots found for this date/guest count.' })) : (_jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-2", children: availableSlots.map((slot) => {
                                                    const isSelected = selectedSlot?.startTime === slot.startTime;
                                                    return (_jsx("button", { type: "button", onClick: () => setSelectedSlot(slot), className: `py-2 px-3 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${isSelected
                                                            ? 'bg-orange-600 text-white border-orange-600'
                                                            : 'bg-white text-slate-700 border-slate-300 hover:border-orange-500 hover:text-orange-600'}`, children: slot.startTime }, slot.startTime));
                                                }) }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Special Requests (Optional)" }), _jsx("textarea", { value: specialRequests, onChange: (e) => setSpecialRequests(e.target.value), placeholder: "Dietary requirements, high chair needed, window seating, etc.", rows: 3, className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" })] }), bookingError && availableSlots.length > 0 && (_jsx("div", { className: "p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200", children: bookingError })), _jsx("button", { type: "submit", disabled: !selectedSlot, className: "w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer", children: user ? 'Confirm Reservation' : 'Sign In to Book Table' })] }))] })] })] }));
};
