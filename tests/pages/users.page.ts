import { AppPage } from './page-holder';
import { Page, test } from '@playwright/test';

export class UsersPage extends AppPage {
    public pagePath = '/en/dashboard/users';

    private searchInput = this.page.getByTestId('search-users');
    private userRow = this.page.getByTestId('user-row');
    private editButton = this.page.getByTestId('edit-user');

    // User edit modal/form
    private phoneNumberInput = this.page.locator('input[name="phoneNumber"]');
    private streetInput = this.page.locator('input[name="street"]');
    private apartmentNumberInput = this.page.locator('input[name="apartmentNumber"]');
    private cityInput = this.page.locator('input[name="city"]');
    private postalCodeInput = this.page.locator('input[name="postalCode"]');
    private daikinCoinsInput = this.page.locator('input[name="daikinCoins"]');
    private saveButton = this.page.getByTestId('save-user');
    private successMessage = this.page.getByTestId('success-message');

    constructor(page: Page) {
        super(page);
    }

    async expectLoaded(message?: string) {
        await test.step('Expect Users Page loaded', async () => {
            await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
        });
    }

    async searchUser(email: string) {
        await test.step(`Search for user: ${email}`, async () => {
            await this.searchInput.fill(email);
            await this.page.waitForTimeout(500); // Wait for search debounce
        });
    }

    async openUserEdit(email: string) {
        await test.step(`Open edit for user: ${email}`, async () => {
            const userRow = this.userRow.filter({ hasText: email }).first();
            const editBtn = userRow.getByTestId('edit-user');
            await editBtn.click();
        });
    }

    async updateUserPhoneNumber(phoneNumber: string) {
        await test.step(`Update user phone number to: ${phoneNumber}`, async () => {
            await this.phoneNumberInput.clear();
            await this.phoneNumberInput.fill(phoneNumber);
        });
    }

    async updateUserAddress(street: string, apartment: string, city: string, postalCode: string) {
        await test.step(`Update user address`, async () => {
            await this.streetInput.clear();
            await this.streetInput.fill(street);
            await this.apartmentNumberInput.clear();
            await this.apartmentNumberInput.fill(apartment);
            await this.cityInput.clear();
            await this.cityInput.fill(city);
            await this.postalCodeInput.clear();
            await this.postalCodeInput.fill(postalCode);
        });
    }

    async updateDaikinCoins(coins: number) {
        await test.step(`Update Daikin coins to: ${coins}`, async () => {
            await this.daikinCoinsInput.clear();
            await this.daikinCoinsInput.fill(coins.toString());
        });
    }

    async saveUser() {
        await test.step('Save user', async () => {
            await this.saveButton.click();
        });
    }

    async expectSuccessMessage() {
        await test.step('Expect success message to be visible', async () => {
            await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
        });
    }
}
