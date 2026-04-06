import test, { expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';

// Placeholder, will be initialized in beforeEach

test.describe('Checkout flow for logged-in user', () => {
    test.beforeEach(async ({ page }) => {
        const login = new LoginPage(page);
        await login.open();
    });

    test('example login flow', async ({ page }) => {
        const login = new LoginPage(page);
        const email = 'standard_user';
        const password = 'secret_sauce';

        await login.login(email, password); // Use the login method from your page object to perform the login action with the provided email and password


        expect((page).locator('.shopping_cart_link')).toBeEnabled();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(page.locator('.shopping_cart_link')).toBeVisible();
    });

    test('should fail with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.login('locked_out_user', 'secret_sauce');

        // Error message should appear
        // await expect(page.locator('[data-test="error"]')).toBeVisible();

        await expect(page.locator('.error-message')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    });
});