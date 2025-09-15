import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation.jsx';
import { HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';

const HelpPage = () => {
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
                        Help & Support
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Get the help you need to succeed in your algorithm learning journey
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* FAQs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="bg-white rounded-xl shadow-lg p-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">How do I get started?</h3>
                                <p className="text-gray-600">Sign up for a free account and complete the onboarding process to get personalized course recommendations.</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Are certificates recognized?</h3>
                                <p className="text-gray-600">Yes, our certificates are industry-recognized and can be verified through our certification system.</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Can I access courses offline?</h3>
                                <p className="text-gray-600">Premium members can download video content for offline viewing through our mobile app.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Options */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="bg-white rounded-xl shadow-lg p-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <Mail className="h-6 w-6 text-[#480360]" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Email Support</h3>
                                    <p className="text-gray-600">support@algoaliens.com</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <MessageSquare className="h-6 w-6 text-[#480360]" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                                    <p className="text-gray-600">Available 24/7</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <Phone className="h-6 w-6 text-[#480360]" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Phone Support</h3>
                                    <p className="text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Documentation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <HelpCircle className="h-12 w-12 text-[#480360] mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-900 mb-2">Getting Started Guide</h3>
                            <p className="text-gray-600">Complete guide to using AlgoAliens</p>
                        </div>
                        <div className="text-center">
                            <HelpCircle className="h-12 w-12 text-[#480360] mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-900 mb-2">API Documentation</h3>
                            <p className="text-gray-600">For developers and integrations</p>
                        </div>
                        <div className="text-center">
                            <HelpCircle className="h-12 w-12 text-[#480360] mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                            <p className="text-gray-600">Step-by-step platform tutorials</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HelpPage;