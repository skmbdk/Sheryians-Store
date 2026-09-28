import React from 'react';

// Handcrafted, modern Navigation bar component
const Navbar = ({ user, onLogout, setView }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setView('products')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <span>Sheryians Store</span>
      </div>

      <div className="nav-links">
        <button onClick={() => setView('products')} className="btn btn-secondary btn-sm">
          Products Catalog
        </button>

        {user ? (
          <>
            <div className="user-badge">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span>{user.name}</span>
            </div>
            <button onClick={onLogout} className="btn btn-danger btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setView('login')} className="btn btn-sm">
              Sign In
            </button>
            <button onClick={() => setView('register')} className="btn btn-secondary btn-sm">
              Create Account
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
