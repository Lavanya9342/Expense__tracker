import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../services/api';

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data);
      calculateStats(data);
    } catch (error) {
      console.error('Failed to fetch transactions');
    }
  };

  const calculateStats = (data) => {
    let income = 0;
    let expense = 0;
    data.forEach(t => {
      if (t.type === 'Income') income += t.amount;
      else expense += t.amount;
    });
    setStats({ income, expense, balance: income - expense });
  };

  const chartData = [
    { name: 'Income', value: stats.income },
    { name: 'Expense', value: stats.expense }
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="card summary-card border-blue">
          <div>
            <p className="summary-label">Total Balance</p>
            <h3 className="summary-value">₹{stats.balance}</h3>
          </div>
          <Wallet color="#3b82f6" size={36} />
        </div>
        
        <div className="card summary-card border-green">
          <div>
            <p className="summary-label">Total Income</p>
            <h3 className="summary-value">₹{stats.income}</h3>
          </div>
          <TrendingUp color="#10b981" size={36} />
        </div>

        <div className="card summary-card border-red">
          <div>
            <p className="summary-label">Total Expense</p>
            <h3 className="summary-value">₹{stats.expense}</h3>
          </div>
          <TrendingDown color="#ef4444" size={36} />
        </div>
      </div>

      {/* Charts & Recent Transactions */}
      <div className="content-grid">
        {/* Chart Section */}
        <div className="card">
          <h2 className="card-title">Income vs Expense</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="card">
          <h2 className="card-title">Recent Transactions</h2>
          <div className="tx-list">
            {transactions.slice(0, 5).map(t => (
              <div key={t._id} className="tx-item">
                <div>
                  <p className="tx-desc">{t.description || t.category}</p>
                  <p className="tx-date">{new Date(t.date).toLocaleDateString()}</p>
                </div>
                <span className={`tx-amount ${t.type === 'Income' ? 'text-green' : 'text-red'}`}>
                  {t.type === 'Income' ? '+' : '-'}₹{t.amount}
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
              <p style={{ color: '#6b7280', textAlign: 'center', marginTop: '20px' }}>
                No recent transactions found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}