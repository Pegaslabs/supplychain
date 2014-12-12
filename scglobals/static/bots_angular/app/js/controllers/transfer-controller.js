angular.module('SupplyChainApp.TransferCtrl', []).
controller('TransferCtrl', ['$scope','$rootScope','$http','$location','$filter','ServerDataService','UtilsService', 
    function($scope,$rootScope,$http,$location,$filter,ServerDataService,UtilsService) {
    $(".input_date").focus();
    $scope.total_price = 0;
    $scope.page_price = 0;
    $scope.limit = 100;
    $scope.quick_transfer = false;
    $scope.edit_item_id = undefined;
    $scope.creating_in_progress = false;
    $scope.editing_to_location = true;
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
    var serialize_date = function(d){
        return d.getFullYear() + "-" + (Number(d.getMonth()) + 1) + "-" + d.getDate();
    };
    var request_date = serialize_date(new Date().addDays(1));
    function isInt(n) {
        return n % 1 === 0;
    }
    var initialize_transfer = function(){
        // **** Load existing shipment or start new ****
        if ("shipment" in $location.search()){
            if ("dispense" in $location.search()){
                $scope.dispense = true;
            }
            else{
                $scope.dispense = false;
            }
            var stockchange_url = "/api/v1/stockchange/?format=json&order_by=itemlot__item__name&qty__gt=0&shipment=" + $location.search()['shipment'];
            ServerDataService.get("shipment",$location.search()['shipment']).then(function(data){
                $scope.shipment = data;
                if ($scope.shipment.to_location.location_type==="P"){
                    $scope.dispense = true;
                }
                // correct quantities if this is an inventory to dispensary shipment
                $scope.total_price = Number($scope.shipment.price);
                // (don't want timestamps when comparing for future day)
                var js_date = new Date(new Date($scope.shipment.date).toDateString());
                var today = new Date(new Date().toDateString());
                $scope.future_date = (js_date > today) ? true : false;
                $scope.editing_date = false;
                $scope.editing_to_location = false;
                $scope.editing_from_location = false;
                $scope.show_results = true;
                $scope.items_pagination_config = {
                    itemsPerPage : $scope.limit,
                    show_data : false,
                    url : stockchange_url,
                    callback : function(data){
                        $scope.items = {};
                        for (var i in data["objects"]){
                            var item_id = data["objects"][i]["itemlot"]["item"]["id"];
                            if (!$scope.items[item_id]){
                                $scope.items[item_id] = {};
                                // don't want a circular referece, deep copy w/ jquery
                                $scope.items[item_id] =  $.extend(true, {}, data["objects"][i]["itemlot"]["item"]);
                                $scope.items[item_id]["qty"] = 0;
                                $scope.items[item_id]["price"] = 0;
                                $scope.items[item_id]["stockchanges"] = [];
                            }
                            if ($scope.shipment.from_location.location_type === "I" && $scope.shipment.to_location.location_type === "D"){
                                if ($scope.items[item_id].dispense_size){
                                    $scope.items[item_id]["qty"] += (data["objects"][i]["qty"] / $scope.items[item_id].dispense_size);
                                    data["objects"][i]["qty"] = data["objects"][i]["qty"] / $scope.items[item_id].dispense_size;
                                }else{
                                    $scope.items[item_id]["qty"] += data["objects"][i]["qty"];
                                }
                            }else{
                                $scope.items[item_id]["qty"] += data["objects"][i]["qty"];
                            }
                            $scope.items[item_id]["stockchanges"].push(data["objects"][i]);
                            $scope.items[item_id]["price"] += data["objects"][i]["qty"] * data["objects"][i]["itemlot"]["unit_price"];
                        }
                    }
                };
            });
        }
        else if ("dispense" in $location.search()){
            $scope.dispense = true;
            $scope.shipment = {};
            $scope.shipment.date = "t";
            $scope.show_results = true;
            $rootScope.$watch('userpreferences', function(val){
                if($rootScope.userpreferences){
                    $scope.submit_from_location($rootScope.userpreferences.default_dispensary);
                }
            });

        }
        else{
            $scope.shipment = {};
            $scope.editing_date = true;
            $scope.editing_from_location = true;
            $scope.show_results = true;
            $(".input_date").focus();
        }
    }
    $scope.submit_from_location = function(location){
        $scope.shipment.from_location = location;
        if ($scope.shipment.id){
            var serialized_shipment = {
                "id" : $scope.shipment.id,
                "from_location" : "/api/v1/location/" + $scope.shipment.from_location.id + "/"
            };
            ServerDataService.update('shipment',serialized_shipment);
        }
        else{
            $scope.try_create_new_shipment();
        }
        $scope.editing_from_location = false;
        $scope.show_from_location_query = false;
        $(".to_location_input").focus();
    };
    $scope.edit_from_Location = function(){
        $scope.editing_from_location = true;
        $scope.from_location_q = "";
    };
    if("dispense" in $location.search()){
        $scope.from_location_search_config = {
            placeholder : "From site name, e.g. Lebakeng",
            url : "/api/v1/location/?format=json&order_by=name&location_type__in=D",
            result_name : "location",
            input_class : "from_location_input",
            select_result: $scope.submit_from_location
        };
    }else{
        $scope.from_location_search_config = {
            placeholder : "From site name, e.g. Lebakeng",
            url : "/api/v1/location/?format=json&order_by=name&location_type__in=I,D,V",
            result_name : "location",
            input_class : "from_location_input",
            select_result: $scope.submit_from_location
        };
    }
    $scope.submit_to_location = function(location){
        $scope.shipment.to_location = location;
        if ($scope.shipment.id){
            var serialized_shipment = {
                "id" : $scope.shipment.id,
                "to_location" : "/api/v1/location/" + $scope.shipment.to_location.id + "/"
            };
            ServerDataService.update('shipment',serialized_shipment);
        }
        else{
            $scope.try_create_new_shipment();
        }
        $scope.editing_to_location = false;
        $scope.show_to_location_query = false;
    };
    $scope.$watch('shipment.to_location',function(){
        if ($scope.shipment && $scope.shipment.to_location !== undefined){
            $scope.editing_to_location = false;
            $scope.try_create_new_shipment();
        }
    });
    $scope.add_to_location_toggle = function(to_location){
        $scope.new_to_location_name = to_location;
        $("#add_to_location_modal").modal();
    };
    $scope.edit_patient_toggle = function(){
        $("#edit_patient_modal").modal();
    };
    $scope.to_location_search_config = {
        placeholder : "Clinic name, e.g. Nohana",
        url : "/api/v1/location/?format=json&order_by=name&location_type__in=I,D,V,S",
        result_name : "location",
        select_result: $scope.submit_to_location,
        input_class : "to_location_input",
        add_results : true,
        add_result : $scope.add_to_location_toggle
    };
    $scope.patient_search_config = {
        placeholder : "Patient identifier or name, e.g. GLC2345",
        url : "/api/v1/location/?format=json&order_by=name&search_patients=true&location_type=P",
        result_name : "patient",
        input_class : "patient_input",
        select_result: $scope.submit_to_location,
        add_results : true,
        add_result : $scope.edit_patient_toggle
    };
    // **** Edit shipment details ****
    $scope.submit_date = function(){
        if ($scope.shipment) {
            if ($scope.shipment.date){
                // validate
                $scope.bad_date = !UtilsService.validate_date($scope.shipment.date);
                // submit edit
                if (!$scope.bad_date){
                    $scope.shipment.date = UtilsService.get_js_date($scope.shipment.date);
                    $scope.future_date = ($scope.shipment.date > new Date()) ? true : false;
                    if ($scope.shipment.id){
                        var serialized_shipment = {
                            "id" : $scope.shipment.id,
                            "date" : $scope.shipment.date
                        };
                        ServerDataService.update('shipment',serialized_shipment).then(function(){
                            $scope.shipment.date = $filter('date')($scope.shipment.date, "MMMM d, yyyy");
                        });
                    }
                    else{
                        $scope.try_create_new_shipment();
                    }
                    $scope.editing_date = false;
                }
            }
       }
    };
    $scope.edit_date = function(){
        $scope.shipment.date = $filter('date')($scope.shipment.date, "dd/MM/yy");
        $scope.editing_date = true;
    };

    $scope.edit_to_location = function(){
        $scope.editing_to_location = true;
        $scope.shipment.to_location = undefined;
        $scope.to_location_q = "";
    };

    $scope.add_to_location = function(to_location_name,location_type){
        if (to_location_name !== ""){
            ServerDataService.save('location',{"name" : to_location_name, "location_type" : location_type}).then(function(data){
                $scope.shipment.to_location = data;
                $("#add_to_location_modal").modal("hide");
                $scope.editing_to_location = false;
                $scope.show_to_location_query = false;
                $scope.try_create_new_shipment();
            });
        }
    };
    $scope.edit_identifier = function(){
        $scope.patient.editing_identifier = $scope.patient.identifier;
        $scope.patient.identifier = undefined;
        // $scope.patient.editing_identifier = $scope.shipment.to_location.name;
        // $(".identifier_input").text($scope.shipment.to_location.name);
    };
    $scope.edit_patient_name = function(){
        $scope.patient.editing_name = $scope.patient.name;
        $scope.patient.name = undefined;
    };
    $scope.check_identifier = function(identifier){
        var url = "/api/v1/patient/?identifier=" + identifier +"&format=json";
        $http.get(url).success(function(data){
            if (data.meta.total_count > 0){
                $scope.patient.bad_identifier = true;
            }
            else{
                $scope.patient.bad_identifier = false;
                $scope.patient.identifier = $scope.patient.editing_identifier;
            }
        });
    };

    $scope.try_create_new_shipment = function(){
        if (!$scope.shipment.id && $scope.shipment.date && $scope.shipment.to_location 
            && $scope.shipment.from_location && !$scope.creating_in_progress){
            $scope.creating_in_progress = true;
            var serialized_shipment = {
                "date" : $scope.shipment.date,
                "to_location" : "/api/v1/location/" + $scope.shipment.to_location.id + "/",
                "from_location" : "/api/v1/location/" + $scope.shipment.from_location.id + "/",
                "shipment_type" : "T"
            };
            ServerDataService.save('shipment',serialized_shipment).then(function(data){
                $scope.shipment = data;
                $location.search("shipment", data.id);
            });
        }
    };

    // **** Adding/editing items on shipment ****

    $scope.edit_item = function(item){
        if ($scope.items[item['id']]){
            item = $scope.items[item['id']];
        }
        $scope.show_item_query = false;
        $scope.add_item_q = "";
        $scope.editing_item = $.extend(true, {}, item);
        $('#edit_item_transfer').modal();
        $("#qty").focus();
        var soh_date = serialize_date(new Date($scope.shipment.date).addDays(1));
        var itemlot_url = "/api/v1/itemlot/?format=json&item=" + item['id'] + "&soh=" 
        + soh_date + "&location=" + $scope.shipment.from_location.id 
        + "&soh__gt=0&order_by=expiration&order_by=shipment__date";
        $scope.itemlots_pagination_config = {
            itemsPerPage : 100,
            url : itemlot_url,
            callback : function(data){
                $scope.editing_item.itemlots = data["objects"];
                var added_item_lots = [];
                for (var i in $scope.editing_item.itemlots){
                    // line up loaded, ordered itemlots with any stockchanges on the shipment
                    if ($scope.items[item['id']]){
                        for (var j in $scope.items[item['id']].stockchanges){
                            if ($scope.items[item['id']].stockchanges[j]["itemlot"]["id"] === $scope.editing_item.itemlots[i]["id"]){
                                $scope.editing_item.itemlots[i].qty_to_ship = $scope.items[item['id']].stockchanges[j]["qty"];
                                // want sohs not to include the qty to ship, that will be seen in the resultants 
                                if (!$scope.future_date && $scope.shipment.active){
                                    $scope.editing_item.itemlots[i].soh = $scope.editing_item.itemlots[i].soh + $scope.items[item['id']].stockchanges[j]["qty"];
                                }
                                $scope.editing_item.itemlots[i].stockchange_id = $scope.items[item['id']].stockchanges[j]["id"];
                                added_item_lots.push($scope.editing_item.itemlots[i]["id"]);
                            }
                        }
                    }
                }
                if ($scope.items[item['id']]){
                    for (var i in $scope.items[item['id']].stockchanges){
                        if (added_item_lots.indexOf($scope.items[item['id']].stockchanges[i]["itemlot"]["id"]) === -1){
                            var il = $.extend(true, {}, $scope.items[item['id']].stockchanges[i]["itemlot"]);
                            il.qty_to_ship = $scope.items[item['id']].stockchanges[i]["qty"];
                            il.stockchange_id = $scope.items[item['id']].stockchanges[i]["id"];
                            $scope.editing_item.itemlots.push(il);
                        }
                    }
                }
            }
        };
    };
    $scope.item_search_config = {
        placeholder : "item name, e.g. Amoxicillin",
        add_results : false,
        add_result : $scope.create_item,
        url : "/api/v1/item/?format=json&order_by=name_lower&limit=10",
        result_name : "item",
        input_class : "add_item_input",
        select_result : $scope.edit_item
    };
    var add_neg_itemlot = function(data,qty){
        var no_soh_il = data;
        no_soh_il.lot_num = "No Stock On Hand";
        no_soh_il.soh = 0;
        no_soh_il.qty_to_ship = qty;
        $scope.editing_item.no_soh_il = no_soh_il;
        if (!$scope.editing_item.itemlots){
            $scope.editing_item.itemlots = [];
        }
        $scope.editing_item.itemlots.push($scope.editing_item.no_soh_il);
    };
    $scope.submit_item_qty = function(){
        var qty = Number($scope.editing_item.qty);
        $scope.editing_item.invalid_qty = (!UtilsService.isNumeric(qty) || Number(qty) < 0 || !isInt(qty));
        if (!$scope.editing_item.invalid_qty){
            var ils = $scope.editing_item.itemlots;
            for (var i in ils){
                if (ils[i].soh >= qty){
                    if (Number(qty) === 0){
                        ils[i].qty_to_ship = undefined;
                    }
                    else{
                        ils[i].qty_to_ship = qty;
                    }
                    qty = 0;
                }
                else{
                    ils[i].qty_to_ship = ils[i].soh;
                    qty -= ils[i].soh;
                }
            }
            if(qty !== 0){
                // neg qty to ship itemlot
                if ($scope.editing_item.no_soh_il){
                    $scope.editing_item.no_soh_il.qty_to_ship = qty;
                }
                else{
                    $scope.loading_no_soh_itemlot = true;
                    var url = "/api/v1/itemlotattribute/?format=json&itemlot__item=" + $scope.editing_item['id'] + "&itemlot_attribute__attribute=no_soh";
                    $http.get(url).success(function(data){
                        if (data["objects"].length !== 0){
                            add_neg_itemlot(data["objects"][0]["itemlot"],qty);
                            $scope.loading_no_soh_itemlot = false;
                        }
                        else{
                            var serialized_itemlot = {
                                "item" : "/api/v1/item/" + $scope.editing_item['id'] + "/",
                                "shipment" : "/api/v1/shipment/" + $scope.shipment.id + "/",
                                "date" : $scope.shipment.date,
                                "qty" : 0,
                            };
                            ServerDataService.save('itemlot',serialized_itemlot).then(function(data){
                                var serialized_itemlotattribute = {
                                    "itemlot" : "/api/v1/itemlot/" + data['id'] + "/",
                                    "attribute" : "no_soh",
                                };
                                ServerDataService.save('itemlotattribute',serialized_itemlotattribute).then(function(data){
                                    add_neg_itemlot(data["itemlot"],qty);
                                    $scope.loading_no_soh_itemlot = false;
                                });
                            });
                        }
                    });
                }
            }
            else{
                if ($scope.editing_item.no_soh_il){
                    for (var i in $scope.editing_item.itemlots){
                        if ($scope.editing_item.no_soh_il.id === $scope.editing_item.itemlots[i]["id"]){
                            $scope.editing_item.itemlots.splice(i,1);
                            break;
                        }
                    }
                    $scope.editing_item.no_soh_il = undefined;
                }
            }
        }
    };
    $scope.edit_itemlot = function(itemlot){
        itemlot.original_qty_to_ship = itemlot.qty_to_ship;
        itemlot.editing = true;
    };
    $scope.submit_itemlot_edit = function(itemlot){
        $scope.editing_item.qty -= itemlot.original_qty_to_ship - itemlot.qty_to_ship;
        itemlot.editing = false;
    };

    $scope.submit_itemlots = function(){
        if ($scope.editing_item.invalid_qty){
            return;
        }
        $scope.stockchange_loading = true;
        var serialized_stockchange = {};
        var serialized_stockchanges = [];
        var del_serialized_stockchanges = [];
        for (var i in $scope.editing_item.itemlots){
            var item_id = $scope.editing_item.itemlots[i]["item"]["id"];
            // if existing but now no qty, delete
            if (!Number($scope.editing_item.itemlots[i]["qty_to_ship"]) && $scope.editing_item.itemlots[i].stockchange_id){
                del_serialized_stockchanges.push("/api/v1/stockchange/" + $scope.editing_item.itemlots[i].stockchange_id + "/");
            }
            // if qty
            else if ($scope.editing_item.itemlots[i]["qty_to_ship"]){
                serialized_stockchange = {
                    "change_type" : "T",
                    "itemlot" : "/api/v1/itemlot/" + $scope.editing_item.itemlots[i].id + "/",
                    "shipment" : "/api/v1/shipment/" + $scope.shipment.id + "/",
                    "location" : "/api/v1/location/" + $scope.shipment.to_location.id + "/",
                    "date" : $scope.shipment.date,
                    "qty" : $scope.editing_item.itemlots[i].qty_to_ship
                }
                if($scope.editing_item.itemlots[i].stockchange_id){
                    serialized_stockchange["resource_uri"] = "/api/v1/stockchange/" + $scope.editing_item.itemlots[i].stockchange_id + "/";
                }
                if(!$scope.items[item_id]){
                    $scope.items[item_id] = $scope.editing_item.itemlots[i]["item"];
                    $scope.items[item_id]["qty"] = 0;
                    $scope.items[item_id]["price"] = 0;
                    $scope.shipment.item_count += 1;
                }
                serialized_stockchanges.push(serialized_stockchange);
            }
        }
        var server_data = {
            "objects" : serialized_stockchanges,
            "deleted_objects" : del_serialized_stockchanges
        };
        if (Object.size(server_data)){
            ServerDataService.update('stockchange',server_data).then(function(data){
                $scope.total_price -= $scope.items[item_id]["price"];
                if(data["objects"].length){
                    $scope.items[item_id]["stockchanges"] = data["objects"];
                    $scope.items[item_id]["qty"] = 0;
                    $scope.items[item_id]["price"] = 0;
                    for (var j in $scope.items[item_id]["stockchanges"]){
                        if ($scope.shipment.from_location.location_type === "I" && $scope.shipment.to_location.location_type === "D"){
                            $scope.items[item_id]["stockchanges"][j]["qty"] = $scope.items[item_id]["stockchanges"][j]["qty"] / $scope.items[item_id].dispense_size;
                        }
                        $scope.items[item_id]["qty"] += $scope.items[item_id]["stockchanges"][j]["qty"];
                        $scope.items[item_id]["price"] += $scope.items[item_id]["stockchanges"][j]["qty"] * $scope.items[item_id]["stockchanges"][j]["itemlot"]["unit_price"];
                    }
                    $scope.total_price += $scope.items[item_id]["price"];
                }
                else{
                    // $scope.total_price -= $scope.items[item_id]["price"];
                    $scope.shipment.item_count -= 1;
                    delete $scope.items[item_id];
                }
                $scope.stockchange_loading = false;
                $('#edit_item_transfer').modal("hide");
                $('.add_item_input').val("");
                $('.add_item_input').focus();
            });
        }
    };
    $scope.activate_shipment = function(){
        var serialized_shipment = {
            "id" : $scope.shipment.id,
            "active" : true
        };
        ServerDataService.update("shipment",serialized_shipment).then(function(data){
            $("#confirm_shipment_modal").modal("hide");
            $location.path("/shipment/" + data.id).search({});
        });
    };
    $scope.delete_shipment = function(){
        ServerDataService.delete_id("shipment",$scope.shipment.id).then(function(data){
            $("#delete_shipment_modal").modal("hide");
            $location.path("/shipments").search({"shipment_type" : "T", "active" : "false"});
        });
    };
    initialize_transfer();
}]);