import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/cartoons';
import { Sparkles, ArrowRight } from 'lucide-react';
import './NetworksPage.css';

function CategoriesPage() {
  return (
    <div className="networks-page">
      <div className="container">
        <div className="networks-header">
          <div className="networks-title-badge">
            <Sparkles size={18} /> Cartoon Genres & Categories
          </div>
          <h1 className="networks-title">All Categories</h1>
          <p className="networks-subtitle">
            Find the perfect cartoon for your mood, from high-stakes adventures to side-splitting comedy
          </p>
        </div>

        <div className="networks-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="network-card"
              style={{ '--network-accent': cat.color }}
            >
              <div className="network-card-border" />
              <div className="network-card-top">
                <span className="network-channel-badge" style={{ fontSize: '1.8rem', background: 'none' }}>
                  {cat.icon}
                </span>
                <span className="network-shows-count">Genre</span>
              </div>

              <h2 className="network-card-name">{cat.name}</h2>
              <p className="network-card-desc">
                Discover thrilling cartoons, anime, and animated series cataloged under {cat.name}.
              </p>

              <div className="network-card-footer">
                <span>Explore Category</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
