import Config from './../services/config';

module.exports = function() {
  return new Config().baseStaticUrl;
};
