//  JavaScript Document
(function ($) {
    // 弹幕构造函数
    function Danmu(obj) {
        // 弹幕配置
        obj = obj || {};
        // 元素
        this.elem = obj.elem || null;
        // 清空
        this.clears = {
            indexs: [],
            timer: []
        };
        // 起始
        this.index = obj.index || 0;
        // 起始
        this.newIndex = obj.newIndex || 0;
        // 速度
        this.time = obj.time || 10;
        // 位移距离
        this.displacement = obj.displacement || $(window).width();
        // 弹幕数组
        this.data = obj.data || [];
        // 弹幕间距
        this.spacing = obj.spacing || $(window).width() / 3;
        // 视差
        this.parallax = obj.parallax || 10;
        // 默认开启
        this.isOpen = true;
        // 速度
        this.speedArr = [10, 8, 12, 9, 11];
        // 背景颜色
        this.bgColorArr = ['#5dd4e2', '#f98081', '#5dd4e2', '#f98081', '#5dd4e2'];
    }

    // 将弹幕存入数组
    Danmu.prototype.addBarrage = function (data) {
        this.newIndex = this.newIndex + 1;
        // this.data.splice(this.newIndex, 0, data);
        this.data.push(data);
    };

    // 为每个弹幕盒子分配一条消息
    function assignMessage($target, data) {
        var name = data.name;
        var aUrl = data.url || 'javascript:;';
        var span = document.createElement('span');
        $(span).html('<a href="' + aUrl + '" class="barrageItem" id="barrage" data-name="弹幕部分" data-type="HousePriceEventHc">' + name + '' + data.words + '</a>');
        $target.append($(span));
        return $(span);
    }

    // 获取可用的数组元素的索引
    function getIndex(a) {
        var l;
        if (a.indexs.length > 0) {
            l = a.indexs.shift();
        } else {
            l = a.timer.length;
        }
        return l;
    }
    // 为元素添加偏移量,运行完毕后清除该元素
    // 参数a为数组集合是弹幕实例中的属性clears
    function addAnimate($target, cssObject, t, a) {
        setTimeout(function () {
            $target.css(cssObject);
            setTimeout(function () {
                $target.remove();
            }, t);
        // 原设置时间为0，经测试效果不理想，改为30后，效果正常
        }, 30);
    }

    // 计算动画过渡时间
    function getTimes(w, data) {
        var t = data.time * (data.displacement + w) / data.displacement;
        return t;
    }

    // 添加弹幕消息
    function addBarrage(data, elem) {
        if (data.data[0].length !== 0 && data.isOpen === false) {
            if (data.index >= data.data[0].length) {
                data.newIndex = data.index = 0;
            }
            data.newIndex = data.newIndex > data.index ? data.newIndex : data.index;
            var $target = assignMessage($(elem), data.data[0][data.index++]);
            var w = $target.width() + data.spacing;
            var t = getTimes(w, data);
            var a = data.clears;
            var l = getIndex(a);
            addAnimate($target, {
                'background-color': data.bgColorArr[l],
                '-webkit-transform': 'translate(' + (-data.displacement - w) + 'px)',
                '-webkit-transition-duration': data.speedArr[l] + 's',
                'transform': 'translate(' + (-data.displacement - w) + 'px)',
                'transition-duration': data.speedArr[l] + 's'
            }, (data.speedArr[l]) * 1000, a);
            a.timer[l] = setTimeout(function () {
                a.indexs.push(l);
                addBarrage(data, elem);
            }, 1000 * (data.speedArr[l]) * w / (data.displacement + w));
        }
    }

    // 弹幕初始化
    $.fn.initDanmu = function (obj) {
        return this.each(function (index, elem) {
            $(elem).data('Barrage', new Danmu(obj));
        });
    };
    $('[data-Barrage]').initDanmu();

    // 发送弹幕消息
    $.fn.addBarrage = function (data) {
        return this.each(function (index, elem) {
            $(elem).data('Barrage').addBarrage(data);
        });
    };
    // 开始弹幕
    $.fn.openBarrage = function () {
        return this.each(function (index, elem) {
            var $elem = $(elem);
            var data = $elem.data('Barrage');
            // 防止重复开启弹幕及花屏
            if (data.isOpen === false) {
                return false;
            }
            var $danmu = $elem.children('li');
            data.isOpen = false;
            $danmu.each(function (index, eleme) {
                addBarrage(data, eleme);
            });
        });
    };
    $.fn.closeBarrage = function () {
        return this.each(function (index, elem) {
            var $elem = $(elem);
            var data = $elem.data('Barrage');
            if (data.isOpen === true) {
                return false;
            }
            var a = data.clears;
            data.isOpen = true;
            a.indexs = [];
            // $elem.find('dl').css({'opacity':0,'z-index':-1});
            $elem.find('li').empty();
            a.timer.forEach(function (b) {
                a.indexs[a.indexs.length] = a.indexs.length;
                clearTimeout(b);
            });
        });
    };
})(window.Zepto || window.jQuery);

var citys = [
    {cnName: '北京', pinyin: 'bj', enName: 'beijing'},
    {cnName: '上海', pinyin: 'sh', enName: 'shanghai'},
    {cnName: '武汉', pinyin: 'wh', enName: 'wuhan'},
    {cnName: '广州', pinyin: 'gz', enName: 'guangzhou'},
    {cnName: '成都', pinyin: 'cd', enName: 'chengdu'},
    {cnName: '重庆', pinyin: 'cq', enName: 'chongqing'},
    {cnName: '西安', pinyin: 'xian', enName: 'xian'},
    {cnName: '杭州', pinyin: 'hz', enName: 'hangzhou'},
    {cnName: '苏州', pinyin: 'suzhou', enName: 'suzhou'},
    {cnName: '深圳', pinyin: 'sz', enName: 'shenzhen'},
    {cnName: '南京', pinyin: 'nj', enName: 'nanjing'},
    {cnName: '合肥', pinyin: 'hefei', enName: 'hefei'},
    {cnName: '石家庄', pinyin: 'shijiazhuang', enName: 'shijiazhuang'},
    {cnName: '长沙', pinyin: 'cs', enName: 'changsha'},
    {cnName: '青岛', pinyin: 'qd', enName: 'qingdao'},
    {cnName: '郑州', pinyin: 'zhengzhou', enName: 'zhengzhou'},
    {cnName: '南昌', pinyin: 'nc', enName: 'nanchang'},
    {cnName: '昆明', pinyin: 'kunming', enName: 'kunming'},
    {cnName: '东莞', pinyin: 'dongguan', enName: 'dongguan'},
    {cnName: '长春', pinyin: 'changchun', enName: 'changchun'},
    {cnName: '南宁', pinyin: 'nn', enName: 'nanning'},
    {cnName: '大连', pinyin: 'dalian', enName: 'dalian'},
    {cnName: '无锡', pinyin: 'wuxi', enName: 'wuxi'},
    {cnName: '常州', pinyin: 'cz', enName: 'changzhou'},
    {cnName: '宁波', pinyin: 'ningbo', enName: 'ningbo'},
    {cnName: '佛山', pinyin: 'foshan', enName: 'foshan'},
    {cnName: '惠州', pinyin: 'huizhou', enName: 'huizhou'},
    {cnName: '徐州', pinyin: 'xuzhou', enName: 'xuzhou'},
    {cnName: '厦门', pinyin: 'xiamen', enName: 'xiamen'},
    {cnName: '烟台', pinyin: 'yt', enName: 'yantai'},
    {cnName: '南通', pinyin: 'nantong', enName: 'nantong'},
    {cnName: '哈尔滨', pinyin: 'haerbin', enName: 'haerbin'},
    {cnName: '昆山', pinyin: 'kunshan', enName: 'kunshan'},
    {cnName: '呼和浩特', pinyin: 'neimeng', enName: 'huhehaote'},
    {cnName: '福州', pinyin: 'fuzhou', enName: 'fuzhou'},
    {cnName: '珠海', pinyin: 'zhuhai', enName: 'zhuhai'},
    {cnName: '扬州', pinyin: 'yangzhou', enName: 'yangzhou'},
    {cnName: '兰州', pinyin: 'lanzhou', enName: 'lanzhou'},
    {cnName: '三亚', pinyin: 'sanya', enName: 'sanya'},
    {cnName: '贵阳', pinyin: 'guiyang', enName: 'guiyang'},
    {cnName: '江门', pinyin: 'jiangmen', enName: 'jiangmen'},
    {cnName: '中山', pinyin: 'zhongshan', enName: 'zhongshan'},
    {cnName: '沈阳', pinyin: 'sy', enName: 'shenyang'},
    {cnName: '潍坊', pinyin: 'weifang', enName: 'weifang'},
    {cnName: '天津', pinyin: 'tj', enName: 'tianjin'}
];

/**
 * [joinListArr 拼接城市list]
 * @param  {[obj]} city [city对象]
 * @return {[str]}      [html字符串]
 */
function joinListArr(city) {
    return '<li data-pinyin="' + city.pinyin + '">' + city.cnName + '</li>';
}

/**
 * 拼接所有城市的list
 * @return {[str]} [html字符串]
 */
function getCityList(citys) {
    var cityHTML = '';
    for (var i = 0, len = citys.length; i < len; i++) {
        cityHTML += joinListArr(citys[i]);
    }
    return cityHTML;
}
var cityList = getCityList(citys);


var myScroll;
$.getScript('//static.soufunimg.com/common_m/m_activity/public/jslib/iscroll/5.2.0/iscroll.min.js', function () {
    myScroll = new IScroll('#wrapper',{
        click: true
    });
});

/**
 * [getCityData 获取数据]
 * @param  {[str]} pinyin       [城市拼音]
 * @param  {[str]} cityName     [城市中文]
 * @param  {[num]} storageIndex [当前所在页数]
 */
function getCityData(pinyin,cityName,storageIndex) {
    cityName = cityName || '北京';
    $.ajax({
        url: location.protocol + '//' + location.host + '/huodongAC.d',
        type: 'get',
        dataType: 'json',
        data: {
            m: 'getEvaluationPrice',
            class: 'HousePriceEventHc',
            city: pinyin,
            topNum: '3'
        }
    }).done(function (data) {
        drawCanvas(data);
        setData(data,cityName,storageIndex);
    }).fail(function (data) {
        alert('获取失败');
        console.log(data);
    });
}

/**
 * 更改数据显示
 * @param {[obj]} data [回调数据]
 */
function setData(data,cityName,storageIndex) {
    // 新房成交行情
    var newhouseTrasac = data.NewhouseTrasac;
    var makeTao,scaleTao;
    var monthOrWeek = $('#monthOrWeek');
    // 如果没有周数据，则显示月数据
    if (!newhouseTrasac.w_maketao || !newhouseTrasac.w_scale) {
        makeTao = newhouseTrasac.m_maketao;
        scaleTao =newhouseTrasac.m_scale ? newhouseTrasac.m_scale + '%' : '0';
        monthOrWeek.html('月');
    }else {
        makeTao = newhouseTrasac.w_maketao || '待定';
        scaleTao = newhouseTrasac.w_scale ? newhouseTrasac.w_scale + '%' : '0';
        monthOrWeek.html('周');
    }
    // 成交均价
    console.log(newhouseTrasac.priceNew);
    var lastMonthPrice = newhouseTrasac.priceNew * 1 != '0' ? ~~(newhouseTrasac.priceNew) : '<a href="javascript:;" >待定</a>';
    var huanbiMonth = newhouseTrasac.price_scale ? newhouseTrasac.price_scale + '%' : '0';
    if (newhouseTrasac.priceNew * 1 != '0') {
        console.log('!=0');
        $('.lastMonth').eq(1).html(lastMonthPrice);
        $('.lastMonth').eq(0).html('<a href="javascript:;" >' + lastMonthPrice + '</a>元/㎡');
    }else {
        console.log('=0');
        $('.lastMonth').html(lastMonthPrice);
    }
    $('.lastWeek').html(makeTao);
    $('.huanbiMonth').html(huanbiMonth);
    $('.huanbiWeek').html(scaleTao);

    // 数据月份
    $('#currentMonth').html(newhouseTrasac.month.split('-')[1]);

    // 成交排行榜
    if(data.TRankList[0].dataSource === 'rank') {
        var transactioRank = data.TRankList,
            listHTML = '',
            i = 0,
            len = transactioRank.length;
        for (; i < len; i++) {
            var pricetype = '元/平';
            if (transactioRank[i].pricetype) {
                pricetype = transactioRank[i].pricetype.replace(/方米/g,'');
            }
            var price = ~~(transactioRank[i].price) ? '约' + ~~(transactioRank[i].price) + pricetype : '待定';
            listHTML += '<a href="//' + location.host + '/xf/' + selectedCity + '/' + transactioRank[i].newcode + '.html" class="c-list" id="charts' + (i + 1) + '" data-name="排行榜' + (i + 1) + '" data-type="HousePriceEventHc">'
                            + '<div class="img"><img class="lazyPic" lazysrc="' + transactioRank[i].outdoor_pic_url + '"></div>'
                            + '<div class="txt">'
                                + '<h3>[' + transactioRank[i].district + ']' + transactioRank[i].projname + '</h3>'
                                + '<p>' + transactioRank[i].tag + '</p>'
                                + '<p><i>' + price + '</i>成交量：约' + transactioRank[i].maketao + '套</p>'
                            + '</div>'
                            + '<div class="seal"><img src="//static.soufunimg.com/common_m/m_activity/mileStone2016/images/pic-no' + (i + 1) + '.png"></div>'
                        + '</a>';
        }
        $('#lists').html(listHTML);

        // 排行榜月份
        var currentMonth = transactioRank[0].month.split('-')[1];
        $('#cityName').html(currentMonth + '月<br>' + cityName).siblings('img').attr('src','//static.soufunimg.com/common_m/m_activity/mileStone2016/images/pic-words05.png');

        // 进入列表页时，懒加载图片
        if (storageIndex === 4) {
            $('.lazyPic').each(function (index, el) {
                $(el).attr('src', $(el).attr('lazysrc'));
            });
        }
    }else {
        var transactioRank = data.TRankList,
            listHTML = '',
            i = 0,
            len = transactioRank.length;
            for (; i < len; i++) {
                var pricetype = '元/平';
                if (transactioRank[i].pricetype) {
                    pricetype = transactioRank[i].pricetype.replace(/方米/g,'');
                }
                var price = ~~(transactioRank[i].price) ? '约' + ~~(transactioRank[i].price) + pricetype : '待定';
                listHTML += '<a href="//' + location.host + '/xf/' + selectedCity + '/' + transactioRank[i].newcode + '.html" class="c-list" id="charts' + (i + 1) + '" data-name="热搜榜' + (i + 1) + '" data-type="HousePriceEventHc">'
                                + '<div class="img"><img class="lazyPic" lazysrc="' + transactioRank[i].outdoor_pic_url + '"></div>'
                                + '<div class="txt">'
                                    + '<h3>[' + transactioRank[i].district + ']' + transactioRank[i].projname + '</h3>'
                                    + '<p>' + transactioRank[i].tag + '</p>'
                                    + '<p><i>' + price + '</i>热度：' + transactioRank[i].orderandpv + '</p>'
                                + '</div>'
                                + '<div class="seal"><img src="//static.soufunimg.com/common_m/m_activity/mileStone2016/images/pic-no' + (i + 1) + '.png"></div>'
                            + '</div>';
            }
        $('#lists').html(listHTML);

        // 排行榜月份
        var currentMonth = transactioRank[0].month.split('-')[1] ? transactioRank[0].month : (new Date().getMonth() + 1) + '月';
        $('#cityName').html(currentMonth + '<br>' + cityName).siblings('img').attr('src','//static.soufunimg.com/common_m/m_activity/mileStone2016/images/pic-words07.png');

        // 进入列表页时，懒加载图片
        if (storageIndex === 4) {
            $('.lazyPic').each(function (index, el) {
                $(el).attr('src', $(el).attr('lazysrc'));
            });
        }
    }
}

/**
 * 绘制canvas曲线图
 * @param  {[arr]} data [数据]
 */
function drawCanvas(data) {
    var json = data.EPriceList;
    $('#line').find('canvas').remove();
    var w = $('#line').width();
    var line = new Line103({
        id: '#line',
        // 走势线线宽
        linePx: 5,
        // 字体
        // 底部字体大小及颜色
        downFontSize: '30px',
        downTxtColor: '#f9849b',
        // 点半径
        pointRadis: 10,
        // 点颜色
        // 背景线线宽及颜色
        bgLinePx: 3,
        bgLineColor: '#f7cfd7',
        w: w,
        h: 200,
        lineArr: [{
            lineColor: '#f9849b',
            pointColor: '#f9849b',
            data: json
        }]
    });
    line.run();
}

// 数据在search.js中定义的字符串
var cityPY, cityCN, cityHTML = '';
// 列表UL
var cityListUl = $('.selectCityUl');
// 输入框
var inputCity = $('#cityInput'),
    userInput = inputCity.val();
// 加入遮罩，输入下拉筛选时显示隐藏
var cover = $('#cover');

/**
 * [filterInput 筛选输入]
 * @param  {[num]} inputLen [已经输入字符串的长度]
 */
function filterInput(inputLen) {
    if (userInput) {
        var subInput = userInput.substring(0, inputLen);
        cityHTML = '';
        for (var i = 0, len = citys.length; i < len; i++) {
            cityPY = citys[i].enName.substring(0, inputLen);
            cityCN = citys[i].cnName.substring(0, inputLen);
            if (subInput === cityPY || subInput === cityCN) {
                cityHTML += joinListArr(citys[i]);
            }
        }
        // 如果匹配到，则插入匹配数据
        // 否则显示没有数据
        if (cityHTML) {
            cityListUl.html(cityHTML);
            $('#wrapper').show();
            cover.show();
        }else {
            cityListUl.html('<li id="no">没有该城市数据</li>');
            $('#wrapper').show();
            cover.show();
        }
    }
    myScroll.refresh('.selectCityUl');
}

function onInput() {
    // 输入时
    inputCity.on('focus', function (ev) {
        ev.stopPropagation();
        $(this).val('');
        $(this).addClass('c90736b');
        cityListUl.html(cityList);
        $('#wrapper').show();
        cover.show();
        myScroll.refresh('.selectCityUl');
    }).on('input', function (ev) {
        ev.stopPropagation();
        userInput = inputCity.val().toLowerCase().trim();
        var inputLen = userInput.length;
        if (inputLen === 0) {
            cityListUl.html(cityList);
            $('#wrapper').show();
            cover.show();
        }
        filterInput(inputLen);
    });
    cover.on('click', function () {
        $('#wrapper').hide();
        cover.hide();
    });
}

function onSelect() {
    // 选中时
    cityListUl.on('click', 'li', function (ev) {
        ev.stopPropagation();
        if (ev.target.id !== 'no') {
            var $this = $(this);
            inputCity.val($this.html());
            selectedCity = $this.attr('data-pinyin');
            getCityData(selectedCity,$this.html());
            $('#wrapper').hide();
            cover.hide();
            inputCity.blur();
            window.localStorage.setItem('selectedCity',selectedCity);
            weixin.updateOps({
                shareTitle: '2016你的房价大事记',
                descContent: getCityNameByPinyin(selectedCity) + '房价发生了这么大的变化，你竟然不知道',
                lineLink: location.protocol + '//m.fang.com/activityshow/HousePriceEnent/housPriceIndex.jsp' + '?@' + selectedCity + '@',
                imgUrl: location.protocol + '//static.soufunimg.com/common_m/m_activity/mileStone2016/images/share.jpg'
            });
        }
    }).on('touchstart', function (event) {
        event.preventDefault();
        inputCity.blur();
    });
}

/**
 * CSS Flip Counter
 */
var flipCounter = function (d, options) {

    // Default values
    var defaults = {
        value: 0,
        inc: 1,
        pace: 1000,
        auto: true,
        decimals: 0,
        places: 0,
        dest: 0
    };

    var counter = options || {};
    var doc = window.document;

    for (var opt in defaults) {
        counter[opt] = counter.hasOwnProperty(opt) ? counter[opt] : defaults[opt];
    }

    var xCount = counter.dest - counter.value,
        tmp = counter.value;

    var digitsOld = [],
        digitsNew = [],
        decimalsOld = [],
        decimalsNew = [],
        digitsAnimate = [],
        x, y, lastTimeout, nextCount = null;

    var div = d;
    if (typeof d === 'string') {
        div = doc.getElementById(d);
    }else {
        alert('错误，第一个参数必须为id');
        return;
    }

    /**
     * Sets the value of the counter and animates the digits to new value.
     *
     * Example: myCounter.setValue(500); would set the value of the counter to 500,
     * no matter what value it was previously.
     *
     * @param {int} n
     *   New counter value
     */
    this.setValue = function (n) {
        if (isNumber(n)) {
            x = counter.value;
            y = counter.value = n;
            digitCheck(x, y);
        }
        return this;
    };

    /**
     * Sets the increment for the counter. Does NOT animate digits.
     */
    this.setIncrement = function (n) {
        counter.inc = isNumber(n) ? n : defaults.inc;
        return this;
    };

    /**
     * Sets the pace of the counter. Only affects counter when auto == true.
     *
     * @param {int} n
     *   New pace for counter in milliseconds
     */
    this.setPace = function (n) {
        counter.pace = isNumber(n) ? n : defaults.pace;
        return this;
    };

    /**
     * Sets counter to auto-increment (true) or not (false).
     *
     * @param {boolean} a
     *   Should counter auto-increment, true or false
     */
    this.setAuto = function (a) {
        var sa = typeof a !== 'boolean' ? true : a;
        if (counter.auto) {
            if (!sa) {
                if (nextCount) clearNext();
                counter.auto = false;
            }
        } else {
            if (nextCount) clearNext();
            counter.auto = true;
            doCount();
        }
        return this;
    };

    /**
     * Increments counter by one animation based on set 'inc' value.
     */
    this.step = function () {
        if (!counter.auto) doCount();
        return this;
    };

    /**
     * Adds a number to the counter value, not affecting the 'inc' or 'pace' of the counter.
     *
     * @param {int} n
     *   Number to add to counter value
     */
    this.add = function (n) {
        if (isNumber(n)) {
            x = counter.value;
            counter.value += n;
            y = counter.value;
            digitCheck(x, y);
        }
        return this;
    };

    /**
     * Subtracts a number from the counter value, not affecting the 'inc' or 'pace' of the counter.
     *
     * @param {int} n
     *   Number to subtract from counter value
     */
    this.subtract = function (n) {
        if (isNumber(n)) {
            x = counter.value;
            counter.value -= n;
            if (counter.value >= 0) {
                y = counter.value;
            } else {
                y = '0';
                counter.value = 0;
            }
            digitCheck(x, y);
        }
        return this;
    };

    /**
     * Gets current value of counter.
     */
    this.getValue = function () {
        return counter.value;
    };

    /**
     * Stops all running increments.
     */
    this.stop = function () {
        if (nextCount) clearNext();
        return this;
    };

    // --------------------------------------------------------------------------- //

    function doCount(first) {
        var firstRun = typeof first === 'undefined' ? false : first;

        x = counter.value.toFixed(counter.decimals);

        if (!firstRun) counter.value += counter.inc;
        y = counter.value.toFixed(counter.decimals);
        digitCheck(x, y);
        // Do first animation
        if (counter.auto === true) {
            nextCount = setTimeout(doCount, counter.pace);
        }
    }

    function digitCheck(x, y) {
        digitsOld = toArray(x);
        digitsNew = toArray(y);

        var ylen = digitsNew.length;
        var dlen = 0;

        // reset to reset correctly all digit placeholder
        digitsAnimate = [];
        for (var i = 0; i < ylen; i++) {
            if (i < dlen) {
                digitsAnimate[i] = decimalsNew[i] !== decimalsOld[i];
            } else {
                var j = i - dlen;
                digitsAnimate[i] = digitsNew[j] !== digitsOld[j];
            }
        }
        drawCounter();
    }

    // Creates array of digits for easier manipulation
    function toArray(input) {
        var output = input.toString().split('').reverse();
        if (counter.places > 0 && output.length < counter.places) {
            for (var i = output.length; i < counter.places; i++) {
                output.push('0');
            }
        }
        return output;
    }

    // Sets the correct digits on load
    function drawCounter() {
        var html = '',
            dNew, dOld;

        var i = 0;

        var count = digitsNew.length;
        for (i; i < digitsAnimate.length; i++) {
            var j = i - (digitsAnimate.length - digitsNew.length);
            dNew = isNumber(digitsNew[j]) ? digitsNew[j] : '';
            dOld = isNumber(digitsOld[j]) ? digitsOld[j] : '';
            html += '<li class="digit" id="' + d + '-digit-a' + i + '">'
                    + '<div class="line"></div>'
                    + '<span class="front">' + dNew + '</span>'
                    + '<span class="back">' + dOld + '</span>'
                    + '<div class="hinge-wrap"><div class="hinge">'
                        + '<span class="front">' + dOld + '</span>'
                        + '<span class="back">' + dNew + '</span>'
                    + '</div></div>'
                    + '</li>';
        }
        div.innerHTML = html;

        tmp++;

        if (tmp <= counter.dest) {
            counter.pace = (xCount - counter.dest + tmp) * 40;
        }else {
            counter.auto = false;
            timeOutJump();
        }

        touchMoveJump();

        var alen = digitsAnimate.length;

        if (lastTimeout) {
            // reset timeout, so very fast setValue() calls work correctly without race conditions
            clearTimeout(lastTimeout);
            lastTimeout = null;
        }
        // Need a slight delay before adding the 'animate' class or else animation won't fire on FF
        lastTimeout = setTimeout(function () {
            for (var i = 0; i < alen; i++) {
                if (digitsAnimate[i]) {
                    var ani = doc.getElementById(d + '-digit-a' + i);
                    ani.className = ani.className + ' animate';
                }
            }
        }, 20);
    }

    // http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric/1830844
    /**
     * [isNumber 是否有效数字]
     * @param  {[number]}  n [数字]
     * @return {Boolean}   [是否有效]
     */
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * [clearNext 清除计时器]
     */
    function clearNext() {
        clearTimeout(nextCount);
        nextCount = null;
    }

    // Start it up
    doCount(true);
};
// 音乐
var msg = document.createElement('audio');
var bgm = document.createElement('audio');
var playBtn = $('.music');
function bindMusic() {
    msg.src = '//static.soufunimg.com/common_m/m_activity/mileStone2016/audio/msg.mp3';
    bgm.src = '//static.soufunimg.com/common_m/m_activity/mileStone2016/audio/bgm.mp3';
    bgm.loop = true;
    bgm.play();
    playBtn.on('click',function (ev) {
        ev.stopPropagation();
        if ($(this).hasClass('play')) {
            bgm.pause();
            playBtn.removeClass('play');
        }else {
            bgm.play();
            playBtn.addClass('play');
        }
    }).addClass('play');
    var isPlay = false;
    $('#loading,#loadPhone').on('touchstart', function (ev) {
        ev.stopPropagation();
        if (!isPlay) {
            isPlay = true;
            bgm.play();
        }
    });
}

/**
 * [transitionEnd 绑定动画结束事件执行回调函数]
 * @param  {Function} callback [回调函数]
 */
$.fn.transitionEnd = function (callback) {
    var events = ['webkitTransitionEnd', 'transitionend'],
        i,
        dom = this,
        eventsLen = events.length;

    function fireCallBack(e) {
        if (e.target !== this) return;
        callback.call(this, e);
        for (i = 0; i < eventsLen; i++) {
            dom.off(events[i], fireCallBack);
        }
    }
    if (callback) {
        for (i = 0; i < eventsLen; i++) {
            dom.on(events[i], fireCallBack);
        }
    }
    return this;
};

// raf兼容
var lastTime = 0;
var vendors = ['webkit', 'moz'];
// 根据前缀判断是否存在requestAnimationFrame方法
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    // Webkit中此取消方法的名字变了
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
        || window[vendors[x] + 'CancelRequestAnimationFrame'];
}
// 如果没有requestAnimationFrame方法设置setTimeout方法代替
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}
// 如果没有取消requestAnimationFrame方法设置clearTimeout方法代替
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}

// 弹幕点击跳转地址
var barrageURL = '//m.fang.com/zt/wap/201609/930xinzhengbj.html?city=bj&m=xfzx';
// 弹幕数据
var barrages = [
    {name: '', url: barrageURL, words: '厦门限贷升级：有房贷记录且结清的最低首付比上提5%'},
    {name: '', url: barrageURL, words: '东莞新房售价实行备案制度 成交价浮动超15%将无法网签'},
    {name: '', url: barrageURL, words: '芜湖公积金新政：最高贷款额不超账户缴存余额10倍'},
    {name: '', url: barrageURL, words: '南昌楼市限购令细则出台'},
    {name: '', url: barrageURL, words: '10月9日起成都工商银行首套房首付提至30%'},
    {name: '', url: barrageURL, words: '上海6条措施遏制房价过快上涨'},
    {name: '', url: barrageURL, words: '福建出台“商改住”新规'},
    {name: '', url: barrageURL, words: '合肥发布住房限购查询实施细则'},
    {name: '', url: barrageURL, words: '济南限购以家庭为单位'},
    {name: '', url: barrageURL, words: '佛山区域重新限购 二套房首付不低于40%'},
    {name: '', url: barrageURL, words: '福州限购！ 3类居民家庭无法购买144平及以下住房'},
    {name: '', url: barrageURL, words: '惠州出台通知控房价 未涉及限购限贷'},
    {name: '', url: barrageURL, words: '东莞本市户籍居民家庭禁买第三套房'},
    {name: '', url: barrageURL, words: '珠海限购限贷！'},
    {name: '', url: barrageURL, words: '广州公积金新政:首套首付3成'},
    {name: '', url: barrageURL, words: '厦门限购升级：首套首付比例不低于3成'},
    {name: '', url: barrageURL, words: '南京二套房首付调制8成'},
    {name: '', url: barrageURL, words: '苏州限贷：2套房及以上居民家庭暂停发放商业性住房贷款'},
    {name: '', url: barrageURL, words: '武汉重启限购！二套房首付五成起三套停贷'},
    {name: '', url: barrageURL, words: '合肥楼市新政：外地人购房需1年个税社保或纳税'},
    {name: '', url: barrageURL, words: '北京楼市限贷再升级 二套房首付不低于50%'},
    {name: '', url: barrageURL, words: '天津区域化限购 差别化限贷'},
    {name: '', url: barrageURL, words: '郑州两类家庭限制购买180平米以下住房'},
    {name: '', url: barrageURL, words: '成都二套房首付比例不低于40%'}
];

/**
 * [swiperInit 初始化swiper]
 * @return {[obj]} [mySwiper]
 */
function swiperInit() {
    $('.swiper-slide').show();
    // 定义坐标
    var startY = 0,
        endY = 0;
    var rem = document.documentElement.clientWidth / 320 * 20,
        timeLineTopHeight = rem * 2.8;

    var autoJump = window.localStorage.getItem('autoJump');

    var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        followFinger: true,
        speed: 1000,
        onSlideChangeStart: function (swiper) {
            if (swiper.activeIndex === 5) {
                $('.fangcar').hide();
                $('#tofangjia').attr('href', '//m.fang.com/fangjia/' + selectedCity).css('display', 'block');
            }
            swiper.detachEvents();
            if (endY !== 0) {
                // console.log('slideChangeStart, activeIndex = ' + swiper.activeIndex);
                // next
                if (endY - startY < 0) {
                    $('.timeLine').eq(swiper.previousIndex).css('height', $(window).height() - timeLineTopHeight).transitionEnd(function () {
                        $('.timeLineTop').eq(swiper.activeIndex).css('height', '2.8rem');
                    });
                // prev
                }else if (endY - startY > 0) {
                    $('.timeLineTop').eq(swiper.previousIndex).css('height', 0).transitionEnd(function () {
                        $('.timeLine').eq(swiper.previousIndex - 1).css('height', 0);
                    });
                }
            }
            startY = endY = 0;
        },
        onSlideChangeEnd: function (swiper) {
            // console.log('slideChangeEnd, activeIndex = ' + swiper.activeIndex);
            // 首次进入城市选择页时，默认请求北京数据展示
            if (swiper.activeIndex === 1 && firstInit) {
                firstInit = false;
                getCityData(selectedCity,getCityNameByPinyin(selectedCity));
            }
            // 到达弹幕页时开启弹幕
            if (swiper.activeIndex === 3) {
                $('#barrage').addBarrage(barrages).openBarrage();
            }else {
                // 离开弹幕页是关闭弹幕
                $('#barrage').closeBarrage();
            }
            // 进入列表页时，懒加载图片
            if (swiper.activeIndex === 4) {
                $('.lazyPic').each(function (index, el) {
                    $(el).attr('src', $(el).attr('lazysrc'));
                });
            }
            if (swiper.activeIndex === 5) {
                $('.fangcar').fadeIn(function () {
                    window.localStorage.setItem('activeIndex',mySwiper.activeIndex);
                    window.localStorage.setItem('autoJump',true);
                    setTimeout(function () {
                        if (swiper.activeIndex === 5 && !autoJump) {
                            $('#tofangjia').trigger('click');
                        }
                    },1500);
                });
            }
            swiper.attachEvents();
        },
        onTouchStart: function (swiper,even) {
            startY = even.changedTouches[0].pageY;
        },
        onTouchMove: function (swiper,even) {
            endY = even.changedTouches[0].pageY;
            if (mySwiper.activeIndex === 5) {
                if (endY - startY < -20) {
                    window.localStorage.setItem('activeIndex',mySwiper.activeIndex);
                    location.href = '//m.fang.com/fangjia/' + selectedCity;
                    return;
                }
            }
        },
        onSlideNextStart: function (swiper) {
            console.log('onSlideNextStart, activeIndex = ' + swiper.activeIndex);
            // if (swiper.activeIndex === 4) {
            //     swiper.slideNext();
            // }
        },
        onSlidePrevStart: function (swiper) {
            console.log('onSlidePrevStart, activeIndex = ' + swiper.activeIndex);
            // if (swiper.activeIndex === 4) {
            //     swiper.slidePrev();
            // }
        }
    });
    $('.arrowDown').show();

    $('.shaking').on('click', function () {
        // console.log(mySwiper);
        if (mySwiper.activeIndex === 5) {
            return;
        }
        $('.timeLine').eq(mySwiper.activeIndex).css('height', $(window).height() - timeLineTopHeight).transitionEnd(function () {
            $('.timeLineTop').eq(mySwiper.activeIndex).css('height', '2.8rem');
        });
        mySwiper.slideNext();
    });

    $('.swiper-slide').eq(5).on('click', function (ev) {
        ev.preventDefault();
        window.localStorage.setItem('activeIndex',mySwiper.activeIndex);
    });

    return mySwiper;
}

/**
 * [flipCounterInit 初始化翻页效果]
 */
function flipCounterInit() {
    var myCounter = new flipCounter('myCounter', {
        value: 2010,
        inc: 1,
        pace: 500,
        auto: true,
        dest: 2016
    });
}

// 首页是否自动跳页
var autoFlip = true;
/**
 * [timeOutJump 延时跳转]
 */
function timeOutJump() {
    setTimeout(function () {
        if (autoFlip) {
            $('#loading').fadeOut(function () {
                $('#loadPhone').fadeIn();
                bgm.pause();
                msg.play();
                msg.addEventListener('ended',function () {
                    bgm.play();
                });
            });
        }
    },1234);
}
/**
 * [touchMoveJump 滑动跳转]
 */
function touchMoveJump() {
    var loadingStartY = 0,
    loadingEndY = 0;
    $('#loading').on('touchstart',function (ev) {
        loadingStartY = ev.originalEvent.targetTouches[0].pageY;
    }).on('touchmove',function (ev) {
        loadingEndY = ev.originalEvent.targetTouches[0].pageY;
    }).on('touchend',function () {
        if (loadingEndY !== 0) {
            if (loadingEndY - loadingStartY < -20) {
                autoFlip = false;
                $('#loading').fadeOut(function () {
                    $('#loadPhone').fadeIn();
                    bgm.pause();
                    msg.play();
                    msg.addEventListener('ended',function () {
                        bgm.play();
                    });
                });
            }
        }
        loadingStartY = loadingEndY = 0;
    });
}

/**
 * [getCityNameByPinyin 根据城市短拼获取城市中文名]
 * @param  {[str]} pinyin [短拼]
 * @return {[str]}        [中文名]
 */
function getCityNameByPinyin(pinyin) {
    var cnName = '';
    for (var i = 0, len = citys.length; i < len; i++) {
        if (citys[i].pinyin === pinyin) {
            cnName = citys[i].cnName;
        }
    }
    return cnName;
}

// 默认选择城市
var selectedCity = window.localStorage.getItem('selectedCity') || 'bj',
    // 判断是否首次进入
    firstInit = true,
    weixin = null;
function init() {
    var mySwiper = null;

    var url = location.href;
    if (url.split('?@')[1]) {
        if (url.split('?@')[1].split('@')[0]) {
            selectedCity = url.split('?@')[1].split('@')[0];
        }
    }

    $('.selectCityUl').addClass('swiper-no-swiping');

    $('#cityName').parent('.box-title').addClass('ml25 pd1');

    // 禁止页面滚动
    $(window).on('touchmove', function (ev) {
        ev.preventDefault();
    });

    // 修改默认城市显示和输入
    $('#cityName').html(getCityNameByPinyin(selectedCity));
    $('#cityInput').val(getCityNameByPinyin(selectedCity));

    // 获取存在localStorage里的activeIndex值
    var storageIndex = window.localStorage.getItem('activeIndex');
    // 然后移除掉activeIndex的值
    window.localStorage.removeItem('activeIndex');
    // 如果storageIndex有值，说明之前用户通过链接跳出过页面，处于返回状态，则跳到对应页面
    // 否则默认处理
    if (storageIndex !== null) {
        // 初始化swiper
        mySwiper = swiperInit();
        // 获取默认城市数据
        getCityData(selectedCity,getCityNameByPinyin(selectedCity),storageIndex);
        // 然后根据localstorage存的值将swiper滑到上一次离开位置
        mySwiper.slideTo(storageIndex);
        // 时间轴下半部分
        $('.timeLine').css('height', $(window).height()).each(function (index, el) {
            if (index >= mySwiper.activeIndex) {
                $(el).css('height', '0');
            }
        });
        // 时间轴上半部分
        $('.timeLineTop').each(function (index, el) {
            if (index > mySwiper.activeIndex) {
                $(el).css('height','0');
            }else {
                if (index === 0) {
                    return;
                }
                $(el).css('height', '2.8rem');
            }
        });
    }else {
        // loading页淡入并开启翻台历效果
        $('#loading').fadeIn('slow', function () {
            flipCounterInit();
        });
        // 点击对应位置显示下一个页面
        $('#phoneBtn').on('click', function () {
            $('#loadPhone').fadeOut(function () {
                $('#loadFlip').fadeIn();
            });
        });
        // 点击对应位置显示下一个页面并初始化swiper
        $('#fangApp').on('click', function () {
            $('#loadFlip').fadeOut(function () {
                mySwiper = swiperInit();
            });
        });
    }

    // 点击弹幕要跳走前先存一个localStorage
    $('#barrage').on('click', 'a', function (event) {
        event.preventDefault();
        window.localStorage.setItem('activeIndex',mySwiper.activeIndex);
        location.href = $(this).attr('href');
    });

    // 点击房源要跳走前先存一个localStorage
    $('#lists').on('click', 'a', function (event) {
        event.preventDefault();
        window.localStorage.setItem('activeIndex',mySwiper.activeIndex);
        location.href = $(this).attr('href');
    });


    // 微信、QQ分享
    weixin = new Weixin({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: false,
        shareTitle: '2016你的房价大事记',
        descContent: '房价发生了这么大的变化，你竟然不知道',
        swapTitle: true,
        lineLink: location.href,
        imgUrl: location.protocol + '//static.soufunimg.com/common_m/m_activity/mileStone2016/images/share.jpg'
    });

    // APP分享
    var dataForWeixin = {
        title: '2016你的房价大事记',
        desc: '房价发生了这么大的变化，你竟然不知道',
        url: location.href,
        TLImg: location.protocol + '//static.soufunimg.com/common_m/m_activity/mileStone2016/images/share.jpg'
    };
    $('#soufunclient').html('1$' + dataForWeixin.desc + '$' + dataForWeixin.url + '$' + dataForWeixin.TLImg);

    onInput();
    onSelect();
    bindMusic();
}

$(document).ready(function () {
    init();
});
