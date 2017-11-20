define('modules/bbs/draft', ['jquery', 'modules/bbs/bbsbuma'], function (require, exports, modules) {
    'use strict';
    modules.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 用户行为对象
        var bbsbuma = require('modules/bbs/bbsbuma');
        //草稿箱浏览布码
        bbsbuma({type: 0, pageId: 'mbbsdraftbox', userid: vars.username });
        // 编辑/完成按钮
        var editBtn = $('.bbs-comp');
        // 如果是隐私模式，退出
        if (!vars.localStorage) {
            return;
        }
        var main = $('.main');
        var draft = localStorage.getItem('trashPostList');

        /**
         * 格式化日期（不含时间）
         */
        function timeStamp2String(time) {
            // 最终显示的时间
            var result;
            var Ndatetime = new Date();
            // 当前的时间
            var Nyear = Ndatetime.getFullYear();
            var Ndate = Ndatetime.getDate() < 10 ? '0' + Ndatetime.getDate() : Ndatetime.getDate();

            // 创建的时间
            var Cdatetime = new Date(time);

            var Cyear = Cdatetime.getFullYear();
            var Cmonth = Cdatetime.getMonth() + 1 < 10 ? '0' + (Cdatetime.getMonth() + 1) : Cdatetime.getMonth() + 1;
            var Cdate = Cdatetime.getDate() < 10 ? '0' + Cdatetime.getDate() : Cdatetime.getDate();
            var Chour = Cdatetime.getHours() < 10 ? '0' + Cdatetime.getHours() : Cdatetime.getHours();
            var Cminute = Cdatetime.getMinutes() < 10 ? '0' + Cdatetime.getMinutes() : Cdatetime.getMinutes();
            // 两个时间的时间差
            var diffTime = Ndatetime.getTime() - time;
            // 时间逻辑开始
            if (Nyear !== Cyear) {
                result = Cyear + '- ' + Cmonth + '- ' + Cdate;
                // 时间非同年，显示年-月-日
            }
            if (diffTime < 60 * 1000) {
                // 时间差小于60秒，显示n秒前
                result = '1分钟前';
            } else if (diffTime < 3600 * 1000) {
                // 时间差小于1小时，显示n分钟前
                result = Math.floor(diffTime / (1000 * 60)) + '分钟前';
            } else if (diffTime < 1000 * 60 * 60 * 24 && Ndate === Cdate) {
                // 时间为同一天，显示创建时间的小时:分钟
                result = Chour + ':' + Cminute;
            } else if (Nyear === Cyear) {
                // 时间非同一天但同一年，显示创建的时间的月-日
                result = Cmonth + '-' + Cdate;
            }
            return result;
        }

        /**
         * 没有草稿
         */
        function noDraft() {
            // 没有草稿
            main.html('<div class="center bbs-default"><img src='
                + vars.imgUrl + 'images/jj-order-default.png width="137"><p>(ToT)~~还没有草稿记录呦</p></div>');
        }
        var draftArr;
        if (draft) {
            editBtn.html('编辑');
            var draftContent = ['<section id="myDraft" class="pdX8 bbs-usInfo"><ul>'];
            // 将字符串转换为数组
            draftArr = draft.split('@@@');
            // 获取数组长度
            var draftArrL = draftArr.length,
                stringL,topic,url,draftObj;
            for (var i = 0; i < draftArrL; i++) {
                // 将json转换为对象
                draftObj = JSON.parse(draftArr[i]);
                // 标题
                topic = '';
                if (draftObj.topic.trim().replace(/\s/g, '&nbsp;')) {
                    // 标题长度
                    stringL = draftObj.topic.length;
                    // 标题是否需要隐藏多余字符
                    topic = stringL > 16 ? draftObj.topic.substring(0, 16) + '...' : draftObj.topic;
                } else {
                    topic = '【标题未编辑】';
                }
                url = vars.bbsSite + '?c=bbs&a=post&city=' + draftObj.city + '&sign=' + draftObj.sign + '&trashid=' + i + '&signname=' + draftObj.signname;
                draftContent.push('<li><div data-time="' + draftObj.time + '" class="del"></div><a href="' + url + '">',
                    '<div class="bb pdY8"><h4>' + topic + '</h4><p><time>' + timeStamp2String(draftObj.time) + '</time>',
                    '<span class="from">' + draftObj.signname + '</span></p></div></a></li>');
            }
            draftContent.push('</ul></section>');
            main.append(draftContent.join(''));
            // 给删除按钮添加事件
            main.on('click', '.del', function () {
                var ele = $(this);
                ele.parent().remove();
                var time = $(this).attr('data-time');
                // 对比移除
                $.each(draftArr, function (index, ele) {
                    if (ele && JSON.parse(ele).time.toString() === time) {
                        draftArr.splice(index, 1);
                    }
                });
                // 如果没有草稿
                if ($('.del').length === 0) {
                    noDraft();
                    editBtn.html('');
                    vars.localStorage.removeItem('trashPostList');
                } else {
                    vars.localStorage.setItem('trashPostList', draftArr.join('@@@'));
                }
            });
            // 给编辑／完成按钮添加事件
            editBtn.on('click', function () {
                if (editBtn.html()) {
                    if (editBtn.html() === '编辑') {
                        editBtn.html('完成');
                    } else {
                        editBtn.html('编辑');
                    }
                    $('.del').toggle();
                }
            });
        } else {
            noDraft();
        }
    };
});


