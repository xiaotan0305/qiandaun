define('modules/mycenter/upload', ['jquery', 'jwingupload/global', 'jwingupload/jpegMeta', 'jwingupload/JPEGEncoder', 'jwingupload/imageCompresser'],
    function (require) {
    'use strict';
    var $ = require('jquery');
    var JpegMeta = require('jwingupload/jpegMeta').JpegMeta;
    var vars = seajs.data.vars;
    var ImageCompresser = require('jwingupload/imageCompresser');
    require('jwingupload/global');
    return {
        imgsArray: [],
        fileFilter: [],
        option: {
            url: '?c=mycenter&a=ajaxUploadImgNew',
            maxlength: 9
        },
        onSuccess: function (file, result) {
            var that = this;
            if (result) {
                // var resultObj = JSON.parse(result);
                var resultObj = eval('(' + result + ')');
                var $id = $('#' + file.id);
                if ($id.attr('data-type') === 'small') {
                    this.imgsArray.push(resultObj.result.url + ',' + file.name);
                } else {
                    this.imgsArray.push(resultObj.result.url);
                }
                if ($id.html().indexOf('<img') === -1 && file.data) {
                    $id.html('<img src="' + file.data + '">');
                }
            } else {
                that.onFailure(file);
            }
            var imgsLen = that.fileFilter.length;
            if (imgsLen > 0) {
                that.fileFilter.splice(0, 1);
            }
            if (!that.fileFilter.length) {
                // 全部完毕
                that.onComplete(file);
            }
        },
        onFailure: function (file) {
            alert('图片' + file.name + '上传失败');
        },
        editHouse: function (indexId, houseId, price, room, hall, toilet, area, floor, totalfloor, forward, rawid) {
            if (this.imgsArray.length > 0) {
                var params = {
                    a: 'ajaxdelegateEdit',
                    city: vars.city,
                    houseId: houseId,
                    indexId: indexId,
                    price: price,
                    delegateId: '',
                    room: room,
                    hall: hall,
                    toilet: toilet,
                    area: area,
                    totalfloor: totalfloor,
                    forward: forward,
                    rawid: rawid,
                    imgs: this.imgsArray.join(',')
                };
                vars.ajax('?c=myesf', 'get', params, function (data) {
                    if (data.result === '1') {
                        alert('上传成功');
                    } else {
                        alert('上传失败');
                    }
                });
            }
        },
        editSmallHouse: function (houseid, contactperson, mobilecode, title, projname, projcode, description, price, room, hall, toilet, floor, totlefloor, buildingarea, district, purpose, forward, gender, isagent, tags) {
            if (this.imgsArray.length > 0) {
                var params = {
                    a: 'ajaxJXHouseEdit',
                    city: vars.city,
                    houseid: houseid,
                    contactperson: contactperson,
                    price: price,
                    mobile: mobilecode,
                    room: room,
                    hall: hall,
                    toilet: toilet,
                    title: title,
                    totalfloor: totlefloor,
                    projname: projname,
                    description: description,
                    floor: floor,
                    buildingarea: buildingarea,
                    district: district,
                    purpose: purpose,
                    forward: forward,
                    gender: gender,
                    isagent: isagent,
                    tags: tags,
                    titleimg: this.imgsArray[0].split(',')[0],
                    shinimgs: this.imgsArray.join(';') + ';'
                };
                vars.ajax('?c=myesf', 'get', params, function (data) {
                    if (data.result === '0') {
                        alert('上传成功');
                    } else {
                        alert('上传失败');
                    }
                });
            }
        },
        onComplete: function (file) {
            var that = this, $file = $('#' + file.id), order = $file.attr('data-order');
            if ($file.attr('data-type') === 'small') {
                that.editSmallHouse.apply(this, order.split(';'));
            } else {
                that.editHouse.apply(this, order.split(','));
            }
        },
        upload: function (file, uploadBase64) {
            var that = this;
            var xhr = new XMLHttpRequest();
            if (xhr.upload) {
                //  文件上传成功或是失败
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            that.onSuccess(file, xhr.responseText);
                        } else {
                            that.onFailure(file, xhr.responseText);
                        }
                    }
                };
                //  开始上传
                xhr.open('POST', that.option.url + '&fileName=' + file.name + '&type=' + file.type);
                var formData = new FormData();
                formData.append('pic', uploadBase64);
                xhr.send(formData);
            }
        },
        inputHandle: function (e) {
            e.stopPropagation();
            var self = e.data.m, files = e.target.files || e.dataTransfer.files;
            if (files.length + self.imgsArray.length > self.option.maxlength) {
                alert('最多上传' + self.option.maxlength + '张图片');
                return;
            }
            var i = 0, $this = $(this);
            var funAppendImage = function () {
                var file = files[i];
                if (file) {
                    file.id = $this.parent().attr('id');
                    self.fileFilter.push(file);
                    var reader = new FileReader(), conf = {};
                    if (window.NETTYPE == window.NETTYPE_WIFI) {
                        conf = {maxW: 3000, maxH: 1280, quality: 0.8};
                    }
                    reader.onload = function () {
                        var result = this.result, uploadBase64 = '';
                        if (file.type === 'image/jpeg') {
                            try {
                                var jpg = new JpegMeta.JpegFile(result, file.name);
                            } catch (e) {
                                jq.DIC.dialog({content: '图片不是正确的图片数据', autoClose: true});
                                return false;
                            }
                            if (jpg.tiff && jpg.tiff.Orientation) {
                                conf = jq.extend(conf, {orien: jpg.tiff.Orientation.value});
                            }
                        }
                        if (ImageCompresser.ImageCompresser.support()) {
                            var img = new Image();
                            img.onload = function () {
                                try {
                                    uploadBase64 = ImageCompresser.ImageCompresser.getImageBase64(this, conf);
                                    file.data = uploadBase64;
                                } catch (ev) {
                                    return false;
                                }
                                if (uploadBase64.indexOf('data:image') < 0) {
                                    alert('上传照片格式不支持');
                                    return false;
                                }
                                i++;
                                self.upload(file, uploadBase64);
                                funAppendImage();
                            };
                            img.onerror = function () {
                                alert('解析图片数据失败');
                                return false;
                            };
                            img.src = ImageCompresser.ImageCompresser.getFileObjectURL(file);
                        }
                    };
                    reader.readAsBinaryString(file);
                }
            };
            funAppendImage();
        },
        init: function (option) {
            var that = this;
            if (option) {
                $.extend(true, that.option, option);
            }
            $('input[type=file]').on('change', {m: that}, that.inputHandle);
        }
    };
});