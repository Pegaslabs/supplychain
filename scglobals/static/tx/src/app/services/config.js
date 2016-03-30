// singleton config object
let instance = null;
export default class Config {
  constructor() {
    if (!instance){
      instance = this;
    } else{
      return instance;
    }
    this.dbUrl = 'http://localhost:5984/';
    this.dbName = 'sctxdb';
    this.djangoUrl = "http://localhost:8000";
    this.baseStaticUrl = '/#/';
    this.environment = "dev";
    if (this.environment === "stg"){
      this.dbUrl = 'http://localhost:5984/';
      this.dbName = 'sctxdb';
      this.baseStaticUrl = '/static/tx/dist/index.html#/';
    }
    if (this.environment === "prod"){
      this.dbUrl = 'http://lesotho.pih-emr.org:5984/';
      this.dbName = 'sctxdb';
      this.djangoUrl = "https://lesotho.pih-emr.org:8998";
      this.baseStaticUrl = '/static/tx/dist/index.html#/';
    }
    return instance;
  }
}
