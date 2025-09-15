// client/src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.jsx";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import OnboardingForm from "./pages/OnboardingForm";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage.jsx";
import GitHubCallback from "./pages/GitHubCallback";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ResourcesPage from "./pages/ResourcesPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen flex flex-col overflow-x-hidden"
        >
            {children}
        </motion.div>
    </AnimatePresence>
);

function App() {
    const navigate = useNavigate();
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
        // Navigate to login page using React Router
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 font-['Inter'] overflow-x-hidden">
            {/* Simple Modal */}
            {modalData.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[110]">
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
                {/* Redirect root path to /home */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* Public routes with animation */}
                <Route
                    path="/home"
                    element={
                        <PublicRoute>
                            <AnimatedWrapper keyName="home">
                                <HomePage />
                            </AnimatedWrapper>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <PublicRoute>
                            <AnimatedWrapper keyName="about">
                                <AboutPage />
                            </AnimatedWrapper>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/resources"
                    element={
                        <PublicRoute>
                            <AnimatedWrapper keyName="resources">
                                <ResourcesPage />
                            </AnimatedWrapper>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/help"
                    element={
                        <PublicRoute>
                            <AnimatedWrapper keyName="help">
                                <HelpPage />
                            </AnimatedWrapper>
                        </PublicRoute>
                    }
                />
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
                    path="/forgot-password"
                    element={
                        <PublicRoute>
                            <AnimatedWrapper keyName="forgot-password">
                                <ForgotPasswordPage />
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
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <AnimatedWrapper keyName="profile">
                                <ProfilePage />
                            </AnimatedWrapper>
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </div>
    );
}

export default App;