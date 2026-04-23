import { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

const TransactionForm = ({ onTransactionAdded }) => {
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: 'Food', // Default category
        date: new Date().toISOString().split('T')[0] // Defaults to today
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

        try {
            const response = await fetch(`${API_URL}/api/transactions/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Clear the form
                setFormData({
                    amount: '',
                    description: '',
                    category: 'Food',
                    date: new Date().toISOString().split('T')[0]
                });
                // Refresh the list in the parent component
                if (onTransactionAdded) onTransactionAdded();
            } else {
                const data = await response.json();
                setError(data.detail || "Failed to add transaction. Please check your inputs.");
            }
        } catch (err) {
            setError("Network error. Please ensure the backend is live.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm mb-4">
            <Card.Body>
                <Card.Title className="mb-3">Add New Transaction</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="e.g. Groceries"
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

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Transaction'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default TransactionForm;