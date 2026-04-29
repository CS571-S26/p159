import { Spinner, Container } from 'react-bootstrap';

const LoadingScreen = ({ message = "Accessing your financial records..." }) => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
      <Spinner 
        animation="border" 
        variant="primary" 
        role="status" 
        style={{ width: '3rem', height: '3rem' }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3 text-muted fw-semibold animate-pulse">
        {message}
      </p>
    </Container>
  );
};

export default LoadingScreen;