/**
 * Created by sf on 14-10-23.
 */
define('modules/zf/yhxw', [], function (require, exports, module) {
    'use strict';
    var ubList = [];
    var ubCollect;
    var vars = seajs.data.vars;
    module.exports = function (options) {
        if (ubCollect) {
            ubCollect(options);
        } else {
            ubList.push(options);
        }
    };
    require.async(['jsub/_ubm.js'], function () {
        ubCollect = function (options) {
            // 页面标志默认为租房房列表页
            var pageId = options.pageId || 'mzflist';
            // 用户动作类型默认为浏览
            var type = options.type || 0;
            // 获取当前频道，默认频道为租房
            var curChannel = options.curChannel || 'zf';
            // 如果vars中不存在所需要的参数值则接收需要得参数数组
            var paramsArr = options.params || [];
            // 引入另一个js文件
            require.async('jsub/_vb.js?c=' + pageId);
            // 城市名称（中文)
            _ub.city = vars.cityname;
            // 租房业务
            _ub.biz = pageId === 'mzfmap' ? 'Z' : 'z';
            var ns = vars.ns === 'n' ? 0 : 1;
            // 方位（南北方) ，北方为0，南方为1
            _ub.location = ns;
            // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
            var b = type;
            var pTemp, room, position, subway, price;
            // 处理传入居室
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

            // 添加区县+商圈参数
            if (vars.districtTempparamName && vars.districtTempparamName.length > 0) {
                position = encodeURIComponent(vars.districtTempparamName || '') + '^' + encodeURIComponent(vars.comareaTempparamName || '');
            }
            // 添加地铁+地铁站
            if (vars.railwayTempparamName && vars.railwayTempparamName.length > 0) {
                subway = encodeURIComponent(vars.railwayTempparamName || '') + '^' + encodeURIComponent(vars.stationTempparamName || '');
            }
            // 租房列表页进行埋码
            if (vars.action === 'index' && curChannel === 'zf') {
                var priceArr;
                // 处理传入价格
                if (vars.price && vars.price.length > 0) {
                    priceArr = vars.price.split('-');
                    if (priceArr.length > 1 && parseInt(priceArr[0]) > 0 && parseInt(priceArr[1]) === 0) {
                        price = priceArr[0] + '-99999';
                    } else {
                        price = vars.price;
                    }
                }
                pTemp = {
                    // 城市中文名称
                    'vmz.city': encodeURIComponent(vars.cityname),
                    // 页面标识
                    'vmg.page': pageId,
                    // 关键字
                    'vmz.key': encodeURIComponent(vars.keyword),
                    // 区县^商圈
                    'vmz.position': position,
                    // 地铁线^地铁站
                    'vmz.subway': subway,
                    // 租金
                    'vmz.rentprice': price,
                    // 来源
                    'vmz.source': encodeURIComponent(vars.housetypeTempparamName),
                    // 户型
                    'vmz.housetype': encodeURIComponent(room),
                    // 租住方式
                    'vmz.renttype': encodeURIComponent(vars.rtypeTempparamName),
                    // 特色
                    'vmz.feature': encodeURIComponent(vars.tagsTempparamName),
                    // 朝向
                    'vmz.direction': encodeURIComponent(vars.towardsTempparamName),
                    // 楼层
                    'vmz.floornum': encodeURIComponent(vars.floorTempparamName),
                    // 类型
                    'vmz.genre': encodeURIComponent(vars.purpose),
                    // 装修
                    'vmz.fixstatus': encodeURIComponent(vars.equipmentTempparamName),
                    // 楼盘ID
                    'vme.projectid': vars.projectId,
                };
            } else if (vars.action === 'zfMap' && curChannel === 'zfmap') {
                // 租房地图用户行为统计
                 // 价格
                var mapPrice = '';
                if (paramsArr.strPrice) {
                    var tempPrice = paramsArr.strPrice.split('^');
                     // 调整价格值（当传入值为1000,0）时将传入值改为(1000,99999)
                    if (parseInt(tempPrice[0]) > 0 && (parseInt(tempPrice[1]) === 0 || !tempPrice[1])) {
                        tempPrice[1] = 99999;
                    } else if (!tempPrice[0]) {
                        tempPrice[0] = 0;
                    }
                    mapPrice = tempPrice[0] + '-' + tempPrice[1];
                }
                // 处理户型
                var mapRoom = paramsArr.bedrooms ? paramsArr.bedrooms : '';
                if (mapRoom) {
                    if (parseInt(mapRoom) <= 5) {
                        mapRoom += '室';
                    } else {
                        mapRoom += '室以上';
                    }
                }
                // 区县^商圈
                var mapPosition = paramsArr.strDistrict ? encodeURIComponent(paramsArr.strDistrict) : '';
                if (paramsArr.strComArea) {
                    mapPosition += '^' + encodeURIComponent(paramsArr.strComArea);
                }
                // 地铁线^地铁站名
                var mapSubway = paramsArr.railwayName ? encodeURIComponent(paramsArr.railwayName) : '';
                if (paramsArr.stationName) {
                    mapSubway += '^' + encodeURIComponent(paramsArr.stationName);
                }

                pTemp = {
                    // 关键字
                    'vmz.key': encodeURIComponent(paramsArr.strKeyword),
                    // 页面标识
                    'vmg.page': pageId,
                    // 租金
                    'vmz.rentprice': encodeURIComponent(mapPrice),
                    // 户型
                    'vmz.housetype': encodeURIComponent(mapRoom),
                    // 区县^商圈
                    'vmz.position': mapPosition,
                    // 地铁线^地铁站名
                    'vmz.subway': mapSubway,
                    // 来源
                    'vmz.source': encodeURIComponent(vars.housetypeTempparamName),
                    // 出租方式
                    'vmz.renttype': encodeURIComponent(vars.mapTemplateMore.rtype || ''),
                    // 特色
                    'vmz.feature': encodeURIComponent(vars.mapTemplateMore.tag || ''),
                    // 朝向
                    'vmz.direction': encodeURIComponent(vars.mapTemplateMore.towards || ''),
                    // 楼层
                    'vmz.floornum': encodeURIComponent(vars.mapTemplateMore.floor || ''),
                    // 装修
                    'vmz.fixstatus': encodeURIComponent(vars.mapTemplateMore.equipment || '')
                };
                // 租房详情页
            } else if (vars.action === 'detail' && curChannel === 'zf') {
                switch (type) {
                    // 浏览
                    case 0:
                        pTemp = {
                            // 房源id
                            'vmz.houseid': vars.houseid,
                            // 所属页面
                            'vmg.page': pageId,
                            // 楼盘id
                            'vmz.projectid': vars.projcode,
                            // 经纪人id
                            'vmz.agentid': vars.agentid,
                            // 来源
                            'vmz.source': encodeURIComponent(vars.housetype_name),
                            // 租金
                            'vmz.rentprice': parseInt(vars.price),
                            // 区县
                            'vmz.district': encodeURIComponent(vars.district_name),
                            // 商圈
                            'vmz.comarea': encodeURIComponent(vars.comarea_tempparam_name),
                            // 面积
                            'vmz.area': vars.allacreage,
                            // 户型
                            'vmz.housetype': encodeURIComponent(parseInt(vars.roomNum) + '室'),
                            // 租赁方式
                            'vmz.renttype': encodeURIComponent(vars.rtype_tempparam_name),
                            // 楼层
                            'vmz.floornum': encodeURIComponent(vars.floornum),
                            // 朝向
                            'vmz.direction': encodeURIComponent(vars.towards_tempparam_name),
                            // 配套设施
                            'vmz.facility': vars.equipmentStr
                        };
                        break;
                    // 预约
                    case 8:

                    // 收藏
                    case 21:
                    // 分享
                    case 22:
                    // 在线咨询
                    case 24:
                    // 打电话
                    case 31:
                        pTemp = {
                            // 页面标识
                            'vmg.page': pageId,
                            // 房源ID
                            'vmz.houseid': vars.houseid,
                            // 楼盘ID
                            'vmz.projectid': vars.projcode,
                            // 经纪人id
                            'vmz.agentid': vars.agentid
                        };
                }
                // 我的租房频道选择出租方式页面
            } else if (vars.action === 'zfType' && curChannel === 'myzf') {
                pTemp = {
                    // 页面标识
                    'vmg.page': pageId
                };
                // 发布整租/合租页面
            } else if (vars.action === 'zfPublish' && curChannel === 'myzf') {
                // 根据vars.edit区分是否是发布或是修改
                if (vars.edit === '0') {
                    // 浏览
                    if (type === 0) {
                        pTemp = {
                            'vmg.page': pageId
                        };
                        // 整租/ 合租
                    } else if (type === 47 || type === 32) {
                        pTemp = {
                            // 所属页面
                            'vmg.page': pageId,
                            // 小区
                            'vmz.village': encodeURIComponent(paramsArr.projname),
                            // 区县
                            'vmz.district': encodeURIComponent(paramsArr.district),
                            // 商圈
                            'vmz.comarea': encodeURIComponent(paramsArr.comarea),
                            // 户型
                            'vmz.housetype': encodeURIComponent(paramsArr.room + '室' + paramsArr.hall + '厅' + paramsArr.toilet + '卫'),
                            // 配套
                            'vmz.facility': encodeURIComponent(paramsArr.equitment).replace(/%2C/g,','),
                            // 合租类型
                            'vmz.hztype': encodeURIComponent(paramsArr.rentway),
                            // 建筑面积
                            'vmz.area': encodeURIComponent(paramsArr.buildingarea),
                            // 租金
                            'vmz.rentprice': paramsArr.price,
                            // 姓名
                            'vmz.name': encodeURIComponent(paramsArr.contactperson),
                            // 性别
                            'vmz.sex': encodeURIComponent(paramsArr.gender),
                            // 手机号
                            'vmz.phone': paramsArr.mobilecode
                        };
                    }
                } else {
                    if (type === 0) {
                        var housestate;
                        switch (vars.housestate) {
                            case '5':
                                housestate = '已过期';
                                break;
                            case '8':
                                housestate = '已下架';
                                break;
                            case '3':
                                housestate = '正在出租';
                        }
                        pTemp = {
                            'vmg.page': pageId,
                            'vmg.renthouseinfo': vars.houseid + '^' + encodeURIComponent(vars.projname) + '^'
                            + encodeURIComponent(vars.inserttime) + '^' + encodeURIComponent(housestate)
                        };
                    } else if (type === 111) {
                        // 得到urlencode以后的字符串,用于埋码
                        var equitmentArr = paramsArr.equitment.split(','),
                            equitmentArrLength = equitmentArr.length;
                        if (!equitmentArr[equitmentArrLength - 1]) {
                            equitmentArr.pop();
                        }
                        var equitmentStr = '';
                        for (var j = 0; j < equitmentArr.length; j++) {
                            equitmentStr += encodeURIComponent(equitmentArr[j]) + ',';
                        }
                        equitmentStr = equitmentStr.substr(0, equitmentStr.length - 1);
                        pTemp = {
                            'vmg.page': pageId,
                            // 小区名称
                            'vmg.projectname': encodeURIComponent(vars.projname),
                            // 区县
                            'vmg.district': encodeURIComponent(vars.district),
                            // 商圈
                            'vmg.comarea': encodeURIComponent(vars.comarea),
                            // 合租类型
                            'vmg.hztype': encodeURIComponent(paramsArr.renttype),
                            // 面积
                            'vmg.area': encodeURIComponent(paramsArr.buildingarea),
                            // 租金
                            'vmg.rentprice': paramsArr.price,
                            // 设备
                            'vmg.facility': equitmentStr,
                            // 租客姓名
                            'vmg.name': encodeURIComponent(paramsArr.contactperson),
                            // 性别
                            'vmg.sex': encodeURIComponent(paramsArr.gender),
                            // 电话号码
                            'vmg.phone': encodeURIComponent(paramsArr.mobilecode)
                        };
                    }
                }
            } else if (curChannel === 'myzf' && vars.action === 'zfList') {
                if (type === 0) {
                    pTemp = {
                        'vmg.page': pageId,
                        // 房源信息 房源ID^楼盘名称^发布时间^房源状态,后台处理传过来
                        'vmg.renthouseinfo': vars.renthouseinfo
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
    });
});