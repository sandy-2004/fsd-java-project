import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiSearch, FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon"><FiShoppingBag /></span>
          ShopVerse
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
          />
        </form>

        <div className="navbar-actions">
          <Link to="/add" className="btn btn-primary">
            <FiPlus /> Add Product
          </Link>
        </div>
      </div>
    </nav>
  );
}
