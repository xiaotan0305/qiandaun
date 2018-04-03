/**
 * 用户行为统计类
 * Created by sf on 15-11-09.
 * @author liuxinlu@soufun.com
 */
define('modules/esf/yhxw', [], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var ubList = [];
    var ubCollect;
    module.exports = function (options) {
        if (ubCollect) {
            ubCollect(options);
        } else {
            ubList.push(options);
        }
    };
    require.async(['jsub/_ubm.js'], function () {
        ubCollect = function (options) {
            // 页面标志默认为二手房列表页
            var pageId = options.pageId || 'mesflist';
            // 用户动作类型默认为浏览
            var type = options.type || 0;
            // 获取当前频道，默认频道为二手房
            var curChannel = options.curChannel || 'esf';
            //打电话对应的经纪人id
            var agentid = options.agentid || '';
            // 如果vars中不存在所需要的参数值则接收需要得参数数组
            var paramArr = options.params || [];
            // 引入另一个js文件
            require.async('jsub/_vb.js?c=' + pageId);
            // 城市名称（中文)
            _ub.city = vars.cityname;
            // 新房 ‘n'，二手房 e ,租房n 查房价v 家居h,资讯i,知识k
            _ub.biz = pageId === 'mesfmap' ? 'E' : 'e';
            // 业务--jsub/_ubm.js',-WAP端(网通为0，电信为1，如无法获取方位则记录为0）
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // 方位（南北方) ，北方为0，南方为1
            var b = type;
            // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25,在线咨询24、分享22、收藏21）
            var floorName = '',
                room = '',
                position = '',
                orderby = '',
                subway = '';
            switch (vars.floor) {
                case '0' :
                    floorName = '低';
                    break;
                case '1' :
                    floorName = '中';
                    break;
                case '2' :
                    floorName = '高';
                    break;
                default :
                    floorName = '';
                    break;
            }
            // 添加地铁+地铁站
            if (vars.district_name && vars.district_name.length > 0) {
                position = encodeURIComponent(vars.district_name || '') + '^' + encodeURIComponent(vars.comarea_name || '');
            }
            // 添加区县+商圈参数
            if (vars.subway_name && vars.subway_name.length > 0) {
                subway = encodeURIComponent(vars.subway_name || '') + '^' + encodeURIComponent(vars.station_name || '');
            }
            switch (vars.orderby) {
                case '16':
                    orderby = '发布时间排序';
                    break;
                case '1':
                    orderby = '更新时间排序';
                    break;
                case '4':
                    orderby = '价格从低到高';
                    break;
                case '3':
                    orderby = '价格从高到低';
                    break;
                case '8':
                    orderby = '面积从小到大';
                    break;
                case '7':
                    orderby = '面积从大到小';
                    break;
                case '10':
                    orderby = '单价从低到高';
                    break;
                case '9':
                    orderby = '单价从高到低';
                    break;
                default :
                    orderby = '';
                    break;
            }
            // 处理户型
            if (vars.room) {
                switch (Number(vars.room)) {
                    case 0:
                        room = '一居';
                        break;
                    case 1:
                        room = '二居';
                        break;
                    case 2:
                        room = '三居';
                        break;
                    case 3:
                        room = '四居';
                        break;
                    case 4:
                        room = '五居';
                        break;
                    case 5:
                        room = '五居以上';
                        break;
                }
            }
            // 价格
            var varPrice = '', varprice = '';
            // 价格
            if (vars.price && vars.price.length) {
                varPrice = vars.price.split('^');
                // 调整价格值（当传入值为1000,0）时将传入值改为(1000,99999)
                if (parseInt(varPrice[0]) > 0 && parseInt(varPrice[1]) === 0) {
                    varPrice[1] = 99999;
                }
                varprice = varPrice[0] + '-' + varPrice[1];
            }

            // 来源 AGT是经纪人的意思
            var housesource;
            if (vars.housetype === 'AGT') {
                housesource = encodeURIComponent('经纪人');
            } else if (vars.housetype === 'A' || vars.housetype === 'B') {
                housesource = encodeURIComponent('佣金0.5%');
            } else {
                housesource = encodeURIComponent('个人');
            }
            // 地图页面积类型
            var varArea, vararea;
            if (vars.area && vars.area.length) {
                varArea = vars.area.split('^');
                // 调整面积值
                if (parseInt(varArea[0]) > 0 && parseInt(varArea[1]) === 0) {
                    vararea = varArea[0] + '平以上';
                } else if (parseInt(varArea[1]) > 0 && parseInt(varArea[0]) === 0) {
                    vararea = varArea[1] + '平以下';
                } else if (parseInt(varArea[0]) > 0 && parseInt(varArea[1]) > 0) {
                    vararea = varArea[0] + '-' + varArea[1] + '平';
                } else {
                    vararea = varArea[0];
                }
            }
            // 评价经纪人页vme.borkerevaluate传 好评、中评、差评
            if (paramArr.Elevel) {
                switch (paramArr.Elevel) {
                    case 3:
                        paramArr.Elevel = encodeURIComponent('好评');
                        break;
                    case 2:
                        paramArr.Elevel = encodeURIComponent('中评');
                        break;
                    case 1:
                        paramArr.Elevel = encodeURIComponent('差评');
                        break;
                }
            }

            var pTemp;
            if (vars.action === 'esfMap') {
                // 地铁线^地铁站
                var mapSubway = paramArr.railwayName ? encodeURIComponent(paramArr.railwayName) : '';
                if (paramArr.stationName) {
                    mapSubway += '^' + encodeURIComponent(paramArr.stationName);
                }
                // 面积
                var mapArea = '';
                if (paramArr.area) {
                    var areaArr = [];
                    var tempArea = paramArr.area.split('_');
                    for (var i = 0; i < tempArea.length; i++) {
                        if (paramArr.area.indexOf(tempArea[i]) !== -1) {
                            if (tempArea[i] === '0,50') {
                                areaArr.push(encodeURIComponent('50平以下'));
                            } else if (tempArea[i] === '300,') {
                                areaArr.push(encodeURIComponent('300平以上'));
                            } else {
                                areaArr.push(encodeURIComponent(tempArea[i].replace(',', '-') + '平'));
                            }
                        }
                    }
                    mapArea = areaArr.join(',');
                }
                // 价格
                var mapPrice = '';
                if (paramArr.strPrice) {
                    var tempPrice = paramArr.strPrice.split('^');
                     // 调整价格值（当传入值为1000,0）时将传入值改为(1000,99999)
                    if (parseInt(tempPrice[0]) > 0 && (parseInt(tempPrice[1]) === 0 || !tempPrice[1])) {
                        tempPrice[1] = 99999;
                    } else if (!tempPrice[0]) {
                        tempPrice[0] = 0;
                    }
                    mapPrice = tempPrice[0] + '-' + tempPrice[1];
                }
                // 居室
                // 处理户型
                var mapRoom = paramArr.bedrooms ? paramArr.bedrooms : '';
                if (mapRoom) {
                    if (parseInt(mapRoom) <= 5) {
                        mapRoom += '室';
                    } else {
                        mapRoom += '室以上';
                    }
                }
                // 位置
                var mapPosition = paramArr.strDistrict ? encodeURIComponent(paramArr.strDistrict) : '';
                if (paramArr.strComArea) {
                    mapPosition += '^' + encodeURIComponent(paramArr.strComArea);
                }
                // 特色
                var mapFeature = paramArr.tagName ? paramArr.tagName.split(',').map(function (value) { return encodeURIComponent(value); }).join(',') : '';
                // 朝向
                var mapDirection = paramArr.towards ? paramArr.towards.split(',').map(function (value) { return encodeURIComponent(value); }).join(',') : '';
                // 房龄
                var mapHouseage = '';
                if (paramArr.age) {
                    var tempHouseage = [];
                    if (paramArr.age.indexOf('0,5') !== -1) {
                        tempHouseage.push(encodeURIComponent('5年以内'));
                    }
                    if (paramArr.age.indexOf('5,10') !== -1) {
                        tempHouseage.push(encodeURIComponent('5-10年'));
                    }
                    if (paramArr.age.indexOf('10,20') !== -1) {
                        tempHouseage.push(encodeURIComponent('10-20年'));
                    }
                    if (paramArr.age.indexOf('20,0') !== -1) {
                        tempHouseage.push(encodeURIComponent('20年以上'));
                    }
                    mapHouseage = tempHouseage.join(',');
                }
                var mapFloor = '';
                if (paramArr.floor) {
                    var tempFloor = [];
                    if (paramArr.floor.indexOf('1') !== -1) {
                        tempFloor.push(encodeURIComponent('低(1-6楼)'));
                    }
                    if (paramArr.floor.indexOf('2') !== -1) {
                        tempFloor.push(encodeURIComponent('中(7到12楼)'));
                    }
                    if (paramArr.floor.indexOf('3') !== -1) {
                        tempFloor.push(encodeURIComponent('高(12楼以上)'));
                    }
                    mapFloor = tempFloor.join(',');
                }
                var mapFixstatus = '';
                if (paramArr.equipment) {
                    switch (paramArr.equipment) {
                        case '1':
                            mapFixstatus = encodeURIComponent('精装修');
                            break;
                        case '2':
                            mapFixstatus = encodeURIComponent('简装修');
                            break;
                        case '3':
                            mapFixstatus = encodeURIComponent('毛坯');
                            break;
                        default:
                            break;
                    }
                }
                pTemp = {
                    // 关键词
                    'vme.key': encodeURIComponent(paramArr.strKeyword),
                    // 页面标识
                    'vmg.page': pageId,
                    // 总价
                    'vme.totalprice': encodeURIComponent(mapPrice),
                    // 户型
                    'vme.housetype': encodeURIComponent(mapRoom),
                    // 面积
                    'vme.area': mapArea,
                    // 特色
                    'vme.feature': mapFeature,
                    // 区县^商圈
                    'vme.position': mapPosition,
                    // 地铁线^地铁站
                    'vme.subway': mapSubway,
                    // 朝向
                    'vme.direction': mapDirection,
                    // 房龄
                    'vme.houseage': mapHouseage,
                    // 楼层
                    'vme.floornum': mapFloor,
                    // 装修
                    'vme.fixstatus': mapFixstatus
                };
                // 当前页面为二手房列表页
            } else if (vars.action === 'index' && curChannel === 'esf') {
                pTemp = {
                    // 城市中文名
                    'vme.city': encodeURIComponent(vars.cityname),
                    // 地铁线^地铁站
                    'vme.subway': subway,
                    // 区县^商圈
                    'vme.position': position,
                    // 所属页面（每个页面都有唯一标识)
                    'vmg.page': pageId,
                    // 价格
                    'vme.totalprice': varprice,
                    // 户型
                    'vme.housetype': encodeURIComponent(room),
                    // 面积
                    'vme.area': encodeURIComponent(vararea),
                    // 特色
                    'vme.feature': encodeURIComponent(vars.tags_name),
                    // 房龄
                    'vme.houseage': encodeURIComponent(vars.age_name),
                    // 楼层
                    'vme.floornum': encodeURIComponent(floorName),
                    // 搜索关键词
                    'vme.key': encodeURIComponent(vars.keyword),
                    // 房源类型
                    'vme.genre': encodeURIComponent(vars.purpose),
                    // 排序
                    'vme.order': encodeURIComponent(vars.orderby_name),
                    // 楼盘ID
                    'vme.projectid': vars.projectId,
                };
                // 当前页面为详情页
            } else if ((vars.action === 'detail' || vars.action === 'jhdetail') && curChannel === 'esf') {
                // 浏览
                switch (type) {
                    case 0:
                        pTemp = {
                            // 位置（区域)
                            'vme.position': position,
                            // 楼盘id
                            'vme.projectid': vars.plotid,
                            // 所属页面
                            'vmg.page': pageId,
                            // 房源id
                            'vme.houseid': vars.houseid,
                            // 总价
                            'vme.totalprice': vars.price,
                            // 户型
                            'vme.housetype': encodeURIComponent(vars.room.slice(0, vars.room.lastIndexOf('室') + 1)),
                            // 区县
                            'vme.district': encodeURIComponent(vars.district),
                            // 商圈
                            'vme.comarea': encodeURIComponent(vars.comarea),
                            // 装修
                            'vme.fixstatus': encodeURIComponent(vars.fixstatus),
                            // 面积
                            'vme.area': vars.area,
                            // 朝向
                            'vme.direction': encodeURIComponent(vars.direction),
                            // 楼层
                            'vme.floornum': encodeURIComponent(vars.floornum),
                            // 建筑年代
                            'vme.year': vars.year,
                            // 来源
                            'vme.source': vars.houseSource,
                            // 优选房源增加组id
                            'vme.groupid': vars.groupid || '',
                        };
                        break;
                    // 预约看房
                    case 8:
                    // 收藏
                    case 21:
                    // 分享
                    case 22:
                    // 咨询
                    case 24:
                    // 打电话
                    case 31:
                        pTemp = {
                            // 页面标识
                            'vmg.page': pageId,
                            // 房源ID
                            'vme.houseid': vars.houseid,
                            // 楼盘ID
                            'vme.projectid': vars.plotid,
                            // 经纪人id
                            'vme.agentid': agentid,
                            // 优选房源增加组id
                            'vme.groupid': vars.groupid || '',
                        };
                        break;
                    // 申请代办过户
                    case 60:
                    // 直约业主
                    case 128:
                        pTemp = {
                            // 页面标识
                            'vmg.page': pageId,
                            // 房源ID
                            'vme.houseid': vars.houseid,
                            // 楼盘ID
                            'vme.projectid': vars.plotid,
                            // 手机号
                            'vme.phone': vars.loginphone
                        };
                        break;
                }
            } else if (vars.action === 'picDetail' && curChannel === 'esf') {
                pTemp = {
                    // 页面标识
                    'vmg.page': pageId,
                    // 楼盘ID
                    'vme.projectid': vars.projectid,
                    // 房源ID
                    'vme.houseid': vars.houseid
                };
            } else if (vars.action === 'new_schoolhouse_index' && curChannel === 'schoolhouse') {
                pTemp = {
                    // 搜索关键词
                    'vme.key': encodeURIComponent(vars.keyword),
                    // 所属页面（每个页面都有唯一标识)
                    'vmg.page': pageId,
                    // 区县^商圈
                    'vme.position': position,
                    // 学校特色
                    'vme.schooltype': encodeURIComponent(vars.feature)
                };
            } else if (vars.action === 'detail' && curChannel === 'schoolhouse') {
                pTemp = {
                    // 学校名称
                    'vme.school': encodeURIComponent(vars.schoolName),
                    // 所属页面（每个页面都有唯一标识)
                    'vmg.page': pageId
                };
                // 我的二手房频道中委托发布页面
            } else if (vars.action === 'delegateAndResale' && curChannel === 'myesf') {
                if (type === 0) {
                    pTemp = {
                        // 所属页面（每个页面都有唯一标识)
                        'vmg.page': pageId
                    };
                } else if (type === 46) {
                    pTemp = {
                        // 页面标识
                        'vmg.page': pageId,
                        // 楼盘名称
                        'vme.projectname': encodeURIComponent(paramArr.projName),
                        // 户型
                        'vme.housetype': paramArr.room + encodeURIComponent('室'),
                        // 面积
                        'vme.area': paramArr.area,
                        // 楼层
                        'vme.floornum': paramArr.floor,
                        // 总楼层
                        'vme.totalfloor': paramArr.totalfloor,
                        // 朝向
                        'vme.direction': encodeURIComponent(paramArr.forward),
                        // 总价
                        'vme.totalprice': paramArr.price,
                        // 姓名
                        'vme.name': encodeURIComponent(paramArr.linkman),
                        // 手机号
                        'vme.phone': paramArr.telephone
                    };
                }
                // 我的二手房委托发布成功页面
            } else if ((vars.action === 'successfabu' || vars.action === 'saleStaup') && curChannel === 'myesf') {
                if (type === 0) {
                    pTemp = {
                        // 所属页面（每个页面都有唯一标识)
                        'vmg.page': pageId
                    };
                }
                // 经纪人店铺页面
            } else if ((vars.action === 'agentShop' || vars.action === 'searchAgent') && curChannel === 'agent') {
                pTemp = {
                    // 所属页面
                    'vmg.page': pageId,
                    // 经纪人id
                    'vme.agentid': vars.agentid
                };
            } else if (vars.action === 'evaluationOfAgent' && curChannel === 'agent') {
                switch (type) {
                    case 0:
                        pTemp = {
                            // 所属页面
                            'vmg.page': pageId
                        };
                        break;
                    case 43:
                        pTemp = {
                            // 所属页面
                            'vmg.page': pageId,
                            // 经纪人ID
                            'vme.agentid': paramArr.agentid,
                            // 经纪人评价
                            'vme.borkerevaluate': paramArr.Elevel,
                            // 房屋信息真实性
                            'vme.housevalidity': paramArr.HouseInfoAccuracy,
                            // 服务态度满意度
                            'vme.servicedegree': paramArr.ServiceAttitude,
                            // 业务水平专业度
                            'vme.businessdegree': paramArr.Professional
                        };
                        break;
                }
            } else if (vars.action === 'xqDetail' && curChannel === 'xiaoqu') {
                pTemp = {
                    // 楼盘id
                    'vmg.projectid': vars.newcode,
                    // 所属页面
                    'vme.page': 'mvilpageesf',
                    // 区域
                    'vmg.position': vars.district,
                    // 均价
                    'vme.avgprice': vars.avePrice
                };
            } else if (vars.action === 'editDelegate' && curChannel === 'myesf') {
                if (type === 86) {
                    pTemp = {
                        // 所属页面（每个页面都有唯一标识)
                        'vmg.page': pageId,
                        // 所属小区
                        'vmg.projectname': encodeURIComponent(vars.projectname),
                        // 房屋类型(一居两居之类)
                        'vmg.housetype': encodeURIComponent(options.housetype),
                        // 面积
                        'vmg.area': options.area,
                        // 楼层
                        'vmg.floornum': encodeURIComponent(options.floornum),
                        // 价格
                        'vmg.totalprice': encodeURIComponent(options.totalprice),
                        // 区域
                        'vmg.direction': encodeURIComponent(options.direction),
                        // 姓名
                        'vmg.name': encodeURIComponent(options.name),
                        // 总楼层
                        'vmg.totalfloor': encodeURIComponent(options.totalfloor)

                    };
                } else if (type === 0) {
                    pTemp = {
                        // 所属页面（每个页面都有唯一标识)
                        'vmg.page': pageId
                    };
                }
            } else if (vars.action === 'myDaiKanRecord' && curChannel === 'myesf') {
                if (type === 0) {
                    pTemp = {
                        // 所属页面（每个页面都有唯一标识)
                        'vmg.page': pageId
                    };
                }
            }
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp.hasOwnProperty(temp)) {
                    if (pTemp[temp] !== null && '' !== pTemp[temp] && undefined !== pTemp[temp] && 'undefined' !== pTemp[temp]) {
                        p[temp] = pTemp[temp];
                    }
                }
            }
            // 收集方法 _ub.collect(1,{'编号':'记录值'});
            // 示例 _ub.collect(1,{'vmn.projectid':'1105210251'});
            _ub.collect(b, p);
            // 收集方法
        };

        while (ubList.length) {
            ubCollect(ubList.shift());
        }

        seajs.emit('jsub');
    });
});