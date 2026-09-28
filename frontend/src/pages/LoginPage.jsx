import React, { useState } from 'react';
import api, { setStoredToken, setStoredUser } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

// User login page
const LoginPage = ({ onLoginSuccess, setView }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { accessToken, user } = response.data;

      // Persist access token and user info
      setStoredToken(accessToken);
      setStoredUser(user);

      onLoginSuccess(user);
      setView('products');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Failed to connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to access protected product features</p>
      </div>

      <ErrorMessage error={error} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <span
            onClick={() => setView('register')}
            style={{ color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}
          >
            Create an account
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
