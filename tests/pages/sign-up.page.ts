import { AppPage } from './page-holder';
import { Page, test } from '@playwright/test';

export class SignUpPage extends AppPage {
    public pagePath = '/en/signup';

    private nameInput = this.page.locator('input[name="name"]');
    private emailInput = this.page.locator('input[name="email"]');
    private passwordInput = this.page.locator('input[name="password"]');
    private submitButton = this.page.locator('button[type="submit"]');
    private successMessage = this.page.getByTestId('success-message');
    private errorMessage = this.page.getByTestId('error-message');

    constructor(page: Page) {
        super(page);
    }

    async expectLoaded(message?: string) {
        await test.step('Expect Sign Up Page loaded', async () => {
            await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
            await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
        });
    }

    async signUp(name: string, email: string, password: string) {
        await test.step(`Sign up with email: ${email}`, async () => {
            await this.nameInput.fill(name);
            await this.emailInput.fill(email);
            await this.passwordInput.fill(password);
            await this.submitButton.click();
        });
    }

    async expectSuccessMessage() {
        await test.step('Expect success message to be visible', async () => {
            await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
        });
    }

    async expectErrorMessage() {
        await test.step('Expect error message to be visible', async () => {
            await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
        });
    }
}
