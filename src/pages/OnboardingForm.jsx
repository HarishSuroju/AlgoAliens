import React, { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function OnboardingForm({ onOnboardingComplete, openModal }) {
    // Use state to hold an array of selected tags for interests
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [goals, setGoals] = useState('');
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [collegeDetails, setCollegeDetails] = useState('');
    const [contactInfo, setContactInfo] = useState('');
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

    // Handler for text input if the user wants to type a custom interest
    const handleCustomInterestInput = (e) => {
        // This part can be more complex, but for a simple tag-based input,
        // we can just prevent it or handle it as a new tag on a key press like Enter.
    };

    const handleOnboardingSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation now checks if the selectedInterests array is not empty
        if (selectedInterests.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one interest.' });
            return;
        }
        if (!goals.trim()) {
            setMessage({ type: 'error', text: 'Please enter your goals.' });
            return;
        }
        if (!fieldOfStudy.trim()) {
            setMessage({ type: 'error', text: 'Please enter your field of study.' });
            return;
        }
        if (!collegeDetails.trim()) {
            setMessage({ type: 'error', text: 'Please enter your college details.' });
            return;
        }
        if (!contactInfo.trim()) {
            setMessage({ type: 'error', text: 'Please enter your contact info.' });
            return;
        }

        setLoading(true);
        setMessage({ type: 'info', text: 'Saving your information...' });

        try {
            // Simulate API call to save onboarding data
            await new Promise(resolve => setTimeout(resolve, 2000));
            onOnboardingComplete(); // Call the parent handler to complete the flow
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save information. Please try again.' });
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
                    <textarea
                        id="goals"
                        name="goals"
                        rows="3"
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                        placeholder="e.g., Learn to code in Python, build a portfolio, find a job"
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        disabled={loading}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                        Field of Study
                    </label>
                    <input
                        id="fieldOfStudy"
                        name="fieldOfStudy"
                        type="text"
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                        placeholder="e.g., Computer Science"
                        value={fieldOfStudy}
                        onChange={(e) => setFieldOfStudy(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="mb-4">
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

                <div className="mb-6">
                    <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Info
                    </label>
                    <input
                        id="contactInfo"
                        name="contactInfo"
                        type="text"
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#480360] focus:border-[#480360] sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-offset-white"
                        placeholder="e.g., Phone number"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button
                    type="button"
                    onClick={() => window.location.href = "https://www.algorithmaliens.com/"}
                    className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#480360] hover:bg-[#a14097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#480360] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="animate-spin h-5 w-5 mr-3" />
                    ) : (
                        'Finish'
                    )}
                </button>
            </form>
        </div>
    );
}
