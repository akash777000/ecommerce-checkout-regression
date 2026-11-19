import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

const PASSWORD = 'secret_sauce';
const PRODUCT = 'sauce-labs-backpack';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', PASSWORD);

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.addToCart(PRODUCT);
    await inventory.openCart();
  });

  test('07 empty first name blocks checkout', async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await cart.proceedToCheckout();
    await checkout.fillInfo('', 'Rao', '560001');
    await checkout.clickContinue();

    await expect(checkout.errorMessage).toContainText('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('08 complete purchase shows confirmation', async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const cartPrices = await cart.getPrices();
    const expectedTotalInCents = cartPrices.reduce(
      (sum, price) => sum + Math.round(price * 100),
      0,
    );

    await cart.proceedToCheckout();
    await checkout.fillInfo('Asha', 'Rao', '560001');
    await checkout.clickContinue();

    expect(Math.round((await checkout.getSubtotal()) * 100)).toBe(expectedTotalInCents);

    await checkout.finish();
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  });
});
