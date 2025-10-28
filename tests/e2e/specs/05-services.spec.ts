import { test, expect } from '../../fixtures/fixture';

test.describe('Service Management', () => {
    test('Employee can change service date @services @employee', async ({ employee }) => {
        // Navigate to services page
        await employee.services.open();
        
        // Search for service by order
        await employee.services.searchService('ORD-2024-001');
        
        // Open service details
        await employee.services.openServiceDetails('ORD-2024-001');

        // Update service date
        await employee.services.updateServiceDate('2025-06-15');

        // Update service details
        await employee.services.updateServiceDetails('Regular maintenance service scheduled');
        
        // Save service
        await employee.services.saveService();
        
        // Verify success
        await employee.services.expectSuccessMessage();
    });

    test('Admin can change service date and status @services @admin', async ({ admin }) => {
        // Navigate to services page
        await admin.services.open();
        
        // Search for service by order
        await admin.services.searchService('ORD-2024-001');
        
        // Open service details
        await admin.services.openServiceDetails('ORD-2024-001');

        // Update service date
        await admin.services.updateServiceDate('2025-07-20');

        // Update service status
        await admin.services.updateServiceStatus('APPROVED');
        
        // Save service
        await admin.services.saveService();

        // Verify success
        await admin.services.expectSuccessMessage();

        // Verify status changed
        await admin.services.expectServiceStatus('ORD-2024-001', 'APPROVED');
    });

    test('Employee can submit a service @services @employee', async ({ employee }) => {
        // Navigate to services page
        await employee.services.open();
        
        // Search for service by order
        await employee.services.searchService('ORD-2024-001');
        
        // Open service details
        await employee.services.openServiceDetails('ORD-2024-001');

        // Update service details
        await employee.services.updateServiceDetails('Service completed successfully');

        // Update service date (actual completion date)
        await employee.services.updateServiceDate('2024-10-26');
        
        // Submit service
        await employee.services.submitService();
        
        // Verify success
        await employee.services.expectSuccessMessage();
    });

    test('Admin can approve service submission @services @admin', async ({ admin }) => {
        // Navigate to services page
        await admin.services.open();
        
        // Search for service by order
        await admin.services.searchService('ORD-2024-001');
        
        // Open service details
        await admin.services.openServiceDetails('ORD-2024-001');

        // Update service status to approved
        await admin.services.updateServiceStatus('APPROVED');

        // Save service
        await admin.services.saveService();
        
        // Verify success
        await admin.services.expectSuccessMessage();
        
        // Verify status changed
        await admin.services.expectServiceStatus('ORD-2024-001', 'APPROVED');
    });
});
