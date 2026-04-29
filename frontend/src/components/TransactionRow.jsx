import { Button } from 'react-bootstrap';

const TransactionRow = ({ transaction, onDelete }) => {
  const amount = parseFloat(transaction.amount);
  const isExpense = amount < 0;

  return (
    <tr className="align-middle">
      <td className="ps-3">{transaction.date}</td>
      <td className="fw-semibold">
        {transaction.description || transaction.title || "No Description"}
      </td>
      <td>
        <span className="badge bg-light text-dark border">
          {transaction.category}
        </span>
      </td>
      <td className={`fw-bold ${isExpense ? 'text-danger' : 'text-success'}`}>
        {isExpense ? '-' : ''}${Math.abs(amount).toFixed(2)}
      </td>
      <td className="text-center">
        <Button 
          variant="outline-danger" 
          size="sm" 
          className="rounded-pill px-3"
          onClick={() => onDelete(transaction.id)}
          aria-label={`Delete ${transaction.title}`}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default TransactionRow;