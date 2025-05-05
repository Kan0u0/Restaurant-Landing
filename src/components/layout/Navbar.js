// components/layout/NavBar.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { 
  FaMoon, 
  FaSun, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes, 
  FaStickyNote,
  FaUser,
  FaCog 
} from 'react-icons/fa';

export default function NavBar({ darkMode, toggleDarkMode, user }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMobileMenu &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('Sign out successful, navigating to /signin');
        // Add a small delay to ensure auth state updates
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 100);
      })
      .catch((error) => console.error('Error signing out:', error));
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' 
          : 'py-3 bg-white dark:bg-gray-900'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-lg transform transition-transform group-hover:rotate-12 duration-300">
            <FaStickyNote className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            NotesApp
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {/* Navigation Links */}
          {user && (
            <>
              <Link 
                to="/profile" 
                className="px-3 py-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-1"
              >
                <FaUser className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link 
                to="/settings" 
                className="px-3 py-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-1"
              >
                <FaCog className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </>
          )}
        
          {/* Status indicator if user is logged in */}
          {user && (
            <div className="flex items-center gap-2 ml-2 border-l border-gray-200 dark:border-gray-700 pl-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.email ? user.email.split('@')[0] : 'User'}
              </span>
            </div>
          )}
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FaSun className="w-5 h-5" />
            ) : (
              <FaMoon className="w-5 h-5" />
            )}
          </button>

          {/* Logout (only show if user is logged in) */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            ref={mobileMenuButtonRef}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none transition-colors"
          >
            {showMobileMenu ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {showMobileMenu && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg overflow-hidden z-40"
        >
          <div className="flex flex-col p-2 gap-2">
            {/* User info */}
            {user && (
              <div className="flex items-center gap-2 p-3 border-b border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium dark:text-white">
                    {user.displayName || (user.email ? user.email.split('@')[0] : 'User')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email || 'No email'}
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile Navigation Links */}
            {user && (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-900 dark:text-white">Profile</span>
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaCog className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-900 dark:text-white">Settings</span>
                </Link>
              </>
            )}
            
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <>
                  <FaSun className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white">Light Mode</span>
                </>
              ) : (
                <>
                  <FaMoon className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900 dark:text-white">Dark Mode</span>
                </>
              )}
            </button>
            
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaSignOutAlt className="w-5 h-5 text-red-500" />
                <span className="text-gray-900 dark:text-white">Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}