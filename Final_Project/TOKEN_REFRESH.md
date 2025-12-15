# Token Refresh Implementation Guide

## Overview

This project now includes automatic token refresh functionality. When the `X-Access-Token` expires (after 1 hour), the system automatically detects the expiration and refreshes the token by calling the Fophelp API refresh endpoint.

## How It Works

### Architecture

```
┌─────────────────┐
│  FophelpApiClient│
│                 │
│  ┌───────────┐  │
│  │TokenStorage│  │  (In-memory token storage)
│  └───────────┘  │
│        │        │
│  ┌───────────────────────┐
│  │  FetchApiService      │  (HTTP client with retry logic)
│  └───────────────────────┘
│        │
│  ┌───────────────────────┐
│  │TokenRefreshService    │  (Handles token refresh)
│  └───────────────────────┘
└─────────────────┘
```

### Flow Diagram

```
Request → FetchApiService
            ↓
        [Make API Call]
            ↓
        Response Received
            ↓
    Is Token Expired?
    (401/403 or Token-Expired header)
        ↓
      Yes ↓         No →  Return Response
        ↓
TokenRefreshService.refreshTokens()
        ↓
    GET /api/react/authenticate/refresh
        ↓
    Parse Set-Cookie Headers
        ↓
    Update TokenStorage
        ↓
    Retry Original Request
        ↓
    Return Response
```

## Components

### 1. TokenStorage (`src/services/token-storage.ts`)

Manages authentication tokens in memory with automatic updates.

**Key Features:**
- Stores all 5 required cookies
- Provides thread-safe token updates
- Exposes individual token getters
- Returns complete cookie object for requests

**Example:**
```typescript
const tokenStorage = new TokenStorage({
    accessToken: 'jwt_token',
    refreshToken: 'refresh_uuid',
    username: 'user@example.com',
    refreshExpires: '15.12.2025 23:38:25',
    sessionUser: 'user@example.com'
});

// Get individual tokens
const accessToken = tokenStorage.getAccessToken();

// Update tokens after refresh
tokenStorage.updateTokens({
    accessToken: 'new_jwt_token',
    refreshToken: 'new_refresh_uuid'
});

// Get all cookies for requests
const cookies = tokenStorage.getAllCookies();
// Returns: { 'X-Access-Token': '...', 'X-Refresh-Token': '...', ... }
```

### 2. TokenRefreshService (`src/services/token-refresh.service.ts`)

Handles the token refresh process.

**Key Features:**
- Calls refresh endpoint: `GET /api/react/authenticate/refresh`
- Parses `Set-Cookie` response headers
- Updates token storage automatically
- Prevents concurrent refresh requests
- Detects token expiration from responses

**Token Expiration Detection:**
```typescript
TokenRefreshService.isTokenExpired(response);
// Returns true if:
// - response.status === 401 (Unauthorized)
// - response.status === 403 (Forbidden)
// - response.headers.get('Token-Expired') === 'true'
```

**Refresh Process:**
```typescript
await tokenRefreshService.refreshTokens();
// 1. Calls GET /api/react/authenticate/refresh with current cookies
// 2. Receives new tokens in Set-Cookie headers:
//    Set-Cookie: X-Access-Token=new_value; ...
//    Set-Cookie: X-Refresh-Token=new_value; ...
// 3. Parses headers and extracts token values
// 4. Updates TokenStorage with new values
```

### 3. FetchApiService (`src/services/fetch-api-service.ts`)

Enhanced HTTP client with automatic token refresh.

**Key Features:**
- Detects token expiration automatically
- Triggers refresh when needed
- Retries failed requests after refresh
- Uses TokenStorage for dynamic cookies
- Single retry to prevent loops

**Retry Logic:**
```typescript
private async fetchWithRetry(
    fetchFunction: () => Promise<Response>,
    retryCount = 0
): Promise<Response> {
    const response = await fetchFunction();

    if (
        this.tokenRefreshService &&
        TokenRefreshService.isTokenExpired(response) &&
        retryCount === 0  // Only retry once
    ) {
        await this.tokenRefreshService.refreshTokens();
        return await this.fetchWithRetry(fetchFunction, retryCount + 1);
    }

    return response;
}
```

### 4. FophelpApiClient (`src/helpers/fophelp-client.ts`)

Main entry point that wires everything together.

**Initialization:**
```typescript
const apiClient = new FophelpApiClient();
// Automatically initializes:
// - TokenStorage with values from .env
// - FetchApiService with token storage
// - TokenRefreshService for automatic refresh
// - All API endpoints (exampleApi, etc.)
```

**Accessing Components:**
```typescript
// Get token storage to check current values
const tokenStorage = apiClient.getTokenStorage();
console.log('Current access token:', tokenStorage.getAccessToken());

// Get API service for custom requests
const apiService = apiClient.getApiService();

// Use API endpoints
const data = await apiClient.exampleApi.getAll();
```

## Refresh Endpoint Details

### Request

```http
GET /api/react/authenticate/refresh HTTP/1.1
Host: new.fophelp.pro
Cookie: X-Access-Token=...; X-Refresh-Token=...; X-Username=...; X-Refresh-Expires=...; Session-User=...
Accept: application/json
```

### Response

```http
HTTP/1.1 200 OK
Token-Expired: true
Set-Cookie: X-Access-Token=eyJhbG...; expires=Mon, 15 Dec 2025 21:38:25 GMT; path=/; samesite=strict; httponly
Set-Cookie: X-Refresh-Token=96d80799...; expires=Tue, 16 Dec 2025 02:38:25 GMT; path=/; samesite=strict; httponly
Set-Cookie: X-Username=user%40example.com; expires=Tue, 16 Dec 2025 02:38:25 GMT; path=/; samesite=strict; httponly
Set-Cookie: X-Refresh-Expires=15.12.2025%2023%3A38%3A25; expires=Mon, 15 Dec 2025 21:53:25 GMT; path=/; samesite=strict
Set-Cookie: Session-User=user@example.com; expires=Tue, 16 Dec 2025 02:38:25 GMT; path=/; samesite=strict
```

## Usage Examples

### Basic Usage

```typescript
import { FophelpApiClient } from './src/helpers/fophelp-client';

// Initialize client
const apiClient = new FophelpApiClient();

// Make requests - token refresh is automatic
const data = await apiClient.exampleApi.getAll();
// If token expires during this call:
// 1. Request returns 401 or Token-Expired header
// 2. System automatically calls refresh endpoint
// 3. New tokens are stored
// 4. Request is retried with new tokens
// 5. Data is returned
```

### Checking Token Status

```typescript
const apiClient = new FophelpApiClient();
const tokenStorage = apiClient.getTokenStorage();

// Check current tokens
console.log('Access Token:', tokenStorage.getAccessToken());
console.log('Refresh Token:', tokenStorage.getRefreshToken());
console.log('Username:', tokenStorage.getUsername());
console.log('Expires:', tokenStorage.getRefreshExpires());

// Get all cookies
const cookies = tokenStorage.getAllCookies();
console.log('All cookies:', cookies);
```

### Manual Token Refresh

```typescript
import { TokenRefreshService } from './src/services/token-refresh.service';

const apiClient = new FophelpApiClient();
const tokenStorage = apiClient.getTokenStorage();
const refreshService = new TokenRefreshService(
    'https://new.fophelp.pro',
    tokenStorage
);

// Manually trigger refresh
await refreshService.refreshTokens();

// Check updated tokens
console.log('New Access Token:', tokenStorage.getAccessToken());
```

### Testing Token Refresh

```typescript
describe('Token Refresh', () => {
    it('should refresh tokens automatically', async () => {
        const apiClient = new FophelpApiClient();
        const tokenStorage = apiClient.getTokenStorage();

        const initialToken = tokenStorage.getAccessToken();

        // Make a request (will auto-refresh if expired)
        await apiClient.exampleApi.getAll();

        const currentToken = tokenStorage.getAccessToken();

        // Token may have been refreshed
        if (initialToken !== currentToken) {
            console.log('Token was refreshed during the request');
        }
    });
});
```

## Error Handling

### Refresh Failures

If token refresh fails, the error is propagated:

```typescript
try {
    await apiClient.exampleApi.getAll();
} catch (error) {
    if (error.message.includes('Token refresh failed')) {
        // Handle refresh failure
        // - Tokens might be completely invalid
        // - Refresh token might be expired
        // - Network issues
        console.error('Need to re-authenticate:', error);
    }
}
```

### Network Errors

```typescript
try {
    await apiClient.exampleApi.getAll();
} catch (error) {
    console.error('API request failed:', error);
    // Could be:
    // - Network error
    // - Token refresh failed
    // - API error
    // - Invalid response
}
```

## Configuration

### Environment Variables

Ensure your `.env` file contains valid tokens:

```env
FOPHELP_BASE_URL=https://new.fophelp.pro

X_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X_REFRESH_TOKEN=96d80799-96c8-4bd5-83a5-20fa90531ff3
X_USERNAME=e.bezsrochnyi%40gmail.com
X_REFRESH_EXPIRES=15.12.2025%2023%3A38%3A25
SESSION_USER=e.bezsrochnyi@gmail.com
```

### Disabling Auto-Refresh

If you want to use static tokens without auto-refresh:

```typescript
import { FetchApiService } from './src/services/fetch-api-service';
import { ConfigService } from './src/services/config.service';

const config = new ConfigService().getConfig();
const cookies = /* build cookies object */;

// Create service without token storage
const apiService = new FetchApiService(
    config.api.fophelpApi.baseUrl,
    { cookies }
    // No third parameter = no auto-refresh
);
```

## Best Practices

1. **Always use FophelpApiClient** for automatic token management
2. **Don't store tokens manually** - let TokenStorage handle it
3. **Monitor token refresh** in logs during development
4. **Handle refresh errors** gracefully in production
5. **Keep .env file secure** - never commit it
6. **Update .env regularly** with fresh tokens if needed

## Troubleshooting

### Issue: Tokens not refreshing

**Check:**
- Is `FophelpApiClient` being used?
- Are tokens in `.env` valid?
- Is the refresh endpoint accessible?
- Check network logs for refresh requests

### Issue: Continuous refresh loops

**Solution:**
- The retry logic only attempts refresh once per request
- Check if refresh endpoint is returning valid tokens
- Verify Set-Cookie headers are being received

### Issue: Tokens still expire after refresh

**Check:**
- Verify new tokens are actually being stored
- Check TokenStorage.getAllCookies() returns updated values
- Ensure subsequent requests use new tokens

## Token Lifetime

- **Access Token**: 1 hour (3600 seconds)
- **Refresh Token**: ~5 hours (until X-Refresh-Expires)
- **Automatic Refresh**: Triggered on expiration detection
- **Manual Refresh**: Can be called anytime

## Security Notes

1. **Tokens in memory**: Tokens are stored in memory only, not persisted
2. **HTTPS required**: Always use HTTPS in production
3. **httponly cookies**: Server sets httponly flag for security
4. **Token rotation**: Refresh provides new tokens each time
5. **Expiration enforcement**: Server enforces token expiration

---

**For more details, see:**
- [COOKIE_AUTH.md](COOKIE_AUTH.md) - Cookie authentication details
- [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) - Project migration overview
- [USAGE_GUIDE.md](USAGE_GUIDE.md) - General usage guide
