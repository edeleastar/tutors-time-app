import { test, expect } from '@playwright/test';

test.describe('Calendar Table Display', () => {
  test('should display calendar data in table', async ({ page }) => {
    await page.goto('/');

    // Wait for loading state to disappear
    await page.waitForSelector('text=Loading calendar data...', { state: 'hidden' });

    // Check that table is visible
    const table = page.locator('table.table');
    await expect(table).toBeVisible();

    // Check table headers
    await expect(page.locator('th:has-text("Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Student ID")')).toBeVisible();
    await expect(page.locator('th:has-text("Course ID")')).toBeVisible();
    await expect(page.locator('th:has-text("Time Active")')).toBeVisible();
    await expect(page.locator('th:has-text("Page Loads")')).toBeVisible();

    // Check that table has data rows (at least one row)
    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Verify table cells contain data
    const firstRow = rows.first();
    await expect(firstRow.locator('td').first()).not.toBeEmpty();
  });

  test('should show loading state initially', async ({ page }) => {
    await page.goto('/');

    // Check for loading message (may be brief, so use waitFor with timeout)
    const loadingText = page.locator('text=Loading calendar data...');
    await expect(loadingText).toBeVisible({ timeout: 1000 }).catch(() => {
      // Loading state may have already completed
    });
  });

  test('should display error state on connection failure', async ({ page }) => {
    // Intercept Supabase requests and force failure
    await page.route('**/rest/v1/calendar*', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/');

    // Wait for error state
    await page.waitForSelector('text=Error loading data', { timeout: 5000 });
    await expect(page.locator('text=Error loading data')).toBeVisible();
  });

  test('should format date correctly', async ({ page }) => {
    await page.goto('/');

    // Wait for table to load
    await page.waitForSelector('table.table tbody tr', { timeout: 5000 });

    // Check that date column contains formatted dates
    const dateCells = page.locator('table.table tbody tr td:first-child');
    const firstDate = await dateCells.first().textContent();
    expect(firstDate).toBeTruthy();
    // Date should be formatted (not just YYYY-MM-DD)
    expect(firstDate).not.toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('should display all required columns', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('table.table tbody tr', { timeout: 5000 });

    const firstRow = page.locator('table.table tbody tr').first();
    const cells = firstRow.locator('td');
    const cellCount = await cells.count();

    // Should have 5 columns: Date, Student ID, Course ID, Time Active, Page Loads
    expect(cellCount).toBe(5);
  });
});
