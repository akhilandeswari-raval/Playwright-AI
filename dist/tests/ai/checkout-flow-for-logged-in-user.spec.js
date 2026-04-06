"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const test_1 = tslib_1.__importStar(require("@playwright/test"));
const LoginPage_1 = tslib_1.__importDefault(require("../pages/LoginPage"));
// Placeholder, will be initialized in beforeEach
test_1.default.describe('Checkout flow for logged-in user', () => {
    test_1.default.beforeEach(async ({ page }) => {
        const login = new LoginPage_1.default(page);
        await login.open();
    });
    (0, test_1.default)('example login flow', async ({ page }) => {
        const login = new LoginPage_1.default(page);
        const email = 'standard_user';
        const password = 'secret_sauce';
        await login.login(email, password); // Use the login method from your page object to perform the login action with the provided email and password
        (0, test_1.expect)((page).locator('.shopping_cart_link')).toBeEnabled();
        await (0, test_1.expect)(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await (0, test_1.expect)(page.locator('.shopping_cart_link')).toBeVisible();
    });
    (0, test_1.default)('should fail with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage_1.default(page);
        await loginPage.login('locked_out_user', 'secret_sauce');
        // Error message should appear
        // await expect(page.locator('[data-test="error"]')).toBeVisible();
        await (0, test_1.expect)(page.locator('.error-message')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    });
});
//# sourceMappingURL=checkout-flow-for-logged-in-user.spec.js.map