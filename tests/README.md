# E2E Test Suite for Daikin Application

This test suite uses Playwright with TypeScript, following the Page Object Model (POM) pattern with fixtures and an Application class.

## 📁 Project Structure

```
tests/
├── pages/                          # Page Object Models
│   ├── page-holder.ts             # Base classes (PageHolder, Component, AppPage)
│   ├── app.ts                     # Application class (aggregates all pages)
│   ├── sign-up.page.ts            # Sign up page
│   ├── sign-in.page.ts            # Sign in page
│   ├── dashboard.page.ts          # Dashboard page
│   ├── profile.page.ts            # User profile page
│   ├── users.page.ts              # Users management page
│   ├── orders.page.ts             # Orders management page
│   ├── services.page.ts           # Services management page
│   ├── benefits.page.ts           # Benefits management page
│   └── components/
│       └── sidebar.component.ts   # Sidebar navigation component
├── fixtures/
│   └── fixture.ts                 # Test fixtures with role-based contexts
├── e2e/
│   └── specs/                     # Test specifications
│       ├── 01-auth.spec.ts        # Authentication tests
│       ├── 02-user-profile.spec.ts # User profile management
│       ├── 03-user-management.spec.ts # Admin/Employee user management
│       ├── 04-orders.spec.ts      # Order creation and management
│       ├── 05-services.spec.ts    # Service management
│       ├── 06-benefits.spec.ts    # Benefits creation and redemption
│       └── 07-complete-journey.spec.ts # End-to-end user journey
└── .auth/                         # Stored authentication states
    ├── USER.json
    ├── EMPLOYEE.json
    └── ADMIN.json
```

## 🎯 Test Coverage

### 1. Authentication Tests (`01-auth.spec.ts`)
- ✅ User registration
- ✅ User login with valid credentials
- ✅ User login with invalid credentials

### 2. User Profile Management (`02-user-profile.spec.ts`)
- ✅ User can update phone number and address
- ✅ User can update date of birth

### 3. User Management by Admin/Employee (`03-user-management.spec.ts`)
- ✅ Admin can update user information
- ✅ Admin can update Daikin coins
- ✅ Employee can update user phone number
- ✅ Employee can update user address

### 4. Order Management (`04-orders.spec.ts`)
- ✅ Employee can create a new order
- ✅ Employee can edit an existing order
- ✅ Admin can edit orders
- ✅ User can find their orders

### 5. Service Management (`05-services.spec.ts`)
- ✅ Employee can change service date
- ✅ Admin can change service date and status
- ✅ Employee can submit a service
- ✅ Admin can approve service submission

### 6. Benefits Management (`06-benefits.spec.ts`)
- ✅ Admin can create new benefits
- ✅ Admin can create multiple benefits with different coin values
- ✅ User can view available benefits
- ✅ User can redeem benefits
- ✅ User can view redeemed benefits

### 7. Complete User Journey (`07-complete-journey.spec.ts`)
- ✅ End-to-end workflow covering all features

## 🚀 Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run specific test file
```bash
npx playwright test tests/e2e/specs/01-auth.spec.ts
```

### Run tests with specific tags
```bash
# Run only authentication tests
npx playwright test --grep @auth

# Run only admin tests
npx playwright test --grep @admin

# Run smoke tests
npx playwright test --grep @smoke
```

### Run with UI mode
```bash
npx playwright test --ui
```

### Run with headed browser
```bash
npx playwright test --headed
```

### Debug tests
```bash
npx playwright test --debug
```

## 🏷️ Test Tags

Tests are organized with tags for easy filtering:

- `@auth` - Authentication tests
- `@signup` - Sign up tests
- `@signin` - Sign in tests
- `@profile` - Profile management tests
- `@users` - User management tests
- `@orders` - Order management tests
- `@services` - Service management tests
- `@benefits` - Benefits tests
- `@user` - Tests run as USER role
- `@employee` - Tests run as EMPLOYEE role
- `@admin` - Tests run as ADMIN role
- `@e2e` - End-to-end tests
- `@smoke` - Smoke tests (critical paths)

## 👥 Test Users

The tests use pre-configured users with different roles:

| Role | Email | Password | Daikin Coins |
|------|-------|----------|--------------|
| USER | test-1@lawhub.pl | Qazwsx12@ | 100 |
| EMPLOYEE | test-2@lawhub.pl | Qazwsx12@ | 50 |
| ADMIN | test-3@lawhub.pl | Qazwsx12@ | 1000 |

## 🔧 Configuration

### Playwright Configuration
- Base URL: `http://localhost:3000`
- Browser: Chrome (Desktop)
- Viewport: 1920x1080
- Trace: On for debugging
- Screenshot: On failure
- Video: Retained on failure

### Authentication
- Global setup runs before tests to authenticate all roles
- Authentication states are saved to `.auth/{ROLE}.json`
- Tests use stored states via fixtures (no re-authentication needed)

## 📝 Writing New Tests

### Example using Page Object Model:

```typescript
import { test, expect } from '../../fixtures/fixture';

test.describe('My Feature Tests', () => {
    test('User can do something @myfeature @user', async ({ user }) => {
        // Navigate to page
        await user.somePage.open();
        
        // Interact with page
        await user.somePage.fillForm('data');
        await user.somePage.submit();
        
        // Verify result
        await user.somePage.expectSuccess();
    });
});
```

### Using different roles:

```typescript
test('Admin can do admin things @admin', async ({ admin }) => {
    await admin.adminPage.open();
    // ... admin actions
});

test('Employee can do employee things @employee', async ({ employee }) => {
    await employee.employeePage.open();
    // ... employee actions
});
```

## 🔍 Page Object Model Pattern

### Base Classes

1. **PageHolder**: Base class with helper methods
2. **Component**: For reusable UI components
3. **AppPage**: For full pages with navigation

### Example Page Object:

```typescript
export class MyPage extends AppPage {
    public pagePath = '/en/my-page';
    
    private myInput = this.page.locator('input[name="myInput"]');
    private submitButton = this.page.locator('button[type="submit"]');
    
    async expectLoaded() {
        await test.step('Expect My Page loaded', async () => {
            await this.myInput.waitFor({ state: 'visible' });
        });
    }
    
    async fillAndSubmit(value: string) {
        await test.step(`Fill and submit: ${value}`, async () => {
            await this.myInput.fill(value);
            await this.submitButton.click();
        });
    }
}
```

## 🐛 Debugging

### View test results
```bash
npx playwright show-report
```

### Generate trace viewer
```bash
npx playwright show-trace path/to/trace.zip
```

### Take screenshot during test
```typescript
await user.page.screenshot({ path: 'screenshot.png' });
```

## ⚠️ Important Notes

1. **Data-testid attributes**: Tests rely on `data-testid` attributes. If elements don't have them, they need to be added to the application code.

2. **Database state**: Tests assume the database is seeded with test data. Run `npx prisma db seed` before running tests.

3. **Dev server**: The development server must be running (`npm run dev`) for tests to work, or configure `webServer` in `playwright.config.ts`.

4. **Test isolation**: Each test should be independent and not rely on the state from previous tests.

5. **Waiting strategies**: Tests use explicit waits and Playwright's auto-waiting features. Avoid arbitrary `waitForTimeout()` when possible.

## 📊 CI/CD Integration

Tests are configured to run in CI with:
- Retry on failure (1 retry)
- Parallel execution disabled
- Traces only on first retry
- Screenshots only on failure

## 🤝 Contributing

When adding new tests:
1. Follow the Page Object Model pattern
2. Use meaningful test descriptions
3. Add appropriate tags
4. Use test.step() for better reporting
5. Add comments for complex logic
6. Ensure tests are independent and can run in any order
