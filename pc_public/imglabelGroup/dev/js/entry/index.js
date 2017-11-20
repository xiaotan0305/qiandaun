define('entry/index', [
    'modules/toast',
    'modules/pager'
], function (require) {

    const vars = window.vars;
    const loginDomain = vars.loginDomain;
    let uid = 1;

    require('modules/toast');

    // 翻页
    $.fn.pagination = require('modules/pager');

    console.log('hello login~');


    let listContent = $('.list-content');

    let page = 1;
    let key = '';
    let loading = false;
    let list = $('#list');

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
                data: { page: page, keyword: key },
            })
            .done(function (res) {
                loading = false;
                if (res.code === '100') {
                    let data = res.data.list;
                    uid = res.data.uid;
                    if (res.data.pagesData.count) {
                        let listHTML = '';
                        for (var id in data) {
                            if (data.hasOwnProperty(id)) {
                                var ele = data[id];
                                let items = getItems(ele, uid);
                                listHTML +=
                                        `

    <li class="list-item flex-parent" id="${id}">
        <a href="javascript:;">
            <div class="item-indic name">${id}</div>
        </a>
        <div class="type flex-item font0 img-select">
        ${items}
        </div>
        <div class="item-indic action">
            <i class="btn btn-default update" data-id="${id}">更新</i>
        </div>
    </li>
                                `

                            }
                        }
                        list.html(listHTML);
                        listContent.fadeIn();
                        pagerInit(res.data.pagesData);
                        $.Toast('提示', `第${res.data.pagesData.currentPage}页加载完成`, 'info');
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
            })
            .fail(function (res) {
                $.Toast('错误', res.message || '数据请求失败', 'error');
            });
    }

    // 获取单项
    function getItems(url, uid) {
        let picHTML = '';
        url.forEach( function (ele) {
            let starHTML = getMark(ele['score' + uid]);
            let isCover = ele['cover' + uid] ? 'on' : '';
            const why = ele['why' + uid];
            let imgURL = ele.url;
            if (imgURL.split('120x120').length === 2) {
                const urlArr = imgURL.split('120x120');
                imgURL = urlArr[0] + '480x480' + urlArr[1];
            }
            picHTML += `
            <div class="select-item" data-id="${ele.id}">
                <div class="item-indic img-content select-cover" data-url="${imgURL}"
                    style="background-image: url(${imgURL});"></div>
                <div style="border-top: 1px solid #eee;padding: 6px 0 5px;display: none;">
                    <div style="font-size: 14px;"><span style="vertical-align:middle;">是否封面：</span><i class="iconfont icon-check is-cover ${isCover}" style="vertical-align:middle;"></i></div>
                </div>
                <div style="border-top: 1px solid #eee;padding-top: 10px;margin-bottom: 5px;">
                    <div style="font-size: 14px;">评分：</div>
                    <div class="stars">
                        ${starHTML}
                    </div>
                </div>
                <div style="border-top: 1px solid #eee;padding-top: 10px;">
                    <div style="font-size: 14px;">理由：</div>
                    <textarea class="typeInput" rows="3" id="input1" placeholder="请输入评分理由" style="width: 100%;">${why}</textarea>
                </div>
            </div>`;
        });
        return picHTML;
    }

    // 计算星星
    function getMark(score) {
        const markText = ['','非常差','差','中','好','非常好'];
        var starHTML = '';
        for (var index = 1; index <= 5; index++) {
            let active = '';
            if (score * 1 === index) {
                active = 'mark-on';
            }
            if (score === '') {
                active = '';
            }
            starHTML += `<i data-mark="${index + 1}" class="mark ${active}">${markText[index]}</i>`;
        }
        return starHTML;
    }

    // 选中图片
    list.on('click', '.is-cover', function (ev) {
        let $this = $(this);
        $this.toggleClass('on');
    });


    // 更新
    list.on('click', '.update', function () {
        // 当前项的id
        let id = $(this).data('id');
        // 用户输入的内容
        update({
            [id]: getSingleData(id)
        });
    });

    // 获取单条数据填写情况
    function getSingleData(id) {
        let dataArr = [];
        let itemArr = $('#' + id).find('.select-item');
        itemArr.each((index, ele) => {
            let $ele = $(ele);
            dataArr.push({
                id: $ele.data('id'),
                houseid: id,
                // url: $ele.find('.select-cover').data('url'),
                cover: $ele.find('.is-cover').hasClass('on') ? 1 : 0,
                score: $ele.find('.stars').data('score'),
                why: $ele.find('.typeInput').val()
            });
        });
        return dataArr;
    }

    // 更新数据
    // @data 要更新的数据组合成的对象
    //       包含[id],[备注]和[标签]
    function update(data) {
        console.log(data);
        $.ajax({
                url: vars.domainUpdate,
                type: 'post',
                data: {
                    datas: JSON.stringify(data)
                }
            })
            .done(function (res) {
                if (res.code === '100') {
                    $.Toast('提示', res.msg, 'success');
                }else {
                    $.Toast('错误', res.msg, 'error');
                }
            });
    }

    // 更新全部
    $('#updateAll').on('click', function () {
        let obj = {};
        $('.list-item').each(function (index, ele) {
            let id = ele.id;
            obj[id] = getSingleData(id)
        });
        update(obj);
    });


    // 悬浮显示大图
    let floatPic = $('<p id="pic" class="float-pic none"><img src=""></p>').appendTo('body');
    let winH = $(window).height();
    let winW = $(window).width();
    list.on('mouseenter', '.select-cover', function (e) {
        let imgURL = $(this).data('url');
        let floatPicH = floatPic.outerHeight(),
            clientY = e.originalEvent.clientY;
        let top;
        if (floatPicH + clientY > winH - 20) {
            top = e.pageY - (floatPicH + clientY - winH) - 20;
        } else {
            top = e.pageY + 10 ;
        }
        floatPic.css({
            position: 'absolute',
            top: top + 'px',
            left: e.pageX + 20 + 'px'
        }).find('img').attr('src', imgURL);
    }).on('mousemove', '.select-cover', function (e) {
        floatPic.show();
        let floatPicH = floatPic.outerHeight(),
            clientX = e.originalEvent.clientX,
            clientY = e.originalEvent.clientY;
        let top;
        if (floatPicH + clientY > winH - 20) {
            top = e.pageY - (floatPicH + clientY - winH) - 20;
        }else {
            top = e.pageY + 10 ;
        }
        var left = e.pageX + 20 + 'px';
        var right = 'auto';
        if (clientX > (winW / 2)) {
            left = 'auto';
            right = winW - (e.pageX - 20) + 'px';
        }
        floatPic.css({
            position: 'absolute',
            top: top + 'px',
            left: left,
            right: right
        });
    }).on('mouseleave', '.select-cover', function () {
        floatPic.hide();
    });

    $(window).on('scroll', function () {
        floatPic.hide();
    });

    // 评价
    list.on('click', '.mark', function () {
        let $this = $(this);
        let index = $this.index();
        console.log(index);
        $this.addClass('mark-on').siblings().removeClass('mark-on');
        $this.parents('.stars').data('score', index + 1);
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