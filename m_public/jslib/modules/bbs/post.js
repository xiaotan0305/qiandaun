/**
 * bbs发表新帖页
 * @Last Modified by:   liyingying
 * @Last Modified time: 2016/1/15
 */
define('modules/bbs/post', ['jquery', 'modules/bbs/bbsbuma', 'modules/bbs/BbsUA', 'modules/bbs/locate'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 用户行为对象
        var bbsbuma = require('modules/bbs/bbsbuma');
        var topic, content, imgupload = null;
        // UA信息
        var UA = require('modules/bbs/BbsUA');
        // 获取定位
        var locate = require('modules/bbs/locate');
        var lat='',lng='';
        window.onload = function() {
            locate.get_location(function (data) {
                if (data.status == 0) {
                    lat = data.result.point.x;
                    lng = data.result.point.y;
                }
            });
        };
        var clientInfo = UA.sname + '$$' + UA.typename + '$$' + UA.browsername + UA.version + '$$' + UA.os + '$$$$$$';
        var bbsContent = $('#content'),
        // 发送按钮
            btnAddPost = $('.submit'),
            sendAdd = $('#sendAdd'),
        // 标题
            bbsTopic = $('#topic'),
        // 表情包
            emoBox = $('.expressionBag'),
            bbsAddPic = $('#bbsAddPic');
        var floatDiv = $('#floatAlert'),
            floatText = floatDiv.find('p'),
            floatbtn = $('#floatbtn');
        // 浮层框
        var tzBox = $('.tz-box'),
            yzmSta = $('.yzm-sta'),
            tzCon = $('.tz-con'),
            cancel = $('#cancel'),
            qd = $('#qd'),
            vcode = $('.vcode');
        var post, reply, comment;
        // 点击发帖／提交
        var clickPost = false, win = window;
        // 验证码内容
        var code = '';
        // 隐藏草稿提示浮层
        var hiddenFloat = function () {
            setTimeout(function () {
                yzmSta.hide();
                tzBox.hide();
            }, 2000);
        };

        // 显示草稿提示浮层
        var showFloat = function (str) {
            yzmSta.html(str).show();
            tzBox.show();
        };
        if (vars.actionName === 'post') {
            // 发帖页浏览动作布码
            bbsbuma({type: 0, pageId: 'mbbswritepost'});
        } else if (vars.actionName === 'replyPost') {
            // 回复楼主浏览动作布码
            bbsbuma({type: 0, pageId: 'mbbsreplypost'});
        } else if (vars.actionName === 'replyComment') {
            // 发表评论浏览动作布码
            bbsbuma({
                type: 0,
                pageId: 'mbbsreplycomment',
                replyid: vars.postId,
                postid: vars.masterId,
                forumid: vars.forumId
            });
        }
        if (vars.actionName === 'post' || vars.actionName === 'replyPost') {
            require.async(['imageUpload/1.0.0/imageUpload', 'photoswipe/4.0.7/photoswipe-ui-default.min', 'photoswipe/4.0.7/photoswipe']);
        }
        // 修复在iphone中提示框偏右下的问题
        var thisPhone = navigator.userAgent.toLocaleLowerCase();
        if (thisPhone.indexOf('iphone') > -1 || thisPhone.indexOf('ipad') > -1 || thisPhone.indexOf('itouch') > -1) {
            floatDiv.css('width', $(win).width()).css('height', $(win).height());
        }
        var topicPlaceHolder = bbsTopic.text(),
            contentPlaceHolder = bbsContent.text();

        /**
         * 提交按钮处理
         */
        var submitHaddle = function () {
            // 验证不通过，返回
            if (!checkPostData()) {
                return;
            }
            // 如果有验证码，显示验证码弹层,评论页没有验证码
            if (vars.checkcode === '1' && vars.actionName !== 'replyComment') {
                tzBox.show();
                tzCon.show();
            } else {
                switch (vars.actionName) {
                    case 'post':
                        post(topic, content);
                        break;
                    case 'replyComment':
                        comment(content);
                        break;
                    default:
                        reply(content);
                        break;
                }
            }
        };

        /**
         * 提交按钮是否可点
         */
        var btnIsActive = function () {
            var condition;
            // 如果有图片
            if (imgupload && imgupload.imgsArray.length) {
                condition = true;
            } else {
                // 没有图片，就看有无内容
                condition = bbsContent.text() !== contentPlaceHolder && $.trim(bbsContent.text());
            }
            // 如果是发帖页再判断标题
            if (vars.actionName === 'post') {
                condition = condition && bbsTopic.text() !== topicPlaceHolder && $.trim(bbsTopic.text());
            }
            if (condition && (!btnAddPost.hasClass('active') || !sendAdd.hasClass('senta'))) {
                // 绑定发帖函数/回复楼主／评论
                btnAddPost.addClass('active').on('click', submitHaddle);
                sendAdd.addClass('senta').on('click', submitHaddle);
            } else if (!condition && (btnAddPost.hasClass('active') || sendAdd.addClass('senta'))) {
                btnAddPost.removeClass('active').off('click', submitHaddle);
                sendAdd.removeClass('senta').off('click', submitHaddle);
            }
        };

        // 发帖或者回复楼主
        if (vars.actionName === 'post' || vars.actionName === 'replyPost') {
            if (vars.actionName === 'post') {
                var trashPostList, trashArr = [];
                // 如果草稿箱中有对应草稿，优先读取
                if (vars.localStorage) {
                    trashPostList = localStorage.getItem('trashPostList');
                    if (trashPostList && vars.trashid) {
                        trashArr = trashPostList.split('@@@');
                        var trashJson = JSON.parse(trashArr[vars.trashid]);
                        if (trashJson.topic) {
                            bbsTopic.text(trashJson.topic);
                        }
                        if (trashJson.content) {
                            bbsContent.text(trashJson.content);
                        }
                        // 如果两个都存在，那么发送按钮就变红
                        if (trashJson.topic && trashJson.content) {
                            btnAddPost.addClass('active').off('click').on('click', submitHaddle);
                            sendAdd.addClass('senta').off('click').on('click', submitHaddle);
                        }
                    }
                }

                /**
                 * 发帖
                 * @param topic
                 * @param content
                 */
                post = function (topic, content) {
                    // 防止连续点击
                    if (clickPost) {
                        return;
                    }
                    clickPost = true;
                    $.ajax({
                        type: 'post',
                        url: vars.bbsSite + '?c=bbs&a=ajaxAddPost',
                        dataType: 'json',
                        data: {
                            code: code,
                            city: vars.city,
                            cityname: encodeURIComponent(vars.cityname),
                            sign: vars.sign,
                            topic: encodeURIComponent(topic),
                            content: encodeURIComponent('<p>' + content + '</p>'),
                            clientInfo: clientInfo+ lat + '$$' + lng
                        },
                        success: function (msg) {
                            bbsbuma({
                                type: 53,
                                pageId: 'mbbswritepost',
                                posttitle: topic,
                                postid: msg.MasterId,
                                forumid: vars.sign
                            });
                            if (msg.ErrorType === '-1') {
                                // 如果草稿箱里有这条草稿，就可以删除了
                                if (trashPostList) {
                                    trashArr = trashPostList.split('@@@');
                                    trashArr.splice(vars.trashid, 1);
                                    trashPostList = trashArr.join('@@@');
                                    localStorage.setItem('trashPostList', trashPostList);
                                }
                                win.location = msg.Url;
                            } else {
                                showToast(msg.ErrorMsg);
                            }
                            clickPost = false;
                        },
                        error: function () {
                            showToast('\u53d1\u9001\u5931\u8d25\u0021');
                            clickPost = false;
                        }
                    });
                };
                // 标题长度超过40提示
                bbsTopic.on('input', function () {
                    var ele = $(this);
                    if (ele.text().length >= 40) {
                        ele.text(ele.text().substring(0, 40));
                        showToast('\u6807\u9898\u6700\u591a\u0034\u0030\u5b57');
                        return;
                    }
                    // 如果标题和内容都存在,提交按钮变红色
                    btnIsActive();
                });
                // 点击标题
                bbsTopic.on('focus', function () {
                    // 标题（必填，最多40字）
                    if (bbsTopic.text() === topicPlaceHolder) {
                        bbsTopic.text('');
                    }
                });

                // 保存至草稿箱
                $('.add-savea').on('click', function () {
                    // 保存草稿失败，请关闭隐私模式
                    if (!vars.localStorage) {
                        showToast('\u4fdd\u5b58\u8349\u7a3f\u5931\u8d25\uff0c\u8bf7\u5173\u95ed\u9690\u79c1\u6a21\u5f0f');
                        return;
                    }
                    contentfilter();
                    var topic = bbsTopic.text().trim();
                    var content = bbsContent.text().trim();
                    // 标题和内容有一个存在就行
                    if (topic && topic !== topicPlaceHolder || content && content !== contentPlaceHolder) {
                        topic = topic === topicPlaceHolder ? '' : topic;
                        content = content === contentPlaceHolder ? '' : content;
                        // 存草稿的时间
                        var time = Date.parse(new Date());
                        // 这次新的数据
                        var newPostList = {
                            topic: topic,
                            content: content,
                            time: time,
                            city: vars.city,
                            cityname: vars.cityname,
                            sign: vars.sign,
                            signname: vars.signname
                        };
                        var str = JSON.stringify(newPostList);
                        // 编辑草稿箱
                        if (vars.trashid) {
                            trashArr = trashPostList.split('@@@');
                            trashArr.splice(vars.trashid, 1);
                            trashPostList = trashArr.join('@@@');
                            if (trashPostList === '') {
                                trashPostList = str;
                            } else {
                                trashPostList = str + '@@@' + trashPostList;
                            }
                        } else if (trashPostList) {
                            trashArr = trashPostList.split('@@@');
                            if (trashArr.length <= 7) {
                                trashPostList = str + '@@@' + trashPostList;
                            } else {
                                trashArr.pop();
                                trashPostList = trashArr.join('@@@');
                                trashPostList = str + '@@@' + trashPostList;
                            }
                        } else {
                            trashPostList = str;
                        }
                        localStorage.setItem('trashPostList', trashPostList);
                        showFloat('草稿保存成功');
                        hiddenFloat();
                    } else {
                        showFloat('请先编辑内容');
                        hiddenFloat();
                    }
                });
            } else {
                // 判断content中是否有值
                if (vars.localStorage && localStorage.getItem('inputCon')) {
                    bbsContent.text(localStorage.getItem('inputCon'));
                    localStorage.removeItem('inputCon');
                }
                // 回复楼主
                reply = function (content) {
                    // 防止连续点击
                    if (clickPost) {
                        return;
                    }
                    clickPost = true;
                    var announceid = 1,
                        code = vcode.val(),
                        sign = vars.sign,
                        masterId = vars.masterId,
                        topic = vars.topic,
                        bid = vars.bid,
                        city = vars.city,
                        sfappos = vars.sfappos,
                    // 这个pagesize是和产品商量后的值
                        pagesize = 30;
                    bbsbuma({type: 18, pageId: 'mbbsreplypost', posttitle: topic, postid: masterId, forumid: sign});
                    $.post(vars.bbsSite + '?c=bbs&a=ajaxQuoteReplay&city=' + city,
                        {
                            code: code,
                            sign: sign,
                            city: city,
                            bid: bid,
                            masterId: masterId,
                            announceid: announceid,
                            topic: encodeURIComponent(topic),
                            content: content,
                            sfappos: sfappos,
                            clientInfo: clientInfo+ lat + '$$' + lng
                        }, function (data) {
                            clickPost = false;
                            if (data.result === 'noLog') {
                                // 输入内容存入本地
                                vars.localStorage && localStorage.setItem('inputCon', bbsContent.text());
                                win.location = data.url;
                                return;
                            }
                            //  返回的data：Object {Flag: "true", error: "回帖成功", MasterId: "176028647", ErrorType: "100"}
                            if (data.ErrorType === '100') {
                                window.location.href = vars.bbsSite + vars.city + '/' + sign + '/' + masterId + '.htm?bottomFlag=1';
                            } else {
                                if (data.error != '') {
                                    showFloat(data.error);
                                } else {
                                    showFloat('回复失败');
                                }
                                hiddenFloat();
                            }
                        });
                };
            }
            var info = $('#info');
            // 图片上传
            require.async(['imageUpload/1.0.0/imageUpload'], function (ImageUpload) {
                imgupload = new ImageUpload({
                    richInputBtn: '#uploadPic',
                    container: '#bbsAddPic',
                    maxLength: 9,
                    url: vars.bbsSite + '?c=bbs&a=ajaxUploadImage&city=' + vars.city,
                    imgCountId: '#imgCountId',
                    numChangeCallback: function (count) {
                        if (count > 0) {
                            info.html('已选' + count + '张，还可以添加' + (9 - count) + '张');
                        } else {
                            info.html('');
                        }
                        // 判断是否可以提交
                        btnIsActive();
                    }
                });
            });
            // 单击内容中的图片，显示原图
            require.async(['photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min'], function () {
                bbsAddPic.on('click', 'dl img', function () {
                    var url = $(this).attr('src');
                    var imgStrs = bbsAddPic.find('dl img');
                    var slides = [];
                    var index = 0;
                    // 点击缩放大图浏览
                    if (imgStrs.length > 0) {
                        var pswpElement = $('.pswp')[0];
                        for (var i = 0, len = imgStrs.length; i < len; i++) {
                            var ele = imgStrs[i],
                                src = $(ele).attr('src');
                            if (src === url) {
                                index = i;
                            }
                            slides.push({src: src, w: ele.naturalWidth, h: ele.naturalHeight});
                        }
                        var options = {
                            history: false,
                            focus: false,
                            index: index,
                            escKey: true
                        };
                        var gallery = new win.PhotoSwipe(pswpElement, win.PhotoSwipeUI_Default, slides, options);
                        gallery.init();
                    }
                });
            });
            // 验证码的取消按钮
            cancel.on('click', function () {
                tzBox.hide();
                tzCon.hide();
            });
            // 验证码的确定按钮
            qd.on('click', function () {
                tzBox.hide();
                tzCon.hide();
                code = vcode.val();
                //  检查验证码
                if (code !== undefined && $.trim(code) === '') {
                    showToast('\u9a8c\u8bc1\u7801\u9519\u8bef\u0020\u8bf7\u91cd\u65b0\u8f93\u5165');
                    return false;
                }
                var url = '?c=bbs&a=checkCode&city=' + vars.city + '&code=' + code + '&r=' + Math.random();
                $.ajax({
                    url: url,
                    success: function (codedata) {
                        if (codedata !== 'OK') {
                            showToast('\u9a8c\u8bc1\u7801\u9519\u8bef\u0020\u8bf7\u91cd\u65b0\u8f93\u5165');
                            return false;
                        }
                        if (vars.actionName === 'post') {
                            post(topic, content);
                        } else {
                            reply(content);
                        }
                    }
                });
            });
        } else {
            var toUserId = '';
            if (vars.cUserId !== vars.replyUserId && vars.nickname !== '') {
                toUserId = vars.replyUserId;
            }
            comment = function (content) {
                // 防止连续点击
                if (clickPost) {
                    return;
                }
                clickPost = true;
                bbsbuma({
                    type: 108,
                    pageId: 'mbbsreplycomment',
                    replyid: vars.postId,
                    postid: vars.masterId,
                    forumid: vars.sign,
                    forumsign: vars.sign
                });
                // 发送数据
                $.post(vars.bbsSite + '?c=bbs&a=addcomment&city=' + vars.city + '&r=' + Math.random(), {
                    postId: vars.postId,
                    masterId: vars.masterId, sign: vars.sign, content: content, toUserId: toUserId
                }, function (data) {
                    clickPost = false;
                    if (data && data.error === 'success') {
                        window.location = vars.bbsSite + vars.city + '/' + vars.sign + '/' + vars.masterId + '.htm?postId=' + vars.postId;
                    } else {
                        showToast(data.error ? data.error : '网络不给力');
                    }
                });
            };
        }

        /**
         * 内容过滤
         */
        function contentfilter() {
            // 内容
            if (bbsContent.text() === contentPlaceHolder) {
                bbsContent.text('');
            }
        }

        bbsContent.on('focus', function () {
            contentfilter();
        });

        bbsContent.on('input', function () {
            btnIsActive();
        });

        // 显示表情
        $('.add-face').click(function () {
            emoBox.toggle();
        });

        // 点击添加表情
        emoBox.on('click', 'li', function () {
            contentfilter();
            var content = bbsContent.text();
            bbsContent.text(content + '(#' + this.title + ')');
            emoBox.hide();
            // 判断是否可以提交
            btnIsActive();
        });


        /**
         * 显示提示信息
         * @param text 提示信息
         */
        function showToast(text) {
            floatDiv.show();
            floatText.text(text);
        }

        /**
         * 检查提交数据
         */
        function checkPostData() {
            // 发帖页才有标题
            if (vars.actionName === 'post') {
                topic = bbsTopic.text();
                if (!topic || topic === topicPlaceHolder) {
                    showToast('\u8bf7\u8f93\u5165\u5e16\u5b50\u6807\u9898');
                    return false;
                }
            }
            content = bbsContent.text() === contentPlaceHolder ? '' : bbsContent.text().trim().replace(/\s/g, '&nbsp;');
            // 评论页没有图片上传
            if (vars.actionName !== 'replyComment') {
                // 上传的图片也算内容
                if (imgupload) {
                    $.each(imgupload.imgsArray, function (index, element) {
                        // 这个地方的图片地址取的是未收敛的，因为要传给接口存库
                        if (element.simgurl) {
                            content += '<br/><img src="' + element.simgurl + '" />';
                        }
                    });
                }
            }
            if (!content || content === contentPlaceHolder) {
                showToast('\u8bf7\u8f93\u5165\u5185\u5bb9');
                return false;
            }
            return true;
        }

        // 点击提示框消失
        floatbtn.on('click', function () {
            floatDiv.hide();
        });

        // 当输入框失去焦点时，需要露出页面的头部
        bbsContent.on('blur', function () {
            document.body.scrollTop = 0;
        });
    };
});