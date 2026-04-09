import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your pages
import Dashboard from './pages/Dashboards';
import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';

function App() {
  // 1. Global state to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if a token exists in local storage on load
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    // 2. Updated to include the /p159 prefix for the hard refresh
    window.location.href = '/p159/login'; 
  };

  return (
    // 3. ADDED basename here so all <Link> and <Route> tags 
    // automatically prepend "/p159" to their URLs
    <BrowserRouter basename="/p159">
      
      {/* Primary Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/dashboard">Budgetly</Link>
          <div className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                <Link className="nav-link" to="/transactions">Transactions</Link>
                <button 
                  className="btn btn-outline-light btn-sm ms-lg-3" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">Login</Link>
                <Link className="nav-link" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Routing Logic */}
        <Routes>
          {/* These paths are now relative to /p159/ */}
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;