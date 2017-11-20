define('entry/upload', [
    'modules/toast'
], function (require) {

    const vars = window.vars;
    const upDomain = vars.upDomain;

    require('modules/toast');

    window.onload = function () {
        $('.upload-content').addClass('select');
    };

    // 选中文件了以后
    let selectFile = document.getElementById('selectFile');
    selectFile && selectFile.addEventListener('change', function (e) {
        let form = document.getElementById('form');
        // 显示文件尺寸和文件名
        let file = e.target.files[0];
        if (!file) return;
        let fileName = file.name;
        let size = file.size / 1000;
        if (!/.\.txt$/.test(fileName)) {
            $.Toast('上传失败', `目前只能上传txt格式文档`, 'error', {
                timeout: 1200
            });
            return;
        }
        $('#upload-tip').html(`<p>文件名：${fileName}</p><p>尺寸：${size}kb</p>`).show();
        // 隐藏文件图标，显示上传图标
        $('.upload-content').removeClass('select').addClass('upload');
        // 隐藏选择提示按钮
        $('#btn-select').addClass('none');
        // 显示上传按钮
        $('#btn-upload').removeClass('none').off('click').on('click', function () {
            // 让按钮失效，避免重复上传
            if ($(this).data('disable') === 'true') {
                return;
            }
            $(this).data('disable', 'true').text('上传中');
            // 上传
            upload(form);
        });
    }, false);

    function init() {
        $('.upload-content').removeClass('upload').addClass('select');
        $('#upload-tip').hide();
        // 隐藏选择提示按钮
        $('#btn-select').removeClass('none');
        $('#btn-upload').addClass('none');
        $('#btn-upload').data('disable', 'false').text('点我上传');
        $('.upload-btn').attr('style', '');
        selectFile.value = '';
    }

    // 上传
    function upload(form) {
        let f = new FormData(form);
        $.ajax({
            url: vars.domainUp,
            type: 'POST',
            data: f,
            processData: false,
            contentType: false,
            xhr: function () {
                let myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    let uploadBtn = $('.upload-btn');
                    myXhr.upload.addEventListener('progress', function (e) {
                        if (e.lengthComputable) {
                            let percent = e.loaded / e.total * 100;
                            console.log(`上传： + ${e.loaded} + / + ${e.total} +  bytes.  +
                                ${percent.toFixed(
                                    2)} + %`);
                            // 图标背景进度
                            uploadBtn.css('backgroundPosition', '0 ' + percent.toFixed(
                                2) + '%');
                        }
                    }, false);
                }
                return myXhr;
            },
            success: function (res) {
                // 如果上传成功
                if (res.code === '100') {
                    // 隐藏上传提示按钮
                    $('#btn-upload').addClass('none');
                    // 显示上传成功提示按钮
                    $('#btn-done').removeClass('none');
                    // 显示上传成功图标
                    $('.upload-content').removeClass('upload').addClass('done');
                    $.Toast('成功', res.msg, 'success', {
                        timeout: 0
                    });
                } else {
                    console.log(res.data);
                    $.Toast('失败', res.msg, 'error', function () {
                        init();
                    });
                }
            },
            error: function (res) {
                let resStr = JSON.stringify(res);
                console.log('失败:' + resStr);
                $.Toast('失败', resStr, 'error', function () {
                    init();
                });
            }
        });
    }
});