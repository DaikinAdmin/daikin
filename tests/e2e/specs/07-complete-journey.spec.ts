import { test, expect } from '../../fixtures/fixture';

test.describe('Complete User Journey - E2E', () => {
    const testOrderId = `ORD-E2E-${Date.now()}`;
    const testBenefitTitle = `E2E Benefit ${Date.now()}`;

    test('Complete workflow: Create order, manage service, create and redeem benefit @e2e @smoke', async ({ 
        admin, 
        employee, 
        user, 
        userEmail 
    }) => {
        // ===== STEP 1: Admin creates a new benefit =====
        await test.step('Admin creates a new benefit', async () => {
            await admin.benefits.open();
            await admin.benefits.clickCreateBenefit();
            await admin.benefits.fillBenefitDetails(
                testBenefitTitle,
                'Special E2E test benefit - 15% discount',
                75
            );
            await admin.benefits.setActiveStatus(true);
            await admin.benefits.saveBenefit();
            await admin.benefits.expectSuccessMessage();
            await admin.benefits.expectBenefitVisible(testBenefitTitle);
        });

        // ===== STEP 2: Employee creates an order for the user =====
        await test.step('Employee creates an order', async () => {
            await employee.orders.open();
            await employee.orders.clickCreateOrder();
            await employee.orders.fillOrderDetails(
                testOrderId,
                userEmail.email,
                '2024-10-26',
                '4500.00'
            );
            await employee.orders.addProduct(
                'DAIKIN-E2E-001',
                'Daikin Premium Air Conditioner 4.0kW',
                '3500.00',
                '1',
                '7 years'
            );
            await employee.orders.addProduct(
                'DAIKIN-E2E-002',
                'Premium Installation Package',
                '1000.00',
                '1',
                '3 years'
            );
            await employee.orders.saveOrder();
            await employee.orders.expectSuccessMessage();
        });

        // ===== STEP 3: User finds their order =====
        await test.step('User finds their order', async () => {
            await user.orders.open();
            await user.orders.searchOrder(testOrderId);
            await user.orders.expectOrderVisible(testOrderId);
        });

        // ===== STEP 4: Admin updates user profile with bonus coins =====
        await test.step('Admin updates user profile', async () => {
            await admin.users.open();
            await admin.users.searchUser(userEmail.email);
            await admin.users.openUserEdit(userEmail.email);
            await admin.users.updateDaikinCoins(450); // Enough to redeem benefit
            await admin.users.saveUser();
            await admin.users.expectSuccessMessage();
        });

        // ===== STEP 5: Employee schedules a service =====
        await test.step('Employee schedules service', async () => {
            await employee.services.open();
            await employee.services.searchService(testOrderId);
            await employee.services.openServiceDetails(testOrderId);
            await employee.services.updateServiceDate('2025-03-15');
            await employee.services.updateServiceDetails('Annual maintenance service');
            await employee.services.saveService();
            await employee.services.expectSuccessMessage();
        });

        // ===== STEP 6: Admin approves the service =====
        await test.step('Admin approves service', async () => {
            await admin.services.open();
            await admin.services.searchService(testOrderId);
            await admin.services.openServiceDetails(testOrderId);
            await admin.services.updateServiceStatus('APPROVED');
            await admin.services.saveService();
            await admin.services.expectSuccessMessage();
            await admin.services.expectServiceStatus(testOrderId, 'APPROVED');
        });

        // ===== STEP 7: User views and redeems benefit =====
        await test.step('User redeems benefit', async () => {
            await user.benefits.open();
            await user.benefits.expectBenefitVisible(testBenefitTitle);
            await user.benefits.redeemBenefit(testBenefitTitle);
            await user.benefits.expectSuccessMessage();
        });

        // ===== STEP 8: User verifies redeemed benefits =====
        // await test.step('User verifies redeemed benefits', async () => {
        //     await user.page.goto('/en/dashboard/benefits-redeemed');
        //     await user.page.waitForLoadState('networkidle');
        //     const redeemedBenefits = user.page.getByTestId('redeemed-benefit');
        //     await expect(redeemedBenefits.first()).toBeVisible();
        // });
    });
});
