import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: _jsx("div", { className: "w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
