/**
 * CartDrawer Component
 * Slide-out modal drawer displaying items in cart, quantity stepper,
 * item removal, total pricing calculation, and empty state.
 */

import React, { useEffect, useRef } from 'react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  totalItems,
  totalPrice
}) {
  const drawerRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose} aria-hidden={!isOpen}>
      <div
        className="cart-drawer"
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <span className="cart-header-icon" aria-hidden="true">🛒</span>
            <h2>Your Cart</h2>
            <span className="cart-header-badge">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
          </div>

          <button
            type="button"
            className="cart-close-btn"
            onClick={onClose}
            aria-label="Close shopping cart"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="cart-promo-bar">
          {totalPrice >= 150 ? (
            <span className="promo-success">🎉 You qualify for <strong>FREE Express Shipping</strong>!</span>
          ) : (
            <span>
              Add <strong>${(150 - totalPrice).toFixed(2)}</strong> more to unlock <strong>FREE Shipping</strong>!
            </span>
          )}
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-fill"
              style={{ width: `${Math.min(100, (totalPrice / 150) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Drawer Content */}
        {cart.length === 0 ? (
          <div className="cart-empty-state">
            <div className="empty-cart-icon" aria-hidden="true">🛍️</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
              aria-label="Start shopping and explore products"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="cart-items-list" tabIndex={0} aria-label="Cart items list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-details">
                    <span className="cart-item-category">{item.category}</span>
                    <h4 className="cart-item-title">{item.name}</h4>
                    
                    <div className="cart-item-price-row">
                      <span className="cart-item-unit-price">${item.price.toFixed(2)} each</span>
                      <span className="cart-item-subtotal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity Stepper & Remove Action */}
                    <div className="cart-item-actions">
                      <div className="quantity-stepper" role="group" aria-label={`Quantity controls for ${item.name}`}>
                        <button
                          type="button"
                          className="qty-btn qty-decrease"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}. Current: ${item.quantity}`}
                          title={item.quantity <= 1 ? "Minimum quantity is 1. Click Remove to delete." : "Decrease quantity"}
                        >
                          −
                        </button>

                        <span className="qty-value" aria-label={`Current quantity: ${item.quantity}`}>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          className="qty-btn qty-increase"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          aria-label={`Increase quantity of ${item.name}. Current: ${item.quantity}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <span aria-hidden="true">🗑️</span> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer & Order Summary */}
            <div className="cart-footer">
              <div className="cart-summary-row">
                <span>Total Items:</span>
                <span className="summary-val">{totalItems}</span>
              </div>

              <div className="cart-summary-row">
                <span>Shipping:</span>
                <span className="summary-val text-success">
                  {totalPrice >= 150 ? 'FREE' : '$9.99'}
                </span>
              </div>

              <div className="cart-summary-divider"></div>

              <div className="cart-summary-row total-row">
                <span>Estimated Total:</span>
                <span className="cart-total-price">
                  ${(totalPrice + (totalPrice >= 150 || totalPrice === 0 ? 0 : 9.99)).toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block checkout-btn"
                onClick={() => alert(`Thank you for testing! Your order total is $${(totalPrice + (totalPrice >= 150 ? 0 : 9.99)).toFixed(2)}. (Simulation for CognoRise InfoTech Task 2)`)}
              >
                Proceed to Checkout →
              </button>

              <button
                type="button"
                className="cart-clear-btn"
                onClick={onClearCart}
                aria-label="Clear all items from shopping cart"
              >
                Clear Entire Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
