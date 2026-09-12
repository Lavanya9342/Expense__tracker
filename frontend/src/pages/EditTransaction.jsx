import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Edit3 } from 'lucide-react';

const CATEGORIES = ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Health', 'Education', 'Salary', 'Freelance', 'Other'];

export default function EditTransaction() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get transaction ID from URL
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'Expense', amount: '', category: 'Food', description: '', paymentMethod: 'Cash', date: ''
  });

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const { data } = await api.get(`/transactions/${id}`);
        setFormData({
          type: data.type,
          amount: data.amount,
          category: data.category,
          description: data.description || '',
          paymentMethod: data.paymentMethod,
          date: new Date(data.date).toISOString().split('T')[0] // Format for date input
        });
      } catch (error) {
        toast.error('Transaction not found');
        navigate('/transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/transactions/${id}`, formData);
      toast.success('Transaction updated!');
      navigate('/transactions');
    } catch (error) {
      toast.error('Failed to update transaction');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="page-header">
          <Edit3 color="#2563eb" size={32} />
          <h2>Edit Transaction</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" name="amount" required min="1" value={formData.amount} onChange={handleChange} className="input-field" />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="input-field" />
            </div>
            
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

          <div className="form-group full-width">
            <label>Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="input-field" placeholder="What was this for?" />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn-primary">Update</button>
            <button type="button" onClick={() => navigate('/transactions')} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}