// singleton config object
let instance = null;
export default class Config {
  constructor() {
    if (!instance) instance = this;
    this.environment = "development";
    this.dbUrl = 'http://localhost:5984/';
    this.dbName = 'sctxdb';
    this.djangoUrl = "http://localhost:8000";
    return instance;
  }
}