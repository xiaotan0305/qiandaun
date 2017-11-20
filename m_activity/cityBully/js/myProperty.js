// data:2015/8/26
// developer:tan
// description:小城霸主 列表页
$(function () {
    'use strict';
    $('tbody tr').on('click', function () {
        var me = $(this);
        var projectname = me.find('td:eq(0)').text().trim();
        var city = me.attr('data-city').trim();
        var nore = me.attr('data-nore').trim();
        var aStatus = me.find('td:eq(1)').text().trim();
        var bStatus = me.find('td:eq(2)').text().trim();
        var methodname = '';
        var status = '';
        if (me.index() > 0) {
            if (aStatus === '通过' || aStatus === '一') {
                if ((bStatus === '审核中' || bStatus === '一') && nore === 'N') {
                    methodname = 'getBindNB';
                    status = 'a';
                } else if ((bStatus === '审核中' || bStatus === '一') && nore === 'E') {
                    methodname = 'getBindEB';
                    status = 'a';
                } else if (bStatus === '通过' || bStatus === '不通过') {
                    methodname = 'getBindA';
                    if (bStatus === '通过') {
                        status = 'all';
                    } else {
                        status = 'a';
                    }
                } else {
                    alert('参数错误！');
                    return;
                }
            } else {
                methodname = 'getBindA';
                status = 'none';
            }
            window.location.href = window.location.origin + '/huodongAC.d?m=' + methodname + '&class=CityBullyHc&city=' + encodeURI(encodeURI(city)) + '&projectname=' + encodeURI(encodeURI(projectname)) + '&nore=' + nore + '&Status=' + status;
        } else {
            return false;
        }
    });
});