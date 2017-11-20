touchSlide Release 说明文档

1.功能

    滑动轮播插件

2.用法

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

