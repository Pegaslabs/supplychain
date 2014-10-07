angular.module('InventoryApp.iaDownloadDirective', [])
.directive('iaDownloadDirective', ['$http', "$q", function ($http,$q) {
  return {
    restrict:'A',
    scope:{ url:'=', firstPage: "="},
    link:function(scope, element, attrs){
        scope.start_download = function(){
            scope.downloading = true;
            if (scope.url.indexOf("limit=") !== -1){
                var limit = Number(scope.url.split("limit=")[1].split("&")[0]);
            }
            else{
                var limit = 30;
            }
            if (scope.url.indexOf("offset=") === -1){
                scope.url = scope.url + "&offset=0";
                var offset = 0;
            }
            else{
                var offset = Number(scope.url.split("offset=")[1].split("&")[0]);
            }
            // scope.firstPage.meta.total_count
            // for (i = 0; i < 10; i++){
            var cap = scope.firstPage.meta.total_count;
            scope.canceler = $q.defer();
            while(offset < cap){
                console.log(offset,cap);
                offset += limit;
                scope.url = scope.url.replace("offset=" + (offset-limit), "offset=" + offset);
                $http.get(scope.url,{timeout: scope.canceler.promise}).then(function(data){
                    // put new page in correct place in array
                    scope.firstPage.objects.splice.apply(scope.firstPage.objects,[offset,0].concat(data.data.objects));
                    // we don't touch meta.total_count so it stays the same
                    if (offset >= cap){
                        console.log(offset,cap);
                        console.log(scope.firstPage.objects);
                    }
                });
            }
        };
        scope.cancel_download = function(){
            scope.canceler.resolve();
            scope.downloading = false;
        };
    },
    templateUrl:"static/bots_angular/app/partials/directives/download.html"
  };
}]);