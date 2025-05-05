import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/notes');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header/Logo */}
      <div className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
          MyNotes
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Your ideas, organized and beautiful</p>
      </div>

      {/* Card Container */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
            <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>
            <p className="text-purple-100 text-center mt-2">Sign in to access your notes</p>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded mb-6 flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <Link to="/password-reset" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account yet?{' '}
                <Link to="/signup" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Optional: Social proof or benefits */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold">100%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Secure</div>
                </div>
                <div className="text-center">
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold">Free</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Basic Plan</div>
                </div>
                <div className="text-center">
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold">24/7</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} MyNotes. All rights reserved.
      </div>
    </div>
  );
};

export default SignIn;
