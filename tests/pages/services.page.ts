import { AppPage } from './page-holder';
import { Page, test } from '@playwright/test';

export class ServicesPage extends AppPage {
    public pagePath = '/en/dashboard/services';

    private serviceRow = this.page.getByTestId('service-row');
    private submitServiceButton = this.page.getByTestId('submit-service');
    private searchInput = this.page.getByTestId('search-services');
    
    // Service details modal/form
    private dateOfServiceInput = this.page.locator('input[name="dateOfService"]');
    private serviceDetailsInput = this.page.locator('textarea[name="serviceDetails"]');
    private statusSelect = this.page.locator('select[name="status"]');
    private saveButton = this.page.getByTestId('save-service');
    private successMessage = this.page.getByTestId('success-message');

    constructor(page: Page) {
        super(page);
    }

    async expectLoaded(message?: string) {
        await test.step('Expect Services Page loaded', async () => {
            await this.page.waitForURL(/.*services/, { timeout: 10000 });
        });
    }

    async searchService(orderId: string) {
        await test.step(`Search for service by order: ${orderId}`, async () => {
            await this.searchInput.fill(orderId);
            await this.page.waitForTimeout(500);
        });
    }

    async openServiceDetails(orderId: string) {
        await test.step(`Open service details for order: ${orderId}`, async () => {
            const serviceRow = this.serviceRow.filter({ hasText: orderId }).first();
            await serviceRow.click();
        });
    }

    async updateServiceDate(date: string) {
        await test.step(`Update service date to: ${date}`, async () => {
            await this.dateOfServiceInput.clear();
            await this.dateOfServiceInput.fill(date);
        });
    }

    async updateServiceDetails(details: string) {
        await test.step(`Update service details`, async () => {
            await this.serviceDetailsInput.clear();
            await this.serviceDetailsInput.fill(details);
        });
    }

    async updateServiceStatus(status: 'PENDING' | 'APPROVED' | 'REJECTED') {
        await test.step(`Update service status to: ${status}`, async () => {
            await this.statusSelect.selectOption(status);
        });
    }

    async submitService() {
        await test.step('Submit service', async () => {
            await this.submitServiceButton.click();
        });
    }

    async saveService() {
        await test.step('Save service', async () => {
            await this.saveButton.click();
        });
    }

    async expectSuccessMessage() {
        await test.step('Expect success message to be visible', async () => {
            await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
        });
    }

    async expectServiceStatus(orderId: string, status: string) {
        await test.step(`Expect service status for ${orderId} to be: ${status}`, async () => {
            const serviceRow = this.serviceRow.filter({ hasText: orderId }).first();
            await serviceRow.locator(`text=${status}`).waitFor({ state: 'visible', timeout: 5000 });
        });
    }
}
