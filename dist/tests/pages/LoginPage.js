"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = '#user-name';
        this.passwordInput = '#password';
        this.loginButton = '#login-button';
        this.signinButton = 'text=Sign in';
        this.profileInfo = '.profile-info';
        this.logoutButton = '.btn-primary';
    }
    async open() {
        await this.page.goto('https://www.saucedemo.com/'); // Replace with your actual login page URL
    }
    async login(email, password) {
        await this.page.fill(this.emailInput, email);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginButton);
    }
}
exports.default = LoginPage;
//# sourceMappingURL=LoginPage.js.map