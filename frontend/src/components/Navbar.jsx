import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UtensilsCrossed, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-slate-200 py-3 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-orange-600">
                    <UtensilsCrossed className="w-6 h-6" />
                    <span>RestoReserve</span>
                </Link>
                <nav className="flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === 'CUSTOMER' && <Link to="/customer/dashboard" className="text-sm text-slate-600">My bookings</Link>}
                            {user.role === 'RESTAURANT_OWNER' && (
                                <>
                                    <Link to="/owner/dashboard" className="text-sm text-slate-600">Restaurant</Link>
                                    <Link to="/owner/tables" className="text-sm text-slate-600">Tables</Link>
                                    <Link to="/owner/reservations" className="text-sm text-slate-600">Bookings</Link>
                                </>
                            )}
                            {user.role === 'ADMIN' && (
                                <>
                                    <Link to="/admin/dashboard" className="text-sm text-slate-600">Approvals</Link>
                                    <Link to="/admin/analytics" className="text-sm text-slate-600">Analytics</Link>
                                </>
                            )}
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <UserIcon className="w-4 h-4 text-slate-500" />
                                <span className="font-medium">{user.name}</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-semibold">{user.role}</span>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-red-600">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-slate-600">Sign In</Link>
                            <Link to="/register" className="px-3.5 py-1.5 text-sm font-medium bg-orange-600 text-white rounded-lg">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};
