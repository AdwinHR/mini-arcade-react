# 🧪 E2E Test Suite - Mini Arcade

Comprehensive end-to-end testing suite for the Mini Arcade application using Playwright.

## 📋 Test Coverage

### **🎮 Game Tests**
- **Guess the Number** (`guess-number-game.spec.js`)
  - Single player mode functionality
  - Two player mode functionality
  - Input validation and error handling
  - Hint system and feedback
  - Game completion and statistics
  - Keyboard shortcuts and sound effects

- **Rock Paper Scissors** (`rock-paper-scissors.spec.js`)
  - Choice selection and game logic
  - Score tracking and updates
  - All game outcomes (win/lose/draw)
  - Game reset functionality
  - Statistics and analytics tracking
  - Responsive design and animations

- **Memory Cards** (`memory-cards.spec.js`)
  - 4x4 grid layout and card flipping
  - Card matching logic
  - Moves counter and timer
  - Game completion and win conditions
  - Restart functionality
  - Mobile responsiveness and animations

### **🌟 Premium Features** (`premium-features.spec.js`)
  - Pricing plans and subscription buttons
  - Feature list and benefits
  - Demo mode handling (Stripe not configured)
  - Responsive design and accessibility
  - Analytics tracking and user interactions

### **🧭 Navigation** (`navigation.spec.js`)
  - Page routing and URL handling
  - Browser back/forward navigation
  - Mobile navigation support
  - Keyboard navigation
  - 404 error handling
  - Loading states and smooth scrolling

### **🏠 Basic Functionality** (`basic-functionality.spec.js`)
  - Home page loading and game cards
  - Responsive design testing
  - Dark mode toggle
  - AdSense placeholder handling
  - Accessibility attributes
  - Console error handling

## 🚀 Running Tests

### **Prerequisites**
```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:e2e:install
```

### **Test Commands**
```bash
# Run all tests (headless)
npm run test:e2e

# Run tests with UI (watch mode)
npm run test:e2e:ui

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug
```

### **Test Configuration**
- **Browsers**: Chromium, Firefox, WebKit (Safari)
- **Devices**: Desktop Chrome, Desktop Firefox, Desktop Safari, Mobile Chrome, Mobile Safari
- **Viewport**: Desktop (1920x1080), Mobile (375x667)
- **Timeout**: 30 seconds default
- **Retries**: 2 on CI, 0 locally

## 📊 Test Reports

### **HTML Reporter**
Tests generate an interactive HTML report at `playwright-report/index.html`:
```bash
# View test report
npx playwright show-report
```

### **Screenshots & Videos**
- Screenshots taken on failure
- Videos recorded for failed tests
- Traces collected for debugging

## 🎯 Test Scenarios

### **Happy Path Tests**
- Users can navigate between pages
- Games load and function correctly
- Premium features are accessible
- Responsive design works on all devices

### **Edge Cases**
- Invalid input handling
- Network errors and timeouts
- Rapid clicking and user interactions
- Browser navigation during gameplay

### **Error Handling**
- Console errors are caught and handled
- AdSense errors don't break the app
- Firebase/Stripe errors show helpful messages
- 404 pages are handled gracefully

### **Accessibility Tests**
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Touch-friendly mobile interfaces

## 🔧 Test Data

### **Mock Data**
- Game states are mocked for consistent testing
- Analytics events are captured and verified
- AdSense placeholders are tested
- Stripe demo mode is verified

### **Test Users**
- No authentication required
- Local storage is used for game stats
- Analytics events are tracked anonymously

## 📱 Cross-Browser Testing

### **Desktop Browsers**
- ✅ Chrome (Chromium)
- ✅ Firefox
- ✅ Safari (WebKit)

### **Mobile Browsers**
- ✅ Chrome Mobile (Pixel 5)
- ✅ Safari Mobile (iPhone 12)

### **Responsive Breakpoints**
- **Desktop**: 1920x1080
- **Tablet**: 768x1024
- **Mobile**: 375x667

## 🐛 Debugging Tests

### **Common Issues**
1. **Test Timeouts**: Increase timeout in `playwright.config.js`
2. **Flaky Tests**: Add `test.retry()` for unstable tests
3. **Element Not Found**: Use `page.waitForSelector()` instead of direct selectors
4. **Race Conditions**: Use `page.waitForLoadState('networkidle')`

### **Debug Mode**
```bash
# Run specific test in debug mode
npx playwright test guess-number-game.spec.js --debug

# Run with trace
npx playwright test --trace on
```

## 📈 Continuous Integration

### **GitHub Actions**
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:e2e:install
      - run: npm run test:e2e
```

### **Test Results**
- Tests run on every push and PR
- HTML reports uploaded as artifacts
- Failed tests block merges
- Coverage metrics tracked

## 🎯 Best Practices

### **Test Organization**
- Group related tests in `describe()` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated

### **Selectors**
- Use data-testid attributes for stable selectors
- Avoid CSS selectors that can break
- Use semantic HTML selectors when appropriate
- Test with multiple locators when needed

### **Assertions**
- Use specific assertions (`toHaveText`, `toBeVisible`)
- Check for element existence and visibility
- Verify user interactions work correctly
- Test both positive and negative cases

### **Performance**
- Tests run in parallel by default
- Use `test.describe.serial()` for dependent tests
- Optimize test execution time
- Use `test.skip()` for flaky tests

## 🔍 Manual Testing Checklist

### **Pre-Deployment**
- [ ] All E2E tests pass
- [ ] Manual smoke test on staging
- [ ] Cross-browser verification
- [ ] Mobile device testing
- [ ] Performance benchmarks

### **Post-Deployment**
- [ ] Production smoke test
- [ ] Analytics verification
- [ ] Error monitoring check
- [ ] User feedback review

---

## 📝 Adding New Tests

1. **Create test file** in `tests/e2e/`
2. **Follow naming convention**: `feature-name.spec.js`
3. **Use data-testid** attributes for selectors
4. **Test happy path and edge cases**
5. **Add accessibility checks**
6. **Update this documentation**

**Happy Testing! 🧪**
