import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      // Convert response to text first to prevent object issues
      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        setError('Invalid response from server');
        return;
      }
      
      if (!res.ok || !data.token) {
        setError('Login failed. Please check your credentials.');
        return;
      }
      
      localStorage.setItem('token', data.token);
      navigate('/profile');
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Welcome Back</h2>
        <p>Sign in to continue to AI Health Analyzer</p>
      </div>
      
      <form className="login-form" onSubmit={handleLogin}>
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

        <div className="forgot-password">
          Forgot Password?
        </div>

        <button className="login-btn" type="submit">
          Sign In
        </button>

        {typeof error === 'string' && error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="auth-links">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </form>
    </div>
  );
}
