/**
 * 我的租房房源发布更多信息页面
 * by zdl 20160712 租房ui改版
 */
define('modules/myzf/houseLeaseMore',['jquery','slideFilterBox/1.0.0/slideFilterBox'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
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


        // 限制楼栋 门牌号 租金数据的输入
        $('#blockManual,#unitnumberManual,#newhall').on('keyup',function () {
            var me = $(this);
            // 限制输入小数点
            me.val(me.val().replace(/\./g,''));
        });


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
        $('.cancel').on('click',function () {
            $('.sf-maskFixed').hide();
            enable();
        });

        // 下拉浮层滑动列表显示操作
        $('#direction,#decoration,#payWay,#genderLimit').on('click',function () {
            // 获取点击的元素的id
            var eleId = $(this).attr('id');
            // 更具获取的元素id拼接出对应的下拉浮沉元素id
            var eleDrapId = eleId + 'Drap';
            // 显示对应的浮沉元素
            $('#' + eleDrapId).show();
            // 浮沉下拉列表添加滚动
            slideFilterBox.refresh('#' + eleDrapId + 'Con');
            slideFilterBox.to('#' + eleDrapId + 'Con', 0);
            // 禁止页面滑动
            unable();
        });

        // 下拉浮层数据选择
        $('#directionDrapCon,#decorationDrapCon,#payWayDrapCon,#genderLimitDrap').on('click','li',function () {
            // 用于找到选中的数据显示的位置
            var reg = /DrapCon/;
            var $that = $(this);
            // 获取浮层元素id
            var targetFatherEleId = $that.parent().parent().attr('id');
            // 用户选中的值
            var sleectedVal = $that.text();
            //  选择数据显示在什么位置的元素id
            var showValEleId = targetFatherEleId.replace(reg,'');
            //  把用户选中的值填入对应的位置
            $('#' + showValEleId).text(sleectedVal).addClass('xuan2');
            // 隐藏下拉浮沉
            $('.sf-maskFixed').hide();
            // 允许页面滑动
            enable();
        });

        // 浮层提示控制
        function displayLose(time, keywords, url) {
            $('#sendFloat').show();
            $('#sendText').text(keywords);
            setTimeout(function () {
                $('#sendFloat').hide();
                if (url) {
                    window.location.href = url;
                }
            },time);
        }

        var imgUrlArry = [];
        function getUploadImg() {
            var imgUrlStr;
            $myzfAddPic.find('img').each(function () {
                imgUrlArry.push($(this).attr('src'));
            });
            imgUrlStr = imgUrlArry.join(',');
            return imgUrlStr;
        }

        // 点击免费置顶按钮
        var submitFlag = false;
        $('#submit').on('click',function () {
            var param = {};
            // 如果已经提交成功了不允许重复提交
            if (submitFlag) {
                return false;
            }
            var directionVal = $('#direction').text();
            var decorationVal = $('#decoration').text();
            var payWayVal = $('#payWay').text();
            var genderLimitVal = $('#genderLimit').text();
            // 楼栋
            param.Block = $('#blockManual').val();
            // 单元
            param.Unitnumber = $('#unitnumberManual').val();
            // 门牌号（房间号）
            param.Newhall = $('#newhall').val();
            // 朝向
            param.Forward = directionVal !== '请选择' ? directionVal : '';
            // 装修程度
            param.Fitment = decorationVal !== '请选择' ? decorationVal : '';
            // 支付方式
            param.Payinfo = payWayVal !== '请选择' ? payWayVal : '';
            // 性别限制
            param.Rentgender = genderLimitVal !== '请选择' ? genderLimitVal : '';
            // 获取封面图的连接地址
            param.Titleimg = encodeURIComponent($('img.cover').attr('src'));
            // 获取全部上传图片的连接地址全部图片
            // param.allImg = getUploadImg();
            // 除封面图以外的其它图片地址
            param.Shineiimg = encodeURIComponent(getUploadImg());

            // 向后台提交数据
            $.ajax({
                // ajax请求的链接地址
                url: vars.mySite + '?c=myzf&a=submitMoreHouseInfo',
                // 请求发送的数据
                data: param,
                // 返回的数据类型
                dataType: 'json',
                // 提交数据的方式
                type: 'POST',
                // 取消异步请求
                async: false,
                // 请求成功的回调
                success: function (data) {
                    if (data) {
                        if (data.errcode === '100') {
                            // 数据提交成功 把提交标志位设置为true 防止多次点击重复提交数据
                            submitFlag = true;
                            var sucurl = vars.mySite + '?c=myzf&a=houseLeaseSuc&from=more';
                            sucurl += vars.h5hdurl + vars.channelurl;
                            if (data.setTop === '1') {
                                // 满足置顶条件，跳转置顶成功页面
                                window.location.href = sucurl + '&setTop=1';
                            } else {
                                window.location.href = sucurl + '&setTop=0';
                            }
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
