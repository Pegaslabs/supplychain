angular.module('SupplyChainApp.searchLocationDirective', []).
directive('searchLocationDirective', 
  ["$rootScope",
  "UtilsService",
  "ServerDataService", 
  function($rootScope,UtilsService,ServerDataService) {
    return {
      restrict:'A',
      scope : {"callback" : "="},
      link: function($scope, element, attrs){
        $scope.search_location_config = {
          placeholder : "Location name, e.g. Central Warehouse",
          url : "/api/v1/location/?format=json&order_by=name&limit=10",
          result_name : "location",
          select_result : $scope.callback
        };
      },
      templateUrl:"static/bots_angular/app/views/directives/change-location-directive.html"
    };
  }]);