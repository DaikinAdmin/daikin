import { AppPage } from './page-holder';
import { Page, test } from '@playwright/test';

export class OrdersPage extends AppPage {
    public pagePath = '/en/dashboard/orders';

    private createOrderButton = this.page.getByTestId('create-order');
    private searchInput = this.page.getByTestId('search-orders');
    private orderRow = this.page.getByTestId('order-row');
    private editButton = this.page.getByTestId('edit-order');

    // Create/Edit Order Form
    private customerEmailInput = this.page.locator('input[name="customerEmail"]');
    private orderIdInput = this.page.locator('input[name="orderId"]');
    private dateOfPurchaseInput = this.page.locator('input[name="dateOfPurchase"]');
    private nextDateOfServiceInput = this.page.locator('input[name="nextDateOfService"]');
    private totalPriceInput = this.page.locator('input[name="totalPrice"]');
    
    // Product fields
    private addProductButton = this.page.getByTestId('add-product');
    private productIdInput = this.page.locator('input[name="productId"]');
    private productDescriptionInput = this.page.locator('input[name="productDescription"]');
    private productPriceInput = this.page.locator('input[name="price"]');
    private productQuantityInput = this.page.locator('input[name="quantity"]');
    private warrantyInput = this.page.locator('input[name="warranty"]');
    
    private saveButton = this.page.getByTestId('save-order');
    private successMessage = this.page.getByTestId('success-message');

    constructor(page: Page) {
        super(page);
    }

    async expectLoaded(message?: string) {
        await test.step('Expect Orders Page loaded', async () => {
            await this.createOrderButton.waitFor({ state: 'visible', timeout: 10000 });
        });
    }

    async clickCreateOrder() {
        await test.step('Click create order button', async () => {
            await this.createOrderButton.click();
        });
    }

    async fillOrderDetails(orderId: string, customerEmail: string, dateOfPurchase: string, totalPrice: string) {
        await test.step(`Fill order details: ${orderId}`, async () => {
            await this.orderIdInput.fill(orderId);
            await this.customerEmailInput.fill(customerEmail);
            await this.dateOfPurchaseInput.fill(dateOfPurchase);
            await this.totalPriceInput.fill(totalPrice);
        });
    }

    async addProduct(productId: string, description: string, price: string, quantity: string, warranty: string) {
        await test.step(`Add product: ${productId}`, async () => {
            await this.addProductButton.click();
            const lastProduct = this.page.getByTestId('product-item').last();
            await lastProduct.locator('input[name="productId"]').fill(productId);
            await lastProduct.locator('input[name="productDescription"]').fill(description);
            await lastProduct.locator('input[name="price"]').fill(price);
            await lastProduct.locator('input[name="quantity"]').fill(quantity);
            await lastProduct.locator('input[name="warranty"]').fill(warranty);
        });
    }

    async saveOrder() {
        await test.step('Save order', async () => {
            await this.saveButton.click();
        });
    }

    async searchOrder(orderId: string) {
        await test.step(`Search for order: ${orderId}`, async () => {
            await this.searchInput.fill(orderId);
            await this.page.waitForTimeout(500);
        });
    }

    async openOrderEdit(orderId: string) {
        await test.step(`Open edit for order: ${orderId}`, async () => {
            const orderRow = this.orderRow.filter({ hasText: orderId }).first();
            const editBtn = orderRow.getByTestId('edit-order');
            await editBtn.click();
        });
    }

    async updateNextServiceDate(date: string) {
        await test.step(`Update next service date to: ${date}`, async () => {
            await this.nextDateOfServiceInput.clear();
            await this.nextDateOfServiceInput.fill(date);
        });
    }

    async expectOrderVisible(orderId: string) {
        await test.step(`Expect order ${orderId} to be visible`, async () => {
            const orderRow = this.orderRow.filter({ hasText: orderId }).first();
            await orderRow.waitFor({ state: 'visible', timeout: 5000 });
        });
    }

    async expectSuccessMessage() {
        await test.step('Expect success message to be visible', async () => {
            await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
        });
    }
}
