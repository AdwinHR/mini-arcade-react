import { test, expect } from '@playwright/test';

test.describe('Mini Arcade - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the home page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Mini Arcade/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Mini Arcade');
    
    // Check navigation is present
    await expect(page.locator('nav')).toBeVisible();
    
    // Check game cards are present
    await expect(page.locator('[data-testid="game-card"]')).toHaveCount(3);
  });

  test('should display all three games', async ({ page }) => {
    // Check Guess the Number game
    await expect(page.locator('text=Guess the Number')).toBeVisible();
    
    // Check Rock Paper Scissors game
    await expect(page.locator('text=Rock Paper Scissors')).toBeVisible();
    
    // Check Memory Cards game
    await expect(page.locator('text=Memory Cards')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Check navigation links
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount(3);
    
    // Test Home link
    await page.locator('nav a[href="/"]').click();
    await expect(page).toHaveURL('/');
    
    // Test Premium link
    await page.locator('nav a[href="/premium"]').click();
    await expect(page).toHaveURL('/premium');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check game cards stack vertically on mobile
    const gameCards = page.locator('[data-testid="game-card"]');
    await expect(gameCards).toHaveCount(3);
    
    // Check cards are stacked (not side by side)
    const firstCard = gameCards.first().boundingBox();
    const secondCard = gameCards.nth(1).boundingBox();
    
    expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height);
  });

  test('should handle dark mode toggle', async ({ page }) => {
    // Check if dark mode toggle exists
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
    
    if (await darkModeToggle.isVisible()) {
      // Click toggle
      await darkModeToggle.click();
      
      // Check if body has dark class
      await expect(page.locator('body')).toHaveClass(/dark/);
    }
  });

  test('should show ad placeholders when AdSense not configured', async ({ page }) => {
    // Check for ad placeholders
    const adPlaceholders = page.locator('text=AdSense disabled');
    await expect(adPlaceholders).toHaveCount.greaterThan(0);
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for proper ARIA labels
    const gameCards = page.locator('[data-testid="game-card"]');
    
    for (let i = 0; i < await gameCards.count(); i++) {
      const card = gameCards.nth(i);
      await expect(card).toHaveAttribute('role', 'button');
      await expect(card).toHaveAttribute('aria-label');
    }
  });

  test('should handle console errors gracefully', async ({ page }) => {
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate around the app
    await page.goto('/');
    await page.locator('nav a[href="/premium"]').click();
    await page.waitForTimeout(1000);
    
    // Should have no console errors
    expect(errors.filter(err => !err.includes('AdSense'))).toHaveLength(0);
  });
});
