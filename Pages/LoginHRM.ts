import type { Page, Locator } from "@playwright/test";

class LoginPage {
    username: Locator;
    password: Locator;
    loginBtn: Locator;

    constructor(private page: Page) {
        this.username = this.page.locator('input[name="username"]');
        this.password = this.page.locator('input[name="password"]');
        this.loginBtn = this.page.locator('button[type="submit"]');
    }

    async goto() {
        await this.page.goto("https://opensource-demo.orangehrmlive.com/");
    }

    async login(username: string, password: string) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginBtn.click();
    }
}

export default LoginPage;
