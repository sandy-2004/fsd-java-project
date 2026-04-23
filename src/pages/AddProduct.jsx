import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../api/productApi';
import { FiArrowLeft, FiUpload, FiSave } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Laptops', 'Tablets', 'Accessories', 'Clothing', 'Books', 'Sports', 'Home', 'Other'];

export default function AddProduct({ onToast }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', brand: '', price: '',
    category: 'Electronics', releaseDate: '', available: true, quantity: '',
  });

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
    if (!imageFile) { onToast('Please select a product image', 'error'); return; }
    setSaving(true);
    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        releaseDate: form.releaseDate || null,
      };
      await addProduct(productData, imageFile);
      onToast('Product added successfully! 🎉', 'success');
      navigate('/');
    } catch (err) {
      onToast(err.response?.data || 'Failed to add product', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="main-content form-page">
      <span className="back-link" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </span>

      <div className="page-header">
        <h1 className="page-title">Add New Product</h1>
        <p className="page-subtitle">Fill in the details to list a new product</p>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Image *</label>
          <div className="image-upload">
            <input type="file" accept="image/*" onChange={handleImage} required />
            {imagePreview ? (
              <img src={imagePreview} className="image-preview" alt="Preview" />
            ) : (
              <>
                <div className="upload-icon"><FiUpload /></div>
                <div className="upload-text">Click or drag & drop your image here</div>
                <div className="upload-hint">PNG, JPG, WEBP up to 10MB</div>
              </>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Product Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. iPhone 15 Pro" required />
          </div>
          <div className="form-group">
            <label>Brand *</label>
            <input type="text" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Apple" required />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the product..." required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" min="0" step="0.01" required />
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
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="0" min="0" required />
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
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <FiSave /> {saving ? 'Saving...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
