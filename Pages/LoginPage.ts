import { Page } from "@playwright/test";

export default class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto("https://opensource-demo.orangehrmlive.com/");
  }

  async enterUsername(username: string) {
    await this.page.locator('input[name="username"]').fill(username);
  }

  async enterPassword(password: string) {
    await this.page.locator('input[name="password"]').fill(password);
  }

  async clickLogin() {
    await this.page.locator('button[type="submit"]').click();
  }
}
