angular.module('SupplyChainApp.editItemDirective', []).
directive('editItemDirective', 
  ["$rootScope",
  "UtilsService",
  "ServerDataService", 
  function($rootScope,UtilsService,ServerDataService) {
    return {
      restrict:'A',
      scope : { "editingitem" : "=", "callback" : "="},
      link: function($scope, element, attrs){
        $scope.select_category = function(category){
          $scope.editingitem.category = category;
          $scope.show_category_query = false;
        };
        $scope.change_category = function(){
          $scope.editingitem.category = undefined;
          $scope.show_category_query = true;
        };
        $scope.add_category = function(category_q){
          if (category_q){
            var category = {"name" : category_q};
            ServerDataService.save('itemcategory',category).then(function(data){
              $scope.editingitem.category = data;
              $scope.show_category_query = false;
            });
          }
        };
        $scope.category_search_config = {
          placeholder : "Category name, e.g. Tables and capsules",
          add_results : true,
          add_result : $scope.add_category,
          input_class : "category_search_input",
          url : "/api/v1/itemcategory/?format=json&order_by=name&limit=10",
          result_name : "category",
          select_result : $scope.select_category
        };
        $scope.submit_item = function(){
          console.log($scope.editingitem);
          if($scope.editingitem && $scope.editingitem.name && $scope.editingitem.category){
            var serialized_item = {
              "name" : $scope.editingitem.name,
              "category" : {"id" : $scope.editingitem.category.id},
              "dispense_size" : $scope.editingitem.dispense_size,
              "id" : $scope.editingitem.id
            };
            ServerDataService.save('item',serialized_item).then(function(data){
              $scope.editingitem = data;
              $scope.show_category_query = false;
              $scope.callback($scope.editingitem);
            });
          }
        };
      },
      templateUrl:"static/bots_angular/app/views/directives/edit-item-directive.html"
    };
  }]);