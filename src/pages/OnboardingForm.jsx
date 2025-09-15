import React, { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingForm({ onOnboardingComplete, openModal }) {
    const navigate = useNavigate();
    // Use state to hold an array of selected tags for interests
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [goals, setGoals] = useState('');
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [selectedFieldsOfStudy, setSelectedFieldsOfStudy] = useState([]);
    const [collegeDetails, setCollegeDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Array of suggested interests to display
    const suggestedInterests = [
        'Deep Learning',
        'Mathematical Proficiency',
        'Tone of Voice',
        'CRM Proficiency',
        'HTML',
        'E-Discovery',
        'Embedded Programming',
        'GDPR Compliance',
        'Medical Malpractice',
        'Remote Access',
        'Graphic Design',
        'Data Science',
        'Web Development',
        'Marketing',
        'Cybersecurity'
    ];

    // Array of suggested goals
    const suggestedGoals = [
        'Learn to code in Python',
        'Build a portfolio website',
        'Get a job in tech',
        'Start a tech startup',
        'Master data science',
        'Become a full-stack developer',
        'Learn machine learning',
        'Improve problem-solving skills',
        'Pass technical interviews',
        'Contribute to open source',
        'Learn cloud computing',
        'Master algorithms'
    ];

    // Array of suggested fields of study
    const suggestedFieldsOfStudy = [
        'Computer Science',
        'Software Engineering',
        'Data Science',
        'Information Technology',
        'Computer Engineering',
        'Electrical Engineering',
        'Mathematics',
        'Statistics',
        'Business Administration',
        'Mechanical Engineering',
        'Physics',
        'Information Systems'
    ];

    // Handler to add an interest tag
    const handleAddInterest = (interest) => {
        if (!selectedInterests.includes(interest)) {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    // Handler to remove an interest tag
    const handleRemoveInterest = (interestToRemove) => {
        setSelectedInterests(selectedInterests.filter(interest => interest !== interestToRemove));
    };

    // Handler to add a goal tag
    const handleAddGoal = (goal) => {
        if (!selectedGoals.includes(goal)) {
            setSelectedGoals([...selectedGoals, goal]);
        }
    };

    // Handler to remove a goal tag
    const handleRemoveGoal = (goalToRemove) => {
        setSelectedGoals(selectedGoals.filter(goal => goal !== goalToRemove));
    };

    // Handler to add a field of study tag
    const handleAddFieldOfStudy = (field) => {
        if (!selectedFieldsOfStudy.includes(field)) {
            setSelectedFieldsOfStudy([...selectedFieldsOfStudy, field]);
        }
    };

    // Handler to remove a field of study tag
    const handleRemoveFieldOfStudy = (fieldToRemove) => {
        setSelectedFieldsOfStudy(selectedFieldsOfStudy.filter(field => field !== fieldToRemove));
    };

    // Handler for custom goal input on Enter key
    const handleGoalKeyPress = (e) => {
        if (e.key === 'Enter' && goals.trim()) {
            e.preventDefault();
            handleAddGoal(goals.trim());
            setGoals('');
        }
    };

    // Handler for custom field of study input on Enter key
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

        // Validation now checks if the selectedInterests array is not empty
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
            // Prepare all goals (selected + manually typed)
            const allGoals = [...selectedGoals];
            if (goals.trim() && !allGoals.includes(goals.trim())) {
                allGoals.push(goals.trim());
            }

            // Prepare all fields of study (selected + manually typed)
            const allFieldsOfStudy = [...selectedFieldsOfStudy];
            if (fieldOfStudy.trim() && !allFieldsOfStudy.includes(fieldOfStudy.trim())) {
                allFieldsOfStudy.push(fieldOfStudy.trim());
            }

            // Get user token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }

            // Send onboarding data to backend
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save onboarding data');
            }

            const responseData = await response.json();
            
            setMessage({ type: 'success', text: 'Welcome to AlgoAliens! Redirecting to dashboard...' });
            
            // Complete onboarding and navigate to dashboard
            if (onOnboardingComplete) {
                onOnboardingComplete();
            }
            
            setTimeout(() => {
                navigate('/dashboard', { replace: false });
            }, 1500);
        } catch (error) {
            console.error('Onboarding error:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to save information. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 sm:p-8 md:p-10 border border-gray-200 mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                    Tell Us More
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                    Help us personalize your experience.
                </p>
            </div>

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

            <form onSubmit={handleOnboardingSubmit}>
                <div className="mb-4">
                    <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
                        Interests
                    </label>
                    <div className="w-full min-h-[6rem] p-4 border border-gray-300 rounded-md shadow-sm">
                        {selectedInterests.map((interest, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center text-sm bg-[#a14097] text-white rounded-full px-3 py-1 mr-2 mb-2"
                            >
                {interest}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInterest(interest)}
                                    className="ml-2 h-4 w-4 flex items-center justify-center text-gray-100 hover:text-white focus:outline-none"
                                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedInterests.map((interest, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleAddInterest(interest)}
                                className="text-sm border border-gray-300 rounded-full px-4 py-2 bg-white hover:bg-gray-100 transition-colors duration-200 ease-in-out disabled:opacity-50"
                                disabled={selectedInterests.includes(interest)}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
                        Goals
                    </label>
                    <div className="w-full min-h-[4rem] p-4 border border-gray-300 rounded-md shadow-sm mb-2">
                        {selectedGoals.map((goal, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center text-sm bg-[#480360] text-white rounded-full px-3 py-1 mr-2 mb-2"
                            >
                                {goal}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveGoal(goal)}
                                    className="ml-2 h-4 w-4 flex items-center justify-center text-gray-100 hover:text-white focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="mb-2">
                        <p className="block text-sm font-medium text-gray-700 mb-2">Goal Suggestions</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {suggestedGoals.map((goal, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleAddGoal(goal)}
                                    className="text-sm border border-gray-300 rounded-full px-4 py-2 bg-white hover:bg-gray-100 transition-colors duration-200 ease-in-out disabled:opacity-50"
                                    disabled={selectedGoals.includes(goal)}
                                >
                                    {goal}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <input
                            id="goals"
                            name="goals"
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                            placeholder="Type a custom goal and press Enter or click Add"
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                            onKeyPress={handleGoalKeyPress}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (goals.trim()) {
                                    handleAddGoal(goals.trim());
                                    setGoals('');
                                }
                            }}
                            className="px-4 py-2 bg-[#480360] text-white rounded-md hover:bg-[#a14097] transition-colors duration-200 ease-in-out disabled:opacity-50"
                            disabled={!goals.trim() || loading}
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                        Field of Study
                    </label>
                    <div className="w-full min-h-[4rem] p-4 border border-gray-300 rounded-md shadow-sm mb-2">
                        {selectedFieldsOfStudy.map((field, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center text-sm bg-[#a14097] text-white rounded-full px-3 py-1 mr-2 mb-2"
                            >
                                {field}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFieldOfStudy(field)}
                                    className="ml-2 h-4 w-4 flex items-center justify-center text-gray-100 hover:text-white focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="mb-2">
                        <p className="block text-sm font-medium text-gray-700 mb-2">Field Suggestions</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {suggestedFieldsOfStudy.map((field, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleAddFieldOfStudy(field)}
                                    className="text-sm border border-gray-300 rounded-full px-4 py-2 bg-white hover:bg-gray-100 transition-colors duration-200 ease-in-out disabled:opacity-50"
                                    disabled={selectedFieldsOfStudy.includes(field)}
                                >
                                    {field}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <input
                            id="fieldOfStudy"
                            name="fieldOfStudy"
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                            placeholder="Type a custom field and press Enter or click Add"
                            value={fieldOfStudy}
                            onChange={(e) => setFieldOfStudy(e.target.value)}
                            onKeyPress={handleFieldKeyPress}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (fieldOfStudy.trim()) {
                                    handleAddFieldOfStudy(fieldOfStudy.trim());
                                    setFieldOfStudy('');
                                }
                            }}
                            className="px-4 py-2 bg-[#a14097] text-white rounded-md hover:bg-[#480360] transition-colors duration-200 ease-in-out disabled:opacity-50"
                            disabled={!fieldOfStudy.trim() || loading}
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="collegeDetails" className="block text-sm font-medium text-gray-700 mb-2">
                        College/University
                    </label>
                    <input
                        id="collegeDetails"
                        name="collegeDetails"
                        type="text"
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                        placeholder="e.g., Stanford University"
                        value={collegeDetails}
                        onChange={(e) => setCollegeDetails(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#480360] hover:bg-[#a14097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="animate-spin h-5 w-5 mr-3" />
                    ) : (
                        'Complete Onboarding'
                    )}
                </button>
            </form>
        </div>
    );
}
