'use strict';

angular.module('InventoryApp.SyncService', [])
.service('SyncService', ['$http',"$q", function ($http,$q) {

    this.get = function () {
        var defer = $q.defer();
        var objects = {};
        var db = new PouchDB('inventory');
        db.get("transactions",function(err,objects){
            if(!err){
                defer.resolve(objects.objects);
            }
            else{
                var big_url = 'report.json?report_type=all_stockchanges';
                $http.get(big_url).success(function(data) {
                    objects = data;
                    db.put({
                        _id: 'transactions',
                        objects: objects
                    });
                defer.resolve(objects);
            })
            .error(function (data, status, headers, config) {
                defer.reject(status);
            });
            }
        });
        return defer.promise;
    };
    this.remove_table = function (){
        var db = new PouchDB('inventory');
        db.get("transactions",function(err,objects){
            db.remove(objects);
        });
    };
}]);
