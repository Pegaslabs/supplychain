angular.module('InventoryApp.iaDownloadDirective', [])
.directive('iaDownloadDirective', ['$http', "$q","UtilsService", function ($http,$q,UtilsService) {
  return {
    restrict:'A',
    scope:{ rows: "=", filename: "=" },
    link:function(scope, element, attrs){
        // not attempting tastypie for now
        // you have to normalize out the keys in the key : value json objects
        scope.start_download = function(){
            scope.downloading = true;
            UtilsService.download_array(scope.rows,scope.filename);
            scope.downloading = false;
            // if (scope.tastypiemeta && scope.tastypiemeta.next){
            //     // make limit 0
            //     if (scope.tastypiemeta.next.indexOf("limit=") !== -1){
            //         var limit = Number(scope.tastypiemeta.next.split("limit=")[1].split("&")[0]);
            //         scope.tastypiemeta.next = scope.tastypiemeta.next.replace("limit=" + limit, "limit=0");
            //     }
            //     else{
            //         scope.tastypiemeta.next = scope.tastypiemeta.next + "&limit=0";
            //     }
            //     scope.canceler = $q.defer();
            //     $http.get(scope.tastypiemeta.next,{timeout: scope.canceler.promise}).then(function(data){
            //         var all_rows = scope.rows.concat(data.data.objects);
            //         // taking [{"shipment" : 1, "location" : 3}, {...}] to be 
            //         // [[1,3], [...]]
            //         var array_all_rows = _.map(all_rows,function(row){
            //             return _.map(row,function(val){
            //                 return val;
            //             });
            //         });
            //         UtilsService.download_array(array_all_rows,scope.filename);
            //         scope.downloading = false;
            //     });
            // }
            // else{
            //     UtilsService.download_array(scope.rows,scope.filename);
            //     scope.downloading = false;
            // }
        };
        scope.cancel_download = function(){
            // scope.canceler.resolve();
            scope.downloading = false;
        };
    },
    templateUrl:"static/bots_angular/app/partials/directives/download.html"
};
}]);