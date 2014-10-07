var test_utils = require("../e2e_utils.js");
var dispense_page = require("./dispense_page.js");
var monitor_page = require("../monitor/monitor_page.js");
var receive_page = require("../receive/edit_receive_page.js");
var transfer_page = require("../transfer/edit_transfer_page.js");

describe('transferring to dispensaries', function() {
    iit('should show pack sizes on from stock page, dispense sizes (pack size * qty) on dispensary stock page', function() {
        receive_page.get("30/3/2014", "NDSO", "Central Warehouse");
        receive_page.select_item("Test Consumption Report Item");
        receive_page.submit_qty(5);
        receive_page.submit_item();
        transfer_page.get("30/3/2014", "Central Warehouse", "Botsabelo Dispensary");
        transfer_page.add_item("Test Consumption Report Item", 10);
        transfer_page.submit_shipment();
        monitor_page.search("Test Consumption Report Item");
        expect(element(by.repeater('stockchange in stockchanges').row(0).column("qty")).getText()).toEqual('-10');
        $(".at_dispensaries_tab").click();
        $(".dispensary_link").click();
        expect(element(by.repeater('stockchange in stockchanges').row(0).column("qty")).getText()).toEqual('200');
    });
    describe('editing active shipment', function() {
        it('should show pack sizes on from stock page, dispense sizes (pack size * qty) on dispensary stock page', function() {
            browser.get(test_utils.base_url + "#/shipments?shipment_type=T&active=true");
            $(".shipment_link").click();
            $(".edit_link").click();
            $(".edit_item_btn").click();
            // monitor_page.search("Test Consumption Report Item");
            // expect(element(by.repeater('stockchange in stockchanges').row(0).column("qty")).getText()).toEqual('-10');
            // $(".at_dispensaries_tab").click();
            // $(".dispensary_link").click();
            // expect(element(by.repeater('stockchange in stockchanges').row(0).column("qty")).getText()).toEqual('200');
        });
    });
});

