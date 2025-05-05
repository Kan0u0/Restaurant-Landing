// components/Settings/Settings.jsx
import React, { useState } from 'react';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { FaMoon, FaSun, FaCheck, FaUserCircle, FaEnvelope, FaLock, FaCog } from 'react-icons/fa';

const Settings = ({ user, darkMode, toggleDarkMode }) => {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsUpdating(true);
    
    try {
      // Update display name
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Update email (requires reauthentication)
      if (email !== user.email && currentPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, email);
      }
      
      // Update password (requires reauthentication)
      if (newPassword && newPassword === confirmPassword && currentPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else if (newPassword && newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto`}>
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded-lg mr-3">
            <FaCog />
          </span>
          Settings
        </h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 shadow-sm">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded mb-4 flex items-center shadow-sm">
            <FaCheck className="mr-2" /> {successMessage}
          </div>
        )}
        
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
            <span className="p-1 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300 mr-2">
              <FaSun className="w-5 h-5" />
            </span>
            Appearance
          </h2>
          <div className="flex flex-wrap items-center">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-blue-300' 
                  : 'bg-gray-100 text-blue-600'
              } transition-colors shadow-sm hover:shadow-md`}
            >
              {darkMode ? (
                <>
                  <FaSun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <FaMoon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
              Change the appearance of Samsung Notes
            </span>
          </div>
        </div>
        
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
              <span className="p-1 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300 mr-2">
                <FaUserCircle className="w-5 h-5" />
              </span>
              Account Information
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
              {email !== user.email && (
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 flex items-center">
                  <FaLock className="w-3 h-3 mr-1" /> 
                  You'll need to provide your current password to change your email
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
              <span className="p-1 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300 mr-2">
                <FaLock className="w-5 h-5" />
              </span>
              Change Password
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaLock className="w-3 h-3 mr-1" /> Passwords don't match
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <FaCheck className="w-4 h-4" />
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;