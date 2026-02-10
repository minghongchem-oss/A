import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:3000' },
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: true,
    env: { MOCK_IMAGERY: '1', DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/tuxun' }
  }
});
