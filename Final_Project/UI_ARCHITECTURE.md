# UI Testing Framework Architecture

## Framework Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Test Execution Layer                     │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              example.spec.ts (Tests)                  │  │
│  │  • Authenticated User Tests                          │  │
│  │  • Cookie Verification Tests                         │  │
│  │  • Navigation Tests                                   │  │
│  └──────────────────────┬───────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ uses
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Fixture Layer                             │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         fophelp.fixture.ts (Authentication)          │  │
│  │                                                       │  │
│  │  1. Login with EMAIL/PASSWORD                        │  │
│  │  2. Capture response cookies                         │  │
│  │  3. Parse set-cookie headers                         │  │
│  │  4. Add cookies to context                           │  │
│  │  5. Provide authenticatedContext                     │  │
│  └──────────────────────┬───────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ provides context to
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Page Object Layer                         │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  BasePage    │  │  LoginPage   │  │  HomePage    │     │
│  │              │  │              │  │              │     │
│  │ • goto()     │  │ • login()    │  │ • goto()     │     │
│  │ • click()    │  │ • fillEmail()│  │ • header     │     │
│  │ • fill()     │  │ • fillPwd()  │  │ • isLogged() │     │
│  │ • wait()     │  │ • hasError() │  │ • getTitle() │     │
│  └──────────────┘  └──────────────┘  └──────┬───────┘     │
│         ▲                   ▲                 │             │
│         │                   │                 │             │
│         └───────────────────┘─────────────────┘             │
│                   extends                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ uses
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Component Object Layer                      │
│                                                               │
│  ┌──────────────┐  ┌──────────────────────────────────┐    │
│  │BaseComponent │  │    HeaderComponent               │    │
│  │              │  │                                   │    │
│  │ • isVisible()│  │ • getUserName()                  │    │
│  │ • locator()  │  │ • logout()                       │    │
│  │ • click()    │  │ • clickLogo()                    │    │
│  │ • getText()  │  │ • goToProfile()                  │    │
│  └──────────────┘  │ • getNavigationItems()           │    │
│         ▲          └──────────────────────────────────┘    │
│         │                         │                         │
│         └─────────────────────────┘                         │
│                   extends                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ interacts with
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Browser/Playwright                         │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Browser Context (with cookies)           │  │
│  │                                                       │  │
│  │  Cookies:                                            │  │
│  │  • X-Access-Token                                    │  │
│  │  • X-Username                                        │  │
│  │  • X-Refresh-Token                                   │  │
│  │  • Session-User                                      │  │
│  │  • X-Refresh-Expires                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐
│  Test    │
│  Starts  │
└────┬─────┘
     │
     ▼
┌─────────────────────────────────┐
│ Request authenticatedContext    │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Fixture: Create Browser Context │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Fixture: Navigate to Login Page │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Fixture: Fill EMAIL & PASSWORD  │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Fixture: Click Login Button     │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Server: Process Login Request   │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ Server: Return Response with Cookies    │
│                                          │
│ set-cookie: X-Access-Token=<jwt>         │
│ set-cookie: X-Username=<username>        │
│ set-cookie: X-Refresh-Token=<uuid>       │
│ set-cookie: Session-User=<username>      │
│ set-cookie: X-Refresh-Expires=<date>     │
└────┬────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Fixture: Intercept Response     │
│ Extract set-cookie Headers      │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Fixture: Parse Cookie Values    │
│ • name, value                   │
│ • expires, path, domain         │
│ • httpOnly, secure, sameSite    │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Fixture: Add Cookies to Context │
│ context.addCookies(cookies)     │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Fixture: Return                 │
│ { context, cookies }            │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Test: Receives Authenticated    │
│ Context with Valid Cookies      │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Test: Create Page from Context  │
│ All requests include cookies    │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Test: Execute Test Logic        │
│ • Navigate pages                │
│ • Interact with elements        │
│ • Verify expectations           │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Test: Close Page                │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Fixture: Cleanup Context        │
└────┬────────────────────────────┘
     │
     ▼
┌──────────┐
│   Done   │
└──────────┘
```

## Component Composition

```
┌──────────────────────────────────────────┐
│            HomePage                      │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │       HeaderComponent              │ │
│  │                                    │ │
│  │  ┌──────┐  ┌──────┐  ┌────────┐  │ │
│  │  │ Logo │  │ Nav  │  │  User  │  │ │
│  │  │      │  │ Items│  │  Menu  │  │ │
│  │  └──────┘  └──────┘  └────────┘  │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │        Page Content                │ │
│  │                                    │ │
│  │  • Welcome Message                 │ │
│  │  • Dashboard Widgets               │ │
│  │  • User Information                │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

## Test Execution Flow

```
Start Tests
    │
    ├─── API Tests (API_USERNAME/API_PASSWORD)
    │     │
    │     ├── Test 1
    │     ├── Test 2
    │     └── Test N
    │
    └─── UI Tests (EMAIL/PASSWORD)
          │
          ├── Chromium
          │    ├── Login & Get Cookies
          │    ├── Test 1 (authenticated)
          │    ├── Test 2 (authenticated)
          │    └── Test N (authenticated)
          │
          ├── Firefox
          │    ├── Login & Get Cookies
          │    ├── Test 1 (authenticated)
          │    └── ...
          │
          └── WebKit
               ├── Login & Get Cookies
               ├── Test 1 (authenticated)
               └── ...

    (All run in parallel)
```

## Directory Structure

```
Final_Project/
│
├── src/
│   ├── ui/                     # UI testing framework
│   │   │
│   │   ├── pages/              # Page Object Models
│   │   │   ├── BasePage.ts
│   │   │   ├── LoginPage.ts
│   │   │   ├── HomePage.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── components/         # UI Components
│   │   │   ├── BaseComponent.ts
│   │   │   ├── HeaderComponent.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── fixtures/           # Test Fixtures
│   │   │   └── fophelp.fixture.ts
│   │   │
│   │   └── README.md          # Documentation
│   │
│   └── apis/                   # API clients (not shown)
│
├── tests/
│   ├── ui/                     # UI test files
│   │   └── *.spec.ts          # Test files
│   └── api/                    # API tests (not shown)
│
├── playwright.config.ts       # Playwright Configuration
├── package.json              # NPM Scripts & Dependencies
└── .env                      # Environment Variables
```

## Benefits of This Architecture

✅ **Maintainability**: Changes to UI only require updates to page objects
✅ **Reusability**: Components and base classes reduce code duplication
✅ **Readability**: Tests read like plain English
✅ **Scalability**: Easy to add new pages, components, and tests
✅ **Testability**: Fixtures handle complex setup logic
✅ **Parallel Execution**: Tests can run simultaneously
✅ **Separation**: API and UI tests use different credentials
