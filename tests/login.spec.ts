import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const PASSWORD = 'secret_sauce';

test.describe('Login', () => {
  test('01 valid login opens the inventory page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('02 locked account is denied with an error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('locked_out_user', PASSWORD);

    await login.expectErrorContaining('locked out');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('03 empty username shows a validation error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('', PASSWORD);

    await login.expectErrorContaining('Username is required');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
