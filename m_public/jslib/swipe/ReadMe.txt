swipe Release 说明文档

1.功能

    滑动轮播插件

2.用法

    require.async("swipe/2.0/swipe", function (Swipe) {
        $("#slider").Swipe({
            speed: 500,
            callback: function (index, ele) {
                $("#nowCount").html(index + 1);
            }
        });
    });


 swiper 图片轮播插件说明使用版本swiper3.12
 
 调用方法
 模块化中使用
      //头部图片滑动
        var Swiper1 = require("swipe/3.10/swiper");
        Swiper1("#slider", {
            speed           : 500,
            loop            : false,
            onSlideChangeEnd: function (swiper) {
             //回调函数内部代码
            }
        });
  回调函数列表地址：http://www.swiper.com.cn/api/index.html