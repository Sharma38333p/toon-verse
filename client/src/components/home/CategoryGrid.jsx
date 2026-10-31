import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/cartoons';
import './CategoryGrid.css';

function CategoryGrid() {
  const navigate = useNavigate();

  const handleCategoryClick = (catId) => {
    navigate(`/category/${catId}`);
  };

  return (
    <section className="section category-grid">
      <div className="container">
        <div className="category-grid__header">
          <h2 className="category-grid__title">🎭 Explore by Genre & Category</h2>
          <p className="category-grid__sub">Find your favorite style from high-octane action to comedy and classic anime</p>
        </div>

        <div className="category-grid__container">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-grid__card"
              style={{ '--cat-color': cat.color }}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div className="category-grid__card-glow" />
              <span className="category-grid__card-icon">{cat.icon}</span>
              <div className="category-grid__card-text">
                <span className="category-grid__card-name">{cat.name}</span>
                <span className="category-grid__card-hint">Browse Genre →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
