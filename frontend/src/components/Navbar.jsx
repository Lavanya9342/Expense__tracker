import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ListPlus, Receipt, Menu, X, Target, UserCircle, PiggyBank } from 'lucide-react';
import '../index.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to highlight active links
  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => `nav-link ${isActive(path) ? 'active' : ''}`;
  const mobileLinkClass = (path) => `mobile-nav-link ${isActive(path) ? 'active' : ''}`;

  if (!user) return null; // Don't show navbar on login/register pages

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-content">
          
          {/* Logo & Desktop Menu */}
          <div className="nav-logo-group">
            <Link to="/" className="nav-logo">
              ExpenseFlow
            </Link>
            
            {/* Desktop Navigation */}
            <div className="nav-desktop-menu">
              <Link to="/" className={linkClass('/')}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/transactions" className={linkClass('/transactions')}>
                <Receipt size={18} /> Transactions
              </Link>
              <Link to="/add-transaction" className={linkClass('/add-transaction')}>
                <ListPlus size={18} /> Add New
              </Link>
              <Link to="/budget" className={linkClass('/budget')}>
                <Target size={18} /> Budget
              </Link>
              <Link to="/goals" className={linkClass('/goals')}>
               <PiggyBank size={18} /> Goals
              </Link>
              <Link to="/profile" className={linkClass('/profile')}>
                <UserCircle size={18} /> Profile
              </Link>

            </div>
          </div>

          {/* Desktop User Actions */}
          <div className="nav-user-actions">
            <div className="nav-user-info">
              <span className="nav-user-name">{user.name}</span>
              <span className="nav-user-email">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={18} /> Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn-container">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="btn-icon">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass('/')}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/transactions" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass('/transactions')}>
              <Receipt size={18} /> Transactions
            </Link>
            <Link to="/add-transaction" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass('/add-transaction')}>
              <ListPlus size={18} /> Add Transaction
            </Link>
            <Link to="/budget" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass('/budget')}>
              <Target size={18} /> Budget
            </Link>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass('/profile')}>
              <UserCircle size={18} /> Profile
            </Link>
            
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <p className="nav-user-name">{user.name}</p>
                <p className="nav-user-email">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="mobile-btn-logout">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}