var test_utils = require("../e2e_utils.js");
var newtransfer_page = require('./new_transfer_page.js');

var EditTransferPage = function() {
  this.add_item_window = $("#edit_item_transfer");
  this.get = function(date_str,from,to){
    browser.get(test_utils.base_url + "#/shipment/edit_transfer");
    newtransfer_page.date_input.sendKeys(date_str + "\t");
    newtransfer_page.from_location_input.sendKeys(from);
    element.all(by.css('.from_location a')).then(function(arr) {arr[0].click();});
    newtransfer_page.to_location_input.sendKeys(to);
    element.all(by.css('.to_location a')).then(function(arr) {arr[0].click();});
  };
  this.select_item = function(item_name){
    $(".add_item_input").clear();
    $(".add_item_input").sendKeys(item_name);
    element.all(by.css('.add_item a')).then(function(arr) {
      arr[0].click();
    });
  };
  this.submit_qty = function(qty){
    $("#qty").sendKeys(qty);
    $(".submit_editing_item_qty").click();
  };
  this.submit_item = function(){
    $("#submit_edit").click();
  };
  this.add_item = function(item_name,qty){
    this.select_item(item_name);
    this.submit_qty(qty);
    this.submit_item();
  };
  this.submit_shipment = function(){
    $(".submit_shipment").click();
    $(".confirm_shipment").click();
  };
};

module.exports = new EditTransferPage();
