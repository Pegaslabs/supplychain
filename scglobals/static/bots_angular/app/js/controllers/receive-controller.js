angular.module('SupplyChainApp.ReceiveCtrl', []).
controller('ReceiveCtrl', ['$scope', '$http', "$location", "$filter", "ServerDataService", "UtilsService", function($scope, $http,$location,$filter,ServerDataService,UtilsService) {
	$scope.total_price = 0;
	$scope.page_price = 0;
	$scope.limit = 100;
	$scope.itemlots = [];

	$scope.affected_stockchanges_pagination_config = {};
	// **** Load existing shipment or start new ****
	if ("shipment" in $location.search()){
		var itemlot_url = "/api/v1/itemlot/?format=json&shipment=" + $location.search()['shipment'];
		$scope.itemlots_pagination_config = {
			itemsPerPage : $scope.limit,
			url : itemlot_url,
			callback : function(data){
				$scope.pagination_data = UtilsService.getPagination(data["meta"], data["objects"].length);
				$scope.itemlots = data["objects"];
				for (var i in $scope.itemlots){
					$scope.page_price += ($scope.itemlots[i].unit_price * $scope.itemlots[i].qty);
				}
				$('.add_item_input').focus();
			}
		};
		ServerDataService.get("shipment",$location.search()['shipment']).then(function(data){
			$scope.shipment = data;
			$scope.total_price = Number($scope.shipment.price);
			var js_date = new Date(new Date($scope.shipment.date).toDateString());
			var today = new Date(new Date().toDateString());
			$scope.future_date = (js_date > today) ? true : false;
			$scope.editing_date = false;
			$scope.editing_name = false;
			$scope.editing_to_location = false;
			$scope.editing_from_location = false;
			$scope.show_results = true;
		});
	}
	else{
		$scope.shipment = {};
		$scope.editing_date = true;
		$scope.editing_name = true;
		$scope.editing_to_location = true;
		$scope.editing_from_location = true;
		$scope.show_results = true;
		$(".delivery_note").focus();
	}
	$scope.add_from_location_toggle = function(from_location){
		$scope.new_from_location_name = from_location;
		$("#add_from_location_modal").modal();
	};
	$scope.submit_from_location = function(location){
		$scope.shipment.from_location = location;
		if ($scope.shipment.id){
			var serialized_shipment = {
				"id" : $scope.shipment.id,
				"from_location" : "/api/v1/location/" + $scope.shipment.from_location.id + "/"
			};
			ServerDataService.update('shipment',serialized_shipment);
		}
		else{
			$scope.try_create_new_shipment();
		}
		$scope.editing_from_location = false;
		$scope.show_from_location_query = false;
		$(".to_location_input").focus();
	};

	$scope.edit_from_Location = function(){
		$scope.editing_from_location = true;
		$scope.from_location_q = "";
	};
	$scope.from_location_search_config = {
		placeholder : "Supplier name, e.g. NDSO",
		url : "/api/v1/location/?format=json&order_by=name&location_type=S",
		result_name : "location",
		input_class : "from_location_input",
		select_result: $scope.submit_from_location,
		add_results : true,
		add_result : $scope.add_from_location_toggle
	};
	$scope.submit_to_location = function(location){
		$scope.shipment.to_location = location;
		if ($scope.shipment.id){
			var serialized_shipment = {
				"id" : $scope.shipment.id,
				"to_location" : "/api/v1/location/" + $scope.shipment.to_location.id + "/"
			};
			ServerDataService.update('shipment',serialized_shipment);
		}
		else{
			$scope.try_create_new_shipment();
		}
		$scope.editing_to_location = false;
		$scope.show_to_location_query = false;
	};
	$scope.add_to_location_toggle = function(to_location){
		$scope.new_to_location_name = to_location;
		$("#add_to_location_modal").modal();
	};
	$scope.to_location_search_config = {
		placeholder : "Clinic name, e.g. Nohana",
		url : "/api/v1/location/?format=json&order_by=name&location_type__in=I",
		result_name : "location",
		select_result: $scope.submit_to_location,
		input_class : "to_location_input",
		add_results : true,
		add_result : $scope.add_to_location_toggle
	};


	// **** Edit shipment details ****

	$scope.submit_name = function(){
		if($scope.shipment){
			// submit edit
			if($scope.shipment.name){
				if ($scope.shipment.id){
					var serialized_shipment = {
						"id" : $scope.shipment.id,
						"name" : $scope.shipment.name
					};
					ServerDataService.update('shipment',serialized_shipment);
				}
				else{
					$scope.try_create_new_shipment();
				}
				$scope.editing_name = false;
			}
		}
	};
	$scope.edit_name = function(){
		$scope.editing_name = true;
		$(".delivery_note").focus();
	};

	$scope.submit_date = function(){
		if ($scope.shipment.date){
			// validate
			$scope.bad_date = !UtilsService.validate_date($scope.shipment.date);
			// submit edit
			if (!$scope.bad_date){
				$scope.shipment.date = UtilsService.get_js_date($scope.shipment.date);
				$scope.future_date = ($scope.shipment.date > new Date()) ? true : false;
				if ($scope.shipment.id){
					var serialized_shipment = {
						"id" : $scope.shipment.id,
						"date" : $scope.shipment.date
					};
					ServerDataService.update('shipment',serialized_shipment).then(function(){
						$scope.shipment.date = $filter('date')($scope.shipment.date, "MMMM d, yyyy");
					});
				}
				else{
					$scope.try_create_new_shipment();
				}
				$scope.editing_date = false;
			}
		}
	};
	$scope.edit_date = function(){
		$scope.shipment.date = $filter('date')($scope.shipment.date, "dd/MM/yy");
		$scope.editing_date = true;
	};

	$scope.add_from_location = function(from_location_name){
		if (from_location_name !== ""){
			ServerDataService.save('location',{"name" : from_location_name, "location_type" : "S"}).then(function(data){
				$scope.shipment.from_location = data;
				$("#add_from_location_modal").modal("hide");
				$scope.editing_from_location = false;
				$scope.show_from_location_query = false;
				$scope.try_create_new_shipment();
			});
		}
	};

	$scope.edit_to_location = function(){
		$scope.editing_to_location = true;
		$scope.to_location_q = "";
	};

	$scope.add_to_location = function(to_location_name,location_type){
		if (to_location_name !== ""){
			ServerDataService.save('location',{"name" : to_location_name, "location_type" : location_type}).then(function(data){
				$scope.shipment.to_location = data;
				$("#add_to_location_modal").modal("hide");
				$scope.editing_to_location = false;
				$scope.show_to_location_query = false;
				$scope.try_create_new_shipment();
			});
		}
	};

	$scope.try_create_new_shipment = function(){
		if (!$scope.shipment.id){
			if ($scope.shipment.date && $scope.shipment.to_location && $scope.shipment.from_location){
				var serialized_shipment = {
					"date" : $scope.shipment.date,
					"to_location" : "/api/v1/location/" + $scope.shipment.to_location.id + "/",
					"from_location" : "/api/v1/location/" + $scope.shipment.from_location.id + "/",
					"shipment_type" : "R",
					"name" : $scope.shipment.name
				};
				ServerDataService.save('shipment',serialized_shipment).then(function(data){
					$scope.shipment = data;
					$location.search("shipment", data.id);
				});
			}
		}
	};

	// **** Adding/editing items to shipment ****


	$scope.add_item = function(item){
		$scope.add_item_results = [];
		$scope.show_item_query = false;
		$scope.add_item_q = "";
		$scope.editing_itemlot = {};
		$scope.editing_itemlot.item = item;
		$('#edit_itemlot_modal').modal();
		$("#qty").focus();
	};
	$scope.create_item = function(new_item_name){
		$scope.new_item = {};
		$scope.new_item.name = new_item_name;
		$scope.new_item.dispense_size = 1;
		$('#add_item_modal').modal();
	};
	$scope.item_search_config = {
		placeholder : "item name, e.g. Amoxicillin",
		add_results : true,
		add_result : $scope.create_item,
		url : "/api/v1/item/?format=json&order_by=name_lower&limit=10",
		result_name : "item",
		input_class : "add_item_input",
		select_result : $scope.add_item
	};
	$scope.select_category = function(category){
		$scope.new_item.category = category;
		$scope.show_category_query = false;
	};
	$scope.change_category = function(){
		$scope.new_item.category = undefined;
		$scope.show_category_query = true;
	};
	$scope.add_category = function(category_q){
		if (category_q){
			var category = {"name" : category_q};
			ServerDataService.save('itemcategory',category).then(function(data){
				$scope.new_item.category = data;
				$scope.show_category_query = false;
			});
		}
	};
	$scope.category_search_config = {
		placeholder : "Category name, e.g. Tables and capsules",
		add_results : true,
		add_result : $scope.add_category,
		input_class : "category_search_input",
		url : "/api/v1/itemcategory/?format=json&order_by=name&limit=10",
		result_name : "category",
		select_result : $scope.select_category
	};
	$scope.submit_new_item = function(){
		if($scope.new_item && $scope.new_item.name && $scope.new_item.category){
			var serialized_item = {
				"name" : $scope.new_item.name,
				"category" : {"id" : $scope.new_item.category.id},
				"dispense_size" : $scope.new_item.dispense_size,
			};
			ServerDataService.save('item',serialized_item).then(function(data){
				$scope.new_item = data;
				$scope.show_category_query = false;
				$scope.add_item($scope.new_item);
				$("#add_item_modal").modal("hide");
				$($('.add_item_input')[0]).focus();
			});
		}
	};
	$scope.check_affected = function(itemlot){
		if ($scope.shipment.active && itemlot.id){
			$scope.show_affected = false;
			$http.get("/api/v1/stockchange/?format=json&limit=5&order_by=-date&itemlot=" +  itemlot.id).success(function(data){
				var total_count = data["meta"]["total_count"];
				$scope.affected_stockchanges = [];
				for (counter in data["objects"]){
					if (data["objects"][counter].shipment !==itemlot.shipment){
						$scope.affected_stockchanges.push(data["objects"][counter]);
					}
					else{
						total_count -= 1;
					}
				}
				$scope.affected_stockchanges_total_count = total_count;
				if ($scope.affected_stockchanges_total_count === 0){
					$scope.affected_stockchanges.push({});
				}
				$scope.show_affected = true;
			});
		}
	};
	$scope.edit_itemlot = function(itemlot){
		$("#qty").focus();
		$scope.check_affected(itemlot);
		$scope.editing_itemlot = itemlot;
		$scope.editing_itemlot.curr_qty = itemlot.qty;
		if ($scope.editing_itemlot.expiration){
			$scope.editing_itemlot.expiration = $filter('date')($scope.editing_itemlot.expiration, "dd/MM/yy");
		}
		$('#edit_itemlot_modal').modal();
	};
	$scope.submit_edit = function(itemlot){
		// validate required
		itemlot.invalid_qty = !isNumeric(itemlot.qty) || itemlot.qty <= 0;
		// validate not required
		itemlot.invalid_expiration = (itemlot.expiration) ? !UtilsService.validate_date(itemlot.expiration) : false;
		if (itemlot.expiration && !itemlot.invalid_expiration){
			itemlot.expiration = UtilsService.get_js_date(itemlot.expiration);
		}
		itemlot.invalid_unit_price = (itemlot.unit_price) ? !isNumeric(itemlot.unit_price) : false;
		if (!itemlot.invalid_expiration && ! itemlot.invalid_qty && !itemlot.invalid_unit_price){
			if (!itemlot.id){
				var new_item_lot = true;
			}
			else{
				var new_item_lot = false;
				if ($scope.shipment.active){
					if ($scope.editing_itemlot.curr_qty > itemlot.qty){
					}
				}
			}
			$scope.itemlot_loading = true;
			var serialized_itemlot = {
				"id" : itemlot.id,
				"item" : "/api/v1/item/" + itemlot.item.id + "/",
				"shipment" : "/api/v1/shipment/" + $scope.shipment.id + "/",
				"date" : $scope.shipment.date,
				"qty" : itemlot.qty,
				"expiration" : itemlot.expiration,
				"lot_num" : itemlot.lot_num,
				"unit_price" : itemlot.unit_price
			};
			ServerDataService.save('itemlot',serialized_itemlot).then(function(data){
				itemlot = data;
				$('#edit_itemlot_modal').modal("hide");
				$('.add_item_input').val("");
                $('.add_item_input').focus();
				if (new_item_lot){
					// new page? (new shipment, page hasn't been reloaded)
					if (!$scope.pagination_data){
						$scope.pagination_data = {};
						$scope.pagination_data.page_start = 1;
						$scope.pagination_data.page_end = 1;
						$scope.pagination_data.total_count = 1;
					}
					else{
						$scope.pagination_data.page_end += 1;
						$scope.pagination_data.total_count += 1;
					}
					if(!$scope.itemlots){
						$scope.itemlots = [];
					}
					$scope.total_price += (itemlot.qty * itemlot.unit_price);
					$scope.page_price += (itemlot.qty * itemlot.unit_price);
					$scope.itemlots.unshift(itemlot);
				}
				// not a new item
				else{
					// because the item lot is an angular model item, i don't know the difference 
					// when a user edits the price. So this bad hack calculates the new price of the 
					// page for which we have itemlots for in scope (e.g. 100 items out of the 458) and  
					// adds/removes that difference the total price of the shipment.
					var new_page_price = 0;
					for (var i in $scope.itemlots){
						new_page_price += ($scope.itemlots[i].unit_price * $scope.itemlots[i].qty);
					}
					var page_price_difference = new_page_price - $scope.page_price;
					$scope.page_price = new_page_price;
					$scope.total_price += page_price_difference;
				}
				$scope.itemlot_loading = false;
			});
}
};

$scope.delete_itemlot_confirm = function(itemlot){
	$scope.deleting_itemlot = itemlot;
	$scope.check_affected(itemlot);
	$("#delete_itemlot_modal").modal();
};
$scope.delete_itemlot = function(itemlot){
	$scope.delete_itemlot_loading = true;
	for (i in $scope.itemlots){
		if ($scope.itemlots[i] === itemlot){
			if (itemlot.id){
				ServerDataService.delete_id("itemlot", itemlot.id).then(function(data){
					$scope.delete_itemlot_loading = false;
					$("#delete_itemlot_modal").modal("hide");
					$scope.pagination_data.page_end -= 1;
					$scope.pagination_data.total_count -= 1;
				});
			}
			$scope.total_price -= (itemlot.unit_price * itemlot.qty);
			$scope.page_price -= (itemlot.unit_price * itemlot.qty);
			for (var counter in $scope.itemlots){
				if ($scope.itemlots[counter] === itemlot){
					$scope.itemlots.splice(counter,1);
					break;
				}
			}
			if ($scope.itemlots.length === 0){
				$scope.itemlots = undefined;
			}
			break;
		}
	}
};
$scope.activate_shipment = function(){
	var serialized_shipment = {
		"id" : $scope.shipment.id,
		"active" : true
	};
	ServerDataService.update("shipment",serialized_shipment).then(function(data){
		$("#confirm_shipment_modal").modal("hide");
		$location.path("/shipment/" + data.id).search({});
	});
};

$scope.delete_shipment = function(){
	ServerDataService.delete_id("shipment",$scope.shipment.id).then(function(data){
		$("#delete_shipment_modal").modal("hide");
		$location.path("/shipments").search({"shipment_type" : "R", "active" : "false"});
	});
};

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}
var isNumeric = function (n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};
}]);