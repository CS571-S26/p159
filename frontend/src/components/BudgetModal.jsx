import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const BudgetModal = ({ show, onHide, currentBudgets, onSave }) => {
  // Sync local state when the modal opens
  const [tempBudgets, setTempBudgets] = useState(currentBudgets);

  useEffect(() => {
    if (show) {
      setTempBudgets(currentBudgets);
    }
  }, [show, currentBudgets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert string to number, but handle empty string so the user can backspace
    const numericValue = value === '' ? '' : parseFloat(value);
    
    setTempBudgets({ 
      ...tempBudgets, 
      [name]: numericValue 
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Fallback to 0 if the user left a field empty
    const finalizedBudgets = {
      Food: tempBudgets.Food || 0,
      Entertainment: tempBudgets.Entertainment || 0,
      Utilities: tempBudgets.Utilities || 0,
    };
    onSave(finalizedBudgets);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold px-2">Set Monthly Budgets</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Body className="px-4">
          <Form.Group className="mb-3">
            <Form.Label className="text-muted small fw-bold">FOOD BUDGET ($)</Form.Label>
            <Form.Control 
              type="number" 
              name="Food" 
              value={tempBudgets.Food} 
              onChange={handleChange}
              onFocus={(e) => e.target.select()} // Auto-selects text on click to avoid "0200"
              min="0"
              placeholder="0"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted small fw-bold">ENTERTAINMENT BUDGET ($)</Form.Label>
            <Form.Control 
              type="number" 
              name="Entertainment" 
              value={tempBudgets.Entertainment} 
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              min="0"
              placeholder="0"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted small fw-bold">UTILITIES BUDGET ($)</Form.Label>
            <Form.Control 
              type="number" 
              name="Utilities" 
              value={tempBudgets.Utilities} 
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              min="0"
              placeholder="0"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4">
          <Button variant="secondary" onClick={onHide} className="fw-bold px-4">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="fw-bold px-4">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BudgetModal;