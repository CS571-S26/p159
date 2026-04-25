import { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

const TransactionForm = ({ onTransactionAdded }) => {
    const [formData, setFormData] = useState({
        amount: '',
        title: '', // MUST be 'title' to match your Django model
        category: 'Food',
        date: new Date().toISOString().split('T')[0] // Defaults to YYYY-MM-DD
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('accessToken');
        const API_URL = "https://budgetly-backend-4y3s.onrender.com";

        // Construct the payload ensuring field names are correct
        const payload = {
            title: formData.title,
            amount: parseFloat(formData.amount),
            category: formData.category,
            date: formData.date
        };

        try {
            const response = await fetch(`${API_URL}/api/transactions/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Reset form on success
                setFormData({
                    amount: '',
                    title: '',
                    category: 'Food',
                    date: new Date().toISOString().split('T')[0]
                });
                
                // Refresh the transaction list on the parent page
                if (onTransactionAdded) onTransactionAdded();
            } else {
                const data = await response.json();
                // Display specific field errors if they exist (e.g., if title is still missing)
                const errorMsg = data.title ? `Title: ${data.title[0]}` : (data.detail || "Check your inputs.");
                setError(errorMsg);
            }
        } catch (err) {
            setError("Network error. Ensure your Render backend is awake.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm mb-4 border-0">
            <Card.Body>
                <Card.Title className="mb-3 fw-bold">Add New Transaction</Card.Title>
                
                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title" // Crucial: must be 'title'
                                    value={formData.title} // Crucial: must be 'title'
                                    onChange={handleChange}
                                    placeholder="e.g. Groceries, Rent"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Amount ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange}
                                >
                                    <option value="Food">Food</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" disabled={loading} className="fw-bold">
                            {loading ? 'Adding...' : 'Add Transaction'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default TransactionForm;