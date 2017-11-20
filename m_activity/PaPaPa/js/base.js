jQuery(document).ready(function ($) {
    'use strict';

    var upUrl = '//m.test.fang.com/bbs/?c=bbs&a=ajaxUploadImage&city=bj';
    var mainSite = '//m.test.fang.com';

    var audio = document.createElement('audio');
    audio.src = '//static.test.soufunimg.com/common_m/m_activity/PaPaPa/audio/audio_yz.mp3';
    audio.id = 'testStart';
    audio.preload = 'auto';
    document.getElementById('container').appendChild(audio);

    // var getCookie = function (name) {
    //     var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    //     if (arr = document.cookie.match(reg)) {
    //         return unescape(arr[2]);
    //     }
    //     return '';
    // };
    // var setCookie = function (name, value, days) {
    //     if (days === 0) {
    //         document.cookie = name + '=' + escape(value);
    //         return;
    //     }
    //     var exp = new Date();
    //     isNaN(days) && (days = 3);
    //     exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    //     document.cookie = name + '=' + escape(value) + '; path=/; expires=' + exp.toGMTString();
    // };

    // 获取隐藏域数据
    var hiddenVars = {};
    $('input[type=hidden]').each(function (index, element) {
        hiddenVars[element.id] = element.value;
    });

    // 用来控制在滚动导航条的时候页面不滚动
    var noScroll = false;

    function Scroll(ev) {
        if (noScroll) {
            ev.preventDefault();
            ev.stopPropagation();
        }
    }
    document.addEventListener('touchmove', Scroll, false);

    var zhe = $('.zhe');

    // 信息弹层
    var msg = $('#msg'),
        msgP = msg.find('p'),
        timer = null;

    /**
     * 信息弹层
     * @param text 文本内容
     * @param time 显示时间
     * @param callback 回调函数
     */
    function showMsg(text, time, callback) {
        text = text || '信息有误！';
        time = time || 1500;
        msgP.html(text);
        msg.fadeIn();
        clearTimeout(timer);
        timer = setTimeout(function () {
            msg.fadeOut();
            callback && callback();
        }, time);
    }

    var fileObj = {};

    function filter(files) {
        return files.length > 0 ? files[0] : null;
    }

    var longTime = null;
    var longUpload = function () {
        longTime = setTimeout(function () {
            zhe.append('<p style="text-align:center;color:#fff;font-size: .6rem;margin-top:1rem;">看起来上传过程很漫长，<b onclick="location.reload()">点我重新上传</b></p>');
            clearTimeout(longTime);
        },8000);
    };

    // 图片处理
    var uploadInt = $('#uploadBtn');
    uploadInt.on('change', function (e) {
        showUploading();
        longUpload();
        var files = e.target.files || e.dataTransfer.files;
        var file = filter(files);
        if (file) {
            var reader = new FileReader(),
                uploadBase64 = '';
            // loading.show();
            setTimeout(function () {
                // jpg的图片才进行角度处理
                if (file.type === 'image/jpeg') {
                    var conf = {};
                    reader.onload = function () {
                        var result = this.result;
                        try {
                            // 获取角度
                            var jpg = new JpegMeta.JpegFile(result, file.name);
                            if (jpg.tiff && jpg.tiff.Orientation) {
                                conf.orien = jpg.tiff.Orientation.value;
                            }
                        } catch (err) {
                            console.log('throw error');
                        }

                        if (ImageCompresser.support()) {
                            var img = new Image();
                            img.onload = function () {
                                try {
                                    uploadBase64 = ImageCompresser.getImageBase64(this, conf);
                                } catch (err) {
                                    return;
                                }
                                if (uploadBase64.indexOf('data:image') < 0) {
                                    alert('上传照片格式不支持');
                                    return;
                                }
                                // TODO 上传图片到服务器
                                fileObj = {
                                    imgurl: uploadBase64,
                                    fileName: file.name,
                                    fileId: file.name.split('.')[0].replace(/[ |(|)]/g, ''),
                                    type: file.type
                                };
                                upload(fileObj);
                                // onSuccess(fileObj);
                            };
                            img.src = ImageCompresser.getFileObjectURL(file);
                        }
                    };
                    reader.readAsBinaryString(file);
                } else {
                    reader.onload = function (e) {
                        uploadBase64 = e.target.result;
                        // TODO 上传图片到服务器
                        fileObj = {
                            imgurl: uploadBase64,
                            fileName: file.name,
                            fileId: file.name.split('.')[0].replace(/[ |(|)]/g, ''),
                            type: file.type
                        };
                        upload(fileObj);
                        // onSuccess(fileObj);
                    };
                    reader.readAsDataURL(file);
                }
            }, 600);
        }
    });

    /**
     * 上传成功处理函数
     * @param fileObj 包含文件信息的对象
     * @param result 服务器返回数据
     */
    var returnUrl = '';
    function onSuccess(fileObj, result) {
        var returnData = JSON.parse(result);
        returnUrl = returnData.result;
        // var image = document.createElement('img');
        // image.src = returnData.result;
        if (returnData.result && returnData.result.indexOf('soufunimg.com') !== -1) {
            uploadDone(fileObj.imgurl);
        }
        // image.onload = function () {
            
        // };
    }

    /**
     * 上传失败
     * @param fileObj 包含文件信息的对象
     */
    function onFailure(fileObj) {
        alert('图片' + fileObj.fileName + '上传失败');
        window.location.href = mainSite + '/activityshow/paPaPa/index.jsp';
    }

    /**
     * 上传中...
     * @param fileObj 包含文件信息的对象
     */
    function onProgress(fileObj) {
        // loading.show();
    }

    /**
     * 上传文件
     * @param fileObj 包含文件信息的对象
     */
    function upload(fileObj) {
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
            // 文件上传成功或是失败
            xhr.onreadystatechange = function () {
                if (Number(xhr.readyState) === 4) {
                    if (Number(xhr.status) === 200) {
                        onSuccess(fileObj, xhr.responseText);
                    } else {
                        onFailure(fileObj, xhr.responseText);
                    }
                }
            };
            onProgress(fileObj);
            // 开始上传
            xhr.open(
                // method
                'POST',
                // target url
                upUrl + '&fileName=' + fileObj.fileName + '&type=' + fileObj.type
            );
            var formData = new FormData();
            formData.append('pic', fileObj.imgurl);
            xhr.send(formData);
        }
    }

    // 显示进度条进度条
    function showUploading() {
        // 显示进度条遮罩
        zhe.height($(window).height()).fadeIn().css('position', 'absolute');
        // 不允许滑动
        noScroll = true;
        // 进度条缓慢第一阶段
        $('.wraper').animate({
            width: '80%'
        }, 5000);
    }

    // 上传图片结束，接收到回调时执行
    function uploadDone(img) {
        clearTimeout(longTime);
        $('.wraper').stop().animate({
            width: '100%'
        }, 1000, function () {
            zhe.fadeOut();
            noScroll = true;
            // $('.con2').html('<div class="tu1"><div class="pinch ren"><img src="' + img + '" id="pinchPic" style="-webkit-transform: translate(0,0) scale(1,1)" class="animated flash infinite"></div><div class="quan"></div><div class="handle"></div></div><div class="des2"><img src="//static.test.soufunimg.com/common_m/m_activity/PaPaPa/images/ceshi_wz.png"></div><a href="javascript:void(0)" class="cs_start"></a><div class="zt" id="submitLoading"><div class="cs1"></div><div class="cs2"></div><div class="cs3"></div><div class="cs4"></div><div class="cs5"></div></div>');
            $('.con2').hide();
            $('#uploadSuc').show().find('#pinchPic').attr('src', img);
            // setCookie('imgurl', img);
            window.localStorage.setItem('baseimgurl', img);

            $('html,body').delay(233).animate({ scrollTop: 0 }, 233);

            // 定义开始和结束的位置变量
            var params = {
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0,
                scale: 1
            };
            var ttt = $('#pinchPic');

            function tMove(event) {
                var nowX = event.originalEvent.targetTouches[0].pageX;
                var nowY = event.originalEvent.targetTouches[0].pageY;
                var disX = nowX - params.startX + params.endX;
                var disY = nowY - params.startY + params.endY;
                params.scale = ttt.css('transform').match(/[0-9.\-]+/g)[0];
                ttt.css('transform', 'translate(' + disX + 'px,' + disY + 'px)' + ' ' + 'scale(' + params.scale + ',' + params.scale + ')');
                console.log('transform', 'translate(' + disX + 'px,' + disY + 'px)' + ' ' + 'scale(' + params.scale + ',' + params.scale + ')');
            }

            var handle = $('.handle');
            handle.on('touchstart', function () {
                $(this).hide();
            });

            var target = ttt[0];
            ttt.on({
                touchstart: function (event) {
                    noScroll = true;
                    var matrixArr = $(this).css('transform').match(/[0-9.\-]+/g);
                    params.endX = ~~(matrixArr[4]);
                    params.endY = ~~(matrixArr[5]);
                    params.scale = matrixArr[0];
                    // console.log(matrixArr);
                    params.startX = event.originalEvent.targetTouches[0].pageX;
                    params.startY = event.originalEvent.targetTouches[0].pageY;
                    console.log('起始位置：' + params.startX);
                    handle.hide();
                },
                touchmove: function (event) {
                    tMove(event);
                },
                touchend: function () {
                    $('.quan').css('zIndex', '2');
                    noScroll = false;
                    var fingerEnd = ~~($(this).css('transform').split(',')[4]);
                    console.log('终点位置：' + fingerEnd);

                    var timer = setTimeout(function () {
                        clearTimeout(timer);
                        ttt.on('touchmove', function (event) {
                            tMove(event);
                        });
                    }, 1234);
                },
                pinchstart: function () {
                    $('.quan').css('zIndex', '4');
                    $(this).removeClass('flash');
                    ttt.off('touchmove');
                },
                pinchchange: function (e) {
                    var translate = 'translate(' + e.offsetLeft + 'px,' + e.offsetTop + 'px)';
                    var scale = 'scale(' + e.scale + ',' + e.scale + ')';
                    var rotate = 'rotate(' + e.angle + 'deg)';
                    var value = translate + ' ' + scale + ' ' + rotate;

                    target.style[e.prefix + 'transform'] = value;
                }
            });
        });
    }

    // 分析按钮点击后的加载动画
    function loadingAnalysis() {
        var submitLoading = document.getElementById('submitLoading').getElementsByTagName('div');
        var i = 0;
        var $submitLoading = $(submitLoading);
        setInterval(function () {
            if (i > 4) {
                i = 0;
                $submitLoading.hide();
            } else {
                submitLoading[i].style.display = 'block';
                i++;
            }
        }, 300);
    }

    // 点击开始测试
    $('.con2').on('click', '.cs_start', function () {
        var rootRem = document.documentElement.style.fontSize.replace('px', '');
        var matrixArr = $('.ren img').css('-webkit-transform').match(/[0-9.\-]+/g);
        var scale = matrixArr[0];
        var transX = matrixArr[matrixArr.length - 2] / rootRem / 2;
        var transY = matrixArr[matrixArr.length - 1] / rootRem / 2;
        // var pinchPicUrl = $('#pinchPic').attr('src');
        var ramNum = ~~(Math.random() * 10);
        setTimeout(function () {
            $('#pinchPic').addClass('animated rubberBand');
        }, 0);
        testStart.play();
        $(this).hide();
        $('.zt').show();
        loadingAnalysis();
        setTimeout(function () {
            $('body').fadeOut('fast',function () {
                window.location.href = mainSite + '/activityshow/paPaPa/result.jsp?u=' + returnUrl + '&x=' + transX + '&y=' + transY + '&s=' + scale + '&r=' + ramNum;
            });
        }, 3600);
    });

    // 拆url
    function getData(url) {
        var result = {};
        var temp = url.split('?')[1].split('&');
        for (var i in temp) {
            var s = temp[i].split('=');
            result[s[0]] = s[1];
        }
        return result;
    }

    /**
     * 获取城市列表数据
     * @param val 输入框val值
     */
    function getCityList(val) {
        $.ajax({
            type: 'GET',
            url: mainSite + '/activity.d?m=getCityPinyinName&cityName=' + val,
            success: function (data) {
                var len = data.length,
                    tmpString = '';
                for (var i = 0; i < len; i++) {
                    var chName = data[i][0],
                        enName = data[i][1];
                    tmpString += '<li data-name="' + enName + '">' + chName + '</li>';
                }
                cityUl.html(tmpString);
                if (val && len > 0) {
                    cityList.show();
                } else {
                    cityList.hide();
                }
                // TODO 城市完全匹配情况下，直接选中
                if (len === 1 && data[0][0] === val) {
                    cityUl.find('li').click();
                }
            },
            error: function (data) {
                alert('失败:' + data.status);
            }
        });
    }

    var boardTimer = null,
        youtuSrc = '', baomanSrc = '',
        youTuImg = $('.youtu').find('img');
    var youtuBox = $('.youtu');

    function flashImg() {
        var flashThis = setTimeout(function () {
            clearTimeout(flashThis);
            youtuBox.empty().append(baomanSrc);
            res();
        }, 3500);
    }

    function res() {
        setTimeout(function () {
            restoreImg();
        }, 500);
    }

    var changeYoutuSrc = function () {
        boardTimer = setTimeout(function () {
            youtuBox.empty().append(baomanSrc);
            clearTimeout(boardTimer);
            changeBaomanSrc();
        }, 3500);
    };
    var changeBaomanSrc = function () {
        boardTimer = setTimeout(function () {
            youtuBox.empty().append(youtuSrc);
            clearTimeout(boardTimer);
            changeYoutuSrc();
        }, 500);
    };

    var repositionInput = function () {
        $('.xuanfang').wrap('<div style="height:3.7rem"></div>').addClass('repositionInput');
        $('body').append('<section id="zhe" class="zhe" style="display:block;position:fixed"></section>');
        $('.cejie1').hide();
        repositionAble = false;
        searchInput.focus();
        $('#zhe').on('click', function (event) {
            event.preventDefault();
            restoreInput();
        });
    };

    var hh = $('#container').height();
    var restoreInput = function () {
        $('.xuanfang').removeClass('repositionInput');
        $('section').remove('#zhe');
        $('.cejie1').show();
        repositionAble = true;
        searchInput.blur();
        $('body').animate({ scrollTop: hh }, 233);
    };

    // 如果在分享页面
    if ($('body').hasClass('result')) {
        // var urlFromCookie = getCookie('imgurl');
        var urlFromCookie = window.localStorage.getItem('baseimgurl');
        var shareUrl = window.location.href;
        var result = getData(shareUrl);
        var des31 = $('.des31'),
            keyWord = $('.keyword').find('p'),
            ren2 = $('.ren2');

        // 把图片Url和位置信息从Url里提出来
        ren2.attr('src', result.u).css('-webkit-transform', 'translate(' + result.x + 'rem, ' + result.y + 'rem) scale(' + result.s + ', ' + result.s + ') rotate(0deg)');

        if (urlFromCookie) {
            ren2.attr('src', urlFromCookie);
        }

        var who = '您';
        if (result.r) {
            // 产品给的文案
            var resultSlogan = [
                { desc: '五官端正，皮肤细腻，眉目略轻佻', type: '布局对称的两居室', why: '最好装修风格稳重、东西朝向也能使光线均匀，平衡你紊乱的气息', keyword: '对称布局、南北通透、中式装修' },
                { desc: '剑眉星目，偶头饱满，嘴唇饱满', type: '布局精巧充满创意的三居室', why: '南北朝向能够给你增添更多的欢快因子，欧式的装修风格也值得尝试', keyword: '三居、欧式风格、创意' },
                { desc: '面部线条复杂，左右略不对称，具有创造力的长相', type: '现代两层小商住', why: '回旋的楼梯能给你带来更大的发挥空间，紧邻交通线路也给你带了极大的刺激', keyword: '商住、楼梯、交通便捷' },
                { desc: '气宇轩昂，目光炯炯，淡妆浓抹总相宜', type: '气派的大别墅', why: '月色朦胧，气氛恰当，是你施展自己的时候了', keyword: '商住、楼梯、交通便捷' },
                { desc: '棱角分明，眼睛深邃', type: '闹市区的写字楼', why: '大大的落地窗适合你干练的作风', keyword: '地段、写字楼、落地窗' },
                { desc: '皮肤光泽有活力，嘴唇甜蜜诱人', type: '郊区僻静的底层住宅', why: '主要是怕引起自然灾害', keyword: '郊区，楼层' },
                { desc: '目光如炬，干净洁白，清新脱俗', type: '高耸入云的中央商务区', why: '应了那句：活好不粘人', keyword: '商务区、高层' },
                { desc: '具有文人气息，眼神充满智慧，美人尖恰到好处', type: '高档学区房', why: '充满智慧的你应当时刻与知识为伍，即使啪啪啪也要如此', keyword: '学区房、情怀' },
                { desc: '面容憔悴，目光无神', type: '户棚改造区', why: '内心压抑的你更适合在杂乱的环境中挥洒汗水，只有那样才能满足你无尽的欲望', keyword: '户棚区、嘈杂' },
                { desc: '面容精致，具有现代感', type: '超现代风格的精装LOFT', why: '科技和新鲜事物总是能够带给你无尽的遐想，尽情挥洒你的青春吧', keyword: '精装、LOFT、现代感' }
            ];

            var ramNum = result.r;

            if (shareUrl.indexOf('share') != -1) {
                who = '我';
            }

            des31.html('看' + who + resultSlogan[ramNum].desc + '，适合在' + resultSlogan[ramNum].type + '里啪啪啪，' + resultSlogan[ramNum].why);
            keyWord.html(resultSlogan[ramNum].keyword);

            youtuSrc = $('<img src="http://static.test.soufunimg.com/common_m/m_activity/PaPaPa/images/type' + ramNum + '.jpg">');
            baomanSrc = $('<img src="http://static.test.soufunimg.com/common_m/m_activity/PaPaPa/images/b' + ramNum + '.jpg">');

            var restoreImg = function () {
                youtuBox.empty().append(youtuSrc);
                flashImg();
            };
            restoreImg();

        } else {
            // 产品给的文案
            var resultBoard = [
                { desc: '用力急促而不均匀', type: '布局对称的两居室', why: '最好装修风格稳重、东西朝向也能使光线均匀，平衡你紊乱的气息', keyword: '对称布局、南北通透、中式装修' },
                { desc: '节奏稳中求胜', type: '布局精巧充满创意的三居室', why: '南北朝向能够给你增添更多的欢快因子，欧式的装修风格也值得尝试', keyword: '三居、欧式风格、创意' },
                { desc: '力量充足，气势如虹', type: '现代两层小商住', why: '回旋的楼梯能给你带来更大的发挥空间，紧邻交通线路也给你带了极大的刺激', keyword: '商住、楼梯、交通便捷' },
                { desc: '节奏张弛有度，分寸拿捏恰当，你是位十足的绅士', type: '气派的大别墅', why: '月色朦胧，气氛恰当，是你施展自己的时候了', keyword: '商住、楼梯、交通便捷' },
                { desc: '力道恰到好处，摇动准确充实', type: '闹市区的写字楼', why: '大大的落地窗适合你干练的作风', keyword: '地段、写字楼、落地窗' },
                { desc: '晃动幅度较大，容易伤人伤己', type: '郊区僻静的底层住宅', why: '主要是怕引起自燃灾害', keyword: '郊区，楼层' },
                { desc: '晃动幅度小而紧密，气息稳重不失力道', type: '高耸入云的中央商务区', why: '应了那句：活好不粘人', keyword: '商务区、高层' },
                { desc: '用力文雅，清新脱俗', type: '高档学区房', why: '充满智慧的你应当时刻与知识为伍，即使啪啪啪也要如此', keyword: '学区房、情怀' },
                { desc: '用力粗暴，天崩地裂', type: '户棚改造区', why: '内心压抑的你更适合在杂乱的环境中挥洒汗水，只有那样才能满足你无尽的欲望', keyword: '户棚区、嘈杂' },
                { desc: '力巧而精，活力四射', type: '超现代风格的精装LOFT', why: '科技和新鲜事物总是能够带给你无尽的遐想，尽情挥洒你的青春吧', keyword: '精装、LOFT、现代感' }
            ];

            var boardLevel = result.boardLevel;
            var boardRandom = parseInt(Math.random() * (resultBoard.length - 1));
            youtuSrc = $('<img src="http://static.test.soufunimg.com/common_m/m_activity/PaPaPa/images/type' + boardRandom + '.jpg">');
            baomanSrc = $('<img src="http://static.test.soufunimg.com/common_m/m_activity/PaPaPa/images/b' + boardRandom + '.jpg">');
            youtuBox = $('<div class="youtu1"></div>');
            $('.tu2').before(youtuBox.append(youtuSrc)).remove();
            changeYoutuSrc();

            if (shareUrl.indexOf('share') != -1) {
                who = '我';
            }
            des31.html('看' + who + resultBoard[boardRandom].desc + '，撞断 ' + boardLevel + ' 根木板，适合在' + resultBoard[boardRandom].type + '里啪啪啪，' + resultBoard[boardRandom].why);
            keyWord.html(resultBoard[boardRandom].keyword);
        }

        // 如果是分享页，再测一次按钮变成我也要测
        if (shareUrl.indexOf('share') != -1) {
            $('.zai_ce').hide();
            $('.zai_ce1').show();
        }

        // 搜索输入
        var searchInput = $('#search'),
            cityList = $('#cityList'),
            cityUl = $('#cityUl');
        // 用户是否选择开关
        var selected = false;
        var encity = '',
            chcity = '';

        // 城市列表隐藏
        $(document.body).on('click', function () {
            cityList.hide();
            searchInput.blur();
        });

        // 输入框输入
        searchInput.on('input', function () {
            var inputVal = searchInput.val().trim();
            selected = false;
            var encity = $(this).attr('data-name');
            if (encity) {
                $(this).attr('data-name', '');
            }
            getCityList(inputVal);
        });
        
        var ua = navigator.userAgent.toLowerCase();
        var isBaidu = ua.match(/baidu/i) == 'baidu';
        var repositionAble = true;
        searchInput.on('click', function (ev) {
            ev.stopPropagation();
            if (repositionAble && isBaidu) {
                repositionInput();
            }else if(!isBaidu) {
                $('body').delay(666).animate({ scrollTop: $('#container').height() }, 233);
            }
        });

        // 城市列表点击输入
        cityUl.on('click', 'li', function () {
            encity = $(this).attr('data-name');
            chcity = $(this).html();
            searchInput.val(chcity).attr('data-name', encity);
            selected = true;
            cityList.hide();
            restoreInput();
        });

        // 城市搜索
        var searchbtn = $('#searchbtn');
        searchbtn.on('click', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var inputVal = searchInput.val().trim();
            if (!inputVal) {
                showMsg('请选择城市!');
            } else if (!selected) {
                showMsg('请输入正确的城市名称!');
            } else {
                searchInput.val('').attr('data-name', '');
                showMsg('跳转中...', 2000);
                location.href = mainSite + '/xf/' + encity + '?&from=paPaPa';
            }
        });

        // 点击分享按钮显示分享提示遮罩
        $('.fenxiang').on('click', function (event) {
            event.stopPropagation();
            noScroll = true;
            zhe.show().on('click', function (event) {
                event.preventDefault();
                $(this).hide();
                noScroll = false;
            }).delay(2000).fadeOut('fast',function () {
                noScroll = false;
            });
        });

        // 点击再测一次，刷新页面
        $('.zaice').on('click', '.zai_ce,.zai_ce1', function (ev) {
            ev.stopPropagation();
            window.location.href = mainSite + '/activityshow/paPaPa/index.jsp';
        });
    }
});
