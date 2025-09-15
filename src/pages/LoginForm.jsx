import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth.jsx';
import axios from 'axios';

export default function LoginForm({ openModal }) {
    const { setIsAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Fallback modal handler if openModal is not provided
    const handleModal = openModal || ((title, msg) => console.log(title, msg));

    // Google OAuth login
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                setMessage({ type: 'info', text: 'Processing Google login...' });
                
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
                
                // Send Google user data to backend for storage/authentication
                const backendResponse = await fetch('http://localhost:4000/auth/google/login', {
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
                    throw new Error(backendData.message || 'Google login failed');
                }
                
                // Store the token and update authentication state
                localStorage.setItem("token", backendData.token);
                setIsAuthenticated(true);
                
                setMessage({ type: 'success', text: 'Google login successful! Redirecting...' });
                handleModal("Google Login Success", `Welcome back, ${userProfile.name}! Redirecting...`);
                
                // Check if this is a new user (signup) or existing user (login)
                if (backendData.message && backendData.message.includes('signup')) {
                    // New user - redirect to onboarding
                    setTimeout(() => {
                        navigate('/onboarding', { replace: false });
                    }, 1500);
                } else {
                    // Existing user - redirect to home page
                    setTimeout(() => {
                        navigate('/home', { replace: true });
                    }, 1500);
                }
                
            } catch (error) {
                console.error('Google login error:', error);
                setMessage({ type: 'error', text: error.message || 'Google login failed' });
                handleModal("Google Login Failed", "Something went wrong with Google login.");
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            handleModal("Google Login Failed", "Something went wrong with Google login.");
        },
    });

    // GitHub OAuth login
    const handleGitHubLogin = () => {
        const clientId = "Iv23liy7qUdzBK9ZWk3a";
        const redirectUri = "http://localhost:5174/auth/github/callback"; // Updated to match current port
        const scope = "user:email";
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=login`;
    };

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validateEmail(email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }
        if (!password) {
            setMessage({ type: 'error', text: 'Please enter your password.' });
            return;
        }

        setLoading(true);
        setMessage({ type: 'info', text: 'Logging in...' });

        try {
            const resp = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save token in localStorage and update auth state
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);

            setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
            handleModal('Login Success', `Welcome back, ${data.user.firstName}!`);

            // Redirect to home page after brief delay
            setTimeout(() => {
                navigate('/home', { replace: true });
            }, 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 font-['Inter'] overflow-x-hidden">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 sm:p-8 md:p-10 border border-gray-200 mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                    Welcome Back!
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                    Sign in to continue your journey.
                </p>
            </div>

            {message.text && (
                <div
                    className={`p-3 rounded-md mb-6 text-sm ${
                        message.type === 'error'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : message.type === 'success'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-[#E6FFFA] text-[#4eb3c1] border border-[#B2F5EA]'
                    } flex items-center`}
                >
                    {message.type === 'success' && <Loader2 className="h-5 w-5 mr-2" />}
                    {message.type === 'error' && <span className="mr-2 font-bold text-lg">!</span>}
                    {message.type === 'info' && <span className="mr-2 font-bold text-lg">i</span>}
                    <span>{message.text}</span>
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            className="block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                <div className="text-sm text-right mb-6">
                    <a href="#" className="font-medium text-[#480360] hover:text-[#a14097] transition-colors duration-200 ease-in-out">
                        Forgot your password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#480360] hover:bg-[#a14097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : 'Sign In'}
                </button>
            </form>

            <div className="relative flex items-center my-8">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <p className="text-center text-gray-600 text-sm mb-4">
                Continue with social accounts:
            </p>
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

            <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/signup"); // ✅ Navigate to signup page
                    }}
                    className="font-medium text-[#480360] hover:text-[#a14097] transition-colors duration-200 ease-in-out"
                >
                    Sign up
                </a>
            </p>
        </div>
        </div>
    );
}
