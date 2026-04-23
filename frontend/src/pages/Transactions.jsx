import { useState, useEffect, useCallback } from 'react';
import { Table, Spinner, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm'; // 1. Added Import

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 2. Wrapped fetch in useCallback so it can be reused by the form
  const fetchTransactions = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    const API_URL = "https://budgetly-backend-4y3s.onrender.com";

    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${API_URL}/api/transactions/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/login');
          throw new Error('Your session has expired. Please log in again.');
        }
        if (!response.ok) {
          throw new Error('Could not fetch transactions.');
        }
        return response.json();
      })
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load transactions.');
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <Container>
      <h1 className="mb-4">Transactions</h1>

      {/* 3. Integrated the Interactivity Component */}
      <TransactionForm onTransactionAdded={fetchTransactions} />

      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Accessing your financial records...</p>
        </div>
      )}

      {error && <Alert variant="danger" className="mt-3 shadow-sm">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover className="mt-3 shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  {/* Note: I used t.description to match the Form, change to t.title if needed */}
                  <td>{t.description || t.title}</td>
                  <td>{t.category}</td>
                  <td style={{ 
                    color: parseFloat(t.amount) < 0 ? '#dc3545' : '#198754',
                    fontWeight: 'bold'
                  }}>
                    {parseFloat(t.amount) < 0 ? '-' : ''}${Math.abs(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  No transactions found for this user. Try adding one above!
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Transactions;