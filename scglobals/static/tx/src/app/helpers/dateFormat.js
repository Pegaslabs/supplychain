import Moment from 'moment';

module.exports = function(context, block) {
  let f = block.hash.format || "LL";
  if (block.hash.calendar)
    return Moment().calendar(context,{sameElse : f}).toLowerCase();
  else
    return Moment(new Date(context)).format(f);
};