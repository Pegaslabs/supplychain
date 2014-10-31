angular.module('SupplyChainApp.editLocationDirective', []).
directive('editLocationDirective', 
  ["$rootScope",
  "UtilsService",
  "ServerDataService", 
  function($rootScope,UtilsService,ServerDataService) {
    return {
      restrict:'A',
      scope : { "editinglocation" : "=", "callback" : "="},
      link: function($scope, element, attrs){
        $scope.switch_type = function(type){
          $scope.editinglocation.location_type = type;
        };
        $scope.submit_edit = function(){
          if ($scope.editinglocation.name !== ""){
            ServerDataService.save('location',$scope.editinglocation).then(function(data){
              $scope.editinglocation = data;
              $scope.callback($scope.editinglocation);
            });
          }
        };
      },
      templateUrl:"static/bots_angular/app/views/directives/edit-location-directive.html"
    };
  }]);