fav.js Release 说明文档

1.功能

    收藏功能

2.用法

    //收藏
    require.async('fav/1.0.0/fav', function(a){
        a.fav(vars.houseid,"zf_favorite");
        $('.btn-fav').on('click', function(){
            a.add_fav(vars.houseid,"zf_favorite");
        });
    });