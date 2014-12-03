'use strict';


// Declare app level module which depends on filters, and services
var SupplyChainApp = angular.module('SupplyChainApp', [
  'ngRoute',
  'ngCookies',
  'ui.bootstrap',
  'SupplyChainApp.filters',
  'SupplyChainApp.HomeCtrl',
  'SupplyChainApp.GlobalCtrl',
  'SupplyChainApp.ShipmentsCtrl',
  'SupplyChainApp.ShipmentCtrl',
  'SupplyChainApp.TransactionsCtrl',
  'SupplyChainApp.ReportsCtrl',
  'SupplyChainApp.ItemCtrl',
  'SupplyChainApp.ItemsCtrl',
  'SupplyChainApp.LocationsCtrl',
  'SupplyChainApp.PatientsCtrl',
  'SupplyChainApp.UsersCtrl',
  'SupplyChainApp.LoginCtrl',
  'SupplyChainApp.ReceiveCtrl',
  'SupplyChainApp.TransferCtrl',
  'SupplyChainApp.PhysicalCtrl',
  'SupplyChainApp.EditPhysicalCtrl',
  'SupplyChainApp.UtilsService',
  'SupplyChainApp.ServerDataService',
  'SupplyChainApp.directives',
  'SupplyChainApp.editItemDirective',
  'SupplyChainApp.searchLocationDirective',
  'SupplyChainApp.editLocationDirective',
  'SupplyChainApp.iaDownloadDirective',
  'SupplyChainApp.editPatientDirective',
  'SupplyChainApp.editUserDirective',
  'SupplyChainApp.viewPatientDirective',
]);

SupplyChainApp.run(function ($http, $cookies,$rootScope,$location) {
    var login = function(){
      if ($location.path() !== "/login" ) {
          // not going to #login, we should redirect now
          // var redirect = $location.url();
          $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
          var search = $location.search();
          search["redirect"] = $location.path();
          $location.path( "/login").search(search);
        }
    };
    $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
      if (!$rootScope["logged_in"] ) {
        // check if we can hit the api, and therefore are logged in with django
        var username = $cookies['username'];
        if (!username) login();
        $http.get("/api/v1/userpreferences/?format=json&limit=1&user__username=" + username).success(function(data) {
          $rootScope.logged_in = true;
          $rootScope.userpreferences = data["objects"][0];
        }).error(function(data){
          // no logged user, we should be going to #login
          login();
        });
      }    
    });
});

SupplyChainApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'static/bots_angular/app/views/home.html', 
    controller: 'HomeCtrl'
  });
  $routeProvider.when('/dash', {
    templateUrl: 'static/bots_angular/app/views/home.html', 
    controller: 'HomeCtrl'
  });
  $routeProvider.when('/login', {
    templateUrl: 'static/bots_angular/app/views/login.html', 
    controller: 'LoginCtrl'
  });
  $routeProvider.when('/shipments', {
    templateUrl: 'static/bots_angular/app/views/shipments.html', 
    controller: 'ShipmentsCtrl'
  });
  $routeProvider.when('/shipment/edit_receive', {
    templateUrl: 'static/bots_angular/app/views/edit_receive.html', 
    controller: 'ReceiveCtrl',
    reloadOnSearch: false
  });
  $routeProvider.when('/shipment/edit_transfer', {
    templateUrl: 'static/bots_angular/app/views/edit_transfer.html', 
    controller: 'TransferCtrl'
  });
  $routeProvider.when('/transactions', {
    templateUrl: 'static/bots_angular/app/views/transactions.html', 
    controller: 'TransactionsCtrl'
  });
  $routeProvider.when('/items', {
    templateUrl: 'static/bots_angular/app/views/items.html', 
    controller: 'ItemsCtrl'
  });
  $routeProvider.when('/locations', {
    templateUrl: 'static/bots_angular/app/views/locations.html', 
    controller: 'LocationsCtrl'
  });
  $routeProvider.when('/patients', {
    templateUrl: 'static/bots_angular/app/views/patients.html', 
    controller: 'PatientsCtrl'
  });
  $routeProvider.when('/users', {
    templateUrl: 'static/bots_angular/app/views/users.html', 
    controller: 'UsersCtrl'
  });
  $routeProvider.when('/shipment/:shipmentId', {
    templateUrl: 'static/bots_angular/app/views/shipment.html', 
    controller: 'ShipmentCtrl'
  });
  $routeProvider.when('/reports', {
    templateUrl: 'static/bots_angular/app/views/reports.html', 
    controller: 'ReportsCtrl', 
    reloadOnSearch: false
  });
  $routeProvider.when('/physical', {
    templateUrl: 'static/bots_angular/app/views/physical.html', 
    controller: 'PhysicalCtrl'
  });
  $routeProvider.when('/edit-physical', {
    templateUrl: 'static/bots_angular/app/views/edit_physical.html', 
    controller: 'EditPhysicalCtrl'
  });
  $routeProvider.when('/item/:itemId', {
    templateUrl: 'static/bots_angular/app/views/item.html', 
    controller: 'ItemCtrl'
  });
}]);
