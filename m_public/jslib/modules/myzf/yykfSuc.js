define('modules/myzf/yykfSuc', ['jquery'],function(require, exports, module) {
    "use strict";
    module.exports = function() {
        var $ = require("jquery");
        var vars = seajs.data.vars;
        $("input[type=hidden]").each(function(index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid) {
            $.ajax({url: vars.mainSite + "data.d?m=houseinfotj&city=" + city + "&housetype=" + housetype + "&houseid=" + houseid + "&newcode=" + newcode + "&type=" + type + "&phone=" + phone + "&channel=" + channel + "&agentid=" + agentid, async: true});
        }
        ;

        $('.btnTel').on("click", function() {

            _ub.city = vars.cityname;
            _ub.biz = 'z';
            var ns = vars.cityns == 'n' ? 0 : 1;
            _ub.location = ns;
            var b = 31;
            var p_temp = {
                mz18: vars.houseid
            };
            var p = {};
            for (var temp in p_temp) {
                if (p_temp[temp] != null && "" != p_temp[temp] && undefined != p_temp[temp] && "undefined" != p_temp[temp]) {
                    p[temp] = p_temp[temp];
                }
            }
            _ub.collect(b, p);

            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7]);
        });


    };
});