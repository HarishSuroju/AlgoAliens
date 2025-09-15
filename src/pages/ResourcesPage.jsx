import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation.jsx';
import { BookOpen, Video, Download, ExternalLink } from 'lucide-react';

const ResourcesPage = () => {
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
                        Learning Resources
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Comprehensive resources to accelerate your algorithm learning journey
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Video Tutorials */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="bg-white rounded-xl shadow-lg p-8"
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <Video className="h-8 w-8 text-[#480360]" />
                            <h2 className="text-2xl font-bold text-gray-900">Video Tutorials</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900">Big O Notation</h3>
                                <p className="text-sm text-gray-600">15 min • Beginner</p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900">Dynamic Programming</h3>
                                <p className="text-sm text-gray-600">45 min • Advanced</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Study Materials */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="bg-white rounded-xl shadow-lg p-8"
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <BookOpen className="h-8 w-8 text-[#480360]" />
                            <h2 className="text-2xl font-bold text-gray-900">Study Materials</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900">Algorithm Cheat Sheet</h3>
                                <p className="text-sm text-gray-600">PDF • 2.5 MB</p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900">Data Structures Guide</h3>
                                <p className="text-sm text-gray-600">PDF • 1.8 MB</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Practice Tools */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="bg-white rounded-xl shadow-lg p-8"
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <Download className="h-8 w-8 text-[#480360]" />
                            <h2 className="text-2xl font-bold text-gray-900">Practice Tools</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900">Algorithm Visualizer</h3>
                                <p className="text-sm text-gray-600">Interactive visualization</p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900">Code Practice</h3>
                                <p className="text-sm text-gray-600">Online coding environment</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;