// import { test, expect } from "@playwright/test";
// import { readExcelData } from "../utils/Helper";
// import LoginPageModule from "../Pages/LoginHRM";
// const LoginPage = LoginPageModule;


// test("HRM login using Excel", async ({ page }) => {

//     const testData = await readExcelData("Data/ExcelData.xlsx");

//     if (testData.length === 0) {
//         throw new Error("Excel returned zero rows.");
//     }

//     for (const row of testData) {
//         const login = new LoginPage(page);

//         await login.goto();
//         await login.login(row.username, row.password);

//         // verify dashboard: check URL and dashboard heading
//         await expect(page).toHaveURL(/dashboard/);
//         await expect(page.locator('h6')).toContainText('Dashboard');

//         console.log(`✔ Login successful for user: ${row.username}`);
//     }
// });

import { test, expect } from "@playwright/test";
import { allure } from "allure-playwright";
import { readExcelRow } from "../utils/excelUtils";
import { exec } from "child_process";

// Only set which Excel row you want to use
const dataRow = 2; // e.g., 2nd row (after header)

test.describe("Orange HRM Dynamic Login", () => {

  test("Login using Excel row dynamically", async ({ page }) => {

    // ------------ Fetch username/password dynamically ------------
    const excelData = await readExcelRow("TestData/login.xlsx", dataRow);
    if (!excelData || !excelData.username || !excelData.password) {
      throw new Error(`No data found at row ${dataRow}`);
    }

    const { username, password } = excelData;

    // ------------ Allure metadata ------------
    await allure.description(`
      Dynamic login test fetching credentials from Excel row ${dataRow}:
      Username: ${username}
      Password: ${password}
      Steps:
        1. Navigate to login page
        2. Enter credentials
        3. Click login
        4. Validate dashboard
    `);
    await allure.severity("critical");
    await allure.owner("Praveen");
    await allure.tag("Dynamic Login");

    // ------------ Test Steps ------------
    await allure.step("Navigate to login page", async () => {
      await page.goto("https://opensource-demo.orangehrmlive.com/");
    });

    await allure.step(`Enter username: ${username}`, async () => {
      await page.locator('input[name="username"]').fill(username);
    });

    await allure.step("Enter password", async () => {
      await page.locator('input[name="password"]').fill(password);
    });

    await allure.step("Click login button", async () => {
      await page.locator('button[type="submit"]').click();
    });

    await allure.step("Verify dashboard page", async () => {
      // Wait for dashboard URL
      await page.waitForURL(/dashboard/, { timeout: 10000 });

      // Verify header (Dashboard) is visible
      await expect(page.locator('h6:has-text("Dashboard")')).toBeVisible({ timeout: 10000 });

      console.log(`✔ Login successful for user: ${username}`);
    });

  });

  // ------------ Auto-generate Allure report ------------
  test.afterAll(async () => {
    console.log("Generating Allure report...");
    exec("allure generate allure-results --clean -o allure-report && allure open allure-report", (err, stdout, stderr) => {
      if (err) {
        console.error(`Error generating Allure report: ${err}`);
        return;
      }
      console.log(stdout);
      console.error(stderr);
    });
  });

});
