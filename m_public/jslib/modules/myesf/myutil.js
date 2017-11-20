define('modules/myesf/myutil', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var MyUtil = {
        ajax: function (url, method, params, onComplete, onFailure) {
            var onCompleteProxy = function (xhr) {
                onComplete(xhr);
            };
            if (!params.a) {
                var filename = url.split('/').pop();
                params.a = filename.split('.')[0];
            }
            var options = {
                url: url,
                type: method,
                dataType: 'json',
                data: params,
                success: onCompleteProxy,
                error: onFailure || onCompleteProxy
            };
            return $.ajax(options);
        }
    };
    return MyUtil;
});