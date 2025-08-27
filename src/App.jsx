import React, { useState } from 'react';
import SignUpForm from './pages/SignUpForm.jsx';
import LoginForm from './pages/LoginForm.jsx';
import OnboardingForm from './pages/OnboardingForm.jsx';

// Custom Modal Component (centralized here for all forms)
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
                <h3 className="text-lg font-bold leading-6 text-gray-900 mb-4" id="modal-title">
                    {title}
                </h3>
                <div className="mt-2">
                    {children}
                </div>
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
    const [currentForm, setCurrentForm] = useState('login'); // Start with login form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [signUpData, setSignUpData] = useState({}); // State to hold data from the sign-up form

    const openModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalTitle('');
        setModalContent('');
    };

    const handleSwitchToSignUp = () => {
        setCurrentForm('signup');
    };

    const handleSwitchToLogin = () => {
        setCurrentForm('login');
    };

    // New handler to transition from sign-up to onboarding
    const handleSignUpSuccess = (data) => {
        setSignUpData(data); // Save the data from the sign-up form
        setCurrentForm('onboarding');
    };

    // New handler for when the onboarding process is complete
    const handleOnboardingComplete = () => {
        // In a real app, you would submit all user data here
        openModal('Onboarding Complete', 'Thank you for providing your information! Your journey begins now.');
        setSignUpData({}); // Clear the data
        setCurrentForm('login'); // Redirect to login page
    };

    return (
        <div
            className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 font-['Inter']"
        >
            {currentForm === 'login' && (
                <LoginForm onSwitchToSignUp={handleSwitchToSignUp} openModal={openModal} />
            )}
            {currentForm === 'signup' && (
                <SignUpForm onSignUpSuccess={handleSignUpSuccess} onSwitchToLogin={handleSwitchToLogin} openModal={openModal} />
            )}
            {currentForm === 'onboarding' && (
                <OnboardingForm onOnboardingComplete={handleOnboardingComplete} openModal={openModal} />
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                <p className="text-sm text-gray-700">{modalContent}</p>
            </Modal>
        </div>
    );
}
