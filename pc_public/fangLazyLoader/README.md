# fangLazyLoader

> 判断元素是否在视图内进行相应操作，适用于图片懒加载、iframe懒加载、模块化多入口js懒加载、元素曝光率等统计。

## 简介

[示例Demo](http://pubtest.dmp.fang.com/demo/fangLazyLoader)

## 快速上手

> 可通过AMD、CMD模块化调用，也支持script直接引入。

### CMD模块化调用

``` javascript
// 引入fangjs和jquery
<script type="text/javascript" src="http://static.test.soufunimg.com/common_m/pc_public/fangjs/build/??fang2.3.2.js,jquery/jquery-3.js"></script>
// js调用
window.fang(['//static.test.soufunimg.com/common_m/pc_public/fangLazyLoader/fangLazyLoader.js'], function(fangLazyLoader) {
            // 调用示例
            new fangLazyLoader({
                // 作用的元素选择器
                selector: $(document).find('.ajax'),
                // 事件名 默认为浏览器滚动事件
                event: 'scroll',
                // 阈值
                threshold: 100,
                // 获取数据 的 data 属性，默认 data-attrbute
                data_attribute: 'ajax',
                // 赋值失败时候 备用src loadtype为img或iframe时生效
                data_attribute2: 'src2',
                // 设置加载类型
                loadtype: 'ajax',
                // 公共数据 loadtype为ajax时生效
                ajax_data: {
                    city: '北京',
                    source: 'pc',
                    channel: 'esf'
                },
                // ajax动态数据数组key loadtype为ajax时生效
                ajax_data_arrkey: 'houselist',
                // ajax请求类型 loadtype为ajax时生效
                ajax_type: 'POST',
                // ajax发送延迟时间 loadtype为ajax时生效
                ajax_timeout: 1000,
                // ajax请求地址 loadtype为ajax时生效
                ajax_url: location.origin + location.pathname,
                // 统计成功回调 loadtype为ajax时生效
                ajax_succes: function(result, data) {
                    console.log(result, data);
                },
                // 统计失败回调 loadtype为ajax时生效
                ajax_fail: function(err) {
                    console.log(err);
                },
                // 默认封面图片 loadtype为img时生效
                placeholder: '//static.soufunimg.com/common_m/pc_public/images/fang_placeholder.jpg',
                // 默认封loading图 loadtype为iframe时生效
                loading: '//static.soufunimg.com/common_m/pc_public/images/fang_loading.gif'
            });
        });
```

### 非模块化调用

``` javascript
// 引入fangjs和jquery
<script type="text/javascript" src="http://static.test.soufunimg.com/common_m/pc_public/fangjs/build/??fang2.3.2.js,jquery/jquery-3.js"></script>
// 引入插件
<script type="text/javascript" src="http://static.test.soufunimg.com/common_m/pc_public/fangLazyLoader/fangLazyLoader.js"></script>
// js调用---示例
new fangLazyLoader({
    // 作用的元素选择器
    selector: $(document).find('.ajax'),
    // 事件名 默认为浏览器滚动事件
    event: 'scroll',
    // 阈值
    threshold: 100,
    // 获取数据 的 data 属性，默认 data-attrbute
    data_attribute: 'ajax',
    // 赋值失败时候 备用src loadtype为img或iframe时生效
    data_attribute2: 'src2',
    // 设置加载类型
    loadtype: 'ajax',
    // 公共数据 loadtype为ajax时生效
    ajax_data: {
        city: '北京',
        source: 'pc',
        channel: 'esf'
    },
    // ajax动态数据数组key loadtype为ajax时生效
    ajax_data_arrkey: 'houselist',
    // ajax请求类型 loadtype为ajax时生效
    ajax_type: 'POST',
    // ajax发送延迟时间 loadtype为ajax时生效
    ajax_timeout: 1000,
    // ajax请求地址 loadtype为ajax时生效
    ajax_url: location.origin + location.pathname,
    // 统计成功回调 loadtype为ajax时生效
    ajax_succes: function(result, data) {
        console.log(result, data);
    },
    // 统计失败回调 loadtype为ajax时生效
    ajax_fail: function(err) {
        console.log(err);
    },
    // 默认封面图片 loadtype为img时生效
    placeholder: '//static.soufunimg.com/common_m/pc_public/images/fang_placeholder.jpg',
    // 默认封loading图 loadtype为iframe时生效
    loading: '//static.soufunimg.com/common_m/pc_public/images/fang_loading.gif'
});
```