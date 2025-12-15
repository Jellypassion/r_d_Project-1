# Cookie-Based Authentication Implementation

## Overview

This project implements cookie-based authentication for the Fophelp API at https://new.fophelp.pro. The authentication system uses multiple cookies that must be sent with each request.

## Cookie Structure

The API requires the following cookies to be sent with each request:

### X-Access-Token
- **Purpose**: JWT access token for authentication
- **Type**: String (JWT)
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Required**: Yes

### X-Refresh-Token
- **Purpose**: Token used to refresh the access token when it expires
- **Type**: String (UUID)
- **Example**: `b9bdc2e8-bee0-47d2-8881-987c8ec5fff3`
- **Required**: Yes

### X-Username
- **Purpose**: User identifier (URL encoded)
- **Type**: String
- **Example**: `e.bezsrochnyi%40gmail.com`
- **Required**: Yes
- **Note**: Must be URL encoded

### X-Refresh-Expires
- **Purpose**: Timestamp indicating when the refresh token expires
- **Type**: String (datetime, URL encoded)
- **Example**: `15.12.2025%2018%3A23%3A18`
- **Required**: Yes
- **Format**: `DD.MM.YYYY%20HH%3AMM%3ASS`

### Session-User
- **Purpose**: Session user identifier
- **Type**: String
- **Example**: `e.bezsrochnyi@gmail.com`
- **Required**: Yes

## Implementation Details

### 1. Environment Variables

Cookies are stored in the `.env` file:

```env
X_ACCESS_TOKEN=your_jwt_token_here
X_REFRESH_TOKEN=your_refresh_token_here
X_USERNAME=your_username_here
X_REFRESH_EXPIRES=your_expiry_date_here
SESSION_USER=your_session_user_here
```

### 2. Configuration Loading

The `ConfigService` loads these values from environment variables:

```typescript
private getAuthConfig(): AuthConfigDto {
    return {
        fophelpApi: {
            cookies: {
                xAccessToken: process.env.X_ACCESS_TOKEN || '',
                xRefreshToken: process.env.X_REFRESH_TOKEN || '',
                xUsername: process.env.X_USERNAME || '',
                xRefreshExpires: process.env.X_REFRESH_EXPIRES || '',
                sessionUser: process.env.SESSION_USER || ''
            }
        }
    };
}
```

### 3. Cookie Header Construction

The `FetchApiService` constructs the Cookie header from the configuration:

```typescript
private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.secret.cookies) {
        const cookieString = Object.entries(this.secret.cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');
        headers['Cookie'] = cookieString;
    }
    return headers;
}
```

### 4. Fetch Configuration

All requests include `credentials: 'include'` to ensure cookies are sent:

```typescript
return await fetch(url, {
    method: 'GET',
    headers: defaultHeaders,
    credentials: 'include'
});
```

## Cookie String Format

The cookies are sent as a single header:

```
Cookie: X-Access-Token=eyJ...; X-Refresh-Token=b9bdc2e8...; X-Username=e.bezsrochnyi%40gmail.com; X-Refresh-Expires=15.12.2025%2018%3A23%3A18; Session-User=e.bezsrochnyi@gmail.com
```

## Getting New Cookies

To obtain fresh cookies:

1. Open the Fophelp API in your browser
2. Log in to your account
3. Open Browser Developer Tools (F12)
4. Navigate to the Network tab
5. Make any API request
6. Find the request in the Network tab
7. Copy the Cookie header value from the Request Headers
8. Update your `.env` file with the new values

### Extracting Individual Cookie Values

From the Cookie header string:
```
Cookie: X-Access-Token=VALUE1; X-Refresh-Token=VALUE2; ...
```

Extract each value and place it in `.env`:
```env
X_ACCESS_TOKEN=VALUE1
X_REFRESH_TOKEN=VALUE2
...
```

## Token Expiration

### Detecting Expiration

When tokens expire, API requests will typically return:
- HTTP 401 Unauthorized
- HTTP 403 Forbidden

### Handling Expiration

Currently, the implementation requires manual token refresh:

1. Obtain new cookies from the browser (see above)
2. Update `.env` file
3. Restart your tests

### Future Enhancement: Automatic Token Refresh

You can implement automatic token refresh by:

1. Creating a token refresh endpoint in your API class
2. Catching 401/403 errors
3. Calling the refresh endpoint with the refresh token
4. Updating the cookies
5. Retrying the original request

Example implementation:

```typescript
export class AuthService {
    async refreshTokens(refreshToken: string): Promise<AuthTokens> {
        const response = await this.apiService.post('/api/auth/refresh', {
            refreshToken
        });

        if (!response.ok) {
            throw new Error('Failed to refresh tokens');
        }

        return await response.json();
    }
}
```

## Security Considerations

1. **Never commit `.env` file**: The `.gitignore` is configured to exclude it
2. **Use `.env.example` as template**: Only example values, no real credentials
3. **Rotate tokens regularly**: Update tokens periodically for security
4. **Secure token storage**: Consider using environment-specific secure storage for CI/CD
5. **HTTPS only**: Always use HTTPS in production to protect cookies in transit

## Troubleshooting

### Issue: 401 Unauthorized

**Possible Causes:**
- Expired access token
- Invalid token format
- Missing cookies

**Solution:**
1. Check if tokens are expired
2. Verify all required cookies are present in `.env`
3. Obtain fresh cookies from the browser

### Issue: 403 Forbidden

**Possible Causes:**
- Insufficient permissions
- Invalid refresh token
- Account issues

**Solution:**
1. Verify account has necessary permissions
2. Obtain fresh tokens
3. Check account status

### Issue: Cookies not being sent

**Possible Causes:**
- Missing `credentials: 'include'` in fetch
- CORS issues
- Cookie formatting errors

**Solution:**
1. Verify `credentials: 'include'` is set
2. Check CORS configuration
3. Validate cookie string format

## Testing Cookie Authentication

```typescript
describe('Cookie Authentication', () => {
    it('should include all required cookies', () => {
        const config = new ConfigService().getConfig();
        const cookies = config.auth.fophelpApi?.cookies;

        expect(cookies?.xAccessToken).toBeDefined();
        expect(cookies?.xRefreshToken).toBeDefined();
        expect(cookies?.xUsername).toBeDefined();
        expect(cookies?.xRefreshExpires).toBeDefined();
        expect(cookies?.sessionUser).toBeDefined();
    });

    it('should construct valid cookie header', () => {
        const apiClient = new FophelpApiClient();
        // Test that requests include proper Cookie header
    });
});
```

## Additional Resources

- [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [MDN: Fetch API - credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
- [JWT.io - JWT Debugger](https://jwt.io/) - For inspecting JWT tokens
