import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data.data);
                } catch (err) {
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            const meRes = await api.get('/auth/me');
            setUser(meRes.data.data);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            return { success: false, error: err.response?.data?.error };
        }
    };

    const register = async (name, email, password) => {
        try {
            setError(null);
            const { data } = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            const meRes = await api.get('/auth/me');
            setUser(meRes.data.data);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            return { success: false, error: err.response?.data?.error };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, error, api }}>
            {children}
        </AuthContext.Provider>
    );
};
