import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getProductImageUrl, deleteProduct } from '../api/productApi';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPackage, FiCalendar, FiTag, FiBox } from 'react-icons/fi';

export default function ProductDetail({ onToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then(res => setProduct(res.data))
      .catch(() => onToast('Product not found', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(id);
      onToast('Product deleted successfully', 'success');
      navigate('/');
    } catch {
      onToast('Failed to delete product', 'error');
      setDeleting(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try { return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return dateStr; }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!product) return (
    <div className="empty-state">
      <div className="empty-icon">😕</div>
      <h3>Product not found</h3>
      <p>The product you're looking for doesn't exist.</p>
    </div>
  );

  return (
    <div className="main-content">
      <span className="back-link" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back to products
      </span>

      <div className="product-detail">
        <div className="product-detail-image">
          {product.imageName ? (
            <img src={getProductImageUrl(product.id)} alt={product.name}
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
          ) : null}
          <div className="placeholder-img" style={product.imageName ? { display: 'none' } : { display: 'flex' }}>
            <FiPackage />
          </div>
        </div>

        <div className="product-detail-info">
          <div className="detail-brand">{product.brand}</div>
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-price">{formatPrice(product.price)}</div>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-meta">
            <div className="meta-item">
              <div className="meta-label"><FiTag /> Category</div>
              <div className="meta-value">{product.category}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label"><FiBox /> Stock</div>
              <div className="meta-value" style={{ color: product.available ? '#2ed573' : '#ff4757' }}>
                {product.available ? `${product.quantity} units` : 'Out of stock'}
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-label"><FiCalendar /> Release Date</div>
              <div className="meta-value">{formatDate(product.releaseDate)}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Availability</div>
              <div className="meta-value" style={{ color: product.available ? '#2ed573' : '#ff4757' }}>
                {product.available ? '✓ Available' : '✗ Unavailable'}
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <Link to={`/edit/${product.id}`} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              <FiEdit2 /> Edit Product
            </Link>
            <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowConfirm(true)}>
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Product?</h3>
            <p>Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
