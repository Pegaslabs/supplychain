module.exports = function(name,category) {
  return 'item/' + encodeURIComponent(category) + '/' + encodeURIComponent(name);
};
