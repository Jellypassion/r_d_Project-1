# Login Functionality Guide

## Overview

The testing framework now includes full login functionality that allows you to authenticate with the Fophelp API and automatically update your `.env` file with fresh authentication tokens.

## Features

✅ Login with username and password
✅ Automatic token extraction from response headers
✅ Automatic `.env` file updates
✅ Integration with existing token refresh system
✅ Multiple usage patterns (API, script, tests)

## Quick Start

### 1. Set Credentials in .env

Make sure your `.env` file contains:

```env
API_USERNAME=e.bezsrochnyi@gmail.com
API_PASSWORD=YourPassword123!
```

### 2. Run Login Script

```bash
npm run login
```

This will:
1. Authenticate with your credentials
2. Extract tokens from response headers
3. Update your `.env` file with new tokens
4. Display the results

### 3. Use in Tests

```typescript
import { FophelpApiClient } from '../src/helpers/fophelp-client';

const apiClient = new FophelpApiClient();

// Login and update .env
await apiClient.authApi.loginFromEnv(true);
```

## API Endpoint

**URL:** `POST https://new.fophelp.pro/api/react/authenticate/login`

**Request Body:**
```json
{
    "username": "e.bezsrochnyi@gmail.com",
    "password": "YourPassword123!"
}
```

**Response Headers:**
```http
Set-Cookie: X-Access-Token=eyJhbGc...
Set-Cookie: X-Refresh-Token=f1b0c465-c46f-406b-91ce-1e1029e68de1
Set-Cookie: X-Username=e.bezsrochnyi%40gmail.com
Set-Cookie: X-Refresh-Expires=18.12.2025%2022%3A42%3A59
Set-Cookie: Session-User=e.bezsrochnyi%40gmail.com
```

## Usage Methods

### Method 1: Using Login Script (Recommended)

```bash
npm run login
```

**Output:**
```
🔐 Starting login process...

📧 Username: e.bezsrochnyi@gmail.com
🔑 Attempting login...

✅ Login successful!

📝 Tokens received and saved to .env file:
────────────────────────────────────────────────────────────
Access Token:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJl...
Refresh Token:   f1b0c465-c46f-406b-91ce-1e1029e68de1
Username:        e.bezsrochnyi%40gmail.com
Session User:    e.bezsrochnyi@gmail.com
Refresh Expires: 18.12.2025 22:42:59
────────────────────────────────────────────────────────────

✨ .env file has been updated with new authentication tokens
```

### Method 2: Using API Client in Code

```typescript
import { FophelpApiClient } from './src/helpers/fophelp-client';

const apiClient = new FophelpApiClient();

// Option A: Login with explicit credentials
const tokens = await apiClient.authApi.login(
    'e.bezsrochnyi@gmail.com',
    'YourPassword123!'
);

// Option B: Login using .env credentials (no .env update)
const tokens = await apiClient.authApi.loginFromEnv(false);

// Option C: Login using .env credentials AND update .env
const tokens = await apiClient.authApi.loginFromEnv(true);

// Access token values
console.log('Access Token:', tokens.accessToken);
console.log('Refresh Token:', tokens.refreshToken);
console.log('Username:', tokens.username);
console.log('Session User:', tokens.sessionUser);
console.log('Refresh Expires:', tokens.refreshExpires);
```

### Method 3: Using LoginService Directly

```typescript
import { LoginService } from './src/services/login.service';

const loginService = new LoginService('https://new.fophelp.pro');

// Login only
const tokens = await loginService.login(
    'e.bezsrochnyi@gmail.com',
    'YourPassword123!'
);

// Login and update .env
const tokens = await loginService.loginAndUpdateEnv(
    'e.bezsrochnyi@gmail.com',
    'YourPassword123!'
);
```

### Method 4: In Tests

```typescript
import { describe, it, expect } from 'vitest';
import { FophelpApiClient } from '../src/helpers/fophelp-client';

describe('API Tests', () => {
    it('should refresh tokens before testing', async () => {
        const apiClient = new FophelpApiClient();

        // Login and update .env
        await apiClient.authApi.loginFromEnv(true);

        // Now use other APIs with fresh tokens
        const data = await apiClient.incomesApi.getSomeData();
        expect(data).toBeDefined();
    });
});
```

## Architecture

### Components

```
┌──────────────────────────────────┐
│     FophelpApiClient             │
│                                  │
│  ┌────────────────────────────┐  │
│  │    AuthApiClient           │  │
│  │  - login()                 │  │
│  │  - loginFromEnv()          │  │
│  │  - loginAndUpdateEnv()     │  │
│  └────────────────────────────┘  │
│             │                    │
│  ┌────────────────────────────┐  │
│  │     LoginService           │  │
│  │  - Token extraction        │  │
│  │  - .env file updates       │  │
│  │  - Header parsing          │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### Flow Diagram

```
User Request
    ↓
AuthApiClient.loginFromEnv(updateEnv=true)
    ↓
Read API_USERNAME and API_PASSWORD from .env
    ↓
LoginService.loginAndUpdateEnv()
    ↓
POST /api/react/authenticate/login
    {username, password}
    ↓
Receive Response with Set-Cookie headers
    ↓
Parse Set-Cookie headers:
  - X-Access-Token
  - X-Refresh-Token
  - X-Username
  - X-Refresh-Expires
  - Session-User
    ↓
Update .env file with new values
    ↓
Return tokens to caller
```

## Response Token Mapping

| Response Header | .env Variable | Description |
|----------------|---------------|-------------|
| `X-Access-Token` | `X_ACCESS_TOKEN` | JWT access token (1 hour validity) |
| `X-Refresh-Token` | `X_REFRESH_TOKEN` | UUID for token refresh |
| `X-Username` | `X_USERNAME` | URL-encoded username |
| `X-Refresh-Expires` | `X_REFRESH_EXPIRES` | Refresh token expiration timestamp |
| `Session-User` | `SESSION_USER` | Plain text username |

## Environment Variables

### Required for Login

```env
API_USERNAME=e.bezsrochnyi@gmail.com
API_PASSWORD=YourPassword123!
```

### Updated After Login

```env
X_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X_REFRESH_TOKEN=f1b0c465-c46f-406b-91ce-1e1029e68de1
X_USERNAME=e.bezsrochnyi%40gmail.com
X_REFRESH_EXPIRES=18.12.2025%2022%3A42%3A59
SESSION_USER=e.bezsrochnyi@gmail.com
```

### Also Required

```env
FOPHELP_BASE_URL=https://new.fophelp.pro
FOPHELP_API_VERSION=/api/v2.0
```

## Code Examples

### Example 1: Basic Login

```typescript
import { FophelpApiClient } from './src/helpers/fophelp-client';

async function login() {
    const apiClient = new FophelpApiClient();

    const tokens = await apiClient.authApi.login(
        'e.bezsrochnyi@gmail.com',
        'YourPassword123!'
    );

    console.log('Access Token:', tokens.accessToken);
    console.log('Refresh Token:', tokens.refreshToken);
}

login();
```

### Example 2: Login and Update .env

```typescript
import { FophelpApiClient } from './src/helpers/fophelp-client';

async function refreshTokens() {
    const apiClient = new FophelpApiClient();

    // Reads credentials from .env and updates tokens
    await apiClient.authApi.loginFromEnv(true);

    console.log('✅ Tokens updated in .env file');
}

refreshTokens();
```

### Example 3: Login Before Test Suite

```typescript
import { describe, beforeAll, it, expect } from 'vitest';
import { FophelpApiClient } from '../src/helpers/fophelp-client';

describe('API Integration Tests', () => {
    let apiClient: FophelpApiClient;

    beforeAll(async () => {
        apiClient = new FophelpApiClient();

        // Ensure fresh tokens before all tests
        await apiClient.authApi.loginFromEnv(true);

        console.log('✅ Authentication refreshed');
    });

    it('should fetch data with fresh tokens', async () => {
        const data = await apiClient.incomesApi.getSomeData();
        expect(data).toBeDefined();
    });
});
```

### Example 4: Manual .env Update

```typescript
import { LoginService } from './src/services/login.service';
import * as path from 'path';

async function updateEnvFile() {
    const loginService = new LoginService('https://new.fophelp.pro');

    const tokens = await loginService.login(
        'e.bezsrochnyi@gmail.com',
        'YourPassword123!'
    );

    // Update .env file
    const envPath = path.join(process.cwd(), '.env');
    LoginService.updateEnvFile(envPath, tokens);

    console.log('✅ .env file updated');
}

updateEnvFile();
```

## Error Handling

### Invalid Credentials

```typescript
try {
    await apiClient.authApi.login('wrong@email.com', 'wrongpassword');
} catch (error) {
    console.error('Login failed:', error.message);
    // Output: Login failed: 401 Unauthorized
}
```

### Missing Environment Variables

```typescript
try {
    await apiClient.authApi.loginFromEnv();
} catch (error) {
    console.error('Error:', error.message);
    // Output: API_USERNAME and API_PASSWORD must be set in .env file
}
```

### Network Errors

```typescript
try {
    await apiClient.authApi.login(username, password);
} catch (error) {
    if (error.message.includes('fetch failed')) {
        console.error('Network error - check your connection');
    }
}
```

### Missing Response Headers

```typescript
try {
    await apiClient.authApi.login(username, password);
} catch (error) {
    if (error.message.includes('Missing required token')) {
        console.error('Server did not return all required tokens');
    }
}
```

## Testing

Run the authentication tests:

```bash
npm test tests/auth.test.ts
```

**Test Coverage:**
- ✅ Login with credentials from .env
- ✅ Login using loginFromEnv method
- ✅ Login and update .env file
- ✅ Token storage integration
- ✅ Error handling for invalid credentials
- ✅ Error handling for missing environment variables

## Integration with Token Refresh

The login functionality integrates seamlessly with the existing token refresh system:

1. **Login** → Gets fresh tokens from login endpoint
2. **Token Refresh** → Uses refresh token to get new access token
3. **Auto-refresh** → Happens automatically when access token expires

```typescript
const apiClient = new FophelpApiClient();

// Login once
await apiClient.authApi.loginFromEnv(true);

// Make requests - auto-refresh happens if token expires
await apiClient.incomesApi.getData(); // May trigger auto-refresh
await apiClient.taxesApi.getData();   // Uses refreshed token
```

## Best Practices

### 1. Login Before Test Runs

```typescript
beforeAll(async () => {
    await apiClient.authApi.loginFromEnv(true);
});
```

### 2. Use Environment Variables

Never hardcode credentials in code:

```typescript
// ❌ Bad
await apiClient.authApi.login('user@email.com', 'password123');

// ✅ Good
await apiClient.authApi.loginFromEnv(true);
```

### 3. Handle Errors Gracefully

```typescript
try {
    await apiClient.authApi.loginFromEnv(true);
} catch (error) {
    console.error('Login failed, using existing tokens');
    // Continue with existing tokens
}
```

### 4. Keep .env Secure

```bash
# Add to .gitignore
.env
.env.local
.env.*.local
```

### 5. Regular Token Refresh

```bash
# Run daily or before important test runs
npm run login
```

## Troubleshooting

### Issue: Login returns 401

**Solution:** Check your credentials in `.env` file

### Issue: Tokens not updated in .env

**Solution:** Ensure `.env` file exists and is writable

### Issue: Can't read Set-Cookie headers

**Solution:** This is normal in browser environment. Use Node.js or run the login script

### Issue: "Missing required token" error

**Solution:** Server may not be returning all tokens. Check API response format

## Security Notes

1. **Never commit .env file** - Add to .gitignore
2. **Use HTTPS** - Always use secure connection
3. **Rotate passwords regularly** - Update API_PASSWORD periodically
4. **Token expiration** - Access tokens expire in 1 hour
5. **Refresh tokens** - Valid for ~5 hours

## Files Created

- `/src/services/login.service.ts` - Core login logic
- `/src/apis/fophelp-api/auth.api-client.ts` - Auth API client
- `/src/models/fophelp-api/auth.dto.ts` - Login DTOs
- `/scripts/login.ts` - CLI login script
- `/tests/auth.test.ts` - Authentication tests

## Related Documentation

- [TOKEN_REFRESH.md](TOKEN_REFRESH.md) - Token refresh functionality
- [COOKIE_AUTH.md](COOKIE_AUTH.md) - Cookie authentication details
- [USAGE_GUIDE.md](USAGE_GUIDE.md) - General usage guide

---

**Need help?** Check the test file at [tests/auth.test.ts](tests/auth.test.ts) for more examples.
