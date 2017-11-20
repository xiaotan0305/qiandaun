/**
 * Created by LXM on 14-12-10.
 */
define("modules/news/slideBox",[],function(require,exports,module){
    var vars = seajs.data.vars;
    require.async("touchslide/1.0/touchslide",function(run){
        run({
            slideCell: "#slideBox",
            titCell: ".focusCount ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell: ".focusPic ul",
            effect: "leftLoop",
            interTime: 3000,
            delayTime: 1000,
            redirectURL:vars.newsSite+vars.city+ "/gqzt.html",
            autoPlay: true, //自动播放
            autoPage: true //自动分页
        });
    });
});