/**
 * @base.js 单身狗活动
 * @author fenglinzeng(fenglinzeng@fang.com)
 * @date 2016-11-04
 */
$(document).ready(function () {
    var body = $('body');
    var srcSite = $('#staticServer').val() + 'common_m/m_activity/singleDog/';
    var upUrl = $('#picUploadServer').val();
    var mainSite = '//' + location.host;

    var startBtn = $('#start');
    var mask = $('#mask');
    var toUpload = $('#toUpload');
    var upLoaded = $('#upLoaded');
    var show = $('#show');
    var startTest = $('#startTest');

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

    // 部分情况阻止滚动
    var canScroll = true;
    function bindScroll() {
        window.addEventListener('touchmove', scroll, false);
        function scroll(ev) {
            if (!canScroll) {
                ev.preventDefault();
            }
        }
    }

    // 显示上传
    function bindShowUpload() {
        startBtn.on('click', function () {
            mask.show();
            toUpload.show();
            canScroll = false;
        });
    }

    // 隐藏上传
    function bindCoverHide() {
        mask.on('click', function () {
            $(this).hide();
            toUpload.hide();
            canScroll = true;
        });
    }

    // 开始分析
    function bindStartAnalyse(img) {
        var liOne = $('#lione'),
            liTwo = $('#litwo'),
            liThree = $('#lithree'),
            dot = $('#dot'),
            dotStr = '...',
            dotNum = 1;
        function beatingFigure() {
            liOne.html(getRandom(10));
            liTwo.html(getRandom(10));
            liThree.html(getRandom(10));

            dot.html(dotStr.substring(0,dotNum));
            if (dotNum < 3) {
                dotNum++;
            }else {
                dotNum = 0;
            }
        }
        function getRandom(n) {
            return Math.floor(Math.random() * n + 1) - 1;
        }
        startTest.on('click', function () {
            $('#showTesting').fadeIn(function () {
                setInterval(beatingFigure, 100);
                jump(img);
            });
        });
    }

    /**
     * [jump 跳转]
     * @param  {[src]} img [图片的img]
     */
    function jump(img) {
        setTimeout(function () {
            $('body').fadeOut('fast',function () {
                var ranNum = ~~(Math.random() * 43);
                window.location.href = mainSite + '/activityshow/singleDog/result.jsp?picNum=' + ranNum + '&userPic=' + img;
            });
        },2333);
    }

    // 如果是上传过程很漫长
    var longTime = null;
    function longUpload() {
        longTime = setTimeout(function () {
            clearTimeout(longTime);
            showMsg('看起来上传过程很漫长，你可以刷新重试。');
        },8000);
    }

    // 上传
    var fileObj = {};
    function filter(files) {
        return files.length > 0 ? files[0] : null;
    }

    function bindUpload() {
        // 图片处理
        var uploadBtn = $('#uploadBtn');
        uploadBtn.on('change', function (e) {
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
    }

    /**
     * 上传成功处理函数
     * @param fileObj 包含文件信息的对象
     * @param result 服务器返回数据
     */
    function onSuccess(fileObj, result) {
        var returnData = JSON.parse(result);
        var returnUrl = returnData.result;
        if (returnData.result && returnData.result.indexOf('soufunimg.com') !== -1) {
            // uploadDone(fileObj.imgurl);
            uploadDone(returnUrl);
        }
    }

    /**
     * 上传失败
     * @param fileObj 包含文件信息的对象
     */
    function onFailure(fileObj) {
        alert('图片' + fileObj.fileName + '上传失败');
        window.location.href = location.href;
    }

    /**
     * 上传中...
     * @param fileObj 包含文件信息的对象
     */
    function onProgress(fileObj) {
        console.log('上传中' + fileObj);
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
        showMsg('上传中');
    }

    /**
     * [uploadDone 上传图片结束，接收到回调url时执行]
     * @param  {[str]} img [后台返回的图片url]
     */
    function uploadDone(img) {
        show.css('background-image','url(' + img + ')');
        toUpload.hide();
        upLoaded.show();
        bindStartAnalyse(img);
        clearTimeout(longTime);
    }


    function init() {
        bindScroll();
        bindShowUpload();
        bindCoverHide();
        bindUpload();
    }
    if (body.hasClass('upload')) {
        init();

        // 滚动到页面中间
        setTimeout(function () {
            $('body').scrollTop(parseInt(($('.container').height() - $(window).height()) * 0.5));
        },10);

        // 微信、QQ分享
        var weixin = new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: '今天我们都是单身狗',
            descContent: '单身狗，手牵手，你该牵走哪只狗？',
            lineLink: location.href,
            imgUrl: location.protocol + '//static.soufunimg.com/common_m/m_activity/singleDog/images/share.jpg'
        });

        // APP分享
        var dataForWeixin = {
            title: '今天我们都是单身狗',
            desc: '单身狗，手牵手，你该牵走哪只狗？',
            url: location.href,
            TLImg: location.protocol + srcSite + 'images/share.jpg',
            callback: function () {
                location = location + '&share=1';
            }
        };
        $('#soufunclient').html("1$"+dataForWeixin.desc+"$"+dataForWeixin.url+"$"+dataForWeixin.TLImg);
    }
    if (body.hasClass('result')) {
        /**
         * [getData 拆url]
         * @param  {[type]} url [url]
         * @return {[type]}     [url带的数据，键值形式]
         */
        function getData(url) {
            var result = {};
            var temp = url.split('?')[1].split('&');
            for (var i in temp) {
                var s = temp[i].split('=');
                result[s[0]] = s[1];
            }
            return result;
        }
        // 获取url参数
        var urlData = getData(window.location.href);
        // 获取参数里的数字
        var picNum = urlData.picNum;
        // 获取参数里的图片
        var userPic = decodeURIComponent(urlData.userPic);
        // 根据数字拼接文件名
        var filename = dogArr[picNum].filename;
        // 根据数字拼接狗狗名字
        var dogName = dogArr[picNum].name;
        // 根据文件名拼接图片URL
        var dogSrc = srcSite + 'images/dogs/' + filename;
        // 修改狗狗图片地址
        $('#dog').css('background-image', 'url("' + dogSrc + '")');
        // 修改狗狗名字
        $('#dogName').html(dogName);
        // 修改用户图片地址
        $('#user').css('background-image', 'url("' + userPic + '")');
        // 点击分享按钮显示分享提示
        $('#shareBtn').on('click', function () {
            $('#weixinShare').show();
            $('#shareTip').show();
        });
        // 点击分享遮罩隐藏分享提示
        $('#weixinShare').on('click', function () {
            $(this).hide();
            $('#shareTip').hide();
        });
        // 更改页面标题和描述
        $('head').find('title').html('今天我是' + dogName + '，你是哪种单身狗？');
        // 微信、QQ分享
        var weixin = new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: '今天我是' + dogName + '，你是哪种单身狗？',
            descContent: '单身狗，手牵手，你该牵走哪只狗？',
            lineLink: location.href,
            imgUrl: location.protocol + userPic
        });
        // APP分享
        var dataForWeixin = {
            title: '今天我是' + dogName + '，你是哪种单身狗？',
            desc: '单身狗，手牵手，你该牵走哪只狗？',
            url: location.href,
            TLImg: location.protocol + userPic,
            callback: function () {
                location = location + '&share=1';
            }
        };
        $('#soufunclient').html("$"+dataForWeixin.desc+"$"+dataForWeixin.url+"$"+dataForWeixin.TLImg);
    }
});
