import { useState, useEffect } from 'react';
import { getAllProducts, searchProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import { FiGrid, FiList } from 'react-icons/fi';

export default function Home({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (searchQuery && searchQuery.trim()) {
          const res = await searchProducts(searchQuery);
          setProducts(res.data);
        } else {
          const res = await getAllProducts();
          setProducts(res.data);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="main-content">
      {!searchQuery && (
        <div className="hero-section">
          <h1 className="hero-title">
            Discover <span className="gradient-text">Amazing</span><br />Products
          </h1>
          <p className="hero-subtitle">
            Browse our curated collection of premium products across all categories
          </p>
        </div>
      )}

      {searchQuery && (
        <div className="page-header">
          <h2 className="page-title">Search results for "{searchQuery}"</h2>
          <p className="page-subtitle">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
        </div>
      )}

      {!searchQuery && products.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`btn ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 18px', fontSize: '0.8rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛍️</div>
          <h3>{searchQuery ? 'No products found' : 'No products yet'}</h3>
          <p>{searchQuery ? 'Try a different search term.' : 'Add your first product to get started!'}</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
