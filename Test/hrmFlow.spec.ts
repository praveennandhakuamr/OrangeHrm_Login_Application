import { test, expect } from "@playwright/test";
import { allure } from "allure-playwright";
import LoginPage from "../Pages/LoginPage";
import DashboardPage from "../Pages/DashboardPage";
import { readExcelCell } from "../utils/excelUtils";
import { exec } from "child_process";

const usernameCell = { row: 2, col: 1 };
const passwordCell = { row: 2, col: 2 };

test.describe("OrangeHRM Dynamic Login with POM", () => {
  test("Login using Excel cell dynamically", async ({ page }) => {

    const username = await readExcelCell("TestData/login.xlsx", usernameCell.row, usernameCell.col);
    const password = await readExcelCell("TestData/login.xlsx", passwordCell.row, passwordCell.col);

    if (!username || !password) throw new Error("Username or password not found in Excel");

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Allure Description
    await allure.description(`
      OrangeHRM Dynamic Login Test
      Username: ${username}
      Password: ${password}
      Steps:
        1. Navigate to login page
        2. Enter credentials
        3. Click login
        4. Verify dashboard header
    `);
    await allure.severity("critical");
    await allure.tag("POM-Dynamic-Excel");

    // Steps
    await allure.step("Navigate to login page", async () => {
      await loginPage.navigate();
    });

    await allure.step("Enter credentials and login", async () => {
      await loginPage.enterUsername(username);
      await loginPage.enterPassword(password);
      await loginPage.clickLogin();
    });

    await allure.step("Verify dashboard page", async () => {
      await dashboardPage.verifyDashboardHeader();
      console.log(`✔ Login successful for user: ${username}`);
    });
  });

  test.afterAll(async () => {
    console.log("Generating Allure report...");
    exec("allure generate allure-results --clean -o allure-report && allure open allure-report");
  });
});
