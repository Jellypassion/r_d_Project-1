# UI Testing Framework - Installation & Verification

## Prerequisites

✅ Node.js and npm installed
✅ Project dependencies installed (`npm install`)
✅ Playwright package installed (`@playwright/test`)

## Step 1: Install Playwright Browsers

Install the browser binaries needed for testing:

```bash
# Install all browsers
npx playwright install

# Or install specific browsers
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## Step 2: Verify Environment Variables

Check that your `.env` file has the UI credentials:

```env
# UI User Credentials
EMAIL=jellypassion@gmail.com
PASSWORD=Qwerty1!

# Base URL
FOPHELP_BASE_URL=https://new.fophelp.pro
```

**Note**: These credentials should be different from your API credentials (API_USERNAME/API_PASSWORD) to avoid conflicts when running tests in parallel.

## Step 3: Verify Installation

Run a quick check to ensure Playwright is installed correctly:

```bash
npx playwright --version
```

Expected output: `Version 1.57.0` (or higher)

## Step 4: Run Example Test

Run the example test to verify the framework works:

```bash
# Run in headed mode (you'll see the browser)
npm run test:ui:headed tests/ui/example.spec.ts

# Or run in headless mode
npm run test:ui tests/ui/example.spec.ts
```

### Expected Behavior

The test should:
1. ✅ Open a browser
2. ✅ Navigate to login page
3. ✅ Login with EMAIL/PASSWORD
4. ✅ Extract authentication cookies
5. ✅ Run test cases with authenticated context
6. ✅ Pass all 5 tests

### Example Output

```
Running 5 tests using 1 worker

  ✓  1 example.spec.ts:9:3 › should access home page with authenticated context (2s)
  ✓  2 example.spec.ts:23:3 › should display user information in header (1s)
  ✓  3 example.spec.ts:36:3 › should have valid authentication cookies (100ms)
  ✓  4 example.spec.ts:52:3 › should navigate to different sections (2s)
  ✓  5 example.spec.ts:68:3 › should be able to logout (2s)

  5 passed (8s)
```

## Step 5: View Test Report

After running tests, view the HTML report:

```bash
npm run test:ui:report
```

This will open an interactive report in your browser showing:
- Test results
- Screenshots
- Execution timeline
- Detailed logs

## Troubleshooting

### Issue: Browsers not installed

**Error**: `Executable doesn't exist at /path/to/browser`

**Solution**:
```bash
npx playwright install
```

### Issue: Login fails

**Error**: Tests timeout or fail at login

**Checklist**:
1. Verify EMAIL and PASSWORD in `.env` are correct
2. Check FOPHELP_BASE_URL is accessible
3. Verify login page selectors match actual UI
4. Run in headed mode to see what's happening:
   ```bash
   npm run test:ui:headed
   ```

### Issue: Selectors not found

**Error**: `waiting for locator(...) to be visible`

**Solution**: Update selectors in page objects to match actual page structure

1. Run in debug mode:
   ```bash
   npm run test:ui:debug tests/ui/example.spec.ts
   ```

2. Use Playwright Inspector to find correct selectors

3. Update locators in `src/ui/pages/LoginPage.ts` and other page objects

### Issue: Cookies not captured

**Error**: Cookie assertions fail

**Checklist**:
1. Verify login request URL in fixture matches your actual login endpoint
2. Check if login response contains `set-cookie` headers
3. Add logging to fixture to debug:
   ```typescript
   console.log('Response headers:', response.headers());
   ```

## Step 6: Update Selectors (if needed)

If selectors don't match your actual UI:

1. Open `src/ui/pages/LoginPage.ts`
2. Update locators:
   ```typescript
   this.emailInput = this.page.locator('YOUR_ACTUAL_EMAIL_SELECTOR');
   this.passwordInput = this.page.locator('YOUR_ACTUAL_PASSWORD_SELECTOR');
   this.loginButton = this.page.locator('YOUR_ACTUAL_BUTTON_SELECTOR');
   ```

3. Repeat for other page objects as needed

## Step 7: Run All Tests

Once verified, run the full test suite:

```bash
# Run all UI tests
npm run test:ui

# Run on specific browser
npm run test:ui:chromium

# Run with UI visible
npm run test:ui:headed
```

## Step 8: Verify Parallel Execution

Test that API and UI tests can run in parallel:

```bash
# Terminal 1: Run API tests
npm run test:api

# Terminal 2: Run UI tests
npm run test:ui
```

Both should run successfully without conflicts because they use different user credentials.

## Verification Checklist

- [ ] Playwright installed: `npx playwright --version`
- [ ] Browsers installed: `npx playwright install`
- [ ] `.env` file has EMAIL and PASSWORD
- [ ] Example test passes: `npm run test:ui:headed tests/ui/example.spec.ts`
- [ ] HTML report generated: `npm run test:ui:report`
- [ ] Can run in debug mode: `npm run test:ui:debug`
- [ ] API and UI tests use different credentials

## Next Steps

After verification:

1. **Write Tests**: Create new test files in `tests/ui/`
2. **Add Pages**: Create page objects for your features
3. **Add Components**: Extract reusable UI components
4. **CI/CD**: Set up GitHub Actions (workflow already created)

## Useful Commands Reference

```bash
# Run tests
npm run test:ui                    # All tests, headless
npm run test:ui:headed             # All tests, headed
npm run test:ui:debug              # Debug mode with inspector
npm run test:ui:chromium           # Only Chromium
npm run test:ui:report             # View HTML report

# Playwright commands
npx playwright test                # Run tests
npx playwright test --headed       # Run with browser visible
npx playwright test --debug        # Debug mode
npx playwright test --project=chromium  # Specific browser
npx playwright show-report         # Show HTML report
npx playwright codegen             # Generate test code

# Run specific test file
npx playwright test tests/ui/example.spec.ts
```

## Support & Documentation

- [UI_QUICK_START.md](./UI_QUICK_START.md) - Quick start guide
- [UI_TESTING_GUIDE.md](./UI_TESTING_GUIDE.md) - Comprehensive guide
- [UI_ARCHITECTURE.md](./UI_ARCHITECTURE.md) - Architecture diagrams
- [src/ui/README.md](./src/ui/README.md) - Framework documentation

## Common First-Time Issues

### 1. TypeScript Errors

If you see TypeScript errors, ensure your tsconfig.json includes:
```json
{
  "compilerOptions": {
    "types": ["@playwright/test", "node"]
  }
}
```

### 2. Module Resolution

If imports fail, check that paths are correct:
```typescript
// Correct
import { test, expect } from './fixtures/fophelp.fixture';

// Not
import { test, expect } from './fixtures/fophelp.fixture';
```

### 3. Cookie Domain

If cookies aren't working, ensure the domain is set correctly in the fixture:
```typescript
if (!cookie.domain) {
  cookie.domain = url.hostname; // Should match your base URL domain
}
```

## Success Indicators

You'll know everything is working when:
1. ✅ Example test passes
2. ✅ HTML report shows all tests green
3. ✅ Browser opens and closes automatically
4. ✅ Cookies are captured and used
5. ✅ No timeout or selector errors

If all checks pass, you're ready to start writing your own tests! 🎉
