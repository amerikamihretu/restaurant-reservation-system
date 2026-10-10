/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin.api';
import { Users, Store, Calendar, ShieldAlert, UserCheck, UserX, Search } from 'lucide-react';
export const AdminAnalyticsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const loadData = async () => {
        try {
            setLoading(true);
            setError('');
            const [analyticsRes, usersRes] = await Promise.all([
                adminApi.getAnalytics(),
                adminApi.getUsers({ search: search.trim() || undefined }),
            ]);
            setAnalytics(analyticsRes.data);
            setUsers(usersRes.data.users);
        }
        catch (err) {
            setError(err.message || 'Failed to load administrative portal data');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData();
    }, []);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadData();
    };
    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        if (!window.confirm(`Are you sure you want to change ${user.name}'s status to ${newStatus}?`))
            return;
        try {
            setUpdatingId(user._id);
            await adminApi.updateUserStatus(user._id, newStatus);
            await loadData();
        }
        catch (err) {
            alert(err.message || 'Failed to update user status');
        }
        finally {
            setUpdatingId(null);
        }
    };
    if (loading)
        return _jsx("div", { className: "text-center py-12 text-slate-500", children: "Loading platform overview..." });
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8 space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900 mb-2", children: "Platform Control & Analytics" }), _jsx("p", { className: "text-slate-600", children: "Overview of system health, active user accounts, and booking metrics." })] }), error && _jsx("div", { className: "p-4 bg-red-50 text-red-700 rounded-lg border border-red-200", children: error }), analytics && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "p-2 bg-blue-50 text-blue-600 rounded-lg", children: _jsx(Users, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-slate-900", children: analytics.users.total }), _jsx("div", { className: "text-xs text-slate-500 uppercase font-semibold", children: "Total Accounts" })] })] }), _jsxs("div", { className: "text-xs space-y-1 text-slate-600 pt-3 border-t border-slate-100", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Customers:" }), _jsx("b", { children: analytics.users.byRole.CUSTOMER })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Restaurant Owners:" }), _jsx("b", { children: analytics.users.byRole.RESTAURANT_OWNER })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Admins:" }), _jsx("b", { children: analytics.users.byRole.ADMIN })] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "p-2 bg-orange-50 text-orange-600 rounded-lg", children: _jsx(Store, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-slate-900", children: analytics.restaurants.total }), _jsx("div", { className: "text-xs text-slate-500 uppercase font-semibold", children: "Registered Restaurants" })] })] }), _jsxs("div", { className: "text-xs space-y-1 text-slate-600 pt-3 border-t border-slate-100", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Approved:" }), _jsx("b", { className: "text-green-600", children: analytics.restaurants.byStatus.APPROVED })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Pending Review:" }), _jsx("b", { className: "text-amber-600", children: analytics.restaurants.byStatus.PENDING })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Rejected:" }), _jsx("b", { className: "text-red-600", children: analytics.restaurants.byStatus.REJECTED })] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "p-2 bg-green-50 text-green-600 rounded-lg", children: _jsx(Calendar, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-slate-900", children: analytics.reservations.total }), _jsx("div", { className: "text-xs text-slate-500 uppercase font-semibold", children: "Total Reservations" })] })] }), _jsxs("div", { className: "text-xs space-y-1 text-slate-600 pt-3 border-t border-slate-100", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Confirmed:" }), _jsx("b", { children: analytics.reservations.byStatus.CONFIRMED })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Completed:" }), _jsx("b", { children: analytics.reservations.byStatus.COMPLETED })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Cancelled:" }), _jsx("b", { className: "text-red-600", children: analytics.reservations.byStatus.CANCELLED })] })] })] })] })), _jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("h2", { className: "text-xl font-bold text-slate-900 flex items-center gap-2", children: [_jsx(ShieldAlert, { className: "w-5 h-5 text-orange-600" }), " User Account Moderation"] }), _jsxs("form", { onSubmit: handleSearchSubmit, className: "flex gap-2", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-2.5" }), _jsx("input", { type: "text", placeholder: "Search user name or email...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" })] }), _jsx("button", { type: "submit", className: "px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 cursor-pointer", children: "Search" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500", children: [_jsx("th", { className: "p-3", children: "User" }), _jsx("th", { className: "p-3", children: "Role" }), _jsx("th", { className: "p-3", children: "Status" }), _jsx("th", { className: "p-3", children: "Joined Date" }), _jsx("th", { className: "p-3 text-right", children: "Action" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-200 text-sm", children: users.map((u) => (_jsxs("tr", { className: "hover:bg-slate-50", children: [_jsxs("td", { className: "p-3", children: [_jsx("div", { className: "font-bold text-slate-900", children: u.name }), _jsx("div", { className: "text-xs text-slate-500", children: u.email })] }), _jsx("td", { className: "p-3", children: _jsx("span", { className: "text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800", children: u.role }) }), _jsx("td", { className: "p-3", children: _jsxs("span", { className: `inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: [u.status === 'ACTIVE' ? _jsx(UserCheck, { className: "w-3 h-3" }) : _jsx(UserX, { className: "w-3 h-3" }), u.status] }) }), _jsx("td", { className: "p-3 text-xs text-slate-500", children: new Date(u.createdAt).toLocaleDateString() }), _jsx("td", { className: "p-3 text-right", children: _jsx("button", { onClick: () => handleToggleStatus(u), disabled: updatingId === u._id, className: `px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${u.status === 'ACTIVE'
                                                        ? 'border border-red-300 text-red-600 hover:bg-red-50'
                                                        : 'bg-green-600 hover:bg-green-700 text-white'}`, children: updatingId === u._id ? 'Updating...' : u.status === 'ACTIVE' ? 'Suspend' : 'Reactivate' }) })] }, u._id))) })] }) })] })] }));
};
