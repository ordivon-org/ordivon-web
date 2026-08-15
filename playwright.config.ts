import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:8788", trace: "retain-on-failure", launchOptions: { executablePath: process.env.ORDIVON_WEB_BROWSER, args: ["--disable-dev-shm-usage"] } },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
