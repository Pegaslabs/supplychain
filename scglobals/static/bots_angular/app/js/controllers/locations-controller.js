angular.module('SupplyChainApp.LocationsCtrl', []).
controller('LocationsCtrl', [
	'$scope', 
	'$location', 
	"ServerDataService", function($scope,$location,ServerDataService) {

		$scope.locations_pagination_config = {
		  itemsPerPage : 30,
		  url : "/api/v1/location/?format=json&order_by=-created&location_type__in=I,D,S,V",

		  callback : function(data){
		    $scope.locations = data["objects"];
	        $scope.tastypiemeta = data["meta"];
		  }
		};

		$scope.donelocation = function(w){
			// gotta be a better way to do this in angular
			// window.location.reload();
			$("#edit_location_modal").modal("hide");
		};
		$scope.edit_location = function(editinglocation){
			$scope.editinglocation = editinglocation;
			$("#edit_location_modal").modal();
		};

}]);