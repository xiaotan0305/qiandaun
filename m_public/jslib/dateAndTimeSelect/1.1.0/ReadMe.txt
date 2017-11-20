dateAndTimeSelect.js Release 说明文档
by blue
日期时间选择器
使用方法范例
先引入dateSeleact.css样式表
var options = {
            "type": "",//特殊类型，表示一些集团需要特殊的处理时间方式，jiaju是家具需求
            "yearRange": "2014-2016",//年份限制
            "singleLiHeight": 34,//单个选项的css高度，用于后面的位置计算
            "defaultTime": new Date().getTime(),//默认显示的日期，！！！请传入时间戳
            "dateCancelFunc": undefined,//取消按钮事件处理
            "dateConfirmFunc": undefined,//日期确定按钮事件处理
            "timeCancelFunc": undefined,//取消按钮事件处理
            "timeConfirmFunc": undefined//时间确定按钮事件处理
        };
if(seajs){
    var dtSelect = new DateAndTimeSelect(options);
}else{
    var dtSelect = new DateAndTimeSelect(options);
}
API
type分别为dtSelect.setting.SELET_TYPE_DATE（日期）和dtSelect.setting.SELET_TYPE_TIME（时间）
dtSelect.show(type);显示选择器
dtSelect.hide(type);隐藏选择器
通过四个自定义方法完整复杂操作，如点击确认按钮时隐藏自己设置的浮层
"dateConfirmFunc":function(date){//date为点击确认后返回的数据，日期形如y-M-d，时间形如h：m
    dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
    float.hide();
}



