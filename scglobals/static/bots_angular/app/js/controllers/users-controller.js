angular.module('SupplyChainApp.UsersCtrl', []).
controller('UsersCtrl', [
	'$scope', 
	'$location', 
	"ServerDataService", function($scope,$location,ServerDataService) {

		$scope.users_pagination_config = {
		  itemsPerPage : 30,
		  url : "/api/v1/userpreferences/?format=json",

		  callback : function(data){
		    $scope.userpreferences = data["objects"];
	      $scope.tastypiemeta = data["meta"];
		  }
		};


		$scope.done_editing = function(){
			// gotta be a better way to do this in angular
			// window.location.reload();
			$("#edit_user_modal").modal("hide");
		};
		$scope.edit_user = function(user){
			$scope.editinguser = user;
			$("#edit_user_modal").modal();
		};
}]);