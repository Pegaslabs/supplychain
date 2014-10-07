'use strict';

/* Directives */


angular.module('InventoryApp.directives', []).
directive('iaSearchDrop', ['$http', "$q", function($http,$q) {
	return {
		restrict: 'EA',
		scope: {
			"searchDropConfig" : "="
		},
		templateUrl: 'static/bots_angular/app/partials/directives/search_drop.html',
		replace: true,
		link: function(scope, element, attrs) {
			if (scope.searchDropConfig.select_result){
				scope.select_result = scope.searchDropConfig.select_result;
			}
			else{
				scope.select_result = function(result){
					scope.searchDropConfig.selected_result = result;
					scope.q = result.name;
				};
			}
			scope.drop = function(){
				if (!element.find(".dropdown-menu").is(':visible')){
					element.find(".dropdown-menu").dropdown("toggle");	
				}
			};
			scope.search = function(q){
				if (!element.find(".dropdown-menu").is(':visible')){
					element.find(".dropdown-menu").dropdown("toggle");
				}

				if (q === undefined){
					q = "";
				}
				if(scope.loading_search){
					if (scope.canceler){
						scope.canceler.resolve();
					}
				}
				scope.loading_search = true;
				scope.searchDropConfig.selected_result = undefined;
				scope.no_results = false;
				var url = "&name__contains=" + q + "&limit=10";
				scope.canceler = $q.defer();
				$http.get(scope.searchDropConfig.url + url,{timeout: scope.canceler.promise}).success(function(data){
					scope.search_results = data.objects;
					scope.search_meta = data.meta;
					scope.loading_search = false;
					if(scope.search_results.length === 0){
						scope.no_results = true;
					}
				});
			};
			$http.get(scope.searchDropConfig.url + "&limit=10").success(function(data){
				scope.search_results = data.objects;
				scope.search_meta = data.meta;
				scope.loading_search = false;
			});
		}
	};
}]).
// pagination config is {maxSize : "num of pages you want displayed before ... ", 
// itemsPerPage : "number of items on page and json limit call", : url_search : "json api url to query", 
// "callback" : "where you should tie the restuls to your scope"
// "loading" : the scope item that will be toggled for loading}
directive('iaPagination', ['$http', function($http) {
	return {
		restrict: 'EA',
		transclude: 'true',
		scope: {
			"paginationConfig" : "=",
			"loading" : "="
		},
		templateUrl: 'static/bots_angular/app/partials/directives/pagination.html',
		replace: true,
		link: function(scope, element, attrs) {
			scope.pageConfig = {};
			scope.pageConfig.show_data = scope.paginationConfig.no_page_data ? true : false;
			scope.pageConfig.maxSize = scope.paginationConfig.maxSize ? scope.paginationConfig.maxSize : 5;
			scope.pageConfig.itemsPerPage = scope.paginationConfig.itemsPerPage ? scope.paginationConfig.itemsPerPage : 10;
			var url_search = scope.paginationConfig.url_search ? "&" + scope.paginationConfig.url_search : "";
			scope.set_page = function(page_num){
				scope.loading = true;
				scope.pageConfig.currentPage = page_num;
				var url = scope.paginationConfig.url + "&limit=" + scope.pageConfig.itemsPerPage + "&offset=" + (scope.pageConfig.itemsPerPage * (page_num-1)) + url_search;
				$http.get(url).success(function(data) {
					scope.pageConfig.totalItems = data.meta.total_count;
					scope.pageConfig.numPages = scope.totalItems / scope.pageConfig.itemsPerPage;
					scope.pageConfig.itemsOnPage = data.objects.length;
					scope.pageConfig.show_pagination = true;
					if (scope.paginationConfig.callback){
						scope.paginationConfig.callback(data);
					}
					scope.loading = false;
				}).error(function(data){
					var detail_text = data["error_message"] ? data["error_message"] : data["error"];
					$("#server_error .error_text").text("Something went wrong, please contact the server administrator. Technical details: " + detail_text);
          $("#server_error").removeClass('hide');
				});
			};
			scope.$watch('paginationConfig', function(val){
				scope.set_page(1);
			},true);
			scope.set_page(1);
		}
	};
}]);
