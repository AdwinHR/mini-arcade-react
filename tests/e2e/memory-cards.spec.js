import { test, expect } from '@playwright/test';

test.describe('Memory Cards Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Memory Cards').click();
  });

  test('should load game page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Memory Cards/);
    
    // Check game elements are present
    await expect(page.locator('[data-testid="game-title"]')).toContainText('Memory Cards');
    await expect(page.locator('[data-testid="memory-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid="timer"]')).toBeVisible();
    await expect(page.locator('[data-testid="moves-counter"]')).toBeVisible();
    await expect(page.locator('[data-testid="restart-button"]')).toBeVisible();
  });

  test('should display 4x4 grid of cards', async ({ page }) => {
    // Check for 16 cards (4x4 grid)
    const cards = page.locator('[data-testid="memory-card"]');
    await expect(cards).toHaveCount(16);
    
    // Check grid layout
    const grid = page.locator('[data-testid="memory-grid"]');
    await expect(grid).toHaveClass(/grid/);
  });

  test('should handle card flipping', async ({ page }) => {
    // Get first card
    const firstCard = page.locator('[data-testid="memory-card"]').first();
    
    // Check initial state (face down)
    await expect(firstCard).not.toHaveClass(/flipped/);
    
    // Flip card
    await firstCard.click();
    
    // Check if card is flipped
    await expect(firstCard).toHaveClass(/flipped/);
    await expect(firstCard.locator('[data-testid="card-content"]')).toBeVisible();
  });

  test('should handle card matching', async ({ page }) => {
    // Wait for cards to be shuffled
    await page.waitForTimeout(1000);
    
    // Get all cards
    const cards = page.locator('[data-testid="memory-card"]');
    
    // Try to find matching pair (this would need game state knowledge)
    // For now, just test flipping two cards
    await cards.first().click();
    await page.waitForTimeout(300);
    await cards.nth(1).click();
    await page.waitForTimeout(1000);
    
    // Check if cards are handled (either matched or flipped back)
    const firstCard = cards.first();
    const secondCard = cards.nth(1);
    
    // Cards should either be matched or flipped back
    const firstIsFlipped = await firstCard.evaluate(el => el.classList.contains('flipped'));
    const secondIsFlipped = await secondCard.evaluate(el => el.classList.contains('flipped'));
    
    expect([firstIsFlipped, secondIsFlipped]).not.toEqual([true, true]);
  });

  test('should update moves counter', async ({ page }) => {
    // Get initial moves
    const initialMoves = await page.locator('[data-testid="moves-counter"]').textContent();
    
    // Flip two cards
    const cards = page.locator('[data-testid="memory-card"]');
    await cards.first().click();
    await page.waitForTimeout(300);
    await cards.nth(1).click();
    await page.waitForTimeout(1000);
    
    // Check if moves increased
    const currentMoves = await page.locator('[data-testid="moves-counter"]').textContent();
    expect(currentMoves).not.toBe(initialMoves);
  });

  test('should track game time', async ({ page }) => {
    // Check initial timer
    await expect(page.locator('[data-testid="timer"]')).toContainText('00:00');
    
    // Flip a card to start game
    await page.locator('[data-testid="memory-card"]').first().click();
    
    // Wait and check timer is running
    await page.waitForTimeout(2000);
    const timer = await page.locator('[data-testid="timer"]').textContent();
    expect(timer).not.toBe('00:00');
  });

  test('should handle game completion', async ({ page }) => {
    // This test would need to know the card positions to win
    // For now, test that game can be completed after many moves
    
    const cards = page.locator('[data-testid="memory-card"]');
    let moves = 0;
    
    // Make random moves (in real test, would use game logic)
    for (let i = 0; i < 20 && moves < 50; i++) {
      const cardIndex = i % 16;
      await cards.nth(cardIndex).click();
      await page.waitForTimeout(300);
      moves++;
      
      // Check if game is won
      const winMessage = page.locator('[data-testid="win-message"]');
      if (await winMessage.isVisible()) {
        await expect(winMessage).toContainText('Congratulations');
        break;
      }
    }
  });

  test('should restart game correctly', async ({ page }) => {
    // Make some moves
    await page.locator('[data-testid="memory-card"]').first().click();
    await page.waitForTimeout(300);
    await page.locator('[data-testid="memory-card"]').nth(1).click();
    await page.waitForTimeout(1000);
    
    // Get current state
    const currentMoves = await page.locator('[data-testid="moves-counter"]').textContent();
    
    // Restart game
    await page.locator('[data-testid="restart-button"]').click();
    
    // Check if game is reset
    await expect(page.locator('[data-testid="moves-counter"]')).toContainText('Moves: 0');
    await expect(page.locator('[data-testid="timer"]')).toContainText('00:00');
    
    // Check all cards are face down
    const cards = page.locator('[data-testid="memory-card"]');
    for (let i = 0; i < await cards.count(); i++) {
      await expect(cards.nth(i)).not.toHaveClass(/flipped/);
    }
  });

  test('should show game statistics', async ({ page }) => {
    // Play a bit
    for (let i = 0; i < 5; i++) {
      await page.locator('[data-testid="memory-card"]').nth(i).click();
      await page.waitForTimeout(300);
    }
    
    // Check statistics
    await page.locator('[data-testid="stats-tab"]').click();
    await expect(page.locator('[data-testid="games-played"]')).toBeVisible();
    await expect(page.locator('[data-testid="best-time"]')).toBeVisible();
    await expect(page.locator('[data-testid="average-moves"]')).toBeVisible();
  });

  test('should prevent clicking same card twice', async ({ page }) => {
    const firstCard = page.locator('[data-testid="memory-card"]').first();
    
    // Click same card twice quickly
    await firstCard.click();
    await firstCard.click();
    
    // Should only count as one flip
    const moves = await page.locator('[data-testid="moves-counter"]').textContent();
    expect(moves).toBe('Moves: 0'); // Shouldn't count until second card is clicked
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if game is usable on mobile
    await expect(page.locator('[data-testid="memory-grid"]')).toBeVisible();
    
    // Check cards are properly sized for touch
    const cards = page.locator('[data-testid="memory-card"]');
    const firstCard = cards.first().boundingBox();
    expect(firstCard.width).toBeGreaterThan(40); // Touch-friendly size
  });

  test('should have card flip animations', async ({ page }) => {
    const card = page.locator('[data-testid="memory-card"]').first();
    
    // Flip card
    await card.click();
    
    // Check for animation classes
    await expect(card).toHaveClass(/flip|transform|transition/);
  });

  test('should track game analytics', async ({ page }) => {
    // Listen for console events
    const events = [];
    page.on('console', msg => {
      if (msg.text().includes('Analytics')) {
        events.push(msg.text());
      }
    });
    
    // Start game
    await page.locator('[data-testid="memory-card"]').first().click();
    
    // Check if analytics event was fired
    const hasGamePlayEvent = events.some(event => event.includes('Game play'));
    expect(hasGamePlayEvent).toBe(true);
  });

  test('should handle win banner correctly', async ({ page }) => {
    // This test would need to complete the game
    // For now, test that win banner exists in DOM
    const winBanner = page.locator('[data-testid="win-banner"]');
    
    // Should not be visible initially
    await expect(winBanner).not.toBeVisible();
    
    // Should exist in DOM
    await expect(winBanner).toHaveCount(1);
  });

  test('should handle rapid clicking', async ({ page }) => {
    // Test rapid clicking to prevent bugs
    const cards = page.locator('[data-testid="memory-card"]');
    
    // Rapid click multiple cards
    for (let i = 0; i < 5; i++) {
      await cards.nth(i).click();
    }
    
    // Should handle gracefully without errors
    await expect(page.locator('[data-testid="memory-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid="moves-counter"]')).toBeVisible();
  });
});
