const screenshots = require('protractor-take-screenshots-on-demand');

export class GlobalPage {
  static screenshotNo = 1;

  static takeScreenshot(context) {
    const name = this.screenshotNo + ' - ' + context;
    screenshots.takeScreenshot(name);
    this.screenshotNo++;
  }
}
