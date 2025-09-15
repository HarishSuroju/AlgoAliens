import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isEmailSent, setIsEmailSent] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validateEmail(email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        setLoading(true);
        setMessage({ type: 'info', text: 'Sending reset link...' });

        try {
            const response = await fetch('http://localhost:4000/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset email');
            }

            setMessage({ 
                type: 'success', 
                text: 'Password reset link has been sent to your email address.' 
            });
            setIsEmailSent(true);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
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
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-600 text-base">
                        {isEmailSent 
                            ? "Check your email for the reset link"
                            : "Enter your email address and we'll send you a link to reset your password."
                        }
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
                        {message.type === 'success' && <span className="mr-2 font-bold text-lg">✓</span>}
                        {message.type === 'error' && <span className="mr-2 font-bold text-lg">!</span>}
                        {message.type === 'info' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <span>{message.text}</span>
                    </div>
                )}

                {!isEmailSent ? (
                    <form onSubmit={handleForgotPassword}>
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
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#480360] hover:bg-[#a14097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-green-700 text-sm">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                            <p>Didn't receive the email? Check your spam folder or</p>
                            <button
                                onClick={() => {
                                    setIsEmailSent(false);
                                    setMessage({ type: '', text: '' });
                                }}
                                className="text-[#480360] hover:text-[#a14097] font-medium"
                            >
                                try again
                            </button>
                        </div>
                    </div>
                )}

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
}