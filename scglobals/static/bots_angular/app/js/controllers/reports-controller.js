angular.module('SupplyChainApp.ReportsCtrl', []).
controller('ReportsCtrl', ['$scope', '$http', "$location", 'UserPrefsService', 'UtilsService',"$filter", function($scope, $http,$location,UserPrefsService,UtilsService,$filter) {
    // globals
    $scope.report_type = {"inventory" : true, "consumption" : false, "expirations" : false};
    $scope.all_category = {"id" : 0, "name" : "All Categories"};
    $scope.editing_date = true;
    $scope.editing_end_date = true;
    // the table's been loaded 
    $scope.report_loaded = false;
    $scope.itemlot_level = false;

    $scope.switch_itemlot_level = function(){
        $scope.report_rows = [];
        $scope.itemlot_level = $scope.itemlot_level ? false : true;
    };
    $scope.switch_report = function(name){
      for (i in $scope.report_type){
        $scope.report_type[i] = false;
    }
    $scope.report_type[name] = true;
};
$scope.edit_date = function(){
  $scope.start_date = $filter('date')($scope.start_date, "dd/MM/yy");
  $scope.editing_date = true;
};
$scope.edit_end_date = function(){
  $scope.end_date = $filter('date')($scope.end_date, "dd/MM/yy");
  $scope.editing_end_date = true;
};
$scope.submit_date = function(){
        // validate
        if($scope.start_date){
          $scope.bad_date = !UtilsService.validate_date($scope.start_date);
          // submit edit
          if (!$scope.bad_date){
            $scope.start_date = UtilsService.get_js_date($scope.start_date);
            $scope.editing_date = false;
            $(".inventory_start_date").removeClass("has-error");
        }
        else{
            $(".inventory_start_date").addClass("has-error");
        }
    }
};
$scope.submit_end_date = function(){
        // validate
        if ($scope.end_date){
          $scope.bad_end_date = !UtilsService.validate_date($scope.end_date);
          // submit edit
          if (!$scope.bad_end_date){
            $scope.end_date = UtilsService.get_js_date($scope.end_date);
            $scope.editing_end_date = false;
            $(".inventory_end_date").removeClass("has-error");
        }
        else{
            $(".inventory_end_date").addClass("has-error");
        }
    }
};
$scope.edit_inventory_category = function(){
    $scope.inventory_category = undefined;
    $scope.editing_inventory_category = true;
    $scope.inventory_category_q = "";
    $scope.show_inventory_category_query = true;
};
$scope.edit_location = function(){
    $scope.location = undefined;
    $scope.editing_location = true;
};
      // preload categories
      var url = '/api/v1/itemcategory/?format=json&order_by=name&limit=10&';
      $http({method: 'GET', url: url }).success(function (data) {
        $scope.inventory_category_results = data['objects'];
    });
      $scope.inventory_category_search = function(inventory_category_q){
        if (inventory_category_q !== ""){
          var url = '/api/v1/itemcategory/?format=json&order_by=name&limit=10&name__startswith=' + inventory_category_q;
      }
      else{
          var url = '/api/v1/itemcategory/?format=json&order_by=name&limit=10';
      }
      $http({method: 'GET', url: url }).success(function (data) {
          $scope.inventory_category_results = data['objects'];
      });
  };
  $scope.submit_inventory_category = function(category){
    $(".inventory_category").removeClass("has-error");
    $scope.inventory_category = category;
    $scope.editing_inventory_category = false;
    $scope.show_inventory_category_query = false;
};
$scope.submit_inventory_category($scope.all_category);
$scope.submit_location = function(location){
    $(".inventory_location").removeClass("has-error");
    $scope.location = location;
    $scope.editing_location = false;
    $scope.show_location_query = false;
};
$scope.location_search_config = {
    placeholder : "Location Name",
    url : "/api/v1/location/?format=json&order_by=name",
    result_name : "location",
    input_class : "location_input",
    select_result: $scope.submit_location
};
UserPrefsService.getUserPrefs().then(function(userpreferences){
    $scope.userpreferences = userpreferences;
    $scope.submit_location($scope.userpreferences.default_location);
});
$scope.run_inventory = function(){
    var bad = false;
    if ($scope.location){
      $(".inventory_location").removeClass("has-error");
  }
  else{
      $(".inventory_location").addClass("has-error");
      bad = true;
  }
  if ($scope.inventory_category){
      $(".inventory_category").removeClass("has-error");
  }
  else{
      $(".inventory_category").addClass("has-error");
      bad = true;
  }
  if ($scope.start_date){
      $(".inventory_start_date").removeClass("has-error");
  }
  else if ($scope.report_type.inventory){
      $scope.start_date = "t";
      $scope.submit_date();
  }
  else{
      $(".inventory_start_date").addClass("has-error");
      bad = true;
  }
  if (!$scope.report_type.inventory){
      if ($scope.end_date){
        $(".inventory_end_date").removeClass("has-error");
    }
    else{
        $(".inventory_end_date").addClass("has-error");
        bad = true;
    }
}
if (!bad){
  if ($scope.end_date < $scope.start_date){
    $(".inventory_start_date").addClass("has-error");
    $(".inventory_end_date").addClass("has-error");
    $scope.backwards_dates = true;
    bad = true;
}
else{
    $scope.backwards_dates = false;
}
}
if (bad){
  return;
}
var category_id = $scope.inventory_category.id || "";
var url = "/report.json?location=" + $scope.location.id + "&category=" + category_id + "&report_type=" + $("#title span").filter(":visible").text();
if ($scope.itemlot_level){
  url += "&itemlot_level=true"
}
else{
  url += "&itemlot_level=false"
}
url += "&date=" + $filter('date')($scope.start_date, "yyyy-MM-dd");
if (!$scope.report_type.inventory){
  url += "&end_date=" + $filter('date')($scope.end_date, "yyyy-MM-dd");
}
$scope.loading_report = true;
$scope.report_rows = [];
$http.get(url).success(function(data) {
  $scope.loading_report = false;
  $scope.report_rows = data;
}).error(function(data){
  $("#server_error").removeClass("hide");
  $scope.loading_report = false;
});
};

$scope.download = function(){
    var rows = [];
        // title row
        var row = [];
        $("tr").filter(":visible").each(function(i){
          row = $($("tr").filter(":visible")[i]).text().split("\n");
          // first and last are blank rubbish
          row.pop();
          row.splice(0,1);
          for (j in row){
            // get rid of commas for csv
            row[j] = row[j].trim().replace(/,/g,"");
        }
        rows.push(row);
        row = [];
    });
        row = [];
        var filename_items = [];
        filename_items.push($("#title span").filter(":visible").text());
        filename_items.push($filter('date')($scope.start_date, "yyyy-MM-dd"));
        if (!$scope.report_type.inventory){
          filename_items.push($filter('date')($scope.start_date, "yyyy-MM-dd"));
      }
      filename_items.push($scope.location.name);
      var filename = filename_items.join(" ");
        // /put regex in here/g means global (not just the first instance)
        // [inside here are windows/unix not safe filename chars] replace with ""
        filename = filename.replace(/[\/:*?"<>|]/g,"") + ".xls";
        UtilsService.download_array(rows,filename);
    };
}]);