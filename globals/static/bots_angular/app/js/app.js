'use strict';


// Declare app level module which depends on filters, and services
var InventoryApp = angular.module('InventoryApp', [
  'ngRoute',
  'ngCookies',
  'ui.bootstrap',
  'InventoryApp.filters',
  'InventoryApp.services',
  'InventoryApp.HomeCtrl',
  'InventoryApp.GlobalCtrl',
  'InventoryApp.ShipmentsCtrl',
  'InventoryApp.ShipmentCtrl',
  'InventoryApp.TransactionsCtrl',
  'InventoryApp.ReportsCtrl',
  'InventoryApp.ItemCtrl',
  'InventoryApp.LoginCtrl',
  'InventoryApp.ReceiveCtrl',
  'InventoryApp.TransferCtrl',
  'InventoryApp.UtilsService',
  'InventoryApp.UserPrefsService',
  'InventoryApp.ServerDataService',
  'InventoryApp.SyncService',
  'InventoryApp.directives',
  'InventoryApp.iaDownloadDirective'
]);

InventoryApp.run(function ($http, $cookies,$rootScope,$location) {
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
          if ( next.templateUrl == "static/bots_angular/app/partials/login.html" ) {
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

InventoryApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'static/bots_angular/app/partials/home.html', 
    controller: 'HomeCtrl'
  });
  $routeProvider.when('/dash', {
    templateUrl: 'static/bots_angular/app/partials/home.html', 
    controller: 'HomeCtrl'
  });
  $routeProvider.when('/login', {
    templateUrl: 'static/bots_angular/app/partials/login.html', 
    controller: 'LoginCtrl'
  });
  $routeProvider.when('/shipments', {
    templateUrl: 'static/bots_angular/app/partials/shipments.html', 
    controller: 'ShipmentsCtrl'
  });
  $routeProvider.when('/shipment/edit_receive', {
    templateUrl: 'static/bots_angular/app/partials/edit_receive.html', 
    controller: 'ReceiveCtrl',
    reloadOnSearch: false
  });
  $routeProvider.when('/shipment/edit_transfer', {
    templateUrl: 'static/bots_angular/app/partials/edit_transfer.html', 
    controller: 'TransferCtrl'
  });
  $routeProvider.when('/transactions', {
    templateUrl: 'static/bots_angular/app/partials/transactions.html', 
    controller: 'TransactionsCtrl'
  });
  $routeProvider.when('/shipment/:shipmentId', {
    templateUrl: 'static/bots_angular/app/partials/shipment.html', 
    controller: 'ShipmentCtrl'
  });
  $routeProvider.when('/reports', {
    templateUrl: 'static/bots_angular/app/partials/reports.html', 
    controller: 'ReportsCtrl', 
    reloadOnSearch: false
  });
  $routeProvider.when('/item/:itemId', {
    templateUrl: 'static/bots_angular/app/partials/item.html', 
    controller: 'ItemCtrl'
  });
}]);
