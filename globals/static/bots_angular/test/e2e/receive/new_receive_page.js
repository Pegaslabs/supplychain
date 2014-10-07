var test_utils = require("../e2e_utils.js");

var NewReceivePage = function() {
    this.header = $('h3');
    this.date_warning = $("#bad_date");
    this.change_name = $("#change_name");
    this.change_date = $("#change_date");
    this.change_to_location = $("#change_to_location");
    this.change_from_location = $("#change_from_location");

    this.name_input = element(by.model('shipment.name'));
    this.date_input = element(by.model('shipment.date'));
    this.from_location_input = $(".from_location_input");
    this.to_location_input = $(".to_location_input");

    this.name_text = $('.name_text');
    this.date_text = $('.date_text');
    this.from_location_text = $('.from_location_text');
    this.to_location_text = $('.to_location_text');

    this.get = function() {
        browser.get(test_utils.base_url + "#/shipment/edit_receive");
    };
    this.set_name = function(name) {
        this.name_input.sendKeys(name);
    };
};

module.exports = new NewReceivePage();
