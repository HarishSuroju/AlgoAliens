import React, { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingForm({ onOnboardingComplete, openModal }) {
    const navigate = useNavigate();
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [goals, setGoals] = useState('');
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [selectedFieldsOfStudy, setSelectedFieldsOfStudy] = useState([]);
    const [collegeDetails, setCollegeDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const suggestedInterests = [
        'Deep Learning', 'Data Science', 'Web Development', 'Mobile Development',
        'Machine Learning', 'Cybersecurity', 'Cloud Computing', 'DevOps',
        'UI/UX Design', 'Blockchain', 'AI/ML', 'Python', 'JavaScript', 'React'
    ];

    const suggestedGoals = [
        'Learn to code', 'Get a tech job', 'Build projects', 'Start a startup',
        'Master algorithms', 'Learn frameworks', 'Improve skills', 'Career change',
        'Freelancing', 'Open source contribution', 'Technical interviews', 'Certification'
    ];

    const suggestedFieldsOfStudy = [
        'Computer Science', 'Software Engineering', 'Information Technology',
        'Data Science', 'Computer Engineering', 'Mathematics', 'Physics',
        'Electrical Engineering', 'Business', 'Design', 'Other'
    ];

    const handleAddInterest = (interest) => {
        if (!selectedInterests.includes(interest)) {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleRemoveInterest = (interestToRemove) => {
        setSelectedInterests(selectedInterests.filter(interest => interest !== interestToRemove));
    };

    const handleAddGoal = (goal) => {
        if (!selectedGoals.includes(goal)) {
            setSelectedGoals([...selectedGoals, goal]);
        }
    };

    const handleRemoveGoal = (goalToRemove) => {
        setSelectedGoals(selectedGoals.filter(goal => goal !== goalToRemove));
    };

    const handleAddFieldOfStudy = (field) => {
        if (!selectedFieldsOfStudy.includes(field)) {
            setSelectedFieldsOfStudy([...selectedFieldsOfStudy, field]);
        }
    };

    const handleRemoveFieldOfStudy = (fieldToRemove) => {
        setSelectedFieldsOfStudy(selectedFieldsOfStudy.filter(field => field !== fieldToRemove));
    };

    const handleGoalKeyPress = (e) => {
        if (e.key === 'Enter' && goals.trim()) {
            e.preventDefault();
            handleAddGoal(goals.trim());
            setGoals('');
        }
    };

    const handleFieldKeyPress = (e) => {
        if (e.key === 'Enter' && fieldOfStudy.trim()) {
            e.preventDefault();
            handleAddFieldOfStudy(fieldOfStudy.trim());
            setFieldOfStudy('');
        }
    };

    const handleOnboardingSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (selectedInterests.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one interest.' });
            return;
        }
        if (selectedGoals.length === 0 && !goals.trim()) {
            setMessage({ type: 'error', text: 'Please select or enter at least one goal.' });
            return;
        }
        if (selectedFieldsOfStudy.length === 0 && !fieldOfStudy.trim()) {
            setMessage({ type: 'error', text: 'Please select or enter your field of study.' });
            return;
        }
        if (!collegeDetails.trim()) {
            setMessage({ type: 'error', text: 'Please enter your college details.' });
            return;
        }

        setLoading(true);
        setMessage({ type: 'info', text: 'Saving your information...' });

        try {
            const allGoals = [...selectedGoals];
            if (goals.trim() && !allGoals.includes(goals.trim())) {
                allGoals.push(goals.trim());
            }

            const allFieldsOfStudy = [...selectedFieldsOfStudy];
            if (fieldOfStudy.trim() && !allFieldsOfStudy.includes(fieldOfStudy.trim())) {
                allFieldsOfStudy.push(fieldOfStudy.trim());
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }

            console.log('Sending onboarding data:', {
                interests: selectedInterests,
                goals: allGoals,
                fieldOfStudy: allFieldsOfStudy,
                collegeDetails: collegeDetails.trim(),
            });

            const response = await fetch('http://localhost:4000/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    interests: selectedInterests,
                    goals: allGoals,
                    fieldOfStudy: allFieldsOfStudy,
                    collegeDetails: collegeDetails.trim(),
                }),
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                
                // Handle specific error cases
                if (errorData.code === 'USER_NOT_FOUND') {
                    // Clear invalid token and redirect to login
                    localStorage.removeItem('token');
                    setMessage({ type: 'error', text: 'Session expired. Redirecting to login...' });
                    setTimeout(() => {
                        navigate('/login', { replace: true });
                    }, 2000);
                    return;
                }
                
                throw new Error(errorData.message || 'Failed to save onboarding data');
            }

            const responseData = await response.json();
            
            setMessage({ type: 'success', text: 'Welcome to AlgoAliens! Redirecting to home page...' });
            
            if (onOnboardingComplete) {
                onOnboardingComplete();
            }
            
            setTimeout(() => {
                navigate('/home', { replace: true });
            }, 1500);
        } catch (error) {
            console.error('Onboarding submission error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            setMessage({ type: 'error', text: error.message || 'Failed to save information. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 pt-20 font-['Inter'] overflow-x-hidden">
            <div className="mx-auto bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 sm:p-8 md:p-10 border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                        Tell Us About Yourself
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                        Help us personalize your learning experience
                    </p>
                </div>

                {message.text && (
                    <div className={`p-3 rounded-md mb-6 text-sm ${
                        message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
                        message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
                        'bg-blue-100 text-blue-700 border border-blue-200'
                    } flex items-center`}>
                        {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 mr-2" /> : null}
                        {message.type === 'error' ? <span className="mr-2 font-bold text-lg">!</span> : null}
                        {message.type === 'info' ? <span className="mr-2 font-bold text-lg">i</span> : null}
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleOnboardingSubmit} className="space-y-8">
                    {/* Interests Section */}
                    <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                            What are your interests? <span className="text-red-500">*</span>
                        </label>
                        
                        {/* Input field first - UX Golden Rule */}
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#480360] focus:border-[#480360] text-sm mb-4 font-medium"
                            placeholder="Type your interests and press Enter to add..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    e.preventDefault();
                                    handleAddInterest(e.target.value.trim());
                                    e.target.value = '';
                                }
                            }}
                        />
                        
                        {/* Quick suggestions below */}
                        <p className="text-sm font-medium text-gray-600 mb-3">Or choose from popular options:</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestedInterests.map((interest) => (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => handleAddInterest(interest)}
                                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-[#480360] hover:text-white text-gray-700 rounded-full border border-gray-300 transition-all duration-200 disabled:opacity-50"
                                    disabled={selectedInterests.includes(interest)}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                        
                        {selectedInterests.length > 0 && (
                            <div className="mt-4 p-3 bg-purple-50 rounded-md">
                                <p className="text-sm font-medium text-gray-700 mb-2">✓ Your interests:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedInterests.map((interest) => (
                                        <span
                                            key={interest}
                                            className="inline-flex items-center px-3 py-1 text-sm bg-[#480360] text-white rounded-full"
                                        >
                                            {interest}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveInterest(interest)}
                                                className="ml-2 text-white hover:text-gray-300"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Goals Section */}
                    <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                            What are your learning goals? <span className="text-red-500">*</span>
                        </label>
                        
                        {/* Input field first - UX Golden Rule */}
                        <input
                            type="text"
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                            onKeyPress={handleGoalKeyPress}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#480360] focus:border-[#480360] text-sm mb-4 font-medium"
                            placeholder="Type your learning goals and press Enter to add..."
                        />
                        
                        {/* Quick suggestions below */}
                        <p className="text-sm font-medium text-gray-600 mb-3">Or choose from popular options:</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestedGoals.map((goal) => (
                                <button
                                    key={goal}
                                    type="button"
                                    onClick={() => handleAddGoal(goal)}
                                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-[#480360] hover:text-white text-gray-700 rounded-full border border-gray-300 transition-all duration-200 disabled:opacity-50"
                                    disabled={selectedGoals.includes(goal)}
                                >
                                    {goal}
                                </button>
                            ))}
                        </div>
                        
                        {selectedGoals.length > 0 && (
                            <div className="mt-4 p-3 bg-purple-50 rounded-md">
                                <p className="text-sm font-medium text-gray-700 mb-2">✓ Your goals:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedGoals.map((goal) => (
                                        <span
                                            key={goal}
                                            className="inline-flex items-center px-3 py-1 text-sm bg-[#480360] text-white rounded-full"
                                        >
                                            {goal}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveGoal(goal)}
                                                className="ml-2 text-white hover:text-gray-300"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Field of Study Section */}
                    <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                            What is your field of study? <span className="text-red-500">*</span>
                        </label>
                        
                        {/* Input field first - UX Golden Rule */}
                        <input
                            type="text"
                            value={fieldOfStudy}
                            onChange={(e) => setFieldOfStudy(e.target.value)}
                            onKeyPress={handleFieldKeyPress}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#480360] focus:border-[#480360] text-sm mb-4 font-medium"
                            placeholder="Type your field of study and press Enter to add..."
                        />
                        
                        {/* Quick suggestions below */}
                        <p className="text-sm font-medium text-gray-600 mb-3">Or choose from popular options:</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestedFieldsOfStudy.map((field) => (
                                <button
                                    key={field}
                                    type="button"
                                    onClick={() => handleAddFieldOfStudy(field)}
                                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-[#480360] hover:text-white text-gray-700 rounded-full border border-gray-300 transition-all duration-200 disabled:opacity-50"
                                    disabled={selectedFieldsOfStudy.includes(field)}
                                >
                                    {field}
                                </button>
                            ))}
                        </div>
                        
                        {selectedFieldsOfStudy.length > 0 && (
                            <div className="mt-4 p-3 bg-purple-50 rounded-md">
                                <p className="text-sm font-medium text-gray-700 mb-2">✓ Your field(s) of study:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedFieldsOfStudy.map((field) => (
                                        <span
                                            key={field}
                                            className="inline-flex items-center px-3 py-1 text-sm bg-[#480360] text-white rounded-full"
                                        >
                                            {field}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFieldOfStudy(field)}
                                                className="ml-2 text-white hover:text-gray-300"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* College Details Section */}
                    <div>
                        <label htmlFor="collegeDetails" className="block text-lg font-semibold text-gray-900 mb-4">
                            College/University Details <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="collegeDetails"
                            value={collegeDetails}
                            onChange={(e) => setCollegeDetails(e.target.value)}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#480360] focus:border-[#480360] text-sm font-medium"
                            placeholder="Tell us about your college, university, or educational background..."
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#480360] hover:bg-[#a14097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Saving your preferences...
                                </>
                            ) : (
                                'Complete Onboarding'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}