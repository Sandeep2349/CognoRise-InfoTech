/**
 * FilterBar Component
 * Search input, Category filter pills, Sort selection, and Filter Reset button.
 */

import React from 'react';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
  onResetFilters,
  totalResults,
  totalProducts
}) {
  const isFiltered = searchQuery.trim() !== '' || selectedCategory !== 'All' || sortBy !== 'featured';

  return (
    <section className="filter-section" aria-label="Product Search and Filters">
      <div className="filter-container">
        
        {/* Top Row: Search Input & Sort Dropdown */}
        <div className="filter-controls-row">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search products by name"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>

          <div className="sort-wrapper">
            <label htmlFor="sort-select" className="sort-label">Sort by:</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Bottom Row: Category Filter Tabs & Reset Action */}
        <div className="category-chips-row">
          <div className="category-chips" role="tablist" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="filter-status-actions">
            <span className="results-count" aria-live="polite">
              Showing <strong>{totalResults}</strong> of {totalProducts} products
            </span>

            {isFiltered && (
              <button
                type="button"
                className="reset-filters-btn"
                onClick={onResetFilters}
                aria-label="Reset all search and category filters"
              >
                Reset Filters ↺
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
