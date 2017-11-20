hisline.js Release 说明文档

1.功能

    画混合图形。

2.数据格式
    var data = {
        "linedate": [{"name": "15-12", "value": "34981"}, {"name": "16-01", "value": "35086"}, {"name": "16-02", "value": "35160"}, {"name": "16-03", "value": "35456"}, {"name": "16-04", "value": "36175"}, {"name": "16-05", "value": "36810"
        }],
        "hisdata": [{"name": "15-12", "value": "100", "color": "#ffc488"}, {"name": "16-01", "value": "120", "color": "#ffc488"}, {"name": "16-02", "value": "140", "color": "#ffc488"}, {"name": "16-03", "value": "135", "color": "#ffc488"}, {"name": "16-04", "value": "90", "color": "#ffc488"}, {"name": "16-05", "value": "60", "color": "#ffc488"}]
    };
2.用法
    
    require.async(["chart/hisline/hisline"],function(Hisline){
        var l = new HisLine({
                    textColor: '#999',
                    id: '#hisLine',
                    w: $('#hisLine').width(),
                    h: 200,
                    showValue: false,
                    lineArr: lineArr,
                    hisArr: data.hisdata,
                    alertDom: '#trend'
                });
                l.run();
    });

