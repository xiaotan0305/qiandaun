/**
 * Created by lina on 2017/7/10.
 */
define('modules/myzf/houseIdentify', ['floatAlert/1.0.0/floatAlert'],function(require,exports,module){
    module.exports = function(){
        var vars = seajs.data.vars;
        //****弹框蒙层对象插件****
        var floatAlert = require('floatAlert/1.0.0/floatAlert');
        var option = {type: '1'};//弹框插件样式选项
        var floatObj = new floatAlert(option);

        //****协议弹窗****
        $('#xieyi').on('click', function(){
            $('.xy-out').show();
        });
        $('.close-btn').on('click', function(){
            $('.xy-out').hide();
        });
        $('.ipt-rda').on('click', function () {
            if ($(this).attr('checked') === 'checked') {
                $(this).attr('checked', false);
            } else {
                $(this).attr('checked', true);
            }
        });

        //****提交****
        $('.btn-zf').on('click', function() {
            if (!$('.ipt-rda').is(':checked')) {
                floatObj.showMsg('请同意房天下购买协议', 2000);
                return false;
            }
            var param = {
                type: vars.type,
                houseid: vars.houseid,
            };
            $.ajax({
                url: vars.mySite + '?c=myzf&city=' + vars.city + '&a=submitPayForAuth',
                data: param,
                type: 'GET',
                success:function(data){
                    if(data){
                        if (data.errcode === '100') {
                            if (data.cashier) {
                                $.each(data.cashier, function (index, val) {
                                    $('#' + index).val(val);
                                });
                                $('#form').submit();
                            }
                        } else {
                            floatObj.showMsg(data.errmsg, 3000);
                        }
                    }
                },
                error:function(err){
                    floatObj.showMsg(err);
                }
            })
        })
    }
});