/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { restaurantApi } from '../api/restaurant.api';
import { Search, MapPin, Utensils } from 'lucide-react';
export const RestaurantCatalogPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [cuisine, setCuisine] = useState('');
    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            setError('');
            const params = {};
            if (search.trim())
                params.search = search.trim();
            if (cuisine.trim())
                params.cuisine = cuisine.trim();
            const response = await restaurantApi.getApprovedRestaurants(params);
            setRestaurants(response.data.restaurants);
        }
        catch (err) {
            setError(err.message || 'Failed to load restaurants');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRestaurants();
    }, []);
    const handleSearch = (e) => {
        e.preventDefault();
        fetchRestaurants();
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900 mb-2", children: "Discover & Reserve Tables" }), _jsx("p", { className: "text-slate-600", children: "Explore top-rated restaurants and instantly reserve your table." })] }), _jsxs("form", { onSubmit: handleSearch, className: "flex flex-col sm:flex-row gap-3 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "w-5 h-5 text-slate-400 absolute left-3 top-2.5" }), _jsx("input", { type: "text", placeholder: "Search by restaurant name or keyword...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" })] }), _jsxs("div", { className: "w-full sm:w-48 relative", children: [_jsx(Utensils, { className: "w-5 h-5 text-slate-400 absolute left-3 top-2.5" }), _jsx("input", { type: "text", placeholder: "Filter cuisine...", value: cuisine, onChange: (e) => setCuisine(e.target.value), className: "w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" })] }), _jsx("button", { type: "submit", className: "px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer", children: "Search" })] }), error && _jsx("div", { className: "p-4 mb-6 bg-red-50 text-red-700 rounded-lg border border-red-200", children: error }), loading ? (_jsx("div", { className: "text-center py-12 text-slate-500", children: "Searching available dining spots..." })) : restaurants.length === 0 ? (_jsx("div", { className: "text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500", children: "No approved restaurants found matching your criteria." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: restaurants.map((restaurant) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col", children: [_jsx("div", { className: "h-48 bg-slate-100 relative", children: _jsx("img", { src: restaurant.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', alt: restaurant.name, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "p-5 flex-1 flex flex-col justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-slate-900 mb-1", children: restaurant.name }), _jsxs("div", { className: "flex items-center gap-1 text-sm text-slate-500 mb-3", children: [_jsx(MapPin, { className: "w-4 h-4 text-orange-600" }), _jsxs("span", { children: [restaurant.address.city, ", ", restaurant.address.state] })] }), _jsx("div", { className: "flex flex-wrap gap-1.5 mb-4", children: restaurant.cuisine.map((c) => (_jsx("span", { className: "text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full font-medium", children: c }, c))) })] }), _jsx(Link, { to: `/restaurants/${restaurant._id}`, className: "block w-full text-center py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors", children: "View Details & Reserve" })] })] }, restaurant._id))) }))] }));
};
