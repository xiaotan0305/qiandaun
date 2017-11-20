define(function(require,exports,module){
    var $ = require('jquery');
    var _version = '1.0.0';
    var downApp = function(options){
        var _template =
            '<div style="position:fixed; left:0px; bottom:0px; top:0px; right:0px; background:rgba(0,0,0,0.4); z-index:10000;">'
                +  '<div class="rbox6" style="position:fixed; top:150px; left:50px;width:200px;background:#DCD9D9; z-index:1001;box-shadow: 0 0 8px #000000;-webkit-box-shadow:0 0 10px #000000;-moz-box-shadow:0 0 8px #000000; padding:10px">'
                +    '<div style="position:relative">'
                +      '<div id="closeBtn" style="position:absolute; right:-10px; top:-10px; background:url(//img2.soufun.com/wap/touch/img/tc-close.png) no-repeat center; background-size:20px 20px; width:30px; height:30px; cursor:pointer;"></div>'
                +    '</div>'
                +    '<div class="f16">'
                +      '<div class="flol" style="margin-top:4px"><img src="//img2.soufun.com/wap/touch/img/sf-60.png" width="42"></div>'
                +      '<div class="flol" style="padding-left:8px">'
                +        '<div>上APP查房价<br/>秒懂房价难题</div>'
                +        '<div style="background:url(//img2.soufun.com/wap/touch/img/star.png) no-repeat; height:18px; width:100px; background-size:100% 100%"></div>'
                +      '</div>'
                +      '<div class="clear"></div>'
                +    '</div>'
                +    '<div class="f14" style="margin:10px 0px 6px; padding-top:10px; border-top:1px #B7B7B7 solid;">' +
                '<a class="rbox6 flol agray" style="color: #5B5B5B;display:block; width:80px; height:28px; line-height:30px; background: url(//img2.soufun.com/wap/touch/img/mysf-bg.png) bottom;background-size:1px 100%; border:1px solid #A2A2A1;text-align:center; margin-left:12px">暂不下载</a>' +
                '<a class="rbox6 flol awhite" style="color: #ffffff;display:block; width:80px; height:28px; line-height:28px; background: url(//img2.soufun.com/wap/touch/img/appd-bg.png) bottom;background-size:1px 100%; border:1px solid #EA7B05;text-align:center; margin-left:10px">立刻下载</a>'
                +      '<div class="clear"></div>'
                +    '</div>'
                +  '</div>'
                +'</div>';
        var $window = $(window),
            dom = $(_template),
            turn_flag = 1,
            close = function(){
                dom.detach();
                try{
                    require.async("util",function(util){
                        util.setCookie('clientdownshow',1,1),util.setCookie('clientdownshow_index',1,1);
                    });
                    window.localStorage.setItem('downappshow',1);
                }catch (e){

                }
            },
            show = function(){
                dom.appendTo("body");
                isYun(0);
            },
            down = function(){
                close();
                require.async("util",function(util){
                    util.down();
                });
            },
            changlocWithGroll = function(){
                if(dom.is(":visible")){
                    var flyer = dom.children("div:first");
                    var element = flyer.get(0);
                    var locHeight = parseInt(($window.innerHeight()-element.offsetHeight)/2);
                    var locWidth =  parseInt(($window.innerWidth()-element.offsetWidth)/2)-9;
                    flyer.css({top:locHeight,left:locWidth});
                }
            },
            isYun = function (flag){
                if(flag!=turn_flag){
                    turn_flag=flag;
                    changlocWithGroll();
                }
            };
        dom.find("div#closeBtn").click(function(){
            close();
        });
        var aBtn = dom.find("a");
        aBtn.eq(0).click(function(){
            close();
        });
        aBtn.eq(1).click(function(){
            down();
        });
        $window.bind({
            "orientationchange":function(){
                switch(window.orientation) {
                    case 0: isYun(0);break;
                    case 180: isYun(2);break;
                    case -90: isYun(3);break;
                    case 90:isYun(1);break;
                }
            },
            "resize":function(){
                changlocWithGroll();
            }
        });
        show();
    };
    module.exports = downApp;
});