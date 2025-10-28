# Data-TestId Checklist for Application

This checklist tracks the `data-testid` attributes that need to be added to the application components for E2E tests to work properly.

## 🎯 Purpose
The tests rely on `data-testid` attributes to locate elements reliably. This approach is more stable than CSS selectors or text content, which may change frequently.

## 📋 Checklist

### ✅ Common Components

#### Sidebar Navigation
- [ ] `data-testid="sidebar"` - Main sidebar container
- [ ] `data-testid="sidebar-menu-item"` - Each menu item in sidebar

#### Messages
- [ ] `data-testid="success-message"` - Success notification/toast
- [ ] `data-testid="error-message"` - Error notification/toast

---

### ✅ Dashboard Page (`/dashboard`)

#### Main Dashboard
- [ ] `data-testid="dashboard-title"` - Dashboard page title
- [ ] `data-testid="user-name"` - Displayed user name

---

### ✅ Profile Page (`/dashboard/profile`)

#### Form Elements
- [ ] `name="phoneNumber"` - Phone number input
- [ ] `name="street"` - Street input
- [ ] `name="apartmentNumber"` - Apartment number input
- [ ] `name="city"` - City input
- [ ] `name="postalCode"` - Postal code input
- [ ] `name="dateOfBirth"` - Date of birth input

#### Actions
- [ ] `data-testid="save-profile"` - Save profile button

---

### ✅ Users Management Page (`/dashboard/users`)

#### Search & List
- [ ] `data-testid="search-users"` - Search input for users
- [ ] `data-testid="user-row"` - Each user row in the table/list

#### User Actions
- [ ] `data-testid="edit-user"` - Edit user button (in each row)

#### User Edit Form
- [ ] `name="phoneNumber"` - Phone number input
- [ ] `name="street"` - Street input
- [ ] `name="apartmentNumber"` - Apartment number input
- [ ] `name="city"` - City input
- [ ] `name="postalCode"` - Postal code input
- [ ] `name="daikinCoins"` - Daikin coins input

#### Actions
- [ ] `data-testid="save-user"` - Save user button

---

### ✅ Orders Page (`/dashboard/orders`)

#### Search & List
- [ ] `data-testid="create-order"` - Create new order button
- [ ] `data-testid="search-orders"` - Search input for orders
- [ ] `data-testid="order-row"` - Each order row in the table/list

#### Order Actions
- [ ] `data-testid="edit-order"` - Edit order button (in each row)

#### Order Form
- [ ] `name="orderId"` - Order ID input
- [ ] `name="customerEmail"` - Customer email input
- [ ] `name="dateOfPurchase"` - Date of purchase input
- [ ] `name="nextDateOfService"` - Next service date input
- [ ] `name="totalPrice"` - Total price input

#### Product Management
- [ ] `data-testid="add-product"` - Add product button
- [ ] `data-testid="product-item"` - Each product container in the form
- [ ] `name="productId"` - Product ID input (within product-item)
- [ ] `name="productDescription"` - Product description input
- [ ] `name="price"` - Product price input
- [ ] `name="quantity"` - Product quantity input
- [ ] `name="warranty"` - Warranty input

#### Actions
- [ ] `data-testid="save-order"` - Save order button

---

### ✅ Services Page (`/dashboard/services`)

#### Search & List
- [ ] `data-testid="search-services"` - Search input for services
- [ ] `data-testid="service-row"` - Each service row (clickable)

#### Service Form
- [ ] `name="dateOfService"` - Service date input
- [ ] `name="serviceDetails"` - Service details textarea
- [ ] `name="status"` - Status select dropdown

#### Actions
- [ ] `data-testid="submit-service"` - Submit service button
- [ ] `data-testid="save-service"` - Save service button

---

### ✅ Benefits Page (`/dashboard/benefits`)

#### List & Cards
- [ ] `data-testid="create-benefit"` - Create benefit button
- [ ] `data-testid="benefit-card"` - Each benefit card

#### Benefit Form (Admin)
- [ ] `name="title"` - Benefit title input
- [ ] `name="description"` - Benefit description textarea
- [ ] `name="daikinCoins"` - Daikin coins required input
- [ ] `name="isActive"` - Active status checkbox

#### Actions
- [ ] `data-testid="save-benefit"` - Save benefit button
- [ ] `data-testid="redeem-benefit"` - Redeem benefit button (in each card)

---

### ✅ Benefits Redeemed Page (`/dashboard/benefits-redeemed`)

#### List
- [ ] `data-testid="redeemed-benefit"` - Each redeemed benefit item

---

### ✅ Authentication Pages

#### Sign Up Page (`/signup`)
- [ ] `name="name"` - Name input
- [ ] `name="email"` - Email input
- [ ] `name="password"` - Password input
- [ ] `button[type="submit"]` - Submit button (native HTML attribute)

#### Sign In Page (`/signin`)
- [ ] `name="email"` - Email input
- [ ] `name="password"` - Password input
- [ ] `button[type="submit"]` - Submit button (native HTML attribute)

---

## 📝 Implementation Guidelines

### How to Add data-testid

#### React/Next.js Component Example:

```tsx
// Button
<button data-testid="save-profile" onClick={handleSave}>
  Save Profile
</button>

// Input with name attribute
<input
  name="phoneNumber"
  type="tel"
  placeholder="Phone number"
  value={phoneNumber}
  onChange={handleChange}
/>

// Container/Card
<div data-testid="benefit-card" className="benefit-card">
  {/* benefit content */}
</div>

// List item
<tr data-testid="user-row" key={user.id}>
  {/* user data */}
</tr>
```

### Best Practices

1. **Use semantic names**: `data-testid="create-order"` not `data-testid="button1"`
2. **Be consistent**: Use kebab-case for all test ids
3. **Be specific**: `data-testid="save-profile"` not just `data-testid="save"`
4. **Avoid dynamic values**: Don't use `data-testid={`user-${id}`}`, use `data-testid="user-row"` and filter by content
5. **Document purpose**: Add comment explaining what the test id is for

### Component Pattern

```tsx
interface Props {
  testId?: string; // Optional, for flexibility
}

export function MyComponent({ testId = 'my-component' }: Props) {
  return (
    <div data-testid={testId}>
      {/* content */}
    </div>
  );
}
```

## 🔍 Finding Missing Test IDs

When tests fail due to missing `data-testid`, the error message will typically indicate:
1. The selector that failed: `[data-testid="..."]`
2. The test file and line number
3. The action that was attempted

### Example Error:
```
Error: locator.click: Timeout 10000ms exceeded.
=========================== logs ===========================
waiting for locator('[data-testid="save-profile"]')
```

This means you need to add `data-testid="save-profile"` to the save button on the profile page.

## ✅ Verification

After adding data-testid attributes, verify by:

1. **Run specific test**:
   ```bash
   npx playwright test tests/e2e/specs/02-user-profile.spec.ts
   ```

2. **Use Playwright Inspector**:
   ```bash
   npx playwright test --debug
   ```

3. **Use browser DevTools**:
   - Inspect element
   - Check for `data-testid` attribute
   - Verify value matches test expectations

## 📊 Progress Tracking

Track your progress by marking items as complete:
- [ ] Not started
- [x] Completed

### Current Status
- Total attributes needed: ~45
- Completed: 0
- Remaining: 45

## 🚀 Priority Order

Implement in this order for fastest test coverage:

1. **High Priority** (Core functionality):
   - [ ] Authentication pages (Sign Up, Sign In)
   - [ ] Common components (sidebar, messages)
   - [ ] Profile page

2. **Medium Priority** (Business features):
   - [ ] Orders page
   - [ ] Services page
   - [ ] Users page

3. **Low Priority** (Additional features):
   - [ ] Benefits page
   - [ ] Benefits redeemed page

---

## 💡 Tips

- Add all `data-testid` attributes in one PR/commit for easier review
- Use global search in your IDE to find components quickly
- Test each page after adding attributes
- Keep this checklist updated as you add attributes
- Consider adding a ESLint rule to enforce data-testid on interactive elements

## 📚 References

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library - data-testid](https://testing-library.com/docs/queries/bytestid/)
- [Accessibility and Test IDs](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change)
