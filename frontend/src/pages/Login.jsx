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

  
  //   <div className="auth-page">
  //     <div className="auth-box">
  //       {/* Top Purple Section */}
  //       <div className="login-top">
  //         <Link to="/register">Sign up</Link>
  //       </div>
        
  //       {/* Bottom White Curve Section */}
  //       <div className="login-bottom">
  //         <h2 className="login-title">Login</h2>
          
  //         <form onSubmit={handleSubmit}>
  //           <input
  //             type="email"
  //             required
  //             placeholder="Email"
  //             className="auth-input"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //           />
            
  //           <input
  //             type="password"
  //             required
  //             placeholder="Password"
  //             className="auth-input"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //           />

  //           <button type="submit" disabled={isSubmitting} className="auth-btn">
  //             {isSubmitting ? 'Loading...' : 'Login'}
  //           </button>
  //         </form>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="auth-page">
      <div className="auth-box">
        {/* Top Section */}
        <div className="login-top">
          <h2 className="welcome-text">Welcome Back</h2>
        </div>

        {/* Bottom Section */}
        <div className="login-bottom">
          <h2 className="login-title">Login</h2>
          
          <form onSubmit={handleSubmit}> 
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              className="auth-input"
              value={formData.email} 
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

          {/* Sign Up Link at Bottom */}
          <div className="signup-prompt">
            Don't have an account?{' '}
            <Link to="/register" className="signup-link">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}