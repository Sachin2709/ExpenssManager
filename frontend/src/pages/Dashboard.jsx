import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Plus, Wallet, Tag, Calendar, DollarSign } from 'lucide-react';

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Shopping', 'Other'];

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('All');
  const [formData, setFormData] = useState({ title: '', amount: '', category: CATEGORIES[0], date: '' });

  const fetchExpenses = async () => {
    try {
      const url = filter === 'All' 
        ? 'http://localhost:5000/api/expenses' 
        : `http://localhost:5000/api/expenses?category=${filter}`;
      const res = await axios.get(url);
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filter]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/expenses', formData);
      setFormData({ title: '', amount: '', category: CATEGORIES[0], date: '' });
      fetchExpenses();
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }} className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Wallet size={32} color="var(--primary)" />
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Expense Manager</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Welcome, {user?.name}</p>
          </div>
        </div>
        <button onClick={logout} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Add Expense Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} color="var(--primary)"/> Add New Expense
          </h2>
          <form onSubmit={handleAddExpense}>
            <div className="input-group">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} required onChange={handleChange} placeholder="e.g., Groceries" />
            </div>
            <div className="input-group">
              <label>Amount ($)</label>
              <input type="number" name="amount" value={formData.amount} required onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Date (Optional)</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '0.5rem' }}>Add Expense</button>
          </form>
        </div>

        {/* Expenses List */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Your Expenses</h2>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '0.5rem', fontSize: '0.875rem' }}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Spent ({filter})</p>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>${totalExpense.toFixed(2)}</h3>
            </div>
            <DollarSign size={48} color="var(--primary)" style={{ opacity: 0.5 }} />
          </div>

          <div style={{ overflowY: 'auto', flex: 1, maxHeight: '400px', paddingRight: '0.5rem' }}>
            {expenses.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No expenses found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {expenses.map(exp => (
                  <div key={exp._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--primary)' }}>
                    <div>
                      <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{exp.title}</h4>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Tag size={12}/> {exp.category}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12}/> {new Date(exp.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '1.125rem' }}>
                      ${exp.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
