$(function () {
    var flag = {
        uploadFlag: true,
        firstFlag: true
    };
    var lengthLimit = 50;
    $('.upload').on('click', function () {
        var length = $('.asktext').val().trim().length;
        if (length <= 0) alert('问题不能为空');
        if (length > lengthLimit) alert('问题限制50字');
        if (length > 0 && length <= lengthLimit && flag.uploadFlag) {
            uploadAjaxFn();
        }
    });
    $('.asktext').on('input', function () {
        var content = $(this).val().trim();
        if (content.length >= lengthLimit) {
            $(this).val(content.substr(0, lengthLimit));
        }
        $('.ASKarea span').text($(this).val().trim().length + '/50');
    });

    /**
     * 请求ajax方法
     * @return {[type]} 没有返回值
     */
    function uploadAjaxFn() {
        var dataObj = parseUrlFn();
        dataObj.title = $('.asktext').val().trim();
        if (flag.uploadFlag) {
            flag.uploadFlag = false;
            ajaxFn(dataObj);
        }
    }

    /**
     * ajax实际调用
     * @param  {[type]} dataObj url参数对象
     * @return {[type]}         没有返回值
     */
    function ajaxFn(dataObj) {
        var url = location.protocol + '//' + document.location.host + '/huodongAC.d?m=submitAskProcess&class=LoanQuestionHc';
        for (var pro in dataObj) {
            url += '&' + pro + '=' + encodeURIComponent(encodeURIComponent(dataObj[pro]));
        }
        var timeEnd = new Date(2017,3,2).getTime();
        if(timeEnd < new Date().getTime()) {
            $.get(url).done(function (data) {
                if (data.code === '100') {
                    alert('提交成功');
                    window.location.href = location.protocol + '//' + document.location.host + '/huodongAC.d?m=showQuestion&class=LoanQuestionHc';
                    flag.uploadFlag = true;
                } else if(flag.firstFlag) {
                    flag.firstFlag = false;
                    ajaxFn(dataObj);
                } else {
                    alert(data.message === 'noMES' ? '提交失败' : data.message);
                    flag.uploadFlag = true;
                }
            });
        }
    }

    /**
     * 解析当前url方法
     * @return {[type]} 解析对象
     */
    function parseUrlFn() {
        var obj = {};
        var href = window.location.href;
        var index = href.indexOf('?');
        var parameterArr = href.substring(index + 1).split('&');
        parameterArr.forEach(function (item) {
            var arr = item.split('=');
            obj[arr[0]] = decodeURIComponent(arr[1]);
        });
        console.log(obj);
        return obj;
    }
});