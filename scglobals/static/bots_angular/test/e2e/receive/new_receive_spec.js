var test_utils = require("../e2e_utils.js");
var newreceive_page = require("./new_receive_page.js");

describe('new receive page', function() {
    beforeEach(function() {
        newreceive_page.get();
    });
    it('should present the user with a new receive shipment page', function() {
        expect(newreceive_page.header.getText()).toEqual("Receive External Shipment");
    });
    it('should let the user enter a shipment name', function() {
        newreceive_page.name_input.sendKeys("Test Shipment 123\t");
        expect(newreceive_page.name_text.getText()).toEqual("Test Shipment 123");
    });
    it('should allow the user to enter a date in UK format', function() {
        newreceive_page.date_input.sendKeys("01/02/2014\t");
        // switching to american
        expect(newreceive_page.date_text.getText()).toEqual(test_utils.get_display_date("02/01/2014"));
    });
    it('should allow the user to enter a "t" for today, instead of a spelled out date', function() {
        newreceive_page.date_input.sendKeys("t\t");
        expect(newreceive_page.date_warning.isDisplayed()).toEqual(false);
        expect(newreceive_page.date_text.getText()).toEqual(test_utils.get_display_date(new Date()));
        newreceive_page.change_date.click();
        newreceive_page.date_input.clear();
        newreceive_page.date_input.sendKeys("t+50\t");
        expect(newreceive_page.date_warning.isDisplayed()).toEqual(false);
        newreceive_page.change_date.click();
        newreceive_page.date_input.clear();
        newreceive_page.date_input.sendKeys("t-50\t");
        expect(newreceive_page.date_warning.isDisplayed()).toEqual(false);
    });
    it('should allow the user to edit the date', function() {
        newreceive_page.date_input.sendKeys("01/02/2014\t");
        newreceive_page.change_date.click();
        newreceive_page.date_input.clear();
        newreceive_page.date_input.sendKeys("01/03/2014\t");
        // switching to american
        expect(newreceive_page.date_text.getText()).toEqual(test_utils.get_display_date("03/01/2014"));
    });
    it('should allow the user to select a from location', function() {
        newreceive_page.from_location_input.click();
        newreceive_page.from_location_input.sendKeys("Boston");
        element.all(by.css('.from_location a')).then(function(arr) {
            expect(arr[0].getText()).toBe('Boston');
            arr[0].click();
        });
        expect(newreceive_page.from_location_text.getText()).toEqual("Boston");
    });
    it('should allow the user to edit a selected from location', function() {
        newreceive_page.from_location_input.click();
        newreceive_page.from_location_input.sendKeys("Boston");
        element.all(by.css('.from_location a')).then(function(arr) {
            arr[0].click();
        });
        newreceive_page.change_from_location.click();
        newreceive_page.from_location_input.clear();
        newreceive_page.from_location_input.sendKeys("NDSO");
        element.all(by.css('.from_location a')).then(function(arr) {
            expect(arr[0].getText()).toBe('NDSO');
            arr[0].click();
        });
        expect(newreceive_page.from_location_text.getText()).toEqual("NDSO");
    });
    it('should allow the user to select a to location', function() {
        newreceive_page.to_location_input.click();
        newreceive_page.to_location_input.sendKeys("Central Warehouse");
        element.all(by.css('.to_location a')).then(function(arr) {
            expect(arr[0].getText()).toBe('Central Warehouse');
            arr[0].click();
        });
        expect(newreceive_page.to_location_text.getText()).toEqual("Central Warehouse");
    });
    it('should allow the user to edit a selected to location', function() {
        newreceive_page.to_location_input.click();
        newreceive_page.to_location_input.sendKeys("Nohana");
        element.all(by.css('.to_location a')).then(function(arr) {
            arr[0].click();
        });
        newreceive_page.change_to_location.click();
        newreceive_page.to_location_input.clear();
        newreceive_page.to_location_input.sendKeys("Nkau");
        element.all(by.css('.to_location a')).then(function(arr) {
            expect(arr[0].getText()).toBe('Nkau');
            arr[0].click();
        });
        expect(newreceive_page.to_location_text.getText()).toEqual("Nkau");
    });
    it('should create a new shipment when the user has entered in locations & date', function() {
        expect($(".add_item").isDisplayed()).toEqual(false);
        newreceive_page.date_input.sendKeys("01/02/2014\t");
        newreceive_page.from_location_input.sendKeys("NDSO");
        element.all(by.css('.from_location a')).then(function(arr) {
            arr[0].click();
        });
        newreceive_page.to_location_input.sendKeys("Central Warehouse");
        element.all(by.css('.to_location a')).then(function(arr) {
            arr[0].click();
        });
        expect($(".add_item").isDisplayed()).toEqual(true);
        $(".delete_shipment").click();
        $(".confirm_delete").click();
    });
    describe('new locations', function() {
        beforeEach(function() {
            newreceive_page.get();
        });
        it('should allow the user to add a new supplier', function() {
            var new_loc_name = "Test Loc " + Math.random().toString();
            newreceive_page.from_location_input.sendKeys(new_loc_name);
            element.all(by.css('.from_location a')).then(function(arr) {
                expect(arr[1].getText()).toBe("No location matches that search. Create new location \"" + new_loc_name + "\"");
                arr[1].click();
            });
            // on modal
            $(".confirm_new_from_location").click();
            expect(newreceive_page.from_location_text.getText()).toEqual(new_loc_name);
        });
        // it('should now allow the user to add a new supplier with the same name as an existing', function() {
        //     // need to implement
        // });
        it('should allow the user to add a new to location', function() {
            var new_loc_name = "Test Loc " + Math.random().toString();
            newreceive_page.to_location_input.sendKeys(new_loc_name);
            element.all(by.css('.to_location a')).then(function(arr) {
                expect(arr[1].getText()).toBe("No location matches that search. Create new location \"" + new_loc_name + "\"");
                arr[1].click();
            });
        // on modal
        $(".confirm_new_to_location").click();
        expect(newreceive_page.to_location_text.getText()).toEqual(new_loc_name);
    });
    // it('should not allow the user to add a location with the same name as an existing', function() {
    //     // need to implement
    // });
    // it('should allow the user to edit name mistakes on to, from location', function() {
    //     // need to implement
    // });
});
});

