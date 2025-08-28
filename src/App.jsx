import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignUpForm from "./pages/SignUpForm.jsx";
import LoginForm from "./pages/LoginForm.jsx";
import OnboardingForm from "./pages/OnboardingForm.jsx";

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
    const [currentForm, setCurrentForm] = useState("login"); // Start with login form
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

    // Transition: SignUp → Onboarding
    const handleSignUpSuccess = (data) => {
        setSignUpData(data);
        setIsAnimating(true); // start animation
        setTimeout(() => {
            setCurrentForm("onboarding");
            setIsAnimating(false); // reset
        }, 1200); // matches animation duration
    };

    const handleOnboardingComplete = () => {
        openModal(
            "Onboarding Complete",
            "Thank you for providing your information! Your journey begins now."
        );
        setSignUpData({});
        setCurrentForm("login");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 font-['Inter']">
            {/* AnimatePresence handles mount/unmount animations */}
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

            {/* Expanding/Shrinking button effect */}
            {/*{isAnimating && (*/}
            {/*    <motion.button*/}
            {/*        initial={{ scale: 1 }}*/}
            {/*        animate={{ scale: 40, opacity: 0 }}*/}
            {/*        transition={{ duration: 1.2, ease: "easeInOut" }}*/}
            {/*        className="absolute z-50 bg-[#480360] text-white px-6 py-3 rounded-full shadow-lg font-semibold"*/}
            {/*    >*/}
            {/*        Transitioning...*/}
            {/*    </motion.button>*/}
            {/*)}*/}

            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                <p className="text-sm text-gray-700">{modalContent}</p>
            </Modal>
        </div>
    );
}