import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, SlidersHorizontal, Star, Film, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import { networks, categories } from '../data/cartoons';
import CartoonCard from '../components/common/CartoonCard';
import TrailerModal from '../components/common/TrailerModal';
import DownloadModal from '../components/common/DownloadModal';
import './SearchPage.css';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSort = searchParams.get('sort') || 'popular';

  const [cartoons, setCartoons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedNetwork, setSelectedNetwork] = useState(searchParams.get('network') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState(initialSort);

  // Modals state
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [activeDownload, setActiveDownload] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getAllCartoons()
      .then((res) => {
        if (res?.success && res.cartoons) {
          setCartoons(res.cartoons);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Filter & Sort computation
  const filteredCartoons = useMemo(() => {
    let result = [...cartoons];

    // Search query
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter((c) =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.network?.toLowerCase().includes(q) ||
        c.categories?.some(cat => cat.toLowerCase().includes(q))
      );
    }

    // Network filter
    if (selectedNetwork !== 'all') {
      result = result.filter(c =>
        c.networkId === selectedNetwork ||
        c.network?.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(selectedNetwork)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(c =>
        c.categories?.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }

    // Min rating filter
    if (minRating > 0) {
      result = result.filter(c => (c.rating || 0) >= minRating);
    }

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'year') {
      result.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0) || (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [cartoons, query, selectedNetwork, selectedCategory, minRating, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setSelectedNetwork('all');
    setSelectedCategory('all');
    setMinRating(0);
    setSortBy('popular');
  };

  return (
    <div className="search-page">
      <div className="container">
        {/* Search Bar Input */}
        <div className="search-box-card">
          <div className="search-input-group">
            <SearchIcon size={24} className="search-icon-main" />
            <input
              type="text"
              placeholder="Search cartoons by name, characters, network, or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input-field"
            />
            {query && (
              <button className="search-clear-btn" onClick={() => setQuery('')}>
                <X size={18} />
              </button>
            )}
          </div>

          <div className="search-meta-bar">
            <span className="search-results-counter">
              Found <strong>{filteredCartoons.length}</strong> cartoons
            </span>

            <div className="search-sort-group">
              <label htmlFor="search-sort-select">Sort by:</label>
              <select
                id="search-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="search-select"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated ⭐</option>
                <option value="year">Newest Release 📅</option>
                <option value="title">Title (A - Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="filters-container">
          {/* Network Pills */}
          <div className="filter-group">
            <span className="filter-label">Network Broadcast:</span>
            <div className="filter-pills-row">
              <button
                className={`filter-pill ${selectedNetwork === 'all' ? 'filter-pill--active' : ''}`}
                onClick={() => setSelectedNetwork('all')}
              >
                All Networks
              </button>
              {networks.map((net) => (
                <button
                  key={net.id}
                  className={`filter-pill ${selectedNetwork === net.id ? 'filter-pill--active' : ''}`}
                  onClick={() => setSelectedNetwork(net.id)}
                >
                  {net.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="filter-group">
            <span className="filter-label">Categories & Genres:</span>
            <div className="filter-pills-row">
              <button
                className={`filter-pill ${selectedCategory === 'all' ? 'filter-pill--active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Genres
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-pill ${selectedCategory === cat.name ? 'filter-pill--active' : ''}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rating filter & Reset */}
          <div className="filter-group filter-group--bottom">
            <div className="filter-rating-options">
              <span className="filter-label">Min Rating:</span>
              <button
                className={`filter-pill ${minRating === 0 ? 'filter-pill--active' : ''}`}
                onClick={() => setMinRating(0)}
              >
                Any Rating
              </button>
              <button
                className={`filter-pill ${minRating === 8 ? 'filter-pill--active' : ''}`}
                onClick={() => setMinRating(8)}
              >
                ⭐ 8.0+
              </button>
              <button
                className={`filter-pill ${minRating === 9 ? 'filter-pill--active' : ''}`}
                onClick={() => setMinRating(9)}
              >
                ⭐ 9.0+ Masterpiece
              </button>
            </div>

            {(query || selectedNetwork !== 'all' || selectedCategory !== 'all' || minRating > 0) && (
              <button className="reset-filters-btn" onClick={resetFilters}>
                <RotateCcw size={14} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="detail-loading-view">
            <div className="loading-spinner" />
            <p>Searching through ToonVerse catalog...</p>
          </div>
        ) : filteredCartoons.length === 0 ? (
          <div className="search-empty-view">
            <Film size={54} color="var(--color-primary-light)" />
            <h2>No cartoons match your search</h2>
            <p>Try searching for a different keyword or resetting your filter criteria.</p>
            <button className="search-reset-empty-btn" onClick={resetFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="cartoons-grid">
            {filteredCartoons.map((cartoon) => (
              <CartoonCard
                key={cartoon._id || cartoon.id}
                cartoon={cartoon}
                onPlayTrailer={(c) => setActiveTrailer(c)}
                onDownload={(c) => setActiveDownload(c)}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <TrailerModal
          isOpen={Boolean(activeTrailer)}
          onClose={() => setActiveTrailer(null)}
          cartoon={activeTrailer}
        />
        <DownloadModal
          isOpen={Boolean(activeDownload)}
          onClose={() => setActiveDownload(null)}
          cartoon={activeDownload}
        />
      </div>
    </div>
  );
}

export default SearchPage;
