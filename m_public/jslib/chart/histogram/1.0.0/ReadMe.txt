histogram.js Release 说明文档

1.功能

    画柱状图。

2.用法
    require.async(["chart/histogram/1.0.0/histogram"],function(Histogram){
        var s=new Histogram({ id:"#histogram",//加载这个canvas的div容器id
            h:200,//高度
            w:"100%",//宽度
            per:0.6,//展示块高度比例，0.6为高度h的0.6倍
            sort:"none",//排序方式，none为升序，decrease为降序
            textH:50,//文字高度
            side:false,//是否为一边，即是否在data中value存在正负，true为双向，false为单向
            upColor:"#f00",//在上面块的颜色，如果在data中没有设置color则默认颜色为此
            downColor:"#00f",//在下面的块颜色，如果在data中没有设置color则默认颜色为此
            data:[
                {name:"三个字",value:-1.6,href:"http://m.fang.com",color:"#f00"},
                {name:"b",value:2.0,href:"http://m.fang.com",color:"#100"},
                {name:"c",value:2.5,href:"http://m.fang.com",color:"#f50"},
                {name:"d",value:-2.5,href:"http://m.fang.com",color:"#f01"},
                {name:"e",value:7.0,href:"http://m.fang.com",color:"#050"},
                {name:"f",value:3.7,href:"http://m.fang.com",color:"#012"},
                {name:"f",value:3.2,href:"http://m.fang.com",color:"#123"},
                {name:"f",value:3.4,href:"http://m.fang.com",color:"#321"},
                {name:"f",value:3.7,href:"http://m.fang.com",color:"#456"},
                {name:"f",value:-3.7,href:"http://m.fang.com",color:"#111"}
            ]});
        s.run();//运行上升动画
    });