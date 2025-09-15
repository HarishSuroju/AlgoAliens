import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation.jsx';
import { Users, Target, Lightbulb, Award } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden pt-16">
            <Navigation />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        About AlgoAliens
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We're on a mission to make algorithm learning accessible, engaging, and effective for developers worldwide.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {[
                        { icon: Users, title: "Community", desc: "Learn with thousands of developers" },
                        { icon: Target, title: "Focused", desc: "Targeted learning paths for algorithms" },
                        { icon: Lightbulb, title: "Innovation", desc: "AI-powered personalized learning" },
                        { icon: Award, title: "Excellence", desc: "Industry-recognized certifications" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="bg-white p-8 rounded-xl shadow-lg text-center"
                        >
                            <item.icon className="h-12 w-12 text-[#480360] mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
                    <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
                        <p className="mb-6">
                            AlgoAliens was founded with a simple belief: everyone deserves access to high-quality algorithm education. 
                            We noticed that while algorithms are fundamental to computer science, many learning resources were either 
                            too theoretical or too simplistic.
                        </p>
                        <p className="mb-6">
                            Our platform bridges this gap by combining rigorous computer science principles with interactive, 
                            hands-on learning experiences. We use AI to personalize learning paths and provide real-time feedback, 
                            making complex concepts accessible to learners at all levels.
                        </p>
                        <p>
                            Today, AlgoAliens serves thousands of students, professionals, and enthusiasts worldwide, helping them 
                            master algorithms and advance their careers in technology.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;