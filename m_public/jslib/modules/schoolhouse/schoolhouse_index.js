define('modules/schoolhouse/schoolhouse_index', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // var oSort = document.getElementById('sort');
        var aBtn = document.getElementsByTagName('i');
        // 对商圈实现点击显示
        $('#showcomarea').on('click', function () {
            var oDD = this.parentNode;
            if (oDD.style.maxHeight !== 'inherit') {
                oDD.style.maxHeight = 'inherit';
                this.className = 'up';
            } else {
                oDD.style.maxHeight = '28px';
                this.className = 'dn';
            }
            return false;
        });
        // 对关键字处理
        $('.btn').on('click', function () {
            location.href = vars.schoolhouseSite + '?c=schoolhouse&a=index&city=' + vars.city + '&keyword=' + $('#findkeyword').val();
        });

        var tempFunc = function (i) {
            aBtn[i].onclick = function () {
                var oDD = this.parentNode;
                var oDL = oDD.parentNode;

                if (oDD.tagName !== 'DD' && oDL.tagName !== 'DL') {
                    return false;
                }

                if (oDD.offsetHeight < oDD.scrollHeight) {
                    oDL.className = 'active';
                    this.className = 'up';
                } else {
                    oDL.className = '';
                    this.className = 'dn';
                }
            };
        };
        for (var i = 0; i < aBtn.length; i++) {
            tempFunc(i);
        }
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
        require.async('modules/schoolhouse/loadmore', function (run) {
            run({
                a: 'esf',
                url: vars.schoolhouseSite + '?c=schoolhouse&a=ajaxGetInfo&city=' + vars.city + '&feature='
                + $('#feature_get').val() + '&type=' + $('#type_get').val() + '&keyword=' + $('#keyword_get').val()
                + '&district=' + $('#district_get').val() + '&comarea=' + $('#comarea_get').val()
            });
        });
    };
});