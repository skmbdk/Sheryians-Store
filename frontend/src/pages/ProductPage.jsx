import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductFormModal from '../components/ProductFormModal';
import ErrorMessage from '../components/ErrorMessage';

// Main Product catalog and management page
const ProductPage = ({ user, setView }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/products');
      setProducts(response.data.products || []);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Failed to fetch products from server');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    if (!user) {
      alert('Authentication required: Please sign in to add products.');
      setView('login');
      return;
    }
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    if (!user) {
      alert('Authentication required: Please sign in to edit products.');
      setView('login');
      return;
    }
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!user) {
      alert('Authentication required: Please sign in to delete products.');
      setView('login');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Failed to delete product');
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Product Catalog</h1>
          <p>Explore items or sign in to add and edit inventory</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Product
        </button>
      </div>

      <ErrorMessage error={error} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <p>Loading catalog items...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '16px',
          border: '1px dashed #cbd5e1'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 style={{ color: '#0f172a', fontWeight: 700 }}>No Products Available</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
            The catalog is currently empty. Be the first to add a product!
          </p>
          <button onClick={handleOpenAddModal} className="btn" style={{ marginTop: '16px' }}>
            + Add First Product
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((item) => (
            <div key={item._id} className="product-card">
              <div className="product-card-top">
                <span className="product-tag">{item.category || 'General'}</span>
                <h3 className="product-title">{item.name}</h3>
                <p className="product-desc">{item.description}</p>
              </div>

              <div>
                <div className="product-meta">
                  <span className="product-price">${Number(item.price).toFixed(2)}</span>
                  <span className="product-stock">Stock: {item.stock}</span>
                </div>

                {user && (
                  <div className="card-actions">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(item._id)}
                      className="btn btn-danger btn-sm"
                      style={{ flex: 1 }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default ProductPage;
