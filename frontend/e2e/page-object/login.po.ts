import { browser, by, element } from 'protractor';

export class LoginPage {
  static navigateTo() {
    return browser.get('/#/login');
  }

  static getPageWrapper() {
    return element(by.css('app-login'));
  }

  static getUsername() {
    return element(by.css('.login-form input.username-field'));
  }

  static getUsernameHelpBlock() {
    return element(by.css('.login-form .username-help-block'));
  }

  static getPassword() {
    return element(by.css('.login-form input.password-field'));
  }

  static getPasswordHelpBlock() {
    return element(by.css('.login-form .password-help-block'));
  }

  static getLoginButton() {
    return element(by.css('.login-form button.login-btn'));
  }

  static clickLoginButton() {
    this.getLoginButton().click();
  }

  static fillLoginForm(username, password) {
    const usernameElem = this.getUsername();
    usernameElem.sendKeys(username);
    const passwordElem = this.getPassword();
    passwordElem.sendKeys(password);
  }
}
