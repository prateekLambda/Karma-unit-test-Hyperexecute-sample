const baseKarma = require('./base-karma')
const mochaConfig = require('../../.mocharc.json')

module.exports = function (config) {
  const createWebDriverConfig = (hostname) => ({
    hostname,
    port: 80
  })

  const createLauncher = (config, overrides = {}) => ({
    base: 'WebDriver',
    config,
    'LT:Options': {
      build: 'OSS',
      name: 'mathjs',
      video: true,
      visual: false,
      network: false,
      console: false,
      terminal: true,
      tunnel: false,
      user: process.env.LT_USERNAME,
      accessKey: process.env.LT_ACCESS_KEY,
      pseudoActivityInterval: 15000,
      w3c: true
    },
    ...overrides
  })

  const webdriverConfig = createWebDriverConfig('hub.lambdatest.com')
  // const mobileWebDriverConfig = createWebDriverConfig('mobile-hub.lambdatest.com')

  const customLaunchers = {
    chrome_windows: createLauncher(webdriverConfig, {
      browserName: 'Chrome',
      version: 'latest',
      platform: 'Windows 10'
    }),

  }

  const baseConfig = baseKarma(config)

  config.set({
    ...baseConfig,
    hostname: '127.0.0.1',
    port: 9876,
    basePath: '../..',
    frameworks: ['mocha'],
    client: {
      mocha: {
        timeout: mochaConfig.timeout
      }
    },
    // reporters: ['spec'],
    files: [
      'test/browser-test-config/browser-tests.test.js'
    ],
    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-webdriver-launcher',
      'karma-spec-reporter'
    ],
    captureTimeout: 600000,
    retryLimit: 1,
    browserDisconnectTimeout: 90000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 90000,
    concurrency: Infinity,
    logLevel: config.LOG_SILENT,
    browsers: Object.keys(customLaunchers),
    customLaunchers,
    singleRun: true,
    autoWatch: false
  })
}
