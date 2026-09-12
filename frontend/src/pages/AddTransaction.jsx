import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';
import '../index.css';

const CATEGORIES = ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Health', 'Education', 'Salary', 'Freelance', 'Other'];

export default function AddTransaction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'Expense',
    amount: '',
    category: 'Food',
    description: '',
    paymentMethod: 'Cash',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', formData);
      toast.success('Transaction added successfully!');
      navigate('/'); // Go back to dashboard
    } catch (error) {
      toast.error('Failed to add transaction');
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="page-header">
          <PlusCircle color="#2563eb" size={32} />
          <h2>Add Transaction</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            
            {/* Type Selection */}
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" name="amount" required min="1" value={formData.amount} onChange={handleChange}
                className="input-field" placeholder="Enter amount" />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="input-field" />
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label>Payment Method</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="input-field">
                <option value="Cash">Cash</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label>Description (Optional)</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange}
              className="input-field" placeholder="What was this for?" />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn-primary">
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}