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
			$http.get("/report.json?location=" + $scope.location.id + "&category=&report_type=Inventory&itemlot_level=true&date=" +$filter('date')($scope.date, "yyyy-MM-dd")).then(function(data){
				$scope.report_rows = data.data;
			});
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
	}]);