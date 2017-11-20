/**
 * Created by user on 2015/11/6.
 */
$(function () {
    var $cityitem = $('#city');
    var $projitem = $('#proj');
    var $city=$cityitem.find('input');
    var $proj=$projitem.find('input');
    var $citylist = $cityitem.find('div');
    var $projlist = $projitem.find('div');
    var $body = $(".bga");
    var $priceH = $('.js_price');
    var $flagprice = false;
    var $mas = $('.guessmask');
    $priceH.on('input',function(){
        var inpVal = $priceH.val();
        var pattern = new RegExp(/^[0-9]+$/);
        var isNum = pattern.test(inpVal);
        if(!(!isNaN(inpVal)&&inpVal>0&&isNum)){
            alert('请输入正整数')
        }else{
            $flagprice = true;
        }
    });
    $city.on('input',showCity);
    $proj.on('input',showProj);
    function right(that){
        var pattern = new RegExp("[~'!@#$%^&*()-+_=:]");
        if(that.val() != "" && that.val() != null){
            if(pattern.test(that.val())){
                alert("非法字符！");
                that.attr("value","");
                that.focus();
                return false;
            }
        }
    }

    $body.on({
        click:function(){
            $citylist.hide();
            $projlist.hide();
        }
    });
    $body.on('click','.close',function(){
        $(this).click(function(){
            $mas.hide();
            $(this).parent().hide();
        });
    });
    function showCity(){
        var $cityname = $city.val();
        $citylist.empty();
        //if($cityname==""){citySelectFocus(goalEleInput);return;}
        var url="/activity.d?m=getCityPinyinName&cityName="+$cityname;
        right($city);
        $.ajax({
            type: 'GET',
            url: url,
            timeout:2000,
            cache: false,
            dataType : "json",
            async: false,
            success: function(data){
                var resHtml="<ul>";
                for(var i=0;i<data.length;i++)
                {
                    resHtml+=("<li enName=\""+data[i][1]+"\">"+data[i][0]+"</li>");
                }
                resHtml+='</ul>';
                $citylist.append(resHtml);
                $citylist.show();
                selectitem($cityitem,$projitem);
    }});
    }
    function showProj(){
        $projlist.empty();
        var $projname = $proj.val();
        var $cityname = $city.attr('name');
        right($proj);
        if($cityname){
            var url = "/huodongAC.d?class=GuessPriceGetMoenyHc&m=getLoupan&city="+$cityname+"&keyword="+encodeURIComponent(encodeURIComponent($projname));
            $.get(url,function(data){
                if(!(data&&data.root&&data.root.items))return;
                var items = data.root.items;
                var resHtml = "<ul>";
                for(var i=0;i<items.length;i++){
                    resHtml+=("<li enname=\""+items[i]['projcode']+"\">"+items[i]['projname']+"</li>");
                }
                resHtml += '</ul>';
                $projlist.append(resHtml);
                $projlist.show();
                selectitem($projitem,$cityitem);
            });
        }
    }
    function selectitem($this,$that){
        $that.find('div').empty();
        var activeInput = $this.find('input'),
            listBox = $this.find('div');
        var $selected = $this.find('label').find('input');
        listBox.on('click','li',function () {
            activeInput.val($(this).html());
            $(this).attr('class','active');
            var p = $(this).attr('enname');
            var h = $(this).html();
            $selected.attr('name',p);
            $selected.attr('value',h);
            listBox.hide();
        });
        /*$this.find('li').each(function(){
            $(this).on('click',(function(){
                $(this).attr('class','active');
                var p = $(this).attr('enname');
                var h = $(this).html();
                $selected.attr('name',p);
                $selected.attr('value',h);
                $this.find('div').hide();
            }));
        })*/

    }
    $('.detail ').on('click',function(){
        $mas.show();
        $('#detail').show();
    });
    $('#showresult').on('click',function(){
        var $encity = $cityitem.find('input').attr('name');
        var $zhcity = $cityitem.find('input').val();
        var $projcode = $projitem.find('input').attr('name');
        var $projname = $projitem.find('input').val();
        var $price = $priceH.val();
        if($price.length>=8){
            alert("猜的太高了~");
            return false;
        }
        if($zhcity && $projcode && $flagprice){
            var prizeparm = {};
            prizeparm.class = 'GuessPriceGetMoenyHc';
            prizeparm.m = 'comparePrice';
            prizeparm.city = $zhcity;
            prizeparm.projname = $projname;
            prizeparm.projcode = $projcode;
            prizeparm.price = $price;
            prizeparm.encity = $encity;
            $.ajax({
                url:'huodongAC.d',
                type:'POST',
                data:prizeparm,
                dataType:'html',
                success:function(data){
                    $body.append(data);
                    $mas.show();
                }
            });
        }else{
            alert($priceH.attr('name'));
        }
    })
});
