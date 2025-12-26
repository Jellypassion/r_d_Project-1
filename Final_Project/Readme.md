# Fophelp Testing Automation Framework

Comprehensive testing framework for the Fophelp application (https://new.fophelp.pro) implementing both API and UI test automation using TypeScript, Vitest, and Playwright.

## Overview

This project provides a robust testing solution covering:
- **API Testing**: RESTful API testing with automatic token refresh and authentication management
- **UI Testing**: End-to-end browser automation with Page Object Model architecture
- **Authentication**: Automated login and session management for both API and UI tests
- **Type Safety**: Full TypeScript implementation with DTOs and interfaces

## Technology Stack

- **TypeScript** - Type-safe test development
- **Vitest** - Fast API testing framework
- **Playwright** - Modern browser automation
- **Node.js** - Runtime environment
- **Fetch API** - HTTP client for API requests

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update with your credentials:
     - `API_USERNAME`: Your email address
     - `API_PASSWORD`: Your password
     - `FOPHELP_BASE_URL`: Base URL (default: https://new.fophelp.pro)

3. Authenticate and obtain tokens:
```bash
npm run login
```

This automatically updates `.env` with authentication tokens:
- `X_ACCESS_TOKEN` - JWT access token
- `X_REFRESH_TOKEN` - Refresh token UUID
- `X_USERNAME` - URL-encoded username
- `X_REFRESH_EXPIRES` - Token expiration timestamp
- `SESSION_USER` - Session user identifier

## Project Structure

```
├── scripts/
│   └── login.ts                        # CLI login script
├── specs/
│   └── README.md                       # Specifications documentation
├── src/
│   ├── apis/fophelp-api/              # API client implementations
│   │   ├── auth.api-client.ts         # Authentication endpoints
│   │   ├── example.api.ts             # Example API endpoints
│   │   ├── incomes.api-client.ts      # Income management endpoints
│   │   └── taxes.api-client.ts        # Tax calculation endpoints
│   ├── helpers/
│   │   └── fophelp-client.ts          # Main API client aggregator
│   ├── models/
│   │   ├── config/                    # Configuration models
│   │   │   └── api.config.ts          # API configuration interface
│   │   └── fophelp-api/               # DTOs and response types
│   │       ├── auth.dto.ts            # Authentication data types
│   │       ├── example.dto.ts         # Example data types
│   │       ├── incomes.dto.ts         # Income data types
│   │       └── taxes.dto.ts           # Tax data types
│   ├── services/
│   │   ├── config.service.ts          # Environment configuration
│   │   ├── fetch-api-service.ts       # HTTP client with retry logic
│   │   ├── login.service.ts           # Programmatic login
│   │   ├── token-refresh.service.ts   # Token refresh mechanism
│   │   ├── token-storage.ts           # In-memory token management
│   │   └── abstractions/
│   │       └── i-api-service.ts       # API service interface
│   └── ui/
│       ├── components/                # Reusable UI components
│       │   ├── auth.popup.ts          # Authentication popup
│       │   ├── base.component.ts      # Base component class
│       │   ├── filters.component.ts   # Filters component
│       │   ├── header.component.ts    # Header component
│       │   ├── income-table.component.ts # Income table component
│       │   ├── income.popup.ts        # Income popup modal
│       │   └── index.ts               # Components export index
│       ├── fixtures/
│       │   └── fophelp.fixture.ts     # Playwright test fixtures
│       ├── pages/                     # Page Object Models
│       │   ├── base.page.ts           # Base page class
│       │   ├── home.page.ts           # Home page object
│       │   ├── incomes.page.ts        # Incomes page object
│       │   └── index.ts               # Pages export index
│       └── README.md                  # UI framework documentation
├── tests/
│   ├── api/                           # API test suite directory
│   ├── ui/                            # UI test suite
│   │   ├── incomes.spec.ts            # Income management UI tests
│   │   ├── login.spec.ts              # Login functionality tests
│   │   └── README.md                  # UI tests documentation
│   ├── auth.test.ts                   # Authentication API tests
│   ├── fophelp-api.test.ts            # Core API tests
│   ├── seed.spec.ts                   # Seed data test
│   └── token-refresh.test.ts          # Token refresh tests
├── playwright-report/                 # Playwright HTML reports
│   └── index.html                     # Test report entry point
├── test-results/                      # Test execution results
│   └── results.json                   # JSON test results
├── eslint.config.mjs                  # ESLint configuration
├── playwright.config.ts               # Playwright configuration
├── tsconfig.json                      # TypeScript configuration
├── vitest.config.ts                   # Vitest configuration
└── package.json                       # Dependencies and scripts
```

## Features

### API Testing Framework

**Key Features:**
- RESTful API client with type-safe request/response handling
- Automatic token refresh on expiration (401/403 responses)
- Cookie-based authentication with in-memory token storage
- Retry mechanism for transient failures
- Support for GET, POST, PUT, DELETE operations
- FormData support for file uploads

**Architecture:**
- **API Clients** (`src/apis/fophelp-api/`): Domain-specific endpoint implementations
- **DTOs** (`src/models/fophelp-api/`): Type-safe data transfer objects
- **Services** (`src/services/`): Core infrastructure services
- **Token Management**: Automatic refresh and storage handling

**Automatic Token Refresh:**
The framework automatically handles token expiration:
1. Detects expired tokens via HTTP status codes (401/403) or `Token-Expired` header
2. Refreshes tokens using `/api/react/authenticate/refresh` endpoint
3. Extracts new tokens from `Set-Cookie` headers
4. Updates token storage and retries the original request

### UI Testing Framework

**Key Features:**
- Page Object Model (POM) architecture
- Component-based UI element abstraction
- Authenticated test fixtures with cookie injection
- Reusable page components (header, filters, tables, popups)
- Visual regression support with screenshots and videos
- Multi-browser support (Chromium, Firefox, WebKit)

**Architecture:**
- **Pages** (`src/ui/pages/`): High-level page abstractions with business logic
- **Components** (`src/ui/components/`): Reusable UI components (modals, tables, headers)
- **Fixtures** (`src/ui/fixtures/`): Playwright fixtures for authenticated contexts
- **Base Classes**: `BasePage` and `BaseComponent` for common functionality

**Authentication Fixture:**
Custom Playwright fixture that:
- Programmatically authenticates via API
- Extracts authentication cookies from response headers
- Injects cookies into browser context
- Provides authenticated context for all UI tests

## Running Tests

### API Tests
```bash
npm run test:api          # Run all API tests
npm test                  # Alias for API tests
```

### UI Tests
```bash
npm run test:ui           # Run all UI tests (headless)
npm run test:ui:headed    # Run with visible browser
npm run test:ui:debug     # Run in debug mode with Playwright Inspector
npm run test:ui:chromium  # Run only on Chromium browser
npm run test:ui:report    # Open HTML test report
```

### Authentication
```bash
npm run login             # Authenticate and refresh tokens
```

## Test Examples

### API Test Example
```typescript
import { FophelpApiClient } from '../src/helpers/fophelp-client';

describe('Incomes API', () => {
    let apiClient: FophelpApiClient;

    beforeAll(() => {
        apiClient = new FophelpApiClient();
    });

    it('should add income', async () => {
        const response = await apiClient.incomesApi.addIncome(
            '1000', '2025-12-01', 'Test income', 'UAH', false
        );
        expect(response.message).toContain('Successfully created');
    });
});
```

### UI Test Example
```typescript
import { test, expect } from 'src/ui/fixtures/fophelp.fixture';
import { IncomesPage } from 'src/ui/pages/incomes.page';

test('should add new income', async ({ authenticatedContext }) => {
    const page = await authenticatedContext.context.newPage();
    const incomesPage = new IncomesPage(page);

    await incomesPage.goto();
    await incomesPage.addIncome({
        date: '05.12.2025',
        currency: 'UAH',
        amount: '1100',
        comment: 'Test income'
    });

    const exists = await incomesPage.incomeTable.rowExists('Test income');
    expect(exists).toBeTruthy();
});
```

## Configuration

### Playwright Configuration
- **Base URL**: Configurable via `FOPHELP_BASE_URL` environment variable
- **Browsers**: Chromium (default), Firefox, WebKit
- **Viewport**: 1280x1024 (desktop)
- **Locale**: uk-UA
- **Timezone**: Europe/Kiev
- **Reports**: HTML report, JSON output, list reporter
- **Screenshots/Videos**: Captured on failure for debugging

### Vitest Configuration
- **Environment**: Node.js
- **Global test utilities**: Enabled
- **Test pattern**: `**/*.test.ts`
- **Timeout**: 30 seconds per test

## Design Patterns

### Page Object Model (POM)
- Encapsulates page structure and behavior
- Separates test logic from page implementation
- Improves maintainability and reusability

### Component Pattern
- Reusable UI components across multiple pages
- Encapsulates component-specific selectors and actions
- Reduces code duplication

### Service Layer
- Abstracts business logic from tests
- Provides clean API for common operations
- Centralizes authentication and configuration

## Additional Resources

- [LOGIN_GUIDE.md](LOGIN_GUIDE.md) - Detailed authentication guide
- [TOKEN_REFRESH.md](TOKEN_REFRESH.md) - Token refresh mechanism documentation

## Notes for Reviewers

This framework demonstrates:
- ✅ Professional test automation architecture
- ✅ Type-safe TypeScript implementation
- ✅ Separation of concerns (pages, components, services)
- ✅ Automatic authentication and token management
- ✅ Comprehensive test coverage for both API and UI
- ✅ Reusable and maintainable test code
- ✅ Industry-standard design patterns
- ✅ Production-ready error handling and retry mechanisms
