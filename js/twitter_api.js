var client = (function(client, $){

	client.settings = client.settings || {};
	client.api = {};
	var proxy_url = 'proxy.py';

	client.api.call = function(method, success, kwargs, fail){
		kwargs = kwargs || {};
		kwargs['user'] = client.settings.user;
        kwargs['pass'] = client.settings.pass;
		kwargs['user'] = client.settings.user;
        kwargs['pass'] = client.settings.pass;
		kwargs['method'] = method;
		$.ajax({
            url: proxy_url,
			data: kwargs,
		   	dataType: 'json',
            success: success,
            error: function(xhr, status){
				$("#error").show();
				$("#error-message").html(xhr.responseText);
				fail && fail(data, status, xhr);
            }
        });
	};

	return client;
}(client || {}, jQuery));
