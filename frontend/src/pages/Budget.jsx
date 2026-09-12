import { useState, useEffect } from 'react';
import { Target, AlertCircle, Trash2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import '../index.css';

const CATEGORIES = ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Default to current month (YYYY-MM)
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  
  const [formData, setFormData] = useState({ category: 'Food', amount: '' });

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch budgets for the selected month
      const budgetRes = await api.get(`/budgets?month=${selectedMonth}`);
      setBudgets(budgetRes.data);

      // Fetch all transactions and filter expenses for the selected month
      const txRes = await api.get('/transactions');
      const monthlyExpenses = txRes.data.filter(t => 
        t.type === 'Expense' && t.date.startsWith(selectedMonth)
      );

      // Calculate total spent per category
      const expenseTotals = monthlyExpenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {});
      
      setExpenses(expenseTotals);
    } catch (error) {
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) return toast.error('Enter a valid amount');
    
    try {
      await api.post('/budgets', { ...formData, month: selectedMonth });
      toast.success('Budget saved successfully');
      setFormData({ ...formData, amount: '' });
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to set budget');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        toast.success('Budget removed');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete budget');
      }
    }
  };

  return (
    <div className="budget-container">
      <div className="budget-header">
        <div className="title-group">
          <Target color="#2563eb" size={32} />
          <h1>Budget Tracker</h1>
        </div>
        <input 
          type="month" 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-input"
        />
      </div>

      <div className="budget-grid">
        {/* Add Budget Form */}
        <div className="budget-card">
          <h2 className="card-title">Set Category Budget</h2>
          <form onSubmit={handleSetBudget}>
            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Budget Limit (₹)</label>
              <input 
                type="number" 
                min="1"
                required
                value={formData.amount} 
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-field"
                placeholder="e.g. 5000"
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Save Budget
            </button>
          </form>
        </div>

        {/* Budget Progress List */}
        <div className="budget-list">
          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>Loading budgets...</p>
          ) : budgets.length === 0 ? (
            <div className="budget-card" style={{ textAlign: 'center' }}>
              <Target color="#9ca3af" size={48} style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>No budgets set for this month</h3>
              <p style={{ color: '#6b7280' }}>Use the form to start tracking your spending limits.</p>
            </div>
          ) : (
            budgets.map(budget => {
              const spent = expenses[budget.category] || 0;
              const percentage = Math.min((spent / budget.amount) * 100, 100).toFixed(1);
              const remaining = budget.amount - spent;
              
              // Determine progress bar color
              let barColor = 'bg-green';
              if (percentage > 90) barColor = 'bg-red';
              else if (percentage > 75) barColor = 'bg-yellow';

              return (
                <div key={budget._id} className="budget-item">
                  <div className="item-header">
                    <h3>{budget.category}</h3>
                    <div className="item-actions">
                      <span className="budget-amounts">
                        ₹{spent} / ₹{budget.amount}
                      </span>
                      <button onClick={() => handleDelete(budget._id)} className="btn-delete" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="progress-track">
                    <div className={`progress-fill ${barColor}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  
                  <div className="item-footer">
                    <span className="text-gray-500">{percentage}% Used</span>
                    {remaining < 0 ? (
                      <span className="text-red-500">
                        <AlertCircle size={14}/> Over budget by ₹{Math.abs(remaining)}
                      </span>
                    ) : (
                      <span className="text-green-600">₹{remaining} Remaining</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}