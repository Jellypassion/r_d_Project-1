import { test as base, BrowserContext, Cookie } from '@playwright/test';
import dotenv from 'dotenv';
import { HomePage } from '../pages';

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
 * Extracts cookie name=value pair and metadata (expires, path, samesite, httponly, secure)
 */
function parseCookie(setCookieHeader: string, domain: string): Cookie {
  const parts = setCookieHeader.split(';').map(p => p.trim());

  // First part is name=value
  const [name, value] = parts[0].split('=').map(p => p.trim());

  // Initialize cookie with required fields
  const cookie: Cookie = {
    name,
    value,
    domain,
    path: '/',
    sameSite: 'Strict',
    expires: -1,
    httpOnly: false,
    secure: false,
  };

  // Parse remaining attributes
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const lowerPart = part.toLowerCase();

    if (lowerPart.startsWith('expires=')) {
      const expiresStr = part.substring('expires='.length).trim();
      // Parse the date and convert to Unix timestamp (seconds)
      const expiresDate = new Date(expiresStr);
      cookie.expires = Math.floor(expiresDate.getTime() / 1000);
    } else if (lowerPart.startsWith('path=')) {
      cookie.path = part.substring('path='.length).trim();
    } else if (lowerPart.startsWith('samesite=')) {
      const sameSiteValue = part.substring('samesite='.length).trim();
      cookie.sameSite = sameSiteValue.charAt(0).toUpperCase() + sameSiteValue.slice(1) as any;
    } else if (lowerPart === 'httponly') {
      cookie.httpOnly = true;
    } else if (lowerPart === 'secure') {
      cookie.secure = true;
    }
  }

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

    // Navigate to home page
    const homePage = new HomePage(page);
    await homePage.goto();

    // Open auth popup from header
    const authPopup = await homePage.header.clickSignin();
    await authPopup.waitForVisible();

    // Listen for response to capture cookies
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/react/authenticate/login') && response.status() === 200,
      { timeout: 30000 }
    );

    // Perform login
    await authPopup.login(email, password);
    await authPopup.waitForSuccessfulLogin();

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
