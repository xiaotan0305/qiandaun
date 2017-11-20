/**
 * Created by Young on 15-3-12.
 * 单量更改于2015-9-9
 */
define('modules/jiaju/post', ['jquery', 'photoswipe/4.0.7/photoswipe-ui-default.min', 'photoswipe/4.0.7/photoswipe',
    'imageUpload/1.0.0/imageUpload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var ImgUpload = require('imageUpload/1.0.0/imageUpload');
        new ImgUpload({
            container: '.bbs-addpic',
            url: vars.jiajuSite + '?c=jiaju&a=ajaxUploadImg&city=' + vars.city,
            imgCountId: '#uploadPic',
            maxLength: 9,
            numChangeCallback: function (count) {
                $('#last').html(this.maxLength - count);
                checkStatus();
            }
        });

        var $subCon = $('.submit');

        var $replyContent = $('#replyContent');
        var $replyTittle = $('#replyTittle');
        var $emoBox = $('.expressionBag');
        var $editableEle = $('#replyContent,#replyTittle');
        var $yzmfloat = $('.yzmfloat');
        var $yzm = $yzmfloat.children().eq(0);
        var $yzmalert = $('.yzmalert');
        var $qd = $('#qd');
        var $qx = $('#qx');
        // 可编辑框，聚焦，失焦，输入事件
        $editableEle.on('focus', function () {
            var $this = $(this);
            if ($this.html().trim() === $this.attr('placeholder')) {
                $this.html('');
            }
        }).on('blur', function () {
            var $this = $(this);
            if ($this.html().trim() === '') {
                $this.html($this.attr('placeholder'));
            }
        }).on('input', function () {
            checkStatus();
        });
        // 用户添加了9张图片后 再次点击进行提示
        $('#pic').on('click', function () {
            if ($('#uploadPic').text() === '9') {
                alert('您最多能上传9张照片哦~');
                return false;
            }
        });

        // 获取标题和内容
        function getdata() {
            var topic = $replyTittle.text().trim().replace(/\s/g, '&nbsp;');
            var content = $replyContent.text().trim().replace(/\s/g, '&nbsp;');
            $('.imgClass').each(function () {
                content += '<br/><img src="' + $(this).attr('src') + '" />';
            });
            var aArray = {};
            // 定义一个数组
            aArray.topic = topic;
            aArray.content = content;
            return aArray;
        }

        // 判断发布按钮
        function checkStatus() {
            var data = getdata();
            $subCon.off('click', submit);
            if (data.topic !== '' && data.topic.length < 40 && data.topic !== $replyTittle.attr('placeholder')
                && data.content !== '' && data.content !== $replyContent.attr('placeholder')) {
                $subCon.addClass('active');
                $subCon.on('click', submit);
            } else {
                $subCon.removeClass('active');
            }
        }

        // 返回地址
        function backTo() {
            if (vars.rewriteFlag) {
                vars.zxltUrl += '?r=' + Math.random();
            } else {
                vars.zxltUrl += '&r=' + Math.random();
            }
            window.location = vars.zxltUrl;
        }

        // 显示表情
        $('.add-face').on('click', function () {
            $emoBox.toggle();
        });
        // 添加表情
        $emoBox.on('click', 'li', function () {
            var content = $replyContent.html();
            if (content === '内容') {
                $replyContent.text('(#' + this.title + ')');
            } else {
                $replyContent.text(content + '(#' + this.title + ')');
            }
            $emoBox.hide();
            checkStatus();
        });


        // replyPostInfo方法,将用户输入内容传到后台
        function post(title, content) {
            $subCon.removeClass('active');
            var ajaxURL = vars.jiajuSite + '?c=jiaju&a=ajaxPublishBbs&city=' + vars.city + '&r=' + Math.random();
            var jsondata = {
                sign: vars.sign,
                domain: vars.domain,
                city: vars.city,
                topic: title,
                content: content
            };
            $.post(ajaxURL, jsondata, function (data) {
                $subCon.addClass('active');
                if (data.Flag === 'True' && data.ErrorType === '-1') {
                    yhxw(53);
                    $yzmalert.text('发帖成功').show();
                    setTimeout(function () {
                        $yzmfloat.hide();
                        backTo();
                    }, 500);
                } else {
                    var errtips;
                    switch (data.ErrorType) {
                        case '2':
                            errtips = '您已被禁止发言';
                            break;
                        case '3':
                            errtips = '发帖失败，被判定为垃圾内容';
                            break;
                        case '10':
                            errtips = '发帖失败，被判定为垃圾内容';
                            break;
                        case '11':
                            errtips = '帐号未激活，请绑定手机或邮箱后重试';
                            break;
                        case '12':
                            errtips = '只有认证业主可以发帖';
                            break;
                        case '13':
                            errtips = '只有该论坛通讯录用户可以发帖';
                            break;
                        case '20':
                            errtips = '您已被禁止发言';
                            break;
                        case '4':
                            errtips = '发帖失败，请稍候重试';
                            break;
                        case '7':
                            errtips = '发帖失败，请稍候重试';
                            break;
                        case '9':
                            errtips = '发帖失败，请稍候重试';
                            break;
                        default:
                            errtips = '发帖失败，请稍候重试';
                    }
                    $yzmalert.text(errtips).show();
                    setTimeout(function () {
                        $yzmfloat.hide();
                    }, 500);
                }
            });
        }

        $qx.on('click', function () {
            $yzmfloat.hide();
        });

        $qd.on('click', function () {
            var data = getdata();
            var title = data.topic;
            var content = data.content;
            $yzm.hide();
            post(title, content);
        });
        $yzmfloat.on('click', function (e) {
            if ($(e.target).hasClass('yzmfloat')) {
                $yzmfloat.hide();
            }
        });

        // 返回按钮处理
        $('.back').on('click', function (e) {
            e.preventDefault();
            backTo();
        });

        function submit() {
            if ($(this).hasClass('active')) {
                $yzm.show();
                $yzmalert.hide();
                $yzmfloat.show();
            }
        }

        // 用户行为统计
        require.async('jsub/_ubm.js?v=201407181100');

        function yhxw(type) {
            _ub.city = vars.cityname;
            // 业务---h代表家居
            _ub.biz = 'h';
            // 家居不分南北方，都传0
            _ub.location = 0;
            // 用户动作（浏览0、打电话31、在线咨询24、分享22、收藏21）
            // 用户行为(格式：'字段编号':'值')
            // 收集方法
            _ub.collect(type, {
                mp3: 'h'
            });
        }
    };
});