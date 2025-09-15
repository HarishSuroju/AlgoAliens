// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // token from email link
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
            // Call your backend API
            const response = await axios.post(
                "/api/auth/reset-password",
                { password },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(response.data.message || "Password reset successful!");
            setTimeout(() => {
                navigate("/login"); // redirect to login after success
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message || "Something went wrong. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
                )}
                {success && (
                    <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">New Password</label>
                        <input
                            type="password"
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
