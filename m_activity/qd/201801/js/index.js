/**
 * @Author: yueyanlei
 * @Date:   2017/12/30
 * @Description: 2018年元旦管理会议
 */
$(function() {

    function Meeting() {
        var that = this;
        // 通用提示窗弹层
        that.email = '';
        that.floatBox = $('.floatAlert');
        that.init();
    }

    Meeting.prototype = {
        constructor: Meeting,

        /**
         * 初始化
         *
         */
        init: function() {
            var that = this;
                        // 图片放大
            var pswpElement = $('.pswp')[0];
            var slides = [{
                src: img_path+'m_activity/qd/201801/images/yichengmax.png',
                w: 589,
                h: 866
            }];
            var options = {
                history: false,
                focus: false,
                maxSpreadZoom: 3,
                index: 0,
                showAnimationDuration: 0,
                hideAnimationDuration: 0
            };
            $('.btn03').on('click', function () {
                //that.floatBox.hide();
                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
                gallery.init();
            });
            // 获取签到信息
            var parm = {};

            parm.c = 'public';
            parm.a = 'ajaxOA';
            parm.qd_type = '201801';

            $.ajax({
                url: location.origin + '/public/index.php',
                type: 'GET',
                data: parm,
                success: function(data) {
                    obj = $.parseJSON(data);
                    if (obj.status === -1) {
                        // 不是OA用户-1
                        that.showMessage('请在OA手机APP中打开！');
                    } else if (obj.status === 0) {
                        // weiqiangdao未签到0
                        that.email = obj.email;
                        $('#mt_submit').on('click', function(e) {
                            e.stopPropagation();
                            that.formSubmit();
                        })
                    } else if (obj.status === 2) {
                        // yiaqiandao已签到2
                        $('#f_title').html('您已经签到了');
                        that.floatBox.show();
                        that.showMessage('您已经签到了，感谢您的支持！');
                    } else if (obj.status === 3) {
                        // 不在名单中3
                        that.showMessage('不在大会名单内，感谢您的支持！');
                    }
                }
            });

        },
        showMessage: function(mesg) {

            $('.frombox').html(mesg).css({
                color: '#fff',
                'font-size': '36px'
            });
            $('.cbt').css('background-image', 'none');
        },
        formSubmit: function() {
            var that = this;
            var mt_q1 = $('#mt_q1');
            var mt_q2 = $('#mt_q2');
            if (mt_q1.val().length < 2) {
                alert('请输入问题1的答案，两个字以上！');
                mt_q1.focus();
                return false;
            }
            if (mt_q2.val().length < 2) {
                alert('请输入问题2的答案，两个字以上！');
                mt_q2.focus();
                return false;
            }


            // 提交事件
            var parm = {};

            parm.c = 'public';
            parm.a = 'ajaxWeixinQd';
            parm.email = that.email;
            parm.qd_type = '201801';
            parm.answer1 = mt_q1.val();
            parm.answer2 = mt_q2.val();
            $.ajax({
                url: location.origin + '/public/index.php',
                type: 'GET',
                data: parm,
                success: function(data) {
                    var flag = parseInt(data);
                    if (flag === 1) {
                        // 1成功
                        that.floatBox.show();
                    } else if (flag == 2) {
                        // yiaqiandao已签到2
                        $('#f_title').html('您已经签到了');
                        that.floatBox.show();
                        that.showMessage('您已经签到了，感谢您的支持！');
                    } else if (flag == 3) {
                        // 不在名单中3
                        that.showMessage('不在大会名单内，感谢您的支持！');
                    } else {
                        that.showMessage('签到失败！' + flag);

                    }
                }
            });

        },




        /**
         * 获取cookie
         * @param {any} key
         * @returns
         */
        getCookie: function(key) {
            var arr, reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
            if (arr = document.cookie.match(reg)) {
                var str;
                try {
                    str = decodeURIComponent(arr[2]);
                } catch (e) {
                    str = unescape(arr[2]);
                }
                return str;
            }
            return '';
        },

        /**
         * 设置cookie
         * @param {any} name
         * @param {any} value
         * @param {any} days

         * @returns
         */
        setCookie: function(name, value, days) {
            if (days === 0) {
                document.cookie = name + '=' + escape(value);
                return;
            }
            var exp = new Date();
            isNaN(days) && (days = 3);
            exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = name + '=' + escape(value) + '; path=/; expires=' + exp.toGMTString();
        }
    };
    return new Meeting();
});