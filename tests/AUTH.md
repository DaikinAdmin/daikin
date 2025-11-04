# Authentication Setup for Playwright Tests

## Overview

The `global-setup.ts` file automatically logs in with all three user roles and saves their authentication state before running any tests.

## User Credentials

The following test users are authenticated:

1. **user Role**
   - Email: XX@XX.com
   - Password: XXXXXXXX
   - State saved to: `.auth/user.json`

2. **employee Role**
   - Email: XX@XX.com
   - Password: XXXXXXXX
   - State saved to: `.auth/employee.json`

3. **admin Role**
   - Email: XX@XX.com
   - Password: XXXXXXXX
   - State saved to: `.auth/admin.json`

## Usage in Tests

### Option 1: Use in Individual Tests

```typescript
import { test as base } from '@playwright/test';
import path from 'path';

// Extend base test with authentication
const test = base.extend({
  storageState: path.resolve(__dirname, '../.auth/user.json'),
});

test('user can access dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  // Test will run with user authentication
});
```

### Option 2: Create Separate Projects in playwright.config.ts

```typescript
projects: [
  {
    name: 'user-tests',
    use: {
      ...devices['Desktop Chrome'],
      storageState: '.auth/user.json',
    },
  },
  {
    name: 'employee-tests',
    use: {
      ...devices['Desktop Chrome'],
      storageState: '.auth/employee.json',
    },
  },
  {
    name: 'admin-tests',
    use: {
      ...devices['Desktop Chrome'],
      storageState: '.auth/admin.json',
    },
  },
],
```

### Option 3: Dynamic Role Selection in Test

```typescript
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Role-based tests', () => {
  ['user', 'employee', 'admin'].forEach((role) => {
    test(`${role} can access dashboard`, async ({ browser }) => {
      const context = await browser.newContext({
        storageState: path.resolve(__dirname, `../.auth/${role}.json`),
      });
      const page = await context.newPage();
      
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/.*dashboard/);
      
      await context.close();
    });
  });
});
```

## How It Works

1. Before any tests run, `global-setup.ts` is executed
2. It launches a browser and logs in with each user role
3. After successful login, it saves the cookies and storage state to `.auth/{ROLE}.json`
4. Tests can then use these stored states to skip the login process
5. This makes tests faster and more reliable

## Running Tests

The global setup runs automatically when you run tests:

```bash
# Run all tests (global setup runs first)
npx playwright test

# Run tests for a specific project
npx playwright test --project=user-tests

# Run with UI mode
npx playwright test --ui
```

## Troubleshooting

If authentication fails:

1. Make sure the development server is running (`npm run dev`)
2. Ensure the database is seeded (`npx prisma db seed`)
3. Check that the login page structure matches the selectors in `global-setup.ts`
4. Delete `.auth/*.json` files and let them regenerate

## Security Note

The `.auth` directory is gitignored to prevent committing sensitive authentication data.
