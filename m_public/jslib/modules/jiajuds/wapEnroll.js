define('modules/jiajuds/wapEnroll', ['jquery', 'verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var verifycode = require('verifycode/1.0.0/verifycode');
        //
        var patternname = /^[a-zA-Z0-9]{1,20}$|^[\u4e00-\u9fa5]{1,10}$/;
        var patterntel = /^1[3,4,5,7,8]\d{9}$/;
        var patterncode = /^\d{4}$/;
        var isEnroll = false;
        var tnow = 30;
        //   status = 0;
        var loginphone = vars.loginphone;
        var siteUrl = vars.siteUrl;
        var city = vars.city;
        var userid = vars.userid;
        var username = vars.username;
        var $districtId = $('#district');
        var $phoneId = $('#phone');
        var $zxtypeId = $('#zxtype');
        var $citynameId = $('#cityname');
        var area = [];
        area.bj = ['昌平区', '朝阳区', '崇文区', '大兴区', '东城区', '房山区', '丰台区', '海淀区', '怀柔区', '门头沟区', '密云县', '平谷区', '石景山区', '顺义区', '通州区', '西城区', '宣武区', '延庆县', '亦庄经济技术开发区', '燕郊', '北京周边'];
        area.cd = ['郫县', '邛崃市', '成华区', '崇州市', '大邑县', '都江堰市', '金牛区', '金堂县', '锦江区', '高新区', '高新西区', '龙泉驿区', '彭州市', '蒲江县', '青白江区', '青羊区', '双流县', '温江区', '武侯区', '新都区', '新津县', '成都周边'];
        area.cs = ['芙蓉区', '浏阳市', '长沙县', '长沙经济开发区', '开福区', '宁乡县', '天心区', '望城县', '星沙区', '雨花区', '岳麓区'];
        area.cz = ['溧阳市', '金坛市', '戚墅堰区', '天宁区', '武进区', '新北区', '钟楼区'];
        area.cq = ['壁山县', '綦江县', '潼南县', '巴南区', '北碚区', '北部新区', '长寿区', '城口县', '大渡口区', '大足县', '垫江县', '丰都县', '奉节县', '涪陵区', '高新区', '江北区', '江津区', '九龙坡区', '合川区', '郊县', '开县',
            '梁平县', '南岸区', '南川区', '彭水苗族土家族自治县', '黔江区', '荣昌县', '沙坪坝区', '石柱土家族自治县', '双桥区', '铜梁县', '万盛区', '万州区', '巫山县', '巫溪县', '武隆县', '万洲', '秀山土家族苗族自治县', '永川区',
            '酉阳土家族苗族自治县', '渝北区', '渝中区', '云阳县', '忠县'];
        area.dl = ['长海县', '长兴岛', '高新园区', '甘井子区', '金州区', '开发区', '旅顺口区', '普兰店市', '普湾新区', '沙河口区', '瓦房店市', '西岗区', '中山区', '庄河市'];
        area.gz = ['白云区', '从化市', '番禺区', '海珠区', '花都区', '黄埔区', '萝岗区', '荔湾区', '南沙区', '清远区', '天河区', '越秀区', '增城市', '广州周边'];
        area.hf = ['滨湖新区', '包河区', '长丰县', '巢湖市', '肥东县', '肥西县', '高新技术开发区', '经济技术开发区', '庐江县', '庐阳区', '蜀山区', '新站区', '瑶海区', '政务新区'];
        area.hz = ['滨江区', '淳安县', '富阳市', '拱墅区', '建德市', '江干区', '临安市', '上城区', '桐庐县', '西湖区', '下城区', '萧山区', '下沙', '余杭区', '之江', '杭州周边'];
        area.jn = ['长清区', '济阳县', '高新区', '槐荫区', '历城区', '历下区', '平阴县', '商河县', '市中区', '天桥区', '章丘市'];
        area.nc = ['安义县', '昌北区', '东湖区', '进贤县', '高新技术开发区', '红谷滩', '南昌经济技术开发区', '南昌县', '青山湖区', '青云谱区', '桑海经济开发区', '湾里区', '西湖区', '新建县', '英雄经济技术开发区'];
        area.nn = ['邕宁区', '北海市', '宾阳县', '防城港区', '桂林市', '江南区', '横县', '良庆区', '隆安县', '马山县', '青秀区', '钦州市', '上林县', '武鸣县', '兴宁区', '西乡塘区', '周边地区'];
        area.nanjing = ['溧水县', '白下区', '高淳县', '鼓楼区', '建邺区', '江宁区', '六合区', '浦口区', '栖霞区', '秦淮区', '下关区', '玄武区', '雨花台区', '南京周边'];
        area.nb = ['鄞州区', '北仑区', '慈溪市', '东钱湖旅游渡假区', '奉化市', '高新区', '江北区', '江东区', '杭州湾新区', '海曙区', '宁海县', '象山县', '余姚市', '镇海区'];
        area.qd = ['崂山区', '城阳区', '即墨市', '胶南市', '胶州市', '高密市', '海阳市', '黄岛区', '开发区', '李沧区', '莱西市', '平度市', '市北区', '市南区', '四方区'];
        area.suzhou = ['沧浪区', '常熟市', '工业园区', '高新区', '金阊区', '虎丘区', '昆山市', '平江区', '太仓市', '吴江市', '吴中区', '相城区', '新区', '园区', '张家港市', '苏州周边'];
        area.sh = ['闵行区', '宝山区', '长宁区', '崇明县', '奉贤区', '嘉定区', '金山区', '静安区', '虹口区', '黄浦区', '卢湾区', '南汇区', '浦东新区', '普陀区', '浦东', '青浦区', '松江区', '望城区', '徐汇区', '杨浦区', '闸北区', '上海周边'];
        area.sy = ['大东区', '东陵区', '法库县', '和平区', '皇姑区', '浑南新区', '康平县', '辽中县', '沈河区', '苏家屯区', '沈北新区', '铁西区', '新民市', '新城子区', '于洪区'];
        area.sz = ['宝安区', '大鹏新区', '福田区', '光明新区', '龙华区', '龙岗区', '罗湖区', '南山区', '坪山新区', '盐田区', '深圳周边'];
        area.sjz = ['栾城县', '藁城市', '保定', '长安区', '高邑县', '晋州市', '井陉矿区', '井陉县', '开发区', '灵寿县', '鹿泉市', '平山县', '桥东区', '桥西区', '深泽县', '无极县', '辛集市', '新华区', '新乐市', '行唐县', '裕华区', '元氏县',
            '赞皇县', '赵县', '正定县', '正定新区'];
        area.tj = ['滨海新区', '宝坻区', '北辰区', '大港区', '东丽区', '蓟县', '津南区', '静海县', '汉沽区', '和平区', '河北区', '河东区', '河西区', '红桥区', '开发区', '南开区', '宁河县', '塘沽区', '武清区', '西青区'];
        area.taiyuan = ['古交市', '尖草坪区', '晋源区', '娄烦县', '清徐县', '万柏林区', '小店区', '杏花岭区', '阳曲县', '迎泽区', '榆次县'];
        area.wuhan = ['硚口区', '蔡甸区', '东西湖区', '江岸区', '江汉区', '江夏区', '汉南区', '汉阳区', '洪山区', '黄陂区', '青山区', '沌口区', '武昌区', '新洲区', '阳逻区', '武汉周边'];
        area.wuxi = ['北塘区', '滨湖区', '崇安区', '惠山区', '江阴市', '马山区', '南长区', '锡山区', '新区', '宜兴市'];
        area.xian = ['灞桥区', '碑林区', '长安区', '城北区', '城东区', '城内', '城南', '城西区', '高陵县', '高新区', '户县', '蓝田县', '莲湖区', '临潼区', '未央区', '新城区', '阎良区', '雁塔区', '周至县'];
        area.zz = ['荥阳市', '巴彦县', '宾县', '登封市', '二七区', '巩义市', '管城回族区', '金水区', '高新技术开发区', '惠济区', '经济技术开发区', '上街区', '新密市', '新郑市', '郑东新区', '中牟县', '中原区'];
        area.dg = ['东莞市', '茶山镇', '长安镇', '常平镇', '大朗镇', '大岭山镇', '道滘镇', '东城区', '东坑镇', '凤岗镇', '高埗镇', '横沥镇', '洪梅镇', '厚街镇', '虎门镇', '黄江镇', '寮步镇', '麻涌镇', '南城区',
            '企石镇', '桥头镇', '清溪镇', '沙田镇', '石碣镇', '石龙镇', '石排镇', '松山湖镇', '塘厦镇', '莞城区', '万江区', '望牛墩镇', '谢岗镇', '樟木头镇', '中堂镇'];
        // end
        $(document).ready(function () {
            if (patterntel.test(loginphone) === false) {
                $('#yan').show();
                $('#changeNum').css('visibility', 'hidden');
            } else {
                $phoneId.val(loginphone);
                $('#yan').hide();
                $('#changeNum').css('visibility', 'visible');
            }
            // new0610 if (Object.prototype.toString.call(area[city])
            if (city !== 'bj') {
                if (Object.prototype.toString.call(area[city]) === '[object Array]') {
                    $districtId.empty();
                    $districtId.append('<option value="">区/县</option>');
                    for (var index in area[city]) {
                        $districtId.append('<option value="' + area[city][index] + '">' + area[city][index] + '</option>');
                    }
                }
            }
        });
        $('#changeNum').click(function () {
            $('#yan').show();
            $phoneId.val('');
        });
        $('#hbisWrong').click(function () {
            $(this).hide();
        });

        $('#uname').focus(function () {
            $('#nametext').removeClass('tips fc00').text('');
            $(this).attr('style', ' ');
        }).blur(function () {
            if (patternname.test($('#uname').val()) === false) {
                $('#nametext').addClass('tips fc00').text('输入正确的姓名');
            }
        }).keyup(function () {
        });

        $('#vcode').focus(function () {
            $('#codetext').removeClass('tips fc00').text('');
        }).blur(function () {
            if (patterncode.test($('#vcode').val()) === false) {
                $('#codetext').addClass('tips fc00').text('验证码输入错误，请重新输入');
            }
        });

        $phoneId.focus(function () {
            $('#phonetext').removeClass('tips fc00').text('');
            $('#changeNum').css('visibility', 'visible');
            $('#yan').show();
        }).blur(function () {
            if (patterntel.test($phoneId.val()) === false) {
                $('#phonetext').addClass('tips fc00').text('您输入的手机号码不正确');
            } else if ($phoneId.val() === loginphone) {
                $('#yan').hide();
            }
        }).change(function () {
            $('#yan').show();
        });
        // zxtype,cityname,district
        $zxtypeId.focus(function () {
            $('#zxtypetext').removeClass('tips fc00').text('');
        }).blur(function () {
            if ($zxtypeId.find('option:selected').val() === false) {
                $('#zxtypetext').addClass('tips fc00').text('请选择装修类型');
            }
        });
        // cityname,默认是北京
        $citynameId.focus(function () {
            $('#citytext').removeClass('tips fc00').text('');
        }).blur(function () {
            if ($citynameId.find('option:selected').val() === false) {
                $('#citytext').addClass('tips fc00').text('请选择城市和区/县');
            }
        }).change(function () {
            var cValue = $citynameId.find('option:selected').val();
            $districtId.empty();
            $districtId.append('<option value="">区/县</option>');
            for (var index in area[cValue]) {
                $districtId.append('<option value="' + area[cValue][index] + '">' + area[cValue][index] + '</option>');
            }
        });
        // district,默认是北京
        $districtId.focus(function () {
            $('#citytext').removeClass('tips fc00').text('');
        }).blur(function () {
            if ($districtId.find('option:selected').val() === false) {
                $('#citytext').addClass('tips fc00').text('请选择城市和区/县');
            }
        });

        function setnum() {
            if (tnow > 0) {
                $('#sendcode').val('发送中(' + tnow + ')');
                tnow -= 1;
                setTimeout(setnum, 1000);
            } else {
                $('#sendcode').val('重新发送');
                tnow = 30;
            }
        }

        var flag = true;
        $('#sendcode').click(function () {
            var mobilephone = $phoneId.val();
            if (patterntel.test(mobilephone) && flag) {
                flag = false;
                verifycode.getPhoneVerifyCode(mobilephone, function () {
                    setnum();
                    flag = true;
                }, function () {
                    flag = true;
                });
            } else {
                flag = true;
                alert('手机号码输入不正确！');
                $('#phonetext').addClass('tips fc00').text('请输入11位手机号码！');
                return false;
            }
        });
        var $_GET = (function () {
            var url = window.document.location.href.toString();
            var u = url.split('?');
            if (typeof(u[1]) === 'string') {
                u = u[1].split('&');
                var get = {};
                for (var i in u) {
                    var j = u[i].split('=');
                    get[j[0]] = j[1];
                }
                return get;
            }
            return {};
        })();

        function dealResult() {
            // 用户行为收集20151012
            require.async('jsub/_ubm.js?v=201407181100', function () {
                // 所在城市（中文）
                _ub.city = vars.cityname;
                // 固定值，家居
                _ub.biz = 'h';
                // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
                _ub.location = 0;
                var b = 20;
                var p = {
                    mp3: 'h'
                };
                // 例如_ub.collect(0,{'mhi':' 123456','mh4':'2^4','mh2':'现代简约'})
                _ub.collect(b, p);
            });
            $('#hbisWrong').show();
            setTimeout(function () {
                $('#hbisWrong').hide();
            }, 9000);
            isEnroll = true;
        }

        $('.formbtn02').click(function () {
            if (isEnroll) {
                alert('您已经报名成功~~');
                return false;
            }
            var a = $('#yan').css('display'),
                u = $('#uname').val() || '',
                m = $phoneId.val() || '',
                e = $('#vcode').val() || '',

                j = $zxtypeId.find('option:selected').val() || '',
                h = $citynameId.find('option:selected').val() || '',
                b = $districtId.find('option:selected').val() || '',
                hc = $citynameId.find('option:selected').text() || '';


            if (!patternname.test(u)) {
                $('#nametext').addClass('tips fc00').text('输入正确的姓名');
                return false;
            }
            if (!patterntel.test(m)) {
                $('#phonetext').addClass('tips fc00').text('请填手机号');
                return false;
            }
            if (a !== 'none' && e === '') {
                $('#codetext').addClass('tips fc00').text('请填写验证码');
                return false;
            }
            if (!j) {
                $('#zxtypetext').addClass('tips fc00').text('请选择装修类型');
                return false;
            }
            if (!h) {
                $('#citytext').addClass('tips fc00').text('请选择城市');
                return false;
            }
            if (!b) {
                $('#citytext').addClass('tips fc00').text('请选择区/县');
                return false;
            }
            var i = {
                username: encodeURIComponent(u),
                mobile: m,
                vcode: e,

                cityname: encodeURIComponent(hc),
                districtname: encodeURIComponent(b),
                decarationType: j,

                soufunid: userid,
                soufunname: encodeURIComponent(username),

                source: $_GET.source ? $_GET.source : 12,
                imei: 'debug'
            };
            var k = siteUrl + '?c=jiajuds&a=ajaxwapSubmit&r=' + Math.random();
            var doTH = function () {
                $.get(k, i, function (q) {
                    if (q.Info_Network === '20150521') {
                        // 正常通道
                        if (q.Result === '1') {
                            dealResult();
                        } else {
                            alert(q.Message);
                        }
                    } else {
                        alert('申请信息被外星人拦截了，请重新填写信息');
                    }
                });
            };
            if (e) {
                verifycode.sendVerifyCodeAnswer(m, e,
                    doTH, function () {
                    });
            } else {
                doTH();
            }
        });
    };
});