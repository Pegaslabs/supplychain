export default class Config {
  constructor() {
    this.dbUrl = 'http://localhost:5984/';
    this.dbName = 'sctxdb';
    this.dbAppName = 'tables_sc_app';
    this.djangoUrl = "http://localhost:8000";
    this.baseStaticUrl = '/#/';
    this.environment = "prod";
    if (this.environment === "stg"){
      this.dbUrl = 'http://localhost:5984/';
      this.baseStaticUrl = '/' + this.dbAppName + '/_design/tables/index.html#/';
    }
    if (this.environment === "prod"){
      this.dbUrl = 'https://lesotho.pih-emr.org:8999/';
      this.djangoUrl = "https://lesotho.pih-emr.org:8998";
      this.baseStaticUrl = '/' + this.dbAppName + '/_design/tables/index.html#/';
    }
  }
}
