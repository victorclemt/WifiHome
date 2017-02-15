// tweetFeed.js

function tweetFeed(_json, _options){
   	this.super(_json, _options);
   	this.tw = new twitter();
}

tweetFeed.inherits(FormWidget);

tweetFeed.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.lastID = 0;
	
	if(_data.status){
		NGM.trace(" ");
		NGM.trace("Tweet Activado");
		this.notificationTweet();
		this.status = true;
		tpng.app.twitterApp = this;
	}
}
tweetFeed.prototype.notificationTweet = function notificationTweet(){
	
	if(tpng.app.currentProgram.tweetFeed){
			var str = tpng.app.currentProgram.tweetFeed;
			var res = str.slice(1,str.length);
			this.tw.getNotifications_Hashtag(res,this.getNotifications_Hashtag.bind(this));	
	}else{
		//NGM.trace("No encontro nada y cerro TweetFeed");
		clearTimeout(this.timer_1);
		clearTimeout(this.timer);
	   	 tpng.app.twitter = false;
		this.home.closeSection(this);
	}

	clearTimeout(this.timer);
	this.timer = setTimeout(function(){this.notificationTweet(this); this.status = false;}.bind(this), 60000);
}

tweetFeed.prototype.onKeyPress = function onKeyPress(_key){
	switch(_key){								
    	case "KEY_TV_0":
		case "KEY_TV_1":
		case "KEY_TV_2":
		case "KEY_TV_3":
		case "KEY_TV_4":
		case "KEY_TV_5":
		case "KEY_TV_6":
		case "KEY_TV_7":
		case "KEY_TV_8":
		case "KEY_TV_9":	  
		case "KEY_TV_CHNL_UP":
	    case "KEY_TV_CHNL_UP_LONG":	    	
    	case "KEY_TV_CHNL_DOWN":
	    case "KEY_TV_CHNL_DOWN_LONG":
	    case "KEY_LEFT":
	    case "KEY_RIGHT":
	    case "KEY_MENU":
	    case "KEY_TV_VOD":
	       	clearTimeout(this.timer_1);
			clearTimeout(this.timer);
	   	 	tpng.app.twitter = false;
	   	 	this.home.closeSection(this);
	    break;
	    default:
    		return false;
    	break;	
    }
}
tweetFeed.prototype.getNotifications_Hashtag = function getNotifications_Hashtag(responseCode){

	if(responseCode.status == 200){
			var widgets =  this.widgets,
				tweets_new = this.tw.getTweet(),
				tweets = [];
				
					if(tweets_new.statuses){
						for(var i = 0; i < tweets_new.statuses.length; i++){
								if(parseInt(this.lastID) != parseInt(tweets_new.statuses[i].id_str)){
								
								if(this.status == true)
										tweets[0] = tweets_new.statuses[0];
									else 
										tweets[i] = tweets_new.statuses[i];	

								}else{
									clearTimeout(this.timer_1);
									break;
								}
						}
						this.lastID = tweets_new.statuses[0].id_str;
						
					}
				this.client.lock();
					widgets.bg_Twitter.setData({"url":"img/twitter/pestanaTwitter.jpg"});
					widgets.active_Twitter.setData({"url":"img/twitter/logoTwitter.png"});
					widgets.active_Twitter.stateChange("enter");
					
					if(tweets.length != 0){
						widgets.bg_Twitter.stateChange("enter");
					}else{
						widgets.bg_Twitter.stateChange("exit");
					}
					
					widgets.notificationTweet.setData(tweets);
					widgets.notificationTweet.stateChange("enter_On");
				this.client.unlock();
				
				
				clearTimeout(this.timer_1);
				this.timer_1 = setTimeout(function(){this.scrollNotifications();}.bind(this), 6000);	
	}
}
tweetFeed.prototype.scrollNotifications = function scrollNotification(){
	   var w = this.widgets;
			if(w.notificationTweet.selectIndex == w.notificationTweet.list.length-1){
				w.notificationTweet.stateChange("exit_On");
				w.bg_Twitter.stateChange("exit");
			}else{
				w.notificationTweet.stateChange("enter_On");			
			}
			
			w.notificationTweet.scrollNext();
			
			clearTimeout(this.timer_1);
			this.timer_1 = setTimeout(function(){this.scrollNotifications();}.bind(this), 6000);
}
tweetFeed.drawMalla = function drawMalla(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		tp_draw.getSingleton().drawImage("img/tools/DevsOnion.png", ctx, 0, 0);	
		
		ctx.drawObject(ctx.endObject());
}
tweetFeed.prototype.onExit = function onExit(_data){
		clearTimeout(this.timer_1);
		clearTimeout(this.timer);
		var w = this.widgets;
		w.active_Twitter.stateChange("exit");
		w.bg_Twitter.stateChange("exit");
		w.notificationTweet.stateChange("exit");			
		this.status = false;
		NGM.trace(" ");
		NGM.trace("Salio del Tweet Feed");
}