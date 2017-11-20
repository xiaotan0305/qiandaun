define('modules/tongji/index', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // 数据列表容器数组
        var $datalist = $('.datalist .numval'),
        // 权限
            $leftSpan = $('.left span');

        /**
         * @date 2015-10-27
         * 全国权限时，城市列表的相关操作
         */
        if (vars.bigAreaName === '全国级') {
            // 权限标签 只有全国权限时有下拉城市列表
            var $selectBtn = $('.selectBtn'),
            // 城市列表
                $selectListB = $('.selectListB');

            /* 显示与隐藏城市列表 */
            $selectBtn.click(function () {
                if ($selectBtn.hasClass('selectBtnUp')) {
                    $selectBtn.removeClass('selectBtnUp');
                    $selectListB.hide();
                } else {
                    $selectBtn.addClass('selectBtnUp');
                    $selectListB.show();
                }
            });

            /* 选取某一城市，改变当前selectBtn容器中的值 */
            $selectListB.on('click', 'li', function () {
                var $this = $(this);
                $('.selectListB li').removeClass('on');
                $this.addClass('on');
                $selectBtn.text($this.html());
                if ($selectBtn.hasClass('selectBtnUp')) {
                    $selectBtn.removeClass('selectBtnUp');
                }
                $selectListB.hide();

                /* 选中城市后，执行ajax */
                getData();
            });

            /**
             * 绑定鼠标按下事件，用来监听所有弹出层点击其他位置后隐藏的操作
             */
            $(document).on('touchstart mousedown', function (e) {
                var target = $(e.target);
                var parent = target.closest('ul');
                if (parent.length <= 0 && !target.hasClass('selectBtn') || parent.length > 0 && parent.attr('id') === 'tabBtn') {
                    if ($selectBtn.hasClass('selectBtnUp')) {
                        $selectBtn.removeClass('selectBtnUp');
                    }
                    $selectListB.hide();
                }
            });
        }
        $('#tabBtn').on('click', 'li', function () {
            var $this = $(this);
            if ($this.hasClass('on')) {
                return;
            }
            $this.siblings().removeClass('on');
            $this.addClass('on');
            $('#tabBtn').attr('data-value', $this.index().toString());
            getData();
        });
        getData();

        function getData() {
            var url = vars.tongjiSite + '?c=tongji&a=ajaxGetIndexData&city='
                + vars.city + '&verifyCode=' + vars.verifyCode + '&agentid='
                + vars.agentId + '&flag=' + $('#tabBtn').attr('data-value');
            if (vars.bigAreaName === '全国级' || vars.bigAreaName === '城市级') {
                url += '&SearchCity=' + encodeURI($leftSpan.html());
            } else {
                url += '&SearchCity=' + encodeURI(vars.searchCity);
            }
            url += '&BigAreaID=' + vars.bigAreaId;
            // 区域权限id
            url += '&AreaID=' + vars.areaId;
            // 组权限参数id
            url += '&DeptID=' + vars.StoreID;
            console.log(url);
            $.get(url, function (data) {
                if (isArray(data)) {
                    var l = data.length;
                    for (var i = 0; i < l; i++) {
                        $datalist.eq(i).html(format(data[i].Count));
                    }
                } else {
                    $('.datalist').html('<div style="text-align: center;padding: 1rem 0;">暂无数据</div>');
                }
            });
        }

        function format(num) {
            num = parseInt(num);
            return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        }

        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }

        var $moveUrl = vars.tongjiSite + '?c=tongji&a=appStatisticschart&city='
            + vars.city + '&verifyCode=' + vars.verifyCode + '&agentid='
            + vars.agentId + '&SearchCity=' + $leftSpan.html() + '&chartType=histogram&src=client';
        $('.datalist').on('click', '.num', function () {
            var $this = $(this);
            if ($this.data('type')) {
                window.location.href = $moveUrl + '&flag=' + $this.data('type');
            }
        });
    };
});
