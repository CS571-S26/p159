import { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Grab the token from local storage
    const token = localStorage.getItem('accessToken');

    // 2. If no token exists, redirect to login immediately
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/transactions/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 3. Attach the "Key" (JWT Token) to the request
        'Authorization': `Bearer ${token}`
      },
    })
      .then((response) => {
        if (response.status === 401) {
          // Token is expired or invalid
          localStorage.removeItem('accessToken');
          navigate('/login');
          throw new Error('Session expired. Please login again.');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data.');
        }
        return response.json();
      })
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Dashboard Error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [navigate]);

  // Logic to calculate totals
  const calculateTotalBalance = () => {
    return transactions.reduce((acc, item) => acc + parseFloat(item.amount), 0);
  };

  const calculateMonthlySpending = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      })
      .reduce((acc, item) => acc + parseFloat(item.amount), 0);
  };

  if (loading) {
    return (
      <div className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading Budgetly Data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Financial Dashboard</h1>
      
      {error && <Alert variant="warning" className="mt-3">{error}</Alert>}

      <Row className="mt-4">
        <Col md={4}>
          <SummaryCard 
            title="Total Balance" 
            amount={`$${calculateTotalBalance().toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
            color="success" 
          />
        </Col>
        <Col md={4}>
          <SummaryCard 
            title="Monthly Spending" 
            amount={`$${calculateMonthlySpending().toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
            color="danger" 
          />
        </Col>
        <Col md={4}>
          <SummaryCard 
            title="Savings Goal" 
            amount="$10,000.00" 
            color="primary" 
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;