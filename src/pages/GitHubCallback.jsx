import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function GitHubCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsAuthenticated } = useAuth();
    const [message, setMessage] = useState('Processing GitHub authentication...');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state'); // 'login' or 'signup'
        const error = urlParams.get('error');

        if (error) {
            setMessage('GitHub authentication was cancelled or failed.');
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 3000);
            return;
        }

        if (!code) {
            setMessage('No authorization code received from GitHub.');
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 3000);
            return;
        }

        // Process the GitHub OAuth callback
        axios
            .post('http://localhost:4000/auth/github/callback', { code })
            .then((res) => {
                // Store the GitHub token and update authentication state
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    setIsAuthenticated(true);
                }

                setMessage('GitHub authentication successful! Redirecting...');

                // Route based on the state parameter
                setTimeout(() => {
                    if (state === 'signup') {
                        // Redirect to onboarding for signup flow
                        navigate('/onboarding', { replace: false });
                    } else {
                        // Redirect to external site for login flow
                        window.location.href = 'https://www.algorithmaliens.com/';
                    }
                }, 1500);
            })
            .catch((err) => {
                console.error('GitHub authentication failed:', err);
                setMessage('GitHub authentication failed. Redirecting to login...');
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
            });
    }, [location, navigate, setIsAuthenticated]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 text-center">
                <div className="mb-6">
                    <Loader2 className="animate-spin h-12 w-12 mx-auto text-[#480360] mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        GitHub Authentication
                    </h1>
                    <p className="text-gray-600">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
}