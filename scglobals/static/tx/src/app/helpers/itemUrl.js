module.exports = function(object) {
  return 'item/' + encodeURIComponent(object.item_category_name) + '/' + encodeURIComponent(object.item_name);
};
