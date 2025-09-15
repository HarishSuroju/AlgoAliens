import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import Navigation from '../components/Navigation.jsx';
import { 
    ArrowRight, 
    Code, 
    Brain, 
    Users, 
    Trophy,
    BookOpen,
    Play,
    Star
} from 'lucide-react';

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: Code,
            title: "Interactive Coding",
            description: "Learn algorithms through hands-on coding exercises and challenges."
        },
        {
            icon: Brain,
            title: "AI-Powered Learning",
            description: "Get personalized learning paths powered by advanced AI algorithms."
        },
        {
            icon: Users,
            title: "Community Learning",
            description: "Join a community of developers and learn together."
        },
        {
            icon: Trophy,
            title: "Achievements",
            description: "Earn certificates and badges as you master new concepts."
        }
    ];

    const stats = [
        { number: "50K+", label: "Students" },
        { number: "200+", label: "Courses" },
        { number: "98%", label: "Success Rate" },
        { number: "24/7", label: "Support" }
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden pt-16">
            <Navigation />
            
            {/* Hero Section */}
            <motion.section 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative bg-gradient-to-br from-[#480360] to-[#a14097] py-12 sm:py-16 lg:py-20 overflow-hidden"
            >
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight"
                        >
                            Master Algorithms with
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                                AlgoAliens
                            </span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-3xl mx-auto px-4"
                        >
                            Join thousands of developers learning algorithms through interactive coding challenges and AI-powered personalized learning paths.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
                        >
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/signup"
                                        className="bg-white text-[#480360] px-6 sm:px-8 py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg w-full sm:w-auto"
                                    >
                                        <span>Get Started</span>
                                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </Link>
                                    <Link
                                        to="/about"
                                        className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-[#480360] transition-all duration-200 w-full sm:w-auto text-center"
                                    >
                                        Learn More
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="bg-white text-[#480360] px-6 sm:px-8 py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg w-full sm:w-auto"
                                    >
                                        <span>Go to Dashboard</span>
                                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </Link>
                                    <Link
                                        to="/resources"
                                        className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-[#480360] transition-all duration-200 w-full sm:w-auto text-center"
                                    >
                                        Browse Resources
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
                
                {/* Floating Animation Elements */}
                <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute top-8 sm:top-20 right-4 sm:right-10 w-10 h-10 sm:w-16 sm:h-16 bg-pink-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-4 sm:bottom-10 left-8 sm:left-20 w-8 h-8 sm:w-12 sm:h-12 bg-blue-400 rounded-full opacity-20 animate-bounce delay-1000"></div>
            </motion.section>

            {/* Features Section */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-12 sm:py-16 lg:py-20 bg-white"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose AlgoAliens?
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            Our platform combines cutting-edge technology with proven learning methodologies
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="bg-gray-50 p-4 sm:p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#480360] to-[#a14097] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Stats Section */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-12 sm:py-16 bg-gradient-to-r from-[#480360] to-[#a14097]"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-200 text-xs sm:text-sm md:text-base">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-12 sm:py-16 lg:py-20 bg-white"
            >
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                        Join thousands of developers who are already mastering algorithms with AlgoAliens
                    </p>
                    
                    {!isAuthenticated ? (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#480360] to-[#a14097] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-lg transition-all duration-200 w-full sm:w-auto max-w-xs sm:max-w-none"
                            >
                                <span>Start Learning Today</span>
                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#480360] to-[#a14097] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-lg transition-all duration-200 w-full sm:w-auto max-w-xs sm:max-w-none"
                            >
                                <span>Continue Learning</span>
                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Link>
                        </motion.div>
                    )}
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                            <img 
                                src="/src/assets/images/favicon (1).ico" 
                                alt="AlgoAliens Logo" 
                                className="h-6 w-6 sm:h-8 sm:w-8"
                            />
                            <span className="text-xl sm:text-2xl font-bold">AlgoAliens</span>
                        </div>
                        <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                            Master algorithms. Build the future.
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm">
                            © 2025 AlgoAliens. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;