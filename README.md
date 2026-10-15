# HRS Security Services - Command Centre E2E Automation Test Suite

This repository contains Playwright end-to-end (E2E) automated test scripts for the **Attendance & Biometric Clock-In Verification** screen in the HRS Security Services Command Centre web application.

## Test Structure

- `playwright.config.ts`: Playwright configuration file including test directory, baseURL, timeout, trace, and reporting settings.
- `tests/auth.setup.ts`: Authentication setup script generating `storageState` for persistent login session.
- `pages/ClockInPage.ts`: Page Object Model (POM) representing the Clock-In screen UI elements and actions.
- `tests/e2e/clock-in.spec.ts`: End-to-end test cases covering scenarios A through L.

## Prerequisites

- Node.js (v18+)
- npm

## How to Run Tests

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browser binaries:
   ```bash
   npx playwright install chromium
   ```

3. Set Environment Variables and Run Tests:

   ```bash
   export BASE_URL="https://zi-security-platform-dev.web.app"
   export TEST_USER="<your_test_email>"
   export TEST_PASSWORD="<your_test_password>"

   npx playwright test
   ```

   Or run on Windows PowerShell:
   ```powershell
   $env:BASE_URL="https://zi-security-platform-dev.web.app"
   $env:TEST_USER="<your_test_email>"
   $env:TEST_PASSWORD="<your_test_password>"
   npx playwright test
   ```

4. View HTML Test Report:
   ```bash
   npx playwright show-report
   ```

## Test Scenarios Covered

- **A. Page Load**: Header titles, KPI cards, search input, filters button, select all button, register count rendering.
- **B. KPI Consistency**: Active on duty logic and count verification against officer clocked in/out statuses.
- **C. Active Post Switch**: Post dropdown interaction and record refresh.
- **D. Search**: Verification of valid search, nonsense text search empty state, and clearing search.
- **E. Filters**: Opening filter modal, filter options, applying and resetting filters.
- **F. Selection**: Row selection and bulk select toggles.
- **G. Manual Time Entry**: Mandatory field validation, date/time logic validation, form closing.
- **H. Edit Record**: Editing officer records and saving/canceling.
- **I. Dossier View**: Opening officer details, biometric evidence, GPS, breaks, overtime, and closing drawer/modal.
- **J. Cancel Record**: Cancellation confirmation dialog dismissal and confirmation.
- **K. Export Timesheets**: File download trigger and filename/content verification.
- **L. Negative / Edge Scenarios**: Console log error checking, empty states, and long string layout resilience.

## Suggested Improvements for App Maintainers

To make tests less brittle, we recommend adding `data-testid` attributes to key UI elements:
- `data-testid="clockin-title"`
- `data-testid="kpi-records-count"`
- `data-testid="kpi-active-count"`
- `data-testid="manual-time-entry-btn"`
- `data-testid="export-timesheets-btn"`
- `data-testid="attendance-row"`
- `data-testid="dossier-btn"`
- `data-testid="edit-btn"`
- `data-testid="cancel-record-btn"`
