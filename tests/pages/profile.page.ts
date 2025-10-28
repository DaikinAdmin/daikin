import { AppPage } from './page-holder';
import { Page, test } from '@playwright/test';

export class ProfilePage extends AppPage {
    public pagePath = '/en/dashboard/profile';

    private phoneNumberInput = this.page.locator('input[name="phoneNumber"]');
    private streetInput = this.page.locator('input[name="street"]');
    private apartmentNumberInput = this.page.locator('input[name="apartmentNumber"]');
    private cityInput = this.page.locator('input[name="city"]');
    private postalCodeInput = this.page.locator('input[name="postalCode"]');
    private dateOfBirthInput = this.page.locator('input[name="dateOfBirth"]');
    private saveButton = this.page.getByTestId('save-profile');
    private successMessage = this.page.getByTestId('success-message');

    constructor(page: Page) {
        super(page);
    }

    async expectLoaded(message?: string) {
        await test.step('Expect Profile Page loaded', async () => {
            await this.phoneNumberInput.waitFor({ state: 'visible', timeout: 10000 });
        });
    }

    async updatePhoneNumber(phoneNumber: string) {
        await test.step(`Update phone number to: ${phoneNumber}`, async () => {
            await this.phoneNumberInput.clear();
            await this.phoneNumberInput.fill(phoneNumber);
        });
    }

    async updateAddress(street: string, apartment: string, city: string, postalCode: string) {
        await test.step(`Update address to: ${street}, ${apartment}, ${city}, ${postalCode}`, async () => {
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

    async updateDateOfBirth(date: string) {
        await test.step(`Update date of birth to: ${date}`, async () => {
            await this.dateOfBirthInput.clear();
            await this.dateOfBirthInput.fill(date);
        });
    }

    async saveProfile() {
        await test.step('Save profile', async () => {
            await this.saveButton.click();
        });
    }

    async expectSuccessMessage() {
        await test.step('Expect success message to be visible', async () => {
            await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
        });
    }
}
