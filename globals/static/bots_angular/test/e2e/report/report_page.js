var receive_page = require('../receive/edit_receive_page.js');
var transfer_page = require('../transfer/edit_transfer_page.js');


var ReportPage = function() {

  this.start_consumption = function(){
    $(".consumption_report").click();
  };
  this.get = function(){
    browser.get(test_utils.base_url + "#/reports");
  };
  this.select_start = function(date_text){
    $(".start_date_input").sendKeys(date_text + "\t");
  };

  this.select_end = function(date_text){
    $(".end_date_input").sendKeys(date_text + "\t");
  };

  this.load_test_data = function(){
    receive_page.get("1/1/2013","NDSO","Central Warehouse");
    receive_page.add_new_item_cat("Test Consumption Report Item", "Test Consumption Report Category", 40,"1/1/18","test lot num",15);
    receive_page.add_item("Test Consumption Report Item", 10,"15/1/2013","test lot num",15);
    receive_page.submit_shipment();

    transfer_page.get("5/1/2013", "Central Warehouse", "Tlhanyaku");
    transfer_page.add_item("Test Consumption Report Item", 5);
    transfer_page.submit_shipment();

    transfer_page.get("15/1/2013", "Central Warehouse", "Expired");
    transfer_page.add_item("Test Consumption Report Item", 10);
    transfer_page.submit_shipment();

    transfer_page.get("16/1/2013", "Central Warehouse", "Miscount");
    transfer_page.add_item("Test Consumption Report Item", 5);
    transfer_page.submit_shipment();

    transfer_page.get("17/1/2013", "Central Warehouse", "Bobete");
    transfer_page.add_item("Test Consumption Report Item", 17);
    transfer_page.submit_shipment();

  };
  this.select_location = function(category_name){
    $(".location_input").click();
    $(".location_input").clear();
    $(".location_input").sendKeys(category_name);
    element.all(by.css('.inventory_location a')).then(function(arr) {
      arr[0].click();
    });
  };
  this.select_category = function(category_name){
    $(".category_input").click();
    $(".category_input").clear();
    $(".category_input").sendKeys(category_name);
    element.all(by.css('.inventory_category a')).then(function(arr) {
      arr[0].click();
    });
  };
  this.run = function(){
    $(".run_report").click();
  };

};

module.exports = new ReportPage();