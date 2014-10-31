angular.module('SupplyChainApp.viewPatientDirective', []).
directive('viewPatientDirective', 
    ["$rootScope",
    "ServerDataService", 
    function($rootScope,ServerDataService) {
        return {
            restrict:'A',
            scope : { "patientLocation" : "=" },
            link: function($scope, element, attrs){
                ServerDataService.list("patient",{"location" : $scope.patientLocation.id}).then(function(response){
                    if (response.objects.length === 0) throw new Error("Data corruption: location w/ type P should have a patient.");
                    $scope.patient = response.objects[0];
                    $scope.patient.name = $scope.patientLocation.name;
                });
                $scope.edit_patient_toggle = function(){
                    $("#edit_patient_modal").modal();
                };
            },
            templateUrl:"static/bots_angular/app/views/directives/view-patient-directive.html"
    };
}]);