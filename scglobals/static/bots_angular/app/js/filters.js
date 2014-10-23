'use strict';

/* Filters */

angular.module('SupplyChainApp.filters', []).
filter('orderObjectBy', [function() {
	return function(input, attribute) {
		if (!angular.isObject(input)) return input;

		var array = [];
		for(var objectKey in input) {
			array.push(input[objectKey]);
		}

		array.sort(function(a, b){
			var alc = a[attribute].toLowerCase(),
			blc = b[attribute].toLowerCase();
			return alc > blc ? 1 : alc < blc ? -1 : 0;
		});
		return array;
	}
}]);
