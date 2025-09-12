/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Logo from "../assets/logo.ico";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reset password
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const { login, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/onboarding";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      if (data.needsOnboarding) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      setError(
        console.log(err, " :Error: ", err.response?.data?.message),
        err.response?.data?.message ||
          "Failed to log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage("");
    try {
      await requestPasswordReset(resetEmail);
      setResetMessage(
        "📩 If this email exists, a reset link has been sent. Please check your inbox."
      );
    } catch (err) {
      setResetMessage("⚠️ Failed to send reset email. Try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
      >
        {/* Logo + Heading */}
        <div className="text-center">
          <img
            src={Logo}
            alt="AlgoAliens Logo"
            className="mx-auto h-14 w-14 mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500">
            New here?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-center p-3 bg-red-100 text-red-600 rounded mt-4">
            {error}
          </p>
        )}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
          />

          {/* Password with eye toggle */}
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2 rounded text-blue-600" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Launching..." : "Sign In"}
          </Button>
        </form>

        {/* Reset Password Card */}
        {showReset && (
          <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Reset Password
            </h3>
            <form onSubmit={handleResetPassword} className="space-y-3">
              <Input
                name="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your registered email"
              />
              <Button type="submit" fullWidth>
                Send Reset Link
              </Button>
            </form>
            {resetMessage && (
              <p className="mt-3 text-sm text-gray-600">{resetMessage}</p>
            )}
            <button
              onClick={() => setShowReset(false)}
              className="mt-3 text-xs text-gray-500 hover:underline"
            >
              ✖ Close
            </button>
          </div>
        )}
      </Motion.div>
    </div>
  );
};

export default LoginPage;
