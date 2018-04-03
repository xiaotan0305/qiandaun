define('entry/index', [
    'modules/toast',
    'modules/pager'
], function (require) {
    // 模态框
    require('modules/toast');

    // 翻页
    $.fn.pagination = require('modules/pager');

    let listContent = $('.list-content');

    let page = 1;
    let key = '';
    let loading = false;

    /**
     * 获取地址栏参数
     * @param key 无参数返回json对象
     * @returns {*}
     */
    var getQuery = function (url, key) {
        url = url || location.href;
        var a = document.createElement('a');
        a.href = url;
        var search = a.search.replace('?','');
        var value = '';
        var json = {};
        if (search) {
            var arr = search.split('&');
            for (var i = 0, len = arr.length; i < len; i++) {
                var arr2 = arr[i].split('=');
                json[arr2[0]] = arr2[1] || '';
                if (arr2[0] === key) {
                    value = arr2[1];
                }
            }
        }
        return key && typeof key === 'string' ? decodeURIComponent(value) : json;
    };

    /**
     * 获取地址栏参数
     * @param json json对象
     * @returns {*}
     */
    var setQuery = function (json) {
        var arr = [];
        for (var name in json) {
            if (json.hasOwnProperty(name)) {
                var value = json[name];
                var str = '';
                if (typeof value === 'object') {
                    str = name + '=' + JSON.stringify(value);
                } else {
                    str = name + '=' + value;
                }
                arr.push(str);
            }
        }
        return arr.join('&');
    };
    // 加载数据
    function loadList(page, key, callback) {
        if (loading) {
            return false;
        }
        loading = true;
        $.ajax({
            url: vars.domainList,
            type: 'get',
            data: {page: page, keyword: key}
        }).
            done(function (res) {
                loading = false;
                if (res.code === '100') {
                    let data = res.data.list;
                    if (data.length) {
                        let listHTML = '';
                        data.forEach(function (ele) {
                            let filteredTag1 = filterTag(ele.label1, ele.id, 1);
                            let filteredTag2 = filterTag(ele.label2, ele.id, 2);
                            let mark = ele.mark || '';
                            listHTML
                                += `
                    <li class="list-item flex-parent" id="${ele.id}">
                        <a href="${ele.url}" target="_blank"><div class="item-indic img-content view" data-url="${ele.url}" style="background-image: url(${ele.url});"></div></a>
                        <div class="item-indic type flex-item">
                            <div class="type-item flex-parent">
                                <div>正常：</div>
                                <div class="flex-item">
                                <input name="zfimg-${ele.id}" id="teshu-${ele.id}-1" class="teshu teshu-${ele.id}-1" ${ele.label1 ? 'checked' : ''} style="vertical-align:middle;display: inline-block" type="radio"/>
                                <span style="vertical-align:middle;display: inline-block"><label for="teshu-${ele.id}-1">(以下情况均不存在时，选择此项)</label></span>
                                </div>
                            </div>
                            <div class="type-item flex-parent">
                                <div>轻度违规：</div>
                                <div class="flex-item">
                                <input name="zfimg-${ele.id}" id="teshu-${ele.id}-2" class="teshu teshu-${ele.id}-2" ${ele.label2 ? 'checked' : ''} style="vertical-align:middle;display: inline-block" type="radio"/>
                                <span style="vertical-align:middle;display: inline-block"><label for="teshu-${ele.id}-2">(竞品、logo水印等)</label></span>
                                </div>
                            </div>
                            <div class="type-item flex-parent">
                                <div>严重违规：</div>
                                <div class="flex-item">

                                    <input name="zfimg-${ele.id}" id="teshu-${ele.id}-3" class="teshu teshu-${ele.id}-3" ${ele.label3 ? 'checked' : ''} style="vertical-align:middle;display: inline-block" type="radio"/>
                                    <span style="vertical-align:middle;display: inline-block"><label for="teshu-${ele.id}-3">(二维码、微信等)</label></span>
                                </div>
                            </div>
                            <div class="flex-parent">
                                <div>备注：</div>
                                <textarea class="flex-item typeInput" rows="1" id="input${ele.id}">${mark}</textarea>
                            </div>

                        </div>
                        <div class="item-indic action">
                            <i class="btn btn-default update" data-id="${ele.id}">更新</i>
                        </div>
                    </li>
                        `;
                        });
                        list.html(listHTML);
                        listContent.fadeIn();
                        pagerInit(res.data.pagesData);
                        $.Toast('提示', `第${res.data.pagesData.currentPage}页加载完成`, 'info');
                        // let currentPage = res.data.pagesData.currentPage
                        $('#pageInput').val(res.data.pagesData.currentPage);
                        callback && callback();
                    } else {
                        listContent.fadeOut();
                        $.Toast('错误', '没有数据', 'error', {
                            timeout: 1500
                        });
                    }
                } else {
                    $.Toast('错误', res.msg, 'error');
                }
            }).
            fail(function (res) {
                $.Toast('错误', res.message || '数据请求失败', 'error');
            });
    }

    // 遍历标签
    function filterTag(data, id, index) {
        let tagHTML = '';
        let labelArr = JSON.parse(vars['label' + index + 'Config']);
        if (data && data.length) {
            data = data.split(',');
            labelArr.forEach(function (ele) {
                if (data.indexOf(ele.id + '') > -1) {
                    tagHTML
                        += `<span data-tagindex="${index}" data-id="${ele.id}" class="tag tag${id} active">${ele.name}</span>`;
                } else {
                    tagHTML += `<span data-tagindex="${index}" data-id="${ele.id}" class="tag tag${id}">${ele.name}</span>`;
                }
            });
        } else {
            labelArr.forEach(function (el) {
                tagHTML += `<span data-tagindex="${index}" data-id="${el.id}" class="tag tag${id}">${el.name}</span>`;
            });
        }
        return tagHTML;
    }

    let list = $('#list');
    // 点击标签
    list.on('click', '.tag', function () {
        const $this = $(this);
        $this.toggleClass('active');
        $this.parents('.list-item').removeClass('error');
    });

    list.on('click', '.teshu', function () {
        $(this).parents('.list-item').removeClass('error');
    });

    // 更新
    list.on('click', '.update', function () {
        // 当前项的id
        let id = $(this).data('id');
        // 用户输入的内容
        let input = $('#input' + id).val();
        // let tag = $('.tag' + id);
        // let tagArr = getTag(tag);

        // const label1 = tagArr.arr1.join(',');
        // const label2 = tagArr.arr2.join(',');
        // const wuyichang = $('.teshu-' + id)[0].checked;

        const label1 = $('.teshu-' + id+'-1')[0].checked;
        const label2 = $('.teshu-' + id+'-2')[0].checked;
        const label3 = $('.teshu-' + id+'-3')[0].checked;

        const thisItem = $('#' + id);
        thisItem.removeClass('error');
        if (!label1 && !label2 && !label3) {
            $.Toast('错误', '填写异常', 'error');
            thisItem.addClass('error');
            return false;
        }

        update({
            id: id,
            mark: input,
            label1: label1? '1' : '',
            label2: label2? '1' : '',
            label3: label3 ? '1' : ''
        });
    });

    // 获取选中标签
    function getTag(tag) {
        // 当前项的所有标签
        let tagArr1 = [],
            tagArr2 = [];
        tag.each(function (index, ele) {
            let $ele = $(ele);
            if ($ele.hasClass('active')) {
                let tagindex = $ele.data('tagindex');
                switch (tagindex) {
                    case 1:
                        tagArr1.push($ele.data('id'));
                        break;
                    case 2:
                        tagArr2.push($ele.data('id'));
                        break;

                    default:
                        break;
                }
            }
        });
        return {
            arr1: tagArr1,
            arr2: tagArr2
        };
    }

    // 更新数据
    // @data 要更新的数据组合成的对象
    //       包含[id],[备注]和[标签]
    function update(data) {
        $.ajax({
            url: vars.domainUpdate,
            type: 'post',
            data: data
        }).
            done(function (res) {
                if (res.code === '100') {
                    $.Toast('提示', res.msg, 'success');
                } else {
                    $.Toast('错误', res.msg, 'error');
                }
            });
    }

    // 更新全部
    let header = $('.header-fixed'),
        headerH = header.height();
    $('#updateAll').on('click', function () {
        let arr = [];
        let isError = false;
        $('.list-item').each(function (index, ele) {
            let $ele = $(ele);
            let id = ele.id;
            const label1 = $('.teshu-' + id+'-1')[0].checked;
            const label2 = $('.teshu-' + id+'-2')[0].checked;
            const label3 = $('.teshu-' + id+'-3')[0].checked;

            $ele.removeClass('error');
            if (!label1 && !label2 && !label3) {
                $ele.addClass('error');
                isError = true;
            }

            let obj = {
                id: ele.id,
                mark: $ele.find('.typeInput').val(),
                label1: label1 ? '1' : '',
                label2: label2 ? '1' : '',
                label3: label3 ? '1' : ''
            };
            arr.push(obj);
        });
        let arrStr = JSON.stringify(arr);
        if (isError) {
            $('html,body').animate({
                scrollTop: $('.list-item.error').eq(0).offset().top - headerH
            });
            return $.Toast('错误', '填写异常', 'error');
        }
        update({
            datas: arrStr
        });
    });

    // 搜索
    let inputTimer;
    $('#search').on('input', function () {
        clearTimeout(inputTimer);
        inputTimer = setTimeout(() => {
            key = $(this).val();
            loadList(page, key);
        }, 1000);
    });

    // 翻页初始化
    let isPagerInit = false;
    let totalItem, totalPage;

    function pagerInit(data) {
        if (isPagerInit) {
            return;
        }
        totalItem = data.count;
        totalPage = data.totalPage;
        $('#pager').pagination({
            items: data.count,
            itemsOnPage: data.pageNum,
            cssStyle: 'light-theme',
            onPageClick: function (num, ev) {
                if (ev === undefined) {
                    return;
                }
                page = num;
                loadList(page, key, function () {
                    setTimeout(() => {
                        $('html,body').animate({scrollTop: 0}, 300);
                    }, 0);
                });
            }
        });
        $('#pager').pagination('updateItems', totalItem);
        $('#pager').pagination('selectPage', page);
        isPagerInit = true;

        $('#pager-box').append(`
            <div class="quick-jump">
                <input id="pageInput" type="number" min="1" max="${totalPage}"/>
                <i class="jump-btn">跳</i>
            </div>
        `);
        $('.jump-btn').on('click', function () {
            let input = $('#pageInput').val();
            if (input > totalPage || input < 1) {
                return $.Toast('错误', '输入数字超过范围', 'error', {
                    timeout: 1500
                });
            }
            var json = getQuery();
            json.a = 'index';
            json.rand = Math.random();
            location.href = `${location.origin}${location.pathname}?${setQuery(json)}#page-${input}`;
            // setTimeout(() => {
            //     location.reload();
            // }, 20);
        });
    }

    // 悬浮显示大图
    let floatPic = $('<p id="pic" class="float-pic none"><img src=""></p>').appendTo('body');
    let winH = $(window).height();
    list.on('mouseenter', '.view', function (e) {
        let imgURL = $(this).data('url');
        let floatPicH = floatPic.outerHeight(),
            clientY = e.originalEvent.clientY;
        let top;
        if (floatPicH + clientY > winH - 20) {
            top = e.pageY - (floatPicH + clientY - winH) - 20;
        } else {
            top = e.pageY + 10;
        }
        floatPic.css({
            position: 'absolute',
            top: top + 'px',
            left: e.pageX + 20 + 'px'
        }).find('img').attr('src', imgURL);
    }).on('mousemove', '.view', function (e) {
        floatPic.show();
        let floatPicH = floatPic.outerHeight(),
            clientY = e.originalEvent.clientY;
        let top;
        if (floatPicH + clientY > winH - 20) {
            top = e.pageY - (floatPicH + clientY - winH) - 20;
        } else {
            top = e.pageY + 10;
        }
        floatPic.css({
            position: 'absolute',
            top: top + 'px',
            left: e.pageX + 20 + 'px'
        });
    }).on('mouseleave', '.view', function () {
        floatPic.hide();
    });

    $(window).on('scroll', function () {
        floatPic.hide();
    });

    // 初始化
    function init() {
        if (location.hash.indexOf('#page-') > -1) {
            page = location.hash.split('#page-')[1];
            loadList(page + '', key);
        } else {
            loadList(page, key);
        }
    }
    return init();
});