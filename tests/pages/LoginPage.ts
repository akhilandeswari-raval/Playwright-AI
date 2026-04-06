import { Page } from '@playwright/test';

class LoginPage {
  private page: Page;
  private emailInput: string;
  private passwordInput: string;
  private loginButton: string;
  private signinButton: string;
  private profileInfo: string;
  private logoutButton: string;

  constructor(page: Page) {
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

  async login(email: string, password: string) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
}

export default LoginPage;