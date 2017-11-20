pagination Release 说明文档

1.功能

    分页组件。

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

