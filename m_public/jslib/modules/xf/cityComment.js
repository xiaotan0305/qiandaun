define('modules/xf/cityComment',
    ['jquery','util/util','iscroll/2.0.0/iscroll-lite','photoswipe/4.0.7/photoswipe','photoswipe/4.0.7/photoswipe-ui-default.min'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var cookiefile = require('util/util');
        var vars = seajs.data.vars;
        var sfut = cookiefile.getCookie('sfut');
        var ajaxcount = {zx: 1,jh: 1};
        var maxPage = 8;
        // 点击单条进入该楼盘点评列表
        $('.bline-f4').on('click','li',function () {
            var newcode = $(this).attr('data-name');
            var href = '/xf/' + vars.paramcity + '/' + newcode + '/dianping.htm';
            location.href = href;
        });
        $('#moreJH').on('click',function () {
            loadAjax('jh');
        });
        $('#moreZX').on('click',function () {
            loadAjax('zx');
        });
        // 控制星星亮------------start
        function icoStar() {
            $('.ico-star4').each(function () {
                var curStars = $(this).attr('star');
                for (var i = 0;i < curStars; i++) {
                    $(this).parent().find('i').eq(i).attr('class','active');
                    if (curStars.indexOf('.5') !== -1) {
                        $(this).find('i').eq(curStars - 0.5).attr('class','active half');
                    }
                }
            });
        }
        icoStar();
        var mphone;
        var judgeClick = true;
        var int = '';
        function loadAjax(str) {
            var moreId = '#' + (str === 'zx' ? 'moreZX' : 'moreJH');
            if (judgeClick) {
                judgeClick = false;
                if (int) {
                    clearInterval(int);
                    int = '';
                }
                var divId = '#' + (str === 'zx' ? 'ZXComment' : 'JHComment');
                $(divId + ' li').show();
                if (ajaxcount[str] > maxPage) {
                    $(moreId).hide();
                }
                $.post('/xf.d?m=cityComment',
                    {
                        city: vars.paramcity,
                        page: ajaxcount[str],
                        type: str
                    },
                    function (data) {
                        if (data) {
                            ajaxcount[str]++;
                            $(divId).find('ul').append(data);
                            icoStar();
                            judgeClick = true;
                        }
                    });
            } else {
                $(moreId).html('正在加载中···');
                int = setInterval(function () {
                    if (judgeClick) {
                        $(moreId).html('查看更多评价');
                        loadAjax(str);
                    }
                },500);
            }
        }
        $('#ckeckLogin').on('click',function () {
            ckeckLogin();
        });
        function ckeckLogin() {
            var userid = '';
            var username = '';
            var mobilephone = '';
            var photourl = '';
            if (sfut) {
                $.get('/user.d?m=getUserinfoBySfut',function (data) {
                    if (data) {
                        var returnResult = data.root.return_result;
                        if (returnResult === '100') {
                            photourl = data.root.photourl;
                            mobilephone = data.root.mobilephone;
                            username = data.root.username;
                            userid = data.root.userid;
                            var ismobilevalid = data.root.ismobilevalid;
                            if (!username) {
                                $('#username').html('&nbsp;');
                            } else {
                                $('#username').html(username);
                            }
                            $('#userphoto').html('<img src="' + photourl + '" width="50" height="50px">');
                            if (ismobilevalid === '1') {
                                mphone = mobilephone.substr(3,4);
                                mobilephone = mobilephone.replace(mphone,'****');
                                $('#phone').html(mobilephone);
                            }else {
                                alert('依据《互联网用户账号名称管理规定》，2015年9月1日起未绑定手机号的用户将禁止发布内容，请您尽快完成认证');
                                window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=//m.fang.com/xf/' + vars.paramcity + '/interfaceComment.html';
                            }
                        }
                        if (userid && mobilephone) {
                            window.location.href = '/xf/' + vars.paramcity + '/interfaceComment.html';
                            return;
                        } else if (!userid) {
                            alert('请登录后点评！');
                            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=//m.fang.com/xf/' + vars.paramcity + '/interfaceComment.html';
                            return;
                        } else if (!mobilephone) {
                            alert('依据《互联网用户账号名称管理规定》，2015年9月1日起未绑定手机号的用户将禁止发布内容，请您尽快完成认证');
                            window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=//m.fang.com/xf/' + vars.paramcity + '/interfaceComment.html';
                            return;
                        }
                    }
                });
            }else {
                // 去登陆
                window.location.href = 'https://m.fang.com/passport/login.aspx?burl=//m.fang.com/xf/' + vars.paramcity + '/interfaceComment.html';
            }
        }
    });