/**
 * ProductList Component
 * Renders the responsive grid of product cards or an empty state when no matches exist.
 */

import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, onAddToCart, onResetFilters }) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-products-state" role="status" aria-live="polite">
        <div className="empty-icon" aria-hidden="true">🔎</div>
        <h3 className="empty-title">No products found</h3>
        <p className="empty-desc">
          We couldn't find any products matching your current search or category filter.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onResetFilters}
          aria-label="Clear all filters to view all products"
        >
          Clear Filters ↺
        </button>
      </div>
    );
  }

  return (
    <section className="products-grid" aria-label="Available Products">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </section>
  );
}
