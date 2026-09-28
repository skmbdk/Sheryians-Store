import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import api, { getStoredUser, removeStoredToken, removeStoredUser } from './services/api';

// Main Application component
function App() {
  const [user, setUser] = useState(getStoredUser());
  const [view, setView] = useState('products'); // 'products', 'login', 'register'

  // Verify authentication state on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (err) {
        // Token invalid or expired
        setUser(null);
        removeStoredToken();
        removeStoredUser();
      }
    };

    verifyAuth();

    // Event listener for auto-logout when refresh token fails
    const handleLogoutEvent = () => {
      setUser(null);
      setView('login');
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      removeStoredToken();
      removeStoredUser();
      setView('products');
    }
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} setView={setView} />

      <main style={{ padding: '20px 0' }}>
        {view === 'products' && (
          <ProductPage user={user} setView={setView} />
        )}
        {view === 'login' && (
          <LoginPage onLoginSuccess={setUser} setView={setView} />
        )}
        {view === 'register' && (
          <RegisterPage setView={setView} />
        )}
      </main>
    </div>
  );
}

export default App;
