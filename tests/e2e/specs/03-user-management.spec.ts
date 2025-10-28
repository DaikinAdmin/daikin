import { test, expect } from '../../fixtures/fixture';

test.describe('Admin/Employee User Management', () => {
    test('Admin can update user information @users @admin', async ({ admin, userEmail }) => {
        // Navigate to users page
        await admin.users.open();
        
        // Search for the user
        await admin.users.searchUser(userEmail.email);
        
        // Open user edit
        await admin.users.openUserEdit(userEmail.email);
        
        // Update user information
        await admin.users.updateUserPhoneNumber('+48999888777');
        await admin.users.updateUserAddress(
            'Admin Updated Street 99',
            '10A',
            'Krakow',
            '30-999'
        );
        
        // Update Daikin coins
        await admin.users.updateDaikinCoins(500);
        
        // Save user
        await admin.users.saveUser();
        
        // Verify success
        await admin.users.expectSuccessMessage();
    });

    test('Employee can update user phone number @users @employee', async ({ employee, userEmail }) => {
        // Navigate to users page
        await employee.users.open();
        
        // Search for the user
        await employee.users.searchUser(userEmail.email);
        
        // Open user edit
        await employee.users.openUserEdit(userEmail.email);
        
        // Update phone number
        await employee.users.updateUserPhoneNumber('+48777666555');
        
        // Save user
        await employee.users.saveUser();
        
        // Verify success
        await employee.users.expectSuccessMessage();
    });

    test('Employee can update user address @users @employee', async ({ employee, userEmail }) => {
        // Navigate to users page
        await employee.users.open();
        
        // Search for the user
        await employee.users.searchUser(userEmail.email);
        
        // Open user edit
        await employee.users.openUserEdit(userEmail.email);
        
        // Update address
        await employee.users.updateUserAddress(
            'Employee Street 45',
            '3C',
            'Gdansk',
            '80-456'
        );
        
        // Save user
        await employee.users.saveUser();
        
        // Verify success
        await employee.users.expectSuccessMessage();
    });
});
