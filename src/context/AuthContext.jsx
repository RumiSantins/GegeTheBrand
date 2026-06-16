import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const savedToken = sessionStorage.getItem('admin_token');
        if (savedToken) {
            try {
                const payload = JSON.parse(atob(savedToken.split('.')[1]));
                // Check if token is expired
                if (payload.exp * 1000 < Date.now()) {
                    sessionStorage.removeItem('admin_token');
                    return null;
                }
                return savedToken;
            } catch (e) {
                sessionStorage.removeItem('admin_token');
                return null;
            }
        }
        return null;
    });

    const logout = useCallback(() => {
        sessionStorage.removeItem('admin_token');
        setToken(null);
    }, []);

    const login = (newToken) => {
        sessionStorage.setItem('admin_token', newToken);
        setToken(newToken);
    };

    const getAuthHeaders = () => {
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    // Global fetch interceptor for 401
    useEffect(() => {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            if (response.status === 401) {
                const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
                if (!url.includes('/login')) {
                    // Token expired or invalid
                    logout();
                }
            }
            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [logout]);

    // Inactivity timeout
    const inactivityTimerRef = useRef(null);

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        // If there's a token, set a 30-minute timer
        if (token) {
            inactivityTimerRef.current = setTimeout(() => {
                logout();
            }, 30 * 60 * 1000); // 30 minutes
        }
    }, [token, logout]);

    useEffect(() => {
        resetInactivityTimer();

        if (token) {
            const events = ['mousemove', 'keydown', 'click', 'scroll'];
            const handleActivity = () => resetInactivityTimer();
            
            events.forEach(event => {
                window.addEventListener(event, handleActivity);
            });

            return () => {
                events.forEach(event => {
                    window.removeEventListener(event, handleActivity);
                });
                if (inactivityTimerRef.current) {
                    clearTimeout(inactivityTimerRef.current);
                }
            };
        }
    }, [token, resetInactivityTimer]);

    return (
        <AuthContext.Provider value={{ token, login, logout, getAuthHeaders }}>
            {children}
        </AuthContext.Provider>
    );
};
