/**
 * Created by Young on 15-4-20.
 * modified by LXM on 15-9-17
 * modified by YuanHH on 15-11-26
 */
define('modules/jiaju/zxys', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $cclList = $('.jj-cclList');
        var sortlen = $cclList.length;
        var $main = $('.main');
        var typeArr = ['qz','dz','db','bz','tl','cl'];
        // 合计
        var $summary = $('.summary');
        // 底部全选
        var $flol = $('.flol');
        // 类型全选
        var $selt = $('.selt');
        // 单选项
        var $sela = $('.sela');
        // 初始化offset
        var offsetArr = [];
        refreshOffset();
        // 选择框点击事件
        $('.flol,.selt,.sela').on('click',function () {
            var $this = $(this);
            // 底部全选
            if ($this.hasClass('flol')) {
                if ($this.hasClass('active')) {
                    $sela.prop('checked',false);
                    $selt.removeClass('active');
                    $this.removeClass('active');
                } else {
                    $sela.prop('checked',true);
                    $selt.addClass('active');
                    $this.addClass('active');
                }
            } else if ($this.hasClass('selt')) {
                // 类型全选
                if ($this.hasClass('active')) {
                    $this.parents('.jj-cclList').find('.sela').prop('checked',false);
                    $this.removeClass('active');
                    $flol.removeClass('active');
                } else {
                    $this.parents('.jj-cclList').find('.sela').prop('checked',true);
                    $this.addClass('active');
                    $selt.not('.active').length || $flol.addClass('active');
                }
            // 单选项
            } else if ($this.hasClass('sela')) {
                var $selectA = $this.parents('.jj-cclList').find('.sela');
                var $selectType = $this.parents('.jj-cclList').find('.selt');
                if ($this.prop('checked')) {
                    $selectA.not(':checked').length || $selectType.addClass('active');
                    $selt.not('.active').length || $flol.addClass('active');
                } else {
                    $selectType.removeClass('active');
                    $flol.removeClass('active');
                }
            }
            refreshTotal();
        });

        // 编辑点击事件
        $('.edi').on('click',function () {
            $(this).parents('.jj-cclList').find('.del').toggle();
        });

        // 删除确认浮层
        var $alcontainer = $('.alcontainer');
        // 删除按钮点击事件
        $('.del').on('click',function () {
            $(this).addClass('deling');
            $alcontainer.show();
        });
        var size = -1;
        // 删除确认浮层点击事件
        $alcontainer.on('click','span',function () {
            var $this = $(this);
            var $deling = $('.deling');
            // 确认删除
            if ($this.hasClass('ok')) {
                var $deltype = $deling.parents('.jj-cclList');
                if ($deling.hasClass('sctdel') || $deltype.find('li').not(':hidden').length === 1) {
                // 删除整类
                    del($deltype,size);
                } else if ($deling.hasClass('lstdel')) {
                // 删除单个
                    del($deltype,$deling.parent().index());
                }
            }
            $deling.removeClass('deling');
            $alcontainer.hide();
            refreshTotal();
        });
        
        /*
         * 删除处理函数
         * @param $deltype 删除记录所属类型
         * @param index 删除索引，index = size 表示删除所有
         */
        function del($deltype,index) {
            // var type = $deltype.find('.tt-ico').data('type');
            var $selectType = $deltype.find('.selt');
            var $selectA = $deltype.find('.sela');
            var type = $deltype.find('.tt-ico').data('type');
            type = $.inArray(type, typeArr) + 1;
            if (index === size) {
                $deltype.hide();
                $selectType.addClass('active');
                $selectA.prop('checked',true).data('total',0);
                $.get(vars.Url + '?c=jiaju&a=delys&r=' + Math.random(),{
                    type: 'sec_' + type,
                    soufunid: vars.soufunid
                });
                sortlen--;
            } else {
                var $targetli = $deltype.find('li').eq(index);
                $targetli.hide().find('.sela').prop('checked',true).data('total',0);
                $.get(vars.Url + '?c=jiaju&a=delys&r=' + Math.random(),{
                    id: $targetli.data('id'),
                    soufunid: vars.soufunid
                });
                $selectA.not(':checked').length || $selectType.addClass('active');
            }
            // 判断是否有数据，没有显示默认提示
            if (sortlen) {
                $selt.not('.active').length || $flol.addClass('active');
            }else {
                $flol.removeClass('active');
                $main.css('height','80%').find('.jj-budgetDF').show();
            }
            refreshTotal();
            refreshOffset();
        }
        function toFixed2(num) {
            return /\./.test(num) ? num.toFixed(2) : num;
        }
        function refreshTotal() {
            var summary = 0;
            $sela.filter(':checked').each(function () {
                summary += +$(this).data('total');
            });
            $summary.text(toFixed2(summary));
        }
        
        function refreshOffset() {
            offsetArr = [];
            $cclList.each(function () {
                offsetArr.push($(this).offset().top);
            });
        }
        $(window).on('scroll',function () {
            var top = $(window).scrollTop();
            var index = 0 ;
            while (index < 6) {
                if (top <= offsetArr[index]) {
                    break;
                }
                index++;
            }
            if (index) {
                $main.css('padding-top','45px');
                $cclList.find('.tt').css({
                    position: 'static'
                }).end().eq(index - 1).find('.tt').css({
                    position: 'fixed',
                    width: '100%',
                    top: 0,
                    left: 0,
                    'z-index': 500,
                    'background-color': '#fff'
                });
            } else {
                $main.css('padding-top','0');
                $cclList.find('.tt').css({
                    position: 'static'
                });
            }
        });
    };
});
