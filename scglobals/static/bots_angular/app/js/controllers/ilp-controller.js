angular.module('SupplyChainApp.IlpCtrl', []).
controller('IlpCtrl', [
	'$scope', 
	'$location', 
	"ServerDataService", function($scope,$location,ServerDataService) {

		$scope.tabs = {1 : true, 2: false, 3: false};
		$scope.tab_switch = function(tab){
			for (var i in $scope.tabs){
				$scope.tabs[i] = false;
			}
			$scope.tabs[tab] = true;
		};

		$scope.items_pagination_config = {
		  itemsPerPage : 30,
		  url : "/api/v1/item/?format=json&order_by=name_lower",

		  callback : function(data){
		    $scope.items = data["objects"];
	        $scope.tastypiemeta = data["meta"];
		  }
		};


		$scope.done_editing = function(){
			// gotta be a better way to do this in angular
			// window.location.reload();
			$("#edit_item_modal").modal("hide");
		};
		$scope.edit_item = function(item){
			$scope.item = item;
			$("#edit_item_modal").modal();
		};


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

		$scope.patients_pagination_config = {
		  itemsPerPage : 30,
		  url : "/api/v1/patient/?format=json&order_by=-created",

		  callback : function(data){
		    $scope.patients = data["objects"];
	        $scope.tastypiemeta = data["meta"];
		  }
		};

}]);