jwingupload Release 说明文档

1.功能

    图片上传插件

2.用法

    /**
        uploadPic:图片上传按钮容器id
        preview：图片展示容器id
        maxLength:图片最大上传数量限制
        imgPath:用到的图片路径
        url：上传接口地址
        imgCountId:显示数量的容器id

    */
    require.async(["jwingupload/1.0.5/jwingupload"],function(jWingUpload){
        jwupload= jWingUpload({
            uploadPic:document.getElementById("uploadPic"),
            preview:document.getElementById("bbsAddPic"),
            maxLength:20,
            imgPath:vars.public,
            url: vars.bbsSite + "?c=bbs&a=ajaxUploadImg&city="+vars.city,
            imgCountId:'#uploadPic'
        });
    })