linechart.js Release 说明文档

1.功能

    画走势图。

2.用法
    /**
        id：容器id
        1000:纵坐标最小跨度
        color：线颜色
        name：线标名称
        arr：线数据（数组）
        showPoint：是否显示点
        estimate：是否显示虚线
    */
    require.async(["chart/2.0.0/linechart"],function(LineChart){
        LineChart(id, 1000, 0, {
            "0": {"color": "#f90", "name": vars.projname, "arr": arr0, "showPoint": true, 'estimate': flag},
            "1": {"color": "#507fbd", "name": vars.district_name, "arr": arr1, "showPoint": true},
            "2": {"color": "#999", "name": vars.cityname, "arr": arr2, "showPoint": true}},
            arr3);
    });

