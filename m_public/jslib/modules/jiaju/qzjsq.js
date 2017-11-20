/**
 * Created by Young on 15-4-20.
 */
define('modules/jiaju/qzjsq', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    module.exports = function () {
        // 是小数的话保留2位小数，不是的话返回整数
        function dealFloat(s) {
            if (s <= 999999999) {
                if (parseInt(s, 10) === s) {
                    // 是个整数，返回原值
                    return s;
                }
                return s.toFixed(2);
            }
            return Number(s.toString().substring(0, 10));
        }

        var size = 5;
        var storageType = 'jiaju_jsq_qz';
        var sizeOption = $('#showGgs');
        // 整数
        var pattern = /^[1-9]+[0-9]*$/;
        // 整数和小数
        var patternTest = /^([1-9][0-9]{0,3}|[0-9]{1,4}\.[0-9]{0,2})$/;
        var qzdata = {
            hLength: Number($('#hLength').val()),
            hWidth: Number($('#hWidth').val()),
            hHeight: Number($('#hHeight').val()),
            dLength: Number($('#dLength').val()),
            dWidth: Number($('#dWidth').val()),
            dNum: Number($('#dNum').val()),
            wLength: Number($('#wLength').val()),
            wWidth: Number($('#wWidth').val()),
            wNum: Number($('#wNum').val()),
            qzLength: Number($('#qzLength').val()),
            qzWidth: Number($('#qzWidth').val()),
            size: sizeOption.attr('data-id'),
            qzdj: Number($('#qzdj').val())
        };
        var jjsinfo = $('.jj-formList');
        var totalnum = $('#totalnum');
        var totalmoney = $('#totalmoney');
        var showGgs = $('#showGgs');
        // 点击选择规格  选择对应的规格并将值赋给id="showGgs"\
        showGgs.on('click', function () {
            checkGgs();
        });

        function checkGgs() {
            var ggs = $('#ggs');
            ggs.find('li').removeClass('active');
            var guige = $('#guige');
            ggs.show();
            guige.on('click', 'li', function () {
                showGgs.text($(this).text());
                showGgs.attr('data-id', $(this).attr('value'));

                // 将规格里面用户选择的值 拆分开放进墙砖长度和宽度
                $('#qzLength').val(Number(showGgs.attr('data-id').split(',')[0]));
                $('#qzLength').attr('data-ok', '1');
                $('#qzWidth').val(Number(showGgs.attr('data-id').split(',')[1]));
                $('#qzWidth').attr('data-ok', '1');
                qzdata.qzLength = Number(showGgs.attr('data-id').split(',')[0]);
                qzdata.qzWidth = Number(showGgs.attr('data-id').split(',')[1]);
                $(this).addClass('active');
                setTimeout(function () {
                    ggs.hide();
                }, 350);
                checkClick();
            });
            $('.cancel').on('click', function () {
                ggs.hide();
            });
        }
        // 判断计算按钮和清空按钮是否可点击
        function checkClick() {
            var oknum = jjsinfo.find('input').filter(function () {
                if ($(this).attr('data-ok') === '1') {
                    return this;
                }
            });
            if (oknum.length === 11 && $('#qzdj').attr('data-ok') === '0' || oknum.length === 12) {
                $('#jisuan1').addClass('active');
                $('#jisuan1').addClass('active');
            } else if (oknum.length >= 3) {
                $('#reset1').addClass('active');
                $('#jisuan1').removeClass('active');
            } else {
                if ($('#qzLength').val() !== '200' && $('#qzLength').val() !== '' || $('#qzWidth').val() !== '200' && $('#qzWidth').val() !== '') {
                    $('#reset1').addClass('active');
                } else {
                    $('#reset1').removeClass('active');
                }
                $('#jisuan1').removeClass('active');
            }
        }

        var isZimu = function (h) {
            var e = document.getElementById(h);
            return !(!e.validity || !e.validity.valid);
        };
        // 验证4位数表单，并赋值
        function setnumval(j, clas) {
            var setvaldom = $('#' + j);
            var tipsdom = $('#' + clas);
            var tipBeanch = $('.alertInfo');
            if (pattern.test(setvaldom.val()) === false || Number(setvaldom.val()) <= 0 || Number(setvaldom.val()) > 9999) {
                // 不是整数或者取值不符合要求
                setvaldom.attr('data-ok', '0');
                if (isZimu(j) === true && setvaldom.val() === '') {
                    tipBeanch.hide();
                } else {
                    tipBeanch.show();
                    tipsdom.show();
                    setTimeout(function () {
                        tipBeanch.hide();
                        tipsdom.hide();
                    }, 2000);
                }
            } else {
                setvaldom.attr('data-ok', '1');
                tipBeanch.hide();
                qzdata[j] = Number(setvaldom.val());
            }
            checkClick();
        }

        // 验证7位数表单，并赋值
        function setval(j, clas) {
            // qzLength ipt_text
            var setvaldom = $('#' + j);
            // $('#qzLength')
            var tipsdom = $('#' + clas);
            // $("#ipt_text")
            var tipBeanch = $('.alertInfo');
            if (patternTest.test(setvaldom.val()) === false) {
                // 未匹配上，说明不规则整数或小数
                setvaldom.attr('data-ok', '0');
                if (isZimu(j) === true && setvaldom.val() === '') {
                    tipBeanch.hide();
                } else {
                    tipBeanch.show();
                    tipsdom.show();
                    setTimeout(function () {
                        tipBeanch.hide();
                        tipsdom.hide();
                    }, 2000);
                }
            } else {
                // 匹配上
                setvaldom.attr('data-ok', '1');
                tipBeanch.hide();
                qzdata[j] = Number(setvaldom.val());
            }
            checkClick();
        }
        // 为每个表单在获取焦点时并且添加了内容之后显示close图片
        jjsinfo.on('keyup', 'input', function () {
            var $th = $(this);
            if ($th.val() !== '') {
                $th.next().show();
            } else {
                $th.next().hide();
            }
        });
        // 当前focus input
        var focusEle;
        // 为每个表单失去焦点验证合法性，并且给数组赋值
        function inputBlur(ele) {
            focusEle = null;
            var $this = $(ele);
            switch ($this.attr('class')) {
                case 'ipt-text':
                    setval($this.attr('id'), $this.attr('class'));
                    break;
                case 'ipt-num':
                    setnumval($this.attr('id'), $this.attr('class'));
                    break;
                case 'ipt-qzdj':
                    setval($this.attr('id'), $this.attr('class'));
                    break;
            }
            $this.next().hide();
        }
        // input focus处理
        function inputFocus(ele) {
            if (focusEle !== ele) {
                if (focusEle) {
                    inputBlur(focusEle);
                }
                focusEle = ele;
                var $this = $(ele);
                $this.val() !== '' && $this.next().show();
            }
        }
        // 点击关闭按钮可以清空该input标签的value
        function offClick(ele) {
            inputFocus(ele);
            var $this = $(ele);
            $this.val('');
            $this.next().hide();
        }
        $('body').on('click', function (e) {
            var target = e.target;
            var $target = $(target);
            if (target.tagName.toLowerCase() === 'input') {
                inputFocus(target);
            } else if ($target.hasClass('off')) {
                offClick(target.previousSibling);
            } else if ($target.hasClass('ipt')) {
                inputFocus(target.firstChild);
            } else if ($.inArray(target.id, ['jisuan1', 'reset1'] === -1)) {
                inputBlur(focusEle);
            }
        });

        // 计算总价
        var total = 0;
        var qznum = 0;

        function getTotal() {
            var qzlen = qzdata.qzLength / 1000;
            var qzwid = qzdata.qzWidth / 1000;
            qznum = Math.round(1.05 * (qzdata.hLength / qzlen * (qzdata.hHeight / qzwid) * 2 + qzdata.hWidth / qzlen * (qzdata.hHeight / qzwid) * 2 - qzdata.wLength / qzlen * (qzdata.wWidth / qzwid) * qzdata.wNum - qzdata.dLength / qzlen * (qzdata.dWidth / qzwid) * qzdata.dNum));
            if (qznum > 0) {
                total = dealFloat(qznum * qzdata.qzdj);
            } else {
                total = -1;
            }
        }

        // 设置清空事件
        $('#reset1').on('click', function () {
            if (!$('#reset1').hasClass('active')) {
                return;
            }
            jjsinfo.find('input').val('');
            jjsinfo.find('input').attr('data-ok', '0');
            // 设置默认值
            totalnum.html(0);
            totalmoney.html(0);
            showGgs.text('200x200毫米');
            showGgs.attr('data-id', '200,200');
            $('#qzLength').val('200').attr('data-ok', '1');
            $('#qzWidth').val('200').attr('data-ok', '1');
            $(this).removeClass('active');
            $('#jisuan1').removeClass('active');
            qzdata.qzLength = 200;
            qzdata.qzWidth = 200;
            qzdata.hLength = Number($('#hLength').val());
            qzdata.hWidth = Number($('#hWidth').val());
            qzdata.hHeight = Number($('#hHeight').val());
            qzdata.dLength = Number($('#dLength').val());
            qzdata.dWidth = Number($('#dWidth').val());
            qzdata.dNum = Number($('#dNum').val());
            qzdata.wLength = Number($('#wLength').val());
            qzdata.wWidth = Number($('#wWidth').val());
            qzdata.wNum = Number($('#wNum').val());
            qzdata.qzdj = Number($('#qzdj').val());
            $('.off').hide();
            $('#qzLength').next().show();
            $('#qzWidth').next().show();
        });
        // 搜索用户行为收集20160114
        var page = 'mjjcalculatorqz';
        // 开始计算
        $('#jisuan1').on('click', function () {
            inputBlur(focusEle);
            if (!$('#jisuan1').hasClass('active')) {
                return;
            }
            var b = 19;
            var p = {
                'vmg.page': page
            };
            _ub.collect(b, p);

            getTotal();
            if (total < 0) {
                totalnum.html(0);
                totalmoney.html(0);
                alert('请输入合理的数据');
                return;
            }
            if ($('#qzdj').val() === '') {
                // 未输入单价信息，不发送数据也不缓存
                totalnum.html(qznum);
                totalmoney.html(0);
                $('#jisuan1').removeClass('active');
                return;
            }
            totalnum.html(qznum);
            totalmoney.html(total);

            // 获取计算时间
            function gettime() {
                var d = new Date();
                var vYear = d.getFullYear();
                var vMon = d.getMonth() + 1;
                var vDay = d.getDate();
                var h = d.getHours();
                var m = d.getMinutes();
                var se = d.getSeconds();
                return vYear + '-' + (vMon < 10 ? '0' + vMon : vMon) + '-' + (vDay < 10 ? '0' + vDay : vDay) + ' ' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (se < 10 ? '0' + se : se);
            }

            function refreshLS() {
                // ls是否存在
                var localStorage = vars.localStorage;
                if (localStorage && qznum && total) {
                    // ls缓存信息
                    var lsArr = JSON.parse(localStorage.getItem(storageType)) || [];
                    // 单条数据
                    var item = {
                        // type=1:墙砖，2：地砖，3：地板，4：壁纸，5：涂料，6：窗帘
                        type: 1,
                        num: qznum,
                        tmoney: total,
                        time: gettime()
                    };
                    // 缓存已满，删除第一条
                    lsArr.length >= size && lsArr.shift();
                    // 添加最后一条
                    lsArr.push(item);
                    // 缓存最新数据
                    localStorage.setItem(storageType, JSON.stringify(lsArr));
                }
            }
            // 判断是否已登录
            if (vars.soufunid === '') {
                refreshLS();
                $('#jisuan1').removeClass('active');
            } else {
                // 发送ajax请求，写数据到数据库
                var ajaxURL = vars.jiajuSite + '?c=jiaju&a=jsqSub&r=' + Math.random();
                var jsondata = {
                    // type=1:墙砖，2：地砖，3：地板，4：壁纸，5：涂料，6：窗帘
                    type: 1,
                    num: qznum,
                    tmoney: total,
                    soufunid: vars.soufunid,
                    soufunname: vars.soufunname,
                    mobile: vars.mobile,
                    time: gettime()
                };
                $.get(ajaxURL, jsondata,
                    function (data) {
                        if (data.result.issuccess === '1') {
                            $('#jisuan1').removeClass('active');
                        }
                    });
            }
        });
        // 软键盘遮挡
        var $window = $(window);
        var height = $window.height();
        $window.resize(function () {
            var heightNew = $window.height();
            var offset = $window.scrollTop() + height - heightNew;
            height = heightNew;
            // 安卓部分搜集地址栏收起展开触发resize造成抖动bug
            if (Math.abs(height - heightNew) < 50) {
                return false;
            }
            $window.scrollTop(offset);
        });
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            _ub.city = vars.cityname;
            _ub.biz = 'h';
            _ub.location = 0;
            var b = 0;
            var p = {
                'vmg.page': page
            };
            _ub.collect(b, p);
        });
    };
});