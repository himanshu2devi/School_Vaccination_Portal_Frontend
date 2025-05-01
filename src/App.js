import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentPage';
import DriveManagementPage from './pages/DriveManagement';
import ReportPage from './pages/ReportPage';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        setLoggedIn(false);
      }
    }
  }, []);

  return (
    <Router>
      <div style={{ padding: '2rem' }}>
        <Routes>
          {/* Redirect root to login or dashboard based on auth */}
          <Route path="/" element={<Navigate to={loggedIn ? "/dashboard" : "/login"} />} />

          {/* Auth pages */}
          <Route path="/login" element={<LoginForm onLoginSuccess={() => setLoggedIn(true)} />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={loggedIn ? <Dashboard setLoggedIn={setLoggedIn} /> : <Navigate to="/login" />} />
          <Route path="/students" element={loggedIn ? <StudentsPage /> : <Navigate to="/login" />} />
          <Route path="/drives" element={loggedIn ? <DriveManagementPage /> : <Navigate to="/login" />} />
          <Route path="/report" element={loggedIn ? <ReportPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;