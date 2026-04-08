import { Table } from 'react-bootstrap';

const Transactions = () => {
  return (
    <div>
      <h1>Transactions</h1>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2026-04-08</td>
            <td>Grocery Store</td>
            <td>Food</td>
            <td>-$85.00</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Transactions;