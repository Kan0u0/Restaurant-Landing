// components/Profile/Profile.jsx
import React from 'react';
import { FaUser, FaEnvelope, FaCalendarAlt, FaSignInAlt, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Profile = ({ user, darkMode }) => {
  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : 'U';
  
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto`}>
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded-lg mr-3">
            <FaUser />
          </span>
          User Profile
        </h1>

        {/* Profile Header with Avatar */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="User profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold">
                {userInitial}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700 cursor-pointer shadow-md transition-colors">
              <FaEdit size={16} />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
            {user.displayName || user.email?.split('@')[0] || 'User'}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {user.email || 'No email available'}
          </span>
        </div>

        {/* Profile Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Display Name */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300 mr-3">
                <FaUser className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Display Name</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-100 ml-12">
              {user.displayName || 'Not set'}
            </p>
          </div>

          {/* Email */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300 mr-3">
                <FaEnvelope className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Email</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-100 ml-12">
              {user.email || 'Not available'}
            </p>
          </div>

          {/* Account Created */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300 mr-3">
                <FaCalendarAlt className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Account Created</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-100 ml-12">
              {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
            </p>
          </div>

          {/* Last Sign In */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300 mr-3">
                <FaSignInAlt className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Last Sign In</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-100 ml-12">
              {user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>

        {/* Settings Link */}
        <div className="flex justify-center mt-6">
          <Link
            to="/settings"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
          >
            <FaEdit className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;