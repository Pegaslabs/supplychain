angular.module('SupplyChainApp.ItemsCtrl', []).
controller('ItemsCtrl', [
	'$scope', 
	'$location', 
	"ServerDataService", function($scope,$location,ServerDataService) {

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

}]);