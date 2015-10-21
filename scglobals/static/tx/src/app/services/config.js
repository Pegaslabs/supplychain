// singleton config object
let instance = null;
export default class Config {
  constructor() {
    if (!instance) instance = this;
    this.dbname = 'sctxdb';
    return instance;
  }
}