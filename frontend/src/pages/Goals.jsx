import { useState, useEffect } from 'react';
import { PiggyBank, Plus, Trash2, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import '../index.css';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', targetAmount: '' });
  const [fundAmounts, setFundAmounts] = useState({});

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/goals');
      setGoals(data);
    } catch (error) {
      toast.error('Failed to load goals. Ensure backend route is ready.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount) return toast.error('Fill all fields');
    
    try {
      await api.post('/goals', formData);
      toast.success('Goal created successfully!');
      setFormData({ title: '', targetAmount: '' });
      fetchGoals();
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const handleAddFunds = async (goalId) => {
    const amount = Number(fundAmounts[goalId]);
    if (!amount || amount <= 0) return toast.error('Enter a valid amount to add');

    try {
      await api.put(`/goals/${goalId}/add-funds`, { amount });
      toast.success('Funds added to your goal!');
      setFundAmounts({ ...fundAmounts, [goalId]: '' });
      fetchGoals();
    } catch (error) {
      toast.error('Failed to add funds');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/goals/${id}`);
        toast.success('Goal deleted');
        fetchGoals();
      } catch (error) {
        toast.error('Failed to delete goal');
      }
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="goals-container">
        <div className="goals-header">
          <PiggyBank color="#4c328a" size={36} />
          <h1 className="goals-title">Savings Goals</h1>
        </div>

        <div className="goals-grid">
          {/* Add Goal Form */}
          <div className="goal-card">
            <h2 className="card-title">Create New Goal</h2>
            <form onSubmit={handleCreateGoal}>
              <div className="form-group">
                <label>Goal Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Yamaha MT-15"
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Target Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={formData.targetAmount} 
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 170000"
                />
              </div>
              
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Plus size={18} /> Start Saving
              </button>
            </form>
          </div>

          {/* Goals List */}
          <div>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>Loading your goals...</p>
            ) : goals.length === 0 ? (
              <div className="goal-card" style={{ textAlign: 'center' }}>
                <TrendingUp color="#9ca3af" size={48} style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>No savings goals yet</h3>
                <p style={{ color: '#6b7280' }}>Set a target and start saving for your dreams today.</p>
              </div>
            ) : (
              <div className="goal-list">
                {goals.map(goal => {
                  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100).toFixed(1);
                  const isCompleted = percentage >= 100;

                  return (
                    <div key={goal._id} className="goal-item">
                      <div className="goal-item-header">
                        <div>
                          <h3 className="goal-item-title">{goal.title}</h3>
                          <p className="goal-item-amounts">
                            Saved: <span>₹{goal.currentAmount}</span> / ₹{goal.targetAmount}
                          </p>
                        </div>
                        <button onClick={() => handleDelete(goal._id)} className="btn-goal-delete" title="Delete Goal">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="goal-progress-bg">
                        <div 
                          className="goal-progress-fill" 
                          style={{ width: `${percentage}%`, backgroundColor: isCompleted ? '#10b981' : '#4c328a' }}
                        ></div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ fontWeight: '600', color: isCompleted ? '#10b981' : '#6b7280' }}>
                          {isCompleted ? 'Goal Reached! 🎉' : `${percentage}% Completed`}
                        </span>
                      </div>

                      {/* Add Funds Section */}
                      {!isCompleted && (
                        <div className="goal-actions">
                          <input 
                            type="number" 
                            min="1"
                            placeholder="Amount" 
                            className="input-fund"
                            value={fundAmounts[goal._id] || ''}
                            onChange={(e) => setFundAmounts({ ...fundAmounts, [goal._id]: e.target.value })}
                          />
                          <button onClick={() => handleAddFunds(goal._id)} className="btn-fund">
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}