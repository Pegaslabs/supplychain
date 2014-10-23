var test_utils = require("../e2e_utils.js");

var MonitorPage = function() {
  this.search_input = $(".item_search_input");
  this.get = function(){
    browser.get(test_utils.base_url + "#/item/659");
  };
  this.search = function(item_name){
    this.search_input.sendKeys(item_name);
    element.all(by.css('.item_search_container a')).then(function(arr){arr[0].click();});
  };
};

module.exports = new MonitorPage();
