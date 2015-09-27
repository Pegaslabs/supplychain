module.exports = function(amount) {
  if (amount) return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return "0.0";
};
