import { Row, Col } from 'react-bootstrap';
import SummaryCard from '../components/SummaryCard';

const Dashboard = () => {
  return (
    <div>
      <h1>Financial Dashboard</h1>
      <Row className="mt-4">
        {/* Using a custom component here adds to your component count */}
        <Col md={4}><SummaryCard title="Total Balance" amount="$5,240.00" color="success" /></Col>
        <Col md={4}><SummaryCard title="Monthly Spending" amount="$1,120.50" color="danger" /></Col>
        <Col md={4}><SummaryCard title="Savings Goal" amount="$10,000" color="primary" /></Col>
      </Row>
    </div>
  );
};

export default Dashboard;