import { useState, useEffect } from 'react';
import { Row, Col, Container, Card, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import SpendingChart from '../components/SpendingChart';
import BudgetProgress from '../components/BudgetProgress';
import LoadingScreen from '../components/LoadingScreen';
import BudgetModal from '../components/BudgetModal';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Initialize budgets from localStorage or use defaults
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('userBudgets');
    return saved ? JSON.parse(saved) : { Food: 500, Entertainment: 200, Utilities: 150 };
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/transactions/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/login');
          throw new Error('Session expired. Please login again.');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data.');
        }
        return response.json();
      })
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Dashboard Error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [navigate]);

  // Function to save new budget limits
  const handleSaveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    localStorage.setItem('userBudgets', JSON.stringify(newBudgets));
  };

  // --- Financial Logic ---
  const incomeTransactions = transactions.filter(t => parseFloat(t.amount) > 0);
  const expenseTransactions = transactions.filter(t => parseFloat(t.amount) < 0);

  const totalIncome = incomeTransactions.reduce((acc, t) => acc + parseFloat(t.amount), 0);
  const totalExpenses = expenseTransactions.reduce((acc, t) => acc + Math.abs(parseFloat(t.amount)), 0);
  const netBalance = totalIncome - totalExpenses;

  // Smart Insights (Data Science / Economics logic)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const avgExpense = expenseTransactions.length > 0 ? totalExpenses / expenseTransactions.length : 0;

  if (loading) {
    return <LoadingScreen message="Analyzing your financial records..." />;
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-0">Financial Overview</h1>
          <p className="text-muted mb-0">Insights based on your recent activity</p>
        </div>
        <Button 
          variant="outline-primary" 
          className="fw-bold px-4 shadow-sm"
          onClick={() => setShowModal(true)}
        >
          Set Budgets
        </Button>
      </div>
      
      {error && <Alert variant="warning" className="mb-4 shadow-sm">{error}</Alert>}

      {/* Summary Section */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <SummaryCard 
            title="Net Balance" 
            amount={`$${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
            color={netBalance >= 0 ? "success" : "danger"} 
          />
        </Col>
        <Col md={4}>
          <SummaryCard 
            title="Savings Rate" 
            amount={`${savingsRate.toFixed(1)}%`} 
            color="info" 
          />
        </Col>
        <Col md={4}>
          <SummaryCard 
            title="Avg. Expense" 
            amount={`$${avgExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
            color="warning" 
          />
        </Col>
      </Row>

      <Row className="g-4">
        {/* Visual Analytics */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="fw-bold mb-4">Spending by Category</Card.Title>
              {expenseTransactions.length > 0 ? (
                <SpendingChart transactions={transactions} />
              ) : (
                <div className="text-center py-5 text-muted">
                  <p>Add transactions to view your spending breakdown.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Dynamic Budgets Section */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-4 bg-white">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Monthly Budgets</Card.Title>
              <BudgetProgress 
                transactions={transactions} 
                category="Food" 
                limit={budgets.Food} 
              />
              <BudgetProgress 
                transactions={transactions} 
                category="Entertainment" 
                limit={budgets.Entertainment} 
              />
              <BudgetProgress 
                transactions={transactions} 
                category="Utilities" 
                limit={budgets.Utilities} 
              />
              <p className="small text-center text-muted mt-3">
                Change these limits by clicking "Set Budgets"
              </p>
            </Card.Body>
          </Card>

          {/* Goal Tracker */}
          <Card className="shadow-sm border-0 bg-primary text-white">
            <Card.Body className="text-center py-4">
              <Card.Subtitle className="mb-2 opacity-75">Ultimate Savings Goal</Card.Subtitle>
              <Card.Title className="display-6 fw-bold mb-0">$10,000.00</Card.Title>
              <hr className="my-3 opacity-25" />
              <p className="small mb-0">
                You have reached <strong>{Math.max(0, (netBalance / 10000) * 100).toFixed(1)}%</strong> of your goal.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Budget Settings Modal */}
      <BudgetModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        currentBudgets={budgets} 
        onSave={handleSaveBudgets} 
      />
    </Container>
  );
};

export default Dashboard;