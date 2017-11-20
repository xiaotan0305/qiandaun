/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/world/simplesearch',['jquery'],function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var simpleSearch = $('#simpleSearch'),options = {};
    $('input[type=hidden]').each(function (index,element) {
        options[element.id] = element.value;
    });
    var listChagneUrl = vars.worldSite + '?c=world&a=index&listType=listModel&=src=' + options.src;
    var fcChangeUrl = vars.worldSite + '?c=world&a=index&src=' + options.src;

    function replaceParamVal(url,arg,argVal) {
        var pattern = arg + '=([^&]*)';
        var replaceText = arg + '=' + argVal;
        var returnValue;
        if (url.match(pattern)) {
            var tmp = '/(' + arg + '=)([^&]*)/gi';
            returnValue = url.replace(tmp,replaceText);
        }else if (url.match('[\?]')) {
            returnValue = url + '&' + replaceText;
        }else {
            returnValue = url + '?' + replaceText;
        }
        return returnValue;
    }
    function implodeUrl(thisUrl,urlP) {
        return thisUrl + urlP + '&r=' + Math.random();
    }
    function jumpUrlSearh(param,val) {
        var paramCopy = param;
        if (param === 'allSel') {
            paramCopy = '';
        }
        var thisUrlParam = '';
        var pricemin,pricemax;
        var thisUrl = '';
        if (val === 'price') {
            if (paramCopy !== '') {
                var priceArr = paramCopy.split(',');
                pricemin = priceArr[0];
                pricemax = priceArr[1];
                thisUrlParam = '&pricemax=' + pricemax + '&pricemin=' + pricemin;
            }else {
                thisUrlParam = '';
                pricemin = 'max';
                pricemax = 'max';
            }
        }else {
            thisUrlParam = '&' + val + '=' + paramCopy;
        }
        if (options.worldChangeUrl === '') {
            if (options.listType !== '') {
                window.location = implodeUrl(listChagneUrl,thisUrlParam);
            }else {
                window.location = implodeUrl(fcChangeUrl,thisUrlParam);
            }
        }else if (val === 'price') {
            var thisUrltemp = replaceParamVal(options.worldChangeUrl,'pricemax',pricemax);
            thisUrl = replaceParamVal(thisUrltemp,'pricemin',pricemin);
        }else {
            thisUrl = replaceParamVal(options.worldChangeUrl,val,paramCopy);
        }
        window.location = thisUrl + '&src=' + options.src + '&r=' + Math.random();
    }
    simpleSearch.find('select').on('change',function () {
        jumpUrlSearh(this.value, this.name);
    });
});