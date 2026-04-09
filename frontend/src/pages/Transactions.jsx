import { useState, useEffect } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get the token from storage
    const token = localStorage.getItem('accessToken');

    // 2. Redirect if the user isn't logged in
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://127.0.0.1:8000/api/transactions/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 3. Attach the JWT "Key"
        'Authorization': `Bearer ${token}`
      },
    })
      .then((response) => {
        // 4. Handle session expiration (Security Guard)
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

  return (
    <div>
      <h1 className="mb-4">Transactions</h1>

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
                  <td>{t.title}</td>
                  <td>{t.category}</td>
                  <td style={{ 
                    color: parseFloat(t.amount) < 0 ? '#dc3545' : '#198754', // Using Bootstrap colors
                    fontWeight: 'bold'
                  }}>
                    {parseFloat(t.amount) < 0 ? '-' : ''}${Math.abs(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  No transactions found for this user.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Transactions;