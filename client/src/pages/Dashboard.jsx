import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 pt-24 pb-8">
        <h1 className="text-4xl font-bold text-light">Welcome, <span className="text-accent">{user?.name}</span></h1>
        <p className="text-gray-300 mt-2">This is your learning command center.</p>

        <div className="mt-8 p-6 bg-light/5 border border-neon/20 rounded-lg">
            <h2 className="text-2xl font-semibold text-neon">Dashboard Content</h2>
            <p className="mt-4 text-gray-400">
                Your personalized learning path, course progress, and recommendations will appear here.
                Stay tuned for more updates from the AlgoAliens fleet!
            </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;