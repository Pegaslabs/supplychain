module.exports = function(val) {
  var date = new Date(val);
  if (!_.isDate(date)) return null;
  return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
};