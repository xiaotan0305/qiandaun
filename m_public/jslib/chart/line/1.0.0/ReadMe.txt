line.js Release 说明文档

1.功能

    1.0.0/line.js： 画一条折线走势图
2.用法
    1.0.0/line.js
       require.async(["chart/line/1.0.0/line"],function(Line){
           var l=new Line({
            id: "#line",//canvas容器的id
            h: 300,//宽度
            w: 640,//高度
            part: 10,//速度，越小越快
            per: 0.6,//呈现的高度比例在中心位置，并且为高度的0.6倍
            border: 40,//边距
            linePx: 4,//线粗
            pointRadis: 8,//点半径
            downTextH: 50,//下部文字所占高度
            textUpSp: 10,//文字距离画线的上部空间
            width: "640px",//canvascss宽度
            height: "300px",//canvascss高度
            textColor: "#000",//文本颜色
            lineColor: ["#f00","#0f0"],//线颜色
            pointColor: "#f00",//点颜色
            bgLineColor: "#ccc",//背景线颜色
            icon: {
                url: "#icon",
                w: 25,
                h: 25
            },
            data: [[
                {
                    name: "a",
                    value: 40000
                },
                {
                    name: "b",
                    value: 30000
                },
                {
                    name: "c",
                    value: 18000
                },
                {
                    name: "d",
                    value: 21000
                },
                {
                    name: "e",
                    value: 10000
                },
                {
                    name: "f",
                    value: 55500
                }
            ], [
                
                {
                    name: "b",
                    value: 30000
                },
                {
                    name: "a",
                    value: 40000
                },
                {
                    name: "c",
                    value: 18000
                },
                {
                    name: "f",
                    value: 55500
                },
                {
                    name: "d",
                    value: 21000
                },
                {
                    name: "e",
                    value: 10000
                }
            ]]
        });
           l.run();//执行动画
       });