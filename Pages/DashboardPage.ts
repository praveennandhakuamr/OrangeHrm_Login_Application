import { Page, expect } from "@playwright/test";

export default class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyDashboardHeader() {
    await this.page.waitForURL(/dashboard/, { timeout: 10000 });
    await expect(this.page.locator('h6:has-text("Dashboard")')).toBeVisible({ timeout: 10000 });
  }
}
