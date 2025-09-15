import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation.jsx';
import { User, Edit3, Lock, LogOut, Camera, Loader2 } from 'lucide-react';

const ProfilePage = () => {
    const { setIsAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [profile, setProfile] = useState({
        name: '',
        username: '',
        email: '',
        bio: '',
        profileImage: null,
        joinDate: '',
        interests: [],
        goals: [],
        fieldOfStudy: [],
        collegeDetails: ''
    });

    const [editedProfile, setEditedProfile] = useState({ ...profile });

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:4000/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Failed to fetch profile');
                }

                const userData = await response.json();
                
                // Format the user data
                const formattedProfile = {
                    name: userData.user?.firstName && userData.user?.lastName 
                        ? `${userData.user.firstName} ${userData.user.lastName}`
                        : userData.user?.username || 'User',
                    username: userData.user?.username || userData.user?.email || 'user',
                    email: userData.user?.email || '',
                    bio: userData.user?.bio || 'No bio available',
                    profileImage: userData.user?.profileImage || null,
                    joinDate: userData.user?.createdAt ? new Date(userData.user.createdAt).toLocaleDateString() : 'Unknown',
                    interests: userData.user?.interests || [],
                    goals: userData.user?.goals || [],
                    fieldOfStudy: userData.user?.fieldOfStudy || [],
                    collegeDetails: userData.user?.collegeDetails || ''
                };

                setProfile(formattedProfile);
                setEditedProfile(formattedProfile);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: editedProfile.username,
                    bio: editedProfile.bio
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            setProfile({ ...editedProfile });
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden pt-16">
                <Navigation />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <Loader2 className="animate-spin h-12 w-12 text-[#480360] mx-auto mb-4" />
                        <p className="text-gray-600">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden pt-16">
                <Navigation />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-[#480360] text-white px-4 py-2 rounded-lg hover:bg-[#a14097] transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden pt-16">
            <Navigation />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-br from-[#480360] to-[#a14097] px-8 py-12">
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    {profile.profileImage ? (
                                        <img 
                                            src={profile.profileImage} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-16 w-16 text-gray-400" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
                                    <Camera className="h-4 w-4 text-gray-600" />
                                    <input type="file" accept="image/*" className="hidden" />
                                </label>
                            </div>
                            
                            <div className="text-center md:text-left text-white">
                                <h1 className="text-3xl font-bold">{profile.name}</h1>
                                <p className="text-lg text-gray-200">@{profile.username}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center space-x-2 bg-[#480360] text-white px-4 py-2 rounded-lg hover:bg-[#a14097] transition-colors"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        <span>Edit Profile</span>
                                    </button>
                                    <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                                        <Lock className="h-4 w-4" />
                                        <span>Change Password</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditedProfile({ ...profile });
                                        }}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Profile Information */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.name}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#480360]"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profile.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.username}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#480360]"
                                    />
                                ) : (
                                    <p className="text-gray-900">@{profile.username}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editedProfile.email}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#480360]"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profile.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                {isEditing ? (
                                    <textarea
                                        value={editedProfile.bio}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#480360]"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profile.bio}</p>
                                )}
                            </div>

                            {/* Member Since */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                                <p className="text-gray-900">{profile.joinDate}</p>
                            </div>

                            {/* College/University */}
                            {profile.collegeDetails && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">College/University</label>
                                    <p className="text-gray-900">{profile.collegeDetails}</p>
                                </div>
                            )}

                            {/* Interests */}
                            {profile.interests && profile.interests.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.interests.map((interest, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#480360] text-white"
                                            >
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Goals */}
                            {profile.goals && profile.goals.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals</label>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.goals.map((goal, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#a14097] text-white"
                                            >
                                                {goal}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Field of Study */}
                            {profile.fieldOfStudy && profile.fieldOfStudy.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.fieldOfStudy.map((field, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white"
                                            >
                                                {field}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;