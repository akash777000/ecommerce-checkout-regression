# E-Commerce Checkout Regression

Automated end-to-end tests for the checkout journey on [SauceDemo](https://www.saucedemo.com/), a public demo store built for test practice.

The suite uses **Playwright** to drive Chromium and **TypeScript** to keep tests and page interactions organized. It checks realistic user flows—from login through order confirmation—without making real purchases.

## What’s covered

| Test | Scenario | What it verifies |
| --- | --- | --- |
| 01 | Valid login | A standard user reaches the inventory page |
| 02 | Locked account | A locked user is denied with an error |
| 03 | Required username | An empty username is rejected |
| 04 | Add to cart | The cart badge and item list update |
| 05 | Remove from cart | The item and cart badge are removed |
| 06 | Sort products | Prices are displayed from low to high |
| 07 | Checkout validation | Checkout blocks an empty first name |
| 08 | Complete checkout | The subtotal is correct and the order confirmation appears |

## Quick start

### Requirements

- Node.js 18 or newer
- npm

### Install

From the project directory, run:

```powershell
npm ci
npx playwright install chromium
```

### Run the tests

```powershell
npm test
```

The tests open SauceDemo, so an internet connection is required.

## Useful commands

```powershell
npm run typecheck                              # Check TypeScript types
npx playwright test tests/cart.spec.ts         # Run one test file
npx playwright test -g "08"                    # Run the test whose name includes "08"
npm run test:headed                            # Watch the tests in a visible browser
npm run test:report                            # Open the HTML report after a run
```

## Project layout

```text
.
├── pages/
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── InventoryPage.ts
│   └── LoginPage.ts
├── tests/
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── login.spec.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

- **`tests/`** describes the expected user-visible behavior.
- **`pages/`** keeps selectors and page actions in page objects, separate from test scenarios.
- **`playwright.config.ts`** configures Chromium, the site URL, and failure screenshots/traces.

## How it works

Each test gets a fresh browser context. The page objects wrap common actions such as logging in, adding an item, and completing checkout. Tests use Playwright assertions to wait for and verify visible results instead of relying on fixed delays.

The suite checks the checkout subtotal against the cart total in cents to avoid floating-point rounding issues.

## Scope and limitations

- This is a practice/portfolio project for the public SauceDemo site, not a production test suite.
- Chromium is the only configured browser.
- The tests depend on SauceDemo being available and its page content remaining compatible with the selectors.
