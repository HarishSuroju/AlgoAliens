import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
// Removed: import './assets/App.css'; // This import is not needed for a component file using Tailwind CSS.

// Note: The Modal component is now centralized in App.jsx and passed down via props.
// This component will receive 'openModal' as a prop from App.jsx.

export default function SignUpForm({ onSwitchToLogin, openModal }) { // Destructure openModal from props
                                                                     // State variables for form fields
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State variables for UI/UX
    const [stage, setStage] = useState('initial_form');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // --- Utility Functions ---
    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const validateDob = (dateString) => {
        return dateString !== '';
    };

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

    // --- Handlers for Form Actions ---
    const handleSendOtp = async () => {
        setMessage({ type: '', text: '' });

        if (!firstName.trim()) {
            setMessage({ type: 'error', text: 'Please enter your First Name.' });
            return;
        }
        if (!lastName.trim()) {
            setMessage({ type: 'error', text: 'Please enter your Last Name.' });
            return;
        }
        if (!validateDob(dob)) {
            setMessage({ type: 'error', text: 'Please enter your Date of Birth.' });
            return;
        }
        if (!gender) {
            setMessage({ type: 'error', text: 'Please select your Gender.' });
            return;
        }
        if (!address.trim()) {
            setMessage({ type: 'error', text: 'Please enter your Address.' });
            return;
        }
        if (!validateEmail(email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        setLoading(true);
        setMessage({ type: 'info', text: 'Sending verification code...' });

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setOtpSent(true);
            setResendTimer(60);
            setMessage({ type: 'success', text: `OTP sent to ${email}. Please check your inbox.` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to send OTP. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP.' });
            return;
        }

        const passwordStrength = getPasswordStrength(password);
        if (passwordStrength === 'Weak') {
            setMessage({ type: 'error', text: 'Please create a stronger password.' });
            return;
        }
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setLoading(true);
        setMessage({ type: 'info', text: 'Verifying OTP and creating account...' });

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (otp === '123456') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setStage('success');
                setMessage({ type: 'success', text: 'Account created successfully! Redirecting...' });
            } else {
                setMessage({ type: 'error', text: 'Incorrect OTP. Please try again.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Sign-up failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    // Effect for OTP resend timer
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

    // Social login button component (reusable)
    const SocialLoginIcon = ({ icon, onClick }) => (
        <button
            onClick={onClick}
            className="flex items-center justify-center p-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 ease-in-out"
        >
            {icon}
        </button>
    );

    // Custom Google Icon using an image URL
    const GoogleIcon = () => (
        <img
            src="data:image/png;base64,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" // Replace with your Google logo URL
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
        // The outermost div with min-h-screen, flex, items-center, justify-center, and padding is now in App.jsx
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl p-6 sm:p-8 md:p-10 border border-gray-200"> {/* Added mx-auto here */}
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                    Create Your Account
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                    To Unlock knowledge. Master skills. Build your future.
                </p>
            </div>

            {/* Message Display Area */}
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

            {/* Form */}
            <form onSubmit={handleSignUp}>
                {/* Initial Form Fields */}
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

                        {/* OTP Verification Field (conditionally rendered) */}
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
                                            onClick={handleSendOtp} // Resend OTP
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
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    className="block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                                    placeholder="Create a strong password"
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
                            <p className={`mt-1 text-xs ${getPasswordStrengthColor(getPasswordStrength(password))}`}>
                                Password Strength: {getPasswordStrength(password)}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    className="block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {password && confirmPassword && password !== confirmPassword && (
                                <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
                            )}
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

                        {/* Divider and Social Logins after main action button */}
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
                                        onClick={() => openModal('Google Login', 'You clicked to continue with Google. (This would initiate an OAuth flow)')}
                                    />
                                    <SocialLoginIcon
                                        icon={<GitHubIcon />}
                                        onClick={() => openModal('GitHub Login', 'You clicked to continue with GitHub. (This would would initiate an OAuth flow)')}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </form>

            {/* Success Message */}
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

            {/* Sign-in link */}
            {stage !== 'success' && (
                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onSwitchToLogin(); // Call the prop to switch to login form
                        }}
                        className="font-medium text-[#480360] hover:text-[#a14097] transition-colors duration-200 ease-in-out"
                    >
                        Sign in
                    </a>
                </p>
            )}
        </div>
    );
}
