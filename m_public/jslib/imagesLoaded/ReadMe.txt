imagesLoaded Release 说明文档

1.功能

    一次性加载图片插件

2.用法

    f(typeof window.imagesLoaded!=="undefined"){
        result.imagesLoaded(function() {
            $target.append(result);
        });
    }