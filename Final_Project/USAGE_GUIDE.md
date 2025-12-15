# Fophelp API Usage Guide

## Quick Start

### 1. Initialize the API Client

```typescript
import { FophelpApiClient } from './src/helpers/fophelp-client';

const apiClient = new FophelpApiClient();
```

### 2. Make API Calls

The client automatically handles authentication via cookies. All requests will include the necessary cookie headers.

```typescript
// Example: Get all items
const items = await apiClient.exampleApi.getAll();

// Example: Get specific item
const item = await apiClient.exampleApi.getById('123');

// Example: Create new item
const newItem = await apiClient.exampleApi.create({ name: 'New Item' });

// Example: Update item
const updated = await apiClient.exampleApi.update('123', { name: 'Updated Name' });

// Example: Delete item
await apiClient.exampleApi.delete('123');
```

## Adding New API Endpoints

### Step 1: Create DTO Models

Create a new file in `src/models/fophelp-api/`:

```typescript
// src/models/fophelp-api/user.dto.ts
export interface UserDto {
    id: string;
    email: string;
    name: string;
}

export interface CreateUserDto {
    email: string;
    name: string;
}
```

### Step 2: Create API Class

Create a new file in `src/apis/fophelp-api/`:

```typescript
// src/apis/fophelp-api/user.api.ts
import { FetchApiService } from '../../services/fetch-api-service';
import { UserDto, CreateUserDto } from '../../models/fophelp-api/user.dto';

export class UserApi {
    public constructor(private readonly apiService: FetchApiService) {}

    public async getUsers(): Promise<UserDto[]> {
        const response = await this.apiService.get('/api/users');
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        return await response.json();
    }

    public async createUser(data: CreateUserDto): Promise<UserDto> {
        const response = await this.apiService.post('/api/users', data);
        if (!response.ok) {
            throw new Error(`Failed to create user: ${response.statusText}`);
        }
        return await response.json();
    }
}
```

### Step 3: Add to Client

Update `src/helpers/fophelp-client.ts`:

```typescript
import { UserApi } from '../apis/fophelp-api/user.api';

export class FophelpApiClient {
    // ... existing code ...
    public readonly userApi: UserApi;

    constructor() {
        // ... existing code ...
        this.userApi = new UserApi(this.apiService);
    }
}
```

### Step 4: Write Tests

Create tests in `tests/`:

```typescript
// tests/user-api.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { FophelpApiClient } from '../src/helpers/fophelp-client';

describe('User API Tests', () => {
    let apiClient: FophelpApiClient;

    beforeAll(() => {
        apiClient = new FophelpApiClient();
    });

    it('should fetch users', async () => {
        const users = await apiClient.userApi.getUsers();
        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
    });

    it('should create a user', async () => {
        const newUser = await apiClient.userApi.createUser({
            email: 'test@example.com',
            name: 'Test User'
        });
        expect(newUser.id).toBeDefined();
        expect(newUser.email).toBe('test@example.com');
    });
});
```

## Environment Variables

Update your `.env` file when cookies expire or change:

```env
FOPHELP_BASE_URL=https://new.fophelp.pro
X_ACCESS_TOKEN=your_new_token
X_REFRESH_TOKEN=your_refresh_token
X_USERNAME=your_username
X_REFRESH_EXPIRES=expiry_date
SESSION_USER=your_session_user
```

## Making Custom Requests

If you need to make a custom request not covered by the API classes:

```typescript
const apiClient = new FophelpApiClient();
const apiService = apiClient.getApiService();

// Custom GET request
const response = await apiService.get('/api/custom-endpoint', { param: 'value' });
const data = await response.json();

// Custom POST request
const response = await apiService.post('/api/custom-endpoint', { data: 'value' });
const result = await response.json();
```

## Error Handling

All API methods throw errors when requests fail:

```typescript
try {
    const item = await apiClient.exampleApi.getById('123');
} catch (error) {
    console.error('API request failed:', error.message);
}
```

## Testing Tips

1. Use `beforeAll` to initialize the client once for all tests
2. Use descriptive test names
3. Test both success and error scenarios
4. Clean up test data after tests run
5. Use environment variables for test configuration

```typescript
describe('API Tests', () => {
    let apiClient: FophelpApiClient;
    let createdItemId: string;

    beforeAll(() => {
        apiClient = new FophelpApiClient();
    });

    afterAll(async () => {
        // Clean up test data
        if (createdItemId) {
            await apiClient.exampleApi.delete(createdItemId);
        }
    });

    it('should create and retrieve item', async () => {
        const created = await apiClient.exampleApi.create({ name: 'Test' });
        createdItemId = created.id;

        const retrieved = await apiClient.exampleApi.getById(created.id);
        expect(retrieved.id).toBe(created.id);
    });
});
```
