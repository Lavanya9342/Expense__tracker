import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../index.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <div className="auth-page">
      <div className="auth-box">
        {/* Top Section - Professional Welcome Message instead of Link */}
        <div className="login-top">
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
            Welcome Back
          </h2>
        </div>

        {/* Bottom Section - Form & Sign Up Link */}
        <div className="login-bottom">
          <h2 className="login-title">Login</h2>
          
          <form onSubmit={handleSubmit}> {/* Unga submit function name use pannikonga */}
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              className="auth-input"
              value={formData.email} // Unga state variables-ah match pannikonga
              onChange={handleChange}
              required 
            />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          {/* New Sign Up Section at the Bottom */}
          <div style={{ marginTop: '25px', fontSize: '0.95rem', color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#4c328a', fontWeight: '700', textDecoration: 'none' }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}