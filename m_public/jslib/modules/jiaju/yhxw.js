/**
 * jiaju用户行为类
 */
define('modules/jiaju/yhxw', [], function (require, exports, module) {
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
            // 页面编号
            var page = options.page;
            // 用户动作类型默认为浏览
            var type = options.type || 0;
            // 引入另一个js文件
            require.async('jsub/_vb.js?c=' + page);
            // 城市名称（中文)
            _ub.city = vars.cityname;
            // 新房“n”，二手房‘e’，租房‘z’，家居‘h’，知识‘k’，资讯‘i’，小区网‘x’；查房价‘v’;海外网‘w’；个人中心‘g’；论坛‘b’；问答‘a’
            _ub.biz = 'h';
            // 业务--jsub/_ubm.js',-WAP端(网通为0，电信为1，如无法获取方位则记录为0）
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // 方位（南北方) ，北方为0，南方为1
            // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25,在线咨询24、分享22、收藏21）
            var b = type;

            // 公司id
            var companyid = options.companyid;
            // 风格
            var style = options.style;
            // 户型
            var housetype = options.housetype;
            // 面积
            var area = options.area;
            // 总价
            var totalprice = options.totalprice;
            // 搜索关键词
            var key = options.key;
            // 区域
            var position = options.position;
            // 地铁
            var subway = options.subway;
            // 排序
            var order = options.order;
            // 优惠服务
            var preferentialservice = options.preferentialservice;
            // 装修类型
            var fixstatustype = options.fixstatustype;
            // 施工方式
            var allandhalf = options.allandhalf;
            // 公司经度坐标
            var companylat = options.companylat;
            // 公司纬度坐标
            var companylng = options.companylng;
            // 姓名
            var name = options.name;
            // 手机
            var phone = options.phone;
            // 费用
            var charge = options.charge;
            // 年限
            var decorationage = options.decorationage;
            // 设计师id
            var designerid = options.designerid;
            // 案例id
            var caseid = options.caseid;
            // 来源页面
            var refpage = options.refpage;
            // 区县
            var district = options.district;
            // 楼盘名称
            var projectname = options.projectname;
            // 装修状态
            var decstate = options.decstate;
            // 建材商家增值服务
            var companyservice = options.companyservice;
            // 品类
            var material = options.material;
            // 城市中文
            var city = options.city;

            var pTemp;
            
            if (vars.action === 'companyCaseList') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.companyid': companyid,
                    'vmh.style': style === '风格' ? '' : encodeURIComponent(style),
                    'vmh.housetype': housetype === '居室' ? '' : encodeURIComponent(housetype),
                    'vmh.area': area === '面积' ? '' : encodeURIComponent(area),
                    'vmh.totalprice': totalprice === '总价' ? '' : encodeURIComponent(totalprice)
                };
            } else if (vars.action === 'firmMap') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.companylat': companylat,
                    'vmh.companylng': companylng,
                    'vmh.companyid': companyid
                };
            } else if (vars.action === 'zxCompanyDetail') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.companyid': companyid,
                    'vmh.phone': phone
                };
            } else if (vars.action === 'sjsList') {
                if (companyid) {
                    pTemp = {
                        'vmg.page': page,
                        'vmh.companyid': companyid
                    };
                } else {
                    pTemp = {
                        'vmg.page': page,
                        'vmh.key': key === '请输入设计师或公司名称' ? '' : encodeURIComponent(key),
                        'vmh.style': style === '风格' ? '' : encodeURIComponent(style),
                        'vmh.charge': charge === '费用' ? '' : encodeURIComponent(charge),
                        'vmh.decorationage': decorationage === '年限' ? '' : encodeURIComponent(decorationage),
                        'vmh.order': order === '排序' ? '' : encodeURIComponent(order)
                    };
                }
            } else if (vars.action === 'sjsAppointment') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.designerid': designerid,
                    'vmh.companyid': companyid,
                    'vmh.name': encodeURIComponent(name),
                    'vmh.phone': phone
                };
            } else if (vars.action === 'sjsInfo') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.designerid': designerid,
                    'vmh.companyid': companyid,
                    'vmh.phone': phone
                };
            } else if (vars.action === 'zxCaseList') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.key': key === '请输入楼盘、设计师或者公司名称' ? '' : encodeURIComponent(key),
                    'vmh.style': style === '风格' ? '' : encodeURIComponent(style),
                    'vmh.housetype': housetype === '居室' ? '' : encodeURIComponent(housetype),
                    'vmh.area': area === '面积' ? '' : encodeURIComponent(area),
                    'vmh.totalprice': totalprice === '总价' ? '' : encodeURIComponent(totalprice)
                };
            } else if (vars.action === 'zxCaseDetail') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.companyid': companyid,
                    'vmh.caseid': caseid,
                    'vmh.phone': phone
                };
            } else if (vars.action === 'tuanDetail' || vars.action === 'zxCompanyQuality' || vars.action === 'specialServiceDetail') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.companyid': companyid,
                    'vmh.phone': phone
                };
            } else if (vars.action === 'firmList') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.key': key === '同城装饰公司名称' ? '' : encodeURIComponent(key),
                    'vmh.position': encodeURIComponent(position),
                    'vmh.subway': encodeURIComponent(subway),
                    'vmh.preferentialservice': encodeURIComponent(preferentialservice),
                    'vmh.fixstatustype': encodeURIComponent(fixstatustype),
                    'vmh.totalprice': encodeURIComponent(totalprice),
                    'vmh.allandhalf': encodeURIComponent(allandhalf),
                    'vmh.order': order === '排序' ? '' : encodeURIComponent(order)
                };
            } else if (vars.action === 'quoteTotalPrice' || vars.action === 'bmFreeSignUp') {
                pTemp = {
                    'vmg.page': page,
                    'vmg.refpage': encodeURIComponent(refpage),
                    'vmh.area': encodeURIComponent(area),
                    'vmh.housetypelong': encodeURIComponent(housetype),
                    'vme.district': encodeURIComponent(district),
                    'vmg.projectname': encodeURIComponent(projectname),
                    'vmh.phone': phone,
                    'vmh.decstate': encodeURIComponent(decstate)
                };
            } else if (vars.action === 'loupanCaseList') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.style': style === '风格' ? '' : encodeURIComponent(style),
                    'vmh.housetype': housetype === '居室' ? '' : encodeURIComponent(housetype),
                    'vmh.area': area === '面积' ? '' : encodeURIComponent(area),
                    'vmh.totalprice': totalprice === '总价' ? '' : encodeURIComponent(totalprice)
                };
            } else if (vars.action === 'shopList') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.companyservice': companyservice === '所有商家' ? '' : encodeURIComponent(companyservice),
                    'vmh.key': key === '输入关键词搜索店铺名称/地址' ? '' : encodeURIComponent(key),
                    'vmh.order': encodeURIComponent(order),
                    'vmh.material': material === '所有品类' ? '' : encodeURIComponent(material)
                };
            } else if (vars.action === 'productList' || vars.action === 'hotCouponInfo') {
                pTemp = {
                    'vmg.page': page,
                    'vmh.key': key === '输入关键词搜索品牌/型号/产品名称' ? '' : encodeURIComponent(key),
                    'vmh.order': order === '所有产品' ? '' : encodeURIComponent(order),
                    'vmh.materialtype': material === '所有品类' ? '' : encodeURIComponent(material)
                };
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
        };
        while (ubList.length) {
            ubCollect(ubList.shift());
        }
    });
});