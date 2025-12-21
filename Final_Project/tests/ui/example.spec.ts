import { test, expect } from '../../src/ui/fixtures/fophelp.fixture';
import { HomePage } from '../../src/ui/pages/HomePage';

/**
 * Test suite demonstrating authenticated UI tests
 */
test.describe('Authenticated User Tests', () => {

  test('should access home page with authenticated context', async ({ authenticatedContext }) => {
    // Create a new page from authenticated context
    const page = await authenticatedContext.context.newPage();
    const homePage = new HomePage(page);

    // Navigate to home page
    await homePage.goto();

    // Verify user is logged in
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    // Verify header component is visible
    await homePage.header.waitForVisible();
    const headerVisible = await homePage.header.isVisible();
    expect(headerVisible).toBeTruthy();

    await page.close();
  });

  test('should display user information in header', async ({ authenticatedContext }) => {
    const page = await authenticatedContext.context.newPage();
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.waitForPageReady();

    // Check if user is logged in via header
    const isLoggedIn = await homePage.header.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    await page.close();
  });

  test('should have valid authentication cookies', async ({ authenticatedContext }) => {
    // Verify that we have the expected cookies
    const { cookies } = authenticatedContext;

    // Check for required cookies
    const cookieNames = cookies.map(c => c.name);
    expect(cookieNames).toContain('X-Access-Token');
    expect(cookieNames).toContain('X-Username');
    expect(cookieNames).toContain('X-Refresh-Token');
    expect(cookieNames).toContain('Session-User');

    // Verify X-Access-Token is not empty
    const accessToken = cookies.find(c => c.name === 'X-Access-Token');
    expect(accessToken).toBeDefined();
    expect(accessToken?.value).toBeTruthy();
    expect(accessToken?.value.length).toBeGreaterThan(50); // JWT tokens are typically longer
  });

  test('should navigate to different sections', async ({ authenticatedContext }) => {
    const page = await authenticatedContext.context.newPage();
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.waitForPageReady();

    // Try to click logo to return to home
    await homePage.header.clickLogo();
    await page.waitForLoadState('networkidle');

    // Verify we're still on the site
    const url = homePage.getCurrentUrl();
    expect(url).toContain(process.env.FOPHELP_BASE_URL || 'fophelp.pro');

    await page.close();
  });

  test('should be able to logout', async ({ authenticatedContext }) => {
    const page = await authenticatedContext.context.newPage();
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.waitForPageReady();

    // Perform logout
    await homePage.header.logout();

    // Wait for redirect to login page
    await page.waitForURL('**/login', { timeout: 10000 });

    // Verify we're on login page
    const url = page.url();
    expect(url).toContain('/login');

    await page.close();
  });
});
