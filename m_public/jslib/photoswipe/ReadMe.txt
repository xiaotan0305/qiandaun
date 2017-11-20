photoswipe Release 说明文档

1.功能

    PhotoSwipe 是专为移动触摸设备设计的相册/画廊.兼容所有iPhone、iPad、黑莓6+,以及桌面浏览器.底层实现基于HTML/CSS/JavaScript,是一款免费开源的相册产品。

2.用法

    /*
     * 为简化js代码分布以下是一组简单的jquery插件
     *  @param int pagesize 每页内容 默认为15；
     *  @param curp 分页起始值默认为 2即从第二页开始启用分页加载
     *  @param pageUrl ajax分页地址
     *  @param totalcount 总数
     *  @param w
     * 当前插件所要绑定的对象
     */
    require.async("modules/mynew/pagination",function(){
        $("#drag").pagination({
            pagesize:10,
            curp:2,
            totalcount:count,
            w:$(window),
            target:$(".graybox_ul01"),
            pageUrl:pageUrl,
        });
    });

