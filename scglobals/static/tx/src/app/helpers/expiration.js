import Moment from 'moment';

export default function(val) {
  var moment_date = Moment(val);
  if (moment_date.isValid()){
    return moment_date.format('MM/YYYY');
  }
  else{
    return "";
  }
};