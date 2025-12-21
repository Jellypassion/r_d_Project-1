import { test as base, BrowserContext, Cookie } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Interface for authenticated context
 */
export interface AuthContext {
  context: BrowserContext;
  cookies: Cookie[];
}

/**
 * Parse cookies from set-cookie headers
 * Extracts only the cookie name=value pair, ignoring metadata like expires, path, samesite, httponly
 */
function parseCookie(setCookieHeader: string, domain: string): Cookie {
  // Split by semicolon and take only the first part (name=value)
  const nameValuePart = setCookieHeader.split(';')[0].trim();
  const [name, value] = nameValuePart.split('=');

  // Return minimal cookie object - Playwright will handle the rest
  const cookie: Cookie = {
    name: name.trim(),
    value: value.trim(),
    domain: domain,
    path: '/',
    sameSite: 'Strict',
  };

  return cookie;
}

/**
 * Extended test with authentication fixture
 */
export const test = base.extend<{ authenticatedContext: AuthContext }>({
  authenticatedContext: async ({ browser }, use) => {
    // Create a new browser context
    const context = await browser.newContext();
    const page = await context.newPage();

    // Get credentials from environment
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    if (!email || !password) {
      throw new Error('EMAIL and PASSWORD must be set in .env file');
    }

    // Perform login
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Listen for response to capture cookies
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/login') || response.url().includes('/auth'),
      { timeout: 30000 }
    );

    // Perform login
    await loginPage.login(email, password);

    // Wait for login response
    const response = await responsePromise;

    // Extract cookies from response headers
    const setCookieHeaders = response.headers()['set-cookie'];
    let cookies: Cookie[] = [];

    if (setCookieHeaders) {
      // Get domain from base URL
      const url = new URL(process.env.FOPHELP_BASE_URL || 'https://new.fophelp.pro');
      const domain = url.hostname;

      // Handle both string and array of strings
      const cookieHeaderArray = Array.isArray(setCookieHeaders)
        ? setCookieHeaders
        : setCookieHeaders.split(',').map(s => s.trim());

      // Parse each set-cookie header - extracting only name=value pairs
      cookies = cookieHeaderArray.map(header => parseCookie(header, domain));

      // Add cookies to context
      await context.addCookies(cookies);
    }

    // Close the page used for login
    await page.close();

    // Provide the authenticated context to tests
    await use({ context, cookies });

    // Clean up
    await context.close();
  },
});

export { expect } from '@playwright/test';
