import { jsx as _jsx } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { loginApi, registerApi, logoutApi, currentUserApi, refreshApi } from '../api/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const restore = async () => {
            try {
                let response;
                try { response = await currentUserApi(); }
                catch (error) {
                    if (error.status !== 401) throw error;
                    await refreshApi();
                    response = await currentUserApi();
                }
                setUser(response.data.user);
            } catch { setUser(null); }
            finally { setIsLoading(false); }
        };
        restore();
    }, []);
    const login = async (credentials) => {
        const nextUser = (await loginApi(credentials)).data.user;
        setUser(nextUser);
        return nextUser;
    };
    const register = async (data) => {
        const nextUser = (await registerApi(data)).data.user;
        setUser(nextUser);
        return nextUser;
    };
    const logout = async () => { try { await logoutApi(); } finally { setUser(null); } };
    return _jsx(AuthContext.Provider, { value: { user, isLoading, login, register, logout }, children });
};
