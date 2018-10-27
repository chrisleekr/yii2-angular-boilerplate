import { _ } from 'underscore';
import { browser } from 'protractor';
import { Header } from '../page-object/header.po';
import { IndexPage } from '../page-object/index.po';
import { GlobalPage } from '../page-object/global.po';

describe('Index page', () => {

  beforeAll(() => {
    IndexPage.navigateTo();

    GlobalPage.takeScreenshot('index-page');
  });

  describe('Header', () => {
    it('should display logo', () => {
      expect(Header.getLogo().isPresent()).toBe(true);
    });

    describe('Menu', () => {
      _.each(['Home', 'Another Page', 'Sample Page'], menuText => {
        it('should display menu `' + menuText + '`', () => {
          expect(Header.getMenuByText(menuText).isPresent()).toBe(true);
        });
      });

      it('should set active class for menu `Home`', () => {
        expect(Header.getActiveMenu().getText()).toBe('Home');
      });
    });

    describe('Buttons - Before Login', () => {
      _.each(['Login', 'Sign up'], menuText => {
        it('should display button `' + menuText + '`', () => {
          expect(Header.getButtonForBeforeLogin(menuText).isPresent()).toBe(true);
        });
      });

      describe('Click `Login` button', () => {
        beforeAll(() => {
          IndexPage.navigateTo();
          Header.clickLoginButton();
          GlobalPage.takeScreenshot('after-click-login-button');
        });

        it('should go to login page', () => {
          expect(browser.getCurrentUrl()).toContain('/login');
        });
      });
      describe('Click `Sign up` button', () => {
        beforeAll(() => {
          IndexPage.navigateTo();
          Header.clickSignUpButton();
          GlobalPage.takeScreenshot('after-click-signup');
        });

        it('should go to login page', () => {
          expect(browser.getCurrentUrl()).toContain('/signup');
        });
      });
    });
  });

});
