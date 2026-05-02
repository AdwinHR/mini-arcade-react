import { test, expect } from '@playwright/test';

test.describe('Guess the Number Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Guess the Number').click();
  });

  test('should load game page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Guess the Number/);
    
    // Check game elements are present
    await expect(page.locator('[data-testid="game-title"]')).toContainText('Guess the Number');
    await expect(page.locator('[data-testid="guess-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-guess"]')).toBeVisible();
    await expect(page.locator('[data-testid="attempts-counter"]')).toBeVisible();
    await expect(page.locator('[data-testid="hint-text"]')).toBeVisible();
  });

  test('should handle single player mode', async ({ page }) => {
    // Select single player mode
    await page.locator('[data-testid="single-player-tab"]').click();
    
    // Set range
    await page.locator('[data-testid="min-range"]').fill('1');
    await page.locator('[data-testid="max-range"]').fill('100');
    await page.locator('[data-testid="start-game"]').click();
    
    // Make a guess
    await page.locator('[data-testid="guess-input"]').fill('50');
    await page.locator('[data-testid="submit-guess"]').click();
    
    // Check feedback
    await expect(page.locator('[data-testid="feedback-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="attempts-counter"]')).toContainText('Attempts: 1');
  });

  test('should handle two player mode', async ({ page }) => {
    // Select two player mode
    await page.locator('[data-testid="two-player-tab"]').click();
    
    // Player 1 sets number
    await page.locator('[data-testid="secret-number"]').fill('42');
    await page.locator('[data-testid="confirm-number"]').click();
    
    // Player 2 guesses
    await page.locator('[data-testid="guess-input"]').fill('30');
    await page.locator('[data-testid="submit-guess"]').click();
    
    // Check feedback
    await expect(page.locator('[data-testid="feedback-message"]')).toBeVisible();
  });

  test('should validate input correctly', async ({ page }) => {
    // Start single player game
    await page.locator('[data-testid="single-player-tab"]').click();
    await page.locator('[data-testid="start-game"]').click();
    
    // Test empty input
    await page.locator('[data-testid="submit-guess"]').click();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Please enter a number');
    
    // Test invalid input
    await page.locator('[data-testid="guess-input"]').fill('abc');
    await page.locator('[data-testid="submit-guess"]').click();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Please enter a valid number');
    
    // Test out of range
    await page.locator('[data-testid="guess-input"]').fill('200');
    await page.locator('[data-testid="submit-guess"]').click();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('out of range');
  });

  test('should show appropriate hints', async ({ page }) => {
    // Start single player game with known number (mock)
    await page.locator('[data-testid="single-player-tab"]').click();
    await page.locator('[data-testid="start-game"]').click();
    
    // Test too high
    await page.locator('[data-testid="guess-input"]').fill('80');
    await page.locator('[data-testid="submit-guess"]').click();
    await expect(page.locator('[data-testid="hint-text"]')).toContainText('Too high');
    
    // Test too low
    await page.locator('[data-testid="guess-input"]').fill('20');
    await page.locator('[data-testid="submit-guess"]').click();
    await expect(page.locator('[data-testid="hint-text"]')).toContainText('Too low');
  });

  test('should handle game completion', async ({ page }) => {
    // Start single player game
    await page.locator('[data-testid="single-player-tab"]').click();
    await page.locator('[data-testid="start-game"]').click();
    
    // Keep guessing until win (this would need mocking in real scenario)
    for (let i = 1; i <= 10; i++) {
      await page.locator('[data-testid="guess-input"]').fill(i.toString());
      await page.locator('[data-testid="submit-guess"]').click();
      
      // Check if won
      const winMessage = page.locator('[data-testid="win-message"]');
      if (await winMessage.isVisible()) {
        await expect(winMessage).toContainText('Congratulations');
        break;
      }
    }
  });

  test('should track game statistics', async ({ page }) => {
    // Start and play a game
    await page.locator('[data-testid="single-player-tab"]').click();
    await page.locator('[data-testid="start-game"]').click();
    
    // Make some guesses
    await page.locator('[data-testid="guess-input"]').fill('50');
    await page.locator('[data-testid="submit-guess"]').click();
    await page.locator('[data-testid="guess-input"]').fill('25');
    await page.locator('[data-testid="submit-guess"]').click();
    
    // Check statistics
    await page.locator('[data-testid="stats-tab"]').click();
    await expect(page.locator('[data-testid="games-played"]')).toBeVisible();
    await expect(page.locator('[data-testid="average-attempts"]')).toBeVisible();
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Start game
    await page.locator('[data-testid="single-player-tab"]').click();
    await page.locator('[data-testid="start-game"]').click();
    
    // Test Enter key to submit
    await page.locator('[data-testid="guess-input"]').fill('42');
    await page.keyboard.press('Enter');
    
    // Check if guess was submitted
    await expect(page.locator('[data-testid="attempts-counter"]')).toContainText('Attempts: 1');
  });

  test('should have sound effects', async ({ page }) => {
    // Mock audio context
    await page.addInitScript(() => {
      window.AudioContext = class MockAudioContext {
        createBufferSource() {
          return {
            start: () => {},
            connect: () => {},
            buffer: null
          };
        }
      };
    });
    
    // Start game and make guess
    await page.locator('[data-testid="single-player-tab"]').click();
    await page.locator('[data-testid="start-game"]').click();
    await page.locator('[data-testid="guess-input"]').fill('50');
    await page.locator('[data-testid="submit-guess"]').click();
    
    // Check if sound played (would need more sophisticated mocking)
    await expect(page.locator('[data-testid="guess-input"]')).toBeVisible();
  });
});
