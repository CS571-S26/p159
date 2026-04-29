import { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, ButtonGroup, ToggleButton } from 'react-bootstrap';

const TransactionForm = ({ onTransactionAdded }) => {
    const [formData, setFormData] = useState({
        amount: '',
        title: '',
        category: 'Food',
        type: 'expense', // New state to track Income vs Expense
        date: new Date().toISOString().split('T')[0]
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
        const API_URL = import.meta.env.VITE_API_URL;

        // Logic: If it's an expense, make the number negative
        let finalAmount = parseFloat(formData.amount);
        if (formData.type === 'expense') {
            finalAmount = -Math.abs(finalAmount); 
        } else {
            finalAmount = Math.abs(finalAmount);
        }

        const payload = {
            title: formData.title,
            amount: finalAmount,
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
                setFormData({
                    amount: '',
                    title: '',
                    category: 'Food',
                    type: 'expense',
                    date: new Date().toISOString().split('T')[0]
                });
                if (onTransactionAdded) onTransactionAdded();
            } else {
                setError("Failed to add transaction. Check your inputs.");
            }
        } catch (err) {
            setError("Network error. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm mb-4 border-0">
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="align-items-end">
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted">TYPE</Form.Label>
                                <Form.Select 
                                    name="type" 
                                    value={formData.type} 
                                    onChange={handleChange}
                                    className="border-primary text-primary fw-bold"
                                >
                                    <option value="expense">Expense (-)</option>
                                    <option value="income">Income (+)</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted">DESCRIPTION</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Groceries"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted">AMOUNT ($)</Form.Label>
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

                    <Row className="align-items-end">
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted">CATEGORY</Form.Label>
                                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                                    <option value="Food">Food</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted">DATE</Form.Label>
                                <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Button variant="primary" type="submit" disabled={loading} className="w-100 mb-3 fw-bold">
                                {loading ? 'Saving...' : 'Add Transaction'}
                            </Button>
                        </Col>
                    </Row>
                    {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                </Form>
            </Card.Body>
        </Card>
    );
};

export default TransactionForm;