import { Page, Locator, expect } from '@playwright/test';

export class ClockInPage {
  readonly page: Page;

  // Header Elements
  readonly title: Locator;
  readonly subtitle: Locator;
  readonly manualTimeEntryButton: Locator;
  readonly exportTimesheetsButton: Locator;

  // Active Post selector
  readonly activePostDropdown: Locator;

  // KPI cards
  readonly recordsCard: Locator;
  readonly recordsCount: Locator;
  readonly activeOnDutyCard: Locator;
  readonly activeOnDutyCount: Locator;
  readonly exceptionsCard: Locator;
  readonly exceptionsCount: Locator;
  readonly pendingSignOffCard: Locator;
  readonly pendingSignOffCount: Locator;

  // Search and Filters
  readonly searchInput: Locator;
  readonly filtersButton: Locator;

  // Attendance Register
  readonly selectAllButton: Locator;
  readonly resultCountText: Locator;
  readonly registerRows: Locator;

  // Manual Time Entry Modal
  readonly modalTitle: Locator;
  readonly officerInput: Locator;
  readonly siteInput: Locator;
  readonly postInput: Locator;
  readonly inTimeInput: Locator;
  readonly outTimeInput: Locator;
  readonly dateInput: Locator;
  readonly notesInput: Locator;
  readonly submitTimeEntryButton: Locator;
  readonly cancelModalButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header Elements
    this.title = page.getByRole('heading', { name: 'Attendance & Biometric Clock-In Verification' });
    this.subtitle = page.getByText(/Biometric evidence, GPS validation/i);
    this.manualTimeEntryButton = page.getByRole('button', { name: 'Manual Time Entry' });
    this.exportTimesheetsButton = page.getByRole('button', { name: 'Export Timesheets' });

    // Active Post selector
    this.activePostDropdown = page.locator('button').filter({ hasText: /Active Post:/i });

    // KPI cards
    this.recordsCard = page.locator('div').filter({ hasText: /^Records/i }).first();
    this.recordsCount = page.locator('div').filter({ hasText: /^Records/i }).locator('.text-2xl, h2, h3, span').first();

    this.activeOnDutyCard = page.locator('div').filter({ hasText: /^Active on duty/i }).first();
    this.activeOnDutyCount = page.locator('div').filter({ hasText: /^Active on duty/i }).locator('.text-2xl, h2, h3, span').first();

    this.exceptionsCard = page.locator('div').filter({ hasText: /^Exceptions/i }).first();
    this.exceptionsCount = page.locator('div').filter({ hasText: /^Exceptions/i }).locator('.text-2xl, h2, h3, span').first();

    this.pendingSignOffCard = page.locator('div').filter({ hasText: /^Pending sign-off/i }).first();
    this.pendingSignOffCount = page.locator('div').filter({ hasText: /^Pending sign-off/i }).locator('.text-2xl, h2, h3, span').first();

    // Search and Filters
    this.searchInput = page.getByPlaceholder('Search officer, site, post or note...');
    this.filtersButton = page.getByRole('button', { name: 'Filters' });

    // Attendance Register
    this.selectAllButton = page.getByRole('button', { name: 'Select All' });
    this.resultCountText = page.locator('text=/Attendance register · \\d+ result/i');
    this.registerRows = page.locator('.attendance-row, [data-testid="attendance-row"], div:has(button:has-text("Dossier"))');

    // Manual Time Entry Modal
    this.modalTitle = page.getByRole('heading', { name: /Manual Time Entry/i });
    this.officerInput = page.getByLabel(/Officer/i).or(page.getByPlaceholder(/Select officer/i));
    this.siteInput = page.getByLabel(/Site/i).or(page.getByPlaceholder(/Select site/i));
    this.postInput = page.getByLabel(/Post/i).or(page.getByPlaceholder(/Select post/i));
    this.inTimeInput = page.getByLabel(/In time/i);
    this.outTimeInput = page.getByLabel(/Out time/i);
    this.dateInput = page.getByLabel(/Date/i);
    this.notesInput = page.getByLabel(/Notes/i);
    this.submitTimeEntryButton = page.getByRole('button', { name: /Save|Submit|Create/i });
    this.cancelModalButton = page.getByRole('button', { name: /Cancel|Close/i });
  }

  async goto() {
    await this.page.goto('/command/clock-in');
  }

  async selectRowByOfficer(officerName: string) {
    const row = this.page.locator(`div:has-text("${officerName}")`).filter({ has: this.page.getByRole('button', { name: 'Select' }) }).first();
    await row.getByRole('button', { name: 'Select' }).click();
  }

  async openDossier(officerName: string) {
    const row = this.page.locator(`div:has-text("${officerName}")`).filter({ has: this.page.getByRole('button', { name: 'Dossier' }) }).first();
    await row.getByRole('button', { name: 'Dossier' }).click();
  }

  async editRecord(officerName: string) {
    const row = this.page.locator(`div:has-text("${officerName}")`).filter({ has: this.page.getByRole('button', { name: 'Edit' }) }).first();
    await row.getByRole('button', { name: 'Edit' }).click();
  }

  async cancelRecord(officerName: string) {
    const row = this.page.locator(`div:has-text("${officerName}")`).filter({ has: this.page.getByRole('button', { name: 'Cancel record' }) }).first();
    await row.getByRole('button', { name: 'Cancel record' }).click();
  }
}
