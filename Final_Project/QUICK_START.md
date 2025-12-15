# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Authentication

Copy `.env.example` to `.env` and add your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
FOPHELP_BASE_URL=https://new.fophelp.pro

X_ACCESS_TOKEN=your_jwt_token_here
X_REFRESH_TOKEN=your_refresh_token_uuid
X_USERNAME=your_email%40domain.com
X_REFRESH_EXPIRES=DD.MM.YYYY%20HH%3AMM%3ASS
SESSION_USER=your_email@domain.com
```

**How to get tokens:**
1. Log into https://new.fophelp.pro in your browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Make any API request
5. Find the request and copy Cookie header values

### 3. Start Testing

```typescript
import { FophelpApiClient } from './src/helpers/fophelp-client';

// Initialize client (tokens refresh automatically!)
const apiClient = new FophelpApiClient();

// Use your API endpoints
const data = await apiClient.exampleApi.getAll();
```

## Run Tests

```bash
npm test
```

## Key Features

✅ **Automatic Token Refresh** - No manual intervention needed
✅ **Cookie-Based Auth** - Industry standard security
✅ **TypeScript** - Full type safety
✅ **Vitest** - Fast and modern testing
✅ **Environment Variables** - Secure credential storage

## Project Structure

```
src/
├── apis/fophelp-api/     # API endpoint implementations
├── helpers/              # Helper utilities (FophelpApiClient)
├── models/               # DTOs and interfaces
└── services/             # Core services
    ├── config.service.ts         # Environment config
    ├── fetch-api-service.ts      # HTTP client with retry
    ├── token-storage.ts          # In-memory token storage
    └── token-refresh.service.ts  # Token refresh logic
```

## Common Tasks

### Add a New API Endpoint

1. **Create DTO** in `src/models/fophelp-api/`:
```typescript
// src/models/fophelp-api/user.dto.ts
export interface UserDto {
    id: string;
    email: string;
    name: string;
}
```

2. **Create API class** in `src/apis/fophelp-api/`:
```typescript
// src/apis/fophelp-api/users.api.ts
import { FetchApiService } from '../../services/fetch-api-service';
import { UserDto } from '../../models/fophelp-api/user.dto';

export class UsersApi {
    constructor(private readonly apiService: FetchApiService) {}

    async getUser(id: string): Promise<UserDto> {
        const response = await this.apiService.get(`/api/users/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to get user: ${response.statusText}`);
        }
        return await response.json();
    }
}
```

3. **Register in FophelpApiClient**:
```typescript
// src/helpers/fophelp-client.ts
import { UsersApi } from '../apis/fophelp-api/users.api';

export class FophelpApiClient {
    public readonly usersApi: UsersApi;

    constructor() {
        // ... existing code ...
        this.usersApi = new UsersApi(this.apiService);
    }
}
```

4. **Write tests**:
```typescript
// tests/users.test.ts
import { describe, it, expect } from 'vitest';
import { FophelpApiClient } from '../src/helpers/fophelp-client';

describe('Users API', () => {
    it('should get user by id', async () => {
        const apiClient = new FophelpApiClient();
        const user = await apiClient.usersApi.getUser('123');
        expect(user.id).toBe('123');
    });
});
```

### Check Current Token Status

```typescript
const apiClient = new FophelpApiClient();
const tokenStorage = apiClient.getTokenStorage();

console.log('Access Token:', tokenStorage.getAccessToken());
console.log('Expires:', tokenStorage.getRefreshExpires());
```

### Handle API Errors

```typescript
try {
    const data = await apiClient.exampleApi.getAll();
} catch (error) {
    if (error.message.includes('Token refresh failed')) {
        console.error('Authentication failed - need new tokens');
    } else {
        console.error('API error:', error);
    }
}
```

## Documentation

- **[README.md](Readme.md)** - Project overview
- **[TOKEN_REFRESH.md](TOKEN_REFRESH.md)** - Token refresh implementation details
- **[COOKIE_AUTH.md](COOKIE_AUTH.md)** - Cookie authentication guide
- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Comprehensive usage guide
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - Migration notes

## Need Help?

### Token Issues

If tokens aren't working:
1. Check `.env` file has all 5 required values
2. Ensure tokens are not expired
3. Get fresh tokens from browser
4. Restart your tests

### API Errors

If getting 401/403 errors constantly:
1. Verify tokens in `.env` are correct
2. Check refresh endpoint is accessible
3. Look for "Token refresh failed" in error messages
4. Try getting new tokens manually

### TypeScript Errors

Run type checking:
```bash
npx tsc --noEmit
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure `.env`
3. ✅ Run tests
4. 🔨 Explore API documentation
5. 🔨 Implement your first endpoint
6. 🔨 Write comprehensive tests

Happy testing! 🚀
