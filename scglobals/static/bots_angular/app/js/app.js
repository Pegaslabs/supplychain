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
  'SupplyChainApp.IlpCtrl',
  'SupplyChainApp.LoginCtrl',
  'SupplyChainApp.ReceiveCtrl',
  'SupplyChainApp.TransferCtrl',
  'SupplyChainApp.PhysicalCtrl',
  'SupplyChainApp.UtilsService',
  'SupplyChainApp.UserPrefsService',
  'SupplyChainApp.ServerDataService',
  'SupplyChainApp.directives',
  'SupplyChainApp.editItemDirective',
  'SupplyChainApp.editLocationDirective',
  'SupplyChainApp.iaDownloadDirective',
  'SupplyChainApp.editPatientDirective',
  'SupplyChainApp.viewPatientDirective',
]);

SupplyChainApp.run(function ($http, $cookies,$rootScope,$location) {
    $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
      if ( $rootScope.logged_in == null ) {
        // check if we can hit the api, and therefore are logged in with django
        var cookies = document.cookie.split(";");
        for (var i in cookies){
          if (cookies[i].split("=")[0] === " username"){
            var username = cookies[i].split("=")[1];
            break;
          }
        }
        $http.get("/api/v1/userpreferences/?format=json&limit=1&username=" + username).success(function(data) {
          $rootScope.logged_in = true;
          $rootScope.userpreferences = data["objects"][0];
        }).error(function(data){
          // no logged user, we should be going to #login
          if ( next.templateUrl == "static/bots_angular/app/views/login.html" ) {
            // already going to #login, no redirect needed
          } else {
            // not going to #login, we should redirect now
            // var redirect = $location.url();
            $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
            $location.path( "/login" );
          }
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
  $routeProvider.when('/ilp', {
    templateUrl: 'static/bots_angular/app/views/ilp.html', 
    controller: 'IlpCtrl'
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
    controller: 'PhysicalCtrl', 
    reloadOnSearch: false
  });
  $routeProvider.when('/item/:itemId', {
    templateUrl: 'static/bots_angular/app/views/item.html', 
    controller: 'ItemCtrl'
  });
}]);
