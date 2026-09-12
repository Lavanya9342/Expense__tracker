import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import '../index.css';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords don't match");
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        {/* Top Purple Section with Form */}
        <div className="register-top">
          <h2 className="register-title">Sign up</h2>
          
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name" 
              placeholder="User name"
              required 
              className="auth-input"
              onChange={handleChange} 
            />
            
            <input 
              type="email" 
              name="email" 
              placeholder="Email"
              required 
              className="auth-input"
              onChange={handleChange} 
            />
            
            <input 
              type="password" 
              name="password" 
              placeholder="Password"
              required 
              className="auth-input"
              onChange={handleChange} 
            />
            
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password"
              required 
              className="auth-input"
              onChange={handleChange} 
            />

            <button type="submit" disabled={isSubmitting} className="auth-btn">
              {isSubmitting ? 'Loading...' : 'Sign up'}
            </button>
          </form>
        </div>
        
        {/* Bottom White Curve Section */}
        <div className="register-bottom">
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}