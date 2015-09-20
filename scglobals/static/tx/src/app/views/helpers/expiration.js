module.exports = function(val) {
  var date = new Date(val);
  return date.getMonth() + '/' + date.getFullYear();
  // if (!_.isDate(date)) {
  //   return " ";
  // }
  // else{
  //   return date.getMonth() + '/' + date.getFullYear();
  // }
};