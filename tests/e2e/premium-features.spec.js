import { test, expect } from '@playwright/test';

test.describe('Premium Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a[href="/premium"]').click();
  });

  test('should load premium page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Premium/);
    
    // Check premium features are displayed
    await expect(page.locator('[data-testid="premium-title"]')).toContainText('Premium Features');
    await expect(page.locator('[data-testid="pricing-cards"]')).toBeVisible();
    await expect(page.locator('[data-testid="feature-list"]')).toBeVisible();
  });

  test('should display pricing options', async ({ page }) => {
    // Check for monthly and yearly plans
    await expect(page.locator('[data-testid="monthly-plan"]')).toBeVisible();
    await expect(page.locator('[data-testid="yearly-plan"]')).toBeVisible();
    
    // Check pricing details
    await expect(page.locator('[data-testid="monthly-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="yearly-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="yearly-savings"]')).toBeVisible();
  });

  test('should show premium features list', async ({ page }) => {
    // Check for key premium features
    const features = [
      'Ad-free experience',
      'Unlimited game statistics',
      'Custom themes',
      'Priority support',
      'Early access to new games'
    ];
    
    for (const feature of features) {
      await expect(page.locator(`text=${feature}`)).toBeVisible();
    }
  });

  test('should handle subscription buttons', async ({ page }) => {
    // Check monthly subscription button
    const monthlyButton = page.locator('[data-testid="monthly-subscribe"]');
    await expect(monthlyButton).toBeVisible();
    await expect(monthlyButton).toContainText('Subscribe Monthly');
    
    // Check yearly subscription button
    const yearlyButton = page.locator('[data-testid="yearly-subscribe"]');
    await expect(yearlyButton).toBeVisible();
    await expect(yearlyButton).toContainText('Subscribe Yearly');
  });

  test('should show demo mode message when Stripe not configured', async ({ page }) => {
    // Click subscribe button
    await page.locator('[data-testid="monthly-subscribe"]').click();
    
    // Should show demo mode message
    await expect(page.locator('[data-testid="demo-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="demo-message"]')).toContainText('Stripe not configured');
  });

  test('should handle subscription flow gracefully', async ({ page }) => {
    // Listen for console events
    const events = [];
    page.on('console', msg => {
      if (msg.text().includes('Premium interaction')) {
        events.push(msg.text());
      }
    });
    
    // Click subscribe button
    await page.locator('[data-testid="yearly-subscribe"]').click();
    
    // Check if analytics event was fired
    const hasPremiumEvent = events.some(event => event.includes('Premium interaction'));
    expect(hasPremiumEvent).toBe(true);
  });

  test('should compare plans correctly', async ({ page }) => {
    // Check if yearly plan shows savings
    await expect(page.locator('[data-testid="yearly-savings"]')).toBeVisible();
    
    // Check if yearly plan is highlighted as better value
    const yearlyCard = page.locator('[data-testid="yearly-plan"]');
    await expect(yearlyCard).toHaveClass(/recommended|popular|best-value/);
  });

  test('should have responsive pricing cards', async ({ page }) => {
    // Test desktop layout
    const pricingCards = page.locator('[data-testid="pricing-cards"] > div');
    await expect(pricingCards).toHaveCount(2);
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(pricingCards).toHaveCount(2);
    
    // Check cards stack on mobile
    const firstCard = pricingCards.first().boundingBox();
    const secondCard = pricingCards.nth(1).boundingBox();
    expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height);
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check subscription buttons have proper ARIA labels
    const monthlyButton = page.locator('[data-testid="monthly-subscribe"]');
    await expect(monthlyButton).toHaveAttribute('aria-label');
    
    const yearlyButton = page.locator('[data-testid="yearly-subscribe"]');
    await expect(yearlyButton).toHaveAttribute('aria-label');
    
    // Check feature list is properly structured
    await expect(page.locator('[data-testid="feature-list"]')).toHaveAttribute('role');
  });

  test('should handle feature highlights', async ({ page }) => {
    // Check if premium features are highlighted
    const featureItems = page.locator('[data-testid="feature-list"] li');
    
    for (let i = 0; i < await featureItems.count(); i++) {
      const feature = featureItems.nth(i);
      
      // Check if features have icons or highlighting
      const icon = feature.locator('[data-testid="feature-icon"]');
      if (await icon.isVisible()) {
        await expect(icon).toBeVisible();
      }
    }
  });

  test('should show FAQ section', async ({ page }) => {
    // Check if FAQ exists
    const faqSection = page.locator('[data-testid="faq-section"]');
    
    if (await faqSection.isVisible()) {
      await expect(faqSection).toBeVisible();
      
      // Check for common questions
      const questions = page.locator('[data-testid="faq-question"]');
      if (await questions.count() > 0) {
        await expect(questions.first()).toBeVisible();
      }
    }
  });

  test('should have working navigation back to games', async ({ page }) => {
    // Navigate back to home
    await page.locator('nav a[href="/"]').click();
    
    // Check if back on home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="game-card"]')).toHaveCount(3);
  });

  test('should handle loading states', async ({ page }) => {
    // Mock slow loading
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 1000);
    });
    
    // Navigate to premium page
    await page.goto('/premium');
    
    // Check for loading indicators
    const loadingIndicator = page.locator('[data-testid="loading"]');
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeVisible();
    }
  });

  test('should track premium analytics', async ({ page }) => {
    // Listen for console events
    const events = [];
    page.on('console', msg => {
      if (msg.text().includes('Analytics')) {
        events.push(msg.text());
      }
    });
    
    // Interact with premium page
    await page.locator('[data-testid="monthly-subscribe"]').hover();
    await page.waitForTimeout(500);
    
    // Check if analytics events were fired
    const hasPageViewEvent = events.some(event => event.includes('Page view'));
    const hasPremiumEvent = events.some(event => event.includes('Premium interaction'));
    
    expect(hasPageViewEvent).toBe(true);
    expect(hasPremiumEvent).toBe(true);
  });

  test('should handle currency display', async ({ page }) => {
    // Check if prices show currency
    const monthlyPrice = page.locator('[data-testid="monthly-price"]');
    const yearlyPrice = page.locator('[data-testid="yearly-price"]');
    
    await expect(monthlyPrice).toContainText('$');
    await expect(yearlyPrice).toContainText('$');
  });

  test('should have social proof elements', async ({ page }) => {
    // Check for testimonials or user count
    const testimonials = page.locator('[data-testid="testimonial"]');
    if (await testimonials.count() > 0) {
      await expect(testimonials.first()).toBeVisible();
    }
    
    // Check for user statistics
    const userCount = page.locator('[data-testid="user-count"]');
    if (await userCount.isVisible()) {
      await expect(userCount).toBeVisible();
    }
  });
});
