/*
 * Ϊ��js����ֲ�������һ��򵥵�jquery���
 *  @param int pagesize ÿҳ���� Ĭ��Ϊ15��
 *  @param curp ��ҳ��ʼֵĬ��Ϊ 2���ӵڶ�ҳ��ʼ���÷�ҳ����
 *  @param pageUrl ajax��ҳ��ַ
 *  @param totalcount ����
 *  @param w
 * ��ǰ�����Ҫ�󶨵Ķ���
 */
(function($,window,document,undefined) {

    var $window=$(window);
    $.fn.pagination=
        function(options) {

            var $self=$(this);
            var $container;
            var settings={
                event:"scroll",
                effect:"fadeIn",
                pagesize:15,
                curp:2,
                k:true,
                w:window,
                totalcount:1,
                pageUrl:false,
                target:document,
            };
            // ��������ֵ
            if(options){
                $.extend(settings,options);
            };
            /* Cache container as jQuery as object. */
            $container=(settings.w===undefined||settings.w===window)?$window:$(settings.w);
            $target=(settings.target===undefined||settings.target)?settings.target:$(document);
            $pageNum=Math.ceil(settings.totalcount/settings.pagesize)||1;
            /*
             * Fire one scroll event per scroll. Not one scroll event per image.
             */
            if(0===settings.event.indexOf("scroll")){
                $container.get(0).addEventListener(settings.event,function(event) {

                    scrollh=(/iphone|ipod|ipad/gi).test(navigator.userAgent.toLowerCase())?$(document).height()-140:$(document).height()-80;
                    if($container.scrollTop()+$container.height()>=scrollh&&settings.k){
                        if(settings.totalcount) if($pageNum<=1||settings.curp>$pageNum){
                            $self.html('');
                            return false;
                        }else{
                            $self.html(template());
                        }
                        pageAjax();
                    }
                },false);
            }
            // ��ҳ
            function pageAjax() {

                var res=$.ajax(settings.pageUrl+"&r="+Math.random(),{
                    data:{
                        'page':settings.curp,
                        'pn':settings.pagesize
                    },
                    beforeSend:function(xhr) {

                        $self.html(template());
                        settings.k=false;
                    }
                });
                res.done(function(data) {

                    var result=$(data);
                    if(typeof window.imagesLoaded!=="undefined"){
                        result.imagesLoaded(function() {

                            $target.append(result);
                        });
                    }else{
                        $target.append(result);
                    }
                    settings.curp=parseInt(settings.curp)+1;
                });
                res.always(function() {

                    $self.html(template());
                    setTimeout(settings.k=true,600);
                });
            }
            function template() {

                var $dis=(settings.k==true)?false:true;
                var temp=
                    [
                        '<div class="draginner fblu" align="center"',
                        'style="'+($dis?"padding-left:10px;":"padding-left:0;"),
                        'font-size: 16px;color: #003399; height:37px;line-height: 37px;margin: 0 auto;width:150px;'+
                                ($dis?"background:url(http:// img2.soufun.com/wap/touch/img/load.gif) 0 50% no-repeat":"")+'">', ($dis?"���ڼ������Ժ�":"�����Զ����ظ���")+'</div>'];
                return temp.join("");
            }
            return this;
        };
})(jQuery,window,document);