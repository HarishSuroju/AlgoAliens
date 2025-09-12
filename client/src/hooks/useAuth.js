import { useState, useEffect } from "react";
import api from "../services/api";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const signup = async (formData) => {
    const res = await api.post("/auth/register", formData);
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await api.post("/auth/verify-otp", { email, otp });
    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setIsAuthenticated(true);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const requestPasswordReset = async (email) => {
    const res = await api.post("/auth/request-reset", { email });
    return res.data;
  };

  return { signup, verifyOtp, login, logout, requestPasswordReset, isAuthenticated, loading };
};
