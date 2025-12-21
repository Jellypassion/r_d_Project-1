# UI Testing Framework

This directory contains the Playwright-based UI testing framework infrastructure - Page Object Models, Components, and Fixtures.

**Note:** Test files (*.spec.ts) are located in `/tests/ui/` directory.

## Structure

```
src/ui/                        # Framework Infrastructure
├── pages/                     # Page Object Models
│   ├── BasePage.ts           # Base class for all pages
│   ├── LoginPage.ts          # Login page object
│   └── HomePage.ts           # Home/Dashboard page object
├── components/                # Reusable UI components
│   ├── BaseComponent.ts      # Base class for all components
│   └── HeaderComponent.ts    # Header/Navigation component
└── fixtures/                  # Test fixtures
    └── fophelp.fixture.ts    # Authentication fixture with cookie management

tests/ui/                      # Test Files
└── *.spec.ts                 # Playwright test files
```

## Features

### 1. **Page Object Model (POM)**
- All pages extend `BasePage` class
- Encapsulates page-specific locators and actions
- Promotes code reusability and maintainability

### 2. **Component Objects**
- Reusable UI components (Header, Footer, Modals, etc.)
- All components extend `BaseComponent` class
- Can be composed into pages

### 3. **Authentication Fixture**
- Automatic login before tests
- Extracts and manages authentication cookies
- Provides authenticated context to all tests
- Supports parallel test execution

## Usage

### Running Tests

```bash
# Run all UI tests
npx playwright test

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test tests/ui/example.spec.ts

# Debug tests
npx playwright test --debug
```

### Creating New Tests

Place test files in `/tests/ui/` directory.

```typescript
import { test, expect } from '../../src/ui/fixtures/fophelp.fixture';
import { HomePage } from '../../src/ui/pages/HomePage';

test.describe('My Test Suite', () => {
  test('my test', async ({ authenticatedContext }) => {
    // Create page from authenticated context
    const page = await authenticatedContext.context.newPage();
    const homePage = new HomePage(page);

    // Your test logic here
    await homePage.goto();

    // Assertions
    expect(await homePage.isLoggedIn()).toBeTruthy();

    await page.close();
  });
});
```

### Creating New Pages

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  private readonly myElement: Locator;

  constructor(page: Page) {
    super(page);
    this.myElement = this.page.locator('#my-element');
  }

  async goto(): Promise<void> {
    await super.goto('/my-path');
    await this.waitForPageLoad();
  }

  async clickMyElement(): Promise<void> {
    await this.myElement.click();
  }
}
```

### Creating New Components

```typescript
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class MyComponent extends BaseComponent {
  private readonly button: Locator;

  constructor(page: Page) {
    super(page, '.my-component');
    this.button = this.locator('button');
  }

  async clickButton(): Promise<void> {
    await this.button.click();
  }
}
```

## Authentication Flow

The authentication fixture (`fophelp.fixture.ts`) handles the following:

1. **Login**: Performs UI login using credentials from `.env` file (EMAIL, PASSWORD)
2. **Cookie Extraction**: Captures authentication cookies from login response headers:
   - X-Access-Token (JWT)
   - X-Username
   - X-Refresh-Token
   - Session-User
   - X-Refresh-Expires
3. **Context Setup**: Adds cookies to browser context for subsequent requests
4. **Test Isolation**: Each test gets a fresh authenticated context

## Environment Variables

Required variables in `.env`:
```env
# UI User Credentials (different from API credentials)
EMAIL=your-email@example.com
PASSWORD=your-password

# Base URL
FOPHELP_BASE_URL=https://new.fophelp.pro
```

## Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Best Practices

1. **Separate Concerns**: Keep page logic in page objects, business logic in tests
2. **Reuse Components**: Extract common UI elements into component objects
3. **Use Fixtures**: Leverage fixtures for setup/teardown logic
4. **Wait Strategies**: Use proper waits (waitForVisible, waitForLoadState) instead of hardcoded timeouts
5. **Assertions**: Use Playwright's expect assertions for better error messages
6. **Cleanup**: Always close pages in tests to prevent resource leaks

## CI/CD Integration

The framework supports parallel execution of API and UI tests with different user credentials, making it suitable for GitHub Actions workflows.
