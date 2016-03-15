import Moment from 'moment';

module.exports = function(context, block) {
  if (!context) return "";
  let f;
  if (!block){
    f = "LL";
  }
  else{
    f = block.hash.format || "LL";
  }
  if (block && block.hash && block.hash.calendar){
    return Moment().calendar(context,{sameElse : f}).toLowerCase();
  }
  else{
    // awful: http://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off
    return Moment(new Date(context.replace(/-/g, '\/').replace(/T.+/, ''))).format(f);
  }
};
