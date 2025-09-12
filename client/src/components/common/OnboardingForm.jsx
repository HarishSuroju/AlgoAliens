import React, { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function OnboardingForm({ onOnboardingComplete }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [goals, setGoals] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [collegeDetails, setCollegeDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const suggestedInterests = [
    "Deep Learning",
    "Mathematical Proficiency",
    "Web Development",
    "Data Science",
    "Cybersecurity",
    "Graphic Design",
    "Marketing",
    "Embedded Programming",
  ];

  const handleAddInterest = (interest) => {
    if (!selectedInterests.includes(interest)) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setSelectedInterests(selectedInterests.filter((i) => i !== interestToRemove));
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (selectedInterests.length === 0) {
      setMessage({ type: "error", text: "Please select at least one interest." });
      return;
    }
    if (!goals.trim() || !fieldOfStudy.trim() || !collegeDetails.trim()) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    setLoading(true);
    setMessage({ type: "info", text: "Saving your information..." });

    try {
      await onOnboardingComplete({
        interests: selectedInterests,
        goals,
        fieldOfStudy,
        collegeDetails,
      });
    } catch {
      setMessage({ type: "error", text: "Failed to save information. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 sm:p-8 border border-gray-200 mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Tell Us More
      </h1>

      {message.text && (
        <div
          className={`p-3 rounded-md mb-6 text-sm ${
            message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-200"
              : message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleOnboardingSubmit}>
        {/* Interests */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {suggestedInterests.map((interest, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddInterest(interest)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedInterests.includes(interest)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((interest, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1 bg-purple-500 text-white rounded-full text-sm"
              >
                {interest}
                <button
                  type="button"
                  className="ml-2 text-white"
                  onClick={() => handleRemoveInterest(interest)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goals
          </label>
          <textarea
            rows="3"
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g., Learn ML, get internship"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Field of Study */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field of Study
          </label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g., Computer Science"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* College Details */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            College / University
          </label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g., Stanford University"
            value={collegeDetails}
            onChange={(e) => setCollegeDetails(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "Finish"}
        </button>
      </form>
    </div>
  );
}
