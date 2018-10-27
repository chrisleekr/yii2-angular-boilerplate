import { by, element } from 'protractor';

export class Header {
  static getLogo() {
    return element(by.css('.header-wrapper img.company-logo'));
  }

  static getMenuByText(text) {
    return element(by.cssContainingText('.menu-wrapper .menu-link', text));
  }

  static getActiveMenu() {
    return element(by.css('.menu-wrapper .menu-link.active'));
  }

  static getActiveButtonForBeforeLogin() {
    return element(by.css('.before-login-link-wrapper .btn.active'));
  }

  static getButtonForBeforeLogin(text) {
    return element(by.cssContainingText('.before-login-link-wrapper .btn', text));
  }

  static clickLoginButton() {
    return element(by.css('.before-login-link-wrapper .link-login')).click();
  }

  static clickSignUpButton() {
    return element(by.css('.before-login-link-wrapper .link-signup')).click();
  }

  static getTextUsername() {
    return element(by.css('.after-login-link-wrapper .text-username'));
  }
}
