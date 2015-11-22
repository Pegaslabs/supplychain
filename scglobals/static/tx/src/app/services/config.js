// singleton config object
let instance = null;
export default class Config {
  constructor() {
    if (!instance) instance = this;
    this.environment = "development";
    this.dbname = 'sctxdb';
    return instance;
  }
}