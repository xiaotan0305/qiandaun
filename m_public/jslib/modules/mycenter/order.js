define('modules/mycenter/order', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var $order = $('#order'),
        section = [],
        defaultImg = vars.public + 'images/loadingpic.jpg',
        $projname = $('#projname');
    // 当前页面地址
    var localUrl = window.location.href;
    var order = {

        /**
         * 新房电商
         * @param data
         */
        xfds: function (data) {
            if (data) {
                section = [];
                if (data.result && data.result.order && data.result.order[0]) {
                    var order = data.result.order[0],
                        //telarr = order.zygw_tel400.split('转'),
                        userState = '',
                        sign = '',
                        loupanSign,
                        // 详情链接地址
                        aurl = '',
                        // 查看全部id
                        listId = '',
                        // 标签
                        label = {},
                        // 详情链接id
                        detailId = '';
                    var dpid = '',
                        dkid = '',
                        dtid = '',
                        zygwid = '';
                    if (order.OrderType === '5') {
                        loupanSign = false;
                        sign = '117';
                        //纯新房通
                        aurl = 'http:' + vars.mainSite + 'house/ec/channel/order/detail?orderNo=' + order.orderNo;
                        userState = order.ddstate;
                    } else if (order.IsQiangGou === '1') {
                        loupanSign = false;
                        sign = '111';
                        if (order.ddstatus == 0 || order.ddstatus == 2) {
                            aurl = 'http:' + vars.mainSite + 'house/ec/channel/order/detail?orderNo=' + order.channelOrderNo;
                        } else {
                            aurl = 'javascript:void(0);';
                        }
                        label.color = '#f8502b';
                        label.txt = '房抢购';
                        userState = order.ddstate;
                    } else if (order.ActivityType === '4') {
                        loupanSign = false;
                        sign = '109';
                        // 特价房
                        aurl = 'http:' + vars.mainSite + 'house/ec/OrderDetail/OrderDetail?orderNo=' + order.orderNo;
                        label.color = '#cd3301';
                        label.txt = '特价';
                        userState = order.ddstate;
                    } else if (order.ActivityType === '0' && order.ischannelorder === '0') {
                        loupanSign = true;
                        sign = '103';
                        // 广告订单
                        listId = 'id="wapmysf_B02_16"';
                        label.color = '#f5bc79';
                        label.txt = '团购';
                        detailId = 'wapmysf_B02_17';
                        dpid = 'id="wapmysf_B02_19"';
                        dkid = 'id="wapmysf_B02_18"';
                        userState = order.ddstate;
                        aurl = vars.mainSite + 'house/PayOrder/OrderDetailNew2.aspx?v=' + order.orderNomi + '&money=' + order.money + '&moneytopay=' + order.moneyToPay;
                    } else {
                        sign = '101';
                        // 渠道订单
                        listId = 'id="wapmysf_B02_02"';
                        label.color = '#f8502b';
                        label.txt = '独家';
                        if (+order.ischannelorder === 1 && +order.IsZhiXiao === 1) {
                            label.color = '#ff5350';
                            label.txt = '网上直销';
                        }
                        aurl = 'http:' + vars.mainSite + 'house/ec/channel/order/detail?orderno=' + order.channelOrderNo;
                        if (order.TailId == '' || order.TailId == null || order.TailId < 1) {
                            // 楼盘单
                            loupanSign = true;
                            detailId = 'wapmysf_B02_10';
                            dpid = 'id="wapmysf_B02_05"';
                            dkid = 'id="wapmysf_B02_11"';
                            dtid = 'id="wapmysf_B02_15"';
                            zygwid = 'id="wapmysf_B02_14"';
                        } else {
                            loupanSign = false;
                            detailId = 'wapmysf_B02_03';
                            dpid = 'id="wapmysf_B02_12"';
                            dkid = 'id="wapmysf_B02_04"';
                            dtid = 'id="wapmysf_B02_09"';
                            zygwid = 'id="wapmysf_B02_08"';
                        }
                        userState = order.ddstate;
                    }
                    $projname.val(order.projName);
                    var loadhref = vars.mainSite + 'dk/ApplyLoan/Index.html?CustomSource=55';
                    if (sign === '117') {
                        section.push('<div><ul class="h-list bb"><li>',
                            '<a id="' + detailId + '" href="' + aurl + '" class="arr-r">',
                            '<div class="img">',
                            '<img src="' + (order.projImgUrl ? order.projImgUrl : defaultImg) + '"></div>',
                            '<div class="txt"><h3>');
                    } else {
                        section.push('<div><ul class="h-list bb"><li>',
                            '<a id="' + detailId + '" href="' + aurl + '" class="arr-r">',
                            '<div class="img"><div style="background-color: ' + label.color + ';position: absolute;left: 0;top: 0;padding: 1px 2px 0 2px;font-size: 10px;color: #fff;">' + label.txt + '</div>',
                            '<img src="' + (order.projImgUrl ? order.projImgUrl : defaultImg) + '"></div>',
                            '<div class="txt"><h3>');
                    }
                    if (userState === '已失效' || userState === '已退款') {
                        section.push('<span class="flor f999 f12">');
                    } else {
                        section.push('<span class="zt flor">');
                    }
                    section.push(userState + '</span>[' + order.city + ']' + order.projName + '</h3><p class="f12 f999" id="fanghao"></p>');
                    if (sign === '111' && userState === '已报名') {
                        section.push('<p class="f12 f999">报名时间：' + order.orderCreateTime + '</p></div></a></li></ul>');
                    } else if (sign === '111' && userState === '待付定金') {
                        section.push('</div></a></li></ul>');
                    } else {
                        section.push('<p class="f12 f999">下单时间：' + order.orderCreateTime + '</p></div></a></li></ul>');
                    }
                    if (sign === '101') {
                        //渠道订单单独处理
                        if (+order.ischannelorder === 1 && +order.IsZhiXiao === 1) {
                            // 新房网上直销
                            section.push('<div class="js-box pdY10 js-box2">');
                            if (+order.ChargePattern === 2 && +order.RenGouPayStatus === 0) {
                                // 新房企业付费楼盘网上直销
                                section.push('<a href="' + order.ZhiXiaoWapUrl + '" class="flor btn-yellow">付款</a>');
                                section.push('<p class="f12 f000">在线支付可锁定房源' + order.RenGouYuDingTime + '小时</p>');
                                section.push('<p class="f11 gray-8">待支付' + order.RenGouMoney + '元，' + order.RenGouYuDingTime + '小时后自动退回</p>');
                            } else if (/^\s*[15]\s*$/.test(order.ChargePattern) && /^\s*[01]\s*$/.test(order.userState) && +order.moneyToPay > 0) {
                                // 新房会员付费楼盘、会员+企业付费楼盘网上直销
                                if (order.IsPayServiceFeeOnline === '1') {
                                    // IsPayServiceFeeOnline=0或1 2016-10-25,limengyang.bj@fang.com添加
                                    section.push('<a href="' + order.ZhiXiaoWapUrl + '" class="flor btn-yellow">购买优惠</a>');
                                }
                                section.push('<p class="f12 f000">' + order.discount + '</p>');
                                section.push('<p class="f11 gray-8">待支付' + order.moneyToPay + '元，售楼处购房可享受优惠</p>');
                            }
                        } else {
                            if (order.ChannelWapPayUrl) {
                                section.push('<div class="f999 f12 pdY10 bb">在线付款即可锁定房源 <span class="flor fdf3 f14">' + order.moneyToPay + '元</span>');
                                section.push('<span class="flor f14">会员服务费：</span></div>');
                                section.push('<div class="pdY10 bb clearfix">');
                                // IsPayServiceFeeOnline=0或1 2016-10-25,limengyang.bj@fang.com添加
                                if (order.IsPayServiceFeeOnline === '1') {
                                    section.push('<a ' + (loupanSign === false ? 'id="wapmysf_B02_06" ' : '') + 'href="' + order.ChannelWapPayUrl + '" class="flor btn-yellow">付款</a>');
                                }
                            } else if (order.userState !== '3' && (order.customerState === '1' || order.customerState === '4') && order.RenGouMoney !== '0') {
                                section.push('<div class="f999 f12 pdY10 bb">在线付款即可锁定房源 <span class="flor fdf3 f14">' + order.RenGouMoney + '元</span>');
                                section.push('<span class="flor f14">定金：</span></div>');
                                section.push('<div class="pdY10 bb clearfix">');
                                section.push('<a ' + (loupanSign === false ? 'id="wapmysf_B02_06" ' : '') + 'href="http:' + vars.mainSite + 'house/ec/' + (order.IsZhiXiao === 1 ? 'directselling/PayConfirm' : 'RedBagDeduction') + '/Index?orderno=' + order.orderNo + '" class="flor btn-yellow">付款</a>');
                            } else {
                                section.push('<div class="pdY10 bb clearfix">');
                            }
                            section.push('<a ' + dpid + ' href="' + vars.mainSite + 'xf/' + order.encity + '/' + order.newcode + '/dianping.htm" class="btn-yellow flor">楼盘点评</a>');
                        }
                    } else if (sign !== '111') {
                        if (userState === '已下单' || userState === '已到访') {
                            if (loupanSign) {
                                if (order.moneyToPay != '0') {
                                    section.push('<div class="f999 f12 pdY10 bb">在线付款即可锁定房源 <span class="flor fdf3 f14">' + order.moneyToPay + '元</span>');
                                    section.push('<span class="flor f14">会员服务费：</span></div>');
                                }
                            } else if (order.RenGouMoney != '0') {
                                section.push('<div class="f999 f12 pdY10 bb">在线付款即可锁定房源 <span class="flor fdf3 f14">' + order.RenGouMoney + '元</span>');
                                section.push('<span class="flor f14">定金：</span></div>');
                            }
                            section.push('<div class="pdY10 bb clearfix">');
                            if (sign === '103') {
                                if (order.moneyToPay != '0') {
                                    section.push('<a ' + (loupanSign === false ? 'id="wapmysf_B02_06" ' : '') + 'href="http:' + vars.mainSite + 'house/ec/orderpaytransfer/advertpay?orderno=' + order.toPayOrderNo + '" class="flor btn-yellow">付款</a>');
                                }
                            } else if (sign === '109') {
                                if (order.RenGouMoney != '0') {
                                    section.push('<a ' + (loupanSign === false ? 'id="wapmysf_B02_06" ' : '') + 'href="http:' + aurl + '" class="flor btn-yellow">付款</a>');
                                }
                            }
                            section.push('<a ' + dpid + ' href="' + vars.mainSite + 'xf/' + order.encity + '/' + order.newcode + '/dianping.htm" class="btn-yellow flor">楼盘点评</a>');
                        } else {
                            section.push('<div class="pdY10 bb clearfix">');
                            section.push('<a ' + dpid + ' href="' + vars.mainSite + 'xf/' + order.encity + '/' + order.newcode + '/dianping.htm" class="btn-yellow flor">楼盘点评</a>');
                        }
                    }
                    section.push('</div>');
                    $order.append(section.join(''));
                    var tailid = '0';
                    //  获取房源房号信息
                    if (sign === '109' || sign === '111') {
                        tailid = order.TailId2;
                    } else if (!(sign === '101' && +order.ischannelorder === 1 && +order.IsZhiXiao === 1)) {
                        tailid = order.TailId;
                    }
                    if (sign != '117' && tailid != '0') {
                        var params = {
                            a: 'ajaxGetFangInfoByFangID',
                            newcode: order.newcode,
                            fangid: tailid,
                            cityname: order.city
                        };
                        vars.ajax('?c=mycenter', 'get', params, function (data) {
                            if (data) {
                                $('#fanghao').html(data);
                            }
                        });
                    }
                }
            }
        },
        /**
         * 新房询价
         * @param data
         */
        xfxunjia: function (data) {
            if (data) {
                section = [];
                if (data.result && data.result.XunJiaList && data.result.XunJiaList.XunJia && data.result.XunJiaList.XunJia[0]) {
                    var order = data.result.XunJiaList.XunJia[0];
                    section.push('<div><ul class="h-list bb"><li>');
                    if (order.WapUrl) {
                        section.push('<a href="' + order.WapUrl + '" class="arr-r">');
                    } else {
                        section.push('<a href="javascript:void(0);">');
                    }
                    section.push('<div class="img"><div style="background-color:#1fbbe8;position: absolute;left: 0;top: 0;padding: 1px 2px 0 2px;font-size: 10px;color: #fff;">询价</div>',
                        '<img src="' + (order.projImgUrl ? order.projImgUrl : defaultImg) + '"></div>',
                        '<div class="txt"><h3><span class="zt flor">已下单</span>[' + order.City + ']' + order.ProjName + '</h3>',
                        '<p class="f12 f999">询价时间：' + order.orderCreateTime + '</p>',
                        '</div></a></li></ul></div>');
                    $order.append(section.join(''));
                }
            }
        },
        /**
         * 二手房交易
         * @param data
         */
        esfjy: function (data) {
            if (data) {
                section = [];
                section.push('<div class=""><ul class="h-list bb"><li>',
                    '<div class="pt10"><span class="flor f11 f999">' + data.InsertTime + '</span><span class="tag-s center f11 yellow">' + data.Status + '</span></div>',
                    '<a id="wapmysf_B03_03" href="' + vars.mainSite + 'my/?c=myesf&a=getTraDetail&city=' + vars.city + '&tradeid=' + data.TradeID + '" class="arr-r"><div class="img"><img src="' + (data.PhotoUrl ? data.PhotoUrl : defaultImg) + '"></div><div class="txt item-2">',
                    '<h3>' + data.ProjName + '</h3><p class="f12 f999">' + '建筑面积:' + data.BuildArea + '㎡&nbsp;&nbsp;' + (data.Room != '0' ? data.Room + '室' : '') + (data.Hall != '0' ? data.Hall + '厅' : '') + '&nbsp;&nbsp;' + data.DealMoney + '万</p></div> </a></li></ul></div>');
                if (parseFloat(data.WaitingPayment) != 0 && (data.Status && data.Status != '已结单')) {
                    section.push('<div class="js-box pdY10"><a id="wapmysf_B03_04" href="' + vars.mainSite + 'my/?c=mycenter&a=fukuanToAPP&type=fukuan&city=' + vars.city + '" class="flor btn-yellow">付佣金</a>',
                        '<p class="f15">佣金：<span class="fd37">' + data.Commission + '元</span>&nbsp;&nbsp;待支付：<span class="fd37">' + data.WaitingPayment + '元</span></p></div>');
                }
                $order.append(section.join(''));
            }
        },

        /**
         * 二手房看房清单
         * @param data
         */
        esfkfqd: function (data) {
            if (data) {
                section = [];
                if (data.AllOrderList && data.AllOrderList.AllOrderDetailDTO && data.AllOrderList.AllOrderDetailDTO[0]) {
                    var order = data.AllOrderList.AllOrderDetailDTO[0];

                    section.push('<div><ul class="zygw-list bb"><li><div class="gw-btn flor">');
                    if (order.OrderStatus == '1') {
                        section.push('<a href="javascript:void(0);" id="wapmysf_B06_07" data-orderid="' + order.OrderID + '" class="flor">取消预约</a>');
                    } else if (order.OrderStatus == '2') {
                        section.push('<a href="#" id="wapmysf_B06_06" data-orderid=' + order.OrderID + ' data-msg=' + order.AgentName + ';' + order.AgentPhoto + ';' + order.MeetingTime + ' class="flor">写评价</a>');
                    }
                    section.push('<a id="wapmysf_B06_05" href="#" data-teltj="' + vars.city + ',esf,' + order.HouseID + ',,call,' + order.AgentMobile + ',waphouseinfo,,,DS" class="tel"><i></i></a></div>',
                        '<div class="img"><img src="' + (order.AgentPhoto ? order.AgentPhoto : defaultImg) + '" alt=""></div><div class="txt">');
                    if (order.AgentName) {
                        section.push('<h3 class="f13">' + order.AgentName + '</h3><p class="f12 f999">' + order.AgentCompany + '</p>');
                    } else {
                        section.push('<p class="f12 f999">正在为您分配带看人...</p>');
                    }
                    section.push('</div></li></ul><ul class="h-list bb"><li><a id="wapmysf_B06_04" href="' + vars.mainSite + 'esf/' + vars.city + '/DS_' + order.HouseID + '.html" class="arr-r">',
                        '<div class="img"><img src="' + (order.PhotoUrl ? order.PhotoUrl : defaultImg) + '"></div>',
                        '<div class="txt item-2"><h3>' + order.District + '  ' + order.ComArea + '  ' + order.ProjName + '</h3>',
                        '<p class="f12 f999">' + '建筑面积:' + (order.BuildArea ? order.BuildArea + '㎡' : '') + '&nbsp;&nbsp;' + (order.Room ? order.Room + '室' : '') + (order.Hall ? order.Hall + '厅' : '') + '&nbsp;&nbsp;',
                        order.Price + order.PriceType + '</p></div>');
                    if (order.OrderStatus == '1') {
                        section.push('<span class="tag yyy"></span>');
                    } else if (order.OrderStatus == '9') {
                        section.push('<span class="tag ypj"></span>');
                    } else if (order.OrderStatus == '2') {
                        section.push('<span class="tag ydk"></span>');
                    }
                    section.push('</a></li></ul><div class="pdY10 f12 lh20"><p>看房时间：' + order.MeetingTime + '</p>',
                        '<p>碰头地点：' + order.MeetingPlace + '</p></div>');
                    if (order.OrderStatus == '2' && order.CommentPrompt != '') {
                        section.push('<div class="pd10 bg-f4"><h3 class="f14 f333">顾问反馈</h3><p class="f12 pdY10 f999">' + order.CommentPrompt + '</p></div>');
                    }
                    section.push('</div>');
                    $order.append(section.join(''));
                    // 取消预约
                    var $cancelyy = $('#wapmysf_B06_07');
                    if ($cancelyy.length > 0) {
                        $cancelyy.on('click', function () {
                            var orderid = $(this).attr('data-orderid');
                            if (window.confirm('是否取消看房 ?')) {
                                var params = {
                                    a: 'yyCancleOrder',
                                    city: vars.city,
                                    orderID: orderid,
                                    r: Math.random()
                                };
                                var ajaxUrl = 'index.php?c=myesf',
                                    onComplete = function (data) {
                                        if (data === '1') {
                                            location.reload(true);
                                        } else {
                                            // 失败
                                            alert('取消预约失败，请稍后再试');
                                        }
                                    };
                                vars.ajax(ajaxUrl, 'get', params, onComplete);
                            }
                        });
                    }
                    // 点击 写评价
                    var $pj = $('#wapmysf_B06_06');
                    if ($pj.length > 0) {
                        $pj.on('click', function () {
                            vars.localStorage && window.localStorage.setItem('msg', $(this).attr('data-msg'));
                            window.location.href = vars.mySite + 'index.php?c=myesf&a=yiKanEvaluation&city=' + vars.city + '&orderid=' + $(this).attr('data-orderid');
                        });
                    }
                }
            }
        },

        /**
         * 我要卖房
         * @param data
         */
        wymf: function (data) {
            if (data) {
                section = [];
                if (data.GetDelegateInfoDto && data.GetDelegateInfoDto[0]) {
                    var order = data.GetDelegateInfoDto[0],
                        HouseStatus = '';
                    if (order.ReviewStatus == '0') {
                        HouseStatus = '待审核';
                    } else if (order.ReviewStatus == '2') {
                        HouseStatus = '审核未通过';
                    } else if (order.ReviewStatus == '1') {
                        if (order.HouseStatus == '1') {
                            HouseStatus = '委托中';
                        } else if (order.HouseStatus == '2') {
                            HouseStatus = '暂停出售';
                        } else if (order.HouseStatus == '4') {
                            HouseStatus = '已出售';
                        } else {
                            HouseStatus = '审核未通过';
                        }
                    }
                    section.push('<div class=""><ul class="h-list bb"><li><div class="pt10"><span class="flor f11 f999">' + order.insertdate + '</span>');
                    if (HouseStatus == '委托中' || HouseStatus == '待审核') {
                        section.push('<span class="tag-s yellow f11 center">' + HouseStatus + '</span></div><a href="javascript:void(0);" class="arr-r">',
                            '<div class="img" id="' + order.IndexId + '" data-order="' + order.IndexId + ',' + order.HouseId + ',' + order.price + ',' + order.room + ',' + order.hall + ',' + order.toilet + ',' + order.BuildingArea + ',' + order.Floor + ',' + order.TotalFloor + ',' + order.Forward + ',' + order.RawID + '">');
                        if (order.photourl == '') {
                            section.push('<span>上传图片</span><input id="wapmysf_B08_04" type="file" accept="image/*" class="mfupload" multiple="multiple">');
                        } else {
                            section.push('<img src="' + order.photourl + '">');
                        }
                    } else {
                        section.push('<span class="tag-s f11 center">' + HouseStatus + '</span></div><a id="wapmysf_B08_03" href="?c=mycenter&a=getWTDetailByID&city=' + order.CityDomain + '&rawID=' + order.RawID + '&indexId=' + order.IndexId + '&houseid=' + order.HouseId + '" class="arr-r">',
                            '<div class="img"><img src="' + (order.photourl ? order.photourl : defaultImg) + '">');
                    }
                    section.push('</div><div class="txt item-2" name="uploadDiv" id="wapmysf_B08_03" data-href="?c=mycenter&a=getWTDetailByID&city=' + order.CityDomain + '&rawID=' + order.RawID + '&indexId=' + order.IndexId + '&houseid=' + order.HouseId + '"><h3>' + order.projname + '</h3><p class="f12 f999">',
                        '建筑面积:' + order.BuildingArea + '㎡&nbsp;&nbsp;' + (order.room ? order.room + '室' : '') + (order.hall ? order.hall + '厅&nbsp;&nbsp;' : '') + order.price + order.pricetype + '</p></div></a></li></ul></div><div class="js-box pdY10 clearfix">');
                    if (HouseStatus === '委托中' || HouseStatus === '待审核') {
                        if (HouseStatus === '委托中') {
                            section.push('<a href="?c=mycenter&a=getWTDetailByID&city=' + order.CityDomain + '&rawID=' + order.RawID + '&indexId=' + order.IndexId + '&houseid=' + order.HouseId + '" class="flor btn-yellow">查看房源</a>');
                        } else {
                            section.push('<a id="wapmysf_B08_06" href="tel:400 890 6066" data-teltj="' + order.CityDomain + ',esf,' + order.HouseId + ',,call,400 890 6066,waphouseinfo,,,DS" class="flor btn-yellow tel">客服申诉</a>');
                        }
                        section.push('<a id="wapmysf_B08_05" href="?c=myesf&a=editDelegate&city=' + order.CityDomain + '&indexId=' + order.IndexId + '&houseId=' + order.HouseId + '&delegateID=&rawID=' + order.RawID + '" class="flor btn-yellow">修改</a>');
                    }
                    if (HouseStatus === '暂停出售') {
                        section.push('<a href="' + vars.mainSite + 'my/?c=myesf&a=delegateAndResale&city=' + order.CityDomain + '" class="flor btn-yellow">重新委托</a>');
                    }
                    if (HouseStatus === '审核未通过') {
                        section.push('<a id="wapmysf_B08_06" href="tel:400 890 6066" data-teltj="' + order.CityDomain + ',esf,' + order.HouseId + ',,call,400 890 6066,waphouseinfo,,,DS" class="flor btn-yellow tel">客服申诉</a>');
                    }
                    if (HouseStatus === '已出售') {
                        section.push('<a href="' + vars.mainSite + 'esf/' + order.CityDomain + '/?cstype=ds" class="flor btn-yellow">找房源</a>');
                    }
                    section.push('</div>');
                    $order.append(section.join(''));
                    if ($('input[type=file]').length > 0) {
                        require.async('modules/mycenter/upload', function (upload) {
                            upload.init({
                                url: '?c=myesf&a=ajaxUploadImg&city=' + order.CityDomain
                            });
                        });
                    }
                    // 链接跳转
                    $('div[name=uploadDiv]').on('click', function () {
                        window.location.href = $(this).attr('data-href');
                    });
                }
            }
        },

        /**
         * 租房付佣金
         * @param data
         */
        zffyj: function (data) {
            if (data) {
                section = [];
                if (data.Items && data.Items.LeaseCommissionDto && data.Items.LeaseCommissionDto[0]) {
                    var order = data.Items.LeaseCommissionDto[0],
                        status = '';
                    switch (order.PayStatus) {
                        case '0':
                            status = '待付款';
                            break;
                        case '1':
                            status = '已付款';
                            break;
                        case '-1':
                            status = '已取消';
                            break;
                    }
                    section.push('<div><ul class="h-list bb"><li>');
                    if (order.PayStatus == '0') {
                        section.push('<a id="wapmysf_B04_07" href="' + vars.zfSite + '?c=zf&a=zfOrderDetail&type=zffuyongjin&city=' + vars.city + '&tradeRentInfoId=' + order.TradeRentInfoId + '&leaseOrderId=' + order.LeaseOrderId + '&orderType=' + order.OrderType + '" class="arr-r">');
                    } else {
                        section.push('<a id="wapmysf_B04_07" href="javascript:void(0);">');
                    }
                    section.push('<div class="img"><img src="' + (order.PhotoUrl ? order.PhotoUrl : defaultImg) + '"></div><div class="txt"><h3><span class="zt flor">',
                        status + '</span>' + order.ProjName + (order.BuildingNumber ? order.BuildingNumber + '栋' : '') + (order.UnitNumber ? order.UnitNumber + '单元' : '') + order.HouseNumber + '</h3>',
                        '<p class="f12 f999">' + '建筑面积:' + order.BuildArea + order.BuildAreaUnit + '&nbsp;&nbsp;',
                        (order.Room ? order.Room + '室' : '') + (order.Hall ? order.Hall + '厅' : '   ') + '</p><p class="f12 f999"><span class="f11">' + order.ContractStartTime + '-' + order.ContractEndTime + '</span></p></div></a></li></ul></div>');
                    if (order.PayStatus == '0') {
                        section.push('<div class="js-box pdY10"><a id="wapmysf_B04_08" href="' + vars.zfSite + '?c=zf&a=zfOrderDetail&type=zffuyongjin&city=' + vars.city + '&tradeRentInfoId=' + order.TradeRentInfoId + '" class="flor btn-yellow">付佣金</a>',
                            '<p class="f15">应付佣金：<span class="fd37">' + order.Commission + order.CommissionType + '</span></p></div>');
                    }
                    $order.append(section.join(''));
                }
            }
        },

        /**
         * 租房付房租
         * @param data
         */
        zffgz: function (data) {
            if (data) {
                section = [];
                if (data.orderlist && data.orderlist.gethouserentorderlistres && data.orderlist.gethouserentorderlistres[0]) {
                    var order = data.orderlist.gethouserentorderlistres[0];
                    section.push('<div><ul class="h-list bb"><li>');
                    if (order.order_status == '0') {
                        section.push('<a id="wapmysf_B04_03" href="' + vars.mainSite + 'my/?c=mycenter&a=fukuanToAPP&type=fukuan&city=' + vars.city + '" class="arr-r">');
                    } else {
                        section.push('<a id="wapmysf_B04_03" href="javascript:void(0);">');
                    }
                    section.push('<div class="img"><img src="' + (order.titleimg ? order.titleimg : defaultImg) + '"></div>',
                        '<div class="txt"><h3><span class="zt flor">' + order.order_status_des + '</span>' + order.projname + order.house_address + '</h3><p class="f12 f999">',
                        (order.month_of_fee ? order.month_of_fee + '个月房租' : '') + '</p><p class="f12 f999"><span class="f11">' + order.date_pay + '-' + order.end_date + '</span></p></div></a></li></ul></div>');
                    if (order.order_status == '0') {
                        section.push('<div class="js-box pdY10">',
                            '<a id="wapmysf_B04_04" href="' + vars.mainSite + 'my/?c=mycenter&a=fukuanToAPP&type=fukuan&city=' + vars.city + '" class="flor btn-yellow">',
                            '付房租</a><p class="f15">房租：<span class="fd37">' + parseFloat(order.cost_total) + '元</span></p></div>');
                    }
                    $order.append(section.join(''));
                }
            }
        },

        /**
         * 租房看房清单
         * @param data
         */
        zfkfqd: function (data) {
            if (data && data.allZfConut > 0) {
                var order = data[0];
                section = [];
                section.push('<div><ul class="zygw-list bb"><li><div class="gw-btn flor">');
                var telid = '';
                if (order.type == 'zflookedOrderList') {
                    telid = 'id="wapmysf_B07_04"';
                    section.push('<a id="wapmysf_B07_05" href="' + vars.mainSite + 'my/?c=myzf&a=comment&city=' + vars.city + '&orderID=' + order.LeaseOrderId +
                        '&agentName=' + order.Name + '&agentPhoto=' + order.AgentAvatar + '&meetingTime=' + order.MeetTime + '&houseID=' + order.HouseNumber + '" class="flor">去评价</a>');
                } else {
                    telid = 'id="wapmysf_B07_03"';
                }
                section.push('<a ' + telid + ' class="tel" href="tel:' + order.Telephone + '"',
                    'data-teltj="' + vars.city + ',zf,' + (order.HouseNumber ? order.HouseNumber : '') + ',,call,' + order.Telephone + ',waphouseinfo,' + '"><i></i></a></div>',
                    '<div class="img"><img src="' + (order.AgentAvatar ? order.AgentAvatar : defaultImg) + '" alt=""></div><div class="txt"><h3 class="f13">' + order.Name + '<span class="f11">',
                    '(看房顾问）</span></h3><p class="f12 f999">' + order.Telephone + '</p></div></li></ul>');
                if (order.Houses && order.Houses.BookHouseSummaryDto) {
                    var projArr = order.Houses.BookHouseSummaryDto;
                    for (var i = 0, l = projArr.length; i < l; i++) {
                        var proj = order.Houses.BookHouseSummaryDto[i];
                        section.push('<ul class="h-list bb"><li>');
                        if (proj.IsValid != '0') {
                            if (proj.RoomId == '0') {
                                section.push('<li><a id="wapmysf_B06_04" href="' + vars.mainSite + 'zf/' + vars.city + '/DS_' + proj.HouseId + '.html" class="arr-r">');
                            } else {
                                section.push('<li><a id="wapmysf_B06_04" href="' + vars.mainSite + 'zf/' + vars.city + '/DSHZ_' + proj.RoomId + '.html" class="arr-r">');
                            }
                        } else {
                            section.push('<li class="gq"><a id="wapmysf_B06_04" href="javascript:void(0);" >');
                        }

                        section.push('<div class="img"><img src="' + (proj.PhotoUrl ? proj.PhotoUrl : defaultImg) + '"></div><div class="txt">',
                            '<h3>' + (proj.RoomType ? '【' + proj.RoomType + '】' : '') + proj.ProjName + ' ' + (proj.BuildingNumber ? proj.BuildingNumber + '号楼' : '') + (proj.UnitNumber ? proj.UnitNumber + '单元' : '') + '</h3>',
                            '<p class="f12 f999">' + '建筑面积:' + proj.BuildArea + '㎡&nbsp;&nbsp;' + (proj.Room ? proj.Room + '室' : '') + (proj.Hall ? proj.Hall + '厅  ' : '') + '</p>',
                            '<p class="f15 fd37">' + proj.Price + proj.PriceType + '</p></div></a></li></ul>');
                    }
                }

                if ((order.MeetTime && order.MeetTime !== '0001-01-01 00:00:00') || order.MeetPlace) {
                    section.push('<div class="pdY10 f12 lh20">');
                    if (order.MeetTime && order.MeetTime != '0001-01-01 00:00:00') {
                        section.push('<p>碰头时间：' + order.MeetTime + '</p>');
                    }
                    if (order.MeetPlace) {
                        section.push('<p>碰头地点：' + order.MeetPlace + '</p>');
                    }
                    section.push('</div>');
                } else if (order.WaitFollowingMessage) {
                    section.push('<div class="pdY10 f12 lh20"><p>看房顾问将很快联系您，请耐心等待～</p></div>');
                }
                section.push('</div>');
                $order.append(section.join(''));
            }
        },

        /**
         * 我要出租
         * @param data
         */
        wycz: function (data) {
            if (data && data[0]) {
                section = [];
                var order = data[0];
                section.push('<div><ul class="zf-list"><li><div class="list-item"><div class="c1">');
                // 租房详情地址
                var zfDetailUrl = '';
                // 租房编辑地址
                var zfEditUrl = '';
                // 租房置顶地址
                var zfZhiDingUrl = '';
                // 租房重租地址
                var zfChongZuUrl = '';
                if (order.housestate === '5') {
                    section.push('<p class="f999">已过期</p>');
                } else if (order.housestate === '8') {
                    section.push('<p class="f999">已下架</p>');
                } else if (order.housestate === '10') {
                    section.push('<p class="f999">出租成功</p>');
                } else {
                    section.push('浏览量<p class="f12 fblu3">' + order.TotalView + '</p>');
                }
                // 详情页跳转地址
                if (order.housestate !== '5' && order.housestate !== '8') {
                    zfDetailUrl = vars.mainSite + 'zf/' + order.citydomain + '/JX_' + order.houseid + '.html?r=' + Math.random();
                }
                if (order.purpose === '住宅') {
                    if (order.citydomain === 'cq') {
                        // zfEditUrl = vars.mySite + '?c=myzf&a=houseLeaseEdit&city=cq&' + (order.mosaicurl ? order.mosaicurl : '') + 'edit=1' + (order.channel ? order.channel : '');
                        zfEditUrl = vars.mySite + '?c=myzf&a=houseLeaseEdit&city=cq&' + (order.mosaicurl ? order.mosaicurl : '') + 'edit=1';
                        zfChongZuUrl = vars.mySite + '?c=myzf&a=houseLeaseEdit&city=cq&' + (order.mosaicurl ? order.mosaicurl : '') + 'edit=2';
                    } else {
                        zfEditUrl = vars.mySite + '?c=myzf&a=delegateAndRent&city=' + order.citydomain + '&Mobile=' + vars.userPhone + '&' + (order.mosaicurl ? order.mosaicurl : '') + 'edit=1';
                        zfChongZuUrl = vars.mySite + '?c=myzf&a=delegateAndRent&city=' + order.citydomain + '&Mobile=' + vars.userPhone + '&' + (order.mosaicurl ? order.mosaicurl : '') + 'edit=2';
                    }
                } else if (order.purpose === '写字楼') {
                    zfEditUrl = vars.mySite + '?c=myzf&a=officeLeaseTwo&city=' + order.citydomain + '&pubtype=3&edit=1&oldhouseid=' + (order.houseid ? order.houseid : '');
                    zfChongZuUrl = vars.mySite + '?c=myzf&a=newPublish&city=' + order.citydomain + '&Mobile=' + vars.userPhone + '&pubtype=3&edit=2&oldhouseid=' + order.houseid;
                }

                section.push('</div><div class="c2" id="wapmysf_B09_03">',
                    '<h2 class="f15"><span class="flor f12 f999">' + order.registdate + '</span>' + order.projname + (order.purpose !== '写字楼' && order.room ? order.room + '室' : '') + (order.purpose !== '写字楼' && order.hall ? order.hall + '厅' : '') + '</h2>',
                    '<p class="f13 f999">' + order.price + order.pricetype + '</p></div><div id="up" class="c3"><span><i class="down"></i></span></div></div>',
                    '<div class="zd-s4" id="thisNav" style="display:none;">');

                // 3是待租
                if (order.housestate === '3') {
                    // 置顶链接地址
                    if (order.isPromoting && order.isPromoting === '该房源未置顶') {
                        zfZhiDingUrl = vars.mySite + '?c=my&a=promotionSetPage&city=' + order.citydomain + '&houseid=' + order.houseid + '&projname=' + order.projname + '&district=' + order.district + '&comarea=' + order.comarea + '&state=bncz_zhiding';
                    }
                    section.push('<a id="wapmysf_B09_04" ' + (zfZhiDingUrl ? 'href="' + zfZhiDingUrl + '"' : '') + '>' + (zfZhiDingUrl ? '置顶' : '取消置顶') + '</a><em>|</em>',
                        '<a id="wapmysf_B09_05" data-id="' + order.houseid + '" href="javascript:void(0);" >刷新</a><em>|</em>',
                        '<a id="wapmysf_B09_06" ' + (zfEditUrl ? 'href="' + zfEditUrl + '"' : '') + '>编辑</a><em>|</em>',
                        '<a id="wapmysf_B09_07" class="changeRentStatus" data-id="' + order.houseid + '" isProm="' + order.isPromoting + '" data-status="down">下架</a>');
                } else if (order.housestate === '8') {
                    // 8是已下架，显示上架按钮
                    section.push('<a class="changeRentStatus" data-id="' + order.houseid + '" data-status="up">上架</a>');
                } else {
                    // 其他的有5是过期，10是出租成功，显示重租按钮
                    section.push('<a ' + (zfChongZuUrl ? 'href="' + zfChongZuUrl + '"' : '') + '>重租</a>');
                }

                section.push('</div>');
                $order.append(section.join(''));
                // 按钮切换显示置顶能功能
                var $up = $('#up'),
                    $thisNav = $('#thisNav'),
                    $i = $up.find('i');
                $up.on('click', function () {
                    if ($i.hasClass('down')) {
                        $i.attr('class', 'up');
                        $thisNav.show();
                    } else {
                        $i.attr('class', 'down');
                        $thisNav.hide();
                    }
                });
                // 房源跳转
                if (zfDetailUrl) {
                    $('#wapmysf_B09_03').on('click', function () {
                        window.location.href = zfDetailUrl;
                    });
                }

                // 没有置顶跳转地址
                if (!zfZhiDingUrl) {
                    // 取消置顶
                    $('#wapmysf_B09_04').on('click', function () {
                        $.ajax({
                            url: vars.mySite + '?c=myzf&a=ajaxCancelSetTop&houseid=' + order.houseid + '&city=' + order.citydomain,
                            type: 'GET',
                            success: function () {
                                window.location.href = localUrl;
                            }
                        });
                    });
                }
                // 刷新
                $('#wapmysf_B09_05').on('click', function () {
                    var houseid = $(this).attr('data-id');
                    var param = {
                        c: 'myzf',
                        a: 'ajaxRefreshRent',
                        city: order.citydomain,
                        houseid: houseid
                    };
                    vars.ajax(vars.mySite, 'get', param, function (data) {
                        var result = data.state;
                        if (result === '1' || result === '100') {
                            alert('刷新成功');
                            window.location.href = localUrl;
                        } else {
                            alert('刷新失败，请重新打开管理页面尝试。');
                        }
                    });
                });
                // 上下架
                $('.changeRentStatus').on('click', function () {
                    var $that = $(this),
                        houseid = $that.attr('data-id'),
                        isProm = $that.attr('isProm'),
                        status = $that.attr('data-status');
                    var param = {
                        c: 'myzf',
                        a: 'ajaxChangeRentStatus',
                        city: order.citydomain,
                        houseid: houseid,
                        status: status
                    };
                    // status=down是下架
                    if (status === 'down') {
                        if (confirm(isProm !== '该房源已置顶' && isProm !== '' ? '确认下架？下架后其他用户将无法浏览该房源。' : '确认下架？下架后置顶服务将同时取消。')) {
                            vars.ajax(vars.mySite, 'get', param, function (data) {
                                if (data.result === '100') {
                                    if (isProm === '该房源已置顶') {
                                        param.a = 'ajaxCancelSetTop';
                                        $.get(vars.mySite, param);
                                    }
                                    alert(decodeURI(data.message));
                                    window.location.href = localUrl;
                                } else {
                                    alert(decodeURI(data.message));
                                }
                            });
                        }
                    } else if (status === 'up') {
                        // status=up是上架
                        vars.ajax(vars.mySite, 'get', param, function (data) {
                            if (data.result === '100') {
                                alert(decodeURI(data.message));
                                window.location.href = localUrl;
                            } else {
                                alert(decodeURI(data.message));
                            }
                        });
                    }
                });
            }
        },

        /**
         * 新房看房清单（原名看房团）
         * @param data
         */
        xfkft: function (data) {
            if (data) {
                section = [];
                if (data.list && data.list.Line && data.list.Line[0]) {
                    var order = data.list.Line[0];
                    section.push('<div><ul class="h-list bb"><li><a href="' + order.url + '" class="arr-r"><div class="txt">',
                        '<h3 class="f16">' + order.LookHouseName + '</h3><p class="f13 f333">路线介绍：' + order.LineName + '</p>',
                        '<p class="f13 f333">最高优惠：' + order.HighDiscount + '</p></div></a></li></ul><div class="js-box pdY10 clearfix">',
                        '<a href="' + vars.mainSite + '/kanfangtuan/' + vars.city + '/' + order.LineID + '_' + order.LookHouseID + '.htm" class="flor btn-yellow">线路咨询</a></div></div>');
                    $order.append(section.join(''));
                }
            }
        },

        /**
         * 家居-电商
         * @param data
         */
        jjds: function (data) {
            if (data) {
                section = [];
                if (data) {
                    var order = data;
                    section.push('<div class=""><ul class="h-list bb"><li><div class="pt10"><span class="c838 f12">订单编号：' + order.OrderID + '</span></div>',
                        '<a href="' + vars.mainSite + 'jiaju/?c=jiajuds&a=myOrderInfo&orderid=' + order.OrderID + '" class="arr-r">',
                        '<div class="img"><img src="' + order.LastPic + '"></div><div class="txt">',
                        '<h3 class="mb4">' + order.EstateName + '</h3>',
                        '<p class="f12 f999 mt2">下单时间：' + order.OrderCreateTime + '</p>',
                        '<p class="f12 f999 mt2">装修总价：' + order.Amount + '</p>',
                        '<p class="f12 f999 mt2">装修面积：' + order.Area + '</p></div></a></li></ul>');
                    $order.append(section.join(''));
                }
            }
        },

        /**
         * 新房媒体订单
         * @param data
         */
        xfmt: function (data) {
            if (data) {
                section = [];
                var order;
                if (data.orderlist && data.orderlist.order) {
                    if (data.orderlist.order[0]) {
                        order = data.orderlist.order[0];
                    } else {
                        order = data.orderlist.order;
                    }
                    section.push('<div><ul class="h-list bb"><li><a id="wapmysf_B02_21" href="' + order.waproomurl + '" class="arr-r">',
                        '<div class="img"><img src="' + (order.unitimg ? order.unitimg : defaultImg) + '"></div><div class="txt"><h3><span class="flor ff80 f12">' + order.orderstate + '</span>' + order.city + order.projname + '</h3>',
                        '<p class="f12 f999">' + order.roomname + '</p><p class="f12 f999">下单时间：' + order.createtime + '</p></div></a></li></ul></div>');
                    if ((order.orderstate == '已下单' || order.orderstate == '已付款' || order.orderstate == '已捐赠') && order.deposit) {
                        section.push('<div class="js-box pdY10">');
                        if (order.orderstate == '已下单') {
                            section.push('<a id="wapmysf_B02_22" href="' + vars.mainSite + 'my/?c=mycenter&a=fukuanToAPP&type=fukuan&city=' + vars.city + '" class="flor btn-yellow">付保证金</a>');
                        } else {
                            section.push('<a href="javascript:void(0);" class="btn-yellow flor">付保证金</a>');
                        }
                        section.push('<p class="f15">保证金：<span class="fd37">' + order.deposit + '</span></p></div>');
                    }
                    $order.append(section.join(''));
                }
            }
        },

        /**
         * 新房媒体订单(新增订单110)
         * @param data
         */
        xfmtNew: function (data) {
            if (data) {
                section = [];
                var order;
                if (data.items && data.items.item) {
                    if (data.items.item[0]) {
                        order = data.items.item[0];
                    } else {
                        order = data.items.item;
                    }
                    section.push('<div><ul class="h-list bb"><li><a id="wapmysf_B02_21" href="' + order.operateurl + '" class="arr-r">',
                        '<div class="img">' + '<div style="background-color:' + order.tagcolor + ';position: absolute;left: 0;top: 0;padding: 1px 2px 0 2px;font-size: 10px;color: #fff;">' + order.tagcontent + '</div>' + '<img src="' + (order.imgurl ? order.imgurl : defaultImg) + '"></div><div class="txt"><h3><span class="flor ff80 f12">' + order.orderstatus + '</span>' + order.buildingname + '</h3>',
                        '<p class="f12 f999">' + order.corporename + '</p><p class="f12 f999">下单时间：' + order.createtime + '</p></div></a></li></ul></div>');
                    if (order.showfoot == 'true') {
                        section.push('<div class="js-box pdY10">');
                        if (order.operable == 'true') {
                            section.push('<a id="wapmysf_B02_22" href="' + order.operateurl + '" class="flor btn-yellow">' + order.operatename + '</a>');
                        } else {
                            section.push('<a href="javascript:void(0);" class="btn-yellow flor">' + order.operatename + '</a>');
                        }
                        section.push('<p class="f15">' + order.paymentinfo + '：<span class="fd37">' + order.xfmtamount + order.unit + '</span></p></div>');
                    }
                    $order.append(section.join(''));
                }
            }
        },

        /**
         * 装修预约工地
         * @param data
         */
        zxyygd: function (data) {
            if (data) {
                section = [];
                if (data.list && data.list[0]) {
                    var order = data.list[0];
                    section.push('<div><ul class="zygw-list bb"><li><div class="gw-btn flor">',
                        '<a href="tel:' + order.Tel400 + '" data-teltj="' + vars.city + ',jiaju,' + order.CaseID + ',' + order.CaseID + ',call,' + order.Tel400 + ',wapjiajuinfo," class="tel"><i></i></a>',
                        '</div><div class="img"><img src="' + (order.Logo ? order.Logo : defaultImg) + '" alt=""></div><div class="txt mt10">',
                        '<h3 class="f13">' + order.RealName + '</h3></div></li></ul><ul class="h-list bb"><li><a href="' + order.Url + '" class="arr-r">',
                        '<div class="img"><img src="' + (order.PicUrl ? order.PicUrl : defaultImg) + '"></div><div class="txt"><h3>' + order.RealEstateName + '</h3>',
                        '<p class="f12 f999"><span class="flor f15 fd37">' + order.Price + '（' + order.DecorationName + '）</span>' + order.CaseRoomName + '</p>',
                        '<p class="f12 f999">' + order.Stage + '</p></div></a></li></ul><div class="pdY10 f12 lh20"><p>预约时间：' + order.reservationtime + '</p></div></div>');
                    $order.append(section.join(''));
                }
            }
        }
    };
    return order;
});
