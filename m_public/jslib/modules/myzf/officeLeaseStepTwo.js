/**
 * 租房写字楼发布 步骤2
 * by lina 201601215 租房ui改版
 */
define('modules/myzf/officeLeaseStepTwo', ['jquery', 'slideFilterBox/1.0.0/slideFilterBox', 'dateAndTimeSelect/1.1.0/dateAndTimeSelect'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            // 存放全局变量 seajs中相关的配置数据
            var vars = seajs.data.vars;
            // 引入jquery
            var $ = require('jquery');
            var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
            var $doc = $(document);

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

            var $submit = $('#submit');
            // 提交按钮是否可用验证
            function submitVerification() {
                // 类型级别
                var TypeGrade = $.trim($('TypeGrade').text());
                // 建筑面积
                var Buildingarea = $('#buildingareaManual').val().trim();
                // 租金
                var priceManual = $('#priceManual').val().trim();
                // 租金单位
                var priceType = $('#priceType').val().trim();
                // 物业费
                var tentFeeVal = $('#tentFeeVal').val().trim();
                // 楼层
                var Floor = $('#floorManual').val().trim();
                // 总楼层
                var Totlefloor = $('#totlefloorManual').val();
                // 房源描述
                var Description = $('#descriptionManual').val();
                // 物业费可见时验证是否输入了物业费
                if (TypeGrade !== '请选择' && Buildingarea !== '请选择' && priceType !== '请选择' && priceManual !== ''
                    && Floor !== '' && Totlefloor !== '' && Description !== '' && Description.length >= 5 && tentFeeVal !== '') {
                    $submit.removeClass('noClick');
                } else {
                    $submit.addClass('noClick');
                }
            }

            // 解决回退时数据都填写了 按钮仍然是灰色的bug
            submitVerification();
            // 图片上传
            // 缓存图片上传的显示容器
            var $myzfAddPic = $('#myzfAddPic');
            require.async(['imageUpload/1.0.0/imageUpload_myzf'], function (ImageUpload) {
                new ImageUpload({
                    richInputBtn: '#uploadPic',
                    container: '#myzfAddPic',
                    maxLength: 10,
                    loadingGif: vars.public + 'images/loading.gif',
                    url: '?c=myesf&a=ajaxUploadImg&city=' + vars.city,
                    numChangeCallback: function () {
                        if ($('.cver').length === 0 && $myzfAddPic.find('img').length) {
                            // 第一张图片默认设置为封面图
                            $myzfAddPic.find('img').eq(0).addClass('cover');
                            $myzfAddPic.find('dd').eq(0).append('<div class="cver">封面</div>');
                        }
                    }
                });
            });
            // 点击上传图片设置封面
            $myzfAddPic.on('click', '.imgClass', function () {
                // 去除之前的封面图
                $('.cver').remove();
                $('.imgClass').removeClass('cover');
                // 把当前点击的图片设为封面图
                $(this).addClass('cover');
                $(this).parent().append('<div class="cver">封面</div>');
            });
            var imgHeight = $(document).width() * 0.75;
            // 点击上传图片浮层的回退按钮
            $('#photoBack,#confirm').on('click', function () {
                // 显示发布页二主页面
                var coverImgSrc;
                coverImgSrc = $('img.cover').attr('src');
                var html;
                $('.main').show();
                // 显示该页面的头部
                $('.header').eq(0).show();
                // 隐藏图片上传浮沉
                $('.photoMain').hide();
                // 判断如果上传了封面图 显示该封面图
                if ($('.cver').length && !$('.rental-mode').length) {
                    $('.zu-photo').find('p').remove();
                    $('.zu-photo').removeClass('zu-photo').addClass('rental-mode').addClass('relative').addClass('bb8');
                    html = '<img id="coverImg" style="width:100% height:' + imgHeight + '" src="' + coverImgSrc + '">';
                    $('.rental-mode').append(html);
                    $('.rental-mode').find('a').removeClass('picAdd').addClass('zu_eidt');
                    $('#uploadPic').wrap('<i></i>');
                    // 显示额外的图片按钮
                    $('#uploadPic').hide();
                }
                if (!$('.cver').length && $('.rental-mode').length) {
                    $('#coverImg').remove();
                    $('.rental-mode ').removeClass('rental-mode').removeClass('relative').removeClass('bb8').addClass('zu-photo');
                    $('.zu-photo').find('a').removeClass('zu_eidt').addClass('picAdd');
                    $('.zu-photo').append('<p class="f14 gray-5">有照片的房子电话量会提高50%</p>');
                    // 显示额外的图片上传按钮
                    $('#uploadPic').show();
                }
                if ($('#coverImg').length) {
                    $('#coverImg').attr('src', coverImgSrc);
                }
            });

            // 初始化已经上传的图片
            if (vars.introImg !== '') {
                var html = '';
                var imgUrlArry = vars.introImg.split(';');
                var imgUrlArryLen = imgUrlArry.length;
                for (var i = 0; i < imgUrlArryLen; i++) {
                    if (imgUrlArry[i] === vars.titImg) {
                        html += '<dd><img width="61" class="imgClass cover" style="" src="' + imgUrlArry[i]
                            + '"><a class="del"></a><div class="cver">封面</div></dd>';
                    } else {
                        html += '<dd><img width="61" class="imgClass" style="" src="' + imgUrlArry[i] + '"><a class="del"></a></dd>';
                    }
                }
                setTimeout(function () {
                    $myzfAddPic.find('dl').prepend(html);
                }, 300);

                console.log($myzfAddPic.html());
                $myzfAddPic.find('img').on('error', function () {
                    $(this).addClass('defaultImg');
                });
            }
            $myzfAddPic.on('click', '.del', function () {
                if (confirm('\u786e\u5b9a\u8981\u5220\u9664\u6b64\u56fe\u7247\u5417\u003f')) {
                    $(this).parent().remove();
                }
                if ($myzfAddPic.find('img').length < 10) {
                    $myzfAddPic.find('.add').show();
                }
                if ($('.cver').length === 0 && $myzfAddPic.find('img').length) {
                    // 第一张图片默认设置为封面图
                    $myzfAddPic.find('img').eq(0).addClass('cover');
                    $myzfAddPic.find('dd').eq(0).append('<div class="cver">封面</div>');
                }
            });
            // 给编辑按钮添加点击事件 编辑按钮存在时说明用户已经传过了图片
            $('.main').on('click', '.zu_eidt', function () {
                // 隐藏编辑页面显示上传图片浮沉
                $('.main').hide();
                $('.header').eq(0).hide();
                $('.photoMain').show();
            });

            /**
             *  点击选项，出来弹框
             * @param btn 点击的按钮
             * @param parent1 弹框容器
             * @param parent2 选项的父元素
             * @param next 类型级别中的级别
             * @param relative 有关联的div
             */
            function selectFun(btn, parent1, parent2, next, relative) {
                $(btn).on('click', function () {
                    $(parent1).show();
                    slideFilterBox.refresh(parent2);
                    slideFilterBox.to(parent2, 0);
                    unable();
                });
                $(parent2).find('li').on('click', function () {
                    var thisVal = $(this).html();
                    $(parent1).hide();
                    $(btn).html(thisVal).addClass('xuan2');
                    // 如果有下级选项
                    if ($(next).length) {
                        $(next).show();
                        $(next).find('li').on('click', function () {
                            var nextVal = $(this).html();
                            $(btn).html(thisVal + '-' + nextVal).addClass('xuan2');
                            $(next).hide();
                        });
                    }
                    if ($(relative).length) {
                        $(relative).show();
                    }
                    submitVerification();
                    enable();
                });
            }

            // 点击类型级别,选择类型级别
            selectFun('#TypeGrade', '#officeTypeDrap', '#officeTypeDrapCon', '#officeGradeDrap');
            // 点击是否分割，选择分割类别
            selectFun('#divide', '#divideDrap', '#divideDrapCon');
            // 点击租金单位，选择租金单位
            selectFun('#priceType', '#priceTypeDrap', '#priceTypeDrapCon', '', '.price-display');
            // 选择支付方式
            selectFun('#payWay', '#payWayDrap', '#payWayDrapCon');
            // 选择是否包含物业费
            selectFun('#tentFee', '#tentFeeDrap', '#tentFeeDrapCon');
            // 选择装修程度
            selectFun('#tentFee', '#tentFeeDrap', '#tentFeeDrapCon');
            // 选择装修程度
            selectFun('#decoration', '#decorationDrap', '#decorationCon');
            // 点击浮层取消按钮隐藏浮层
            $('.cancel').on('click', function () {
                $('.sf-maskFixed').hide();
                enable();
            });
            // 日期选择功能
            var DateAndTimeSelect = require('dateAndTimeSelect/1.1.0/dateAndTimeSelect');
            var year = new Date().getFullYear();
            var lastYear = year + 5;
            var options = {
                // 特殊类型
                type: 'jiaju',
                // 年份限制
                yearRange: year + '-' + lastYear,
                // 单个选项的css高度，用于后面的位置计算
                singleLiHeight: 34,
                // 默认显示的日期
                defaultTime: new Date().getTime()
            };
            var dtSelect = new DateAndTimeSelect(options);
            // 点击选择入住时间
            $('#begintime').on('click', function () {
                dtSelect.show('dtSelect.setting.SELET_TYPE_DATE');
            });
            // 取消非数字的输入
            $('#floorManual').on('keyup', function () {
                var me = $(this);
                if (me.val().indexOf(0) === 0) {
                    me.val('');
                }
                if (me.val().indexOf('-') > -1) {
                    me.val(me.val().replace(/[\D]/g, ''));
                    me.val('-' + me.val());
                } else {
                    me.val(me.val().replace(/[\D]/g, ''));
                }
                submitVerification();
            });
            // 取消非数字的输入
            $('#totlefloorManual').on('keyup', function () {
                var me = $(this);
                if (me.val().indexOf(0) === 0) {
                    me.val('');
                }
                me.val(me.val().replace(/[\D]/g, ''));
                submitVerification();
            });
            // 提示弹框
            var msg = $('#sendFloat'),
                msgP = $('#sendText'),
                timer = null;

            function showMsg(text, callback) {
                text = text || '信息有误！';
                msgP.html(text);
                msg.fadeIn();
                clearTimeout(timer);
                timer = setTimeout(function () {
                    msg.fadeOut();
                    callback && callback();
                }, 2000);
            }

            // 楼层事件
            $('#totlefloorManual').on('blur', function () {
                var louceng = parseInt($('#floorManual').val());
                var totallou = parseInt($('#totlefloorManual').val());
                if (louceng && totallou && louceng > totallou) {
                    showMsg('楼层不能大于总楼层');
                }
            });
            // 控制面积input输入框的输入
            $('#buildingareaManual').on('input', function (ev) {
                var value = ev.target.value;
                // 整数部分输入5位，小数部分输入2位
                value = value.match(/\d{0,7}(\.\d{0,2})?/g);
                ev.target.value = value[0];
                // 建筑面积输入时，显示能否分割
                if (ev.target.value !== '') {
                    $('.area-display').show();
                } else {
                    $('.area-display').hide();
                }
                submitVerification();
            }).on('blur', function () {
                if ($(this).val() === '') {
                    showMsg('建筑面积不能为空');
                }
            });
            function limit(id, msg) {
                $(id).on('input', function (ev) {
                    var value = ev.target.value;
                    // 整数部分最多输入6位，小数部分输入2位
                    value = value.match(/\d{0,6}(\.\d{0,2})?/g);
                    ev.target.value = value[0];
                    submitVerification();
                }).on('blur', function () {
                    if ($(this).val() === '') {
                        showMsg(msg);
                    }
                });
            }

            // 租金输入限制
            limit('#priceManual', '租金不能为空');
            // 物业费输入限制
            limit('#tentFeeVal', '物业费不能为空');

            // 描述验证
            $('#descriptionManual').on('input', function () {
                submitVerification();
            }).on('blur', function () {
                var thisVal = $(this).val();
                if (thisVal && thisVal.length < 5) {
                    showMsg('请输入5-500个字');
                } else if (!thisVal.length) {
                    showMsg('房源描述不能为空');
                }
            });
            // 发布房源信息
            var setTop;
            var submitFlag = true;
            var isUploadImg;
            // 获取上传的图片
            function getUploadImg() {
                var imgUrlStr;
                var imgUrlArry = [];
                $myzfAddPic.find('img').each(function () {
                    imgUrlArry.push($(this).attr('src'));
                });
                imgUrlStr = imgUrlArry.join(',');
                return imgUrlStr;
            }

            // 上传函数
            function submit() {
                $.ajax({
                    url: vars.mySite + '?c=myzf&a=submitOfficeInfo',
                    data: param,
                    type: 'POST',
                    success: function (data) {
                        if (data) {
                            // 如果数据提交
                            if (data.errcode === '100') {
                                window.location.href = vars.mySite + '?c=myzf&a=publishSuccess&pubtype=3&houseid=' + data.houseid + '&city=' + vars.city + '&edit=' + vars.edit;
                            } else if (data.relocate) {
                                showMsg(data.errmsg);
                                window.location.href = data.relocate;
                            } else {
                                showMsg(data.errmsg);
                            }
                        } else {
                            showMsg('网络错误,请稍候再试');
                        }
                        // 提交标志位设置为true
                        submitFlag = true;
                    }
                });
            }

            var houseid;
            // 发送给后台的数据对象
            var param = {};
            $submit.on('click', function () {
                if ($(this).hasClass('noClick')) {
                    return false;
                }
                if (!submitFlag) {
                    return false;
                }
                var $TypeGrade = $('#TypeGrade');
                // 写字楼类型
                param.Shangyongtype = $TypeGrade.html().split('-')[0];
                // 写字楼级别
                param.Pumianjibietype = $TypeGrade.html().split('-')[1];
                // 建筑面积
                param.Buildingarea = $('#buildingareaManual').val().trim();
                // 租金
                param.Price = $('#priceManual').val().trim();
                // 租金单位
                param.priceType = $('#priceType').text().trim();
                // 支付方式
                param.Payinfo = $('#payWay').text().trim();
                // 是否包含物业费
                param.Iswuyefei = $('#tentFee').text().trim();
                // 是否可分割
                param.Issplit = $('#divide').text().trim();
                // 物业费
                param.Wuyefei = $('#tentFeeVal').val().trim();
                // 楼层
                param.Floor = $('#floorManual').val().trim();
                // 总楼层
                param.Totlefloor = $('#totlefloorManual').val().trim();
                // 装修程度
                param.Fitment = $('#decoration').text().trim();
                // 房源描述
                param.Description = $('#descriptionManual').val().trim();
                // 入住时间
                param.begintime = $('#begintime').text().trim();
                // 获取封面图的连接地址
                param.Titleimg = encodeURIComponent($('img.cover').attr('src'));
                // 获取全部上传图片的连接地址全部图片
                param.allImg = getUploadImg();
                // 除封面图以外的其它图片地址
                param.Shineiimg = encodeURIComponent(getUploadImg());
                // 发布类型
                param.pubtype = vars.pubtype;
                // 编辑类型
                param.edit = vars.edit;
                // 已发布房源id
                param.oldhouseid = vars.oldhouseid;
                if (param.Titleimg === 'undefined') {
                    // 用于标志是否上传图片
                    isUploadImg = 0;
                } else {
                    isUploadImg = 1;
                }
                // 验证类型
                if (!param.Shangyongtype) {
                    // 验证户型
                    showMsg('请选择类型');
                    return false;
                } else if (!param.Pumianjibietype) {
                    // 验证户型
                    showMsg('请选择级别');
                    return false;
                } else if (param.Buildingarea === '') {
                    // 建筑面积验证
                    showMsg('建筑面积不能为空');
                    return false;
                } else if (param.Price === '') {
                    // 租金验证
                    showMsg('请输入租金');
                    return false;
                } else if (param.priceType === '请选择') {
                    // 租金验证
                    showMsg('请选择租金单位');
                    return false;
                } else if (param.Floor === '') {
                    // 楼层验证
                    showMsg('请填写楼层信息');
                    return false;
                } else if (param.Totlefloor === '') {
                    // 总楼层验证
                    showMsg('总楼层不能为空');
                    return false;
                } else if (parseInt(param.Totlefloor) < parseInt(param.Floor)) {
                    // 总楼层必须大于楼层判断
                    showMsg('总楼层应大于等于所在楼层');
                    return false;
                } else if (param.Wuyefei === '') {
                    // 房源描述验证
                    showMsg('请选择物业费');
                    return false;
                } else if (param.Description === '') {
                    // 房源描述验证
                    showMsg('房源描述不能为空');
                    return false;
                }
                if (!$('#coverImg').length) {
                    $('#pubSucProm').show();
                } else {
                    submitFlag = false;
                    submit();
                }
            });
            // 点击上传图片，留在本页
            $('#uploadimg').on('click', function () {
                $('#pubSucProm').hide();
                $(document).scrollTop('0');
            });
            // 点击完成
            $('#finish').on('click', function () {
                $('#pubSucProm').hide();
                submitFlag = false;
                submit();
            });
        };
    });
