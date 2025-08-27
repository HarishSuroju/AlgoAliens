import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginForm({ onSwitchToSignUp, openModal }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);

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
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
            openModal('Login Success', 'You have successfully logged in!');
        } catch (error) {
            setMessage({ type: 'error', text: 'Login failed. Please check your credentials.' });
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
            src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" // Replace with your Google logo URL
            alt="Google Logo"
            className="h-5 w-5"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/20x20/cccccc/ffffff?text=G"; }} // Fallback image
        />
    );

    // Custom GitHub Icon using an image URL
    const GitHubIcon = () => (
        <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" // Replace with your GitHub logo URL
            alt="GitHub Logo"
            className="h-5 w-5"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/20x20/cccccc/ffffff?text=GH"; }} // Fallback image
        />
    );

    return (
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
                    {message.type === 'error' && (
                        <span className="mr-2 font-bold text-lg">!</span>
                    )}
                    {message.type === 'info' && (
                        <span className="mr-2 font-bold text-lg">i</span>
                    )}
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
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="text-sm text-right mb-6">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            openModal('Forgot Password', 'This would navigate to a password recovery page.');
                        }}
                        className="font-medium text-[#480360] hover:text-[#a14097] transition-colors duration-200 ease-in-out"
                    >
                        Forgot your password?
                    </a>
                </div>

                <button
                    type="button"
                    onClick={() => window.location.href = "https://www.algorithmaliens.com/"}
                    className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#480360] hover:bg-[#a14097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="animate-spin h-5 w-5 mr-3" />
                    ) : (
                        'Sign In'
                    )}
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
                    onClick={() => openModal('Google Login', 'You clicked to continue with Google. (This would initiate an OAuth flow)')}
                />
                <SocialLoginIcon
                    icon={<GitHubIcon />}
                    onClick={() => openModal('GitHub Login', 'You clicked to continue with GitHub. (This would would initiate an OAuth flow)')}
                />
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onSwitchToSignUp();
                    }}
                    className="font-medium text-[#480360] hover:text-[#a14097] transition-colors duration-200 ease-in-out"
                >
                    Sign up
                </a>
            </p>
        </div>
    );
}