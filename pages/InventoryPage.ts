import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortSelect: Locator;
  readonly itemPrices: Locator;
  readonly inventoryList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.itemPrices = page.locator('.inventory_item_price');
    this.inventoryList = page.locator('.inventory_list');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.inventoryList).toBeVisible();
  }

  async addToCart(productSlug: string): Promise<void> {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  async sortBy(optionValue: string): Promise<void> {
    await this.sortSelect.selectOption(optionValue);
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((text) => {
      const match = /^\$(\d+(?:\.\d{2})?)$/.exec(text.trim());
      if (!match) {
        throw new Error(`Unexpected product price: "${text}"`);
      }
      return Number(match[1]);
    });
  }

  async getBadgeText(): Promise<string> {
    return (await this.cartBadge.textContent()) ?? '';
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
