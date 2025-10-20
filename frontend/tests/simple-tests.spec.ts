import { expect, test } from '@playwright/test';

test.describe('Custom LMS - Simple Tests', () => {
  
  test('Test 1: Should load the main page and show navigation (PASS)', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the main title is visible
    await expect(page.locator('text=MOODLE LMS')).toBeVisible();
    
    // Check if student number is displayed
    await expect(page.locator('text=Student No: 21406232')).toBeVisible();
  });

  test('Test 2: Should find a non-existent element (FAIL)', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // This test will fail because this element doesn't exist
    await expect(page.locator('text=This Element Does Not Exist')).toBeVisible();
  });

});
