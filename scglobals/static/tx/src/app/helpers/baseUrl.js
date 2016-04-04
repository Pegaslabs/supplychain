import Config from './../models/config';

module.exports = function() {
  return new Config().get('baseStaticUrl');
};
