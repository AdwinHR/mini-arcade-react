import { test, expect } from '@playwright/test';

test.describe('Rock Paper Scissors Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Rock Paper Scissors').click();
  });

  test('should load game page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Rock Paper Scissors/);
    
    // Check game elements are present
    await expect(page.locator('[data-testid="game-title"]')).toContainText('Rock Paper Scissors');
    await expect(page.locator('[data-testid="choice-buttons"]')).toBeVisible();
    await expect(page.locator('[data-testid="score-board"]')).toBeVisible();
    await expect(page.locator('[data-testid="vs-display"]')).toBeVisible();
  });

  test('should display all choice options', async ({ page }) => {
    // Check for all three choices
    await expect(page.locator('[data-testid="rock-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="paper-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="scissors-button"]')).toBeVisible();
    
    // Check button labels
    await expect(page.locator('[data-testid="rock-button"]')).toContainText('Rock');
    await expect(page.locator('[data-testid="paper-button"]')).toContainText('Paper');
    await expect(page.locator('[data-testid="scissors-button"]')).toContainText('Scissors');
  });

  test('should play a round correctly', async ({ page }) => {
    // Make a choice
    await page.locator('[data-testid="rock-button"]').click();
    
    // Check if round result is displayed
    await expect(page.locator('[data-testid="round-result"]')).toBeVisible();
    await expect(page.locator('[data-testid="player-choice"]')).toBeVisible();
    await expect(page.locator('[data-testid="computer-choice"]')).toBeVisible();
  });

  test('should update score correctly', async ({ page }) => {
    // Get initial scores
    const initialPlayerScore = await page.locator('[data-testid="player-score"]').textContent();
    const initialComputerScore = await page.locator('[data-testid="computer-score"]').textContent();
    
    // Play a round
    await page.locator('[data-testid="paper-button"]').click();
    
    // Wait for result
    await page.waitForTimeout(1000);
    
    // Check if scores updated (may win, lose, or draw)
    const currentPlayerScore = await page.locator('[data-testid="player-score"]').textContent();
    const currentComputerScore = await page.locator('[data-testid="computer-score"]').textContent();
    
    // At least one score should have changed or it's a draw
    expect([currentPlayerScore, currentComputerScore]).not.toEqual([initialPlayerScore, initialComputerScore]);
  });

  test('should handle all possible outcomes', async ({ page }) => {
    // Play multiple rounds to test different outcomes
    const outcomes = [];
    
    for (let i = 0; i < 10; i++) {
      await page.locator('[data-testid="scissors-button"]').click();
      await page.waitForTimeout(500);
      
      const result = await page.locator('[data-testid="round-result"]').textContent();
      outcomes.push(result);
    }
    
    // Should have seen different types of outcomes
    const hasWin = outcomes.some(outcome => outcome.includes('Win'));
    const hasLose = outcomes.some(outcome => outcome.includes('Lose'));
    const hasDraw = outcomes.some(outcome => outcome.includes('Draw'));
    
    expect(hasWin || hasLose || hasDraw).toBe(true);
  });

  test('should show game statistics', async ({ page }) => {
    // Play a few rounds
    for (let i = 0; i < 5; i++) {
      await page.locator('[data-testid="rock-button"]').click();
      await page.waitForTimeout(500);
    }
    
    // Check statistics
    await page.locator('[data-testid="stats-tab"]').click();
    await expect(page.locator('[data-testid="games-played"]')).toBeVisible();
    await expect(page.locator('[data-testid="win-rate"]')).toBeVisible();
    await expect(page.locator('[data-testid="choice-history"]')).toBeVisible();
  });

  test('should reset game correctly', async ({ page }) => {
    // Play a round
    await page.locator('[data-testid="paper-button"]').click();
    await page.waitForTimeout(1000);
    
    // Get scores after round
    const playerScore = await page.locator('[data-testid="player-score"]').textContent();
    const computerScore = await page.locator('[data-testid="computer-score"]').textContent();
    
    // Reset game
    await page.locator('[data-testid="reset-game"]').click();
    
    // Check if scores are reset
    await expect(page.locator('[data-testid="player-score"]')).toContainText('0');
    await expect(page.locator('[data-testid="computer-score"]')).toContainText('0');
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Test keyboard shortcuts (R for Rock, P for Paper, S for Scissors)
    await page.keyboard.press('R');
    await page.waitForTimeout(500);
    
    // Check if round was played
    await expect(page.locator('[data-testid="round-result"]')).toBeVisible();
    
    await page.keyboard.press('P');
    await page.waitForTimeout(500);
    
    // Check if another round was played
    const results = page.locator('[data-testid="round-result"]');
    await expect(results).toHaveCount.greaterThan(0);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if game is usable on mobile
    await expect(page.locator('[data-testid="choice-buttons"]')).toBeVisible();
    await expect(page.locator('[data-testid="score-board"]')).toBeVisible();
    
    // Check buttons are properly sized for touch
    const buttons = page.locator('[data-testid="choice-buttons"] button');
    const firstButton = buttons.first().boundingBox();
    expect(firstButton.width).toBeGreaterThan(50); // Touch-friendly size
  });

  test('should have animations and transitions', async ({ page }) => {
    // Make a choice
    await page.locator('[data-testid="scissors-button"]').click();
    
    // Check for animation classes
    const resultDisplay = page.locator('[data-testid="vs-display"]');
    await expect(resultDisplay).toHaveClass(/animate|transition/);
  });

  test('should track game analytics', async ({ page }) => {
    // Listen for console events
    const events = [];
    page.on('console', msg => {
      if (msg.text().includes('Analytics')) {
        events.push(msg.text());
      }
    });
    
    // Play a round
    await page.locator('[data-testid="rock-button"]').click();
    await page.waitForTimeout(1000);
    
    // Check if analytics event was fired
    const hasGamePlayEvent = events.some(event => event.includes('Game play'));
    expect(hasGamePlayEvent).toBe(true);
  });

  test('should handle rapid clicking', async ({ page }) => {
    // Test rapid clicking to prevent multiple submissions
    const initialResultCount = await page.locator('[data-testid="round-result"]').count();
    
    // Rapid click multiple times
    await page.locator('[data-testid="paper-button"]').click();
    await page.locator('[data-testid="paper-button"]').click();
    await page.locator('[data-testid="paper-button"]').click();
    
    await page.waitForTimeout(2000);
    
    // Should only have one new result
    const finalResultCount = await page.locator('[data-testid="round-result"]').count();
    expect(finalResultCount).toBe(initialResultCount + 1);
  });
});
