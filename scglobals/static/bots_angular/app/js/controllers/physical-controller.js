angular.module('SupplyChainApp.PhysicalCtrl', []).
controller('PhysicalCtrl', [
	'$scope', 
	'$filter',
	'$http',
	'$location',
	'UtilsService', 
	"ServerDataService", function($scope,$filter,$http,$location,UtilsService,ServerDataService) {

		$scope.editing_date = true;
		$scope.editing_location = true;

		$scope.submit_date = function(){
		        // validate
		        if($scope.date){
		          $scope.bad_date = !UtilsService.validate_date($scope.date);
		          // submit edit
		          if (!$scope.bad_date){
		            $scope.date = UtilsService.get_js_date($scope.date);
		            $scope.editing_date = false;
		        }
		    }
		};

	    $scope.edit_date = function(){
	        $scope.date = $filter('date')($scope.date, "dd/MM/yy");
	        $scope.editing_date = true;
	    };


		$scope.submit_location = function(location){
			$scope.location=location;
			$scope.editing_location = false;
			$("#confirm_physical_modal").modal();
		};

		$scope.edit_Location = function(){
	        $scope.editing_location = true;
	    };

		$scope.location_search_config = {
			placeholder : "Location name, e.g. Lebakeng",
			url : "/api/v1/location/?format=json&order_by=name",
			result_name : "location",
			select_result: $scope.submit_location
		};

		var create_physical = function(){
			var debits_shipment = {
				"date" : $scope.date,
				"to_location" : "/api/v1/location/" + $scope.virtual_location.id + "/",
				"from_location" : "/api/v1/location/" + $scope.location.id + "/",
				"shipment_type" : "T",
			};
			var credits_shipment = {
				"date" : $scope.date,
				"to_location" : "/api/v1/location/" + $scope.location.id + "/",
				"from_location" : "/api/v1/location/" + $scope.virtual_location.id + "/",
				"shipment_type" : "R",
			};
			ServerDataService.update('shipment',{'objects' : [debits_shipment,credits_shipment]}).then(function(data){
				// need to find which is which from the response
				if (data.objects[0].to_location.name === $scope.virtual_location.name){
					$scope.debits_shipment = data.objects[0];
					$scope.credits_shipment = data.objects[1];
				}
				else{
					$scope.debits_shipment = data.objects[1];
					$scope.credits_shipment = data.objects[0];
				}
				var physicalinventory = {
					'location' : "/api/v1/location/" + $scope.location.id + "/",
					'date' : $scope.date,
					'debits_shipment' : "/api/v1/shipment/" + $scope.debits_shipment.id + "/",
					'credits_shipment' : "/api/v1/shipment/" + $scope.credits_shipment.id + "/"
				};
				ServerDataService.save('physicalinventory',physicalinventory).then(function(data){
					$location.path('/edit-physical/').search("physicalinventory", data.id);
				});
			});
		};

		$scope.confirm_physical = function(){
			$("#confirm_physical_modal").modal("hide");
			var virtual_location = {
				'location_type' : 'V',
				'name' : $scope.location.name + " Stock Count"
			};
			ServerDataService.list('location',{"name" : virtual_location.name}).then(function(data){
				if (data.objects.length > 0){
					$scope.virtual_location = data.objects[0];
					create_physical();
				}
				else{
					ServerDataService.save('location',virtual_location).then(function(data){
						$scope.virtual_location = data;
						create_physical();
					});
				}
			});
		};

	}]);