import { test, expect } from '../../fixtures/fixture';

test.describe('User Profile Management', () => {
    test('User can update their profile information @profile @user', async ({ user }) => {
        // Navigate to profile page
        await user.profile.open();
        
        // Update phone number
        await user.profile.updatePhoneNumber('+48111222333');
        
        // Update address
        await user.profile.updateAddress(
            'Test Street 123',
            '5B',
            'Warsaw',
            '00-123'
        );
        
        // Save profile
        await user.profile.saveProfile();
        
        // Verify success
        await user.profile.expectSuccessMessage();
    });

    test('User can update date of birth @profile @user', async ({ user }) => {
        // Navigate to profile page
        await user.profile.open();
        
        // Update date of birth
        await user.profile.updateDateOfBirth('1990-05-15');
        
        // Save profile
        await user.profile.saveProfile();
        
        // Verify success
        await user.profile.expectSuccessMessage();
    });
});
