define('modules/public/inc', ['jquery'],function(require,exports,module){
    var $ = require("jquery"),vars = seajs.data.vars,bua = navigator.userAgent.toLowerCase();
    var newMsgDom = $(".sms-num");
    require.async("newmsgnum/1.0.0/newmsgnum", function(NewMsgNum){
        new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
    });
    // hide bar
    window.scrollTo(0, 1);
    // backtoTop button
    var $window = $(window);
    $window.on('scroll.back', function(){
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(["backtop/1.0.0/backtop"], function(backTop){
                backTop();
            });
            $window.off('scroll.back');
        }
    });

    require.async(vars.public + "js/20141106.js");
    // 统计功能
    require.async(['count/loadforwapandm.min.js','count/loadonlyga.min.js']);
});