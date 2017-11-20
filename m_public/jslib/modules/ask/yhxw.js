/**
 * 用户行为统计类
 * Created by sf on 16-02-19.
 * @author chenhongyan@fang.com
 */
define('modules/ask/yhxw', [], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var ubList = [];
    var ubCollect;
    module.exports = function (options) {
        if (ubCollect) {
            ;
            ubCollect(options);
        } else {
            ubList.push(options);
        }
    };

    require.async(['jsub/_ubm.js'], function () {
        ubCollect = function (options) {
            // 页面标志默认为问答首页
            var pageId = options.pageId || 'malist';
            // 用户动作类型默认为浏览
            var type = options.type || 0;
            // 获取当前频道，默认频道为问答
            var curChannel = options.curChannel || 'ask';
            // 如果vars中不存在所需要的参数值则接收需要得参数数组
            var paramArr = options.params || [];
            // 引入另一个js文件
            require.async('jsub/_vb.js?c=' + pageId);
            // 城市名称（中文)
            _ub.city = vars.cityname;
            // 新房“n”，二手房‘e’，租房‘z’，家居‘h’，知识‘k’，资讯‘i’，小区网‘x’；查房价‘v’;海外网‘w’；个人中心‘g’；论坛‘b’；问答‘a’
            _ub.biz = 'a';
            // WAP端(网通为0，电信为1，如无法获取方位则记录为0）方位（南北方) ，北方为0，南方为1
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // 用户动作（浏览0、搜索1、关注21、赞55、踩56、回答93、提问94）
            var b = type;

            var pTemp;
            if (vars.action === 'index') {
                // 问答首页
                if (vars.firstClass && !vars.secondClass) {
                    askcategory = encodeURIComponent(vars.firstClass);
                } else if (vars.firstClass && vars.secondClass) {
                    askcategory = encodeURIComponent(vars.firstClass) + '^' + encodeURIComponent(vars.secondClass);
                }
                if (vars.order === undefined) {
                    vars.order = '智能排序';
                }
                var quizorQA;
                if (vars.showtype === '2') {
                    quizorQA = '显示答案';
                } else {
                    quizorQA = '只看问题';
                }
                pTemp = {
                    // 页面标识(所属页面)
                    'vmg.page': pageId,
                    // 搜索关键词
                    'vma.key': encodeURIComponent(vars.keyword),
                    //问答分类
                    'vma.askcategory': askcategory,
                    //排序
                    'vma.order': encodeURIComponent(vars.order),
                    //只看问题
                    'vma.quizorQA': encodeURIComponent(quizorQA)
                };
            } else if (vars.action === 'seoIndex') {
                // 热词榜页（聚合词首页）
                pTemp = {
                    // 页面标识(所属页面)
                    'vmg.page': pageId
                };
            } else if (vars.action === 'seoList') {
                // 问答精品聚合列表页
                // 聚合问答分类
                var askjuhecategory;
                if (vars.firstjuhecategory) {
                    askjuhecategory = encodeURIComponent(vars.firstjuhecategory);
                }
                if (vars.firstjuhecategory && vars.secondjuhecategory) {
                    askjuhecategory = askjuhecategory + '^' + encodeURIComponent(vars.secondjuhecategory);
                } else if (!vars.firstjuhecategory && vars.secondjuhecategory) {
                    askjuhecategory = encodeURIComponent(vars.secondjuhecategory);
                }

                // 只看问题
                var quizorQA;
                if (vars.showtype === '1') {
                    quizorQA = '显示答案';
                } else {
                    quizorQA = '只看问题';
                }
                pTemp = {
                    // 页面标识(所属页面)
                    'vmg.page': pageId,
                    // 搜索关键词
                    'vma.key': encodeURIComponent(vars.keyword),
                    //问答聚合分类
                    'vma.askjuhecategory': askjuhecategory,
                    //只看问题
                    'vma.quizorQA': encodeURIComponent(quizorQA)
                };
            } else if (vars.action === 'search-more') {
                // 搜索结果页
                pTemp = {
                    // 页面标识(所属页面)
                    'vmg.page': pageId,
                    // 搜索关键词
                    'vma.key': encodeURIComponent(vars.asktitle)
                };
            } else if (vars.action === 'newAsk') {
                // 最新问题列表页/高悬赏问题列表页
                pTemp = {
                    // 页面标识(所属页面)
                    'vmg.page': pageId
                };
            } else if (vars.action === 'askDailyDetail') {
                // 问答专题页
                pTemp = {
                    // 页面标识(所属页面)
                    'vmg.page': pageId,
                    // 专题id
                    'vma.specialid': vars.specialid,
                    // 搜索关键词
                    'vma.key': encodeURIComponent(vars.keyword)
                };
            } else if (vars.action === 'askDailyList') {
                // 问答日报页
                pTemp = {
                    // 页面标识(所属页面)
                    'vmg.page': pageId
                };
            } else if (vars.action === 'detail') {
                // 问答详情页
                var askcategory;
                if (vars.firstClassName && !vars.className) {
                    askcategory = encodeURIComponent(vars.firstClassName);
                } else if (!vars.firstClassName && vars.className) {
                    askcategory = encodeURIComponent(vars.className);
                } else if (vars.firstClassName && vars.className) {
                    askcategory = encodeURIComponent(vars.firstClassName) + '^' + encodeURIComponent(vars.className);
                }
                switch (type) {
                    case 0:
                        pTemp = {
                            // 页面标识(所属页面)
                            'vmg.page': pageId,
                            // 问题积分
                            'vma.jifen': vars.jifen,
                            // 搜索关键词
                            'vma.key': encodeURIComponent(vars.keyword),
                            // 问答所属分类
                            'vma.askcategory': askcategory,
                            // 问答id
                            'vma.askid': vars.ask_id,
                            // 问题标题
                            'vma.asktitle': encodeURIComponent(vars.askTitle)
                        };
                        break;
                    case 21:
                        pTemp = {
                            // 页面标识(所属页面)
                            'vmg.page': pageId,
                            // 问答id
                            'vma.askid': vars.ask_id
                        };
                        break;
                    case 55:
                    case 56:
                        pTemp = {
                            // 页面标识(所属页面)
                            'vmg.page': pageId,
                            // 问答id
                            'vma.askid': vars.ask_id,
                            // 答案id
                            'vma.answerid': options.answerId
                        };
                        break;
                }
            } else if (vars.action === 'asktaglist') {
                // 标签列表页
                pTemp = {
                    // 页面标识(所属页面)
                    'vmg.page': pageId,
                    // 问答标签
                    'vma.asklabel': encodeURIComponent(vars.tags),
                    // 搜索关键词
                    'vma.key': encodeURIComponent(vars.keyword)
                };
            } else if (vars.action === 'answerRightNow') {
                // 回答页
                switch (type) {
                    case 0:
                        pTemp = {
                            // 页面标识(所属页面)
                            'vmg.page': pageId,
                            // 问答id
                            'vma.askid': vars.ask_id
                        };
                        break;
                    case 93:
                        pTemp = {
                            // 页面标识(所属页面)
                            'vmg.page': pageId,
                            // 问答id
                            'vma.askid': vars.ask_id
                        };
                        break;
                }
            } else if (vars.action === 'postAsk') {
                // 提问页
                switch (type) {
                    case 0:
                        pTemp = {
                            // 页面标识(所属页面)
                            'vmg.page': pageId
                        };
                        break;
                    case 94:
                        // 页面标识(所属页面)
                        pTemp = {
                            'vmg.page': pageId,
                            // 问题id
                            'vma.askid': options.askid,
                            // 悬赏积分数
                            'vma.jifen': options.jifen,
                            // 问题标题
                            'vma.asktitle': encodeURIComponent(options.asktitle)
                        };
                        break;
                }
            } else if (vars.action === 'myAsk') {
                // 问答用户个人中心页
                pTemp = {
                    // 所属页面
                    'vmg.page': pageId,
                    // 用户名
                    'vma.username': encodeURIComponent(vars.username),
                    // 用户id
                    'vma.userid': vars.userid,
                    // 问答获得积分
                    'vma.getjifen': vars.getjifen,
                    // 提问数
                    'vma.asknum': vars.asknum,
                    // 回答数
                    'vma.answernum': vars.answernum,
                    // 关注数
                    'vma.follownum': vars.follownum
                };
            } else if (vars.action === 'hisAsk') {
                // 问答用户页面
                pTemp = {
                    // 所属页面
                    'vmg.page': pageId,
                    // 用户id
                    'vma.interestuserid': vars.userid
                };
            }
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp.hasOwnProperty(temp)) {
                    if (pTemp[temp] !== null && '' !== pTemp[temp] && undefined !== pTemp[temp] && 'undefined' !== pTemp[temp]) {
                        p[temp] = pTemp[temp];
                    }
                }
            }
            // 收集方法 _ub.collect(1,{'编号':'记录值'});
            //示例 _ub.collect(1,{'vma.key':'家居装修'});
            _ub.collect(b, p);
            // 收集方法
        };

        while (ubList.length) {
            ubCollect(ubList.shift());
        }
    });
});