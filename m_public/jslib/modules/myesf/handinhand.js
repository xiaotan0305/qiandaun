define('modules/myesf/handinhand', ['jquery', 'slideFilterBox/1.0.0/slideFilterBox'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var $doc = $(document);
            //手机格式验证
            var telExp = /^1[34578]{1}[0-9]{9}$/;
            // 滑动筛选框插件
            var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
            //点击穿透
            vars.canClick = true;
            //ajax防止多次点击
            var submitFlag = true;

            // 选择小区search
            require.async('search/myesf/xqHandSearch', function (xqSearch) {
                var xqSearch = new xqSearch();
                xqSearch.init();
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
                window.addEventListener('touchmove', pdEvent, { passive: false })
            }

            /**
             * 允许页面滑动
             */
            function enable() {
                window.removeEventListener('touchmove', pdEvent, { passive: false });
            }

             /**
             *input提示框穿透
             */
             function enClick() {
                setTimeout(function () {
                    vars.canClick = true;
                    $('.noinput').attr('disabled',false);
                },500);
             }

             // 浮层提示控制
            var $sendFloat = $('#sendFloat');
            function displayLose(time, keywords, url) {
                $('#sendText').text(keywords);
                $sendFloat.show();
                setTimeout(function () {
                    $sendFloat.hide();
                    if (url) {
                        window.location.href = url;
                    }
                }, time);
            }

             function selectFun(btn, parent1, parent2) {
                $(btn).on('click', function () {
                    if (!vars.canClick) {
                        return false;
                    }
                    $(parent1).show();
                    slideFilterBox.refresh(parent2);
                    slideFilterBox.to(parent2, 0);
                    unable();
                });
                $(parent2).find('li').on('click', function () {
                    $('.noinput').attr('disabled',true);
                    vars.canClick = false;
                    var thisVal = $(this).html();
                    $(parent1).hide();
                    $(btn).html(thisVal);
                    enable();
                    enClick();
                });
            }

            //输入楼栋号
            $('.lounumber').click(function(){
                $('.loufloat').show();
            });
            $('.backbom').click(function(){
                $('.loufloat').hide();
            });
            $('#complete').click(function(){
                if ($('.ld').val() === '') {
                    alert('楼栋号不能为空');
                    return false;
                } else if ($('.dy').val() === '') {
                    alert('单元号不能为空');
                    return false;
                } else if ($('.mp').val() === '') {
                    alert('门牌号不能为空');
                    return false;
                }
                var lym = $('.ld').val() + '-' + $('.dy').val() + '-' + $('.mp').val();
                $('.lounumber').text(lym);
                $('.loufloat').hide();
            });
            //输入户型
            $('.huxing').on('click', function () {
                if (!vars.canClick) {
                    return false;
                }
                $('#huxingShiDrap').show();
                slideFilterBox.refresh('#huxingShiDrapCon');
                slideFilterBox.to('#huxingShiDrapCon', 0);
                unable();
            });
            var thisVal = '';
            $('#huxingShiDrapCon').find('li').on('click', function() {
                $('.noinput').attr('disabled',true);
                vars.canClick = false;
                thisVal = $(this).html();
                $('.huxing').text(thisVal);
                $('#huxingTingDrap').show();
                $('#huxingShiDrap').hide();
                slideFilterBox.refresh('#huxingTingDrapCon');
                slideFilterBox.to('#huxingTingDrapCon', 0);
                enClick();
            });
            $('#huxingTingDrapCon').find('li').on('click', function(){
                $('.noinput').attr('disabled',true);
                vars.canClick = false;
                var nextVal = $(this).html();
                //var thisVal = $('#TypeGrade').html();
                $('.huxing').html(thisVal + nextVal);
                $('#huxingWeiDrap').show();
                $('#huxingTingDrap').hide();
                slideFilterBox.refresh('#huxingWeiDrapCon');
                slideFilterBox.to('#huxingWeiDrapCon', 0);
                enClick();
            });
            $('#huxingWeiDrapCon').find('li').on('click', function(){
                $('.noinput').attr('disabled',true);
                vars.canClick = false;
                var nextVal = $(this).html();
                thisVal = $('.huxing').html();
                $('.huxing').html(thisVal + nextVal);
                $('#huxingWeiDrap').hide();
                enable();
                enClick();
            });


            //输入售价限制
            $('#priceManual').on('keyup', function (ev) {
                var value = ev.target.value;
                if (value.indexOf(0) === 0) {
                    ev.target.value = '';
                }
                ev.target.value = ev.target.value.replace(/[\D]/g, '');
            });

            selectFun('.payinfo', '.payinfoDrap', '.payinfoDrapCon');
            selectFun('.time', '.timeDrap', '.timeDrapCon');
            // 点击浮层取消按钮隐藏浮层
            $('.cancel').on('click', function () {
                $('.sf-maskFixed').hide();
                enable();
            });
            //防止穿透a链接
            $('.sls-gsList').on('click','a',function(){
                if(!vars.canClick){
                    return false;
                }
            });
            //点击申请
            $('.slsBtn').click(function() {
                if (!vars.canClick) {
                    return false;
                }
                //验证输入
                if ($('#projnameIpt').val() === '') {
                     displayLose(2000, '请输入小区名称');
                    return false;
                } else if ($('.lounumber').text() === '请选择楼栋号') {
                    displayLose(2000, '请选择楼栋号');
                    return false;
                } else if ($('.huxing').text() === '请选择户型') {
                    displayLose(2000, '请选择户型');
                    return false;
                } else if ($('#priceManual').val() === '') {
                    displayLose(2000, '请输入售价');
                    return false;
                } else if ($("input[name='d']:checked").val() === '1' && $('.ownername').val() === '') {
                    displayLose(2000, '请输入业主称呼');
                    return false;
                } else if ($("input[name='d']:checked").val() === '1' && $('.ownerphone').val() === '') {
                    displayLose(2000, '请输入业主电话');
                    return false;
                } else if ($('.ownerphone').val() && !telExp.test($('.ownerphone').val())) {
                     displayLose(2000, '请输入正确格式的业主电话');
                    return false;
                } else if ($(".payinfo").text() === '请选择付款方式') {
                    displayLose(2000, '请选择付款方式');
                    return false;
                } else if ($(".buyname").val() === '') {
                    displayLose(2000, '请输入购房者称呼');
                    return false;
                } else if ($("input[name='b']:checked").length <= 0) {
                    displayLose(2000, '请选择购房者性别');
                    return false;
                } else if ($(".mobilecode").val() === '') {
                    displayLose(2000, '请输入购房者手机号');
                    return false;
                } else if (!telExp.test($('.mobilecode').val())) {
                    displayLose(2000, '请输入正确格式的购房者手机号');
                    return false;
                } else if ($("input[name='c']:checked").length <= 0) {
                    displayLose(2000, '请选择服务公司');
                    return false;
                }

                if (!submitFlag) {
                    return false;
                }
                submitFlag = false;
                var param = {c: 'myesf', a: 'ajaxCommitHand', city: vars.city};
                param.ProjCode = vars.ProjCode;
                param.ProjName = vars.ProjName;
                param.District = vars.District;
                param.ComArea = vars.ComArea;

                param.BuildingNumber = $('.ld').val();
                param.UnitNumber = $('.dy').val();
                param.HouseNumber = $('.mp').val();

                var reg = new RegExp('([0-9])室([0-9])厅([0-9])卫');
                var match = $('.huxing').text().match(reg);
                param.Room = match[1];
                param.Hall = match[2];
                param.Toilet = match[3];

                if ($('.ownername').val()) {
                     param.OwnerName = $('.ownername').val() + $("input[name='e']:checked").val();
                }
                if ($('.ownerphone').val()) {
                    param.OwnerPhone = $('.ownerphone').val();
                }

                param.ApplyUserID = vars.ApplyUserID;

                param.Price = $('#priceManual').val();
                param.IsUnique = $("input[name='a']:checked").val();
                var Mortgage
                if ($('.payinfo').text() === '全款') {
                    Mortgage = 1;
                } else if ($('.payinfo').text() === '商贷') {
                    Mortgage = 2;
                } else if ($('.payinfo').text() === '市管公积金') {
                    Mortgage = 3;
                } else if ($('.payinfo').text() === '国管公积金') {
                    Mortgage = 4;
                } else if ($('.payinfo').text() === '市管组合贷') {
                    Mortgage = 5;
                } else if ($('.payinfo').text() === '国管组合贷') {
                    Mortgage = 6;
                } else if ($('.payinfo').text() === '自行贷款') {
                    Mortgage = 7;
                }
                param.Mortgage = Mortgage;
                var PropertyRight;
                param.BuyerName = $(".buyname").val() + $("input[name='b']:checked").val();
                param.BuyerPhone = $(".mobilecode").val();
                param.IsOwner = $("input[name='d']:checked").val();
                param.ServiceCompanyID = $("input[name='c']:checked").val();
                param.test = $(".time").text();
                $.post(vars.mySite, param, function (data) {
                    if (data.result === '1') {
                        var sucUrl = vars.mySite + '?c=myesf&a=handresult&issuc=1' + '&city=' + vars.city;
                        window.location.href = sucUrl;
                    } else {
                        var failUrl = vars.mySite + '?c=myesf&a=handresult' + '&isfrom=1&city=' + vars.city;
                        window.location.href = failUrl;
                    }
                }, 'json').always(function () {
                    submitFlag = true;
                });

            });


        };
    });