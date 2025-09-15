import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import axios from "axios";

export default function SignUpForm({ onSignUpSuccess, onSwitchToLogin, openModal }) {
    const { setIsAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [stage, setStage] = useState('initial_form');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const API_BASE = "http://localhost:4000";

    const getPasswordStrength = (pwd) => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;

        if (strength === 5 && pwd.length >= 12) return 'Very Strong';
        if (strength >= 4 && pwd.length >= 10) return 'Strong';
        if (strength >= 2 && pwd.length >= 8) return 'Moderate';
        if (pwd.length > 0) return 'Weak';
        return '';
    };

    const getPasswordStrengthColor = (strength) => {
        switch (strength) {
            case 'Weak': return 'text-red-500';
            case 'Moderate': return 'text-yellow-500';
            case 'Strong': return 'text-green-500';
            case 'Very Strong': return 'text-green-700';
            default: return 'text-gray-500';
        }
    };

    const handleSendOtp = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch(`${API_BASE}/otp/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, phone }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to send OTP");
            }

            const data = await res.json();
            setOtpSent(true);
            setResendTimer(60);
            setMessage({ type: "success", text: data.message });

        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            return setMessage({ type: "error", text: "Please enter a valid 6-digit OTP." });
        }

        const passwordStrength = getPasswordStrength(password);
        if (passwordStrength === "Weak") {
            return setMessage({ type: "error", text: "Please create a stronger password." });
        }
        if (password !== confirmPassword) {
            return setMessage({ type: "error", text: "Passwords do not match." });
        }

        setLoading(true);
        setMessage({ type: "info", text: "Verifying OTP and creating account..." });

        try {
            const verifyResp = await fetch(`${API_BASE}/otp/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const verifyData = await verifyResp.json();
            if (!verifyResp.ok || !verifyData.verified || !verifyData.token) {
                throw new Error(verifyData.message || "OTP verification failed");
            }

            const token = verifyData.token;

            const signResp = await fetch(`${API_BASE}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName, middleName, lastName, dob, gender, address, email, password, token,
                }),
            });
            const signData = await signResp.json();
            if (!signResp.ok) {
                throw new Error(signData.message || "Signup failed");
            }

            setMessage({ type: "success", text: "Account created successfully! Redirecting to onboarding..." });
            
            // Store the token and update authentication state
            if (signData.token) {
                localStorage.setItem("token", signData.token);
                setIsAuthenticated(true);
            }
            
            // Call the onSignUpSuccess callback first
            onSignUpSuccess({ 
                email: email, 
                username: `${firstName} ${lastName}`,
                firstName,
                lastName
            });
            
            // Add delay for success message visibility, then navigate
            setTimeout(() => {
                navigate("/onboarding", { replace: true });
            }, 1500);
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let timerId;
        if (otpSent && resendTimer > 0) {
            timerId = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        } else if (resendTimer === 0 && otpSent) {
            setMessage({ type: 'info', text: 'You can now resend the OTP if needed.' });
        }
        return () => clearInterval(timerId);
    }, [otpSent, resendTimer]);

    const SocialLoginIcon = ({ icon, onClick }) => (
        <button
            onClick={onClick}
            className="flex items-center justify-center p-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 ease-in-out"
        >
            {icon}
        </button>
    );

    const GoogleIcon = () => (
        <img
            src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
            alt="Google Logo"
            className="h-5 w-5"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/20x20/cccccc/ffffff?text=G"; }}
        />
    );

    const GitHubIcon = () => (
        <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            className="h-5 w-5"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/20x20/cccccc/ffffff?text=GH"; }}
        />
    );

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                setMessage({ type: 'info', text: 'Processing Google signup...' });
                
                // Fetch user profile from Google
                const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });
                
                if (!profileResponse.ok) {
                    throw new Error('Failed to fetch Google profile');
                }
                
                const userProfile = await profileResponse.json();
                
                // Send Google user data to backend for signup/storage
                const backendResponse = await fetch('http://localhost:4000/auth/google/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userProfile.email,
                        username: userProfile.name,
                        googleId: userProfile.id,
                        picture: userProfile.picture,
                        accessToken: tokenResponse.access_token
                    }),
                });
                
                const backendData = await backendResponse.json();
                
                if (!backendResponse.ok) {
                    throw new Error(backendData.message || 'Google signup failed');
                }
                
                // Store the token and update authentication state
                localStorage.setItem("token", backendData.token);
                setIsAuthenticated(true);
                
                setMessage({ type: 'success', text: 'Google signup successful! Redirecting to onboarding...' });
                openModal("Google Signup Success", `Welcome ${userProfile.name}! Redirecting to onboarding...`);
                
                // Call the onSignUpSuccess callback first
                onSignUpSuccess({ 
                    email: userProfile.email, 
                    username: userProfile.name,
                    firstName: userProfile.given_name || userProfile.name.split(' ')[0],
                    lastName: userProfile.family_name || userProfile.name.split(' ')[1] || ''
                });
                
                // Use setTimeout to allow modal to show briefly before navigation
                setTimeout(() => {
                    navigate("/onboarding", { replace: true });
                }, 1500);
                
            } catch (error) {
                console.error('Google signup error:', error);
                setMessage({ type: 'error', text: error.message || 'Google signup failed' });
                openModal("Google Signup Failed", "Something went wrong with Google signup.");
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            openModal("Google Signup Failed", "Something went wrong with Google signup.");
        },
    });

    const handleGitHubLogin = () => {
        const clientId = "Iv23liy7qUdzBK9ZWk3a";
        const redirectUri = "http://localhost:5173/auth/github/callback"; // Match GitHub App callback URL
        const scope = "user:email";
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=signup`;
    };

    const handleVerifyOtp = () => { /* no-op as handleSignUp handles verification */ };


    return (
        <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 font-['Inter'] overflow-x-hidden">
        <div className="mx-auto bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl p-6 sm:p-8 md:p-10 border border-gray-200">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                    Create Your Account
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                    To Unlock knowledge. Master skills. Build your future.
                </p>
            </div>

            {message.text && (
                <div
                    className={`p-3 rounded-md mb-6 text-sm ${
                        message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
                            message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
                                'bg-[#E6FFFA] text-[#4eb3c1] border border-[#B2F5EA]'
                    } flex items-center`}
                >
                    {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 mr-2" /> : null}
                    {message.type === 'error' ? <span className="mr-2 font-bold text-lg">!</span> : null}
                    {message.type === 'info' ? <span className="mr-2 font-bold text-lg">i</span> : null}
                    <span>{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSignUp}>
                {stage === 'initial_form' && (
                    <div className="mb-6">
                        <div className="mb-4">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                                    placeholder="First Name *"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    disabled={loading || otpSent}
                                />
                                <input
                                    id="middleName"
                                    name="middleName"
                                    type="text"
                                    autoComplete="additional-name"
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                                    placeholder="Middle Name (Optional)"
                                    value={middleName}
                                    onChange={(e) => setMiddleName(e.target.value)}
                                    disabled={loading || otpSent}
                                />
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                                    placeholder="Last Name *"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    disabled={loading || otpSent}
                                />
                            </div>
                        </div>

                        <div className="mb-6 flex flex-col sm:flex-row gap-3">
                            <div className="w-full sm:w-1/2">
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth
                                </label>
                                <input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    autoComplete="bday"
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    disabled={loading || otpSent}
                                />
                            </div>
                            <div className="w-full sm:w-1/2">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    disabled={loading || otpSent}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                rows="3"
                                autoComplete="street-address"
                                required
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                                placeholder="Enter your full address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                disabled={loading || otpSent}
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                                placeholder="+91 9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={loading || otpSent}
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading || otpSent}
                                />
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#480360] hover:bg-[#a14097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading || otpSent}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        'Verify'
                                    )}
                                </button>
                            </div>
                        </div>

                        {otpSent && (
                            <div className="mb-6">
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Code (OTP)
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]{6}"
                                    maxLength="6"
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white text-center tracking-widest"
                                    placeholder="XXXXXX"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    disabled={loading}
                                />
                                <p className="mt-2 text-xs text-gray-500 text-center">
                                    A 6-digit code has been sent to {email}.
                                </p>
                                <div className="mt-4 text-center">
                                    {resendTimer > 0 ? (
                                        <p className="text-sm text-gray-600">Resend in {resendTimer}s</p>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            className="text-[#a14097] hover:text-[#480360] text-sm font-medium transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading}
                                        >
                                            Resend Code
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#480360] focus:border-[#480360] sm:text-sm"
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <p className={`mt-1 text-xs ${getPasswordStrengthColor(getPasswordStrength(password))}`}>
                                Password Strength: {getPasswordStrength(password)}
                            </p>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#480360] focus:border-[#480360] sm:text-sm"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#480360] hover:bg-[#a14097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !otpSent}
                        >
                            {loading && otpSent ? (
                                <Loader2 className="animate-spin h-5 w-5 mr-3" />
                            ) : (
                                'Sign Up'
                            )}
                        </button>

                        {stage !== 'success' && (
                            <>
                                <div className="relative flex items-center my-8">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>
                                <p className="text-center text-gray-600 text-sm mb-4">Continue with social accounts:</p>
                                <div className="flex justify-center space-x-4 mb-8">
                                    <SocialLoginIcon
                                        icon={<GoogleIcon />}
                                        onClick={() => googleLogin()}
                                    />
                                    <SocialLoginIcon
                                        icon={<GitHubIcon />}
                                        onClick={handleGitHubLogin}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </form>

            {stage === 'success' && (
                <div className="text-center py-10">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
                    <p className="text-gray-600">Your account has been successfully created. You can now log in!</p>
                    <button
                        onClick={() => openModal('Redirecting', 'You clicked to go to the login page. (This would normally redirect you)')}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#480360] hover:bg-[#a14097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360]"
                    >
                        Go to Login
                    </button>
                </div>
            )}

            {stage !== 'success' && (
                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a
                        href=""
                        onClick={(e) => {
                            e.preventDefault();
                            onSwitchToLogin();
                        }}
                        className="font-medium text-[#480360] hover:text-[#a14097] transition-colors duration-200 ease-in-out"
                    >
                        Sign in
                    </a>
                </p>
            )}
        </div>
        </div>
    );
}