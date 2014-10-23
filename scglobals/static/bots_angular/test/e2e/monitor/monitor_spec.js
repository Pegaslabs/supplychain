describe('monitoring stock', function() {
  var test_utils = require("../e2e_utils.js");
  var monitor_page = require('./monitor_page.js');

  describe('searching for items', function() {
      // fastest page to load 
      browser.get(test_utils.base_url + "#/reports");

      it('should allow the user to search for and select an item', function() {
        monitor_page.search_input.click();
        monitor_page.search_input.sendKeys("Amoxic");
        element.all(by.css('.item_search_container a')).then(function(arr){
          expect(arr[0].getText()).toEqual("Amoxicillin 125mg/5ml susp, 100ml - SYRUPS, MIXTURE, SUSPENSIONS ETC");
          arr[0].click();
          expect($("h3").getText()).toEqual("Stock Card: Amoxicillin 125mg/5ml susp, 100ml edit");
        });
      });
    });
  describe('stock card', function() {
    describe('monthly consumption tab', function() {
      // fastest page to load 
      monitor_page.get();
      beforeEach(function(){
        $(".monthly_consumption_tab").click();
      });

      it('should allow the user to see monthly consumption', function() {
        expect($(".monthly_consumption .tab_title").isDisplayed()).toEqual(true);
      });
      // iit("should show average monthly consumption for each calendar year",function(){
      //   var d = new Date();
      //   var end_year = d.getFullYear();
      //   var num_months = 12 * (Number(end_year) - 2013 + 1);
      //   var years = [];
      //   var num_valid_months = 0;
      //   var total = 0;
      //   element.all(by.css('.month')).then(function(arr){
      //     expect(arr.length).toEqual(num_months);
      //     expect(1).toEqual(arr[0].getText());
      //     // for (i = 0; i < num_months; i++){
      //     //   if (i % 12 === 0){
      //     //     if (i !== 0){
      //     //       years.push(total/num_valid_months);
      //     //     }
      //     //     num_valid_months = 0;
      //     //     total = 0;
      //     //   }
      //     //   if (arr[i].getText() !== ""){
      //     //     num_valid_months++;
      //     //     expect(1).toEqual(arr[0].getText());
      //     //     total += Number(arr[i].getText());
      //     //   }
      //     // }
      //     expect(years[0]).toEqual(171);
      //   });
      //   // element.all(by.css('.calendar_amc')).then(function(amc_arr){
      //   //   expect(2).toEqual(amc_arr.length);
      //   //   for (i = 0; i < amc_arr.length; i++){
      //   //     expect(years[i]).toEqual(amc_arr[i].getText());
      //   //   }
      //   // });
      // });
      // it("show average monthly consumption for each fiscal year",function(){

      // });
      // it("show average monthly consumption for past 6 months",function(){

      // });
      // it("show average monthly consumption for past 12 months",function(){

      // });
      // it("show average monthly consumption to date",function(){

      // });
    });
  });
});
