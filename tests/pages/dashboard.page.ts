import { AppPage } from './page-holder';
import { Page, test } from '@playwright/test';

export class DashboardPage extends AppPage {
    public pagePath = '/en/dashboard';

    private dashboardTitle = this.page.getByTestId('dashboard-title');
    private userName = this.page.getByTestId('user-name');

    constructor(page: Page) {
        super(page);
    }

    async expectLoaded(message?: string) {
        await test.step('Expect Dashboard Page loaded', async () => {
            await this.page.waitForURL(/.*dashboard/, { timeout: 10000 });
        });
    }

    async expectUserName(name: string) {
        await test.step(`Expect user name to be: ${name}`, async () => {
            await this.userName.waitFor({ state: 'visible', timeout: 5000 });
        });
    }
}
