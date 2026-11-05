/**
 * ProductCard Component
 * Displays individual product details, category tag, rating, and Add to Cart action.
 */

import React, { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => {
      setIsAdding(false);
    }, 450);
  };

  return (
    <article className="product-card" aria-label={product.name}>
      {/* Product Image Container */}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.badge && (
          <span className="product-badge" aria-label={`Badge: ${product.badge}`}>
            {product.badge}
          </span>
        )}
        <span className="product-category-pill">{product.category}</span>
      </div>

      {/* Product Information */}
      <div className="product-content">
        <div className="product-rating">
          <span className="rating-stars" aria-hidden="true">★</span>
          <span className="rating-score">{product.rating.toFixed(1)}</span>
          <span className="rating-reviews">({product.reviews})</span>
        </div>

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <p className="product-description">
          {product.description}
        </p>

        {/* Pricing & Add to Cart Footer */}
        <div className="product-footer">
          <div className="product-pricing">
            <span className="price-label">Price</span>
            <span className="product-price">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart for $${product.price.toFixed(2)}`}
          >
            <span className="btn-icon" aria-hidden="true">
              {isAdding ? '✓' : '+'}
            </span>
            <span>{isAdding ? 'Added' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
