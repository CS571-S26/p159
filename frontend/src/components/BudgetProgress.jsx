import { ProgressBar, Card } from 'react-bootstrap';

const BudgetProgress = ({ transactions, category, limit }) => {
    const totalSpent = transactions
        .filter(t => t.category === category && parseFloat(t.amount) < 0)
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

    const percentage = Math.min((totalSpent / limit) * 100, 100);
    
    // Choose color based on percentage
    const variant = percentage > 90 ? 'danger' : percentage > 70 ? 'warning' : 'success';

    return (
        <Card className="mb-3 shadow-sm border-0">
            <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">{category} Budget</span>
                    <span className="text-muted">${totalSpent.toFixed(2)} / ${limit}</span>
                </div>
                <ProgressBar now={percentage} variant={variant} label={`${percentage.toFixed(0)}%`} />
            </Card.Body>
        </Card>
    );
};

export default BudgetProgress;