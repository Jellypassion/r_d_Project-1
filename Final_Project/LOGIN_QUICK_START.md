# Login Feature - Quick Reference

## What Was Added

✅ **Login Service** - Authenticates with username/password and extracts tokens
✅ **Auth API Client** - Easy-to-use API for login operations
✅ **Automatic .env Updates** - Tokens are written to .env file automatically
✅ **CLI Login Script** - `npm run login` command for quick authentication
✅ **Comprehensive Tests** - Full test coverage for login functionality
✅ **Documentation** - Complete guide in LOGIN_GUIDE.md

## Quick Start

### 1. Login via Command Line

```bash
npm run login
```

### 2. Login in Code

```typescript
import { FophelpApiClient } from './src/helpers/fophelp-client';

const apiClient = new FophelpApiClient();

// Login and update .env
await apiClient.authApi.loginFromEnv(true);
```

### 3. Run Tests

```bash
npm test tests/auth.test.ts
```

## Files Created

| File | Description |
|------|-------------|
| `src/services/login.service.ts` | Core login logic with token extraction |
| `src/apis/fophelp-api/auth.api-client.ts` | Auth API client |
| `src/models/fophelp-api/auth.dto.ts` | Login DTOs |
| `scripts/login.ts` | CLI login script |
| `tests/auth.test.ts` | Authentication tests |
| `LOGIN_GUIDE.md` | Complete documentation |

## Files Modified

| File | Changes |
|------|---------|
| `src/helpers/fophelp-client.ts` | Added authApi property |
| `package.json` | Added "login" script |
| `Readme.md` | Updated with login instructions |

## API Details

**Endpoint:** `POST https://new.fophelp.pro/api/react/authenticate/login`

**Request:**
```json
{
    "username": "email@example.com",
    "password": "password123"
}
```

**Response Headers:**
- `X-Access-Token` → `X_ACCESS_TOKEN` in .env
- `X-Refresh-Token` → `X_REFRESH_TOKEN` in .env
- `X-Username` → `X_USERNAME` in .env
- `X-Refresh-Expires` → `X_REFRESH_EXPIRES` in .env
- `Session-User` → `SESSION_USER` in .env

## Environment Variables

### Required (add these):
```env
API_USERNAME=e.bezsrochnyi@gmail.com
API_PASSWORD=YourPassword123!
```

### Auto-updated by login:
```env
X_ACCESS_TOKEN=eyJhbGc...
X_REFRESH_TOKEN=f1b0c465...
X_USERNAME=e.bezsrochnyi%40gmail.com
X_REFRESH_EXPIRES=18.12.2025%2022%3A42%3A59
SESSION_USER=e.bezsrochnyi@gmail.com
```

## Usage Examples

### Example 1: CLI Login
```bash
npm run login
```

### Example 2: Login in Tests
```typescript
beforeAll(async () => {
    const apiClient = new FophelpApiClient();
    await apiClient.authApi.loginFromEnv(true);
});
```

### Example 3: Manual Login
```typescript
const apiClient = new FophelpApiClient();
await apiClient.authApi.login('email@example.com', 'password123');
```

### Example 4: Login + Use API
```typescript
const apiClient = new FophelpApiClient();

// Get fresh tokens
await apiClient.authApi.loginFromEnv(true);

// Use APIs with fresh tokens
const incomes = await apiClient.incomesApi.getIncomes();
const taxes = await apiClient.taxesApi.getTaxes();
```

## Next Steps

1. **Test the login:**
   ```bash
   npm run login
   ```

2. **Run authentication tests:**
   ```bash
   npm test tests/auth.test.ts
   ```

3. **Read full documentation:**
   - [LOGIN_GUIDE.md](LOGIN_GUIDE.md) - Complete login guide
   - [TOKEN_REFRESH.md](TOKEN_REFRESH.md) - Token refresh details
   - [Readme.md](Readme.md) - Updated project README

## Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| "API_USERNAME and API_PASSWORD must be set" | Add credentials to .env |
| "Login failed: 401" | Check username/password |
| "Missing required token" | Server response issue |
| ".env file not found" | Create .env in project root |

## Integration

The login feature integrates with:
- ✅ Token Storage System
- ✅ Token Refresh Service
- ✅ FophelpApiClient
- ✅ All existing API clients

## Security

✅ Credentials stored in .env (git-ignored)
✅ HTTPS only
✅ Tokens auto-expire
✅ No hardcoded credentials

---

**Ready to use!** Run `npm run login` to get started.
