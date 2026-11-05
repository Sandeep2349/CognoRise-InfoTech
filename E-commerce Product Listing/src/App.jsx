/**
 * CognoRise InfoTech Web Development Internship — Task 2
 * E-Commerce Product Listing Application
 * Developer: Sandeep Kumar
 */

import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from './data/products';
import { useCart } from './hooks/useCart';

import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ProductList from './components/ProductList';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';

export default function App() {
  // Cart Hook State & Actions
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice
  } = useCart();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // UI State: Cart Drawer & Toast Notifications
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Combined Search, Category Filter, and Sorting Memoization
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((product) => {
      // 1. Search Query Filter (name case-insensitive)
      const matchesSearch = searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

      // 2. Category Filter
      const matchesCategory = selectedCategory === 'All' ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // 3. Sorting Mechanism
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  // Reset all filters back to initial state
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
  };

  // Add to cart with feedback toast
  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage(`Added "${product.name}" to cart!`);
  };

  return (
    <div className="app-container" id="top">
      {/* Navigation Header */}
      <Navbar
        cartCount={totalItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hero Welcome Banner */}
      <section className="hero-banner">
        <div className="hero-banner-container">
          <div className="hero-banner-badge">CognoRise InfoTech &bull; Internship Task 2</div>
          <h1 className="hero-banner-title">
            Premium Gear &amp; Everyday Tech Essentials
          </h1>
          <p className="hero-banner-desc">
            Explore curated electronics, audio accessories, and wearables designed for peak productivity and modern lifestyles.
          </p>
        </div>
      </section>

      {/* Main Content Area: Filters & Products */}
      <main className="main-content">
        <div className="main-container">
          {/* Search, Category, and Sorting Controls */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            categories={CATEGORIES}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
            totalProducts={PRODUCTS.length}
          />

          {/* Product Grid / Empty State */}
          <ProductList
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onResetFilters={handleResetFilters}
          />
        </div>
      </main>

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        totalItems={totalItems}
        totalPrice={totalPrice}
      />

      {/* Visual Feedback Toast Notification */}
      <Toast
        message={toastMessage}
        onOpenCart={() => {
          setToastMessage('');
          setIsCartOpen(true);
        }}
        onClose={() => setToastMessage('')}
      />

      {/* Application Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} <strong>ApexStore</strong> by Nagula Sandeep Kumar.
          </p>
          <p className="footer-internship">
            Developed for <strong>CognoRise InfoTech Web Development Internship</strong> &bull; October 2026 Batch
          </p>
        </div>
      </footer>
    </div>
  );
}
