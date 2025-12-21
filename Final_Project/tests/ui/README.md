# UI Tests

This directory contains Playwright UI test files.

## Structure

```
tests/ui/
└── *.spec.ts          # UI test files
```

## Writing Tests

Tests use the framework located in `/src/ui/`:
- **Pages**: Page Object Models in `/src/ui/pages/`
- **Components**: Reusable components in `/src/ui/components/`
- **Fixtures**: Authentication fixture in `/src/ui/fixtures/`

## Example Test

```typescript
import { test, expect } from '../../src/ui/fixtures/fophelp.fixture';
import { HomePage } from '../../src/ui/pages/HomePage';

test.describe('My Feature Tests', () => {
  test('should verify feature', async ({ authenticatedContext }) => {
    const page = await authenticatedContext.context.newPage();
    const homePage = new HomePage(page);

    await homePage.goto();
    expect(await homePage.isLoggedIn()).toBeTruthy();

    await page.close();
  });
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

# Run specific test
npx playwright test tests/ui/example.spec.ts

# Run specific browser
npm run test:ui:chromium
```

## Test Structure Best Practices

1. **One feature per file**: Group related tests in test suites
2. **Use descriptive names**: Test names should clearly describe what is being tested
3. **Cleanup**: Always close pages after tests
4. **Use fixtures**: Leverage the `authenticatedContext` fixture for authenticated tests
5. **Organize**: Group tests by feature or page

## Example Test File Structure

```typescript
import { test, expect } from '../../src/ui/fixtures/fophelp.fixture';
import { HomePage } from '../../src/ui/pages/HomePage';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ authenticatedContext }) => {
    // Setup before each test
  });

  test('should do something', async ({ authenticatedContext }) => {
    // Test implementation
  });

  test('should do something else', async ({ authenticatedContext }) => {
    // Test implementation
  });

  test.afterEach(async () => {
    // Cleanup after each test
  });
});
```

## Adding New Tests

1. Create a new `*.spec.ts` file in this directory
2. Import required fixtures and page objects
3. Write test cases using Playwright's API
4. Run and verify your tests

## Documentation

- [UI Framework README](../../src/ui/README.md) - Framework documentation
- [UI Testing Guide](../../UI_TESTING_GUIDE.md) - Comprehensive guide
- [UI Quick Start](../../UI_QUICK_START.md) - Quick start guide
