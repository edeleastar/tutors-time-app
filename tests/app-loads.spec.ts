import { test, expect } from '@playwright/test';

test('application loads', async ({ page }) => {
	await page.goto('/');
	
	// Check that the page title is correct
	await expect(page).toHaveTitle(/Tutors Time/);
	
	// Check that the main heading is visible
	await expect(page.getByRole('heading', { name: /Welcome to Tutors Time/i })).toBeVisible();
	
	// Check that the description text is visible
	await expect(page.getByText(/Calendar visualization application/i)).toBeVisible();
});
