// client/src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.jsx";
import { motion, AnimatePresence } from "framer-motion";

<<<<<<< HEAD
// Pages
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import OnboardingForm from "./pages/OnboardingForm";
import ResetPasswordPage from "./pages/ResetPasswordPage";
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
=======
// GitHub OAuth URL builder
const getGithubOAuthUrl = () => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;
  const scope = "read:user user:email";

  if (!clientId || !redirectUri) {
    console.error("❌ Missing GitHub OAuth environment variables.");
    return "#";
  }

  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scope}`;
};

// Custom Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <h3
          className="text-lg font-bold leading-6 text-gray-900 mb-4"
          id="modal-title"
        >
          {title}
        </h3>
        <div className="mt-2">{children}</div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#480360] text-base font-medium text-white hover:bg-[#a14097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 ease-in-out"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [signUpData, setSignUpData] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalContent("");
  };

  const handleSwitchToSignUp = () => {
    setCurrentForm("signup");
  };

  const handleSwitchToLogin = () => {
    setCurrentForm("login");
  };

  const handleSignUpSuccess = (data) => {
    setSignUpData(data);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentForm("onboarding");
      setIsAnimating(false);
    }, 1200);
  };

  const handleOnboardingComplete = () => {
    openModal(
      "Onboarding Complete",
      "Thank you for providing your information! Your journey begins now."
    );
    setSignUpData({});
    setCurrentForm("login");
  };

  // Handle GitHub login click
  const handleGithubLogin = () => {
    const url = getGithubOAuthUrl();
    if (url !== "#") {
      window.location.href = url;
    } else {
      openModal("Error", "GitHub OAuth is not configured properly.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 font-['Inter']">
      <AnimatePresence mode="wait">
        {currentForm === "login" && !isAnimating && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <LoginForm
              onSwitchToSignUp={handleSwitchToSignUp}
              openModal={openModal}
            />

            {/* GitHub Login Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGithubLogin}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-5 h-5"
                >
                  <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.29 3.438 9.773 8.207 11.363.6.113.793-.26.793-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.833 2.807 1.303 3.492.996.108-.774.418-1.303.76-1.603-2.665-.303-5.467-1.332-5.467-5.931 0-1.31.469-2.382 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 016.003 0c2.293-1.552 3.3-1.23 3.3-1.23.654 1.653.242 2.873.118 3.176.768.839 1.236 1.911 1.236 3.221 0 4.61-2.805 5.625-5.475 5.922.43.37.813 1.102.813 2.222 0 1.604-.014 2.898-.014 3.293 0 .32.192.694.8.576C20.565 22.27 24 17.79 24 12.5 24 5.87 18.627.5 12 .5z" />
                </svg>
                Login with GitHub
              </button>
            </div>
          </motion.div>
        )}

        {currentForm === "signup" && !isAnimating && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <SignUpForm
              onSignUpSuccess={handleSignUpSuccess}
              onSwitchToLogin={handleSwitchToLogin}
              openModal={openModal}
            />
          </motion.div>
        )}

        {currentForm === "onboarding" && !isAnimating && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <OnboardingForm
              onOnboardingComplete={handleOnboardingComplete}
              openModal={openModal}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        <p className="text-sm text-gray-700">{modalContent}</p>
      </Modal>
    </div>
  );
}
>>>>>>> 66d3aab10809b3429551b47a2be7882e54d64296
