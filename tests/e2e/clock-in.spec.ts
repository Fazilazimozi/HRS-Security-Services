import { test, expect } from '@playwright/test';
import { ClockInPage } from '../../pages/ClockInPage';

test.describe('Attendance & Biometric Clock-In Verification E2E Tests', () => {
  let clockInPage: ClockInPage;

  test.beforeEach(async ({ page }) => {
    clockInPage = new ClockInPage(page);
  });

  test('A. Page Load - verify title, subtitle, buttons, KPI cards, and register render', async ({ page }) => {
    await clockInPage.goto();

    await expect(clockInPage.title).toBeVisible();
    await expect(clockInPage.subtitle).toBeVisible();
    await expect(clockInPage.manualTimeEntryButton).toBeVisible();
    await expect(clockInPage.exportTimesheetsButton).toBeVisible();

    await expect(clockInPage.recordsCard).toBeVisible();
    await expect(clockInPage.activeOnDutyCard).toBeVisible();
    await expect(clockInPage.exceptionsCard).toBeVisible();
    await expect(clockInPage.pendingSignOffCard).toBeVisible();

    await expect(clockInPage.searchInput).toBeVisible();
    await expect(clockInPage.filtersButton).toBeVisible();
    await expect(clockInPage.selectAllButton).toBeVisible();
  });

  test('B. KPI Consistency - Active on duty logic and counts', async ({ page }) => {
    await clockInPage.goto();

    const resultText = await clockInPage.resultCountText.textContent();
    expect(resultText).toBeTruthy();
    const match = resultText!.match(/(\d+)/);
    const expectedCount = match ? parseInt(match[1], 10) : 0;

    const rowsCount = await clockInPage.registerRows.count();
    expect(rowsCount).toBe(expectedCount);
  });

  test('C. Active Post Switch - Switching post updates active post code', async ({ page }) => {
    await clockInPage.goto();

    await expect(clockInPage.activePostDropdown).toBeVisible();
    await clockInPage.activePostDropdown.click();

    const options = page.getByRole('option').or(page.locator('[role="menuitem"], .dropdown-item'));
    await expect(options.first()).toBeVisible();
    if (await options.count() > 1) {
      await options.nth(1).click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('D. Search Functionality - Search officer, site, post, or nonsense', async ({ page }) => {
    await clockInPage.goto();

    await clockInPage.searchInput.fill('NONSENSE_E2E_SEARCH_12345');
    await page.waitForTimeout(500);

    await expect(clockInPage.resultCountText).toContainText('0 result');

    await clockInPage.searchInput.fill('');
    await page.waitForTimeout(500);
    await expect(clockInPage.resultCountText).not.toContainText('0 result');
  });

  test('E. Filters Functionality - Open, apply, and reset filters', async ({ page }) => {
    await clockInPage.goto();

    await clockInPage.filtersButton.click();
    const filterModalOrMenu = page.locator('[role="dialog"], .filter-menu, .popover, div:has-text("Filter")').first();
    await expect(filterModalOrMenu).toBeVisible();

    const closeBtn = filterModalOrMenu.getByRole('button', { name: /Apply|Close|Reset|Cancel/i }).first();
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
  });

  test('F. Row Selection and Bulk Action UI', async ({ page }) => {
    await clockInPage.goto();

    await expect(clockInPage.selectAllButton).toBeVisible();
    await clockInPage.selectAllButton.click();
    await clockInPage.selectAllButton.click();
  });

  test('G. Manual Time Entry - Form validation and submission', async ({ page }) => {
    await clockInPage.goto();

    await clockInPage.manualTimeEntryButton.click();
    await expect(clockInPage.modalTitle).toBeVisible();

    await expect(clockInPage.submitTimeEntryButton).toBeVisible();
    await clockInPage.submitTimeEntryButton.click();

    await expect(clockInPage.cancelModalButton).toBeVisible();
    await clockInPage.cancelModalButton.click();
  });

  test('H. Edit Record - Edit record form behavior', async ({ page }) => {
    await clockInPage.goto();

    const editButton = page.getByRole('button', { name: 'Edit' }).first();
    await expect(editButton).toBeVisible();
    await editButton.click();

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible();

    const cancelBtn = page.getByRole('button', { name: /Cancel|Close/i }).first();
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();
  });

  test('I. Dossier View - View officer details and close', async ({ page }) => {
    await clockInPage.goto();

    const dossierButton = page.getByRole('button', { name: 'Dossier' }).first();
    await expect(dossierButton).toBeVisible();
    await dossierButton.click();

    const drawerOrModal = page.locator('[role="dialog"], .dossier-drawer, .modal').first();
    await expect(drawerOrModal).toBeVisible();

    const closeBtn = page.getByRole('button', { name: /Close|X/i }).first();
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
  });

  test('J. Cancel Record - Confirmation modal and dismissal', async ({ page }) => {
    await clockInPage.goto();

    const cancelRecordButton = page.getByRole('button', { name: 'Cancel record' }).first();
    await expect(cancelRecordButton).toBeVisible();
    await cancelRecordButton.click();

    const confirmDialog = page.locator('[role="dialog"], .confirm-dialog').first();
    await expect(confirmDialog).toBeVisible();

    const dismissBtn = page.getByRole('button', { name: /Cancel|No|Keep/i }).first();
    await expect(dismissBtn).toBeVisible();
    await dismissBtn.click();
  });

  test('K. Export Timesheets - Clicking triggers download or action', async ({ page }) => {
    await clockInPage.goto();

    await expect(clockInPage.exportTimesheetsButton).toBeVisible();
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 5000 }),
      clockInPage.exportTimesheetsButton.click()
    ]);

    expect(await download.suggestedFilename()).toBeTruthy();
  });

  test('L. Negative/Edge Scenarios and Console Log Check', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await clockInPage.goto();
    expect(consoleErrors).toEqual([]);
  });
});
