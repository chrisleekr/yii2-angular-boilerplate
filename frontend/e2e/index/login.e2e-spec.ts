import { _ } from 'underscore';
import { Header } from '../page-object/header.po';
import { LoginPage } from '../page-object/login.po';
import { IndexPage } from '../page-object/index.po';
import { GlobalPage } from '../page-object/global.po';

describe('Login page', () => {

  beforeAll(() => {
    LoginPage.navigateTo();

    GlobalPage.takeScreenshot('login-page');
  });

  describe('Header', () => {

    it('should active button `Login`', () => {
      expect(Header.getActiveButtonForBeforeLogin().getText()).toBe('Login');
    });
  });

  describe('Login form', () => {
    describe('With non-existing account', () => {
      beforeAll(() => {
        LoginPage.navigateTo();
        LoginPage.fillLoginForm('non-exist-username', 'fake-password');
        LoginPage.clickLoginButton();
      });

      it('should show error message', () => {
        expect(LoginPage.getPasswordHelpBlock().getText()).toBe('Incorrect username or password.');
      });
    });

    describe('With existing account', () => {
      beforeAll(() => {
        LoginPage.navigateTo();
        LoginPage.fillLoginForm('user', '123456');
        LoginPage.clickLoginButton();
      });

      it('should redirect to index page', () => {
        GlobalPage.takeScreenshot('index-page-after-login');
        expect(IndexPage.getPageWrapper().isPresent()).toBe(true);
      });

      it('should see username', () => {
        expect(Header.getTextUsername().getText()).toBe('user (User)');
      });

    });
  });
});
