Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

Date.prototype.serialize_date = function(){
    var month =  (Number(this.getMonth()) + 1);
    if (month.toString().length === 1){
        month = "0" + month.toString();
    }
    var day =  (Number(this.getDate()) + 1);
    if (day.toString().length === 1){
        day = "0" + day.toString();
    }
    return this.getFullYear() + "-" + month + "-" + day;
};

angular.module('SupplyChainApp.UserPrefsService', []).
factory('UserPrefsService', function ($http, $q) {
    var deferred = $q.defer();
    var futureUserPrefs = {};
    var user_prefs_url = "/api/v1/userpreferences/?format=json";
    var get_user_prefs = function(){
        $http.get(user_prefs_url).success(function(data){
            deferred.resolve(data["objects"][0]);
        });
    };
    get_user_prefs();
    return {
        getUserPrefs:function(){
            return deferred.promise;
        },
        getUserPrefsPromise:function(){
            return futureUserPrefs;
        },
        reloadUserPrefs:function(){
            get_user_prefs();
            deferred.promise;
        },
    }
});