line.js Release 说明文档

1.功能

    1.0.0/line.js： 画一条曲线走势图

    2.0.0/line.js： 画一条或多条曲线走势图，且超出屏幕自动滑动功能(可选)

2.用法

    1.0.0/line.js

        /**
            id：容器id
            width:css样式宽度
            height：css样式高度
            w: canvas宽度
            h：canvas高度
            lineColor：线颜色
            pointColor：点颜色
            data：线数据(数据属性：name：横坐标数据，value：纵坐标数据)
        */

       require.async(["chart/line/1.0.0/line"],function(Line){
           var l=new Line({lineColor:"#FF9900",pointColor:'#FF9900',width:curveW,height:"175px",w:curveW*2,h:350,data:priceData});
           l.run();
       });

       注：1.以防失真，canvas宽高要分别是css样式的二倍。

    2.0.0/line.js

        /**
            id：容器id
            width:css样式宽度
            height：css样式高度
            w: canvas宽度
            h：canvas高度
            lineColor：线颜色
            pointColor：点颜色
            data：一条线数据(数据属性：name：横坐标数据，value：纵坐标数据)
            lineArr：一条或多条曲线数据组成的数组
        */

        require.async(["chart/line/2.0.0/line"],function(Line){
            var lineArr = [],line1 = {lineColor:"#FF9900",pointColor:'#FF9900',data:data.esf},
                        line2 = {lineColor:"#16ac0e",pointColor:'#16ac0e',data:data.xf};
            lineArr.push(line1,line2);
            var l=new Line({width:curveW*2,height:"175px",w:curveW*4,h:350,id:'#line',lineArr:lineArr});
            l.run(function(x){
                  $('#line').css('transform', 'translate(-'+x+'px, 0px)');
                  $('#line').css('transition-duration', '0.5s');
            });
        });

        注：1.以防失真，canvas宽高要分别是css样式的二倍。
            2.run()中参数可选，如果需要超出屏幕滑动效果，再传参。

3.更新记录

    1.0.0/line.js 一条曲线走势图

    2.0.0/line.js 添加多条曲线走势图和超出屏幕自动滑动功能