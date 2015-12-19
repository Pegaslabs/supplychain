module.exports = function(context, block) {
  return context;
  // let f = block.hash.format || "LL";
  // if (block.hash.calendar)
  //   return Moment().calendar(context,{sameElse : f}).toLowerCase();
  // else
  //   return Moment(new Date(context)).format(f);
};