areaSelect.js Release 说明文档
by sunwenxiu
弹层控件选择选择器
可以传递参数 用'-'隔开
使用方法范例
先引入areaSelect.css样式表
var options = {
            "singleLiHeight": 34,//单个选项的css高度，用于后面的位置计算
            "title": "",//默认显示的名称
            /**
            * 选择器要显示的区域名称
            * 一级区域显示：['北京-100-200', '天津-360', '香港-230-300', ...]
            * 二级区域显示：{'河北-300-500': ['石家庄-500-210', '廊坊', ..],'河南': ['安阳', '郑州', ..],...}
            */
            "area": [],
            "defaultSelect": [],//默认选项
            "areaCancelFunc": undefined,//取消按钮事件处理
            "getSelection": undefined,//选择事件处理
        };
var options2 = {
            "singleLiHeight": 34,//单个选项的css高度，用于后面的位置计算
            "title": "",//默认显示的名称
            /**
            * 选择器要显示的区域名称
            * 一级区域显示：['北京', '天津', '香港', ...]
            * 二级区域显示：{'河北': ['石家庄', '廊坊', ..],'河南': ['安阳', '郑州', ..],...}
            */
            "area": [],
            "defaultSelect": [],//默认选项
            "areaCancelFunc": undefined,//取消按钮事件处理
            "getSelection": undefined,//选择事件处理
        };
var areaSelect = new areaSelect(options);
API
areaSelect.show();显示选择器
areaSelect.show(options2);显示选择器
通过两个自定义方法完整复杂操作，如选中的列表时获取用户选中的内容
"getSelection":function(area){//area为对象
    area = {
        data:{},
        element:{},
        value:''
    }
    console.log(area);
}



