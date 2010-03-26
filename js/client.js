var client = (function(client, $){

	client.settings = client.settings || {};
	client.settings.max_tweet_length = 140;
	client.settings.date_name_separator = 'on';
	client.settings.cache_for = 5*60*1000; // lifetime of cached tweets in milliseconds

	client.login = function(){
		client.settings.user = $("#t-user").val();
		client.settings.pass = $("#t-pass").val();
		$("#error").hide();
		$("#home-timeline").click();
	}

	client.init = function(){
		$("#t-user").focus();
		$("#t-status").keyup(client.on_type_tweet);
		$("#t-submit").click(client.tweet);
		$("#t-login").click(client.login);
		$("#nav div").click(client.load_tweets);
	}

	client.tweet = function(){
		var status = $("#t-status").val().substr(0,141);
		client.api.call('statuses/update', client.on_tweeted, {status:status});
	}

	client.on_tweeted = function(data, status, xhr){
		$("#home-timeline-content, #user-timeline-content").prepend(client.construct_tweet(data[0] || data));
		$("#home-timeline").click();
	}

	client.render_tweets = function(tweets, dest_div){
		$("#login").hide();
		$("#update-status").show();
		var str = '<div class="clear">&nbsp;</div>';
		for(tweet in tweets){
			str += client.construct_tweet(tweets[tweet]);
		}
		str += '<div class="clear">&nbsp;</div>';
		dest_div.html(str);
		client.show_content(dest_div);
	}

	client.construct_tweet = function(tweet){
		return '<div class="tweet">'
		+ '<div class="text-and-pic">'
		+ '<div class="user-pic"><img src="' + tweet['user']['profile_image_url'] + '"/></div>'
		+ '<div class="text">' + tweet['text'] + '</div>'
		+ '<div class="name-and-date">'
		+ '<span class="name">' + tweet['user']['screen_name'] + '</span>'
		+ '<span class="date-name-sep">' + client.settings.date_name_separator + '</span>'
		+ '<span class="date">' + tweet['created_at'].substr(4,12) + '</span>'
		+ '</div>'
		+ '<div class="clear">&nbsp;</div>'
		+ '</div>'
		+ '<div class="clear">&nbsp;</div>'
		+ '</div>';
	}

	client.on_type_tweet = function(){
		var tweet_btn = $("#t-submit");
		var status = $("#t-status");
		var char_count = $("#char-count");
		var len = status.val().length;
		char_count.text(len).removeClass("red");
		tweet_btn.attr('disabled', false);
		if(len > client.settings.max_tweet_length){
			char_count.addClass("red");
			tweet_btn.attr('disabled', true);
		}
	}

	client.load_tweets = function(e, force_refresh){
		if(e.target.id == 'refresh'){
			e.target = $("#nav .active")[0];
			return client.load_tweets(e, true);
		}
		$("#nav div").removeClass("active");
		$(e.target).addClass("active");
		var method = e.target.id.replace(/-/g,'_');
		var dest_div = $("#" + e.target.id + '-content');
		var now = new Date().getTime();
        var last_load = dest_div.data('last_load');
		if(now - last_load < client.settings.cache_for && !force_refresh){
			client.show_content(dest_div);
		} else {
			client.api.call("statuses/" + method, function(data, status, xhr){
				$("#nav").show();
				$("#error").hide();
				dest_div.data('last_load', now);
				client.render_tweets(data, dest_div);
			});
		}
	}

	client.show_content = function(div){
		$("#tweets .content").hide();
		div.show();
	}

	$(function(){client.init()});

	return client;
}(client || {}, jQuery));
