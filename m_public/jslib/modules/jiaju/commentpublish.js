define('modules/jiaju/commentpublish', ['jquery','jwingupload/1.0.4/jwingupload.source'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        var cType = $('input[data-id="c_type"]').val();
        var id = $('input[data-id="id"]').val();
        var $textarea = $('.textarea');
        // 处理华为P6浏览器对输入框兼容性问题
        var UA = window.navigator.userAgent;
        if (/P6/i.test(UA)) {
            $textarea.on('focus',function () {
                $(window).scrollTop($(document).height() - $(window).height());
            });
        }
        // ****处理结束****/
        //   ***鼠标滑过星星 begin****/
        $('.ico-star i').on('mouseover', function () {
            var objCurrentI = this;
            var iCurrentIndex = 0;
            var aI = $(this).parent().find('i');
            aI.each(function (index) {
                $(this).removeClass('active');
                if (objCurrentI === this) {
                    iCurrentIndex = index;
                }
            });
            aI.each(function (index) {
                if (iCurrentIndex === index || iCurrentIndex > index) {
                    $(this).addClass('active');
                }
            });
            $(this).parent().next().attr('point_value',iCurrentIndex + 1);
            $(this).parent().next().find('span').eq(0).html(iCurrentIndex + 1);
        });
        // ***鼠标滑过星星 end****/
        // ***评论区 begin****/
        $textarea.click(function () {
            if ($(this).attr('init_status') === 1) {
                $(this).html('');
                $(this).attr('init_status',0);
            }
        });
        // ***评论区 end****/
        var image = '';
        // ***上传图片 begin****/
        var jwupload = null;
        var jWingUpload = require('jwingupload/1.0.4/jwingupload.source');
        jwupload = jWingUpload({
            form: document.getElementsByTagName('form')[0],
            uploadPic: document.getElementById('uploadPic'),
            preview: document.getElementById('askAddPic'),
            iFrame: document.getElementsByTagName('iframe')[0],
            imgPath: vars.public,
            maxLength: 4
        });

        // *********发布评论 begin************/
        function publishcomment(id,image,co,cType,bAdd) {
            var jGetInfo = {
                c_type: cType,
                imgurl: image,
                pcontent: encodeURIComponent(co)
            };
            if (cType === 'gd') {
                jGetInfo.gongdiid = id;
                jGetInfo.pstar = $('.num').find('span').eq(0).html();
            } else {
                if (cType === 'sjs') {
                    jGetInfo.designerid = id;
                } else if (cType === 'gz') {
                    jGetInfo.gongzhangid = id;
                }
                var $num = $('.num').find('span');
                jGetInfo.gstar = $num.eq(0).html();
                jGetInfo.jstar = $num.eq(1).html();
                jGetInfo.tstar = $num.eq(2).html();
                jGetInfo.sstar = $num.eq(3).html();
            }
            $.getJSON(vars.jiajuSite + '?c=jiaju&a=submitComment&city=' + vars.city,jGetInfo, function (data) {
                $(this).attr('publish_status','ready');
                if (data.result === '0') {
                    $('.icon img').attr('src',vars.imgUrl + 'images/o-war-icon.png');
                    $('#zj_notice').html('您的评论发布失败！');
                    $('.floatAlert').css('display', 'block');
                    return;
                }
                // ***中奖提示语 begin*****/
                var sZjNotice;
                if ($('input[data-id="starttime"]').val() !== '' && $('input[data-id="endtime"]').val() !== '') {
                    sZjNotice = '您的评论发布成功！' + '<br>';
                    if (bAdd === '1') {
                        if (co.length < 20) {
                            sZjNotice += '评价20字以上才能抽奖哦~~再评一次吧！';
                        } else {
                            var aZjNotice = new Array (
                                '抽奖机会duang的一下就砸你头上了',
                                '您捡到了一次抽奖机会!'
                            );
                            var iZjNoticeIndex = Math.floor(Math.random() * aZjNotice.length);
                            sZjNotice += aZjNotice[iZjNoticeIndex];
                        }
                    } else {
                        var cName = '';
                        if (cType === 'gd') {
                            cName = '工地';
                        } else if (cType === 'sjs') {
                            cName = '设计师';
                        } else if (cType === 'gz') {
                            cName = '工长';
                        }
                        sZjNotice += '换个' + cName + '再去评价吧!';
                    }
                } else {
                    sZjNotice = '您的评论发布成功！';
                }
                // ***中奖提示语 end*****/
                $('#zj_notice').html(sZjNotice);
                $('.floatAlert').css('display', 'block');
                setTimeout(function () {
                    if ($('#success_jump_url').css('display') === 'none') {
                        $('.floatAlert').css('display', 'none');
                        if (cType === 'gd') {
                            window.location.href = vars.jiajuSite + vars.city + '/gdInfo_' + id + '.html?r=' + Math.random();
                        } else if (cType === 'sjs') {
                            window.location.href = vars.jiajuSite + vars.city + '/xgtdesigner_' + id + '.html?r=' + Math.random();
                        } else if (cType === 'gz') {
                            window.location.href = vars.jiajuSite + vars.city + '/gzInfo_' + id + '.html?r=' + Math.random();
                        }
                    }
                },2000);
            });
        }
        // *********发布评论 end************/
        // *********判断是否能获得抽奖资格 begin************/
        function getprizequalifications(id,image,co,cType) {
            var jGetInfo = {};
            jGetInfo.objid = $('input[data-id="id"]').val();
            var cType1 = $('input[data-id="c_type"]').val();
            if (cType1 === 'gd') {
                jGetInfo.type = 4;
            } else if (cType1 === 'sjs') {
                jGetInfo.type = 2;
            } else if (cType1 === 'gz') {
                jGetInfo.type = 5;
            }
            jGetInfo.starttime = $('input[data-id="starttime"]').val();
            jGetInfo.endtime = $('input[data-id="endtime"]').val();
            $.getJSON(vars.jiajuSite + '?c=jiaju&a=getPrizeQualifications&city=' + vars.city,jGetInfo, function (data) {
                var bAdd = data.isvalid;
                publishcomment(id,image,co,cType,bAdd);
            });
        }
        // ***上传图片 end****/
        $('#sub_comment').click(function () {
            // ******判断评论是否在发布中 begin******/
            $(this).attr('publish_status','publishing');
            // ******判断评论是否在发布中 end******/
            // ******验证填写 begin******/
            var bSuccess = true;
            $('.num').each(function () {
                if (!bSuccess) {
                    return;
                }
                if ($(this).find('span').eq(0).html() === '0') {
                    if (cType === 'sjs') {
                        alert('请给设计师各项打分!');
                        bSuccess = false;
                        return;
                    }
                    if (cType === 'gz') {
                        alert('请给工长各项打分!');
                        bSuccess = false;
                        return;
                    }
                    if (cType === 'gd') {
                        alert('请给工地各项打分!');
                        bSuccess = false;
                        return;
                    }
                }
            });
            if (!bSuccess) {
                return;
            }
            var sInputText = $.trim($textarea.eq(0).text());
            if (sInputText === '' || $textarea.eq(0).attr('init_status') === 1) {
                alert('请输入评论内容！');
                return false;
            }
            if (sInputText.length > 200) {
                alert('请输入少于200字评论！');
                return false;
            }
            if (!bSuccess) {
                return;
            }
            // ******验证填写 end******/
            $.each(jwupload.imgList, function (index, element) {
                if (element.dom.imgurl) {
                    image += element.dom.imgurl + ';';
                }
            });
            if ($('input[data-id="starttime"]').val() !== '' && $('input[data-id="endtime"]').val() !== '') {
                getprizequalifications(id,image,sInputText,cType);
            } else {
                publishcomment(id,image,sInputText,cType,'0');
            }
        });
        // *********判断是否能获得抽奖资格 end************/
        // *********关闭提示框  begin*******/
    };
});
