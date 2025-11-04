import { test as base, Page } from '@playwright/test';
import { Application } from '../pages/app';

interface TestOptions {
    userEmail: { email: string };
    employeeEmail: { email: string };
    adminEmail: { email: string };
    userPage: Page;
    employeePage: Page;
    adminPage: Page;
    user: Application;
    employee: Application;
    admin: Application;
}

export const test = base.extend<TestOptions>({
    userPage: async ({ browser, baseURL }, use) => {
        const context = await browser.newContext({ storageState: '.auth/user.json' });
        const page = await context.newPage();
        await page.goto(baseURL!);
        await use(page);
        await context.close();
    },

    employeePage: async ({ browser, baseURL }, use) => {
        const context = await browser.newContext({ storageState: '.auth/employee.json' });
        const page = await context.newPage();
        await page.goto(baseURL!);
        await use(page);
        await context.close();
    },

    adminPage: async ({ browser, baseURL }, use) => {
        const context = await browser.newContext({ storageState: '.auth/admin.json' });
        const page = await context.newPage();
        await page.goto(baseURL!);
        await use(page);
        await context.close();
    },

    userEmail: ({ }, use) => {
        use({ email: 'test-01@lawhub.pl' });
    },

    employeeEmail: ({ }, use) => {
        use({ email: 'test-02@lawhub.pl' });
    },

    adminEmail: ({ }, use) => {
        use({ email: 'test-03@lawhub.pl' });
    },

    user: async ({ userPage }, use) => {
        const app = new Application(userPage);
        await use(app);
    },

    employee: async ({ employeePage }, use) => {
        const app = new Application(employeePage);
        await use(app);
    },

    admin: async ({ adminPage }, use) => {
        const app = new Application(adminPage);
        await use(app);
    }
});
