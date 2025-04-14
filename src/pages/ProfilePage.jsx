import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../styles/animations';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <motion.div 
      className="container mx-auto p-4"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold mr-4">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
            <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Account Details</h3>
          <p className="text-gray-500">Profile management features coming soon!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
