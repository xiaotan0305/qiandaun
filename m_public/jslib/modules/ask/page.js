define('modules/ask/page', [], function () {
    'use strict';
    function page(opts) {
        this.options = {
            currentNum: 1,
            totalNum: 10,
            sectionId: 'section_page',
            sectionClassName: 'mBox mb7',
            nextId: 'nextpage',
            prevId: 'prevpage',
            curId: 'currentpage',
            // 列表页url定制
            reg: new RegExp('(' + location.origin + '/ask/sum/' + (location.href.match(/sum\/(\d+)/) === null ? '' :
                    location.href.match(/sum\/(\d+)/)[1]) + '_)(\\d+)_(\\d+)/'),
            regInfo: new RegExp('(' + location.origin + '/ask/sum/' + (location.href.match(/sum\/(\d+)/) === null ? '' :
                    location.href.match(/sum\/(\d+)/)[1]) + '_)(\\d+).html')
        };
        if (opts) {
            for (var p in opts) {
                if (opts.hasOwnProperty(p)) {
                    this.options[p] = opts[p];
                }
            }
        }
        this.currentNum = this.currentNum || this.options.currentNum;
        this.totalNum = this.totalNum || this.options.totalNum;
        this.pageSize = this.pageSize || this.options.pageSize;
        this.nextNum = this.nextNum || this.currentNum;
        this.prevNum = this.prevNum || this.currentNum;
        this.pageUrl = this.options.pageUrl;
        this.showPage = Math.ceil(this.totalNum / this.pageSize);
        this.showtype = this.options.showtype;
        this.reg = this.options.reg;
        this.regInfo = this.options.regInfo;
        this.ext = '/';
    }

    page.prototype = {
        _init: function () {
            var that = this;
            that._render();
            that.oNext = document.getElementById('nextpage');
            that.oPrev = document.getElementById('prevpage');
            that.oCurr = document.getElementById('currentpage');
            var selPage = document.getElementById('selPage');
            selPage.addEventListener('change', function () {
                var pageIndex = this.options[this.options.selectedIndex].text.split('/')[0];
                if (location.href.match(/page=(\d+)/)) {
                    // 有showtype就替换没有就不替换
                    window.location.href = window.location.href.
                        replace(/page=(\d{1,})/, 'page=' + pageIndex).replace(/showtype=(\d{1,})/, 'showtype=' + that.showtype);
                }
                // 正则replace替换 "_3_1/" $2指代页码  $3指代showtype 坑啊
                if ((/.html/).test(window.location.href)) {
                    that.ext = '.html';
                    // window.location.href=window.location.href.replace(that.regInfo,"$1"+"$2"+"_"+"$3".replace("$3",pageIndex)+that.ext);
                    window.location.href = window.location.href.replace(that.regInfo, '$1' + '$2'.replace('$2', pageIndex) + that.ext);
                } else if ((/_\d+\//).test(window.location.href)) {
                    that.ext = '/';
                    window.location.href = window.location.href.
                        replace(that.reg, '$1' + '$2'.replace('$2', pageIndex) + '_' + '$3'.replace('$3', that.showtype) + that.ext);
                }
            }, false);
        },
        _getNextNum: function (curnum, total) {
            if (curnum === total) {
                return 1;
            } else if (curnum < total && curnum > 0) {
                return parseInt(curnum) + 1;
            }
        }, _getPrevNum: function (curnum, total) {
            if (curnum === 1) {
                return total;
            } else if (curnum <= total && curnum > 1) {
                return parseInt(curnum) - 1;
            }
        },
        _render: function () {
            var that = this;
            that.nextNum = that._getNextNum(that.currentNum, that.showPage);
            that.prevNum = that._getPrevNum(that.currentNum, that.showPage);
            var optionStr = '<select id=\"selPage\">';
            var tempNum = 0;
            that.html = '';
            var osection = document.getElementById(that.options.sectionId);
            var prevurl = '';
            var nexturl = '';
            that.currentNum = parseInt(that.currentNum);
            if (that.totalNum > 0) {
                while (that.showPage > tempNum) {
                    tempNum++;
                    if (tempNum === that.currentNum) {
                        optionStr += '<option selected=\"selected\" >' + that.currentNum + '/' + that.showPage + '</option>';
                    } else {
                        optionStr += '<option>' + tempNum + '/' + that.showPage + '</option>';
                    }
                }
            }
            optionStr += '</select>';
            if (location.href.match(/page=(\d+)/)) {
                // 有showtype就替换没有就不替换
                prevurl = that.pageUrl.replace(/page=(\d{1,})/, 'page=' + that.prevNum).replace(/showtype=(\d{1,})/, 'showtype=' + that.showtype);
                nexturl = that.pageUrl.replace(/page=(\d{1,})/, 'page=' + that.nextNum).replace(/showtype=(\d{1,})/, 'showtype=' + that.showtype);
            }
            if ((/.html/).test(window.location.href)) {
                that.ext = '.html';
                prevurl = that.pageUrl.replace(that.regInfo, '$1' + '$2'.replace('$2', that.prevNum) + that.ext);
                nexturl = that.pageUrl.replace(that.regInfo, '$1' + '$2'.replace('$2', that.nextNum) + that.ext);
            } else if ((/_\d+\//).test(window.location.href)) {
                that.ext = '/';
                prevurl = that.pageUrl.replace(that.reg, '$1' + '$2'.replace('$2', that.prevNum) + '_' + '$3'.replace('$3', that.showtype) + that.ext);
                nexturl = that.pageUrl.replace(that.reg, '$1' + '$2'.replace('$2', that.nextNum) + '_' + '$3'.replace('$3', that.showtype) + that.ext);
            }
            that.html = '<ul class=\"jh-page flexbox\">';
            if (that.pageUrl === nexturl) {
                that.html += '<li id=\"prevpage\"><a href=javascript:void(0);>上一页</a></li>'
                    + '<li id=\"currentpage\"><div class=\"areaSelect\">' + optionStr + '</div></li>'
                    + '<li id=\"nextpage\"><a href=javascript:void(0);>下一页</a></li>'
                    + '</ul>';
            } else {
                that.html += '<li id=\"prevpage\"><a href=\"' + prevurl + '\">上一页</a></li>'
                    + '<li id=\"currentpage\"><div class=\"areaSelect\">' + optionStr + '</div></li>'
                    + '<li id=\"nextpage\"><a href=\"' + nexturl + '\">下一页</a></li>'
                    + '</ul>';
            }
            osection.className = that.options.sectionClassName;
            osection.innerHTML = that.html;
        }
    };
    var localUrl = window.location.href;
    var pageIndex = 1;
    if (location.href.match(/page=(\d+)/)) {
        // 有showtype就替换没有就不替换
        pageIndex = localUrl.match(/page=(\d{1,})/) === null ? 0 : localUrl.match(/page=(\d{1,})/)[1];
    } else {
        pageIndex = localUrl.match(/_(\d+)_/) === null ? 0 : localUrl.match(/_(\d+)_/)[1];
    }
    var pageSize = 10;
    if (pageIndex !== 0 || pageSize !== 0) {
        pageIndex = parseInt(pageIndex);
        pageSize = parseInt(pageSize);
    }
    return page;
});
