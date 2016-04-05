import Backbone from 'backbone';

export default Backbone.Model.extend({
  defaults: function () {
    var config = {};
    // env overwritten in gulpfile
    // dev, stg, & prod
    config.environment = "dev";
    config.dbUrl = 'http://localhost:5984/';
    config.dbName = 'sctxdb';
    config.dbAppName = 'tables_sc_app';
    config.djangoUrl = "http://localhost:8000";
    config.baseStaticUrl = '/#/';
    if (config.environment === "stg"){
      config.dbUrl = 'http://localhost:5984/';
      config.baseStaticUrl = '/' + config.dbAppName + '/_design/tables/index.html#/';
    }
    if (config.environment === "prod"){
      config.dbUrl = 'https://lesotho.pih-emr.org:8999/';
      config.djangoUrl = "https://lesotho.pih-emr.org:8998";
      config.baseStaticUrl = '/' + config.dbAppName + '/_design/tables/index.html#/';
    }
    return config;
  }
});
