# Fophelp API Testing Project

This project is designed for testing the API at https://new.fophelp.pro with TypeScript and Vitest.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your actual credentials:
     - `X_ACCESS_TOKEN`: Your JWT access token
     - `X_REFRESH_TOKEN`: Your refresh token
     - `X_USERNAME`: Your username (URL encoded)
     - `X_REFRESH_EXPIRES`: Token expiration date
     - `SESSION_USER`: Session user identifier

## Project Structure

- `src/apis/fophelp-api/` - API endpoint implementations
- `src/models/fophelp-api/` - DTOs and data models
- `src/services/` - Core services (API client, configuration)
- `tests/` - Test files

## Authentication

The project uses cookie-based authentication with **automatic token refresh**.

### How It Works

- Tokens are stored in memory via `TokenStorage`
- When the access token expires (after 1 hour), the system automatically:
  1. Detects expiration (401/403 or `Token-Expired` header)
  2. Calls `GET /api/react/authenticate/refresh`
  3. Updates tokens from response `Set-Cookie` headers
  4. Retries the original request with new tokens

### Usage

```typescript
import { FophelpApiClient } from './src/helpers/fophelp-client';

const apiClient = new FophelpApiClient();
// Token refresh happens automatically!
const data = await apiClient.exampleApi.getAll();
```

**See [TOKEN_REFRESH.md](TOKEN_REFRESH.md) for detailed documentation.**

## Running Tests

```bash
npm test
```

## Adding New Endpoints

1. Create a DTO in `src/models/fophelp-api/`
2. Create an API class in `src/apis/fophelp-api/`
3. Add tests in `tests/`

---

Playwright MCP
 🎭 Using project "" as a primary project
 📝 specs/README.md - directory for test plans
 🌱 seed.spec.ts - default environment seed file
 🤖 .github/agents/playwright-test-generator.agent.md - agent definition
 🤖 .github/agents/playwright-test-healer.agent.md - agent definition
 🤖 .github/agents/playwright-test-planner.agent.md - agent definition
 🔧 .vscode/mcp.json - mcp configuration
 🔧 .github/workflows/copilot-setup-steps.yml - GitHub Copilot setup steps


 🔧 TODO: GitHub > Settings > Copilot > Coding agent > MCP configuration
------------------------------------------------------------------
{
  "mcpServers": {
    "playwright-test": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "playwright",
        "run-test-mcp-server"
      ],
      "tools": [
        "*"
      ]
    }
  }
}
------------------------------------------------------------------
 ✅ Done.