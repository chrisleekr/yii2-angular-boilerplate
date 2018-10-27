import { browser, by, element } from 'protractor';

export class IndexPage {
  static navigateTo() {
    return browser.get('/');
  }

  static getPageWrapper() {
    return element(by.css('app-index'));
  }
}
