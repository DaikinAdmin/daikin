import { AppPage } from './page-holder';
import { Page, test } from '@playwright/test';

export class BenefitsPage extends AppPage {
    public pagePath = '/en/dashboard/benefits';

    private createBenefitButton = this.page.getByTestId('create-benefit');
    private benefitCard = this.page.getByTestId('benefit-card');
    
    // Create/Edit Benefit Form
    private titleInput = this.page.locator('input[name="title"]');
    private descriptionInput = this.page.locator('textarea[name="description"]');
    private daikinCoinsInput = this.page.locator('input[name="daikinCoins"]');
    private isActiveCheckbox = this.page.locator('input[name="isActive"]');
    private saveBenefitButton = this.page.getByTestId('save-benefit');
    private successMessage = this.page.getByTestId('success-message');

    constructor(page: Page) {
        super(page);
    }

    async expectLoaded(message?: string) {
        await test.step('Expect Benefits Page loaded', async () => {
            await this.page.waitForURL(/.*benefits/, { timeout: 10000 });
        });
    }

    async clickCreateBenefit() {
        await test.step('Click create benefit button', async () => {
            await this.createBenefitButton.click();
        });
    }

    async fillBenefitDetails(title: string, description: string, daikinCoins: number) {
        await test.step(`Fill benefit details: ${title}`, async () => {
            await this.titleInput.fill(title);
            await this.descriptionInput.fill(description);
            await this.daikinCoinsInput.fill(daikinCoins.toString());
        });
    }

    async setActiveStatus(isActive: boolean) {
        await test.step(`Set benefit active status: ${isActive}`, async () => {
            if (isActive) {
                await this.isActiveCheckbox.check();
            } else {
                await this.isActiveCheckbox.uncheck();
            }
        });
    }

    async saveBenefit() {
        await test.step('Save benefit', async () => {
            await this.saveBenefitButton.click();
        });
    }

    async expectBenefitVisible(title: string) {
        await test.step(`Expect benefit "${title}" to be visible`, async () => {
            const benefitCard = this.benefitCard.filter({ hasText: title }).first();
            await test.expect(benefitCard).toBeVisible({ timeout: 5000 });
        });
    }

    async redeemBenefit(title: string) {
        await test.step(`Redeem benefit: ${title}`, async () => {
            const benefitCard = this.benefitCard.filter({ hasText: title }).first();
            const redeemButton = benefitCard.getByTestId('redeem-benefit');
            await redeemButton.click();
        });
    }

    async expectSuccessMessage() {
        await test.step('Expect success message to be visible', async () => {
            // Check that dialog is closed (success)
            const dialog = this.page.locator('[role="dialog"]');
            await dialog.waitFor({ state: 'hidden', timeout: 5000 });
        });
    }

    async expectDaikinCoinsRequired(title: string, coins: number) {
        await test.step(`Expect benefit "${title}" to require ${coins} coins`, async () => {
            const benefitCard = this.benefitCard.filter({ hasText: title }).first();
            await test.expect(benefitCard.locator(`text=${coins}`)).toBeVisible({ timeout: 5000 });
        });
    }
}
