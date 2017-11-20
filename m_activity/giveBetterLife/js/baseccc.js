
/**
* @Author: fenglinzeng
* @Date: 2016/05/17
* @description: **Main JS of GiveYouBetter**
* @Last Modified by: **null**
* @Last Modified time: **null**
*/

'use strict';

// static city data
// 城市数据，本来是要从hidden的input里获取的，但是因为城市数据的拼音不规则，却还要进行拼音输入的联想，故把城市数据写死，并添加全拼。如：'bj|北京'' 改成了 'bj|北京|beijing'
var cityData = 'bj|北京|beijing,tj|天津|tianjin,sh|上海|shanghai,dl|大连|dalian,jn|济南|jinan,qd|青岛|qingdao,sz|深圳|shenzhen,suzhou|苏州|suzhou,sy|沈阳|shenyang,sjz|石家庄|shijiazhuang,nanjing|南京|nanjing,gz|广州|guangzhou,zj|湛江|zhanjiang,zhenjiang|镇江|zhenjiang,zz|郑州|zhengzhou,taiyuan|太原|taiyuan,ts|唐山|tangshan,hz|杭州|hangzhou,hrb|哈尔滨|haerbin,yt|烟台|yantai,anshan|鞍山|anshan,qhd|秦皇岛|qinhuangdao,cq|重庆|chongqing,cd|成都|chengdu,cs|长沙|changsha,changchun|长春|changchun,jl|吉林|jilin,rz|日照|rizhao,pingdingshan|平顶山|pingdingshan,panjin|盘锦|panjin,anyang|安阳|anyang,wuhan|武汉|wuhan,cz|常州|changzhou,dg|东莞|dongguan,dy|东营|dongying,dz|德州|dezhou,daqing|大庆|daqing,dandong|丹东|dandong,datong|大同|datong,gy|贵阳|guiyang,hn|海南|hainan,hf|合肥|hefei,nm|呼和浩特|huhehaote,hd|邯郸|handan,nc|南昌|nanchang,nn|南宁|nanning,nb|宁波|ningbo,wuxi|无锡|wuxi,weihai|威海|weihai,wf|潍坊|weifang,xian|西安|xian,fs|佛山|foshan,fz|福州|fuzhou,fushun|抚顺|fushun,yz|扬州|yangzhou,lz|兰州|lanzhou,nt|南通|nantong,nanyang|南阳|nanyang,sanya|三亚|sanya,sx|绍兴|shaoxing,xn|西宁|xining,xm|厦门|xiamen,xz|徐州|xuzhou,km|昆明|kunming,huizhou|惠州|huizhou,ks|昆山|kunshan,changshu|常熟|changshu,chenzhou|郴州|chenzhou,chengde|承德|chengde,changzhi|长治|changzhi,bt|包头|baotou,bd|保定|baoding,bh|北海|beihai,baoji|宝鸡|baoji,binzhou|滨州|binzhou,bengbu|蚌埠|bengbu,benxi|本溪|benxi,baicheng|白城|baicheng,bozhou|亳州|bozhou,baoshan|保山|baoshan,bazhong|巴中|bazhong,baishan|白山|baishan,baiyin|白银|baiyin,huaian|淮安|huaian,heze|菏泽|heze,gaomi|高密|gaomi,st|汕头|shantou,xt|湘潭|xiangtan,xx|新乡|xinxiang,ls|丽水|lishui,tz|台州|taizhou,jx|嘉兴|jiaxing,jh|金华|jinhua,wz|温州|wenzhou,wj|吴江|wujiang,wlcb|乌兰察布|wulancabu,jc|晋城|jincheng,xj|乌鲁木齐|wulumuqi,mianyang|绵阳|mianyang,mas|马鞍山|maanshan,yc|宜昌|yichang,lyg|连云港|lianyungang,ly|洛阳|luoyang,liuzhou|柳州|liuzhou,lf|廊坊|langfang,lc|聊城|liaocheng,linyi|临沂|linyi,leshan|乐山|leshan,lvliang|吕梁|lvliang,liaoyang|辽阳|liaoyang,liaoyuan|辽源|liaoyuan,linfen|临汾|linfen,guilin|桂林|guilin,ganzhou|赣州|ganzhou,wuhu|芜湖|wuhu,shunde|顺德|shunde,qz|泉州|quanzhou,qiqihaer|齐齐哈尔|qiqihaer,yinchuan|银川|yinchuan,huzhou|湖州|huzhou,hs|衡水|hengshui,hengyang|衡阳|hengyang,hanzhong|汉中|hanzhong,yl|玉林|yulin,yk|营口|yingkou,jy|江阴|jiangyin,taizhou|泰州|taizhou,tc|太仓|taicang,taian|泰安|taian,tieling|铁岭|tieling,zs|中山|zhongshan,zhuzhou|株洲|zhuzhou,zh|珠海|zhuhai,zb|淄博|zibo,sq|宿迁|suqian,jm|江门|jiangmen,quzhou|衢州|quzhou,zhoushan|舟山|zhoushan,zjg|张家港|zhangjiagang,zhangjiakou|张家口|zhangjiakou,jiujiang|九江|jiujiang,jining|济宁|jining,anqing|安庆|anqing,fuyang|阜阳|fuyang,ahsuzhou|宿州|suzhou,fuxin|阜新|fuxin,zhangzhou|漳州|zhangzhou,longyan|龙岩|longyan,luohe|漯河|luohe,pingxiang|萍乡|pingxiang,jxfuzhou|抚州|fuzhou,erds|鄂尔多斯|eerduosi,enshi|恩施|enshi,qj|潜江|qianjiang,huangshi|黄石|huangshi,shiyan|十堰|shiyan,sanming|三明|sanming,xiangyang|襄阳|xiangyang,xingtai|邢台|xingtai,ezhou|鄂州|ezhou,xiaogan|孝感|xiaogan,xuchang|许昌|xuchang,xinzhou|忻州|xinzhou,xuancheng|宣城|xuancheng,huaihua|怀化|huaihua,huanggang|黄冈|huanggang,shaoguan|韶关|shaoguan,maoming|茂名|maoming,shangqiu|商丘|shangqiu,suihua|绥化|suihua,shaoyang|邵阳|shaoyang,songyuan|松原|songyuan,sanmenxia|三门峡|sanmenxia,mudanjiang|牡丹江|mudanjiang,zhaoqing|肇庆|zhaoqing,meizhou|梅州|meizhou,shanwei|汕尾|shanwei,qingyuan|清远|qingyuan,jieyang|揭阳|jieyang,zaozhuang|枣庄|zaozhuang,zhoukou|周口|zhoukou,zhumadian|驻马店|zhumadian,suizhou|随州|suizhou,jiaozuo|焦作|jiaozuo,jingzhou|荆州|jingzhou,jiamusi|佳木斯|jiamusi,jixi|鸡西|jixi,jian|吉安|jian,wuzhou|梧州|wuzhou,fangchenggang|防城港|fangchenggang,qinzhou|钦州|qinzhou,guigang|贵港|guigang,baise|百色|baise,hechi|河池|hechi,honghe|红河|honghe,guyuan|固原|guyuan,zigong|自贡|zigong,zhangjiajie|张家界|zhangjiajie,luzhou|泸州|luzhou,suining|遂宁|suining,neijiang|内江|neijiang,nanchong|南充|nanchong,meishan|眉山|meishan,guangan|广安|guangan,guangyuan|广元|guangyuan,ziyang|资阳|ziyang,ningde|宁德|ningde,nanping|南平|nanping,guan|固安|guan,ankang|安康|ankang,zunyi|遵义|zunyi,anshun|安顺|anshun,bijie|毕节|bijie,qujing|曲靖|qujing,qdn|黔东南|qiandongnan,zhaotong|昭通|zhaotong,lijiang|丽江|lijiang,luan|六安|luan,laiwu|莱芜|laiwu,lincang|临沧|lincang,chuxiong|楚雄|chuxiong,xishuangbanna|西双版纳|xishuangbanna,dali|大理|dali,dehong|德宏|dehong,xianyang|咸阳|xianyang,xinyang|信阳|xinyang,xinyu|新余|xinyu,xiangxi|湘西|xiangxi,xianning|咸宁|xianning,xianghe|香河|xianghe,liangshan|凉山|liangshan,hegang|鹤岗|hegang,hebi|鹤壁|hebi,huainan|淮南|huainan,huaibei|淮北|huaibei,huangshan|黄山|huangshan,huludao|葫芦岛|huludao,heyuan|河源|heyuan,hezhou|贺州|hezhou,heihe|黑河|heihe,dazhou|达州|dazhou,deyang|德阳|deyang,chaoyang|朝阳|chaoyang,chaohu|巢湖|chaohu,chizhou|池州|chizhou,chifeng|赤峰|chifeng,chuzhou|滁州|chuzhou,cangzhou|沧州|cangzhou,chaozhou|潮州|chaozhou,chongzuo|崇左|chongzuo,changde|常德|changde,weinan|渭南|weinan,yanan|延安|yanan,shangluo|商洛|shangluo,yancheng|盐城|yancheng,yueyang|岳阳|yueyang,yanbian|延边|yanbian,yingtan|鹰潭|yingtan,yuxi|玉溪|yuxi,yichun|宜春|yichun,sxyulin|榆林|yulin,yibin|宜宾|yibin,yongzhou|永州|yongzhou,shuozhou|朔州|shuozhou,zhongwei|中卫|zhongwei,jinchang|金昌|jinchang,tianshui|天水|tianshui,zhangye|张掖|zhangye,pingliang|平凉|pingliang,qingyang|庆阳|qingyang,longnan|陇南|longnan,zhuozhou|涿州|zhuozhou,tongchuan|铜川|tongchuan,tonghua|通化|tonghua,qiannan|黔南|qiannan,qianxinan|黔西南|qianxinan,puyang|濮阳|puyang,panzhihua|攀枝花|panzhihua,putian|莆田|putian,puer|普洱|puer,laibin|来宾|laibin,lps|六盘水|liupanshui,loudi|娄底|loudi,jinzhong|晋中|jinzhong,jinzhou|锦州|jinzhou,jingdezhen|景德镇|jingdezhen,jingmen|荆门|jingmen,jiayuguan|嘉峪关|jiayuguan,jiuquan|酒泉|jiuquan,shizuishan|石嘴山|shizuishan,wuzhong|吴忠|wuzhong,wuwei|武威|wuwei,shangrao|上饶|shangrao,siping|四平|siping,shuangyashan|双鸭山|shuangyashan,kelamayi|克拉玛依|kelamayi,changxing|长兴|changxing,xiantao|仙桃|xiantao,pingtan|平潭|pingtan,hechuan|合川|hechuan,wanzhou|万州|wanzhou,fuling|涪陵|fuling,qianjiang|黔江|qianjiang,qitaihe|七台河|qitaihe,qijiang|綦江|qijiang,tl|通辽|tongliao,tongling|铜陵|tongling,tongren|铜仁|tongren,kashi|喀什|kashi,kaifeng|开封|kaifeng,deqing|德清|deqing,dingxi|定西|dingxi,yili|伊犁|yili,yangjiang|阳江|yangjiang,yangquan|阳泉|yangquan,yaan|雅安|yaan,yiyang|益阳|yiyang,yunfu|云浮|yunfu,hljyichun|伊春|yichun,yuncheng|运城|yuncheng,yongchuan|永川|yongchuan,yanjiao|燕郊|yanjiao,yixing|宜兴|yixing,byne|巴彦淖尔|bayannaoer,bazhou|巴州|bazhou,akesu|阿克苏|akesu,shihezi|石河子|shihezi,changji|昌吉|changji,macau|澳门|macau,zy|招远|zhaoyuan,fq|福清|fuqing,tianmen|天门|tianmen,wenling|温岭|wenling,linhai|临海|linhai,zhuji|诸暨|zhuji,sxly|临猗|linyi,tengzhou|滕州|tengzhou,pingdu|平度|pingdu,xintai|新泰|xintai,zoucheng|邹城|zoucheng,xam|兴安盟|xinganmeng,pizhou|邳州|pizhou,xinghua|兴化|xinghua,rugao|如皋|rugao,taixing|泰兴|taixing,dongtai|东台|dongtai,qidong|启东|qidong,jiangdu|江都|jiangdu,haimen|海门|haimen,hnyz|禹州|yuzhou,changge|长葛|changge,yanling|鄢陵|yanling,yangchun|阳春|yangchun,huoqiu|霍邱|huoqiu,tongcheng|桐城|tongcheng,liyang|溧阳|liyang,nanchuan|南川|nanchuan,ruzhou|汝州|ruzhou,sg|寿光|shouguang,abazhou|阿坝州|abazhou,fengdu|丰都|fengdu,haining|海宁|haining,tongliang|铜梁|tongliang,jiangjin|江津|jiangjin,changshou|长寿|changshou,cixi|慈溪|cixi,lasa|拉萨|lasa,yuyao|余姚|yuyao,tongxiang|桐乡|tongxiang,shangyu|上虞|shangyu,pinghu|平湖|pinghu,zjfy|富阳|fuyang,ninghai|宁海|ninghai,feicheng|肥城|feicheng,laizhou|莱州|laizhou,zouping|邹平|zouping,jiaonan|胶南|jiaonan,longkou|龙口|longkou,xinyi|新沂|xinyi,gaoyou|高邮|gaoyou,jingjiang|靖江|jingjiang,zunhua|遵化|zunhua,qianan|迁安|qianan,nanan|南安|nanan,longhai|龙海|longhai,huian|惠安|huian,changle|长乐|changle,shishi|石狮|shishi,gongyi|巩义|gongyi,pulandian|普兰店|pulandian,kaiping|开平|kaiping,taishan|台山|taishan,enping|恩平|enping,rudong|如东|rudong,yizheng|仪征|yizheng,jintan|金坛|jintan,jimo|即墨|jimo,laixi|莱西|laixi,changyi|昌邑|changyi,guangrao|广饶|guangrao,penglai|蓬莱|penglai,linan|临安|linan,jiande|建德|jiande,zjtl|桐庐|tonglu,zjxs|象山|xiangshan,yuhuan|玉环|yuhuan,xinzheng|新郑|xinzheng,xingyang|荥阳|xingyang,yichuan|伊川|yichuan,yanshi|偃师|yanshi,wafangdian|瓦房店|wafangdian,donggang|东港|donggang,fengcheng|凤城|fengcheng,feixi|肥西|feixi,nongan|农安|nongan,ruijin|瑞金|ruijin,haian|海安|haian,fenghua|奉化|fenghua,jssn|睢宁|suining,jsfx|丰县|fengxian,peixian|沛县|peixian,anqiu|安丘|anqiu,qingzhou|青州|qingzhou,linqu|临朐|linqu,chunan|淳安|chunan,zhongmou|中牟|zhongmou,dengfeng|登封|dengfeng,pengzhou|彭州|pengzhou,dangyang|当阳|dangyang,yidu|宜都|yidu,fjax|安溪|anxi,lianjiang|连江|lianjiang,lujiang|庐江|lujiang,feidong|肥东|feidong,dangtu|当涂|dangtu,jinxian|进贤|jinxian,xinjian|新建|xinjian,zhaodong|肇东|zhaodong,binxian|宾县|binxian,anda|安达|anda,anning|安宁|anning,yongdeng|永登|yongdeng,yuzhong|榆中|yuzhong,huidong|惠东|huidong,baoying|宝应|baoying,sdjy|济阳|jiyang,sdsh|商河|shanghe,sdcl|昌乐|changle,laiyang|莱阳|laiyang,hnxa|新安|xinan,hnyy|宜阳|yiyang,xinmi|新密|xinmi,dingzhou|定州|dingzhou,xinji|辛集|xinji,luanxian|滦县|luanxian,yutian|玉田|yutian,lnzh|庄河|zhuanghe,xinmin|新民|xinmin,liaozhong|辽中|liaozhong,scjt|金堂|jintang,qionglai|邛崃|qionglai,liuyang|浏阳|liuyang,ningxiang|宁乡|ningxiang,yongchun|永春|yongchun,ahcf|长丰|changfeng,dehui|德惠|dehui,jlys|榆树|yushu,lantian|蓝田|lantian,shuyang|沭阳|shuyang,zhangqiu|章丘|zhangqiu,jiyuan|济源|jiyuan,ganzi|甘孜|ganzi,hlbe|呼伦贝尔|hulunbeier,xlglm|锡林郭勒盟|xilinguolemeng,dxal|大兴安岭|dxal,nujiang|怒江|nujiang,diqing|迪庆|diqing,hetian|和田|hetian,tulufan|吐鲁番|tulufan,hami|哈密|hami,kzls|克孜勒苏|kezilesu,betl|博尔塔拉|boertala,linxia|临夏|linxia,gannan|甘南|gannan,rikaze|日喀则|rikaze,changdu|昌都|changdu,naqu|那曲|naqu,haidong|海东|haidong,haixi|海西|haixi,songxian|嵩县|songxian,hbjz|晋州|jinzhou,luannan|滦南|luannan,zhijiang|枝江|zhijiang,gdlm|龙门|longmeng,sdpy|平阴|pingyin,luoning|洛宁|luoning,mengjin|孟津|mengjin,ruyang|汝阳|ruyang,gaobeidian|高碑店|gaobeidian,hbzx|赵县|zhaoxian,hbwj|无极|wuji,hbql|青龙|qinglong,hblt|乐亭|laoting,qianxi|迁西|qianxi,faku|法库|faku,kangping|康平|kangping,chongzhou|崇州|chongzhou,dayi|大邑|dayi,huxian|户县|huxian,zhouzhi|周至|zhouzhi,hengxian|横县|hengxian,gxby|宾阳|bingyang,wuchang|五常|wuchang,shangzhi|尚志|shangzhi,bayan|巴彦|bayan,yilan|依兰|yilan,qingxu|清徐|qingxu,kaiyang|开阳|kaiyang,xiuwen|修文|xiuwen,jr|句容|jurong,linqing|临清|linqing,wenan|文安|wenan,xinle|新乐|xinle,hbys|元氏|yuanshi,liling|醴陵|liling,youxian|攸县|youxian,xiangxiang|湘乡|xiangxiang,huaiyuan|怀远|huaiyuan,wuhe|五河|wuhe,guzhen|固镇|guzhen,zhaozhou|肇州|zhaozhou,zhaoyuan|肇源|zhaoyuan,ynyl|宜良|yiliang,dongfang|东方|dongfang,boluo|博罗|boluo,heshan|鹤山|heshan,qixia|栖霞|qixia,haiyang|海阳|haiyang,hbbz|霸州|bazhou,changli|昌黎|changli,hbps|平山|pingshan,dujiangyan|都江堰|dujiangyan,xinjin|新津|xinjin,qingzhen|清镇|qingzhen,danzhou|儋州|danzhou,wanning|万宁|wanning,hailin|海林|hailin,wuan|武安|wuan,yangqu|阳曲|yangqu,gaoling|高陵|gaoling,zhenhai|镇海|zhenhai,wujiaqu|五家渠|wujiaqu,jncq|长清|changqing,jiaozhou|胶州|jiaozhou,ytcd|长岛|changdao,njgc|高淳|gaochun,quanshan|泉山|quanshan,tongshan|铜山|tongshan,funing|阜宁|funing,jiangyan|姜堰|jiangyan,yongning|邕宁|yongning,cswc|望城|wangcheng,whhn|汉南|hannan,dengzhou|邓州|dengzhou,lankao|兰考|lankao,ksys|玉山|yushan,renqiu|任丘|renqiu,luoyuan|罗源|luoyuan,minqing|闽清|minqing,yongtai|永泰|yongtai,quangang|泉港|quangang,wenshan|文山|wenshan,wuhai|乌海|wuhai,dazu|大足|dazu,bishan|璧山|bishan,tongnan|潼南|tongnan,jianyang|简阳|jianyang,leiyang|耒阳|leiyang,tjjx|蓟县|jixian,hbjs|京山|jingshan,fuan|福安|fuan,huadian|桦甸|huadian,lnta|台安|taian,luanchuan|栾川|luanchuan,puning|普宁|puning,jxfc|丰城|fengcheng,haicheng|海城|haicheng,gongzhuling|公主岭|gongzhuling,xilinhaote|锡林浩特|xilinhaote,fanchang|繁昌|fanchang,jinhu|金湖|jinhu,emeishan|峨眉山|emeishan,huairen|怀仁|huairen,zhongxiang|钟祥|zhongxiang,kuitun|奎屯|kuitun,jxja|靖安|jingan,yongcheng|永城|yongcheng,ya|永安|yongan,dh|德化|dehua,shennongjia|神农架|shennongjia,cn|常宁|changning,alsm|阿拉善盟|alashanmeng,lhk|老河口|laohekou,hbzy|枣阳|zaoyang,hailaer|海拉尔|hailaer,haibei|海北|haibei,hbyc|宜城|yicheng,wg|舞钢|wugang,huangnan|黄南|huangnan,guoluo|果洛|guoluo,hbsz|深州|shenzhou,jz|冀州|jizhou,yushu|玉树|yushu,hbsh|三河|sanhe,linzhi|林芝|linzhi,haiyan|海盐|haiyan,twproperty|台湾|taiwan,vancouer|温哥华|wengehua,hkproperty|香港|xianggang,sgproperty|新加坡|xinjiapo';

// globalVars
// 全局变量
var page1 = $('#page1'),
    page2 = $('#page2'),
    page3 = $('#page3'),
    page4 = $('#page4'),
    page5 = $('#page5'),
    audioReceive = $('#audioReceive')[0],
    audioSend = $('#audioSend')[0],
    audioBGM = $('#audioBGM')[0],
    audioCamera = $('#audioCamera')[0],
    audioType = $('#audioType')[0],
    ui1 = $('#ui1'),
    ui2 = $('#ui2'),
    ui3 = $('#ui3'),
    shutter = $('#shutter'),
    used = $('#used'),
    reset = $('#reset'),
    title = $('.title'),
    group = $('.step1').find('.group'),
    privateTip = $('#privateTip'),
    parentGroup = $('.step2').find('.group'),
    parentTip = $('#parentTip'),
    ok = $('.ok'),
    privateDoneTip = $('#privateDoneTip'),
    privateDone = $('#privateDone'),
    sendTip = $('#sendTip'),
    fumu = $('.fumu'),
    send = $('#send'),
    step2 = $('.step2'),
    mySend = $('.mySend'),
    shutterWhite = $('#shutterWhite'),
    commClick = $('#commClick'),
    newComm = $('.newComm');


// get HiddenVars
// 获取隐藏域数据
var hiddenVars = {};
$('input[type=hidden]').each(function (index, elem) {
    hiddenVars[elem.id] = elem.value;
});

// if user from APP or Wechat,replace avatar&name
// 如果用户是从房天下APP或者微信访问页面，后台会把用户昵称和头像传到隐藏域里，这里进行替换
var myAvatar = $('.myAvatar'),
    nickname = $('#nickname');
if (hiddenVars.headimgurl) {
    myAvatar.attr('src', hiddenVars.headimgurl);
}
if (hiddenVars.nickname) {
    nickname.html(hiddenVars.nickname);
}

// change page title
// 修改网页标题，实现在聊天动画页面时标题显示老妈，
// 动画结束后再调用这个方法设置回来，在phoneLeave方法里
function changeTitle(name) {
    document.title = name;
}
// change title when using wechat
function wxTitle() {
    changeTitle('老妈');
}

// WechatAudio
// 微信声音的播放，遍历消息li，当li的动画end的时候，播放对应的声音
// 之所以余2，是因为消息是一收一发的，所以声音也就是一收一发的交替播放
function WechatAudio() {
    page1.find('li').each(function (i) {
        $(this).one('webkitAnimationEnd', function () {
            if (i % 2 === 0) {
                audioReceive.play();
            } else {
                audioSend.play();
            }
            // 当最后一条消息显示后，隔两秒执行phoneLeave方法
            if (i === 5) {
                setTimeout(phoneLeave, 2000);
            }
        });
    });
}

// basetime用于配合currentTime来控制rAF的执行帧率
var baseTime = null;
function cameraMovable() {
    baseTime = new Date().getTime();
    requestAnimationFrame(spriteBg);
}

// dosomething when phone leave
// 当聊天界面结束，执行此方法，
// 主要就是隐藏page1显示page2，同时page2的canvas开始渲染，同时改回标题
function phoneLeave() {
    audioBGM.play();
    page1.hide();
    renderBg.draw();
    page2.show();
    changeTitle('我想给你更好的生活');
    // dropPhone();
    cameraMovable();
}

// render Camera
// 这个方法是控制相机挪动的，
// 通过接收deviceorientation传来的event.gamma数据，
// 判断处理后赋值给Canvas的dx，实现画布图像的移动来模拟相机视野的变化
function openMove(event) {
    renderBg.dx = (event.gamma * 1.5 - camCenter);
    if (renderBg.dx > 0) {
        renderBg.dx = 0;
    }else if (renderBg.dx < cWidth - autoWidth) {
        renderBg.dx = cWidth - autoWidth;
    }
    currentTime = new Date().getTime();
    if (currentTime - baseTime > 100) {
        renderBg.draw();
        baseTime = currentTime;
    }
}

// move Camera eventListener by DeviceOrientationEvent
// 之所以在监听和执行中间加了一个函数是为了方便传参和取消监听
var handler = function (event) {
    openMove(event);
};

// Camera Show
// 这个方法是在page1聊天界面结束后的一系列Canvas动画结束后，渲染相机的
function setCam() {
    ui1.show();
    ui2.show();
    window.addEventListener('deviceorientation', handler, false);
}

// showRedDotTip
// 显示小红点，就是发朋友圈的时候提示的小红点
function showRedTip(cls) {
    setTimeout(function () {
        cls.show();
    }, 500);
}

// non-scrollable
// 当noScroll设置为true的时候，禁用touchMove以实现禁用滚动
// 免得页面渲染动画时用户在页面上乱划会阻碍浏览器对动画的渲染
var noScroll = true;
function Scroll(ev) {
    if (noScroll) {
        ev.preventDefault();
        ev.stopPropagation();
    }
}
document.addEventListener('touchmove', Scroll, false);

// ScrollAble when at page5(houseListPage)
// 如果在页面5，是不需要禁止滑动的，也就是输入城市和房租范围后跳转到的列表页
if (page5.hasClass('page5')) {
    noScroll = false;
}

// 这个开关用来控制背景雪碧图的
// 你可以看到，背景一直能有细微的动画，
// 实现原理是不断切换起点位置绘制雪碧图的不同部分，
// 而当用户按下快门键时，页面要完全静止，而如果重拍，又开始动，
// 所以通过这个开关控制背景的雪碧绘制
var spriteAble = true;
// take Foto
// 快门键
shutter.on('touchend', function () {
    audioCamera.play();
    window.removeEventListener('deviceorientation', handler, false);
    spriteAble = false;
    page2.addClass('blackBG');
    ui1.hide();
    ui2.hide();
    ui3.show();
    shutterWhite.show().fadeOut();
});

// reTake Foto
// 重拍
reset.on('touchend', function () {
    ui3.hide();
    ui2.show();
    ui1.show();
    spriteAble = true;
    window.addEventListener('deviceorientation', handler, false);
});

// use Foto
// 使用照片
used.on('touchend', function () {
    page2.hide();
    page3.show().animate({'transform': 'translateY(0)','-webkit-transform': 'translateY(0)'}, 400).addClass('page3Up');
    audioType.play();
});

// clickAble if this param is set
// 这个变量控制用户在发朋友圈时，什么时候能点什么时候不能点
var clickAble = 0;

// end of type
// 当文字输入动画结束后
title.find('img:last').one('webkitAnimationEnd', function () {
    audioType.pause();
    showRedTip(privateTip);
    clickAble = 1;
});

// click ShareTo Button
// 谁可以看按钮
group.on('touchend', function () {
    if (clickAble >= 1) {
        step2.addClass('step2Left');
        if (clickAble === 1) {
            showRedTip(parentTip);
        }
    }
});

// When set Parent UnsharAble
// 选中父母分组后
parentGroup.on('touchend', function () {
    ok.show();
    privateDone.show();
    showRedTip(privateDoneTip);
    fumu.show();
    parentTip.hide();
    clickAble = 2;
});

// when end ShareTo setting
// 点击确定设置
privateDone.on('touchend', function () {
    if (clickAble === 2) {
        step2.removeClass('step2Left');
        privateTip.hide();
        sendTip.show();
    }
});

// when click send button
// 点击发送按钮
// audioBGM先pause后currentTime置0再play是为了在朋友圈界面重新播放背景音乐
// 用animate设置scrollTop实现自动滚动到底的动画
// audioReceive.play()之前要把BGM音乐pause()是因为安卓的音频只支持单轨播放
// 也就是说，前一个audio在play的时候play下一个音频会造成前一个音频停滞
// 而在iOS没有这个问题，至少iOS8.2没有这个问题
send.on('touchend', function () {
    if (clickAble === 2) {
        page3.fadeOut();
        audioBGM.pause();
        page4.delay(800).fadeIn(function () {
            mySend.addClass('zoomInLeft');
            audioBGM.currentTime = 0.0;
            audioBGM.play();
            $('html,body').delay(1000).animate({
                scrollTop: page4.height() - cHeight
            }, 8000, function () {
                newComm.addClass('db');
                $('.other').fadeIn('fast');
                $('html,body').scrollTop(page4.height() - cHeight);
                audioBGM.pause();
                audioReceive.play();
                $(audioBGM).attr('loop', 'true');
                $('#audioReceive').one('ended', function () {
                    audioBGM.play();
                });
                noScroll = false;
            });
        });
    }
});

// when click jumpTo button
// 页面滚动到页面底部时，提示您有一条信息消息
// 点击这个提示时，animate控制scrollTop跳到顶部
commClick.on('touchend', function () {
    $('html,body').animate({
        scrollTop: 180
    });
});


/**
 * All about that fucking Canvas
 */

// Cross-browser compatibility support for requestAnimationFrame
// 为rAF做兼容处理，而根据http://caniuse.com/#search=requestAnimationFrame显示
// 除非实在是老爷机，否则都是支持rAF的
var lastTime = 0;
var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}

// Set-up the canvas
// 初始化Canvas
var cWidth = document.body.clientWidth;
var cHeight = document.body.clientHeight;
// var cWidth = window.innerWidth;
// var cHeight = window.innerHeight;
console.log(cWidth,cHeight)
var myCanvas = $('#myCanvas')[0];
if (myCanvas) {
    myCanvas.width = cWidth;
    myCanvas.height = cHeight;
    var context = myCanvas.getContext('2d');
}

// Sprites this BG shit
// 背景的雪碧图一些变量的初始化
var bgSprite = [];
bgSprite.img = new Image();
bgSprite.img.src = '//static.test.soufunimg.com/common_m/m_activity/giveBetterLife/images/bgs.jpg';
bgSprite.w = 738;
bgSprite.h = 720;
bgSprite.state = 0;
// 因为图片的渲染高度等于画布的高度
// 而原始图片的长宽比是1.025
var autoWidth = cHeight / 1.025;
// 为了居中，进行一下相减除以2。
// 嗯，这是一个数学问题。233333
var camCenter = (autoWidth - cWidth) / 2;

/**
 * [renderCamera 相机视野的绘制]
 * @param  {[object]} img      [背景用哪个图片]
 * @param  {[number]} dx       [背景相对画布的X轴的位置]
 * @param  {[number]} interval [每次绘制的间隙（间隔）]
 */
function renderCamera(img, dx, interval) {
    // 相机要左右挪动画布，所以可变
    this.dx = 0;
    // 相机不上下动，恒为0
    this.dy = 0;
    // 绘制间隔
    this.interval = interval;
    // 绘制的图片
    this.img = img;
    // 图片绘制的宽度
    this.dw = autoWidth;
    // 图片绘制的高度
    this.dh = cHeight;
}

// Yo Yo,画起来
renderCamera.prototype.draw = function() {
    // 每次画之前清除一下画布，不然会留下残影
    context.clearRect(0, 0, cWidth, cHeight);
    // 因为绘制的图片用的雪碧图，所以要有一个状态变量
    if (bgSprite.state === 3) {
        // 因为背景雪碧图只有3张，所以画到3后要回到起点
        bgSprite.state = 0;
    }
    // 相对于图片的绘制绘制 —— X轴
    this.sx = bgSprite.w * bgSprite.state;
    // 相对于图片的绘制绘制 —— Y轴
    this.sy = 0;
    // 画起来
    context.drawImage(this.img, this.sx, this.sy, bgSprite.w, bgSprite.h, this.dx, this.dy, this.dw, this.dh);
    // 此帧雪碧图画完后，状态码++，画下一帧
    // spriteAble就是前面提到的画面静止或变化的开关
    // 对，就是按下快门键和重拍键的那个
    if (spriteAble) {
        bgSprite.state++;
    }else{
        bgSprite.state = 1;
    }
};

// 实例化一下
var renderBg = new renderCamera(bgSprite.img, 0, 250);

// console.log(renderBg.dh);

// 因为用了rAF（默认60帧），为了降低绘制帧频，用时间间隔的方式来限制
// 是的，就是配合前面那个baseTime
var currentTime = null;

// 用rAF定时执行绘制方式
// 如果现在的时间戳比之前的时间戳的间隔大于renderBg.interval，执行Canvas渲染
function spriteBg() {
    currentTime = new Date().getTime();
    if (currentTime - baseTime > renderBg.interval) {
        renderBg.draw();
        spritedropPhone();
        moveVision();
        spriteFeets();
        spritePickCamera();
        baseTime = currentTime;
    }
    requestAnimationFrame(spriteBg);
}


// dropPhone Sprites
// 放下手机的雪碧图动画
var dropPhoneSprite = [];
dropPhoneSprite.img = new Image();
dropPhoneSprite.img.src = '//static.test.soufunimg.com/common_m/m_activity/giveBetterLife/images/dropPhone_s.png';
dropPhoneSprite.w = 405;
dropPhoneSprite.h = 641;
dropPhoneSprite.state = 0;

function spritedropPhone() {
    // 雪碧图有5帧，结束后打开下一个动画方法的开关
    if (dropPhoneSprite.state === 5) {
        moveVisionAble = true;
    }
    var sx = dropPhoneSprite.w * dropPhoneSprite.state,
        sy = 0,
        dx = (cWidth - dropPhoneSprite.w) / 2,
        dy = cHeight - dropPhoneSprite.h;
    context.drawImage(dropPhoneSprite.img, sx, sy, dropPhoneSprite.w, dropPhoneSprite.h, dx, dy, dropPhoneSprite.w, dropPhoneSprite.h);
    dropPhoneSprite.state++;
}


// moveVision
// 移动视野的动画
// 这个moveEdge就是画布移动的边界，
// PS:这个moveEdge的+20是怕超出边界，所以强行+了20以缩小边界
var moveVisionAble = false,
    moveEdge = cWidth - autoWidth + 20;
function moveVision() {
    // 通过移动画布来实现视野移动的效果
    if (moveVisionAble) {
        // 画布移动到边界
        if (renderBg.dx <= moveEdge) {
            renderBg.dx = moveEdge + 20;
            feetAble = true;
            moveVisionAble = false;
        }
        // 通过dx的-=20来实现画布移动
        renderBg.dx -= 20;
        renderBg.draw();
    }
}


// feet Sprites
// 跷二郎腿
// 其实思路和前面的都一样
// 最后静置为8是为了让二郎腿一直显示于页面中
var feetSprite = [];
feetSprite.img = new Image();
feetSprite.img.src = '//static.test.soufunimg.com/common_m/m_activity/giveBetterLife/images/feets_s.png';
feetSprite.w = 394;
feetSprite.h = 219;
feetSprite.state = 0;
var feetAble = false;

function spriteFeets() {
    if (feetAble) {
        if (feetSprite.state >= 9) {
            feetSprite.state = 8;
            pickCameraAble = true;
        }
        var sx = feetSprite.w * feetSprite.state,
            sy = 0,
            dx = (cWidth - feetSprite.w) / 2,
            dy = cHeight - feetSprite.h;
        context.drawImage(feetSprite.img, sx, sy, feetSprite.w, feetSprite.h, dx, dy, feetSprite.w, feetSprite.h);
        feetSprite.state++;
    }
}


// pickCamera Sprites
// 拿起相机的雪碧动画
var pickCameraSprite = [];
pickCameraSprite.img = new Image();
pickCameraSprite.img.src = '//static.test.soufunimg.com/common_m/m_activity/giveBetterLife/images/pickCamera_s.png';
pickCameraSprite.w = 394;
pickCameraSprite.h = 624;
pickCameraSprite.state = 0;
var pickCameraAble = false;

function spritePickCamera() {
    if (pickCameraAble) {
        if (pickCameraSprite.state === 5) {
            setCam();
        }
        var sx = pickCameraSprite.w * pickCameraSprite.state,
            sy = 0,
            dx = (cWidth - pickCameraSprite.w) / 2,
            dy = cHeight - pickCameraSprite.h;
        context.drawImage(pickCameraSprite.img, sx, sy, pickCameraSprite.w, pickCameraSprite.h, dx, dy, pickCameraSprite.w, pickCameraSprite.h);
        pickCameraSprite.state++;
    }
}

// filter CityList
// 这个是城市信息的联想筛选
var inputCity = $('#inputCity'),
    cityList = $('#cityList'),
    userInput = '',
    selectFromList = false,
    rentPrice,
    subInput,
    inputLen = 0,
    // citysOrigin = cityData.split(',');
    citys = cityData.split(',');

// 城市数据有问题，有的城市重复，故去重
// 本来打算走一遍去重，但既然数据都写死了，不如直接删数据吧
// function uniqueArr(arr) {
//     var ret = [];
//     for (var i = 0; i < arr.length; i++) {
//         var item = arr[i].split('|')[1];
//         if (ret.indexOf(item) === -1) {
//             ret.push(item);
//         } else {
//             console.log(item);
//         }
//     }
//     return ret;
// }

// clear input cache
// 清除输入的缓存
inputCity.val('');

// change placeholder
// 修改输入框的placeholder，免得再去修改jsp
$('#inputCity').attr('placeholder', '请输入城市全拼或汉字');

// 由于城市数据的拼音不规则
// 和后台协商后决定写死
// 并加上全拼字段
// 以下是联想筛选
// 思路就是substring(0, inputLen)去匹配城市数据
var cityPY,
    cityCN,
    cityHTML = '';
function filterInput(userInput,inputLen) {
    if (userInput) {
        subInput = userInput.substring(0, inputLen);
        cityHTML = '';
        for (var i = 0, len = citys.length; i < len; i++) {
            cityPY = citys[i].split('|')[2].substring(0, inputLen);
            cityCN = citys[i].split('|')[1].substring(0, inputLen);
            if (subInput === cityPY || subInput === cityCN) {
                // cityList.children('li').hide();
                cityHTML += '<li data-py="' + citys[i].split('|')[0] + '">' + citys[i].split('|')[1] + '</li>';
            }
        }
        cityList.html('').html(cityHTML).children('li').show();
    }
}

// filter when input
// 输入的时候，获取输入内容进行简单处理后执行匹配方法
inputCity.on('input', function () {
    userInput = inputCity.val().toLowerCase().trim();
    inputLen = userInput.length;
    if (inputLen === 0) {
        cityList.children('li').hide();
    }
    filterInput(userInput,inputLen);
});

// this param is use for URI
// 这个变量是用来ajax传给后台的
var citypinyin;

// set DOM when finish select
// 点击匹配列表的匹配城市后
cityList.on('click', 'li', function () {
    inputCity.val($(this).text());
    citypinyin = $(this).attr('data-py');
    cityList.find('li').hide();
    selectFromList = true;
});

// get input space & show inputList when focus
// focus输入框时，将页面scrollTop以避免输入法遮挡输入框
inputCity.on('focus', function () {
    var $this = $(this);
    setTimeout(function () {
        $('html,body').scrollTop($this.offset().top - 10);
    },500);
    // console.log(userInput);
    // alert($this.offset().top);
    filterInput(userInput,userInput.length);
});

// hide cityList when end input(blur is not good enough in this case)
// 点击页面空白处时，隐藏联想筛选的下拉列表
page4.on('click', function () {
    cityList.children('li').hide();
});

// send info
// 发送按钮
$('#searchHouse').on('click', function () {
    userInput = inputCity.val();
    // console.log(userInput);
    if (!selectFromList) {
        alert('抱歉，只支持查询选择列表中的城市。');
        return;
    }
    rentPrice = $('#rentPrice').find('option:selected').text();
    // 后台让传经过两次encodeURIComponent后的中文城市名给他
    var userInput = encodeURIComponent(encodeURIComponent(userInput)),
        priceMin = rentPrice.split('-')[0],
        priceMax = rentPrice.split('-')[1];
    // 产品和运营说，租金3500以上的范围取3500-6000
    if (!priceMax) {
        priceMax = 6000;
        priceMin = 3500;
    }
    // 按照后台给的规则直接跳转到指定页面
    window.location = '/huodongAC.d?class=BetterLifeHc&m=getEsfListByCityAndPrice&city=' + userInput + '&citypinyin=' + citypinyin + '&pricemin=' + priceMin*600 + '&pricemax=' + priceMax * 600;
});

// if this city has no house data，insert img tip
// 有的城市没有匹配数据，如果没有，就插入一个提示图片
var houseList = $('.houseList'),
    hasHouse = houseList.find('li');
if (hasHouse.length == 0) {
    houseList.find('ul').html('<div class="list-no"><img src="//static.test.soufunimg.com/common_m/m_activity/giveBetterLife/images/xiaoqu_wu.png" width="100%"></div>');
}


// about Login
// 登录相关

// DOM of floatAlerts
var login = $('#login'),
    loginBtn = $('#loginBtn'),
    close = $('.close');

// DOM of Login
var getCode = $('#getCode'),
    phone = $('#phone'),
    code = $('#code');

// allowGetcode、Login timeCounter & timer
var allowGet = true,
    timeCount = 60,
    verifyTimer = null;

// Reg of Phone & vCode
var phoneNumReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/,
    codeReg = /^\d{6}$/;

// update timeCounter
function updateTime() {
    allowGet = false;
    clearInterval(verifyTimer);
    verifyTimer = setInterval(function () {
        timeCount--;
        getCode.val('(' + timeCount + ')');
        if (timeCount < 0) {
            clearInterval(verifyTimer);
            getCode.val('获取验证码');
            timeCount = 60;
            allowGet = true;
        }
    }, 1000);
}

// getCode Click Event
getCode.on('click', function (ev) {
    ev.stopPropagation();
    if (allowGet) {
        var phoneNum = phone.val().trim();
        if (!phoneNum) {
            alertMsg('手机号不能为空');
            return false;
        }
        if (!phoneNumReg.test(phoneNum)) {
            alertMsg('请正确输入手机号');
            return false;
        }
        getCode.val('准备发送').show();

        // use public login util
        getPhoneVerifyCode(phoneNum, function () {
            alertMsg('验证码发送成功，请注意查收');
            updateTime();
        }, function (msg) {
            alertMsg(msg);
            getCode.val('获取验证码');
        });
    }
});

$('#getCoupon').on('touchend', function () {
    if (!hiddenVars.userId) {
        noScroll = true;
        login.fadeIn('fast').css('top', $(document).scrollTop());
        return false;
    }
    // getCoupon Info
    $.ajax({
        url: '/huodongAC.d?class=BetterLifeHc&m=adoptCoupon',
        type: 'GET',
        data: {},
        success: function (data) {
            if (data.res === 's') {
                alertMsg('恭喜成功获得1200元装修大礼包');
            }else if (data.res === 'f') {
                alertMsg('失败');
            }else if (data.res === 'o') {
                alertMsg('只能领取一次哟！');
            }
        },
        error: function (data) {
            alertMsg('网络错误');
        }
    });
    noScroll = false;
});

// loginSubmit Click Event
loginBtn.on('click', function (ev) {
    ev.stopPropagation();
    var phoneNum = phone.val().trim();
    var codeNum = code.val().trim();
    if (!phoneNum) {
        alertMsg('手机号不能为空');
        return false;
    }
    if (!phoneNumReg.test(phoneNum)) {
        alertMsg('请正确输入手机号');
        return false;
    }
    if (!codeNum) {
        alertMsg('请输入验证码');
        return false;
    }
    if (!codeReg.test(codeNum)) {
        alertMsg('验证码输入错误');
        return false;
    }

    // Login Successful or not
    $('#logined').val(phoneNum);
    hiddenVars.userId = phoneNum;
    noScroll = false;
    sendVerifyCodeAnswer(phoneNum, codeNum, function () {
        login.fadeOut();
    }, function (msg) {
        alertMsg(msg);
    });
    return true;
});

close.on('click', function () {
    login.fadeOut();
    noScroll = false;
});

// DOM of alertMsg
var msg = $('#msg'),
    msgText = msg.find('p'),
    msgTimer = null;

/**
 * [消息弹层]
 * @param  {[number]} text     [弹层内容]
 * @param  {[number]} time     [自动消失时间]
 * @param  {Function} callback [回调函数]
 */
function alertMsg(text, time, callback) {
    var alertText = text || '发生错误';
    var showTime = time || 2000;
    msgText.html(alertText);
    msg.fadeIn('fast').css({
        position: 'absolute',
        top: $(document).scrollTop() + cHeight / 2
    });
    clearTimeout(msgTimer);
    msgTimer = setTimeout(function () {
        msg.fadeOut();
        callback && callback();
    }, showTime);
}

// 页面加载完成后，执行这两个方法
jQuery(document).ready(function ($) {
    WechatAudio();
    wxTitle();
    // phoneLeave();
    // bindEvent();
});
