define('modules/ask/detail-searchbar',['jquery'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // options = {id,default}
        var dom = $('div.searchBox'),
            form = dom.children('form'),
            keyword = form.find('input#keyword'),
            searchBList = dom.find('div.searchBList'),
            searchBorder = searchBList.find('div.searchBorder>ul'),
            sClose = searchBList.find('div.SClose>span');
        var storage = window.localStorage,hs,kw;
        function checkForm() {
            hs = storage.getItem('hisSearch');
            kw = keyword.val();
            if (kw === '\u8bf7\u8f93\u5165\u60a8\u7684\u95ee\u9898' || kw === '') {
                alert('\u8bf7\u8f93\u5165\u60a8\u8981\u67e5\u8be2\u7684\u95ee\u9898');
                return false;
            }
            // 本地存储搜索历史，按时间倒排，取最新10条
            var flag = 0;
            if (hs) {
                var arrHs;
                var strHs;
                if (hs.indexOf(kw) < 0) {
                    hs = kw + ',' + hs;
                    arrHs = hs.split(',');
                    if (arrHs.length > 10) {
                        arrHs = arrHs.slice(0,10);
                    }
                    strHs = arrHs.join(',');
                    storage.setItem('hisSearch',strHs);
                }else {
                    arrHs = hs.split(',');
                    for (var i = 0; i < arrHs.length; i++) {
                        if (arrHs[i] === kw) {
                            flag = 1;
                            arrHs.splice(i,1);
                        }
                    }
                    if (arrHs.length > 10) {
                        arrHs = arrHs.slice(0,10);
                    }
                    strHs = arrHs.join(',');
                    if (flag) {
                        strHs = kw + ',' +  strHs;
                        storage.setItem('hisSearch',strHs);
                    }
                }
            }else {
                storage.setItem('hisSearch',kw);
            }
            return true;
        }

// 搜索提示层
        function search(kw) {
            hs = storage.getItem('hisSearch');
            if (kw === '\u8bf7\u8f93\u5165\u60a8\u7684\u95ee\u9898' || kw === '') {
                alert('\u8bf7\u8f93\u5165\u60a8\u8981\u67e5\u8be2\u7684\u95ee\u9898');
                return false;
            }
            keyword.val(kw);
            form.submit();
        }
        function changeThisTxt() {
            search(this.innerText);
        }
        function showList(htm) {
            var domTip = $(htm).bind('click',changeThisTxt);
            searchBorder.empty().append(domTip);
            searchBList.show();
        }
        keyword.keyup(function () {
            var currentvalue = keyword.val();
            var htm = '';
            if (currentvalue !== '') {
                $.ajax({url: vars.askSite + '?c=ask&a=ajaxGetSearchTip&q=' + encodeURIComponent(currentvalue)
                + '&r=' + Math.random(),success: function (moredata) {
                    if (moredata) {
                        var obj = moredata;
                        if (obj.length <= 0) {
                            searchBList.hide();
                        }else {
                            for (var i = 0; i < obj.length ; i++) {
                                var kw1 = obj[i].replace(/<\/?[^>]*>/g,'');
                                htm += '<li>' + kw1 + '</li>';
                            }
                            showList(htm);
                        }
                    }
                }});
            }else {
                // 取用本地存储
                var storage = window.localStorage;
                var hs = storage.getItem('hisSearch');
                if (hs) {
                    var arrHs = hs.split(',');
                    for (var i = 0; i < arrHs.length ; i++) {
                        htm += '<li>' + arrHs[i] + '</li>';
                    }
                    showList(htm);
                }
            }
        });
        sClose.click(function () {
            searchBList.hide();
        });
        form.bind('submit',checkForm);
    };
});