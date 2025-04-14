import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import TaskManager from './components/Taskmanager';
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Optional: Loading screen while checking auth
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/signin" />} />

        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Route */}
        <Route
          path="/tasks"
          element={user ? <TaskManager /> : <Navigate to="/signin" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
