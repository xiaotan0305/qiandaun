lazyload Release 说明文档

1.功能

    图片延迟加载插件

2.用法

    require.async("lazyload/1.9.1/lazyload", function () {
        $("img[data-original]").lazyload();
    });

3.参数说明
container	window	父容器。延迟加载父容器中的图片。 [Demo1] [Demo2]
event	'scroll'	触发加载的事件 [Demo]
effect	'show'	加载使用的动画效果，如 show, fadeIn, slideDown 等 jQuery 自带的效果，或者自定义动画。 [Demo]
effectspeed	undefined	动画时间。作为 effect 的参数使用：effect(effectspeed)
data_attribute	'original'	真实图片地址的 data 属性后缀
threshold	0	灵敏度。默认为 0 表示当图片出现在显示区域中的立即加载显示；设为整数表示图片距离 x 像素进入显示区域时进行加载；设为负数表示图片进入显示区域 x 像素时进行加载。
failure_limit	0	容差范围。页面滚动时，Lazy Load 会遍历延迟加载的图片，检查是否在显示区域内，默认找到第 1 张不可见的图片时，就终止遍历。因为 Lazy Load 认为图片的排序是与 HTML 中的代码中的排序相同，但是也可能会出现例外，通过该值来扩大容差范围。
skip_invisible	true	跳过隐藏的图片。图片不可见时（如 display:none），不强制加载。
appear	null	图片加载时的事件 (Function)，有 2 个参数：elements_left（未加载的图片数量）、settings（lazyload 的参数）。[Demo]（参考 DEMO 的源代码）
load	null	图片加载后的事件 (Function)，有 2 个参数，同 appear 。[Demo]（参考 DEMO 的源代码）