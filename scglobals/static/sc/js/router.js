define([
  'jquery',
  'underscore',
  'backbone',
  'views/dash',
], function($, _, Backbone,DashView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // 'projects': 'showProjects',
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    // app_router.on('route:editShipment', function(){
    //   // console.log('why no work?!');
    //   // Call render on the module we loaded in via the dependency array
    //   // 'views/projects/list'
    // });
    app_router.on('route:defaultAction', function(actions){
      var dashView = new DashView();
      dashView.render();
    });
    Backbone.history.start({
      pushState: true,
      root:'/sc/'
    });
  };
  return {
    initialize: initialize
  };
});