import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Reset error state when input changes
  React.useEffect(() => {
    setError('');
  }, [email, password]);

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Prevent multiple submissions
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        setError('Invalid response from server');
        return;
      }
      
      if (!res.ok) {
        // Handle specific error cases
        if (res.status === 429) {
          toast.error('Too many attempts. Please wait a few minutes before trying again.');
          setError('Too many attempts. Please wait a few minutes before trying again.');
        } else if (res.status === 409) {
          setError('Email already registered');
        } else if (data.error && Array.isArray(data.error)) {
          setError(data.error.map(err => err.msg).join('. '));
        } else {
          setError('Registration failed. Please check your details.');
        }
        setIsLoading(false);
        return;
      }
      
      if (!data.token) {
        setError('Invalid response from server');
        setIsLoading(false);
        return;
      }
      
      localStorage.setItem('token', data.token);
      navigate('/profile');
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      setIsLoading(false);
    } finally {
      // Reset loading state after 3 seconds if still loading
      setTimeout(() => setIsLoading(false), 3000);
    }
  }

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>Create Account</h2>
        <p>Join AI Health Analyzer to start analyzing your medical reports</p>
      </div>
      
      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-group">
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required
            autoComplete="email"
          />
          <label>Email</label>
          <div className="underline"></div>
        </div>

        <div className="form-group">
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
            autoComplete="new-password"
          />
          <label>Password</label>
          <div className="underline"></div>
        </div>

        <button className="register-btn" type="submit">
          Create Account
        </button>

        {typeof error === 'string' && error && (
          <div className="error-message" style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
            {error}
          </div>
        )}

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
  );
}
