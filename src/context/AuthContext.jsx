import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('admin_token') || null);

    const login = (newToken) => {
        localStorage.setItem('admin_token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        setToken(null);
    };

    const getAuthHeaders = () => {
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, getAuthHeaders }}>
            {children}
        </AuthContext.Provider>
    );
};
