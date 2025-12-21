# UI Testing Quick Start

## Installation

The Playwright dependency has already been installed. To install browser binaries:

```bash
npx playwright install
```

Or install specific browsers:
```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## Running Tests

```bash
# Run all UI tests
npm run test:ui

# Run with visible browser
npm run test:ui:headed

# Run in debug mode with step-by-step execution
npm run test:ui:debug

# Run only Chromium tests
npm run test:ui:chromium

# Run specific test file
npx playwright test tests/ui/example.spec.ts

# View HTML report after tests
npm run test:ui:report
```

## Project Structure

```
src/ui/                # Framework (Pages, Components, Fixtures)
tests/ui/              # Test Files (*.spec.ts)
```
├── pages/              # Page Object Models
├── components/         # Reusable UI Components
├── fixtures/           # Test fixtures (authentication)
└── *.spec.ts          # Test files
```

## Writing Your First Test

1. **Create a test file** in `tests/ui/`:

```typescript
// tests/ui/my-feature.spec.ts
import { test, expect } from '../../src/ui/fixtures/fophelp.fixture';
import { HomePage } from '../../src/ui/pages/HomePage';

test.describe('My Feature Tests', () => {
  test('should perform action', async ({ authenticatedContext }) => {
    // Create page from authenticated context
    const page = await authenticatedContext.context.newPage();
    const homePage = new HomePage(page);

    // Navigate and interact
    await homePage.goto();

    // Assertions
    expect(await homePage.isLoggedIn()).toBeTruthy();

    // Cleanup
    await page.close();
  });
});
```

2. **Run the test**:
```bash
npx playwright test my-feature.spec.ts
```

## Authentication

The fixture automatically handles authentication:
- Logs in using `EMAIL` and `PASSWORD` from `.env`
- Extracts authentication cookies
- Provides authenticated browser context
- No manual login needed in tests

## Creating Page Objects

```typescript
// src/ui/pages/MyPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  private readonly myButton: Locator;

  constructor(page: Page) {
    super(page);
    this.myButton = this.page.locator('#my-button');
  }

  async goto(): Promise<void> {
    await super.goto('/my-path');
  }

  async clickButton(): Promise<void> {
    await this.myButton.click();
  }
}
```

## Creating Components

```typescript
// src/ui/components/MyComponent.ts
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class MyComponent extends BaseComponent {
  private readonly title: Locator;

  constructor(page: Page) {
    super(page, '.my-component');
    this.title = this.locator('h1');
  }

  async getTitle(): Promise<string> {
    return await this.getText(this.title);
  }
}
```

## Debugging

### Using Debug Mode
```bash
npm run test:ui:debug
```
This opens Playwright Inspector for step-by-step debugging.

### Adding Breakpoints
```typescript
test('my test', async ({ authenticatedContext }) => {
  const page = await authenticatedContext.context.newPage();

  await page.pause(); // Pauses execution

  // Rest of your test
});
```

### Using Trace Viewer
After a test failure, view the trace:
```bash
npx playwright show-trace trace.zip
```

## Common Patterns

### Waiting for Elements
```typescript
// Wait for element to be visible
await page.locator('#my-element').waitFor({ state: 'visible' });

// Wait for navigation
await page.waitForURL('**/dashboard');

// Wait for network idle
await page.waitForLoadState('networkidle');
```

### Taking Screenshots
```typescript
await page.screenshot({ path: 'screenshot.png' });
await page.screenshot({ path: 'full-page.png', fullPage: true });
```

### Handling Dialogs
```typescript
page.on('dialog', async dialog => {
  await dialog.accept();
});
```

## Tips

1. **Use data-testid**: Add `data-testid` attributes to elements for stable selectors
2. **Auto-waiting**: Playwright automatically waits for elements to be actionable
3. **Parallel Tests**: Tests run in parallel by default for faster execution
4. **Screenshots**: Automatically captured on failure
5. **Videos**: Recorded for failed tests (can be enabled for all)

## Updating Selectors

If selectors need updating based on actual page structure:

1. Run test in debug mode: `npm run test:ui:debug`
2. Use Playwright Inspector to find correct selectors
3. Update locators in page objects
4. Re-run tests

## Next Steps

1. Install browsers: `npx playwright install`
2. Update selectors in page objects to match your actual UI
3. Add more page objects and components as needed
4. Write tests for your features
5. Run tests: `npm run test:ui`

For more details, see [UI_TESTING_GUIDE.md](./UI_TESTING_GUIDE.md)
