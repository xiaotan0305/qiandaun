/**
 * Created by WeiRF on 2016/1/13.
 * 根据不同的入口将电话号码分配成不同的影子号码
 */
define('modules/xf/shadowCall', ['jquery','util/util'],
    function (require,exports, module) {
        'use strict';
        var $ = require('jquery');
        var cookiefile = require('util/util');
        var source = cookiefile.getCookie('sf_source');
        var s = cookiefile.getCookie('s');

        // 根据不同的cookie替换为不同的电话号码
        var options = {
            xiaomibrowser: '400-890-8506',
            qqbrowser: '400-890-8505',
            baiduwz: '400-890-8508',
            oppo: '400-890-8507',
            '360browser': '400-890-8514',
            ucbrowser: '400-890-8517',
            bd_vivo: '400-890-8520',
            meizu: '400-890-8521',
            oupengbrowser: '400-890-8523',
            txmf: '400-890-8524',
            sougouwise: '400-890-8529',
            sougou: '400-890-8530'
        };
        var zygwoptions = {
            xiaomibrowser: '4008908506',
            qqbrowser: '4008908505',
            baiduwz: '4008908508',
            oppo: '4008908507',
            '360browser': '4008908514',
            ucbrowser: '4008908517',
            bd_vivo: '4008908520',
            meizu: '4008908521',
            oupengbrowser: '4008908523',
            txmf: '4008908524',
            sougouwise: '4008908529',
            sougou: '4008908530'
        };
        // 电话替换规则
        var regex = /:([\d-]+)/;
        var zygwregex = /([\d-]+)[转%E8%BD%AC]/;
        function shadowcall() {
            var optionsRep = '';
            if (source && options[source]) {
                optionsRep = source;
            } else if (s && options[s]) {
                optionsRep = s;
            }
            if ((source && options[source]) || (s && options[s])) {
                // 每一个需要改的都换掉
                $('a[data-call="call"]').each(function () {
                    var hrefOld = $(this).attr('href');
                    if (hrefOld.split(',')[1] && hrefOld.split(',')[1].length == 5 ) {
                        var hrefNew = hrefOld.replace(hrefOld.match(regex)[1],options[optionsRep]);
                        $(this).attr('href',hrefNew);
                    }
                });
                $('p[data-call="call"]').each(function () {
                    var stringOld = $(this).html();
                    if (hrefOld.split(',')[1] && stringOld.split(',')[1].length == 5 ) {
                        var stringNew = stringOld.replace(stringOld.match(zygwregex)[1],zygwoptions[optionsRep]);
                        $(this).html(stringNew);
                    }
                });
            }
        }
        module.exports = shadowcall;
    });