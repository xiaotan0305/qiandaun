/**
 * 海外房贷计算器js
 * modify by limengyang.bj@fang.com 2016-07-12 添加浏览埋码
 */
define('modules/tools/worldJisuan', ['modules/world/yhxw', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $doc = $(document);
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 滑动筛选框插件++++++++++++++++++++
        var IScroll = require('iscroll/2.0.0/iscroll-lite');

        // 埋码
        var pageId = '';
        // 1是海外房贷计算器，2是购房能力评估，3是投资回报率
        if (vars.pageType === '1') {
            pageId = 'mwhousingloancalc';
        } else if (vars.pageType === '2') {
            pageId = 'mwpurchasecalc';
        } else {
            pageId = 'mwROIcalc';
        }
        // 埋码传入数据
        var maimaParams = {'vmg.page': pageId};
        // 浏览埋码
        yhxw({type: 0, pageId: pageId, params: maimaParams});
        // 下载浮层
        var u = navigator.userAgent;
        $('.main').on('focus', 'input[type=number]', function () {
            if (!/(iPhone|iPad|iPod|iOS)/i.test(u)) {
                $('html,body').animate({scrollTop: $(this).offset().top}, 200);
            } else if (/UCBrowser|QQBrowser/i.test(u)) {
                var $doc = $(document),
                    $win = $(window),
                    docH = $doc.height() < $win.height() ? $win.height() : $doc.height();
                var imgSrc = vars.public + 'img/sf-72.png';
                var downPop = $('img[src="' + imgSrc + '"]').parent().parent();
                downPop.length && downPop.css({
                    position: 'absolute',
                    top: docH - downPop.height()
                });
            }
        }).on('blur', 'input[type=number]', function () {
            if (/(iPhone|iPad|iPod|iOS)/i.test(u) && /UCBrowser|QQBrowser/i.test(u)) {
                var imgSrc = vars.public + 'img/sf-72.png';
                var downPop = $('img[src="' + imgSrc + '"]').parent().parent();
                downPop.length && downPop.css({
                    position: 'fixed',
                    top: 'auto'
                });
            }
        });

        /**
         * 为了方便解绑事件，声明一个阻止页面默认事件的函数
         * @param e
         */
        function pdEvent(e) {
            e.preventDefault();
        }

        /**
         * 禁止页面滑动
         */
        function unable() {
            $doc.on('touchmove', pdEvent);
        }

        /**
         * 允许页面滑动
         */
        function enable() {
            $doc.off('touchmove', pdEvent);
        }

        // 验证数字
        $('input[type=number]').on('input', function () {
            var regA = /([1-9][0-9]{0,4})(\.[0-9]{0,2})?/;
            var $this = $(this);
            var a = '';
            if ($this.val()) {
                a = $this.val().match(regA)[0];
            }
            var b = $this.parent().parent().prev().html();
            if (b.indexOf('贷款期限') !== -1) {
                a = parseInt(a);
            }
            // 小米4 UC浏览器bug处理
            // 解决原理： 小米4必须先给赋值为一个定值，在赋值变量才好使
            // if (/UCBrowser|/i.test(u) && /MI/i.test(u) && ($this.val().indexOf('.') !== -1 || !$this.val())) {
            //    $this.val(111.11);
            // }
            $this.val(111.11);
            $this.val(a);
        });

        /* 房贷计算器*/
        // 选择国家按钮
        var country = $('#country');
        // 国家列表浮层
        var countryFloat = $('#countryFloat');
        // 银行按钮
        var bankselect = $('#bankselect');
        // 银行列表浮层
        var bankselectFloat = $('#bankselectFloat');
        country.on('click', function () {
            $('body').addClass('choose');
            countryFloat.show();
            new IScroll('#countryCon');
            unable();
        });
        // 点击取消按钮隐藏选择国家浮层
        countryFloat.on('click', '.cancel', function () {
            countryFloat.hide();
            enable();
        });
        countryFloat.find('li').on('click', function () {
            bankselect.html('请选择银行');
            $('input[name=year_rate]').val('');
            var thatA = $(this);
            var countryKey = thatA.attr('data-country');
            country.html(thatA.html());
            thatA.siblings().removeClass('activeS');
            thatA.addClass('activeS');
            setTimeout(function () {
                $('body').removeClass('choose');
                countryFloat.hide();
                if (countryKey) {
                    $.get(vars.toolsSite + '?c=tools&a=ajaxGetBank&key=' + countryKey, function (data) {
                        // 填充银行列表
                        $('#bankList').html(data);
                    });
                }
            }, 350);
            enable();
        });

        // 点击银行显示浮层,如果没选择国家，先选择银行
        bankselect.on('click', function () {
            var countryVal = $('#country').html();
            if (countryVal === '' || countryVal === '请选择国家') {
                alert('请先选择国家');
            } else {
                $('body').addClass('choose');
                bankselectFloat.show();
                console.log($('#bankList').find('ul'));
                new IScroll('#bankList');
                unable();
            }
        });
        // 点击取消按钮隐藏选择银行浮层
        bankselectFloat.on('click', '.cancel', function () {
            bankselectFloat.hide();
            enable();
        });
        bankselectFloat.on('click', 'li', function () {
            var thatB = $(this);
            thatB.siblings().removeClass('activeS');
            thatB.addClass('activeS');
            bankselect.html(thatB.html());
            var yearRate = thatB.attr('data-rate');
            enable();
            setTimeout(function () {
                // that.removeClass('active');
                $('body').removeClass('choose');
                bankselectFloat.hide();
                $('input[name=year_rate]').val(yearRate);
            }, 350);
        });

        $('#fangdai').on('click', function () {
            var daiprice = ($('#daiprice').val()) * 10000;
            var daidate = $('#daidate').val();
            var yearRate = $('input[name=year_rate]').val();
            if (daiprice === '') {
                alert('请填写房贷总额');
            } else if (daidate === '') {
                alert('请填写贷款期限');
            } else if (yearRate === '') {
                alert('请填写年利率');
            } else {
                // 所选银行
                var loanBank = bankselect.html();
                // 月利率=(年利率/100)/12;
                var monthRate = (yearRate / 100) / 12;
                // 月均还款=Math.round(贷款总额*月利率*（1+月利率）^贷款期限/（（1+月利率）^贷款期限-1)
                var monthrepay = Math.round(daiprice * monthRate * Math.pow(1 + monthRate, daidate)
                    / (Math.pow(1 + monthRate, daidate) - 1));
                // 还款总额= Math.round(Math.round(月均还款*月份)*100))/100;
                var totalrepay = Math.round(Math.round(monthrepay * daidate) * 100) / 100;
                // 支付利息 =Math.round((还款总额-贷款总额）*100)/100)
                var lixirepay = Math.round((totalrepay - daiprice) * 100) / 100;
                $('#monthrepay').val(monthrepay);
                $('#lixirepay').val(lixirepay);
                // 用户行为分析
                pageId = 'mwhousingloancalc';
                maimaParams = {
                    'vmw.loanamount': daiprice,
                    'vmg.page': 'mwhousingloancalc',
                    'vmw.loantime': daidate,
                    'vmw.country': encodeURIComponent($('#country').html().replace(/(^\s*)|(\s*$)/g, '')),
                    'vmw.loanbank': encodeURIComponent(loanBank),
                    'vmw.annualinterestrate': yearRate,
                    'vmw.monthlyrepayment': monthrepay,
                    'vmw.paymentinterest': lixirepay
                };
                yhxw({type: 29, pageId: pageId, params: maimaParams});
            }
        });

        // 选择还款期限
        var years = $('#years');
        // 国家列表浮层
        var yearsFloat = $('#yearsFloat');
        years.on('click', function () {
            $('body').addClass('choose');
            yearsFloat.show();
            new IScroll('#yearsCon');
            unable();
        });
        // 点击取消按钮隐藏选择国家浮层
        yearsFloat.on('click', '.cancel', function () {
            yearsFloat.hide();
            enable();
        });
        yearsFloat.find('li').on('click', function () {
            var thatC = $(this);
            years.html(thatC.html());
            thatC.siblings().removeClass('activeS');
            thatC.addClass('activeS');
            enable();
            setTimeout(function () {
                $('body').removeClass('choose');
                yearsFloat.hide();
            }, 350);
        });

        // 购房能力评估
        $('#fangability').on('click', function () {
            var havemoney = $('input[name=havemoney]').val() * 10000;
            var income = $('input[name=income]').val();
            var output = $('input[name=output]').val();
            var floorspace = $('input[name=floorspace]').val();
            var years = $('#years').html();
            years = (years.split('年')[0]).replace(/\s+/g, '');
            var repalyMonth = years * 12;
            if (havemoney === '') {
                alert('请填写可用于购房的基金');
            } else if (income === '') {
                alert('请填写家庭月收入');
            } else if (output === '') {
                alert('请填写预计家庭每月固定支出');
            } else if (floorspace === '') {
                alert('请填写计划购买的房屋面积');
            } else {
                var monthRate;
                if (years < 5) {
                    monthRate = 0.00576;
                } else {
                    monthRate = 0.00594;
                }
                // 您可购买的房屋总价=（家庭月收入-家庭月固定支出）×( (（1＋月利率）＾还款月数)－1  )÷［月利率×（1＋月利率）＾还款月数］+持有资金
                var totalprice = Math.ceil((income - output) * (Math.pow(1 + monthRate, repalyMonth) - 1)
                    / (monthRate * Math.pow(1 + monthRate, repalyMonth)) + havemoney);
                // 您可购买的房屋单价=您可购买的房屋总价/房屋面积
                var danprice = totalprice / floorspace;
                $('#totalprice').val(parseFloat(totalprice.toFixed(2)));
                $('#danprice').val(parseFloat(danprice.toFixed(2)));
                // 用户行为分析
                pageId = 'mwpurchasecalc';
                maimaParams = {
                    'vmw.ownfunds': havemoney,
                    'vmg.page': 'mwpurchasecalc',
                    'vmw.monthlyincome': income,
                    'vmw.monthlypay': output,
                    'vmw.loantime': Number(years) * 12,
                    'vmw.area': floorspace,
                    'vmw.totalprice': totalprice,
                    'vmw.unitprice': danprice
                };
                yhxw({type: 50, pageId: pageId, params: maimaParams});
            }

        });

        // 投资回报率
        $('#touziReply').on('click', function () {
            var fangPrice = $('input[name=fangPrice]').val();
            var zujin = $('input[name=zujin]').val();
            var a = 12;
            var b = 100;
            var c = 10000;
            if (fangPrice === '') {
                alert('购房总价不能为空');
            } else if (zujin === '') {
                alert('每月租金费不能为空');
            } else {
                var returnRate = (zujin * a * b) / (fangPrice * c);
                $('#return_rate').val(returnRate.toFixed(2));
                // 用户行为分析
                pageId = 'mwpurchasecalc';
                maimaParams = {
                    'vmw.totalprice': fangPrice,
                    'vmg.page': 'mwROIcalc',
                    'vmw.rentprice': zujin,
                    'vmw.returnoninvestment': returnRate
                };
                yhxw({type: 30, pageId: pageId, params: maimaParams});
            }
        });
    };
});