import { test, expect } from "@playwright/test";
import { readExcelData } from "../utils/Helper";
import LoginPageModule from "../Pages/LoginHRM";
const LoginPage = LoginPageModule;


test("HRM login using Excel", async ({ page }) => {

    const testData = await readExcelData("Data/ExcelData.xlsx");

    if (testData.length === 0) {
        throw new Error("Excel returned zero rows.");
    }

    for (const row of testData) {
        const login = new LoginPage(page);

        await login.goto();
        await login.login(row.username, row.password);

        // verify dashboard: check URL and dashboard heading
        await expect(page).toHaveURL(/dashboard/);
        await expect(page.locator('h6')).toContainText('Dashboard');

        console.log(`✔ Login successful for user: ${row.username}`);
    }
});
