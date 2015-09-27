module.exports = function(num) {
  if (num) return (""+(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return "0";
};
