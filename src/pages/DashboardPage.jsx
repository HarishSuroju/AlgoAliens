import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.jsx';
import Navigation from '../components/Navigation.jsx';
import {
    BookOpen,
    TrendingUp,
    Star,
    Award,
    Clock,
    Users,
    Play,
    CheckCircle2,
    BarChart3,
    Target,
    Calendar
} from 'lucide-react';

const DashboardPage = () => {
    const { isAuthenticated } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock data - replace with real API calls
    const enrolledCourses = [
        {
            id: 1,
            title: "Data Structures Fundamentals",
            progress: 75,
            totalLessons: 24,
            completedLessons: 18,
            instructor: "Dr. Sarah Johnson",
            thumbnail: "/api/placeholder/300/200",
            nextLesson: "Binary Search Trees"
        },
        {
            id: 2,
            title: "Advanced Algorithms",
            progress: 45,
            totalLessons: 32,
            completedLessons: 14,
            instructor: "Prof. Mike Chen",
            thumbnail: "/api/placeholder/300/200",
            nextLesson: "Dynamic Programming"
        },
        {
            id: 3,
            title: "Graph Algorithms",
            progress: 20,
            totalLessons: 18,
            completedLessons: 4,
            instructor: "Dr. Emily Rodriguez",
            thumbnail: "/api/placeholder/300/200",
            nextLesson: "Breadth-First Search"
        }
    ];

    const suggestedCourses = [
        {
            id: 4,
            title: "Machine Learning Algorithms",
            rating: 4.8,
            students: 12500,
            duration: "8 weeks",
            level: "Intermediate",
            thumbnail: "/api/placeholder/300/200",
            price: "$89"
        },
        {
            id: 5,
            title: "System Design Fundamentals",
            rating: 4.9,
            students: 8900,
            duration: "6 weeks",
            level: "Advanced",
            thumbnail: "/api/placeholder/300/200",
            price: "$129"
        },
        {
            id: 6,
            title: "Competitive Programming",
            rating: 4.7,
            students: 15600,
            duration: "12 weeks",
            level: "Intermediate",
            thumbnail: "/api/placeholder/300/200",
            price: "$99"
        }
    ];

    const popularCourses = [
        {
            id: 7,
            title: "Python for Algorithms",
            rating: 4.9,
            students: 25000,
            duration: "4 weeks",
            level: "Beginner",
            thumbnail: "/api/placeholder/300/200",
            price: "$49"
        },
        {
            id: 8,
            title: "JavaScript Data Structures",
            rating: 4.8,
            students: 18700,
            duration: "6 weeks",
            level: "Intermediate",
            thumbnail: "/api/placeholder/300/200",
            price: "$79"
        },
        {
            id: 9,
            title: "Sorting Algorithms Masterclass",
            rating: 4.9,
            students: 22300,
            duration: "3 weeks",
            level: "Beginner",
            thumbnail: "/api/placeholder/300/200",
            price: "$39"
        }
    ];

    const certificates = [
        {
            id: 1,
            title: "Array Algorithms Specialist",
            dateEarned: "2025-01-10",
            verificationId: "AAC-2025-001"
        },
        {
            id: 2,
            title: "Sorting Algorithms Expert",
            dateEarned: "2025-01-05",
            verificationId: "SAE-2025-002"
        }
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:4000/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser({
                        name: userData.user?.firstName && userData.user?.lastName 
                            ? `${userData.user.firstName} ${userData.user.lastName}`
                            : userData.user?.username || 'User',
                        email: userData.user?.email || '',
                        joinDate: userData.user?.createdAt ? new Date(userData.user.createdAt).toLocaleDateString() : '2024-12-01',
                        coursesCompleted: 5, // Mock data for now
                        totalPoints: 2450 // Mock data for now
                    });
                } else {
                    // Fallback to mock data if API fails
                    setUser({
                        name: "User",
                        email: "user@example.com",
                        joinDate: "2024-12-01",
                        coursesCompleted: 5,
                        totalPoints: 2450
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Fallback to mock data
                setUser({
                    name: "User",
                    email: "user@example.com",
                    joinDate: "2024-12-01",
                    coursesCompleted: 5,
                    totalPoints: 2450
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const CourseCard = ({ course, type = "enrolled" }) => (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl"
        >
            <div className="h-36 sm:h-40 lg:h-48 bg-gradient-to-br from-[#480360] to-[#a14097] flex items-center justify-center">
                <BookOpen className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-white" />
            </div>
            <div className="p-4 sm:p-5 lg:p-6">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                </h3>
                
                {type === "enrolled" && (
                    <>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <span>Progress: {course.progress}%</span>
                            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div 
                                className="bg-gradient-to-r from-[#480360] to-[#a14097] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            Next: {course.nextLesson}
                        </p>
                        <button className="w-full bg-[#480360] text-white py-2 sm:py-2.5 rounded-lg hover:bg-[#a14097] transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                            <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Continue Learning</span>
                        </button>
                    </>
                )}
                
                {type !== "enrolled" && (
                    <>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>{course.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{course.students.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{course.duration}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {course.level}
                            </span>
                            <span className="text-lg font-bold text-[#480360]">
                                {course.price}
                            </span>
                        </div>
                        <button className="w-full bg-[#480360] text-white py-2 sm:py-2.5 rounded-lg hover:bg-[#a14097] transition-colors duration-200 text-sm sm:text-base">
                            Enroll Now
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#480360] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden pt-16">
            <Navigation />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-[#480360] to-[#a14097] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-6 sm:mb-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                            <p className="text-gray-200 text-sm sm:text-base">Continue your learning journey and master new algorithms</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-left md:text-right">
                            <div className="text-xl sm:text-2xl font-bold">{user?.totalPoints}</div>
                            <div className="text-xs sm:text-sm text-gray-200">Total Points</div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
                >
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Enrolled Courses</p>
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
                            </div>
                            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-[#480360]" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{user?.coursesCompleted}</p>
                            </div>
                            <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Certificates</p>
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{certificates.length}</p>
                            </div>
                            <Award className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Avg. Progress</p>
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">67%</p>
                            </div>
                            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                        </div>
                    </div>
                </motion.div>

                {/* Enrolled Courses */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Enrolled Courses</h2>
                        <button className="text-[#480360] hover:text-[#a14097] font-medium">View All</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map(course => (
                            <CourseCard key={course.id} course={course} type="enrolled" />
                        ))}
                    </div>
                </motion.section>

                {/* Suggested Courses */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Suggested for You</h2>
                        <button className="text-[#480360] hover:text-[#a14097] font-medium">View All</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suggestedCourses.map(course => (
                            <CourseCard key={course.id} course={course} type="suggested" />
                        ))}
                    </div>
                </motion.section>

                {/* Most Popular Courses */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Most Popular Courses</h2>
                        <button className="text-[#480360] hover:text-[#a14097] font-medium">View All</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularCourses.map(course => (
                            <CourseCard key={course.id} course={course} type="popular" />
                        ))}
                    </div>
                </motion.section>

                {/* Progress Charts and Certificates */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Progress Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="bg-white rounded-xl p-6 shadow-lg"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-[#480360]" />
                            <span>Learning Progress</span>
                        </h3>
                        <div className="space-y-4">
                            {enrolledCourses.map(course => (
                                <div key={course.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">{course.title}</span>
                                        <span className="text-gray-600">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-[#480360] to-[#a14097] h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Certificates */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="bg-white rounded-xl p-6 shadow-lg"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <Award className="h-5 w-5 text-yellow-500" />
                            <span>Your Certificates</span>
                        </h3>
                        <div className="space-y-4">
                            {certificates.map(cert => (
                                <div key={cert.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{cert.title}</h4>
                                            <p className="text-sm text-gray-600">Earned on {new Date(cert.dateEarned).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-500">ID: {cert.verificationId}</p>
                                        </div>
                                        <Award className="h-6 w-6 text-yellow-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {certificates.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Award className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>No certificates earned yet</p>
                                <p className="text-sm">Complete courses to earn certificates!</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
