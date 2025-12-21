# UI Testing Framework Setup Guide

## Overview

This document describes the Playwright UI testing framework implementation with Page Object Model (POM) and Web Components patterns.

## Architecture

### 1. Page Object Model (POM)
The framework uses POM to encapsulate page-specific logic and locators:

- **BasePage**: Abstract base class providing common page operations
- **LoginPage**: Login page implementation
- **HomePage**: Home/Dashboard page implementation

### 2. Component Model
Reusable UI components that can be composed into pages:

- **BaseComponent**: Abstract base class for all components
- **HeaderComponent**: Navigation bar/header component

### 3. Fixtures
Custom Playwright fixtures for test setup:

- **fophelp.fixture.ts**: Handles authentication and cookie management

## Authentication Flow

The authentication fixture implements the following workflow:

1. **Login Request**: Performs UI login using `EMAIL` and `PASSWORD` from `.env`
2. **Cookie Capture**: Intercepts login response and extracts cookies from `set-cookie` headers:
   ```
   X-Access-Token (JWT)
   X-Username
   X-Refresh-Token
   Session-User
   X-Refresh-Expires
   ```
3. **Context Setup**: Adds cookies to browser context
4. **Test Execution**: Tests receive authenticated context with valid cookies

### Cookie Format

**Response Headers** (from login):
```
set-cookie: X-Access-Token=<jwt-token>; expires=...; path=/; samesite=strict; httponly
set-cookie: X-Username=<username>; expires=...; path=/; samesite=strict; httponly
set-cookie: X-Refresh-Token=<uuid>; expires=...; path=/; samesite=strict; httponly
set-cookie: Session-User=<username>; expires=...; path=/; samesite=strict
set-cookie: X-Refresh-Expires=<date>; expires=...; path=/; samesite=strict
```

**Request Headers** (subsequent requests):
```
Cookie: X-Access-Token=<jwt>; X-Username=<username>; X-Refresh-Token=<uuid>; Session-User=<username>; X-Refresh-Expires=<date>
```

## Project Structure

```
src/ui/
├── pages/
│   ├── BasePage.ts           # Base page class
│   ├── LoginPage.ts          # Login page object
│   ├── HomePage.ts           # Home page object
│   └── index.ts              # Page exports
├── components/
│   ├── BaseComponent.ts      # Base component class
│   ├── HeaderComponent.ts    # Header component
│   └── index.ts              # Component exports
├── fixtures/
│   └── fophelp.fixture.ts    # Authentication fixture
├── example.spec.ts           # Example test
└── README.md                 # Documentation
```

## Configuration

### playwright.config.ts
- Test directory: `./tests/ui`
- Timeout: 60 seconds
- Parallel execution enabled
- Multiple browser support (Chromium, Firefox, WebKit)
- Mobile viewport testing
- HTML, List, and JSON reporters
- Screenshots and videos on failure
- Trace on retry

### Environment Variables (.env)
```env
# UI User Credentials (separate from API user)
EMAIL=ui-test-user@example.com
PASSWORD=ui-test-password

# Base URL
FOPHELP_BASE_URL=https://new.fophelp.pro
```

## Usage Examples

### Basic Test
```typescript
import { test, expect } from '../../src/ui/fixtures/fophelp.fixture';
import { HomePage } from '../../src/ui/pages/HomePage';

test('homepage test', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.context.newPage();
  const homePage = new HomePage(page);

  await homePage.goto();
  expect(await homePage.isLoggedIn()).toBeTruthy();

  await page.close();
});
```

### Using Components
```typescript
test('header navigation', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.context.newPage();
  const homePage = new HomePage(page);

  await homePage.goto();
  await homePage.header.clickLogo();

  const userName = await homePage.header.getUserName();
  expect(userName).toBeTruthy();

  await page.close();
});
```

### Verifying Cookies
```typescript
test('check auth cookies', async ({ authenticatedContext }) => {
  const { cookies } = authenticatedContext;

  expect(cookies.find(c => c.name === 'X-Access-Token')).toBeDefined();
  expect(cookies.find(c => c.name === 'X-Username')).toBeDefined();
  expect(cookies.find(c => c.name === 'X-Refresh-Token')).toBeDefined();
});
```

## Running Tests

```bash
# Run all UI tests
npm run test:ui

# Run in headed mode (see browser)
npm run test:ui:headed

# Run in debug mode
npm run test:ui:debug

# Run specific browser
npm run test:ui:chromium

# View HTML report
npm run test:ui:report
```

## CI/CD Integration

The framework supports GitHub Actions with parallel test execution:

- **API Tests**: Use `API_USERNAME` and `API_PASSWORD`
- **UI Tests**: Use `UI_EMAIL` and `UI_PASSWORD`

Tests run in parallel without conflicts.

### Required GitHub Secrets
```
FOPHELP_BASE_URL
API_USERNAME
API_PASSWORD
UI_EMAIL
UI_PASSWORD
```

## Best Practices

1. **Page Objects**: Keep all page-specific logic in page objects
2. **Components**: Extract reusable UI elements into components
3. **Fixtures**: Use fixtures for authentication and common setup
4. **Waits**: Use Playwright's auto-waiting instead of hardcoded timeouts
5. **Cleanup**: Always close pages to prevent memory leaks
6. **Assertions**: Use Playwright's expect for better error messages
7. **Selectors**: Prefer data-testid, role-based, or text-based selectors

## Extending the Framework

### Adding a New Page
1. Create `src/ui/pages/NewPage.ts`
2. Extend `BasePage`
3. Define locators and methods
4. Export from `src/ui/pages/index.ts`

### Adding a New Component
1. Create `src/ui/components/NewComponent.ts`
2. Extend `BaseComponent`
3. Define component-specific methods
4. Export from `src/ui/components/index.ts`

### Adding a New Test
1. Create `tests/ui/feature.spec.ts`
2. Import fixture: `import { test, expect } from '../../src/ui/fixtures/fophelp.fixture'`
3. Use `authenticatedContext` fixture
4. Write test cases

## Troubleshooting

### Cookies Not Working
- Verify `.env` has correct `EMAIL` and `PASSWORD`
- Check login endpoint URL
- Ensure cookie domain matches base URL
- Verify set-cookie headers format

### Tests Failing in CI
- Install Playwright browsers: `npx playwright install --with-deps`
- Check environment variables are set
- Verify network connectivity
- Review screenshots and traces

### Selector Issues
- Use Playwright Inspector: `npx playwright test --debug`
- Use `page.pause()` to inspect during test
- Update selectors based on actual DOM structure

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
