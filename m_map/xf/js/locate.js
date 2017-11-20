if (getCookie('geolocation_x') == null || getCookie('geolocation_y') == null) {
    var curcity = encity;
    get_location();
}

function get_location() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geo_success, geo_error, {
            timeout: 10000,
            maximumAge: 60000,
            enableHighAccuracy: true
        });
    }
}
function geo_success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    xmlHttp = createXMLHttpRequest();
    var url = '/local.d?m=locationbd&geox=' + latitude + '&geoy=' + longitude;
    xmlHttp.open("GET", url, true);
    xmlHttp.onreadystatechange = function () {
        console.log(xmlHttp);
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                var data = stringToJson(xmlHttp.responseText);
                var encity = data.root.encity;
                var city = data.root.city;
                var addr = data.root.addr;
                if (addr != null && addr != '') {
                    if (curcity != encity && getCookie("encity") != encity) {
                        return false;
                    }
                    addCookie("geolocation_x", longitude, 24 * 30);
                    addCookie("geolocation_y", latitude, 24 * 30);
                    window.location.reload();
                }
            }
        }
    }
    xmlHttp.setRequestHeader("Content-Type",
        "application/x-www-form-urlencoded;");
    xmlHttp.send();
};
function geo_error(error) {
};
function createXMLHttpRequest() {
    var xmlHttp;
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
        if (xmlHttp.overrideMimeType)
            xmlHttp.overrideMimeType('json');
    } else if (window.ActiveXObject) {
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    }
    return xmlHttp;
}
function stringToJson(stringValue) {
    eval("var theJsonValue = " + stringValue);
    return theJsonValue;
}
function request(paras) {
    var url = location.href;
    if (url.indexOf("#") > 0) {
        url = url.substring(0, url.indexOf("#"));
    }
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof(returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
};
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}
function addCookie(name, value) {
    var Days = 7;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + exp.toGMTString();
}