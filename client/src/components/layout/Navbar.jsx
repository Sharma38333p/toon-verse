import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Heart, Shield, Film } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import './Navbar.css';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">🎬</div>
          <div className="navbar__logo-text-group">
            <span className="navbar__logo-text">Toon<span className="logo-accent">Verse</span></span>
          </div>
        </Link>

        {/* Center Nav Links (desktop) */}
        <ul className="navbar__links">
          <li className="navbar__links-item">
            <NavLink to="/" end className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
              Home
            </NavLink>
          </li>
          <li className="navbar__links-item">
            <NavLink to="/networks" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
              Networks
            </NavLink>
          </li>
          <li className="navbar__links-item">
            <NavLink to="/categories" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
              Categories
            </NavLink>
          </li>
          <li className="navbar__links-item">
            <NavLink to="/search?sort=popular" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
              Discover
            </NavLink>
          </li>
          <li className="navbar__links-item">
            <NavLink to="/admin" className={({ isActive }) => `navbar__link navbar__link--admin ${isActive ? 'navbar__link--active' : ''}`}>
              <Shield size={14} /> Admin Hub
            </NavLink>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="navbar__actions">
          {/* Search */}
          <button className="navbar__icon-btn" onClick={handleSearchClick} aria-label="Search cartoons" title="Search">
            <Search size={20} />
          </button>

          {/* Favorites */}
          <Link to="/favorites" className="navbar__icon-btn navbar__fav-btn" title="My Favorites">
            <Heart size={20} />
            {favoritesCount > 0 && (
              <span className="navbar__fav-badge">{favoritesCount}</span>
            )}
          </Link>

          {/* Direct Admin Control Quick Button */}
          <Link to="/admin" className="navbar__admin-quick-btn" title="Video Container & Admin Hub">
            <Shield size={16} />
            <span>Admin Hub</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="navbar__hamburger"
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${mobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <ul className="navbar__mobile-links">
          <li>
            <Link to="/" className="navbar__mobile-link" onClick={() => setMobileMenuOpen(false)}>
              🏠 Home
            </Link>
          </li>
          <li>
            <Link to="/networks" className="navbar__mobile-link" onClick={() => setMobileMenuOpen(false)}>
              📡 Networks (Pogo, CN, Disney, Nick)
            </Link>
          </li>
          <li>
            <Link to="/categories" className="navbar__mobile-link" onClick={() => setMobileMenuOpen(false)}>
              🎭 Categories & Genres
            </Link>
          </li>
          <li>
            <Link to="/search" className="navbar__mobile-link" onClick={() => setMobileMenuOpen(false)}>
              🔍 Search & Filter
            </Link>
          </li>
          <li>
            <Link to="/favorites" className="navbar__mobile-link" onClick={() => setMobileMenuOpen(false)}>
              ❤️ Favorites ({favoritesCount})
            </Link>
          </li>
          <li>
            <Link to="/admin" className="navbar__mobile-link navbar__mobile-link--admin" onClick={() => setMobileMenuOpen(false)}>
              🛡️ Admin & Video Container Hub
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
