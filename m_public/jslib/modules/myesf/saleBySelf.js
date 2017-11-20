define('modules/myesf/saleBySelf', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $submit = $('#submit');
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        var newcountEsffabu = 0;

        function submit() {
            var title = $('#title').val();
            var contractperson = $('#contractperson').val();
            var totalfloor = $('#totalfloor').val();
            var floor = $('#floor').val();
            var fitment = $('#fitment').val();
            var boardcontent = $('#boardcontent').val();
            var gender = $('input:radio[name="gender"]:checked').val();
            // 性别
            var genderTmp = encodeURIComponent('男');
            if (gender === 'f') {
                genderTmp = encodeURIComponent('女');
            }

            var url = '/my/?c=myesf&a=addPersonalResale&city=' + vars.city + '&mobile=' + vars.mobile + '&constractPerson='
                + encodeURIComponent(contractperson) + '&gender=' + genderTmp + '&title=' + encodeURIComponent(title)
                + '&boardcontent=' + boardcontent + '&projcode=' + vars.newcode
                + '&projname=' + encodeURIComponent(vars.projname) + '&price=' + vars.price + '&room=' + vars.room
                + '&hall=' + vars.hall + '&toilet=' + vars.toilet + '&forward=' + encodeURIComponent(vars.forward)
                + '&fitment=' + fitment + '&floor=' + floor + '&totalfloor=' + totalfloor + '&buildarea=' + vars.area
                + '&livearea=' + vars.area + '&messagecode=' + vars.messageCode + '&huxingimg=' + vars.huxingimg + '&purpose=' + encodeURIComponent('住宅');

            if (contractperson === '') {
                alert('联系人不能为空');
                return;
            } else if (floor === '') {
                alert('楼层不能为空');
                return;
            } else if (totalfloor === '') {
                alert('总楼层不能为空');
                return;
            } else if (title === '') {
                alert('标题不能为空');
                return;
            }
            if (!vars.messageCode) {
                url += '&isneedverify=0';
            }

            $submit.unbind('click');
            $submit.removeClass('bg-blu').addClass('bg-gra2');
            $.get(url, function (data) {
                var json = $.parseJSON(data);
                console.log(json);
                if (json.houseinfo.result === '100') {
                    alert('发布成功');
                    window.location = '/user.d?m=myesfpage&city=' + vars.city + '&ref=geren';
                    localStorage.setItem('newcount_esffabu', newcountEsffabu + 1);
                    // 保存新发布状态信息到本地
                } else if (json.houseinfo) {
                    alert(json.houseinfo.message);
                    $submit.bind('click', submit);
                    $submit.removeClass('bg-gra2').addClass('bg-blu');
                } else {
                    alert(data);
                    $submit.bind('click', submit);
                    $submit.removeClass('bg-gra2').addClass('bg-blu');
                }
            });
        }
        $submit.on('click', function () {
            submit();
        });
    };
});