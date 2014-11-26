angular.module('SupplyChainApp.GlobalCtrl', []).
controller('GlobalCtrl', [
  '$scope',
  '$rootScope',
  '$http',
  '$location',
  'ServerDataService',
  function($scope,$rootScope,$http,$location,ServerDataService) {
    $(document).keydown(function(e) {
      var _target = $(e.target);
      var _focused = $(document.activeElement);
      var _inputting = _focused.get(0).tagName.toLowerCase()==="textarea" || _focused.get(0).tagName.toLowerCase()==="input";

            // / (forward slash) key = search
            if (!_inputting && e.keyCode===191) {
              e.preventDefault();
              $(".item_search_input").focus();
              return;
            }
          });

    var select_item = function(item){
      if (item.resource_type === "Item"){
        $location.path("/item/" + item.id + "/").search({});
      }
      else if (item.resource_type === "Shipment"){
        $location.path("/shipment/" + item.id + "/").search({});
      }
      else if (item.resource_type === "Patient"){
        $location.path("/shipments/").search({"location" : item.id,"location_name" : item.name,"active" : "true"});
      }
      else{
        $location.path("/shipments/").search({"location" : item.id, "location_name" : item.name,"active" : "true"});
      }
    };
    $scope.userpreferences = $rootScope.userpreferences;
    $scope.item_search_config = {
      placeholder : "Search items, locations, shipments, patients. e.g. 100, or shipment 100",
      add_new : false,
      input_class : "item_search_input",
      url : "/api/v1/search/?format=json&order_by=name_lower",
      result_name : "results",
      select_result : select_item
    };
  }]
  );

angular.module('SupplyChainApp.HomeCtrl', []).
controller('HomeCtrl', ['$scope', '$location', '$rootScope', '$http', '$routeParams', 'ServerDataService', function($scope, $location, $rootScope, $http, $routeParams,ServerDataService) {
  $scope.tabs = {1 : true, 2: false, 3: false};
  $scope.tab_switch = function(tab){
    for (var i in $scope.tabs){
      $scope.tabs[i] = false;
    }
    $scope.tabs[tab] = true;
  };
  $scope.all_locations = function(){
      $location.search('location',null);
    };
    $scope.select_location = function(location){
      $("#search_location_modal").modal('hide');
      $location.search("location",location.id);
    };
    $scope.show_change_location = function(){
      $("#search_location_modal").modal();
    };

  // expiring in next six months
  var today = new Date();
  var six_months_later = today.addDays(180).serialize_date();
  today = today.serialize_date();

  $rootScope.$watch('userpreferences', function(val){
    if($rootScope.userpreferences){
    if ($routeParams["location"]){
      ServerDataService.get("location",$routeParams["location"]).then(function(loc){
        $scope.location = loc;
      });
    }else{
        $scope.location = $rootScope.userpreferences.default_location;
    }
      var location = $routeParams["location"] || $rootScope.userpreferences.default_location.id;
      var url = "/report.json?location=" + location + "&report_type=Expirations&date=" + today + "&end_date="  + six_months_later;
      $scope.loading_report = true;
      $scope.report_rows = [];
      $http.get(url).success(function(data) {
        $scope.loading_report = false;
        $scope.report_rows = data;
      }).error(function(data){
        $("#server_error").removeClass("hide");
        $scope.loading_report = false;
      });
      var url = "/report.json?location=" + location + "&report_type=dquality&date=" + today;
      $scope.loading_quality = true;
      $scope.dquality_report_rows = [];
      $http.get(url).success(function(data) {
        $scope.loading_quality = false;
        $scope.dquality_report_rows = data;
      }).error(function(data){
        $("#server_error").removeClass("hide");
        $scope.loading_quality = false;
      });
    }
  });

}]);

angular.module('SupplyChainApp.LoginCtrl', []).
controller('LoginCtrl', ['$scope','$routeParams','$http','$location', '$rootScope', function($scope,$routeParams,$http, $location, $rootScope) {
  $("#username").focus();
  $scope.login = function(user){
    // $location.search({});
    $scope.user_pass_missing = false;
    $scope.user_pass_wrong = false;
    if (user !== undefined && "username" in user && "password" in user){
      var url = "accounts/signin/";
      $http.post(url, user).success(function(data) {
        if(!data.success){
          $scope.user_pass_wrong = true;
        }
        else{
          // not actually how "logged_in" is set. django sets the sesh tolken
          // in above post and api disallows any data to be sent if it's not
          $rootScope.logged_in = true;
          $http.get("/api/v1/userpreferences/?format=json&limit=1&username=" + user.username).success(function(data) {
            $rootScope.userpreferences = data["objects"][0];
            if ($routeParams["redirect"]){
              var redirect = $routeParams["redirect"];
              var search = $location.search();
              delete search["redirect"];
              $location.path(redirect).search(search).update();
            }
            else{
              $location.path('/dash');
            }
          });
          document.cookie = "username=" + user.username;
        }
      });
    }
    else{
      $scope.user_pass_missing = true;
    }
  };
}]);
