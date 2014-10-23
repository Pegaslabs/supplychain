var test_utils = require("../e2e_utils.js");
var newreceive_page = require('./new_receive_page.js');

var EditReceivePage = function() {
  this.add_item_window = $("#edit_itemlot_modal");
  this.get = function(date_str,from,to){
    browser.get(test_utils.base_url + "#/shipment/edit_receive");
    newreceive_page.date_input.sendKeys(date_str + "\t");
    newreceive_page.from_location_input.sendKeys(from);
    element.all(by.css('.from_location a')).then(function(arr) {arr[0].click();});
    newreceive_page.to_location_input.sendKeys(to);
    element.all(by.css('.to_location a')).then(function(arr) {arr[0].click();});
  };
  var select_new_item = function(item_name,category_name){
    $(".add_item_input").clear();
    $(".add_item_input").sendKeys(item_name);
    element.all(by.css('.add_item a')).then(function(arr) {
      arr[1].click();
      $(".category_search_input").clear();
      $(".category_search_input").sendKeys(category_name);
      element.all(by.css('.new_item_category a')).then(function(arr) {
        arr[0].click();
        $(".create_item_btn").click();
      });
    });
  };
  this.select_new_item = select_new_item;
  this.select_new_item_cat = function(item_name,category_name){
    $(".add_item_input").clear();
    $(".add_item_input").sendKeys(item_name);
    element.all(by.css('.add_item a')).then(function(arr) {
      arr[1].click();
      $(".category_search_input").clear();
      $(".category_search_input").sendKeys(category_name);
      element.all(by.css('.new_item_category a')).then(function(arr) {
        arr[1].click();
        $(".create_item_btn").click();
      });
    });
  };
  this.select_item = function(item_name){
    $(".add_item_input").clear();
    $(".add_item_input").sendKeys(item_name);
    element.all(by.css('.add_item a')).then(function(arr) {
      arr[0].click();
    });
  };
  this.submit_qty = function(qty){
    $(".qty_input").sendKeys(qty);
  };
  this.submit_expiration = function(expiration){
    element(by.model("editing_itemlot.expiration")).sendKeys(expiration);
  };
  this.submit_lot_num = function(lot_num){
    element(by.model("editing_itemlot.lot_num")).sendKeys(lot_num);
  };
  this.submit_unit_price = function(unit_price){
    element(by.model("editing_itemlot.unit_price")).sendKeys(unit_price);
  };
  this.submit_item = function(){
    $("#submit_edit").click();
  };
  this.add_item = function(item_name,qty,expiration,lot_num,unit_price){
    this.select_item(item_name);
    this.submit_qty(qty);
    this.submit_expiration(expiration);
    this.submit_lot_num(lot_num);
    this.submit_unit_price(unit_price);
    this.submit_item();
  };
  this.submit_shipment = function(){
    $(".submit_shipment").click();
    $(".confirm_shipment").click();
  };
  this.add_new_item_cat = function(item_name,category_name,qty,expiration,lot_num,unit_price){
    $(".add_item_input").clear();
    $(".add_item_input").sendKeys(item_name);
    element.all(by.css('.add_item a')).then(function(arr) {
      arr[1].click();
      $(".category_search_input").clear();
      $(".category_search_input").sendKeys(category_name);
      element.all(by.css('.new_item_category a')).then(function(arr) {
        arr[1].click();
        $(".create_item_btn").click();
      });
    });
    this.submit_qty(qty);
    this.submit_expiration(expiration);
    this.submit_lot_num(lot_num);
    this.submit_unit_price(unit_price);
    this.submit_item();
  };
};

module.exports = new EditReceivePage();
