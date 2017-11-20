/**
 * H5链接生成
 * by bjwanghongwei@fang.com 20161121
 * 滑动筛选，验证房源ID是否正确
 */
define('modules/zf/createH5Line', ['slideFilterBox/1.0.0/slideFilterBox'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            // jquery 对象
            var $ = require('jquery');
            // 滑动筛选框插件++++++++++++++++++++
            var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
            var $doc = $(document);
            // 当前页面标识(用户用户行为统计)
            var vars = seajs.data.vars;
            // 城市
            var cityManual = $('#cityManual');
            // 房源类型
            var zftypeManual = $('#zftypeManual');
            // 房源ID
            var houseID = $('#houseID');
            //H5链接
            var h5Url;
            //房源ID正则匹配
            var houseIdMatch = /^\d{0,10}$/;
            //浏览按钮
            var btnPay = $('.btn-pay');
            //城市
            var cityList = $('#cityList');
            //租房类型
            var zftypeList = $('#zftypeList');
            //文本域
            var textArea = $('#h5link');
            //当文本框中的值不为空时,浏览按钮颜色为红色，否则为灰色
            if (textArea.val() === '') {
                btnPay.addClass('noClick');
            } else {
                btnPay.removeClass('noClick');
            }

            //点击城市按钮
            cityManual.on('click', function () {
                // 显示区域选择下拉列表
                cityList.show();
                // 给区域选择列表添加滑动筛选功能
                slideFilterBox.refresh('#cityListCon');
                // 区域滑动列表显示时禁止页面滑动
                unable();
            });
            //  给城市选择列表添加点击事件
            cityList.on('click', 'li', function () {
                // 每次点击区域选择列表li时 更新商圈显示span中的内容
                zftypeManual.text('请选择房源类型');
                var $that = $(this);
                // 获取用户选中的区域名称
                var selectedValue = $that.text().trim();
                var value = $that.attr('value');
                // 将用户选择的区域写入到对应的显示div中,并改变样式
                cityManual.text(selectedValue).attr('value', value).removeClass('xuan').addClass('xuan2');
                // 隐藏区域选择下拉列表
                cityList.hide();
                // 隐藏区域选择下拉列表隐藏时 允许页面滑动
                enable();
            });

            //给租房类型选择按钮添加点击事件
            zftypeManual.on('click', function () {
                // 显示商圈下拉选择列表
                zftypeList.show();
                // 给租房类型选择列表添加滑动筛选功能
                slideFilterBox.refresh('#zftypeListCon');
                // 将租房类型选择列表滚动到顶部
                slideFilterBox.to('#zftypeListCon', 0);
                // 租房类型选择下拉列表显示时 禁止页面滑动
                unable();
            });


            // 给商圈选择列表添加点击事件
            zftypeList.on('click', 'li', function () {
                var $that = $(this);
                // 获取选中的租房类型名称
                var selectedValue = $that.text().trim();
                var value = $that.attr('value');
                // 将选择的商圈名称写入到对应的显示div,选中租房类型后改变字体样式
                zftypeManual.text(selectedValue).attr('value', value).removeClass('xuan').addClass('xuan2');
                // 隐藏商圈选择下拉列表
                zftypeList.hide();
                // 商圈选择下拉表隐藏时 允许页面滑动
                enable();
            });

            //防止重复提交
            var noRepetition = true;
            //ajax请求接口验证房源ID是否正确
            $('.g-link').on('click', function () {
                if (houseID.val().length) {
                    // 验证房源ID
                    if (verify() && noRepetition) {
                        noRepetition = false;
                        $.ajax({
                            url: '/zf/?c=zf&a=ajaxCheckHouseId&city=' + cityManual.text() + '&housetype=' + zftypeManual.attr('value') + '&houseID=' + houseID.val(),
                            dataType: 'json',
                            type: 'GET',
                            success: function (data) {
                                noRepetition = true;
                                if (data.result === '1') {
                                    //生成H5链接
                                    if (zftypeManual.attr('value') == 'DS') {
                                        h5Url = 'http:' + vars.zfSite + cityManual.attr('value') + '/' + zftypeManual.attr('value') + '_' + data.HouseID + '.html?bshare=share&type_s=zfds';
                                    } else {
                                        h5Url = 'http:' + vars.zfSite + cityManual.attr('value') + '/' + zftypeManual.attr('value') + '_' + data.RoomID + '.html?bshare=share&type_s=zfds';
                                    }
                                    //把链接放到框中
                                    textArea.val(h5Url);
                                    //浏览按钮变成红色
                                    btnPay.removeClass('noClick');
                                } else if (data.result === 'outtime') {
                                    //超时
                                    displayLose(2000, '接口超时请重新输入');
                                    return false;
                                } else {
                                    //失败提示框
                                    displayLose(2000, '您输入的房源ID有问题请重新输入');
                                    return false;
                                }
                            }
                        });
                    }
                }
            });

            //input事件监控输入框中的值是否与生成的链接一样，如果一样则样式为红色
            textArea.on('input',function () {
                if ($(this).val() === h5Url) {
                    btnPay.removeClass('noClick');
                } else {
                    btnPay.addClass('noClick');
                }
            });
            //用浏览按钮样式判断是否为红色,如果是则绑定跳转
            $('#scan').on('click',function () {
                if(btnPay.hasClass('noClick')) {
                } else {
                    //有些浏览器或者手机点击浏览按钮返回后数据会丢失，在此进行提示
                    if (cityManual.text() === '' || cityManual.text() === '请选择城市' || zftypeManual.text().trim() === '' || zftypeManual.text().trim() === '请选择房源类型' || houseID.val() === '') {
                        displayLose(2000, '城市、房源类型或房源ID不能为空,请完善后，重新点击“生成链接”按钮');
                    } else {
                        location.href = h5Url;
                    }
                }
            });


            //取消按钮
            $('.cancel').on('click', function () {
                $('.sf-maskFixed').hide();
                enable();
            });
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
            /**
             * 为了方便解绑事件，声明一个阻止页面默认事件的函数
             * @param e
             */
            function pdEvent(e) {
                e.preventDefault();
            }

            //验证
            function verify() {
                var param = {};
                // 获取城市选择的数据
                param.city = cityManual.text().trim();
                // 获取租房类型选择的数据
                param.zftype = zftypeManual.text().trim();
                // 获取房源IDinput框中的数据
                param.houseID = houseID.val();


                if (param.city === '' || param.city === '请选择城市') {
                    displayLose(2000, '请选择城市');
                    return false;
                } else if (param.zftype === '' || param.zftype === '请选择房源类型') {
                    displayLose(2000, '请选择房源类型');
                    return false;
                } else if (param.houseID === '') {
                    displayLose(2000, '房源ID不能为空');
                    return false;
                } else if (!houseIdMatch.test(param.houseID)) {
                    displayLose(2000, '房源ID格式错误[最多10位，且为数字]');
                    return false;
                }
                return true;
            }

            //提示窗
            /**
             * 显示隐藏提示浮层函数
             * @param time 控制几秒消失
             * @param keywords 提示信息
             * @param url 隐藏浮层时的跳转链接
             */
            // 浮层提示控制
            var $sendFloat = $('#sendFloat');

            function displayLose(time, keywords, url) {
                $('#sendText').text(keywords).show();
                $sendFloat.show();
                setTimeout(function () {
                    $sendFloat.hide();
                    if (url) {
                        window.location.href = url;
                    }
                }, time);
            }
        }
    });
