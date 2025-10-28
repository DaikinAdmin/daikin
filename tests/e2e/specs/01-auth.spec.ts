import { test, expect } from '../../fixtures/fixture';
import { test as baseTest } from '@playwright/test';

baseTest.describe('Authentication Tests', () => {
    let testEmail: string;

    baseTest.beforeEach(() => {
        // Generate unique email for each test
        testEmail = `test-${Date.now()}@lawhub.pl`;
    });

    baseTest('User can create a new account @auth @signup', async ({ page }) => {
        const signUpPage = page;
        
        await signUpPage.goto('/en/signup');
        
        // Fill in signup form
        await signUpPage.fill('input[name="name"]', 'Test User');
        await signUpPage.fill('input[name="email"]', testEmail);
        await signUpPage.fill('input[name="password"]', 'Qazwsx12@');
        
        // Submit the form
        await signUpPage.click('button[type="submit"]');
        
        // Wait for success or redirect
        await signUpPage.waitForTimeout(2000);
        
        // Verify user is created (check for success message or redirect)
        const currentUrl = signUpPage.url();
        expect(currentUrl).toContain('signin');
    });

    baseTest('User can login with valid credentials @auth @signin', async ({ page }) => {
        const signInPage = page;
        
        await signInPage.goto('/en/signin');
        
        // Fill in login form
        await signInPage.fill('input[name="email"]', 'test-1@lawhub.pl');
        await signInPage.fill('input[name="password"]', 'Qazwsx12@');
        
        // Submit the form
        await signInPage.click('button[type="submit"]');
        
        // Wait for redirect to dashboard
        await signInPage.waitForURL('**/dashboard', { timeout: 10000 });
        
        // Verify we're on dashboard
        expect(signInPage.url()).toContain('dashboard');
    });

    baseTest('User cannot login with invalid credentials @auth @signin', async ({ page }) => {
        const signInPage = page;
        
        await signInPage.goto('/en/signin');
        
        // Fill in login form with wrong password
        await signInPage.fill('input[name="email"]', 'test-1@lawhub.pl');
        await signInPage.fill('input[name="password"]', 'WrongPassword123');
        
        // Submit the form
        await signInPage.click('button[type="submit"]');
        
        // Wait a bit
        await signInPage.waitForTimeout(2000);
        
        // Verify we're still on signin page
        expect(signInPage.url()).toContain('signin');
    });
});
