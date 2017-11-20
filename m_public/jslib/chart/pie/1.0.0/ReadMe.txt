pie.js Release 说明文档

1.功能

    画一个饼状图并且带一起增加效果

2.用法
    id: "#pieCon",//容器id
    animateType:"increaseTogether",//效果类型，暂时只有这一种需要其他类型再扩展
    height:100,//canvas的高
    width:100,//canvas的宽
    radius:100,//半径
    part:100,//分割份数，即增量的速度
    space:4,//空白间隔的大小
    hollowedRadius:70,//是否挖空，如果为0则不挖空，否则为挖空的半径
    dataArr:[//数据数组，对象为两个值，value大小，color颜色
        {"value":10,"color":"#f00"},
        {"value":20,"color":"#0f0"},
        {"value":30,"color":"#00f"}
    ]
3.更新记录