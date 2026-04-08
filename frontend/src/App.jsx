import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure bootstrap is imported

// Import your pages
import Dashboard from './pages/Dashboards';
import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';

function App() {
  return (
    <BrowserRouter>
      {/* 1. Primary Navigation Bar (Requirement) */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/dashboard">Budgetly</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/transactions">Transactions</Link>
            <Link className="nav-link" to="/login">Login</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* 2. Routing Logic (Requirement) */}
        <Routes>
          <Route path="/" element={<Login />} />
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