define('modules/news/replypost',['util','photoswipe/4.0.7/photoswipe','photoswipe/4.0.7/photoswipe-ui-default.min'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // var util = require('util');
        var jwupload = null;

           /* floatAlert = $('.floatAlert .alert'),
            $authAlert = $('#authAlert'),   //认证弹层
            $authText = $('#authAlert p'),  //认证弹层文本
            $authBtn = $('#authbtn'),       //认证按钮
            $nextBtn = $('#nextbtn');       //离开按钮*/

        $('input[type=hidden]').each(function (index,element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        /* 修复在iphone中提示框偏右下的问题*/
        var thisPhone = navigator.userAgent.toLocaleLowerCase();
        if (thisPhone.indexOf('iphone') > -1 || thisPhone.indexOf('ipad') > -1 || thisPhone.indexOf('itouch') > -1) {
            $('.floatAlert').css('width', $(window).width()).css('height', $(window).height());
        }
        function yhxw(type) {
            if ('undefined' !== typeof _ub) {
                doyhxw(type);
            }else {
                require.async('jsub/_ubm.js',function () {
                    doyhxw(type);
                });
            }
        }

        function doyhxw(type) {
            _ub.city = vars.cityname;
            _ub.biz = 'd';
            // 业务---WAP端
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // 方位（南北方) ，北方为0，南方为1
            var b = type;
            // 用户动作（浏览0）
            var label = vars.postlabels.replace(/\|/g, '^');
            var pTemp = {
                mdw: vars.forumId,
                md1: vars.masterId,
                mdp: encodeURIComponent(label)
            };
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp.hasOwnProperty(temp)) {
                    if (pTemp[temp] !== null && '' !== pTemp[temp] && undefined !== pTemp[temp] && 'undefined' !== pTemp[temp]) {
                        p[temp] = pTemp[temp];
                    }
                }
            }
            // 用户行为(格式：'字段编号':'值')
            _ub.collect(b, p);
            // 收集方法
        }

        /* 提交*/
        var subCon = $('.subcontent');
        subCon.one('click', function () {
            yhxw(16);
            postReply();
        });

        /* 验证码*/
        $('.yzm').on('click', function () {
            $('.yzm img').attr('src', vars.bbsSite + '?c=bbs&a=authCode&r=' + Math.random());
        });

        /* 显示表情*/
        $('.add-face').on('click', function () {
            var emoBox = $('.emobox');
            if (emoBox) {
                if (emoBox.find('li').length === 0) {
                    $.get(vars.bbsSite + '?c=bbs&a=emo&from=news',function (data) {
                        emoBox.html(data).show();
                    });
                }
                emoBox.toggle();
            }
        });

        // 添加表情
        $('div.emobox').each(function (index,element) {
            var emoBox = $(element);
            emoBox.on('click','li',function () {
                var textArea = $('#replyContent'),content = textArea.html();
                textArea.text(content + '(#' + this.title + ')');
                emoBox.hide();
            });
        });

        /* 图片上传*/
        require.async(['jwingupload/1.0.6/jwingupload.source'],function (jWingUpload) {
            jwupload = jWingUpload({
                uploadPic: document.getElementById('uploadPic'),
                preview: document.getElementById('bbsAddPic'),
                maxLength: 20,
                imgPath: vars.public,
                url: vars.bbsSite + '?c=bbs&a=ajaxUploadImgNew&city=' + vars.city,
                imgCountId: '#uploadPic'
            });
        });

        var ratioX = document.documentElement.clientWidth;
        function opImgWH(w,h) {
            var ratio = 1;
            var w2 = w;
            var h2 = h;
            if (w2 <= ratioX) {
                ratio = ratioX / w2;
                w2 = ratioX;
                h2 *= ratio;
            }else {
                w2 = ratioX;
                ratio = w2 / ratioX;
                h2 *= ratio;
            }
            return {w: w2,h: h2};
        }

        // 单击内容中的图片，显示原图
        var index = 0;
        $('#bbsAddPic').on('click','img',function () {
            var imgStrs;
            var url = $(this).attr('src');
            imgStrs = jQuery('#bbsAddPic img');
            var itemArr = [];
            var slides = [];
            var w = 0,h = 0;
            var resultWH = null;
            // 点击缩放大图浏览
            if (imgStrs.length > 0) {
                require('photoswipe/4.0.7/photoswipe-ui-default.min');
                require('photoswipe/4.0.7/photoswipe');
                var pswpElement = document.querySelectorAll('.pswp')[0];
                for (var i = 0,len = imgStrs.length;i < len;i++) {
                    itemArr = [];
                    w = jQuery(imgStrs[i]).width();
                    h = jQuery(imgStrs[i]).height();
                    resultWH = opImgWH(w,h);
                    itemArr = {src: jQuery(imgStrs[i]).attr('src'),w: resultWH.w,h: resultWH.h};

                    if (jQuery(imgStrs[i]).attr('src') === url) {
                        index = i;
                    }
                    slides.push(itemArr);
                }
                var options = {
                    history: false,
                    focus: false,
                    index: index,
                    escKey: true
                };
                var gallery = new PhotoSwipe(pswpElement,PhotoSwipeUI_Default, slides, options).init();
            }
        });

        /* 点击提示框消失*/
        var floatDiv = $('#floatAlert'), floatText = $('#floatAlert p'), floatbtn = $('#floatbtn');
        floatbtn.on('click', function () {
            if (floatDiv.attr('display') !== 'none') {
                floatDiv.hide();
            }
        });
        // 判断content中是否有值
        if (localStorage.getItem('inputCon') !== '') {
            $('#replyContent').text(localStorage.getItem('inputCon'));
            localStorage.removeItem('inputCon');
        }

        /* 验证验证码，提交内容*/
        function postReply() {
            var content = $('#replyContent').text().trim().replace(/\s/g,'&nbsp;');
            var code = $('#code').val();
            if (jwupload) {
                $.each(jwupload.imgsArray,function (index,element) {
                    if (element.imgurl) {
                        content += '<br/><img src=\"' + element.imgurl + '\" />';
                    }
                });
            }

            if (content === '') {
                floatDiv.show();
                floatText.text('请输入点评内容');
                subCon.one('click', function () {
                    postReply();
                });
            }else {
                if (code !== undefined && $.trim(code) === '') {
                    floatDiv.show();
                    floatText.text('验证码错误 请重新输入');
                    subCon.one('click', function () {
                        postReply();
                    });
                    return false;
                }
                if (vars.checkcode === '1') {
                    var url = vars.bbsSite + '?c=bbs&a=checkCode&city=' + vars.city + '&code=' + code + '&r=' + Math.random();
                    $.ajax({url: url,success: function (codedata) {
                        if (codedata !== 'OK') {
                            floatDiv.show();
                            floatText.text('验证码错误 请重新输入');
                            subCon.one('click', function () {
                                postReply();
                            });
                            return false;
                        }
                        replyPostInfo(content);
                    }});
                }else {
                    replyPostInfo(content);
                }
            }
        }

        /* replyPostInfo方法,将用户输入内容传到后台*/
        function replyPostInfo(content) {
            var announceid = 1,
                code = $('#code').val(),
                allowReply = vars.allowReply,
                sign = vars.sign,
                masterId = vars.masterId,
                topic = vars.topic,
                bid = vars.bid,
                city = vars.city,
                sfappos = vars.sfappos,
                pagesize = 30;

            /* 这个pagesize是和产品商量后的值*/
            // 用户textarea输入的内容
            var inputCon = $('#replyContent').text();
            $.post(vars.bbsSite + '?c=bbs&a=ajaxQuoteReplay&city=' + city,
                {allowReply: allowReply,code: code,sign: sign,city: city,bid: bid,masterId: masterId,announceid: announceid,
                    topic: encodeURIComponent(topic),content: content,sfappos: sfappos,type: 'news'}, function (data) {
                if (data.ErrorType === '100') {
                    var url = vars.newsSite + vars.city+ '/'+ vars.channelid + '_'+vars.newsid + '.html#Comment';
                    window.location.href = url;
                }else if (data.Flag === 'login') {
                   /* var burl;
                    // 不知道干嘛的，定义，赋值之后没用到
                    if (vars.issfapp === 1) {
                        burl = vars.bbsSite + '?c=bbs&a=quanpostinfo&city=' + city + '&sign=' + sign + '&masterId=' + masterId + '&page=1&pageSize='
                            + pagesize + '&bottomFlag=1' + '&src=client';
                    }else {
                        burl = vars.bbsSite + '?c=bbs&a=postinfo&city=' + city + '&sign=' + sign + '&masterId=' + masterId + '&page=1&pageSize='
                            + pagesize + '&bottomFlag=1';
                    }*/
                    // 存储用户的输入内容到localStorage
                    localStorage.setItem('inputCon',inputCon);
                    window.location.href = vars.loginUrl;
                }else if (vars.isLogin === 1) {
                    // 判断登录但没认证手机用户
                    // 存储用户的输入内容到localStorage
                    localStorage.setItem('inputCon',inputCon);
                    // 跳转到验证手机页
                    window.location.href = vars.authUrl;
                } else {
                    // 未登录用户
                    // 存储用户的输入内容到localStorage
                    localStorage.setItem('inputCon',inputCon);
                    // 跳转到登录页
                    window.location.href = vars.loginUrl;
                }
            });
        }
        // 当输入框失去焦点时，需要露出页面的头部
        $('#replyContent').on('blur', function () {
            document.body.scrollTop = 0;
        });
        //限制字数
        function txtLimit(txt,text){
            txt.hasfocus||txt.focus();
            var range,node;
            if (window.getSelection && window.getSelection().getRangeAt) {
                txt.text('');
                range = window.getSelection().getRangeAt(0);
                range.collapse(false);
                node = range.createContextualFragment(text);
                var lc = node.lastChild;
                range.insertNode(node);
                if(lc){
                    range.setEndAfter(lc);
                    range.setStartAfter(lc)
                }
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
            else{
                txt.text(text);
            }
        }
        //字数显示
        $('.textarea').on('input', checkLength);
        function checkLength() {
            var reminder = $('#reminder');
            var txt = $('.textarea');
            var textInput = txt .text().trim();
            var textLength = textInput.length;
            if (textLength < 1) {
                reminder.html('已写0字/40字');
            } else if (textLength >1 && textLength <=40) {
                reminder.html('已写' + textLength + '字/40字');
            } else if (textLength >40 ) {
                txtLimit(txt, textInput.substr(0, 40));
                reminder.html('40字/40字');
            }
        }
    };
});