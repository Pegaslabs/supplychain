// pageobjects... sure.

var base_url = "http://localhost:8000/";

var LoginPage = function() {
	this.username_input = element(by.model('user.username'));
	this.password_input = element(by.model('user.password'));
	this.error_text = $(".user_pass_wrong");
	this.header = $('h3');
	this.get = function() {
		browser.get(base_url);
	};
	this.set_username = function(username) {
		this.username_input.sendKeys(username);
	};
	this.set_password = function(password) {
		this.password_input.sendKeys(password);
	};
	this.submit = function(){
		$(".log-in-submit").click();
	};
};

describe('login page', function() {

	var login_page = new LoginPage();
	beforeEach(function() {
      login_page.get();
    });

	it('should ask the user to log in', function() {
		expect(login_page.header.getText()).toEqual("Inventory Management Log on");
	});

	it('should reject the wrong username & password', function() {
		login_page.set_username("bill");
		login_page.set_password("pass");
		login_page.submit();
		expect(login_page.error_text.isDisplayed()).toEqual(true);
		login_page.set_username("kevin");
		login_page.set_password("yay");
		login_page.submit();
		expect(login_page.error_text.isDisplayed()).toEqual(true);
	});

	it('should accept the right username & password', function() {
		login_page.set_username("kevin");
		login_page.set_password("pass");
		login_page.submit();
		expect($('h3').getText()).toEqual("Dashboard -- Central Warehouse");
	});
});

module.exports = new LoginPage();