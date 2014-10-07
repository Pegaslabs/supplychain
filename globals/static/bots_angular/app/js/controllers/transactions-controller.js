angular.module('InventoryApp.TransactionsCtrl', []).
controller('TransactionsCtrl',[
    '$scope', 
    '$http',
    '$location', 
    '$routeParams',
    'SyncService',
    function($scope,$http,$location,$routeParams,SyncService) {

        $scope.download_filename = "transactions " + new Date();
        $scope.loading_transactions = true;

        var big_url = 'report.json?report_type=all_stockchanges';
        $http.get(big_url).success(function(data) {
            $scope.transactions = data;
            $scope.view_transactions = _.first(data,100);
            $scope.transactions.unshift(["Date","Shipment System ID","Location","From Location","From Location Type","To Location","To Location Type","Item","Item Category","Item Expiration","Item Lot Num","Unit Price","Quantity","User","Total Value"]);
            $scope.loading_transactions = false;
        });
        
        // SyncService.get().then(function(transactions){
        //     $scope.view_transactions = _.first(transactions,100);
        //     $scope.loading_transactions = false;
        //     $scope.transactions = transactions;
        // });
        // $scope.show_filter = function(){
        //     $scope.filter = !$scope.filter || false;
        // };
        // $scope.delete_cache = function(){
        //     SyncService.remove_table();
        // };
    //     $scope.filter_column = function(location_q){
    //         var location_q_lower = location_q.toLowerCase();
    //         $scope.filtered_transactions = [];
    //         $scope.filtered_transactions = _.filter($scope.transactions, function(row) { 
    //             return row[2].toLowerCase().indexOf(location_q_lower) !== -1;
    //         });
    //         $scope.view_transactions = _.first($scope.filtered_transactions,100);
    //         var acc = 0;
    //         var sum = _.reduce($scope.filtered_transactions, function(first, second) {
    //             return first + second[12];
    //         },acc);
    //         $scope.total_val = sum;
    //         console.log(sum);
    //     };
    // };
    }
    ]);