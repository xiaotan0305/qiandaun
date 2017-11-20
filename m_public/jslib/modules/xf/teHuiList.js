define('modules/xf/teHuiList',
    ['jquery','util/util','iscroll/2.0.0/iscroll-lite','slideFilterBox/1.0.0/slideFilterBox'],
		function (require) {
            'use strict';
            var $ = require('jquery');
            var vars = seajs.data.vars;
            // 判断如果没有数据时，无法点击
            var clickflag = true;
            var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');
            //var draginner = $('.draginner');
            var teHuiTotal = $('#thContentList li');
            var k = true;
            var w = $(window);
            var curp = 10;
            var flexval = 0;
            if (teHuiTotal.length < 6) {
                if (teHuiTotal.length === 0) {
                    //$('#drag').addClass('searchNo').removeClass('cenBtn');
                    //draginner.html('暂未搜索到符合条件的房源。');
                    //$('#drag').show();
                    $('.searchNo').show();
                    clickflag = false;
                } else {
                    $('#drag').hide();
                }
                k = false;
            } else {
                $('#drag').show();
            }
    
            function wrapperStyle() {
                $('#wrapper').attr('style','padding: 10px 0 0 10px');
            }
            var $huxingList = $('#huxingList');
            var $loucengList = $('#loucengList');
            var $chaoxiangList = $('#chaoxiangList');
            var $zhuangtaiList = $('#zhuangtaiList');

            function showOrHide(val,check) {
                var flag = false;
                if (check && flexval === val) {
                    floatClick();
                    flexval = 0;
                    return false;
                }
                flexval = Number(val);
                if (vars.paramcity === 'bj' || vars.paramcity === 'sh') {
                    if (val === 1) {
                        $huxingList.toggle('fast',function () {
                            wrapperStyle();
                            IScroll.refresh('#huxingList');
                        }).siblings('section').hide();
                    } else if (val === 2) {
                        $loucengList.toggle('fast',function () {
                            wrapperStyle();
                            IScroll.refresh('#loucengList');
                        }).siblings('section').hide();
                    }else if (val === 3) {
                        $chaoxiangList.toggle('fast',function () {
                            wrapperStyle();
                            IScroll.refresh('#chaoxiangList');
                        }).siblings('section').hide();
                    } else {
                        $zhuangtaiList.toggle('fast',function () {
                            wrapperStyle();
                            IScroll.refresh('#zhuangtaiList');
                        }).siblings('section').hide();
                    }
                } else {
                    if (val === 1) {
                        $huxingList.toggle('fast',function () {
                            IScroll.refresh('#huxingList');
                        }).siblings('section').hide();
                    } else if (val === 2) {
                        $loucengList.toggle('fast',function () {
                            IScroll.refresh('#loucengList');
                        }).siblings('section').hide();
                    } else if (val === 3) {
                        $chaoxiangList.toggle('fast',function () {
                            IScroll.refresh('#chaoxiangList');
                        }).siblings('section').hide();
                    } else {
                        $zhuangtaiList.toggle('fast',function () {
                            IScroll.refresh('#zhuangtaiList');
                        }).siblings('section').hide();
                    }
                }
                $('.cont section').each(function () {
                    if ($(this).css('display') !== 'none') {
                        flag = true;
                    }
                });
                if (flag === true) {
                    $('#zhezhao').addClass('tabSX');
                } else {
                    $('#zhezhao').removeClass('tabSX');
                    $('.lbTab ul li a').each(function () {
                        $(this).parent('li').siblings('li').removeClass('active');
                    });
                }
                $('.cont').toggle(flag);
                $('.float').toggle(flag);
            }

            function tiaozhuan(dgID,lc,dt,ss,hx) {
                var newcode = vars.paramnewcode;
                var city = vars.city;
                var dongID = dgID;
                var louCeng = lc;
                var direction = dt ;
                var saleStatus = ss;
                if (ss) {
                    switch (ss) {
                        case 1:
                            saleStatus = '1';
                            break;
                        case 2:
                            saleStatus = '2';
                            break;
                        case 3:
                            saleStatus = '2';
                            break;
                        case 4:
                            saleStatus = '2';
                            break;
                    }
                }
                var huXing = hx;
                if (dongID) {
                    dongID = 'd' + dgID;
                }
                if (louCeng) {
                    louCeng = 'l' + lc;
                }
                if (direction) {
                    direction = 'r' + dt;
                }
                if (saleStatus) {
                    saleStatus = 's' + saleStatus;
                }
                if (huXing) {
                    huXing = 'h' + hx;
                }
                var f = (dongID ? 1 : 0) + (louCeng ? 1 : 0) + (direction ? 1 : 0) + (saleStatus ? 1 : 0) + (huXing ? 1 : 0);
                var flag = '';
                if (f !== 0) {
                    flag = '/' ;
                }
                if ($('#allData').hasClass('active')) {
                    window.location.href = '/xf_thlist/' + city + '/' + newcode + '/' + dongID + louCeng + direction + saleStatus + huXing + 'sh1/';
                } else {
                    window.location.href = '/xf_thlist/' + city + '/' + newcode + '/' + dongID + louCeng + direction + saleStatus + huXing + flag;
                }
            }

            $('#flexboxul li').click(function () {
                var data = Number($(this).attr('data-value'));
                showOrHide(data, true);
            });


            $('.lbTab ul li a').click(function () {
                $(this).parent('li').toggleClass('active');
                $(this).parent('li').siblings('li').removeClass('active');
            });

            $('.float').click(function () {
                floatClick();
            });
            function floatClick() {
                $('#zhezhao').removeClass('tabSX');
                $('.cont section').each(function () {
                    $(this).hide();
                });
                $('.cont').hide();
                $('.float').hide();
                $('.lbTab ul li').removeClass('active');
            }
            $('#scroller a').click(function () {
                var parms = $(this).attr('data-params').split(';');
                tiaozhuan(parms[0],parms[1],parms[2],parms[3],parms[4]);
            });
            $('.contthy a').click(function () {
                var parms = $(this).attr('data-params').split(';');
                tiaozhuan(parms[0],parms[1],parms[2],parms[3],parms[4]);
            });

            function dragclick() {
                $('#drag').one('click',function () {
                    if (!clickflag) {
                        return false;
                    }
                    load();
                });
            }
            dragclick();
            // 滚动到页面底部时，自动加载更多
            var scrollFlag = false;
            window.addEventListener('scroll',scrollHandler,100);

            function scrollHandler() {
                var scrollh = $(document).height();
                var bua = navigator.userAgent.toLowerCase();
                if (scrollFlag) {
                    if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
                        scrollh -= 140;
                    } else {
                        scrollh -= 80;
                    }
                }
                if (k && $(document).scrollTop() + w.height() >= scrollh) {
                    load();
                }
            }

            var flag = true;
            function load() {
                //draginner.css({'padding-left': '10px',background: 'url(' + vars.ftppath + 'touch/img/load.gif) 20px 50% no-repeat'});
                //draginner.html('正在加载...');
                $('#drag').hide();
                $('.loadmore').show();
                var city = vars.paramcity;
                var newcode = vars.paramnewcode;
                var dongID = vars.dongID;
                var louCeng = vars.LouCeng;
                var direction = vars.direction ;
                var saleStatus = vars.saleStatus;
                var huXing = vars.huXing;
                if (flag) {
                    flag = false;
                    $.post('/xf.d?m=getTeHuiList&city=' + city + '&newcode=' + newcode + '&DongId=' + dongID + '&LouCeng='
                        + louCeng + '&Direction=' + direction + '&SaleStatus=' + saleStatus + '&Huxing=' + huXing + '&pageindex=' + curp,
                        function (data) {
                            $('#thContentList').append(data);
                            //draginner.css({'padding-left': '0px',background: ''});
                            if (data.length > 0) {
                                $('.loadmore').hide();
                                $('#drag').show();
                                //draginner.html('查看更多房源');
                            } else {
                                //draginner.html('');
                                $('.loadmore, #drag').hide();
                            }
                            curp += 10;
                            dragclick();
                            flag = true;
                        });
                }

            }
            // 引入统计代码
            require.async('jsub/_vb.js?c=mnhpagebuild');
            require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
                _ub.city = vars.ubcity;
                // 业务---WAP端
                _ub.biz = 'n';
                // 方位（南北方) ，北方为0，南方为1
                _ub.location = vars.ublocation;
                var pTemp0 = {
                    // 楼盘id
                    'vmn.projectid': vars.paramnewcode,
                    // 所属页面
                    'vmg.page': 'mnhpagebuild'

                };
                var p0 = {};
                // 若pTemp中属性为空或者无效，则不传入p中
                for (var temp in pTemp0) {
                    if (pTemp0[temp] && pTemp0[temp].length > 0) {
                        p0[temp] = pTemp0[temp];
                    }
                }
                // 户型
                var houseTypeMatch = {
                    1: '一居',
                    2: '二居',
                    3: '三居',
                    4: '四居',
                    5: '五居',
                    '5,': '五居以上'
                };
                var houseType = houseTypeMatch[vars.huXing] ? encodeURIComponent(houseTypeMatch[vars.huXing]) : '';
                // 楼层
                var floorNumMatch = {
                    '1,7': '7层以下',
                    '7,14': '7-14层',
                    '15,22': '15-22层',
                    '22,50': '22层以上'
                };
                var floorNum = floorNumMatch[vars.LouCeng] ? encodeURIComponent(floorNumMatch[vars.LouCeng]) : '';
                // 销售状态
                var saleStatusMatch = {
                    10: '在售',
                    20: '待售',
                    25: '已锁定',
                    30: '不可售',
                    40: '售完'
                };
                var saleStatus = saleStatusMatch[vars.saleStatus] ? encodeURIComponent(saleStatusMatch[vars.saleStatus]) : '';
                // 搜索
                var pTemp1 = {
                    // 户型
                    'vmn.housetype': houseType ,
                    // 楼层
                    'vmn.floornum': floorNum,
                    // 朝向
                    'vmn.direction': encodeURIComponent(vars.direction),
                    // 销售状态
                    'vmn.salestatus': saleStatus,
                    'vmg.sourceapp':vars.is_sfApp_visit + '^xf'

                };
                var p1 = {};
                // 若pTemp中属性为空或者无效，则不传入p中
                for (var temp1 in pTemp1) {
                    if (pTemp1[temp1] && pTemp1[temp1].length > 0) {
                        p1[temp1] = pTemp1[temp1];
                    }
                }
                // 浏览收集方法
                _ub.collect(0, p0);
                // 搜索收集方法
                _ub.collect(1, p1);
            });
        });
