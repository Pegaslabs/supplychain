angular.module('InventoryApp.ShipmentsCtrl', []).
controller('ShipmentsCtrl', ['$scope', '$http', "$location","$routeParams", "UtilsService", 
  function($scope, $http,$location,$routeParams,UtilsService) {

    $scope.title = "Shipments";
    $scope.url = "/api/v1/shipment/?format=json&order_by=-date&order_by=-id&" + $location.url().split("?")[1];

    $scope.shipments_pagination_config = {
        itemsPerPage : 30,
        url : $scope.url,
        callback : function(data){
            $scope.shipments = data["objects"];
            $scope.tastypiemeta = data["meta"];
        }
    };

    if ($routeParams["from_location__location_type"] === "S"){
        $scope.title = "Received " + $scope.title;
    }
    else if ($routeParams["from_location__location_type"] === "I"){
        $scope.title = "Transferred " + $scope.title;
    }
    else if ($routeParams["from_location__location_type"] === "D"){
        $scope.title = "Dispensed " + $scope.title;
    }
    if ("location_name" in $routeParams){
        $scope.title = $routeParams["location_name"] + " - " + $scope.title;
    }
    $scope.download_filename = $scope.title;

    $scope.show_results = true;
}]);

angular.module('InventoryApp.ShipmentCtrl', []).
controller('ShipmentCtrl', ['$scope', '$http', "$location", "$routeParams", "UtilsService", function($scope, $http,$location,$routeParams,UtilsService) {
  $http.get('/api/v1/shipment/' + $routeParams["shipmentId"] +'/?format=json').success(function(data){
    $scope.shipment = data;
    if ($scope.shipment.shipment_type === "T" || $scope.shipment.shipment_type === "D"){
      $scope.receive_or_transfer = "transfer";
      $scope.is_transfer = true;
  }else{
      $scope.receive_or_transfer = "receive";
      $scope.is_transfer = false;
  }
  $scope.show_results = true;
    // showing only the positive stock changes
    $scope.stockchanges_pagination_config = {
      itemsPerPage : 30,
      url : "/api/v1/stockchange/?format=json&order_by=-id&qty__gt=0&shipment=" +  $routeParams["shipmentId"],
      callback : function(data){
        $scope.stockchanges = data["objects"];
        if ($scope.shipment.to_location.location_type==="D" && $scope.shipment.from_location.location_type==="I"){
                for (i in $scope.stockchanges){
                  if ($scope.stockchanges[i].itemlot.item.dispense_size){
                    $scope.stockchanges[i].qty = $scope.stockchanges[i].qty / $scope.stockchanges[i].itemlot.item.dispense_size;
                }
            }
        }
        if ($scope.shipment.from_location.location_type==="D"){
            $scope.dispense = true;
        }
  $scope.total_count = data["meta"]["total_count"];
}
};
});
}]);