/**
 * Created by lina on 2017/7/10.
 */
define('modules/myzf/houseComplain',['floatAlert/1.0.0/floatAlert'],function(require,exports,module){
    module.exports = function(){
        var vars = seajs.data.vars;

        //****弹框蒙层对象插件****
        var floatAlert = require('floatAlert/1.0.0/floatAlert');
        var option = {type: '1'};//弹框插件样式选项
        var floatObj = new floatAlert(option);

        //****顶部提示****
        $('.zf-close').on('click', function(){
            $('.zf-tz').hide();
        });

        //****文本框****
        //申述原因文本框
        var $reason = $('#reasonTxt'),
        //申述原因文本内容
        reasonVal,
        //邮箱文本框
        $email = $('#emailTxt'),
        //文本内容
        emailVal,
        //邮箱正则验证
        emailExp = /^(\w+)@(\w+).(\w+){0,3}$/;

        //****图片上传****
        // 图片上传对象
        var imgupload,
        //图片地址
        imgurls;
        require.async(['imageUpload/1.0.0/imageUpload_myzf'], function (ImageUpload) {
            imgupload = new ImageUpload({
                sonTemp: '<dd></dd>',
                fatherTemp: '<dl></dl>',
                // 图片显示模版
                imgTemp: '<img width="60" class="imgClass">',
                // 删除图片按钮模版
                delBtnTemp: '<a class="close"></a>',
                // loading样式
                loadingGif: vars.public + 'images/loading.gif',
                // 添加图片按钮模版
                inputTemp: '<input type="file" name="pic0" id="pic0" accept="image/*" class="upload-input" multiple="">',
                // 图片容器
                container: '#imgcon',
                // input的容器样式
                inputClass: 'pic',
                imgCountId: '',
                // 上传图片地址
                url: '?c=myesf&a=ajaxUploadImg&city=' + vars.city,
                // 最多上传图片
                maxLength: 5,
                // 额外上传按钮，例如论坛中点击图片
                richInputBtn: '',
                // 已上传图片地址，用作编辑时，目前是以：'图片名1,图片地址1;图片名2,图片地址2' 这种形式拼接
                imgsUrl: '',
                // 数量改变时执行的回调
                numChangeCallback: function (count) {
                    //if (count === 0) {
                    //    $showpicId.css('display', 'block').find('dl').addClass('wi80');
                    //}
                }
            });
        });

        //****获取上传图片路径****
        function getImgUrlFileName() {
            var imgsArray = imgupload.imgsArray;
            var arr = [], titleImg;
            if (imgsArray) {
                for (var i = 0; i < imgsArray.length; i++) {
                    arr.push(imgsArray[i].imgurl);
                }
                if (imgsArray[0]) {
                    titleImg = imgsArray[0].imgurl;
                } else {
                    titleImg = '';
                }
            }
            return [titleImg, arr.join(',')];
        }

        //****验证函数****
        function vertify() {
            emailVal = $email.val();
            reasonVal = $reason.val();
            imgurls = getImgUrlFileName()[1];
            if (!reasonVal) {
                floatObj.showMsg('申诉原因不能为空', 2000);
                return false;
            } else if (reasonVal.length >20) {
                floatObj.showMsg('申诉原因字数不大于20', 2000);
                return false;
            } else if (emailVal && !emailExp.test(emailVal)) {
                floatObj.showMsg('请您输入规范的邮箱地址', 2000);
                return false;
            } else if (!imgurls) {
                floatObj.showMsg('请上传相关图片', 2000);
                return false;
            } else {
                return true;
            }
        }

        //****提交验证****
        $('#submit').on('click',function(){
            if (!vertify()){
                return false;
            }
            var param = {
                remark: reasonVal,
                email: emailVal,
                imgs: imgurls,
                houseid: vars.houseid,
            };
            $.ajax({
                url: vars.mySite + '?c=myzf&city=' + vars.city + '&a=ajaxHouseComplain',
                data: param,
                type:'post',
                success:function(data){
                    if(data){
                        if(data.errcode === '100'){
                            floatObj.showMsg('提交成功', 3000);
                        } else {
                            floatObj.showMsg(data.errmsg, 3000);
                        }
                        window.location.href =  vars.mySite + '?c=myzf&city=' + vars.city;
                    }
                },
                error:function(err){
                    floatObj.showMsg(err);
                }
            })
        })
    }
});