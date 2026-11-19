import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  async removeItem(productSlug: string): Promise<void> {
    await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((text) => {
      const match = /^\$(\d+(?:\.\d{2})?)$/.exec(text.trim());
      if (!match) {
        throw new Error(`Unexpected cart price: "${text}"`);
      }
      return Number(match[1]);
    });
  }

  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
