/**
 * 我的租房发布页 步骤2
 * by zdl 20160705 租房ui改版
 */
define('modules/myzf/houseLeaseStepTwo', ['jquery', 'slideFilterBox/1.0.0/slideFilterBox','iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // 存放全局变量 seajs中相关的配置数据
        var vars = seajs.data.vars;
        // 引入jquery
        var $ = require('jquery');
        var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
        var iscrollNew = require('iscroll/2.0.0/iscroll-lite');
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

        var $btnPay = $('#submit');
        // 提交按钮是否可用验证
        function submitVerification() {
            // 需要验证的数据
            // 合住类型shareType
            // 户型huxing
            // 合租户数shareNumber
            // 租金priceManual
            // 建筑面积buildingareaManual
            // 楼层floorManual
            // 总楼层totlefloorManual
            // 房源描述descriptionManual
            var Rentway;
            var Roomcount;
            if (vars.leaseType === 'hz') {
                // 类型
                Rentway = $('#shareType').text();
                // 几户合租
                Roomcount = $('#shareNumber').text();
            }
            // 户型
            var huxing = $.trim($('#huxing').text());
            // 租金
            var Price = $('#priceManual').val();
            // 建筑面积
            var Buildingarea = $('#buildingareaManual').val();
            // 楼层
            var Floor = $('#floorManual').val();
            // 总楼层
            var Totlefloor = $('#totlefloorManual').val();
            // 房源描述
            var Description = $('#descriptionManual').val();
            // 合租没有户型选择
            if (vars.leaseType === 'hz') {
                if (Rentway !== '请选择' && Roomcount !== '请选择' && Price !== '' && Buildingarea !== '' && Floor !== ''
                    && Totlefloor !== '' && Description !== '') {
                    $btnPay.removeClass('noClick');
                } else {
                    $btnPay.addClass('noClick');
                }
            } else {
                if (huxing !== '请选择' && Price !== '' && Buildingarea !== '' && Floor !== '' && Totlefloor !== '' && Description !== '') {
                    $btnPay.removeClass('noClick');
                } else {
                    $btnPay.addClass('noClick');
                }
            }
        }

        // 解决回退时数据都填写了 按钮仍然是灰色的bug
        submitVerification();

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
                // <a class="zu_eidt"><i></i></a> rental-mode relative bb8
                html = '<img id="coverImg" src="' + coverImgSrc + '">';
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
                $('#coverImg').attr('src',coverImgSrc);
            }
        });


        // 给编辑按钮添加点击事件 编辑按钮存在时说明用户已经传过了图片
        $('.main').on('click','.zu_eidt',function () {
            // 隐藏编辑页面显示上传图片浮沉
            $('.main').hide();
            $('.header').eq(0).hide();
            $('.photoMain').show();
        });


        // 点击浮层取消按钮隐藏浮层
        $('.cancel').on('click', function () {
            $('.sf-maskFixed').hide();
            enable();
        });

        // 下拉浮层滑动列表显示操作
        $('#shareType,#shareNumber').on('click', function () {
            var eleId = $(this).attr('id');
            var eleDrapId = eleId + 'Drap';
            $('#' + eleDrapId).show();
            slideFilterBox.refresh('#' + eleDrapId + 'Con');
            slideFilterBox.to('#' + eleDrapId + 'Con', 0);
            unable();
        });


        // 下拉浮层数据选择
        $('#shareTypeDrapCon,#shareNumberDrap').on('click', 'li', function () {
            // 用于找到选中的数据显示的位置
            var reg = /DrapCon/;
            var $that = $(this);
            // 获取浮层元素id
            var targetFatherEleId = $that.parent().parent().attr('id');
            // 用户选中的值
            var sleectedVal = $that.text();
            //  选择数据显示在什么位置的元素id
            var showValEleId = targetFatherEleId.replace(reg, '');
            //  把用户选中的值填入对应的位置
            $('#' + showValEleId).text(sleectedVal);
            // 隐藏下拉浮沉
            $('.sf-maskFixed').hide();
            submitVerification();
            // 允许页面滑动
            enable();
        });

        // 选填项处理 start
        // 户型选择列表处理start
        // huxingValue 用于保存选择户型数据
        var huxingValue = '';
        var $huxing = $('#huxing');


        // 给户型选择按钮添加点击事件
        $huxing.on('click', function () {
            // 将选择的户型数据清空
            huxingValue = '';
            $('#huxingShiText').text('请选择户型');
            // 显示户型选择列表下的 室列表选项
            $('#huxingShiDrap').show();
            // 给户型选择列表下的 室列表添加滑动筛选功能
            new iscrollNew('#huxingShiDrapCon', {scrollY: true,click:true,preventDefault:false});
            unable();
        });


        // 给户型选择对应的室选择下拉列表添加点击事件
        $('#huxingShiDrap').find('li').on('click', function () {
            var $that = $(this);
            $huxing.addClass('xuan2');
            huxingValue += $that.text();
            $('#huxingTingText').text(huxingValue);
            $huxing.text(huxingValue);
            // 当点击对应的室列表选项后 隐藏室选项下拉列表
            $('#huxingShiDrap').hide();
            //  显示之后需要继续选择的厅下拉选择列表
            $('#huxingTingDrap').show();
            //  给户型选项的厅下拉列表内容添加滑动筛选功能
            new iscrollNew('#huxingTingDrapCon', {scrollY: true,click:true,preventDefault:false});
            submitVerification();
            unable();
        });


        // 给户型选择下的厅选择下拉列表添加点击事件
        $('#huxingTingDrap').find('li').on('click', function () {
            var $that = $(this);
            huxingValue += $that.text();
            $('#huxingWeiText').text(huxingValue);
            $huxing.text(huxingValue);
            //  当点击了厅下拉列表中的内容时 隐藏厅下拉选项列表
            $('#huxingTingDrap').hide();
            // 显示卫下拉选项列表
            $('#huxingWeiDrap').show();
            // 给居室选择的卫选择下拉选择的内容添加滑动筛选功能
            new iscrollNew('#huxingWeiDrapCon', {scrollY: true,click:true,preventDefault:false});
            submitVerification();
            unable();
        });


        // 给户型选择下的卫选择下拉列表添加点击事件
        $('#huxingWeiDrap').find('li').on('click', function () {
            var $that = $(this);
            huxingValue += $that.text();
            // $('#huxingWeiText').text(huxingValue);
            // 将户型选择的对应的室、厅、卫数据 写入到户型显示的span中
            $huxing.text(huxingValue);
            $('#huxingWeiDrap').hide();
            submitVerification();
            // slideFilterBox.refresh('#huxingWeiDrapCon');
            enable();
        });

        // 给配套设施下的a标签添加点击事件 实现配套设施的选择
        
        $('#equitmentManual a').on('click', function () {
            $(this).toggleClass('active');
        });

        // 获取配套设施
        function getEquitement(arr) {
            var arr1 = [];
            var arrStr;
            for (var i = 0; i < arr.length; i++) {
                arr1.push(arr[i].innerHTML + ',');
            }
            arrStr = arr1.join('');
            return arrStr.substr(0, arrStr.length - 1);
        }

        // 取消非数字的输入
        $('#floorManual,#totlefloorManual,#priceManual').on('keyup', function () {
            var me = $(this);
            if (me.val().indexOf(0) === 0) {
                me.val('');
            }
            me.val(me.val().replace(/[\D]/g, ''));
            submitVerification();
        });

        // 控制面积input输入框的输入
        $('#buildingareaManual').on('input', function () {
            var reg = /[^\d\.]/g;
            var me = $(this), val = me.val();
            me.val(val.replace(reg, ''));
            // 把输入的数据进行截取
            if (val.indexOf(0) === 0) {
                me.val('');
            }
            submitVerification();
        }).on('blur', function () {
            var $that = $(this);
            var areaTest = /^[0-9]{1,4}(\.[0-9]{0,2}|)$/;
            if (!areaTest.test($that.val()) && $that.val() !== '') {
                displayLose(3000, '请输入正确格式的面积！');
                $that.val('');
            }
        });

        // 描述验证
        $('#descriptionManual').on('input', function () {
            submitVerification();
        });

        // 点击自动生成描述按钮
        $('#autoDescription').on('click', function () {
            var $that = $(this);
            var autoDescriptionVal = $that.attr('data-value');
            $('#descriptionManual').val(autoDescriptionVal);
            submitVerification();
        });

        function getUploadImg() {
            var imgUrlStr;
            var imgUrlArry = [];
            $myzfAddPic.find('img').each(function () {
                imgUrlArry.push($(this).attr('src'));
            });
            imgUrlStr = imgUrlArry.join(',');
            return imgUrlStr;
        }

        // 发布房源信息
        var submitFlag = false;
        var setTop;
        var isUploadImg;

        // 放弃和继续完善的弹框点击事件
        $('.tz-btn').on('click', 'input', function () {
            var $that = $(this);
            var clickEleId = $that.attr('id');
            // 如果点击了继续完善按钮
            if (clickEleId === 'improve') {
                // 点击继续完善跳转到更多信息填写页面
                window.location.href = vars.mySite + '?c=myzf&a=houseLeaseMore&setTop=' + setTop + '&isUploadImg=' + isUploadImg + vars.h5hdurl + vars.channelurl;
            } else {
                // 点击放弃的跳转到帮你出租页面
                window.location.href = vars.mySite + '?c=myzf&city=' + vars.city + vars.h5hdurl + vars.channelurl;
            }
        });

        $btnPay.on('click', function () {
            // 发送给后台的数据对象
            var param = {};
            if ($(this).hasClass('noClick')) {
                console.log('用户没有按照要求填写必填信息');
                return false;
            }
            if (vars.leaseType === 'hz') {
                // 类型
                param.Rentway = $('#shareType').text();
                // 几户合租
                param.Roomcount = $('#shareNumber').text();
            }
            // 户型
            var huxing = $.trim($huxing.text());
            param.Room = huxing.substr(0, 1);
            param.Hall = huxing.substr(2, 1);
            param.Toilet = huxing.substr(4, 1);
            // 租金
            param.Price = $('#priceManual').val();
            // 建筑面积
            param.Buildingarea = $('#buildingareaManual').val();
            // 楼层
            param.Floor = $('#floorManual').val();
            // 总楼层
            param.Totlefloor = $('#totlefloorManual').val();
            // 配套设施
            param.Equitment = getEquitement($('#equitmentManual .active'));
            // 房源描述
            param.Description = $('#descriptionManual').val();
            // 获取封面图的连接地址
            param.Titleimg = encodeURIComponent($('img.cover').attr('src'));
            // 获取全部上传图片的连接地址全部图片
            // param.allImg = getUploadImg();
            // 除封面图以外的其它图片地址
            param.Shineiimg = encodeURIComponent(getUploadImg());
            if (param.Titleimg === 'undefined') {
                // 用于标志是否上传图片
                isUploadImg = 0;
            } else {
                isUploadImg = 1;
            }
            if (submitFlag) {
                return false;
            }
            // 验证类型
            if (vars.leaseType === 'hz' && param.Rentway === '请选择') {
                displayLose(2000, '房屋类型不能为空');
                return false;
            } else if (vars.leaseType === 'hz' && param.Roomcount === '请选择') {
                // 验证几户合租
                displayLose(2000, '几户合租不能为空');
                return false;
            } else if ($huxing.text().trim() === '请选择') {
                // 验证户型
                displayLose(2000, '户型不能为空');
                return false;
            } else if (param.Price === '') {
                // 租金验证
                displayLose(2000, '租金不能为空');
                return false;
            } else if (param.Buildingarea === '') {
                // 建筑面积验证
                displayLose(2000, '建筑面积不能为空');
                return false;
            } else if (param.Floor === '') {
                // 楼层验证
                displayLose(2000, '楼层不能为空');
                return false;
            } else if (param.Totlefloor === '') {
                // 总楼层验证
                displayLose(2000, '总楼层不能为空');
                return false;
            } else if (parseInt(param.Totlefloor) < parseInt(param.Floor)) {
                // 总楼层必须大于楼层判断
                displayLose(2000, '总楼层不能小于楼层');
                return false;
            } else if (param.Description === '') {
                // 房源描述验证
                displayLose(2000, '房源描述不能为空');
                return false;
            }
            $.ajax({
                url: vars.mySite + '?c=myzf&a=submitHouseInfo',
                data: param,
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    if (data) {
                        // 如果数据提交成功
                        if (data.errcode === '100') {
                            // 数据提交成功 提交标志位设置为true
                            submitFlag = true;
                            // 弹出关于完善信息的提示 settop === '1'满足置顶条件
                            if (data.setTop === '1') {
                                $('#information').text('继续完善房源信息，可获赠一天的免费置顶，提升出租效率。');
                                setTop = 1;
                            } else {
                                $('#information').text('继续完善房源信息，可提升房屋竞争力，是否去完善信息？');
                                setTop = 0;
                            }
                            $('#prompt').show();
                        } else if (data.relocate) {
                            displayLose(2000, data.errmsg, data.relocate);
                        } else {
                            displayLose(2000, data.errmsg);
                        }
                    } else {
                        displayLose(2000, '网络错误,请稍候再试');
                    }
                }
            });
        });
    };
});
