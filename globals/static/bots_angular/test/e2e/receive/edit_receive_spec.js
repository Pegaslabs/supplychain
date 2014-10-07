describe('edit receive shipments', function() {
    var test_utils = require("../e2e_utils.js");
    var edit_receive_page = require('./edit_receive_page.js');
    edit_receive_page.get("t","Boston","Central Warehouse");

    it('should invite the user to add an item ', function() {
        edit_receive_page.get("t","Boston","Central Warehouse");
        expect($(".add_item").isDisplayed()).toEqual(true);
    });
    describe('when creating a new item',function(){
        it('should allow creating a new item on an existing category',function(){
            edit_receive_page.select_new_item("yay new test item!!", "ARV's");
            expect(edit_receive_page.add_item_window.isDisplayed()).toEqual(true);
            edit_receive_page.submit_qty(10);
            edit_receive_page.submit_item();
            expect(element(by.repeater('itemlot in itemlots').row(0).column("item.name")).getText()).toEqual('yay new test item!!');
            expect(element(by.repeater('itemlot in itemlots').row(0).column("item.category.name")).getText()).toEqual('ARV\'S PREPARATIONS');
            $("#delete_itemlot_confirm").click()
            $("#submit_delete").click();
        });
        it('should allow creating a new item on a new category',function(){
            edit_receive_page.select_new_item_cat("yay!! different new test item!!", "yay new test cat!!");
            expect(edit_receive_page.add_item_window.isDisplayed()).toEqual(true);
            edit_receive_page.submit_qty(10);
            edit_receive_page.submit_item();
            expect(element(by.repeater('itemlot in itemlots').row(0).column("item.name")).getText()).toEqual('yay!! different new test item!!');
            expect(element(by.repeater('itemlot in itemlots').row(0).column("item.category.name")).getText()).toEqual('yay new test cat!!');
            $("#delete_itemlot_confirm").click()
            $("#submit_delete").click();
        });
    });
    describe('when adding an itemlot on an exsiting item', function() {
        it('should allow entering details on an existing item', function() {
            edit_receive_page.select_item("Amoxicillin");
            expect(edit_receive_page.add_item_window.isDisplayed()).toEqual(true);
            $('#edit_itemlot_modal .close').click();
        });
        it('should allow entering qty only, and submit the item', function() {
            edit_receive_page.select_item("Amoxicillin");
            edit_receive_page.submit_qty(5);
            edit_receive_page.submit_item();
            expect(element(by.repeater('itemlot in itemlots').row(0).column("qty")).getText()).toEqual('5');
        });
        it('should allow entering qty & batch number only', function() {
            edit_receive_page.select_item("Dapson");
            edit_receive_page.submit_qty(3);
            edit_receive_page.submit_expiration("4/1/2015");
            edit_receive_page.submit_item();
            expect(element(by.repeater('itemlot in itemlots').row(0).column("qty")).getText()).toEqual('3');
            expect(element(by.repeater('itemlot in itemlots').row(0).column("expiration")).getText()).toEqual(test_utils.get_display_date("1/4/2015"));
        });
        it('should allow entering every field',function(){
            edit_receive_page.add_item('Amoxic', 40,"1/1/18","test lot num",15);
        });
        it('should allow creating a new item on a new category, entering every field, then using that item',function(){
            edit_receive_page.add_new_item_cat("Test Item", "Test Category", 40,"1/1/18","test lot num",15);
            edit_receive_page.add_item("Test Item", 10,"15/1/2013","test lot num",15);
        });
    });
});
