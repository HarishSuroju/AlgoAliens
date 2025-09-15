// src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const { token } = useParams(); // token from URL params
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:4000/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong. Try again.");
            }

            setSuccess(data.message || "Password reset successful!");
            setTimeout(() => {
                navigate("/login"); // redirect to login after success
            }, 2000);
        } catch (err) {
            setError(err.message || "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 font-['Inter'] overflow-x-hidden">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg p-6 sm:p-8 border border-gray-200 mx-auto">
                {/* Back to Login Button */}
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center text-[#480360] hover:text-[#a14097] mb-6 transition-colors duration-200"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                </button>

                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-[#480360] p-3 rounded-full">
                            <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-600 text-base">
                        Enter your new password below.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-200 flex items-center">
                        <span className="mr-2 font-bold text-lg">!</span>
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 text-green-700 p-3 mb-4 rounded border border-green-200 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#480360] hover:bg-[#a14097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    Remember your password?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="font-medium text-[#480360] hover:text-[#a14097] transition-colors duration-200 ease-in-out"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
