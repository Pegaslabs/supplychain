// An example configuration file.
exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  specs: [
    // '../test/e2e/general/auth_spec.js',
    // '../test/e2e/receive/new_receive_spec.js',
    // '../test/e2e/receive/edit_receive_spec.js',
    // '../test/e2e/transfer/new_transfer_spec.js',
    // '../test/e2e/transfer/edit_transfer_spec.js',
    // '../test/e2e/monitor/monitor_spec.js',
    '../test/e2e/dispense/dispense_spec.js'
    ],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    defaultTimeoutInterval: 120000
  },
   onPrepare: function() {
    var ptor = protractor.getInstance();
    ptor.driver.get('http://localhost:8000/#/login');

    element(by.model('user.username')).sendKeys("kevin");
    element(by.model('user.password')).sendKeys("pass");
    $(".log-in-submit").click();

    // Login takes some time, so wait until it's done.
    ptor.wait(function() {
      return ptor.driver.getCurrentUrl().then(function(url) {
        return /dash/.test(url);
      });
    });
  }
};
