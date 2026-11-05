# ApexStore — E-Commerce Product Listing Application

> **CognoRise InfoTech Web Development Internship — Task 2**  
> **Developer:** Sandeep Kumar  
> **Batch:** October 2026 Cohort  
> **Repository:** [https://github.com/Sandeep2349/CognoRise-InfoTech](https://github.com/Sandeep2349/CognoRise-InfoTech)

---

## 🛍️ Overview
**ApexStore** is a modern, responsive React-based E-Commerce Product Listing application built as part of **Task 2** for the CognoRise InfoTech Web Development Internship.

The application allows users to explore a catalog of tech gadgets and gear, search in real-time by product name, filter by category, sort by price or rating, and manage a persistent shopping cart with quantity controls and zero-dependency client-side architecture.

---

## ⚡ Core Features

### 1. Product Listing
- Responsive product grid with fluid auto-fitting cards.
- Each product displays high-definition imagery, category badge, name, rating & reviews, detailed description, price in USD, and an interactive **Add to Cart** button with micro-animation.

### 2. Full-Featured Shopping Cart
- Slide-out modal cart drawer with backdrop blur.
- **Duplicate Prevention:** Adding an existing product automatically updates its quantity rather than creating duplicate entries.
- **Quantity Stepper:** Increment (`+`) and decrement (`-`) quantity controls.
- **Strict Boundary Guard:** Quantity cannot decrease below 1 (requires explicit user action to remove).
- **Individual Product Removal:** Trash action to remove specific products.
- **Cart Summary:** Real-time item count, subtotal, shipping calculation, and estimated order total.
- **Empty Cart State:** Friendly empty-cart state with a quick *"Start Shopping"* action.
- **Clear Entire Cart:** Quick action to reset cart state.

### 3. Real-Time Search & Filtering
- Instant substring search by product name with a clear button (`✕`).
- Category filter chips (*All, Electronics, Audio, Wearables, Accessories*).
- **Concurrent Filtering:** Search and category filtering work simultaneously.
- Sorting dropdown (*Featured, Price: Low to High, Price: High to Low, Highest Rated, Name A-Z*).
- **Reset Filters:** One-click reset restoring all 12 products.
- **Empty Search State:** Clean user feedback when search/filter returns zero matches.

### 4. LocalStorage State Engine
- Cart state automatically synchronizes to browser LocalStorage under the key `cognorise_ecommerce_cart`.
- Restores cart state on page reload without visual flicker.
- **Defensive Error Handling:** Safely falls back to an empty cart without crashing if LocalStorage contains malformed or corrupted JSON.

### 5. Accessibility & Responsiveness
- WCAG AA compliant contrast ratios and visible `:focus-visible` outlines.
- Complete keyboard navigation with `Escape` key drawer dismissal and keyboard-accessible buttons.
- Tested and verified on desktop, tablet, and mobile screens down to 320px with zero horizontal overflow.

---

## 🛠️ Technology Stack
- **Library:** React 19 (React Hooks: `useState`, `useEffect`, `useMemo`, `useRef`)
- **Language:** JavaScript (ES6+)
- **Build Tool:** Vite 8
- **Styling:** CSS3 (Custom Properties, Flexbox, CSS Grid)
- **State Persistence:** Browser LocalStorage API
- **Testing:** Playwright End-to-End Test Suite

---

## 📁 Architecture & File Structure
```plaintext
E-commerce Product Listing/
│
├── index.html                   # HTML entry point with meta tags & fonts
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite configuration
├── test-e2e.cjs                 # Automated Playwright E2E test suite (28/28 tests passed)
│
└── src/
    ├── main.jsx                 # React root rendering
    ├── App.jsx                  # Main application orchestrator
    ├── index.css                # Design tokens, responsive grid, drawer & animations
    │
    ├── components/
    │   ├── Navbar.jsx           # Brand header with cart counter trigger
    │   ├── FilterBar.jsx        # Search, category chips, sort, and reset controls
    │   ├── ProductCard.jsx      # Individual product card presentation
    │   ├── ProductList.jsx      # Responsive grid & empty state
    │   ├── CartDrawer.jsx       # Slide-out cart modal & order summary
    │   └── Toast.jsx            # Action feedback notification
    │
    ├── data/
    │   └── products.js          # Curated catalog of 12 tech products
    │
    └── hooks/
        └── useCart.js           # Custom hook for cart state & LocalStorage logic
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```powershell
npm install
```

### 2. Start Development Server
```powershell
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Production Build
```powershell
npm run build
```

### 4. Run Automated End-to-End Tests
```powershell
node test-e2e.cjs
```

---

## 🧪 Automated Testing Summary (28 / 28 Tests Passed)
The application was tested across 7 test suites via Playwright:
- ✅ **Application Setup:** Validates title, viewport, and error-free initial boot.
- ✅ **Product Listing:** Verifies 12 products with name, price, image, category, and action buttons.
- ✅ **Shopping Cart:** Verifies add, duplicate quantity increment, stepper bounds ($\ge 1$), deletion, total price calculation, and empty state.
- ✅ **Search & Filtering:** Verifies substring search, category filter, combined queries, and filter reset.
- ✅ **LocalStorage:** Verifies persistence, page reload state restoration, and corrupted JSON resilience.
- ✅ **Responsive UI:** Verifies 0 horizontal overflow across desktop (1280px), tablet (768px), and mobile (375px).
- ✅ **Accessibility & Console:** Verifies Tab navigation, active element focus rings, aria-labels, and 0 console errors.

---

*© 2026 Nagula Sandeep Kumar. Built for CognoRise InfoTech Web Development Internship.*
