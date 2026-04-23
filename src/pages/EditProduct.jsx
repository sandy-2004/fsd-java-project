import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct, getProductImageUrl } from '../api/productApi';
import { FiArrowLeft, FiUpload, FiSave } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Laptops', 'Tablets', 'Accessories', 'Clothing', 'Books', 'Sports', 'Home', 'Other'];

export default function EditProduct({ onToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [hasExistingImage, setHasExistingImage] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', brand: '', price: '',
    category: 'Electronics', releaseDate: '', available: true, quantity: '',
  });

  useEffect(() => {
    getProductById(id)
      .then(res => {
        const p = res.data;
        const releaseDate = p.releaseDate
          ? (Array.isArray(p.releaseDate)
              ? `${p.releaseDate[0]}-${String(p.releaseDate[1]).padStart(2,'0')}-${String(p.releaseDate[2]).padStart(2,'0')}`
              : p.releaseDate.split('/').reverse().join('-'))
          : '';
        setForm({
          name: p.name || '', description: p.description || '', brand: p.brand || '',
          price: p.price || '', category: p.category || 'Electronics',
          releaseDate, available: p.available ?? true, quantity: p.quantity || '',
        });
        if (p.imageName) setHasExistingImage(true);
      })
      .catch(() => onToast('Could not load product', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) { onToast('Please select a new image (required for update)', 'error'); return; }
    setSaving(true);
    try {
      const productData = { ...form, id: parseInt(id), price: parseFloat(form.price), quantity: parseInt(form.quantity) };
      await updateProduct(id, productData, imageFile);
      onToast('Product updated successfully! ✨', 'success');
      navigate(`/product/${id}`);
    } catch (err) {
      onToast(err.response?.data || 'Failed to update product', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="main-content form-page">
      <span className="back-link" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </span>

      <div className="page-header">
        <h1 className="page-title">Edit Product</h1>
        <p className="page-subtitle">Update the product information below</p>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Image * (upload new to replace)</label>
          <div className="image-upload">
            <input type="file" accept="image/*" onChange={handleImage} />
            {imagePreview ? (
              <img src={imagePreview} className="image-preview" alt="New Preview" />
            ) : hasExistingImage ? (
              <img src={getProductImageUrl(id)} className="image-preview" alt="Current"
                onError={() => setHasExistingImage(false)} />
            ) : (
              <>
                <div className="upload-icon"><FiUpload /></div>
                <div className="upload-text">Click to select a new image</div>
                <div className="upload-hint">PNG, JPG, WEBP up to 10MB</div>
              </>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Product Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Brand *</label>
            <input type="text" name="brand" value={form.brand} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" required />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity *</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min="0" required />
          </div>
          <div className="form-group">
            <label>Release Date</label>
            <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input type="checkbox" name="available" id="available" checked={form.available} onChange={handleChange}
            style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
          <label htmlFor="available" style={{ textTransform: 'none', fontSize: '0.9rem', marginBottom: 0, cursor: 'pointer' }}>
            Mark as available for purchase
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <FiSave /> {saving ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
