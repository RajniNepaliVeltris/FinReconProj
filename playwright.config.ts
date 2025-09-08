import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  reporter: [
    ['html', { 
      outputFolder: 'test-results',
      open: 'never',
      attachmentsBaseURL: 'attachments',
      attachments: true
    }],
    ['json', { 
      outputFile: 'test-results/report.json' 
    }],
    ['list', {
      printSteps: true,
      printProgress: true
    }]
  ],
  use: {
    actionTimeout: 0,
    trace: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'on',
    video: 'retain-on-failure',
    testIdAttribute: 'data-testid',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'existing-chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
      },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});