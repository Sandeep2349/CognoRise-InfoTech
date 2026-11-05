/**
 * Toast Notification Component
 * Provides smooth, non-intrusive feedback when actions like Add to Cart occur.
 */

import React, { useEffect } from 'react';

export default function Toast({ message, onOpenCart, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="toast-banner" role="status" aria-live="polite">
      <div className="toast-content">
        <span className="toast-icon" aria-hidden="true">✓</span>
        <span className="toast-message">{message}</span>
      </div>

      <div className="toast-actions">
        {onOpenCart && (
          <button
            type="button"
            className="toast-view-cart-btn"
            onClick={onOpenCart}
          >
            View Cart
          </button>
        )}
        <button
          type="button"
          className="toast-dismiss-btn"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
