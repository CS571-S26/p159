import { Card } from 'react-bootstrap';

const SummaryCard = ({ title, amount, color }) => {
  return (
    <Card border={color} className="text-center shadow-sm">
      <Card.Body>
        <Card.Title className="text-muted small uppercase">{title}</Card.Title>
        <Card.Text className="h2 font-weight-bold">{amount}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default SummaryCard;