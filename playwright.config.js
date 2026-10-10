import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: process.env.DEMO_BASE_URL || 'http://127.0.0.1:3010',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: process.env.DEMO_BASE_URL
    ? undefined
    : {
        command: 'npm run dev -- --hostname 127.0.0.1 --port 3010',
        url: 'http://127.0.0.1:3010',
        reuseExistingServer: !process.env.CI,
      },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
