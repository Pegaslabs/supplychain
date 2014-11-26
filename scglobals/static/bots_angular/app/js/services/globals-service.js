Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

Date.prototype.serialize_date = function(){
    var month =  (Number(this.getMonth()) + 1);
    if (month.toString().length === 1){
        month = "0" + month.toString();
    }
    var day =  (Number(this.getDate()) + 1);
    if (day.toString().length === 1){
        day = "0" + day.toString();
    }
    return this.getFullYear() + "-" + month + "-" + day;
};