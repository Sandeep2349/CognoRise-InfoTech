/**
 * Automated End-to-End Playwright Test Suite
 * CognoRise InfoTech Web Development Internship — Task 2
 * E-Commerce Product Listing Application
 */

const { chromium } = require('playwright');

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const testResults = [];
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  const record = (suite, testName, passed, details = '') => {
    testResults.push({
      suite,
      name: testName,
      status: passed ? 'PASS' : 'FAIL',
      details
    });
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${suite} - ${testName} ${details ? '(' + details + ')' : ''}`);
  };

  try {
    // -------------------------------------------------------------
    // 1. Application Setup
    // -------------------------------------------------------------
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    const pageTitle = await page.title();
    const isTitleValid = pageTitle.includes('ApexStore') || pageTitle.includes('E-Commerce');
    record('Application Setup', 'Application loads without errors', isTitleValid, `Title: "${pageTitle}"`);

    // -------------------------------------------------------------
    // 2. Product Listing Tests
    // -------------------------------------------------------------
    const productCards = await page.locator('.product-card');
    const productCount = await productCards.count();
    record('Product Listing', 'Displays responsive grid with all 12 products', productCount === 12, `Found ${productCount} products`);

    // Verify first product structure (Image, Name, Price, Category, Add to Cart button)
    const firstProduct = productCards.first();
    const hasImage = await firstProduct.locator('.product-image').isVisible();
    const hasTitle = (await firstProduct.locator('.product-title').innerText()).trim().length > 0;
    const hasPrice = (await firstProduct.locator('.product-price').innerText()).includes('$');
    const hasCategory = (await firstProduct.locator('.product-category-pill').innerText()).trim().length > 0;
    const hasAddBtn = await firstProduct.locator('.add-to-cart-btn').isVisible();

    const allFieldsPresent = hasImage && hasTitle && hasPrice && hasCategory && hasAddBtn;
    record('Product Listing', 'Product cards contain image, title, price, category, and Add to Cart button', allFieldsPresent);

    // -------------------------------------------------------------
    // 3. Shopping Cart Tests
    // -------------------------------------------------------------
    // Initial empty state check
    await page.click('.cart-trigger-btn');
    const emptyStateVisible = await page.locator('.cart-empty-state').isVisible();
    record('Shopping Cart', 'Displays appropriate empty-cart state initially', emptyStateVisible);
    await page.click('.cart-close-btn');

    // Add first product to cart
    await firstProduct.locator('.add-to-cart-btn').click();
    await page.waitForTimeout(400); // allow toast and state update
    let cartBadgeCount = await page.locator('.cart-count-badge').innerText();
    record('Shopping Cart', 'Add product to cart updates badge count to 1', cartBadgeCount === '1', `Badge: ${cartBadgeCount}`);

    // Add same product again (Duplicate prevention: quantity should increment to 2, not duplicate card)
    await firstProduct.locator('.add-to-cart-btn').click();
    await page.waitForTimeout(400);
    cartBadgeCount = await page.locator('.cart-count-badge').innerText();
    record('Shopping Cart', 'Adding duplicate product increments quantity to 2 instead of duplicating', cartBadgeCount === '2', `Badge: ${cartBadgeCount}`);

    // Open Cart Drawer
    await page.click('.cart-trigger-btn');
    const cartItems = await page.locator('.cart-item');
    const uniqueItemCount = await cartItems.count();
    const currentQtyText = await page.locator('.qty-value').first().innerText();
    record('Shopping Cart', 'Cart drawer contains 1 unique row with quantity 2', uniqueItemCount === 1 && currentQtyText === '2');

    // Test increase quantity button (+)
    await page.click('.qty-increase');
    const qtyAfterIncrease = await page.locator('.qty-value').first().innerText();
    record('Shopping Cart', 'Increase quantity (+) button updates quantity to 3', qtyAfterIncrease === '3');

    // Test decrease quantity button (-)
    await page.click('.qty-decrease');
    await page.click('.qty-decrease');
    const qtyAfterDecrease = await page.locator('.qty-value').first().innerText();
    record('Shopping Cart', 'Decrease quantity (-) button updates quantity down to 1', qtyAfterDecrease === '1');

    // Test decrease button when quantity is 1 (boundary check: cannot go below 1)
    const isDecreaseDisabled = await page.locator('.qty-decrease').first().isDisabled();
    await page.click('.qty-decrease', { force: true });
    const qtyAfterBoundary = await page.locator('.qty-value').first().innerText();
    record('Shopping Cart', 'Quantity cannot decrease below 1 (button disabled/guarded)', isDecreaseDisabled && qtyAfterBoundary === '1');

    // Test remove item from cart
    await page.click('.cart-remove-btn');
    const isEmptyAfterRemove = await page.locator('.cart-empty-state').isVisible();
    record('Shopping Cart', 'Remove individual product removes item and shows empty state', isEmptyAfterRemove);

    // Add multiple different products and verify total price
    await page.click('.cart-close-btn');
    const secondProduct = productCards.nth(1);
    const thirdProduct = productCards.nth(2);

    await secondProduct.locator('.add-to-cart-btn').click();
    await page.waitForTimeout(300);
    await thirdProduct.locator('.add-to-cart-btn').click();
    await page.waitForTimeout(300);

    await page.click('.cart-trigger-btn');
    const multiCartItems = await page.locator('.cart-item').count();
    const totalItemsSummary = await page.locator('.cart-summary-row .summary-val').first().innerText();
    record('Shopping Cart', 'Displays correct total quantity for multiple distinct products', multiCartItems === 2 && totalItemsSummary === '2');
    await page.click('.cart-close-btn');

    // -------------------------------------------------------------
    // 4. Search and Filtering Tests
    // -------------------------------------------------------------
    // Search for existing product
    await page.fill('.search-input', 'Sony');
    await page.waitForTimeout(200);
    const searchResultsCount = await page.locator('.product-card').count();
    const resultTitle = await page.locator('.product-card .product-title').first().innerText();
    record('Search and Filtering', 'Search for existing product returns matching results', searchResultsCount === 1 && resultTitle.includes('Sony'));

    // Search for non-existent product
    await page.fill('.search-input', 'NonExistentGadgetX123');
    await page.waitForTimeout(200);
    const emptySearchVisible = await page.locator('.empty-products-state').isVisible();
    record('Search and Filtering', 'Search for non-existent product shows empty state', emptySearchVisible);

    // Reset via empty state button
    await page.click('.empty-products-state .btn-secondary');
    await page.waitForTimeout(200);
    const afterResetCount = await page.locator('.product-card').count();
    record('Search and Filtering', 'Reset filters restores all 12 products', afterResetCount === 12);

    // Filter by category
    await page.click('button.category-chip:has-text("Audio")');
    await page.waitForTimeout(200);
    const audioCount = await page.locator('.product-card').count();
    record('Search and Filtering', 'Category filter returns only Audio products', audioCount === 3, `Found ${audioCount} audio products`);

    // Combined Search and Category filter
    await page.fill('.search-input', 'AirPods');
    await page.waitForTimeout(200);
    const combinedCount = await page.locator('.product-card').count();
    const combinedTitle = await page.locator('.product-card .product-title').first().innerText();
    record('Search and Filtering', 'Combined search and category filtering works concurrently', combinedCount === 1 && combinedTitle.includes('AirPods'));

    // Reset filters from FilterBar button
    await page.click('.reset-filters-btn');
    await page.waitForTimeout(200);
    const restoredCount = await page.locator('.product-card').count();
    const restoredCategory = await page.locator('button.category-chip.active').innerText();
    record('Search and Filtering', 'Reset filters button resets both search query and category tabs', restoredCount === 12 && restoredCategory === 'All');

    // -------------------------------------------------------------
    // 5. LocalStorage Tests
    // -------------------------------------------------------------
    // Cart currently has 2 items from earlier. Let's inspect localStorage
    const storedCartRaw = await page.evaluate(() => localStorage.getItem('cognorise_ecommerce_cart'));
    const storedCart = JSON.parse(storedCartRaw);
    record('LocalStorage', 'Cart data persists in LocalStorage correctly', Array.isArray(storedCart) && storedCart.length === 2);

    // Reload page and verify state restoration
    await page.reload({ waitUntil: 'networkidle' });
    const restoredBadge = await page.locator('.cart-count-badge').innerText();
    record('LocalStorage', 'Cart data is restored correctly after page reload', restoredBadge === '2', `Restored badge count: ${restoredBadge}`);

    // Test resilience against corrupted LocalStorage data
    await page.evaluate(() => localStorage.setItem('cognorise_ecommerce_cart', '{corrupted_malformed_json...'));
    await page.reload({ waitUntil: 'networkidle' });
    const resilienceBadge = await page.locator('.cart-count-badge').innerText();
    const pageStillWorking = await page.locator('.product-card').count();
    record('LocalStorage', 'Handles corrupted/invalid LocalStorage data safely without crashing', resilienceBadge === '0' && pageStillWorking === 12);

    // -------------------------------------------------------------
    // 6. Responsive UI Tests
    // -------------------------------------------------------------
    // Desktop (1280x800)
    await page.setViewportSize({ width: 1280, height: 800 });
    const desktopOverflow = await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth);
    record('Responsive UI', 'Desktop layout (1280px) renders without horizontal overflow', !desktopOverflow);

    // Tablet (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletOverflow = await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth);
    record('Responsive UI', 'Tablet layout (768px) renders without horizontal overflow', !tabletOverflow);

    // Mobile (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileOverflow = await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth);
    record('Responsive UI', 'Mobile layout (375px) renders without horizontal overflow', !mobileOverflow);

    // Mobile Cart Usability
    await page.click('.cart-trigger-btn');
    const mobileDrawerVisible = await page.locator('.cart-drawer').isVisible();
    record('Responsive UI', 'Cart drawer is fully accessible and usable on mobile screens', mobileDrawerVisible);
    await page.click('.cart-close-btn');

    // -------------------------------------------------------------
    // 7. Accessibility and Browser Checks
    // -------------------------------------------------------------
    // Test keyboard focus indicators and Tab navigation
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.keyboard.press('Tab');
    const activeTagName = await page.evaluate(() => document.activeElement ? document.activeElement.tagName : '');
    record('Accessibility', 'Keyboard Tab navigation sets focus on interactive elements', ['A', 'BUTTON', 'INPUT'].includes(activeTagName), `Active: <${activeTagName}>`);

    // Verify all Add to Cart buttons have accessible aria-labels
    const allAddBtns = page.locator('.add-to-cart-btn');
    let allAriaValid = true;
    const btnCount = await allAddBtns.count();
    for (let i = 0; i < btnCount; i++) {
      const aria = await allAddBtns.nth(i).getAttribute('aria-label');
      if (!aria || !aria.includes('Add')) {
        allAriaValid = false;
        break;
      }
    }
    record('Accessibility', 'Interactive Add to Cart buttons have descriptive accessible names', allAriaValid);

    // Browser console errors check
    record('Accessibility', 'Zero browser console or runtime errors during user journey', consoleErrors.length === 0, consoleErrors.length > 0 ? consoleErrors.join(', ') : 'No errors');

  } catch (err) {
    console.error('Test execution error:', err);
    record('General', 'Test suite crashed', false, err.message);
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n============================================================');
  console.log('              PLAYWRIGHT TEST EXECUTION SUMMARY              ');
  console.log('============================================================');
  const passes = testResults.filter(r => r.status === 'PASS').length;
  const fails = testResults.filter(r => r.status === 'FAIL').length;
  console.log(`TOTAL TESTS: ${testResults.length} | PASS: ${passes} | FAIL: ${fails}\n`);

  process.exit(fails > 0 ? 1 : 0);
}

runTests();
