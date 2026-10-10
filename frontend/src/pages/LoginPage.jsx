import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../api/client';
export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const user = await login({ email, password });
            navigate(user.role === 'CUSTOMER' ? '/customer/dashboard' : user.role === 'RESTAURANT_OWNER' ? '/owner/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/');
        }
        catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            }
            else {
                setError('An unexpected error occurred during login.');
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "max-w-md mx-auto my-12 p-6 bg-white rounded-xl shadow-sm border border-slate-200", children: [_jsx("h2", { className: "text-2xl font-bold text-slate-900 mb-6 text-center", children: "Sign In to RestoReserve" }), error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Email Address" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500", placeholder: "you@example.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Password" }), _jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer", children: isSubmitting ? 'Signing in...' : 'Sign In' })] }), _jsxs("p", { className: "mt-4 text-center text-sm text-slate-600", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "text-orange-600 font-medium hover:underline", children: "Register" })] })] }));
};
