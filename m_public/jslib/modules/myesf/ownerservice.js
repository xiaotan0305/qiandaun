define('modules/myesf/ownerservice', ['jquery', 'slideFilterBox/1.0.0/slideFilterBox'],
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
            var canClick = true;
            //ajax防止多次点击
            var submitFlag = true;
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
                window.addEventListener('touchmove', pdEvent, { passive: false });
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
                    canClick = true;
                    $('.noinput').attr({'disabled':false});
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
                    if (!canClick) {
                        return false;
                    }
                    $(parent1).show();
                    slideFilterBox.refresh(parent2);
                    slideFilterBox.to(parent2, 0);
                    unable();
                });
                $(parent2).find('li').on('click', function () {
                    $('.noinput').attr({'disabled':true});
                    canClick = false;
                    var thisVal = $(this).html();
                    $(parent1).hide();
                    $(btn).html(thisVal);
                    enable();
                    enClick();
                });
            }
            //$('.buyname').css('disabled', true);
            // $('.buyname').focus(function() {
            //     alert(123);
            // })
            // $('.buyname').blur(function() {
            //     alert(3456);
            // })
            // $('.noinput').attr({'disabled':true});
            // $('.buyname').val(123432);
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
                enClick();
            });
            //防止穿透a链接
            var jumpHref = '';
            $('.sls-gsList').on('click','a',function(){
                if(!canClick){
                    //window.location.href = false;
                    return false;
                }
            });

            //点击申请
            $('.slsBtn').click(function() {
                if (!canClick) {
                    return false;
                }
                //验证输入
                if ($('#priceManual').val() === '') {
                    displayLose(2000, '请输入售价');
                    return false;
                } else if ($("input[name='a']:checked").length < 0) {
                    displayLose(2000, '请选择是否唯一');
                    return false;
                } else if ($(".payinfo").text() === '') {
                    displayLose(2000, '请选择付款方式');
                    return false;
                } else if ($(".time").text() === '') {
                    displayLose(2000, '请选择房本持有时间');
                    return false;
                } else if ($(".buyname").val() === '') {
                    displayLose(2000, '请输入购房者称呼');
                    return false;
                } else if ($("input[name='b']:checked").length <= 0) {
                    displayLose(2000, '请选择性别');
                    return false;
                }  else if ($(".mobilecode").val() === '') {
                    displayLose(2000, '请输入手机号');
                    return false;
                } else if (!telExp.test($('.mobilecode').val())) {
                    displayLose(2000, '请输入正确格式的手机号');
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
                param.HouseID = vars.HouseID;
                param.IndexID = vars.IndexID;
                param.ProjCode = vars.ProjCode;
                param.ProjName = vars.ProjName;
                param.District = vars.District;
                param.ComArea = vars.ComArea;
                param.BuildingNumber = vars.BuildingNumber;
                param.UnitNumber = vars.UnitNumber;
                param.HouseNumber = vars.HouseNumber;
                param.Room = vars.Room;
                param.Hall = vars.Hall;
                param.Toilet = vars.Toilet;
                //param.Price = vars.Price;
                param.OwnerName = vars.OwnerName;
                param.OwnerPhone = vars.OwnerPhone;
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
                if ($(".time").text() === '五年以上') {
                    PropertyRight = 1;
                } else if ($(".time").text() === '两到五年') {
                    PropertyRight = 2;
                } else if ($(".time").text() === '不满两年') {
                    PropertyRight = 3;
                } else if ($(".time").text() === '无房本') {
                    PropertyRight = 4;
                }
                param.PropertyRight = PropertyRight;
                param.BuyerName = $(".buyname").val() + $("input[name='b']:checked").val();
                param.BuyerPhone = $(".mobilecode").val();
                param.IsOwner = 1;
                param.ServiceCompanyID = $("input[name='c']:checked").val();
                param.test = $(".time").text();
                $.post(vars.mySite, param, function (data) {
                    
                    if (data.result === '1') {
                        var sucUrl = vars.mySite + '?c=myesf&a=handresult&issuc=1&city=' + vars.city;
                        window.location.href = sucUrl;
                    } else {
                        var failUrl = vars.mySite + '?c=myesf&a=handresult&houseid=' + vars.HouseID + '&indexid=' + vars.IndexID + '&city=' + vars.city;
                        window.location.href = failUrl;
                    }
                }, 'json').always(function () {
                    submitFlag = true;
                });

            });


        };
    });