angular.module('InventoryApp.ServerDataService', []).
  factory('ServerDataService', function ($http, $q) {
    var api_url = "/api/v1/";
    // helper function
    var make_url_params = function(params){
        var url_suffix = "?";
        for (var counter in params){
            for (var key in params[counter]){
                url_suffix += key +  "=" + params[counter][key] + "&";
            }
        }
        return url_suffix.substring(0,url_suffix.length-1);
    };
    return {
        get: function (table_name,row_id) {
            var url = api_url + table_name + "/" + row_id + "/" + "?format=json";
            var defer = $q.defer();
            $http({method: 'GET', url: url }).
                success(function (data, status, headers, config) {
                    defer.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    defer.reject(status);
                });
            return defer.promise;
        },
        list: function (table_name,params) {
            var defer = $q.defer();
            params.push({"format" :  "json"});
            var p = make_url_params(params);
            $http({method: 'GET', url: api_url + table_name + "/" + p}).
                success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    defer.reject(status);
                });
            return defer.promise;
        },
        hash: function (table_name,params) {
            var defer = $q.defer();
            params.push({"format" :  "json"});
            var p = make_url_params(params);
            $http({method: 'GET', url: api_url + table_name + "/" + p}).
                success(function (data, status, headers, config) {
                    var hash = {};
                    for (i in data["objects"]){
                        hash[data["objects"][i]["id"]] = data["objects"][i];
                    }
                    defer.resolve(hash);
                }).error(function (data, status, headers, config) {
                    defer.reject(status);
                });
            return defer.promise;
        },
        update: function (table_name,row_data) {
            // single or list
            if (row_data.id){
                var url = api_url + table_name + "/" + row_data.id + "/";
            }
            else{
                var url = api_url + table_name + "/";
            }

            var defer = $q.defer();
            $http({method: 'PATCH',
                url: url,
                data: row_data}).
                success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    defer.reject(status);
                });
            return defer.promise;
        },
        save: function (table_name,row_data) {
            var url = api_url + table_name + "/";
            var defer = $q.defer();
            var data = JSON.stringify(row_data);
            $http({method: 'POST',
                url: url,
                data: data}).
                success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    defer.reject(status);
                });
            return defer.promise;
        },
        delete_id: function (table_name,row_id) {
            var url = api_url + table_name + "/" + row_id + "/" + "?format=json";
            var defer = $q.defer();
            $http({method: 'DELETE', url: url }).
                success(function (data, status, headers, config) {
                    defer.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    defer.reject(status);
                });
            return defer.promise;
        },
    }
});