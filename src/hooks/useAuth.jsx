// src/hooks/useAuth.jsx
import { useState, useEffect, useContext, createContext } from "react";

// Simple Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Example: check token from localStorage
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
