import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests', fullyParallel: true, reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4187', browserName: 'chromium' },
  projects: [{ name: 'desktop', use: { viewport: { width: 1440, height: 1100 } } }, { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } }],
  webServer: { command: 'npm run preview -- --port 4187 --strictPort', url: 'http://127.0.0.1:4187', reuseExistingServer: !process.env.CI },
})
