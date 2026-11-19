import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

const PASSWORD = 'secret_sauce';
const PRODUCT = 'sauce-labs-backpack';
const PRODUCT_NAME = 'Sauce Labs Backpack';

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', PASSWORD);

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.addToCart(PRODUCT);
    await inventory.openCart();
  });

  test('04 add product updates badge and cart', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await expect(inventory.cartBadge).toHaveText('1');
    await expect(cart.items).toHaveCount(1);
    expect(await cart.getItemNames()).toEqual([PRODUCT_NAME]);
  });

  test('05 remove product empties cart and clears badge', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await cart.removeItem(PRODUCT);
    await expect(cart.items).toHaveCount(0);
    await expect(inventory.cartBadge).toHaveCount(0);
  });

  test('06 sort by price low to high is ascending', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await page.goto('/inventory.html');
    await inventory.expectLoaded();

    await inventory.sortBy('lohi');
    const prices = await inventory.getPrices();

    expect(prices.length).toBeGreaterThan(0);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
