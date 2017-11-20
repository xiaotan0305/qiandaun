pie.js Release 说明文档

1.功能

    画饼状图。

2.用法
    /**
        canvas_pie：容器id
        data_arr:需要的数据数组
        color_arr：颜色数组
    */
    require.async(["chart/1.0.0/pie"],function(ChartPie){
        var pie = new ChartPie("#canvas_pie"/*容器id*/);
        pie.draw({data: data_arr, color: color_arr});
    });

