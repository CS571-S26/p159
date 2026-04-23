import { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', // Changed from 'name' to match Django User model
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        // This will now show specific errors like "Username already taken"
        setError(data.username || data.email || 'Registration failed.');
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError('Cannot connect to the server. Is the backend running at 127.0.0.1:8000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Create Account</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                name="username" // Matches the state key
                placeholder="Enter username" 
                value={formData.username}
                onChange={handleChange}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                placeholder="Enter email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </Form.Group>

            <Button className="w-100" type="submit" variant="success" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;