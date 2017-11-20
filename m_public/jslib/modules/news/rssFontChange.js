$(function() { 
	$(".font").on("click", function() {
		var text = $(this).text();
		if (text.trim() == "小字") {
			$(".content").css("font-size", "20px");
			$(this).text("大字");
		}else{
			$(".content").css("font-size", "17px");
			$(this).text("小字");
		}
	})
});