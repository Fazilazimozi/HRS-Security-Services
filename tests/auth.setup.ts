import { test as setup, expect } from '@playwright/test';
import * as path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const username = process.env.TEST_USER || process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  if (!username || !password) {
    throw new Error('TEST_USER (or TEST_USERNAME) and TEST_PASSWORD environment variables must be defined.');
  }

  await page.goto(baseURL);

  const emailInput = page.getByPlaceholder(/email/i).or(page.getByLabel(/email/i)).or(page.locator('input[type="email"]'));
  const passwordInput = page.getByPlaceholder(/password/i).or(page.getByLabel(/password/i)).or(page.locator('input[type="password"]'));
  const submitButton = page.getByRole('button', { name: /sign in|log in|submit/i });

  await expect(emailInput).toBeVisible({ timeout: 10000 });
  await emailInput.fill(username);
  await passwordInput.fill(password);
  await submitButton.click();

  await page.waitForLoadState('networkidle');
  await page.context().storageState({ path: authFile });
});
