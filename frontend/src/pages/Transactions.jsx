import { useState, useEffect, useCallback } from 'react';
import { Table, Container, Form, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';
import TransactionRow from '../components/TransactionRow';
import LoadingScreen from '../components/LoadingScreen';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // NEW: State for Search and Filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  
  const navigate = useNavigate();

  const fetchTransactions = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    const API_URL = import.meta.env.VITE_API_URL;

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

  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');
    const API_URL = import.meta.env.VITE_API_URL;

    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/transactions/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchTransactions();
      } else {
        alert("Failed to delete the transaction.");
      }
    } catch (err) {
      alert("Network error. Could not delete transaction.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // --- Filtering Logic ---
  const filteredData = transactions.filter(t => {
    const description = (t.description || t.title || "").toLowerCase();
    const matchesSearch = description.includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingScreen message="Loading your transaction history..." />;
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 fw-bold">Transactions</h1>

      {/* Add Transaction Section */}
      <TransactionForm onTransactionAdded={fetchTransactions} />

      {/* Search and Filter Section */}
      <Row className="my-4 g-3">
        <Col md={8}>
          <Form.Group>
            <Form.Label className="small text-muted fw-bold">SEARCH BY DESCRIPTION</Form.Label>
            <Form.Control 
              type="text"
              placeholder="e.g. Starbucks, Rent..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="shadow-sm"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label className="small text-muted fw-bold">FILTER BY CATEGORY</Form.Label>
            <Form.Select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="shadow-sm"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mt-3 shadow-sm">{error}</Alert>}

      {/* Results Table */}
      <div className="table-responsive">
        <Table striped hover borderless className="mt-2 shadow-sm align-middle bg-white rounded">
          <thead className="table-dark">
            <tr>
              <th className="ps-3">Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((t) => (
                <TransactionRow 
                  key={t.id} 
                  transaction={t} 
                  onDelete={handleDelete} 
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-5">
                  {transactions.length === 0 
                    ? "No transactions yet. Start by adding one above!" 
                    : "No transactions match your search filters."}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Transactions;