angular.module('SupplyChainApp.PatientsCtrl', []).
controller('PatientsCtrl', [
	'$scope', 
	'$location', 
	"ServerDataService", function($scope,$location,ServerDataService) {

		$scope.patients_pagination_config = {
		  itemsPerPage : 30,
		  url : "/api/v1/patient/?format=json&order_by=-created",

		  callback : function(data){
		    $scope.patients = data["objects"];
	        $scope.tastypiemeta = data["meta"];
		  }
		};

		$scope.done_editing = function(){
			// gotta be a better way to do this in angular
			// window.location.reload();
			$("#edit_patient_modal").modal("hide");
		};
		$scope.edit_patient = function(patient){
			$scope.patient = patient;
			$("#edit_patient_modal").modal();
		};


}]);