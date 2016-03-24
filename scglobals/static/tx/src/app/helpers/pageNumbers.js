import showDecimals from './num';

module.exports = function(skip,fetched_rows_length,total_rows_length) {
  if (!fetched_rows_length) return '0 - 0';
  var start = showDecimals((Number(skip) + 1));
  var end = (Number(skip) + Number(fetched_rows_length));
  end = (end > total_rows_length) ? total_rows_length : end;
  end = showDecimals(end);
  return start + " - " + end;
};
