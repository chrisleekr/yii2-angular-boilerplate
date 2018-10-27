// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const screenshots = require('protractor-take-screenshots-on-demand');
const {SpecReporter} = require('jasmine-spec-reporter');

exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        './e2e/**/*.e2e-spec.ts'
    ],
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ['--headless', '--no-sandbox']
        }
    },
    directConnect: true,
    baseUrl: 'http://localhost:4200/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        print: function () {
        }
    },
    onPrepare() {
        require('ts-node').register({
            project: 'e2e/tsconfig.e2e.json'
        });
        jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));

        //joiner between browser name and file name
        screenshots.browserNameJoiner = ' - '; //this is the default
        //folder of screenshots
        screenshots.screenShotDirectory = 'output/screenshots';
        //creates folder of screenshots
        screenshots.createDirectory();

    }
};
