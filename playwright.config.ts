import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./Test",

  reporter: [
    ["list"],
    ["allure-playwright", { outputFolder: "allure-results", detail: true }]
  ],

  use: {
    headless: false,
    screenshot: "on",
    video: "off",
    trace: "on",
  },
});
