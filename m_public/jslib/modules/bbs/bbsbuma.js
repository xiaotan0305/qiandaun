/**
 * 用户行为统计类
 * Created on 16-2-19.
 * @author gaoyinxu@fang.com
 */
define('modules/bbs/bbsbuma', [], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var ubList = [];
    var ubCollect;
    module.exports = function (options) {
        if (ubCollect) {
            ubCollect(options);
        } else {
            ubList.push(options);
        }
    };
    require.async(['jsub/_ubm.js'], function () {
        ubCollect = function (options) {
            // 页面标志默认为论坛首页
            var pageId = options.pageId || 'mbbshomepage';
            // 浏览位置默认为我的论坛
            var location = options.location || '';
            // 用户动作类型默认为浏览
            var type = options.type || 0;
            // 获取当前频道，默认频道为论坛
            var curChannel = options.curChannel || 'bbs';
            // 论坛用户资料页id
            var interestuserid = options.interestuserid || '';
            // 论坛用户自己的id
            var userid = options.userid || '';
            // 如果vars中不存在所需要的参数值则接收需要得参数数组
            var paramArr = options.params || [];
            // 引入另一个js文件
            require.async('jsub/_vb.js?c=' + pageId);
            // 城市名称（中文)
            _ub.city = vars.cityname;
            // 新房“n”，二手房‘e’，租房‘z’，家居‘h’，知识‘k’，资讯‘i’，小区网‘x’；查房价‘v’;海外网‘w’；个人中心‘g’；论坛‘b’；问答‘a’
            _ub.biz = 'b';
            // 业务--jsub/_ubm.js',-WAP端(网通为0，电信为1，如无法获取方位则记录为0）
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // 方位（南北方) ，北方为0，南方为1
            // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25,在线咨询24、分享22、收藏21）
            var b = type;
            // 论坛id
            var forumid = options.forumid;
            // 论坛sign
            var forumsign = options.forumsign;
            // 论坛名字
            var forumname = options.forumname;
            // 帖子名字
            var posttitle = options.posttitle;
            // 帖子id
            var postid = options.postid;
            // 回复标识id
            var replyid = options.replyid;
            // 关键词
            var key = options.key;
            var pTemp;
            if (vars.action === 'index') {
                pTemp = {
                    // 页面id
                    'vmg.page': pageId,
                    // 浏览位置
                    'vmb.showlocation': encodeURIComponent(location || '')
                };
            } else if (vars.action === 'bbsPostList') {
                if (type === 1) {
                    if (pageId === 'mbbspostlist') {
                        pTemp = {
                            // 所属页面（每个页面都有唯一标识)
                            'vmg.page': pageId,
                            // 论坛id{论坛id^城市}
                            'vmb.forumid': forumid + '^' + encodeURIComponent(vars.cityname || ''),
                            // 论坛名{论坛名}
                            'vmb.forumname': encodeURIComponent(forumname)
                        };
                    }else {
                        pTemp = {
                            // 所属页面（每个页面都有唯一标识)
                            'vmg.page': pageId,
                            // 论坛id{论坛id^城市}
                            'vmb.forumid': forumid + '^' + encodeURIComponent(vars.cityname || '')
                        };
                    }
                } else if (type === 21) {
                    pTemp = {
                        // 所属页面（每个页面都有唯一标识)
                        'vmg.page': pageId,
                        // 论坛id{论坛id^城市}
                        'vmb.forumid': forumid + '^' + encodeURIComponent(vars.cityname || '')
                    };
                }
            } else if (vars.action === 'postinfo') {
                if (type === 0) {
                    pTemp = {
                        // 所属页面（每个页面都有唯一标识）
                        'vmg.page': pageId,
                        // 帖子标题
                        'vmb.posttitle': encodeURIComponent(posttitle || ''),
                        // 帖子id
                        'vmb.postid': postid + '^' + forumid + '^' + encodeURIComponent(vars.cityname || '')
                    };
                } else if (type === 18) {
                    pTemp = {
                        // 回复标识
                        'vmb.postreply': replyid + '^' + postid + '^' + forumid + '^' + encodeURIComponent(vars.cityname || '')
                    };
                }
            } else if (vars.action === 'post') {
                if (pageId === 'mbbswritepost') {
                    if (type === 0) {
                        pTemp = {
                            // 所属页面（每个页面都有唯一标识）
                            'vmg.page': pageId
                        };
                    } else if (type === 53) {
                        pTemp = {
                            // 所属页面（每个页面都有唯一标识）
                            'vmg.page': pageId,
                            // 帖子标题
                            'vmb.posttitle': posttitle,
                            // 帖子id
                            'vmb.postid': postid + '^' + forumid + '^' + encodeURIComponent(vars.cityname || '')
                        };
                    }
                } else if (pageId === 'mbbsreplypost') {
                    if (type === 0) {
                        pTemp = {
                            // 所属页面（每个页面都有唯一标识）
                            'vmg.page': pageId
                        };
                    } else if (type === 18) {
                        pTemp = {
                            // 所属页面（每个页面都有唯一标识）
                            'vmg.page': pageId,
                            // 论坛id
                            'vmb.forumid': forumid + '^' + encodeURIComponent(vars.cityname || ''),
                            // 帖子标题
                            'vmb.posttitle': posttitle,
                            // 帖子id
                            'vmb.postid': postid + '^' + forumid + '^' + encodeURIComponent(vars.cityname || '')
                        };
                    }
                } else if (pageId === 'mbbsreplycomment') {
                    if (type === 0) {
                        pTemp = {
                            // 所属页面（每个页面都有唯一标识）
                            'vmg.page': pageId,
                            // 回复标识
                            'vmb.postreply': replyid + '^' + postid + '^' + forumid + '^' + encodeURIComponent(vars.cityname || '')
                        };
                    } else if (type === 108) {
                        pTemp = {
                            // 所属页面（每个页面都有唯一标识）
                            'vmg.page': pageId,
                            // 论坛id
                            'vmb.forumid': forumid + '^' + encodeURIComponent(vars.cityname || ''),
                            // 帖子id
                            'vmb.postid': postid + '^' + forumid + '^' + encodeURIComponent(vars.cityname || ''),
                            // 回复标识
                            'vmb.postreply': replyid + '^' + postid + '^' + forumid + '^' + encodeURIComponent(vars.cityname || '')
                        };
                    }
                }
            } else if (vars.action === 'mybbslist') {
                if (pageId === 'mbbsspace') {
                    if (type === 0) {
                        pTemp = {
                            // 所属页面
                            'vmg.page': pageId,
                            // 用户id（感兴趣的）
                            'vmb.interestuserid': encodeURIComponent(interestuserid || ''),
                            // 浏览位置
                            'vmb.showlocation': encodeURIComponent(location || '')
                        };
                    } else if (type === 21) {
                        pTemp = {
                            // 所属页面
                            'vmg.page': pageId,
                            // 用户id（感兴趣的）
                            'vmb.interestuserid': encodeURIComponent(interestuserid || '')
                        };
                    }
                }else {
                    pTemp = {
                        // 所属页面
                        'vmg.page': pageId,
                        // 用户id（感兴趣的）
                        'vmb.userid': encodeURIComponent(interestuserid || ''),
                        // 浏览位置
                        'vmb.showlocation': encodeURIComponent(location || '')
                    };
                }
            } else if (vars.action === 'bbsboxdetail') {
                pTemp = {
                    // 所属页面
                    'vmg.page': pageId,
                    // 用户id（感兴趣的）
                    'vmb.interestuserid': encodeURIComponent(interestuserid || '')
                };
            } else if (vars.action === 'bbsboxlist' || vars.action === 'draft') {
                pTemp = {
                    // 所属页面
                    'vmg.page': pageId,
                    // 用户id（感兴趣的）
                    'vmb.userid': encodeURIComponent(userid || '')
                };
            } else if (vars.action === 'search') {
                pTemp = {
                    // 所属页面
                    'vmg.page': pageId,
                    // 用户id（感兴趣的）
                    'vmb.key': encodeURIComponent(key || '')
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
            // 示例 _ub.collect(1,{'vmn.projectid':'1105210251'});
            _ub.collect(b, p);
            // 收集方法
        };
        while (ubList.length) {
            ubCollect(ubList.shift());
        }
    });
});