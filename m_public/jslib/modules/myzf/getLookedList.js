define('modules/myzf/getLookedList', ['jquery'],function(require, exports, module) {
    "use strict";
    module.exports = function() {
        var $ = require("jquery");
        var vars = seajs.data.vars;
        $("input[type=hidden]").each(function(index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid) {
            $.ajax({url: vars.mainSite + "data.d?m=houseinfotj&city=" + city + "&housetype=" + housetype + "&houseid=" + houseid + "&newcode=" + newcode + "&type=" + type + "&phone=" + phone + "&channel=" + channel + "&agentid=" + agentid, async: true});
        };
        
        $("#content").on("click",".btn-call",function(){
            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7]);
        });

        //加载更多
        var totalpage = Math.ceil(vars.total / vars.pagesize);
        if (totalpage<=1) {
            $('#drag').hide();
        }else{
            require.async("modules/myzf/loadnewmore", function (run) {
                run({url: vars.mySite + "?c=myzf&a=ajaxGetLookedList&city=" + vars.city +"&pagesize="+vars.pagesize+ "&Mobile=" + vars.mobile});
            });
            require.async("lazyload/1.9.1/lazyload", function () {
                $("img[data-original]").lazyload();
            });
        }
        

    };
});