import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Logo from "../assets/logo.ico";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    gender: "",
    dob: ""
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // step1 = form, step2 = OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { signup, verifyOtp, signInWithGoogle, signInWithGithub, signInWithMicrosoft } = useAuth();
  const navigate = useNavigate();

  // Social login handlers
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGithub();
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "GitHub sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithMicrosoft();
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "Microsoft sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting formData:", formData);
      await signup(formData); // send OTP
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(formData.email, otp);
      setOtpVerified(true);
      setTimeout(() => navigate("/onboarding"), 1000);
    } catch (err) {
      setOtpVerified(false);
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 1 ? "Join the AlgoAliens Fleet" : "Verify OTP"}
          </h2>
          {step === 1 && (
            <p className="mt-2 text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          )}
        </div>

        {error && (
          <p className="text-center p-3 bg-red-100 text-red-600 rounded mt-4">
            {error}
          </p>
        )}

        {/* Step 1: Form */}
        {step === 1 ? (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Name fields inline */}
            <div className="grid grid-cols-3 gap-3">
              <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
              <Input name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" required={false} />
              <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
            </div>

            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
            <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
            <Input name="dob" type="date" value={formData.dob} onChange={handleChange} placeholder="Date of Birth" />
            
            {/* Password with eye */}
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

            {/* Confirm Password with eye */}
            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm((prev) => !prev)}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <Input name="address" type="text" value={formData.address} onChange={handleChange} placeholder="Address" />

            <div className="flex items-center space-x-2">
              <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600" />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Processing..." : "Sign Up"}
            </Button>

            {/* Social Logins */}
            <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition"
            >
              <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition"
            >
              <FaGithub className="w-5 h-5 mr-2 text-gray-900" />
              Continue with GitHub
            </button>

            <button
              type="button"
              onClick={handleMicrosoftLogin}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition"
            >
              <FaMicrosoft className="w-5 h-5 mr-2 text-blue-600" />
              Continue with Microsoft
            </button>
            </div>
          </form>
        ) : (
          // Step 2: OTP
          <form className="mt-6 space-y-4" onSubmit={handleOtpVerify}>
            <Input
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
            />
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            {/* Verification Feedback */}
            {otpVerified && (
              <p className="flex items-center justify-center gap-2 text-green-600 mt-3">
                <CheckCircle size={18} /> OTP Verified
              </p>
            )}
            {otpVerified === false && error && (
              <p className="flex items-center justify-center gap-2 text-red-600 mt-3">
                <XCircle size={18} /> Verification Failed
              </p>
            )}
          </form>
        )}
      </Motion.div>
    </div>
  );
};

export default SignupPage;
