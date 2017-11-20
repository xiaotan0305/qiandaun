/**
 * Created by Young on 15-6-26.
 * 单量修改于2015-9-9
 */
define('modules/jiaju/bbsReply', ['jquery', 'photoswipe/4.0.7/photoswipe-ui-default.min', 'photoswipe/4.0.7/photoswipe',
        'util', 'imageUpload/1.0.0/imageUpload'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            require.async('util');
            var floatDiv = $('#floatAlert');
            var floatText = floatDiv.find('p');
            var subCon = $('.submit');
            var replyContent = $('#replyContent');
            var emoBox = $('.expressionBag');
            var textarea = $('.textarea');
            var ImgUpload = require('imageUpload/1.0.0/imageUpload');
            new ImgUpload({
                container: '.bbs-addpic',
                url: vars.jiajuSite + '?c=jiaju&a=ajaxUploadImg&city=' + vars.city,
                imgCountId: '#uploadPic'
            });
            // 点击输入框获，默认内容消失
            textarea.on('click', function () {
                if ($(this).html().trim() === '回复' + vars.replyusername + ':') {
                    $(this).attr('placeholder', '');
                    $(this).html('');
                }
            });
            textarea.on('blur', function () {
                if ($(this).html().trim() === '') {
                    $(this).html('回复' + vars.replyusername + ':');
                }
            });
            floatDiv.hide();
            // 获取标题和内容
            function getdata() {
                var content = replyContent.text().trim().replace(/\s/g, '&nbsp;');
                $('.imgClass').each(function () {
                    content += '<br/><img src="' + $(this).attr('src') + '" />';
                });
                return content;
            }

            // 显示表情
            $('.add-face').on('click', function () {
                emoBox.toggle();
            });
            // 添加表情
            $('div.expressionBag').each(function (index, element) {
                var emoBox = $(element);
                emoBox.on('click', 'li', function () {
                    var content = replyContent.text();
                    var replycontentstr = '回复' + vars.replyusername + ':';
                    if (replycontentstr == content.trim()) {
                        replyContent.text('(#' + this.title + ')');
                    } else {
                        replyContent.text(content + '(#' + this.title + ')');
                    }
                    emoBox.hide();
                    checkStatus();
                });
            });
            // 判断按钮状态
            function checkStatus() {
                var data = getdata();
                if (data !== '' && data !== '回复' + vars.replyusername + ':') {
                    $('.submit').addClass('active');
                } else {
                    $('.submit').removeClass('active');
                }
            }

            // 内容获取焦点的时候判断发送按钮可否点击
            replyContent.on('input', function () {
                checkStatus();
            });
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
                _ub.collect(type, {mp3: 'h'});
            }

            // 用户添加了9张图片后 再次点击进行提示
            $('#pic').on('click', function () {
                if ($('#uploadPic').text() === '9') {
                    alert('您最多能上传9张照片哦~');
                    return false;
                }
            });
            var jsondata = {};
            var ajaxUrl = '';
            // 将用户输入内容传到后台
            function post(content) {
                if (vars.postId !== '') {
                    // 回复层主
                    ajaxUrl = vars.jiajuSite + '?c=jiaju&a=ajaxReplyCz&city=' + vars.city + '&r=' + Math.random();
                    jsondata = {
                        masterId: vars.masterId,
                        sign: vars.sign,
                        postId: vars.postId,
                        content: content,
                        pinpai: vars.pinpai,
                        toUserId: vars.toUserId
                    };
                } else {
                    // 回复楼主
                    ajaxUrl = vars.jiajuSite + '?c=jiaju&a=ajaxReplyLz&city=' + vars.city + '&r=' + Math.random();
                    jsondata = {
                        masterId: vars.masterId,
                        sign: vars.sign,
                        announceid: vars.announceid,
                        content: content,
                        bid: vars.bid,
                        pinpai: vars.pinpai
                    };
                }
                // 改成ajax请求
                var sucUrl = vars.jiajuSite + '?c=jiaju&a=bbsPostInfo&city=' + vars.city + '&sign=' + vars.sign + '&masterId='
                    + vars.masterId;
                if (vars.postId) {
                    sucUrl += '&postId=' + vars.postId;
                } else {
                    sucUrl += '&bottomFlag=1';
                }
                $.ajax({
                    type: 'post',
                    url: ajaxUrl,
                    data: jsondata,
                    dataType: 'json',
                    timeout: 5000,
                    success: function (data) {
                        if (data.Flag === 'true') {
                            $('#confirm').hide();
                            alert('发送成功');
                            floatDiv.show();
                            if (vars.pinpai) {
                                sucUrl += '&pinpai=1';
                            }
                            if (vars.isapp) {
                                sucUrl += '&src=client';
                            }
                            yhxw(18);
                            setTimeout(function () {
                                window.location = sucUrl;
                            }, 1000);
                        } else {
                            alert('评论失败，请稍后再做评论~');
                            setTimeout(function () {
                                window.location = sucUrl;
                            }, 1000);
                        }
                    },
                    error: function () {
                        floatText.text('网络不给力，请重试');
                        floatDiv.show();
                    }
                });
            }

            // 检查内容合法性
            function postReply() {
                var content = getdata();
                if (content === '' || content === '回复' + vars.replyusername + ':') {
                    floatDiv.show();
                    floatText.text('请输入内容');
                    return false;
                }
                post(content);
            }

            // 点击发送
            subCon.on('click', function () {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    postReply();
                } else {
                    return false;
                }
            });
        };
    });