define('modules/esf/subway_index',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var preload = [];
        preload.push('lazyload/1.9.1/lazyload','loadMore/1.0.0/loadMore');
        require.async(preload);
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        $('#showMoreHint').click(function () {
            $('#showMoreHint').hide();
            $('#showMore').show();
            $('#showSortHint').show();
        });
        $('#showSortHint').click(function () {
            $('#showMore').hide();
            $('#showSortHint').hide();
            $('#showMoreHint').show();
        });
        var aBtn = document.getElementsByTagName('i');
        function handler(index) {
            aBtn[index].onclick = function () {
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
        }

        for (var i = 0; i < aBtn.length; i++) {
            handler(i);
        }
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });

        require.async('modules/esf/loadmore', function (run) {
            run({a: 'esf', url: vars.esfsubwaylistSite + '?c=esfsubwaylist&a=ajaxGetInfo&city=' + vars.city + '&linename=' + $('#linename').val()
            + '&station=' + $('#station').val() + '&distance=' + $('#distance').val() + '&purpose=' + $('#purpose').val() + '&area=' + $('#area').val()
            + '&price=' + $('#priceget').val() + '&room=' + $('#room').val() + '&orderby=' + $('#orderby').val() + '&propertysubtype='
            + $('#propertysubtype').val()});
        });
    };
});