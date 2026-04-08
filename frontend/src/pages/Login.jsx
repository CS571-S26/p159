import { Form, Button, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Login to Budgetly</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required />
            </Form.Group>
            <Button className="w-100" type="submit" variant="primary">Login</Button>
          </Form>
          <div className="text-center mt-3">
            Need an account? <Link to="/register">Register</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;