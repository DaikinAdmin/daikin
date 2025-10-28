import { AppPage } from './page-holder';
import { Page, test } from '@playwright/test';

export class SignInPage extends AppPage {
    public pagePath = '/en/signin';

    private emailInput = this.page.locator('input[name="email"]');
    private passwordInput = this.page.locator('input[name="password"]');
    private submitButton = this.page.locator('button[type="submit"]');
    private errorMessage = this.page.getByTestId('error-message');

    constructor(page: Page) {
        super(page);
    }

    async expectLoaded(message?: string) {
        await test.step('Expect Sign In Page loaded', async () => {
            await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
            await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
        });
    }

    async signIn(email: string, password: string) {
        await test.step(`Sign in with email: ${email}`, async () => {
            await this.emailInput.fill(email);
            await this.passwordInput.fill(password);
            await this.submitButton.click();
        });
    }

    async expectErrorMessage() {
        await test.step('Expect error message to be visible', async () => {
            await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
        });
    }
}
