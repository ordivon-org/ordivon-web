import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  webServer: { command: "pnpm start", url: "http://127.0.0.1:8788", reuseExistingServer: !process.env.CI, timeout: 120_000, stdout: "ignore", stderr: "ignore" },
  use: { baseURL: "http://127.0.0.1:8788", trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
