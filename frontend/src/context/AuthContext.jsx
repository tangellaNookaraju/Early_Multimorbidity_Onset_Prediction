import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL + '/me');
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + '/login', formData);
            const newToken = response.data.access_token;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            return true;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (fullName, email, password) => {
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + '/register', {
                full_name: fullName,
                email,
                password
            });
            const newToken = response.data.access_token;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            return true;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        setUser,
        token,
        loading,
        login,
        register,
        logout,
        fetchUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

