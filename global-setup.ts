import { chromium, expect, FullConfig } from '@playwright/test';

const users = [
  {
    role: 'user',
    email: 'test-1@lawhub.pl',
    password: 'Qazwsx12@',
    name: 'User'
  },
  {
    role: 'employee',
    email: 'test-2@lawhub.pl',
    password: 'Qazwsx12@',
    name: 'Employee'
  },
  {
    role: 'admin',
    email: 'test-3@lawhub.pl',
    password: 'Qazwsx12@',
    name: 'Admin'
  }
];

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
  const browser = await chromium.launch();

  console.log('🔐 Starting authentication setup for all user roles...');

  for (const user of users) {
    console.log(`\n📝 Logging in as ${user.role} (${user.email})...`);

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Navigate to login page
      await page.goto(`${baseURL}/signin`);
      
      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Fill in login credentials
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);

      // Click the submit button
      await page.click('button[type="submit"]');

      await expect(await page.getByTestId("dashboard-link")).toBeAttached();  

      // Save the authentication state
      await context.storageState({ path: `.auth/${user.role}.json` });

      console.log(`✅ Successfully authenticated as ${user.role} - saved to .auth/${user.role}.json`);
    } catch (error) {
      console.error(`❌ Failed to authenticate as ${user.role}:`, error);
      throw error;
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('\n🎉 Authentication setup completed for all roles!');
}

export default globalSetup;
