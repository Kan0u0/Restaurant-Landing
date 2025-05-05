import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Pages & Components
import SignUp from './components/Auth/Signup';
import SignIn from './components/Auth/Signin';
import NoteEditor from './components/Notes/NoteEditor';
import NotesDashboard from './components/Notes/NotesDashboard';
import NewNoteForm from './components/Notes/NewNoteForm';
import PublicNote from './components/Notes/PublicNote';
import NavBar from './components/layout/Navbar';
import Profile from './components/Profile';
import Settings from './components/Settings';

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference on initial load
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setCheckingAuth(false);
      },
      (error) => {
        console.error('Auth state error:', error);
        setCheckingAuth(false);
      }
    );
    
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    // Save dark mode preference to localStorage
    localStorage.setItem('darkMode', darkMode);
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <p className="text-lg text-gray-800 dark:text-gray-200">Loading Notes...</p>
      </div>
    );
  }
  
  return (
    <Router>
      <div className="app-container min-h-screen">
        {/* Show NavBar on all routes except signin/signup */}
        {user && <NavBar user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        
        <Routes>
          {/* Auth Routes */}
          <Route 
            path="/signup" 
            element={!user ? <SignUp darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/notes" />} 
          />
          <Route 
            path="/signin" 
            element={!user ? <SignIn darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/notes" />} 
          />
          
          {/* Notes Routes */}
          <Route 
            path="/" 
            element={user ? <Navigate to="/notes" /> : <Navigate to="/signin" />} 
          />
          <Route 
            path="/notes" 
            element={
              user ? (
                <div className="pt-16 min-h-screen bg-white dark:bg-gray-900">
                  <NotesDashboard user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </div>
              ) : (
                <Navigate to="/signin" />
              )
            } 
          />
          <Route 
            path="/note/:id" 
            element={
              user ? (
                <div className="pt-16 min-h-screen bg-white dark:bg-gray-900">
                  <NoteEditor user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </div>
              ) : (
                <Navigate to="/signin" />
              )
            } 
          />
          <Route 
            path="/new-note" 
            element={
              user ? (
                <div className="pt-16 min-h-screen bg-white dark:bg-gray-900">
                  <NewNoteForm user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </div>
              ) : (
                <Navigate to="/signin" />
              )
            } 
          />
          
          {/* Profile and Settings Routes */}
          <Route 
            path="/profile" 
            element={
              user ? (
                <div className="pt-16 min-h-screen bg-white dark:bg-gray-900">
                  <Profile user={user} darkMode={darkMode} />
                </div>
              ) : (
                <Navigate to="/signin" />
              )
            } 
          />
          <Route 
            path="/settings" 
            element={
              user ? (
                <div className="pt-16 min-h-screen bg-white dark:bg-gray-900">
                  <Settings user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </div>
              ) : (
                <Navigate to="/signin" />
              )
            } 
          />
          
          {/* Public Note Route */}
          <Route 
            path="/public/:id" 
            element={
              <div className={darkMode ? "dark" : ""}>
                <div className="min-h-screen bg-white dark:bg-gray-900">
                  {user && <NavBar user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
                  <div className={user ? "pt-16" : ""}>
                    <PublicNote darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                  </div>
                </div>
              </div>
            } 
          />
          
          {/* Default Route */}
          <Route 
            path="*" 
            element={<Navigate to={user ? "/notes" : "/signin"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;