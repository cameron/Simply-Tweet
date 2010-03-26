var client = (function(client, $){

	client.settings = client.settings || {};
	client.settings.max_tweet_length = 140;
	client.settings.date_name_separator = 'on';

	client.login = function(){
		client.settings.user = $("#t-user").val();
		client.settings.pass = $("#t-pass").val();
		$("#error").hide();
	    client.update_home_timeline();
	}

    client._cheat_in = function(){
		client.settings.user = 'froomyusbander';
		client.settings.pass = 'sniffles';
		client.update_home_timeline();
    }

    client.update_home_timeline = function(){
		client.api.call('statuses/home_timeline', client.render_home_timeline);
    }

    client.tweet = function(){
		var status = $("#t-status").val().substr(0,141);
		client.api.call('statuses/update', client.on_tweeted, {status:status});
	}

    client.on_tweeted = function(data, status, xhr){
		$("#home-timeline").prepend(client.construct_tweet(data[0] || data));
    }

	client.render_home_timeline = function(tweets, status, xhr){
		$("#login").hide();
		$("#update-status").show();
		var str = '<div class="clear">&nbsp;</div>';
		for(tweet in tweets){
			str += client.construct_tweet(tweets[tweet]);
		}
		$("#home-timeline").html(str);
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

    client.tweet_key = function(){
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

    client.init = function(){
		$("#t-user").focus();
		$("#t-status").keyup(client.tweet_key);
        $("#t-submit").click(client.tweet);
		$("#t-login").click(client.login);
   		client._cheat_in();
	}

    $(function(){client.init()});

	return client;
}(client || {}, jQuery));
