import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import OnboardingForm from "../components/common/OnboardingForm";
import { saveOnboarding } from "../services/onboarding";
import { useNavigate } from "react-router-dom";

const OnboardingPage = () => {
  const navigate = useNavigate();

  const handleComplete = async (formData) => {
    try {
      console.log("Saved token:", localStorage.getItem("token"));
      await saveOnboarding(formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding failed:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 pt-24 pb-8 text-center">
        <OnboardingForm onOnboardingComplete={handleComplete} />
      </main>
      <Footer />
    </div>
  );
};

export default OnboardingPage;
