/**
 * Created by hanxiao on 2017/12/5.
 */
define('modules/bask/newdetail', ['jquery', 'loadMore/1.0.2/loadMore', 'photoswipe/4.0.7/photoswipe','photoswipe/4.0.7/photoswipe-ui-default.min', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var zan = $('.askzan');
        // 立即回答按钮
        var answerNow_btn = $('#answerNow_btn');
        var $main = $('.main');
        zan.on('click', function () {
            var $this = $(this);
            var dataId = $this.attr('data-answerid');
            // 获取回答用户的id
            var answerUserId = $this.attr('data-auserid');
            var zanc = $this.attr('data-ding');
            // 不能对自己的回答进行点赞或点踩
            if (answerUserId === vars.userid) {
                return false;
            } else {
                var url = vars.askSite +  '?c=ask&a=ajaxZan&userid=' + vars.userid + '&answerid='+ dataId + '&askid=' + vars.id + '&answer_user_id';
                $.get(url, function (dataCopy) {
                    if (dataCopy) {
                        if (dataCopy.Code === '100') {
                            var str = $this.html().replace(/<\/i>(.*)/, '</i>' + (dataCopy.Ding));
                            $this.html(str);
                            $this.find('i').html(dataCopy.ErrMsg);
                            if (dataCopy.ErrMsg === '点赞成功') {
                                $this.addClass('cur');
                            } else if (dataCopy.ErrMsg === '取消点赞成功'){
                                $this.removeClass('cur');
                            }
                        } else if (dataCopy.Code === '106') {
                            $this.find('i').html('您已经赞过');
                            $this.addClass('cur');
                        }
                    }
                });
            }
        });

        // 上拉加载更多
        var url = vars.askSite + '?c=bask&a=ajaxGetMoreAnswers&id=' + vars.id;
        var loadMore = require('loadMore/1.0.2/loadMore');
        loadMore({
            url: url,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.loadingask',
            loadPromptID: '.loadingask',
            contentID: '#qlist',
            loadAgoTxt: '加载更多',
            loadingTxt: '<i></i>加载中',
            loadedTxt: '',
            loadedShow: '#noMore',
            firstDragFlag: false
        });

        // 点击提问图片，图片放大功能
        var askImg = $('.spiclist');
        askImg.on('click', 'img', function () {
            var url = $(this).attr('original');
            var imgStrs = askImg.find('img');
            var slides = [];
            // 点击缩放大图浏览
            if (imgStrs.length > 0) {
                getUrl(imgStrs,0,slides,url);
            }
        });
        var thisIndex = 0;
        function getUrl(obj,index,arr,url){
            var ele = obj[index];
            var src = $(ele).attr('original');
            var img = new Image();
            img.src = src;
            if(url === src){
                thisIndex = index;
            }
            img.addEventListener('load',function(){
                index += 1;
                arr.push({src: src, w: img.naturalWidth, h: img.naturalHeight});
                if (index < obj.length) {
                    getUrl(obj,index,arr,url);
                } else {
                    var pswpElement = $('.pswp')[0];
                    var options = {
                        history: false,
                        focus: false,
                        index: thisIndex,
                        escKey: true
                    };
                    var gallery = new window.PhotoSwipe(pswpElement, window.PhotoSwipeUI_Default, arr, options);
                    gallery.init();
                }
            },false);
        }

        // 立即回答功能
        var answerBox = $('#answerBox');
        // 显示回答弹层
        answerNow_btn.on('click', function(){
            answerBox.removeClass('fadeInRight2');
            answerBox.addClass('fadeInRight');
        });
        // 关闭回答弹层
        $('#closeAnsBox').on('click', function(){
            answerBox.removeClass('fadeInRight');
            answerBox.addClass('fadeInRight2');
        });

        var textarea = $('.inptext');
        var title = $('#title');
        var card = $('#cardflag');
        textarea.on('focus', function () {
            title.fadeOut(1000);
        });

        textarea.on('blur', function () {
            title.fadeIn(1000);
        });

        // 插入名片
        card.on('click', function(){
            if (textarea.val().trim().length < 100) {
                showMsg('回答字数超过100个字，才能插入名片哦~');
                return false;
            }
            if ($(this).hasClass('cur')) {
                $(this).removeClass('cur');
            } else {
                $(this).addClass('cur');
            }
        });

        var cardflag = 0;
        var flagBool = true;
        $('#submit').on('click', function(){
            // 如果已经提交过了当再次点击时直接退出 不再进行ajax请求
            if (!flagBool) {
                return false;
            }
            if (textarea.val() === '' || textarea.val() === '请输入您的回答') {
                showMsg('请输入您的回答');
                return false;
            }

            // 内容中不许包含手机号
            var myreg=/[1][2,3,4,5,7,8][0-9]{9}/g;
            if (textarea.val().match(myreg)) {
                showMsg('请不要在回答中留手机号哦~');
                return false;
            }

            if (textarea.val().trim().length > 500) {
                showMsg('最多输入500个字');
                return false;
            }

            cardflag = card.hasClass('cur') ? 1 : 0;
            // 将用户提问的相关数据提交到后台处理
            $.ajax({
                type : 'POST',
                url : vars.askSite + '?c=bask&a=ajaxAnswerNow',
                data : {
                    id : vars.id,
                    content : textarea.val(),
                    cardflag : cardflag
                },
                success : function(data) {
                    if (data.code === '100') {
                        // 提交成功加锁
                        flagBool = false;
                        showMsg('回答成功');
                        window.location.href = vars.askSite + '?c=bask&a=newdetail&id=' + vars.id + '&r=' + Math.random();
                    } else {
                        showMsg(data.message);
                    }
                },
                error : function(){
                    showMsg('回答失败请重试');
                }
            });
        });

        // 评论功能开始
        var showCommentBox = $('.showCommentBox');
        // 评论弹层
        var commentBox = $('#commentBox');
        // 评论/回复人
        var titleCom = $('#titleCom');
        // 关闭弹层按钮
        var closeComBox = $('#closeComBox');
        // 提交评论/回复按钮
        var submitComment = $('#submitComment');
        // 整个答案列表的容器
        var qlist = $('#qlist');
        // 显示评论弹层
        showCommentBox.on('click', function(){
            titleCom.text('请输入评论：');
            $('#commentTxt').val('');
            submitComment.attr('data-id', $(this).attr('data-answerid'));
            submitComment.attr('data-type', 'comment');
            submitComment.attr('data-key', $(this).attr('data-key'));
            commentBox.removeClass('fadeInRight2');
            commentBox.addClass('fadeInRight');
        });
        // 关闭评论弹层
        closeComBox.on('click', function(){
            commentBox.removeClass('fadeInRight');
            commentBox.addClass('fadeInRight2');
        });

        //事件委托触发回复事件
        qlist.on('click', '.replyBtn' , function(){
            $('#commentTxt').val('');
            var that = $(this);
            titleCom.text('回复' + that.attr('data-name') +'：');
            submitComment.attr('data-id', that.attr('data-comid'));
            submitComment.attr('data-type', 'reply');
            submitComment.attr('data-name', that.attr('data-name'));
            submitComment.attr('data-key', that.parent().parent().attr('data-key'));
            commentBox.removeClass('fadeInRight2');
            commentBox.addClass('fadeInRight');
        });

        // 提交评论/回复
        submitComment.on('click', function(){
            var that = $(this);
            var str = '';
            var answerid = '';
            var commentid = '';
            var type = that.attr('data-type');
            var content = $('#commentTxt').val().trim();
            if (type === 'comment') {
                answerid = that.attr('data-id');
                str = '评论';
            } else if (type === 'reply') {
                commentid = that.attr('data-id');
                str = '回复';
            }
            if (content === '') {
                showMsg('请输入' + str + '内容~');
                return false;
            }

            var key = $(this).attr('data-key');
            var inHtml = '';

            $.ajax({
                type : 'GET',
                url : vars.askSite + '?c=bask&a=ajaxSubmitComment',
                data : {
                    answerid : answerid,
                    commnetid : commentid,
                    askid : vars.id,
                    content : content,
                },
                success : function(data) {
                    if (data.code === '100') {
                        showMsg(str + '成功');
                        var ul = qlist.find('.' + key);
                        if (type === 'comment') {
                            inHtml = '<li class="newli"><i>' + vars.username + '：</i><a href="javascript:void(0);" data-name="' + vars.username + '" class="replyBtn" data-comid="' + data.commentid + '"><span> ' + content + '</span></a><em>刚刚</em></li>';
                        } else if (type === 'reply') {
                            inHtml = '<li class="newli"><i>' + vars.username + '：回复 ' + that.attr('data-name') + '：</i><a href="javascript:void(0);" data-name="' + vars.username + '" class="replyBtn" data-comid="' + data.commentid + '"><span> ' + content + '</span></a><em>刚刚</em></li>';
                        }
                        // 原本没有评论的情况,要展示隐藏的评论容器
                        if (ul.attr('data-have') === 'no') {
                            ul.find('.lod').before(inHtml);
                            ul.parent().show();
                            ul.attr('data-have', 'have');
                        } else {
                            // 有评论的情况
                            ul.find('.lod').before(inHtml);
                        }
                        var count = parseInt(ul.find('.showMoreCom').attr('data-total'));
                        ul.find('.showMoreCom').attr('data-total', count + 1);
                        commentBox.removeClass('fadeInRight');
                        commentBox.addClass('fadeInRight2');
                    } else if (data.code != '') {
                        showMsg(data.message);
                    } else {
                        showMsg('网络不好，请重试~');
                    }
                },
            });
        });

        // 获取更多评论
        var answerId = '';
        var page = 0;
        var totalPage = 0;
        var total = 0;
        $main.on('click', '.showMoreCom', function(){
            var that = $(this);
            answerId  = that.attr('data-answerid');
            page = parseInt(that.attr('data-page'));
            totalPage = parseInt(Math.ceil(that.attr('data-total') / 5));

            if (page > totalPage) {
                return false;
            }

            that.addClass('on');
            that.text('加载中...');

            $.ajax({
                type : 'GET',
                url : vars.askSite + '?c=bask&a=ajaxGetCommentList',
                data : {
                    answerid : answerId,
                    page : page,
                },
                success : function(data) {
                    that.parent().before(data);
                    that.removeClass('on');
                    page++;
                    that.attr('data-page', page);
                    total = that.attr('data-total') - 5 * (page - 1);
                    if (total <= 0) {
                        that.text('');
                        that.parent().parent().find('.newli').remove();
                    } else {
                        that.text('更多' + total + '条评论');
                    }
                },
            });
        });

        /**
         * 输入文本长度检验 6-150
         */
        var $this, thisLen;
        var $wordsTip = $('#wordsTip');
        textarea.on('input',function(){
            $this = $(this);
            thisLen = $this.val().trim().length;
            if (thisLen && thisLen <= 500) {
                $wordsTip.text(thisLen);
                $wordsTip.removeClass('err');
            } else {
                $wordsTip.text(thisLen);
                $wordsTip.addClass('err');
            }
        });

        // 提示弹层
        function showMsg(msg){
            $('#floatTip').text(msg);
            $('#floatTip').show();
            setTimeout(function(){
                $('#floatTip').hide();
            }, 1500);
        }
    };
});