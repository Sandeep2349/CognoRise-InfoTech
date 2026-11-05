/**
 * Navbar Component
 * Displays brand identity, internship badge, and shopping cart trigger button.
 */

import React from 'react';

export default function Navbar({ cartCount, onOpenCart }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo & Internship Tag */}
        <div className="navbar-brand">
          <a href="#top" className="brand-link" aria-label="ApexStore Home">
            <span className="brand-icon" aria-hidden="true">🛍️</span>
            <span className="brand-name">Apex<span className="brand-accent">Store</span></span>
          </a>
          <span className="brand-badge">CognoRise Task 2</span>
        </div>

        {/* Right Action: Cart Trigger Button */}
        <div className="navbar-actions">
          <button
            type="button"
            className="cart-trigger-btn"
            onClick={onOpenCart}
            aria-label={`View shopping cart with ${cartCount} items`}
          >
            <span className="cart-icon" aria-hidden="true">🛒</span>
            <span className="cart-btn-label">Cart</span>
            <span className="cart-count-badge" data-count={cartCount}>
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
