import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate between pages correctly', async ({ page }) => {
    // Test navigation to premium
    await page.locator('nav a[href="/premium"]').click();
    await expect(page).toHaveURL('/premium');
    await expect(page.locator('[data-testid="premium-title"]')).toBeVisible();
    
    // Test navigation back to home
    await page.locator('nav a[href="/"]').click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="game-card"]')).toHaveCount(3);
  });

  test('should handle browser back/forward buttons', async ({ page }) => {
    // Navigate to premium
    await page.locator('nav a[href="/premium"]').click();
    await expect(page).toHaveURL('/premium');
    
    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/premium');
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Navigate directly to premium page
    await page.goto('/premium');
    await expect(page).toHaveURL('/premium');
    await expect(page.locator('[data-testid="premium-title"]')).toBeVisible();
    
    // Navigate directly to home
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="game-card"]')).toHaveCount(3);
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/non-existent-page');
    
    // Should handle gracefully (either show 404 or redirect to home)
    const currentUrl = page.url();
    const is404Page = await page.locator('text=404').isVisible();
    const isHomePage = currentUrl.endsWith('/');
    
    expect(is404Page || isHomePage).toBe(true);
  });

  test('should maintain navigation state on refresh', async ({ page }) => {
    // Navigate to premium
    await page.locator('nav a[href="/premium"]').click();
    await expect(page).toHaveURL('/premium');
    
    // Refresh page
    await page.reload();
    
    // Should still be on premium page
    await expect(page).toHaveURL('/premium');
    await expect(page.locator('[data-testid="premium-title"]')).toBeVisible();
  });

  test('should have active navigation indicators', async ({ page }) => {
    // Check home is active initially
    await expect(page.locator('nav a[href="/"]')).toHaveClass(/active|current/);
    
    // Navigate to premium
    await page.locator('nav a[href="/premium"]').click();
    
    // Check premium is now active
    await expect(page.locator('nav a[href="/premium"]')).toHaveClass(/active|current/);
    await expect(page.locator('nav a[href="/"]')).not.toHaveClass(/active|current/);
  });

  test('should handle navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check navigation is still usable
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
    await expect(page.locator('nav a[href="/premium"]')).toBeVisible();
    
    // Test navigation on mobile
    await page.locator('nav a[href="/premium"]').click();
    await expect(page).toHaveURL('/premium');
    
    await page.locator('nav a[href="/"]').click();
    await expect(page).toHaveURL('/');
  });

  test('should have keyboard navigation support', async ({ page }) => {
    // Test Tab navigation
    await page.keyboard.press('Tab');
    
    // First focusable element should be in navigation
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON']).toContain(focusedElement);
    
    // Test Tab through navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate through nav items
    const navLinks = page.locator('nav a');
    await expect(navLinks.first()).toBeFocused();
  });

  test('should handle navigation during game play', async ({ page }) => {
    // Start a game
    await page.locator('text=Guess the Number').click();
    await expect(page).toHaveURL('/guess-number');
    
    // Navigate away during game
    await page.locator('nav a[href="/premium"]').click();
    await expect(page).toHaveURL('/premium');
    
    // Navigate back to game
    await page.locator('nav a[href="/"]').click();
    await page.locator('text=Guess the Number').click();
    await expect(page).toHaveURL('/guess-number');
    
    // Game should reset or maintain state appropriately
    await expect(page.locator('[data-testid="game-title"]')).toBeVisible();
  });

  test('should have proper page titles', async ({ page }) => {
    // Check home page title
    await expect(page).toHaveTitle(/Mini Arcade/);
    
    // Navigate to premium
    await page.locator('nav a[href="/premium"]').click();
    await expect(page).toHaveTitle(/Premium/);
    
    // Navigate to games
    await page.locator('nav a[href="/"]').click();
    await page.locator('text=Rock Paper Scissors').click();
    await expect(page).toHaveTitle(/Rock Paper Scissors/);
  });

  test('should handle navigation with query parameters', async ({ page }) => {
    // Navigate with query parameters
    await page.goto('/premium?ref=home&utm_source=test');
    
    // Should load premium page
    await expect(page).toHaveURL(/premium/);
    await expect(page.locator('[data-testid="premium-title"]')).toBeVisible();
  });

  test('should have smooth scrolling', async ({ page }) => {
    // Navigate to premium (longer page)
    await page.locator('nav a[href="/premium"]').click();
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Click navigation link
    await page.locator('nav a[href="/"]').click();
    
    // Should scroll to top smoothly
    await page.waitForTimeout(500);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('should handle navigation loading states', async ({ page }) => {
    // Mock slow navigation
    await page.route('**/premium', route => {
      setTimeout(() => route.continue(), 1000);
    });
    
    // Navigate to premium
    await page.locator('nav a[href="/premium"]').click();
    
    // Check for loading state
    const loadingIndicator = page.locator('[data-testid="loading"]');
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeVisible();
    }
    
    // Wait for navigation to complete
    await expect(page.locator('[data-testid="premium-title"]')).toBeVisible();
  });
});
