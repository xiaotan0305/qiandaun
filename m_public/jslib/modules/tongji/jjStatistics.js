define('modules/tongji/jjStatistics', ['jquery'],function (require, exports, module) {
    "use strict";
    var $ = require("jquery"),
    vars = seajs.data.vars;
    module.exports = function (options) {
        //获取页面传过来的数据
        $("input[type=hidden]").each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        //alert(window.navigator.userAgent);
        //begin
        /*
        var w=$("#pieCon").width();
        var p = new Pie({
            width:w, height:w,radius:w,
            hollowedRadius: 0, dataArr: [{"value": 7.3, "color": "#7cb5ed"},
                {"value": 10.4, "color": "#424248"},
                {"value": 7.8, "color": "#8fed7c"},
                {"value": 0.7, "color": "#f7a35c"},
                {"value": 19.2, "color": "#8185e9"},
                {"value": 3.7, "color": "#f15c81"},
                {"value": 50.8, "color": "#e5d354"}
            ]
        });
        p.run();
        //
        var winW=$("#line").width();
        var l=new Line({width:winW});
        
        l.run();
        */
        require.async(["chart/line/2.0.0/line"],function(Line){
            var lineArr = [{lineColor:"#FF9900",pointColor:'#FF9900',data:dataline}];
            var curveW=$("#line").width();
            var l=new Line({unit:DateUnit,width:curveW+"px",height:"175px",w:curveW*2,h:350,id:'#line',lineArr:lineArr});
            l.run();
        });
        //end
    };
});