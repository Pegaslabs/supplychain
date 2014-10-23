var test_utils = require("../e2e_utils.js");

describe('Reports', function() {

  browser.get(test_utils.base_url + "#/reports");
  var report_page = require('../report/report_page.js');

  describe('Consumption report', function() {
    describe('setup', function(){
      report_page.start_consumption();
      it('should allow user to select a consumption report', function() {
        expect($("h3").getText()).toEqual("Run Report - Consumption Report");
      });
      it('should allow user to select a start date and completion date', function() {
        report_page.select_start('1/1/2013');
        expect($(".start_date_text").getText()).toEqual(test_utils.get_display_date('1/1/2013'));
        report_page.select_end('31/1/2013');
        expect($(".end_date_text").getText()).toEqual(test_utils.get_display_date('1/31/2013'));
        expect($("h3").getText()).toEqual("Run Report - Consumption Report");
      });
      it('should allow user to select a location',function(){
        report_page.select_location("Central");
        expect($('.location_text').getText()).toEqual('Central Warehouse');
      });
      it('should allow user to select a category',function(){
        report_page.select_category("ARV");
        expect($('.category_text').getText()).toEqual('ARV\'S PREPARATIONS');
      });
    });
    describe('data', function() {
      // report_page.load_test_data();
      browser.get(test_utils.base_url + "#/reports");
      report_page.start_consumption();
      report_page.select_start('1/1/2013');
      report_page.select_end('31/1/2013');
      report_page.select_location("Central");
      report_page.select_category("Test Item Category");
      report_page.run();

      it('should display results once the report has been run',function(){
        expect($("table").isDisplayed()).toEqual(true);
      });
      it('should display consumption data per consumption calculation rules (in wiki docs)',function(){
        expect(element(by.repeater('itemlot in q_location.itemlots').row(0).column("qty_sent")).getText()).toEqual('22');
      });
      iit('should have a lost/damaged column',function(){
        transfer_page.get("15/1/2013", "Central Warehouse", "Loss");
        transfer_page.add_item("Test Consumption Report Item", 15);
        transfer_page.submit_shipment();
        transfer_page.get("27/1/2013", "Central Warehouse", "Damaged");
        transfer_page.add_item("Test Consumption Report Item", 25);
        transfer_page.submit_shipment();
        expect(element(by.repeater('itemlot in q_location.itemlots').row(0).column("qty_lost")).getText()).toEqual('40');
      });
      iit('should have a miscount column of the absolute qty miscounted',function(){
        expect(element(by.repeater('itemlot in q_location.itemlots').row(0).column("qty_miscount")).getText()).toEqual('5');
      });
    });
  });
});
