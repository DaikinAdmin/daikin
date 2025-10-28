import { test, expect } from '../../fixtures/fixture';

test.describe('Order Management', () => {
    const testOrderId = `ORD-TEST-${Date.now()}`;

    test('Employee can create a new order @orders @employee', async ({ employee, userEmail }) => {
        // Navigate to orders page
        await employee.orders.open();
        
        // Click create order
        await employee.orders.clickCreateOrder();
        
        // Fill order details
        await employee.orders.fillOrderDetails(
            testOrderId,
            userEmail.email,
            '2024-10-26',
            '3999.99'
        );
        
        // Add first product
        await employee.orders.addProduct(
            'DAIKIN-TEST-001',
            'Daikin Test Air Conditioner 3.0kW',
            '2499.99',
            '1',
            '5 years'
        );
        
        // Add second product
        await employee.orders.addProduct(
            'DAIKIN-TEST-002',
            'Daikin Installation Kit',
            '1500.00',
            '1',
            '2 years'
        );
        
        // Save order
        await employee.orders.saveOrder();
        
        // Verify success
        await employee.orders.expectSuccessMessage();
    });

    test('Employee can edit an existing order @orders @employee', async ({ employee }) => {
        // Navigate to orders page
        await employee.orders.open();
        
        // Search for the order
        await employee.orders.searchOrder('ORD-2024-001');
        
        // Open order edit
        await employee.orders.openOrderEdit('ORD-2024-001');
        
        // Update next service date
        await employee.orders.updateNextServiceDate('2025-12-31');
        
        // Save order
        await employee.orders.saveOrder();
        
        // Verify success
        await employee.orders.expectSuccessMessage();
    });

    test('Admin can edit an order @orders @admin', async ({ admin }) => {
        // Navigate to orders page
        await admin.orders.open();

        // Search for the order
        await admin.orders.searchOrder('ORD-2024-001');
        
        // Open order edit
        await admin.orders.openOrderEdit('ORD-2024-001');
        
        // Update next service date
        await admin.orders.updateNextServiceDate('2026-01-15');

        // Save order
        await admin.orders.saveOrder();

        // Verify success
        await admin.orders.expectSuccessMessage();
    });

    test('User can find their order @orders @user', async ({ user }) => {
        // Navigate to orders page
        await user.orders.open();
        
        // Search for the order
        await user.orders.searchOrder('ORD-2024-001');

        // Verify order is visible
        await user.orders.expectOrderVisible('ORD-2024-001');
    });
});
