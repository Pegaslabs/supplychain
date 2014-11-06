angular.module('SupplyChainApp.EditPhysicalCtrl', []).
controller('EditPhysicalCtrl', [
    '$scope', 
    '$http',
    '$filter',
    '$routeParams',
    'UtilsService', 
    "ServerDataService", function($scope,$http,$filter,$routeParams,UtilsService,ServerDataService) {

        $scope.itemlots = [];
        ServerDataService.get('physicalinventory',$routeParams['physicalinventory']).then(function(data){
            $scope.pi = data;
            if($scope.pi.line_items){
                $scope.itemlots = JSON.parse($scope.pi.line_items);
            }
        });
        $scope.select_item = function(item){
            $scope.editing_itemlot = {
                'item' : item
            };
            $(".expiration").focus();
        };
        $scope.create_item = function(edit_item_name){
            $scope.edit_item = {};
            $scope.edit_item.name = edit_item_name;
            $scope.edit_item.dispense_size = 1;
            $('#edit_item_modal').modal();
        };
        $scope.new_item_submitted = function(data){
            $("#edit_item_modal").modal('hide');
            $scope.select_item(data);
        };
        $scope.item_search_config = {
            placeholder : "item name, e.g. Amoxicillin",
            add_results : true,
            add_result : $scope.create_item,
            url : "/api/v1/item/?format=json&order_by=name_lower&limit=10",
            result_name : "item",
            select_result : $scope.select_item
        };

        $scope.add_itemlot = function(itemlot){
            $scope.bad_date = false;
            if (itemlot.expiration) $scope.bad_date = !UtilsService.validate_date(itemlot.expiration);
            if ($scope.bad_date || !itemlot.item || !itemlot.qty) return;
            if (itemlot.expiration) itemlot.expiration = UtilsService.get_js_date(itemlot.expiration);
            // if new, add to list
            if (!_.contains($scope.itemlots,itemlot)){
                $scope.itemlots.unshift(itemlot);
            }
            $scope.editing_itemlot = {
                'item' : itemlot.item
            };
            ServerDataService.update('physicalinventory',{
                'id' : $scope.pi.id,
                'line_items' : JSON.stringify($scope.itemlots)
            });
            $(".expiration").focus();
        };

        $scope.edit_itemlot = function(itemlot){
            itemlot.expiration = $filter('date')(itemlot.expiration, "dd/MM/yy");
            $scope.editing_itemlot = itemlot;
        };

        $scope.remove_itemlot = function(itemlot){
            _.remove($scope.itemlots, function(il) { return il === itemlot; });
            $scope.show_remove = false;
            ServerDataService.update('physicalinventory',{
                'id' : $scope.pi.id,
                'line_items' : JSON.stringify($scope.itemlots)
            });
        };

        // system_data is array of arrays with indecies: [[0: item_id, 1: item.name,2: item.category.name,
        // 3: itemlot.id, 4: expiration, 5: itemlot num,6:transactions,7:qty, 8: unit price],...]
        // 0: 556 1: "3TC 150mg   60" 2: "ARV'S PREPARATIONS"3: 423 4: "2015-05-01" 5: null 6: 1 7: 1 8: null

        var build_scs = function(system_data){
            // outcome is stockchanges for a debits shipment and a credits shipment
            // three types: scs to be transferred out to reduce or remove an itemlot (removal_scs),
            // new itemlots that have not existed in the system and need to be created & received
            // and itemlots to be transferred in that have existed in the system before
            var removal_scs = [];
            var new_itemlots = [],editable_itemlot_credits = [];

            // find items in system that don't exist in physical
            // and transfer their batches to zero
            // also, reduce system_data to matched_system_data, those that are matched to physc
            var physical_item_ids = _.pluck(_.pluck($scope.itemlots,'item'),'id')
            var matched_system_data = _.reduce(system_data, function(matched_system_data, item) {
                if(!_.contains(physical_item_ids,item[0])){
                    removal_scs.push({'itemlot_id' : item[3], 'expiration' : item[4], 'qty' : item[7], 'item' : {'name' : item[1], 'category' : {'name' : item[2]}}});
                }
                else{
                    matched_system_data.push(item);
                }
                return matched_system_data;
            },[]);
            // get list of ids from matched system data
            var matched_system_data_ids = _.pluck(matched_system_data,0);

            // take physical's itemlots, $scope.itemlots, and split them into 
            // itemlots that have item matches in matched_system_data_ids (union_itemlots)
            // to further mess with later (check matching experations), and itemlots that don't, which need to be 
            // added into new itemlots to receive
            var union_itemlots = _.reduce($scope.itemlots, function(union_itemlots, itemlot) {
                if(!_.contains(matched_system_data_ids,itemlot.item.id)){
                    new_itemlots.push(itemlot);
                }
                else{
                    union_itemlots.push(itemlot);
                }
                return union_itemlots;
            },[]);
            // finally, the item by item comparison
            // we go item by item and compare expirations
            // (first arrange by item & format: {itemid : [itemlots], ... } )
            var formatted_il;
            var system_by_item = _.reduce(matched_system_data,function(system_by_item,il){
                formatted_il = {
                    'item' : {'id':il[0],'name':il[1], 'category' : {'name' : il[2]}},
                    'expiration' : il[4],
                    'id' : il[3],
                    'qty' : il[7]
                };
                if (!system_by_item[formatted_il.item.id]) system_by_item[formatted_il.item.id] = [];
                system_by_item[formatted_il.item.id].push(formatted_il);
                return system_by_item;
            },{});
            var physical_by_item = _.reduce(union_itemlots,function(physical_by_item,itemlot){
                if (!physical_by_item[itemlot.item.id]) physical_by_item[itemlot.item.id] = [];
                itemlot.expiration = $filter('date')(itemlot.expiration, "yyyy-MM-dd");
                if (!itemlot.expiration) itemlot.expiration = null;
                physical_by_item[itemlot.item.id].push(itemlot);
                return physical_by_item;
            },{});
            var matches,difference;
            // find expirations not in system
            // or find matches & get their differences
            _.forEach(physical_by_item,function(itemlots,item_id){
                _.forEach(itemlots,function(itemlot){
                    matches = _.filter(system_by_item[item_id],{'expiration' : itemlot.expiration});
                    if (matches.length === 0){
                        new_itemlots.push(itemlot);
                    }
                    else {
                        difference = matches[0].qty - itemlot.qty;
                        if (matches.length >= 1){
                            // move additionals w/ same expiration to none
                            // and just select 1st as rough approximation
                            _.forEach(matches.slice(1),function(sys_il){
                                removal_scs.push({'itemlot_id' : sys_il.id, 'qty' : sys_il.qty, 'item' : sys_il.item, 'expiration' : sys_il.expiration});
                            });
                        }
                        // example: sys has 15, physical has 11, difference is 4
                        if(difference > 0){
                            removal_scs.push({'itemlot_id' : matches[0].id, 'qty' : difference, 'item' : matches[0].item, 'expiration' : matches[0].expiration});
                        }
                        // e.g. sys has 13, physical has 15, difference is -2
                        else if (difference < 0){
                            editable_itemlot_credits.push({'itemlot_id' : matches[0].id, 'qty' : -1*difference, 'item' :  matches[0].item, 'expiration' : matches[0].expiration});
                        }
                    }
                });
            });
            // find expirations in system not in physical & mark for removal
            // probably a more efficient way to do this if speed becomes issue
            _.forEach(system_by_item,function(sys_ils,item_id){
                _.forEach(sys_ils,function(il){
                    if (_.filter(physical_by_item[item_id],{'expiration' : il.expiration}).length === 0 ){
                        removal_scs.push({'itemlot_id' : il.id, 'qty' : il.qty, 'item' : il.item,'expiration' : il.expiration});
                    }
                });
            });
            $scope.removal_scs = removal_scs;
            $scope.new_itemlots = new_itemlots;
            $scope.editable_itemlot_credits = editable_itemlot_credits;
            $scope.show_results = true;
        };

        $scope.submit_stockcount = function(){
            $http.get('/report.json?location=' 
            +  $scope.pi.location.id +'&report_type=Inventory&itemlot_level=true&date=' 
            + $scope.pi.date.split('T')[0] ).then(function(report_data){
                build_scs(report_data.data);
            });
        };

        var make_serialized_credit = function(il){
            var sc = {
                "change_type" : "R",
                "shipment" : "/api/v1/shipment/" + $scope.pi.credits_shipment.id + "/",
                "location" : "/api/v1/location/" + $scope.pi.credits_shipment.to_location.id + "/",
                "date" : $scope.pi.date,
                "qty" : il.qty
            };
            if (il.itemlot_id){
                sc['itemlot'] = "/api/v1/itemlot/" + il.itemlot_id + "/";
            }
            if (il.id){
                sc['itemlot'] = "/api/v1/itemlot/" + il.id + "/";
            }
            return sc;
        };

        var make_serialized_debit = function(il){
            return {
                "change_type" : "T",
                "itemlot" : "/api/v1/itemlot/" + il.itemlot_id + "/",
                "shipment" : "/api/v1/shipment/" + $scope.pi.debits_shipment.id + "/",
                "location" : "/api/v1/location/" + $scope.pi.debits_shipment.to_location.id + "/",
                "date" : $scope.pi.date,
                "qty" : il.qty
            };
        };

        var make_serialized_il = function(il){
            var serialized_il =  {
                "item" : "/api/v1/item/" + il.item.id + "/",
                "shipment" : "/api/v1/shipment/" + $scope.pi.credits_shipment.id + "/",
                "date" : $scope.pi.date,
                "qty" : il.qty,
                "expiration" : il.expiration
            };
            if (il.expiration){
                serialized_il['expiration'] = $filter('date')(il.expiration, "yyyy-MM-dd");
            }
            else{
                delete serialized_il['expiration'];
            }
            return serialized_il;
        };

        var activate_shipments = function(){
            ServerDataService.update('shipment',{'id' : $scope.pi.debits_shipment.id,'active' : true}).then(function(data){
                ServerDataService.update('shipment',{'id' : $scope.pi.credits_shipment.id,'active' : true}).then(function(data){
                    $scope.running_updates = false;
                    $scope.updates_complete = true;
                });
            });
        };

        // recursively send 100 objects to the server
        // tastypie/nosql were not handling 700 at once well...
        var send_debits = function(objects){
            if (objects.length === 0){
                $scope.running_updates = false;
                activate_shipments();
            }
            else{
                ServerDataService.update('stockchange',{'objects' : objects.splice(0,100)}).then(function(data){
                    if (objects.length > 0){
                        $scope.progress = ($scope.total - objects.length) / 10;
                        send_debits(objects);
                    }
                    else{
                        activate_shipments();
                    }
                });
            }
        };
        $scope.submit_corrections = function(){
            $scope.running_updates = true;
            var serialized_debits = [], serialized_credits = {}, serialized_new_ils = {};
            serialized_debits = _.map($scope.removal_scs,function(sc){
                return make_serialized_debit(sc);
            });
            serialized_credits['objects'] = _.map($scope.editable_itemlot_credits,function(sc){
                return make_serialized_credit(sc);
            });
            serialized_new_ils['objects'] = _.map($scope.new_itemlots,function(il){
                return make_serialized_il(il);
            });
            ServerDataService.update('itemlot',serialized_new_ils).then(function(response){
                _.forEach(response.objects,function(il){
                    serialized_credits['objects'].push(make_serialized_credit(il));
                });
                ServerDataService.update('stockchange',serialized_credits).then(function(data){
                    $scope.total = serialized_debits.length;
                    $scope.progress = $scope.total - serialized_debits.length;
                    send_debits(serialized_debits);
                });
            });
        };
}]);