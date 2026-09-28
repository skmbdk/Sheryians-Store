import React, { useState } from 'react';
import api from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

// User registration page
const RegisterPage = ({ setView }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      setSuccessMsg(response.data.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => setView('login'), 1500);
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
        <h2>Create an Account</h2>
        <p>Register to manage and explore the store</p>
      </div>

      {successMsg && <div className="success-box">{successMsg}</div>}
      <ErrorMessage error={error} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

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
            placeholder="At least 6 characters"
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            required
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
          {loading ? 'Registering...' : 'Register Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: '#64748b' }}>
          Already have an account?{' '}
          <span
            onClick={() => setView('login')}
            style={{ color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}
          >
            Sign in here
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
