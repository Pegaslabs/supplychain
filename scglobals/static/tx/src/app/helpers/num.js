module.exports = function(num) {
  var pretty_num = "0";
  if (num) {
    num = Math.round(num * 100) / 100;
    pretty_num = (""+(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return pretty_num;
};
