/**
 * Created by Young on 15-4-20.
 */
define('modules/jiaju/zxysOff', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var localStorage = vars.localStorage;
        
        //  section dom
        var sectionStr = '<section class="jj-cclList">'
            +                '<div class="tt">'
            +                    '<a class="del sctdel" style="display:none">删除</a>'
            +                    '<span class="flor f14 edi" style="display: block">编辑</span>'
            +                    '<span class="sele selt"></span>'
            +                    '<span class="tt-ico ph-type" data-type="ph-type">ph-name</span>'
            +                '</div>'
            +                '<ul></ul>'
            +            '</section>';
        // list dom
        var listStr = '<li>'
            +             '<a class="del lstdel" style="display:none">删除</a>'
            +             '<label class="sele"><input type="checkbox" class="sela" data-total="ph-total"></label>'
            +             '<div class="con">'
            +                 '<time class="flor f12">ph-time</time>'
            +                 '<p>数量：ph-num</p>'
            +                 '<p>总价：ph-total元</p>'
            +             '</div>'
            +         '</li>';
        
        var storageHead = 'jiaju_jsq_';
        var typeArr = ['qz','dz','db','bz','tl','cl'];
        var data = {
            qz: {
                name: '墙砖',
                unit: '块'
            },
            dz: {
                name: '地砖',
                unit: '块'
            },
            db: {
                name: '地板',
                unit: '块'
            },
            bz: {
                name: '壁纸',
                unit: '卷'
            },
            tl: {
                name: '涂料',
                unit: '升'
            },
            cl: {
                name: '窗帘',
                unit: '米'
            }
        };
        var offsetArr = [];
        // 用于对不同种计算器结果排序
        var sortData = [];
        var size = 5;
        var $cclList;
        // 获取ls数据
        (function () {
            for (var i = 0;i < 6;i++) {
                // 生成storageType用于获取ls
                var storageType = storageHead + typeArr[i];
                var info = data[typeArr[i]];
                var ls = JSON.parse(localStorage.getItem(storageType)) || [];
                var len = ls.length;
                if (len) {
                    // data.ls存储ls数据
                    info.ls = ls;
                    // 把最新一条放在排序数组中，用于对不同计算器结果排序
                    sortData.push(ls[len - 1]);
                }
            }
        })();
        // 排序
        sortData.sort(function (a,b) {
            return a.time <= b.time ? -1 : 1;
        });
        // 类型数量
        var sortlen = sortData.length;
        var $main = $('.main');
        // 渲染预算清单
        (function () {
            for (var i = sortlen - 1;i >= 0;i--) {
                var type = typeArr[+sortData[i].type - 1];
                // 渲染section，替换对应数据
                var section = sectionStr.replace(/ph-type/g,type).replace('ph-name',data[type].name);
                var $section = $(section);
                var ls = data[type].ls;
                var $ul = $section.find('ul');
                for (var j = ls.length - 1;j >= 0;j--) {
                    var record = ls[j];
                    // 渲染list 替换对应数据
                    var list = listStr.replace('ph-time',record.time.replace(' ','</br>')).replace('ph-num',record.num + data[type].unit).replace(/ph-total/g,record.tmoney);
                    var $list = $(list);
                    $ul.append($list);
                }
                $main.append($section);
            }
            $cclList = $('.jj-cclList');
            // 没有预算清单 显示默认提示
            if (sortlen) {
                refreshOffset();
            } else {
                $main.css('height','80%').find('.jj-budgetDF').show();
            }
        })();
        // 合计
        var $summary = $('.summary');
        // 底部全选
        var $flol = $('.flol');
        // 类型全选
        var $selt = $('.selt');
        // 单选项
        var $sela = $('.sela');
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
        // 默认全选选中
        sortlen && $flol.trigger('click');
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
        });
        
        /*
         * 删除处理函数
         * @param $deltype 删除记录所属类型
         * @param index 删除索引，index = size 表示删除所有
         */
        function del($deltype,index) {
            var type = $deltype.find('.tt-ico').data('type');
            var $selectType = $deltype.find('.selt');
            var $selectA = $deltype.find('.sela');
            if (index === size) {
                $deltype.hide();
                $selectType.addClass('active');
                $selectA.prop('checked',true).data('total',0);
                localStorage.removeItem(storageHead + type);
                sortlen--;
            } else {
                $deltype.find('li').eq(index).hide().find('.sela').prop('checked',true).data('total',0);
                var indexShow = index - $deltype.find('li').eq(index).prevAll(':hidden').length;
                data[type].ls.splice(indexShow,1);
                localStorage.setItem(storageHead + type,JSON.stringify(data[type].ls));
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