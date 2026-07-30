import { defineConfig, devices } from "@playwright/test";

const externalServer = process.env.PW_EXTERNAL_SERVER === "1";
const baseURL = process.env.PW_BASE_URL || process.env.HOSTED_BASE_URL || (externalServer ? "https://ordivon-web-v2-preview.ordivon-lab.workers.dev" : "http://127.0.0.1:8788");

export default defineConfig({
  testDir: "./tests/release",
  fullyParallel: false,
  workers: 1,
  retries: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: externalServer ? undefined : {
    command: "pnpm preview:static",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium-release", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox-release", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit-release", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chromium-release", use: { ...devices["Pixel 7"] } },
  ],
});
