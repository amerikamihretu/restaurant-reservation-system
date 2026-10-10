import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { restaurantApi, } from '../api/restaurant.api';
const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];
const DEFAULT_HOURS = DAYS.map((day) => ({
    day,
    openTime: '09:00',
    closeTime: '22:00',
    isOpen: true,
}));
const getErrorMessage = (error, fallback) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string') {
        return error.message;
    }
    return fallback;
};
export const OwnerDashboard = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cuisineStr, setCuisineStr] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [stateVal, setStateVal] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [hours, setHours] = useState(DEFAULT_HOURS);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await restaurantApi.getMyRestaurant();
                const rest = response.data.restaurant;
                setRestaurant(rest);
                setName(rest.name);
                setDescription(rest.description);
                setCuisineStr(rest.cuisine.join(', '));
                setStreet(rest.address.street);
                setCity(rest.address.city);
                setStateVal(rest.address.state);
                setZipCode(rest.address.zipCode);
                setPhone(rest.phone);
                setCoverImage(rest.coverImage ?? '');
                setHours(rest.operatingHours.length > 0
                    ? rest.operatingHours
                    : DEFAULT_HOURS);
            }
            catch (error) {
                const status = typeof error === 'object' &&
                    error !== null &&
                    'status' in error &&
                    typeof error.status === 'number'
                    ? error.status
                    : undefined;
                if (status !== 404) {
                    setError(getErrorMessage(error, 'Failed to load restaurant profile'));
                }
            }
            finally {
                setLoading(false);
            }
        };
        void fetchProfile();
    }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setMessage(null);
        const payload = {
            name,
            description,
            cuisine: cuisineStr
                .split(',')
                .map((cuisine) => cuisine.trim())
                .filter(Boolean),
            address: {
                street,
                city,
                state: stateVal,
                zipCode,
            },
            phone,
            operatingHours: hours,
            coverImage: coverImage.trim() || undefined,
        };
        try {
            if (restaurant) {
                const response = await restaurantApi.updateMyRestaurant(payload);
                setMessage(response.message || 'Profile updated successfully');
                setRestaurant(response.data.restaurant);
            }
            else {
                const response = await restaurantApi.createRestaurant(payload);
                setMessage(response.message || 'Profile submitted for approval');
                setRestaurant(response.data.restaurant);
            }
        }
        catch (error) {
            setError(getErrorMessage(error, 'Failed to save restaurant details'));
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex min-h-[60vh] items-center justify-center bg-slate-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" }), _jsx("p", { className: "text-sm font-medium text-slate-600", children: "Loading restaurant profile..." })] }) }));
    }
    const statusStyles = {
        PENDING: {
            container: 'border-amber-200 bg-amber-50',
            badge: 'bg-amber-100 text-amber-700',
            title: 'Under Review',
        },
        APPROVED: {
            container: 'border-emerald-200 bg-emerald-50',
            badge: 'bg-emerald-100 text-emerald-700',
            title: 'Approved',
        },
        REJECTED: {
            container: 'border-red-200 bg-red-50',
            badge: 'bg-red-100 text-red-700',
            title: 'Rejected',
        },
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-5xl", children: [_jsxs("div", { className: "mb-8", children: [_jsx("p", { className: "mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600", children: "Owner Dashboard" }), _jsx("h1", { className: "text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl", children: "Restaurant Profile" }), _jsx("p", { className: "mt-2 max-w-2xl text-sm text-slate-500 sm:text-base", children: "Manage your restaurant information and keep your profile up to date." })] }), restaurant && (_jsxs("div", { className: `mb-6 rounded-2xl border p-5 ${statusStyles[restaurant.approvalStatus].container}`, children: [_jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-slate-500", children: "Restaurant approval status" }), _jsx("h2", { className: "mt-1 text-lg font-bold text-slate-900", children: statusStyles[restaurant.approvalStatus].title })] }), _jsx("span", { className: `inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${statusStyles[restaurant.approvalStatus].badge}`, children: restaurant.approvalStatus })] }), restaurant.approvalStatus === 'PENDING' && (_jsx("p", { className: "mt-4 border-t border-amber-200 pt-4 text-sm text-amber-800", children: "Your restaurant profile has been submitted and is currently waiting for administrator approval." })), restaurant.approvalStatus === 'REJECTED' && (_jsxs("p", { className: "mt-4 border-t border-red-200 pt-4 text-sm text-red-800", children: [_jsx("span", { className: "font-semibold", children: "Rejection reason:" }), ' ', restaurant.rejectionReason ||
                                    'No reason was provided.'] })), restaurant.approvalStatus === 'APPROVED' && (_jsx("p", { className: "mt-4 border-t border-emerald-200 pt-4 text-sm text-emerald-800", children: "Your restaurant is approved and publicly listed." }))] })), error && (_jsx("div", { className: "mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700", children: error })), message && (_jsx("div", { className: "mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700", children: message })), _jsxs("div", { className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", children: [_jsxs("div", { className: "border-b border-slate-200 px-6 py-5 sm:px-8", children: [_jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Restaurant Information" }), _jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Enter the information customers will see about your restaurant." })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "border-b border-slate-200 px-6 py-6 sm:px-8", children: [_jsx("h3", { className: "mb-5 text-sm font-bold uppercase tracking-wide text-slate-500", children: "Basic Information" }), _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "restaurant-name", className: "mb-2 block text-sm font-semibold text-slate-700", children: "Restaurant Name" }), _jsx("input", { id: "restaurant-name", type: "text", value: name, onChange: (event) => setName(event.target.value), required: true, placeholder: "e.g. Habesha Restaurant", className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "restaurant-description", className: "mb-2 block text-sm font-semibold text-slate-700", children: "Description" }), _jsx("textarea", { id: "restaurant-description", value: description, onChange: (event) => setDescription(event.target.value), required: true, rows: 4, placeholder: "Tell customers about your restaurant...", className: "w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "restaurant-cuisines", className: "mb-2 block text-sm font-semibold text-slate-700", children: "Cuisines" }), _jsx("input", { id: "restaurant-cuisines", type: "text", placeholder: "Ethiopian, Italian, Pizza", value: cuisineStr, onChange: (event) => setCuisineStr(event.target.value), required: true, className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" }), _jsx("p", { className: "mt-2 text-xs text-slate-400", children: "Separate multiple cuisines with commas." })] })] })] }), _jsxs("div", { className: "border-b border-slate-200 px-6 py-6 sm:px-8", children: [_jsx("h3", { className: "mb-5 text-sm font-bold uppercase tracking-wide text-slate-500", children: "Location" }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsxs("div", { className: "sm:col-span-2", children: [_jsx("label", { htmlFor: "street", className: "mb-2 block text-sm font-semibold text-slate-700", children: "Street Address" }), _jsx("input", { id: "street", type: "text", value: street, onChange: (event) => setStreet(event.target.value), required: true, placeholder: "Street address", className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "city", className: "mb-2 block text-sm font-semibold text-slate-700", children: "City" }), _jsx("input", { id: "city", type: "text", value: city, onChange: (event) => setCity(event.target.value), required: true, placeholder: "Addis Ababa", className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "state", className: "mb-2 block text-sm font-semibold text-slate-700", children: "State / Region" }), _jsx("input", { id: "state", type: "text", value: stateVal, onChange: (event) => setStateVal(event.target.value), required: true, placeholder: "Region", className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "zip-code", className: "mb-2 block text-sm font-semibold text-slate-700", children: "Zip Code" }), _jsx("input", { id: "zip-code", type: "text", value: zipCode, onChange: (event) => setZipCode(event.target.value), required: true, placeholder: "Zip code", className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "phone", className: "mb-2 block text-sm font-semibold text-slate-700", children: "Phone Number" }), _jsx("input", { id: "phone", type: "tel", value: phone, onChange: (event) => setPhone(event.target.value), required: true, placeholder: "+251...", className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" })] })] })] }), _jsxs("div", { className: "border-b border-slate-200 px-6 py-6 sm:px-8", children: [_jsx("h3", { className: "mb-5 text-sm font-bold uppercase tracking-wide text-slate-500", children: "Restaurant Image" }), _jsx("label", { htmlFor: "cover-image", className: "mb-2 block text-sm font-semibold text-slate-700", children: "Cover Image URL" }), _jsx("input", { id: "cover-image", type: "url", value: coverImage, onChange: (event) => setCoverImage(event.target.value), placeholder: "https://example.com/restaurant.jpg", className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" }), _jsx("p", { className: "mt-2 text-xs text-slate-400", children: "Optional. You can add a restaurant image URL." })] }), _jsxs("div", { className: "flex flex-col gap-3 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8", children: [_jsx("p", { className: "text-xs text-slate-500", children: "Make sure your information is accurate before saving." }), _jsx("button", { type: "submit", disabled: saving, className: "rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60", children: saving
                                                ? 'Saving...'
                                                : restaurant
                                                    ? 'Save Changes'
                                                    : 'Submit Restaurant' })] })] })] })] }) }));
};
