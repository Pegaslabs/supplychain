angular.module('SupplyChainApp.editPatientDirective', []).
directive('editPatientDirective', 
    ["$rootScope",
    "UtilsService",
    "ServerDataService", 
    function($rootScope,UtilsService,ServerDataService) {
        return {
            restrict:'A',
            scope : { "patientLocation" : "=" },
            link: function($scope, element, attrs){
                $scope.$watch('patientLocation',function(){
                    if($scope.patientLocation){
                        ServerDataService.list("patient",{"location" : $scope.patientLocation.id}).then(function(response){
                            if (response.objects.length === 0) throw new Error("Data corruption: location w/ type P should have a patient.");
                            $scope.patient = response.objects[0];
                            $scope.patient.name = $scope.patientLocation.name;
                        });
                    }
                    else{
                        $scope.patient = {};
                    }
                });
                $scope.edit_dob = function(){
                    $scope.patient.dob = undefined;
                };
                $scope.submit_age = function(age){
                    if (age){
                    // givin in dd/mm/yy format
                    if (age.split("/").length > 1){
                        $scope.bad_age = !UtilsService.validate_date(age);
                        $scope.patient.dob = UtilsService.get_js_date(age);
                    }
                    else if (Number(age) >= 0 && Number(age) < 200){
                        $scope.bad_age = false;
                        // age given as integer will be stored as jan 1 of the year 
                        // that's today - (that int) * 365
                        var t_with_time = new Date('01/01/'+ new Date().addDays(0-(365*Number(age))).getFullYear());
                        var t_without_time = new Date(t_with_time.getFullYear() + "-" + (t_with_time.getMonth() + 1) + "-" + t_with_time.getDate());
                        $scope.patient.dob = t_without_time;
                    }
                    else{
                        $scope.bad_age = true;
                    }
                    if ($scope.bad_age){
                        $scope.patient.dob = undefined;
                    }
                }
            };
            // passing location because it might be new and therefore not yet in $scope.patientLocation
            var save_patient = function(location){
                $scope.patient.location = "/api/v1/location/" + location.id + "/";
                ServerDataService.save('patient',$scope.patient).then(function(data){
                    $("#add_patient_modal").modal("hide");
                    $scope.patientLocation = location;
                });
            };
            $scope.update_patient = function(){
                // editing existing patient
                if ($scope.patientLocation){
                    // name is stored on the location, not patient
                    if ($scope.patient.name !== $scope.patientLocation.name){
                        $scope.patientLocation.name = $scope.patient.name;
                        ServerDataService.update('location',$scope.patientLocation).then(function(data){
                            save_patient(data);
                        });
                    }
                    else{
                        save_patient($scope.patientLocation);
                    }
                }
                // new patient, so new location
                else{
                    var location = {
                        "name" : $scope.patient.name,
                        "location_type" : "P"
                    }
                    ServerDataService.save('location',location).then(function(data){
                        save_patient(data);
                    });
                }
            };
        },
        templateUrl:"static/bots_angular/app/partials/directives/edit-patient-directive.html"
    };
}]);