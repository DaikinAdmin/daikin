import test, { chromium, expect, FullConfig } from '@playwright/test';
import path from 'path';

const users = [
    {
        role: 'USER',
        email: 'test-1@lawhub.pl',
        password: 'Qazwsx12@',
        name: 'User'
    },
    {
        role: 'EMPLOYEE',
        email: 'test-2@lawhub.pl',
        password: 'Qazwsx12@',
        name: 'Employee'
    },
    {
        role: 'ADMIN',
        email: 'test-3@lawhub.pl',
        password: 'Qazwsx12@',
        name: 'Admin'
    }
];

test.describe.skip('Global Authentication Setup', () => {
    for (const user of users) {
        console.log(`\n📝 Logging in as ${user.role} (${user.email})...`);
        test(`Login as ${user.role}`, async ({ browser, baseURL }) => {
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
                await page.context().storageState({ path: `.auth/${user.role}.json` });

                console.log(`✅ Successfully authenticated as ${user.role} - saved to .auth/${user.role}.json`);
            } catch (error) {
                console.error(`❌ Failed to authenticate as ${user.role}:`, error);
                throw error;
            }
            await context.close();
            await browser.close();
        });
    }
});