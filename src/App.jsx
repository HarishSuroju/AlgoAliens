// client/src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.jsx";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import OnboardingForm from "./pages/OnboardingForm";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage"; // ✅ make sure this exists
import GitHubCallback from "./pages/GitHubCallback"; // ✅ GitHub OAuth callback handler

// ✅ ProtectedRoute wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

// ✅ PublicRoute wrapper
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }
    // Don't redirect authenticated users from public routes
    // Allow them to access signup/login pages if needed
    return children;
};

// ✅ Wrapper for animated routes
const AnimatedWrapper = ({ children, keyName }) => (
    <AnimatePresence mode="wait">
        <motion.div
            key={keyName}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            {children}
        </motion.div>
    </AnimatePresence>
);

function App() {
    const [signUpData, setSignUpData] = useState({});
    const [modalData, setModalData] = useState({ isOpen: false, title: '', message: '' });

    const handleSignUpSuccess = (data) => {
        setSignUpData(data);
    };

    const handleOnboardingComplete = () => {
        setSignUpData({});
    };

    const openModal = (title, message) => {
        setModalData({ isOpen: true, title, message });
        // Auto-close modal after 3 seconds
        setTimeout(() => {
            setModalData({ isOpen: false, title: '', message: '' });
        }, 3000);
    };

    const onSwitchToLogin = () => {
        // Navigate to login page
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 font-['Inter']">
            {/* Simple Modal */}
            {modalData.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{modalData.title}</h3>
                        <p className="text-gray-600 mb-4">{modalData.message}</p>
                        <button
                            onClick={() => setModalData({ isOpen: false, title: '', message: '' })}
                            className="w-full bg-[#480360] text-white py-2 px-4 rounded hover:bg-[#a14097] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            
            <Routes>
                {/* Redirect root path to /login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public routes with animation */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <AnimatedWrapper keyName="login">
                                <LoginForm openModal={openModal} />
                            </AnimatedWrapper>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <AnimatedWrapper keyName="signup">
                                <SignUpForm 
                                    onSignUpSuccess={handleSignUpSuccess} 
                                    onSwitchToLogin={onSwitchToLogin}
                                    openModal={openModal}
                                />
                            </AnimatedWrapper>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/reset-password/:token"
                    element={<ResetPasswordPage />}
                />
                <Route
                    path="/auth/github/callback"
                    element={<GitHubCallback />}
                />

                {/* Protected routes with animation */}
                <Route
                    path="/onboarding"
                    element={
                        <ProtectedRoute>
                            <AnimatedWrapper keyName="onboarding">
                                <OnboardingForm
                                    signUpData={signUpData}
                                    onOnboardingComplete={handleOnboardingComplete}
                                    openModal={openModal}
                                />
                            </AnimatedWrapper>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </div>
    );
}

export default App;
