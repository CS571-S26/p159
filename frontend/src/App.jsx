import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'; // Added useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your pages
import Dashboard from './pages/Dashboards';
import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Hook for internal navigation

  useEffect(() => {
    // Check if a token exists in local storage on load
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    // Use navigate instead of window.location.href to avoid 404s
    navigate('/login'); 
  };

  return (
    <>
      {/* NOTE: <BrowserRouter> was removed here because it's now in main.jsx.
        We also don't need 'basename' anymore because HashRouter handles it!
      */}
      
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
          {/* Routes remain simple; the '#' handles the folder path automatically */}
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </div>
    </>
  );
}

export default App;