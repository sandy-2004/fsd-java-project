import { Link } from 'react-router-dom';
import { getProductImageUrl } from '../api/productApi';
import { FiPackage } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.imageName ? (
          <img
            src={getProductImageUrl(product.id)}
            alt={product.name}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div className="placeholder-img" style={product.imageName ? { display: 'none' } : {}}>
          <FiPackage />
        </div>
        <span className="category-badge">{product.category}</span>
      </div>
      <div className="product-card-body">
        <div className="product-card-brand">{product.brand}</div>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          <span className="product-card-stock">
            <span className={`stock-dot ${product.available ? 'in-stock' : 'out-of-stock'}`}></span>
            {product.available ? `${product.quantity} left` : 'Sold out'}
          </span>
        </div>
      </div>
    </Link>
  );
}
