// singleton config object
let instance = null;
export default class Config {
  constructor() {
    if (!instance) instance = this;
    this.environment = "development";
    this.dbname = 'sctxdb';
    this.djangoUrl = "http://localhost:8000";
    return instance;
  }
}