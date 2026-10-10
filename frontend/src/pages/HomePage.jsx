import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
export const HomePage = () => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[80vh] px-4 text-center", children: [_jsx("div", { className: "p-4 bg-orange-100 rounded-full text-orange-600 mb-6", children: _jsx(UtensilsCrossed, { className: "w-12 h-12" }) }), _jsxs("h1", { className: "text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 text-slate-900", children: ["Welcome to ", _jsx("span", { className: "text-orange-600", children: "RestoReserve" })] }), _jsx("p", { className: "max-w-xl text-lg text-slate-600 mb-8", children: "Discover exceptional dining experiences, explore menus, and reserve your tables in real time seamlessly." }), _jsx("div", { className: "flex gap-4", children: _jsx(Link, { to: "/restaurants", className: "px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg shadow-sm transition-colors", children: "Browse Restaurants" }) })] }));
};
