hammer Release 说明文档

1.功能

    hammer.js是一款开源的移动端脚本框架，他可以完美的实现在移端开发的大多数事件，如：点击、滑动、拖动、多点触控等事件。

2.用法

    hammer = $(".ps-uilayer").hammer({
                prevent_default: true,
                scale_treshold: 0,
                drag_horizontal: true,
                drag_vertical: true,
                drag_min_distance: 0
            });
    hammer.bind('transform', function(event) {

    });
    hammer.bind('transformend', function(event) {

    });

    ...