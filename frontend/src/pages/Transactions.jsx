import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Trash2, Plus, Edit, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import '../index.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All Time'); // New state for Time Filter

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to load transactions');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        setTransactions(transactions.filter(t => t._id !== id));
        toast.success('Transaction deleted');
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  // --- Filtering Logic (Type + Time) ---
  const filteredTransactions = transactions.filter(t => {
    // 1. Check Income/Expense Type
    const matchType = typeFilter === 'All' ? true : t.type === typeFilter;

    // 2. Check Time Period
    let matchTime = true;
    const txDate = new Date(t.date);
    const now = new Date();

    if (timeFilter === 'This Week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      matchTime = txDate >= oneWeekAgo && txDate <= now;
    } 
    else if (timeFilter === 'This Month') {
      matchTime = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    } 
    else if (timeFilter === 'Last Month') {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      matchTime = txDate.getMonth() === lastMonth.getMonth() && txDate.getFullYear() === lastMonth.getFullYear();
    } 
    else if (timeFilter === 'This Year') {
      matchTime = txDate.getFullYear() === now.getFullYear();
    }

    return matchType && matchTime;
  });

  // --- Export to CSV Logic ---
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      return toast.error('No transactions to export');
    }

    const headers = ['Date', 'Description', 'Category', 'Payment Method', 'Type', 'Amount'];
    const csvRows = filteredTransactions.map(t => {
      const date = new Date(t.date).toLocaleDateString();
      const desc = `"${(t.description || '').replace(/"/g, '""')}"`;
      return [date, desc, t.category, t.paymentMethod, t.type, t.amount].join(',');
    });

    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ExpenseFlow_${timeFilter.replace(' ', '')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="transactions-container">
      <div className="tx-header">
        <h1 className="tx-title">Transactions</h1>
        
        <div className="header-actions">
          <button onClick={exportToCSV} className="btn-export">
            <Download size={20} /> Export CSV
          </button>
          <Link to="/add-transaction" className="btn-add">
            <Plus size={20} /> Add New
          </Link>
        </div>
      </div>

      <div className="tx-card">
        {/* Filters Container */}
        <div className="tx-filters-container">
          
          {/* Type Filter Buttons */}
          <div className="type-filters">
            {['All', 'Income', 'Expense'].map(type => (
              <button 
                key={type} 
                onClick={() => setTypeFilter(type)}
                className={`filter-btn ${typeFilter === type ? 'active' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Time Filter Dropdown */}
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="time-filter-select"
          >
            <option value="All Time">All Time</option>
            <option value="This Week">This Week (Last 7 Days)</option>
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="This Year">This Year</option>
          </select>

        </div>

        {/* Table Layout */}
        <div className="table-responsive">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Method</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    No transactions found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t._id}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: '500' }}>{t.description || '-'}</td>
                    <td>
                      <span className="badge-category">{t.category}</span>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: '#6b7280' }}>{t.paymentMethod}</td>
                    <td style={{ textAlign: 'right' }} className={t.type === 'Income' ? 'text-green' : 'text-red'}>
                      {t.type === 'Income' ? '+' : '-'}₹{t.amount}
                    </td>
                    <td>
                      <div className="action-btns">
                        <Link to={`/edit-transaction/${t._id}`} className="btn-edit" title="Edit">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(t._id)} className="btn-delete" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}