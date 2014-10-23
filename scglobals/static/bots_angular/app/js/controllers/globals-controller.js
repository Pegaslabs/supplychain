angular.module('SupplyChainApp.GlobalCtrl', []).
controller('GlobalCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$location',
    'ServerDataService',
    function($scope,$rootScope,$http,$location,ServerDataService) {
    	$(document).keydown(function(e) {
            var _target = $(e.target);
            var _focused = $(document.activeElement);
            var _inputting = _focused.get(0).tagName.toLowerCase()==="textarea" || _focused.get(0).tagName.toLowerCase()==="input";

            // / (forward slash) key = search
            if (!_inputting && e.keyCode===191) {
                e.preventDefault();
                $(".item_search_input").focus();
                return;
            }
        });

    	var select_item = function(item){
    		if (item.resource_type === "Item"){
    			$location.path("/item/" + item.id + "/").search({});
    		}
            else if (item.resource_type === "Shipment"){
    			$location.path("/shipment/" + item.id + "/").search({});
    		}
            else if (item.resource_type === "Patient"){
    			$location.path("/shipments/").search({"location" : item.id,"location_name" : item.name});
    		}
            else{
    			$location.path("/shipments/").search({"location" : item.id, "location_name" : item.name});
    		}
    	}
    	$scope.item_search_config = {
    		placeholder : "Search items, locations, shipments, patients. e.g. 100, or shipment 100",
    		add_new : false,
    		input_class : "item_search_input",
    		url : "/api/v1/search/?format=json&order_by=name_lower",
    		result_name : "results",
    		select_result : select_item
    	};
    }]
);

angular.module('SupplyChainApp.HomeCtrl', []).
controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.tabs = {1 : true, 2: false, 3: false};
	$scope.tab_switch = function(tab){
		for (var i in $scope.tabs){
			$scope.tabs[i] = false;
		}
		$scope.tabs[tab] = true;
	};

	// expiring in next six months
	var today = new Date();
	var six_months_later = today.addDays(180).serialize_date();
	today = today.serialize_date();
	var url = "/report.json?location=1&report_type=Expirations&date=" + today + "&end_date="  + six_months_later;
	$scope.loading_report = true;
	$scope.report_rows = [];
	$http.get(url).success(function(data) {
		$scope.loading_report = false;
		$scope.report_rows = data;
	}).error(function(data){
		$("#server_error").removeClass("hide");
		$scope.loading_report = false;
	});

	// data quality
	var url = "/report.json?location=1&report_type=dquality&date=" + today;
	$scope.loading_quality = true;
	$scope.dquality_report_rows = [];
	$http.get(url).success(function(data) {
		$scope.loading_quality = false;
		$scope.dquality_report_rows = data;
	}).error(function(data){
		$("#server_error").removeClass("hide");
		$scope.loading_quality = false;
	});

}]);

angular.module('SupplyChainApp.LoginCtrl', []).
controller('LoginCtrl', ['$scope', '$http','$location', '$rootScope', function($scope, $http, $location, $rootScope) {
	$("#username").focus();
	$scope.login = function(user){
		$location.search({});
		$scope.user_pass_missing = false;
		$scope.user_pass_wrong = false;
		if (user !== undefined && "username" in user && "password" in user){
			var url = "accounts/signin/";
			$http.post(url, user).success(function(data) {
				if(!data.success){
					$scope.user_pass_wrong = true;
				}
				else{
					// not actually how "logged_in" is set. django sets the sesh tolken
					// in above post and api disallows any data to be sent if it's not
					$rootScope.logged_in = true;
					$http.get("/api/v1/userpreferences/?format=json&limit=1&username=" + user.username).success(function(data) {
						$rootScope.userpreferences = data["objects"][0];
					});
					document.cookie = "username=" + user.username;
					$location.path('/dash');
				}
			});
		}
		else{
			$scope.user_pass_missing = true;
		}
	};
}]);
