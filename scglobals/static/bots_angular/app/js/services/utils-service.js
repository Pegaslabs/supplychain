angular.module('SupplyChainApp.UtilsService', []).
factory('UtilsService', function () {
    Date.prototype.addDays = function(days)
    {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    }
    return {
        getPagination:function(meta_data, obj_length){
            var pages = [];
            var num_pages = Math.ceil(Number(meta_data["total_count"])/Number(meta_data["limit"]));
            var curr_page = (Number(meta_data["offset"])/Number(meta_data["limit"])) + 1;
            var page_start = Number(meta_data["offset"]) + 1;
            var page_end = page_start + obj_length-1;
            var total_count = meta_data["total_count"];
            var page = {};
            var active = false;
            var dotdot = false;
            for (var i = 1; i <= num_pages; i++){
                if (i === curr_page){
                    pages.push({"page_num" : i, "active" : true, "dotdot" : false});
                }
                else if(num_pages < 7){
                    pages.push({"page_num" : i, "active" : false, "dotdot" : false});
                } 
                else
                {
                    active = false;
                    if(i === (curr_page-1)){
                        if (i > 2){
                            pages.push({"dotdot" : true});
                        }
                        pages.push({"page_num" : i, "active" : false, "dotdot" : false});
                    }
                    else if(i === curr_page+1){
                        if (i < num_pages - 1){
                            pages.push({"page_num" : i, "active" : false, "dotdot" : false});
                            pages.push({"dotdot" : true});
                        }
                        else{
                            pages.push({"page_num" : i, "active" : false, "dotdot" : false});
                        }
                    }
                    // not the current page, current page +/- one
                    else if (i === 1 || i === num_pages){
                        pages.push({"page_num" : i, "active" : false, "dotdot" : false});
                    }
                }
            }
            if (pages.length <= 1){
                pages = [];
            }
            return {"pages" : pages, 
            "page_start" : page_start,
            "page_end" : page_end, 
            "total_count" : total_count};
        },
        isNumeric:function(n){
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        validate_date:function(d){
            try{
                if (d[0] === "T" || d[0] === "t"){
                    if (d.length === 1){
                        return true;
                    }
                    if ((d.split("+").length === 2 || d.split("-").length === 2) && (this.isNumeric(d.split("+")[1]) || this.isNumeric(d.split("-")[1]))){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                var ds = d.split("/");
                var year = (ds[2].length !== 4) ? ("-20" + ds[2]) : "-" + ds[2];
                var d = new Date(ds[1] + "-" + ds[0] + year);
                if (isNaN(d) || year.length !== 5){
                    throw "exception";
                }
                return true;
            }catch(e){
                return false;
            }
        },
        get_js_date:function(d){
            // validation happened above
            // strip time and make just 00 second of day
            if (d[0] === "T" || d[0] === "t"){
                if (d.length === 1){
                    var t_with_time = new Date();
                    return new Date(t_with_time.getFullYear() + "-" + (t_with_time.getMonth() + 1) + "-" + t_with_time.getDate());
                }
                if (d.split("+").length === 2){
                    var t_with_time = new Date().addDays(Number(d.split("+")[1]));
                    return new Date(t_with_time.getFullYear() + "-" + (t_with_time.getMonth() + 1) + "-" + t_with_time.getDate());
                }else{
                    var t_with_time = new Date().addDays((0-d.split("-")[1]));
                    return new Date(t_with_time.getFullYear() + "-" + (t_with_time.getMonth() + 1) + "-" + t_with_time.getDate());
                }
            }
            var ds = d.split("/");
            var year = (ds[2].length !== 4) ? ("-20" + ds[2]) : "-" + ds[2];
            var d = new Date(ds[1] + "-" + ds[0] + year);
            if (isNaN(d)){
                throw "exception";
            }
            return d;
        },
        download_array:function(rows,filename){
            var a = document.createElement('a');
            // /put regex in here/g means global (not just the first instance)
            // [inside here are windows/unix not safe filename chars] replace with ""
            a.download = filename.replace(/[\/:*?"<>|]/g,"") + ".xls";
            // var tsvString = rows.join("\n");
            // console.log(tsvString);
            var tsv_rows = [];
            _.forEach(rows,function(row){
                tsv_rows.push(row.join("\t"));
            });
            // console.log(tsv_rows);
            var blob = new Blob([tsv_rows.join("\n")], { type: 'text/plain' });
            a.href = URL.createObjectURL(blob);
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
        }
    }
});
