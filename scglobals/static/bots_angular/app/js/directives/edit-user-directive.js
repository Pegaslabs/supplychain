angular.module('SupplyChainApp.editUserDirective', []).
directive('editUserDirective', 
  ["$rootScope",
  "UtilsService",
  "ServerDataService", 
  function($rootScope,UtilsService,ServerDataService) {
    return {
      restrict:'A',
      scope : { "editinguser" : "=", "callback" : "="},
      link: function($scope, element, attrs){
        $scope.select_default_location = function(location){
            $scope.editinguser.default_location = location;
        };
        $scope.change_default_location = function(){
            $scope.editinguser.default_location = undefined;
        };
        $scope.default_location_search_config = {
          placeholder : "Location, e.g. Central Warehouse",
          url : "/api/v1/location/?format=json&order_by=name&location_type=I",
          result_name : "location",
          select_result: $scope.select_default_location
        };
        $scope.select_default_dispensary = function(location){
            $scope.editinguser.default_dispensary = location;
        };
        $scope.change_default_dispensary = function(){
            $scope.editinguser.default_dispensary = undefined;
        };
        $scope.default_dispensary_search_config = {
          placeholder : "Dispensary, e.g. Bothsabelo Dispensary",
          url : "/api/v1/location/?format=json&order_by=name&location_type=D",
          result_name : "location",
          select_result: $scope.select_default_dispensary
        };
        $scope.switch_superuser = function(truefalse){
          $scope.editinguser.user.is_superuser = truefalse;
        };
        $scope.submit_edit = function(){
          if ($scope.editinguser.username !== ""){
            var serialized_up = {
              "default_location" : "/api/v1/location/" + $scope.editinguser.default_location.id + "/",
              "default_dispensary" : "/api/v1/location/" + $scope.editinguser.default_dispensary.id + "/",
              "id" : $scope.editinguser.id
            };
            ServerDataService.update('userpreferences',serialized_up).then(function(data){
              ServerDataService.update('user',$scope.editinguser.user).then(function(data){
                $scope.callback($scope.callback);
              });
            });
          }
        };
      },
      templateUrl:"static/bots_angular/app/views/directives/edit-user-directive.html"
    };
  }]);