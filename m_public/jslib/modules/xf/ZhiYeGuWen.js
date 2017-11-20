/**
 * Created by WeiRF on 2015/11/4.
 */
define('modules/xf/ZhiYeGuWen', ['jquery'],
    function (require, exports, module) {
        'use strict';
        var $ = require('jquery');
        function ZhiYeGuWen(domId) {
            this.documentId = domId;
            this.init();
        }
        ZhiYeGuWen.prototype = {
            init: function () {
                var that = this;
                var agentNames = '';
                var $document = $(that.documentId);
                $document.each(function () {
                    var agentName2 = $(this).attr('id');
                    if (agentName2.indexOf('置业顾问') >= 0) {
                        agentName2 = agentName2.replace(agentName2.substring(0, agentName2.indexOf('置业顾问') + 4), '');
                    }
                    if (agentNames.indexOf(agentName2) < 0) {
                        agentNames += agentName2 + '$';
                    }
                });
                var onlineUname = '';
                $.ajax({
                    url: '/chat.d?m=xfonline&username=' + encodeURIComponent(encodeURIComponent(agentNames)),
                    dataType: 'json',
                    async: true,
                    success: function (data) {
                        onlineUname = data.root.username;
                        if (onlineUname) {
                            $document.each(function () {
                                var agentName = $(this).attr('id');
                                if (agentName.indexOf('置业顾问') >= 0) {
                                    agentName = agentName.replace(agentName.substring(0, agentName.indexOf('置业顾问') + 4), '');
                                }
                                if (agentName) {
                                    var agentNamea = agentName.split('$');
                                    var agentNameaL = agentNamea.length;
                                    for (var a = 0; a < agentNameaL; a++) {
                                        if (onlineUname.indexOf(agentNamea[a]) >= 0) {
                                            $(this).show();
                                            break;
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        };
        module.exports = ZhiYeGuWen;
    });