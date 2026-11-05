# CognoRise InfoTech — Web Development Internship

> **Batch:** October 2026 Cohort  
> **Intern:** Sandeep Kumar  
> **Track:** Web Development  
> **Repository:** [https://github.com/Sandeep2349/CognoRise-InfoTech](https://github.com/Sandeep2349/CognoRise-InfoTech)

---

## 📌 Repository Overview
This repository contains the verified assignments and project deliverables completed as part of the **CognoRise InfoTech Web Development Internship (October 2026)**.

---

## 📂 Repository Structure
```plaintext
CognoRise InfoTech/
│
├── README.md                          # Main internship documentation
│
├── Portfolio/                         # Task 1: Premium Personal Portfolio Website
│   ├── index.html                     # Semantic layout and accessible structure
│   ├── style.css                      # Custom design tokens, glassmorphism, responsive styles
│   └── script.js                      # Canvas particle physics, cursor lerp, tilt, and validation
│
└── E-commerce Product Listing/        # Task 2: E-Commerce Product Listing Application
    ├── index.html                     # React SPA entry point
    ├── package.json                   # React 19 + Vite dependencies
    ├── test-e2e.cjs                   # Automated Playwright test suite (28/28 tests passed)
    └── src/
        ├── App.jsx                    # Application layout and filtering orchestrator
        ├── index.css                  # Modern dark-glass e-commerce responsive styling
        ├── components/
        │   ├── Navbar.jsx             # Brand header with cart counter badge
        │   ├── FilterBar.jsx          # Search bar, category chips, sort, and reset
        │   ├── ProductCard.jsx        # Product presentation with Add to Cart action
        │   ├── ProductList.jsx        # Auto-fitting product grid & empty state
        │   ├── CartDrawer.jsx         # Slide-out modal cart with quantity controls & order summary
        │   └── Toast.jsx              # Action feedback toast notification
        ├── data/
        │   └── products.js            # Curated catalog of 12 tech products
        └── hooks/
            └── useCart.js             # Custom hook for cart state & LocalStorage persistence
```

---

## 🚀 Task 1 — Premium Personal Portfolio Website
A modern, high-performance personal portfolio website built with pure semantic web standards (**HTML5**, **CSS3**, and **Vanilla ES6+ JavaScript**), designed with an Awwwards-style dark glassmorphism aesthetic.

### ✨ Key Features:
- **Native Canvas Particle Physics**: Dynamic background stardust particles with proximity constellation lines, pointer attraction/repulsion, and interactive click shockwave ripples.
- **Fluid Magnetic Custom Cursor**: Ethereal dual-ring custom cursor with smooth lerp physics that expands on interactive elements.
- **Dynamic Role Typewriter**: Interactive headline cycling through core competencies.
- **Interactive Developer Terminal (`sandeep.config.ts`)**: macOS-style code card with syntax highlighting and one-click copy button.
- **Bento Grid Layout**: 12-column responsive Bento Grid in the About section.
- **Spotlight Border Glow & 3D Tilt**: Linear/Raycast-style dynamic border illumination and holographic glare reflection.
- **Accessible Form Validation**: Real-time error clearance, RFC 5322 regex email checking, and `aria-invalid` synchronization.

---

## 🛍️ Task 2 — E-Commerce Product Listing Application
A complete, beginner-friendly yet production-grade React e-commerce catalog featuring real-time search, category filtering, a persistent shopping cart, and zero backend dependencies.

### ✨ Key Features:
- **Responsive Product Grid:** Displays curated tech products with high-definition imagery, category pills, ratings, prices, and Add to Cart actions.
- **Shopping Cart with Duplicate Prevention:** Adding an existing item increments quantity rather than creating duplicate entries.
- **Quantity Stepper & Bounds Guard:** Increase (`+`) and decrease (`-`) controls with a strict lower bound of 1 (requires explicit removal action).
- **Concurrent Search & Category Filtering:** Search by name and filter by category work together in real time with sort options.
- **LocalStorage State Engine:** Cart persists across page reloads and defensively handles malformed/corrupted data without crashing.
- **Accessible Modal Drawer:** Keyboard-accessible slide-out cart with `Escape` key support, order summary, free shipping progress bar, and empty states.
- **Automated End-to-End Testing:** Fully tested across 7 test suites via Playwright with **28 out of 28 tests passing** (0 failures).

---

## 💻 Quick Run Instructions

### Running Task 1 (Portfolio)
```powershell
cd Portfolio
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080).

### Running Task 2 (E-Commerce Product Listing)
```powershell
cd "E-commerce Product Listing"
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### Running Automated Tests for Task 2
```powershell
cd "E-commerce Product Listing"
node test-e2e.cjs
```

---

## 👤 Developer Profile
- **Name:** Nagula Sandeep Kumar
- **GitHub:** [@Sandeep2349](https://github.com/Sandeep2349/)
- **LinkedIn:** [Sandeep Kumar](https://www.linkedin.com/in/sandeep-kumar-489042238/)
- **Email:** sandeepkumaar8908@gmail.com

---

*© 2026 Nagula Sandeep Kumar. Submitted for CognoRise InfoTech Internship Evaluation.*
