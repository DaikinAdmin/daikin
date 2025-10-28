import { Component } from '../page-holder';
import { Page, test } from '@playwright/test';

export class SidebarComponent extends Component {
    private sidebar = this.page.getByTestId('sidebar');
    private menuItems = this.page.getByTestId('sidebar-menu-item');

    constructor(page: Page) {
        super(page);
    }

    async expectLoaded(message?: string) {
        await test.step('Expect Sidebar Component loaded', async () => {
            await this.sidebar.waitFor({ state: 'visible', timeout: 10000 });
        });
    }

    async selectMenuItem(itemName: string) {
        await test.step(`Select sidebar menu item: ${itemName}`, async () => {
            const menuItem = this.menuItems.filter({ hasText: itemName }).first();
            await menuItem.click();
        });
    }

    async expectMenuItemVisible(itemName: string) {
        await test.step(`Expect menu item ${itemName} to be visible`, async () => {
            const menuItem = this.menuItems.filter({ hasText: itemName }).first();
            await menuItem.waitFor({ state: 'visible', timeout: 5000 });
        });
    }
}
