import showDecimals from './num';

module.exports = function(skip,limit,total) {
  if (total < limit) return "1 - " + total;
  var start = showDecimals((Number(skip) + 1));
  var end = (Number(skip) + Number(limit));
  end = (end > total) ? total : end;
  end = showDecimals(end);
  return start + " - " + end;
};
