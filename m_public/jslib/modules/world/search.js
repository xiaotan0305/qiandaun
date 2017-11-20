/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/world/search', ['jquery', 'modules/world/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var subButton = $('#subButton');
        var lt = '_l' + vars.listType;
        
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwsearchpage';
        // 埋码变量数组
        var maiMaParams = {
            'vmg.page': pageId,
            'vmw.key': '',
            'vmw.country': '',
            'vmw.city': '',
            'vmw.district': '',
            'vmw.totalprice': '',
            'vmw.dwellingtype': ''
        };
        yhxw({type: 1, pageId: pageId, params: maiMaParams});
        
        subButton.data({
            price: {
                pricemin: 'max',
                pricemax: 'max'
            },
            path: 'allSel',
            purpose: 'allSel',
            condition: '',
            country: '',
            city: '',
            district: ''
        });

        var searchkw = function () {
            var a = $('#searchbox').val();
            if ($.trim(a) === '' || a === '\u697c\u76d8\u540d\u002f\u5730\u540d\u002f\u5f00\u53d1\u5546') {
                alert('\u8bf7\u8f93\u5165\u641c\u7d22\u6761\u4ef6');
                return false;
            }
            a = lt + '/?keyword=' + encodeURIComponent(a);
            window.location.href = vars.worldSite + 'list/' + a + '&r=' + Math.random();
        };
        var storeParam = function (b, f) {
            if (b === 'price') {
                var e = b + 'min', d = b + 'max', a = f.data(e), g = f.data(d);
                subButton.data('price', {
                    pricemin: a,
                    pricemax: g
                });
            } else {
                var c = f.data(b);
                subButton.data(b, c);
            }
        };
        var pushData = function (f, b) {
            if (b === null) {
                return false;
            }
            var e = f, a = [], d = document.createElement('option');
            // 物业类型
            if (b === 'purpose') {
                a.push('<option value="allSel" selected="selected" data-purpose=>\u4e0d\u9650</option>');
            }

            for (var c = 0; c < e.length; c++) {
                var g = d.cloneNode();
                if (e[c].hasOwnProperty('name')) {
                    g.textContent = e[c].name;
                    g.value = e[c].path;
                    g.setAttribute('data-path-key', c);
                    if (e[c].select !== undefined) {
                        g.selected = e[c].select;
                    }
                    if (e[c].districts !== undefined) {
                        g.setAttribute('data-child-path', JSON.stringify(e[c].districts));
                    } else {
                        g.setAttribute('data-child-path', 'allSel');
                    }
                    g.setAttribute('data-purpose', '');
                } else {
                    g.setAttribute('value', c);
                    g.textContent = e[c];
                }
                a.push(g);
            }
            $('#' + b).html(a);
        };
        // 国家物业类型ajax获取成功
        var onSuccess = function (result) {
            // 清空物业类型
            $('#purpose').empty();
            // 添加物业类型
            pushData(result, 'purpose');
        };
        var showOptions = function (h, e) {
            var i = h.childPath;
            var g = null;
            var district = $('#district');
            if (e === 'country') {
                district.empty();
                district.parent().parent().hide();
                g = 'city';
                // 选择国家，类型重置
                var encountry = h.encountry;
                $.ajax({
                    url: vars.worldSite + '?c=world&a=ajaxGetSearchPurpose',
                    type: 'get',
                    dataType: 'json',
                    data: {enCountry: encountry},
                    success: onSuccess
                });
                subButton.data('purpose', 'allSel');
            } else if (e === 'city') {
                g = 'district';
            }

            var dynamicId = $('#' + g);
            if (i !== 'allSel') {
                pushData(i, g);
                dynamicId.parent().parent().show();
            } else {
                dynamicId.empty();
                dynamicId.parent().parent().hide();
            }
        };

        function getCondition(b, d) {
            var c = $(d).toArray(), a = $(c[0]).attr('data-path-key');
            var e = subButton.data('country'), ec = subButton.data('city'), ecd = subButton.data('district');

            switch (b) {
                case 'country':
                    e = a;
                    if (a === '0') {
                        e = '';
                    }
                    ec = ecd = '';
                    break;
                case 'city':
                    ec = '-' + a;
                    if (a === '0') {
                        ec = '';
                    }
                    ecd = '';
                    break;
                case 'district':
                    ecd = '-' + a;
                    if (a === '0') {
                        ecd = '';
                    }
                    break;
            }
            subButton.data('country', e);
            subButton.data('city', ec);
            subButton.data('district', ecd);
            subButton.data('condition', e + ec + ecd);
        }

        var selectDom = function (g) {
            var e = ['country', 'city', 'district'];
            var f = g || window.event;
            var d = f.target.options[f.target.selectedIndex], c = f.target.name;
            if ($.inArray(c, e) > -1) {
                var a = $(d).data();
                subButton.data('path', d.value);
                getCondition(c, d);
                showOptions(a, c);
            } else if (c === 'purpose') {
                subButton.data('purpose', d.value);
            } else {
                storeParam(c, $(d));
            }
        };
        subButton.click(function () {
            var h = $(this), c = h.data(), f = $('#searchbox').val();
            // keyword关键词
            if (f === '' || f === '\u697c\u76d8\u540d\u002f\u5730\u540d\u002f\u5f00\u53d1\u5546') {
                f = '';
            } else {
                // 埋码 keyword关键词
                maiMaParams['vmw.key'] = encodeURIComponent(f);
                f = '/?keyword=' + encodeURIComponent(f);
            }
            var a = c.path === 'allSel' ? '' : '_a' + c.condition;
            var n = c.price.pricemin === 'max' ? '' : '_n' + c.price.pricemin;
            var x = c.price.pricemax === 'max' ? '' : '_x' + c.price.pricemax;
            var u = c.purpose === 'allSel' ? '' : '_u' + c.purpose;
            
            // 埋码 国家
            maiMaParams['vmw.country'] = encodeURIComponent($('#country').find(':selected').attr('name'));
            // 埋码 城市
            var  encity = $('#city').val();
            maiMaParams['vmw.city'] = encodeURIComponent($('#city').find('option[value=' + encity + ']').html()) || '';
            // 埋码 地区
            var endistrict = $('#district').val();
            maiMaParams['vmw.district'] = encodeURIComponent($('#district').find('option[value=' + endistrict + ']').html()) || '';
            // 埋码 价格
            var price = $('#price').find(':selected');
            var pricemin = price.attr('data-pricemin') === 'max' ? '0' : price.attr('data-pricemin');
            var pricemax = price.attr('data-pricemax') === 'max' ? '99999' : price.attr('data-pricemax');
            //maiMaParams['vmw.totalprice'] = price.html().replace(/[^\d-]+/g, '');
            maiMaParams['vmw.totalprice'] = pricemin + '-' + pricemax;
            // 埋码 类型
            maiMaParams['vmw.dwellingtype'] = encodeURIComponent($('#purpose').find(':selected').html());
            // 添加用户行为分析-埋码
            yhxw({type: 1, pageId: pageId, params: maiMaParams});
            //console.log(maiMaParams);
            window.location.href = vars.worldSite + 'list/' + lt + a + u + n + x + f;
        });
        $('.qx').click(function () {
            var nameIsq = $('input[name=q]');
            nameIsq.val('');
            nameIsq.focus();
        });
        var headSearUl = $('.headSearUl');
        $('#searchbox').keyup(function () {
            var currentvalue = $('#searchbox').val();
            var str1 = '';
            if (currentvalue !== '') {
                $.ajax({
                    url: '?c=world&a=ajaxGetSearchTip&city=bj&q=' + encodeURIComponent(currentvalue) + '&r=' + Math.random(),
                    success: function (moredata) {
                        if (moredata !== '') {
                            var obj = $.parseJSON(moredata);
                            if (obj.length <= 0) {
                                headSearUl.hide();
                            } else {
                                for (var i = 0; i < obj.length; i++) {
                                    var kw = obj[i].replace(/<\/?[^>]*>/g, '');
                                    str1 += '<li data-search="' + kw + '"><a href="javascript:;">' + obj[i] + '</a></li>';
                                }
                                headSearUl.show();
                                headSearUl.html(str1);
                            }
                        }
                    }
                });
            } else {
                var storage = window.localStorage;
                var hs = storage.getItem('world_hisSearch');
                if (hs !== null) {
                    var arrHs = hs.split(',');
                    for (var i = 0; i < arrHs.length; i++) {
                        str1 += '<li data-search="' + arrHs[i] + '">' + arrHs[i] + '</li>';
                    }
                    headSearUl.show();
                    headSearUl.html(str1);
                } else {
                    headSearUl.hide();
                }
            }
        });

        function search(a) {
            if (a === '\u8bf7\u8f93\u5165\u60a8\u7684\u95ee\u9898' || a === '') {
                alert('\u8bf7\u8f93\u5165\u60a8\u8981\u67e5\u8be2\u7684\u5185\u5bb9');
                return false;
            }
            var paramsStr = lt + '/?keyword=' + encodeURIComponent(a);
            
            // keyword
            maiMaParams['vmw.key'] = encodeURIComponent(a);
            // 添加用户行为分析-埋码
            yhxw({type: 1, pageId: pageId, params: maiMaParams});
            
            window.location = vars.worldSite + 'list/' + paramsStr + '&r=' + Math.random();
        }
        headSearUl.delegate('li[data-search]', 'click', function () {
            var a = $(this).data('search');
            search(a);
        });
        $(document).delegate('select', 'change', selectDom);
        $('#searchkw').click(searchkw);
    };
});