// vodPlayer.js
function vodPlayer(_json, _options){
   	this.super(_json, _options);
	this.secondsToHide = 5;
	this.indexUrl = 0;
	this.speed = 0;
	this.activeFocus = "";
	//this.auxPlayer = true;
	this.auxChangeIdioma = null;
	this.auxAudios = true;
	this.auxCount = 9;
}
vodPlayer.inherits(FormWidget);

vodPlayer.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.home.objectChild = this; //Player Events

	var vodId = this.vodId =  _data.vodId ? _data.vodId : _data.parameters.vodId;

	getServices.getSingleton().call("VOD_GET_INFO", ["vodId="+vodId],  this.responseGetDeail.bind(this));		
	
}

vodPlayer.prototype.responseGetAutorization = function responseGetAutorization(responseCode){
		
	if(responseCode.status == 200){
		var resultVO = responseCode.data.ResultVO;
		this.vod = [];
		
		if(resultVO.status == 0){
			for(var i=0; i< this.vodInfo.formats.length; i++){
		 		if(this.vodInfo.formats[i].VodFormatVO.url){
		 			this.vod[i] = this.vodInfo.formats[i].VodFormatVO;
		 			this.csbId = this.vodInfo.formats[i].VodFormatVO.csbId;
		 			this.claId = this.vodInfo.formats[i].VodFormatVO.claId;
		 		}
			}
			//lleno toda la informacón
			this.widgets.playerLogo.setData("");
			this.setDataPanel(this.vodInfo);
			this.widgets.vodControlsLanguage.setData(this.vod);
			//this.setDataHomePlayer(this.vodInfo);
			//this.setDataBackground(this.vodInfo.images.url18X18);
			//this.setDataRecommendations(this.vodInfo.vodId);
			
			var bookmark = this.vodInfo.bookmark != -1 ? this.vodInfo.bookmark : 0;
			
			//Buscar la primera URL disponible(porque las SD no vienen en la posición 0)
			for(i=0, l=this.vod.length; i<l ; i++){
				if(this.vod[i].url){
					var firstUrl = this.vod[i].url;
					break;
				}
			}
			this.home.playVideo(firstUrl,"HLS", bookmark, null, this.vodInfo.isEncrypted);
		}else{
			this.home.openSection("miniError", {"home": this.home,"code":resultVO.status, "message": resultVO.message, "suggest": result.seggest}, false);
		}
	}else{
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

vodPlayer.prototype.responseGetDeail = function responseGetDeail(responseCode){
	if(responseCode.status == 200){
		this.vodInfo = responseCode.data.ResponseVO.vod.VodMovieVO;
		this.vod = [];
		
		
		if(this.vodInfo.isEncrypted){
			getServices.getSingleton().call("VOD_GET_AUTORIZATION", ["vodId="+this.vodInfo.vodId],  this.responseGetAutorization.bind(this));
		}else{
			for(var i=0; i< this.vodInfo.formats.length; i++){
		 		if(this.vodInfo.formats[i].VodFormatVO.url){
		 			this.vod[i] = this.vodInfo.formats[i].VodFormatVO;
		 			this.csbId = this.vodInfo.formats[i].VodFormatVO.csbId;
		 			this.claId = this.vodInfo.formats[i].VodFormatVO.claId;

		 		}
			}
			//lleno toda la informacón
			this.widgets.playerLogo.setData("");
			this.setDataPanel(this.vodInfo);
			this.widgets.vodControlsLanguage.setData(this.vod);
			//this.setDataHomePlayer(this.vodInfo);
			//this.setDataBackground(this.vodInfo.images.url18X18);
			//this.setDataRecommendations(this.vodInfo.vodId);
			
			var bookmark = this.vodInfo.bookmark != -1 ? this.vodInfo.bookmark : 0;
			
			//Buscar la primera URL disponible(porque las SD no vienen en la posición 0)
			for(i=0, l=this.vod.length; i<l ; i++){
				if(this.vod[i].url){
					var firstUrl = this.vod[i].url;
					break;
				}
			}
			if(firstUrl)
				this.home.playVideo(firstUrl,"HLS", bookmark, null, this.vodInfo.isEncrypted);
			else
				this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"}, false);
		
		}
		
	}else{
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

vodPlayer.prototype.responseGetRecommandations = function responseGetRecommandations(response){
	if(response.status == 200){
		var widgets = this.widgets;
			widgets.vodRecommendations.setData(response.data.ResponseVO.vodArray);
			widgets.vodPlayerInfo.setData({"message":"otros también vieron:"});
			widgets.vodPlayerInfo.stateChange("enter");
			
	}
}
vodPlayer.prototype.responseSendVodBookmark = function responseSendVodBookmark(response){
	if(response.status == 200){
	}
}

vodPlayer.onFocusButtonsPlayer = function onFocusButtonsPlayer(_focus, _data){
	if(_focus){		
    	var widgets = this.widgets;
    	widgets.buttonsHeader.setData({"x": widgets.buttons.selectItem.x, "text": widgets.buttons.selectItem.text});
    	this.timerToShowButton = widgets.buttonsHeader.stateChange.delay(1000, widgets.buttonsHeader, "enter");
	} else {
		unsetTimeAlarm(this.timerToShowButton);
		this.timerToShowButton = null;
		this.widgets.buttonsHeader.stateChange("exit");
	}	
}
vodPlayer.onFocusVodRecommendations = function onFocusVodRecommendations(_focus,_data){
   if(_focus){                            
           if (this.activeFocus == "search")
                   this.widgets.vodRecommendations.setFocus(false);
                
   }
         
}
vodPlayer.prototype.optionsBookmark = function optionsBookmark(_data){
	var widgets =  this.widgets;
	var bookmark = _data ? _data.bookmark : this.home.playerGetProperty("POSITION");
		options = [
			{"label":"<!size=50>Reiniciar<!> || la reproducción desde 00:00","action":"INICIO"},
			{"label":"<!size=50>Reanudar<!>|| la reproducción desde "+getTimeFormat(bookmark),"action":"REANUDAR"}
		];
		
		widgets.vodPlayerInfo.setData("");
		widgets.vodPlayerInfo.stateChange("enter");
		widgets.optionsBookmark.setData(options);
		widgets.optionsBookmark.focusIndexMin = 1;
		widgets.optionsBookmark.focusIndexMax = 2;
		widgets.optionsBookmark.scrollNext();
		widgets.optionsBookmark.stateChange("enter");
		this.activeFocus = "bookmark";
	
}

vodPlayer.prototype.optionsPlayer = function optionsPlayer(_data){
	var widgets =  this.widgets;
		options = [
			{"label":"<!size=50>Salir<!> || de la reproducción","action":"SALIR"},
			{"label":"<!size=50>Seguir<!>|| la reproducción","action":"SEGUIR"}
		];
		widgets.vodPlayerInfo.setData("");
		widgets.vodPlayerInfo.stateChange("enter");
		widgets.optionsBookmark.setData(options);
		
		widgets.optionsBookmark.focusIndexMin = 1;
		widgets.optionsBookmark.focusIndexMax = 2;
		widgets.optionsBookmark.stateChange("enter");
		this.activeFocus = "optionsPlayer";
	
	
}
vodPlayer.prototype.sendBookmark = function sendBookmark(){
	
	var position = this.home.playerGetProperty("POSITION");
	var duration = this.home.playerGetProperty("DURATION");
    var prc = (position*100)/duration;	
	
	if(prc < 90 && prc > 10){	
		var pos = this.home.playerGetProperty("POSITION");
	}else{
		var pos = -1;
	}
	var params = ["vodId="+this.vodInfo.vodId, "claId="+this.claId, "csbId="+this.csbId, "bookmark="+pos];
	getServices.getSingleton().call("VOD_SEND_BOOKMARK", params, this.responseSendVodBookmark.bind(this));
}
vodPlayer.prototype.setDataPanel = function setDataPanel(_data){
	var widgets =  this.widgets,
		min = this.home.playerGetProperty("POSITION")/60000;
		
		widgets.buttonsPanel.setData("");
		widgets.vodImg.setData(_data);
		widgets.progressBarVod.setData({"progress":(min*100)/_data.duration,"duration":_data.duration});
		
}
vodPlayer.prototype.setDataRecommendations = function setDataRecommendations(_data){
	var params = ["values=0,0,0,4,0","vodId="+_data];
		getServices.getSingleton().call("RECOMMENDATION_GET_ID_VOD", params, this.responseGetRecommandations.bind(this));
}
vodPlayer.prototype.setDataBackground = function setDataBackground(_url){	
	this.home.widgets.mainBg.setData({"url":_url,"layer":true});
}
vodPlayer.prototype.showButtonsPanel = function showButtonsPanel(){
	var widgets =  this.widgets;
		this.home.showHeader({"section":"anytimePlayer","fill":"rgba(40,20,40,.8)","stroke":"rgba(130, 60, 150, 1)"});
		var	buttons = this.initButtons();
		widgets.buttons.setData(buttons,2);
		widgets.vodControls.setData({"text": ""});
		this.client.lock();
			widgets.vodControls.stateChange("enter");
			widgets.buttons.stateChange("enter");
			widgets.buttonsPanel.stateChange("enter");
			widgets.progressBarVod.stateChange("enter");
			widgets.vodImg.stateChange("enter");
			widgets.playerLogo.stateChange("enter");
		this.client.unlock();
		this.updateProgressBar();
		unsetTimeAlarm(this.progressBarTimer);
		this.progressBarTimer = this.updateProgressBar.bind(this).repeat(1*1000);
		this.activeFocus = "player";
}
vodPlayer.prototype.counterPlayer = function counterPlayer(){
		this.widgets.vodPlayerfocus.setData({"counter":this.auxCount});
		this.widgets.vodPlayerfocus.refresh();
		this.auxCount = this.auxCount - 1;
}
vodPlayer.prototype.showPlayerMini = function showPlayerMini(_data){
	var widgets =  this.widgets;
		//this.widgets.malla.setData("");
		//this.widgets.malla.stateChange("enter");
		//widgets.vodPlayerInfo.stateChange("enter");
		this.home.widgets.mainBg.stateChange("enter");	
		widgets.vodPlayerfocus.stateChange("enter");
		widgets.vodButtons.stateChange("enter");
		widgets.vodRecommendations.stateChange("enter");
		widgets.playerLogo.stateChange("exit");
		this.home.widgets.player.stateChange("playerMini");	

		this.activeFocus = "home";

}
vodPlayer.prototype.showPlayerFull = function showPlayerFull(_data){
	var widgets =  this.widgets;
		//unsetTimeAlarm(this.showPlayerFullDelay);
		//widgets.vodPlayerInfo.stateChange("exit");
		//widgets.vodButtons.stateChange("exit");
		//widgets.vodPlayerfocus.stateChange("exit");
		//widgets.vodRecommendations.stateChange("exit");
		this.home.showHeader({"section":"vodPlayer","fill":"rgba(40,20,40,.8)"});
		this.showButtonsPanel();
		this.home.widgets.player.stateChange("enter");
		widgets.playerLogo.stateChange("enter");
		/*if(_data){
			
		}*/
		//this.miniPlayer = undefined;
		this.activeFocus = "player";
		//unsetTimeAlarm(this.counterPlayer);
		unsetTimeAlarm(this.hideButtonsDelay);
		this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);

}
vodPlayer.prototype.hideButtonsPanel = function hideButtonsPanel(_status){
	var widgets =  this.widgets;
		this.client.lock();
		widgets.buttons.stateChange("exit");
		widgets.buttonsPanel.stateChange("exit");
		widgets.buttonsHeader.stateChange("exit");
		widgets.progressBarVod.stateChange("exit");
		widgets.vodControls.stateChange("exit");
		widgets.vodImg.stateChange("exit");
		this.client.unlock();
		if(!_status){
			this.home.hideHeader();
			this.activeFocus = "info";
		}
	
}
/*vodPlayer.prototype.hideBackground= function hideBackground(_url){	
	this.home.widgets.mainBg.stateChange("exit");
}*/
vodPlayer.prototype.playPause = function playPause(){
	var widgets = this.widgets;
	this.speed = 0;
		if(tpng.player.status == "PLAY"){
			widgets.bgControls.setDataAnimated({"detail":this.vodInfo},"exit","enter");
			widgets.buttons.list[2].img_on = "img/commons/player/playON.png";
			widgets.buttons.list[2].img_off = "img/commons/player/playOFF.png";
			widgets.buttons.list[2].text = "Reproducir";
			widgets.buttonsHeader.data.text = "Reproducir";
			widgets.vodControls.data.text = "";
			widgets.buttons.redraw();		
			widgets.buttonsHeader.redraw();
			widgets.vodControls.redraw();
			this.home.setPlayerStatus("PAUSE");	
			unsetTimeAlarm(this.hideButtonsDelay);
		}else if (tpng.player.status == "PAUSE" || tpng.player.status == "SPEED" || tpng.player.status == "SKIP" || tpng.player.status == "SEEK"){
			widgets.buttons.list[2].img_on = "img/commons/player/pauseON.png";
			widgets.buttons.list[2].img_off = "img/commons/player/pauseOFF.png";
			widgets.buttons.list[2].text = "Pausa";
			widgets.buttonsHeader.data.text = "Pausa";
			widgets.vodControls.data.text = "";
			widgets.buttons.redraw();		
			widgets.buttonsHeader.redraw();
			widgets.vodControls.redraw();
			widgets.bgControls.stateChange("exit");
			this.home.setPlayerStatus("PLAY");
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);	
		}
}
vodPlayer.prototype.skipPrev = function skipPrev(){
	var position = (this.home.playerGetProperty("POSITION"))/60000;
	   	this.speed = 0;
	   	position = ((Math.floor(position/10))-1);
	   	position = (position*10)*60000;
	   	position = position > 0 ? position : 0;
		this.home.setPlayerStatus("SEEK", parseInt(position));
	
	var buttons = this.widgets.buttons;
	buttons.list[2].img_on = "img/commons/player/pauseON.png";
	buttons.list[2].img_off = "img/commons/player/pauseOFF.png";
	buttons.list[2].text = "Pausa";
	buttons.redraw();
	tpng.player.status = "PLAY";
}
vodPlayer.prototype.skipNext = function skipNext(){
	var position = (this.home.playerGetProperty("POSITION"))/60000;
		this.speed = 0;
   	 	position = (((Math.floor(position/10))+1)*10)*60000;
		this.home.setPlayerStatus("SEEK", parseInt(position+(5*1000)));	
	
	var buttons = this.widgets.buttons;
	buttons.list[2].img_on = "img/commons/player/pauseON.png";
	buttons.list[2].img_off = "img/commons/player/pauseOFF.png";
	buttons.list[2].text = "Pausa";
	buttons.redraw();
	tpng.player.status = "PLAY";
}
vodPlayer.prototype.speedPrev = function speedPrev(){
	if(this.speed > 0) 
		this.speed = 0; //Para reiniciar el speed en caso de que venga del otro speed
	if(this.speed > -4){
		var buttons = this.widgets.buttons;
		var text = this.widgets.vodControls;
		var bgControls = this.widgets.bgControls;
		//Lógica para cambiar los botones de pausa a reproducir
		bgControls.setData({"detail":""});
		bgControls.refresh();
		bgControls.stateChange("enter");
		buttons.list[2].img_on = "img/commons/player/playON.png";
		buttons.list[2].img_off = "img/commons/player/playOFF.png";
		buttons.list[2].text = "Reproducir";
		//Lógica del speed rw
		this.speed --;
		var str = this.speedText(this.speed);
		this.home.setPlayerStatus("SPEED", this.speed);
		text.data.text = str;
		buttons.redraw();		
		text.redraw();

	}

}
vodPlayer.prototype.speedNext = function speedNext(){	
	if(this.speed < 0) 
		this.speed = 0; //Para reiniciar el speed en caso de que venga del otro speed
	if(this.speed < 4){
		var buttons = this.widgets.buttons;
		var text = this.widgets.vodControls;
		var bgControls = this.widgets.bgControls;
		//Lógica para cambiar los botones de pausa a reproducir
		bgControls.setData({"detail":""});
		bgControls.refresh();
		bgControls.stateChange("enter");
		buttons.list[2].img_on = "img/commons/player/playON.png";
		buttons.list[2].img_off = "img/commons/player/playOFF.png";
		buttons.list[2].text = "Reproducir";		
		//Lógica del speed ff
		this.speed ++;
		var str = this.speedText(this.speed);
		this.home.setPlayerStatus("SPEED", this.speed);
		text.data.text = str;
		buttons.redraw();		
		text.redraw();
		//text.setDataAnimated({"text": str},"exit", "enter");
	}
	  
}
vodPlayer.prototype.speedText = function speedText(_speed){
	var text = "";
	switch(_speed){
		case -1:
		case  1:
			text = 2;
		break;
		case -2:
		case  2:
			text = 4;
		break;
		case -3:
		case  3:
			text = 8;
		break;
		case -4:
		case  4:
			text = 16;
		break;
	}
	text = _speed < 0 ? "-"+text+"x" : "+"+text+"x";
	return text; 
}
vodPlayer.prototype.updateProgressBar = function updateProgressBar(){
	var widgets = this.widgets;
	var position = this.home.playerGetProperty("POSITION");
	var duration = this.home.playerGetProperty("DURATION");	
	var prc = (position*100)/duration;	

	/*if(prc > 97){	
		if(this.auxPlayer){
			
			widgets.optionsBookmark.stateChange("exit");
			widgets.bgControls.stateChange("exit");
			this.home.showHeader({"section":"PLAYER"});
			this.home.setPlayerStatus("PLAY");
			this.hideButtonsPanel(true);
			widgets.vodPlayerInfo.setData({"message":"<!size=28>¡Esperemos que la hayas disfrutado!","expiration":this.vodInfo.expiration});
			//widgets.vodPlayerInfo.setData("");
			widgets.vodPlayerInfo.refresh();
			widgets.vodPlayerfocus.setData({});
			widgets.vodPlayerfocus.refresh();
			this.showPlayerMini();
			unsetTimeAlarm(this.hideButtonsDelay);
			
			
		}
		unsetTimeAlarm(this.progressBarTimer);
		this.auxPlayer = false;
		//this.activeFocus = "home";
		
	}*/
	widgets.progressBarVod.setData({"progress": ((position/60000)*100)/this.vodInfo.duration,"min":parseInt(position/60000),"duration":this.vodInfo.duration});
	widgets.progressBarVod.refresh();		
}
vodPlayer.prototype.onStreamEvent = function onStreamEvent(event) {
	//TODO: ver cuando la URL NO reproduce o marca error
	//2. Hasta que el video comience lanzo la botonera, siempre con un delay de ? segundos.
	//eso también ayuda a que el getProperty("POSITION") no devuelva 0.
	//event.type = "error";
	switch(event.type){
		case "start":
		if(!this.auxChangeIdioma){
				this.initialTS = new Date().getTime(); //estadísticas
				if(this.vodInfo.bookmark != -1){
					clearTimeout(this.timer);
					this.timer = setTimeout(function(){
						this.widgets.playerLogo.stateChange("enter");
						this.home.setPlayerStatus("PAUSE");
						this.optionsBookmark(this.vodInfo);
					}.bind(this),1500);
				
				}else{
					/*if(this.miniPlayer){
						//Inicia por primera vez
						this.home.showHeader({"section":"PLAYER"});
						this.showPlayerMini();
						unsetTimeAlarm(this.counterPlayer);
						this.counterPlayer = this.counterPlayer.bind(this).repeat(1000);
						unsetTimeAlarm(this.showPlayerFullDelay);
						this.showPlayerFullDelay = this.showPlayerFull.bind(this,true).delay(10000);
					}else{
						//this.auxCount = 0;
						this.showPlayerFull(true);
					}*/
						this.showPlayerFull(true);
					
					//this.auxPlayer = false;
				}
		}
		break;
		case "endOfFile":
		case "end":
			this.home.closeSection(this);
		break;
		case "error":
			this.home.showHeader({"section":"PLAYER"});
			this.setDataBackground(this.vodInfo.images.url18X18);
			this.setDataRecommendations(this.vodInfo.vodId);
			this.showPlayerMini();
			this.widgets.vodPlayerfocus.setData({"error":"<!size=22>Ha ocurrido un error.<!> || Por favor comunícate a la Línea Totalplay al "+tpng.user.callCenterPhone+".","focus":true});
			this.widgets.vodPlayerfocus.stateChange("enter");
			//this.activeError = true;
		break;
		case "rewinded":
			var text = this.widgets.vodControls;
			var bgControls = this.widgets.bgControls;
			text.stateChange("exit");
			bgControls.stateChange("exit");
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
		break;
		
	}
}
vodPlayer.prototype.changeLanguage = function changeLanguage(){
		var bookmark = this.home.playerGetProperty("POSITION");
		this.indexUrl = this.widgets.vodControlsLanguage.selectIndex;
		this.auxChangeIdioma = true;
		this.home.playVideo(this.vod[this.indexUrl].url+"", "HLS", parseInt(bookmark-1000), null, this.vodInfo.isEncrypted);
		
		unsetTimeAlarm(this.timerHideLanguage);
		this.timerHideLanguage = this.hideLanguage.bind(this).delay(2000);
}
vodPlayer.prototype.hideLanguage = function hideLanguage(){
	var widgets = this.widgets;
	widgets.vodControlsLanguage.stateChange("exit");
	widgets.bgControls.stateChange("exit");
	this.activeFocus = "player";
	unsetTimeAlarm(this.hideButtonsDelay);
	this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
}
vodPlayer.prototype.hidechangeLanguage = function hidechangeLanguage(_control){
	var widgets = this.widgets;
		widgets.bgControls.stateChange("exit");
		widgets.vodControls.data.text = "";
		widgets.vodControls.refresh();
		this.auxAudios = true;
}
vodPlayer.prototype.initButtons = function initButtons(_data){	
	var data = [
	
		{"x": 343, "text": "-10 min", "action":"SKIP_RW","img_on":"img/commons/player/skiprewON.png", "img_off":"img/commons/player/skiprewOFF.png"},
		{"x": 417, "text": "Regresar", "action":"REW",	"img_on":"img/commons/player/rewON.png", "img_off":"img/commons/player/rewOFF.png"},
		{"x": 481, "text": "Pausa", "action":"PAUSE",	"img_on":"img/commons/player/pauseON.png", "img_off":"img/commons/player/pauseOFF.png"},
		{"x": 545, "text": "Adelantar", "action":"FF","img_on":"img/commons/player/ffON.png", "img_off":"img/commons/player/ffOFF.png"},
		{"x": 609, "text": "+10 min", "action":"SKIP_FF","img_on":"img/commons/player/skipffON.png", "img_off":"img/commons/player/skipffOFF.png"},
		{"x": 673, "text": "Detener", "action":"STOP",	"img_on":"img/commons/player/stopON.png", "img_off":"img/commons/player/stopOFF.png"},
		{"x": 737, "text": "Audios", "action":"AUDIOS","img_on":"img/commons/player/idiomaON.png", "img_off":"img/commons/player/idiomaOFF.png"}
		
		/*{"x": 323, "text": "-10 min", "action":"SKIP_RW","img_on":"img/commons/player/skiprewON.png", "img_off":"img/commons/player/skiprewOFF.png"},
		{"x": 387, "text": "Regresar", "action":"REW",	"img_on":"img/commons/player/rewON.png", "img_off":"img/commons/player/rewOFF.png"},
		{"x": 451, "text": "Pausa", "action":"PAUSE",	"img_on":"img/commons/player/pauseON.png", "img_off":"img/commons/player/pauseOFF.png"},
		{"x": 515, "text": "Adelantar", "action":"FF","img_on":"img/commons/player/ffON.png", "img_off":"img/commons/player/ffOFF.png"},
		{"x": 579, "text": "+10 min", "action":"SKIP_FF","img_on":"img/commons/player/skipffON.png", "img_off":"img/commons/player/skipffOFF.png"},
		{"x": 643, "text": "Detener", "action":"STOP",	"img_on":"img/commons/player/stopON.png", "img_off":"img/commons/player/stopOFF.png"},
		{"x": 707, "text": "Audios", "action":"AUDIOS","img_on":"img/commons/player/idiomaON.png", "img_off":"img/commons/player/idiomaOFF.png"}
		*/
		//{"x": 771, "text": "info", "action":"INFO","img_on":"img/commons/player/infoON.png", "img_off":"img/commons/player/infoOFF.png"}
	];
	return data;
}
vodPlayer.prototype.onKeyPress = function onKeyPress(_key){
	
	switch(this.activeFocus){
		case "home":
			this.onKeyPress_Home(_key);
		break;
		/*case "buttons":
			this.onKeyPress_Buttons(_key);
		break;*/
		case "recommendations":
			this.onKeyPress_Recommendations(_key);
		break;
		case "player":
			this.onKeyPress_Player(_key);
		break;
		case "info":
			this.onKeyPress_Info(_key);
		break;
		case "bookmark":
			this.onKeyPress_Bookmark(_key);
		break;
		case "optionsPlayer":
			this.onKeyPress_Options(_key);
		break;
		case "language":
			this.onKeyPress_Language(_key);
		break;
		case "search":
			this.onKeyPressSearch(_key); 
		break;

	}
	return true;	
}
vodPlayer.prototype.onKeyPress_Home = function onKeyPress_Home(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_IRENTER":
		case "KEY_IRBACK":
		case "KEY_MENU":
			//this.hideBackground();
			//tpng.app.sections = []; 
			this.sendBookmark();
			this.home.closeSection(this);
			
		break;
		case "KEY_UP":
			this.activeFocus = "search";
			widgets.vodPlayerfocus.setData({"error":"<!size=22>Ha ocurrido un error.<!> || Por favor comunícate a la Línea Totalplay al "+tpng.user.callCenterPhone+".","focus":false});
			widgets.vodPlayerfocus.refresh();
			
    		this.home.enableSearchHeader();
    		this.auxSearchBtn = "miniPlayer";
    		unsetTimeAlarm(this.hideButtonsDelay);
    	break;
		/*case "KEY_DOWN":
			widgets.vodButtons.setFocus(true);
			widgets.vodPlayerfocus.stateChange("exit_off");
			unsetTimeAlarm(this.showPlayerFullDelay);
			unsetTimeAlarm(this.counterPlayer);
			this.activeFocus = "buttons";
			if(!this.miniPlayer){
				this.auxPlayer = true;
			}	
		break;*/
		case "KEY_DOWN":
			if(widgets.vodRecommendations.maxItem>0){
				
				this.widgets.vodPlayerfocus.setData({"error":"<!size=22>Ha ocurrido un error.<!> || Por favor comunícate a la Línea Totalplay al "+tpng.user.callCenterPhone+".","focus":false});
				this.widgets.vodPlayerfocus.refresh();
				//widgets.vodPlayerfocus.stateChange("exit_off");
				widgets.vodRecommendations.setFocus(true);
				//unsetTimeAlarm(this.showPlayerFullDelay);
				//unsetTimeAlarm(this.counterPlayer);
				this.activeFocus = "recommendations";
				
				/*if(!this.miniPlayer)
					this.auxPlayer = true;*/
			}	
		break;
		/*case "KEY_IRENTER":
			var position = this.home.playerGetProperty("POSITION");
			var duration = this.home.playerGetProperty("DURATION");	
			var prc = (position*100)/duration;	

			if(prc < 97){	
				if(!this.activeError){
					this.home.hideHeader();
					this.showPlayerFull();
					this.hideBackground();
					if(this.auxPlayer){
						unsetTimeAlarm(this.hideButtonsDelay);
						this.optionsBookmark();	
					}else{
						unsetTimeAlarm(this.showPlayerFullDelay);
						unsetTimeAlarm(this.counterPlayer);
						this.showButtonsPanel();
					}
				}
			}
		break;*/
	}	
	return true;
}
/*vodPlayer.prototype.onKeyPress_Buttons = function onKeyPress_Buttons(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);	
		break;
		case "KEY_RIGHT":
			widgets.vodButtons.setFocus(false);
			
			if(widgets.vodPlayerfocus.data.bookmark){
				widgets.vodPlayerfocus.stateChange("enter");
			}else{
				widgets.vodPlayerfocus.setData("");
				widgets.vodPlayerfocus.stateChange("enter");
			}
			
			this.activeFocus = "home";
		break;
		case "KEY_UP":
			if(widgets.vodButtons.scrollPrev()){
			}else{
				this.activeFocus = "search";
				widgets.vodButtons.setFocus(false);
				this.home.enableSearchHeader();
				this.auxSearchBtn = "vodButtons";
				unsetTimeAlarm(this.hideButtonsDelay);
			}
		break;
		case "KEY_DOWN":			
			widgets.vodButtons.scrollNext();
    	break;
		case "KEY_IRENTER":
			switch(widgets.vodButtons.selectItem.action){
				case "BACK":
					this.home.closeSection(this);
				break;
				case "SEARCH":
					var name = replaceAll(this.vodInfo.name, " ", "@");
					this.home.openSection("search",{"home":this.home, "pattern": name},true,, false);
				break;				
			}
		break;
		
	}	
	return true;
}*/

vodPlayer.prototype.onKeyPress_Player = function onKeyPress_Player(_key){
	var widgets = this.widgets,
		buttons = this.widgets.buttons;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			if(tpng.player.status == "PLAY"){
				unsetTimeAlarm(this.timerToShowButton);
				unsetTimeAlarm(this.hideButtonsDelay);
				this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(700);		
			}else if(tpng.player.status == "PAUSE"){
				widgets.bgControls.stateChange("exit");
				unsetTimeAlarm(this.timerToShowButton);
				this.hideButtonsPanel();
				this.optionsPlayer();
			}
		break;
		case "KEY_RIGHT":
		case "KEY_LEFT":
			unsetTimeAlarm(this.timerToShowButton);
			if(tpng.player.status == "PLAY"){
				unsetTimeAlarm(this.hideButtonsDelay);
				this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);	
			}
			_key == "KEY_LEFT" ? widgets.buttons.scrollPrev() : widgets.buttons.scrollNext(); 	
    	break;
		case "KEY_TV_PLAY":
		case "KEY_TV_STOP":
		case "KEY_PIP":
		case "KEY_PIP_LONG":
		case "KEY_PAGE_PREV":
		case "KEY_PREV":
		case "KEY_NEXT":
			this.onKeyPress_Action(_key);
		break;
		case "KEY_IRENTER":
			this.onKeyPress_Action(widgets.buttons.selectItem.action);
		break;
		case "KEY_TV_AUDIO":
			if(widgets.vodControlsLanguage.maxItem>1){
				unsetTimeAlarm(this.hideButtonsDelay);
				widgets.bgControls.setData("");
				widgets.bgControls.stateChange("enter");
				widgets.vodControlsLanguage.scrollNext();
				widgets.vodControlsLanguage.stateChange("enter");
				widgets.vodControls.data.text = "";
				widgets.vodControls.refresh();
				
				buttons.list[2].img_on = "img/commons/player/pauseON.png";
				buttons.list[2].img_off = "img/commons/player/pauseOFF.png";
				buttons.list[2].text = "Pausa";
				buttons.redraw();
				
				this.activeFocus = "language";

				this.activeTimeoutLanguage();
				
			}else{
				if(this.auxAudios){
					widgets.bgControls.setDataAnimated({},"exit","enter");
					widgets.vodControls.data.text = "No disponible";
					widgets.vodControls.redraw();	
					unsetTimeAlarm(this.hideChangeLanguage);
					this.hideChangeLanguage = this.hidechangeLanguage.bind(this).delay(2000);
					this.auxAudios = false;
				}
			}
		break;
		case "KEY_UP":
			this.activeFocus = "search";
			
			widgets.buttons.setFocus(false);
    		this.home.enableSearchHeader();
    		if(widgets.bgControls.stateGet() == "enter"){
    			widgets.bgControls.animation.move(0,75,150).start();
    		}
    		
    		this.auxSearchBtn = "player";
    		unsetTimeAlarm(this.hideButtonsDelay);
    	break;
	    /*case "KEY_DOWN":
	    	unsetTimeAlarm(this.timerToShowButton);
	    	unsetTimeAlarm(this.hideButtonsDelay);
	    	if(tpng.player.status == "PLAY"){
	    		this.hideButtonsPanel();
	    		this.widgets.playerLogo.stateChange("exit");
	    		this.home.openSection("vodDetail",{"home":this.home, "VodMovieVO":this.vodInfo,"vodPlayer":true,"vodParent":this},false,null,true);
	    	}else if(tpng.player.status == "PAUSE"){
	    		this.hideButtonsPanel();
	    		this.widgets.vodControls.data.text = "";
				this.widgets.vodControls.refresh();
				this.widgets.bgControls.stateChange("exit");
				this.widgets.playerLogo.stateChange("exit");
				this.home.openSection("vodDetail",{"home":this.home, "VodMovieVO":this.vodInfo,"vodPlayer":true,"vodParent":this},false,null,true);
	   		}
	    break;*/
	    case "KEY_DOWN":
	    break;
	    default:
			this.showButtonsPanel();
			unsetTimeAlarm(this.timerToShowButton);
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);//Lo desaparezco en 10 seg
	    break;	
	}	
	return true;
}


vodPlayer.prototype.activeTimeoutLanguage = function activeTimeoutLanguage(){
	var that=this;
	clearTimeout(this.timerLanguagePlayer);
	this.timerLanguagePlayer = setTimeout(
		function (){
			that.changeLanguage();
		}
		, 2500);
}


vodPlayer.prototype.onKeyPress_Info = function onKeyPress_Info(_key){
	switch(_key){
		case "KEY_TV_PLAY":
		case "KEY_IRENTER":
			this.showButtonsPanel();
			this.playPause();
			unsetTimeAlarm(this.hideButtonsDelay);
		break;
		case "KEY_NEXT": //FAST FORWARD
			this.showButtonsPanel();
			this.widgets.buttons.scrollTo(3);
			this.speedNext();
			this.auxPlayer = true;
			unsetTimeAlarm(this.hideButtonsDelay);
		break;
		case "KEY_PREV": //REWIND
			this.showButtonsPanel();
			unsetTimeAlarm(this.hideButtonsDelay);
			this.widgets.buttons.scrollTo(1);
			this.speedPrev();
			this.auxPlayer = true;
			unsetTimeAlarm(this.hideButtonsDelay);
		break;
		case "KEY_TV_STOP":
			this.home.closeSection(this);
		break;
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.optionsPlayer(this.vodInfo);
			this.hideButtonsPanel();
			unsetTimeAlarm(this.hideButtonsDelay);
			unsetTimeAlarm(this.timerToShowButton);
			this.activeFocus = "optionsPlayer";
		break;
		default:
			this.showButtonsPanel();
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
		break;
		
	}	
	return true;
}
vodPlayer.prototype.onKeyPress_Action = function onKeyPress_Action(_control){
	unsetTimeAlarm(this.hideButtonsDelay);
	switch(_control){
		case "KEY_TV_PLAY":
			this.widgets.buttons.scrollTo(2);
		case "PAUSE":
		case "PLAY":
			this.playPause();
		break;
		case "KEY_PAGE_PREV": //SKIP -10 MIN
		case "SKIP_RW": 
			this.skipPrev();
			unsetTimeAlarm(this.hideButtonsDelay);
			this.widgets.vodControls.data.text = "";
			this.widgets.vodControls.refresh();
			this.widgets.bgControls.stateChange("exit");
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);	
			this.auxPlayer = true;
		break;		
		case "SKIP_FF": 
			this.skipNext();
			unsetTimeAlarm(this.hideButtonsDelay);
			this.widgets.vodControls.data.text = "";
			this.widgets.vodControls.refresh();
			this.widgets.bgControls.stateChange("exit");
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);	
			this.auxPlayer = true;
		break;		
		case "KEY_NEXT": //FAST FORWARD
			this.widgets.buttons.scrollTo(3);
			this.speedNext();
			unsetTimeAlarm(this.hideButtonsDelay);
			this.auxPlayer = true;
		break;
		case "FF": 
			this.speedNext();
			this.auxPlayer = true;
			 unsetTimeAlarm(this.hideButtonsDelay);
		break;
		case "KEY_PREV": //REWIND
			unsetTimeAlarm(this.hideButtonsDelay);
			this.widgets.buttons.scrollTo(1);
			this.speedPrev();
			this.auxPlayer = true;
		break;
		case "REW": 
			this.speedPrev();
			this.auxPlayer = true;
			 unsetTimeAlarm(this.hideButtonsDelay);
		break;
		case "KEY_TV_STOP":
		case "STOP":
			this.sendBookmark();
			this.home.closeSection(this);
		break;
		case "AUDIOS":
			var widgets = this.widgets,
				buttons = this.widgets.buttons;
			if(widgets.vodControlsLanguage.maxItem>1){
				unsetTimeAlarm(this.hideButtonsDelay);
				widgets.bgControls.setData("");
				widgets.bgControls.stateChange("enter");
				widgets.vodControlsLanguage.scrollNext();
				widgets.vodControlsLanguage.stateChange("enter");
				widgets.vodControls.data.text = "";
				widgets.vodControls.refresh();
				//widgets.bgControls.stateChange("exit");
				buttons.list[2].img_on = "img/commons/player/pauseON.png";
				buttons.list[2].img_off = "img/commons/player/pauseOFF.png";
				buttons.list[2].text = "Pausa";
				buttons.redraw();
				this.activeFocus = "language";
				this.activeTimeoutLanguage();
			}else{
				if(this.auxAudios){
					widgets.bgControls.setDataAnimated({},"exit","enter");
					widgets.vodControls.data.text = "No disponible";
					widgets.vodControls.redraw();	
					unsetTimeAlarm(this.hideChangeLanguage);
					unsetTimeAlarm(this.hideButtonsDelay);
					this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
					this.hideChangeLanguage = this.hidechangeLanguage.bind(this).delay(2000);
					this.auxAudios = false;
				}
			}
		break;
	}
}
vodPlayer.prototype.onKeyPress_Recommendations = function onKeyPress_Recommendations(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		case "KEY_LEFT":
		case "KEY_RIGHT":			
			_key == "KEY_LEFT" ? widgets.vodRecommendations.scrollPrev() : widgets.vodRecommendations.scrollNext();
    	break;
		case "KEY_DOWN":
				/*this.activeFocus = "search";
				widgets.vodRecommendations.setFocus(false);
    			this.home.enableSearchHeader();
    			this.auxSearchBtn = "recommendations";
    			unsetTimeAlarm(this.hideButtonsDelay);
			   unsetTimeAlarm(this.hideButtonsDelay);
				*/
		break;
		case "KEY_UP":
			/*if(widgets.vodPlayerfocus.data.bookmark){
				widgets.vodPlayerfocus.stateChange("enter");
			}else{
				widgets.vodPlayerfocus.setData("");
				widgets.vodPlayerfocus.stateChange("enter");
			}*/
			
			
			widgets.vodPlayerfocus.setData({"error":"<!size=22>Ha ocurrido un error.<!> || Por favor comunícate a la Línea Totalplay al "+tpng.user.callCenterPhone+".","focus":true});
			widgets.vodPlayerfocus.refresh();
			
			widgets.vodRecommendations.setFocus(false);
			//unsetTimeAlarm(this.showPlayerFullDelay);
			//unsetTimeAlarm(this.counterPlayer);
			this.activeFocus = "home";
		break;
		case "KEY_IRENTER":
			//tpng.app.sections = []; 
	    	var section = widgets.vodRecommendations.selectItem.ItemVO.link;
	    		section.parameters.isRecom = true;
	    	this.home.openLink(section,null,7);
	    	//this.home.openSection(section.ref,{"home":this.home, "parameters": section.parameters}, false);
    	
    	break;
	}	
	return true;
}
vodPlayer.prototype.onKeyPress_Bookmark = function onKeyPress_Bookmark(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_LEFT":
		case "KEY_RIGHT":		
			_key == "KEY_LEFT" ? widgets.optionsBookmark.scrollPrev() : widgets.optionsBookmark.scrollNext();
    	break;
    	case "KEY_IRENTER":
			switch(widgets.optionsBookmark.selectItem.action){
			case "INICIO":
				widgets.vodPlayerInfo.stateChange("exit");
				widgets.optionsBookmark.stateChange("exit");
				this.home.setPlayerStatus("STOP");
				this.sendBookmark();
				this.home.playVideo(this.vod[this.indexUrl].url,"HLS", 0, null, this.vodInfo.isEncrypted);
				this.vodInfo.bookmark = -1;
				
			break;
			case "REANUDAR":
				widgets.vodPlayerInfo.stateChange("exit");
				widgets.optionsBookmark.stateChange("exit");
				this.home.setPlayerStatus("PLAY");
				this.setDataPanel(this.vodInfo);
				this.showButtonsPanel();
				unsetTimeAlarm(this.hideButtonsDelay);
				this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);//Lo desaparezco en 10 seg
			break;
			
			}
		break;
		
	}	
	return true;
}
vodPlayer.prototype.onKeyPress_Options = function onKeyPress_Options(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			widgets.vodPlayerInfo.stateChange("exit");
			widgets.optionsBookmark.stateChange("exit");
			this.showButtonsPanel();
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);//Lo desaparezco en 10 seg	
		break;
		case "KEY_LEFT":
		case "KEY_RIGHT":		
			_key == "KEY_LEFT" ? widgets.optionsBookmark.scrollPrev() : widgets.optionsBookmark.scrollNext();
    	break;
    	case "KEY_IRENTER":
			switch(widgets.optionsBookmark.selectItem.action){
				case "SALIR":
					this.sendBookmark();
					this.home.closeSection(this);
				break;
				case "SEGUIR":
					if(tpng.player.status == "PAUSE")
						this.home.setPlayerStatus("PLAY");
					
					widgets.vodPlayerInfo.stateChange("exit");
					widgets.optionsBookmark.stateChange("exit");
					this.showButtonsPanel();
					unsetTimeAlarm(this.hideButtonsDelay);
					this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);//Lo desaparezco en 10 seg
				break;
			}
		break;
		
	}	
	return true;
}
vodPlayer.prototype.onKeyPress_Language = function onKeyPress_Language(_key){
	var widgets = this.widgets;
	switch(_key){
    	case "KEY_IRENTER":
    			widgets.vodControlsLanguage.scrollNext();
				//unsetTimeAlarm(this.timerChangeLanguage);
				//this.timerChangeLanguage = this.changeLanguage.bind(this).delay(1000);
				
				this.activeTimeoutLanguage();
		break;
		
	}	
	return true;
}
vodPlayer.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	var widgets = this.widgets;
	switch(_key){			
    	case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
		if(this.auxSearchBtn == "miniPlayer"){
			this.activeFocus = "home";
			widgets.vodPlayerfocus.setData({"error":"<!size=22>Ha ocurrido un error.<!> || Por favor comunícate a la Línea Totalplay al "+tpng.user.callCenterPhone+".","focus":true});
			widgets.vodPlayerfocus.refresh();
			this.home.disableSearchHeader();
			unsetTimeAlarm(this.hideButtonsDelay);
		}else if(this.auxSearchBtn == "player"){
			this.activeFocus = "player";
			widgets.buttons.setFocus(true);
			if(widgets.bgControls.stateGet() == "enter"){
				widgets.bgControls.animation.move(0,110,150).start();
			}
			this.home.disableSearchHeader();
			
			if(tpng.player.status == "PLAY"){
				unsetTimeAlarm(this.hideButtonsDelay);
				this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
			}
    	}
    	break;
	   default:
	   		this.home.onKeyPress(_key);			
		break;
    }
	return true;
}

vodPlayer.drawVodRecommendations = function drawVodRecommendations(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	this.draw = function draw(focus) {	
	
		//var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
		//	custo = JSON.parse(custo);

		//tp_draw.getSingleton().drawImage("img/commons/badges/badge_Peliculas.png", ctx, 159, 1);
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
		if(focus){
				custo.rx = 5;
				custo.stroke_width = 5;
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

				var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_pos" : "inside"};
				Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10], strokeF);
				//388 //222
		}else{
				Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo); //FONDO		
			}

		tp_draw.getSingleton().drawImage(_data.ItemVO.images.url3X3, ctx, 5, 5, null, null, null,"destination-over"); //tmp el w y h
		
		//Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		ctx.drawObject(ctx.endObject());
	}	
}
vodPlayer.drawVodPlayerfocus = function drawVodPlayerfocus(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	
	var custo = JSON.stringify(this.themaData.whiteStrokePanel)	
		custo = JSON.parse(custo);
		custo.rx = 5;
		custo.stroke_width = 5;
		
	
	
	var  custo_f = JSON.stringify(this.themaData.standardFont);
		 custo_f = JSON.parse(custo_f);
		 custo_f.text_align = "center,middle";
		 custo_f.font_size = 18 * tpng.thema.text_proportion;
		 custo_f.fill = "rgba(240, 240, 250, 1)";
	
	if(_data.focus)	{ 
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	}else{
		custo.rx = 1;
		custo.stroke_width = 1;
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	}
	
	if(_data.error)
		Canvas.drawText(ctx,_data.error , new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
	if(_data.bookmark){
		tp_draw.getSingleton().drawImage("img/vod/playVOD.png", ctx, 292, 155);
		Canvas.drawText(ctx,"Bookmark | -min "+_data.bookmark+"-" , new Rect(192,200,250,40), custo_f);
	}
	if(_data.counter){
		tp_draw.getSingleton().drawImage("img/vod/playVOD.png", ctx, 292, 155);
		Canvas.drawText(ctx,"Pantalla completa en "+_data.counter+"...", new Rect(192,200,250,40), custo_f);
	}
	
	ctx.drawObject(ctx.endObject());	
}
vodPlayer.drawVodPlayerInfo = function drawVodPlayerInfo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
     var custo_f = JSON.stringify(this.themaData.standardFont);
		 custo_f = JSON.parse(custo_f);
		 custo_f.text_align = "right,top";
		 custo_f.font_size = 18 * tpng.thema.text_proportion;
		 custo_f.fill = "rgba(240, 240, 250, 1)";
		
		
		
		if(_data.message){
			Canvas.drawText(ctx,_data.message , new Rect(120, 603, 122, 68), custo_f);
			//Canvas.drawText(ctx,"Gracias por rentar con nosotros.|"+_data.message+"||<!> <!color=rgba(110,60,130,1)>"+_data.expiration+"<!>" , new Rect(0, 542, ctx.viewportWidth, 104), custo_f);
			var custoW = {fill: "rgba(220, 220, 230, 1)"};
			Canvas.drawShape(ctx, "rect", [253,578,1,104], custoW);
			Canvas.drawShape(ctx, "rect", [1027,578,1,104], custoW);
		
		}else{
			Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth,ctx.viewportHeight],{"fill":"rgba(40,20,40,.8)"});
	    	Canvas.drawShape(ctx, "rect", [639, 290, 1,140],{"fill":"rgba(240, 240, 250, 1)"});
	    }
	    
	    
	    
	    
    ctx.drawObject(ctx.endObject());	
}
vodPlayer.drawVodImg= function drawVodImg(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    
   
    var custo_f = JSON.stringify(this.themaData.standardFont);
		 custo_f = JSON.parse(custo_f);
		 custo_f.text_align = "left,top";
		 custo_f.font_size = 17 * tpng.thema.text_proportion;
		 custo_f.fill = "rgba(190, 160, 200, 1)";
		 
	

    tp_draw.getSingleton().drawImage("img/vod/estasviendo.png", ctx, 0, 0,null,null,null,"destination-over");
    Canvas.drawText(ctx,"Estás viendo:" , new Rect(67, 0, 120, 32), custo_f);
	tp_draw.getSingleton().drawImage(_data.images.url3X3, ctx, 67, 26);
	Canvas.drawShape(ctx, "rect",[66, 25, 189, 107], this.themaData.whiteStrokePanelTimeline);
	
	ctx.drawObject(ctx.endObject());	
}
//
vodPlayer.drawButtonsPanel = function drawButtonsPanel(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    

	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], {"fill": "rgba(40,20,40,.8)"});
 	//tp_draw.getSingleton().drawImage("img/vod/1x1_moreinfo.png", ctx, 610, 45);
	ctx.drawObject(ctx.endObject());	
}


vodPlayer.drawButtonsPlayer = function drawButtonsPlayer(_data){ 		
	this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		var fill = focus ? {"fill": "rgba(240,240,250,1)"} : {};
		Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight], fill);
		var img = focus ? _data.img_on : _data.img_off;
		tp_draw.getSingleton().drawImage(img, ctx, 0, 0);
		
		ctx.drawObject(ctx.endObject());	
	}
}
vodPlayer.drawOptionsBookmark = function drawOptionsBookmark(_data){ 		
	this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		var custo_f = JSON.stringify(this.themaData.standarBlackFont);
		custo_f = JSON.parse(custo_f);		
		custo_f.text_align = "center,middle";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		
		custo_f.fill = focus ? "rgba(240,240,250,1)" : "rgba(240,240,250,.3)";
		Canvas.drawText(ctx, _data.label, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo_f);

		ctx.drawObject(ctx.endObject());	
	}
}
vodPlayer.drawButtonsHeader = function drawButtonsHeader(_data){ 		
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	var custo_f = JSON.stringify(this.themaData.standarBlackFont);
	custo_f = JSON.parse(custo_f);		
	custo_f.text_align = "center,top";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text+"", new Rect(_data.x+5, 27, 174, 32), custo_f);
	tp_draw.getSingleton().drawImage("img/commons/player/TextBalloon3x3.png", ctx, _data.x, 0,null,null,null,"destination-over");
	
	ctx.drawObject(ctx.endObject());	
}
vodPlayer.drawProgressBarVod = function drawProgressBarVod(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();    
    var progress = (_data.progress * 1146) / 100;
    
    Canvas.drawShape(ctx, "rect", [67,0,1146,4], {"fill": "rgba(240, 240, 250, .3)"});
    Canvas.drawShape(ctx, "rect", [0,0,67,4], {"fill": "rgba(130, 60, 150, 1)"});
	
	Canvas.drawShape(ctx, "rect", [67,0,progress,4], {"fill": "rgba(130, 60, 150, 1)"});
    Canvas.drawShape(ctx, "rect", [(progress+67),0,1,4],{"fill": "rgba(240, 240, 250, 1)"});
 	
 	Canvas.drawShape(ctx, "rect", [1213,0,67,4], {"fill": "rgba(240, 240, 250, .3)"});  
	
 	
 	var bloques =_data.duration;
  	var size = (1146/bloques)*10;
  	
  	
  	Canvas.drawShape(ctx, "rect", [67,0,1, 4], {"fill": "rgba(40,20,40,1)"});
  	
  	while(size < 1146){
	  	Canvas.drawShape(ctx, "rect", [size+67,0,1, 4], {"fill": "rgba(40,20,40,1)"});
  		size += (1146/bloques)*10;
  	}
  	
  	Canvas.drawShape(ctx, "rect", [1213,0,1,4], {"fill": "rgba(40,20,40,1)"});
	
	var custo_f = JSON.stringify(this.themaData.standarBlackFont);
		custo_f = JSON.parse(custo_f);		
		custo_f.text_align = "right,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
  	 	custo_f.fill = "rgba(240, 240, 250, 1)";
	
	Canvas.drawText(ctx, _data.min+" min / "+_data.duration+" min", new Rect(67,15,1146,ctx.viewportHeight), custo_f);
 
  		
	ctx.drawObject(ctx.endObject());	
}
vodPlayer.drawPlayerLogo = function drawPlayerLogo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    tp_draw.getSingleton().drawImage("img/vod/1x1_MarcaAguaPEL.png", ctx, 0, 0,null,null,null,"destination-over");	
	ctx.drawObject(ctx.endObject());
}
vodPlayer.drawVodControls = function drawVodControls(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custo_f = JSON.stringify(this.themaData.standarBlackFont);
		custo_f = JSON.parse(custo_f);		
		custo_f.text_align = "center,middle";
		custo_f.fill = "rgba(240,240,250,1)";
		
	if(_data.text){
		custo_f.font_size = 50 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.text+"", new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo_f);
	}
	ctx.drawObject(ctx.endObject());
}
vodPlayer.drawBgControls = function drawBgControls(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
     var custo_f = JSON.stringify(this.themaData.standardFont);
		 custo_f = JSON.parse(custo_f);
    
    Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight], {"fill":"rgba(0,0,0,.4)"});
    
    if(_data.detail){
	    custo_f.text_align = "left,Top";
		custo_f.font_size = 34 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, toUpperCase(_data.detail.name) , new Rect(67, 61, ctx.viewportWidth, ctx.viewportHeight), custo_f);
    
    
    	//description
		custo_f.text_align = "left,top";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		var year = _data.detail.year ? _data.detail.year+" / " : "";
		Canvas.drawText(ctx, "<!line-height=25>------ / "+year+_data.detail.description+"<!>", new Rect(67, 190, 570, 167), custo_f);
	   // 
	    //autores
		custo_f.fill = "rgba(170,170,180,1)";
		custo_f.text_align = "left,top";
		Canvas.drawText(ctx, "<!i>"+_data.detail.actors+"<!>", new Rect(67, 153, 570, 32), custo_f);
		
		//originalName
		Canvas.drawText(ctx, "<!i>"+toUpperCase(_data.detail.originalName)+"<!>", new Rect(67, 118, 570, 32), custo_f);
		
		//RATING
		tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.detail.rating+".png", ctx, 67, 195);
		
    
    }
    

	ctx.drawObject(ctx.endObject());
}
vodPlayer.drawVodControlsLanguage = function drawVodControlsLanguage(_data){ 		
	this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		var custo_f = JSON.stringify(this.themaData.standarBlackFont);
		custo_f = JSON.parse(custo_f);		
		custo_f.text_align = "center,middle";
		custo_f.font_size = 50 * tpng.thema.text_proportion;
		
		custo_f.fill = focus ? "rgba(240,240,250,1)" : "rgba(240,240,250,.3)";
		Canvas.drawText(ctx, _data.audio, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo_f);

		ctx.drawObject(ctx.endObject());	
	}
}
vodPlayer.drawMalla = function drawMalla(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		tp_draw.getSingleton().drawImage("img/tmp/DevsOnion.png", ctx, 0, 0);	
		
		ctx.drawObject(ctx.endObject());
}
vodPlayer.prototype.saveInfo = function saveCTVinfo(){
	var seconds = ((new Date().getTime())-this.initialTS)/1000;
	seconds = Math.round(seconds);
	tpng.statistics.vods.push({"ts": new Date().getTime(), "id": this.vodId, "value": seconds});
}
vodPlayer.prototype.onExit = function onExit(_data){
	this.saveInfo();

	this.home.setPlayerStatus("STOP");	
	this.home.objectChild = null;
	this.home.hideHeader();
	this.hideButtonsPanel();
	
	this.home.hideBg();
	unsetTimeAlarm(this.hideButtonsDelay);
	unsetTimeAlarm(this.progressBarTimer);
	//unsetTimeAlarm(this.showPlayerFullDelay);
	unsetTimeAlarm(this.timerToShowButton);
	unsetTimeAlarm(this.timerChangeLanguage);
	unsetTimeAlarm(this.hideChangeLanguage);
	//unsetTimeAlarm(this.counterPlayer);
	clearTimeout(this.timer);
	//clearTimeout(this.timerBtn);
	
	this.widgets.stateChange("exit");
	this.widgets.vodPlayerfocus.stateChange("exit_off");
	
	/*this.widgets.vodPlayerInfo.stateChange("exit");
	this.widgets.vodRecommendations.stateChange("exit");
	this.widgets.playerLogo.stateChange("exit");*/
}

