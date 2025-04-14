import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../styles/animations';

const SettingsPage = () => {
  return (
    <motion.div 
      className="container mx-auto p-4"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Preferences</h2>
          <div className="flex items-center justify-between py-2 border-b">
            <span>Dark Mode</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span>Notifications</span>
            <label className="switch">
              <input type="checkbox" checked />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <p className="text-gray-500">More settings options coming soon!</p>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
