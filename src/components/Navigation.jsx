import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.jsx';
import { 
    Home, 
    Info, 
    BookOpen, 
    HelpCircle, 
    LayoutDashboard, 
    User, 
    Menu, 
    X 
} from 'lucide-react';
import faviconImage from '../assets/images/favicon (1).ico';

const Navigation = () => {
    const { isAuthenticated } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userProfileImage, setUserProfileImage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Home', icon: Home, path: '/home' },
        { name: 'About', icon: Info, path: '/about' },
        { name: 'Resources', icon: BookOpen, path: '/resources' },
        { name: 'Help', icon: HelpCircle, path: '/help' },
        ...(isAuthenticated ? [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }
        ] : [])
    ];

    // Load profile image from localStorage
    useEffect(() => {
        const savedImage = localStorage.getItem('userProfileImage');
        setUserProfileImage(savedImage);
        
        // Listen for storage changes to update profile image
        const handleStorageChange = () => {
            const newImage = localStorage.getItem('userProfileImage');
            setUserProfileImage(newImage);
        };
        
        // Listen for both storage events and custom events
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('profileImageUpdated', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('profileImageUpdated', handleStorageChange);
        };
    }, [isAuthenticated]);
    
    // Refresh profile image when auth state changes
    useEffect(() => {
        if (isAuthenticated) {
            const savedImage = localStorage.getItem('userProfileImage');
            setUserProfileImage(savedImage);
        } else {
            setUserProfileImage(null);
        }
    }, [isAuthenticated]);
    
    // Custom profile navigation item
    const ProfileNavItem = ({ isMobile = false }) => {
        if (!isAuthenticated) return null;
        
        const baseClasses = isMobile 
            ? `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive('/profile')
                    ? 'bg-[#480360] text-white'
                    : 'text-gray-700 hover:bg-[#E6FFFA] hover:text-[#480360]'
            }`
            : `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive('/profile')
                    ? 'bg-[#480360] text-white'
                    : 'text-gray-700 hover:bg-[#E6FFFA] hover:text-[#480360]'
            }`;
        
        return (
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Link
                    to="/profile"
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    className={baseClasses}
                >
                    <div className={`rounded-full overflow-hidden ${isMobile ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`}>
                        {userProfileImage ? (
                            <img 
                                src={userProfileImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                        )}
                    </div>
                    <span>Profile</span>
                </Link>
            </motion.div>
        );
    };

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-[100] backdrop-blur-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div 
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link to="/home" className="flex items-center space-x-2">
                            <img 
                                src={faviconImage} 
                                alt="AlgoAliens Logo" 
                                className="h-8 w-8"
                            />
                            <span className="text-xl font-bold text-[#480360]">
                                AlgoAliens
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <motion.div
                                    key={item.name}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to={item.path}
                                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                            isActive(item.path)
                                                ? 'bg-[#480360] text-white'
                                                : 'text-gray-700 hover:bg-[#E6FFFA] hover:text-[#480360]'
                                        }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                </motion.div>
                            ))}
                            
                            {/* Custom Profile Navigation Item */}
                            <ProfileNavItem />
                            
                            {!isAuthenticated && (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/login"
                                        className="bg-[#480360] hover:bg-[#a14097] text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                                    >
                                        Login
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#480360] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#480360]"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <motion.div 
                className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                    opacity: isMobileMenuOpen ? 1 : 0, 
                    height: isMobileMenuOpen ? 'auto' : 0 
                }}
                transition={{ duration: 0.3 }}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 fixed top-16 left-0 right-0 z-[99]">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                                isActive(item.path)
                                    ? 'bg-[#480360] text-white'
                                    : 'text-gray-700 hover:bg-[#E6FFFA] hover:text-[#480360]'
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                    
                    {/* Custom Profile Navigation Item for Mobile */}
                    <ProfileNavItem isMobile={true} />
                    
                    {!isAuthenticated && (
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium bg-[#480360] text-white hover:bg-[#a14097] transition-all duration-200"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </motion.div>
        </motion.nav>
    );
};

export default Navigation;