/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Logo from "../assets/logo.ico"; // same logo as signup/login
import { Eye, EyeOff } from "lucide-react";

const ResetPasswordPage = () => {
  const { token } = useParams(); // /reset-password/:token
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("⚠️ Passwords do not match.");
      return;
    }
    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setMessage("✅ Password reset successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("⚠️ Failed to reset password.");
      }
    } catch (err) {
      setMessage("❌ Error resetting password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8"
      >
        <div className="text-center">
          <img src={Logo} alt="AlgoAliens Logo" className="mx-auto h-14 w-14 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your new password below.
          </p>
        </div>

        {message && (
          <p className="text-center p-3 bg-gray-100 text-gray-700 rounded mt-4">
            {message}
          </p>
        )}

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          {/* New Password */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <Button type="submit" fullWidth>
            Reset Password
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </Motion.div>
    </div>
  );
};

export default ResetPasswordPage;
