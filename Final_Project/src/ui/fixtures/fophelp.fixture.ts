import { test as base, BrowserContext, Cookie } from '@playwright/test';
import dotenv from 'dotenv';
import { HomePage } from '../pages';

dotenv.config();

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

export const test = base.extend<{ authenticatedContext: AuthContext }>({
  authenticatedContext: async ({ browser }, use) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    if (!email || !password) {
      throw new Error('EMAIL and PASSWORD must be set in .env file');
    }

    const homePage = new HomePage(page);
    await homePage.goto();

    const authPopup = await homePage.header.clickSignin();
    await authPopup.waitForVisible();

    // Listen for response to capture cookies
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/react/authenticate/login') && response.status() === 200,
      { timeout: 30000 }
    );

    await authPopup.login(email, password);
    await authPopup.waitForSuccessfulLogin();

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

      await context.addCookies(cookies);
    }

    // Close the page used for login
    await page.close();

    await use({ context, cookies });

    await context.close();
  },
});

export { expect } from '@playwright/test';
