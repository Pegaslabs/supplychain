angular.module('SupplyChainApp.ItemCtrl', []).
controller('ItemCtrl', ['$scope', '$rootScope', '$http', '$filter', "$location", "$routeParams", "ServerDataService", "UtilsService", function($scope,$rootScope,$http,$filter,$location,$routeParams,ServerDataService,UtilsService) {

	$scope.limit = 10;
	$scope.tabs = {1 : true, 2: false, 3: false,4: false};
	$scope.years = [];
	var stockchanges_url = "/api/v1/stockchange/?format=json&include_shipment=true&itemlot__item=" + $routeParams['itemId'] + "&order_by=-date&order_by=qty&order_by=-id&shipment__active=true";
	Date.prototype.addDays = function(days)
	{
		var dat = new Date(this.valueOf());
		dat.setDate(dat.getDate() + days);
		return dat;
	}
	// get today
	var d = new Date();
	var today = d.getFullYear() + "-" + (Number(d.getMonth()) + 1) + "-" + d.getDate();

	var url = '/api/v1/item/' + $routeParams['itemId'] + "?format=json";
	$http({method: 'GET', url: url }).success(function (data) {
		$scope.item = data;
		if ("location" in $location.search()){
			ServerDataService.get("location",$location.search()['location']).then(function(data){
				$scope.curr_location = data;
				$scope.show_header = true;
				load_stockchanges();
			});
		}
		else {
			$scope.curr_location = $rootScope.userpreferences.default_location;
			$location.search({"location" : $scope.curr_location.id});
		}
	}).error(function(data){
		$("#server_error .error_text").text("Something went wrong, please contact the server administrator. Technical details:" + data["error_message"]);
    $("#server_error").removeClass('hide');
	});
	var items_url = '/api/v1/item/' + $routeParams['itemId'] + "?format=json&soh_by_location=" + today + "&" + $location.url().split("?")[1] + "&location_type_inventory=true";
	$http({method: 'GET', url: items_url }).success(function (data) {
		$scope.items_by_site = data["locations"];
	});

	var items_url = '/api/v1/item/' + $routeParams['itemId'] + "?format=json&soh_by_location=" + today + "&" + $location.url().split("?")[1];
	$http({method: 'GET', url: items_url }).success(function (data) {
		$scope.items_by_site_dispensary = data["locations"];
	});

	var load_stockchanges = function(){
		$scope.paginate(1);
		var start_year = 2013;
		var end_year = d.getFullYear();
		var years_to_load = (end_year - start_year) + 1;
		for (var i = start_year; i <= end_year; i++){
			(function(i) {
				var monthly_consumption_url = "/api/v1/item/"+ $routeParams['itemId'] +"/?format=json&monthly_consumption_by_year=" + i + "&" +  $location.url().split("?")[1];
				$http({method: 'GET', url: monthly_consumption_url }).success(function (data) {
					var valid_months = [];
					var total = 0;
					var avg = 0;
					for (m in data['monthly_consumption_by_year']){
						if (data['monthly_consumption_by_year'][m] !== null){
							valid_months.push(data['monthly_consumption_by_year'][m]);
							total += data['monthly_consumption_by_year'][m];
						}
					}
					if (valid_months.length > 0){
							avg = total / valid_months.length;
					}
					$scope.years.push({"year" : i, "months" : data['monthly_consumption_by_year'], "amc" : avg, "valid_months" : valid_months});
					years_to_load -= 1;
					if (years_to_load === 0){
						$scope.loading_years_complete = true;
						$scope.years.sort(function(a,b){return b.year - a.year});
						var last_two_years = $scope.years[0].valid_months.concat($scope.years[1].valid_months.reverse());
						var total = 0;
						for (j = 0; j < 6; j++){
							total += last_two_years[j];
						}
						$scope.last_six_months_amc = total/6;
						total = 0;
						for (j = 0; j < 12; j++){
							total += Number(last_two_years[j]);
						}
						$scope.last_twelve_months_amc = total/12;
						total = 0;
						count = 0;
						for(i in last_two_years){
							total += last_two_years[i];
							count++;
						}
						if(count){
							$scope.to_date_amc = total/count;
						}
					}
				});
			})(i);
		}
	};


	$scope.done_editing = function(){
		// gotta be a better way to do this in angular
		// window.location.reload();
		$("#edit_item_modal").modal("hide");
	};
	$scope.edit_item = function(){
		$("#edit_item_modal").modal();
	};

	$scope.paginate = function(page_num){
		$scope.item_pagination_config = {
			url : stockchanges_url,
			url_search : $location.url().split("?")[1],
			itemsPerPage : 15,
			callback : function(data){
				$scope.stockchanges = data['objects'];
				calculate_soh($scope.stockchanges);
				if($location.search()['itemlot']){
					if($scope.stockchanges[0]){
						$scope.itemlot_filter = $scope.stockchanges[0]["itemlot"];
					}
					else{

					}
				}
			}
		};
	};
	if($location.url().split("?")[1]){
		var itemlot_url = "/api/v1/itemlot/?format=json&item=" + $routeParams['itemId']+ "&soh=" + today + "&" + $location.url().split("?")[1];
		$scope.itemlots_pagination_config = {
			itemsPerPage : 100,
			url : itemlot_url,
			callback : function(data){
				$scope.itemlots = data["objects"];
				$scope.loading_itemlots = false;
			}
		};
	}
	$scope.tab_switch = function(tab){
		for (var i in $scope.tabs){
			$scope.tabs[i] = false;
		}
		$scope.tabs[tab] = true;
	};
	$scope.change_loc = function(loc_id){
		$location.search("location",loc_id);
	};
	$scope.filter_itemlot = function(itemlot_id){
		$location.search('itemlot', itemlot_id);
	};
	$scope.remove_itemlot_filter = function(){
		$location.search('itemlot', null);
	}
	// this should be done server side if we need to export server side
	// this is to calculate resulting stock on hand, necessary because
	// stock changes on the same day have the exact same datetime stamp. 
	// having the user set the hour seemed like a lot, and could end in the same
	// problem if the same time is selected

	var calculate_soh = function(scs){
		var i = scs.length;
		while(i--){
			// if it's the stockchange at the bottom of the page, there could be stock changes 
			// behind it that are on the same day. 
			// to calculate what that sc result should be, subtracking any stock changes above it 
			// from the end of the day qty (the server side soh on that day) will result in what this qty 
			// should be
			if (Number(i) === scs.length-1){
				var j = i;
				var same_days = 0;
				while(j--){
					if (scs[j].date.split("T")[0] === scs[i].date.split("T")[0]) {
						same_days += scs[j].qty;
					}
					else{
						break;
					}
				}
				scs[i].soh = scs[i].soh - same_days;
			}
			else{
				scs[i].soh = scs[i+1].soh + scs[i].qty;
			}
		}
	};
	// won't work on IEs, would have to build server side
	$scope.download = function(page){
		var scs = [];
		var create_csv = function(){
			var rows = [];
			var row = [];
			// comma regex pattern to strip
			var i = scs.length;
			while(i--){
				row = [];
				row.push($filter('date')(scs[i].date, "yyyy-MM-d"));
				row.push(scs[i].change_type);
				row.push(scs[i].shipment.name.replace(/,/g,""));
				row.push(scs[i].shipment.from_location.replace(/,/g,""));
				row.push(scs[i].shipment.to_location.replace(/,/g,""));
				row.push(scs[i].itemlot.id);
				if (scs[i].itemlot.lot_num){
					row.push(scs[i].itemlot.lot_num.replace(/,/g,""));
				}
				else{
					row.push("");
				}
				if(scs[i].itemlot.expiration){
					row.push($filter('date')(scs[i].itemlot.expiration, "yyyy-MM-d"));
				}
				else{
					row.push("");
				}
				row.push(scs[i].qty);
				row.push(scs[i].soh);
				row.push(scs[i].user.username.replace(/,/g,""));
				rows.unshift(row);
			}
			row = ["Date","Change Type","Shipment","From","To","System Lot ID","Lot Number","Expiration Date","Quantity Change","Stock Balance","User"];
			rows.unshift(row);
            UtilsService.download_array(rows,$scope.item.name + " " + $scope.item.category.name + " at " + $scope.curr_location.name + ".xls");
			// var csvString = rows.join("%0A");
			// var a         = document.createElement('a'); 
			// a.href        = 'data:attachment/csv,' + csvString;
			// a.target      = '_blank';
			// a.download    = $scope.item.name + " " + $scope.item.category.name + " at " + $scope.curr_location.name + ".xls";
			// document.body.appendChild(a);
			// a.click();
		};
		if (page){
			scs = $scope.stockchanges;
			create_csv();
		}
		else{
			// get all scs from server
			$scope.loading_all = true;
			$http({method: 'GET', url: stockchanges_url + "&limit=0&" + $location.url().split("?")[1] }).success(function (data) {
				scs = data["objects"];
				calculate_soh(scs);
				$scope.loading_all = false;
				create_csv();
			});
		}
	};
}]);