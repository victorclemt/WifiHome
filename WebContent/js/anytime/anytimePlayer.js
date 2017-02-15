
FormWidget.registerTypeStandard("anytimePlayer");

function anytimePlayer(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.secondsToHide = 5;
   	this.speed = 0;
   	this.auxOpt = null;
   	this.auxAudios = true;
}
anytimePlayer.inherits(FormWidget);

anytimePlayer.prototype.onEnter = function onEnter(_data){	
	this.home = _data.home;
	this.program = _data.program; //Programa recibido de las guías
	this.home.objectChild = this; //Player Events	
	//Validación inicial
	//this.widgets.malla.setData("");
	//this.widgets.malla.stateChange("enter");
	
	/*this.home.setBg(this.program.images.url18X18);
	this.widgets.notFound.setData({"message": this.program.name});
	this.widgets.notFound.stateChange("enter");
	this.widgets.myLoadingIndicator.start();*/
	
	if(_data.parameters){
		var params = ["epgId="+_data.parameters.epgId, "channel="+_data.parameters.channel, "lchId=" + _data.parameters.lchId];
		getServices.getSingleton().call("EPG_GET_PROGRAM", params, this.responseGetRecommendationSection.bind(this));
	
	}else if(this.program){
		if(this.program.profileLoked || this.program.parentalRating == "D"){
			this.home.openSection("unlockProgram",{"home":this.home, "parentAP":this, section:"anytimePlayer","program":this.program,"channel":this.program.ChannelVO}, false,null,true);
		}else{
			this.initPlayer(this.program);	
		}
	}	
}

anytimePlayer.prototype.responseGetRecommendationSection = function responseGetRecommendationSection(response){
	if(response.status == 200){
		this.program = response.data.ProgramVO;

		if(this.program.profileLoked || this.program.parentalRating == "D"){
			this.home.openSection("unlockProgram",{"home":this.home, "parentAP":this, section:"anytimePlayer","program":this.program,"channel":this.program.ChannelVO}, false,null,true);
		}else{
			this.initPlayer(this.program);	
		}
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false, null, true);
	}
}
anytimePlayer.prototype.openNextSection = function openNextSection(){
	this.initPlayer(this.program);
	
}
anytimePlayer.prototype.initPlayer = function initPlayer(_program){
	var w = this.widgets,
		panel = w.buttonsPanel,
		bg = w.programBg,
		logo = w.anytimeLogo;
	//1. Pintamos la pantalla con el fondo del programa y la información del programa
	//TODO: poner el bg en una función aparte
	this.idEpg = _program.id;
	
	
	
	this.home.setBg(_program.images.url18X18);
	this.widgets.notFound.setData({"message": _program.name});
	this.widgets.notFound.stateChange("enter");
	this.widgets.myLoadingIndicator.start();
	
	
	panel.setData(_program);
	//bg.setData(_program);
	logo.setData();
	tpng.menu.data = [];
	tpng.menu.tsMenu = "";
	tpng.menu.lastMenuIndex = 0;
	var bookmark = _program.bookmark ? _program.bookmark : 10*60000;	
	this.home.playVideo(_program.urlCtv, "HLS", bookmark);
}
anytimePlayer.prototype.hideProgramDelay = function hideProgramDelay(){	
	this.home.hideBg();
	this.showButtonsPanelDelay();
}
anytimePlayer.prototype.onStreamEvent = function onStreamEvent(event) {
	//TODO: ver cuando la URL NO reproduce o marca error
	//2. Hasta que el video comience lanzo la botonera, siempre con un delay de ? segundos.
	//eso también ayuda a que el getProperty("POSITION") no devuelva 0.
	var _program = this.widgets.buttonsPanel.data;
	//NGM.trace("event.type :"+event.type);
	switch(event.type){
		case "start":
		
			this.home.hideBg();
			this.widgets.notFound.stateChange("exit");
			this.widgets.myLoadingIndicator.stop();
			
		if(!this.auxOpt){	
			//para estadísticas
			this.initialTS = new Date().getTime();
			if(_program.bookmark){
				//this.home.playVideo(_program.urlCtv,"HLS", _program.bookmark);
				clearTimeout(this.timer);
					this.timer = setTimeout(function(){
					this.home.setPlayerStatus("PAUSE");
					this.widgets.anytimeLogo.stateChange("enter");
					this.optionsBookmark(_program.bookmark);
				}.bind(this),500);
				
			}else{
				
				this.home.showHeader({"section": "anytimePlayer", "fill": "rgba(50,20,30,.9)"});
				//this.widgets.programBg.stateChange("enter");		
				this.widgets.anytimeLogo.stateChange("enter");
				//Mientras empiezo a reproducir el HLS ya que a veces tarda en cargar. Siempre inicio en minuto 10.
				//NGM.dump(_program,2);	
				this.showButtonsPanelDelay();
					
				//unsetTimeAlarm(this.hideProgDelay);
				//this.hideProgDelay = this.hideProgramDelay.bind(this).delay(1000);
			}
		}
		break;
		case "firstFrameDisplayed":
		/*
			this.client.lock();
			this.home.hideBg();
			this.widgets.notFound.stateChange("exit");
			this.widgets.myLoadingIndicator.stop();
			this.client.unlock();
			*/
		break;
		case "endOfFile":
		case "end":
			this.stopPlayer();
		break;
		case "rewinded":
			var bgControls = this.widgets.bgControls;
			this.widgets.vodControls.data.text = "";
			this.widgets.vodControls.refresh();
			bgControls.stateChange("exit");
			
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);//Lo desaparezco en 10 seg	
		break;
		
		case "error":
			this.currentFrame = "error";
		break;
	}
}

anytimePlayer.prototype.showButtonsPanelDelay = function showButtonsPanelDelay(){
	//3.Quito la pantalla con la información y el fondo del programa,
	//inicio los widgets con la info inicial y después los muestro.
	//TODO: quitar ese "exit" y ponerlo en una función hide.
	unsetTimeAlarm(this.showPanelDelay);
	//var bg = this.widgets.programBg;
	//bg.stateChange("exit");
	this.initPlayerPanel(); 
	this.showButtonsPanel();			
	unsetTimeAlarm(this.hideButtonsDelay);
	this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);//Lo desaparezco en 10 seg	
}

anytimePlayer.prototype.initPlayerPanel = function initPlayerPanel(){
	//Preparo los widgets con la información inicial, botones iniciales barra de progreso, etc.
	var widgets = this.widgets,
		program = widgets.buttonsPanel.data,
		data = this.initButtons();		
	//Agregaremos la duración real del asset en el programVO que está guardado en el panelWidget
	//Fix para los programas que no se graban bien.
	program.hlsDuration = Math.round((this.home.playerGetProperty("DURATION")/60000));
	widgets.buttonsPanel.setData(program);
	widgets.anytimeImg.setData(program);
	widgets.buttons.setData(data,2); //Setting Inicial
	widgets.progressBar.setData({"progress": (10*100)/program.duration}); //Setting inicial	
}

anytimePlayer.prototype.showButtonsPanel = function showButtonsPanel(){
//Función que muestra la botonera, previamente tuvieron que ser inicializados los widgets.
//Antes de lanzar el timer de la barra de progreso lanzo un update para que la refresque.
	var widgets = this.widgets,
		buttons = this.initButtons();
	
	widgets.buttons.setData(buttons,2);	
	widgets.vodControls.setData({"text": ""});

	if(!this.home.isHeaderVisible()){
		this.home.showHeader({"section": "anytimePlayer", "fill": "rgba(50,20,30,.9)"});
	}
	this.client.lock();
		widgets.buttonsPanel.stateChange("enter");
		widgets.buttons.stateChange("enter");
		widgets.progressBar.stateChange("enter");
		widgets.vodControls.stateChange("enter");
		widgets.anytimeImg.stateChange("enter");
	this.client.unlock();
	
	this.updateProgressBar();
	unsetTimeAlarm(this.progressBarTimer);
	this.progressBarTimer = this.updateProgressBar.bind(this).repeat(1*1000); //Cada 30 segundos
	this.currentFrame = "buttons";
}
anytimePlayer.prototype.updateProgressBar = function updateProgressBar(){
	var widgets = this.widgets,
		program = widgets.buttonsPanel.data,
		min = Math.round(this.home.playerGetProperty("POSITION")/60000);
		
	widgets.progressBar.setData({"progress": (min*100)/(program.hlsDuration), "min": min, "duration": program.hlsDuration});
	widgets.progressBar.refresh();
}

anytimePlayer.prototype.hideButtonsPanel = function hideButtonsPanel(_data){
	var widgets = this.widgets;
	unsetTimeAlarm(this.progressBarTimer);
	if(!_data)
		this.home.hideHeader();
	
	this.client.lock();
		widgets.buttonsPanel.stateChange("exit");
		widgets.buttons.stateChange("exit");
		widgets.progressBar.stateChange("exit");
		widgets.buttonsHeader.stateChange("exit");
		widgets.vodControls.stateChange("exit");
		widgets.anytimeImg.stateChange("exit");
	this.client.unlock();
	this.currentFrame = "player";
}



anytimePlayer.onFocusButtons = function onFocusButtons(_focus, _data){
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
anytimePlayer.prototype.optionsBookmark = function optionsBookmark(_data){
	var widgets =  this.widgets;
		options = [
			{"label":"<!size=50>Reiniciar<!> || la reproducción desde 00:00","action":"INICIO"},
			{"label":"<!size=50>Reanudar<!>|| la reproducción desde "+getTimeFormat(_data),"action":"REANUDAR"}
		];
		widgets.optionsBg.setData("");
		widgets.optionsBg.stateChange("enter");
		widgets.optionsBg.refresh();
		widgets.optionsBookmark.setData(options);
		widgets.optionsBookmark.scrollNext();
		widgets.optionsBookmark.stateChange("enter");
		this.currentFrame = "bookmark";
	
}
anytimePlayer.prototype.optionsPlayer = function optionsPlayer(_data){
	var widgets =  this.widgets;
		options = [
			{"label":"<!size=50>Salir<!> || de la reproducción","action":"SALIR"},
			{"label":"<!size=50>Seguir<!>|| la reproducción","action":"SEGUIR"}
		];
		widgets.optionsBg.setData("");
		widgets.optionsBg.stateChange("enter");
		widgets.optionsBg.refresh();
		widgets.optionsBookmark.setData(options);
		// ***** widgets.optionsBookmark.scrollNext();
		widgets.optionsBookmark.stateChange("enter");
		this.currentFrame = "optionsPlayer";
	
	
}
anytimePlayer.prototype.sendBookmark = function sendBookmark(){
	var epgId = this.widgets.buttonsPanel.data.id;
	
	var position = this.home.playerGetProperty("POSITION");
	var duration = this.home.playerGetProperty("DURATION");
    var prc = (position*100)/duration;	

	if(prc < 90 && prc > 10){
		var pos = this.home.playerGetProperty("POSITION");
	}else{
		var pos = -1;
	}
		var params = ["epgId="+epgId,"bookmark="+pos];
		getServices.getSingleton().call("EPG_SEND_BOOKMARK_CTV", params, this.responseSendBookmark.bind(this));
}
anytimePlayer.prototype.responseSendBookmark = function responseSendBookmark(response){
	if(response.status == 200){
		//NGM.trace("guardo el bookmark");
	}else{
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

anytimePlayer.prototype.stopPlayer = function stopPlayer(_data){
	var widgets = this.widgets;
	unsetTimeAlarm(this.hideButtonsDelay);
	unsetTimeAlarm(this.progressBarTimer);
	unsetTimeAlarm(this.showPanelDelay);
	unsetTimeAlarm(this.hideChangeLanguage);
	clearTimeout(this.timer);
	this.home.hideBackground();
	this.home.hideHeader();
	this.home.setPlayerStatus("STOP");
	widgets.anytimeLogo.stateChange("exit");
	widgets.buttonsPanel.stateChange("exit");
	widgets.buttons.stateChange("exit");
	widgets.progressBar.stateChange("exit");
	widgets.buttonsHeader.stateChange("exit");
	widgets.vodControls.stateChange("exit");
	widgets.anytimeImg.stateChange("exit");
	this.saveCTVinfo();
	
	this.home.closeSection(this);
	
}

anytimePlayer.prototype.saveCTVinfo = function saveCTVinfo(){
	var seconds = ((new Date().getTime())-this.initialTS)/1000;
	seconds = Math.round(seconds);
	tpng.statistics.ctvs.push({"ts": new Date().getTime(),"id": this.idEpg, "value": seconds});
}

anytimePlayer.prototype.onExit = function onExit(_data){
	clearTimeout(this.timer);
	this.home.hideBackground();
	unsetTimeAlarm(this.hideButtonsDelay);
	unsetTimeAlarm(this.progressBarTimer);
	unsetTimeAlarm(this.showPanelDelay);
	this.home.objectChild = null; //<--Para quitar la referencia del evento en el homeFrame 
}

anytimePlayer.prototype.onKeyPress = function onKeyPress(_key){
	//NGM.trace("this.currentFrame: " + this.currentFrame);
	switch(this.currentFrame){
		case "buttons":
			this.onKeyPressButtons(_key); 
		break;		
		case "player":
			this.onKeyPressPlayer(_key); 
		break;
		case "optionsPlayer":
			this.onKeyPressOptions(_key); 
		break;
		case "bookmark":
			this.onKeyPressBookmark(_key);
		break;
		case "search":
			this.onKeyPressSearch(_key); 
		break;
		case "error":
			this.onKeyPressError(_key); 
		break;
	}
	return true;
}

anytimePlayer.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
	var buttons = this.widgets.buttons,
		program = this.widgets.buttonsPanel.data;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			if(tpng.player.status == "PLAY"){
				unsetTimeAlarm(this.hideButtonsDelay);
				this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(700);
				unsetTimeAlarm(this.timerToShowButton);
			}else if(tpng.player.status == "PAUSE"){
				unsetTimeAlarm(this.timerToShowButton);				
				this.widgets.bgControls.stateChange("exit");
				this.hideButtonsPanel();
				this.optionsPlayer();
			}
			
	    break;		
	    case "KEY_RIGHT":
	    case "KEY_LEFT":
	    	unsetTimeAlarm(this.timerToShowButton);
	    	if(tpng.player.status == "PLAY"){
	    		unsetTimeAlarm(this.hideButtonsDelay);
				this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);//Lo desaparezco en 10 seg
			}
			_key == "KEY_LEFT" ? buttons.scrollPrev() : buttons.scrollNext();
		break;
		case "KEY_UP":
			this.currentFrame = "search";
			buttons.setFocus(false);
    		this.home.enableSearchHeader();
    		
    		if(this.widgets.bgControls.stateGet() == "enter"){
    			this.widgets.bgControls.animation.move(0,75,150).start();
    		}
    		unsetTimeAlarm(this.hideButtonsDelay);
    		unsetTimeAlarm(this.progressBarTimer);
    	break;
		case "KEY_IRENTER":
			this.goToAction(buttons.selectItem.action);
		break;
		/*case "KEY_DOWN":
			if(tpng.player.status == "PLAY"){
				clearTimeout(this.timer);
				unsetTimeAlarm(this.showPanelDelay);
				unsetTimeAlarm(this.timerToShowButton);
				this.timerToShowButton = this.widgets.buttonsHeader.stateChange.delay(1000, this.widgets.buttonsHeader, "exit");
				unsetTimeAlarm(this.hideButtonsDelay);
				this.hideButtonsPanel();
				this.widgets.anytimeLogo.stateChange("exit");
				this.home.openSection("programDetail",{"home":this.home,"parentP":this,"program": program, "statusPlayer":true},false,null,true);
			}else if(tpng.player.status == "PAUSE"){
				clearTimeout(this.timer);
				unsetTimeAlarm(this.showPanelDelay);
				this.widgets.vodControls.data.text = "";
				this.widgets.vodControls.refresh();
				this.widgets.bgControls.stateChange("exit");
				unsetTimeAlarm(this.timerToShowButton);
				this.timerToShowButton = this.widgets.buttonsHeader.stateChange.delay(1000, this.widgets.buttonsHeader, "exit");
				this.hideButtonsPanel();
				this.widgets.anytimeLogo.stateChange("exit");
				this.home.openSection("programDetail",{"home":this.home,"parentP":this,"program": program, "statusPlayer":true},false,null,true);
			}
			
		break;*/
		case "KEY_TV_PLAY":
		case "KEY_TV_STOP":
		case "KEY_PIP":
		case "KEY_PIP_LONG":
		case "KEY_PAGE_PREV":
		case "KEY_PREV":
		case "KEY_NEXT":
			this.goToAction(_key);
		break;
	}	
	return true;
}
anytimePlayer.prototype.onKeyPressBookmark = function onKeyPressBookmark(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			//this.home.closeSection(this);
		break;
		case "KEY_LEFT":
		case "KEY_RIGHT":		
			_key == "KEY_LEFT" ? widgets.optionsBookmark.scrollPrev() : widgets.optionsBookmark.scrollNext();
    	break;
    	case "KEY_IRENTER":
			switch(widgets.optionsBookmark.selectItem.action){
			case "INICIO":
				widgets.optionsBg.stateChange("exit");
				widgets.optionsBookmark.stateChange("exit");
				this.auxOpt = true;
				this.home.playVideo(widgets.buttonsPanel.data.urlCtv,"HLS", 10*60000);
				
				//this.hideProgramDelay();
				unsetTimeAlarm(this.hideProgDelay);
				this.hideProgDelay = this.hideProgramDelay.bind(this).delay(2000);
			break;
			case "REANUDAR":
				widgets.optionsBg.stateChange("exit");
				widgets.optionsBookmark.stateChange("exit");
				this.home.setPlayerStatus("PLAY");
				//this.showButtonsPanel();
				this.hideProgramDelay();
				
			break;
			
			}
		break;
		
	}	
	return true;
}
anytimePlayer.prototype.onKeyPressOptions = function onKeyPressOptions(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			//this.home.closeSection(this);
			widgets.optionsBg.stateChange("exit");
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
					widgets.optionsBg.stateChange("exit");
					widgets.optionsBookmark.stateChange("exit");
					this.sendBookmark();
					this.stopPlayer();
				break;
				case "SEGUIR":
					if(tpng.player.status == "PAUSE")
						this.home.setPlayerStatus("PLAY");
						
					widgets.optionsBg.stateChange("exit");
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
anytimePlayer.prototype.onKeyPressPlayer = function onKeyPressPlayer(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_TV_PLAY": //PLAY
		case "KEY_IRENTER":
			this.showButtonsPanel();
			this.playPause();
			unsetTimeAlarm(this.hideButtonsDelay);
		break;
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.optionsPlayer();
			unsetTimeAlarm(this.hideButtonsDelay);
			unsetTimeAlarm(this.timerToShowButton);
		break;
		case "KEY_NEXT": //FAST FORWARD
			this.showButtonsPanel();
			widgets.buttons.scrollTo(3);
			this.speedNext();
			unsetTimeAlarm(this.hideButtonsDelay);
		break;
		case "KEY_PREV": //REWIND
			this.showButtonsPanel();
			widgets.buttons.scrollTo(1);
			this.speedPrev();
			unsetTimeAlarm(this.hideButtonsDelay);
		break;
		case "KEY_TV_STOP": //STOP
			widgets.optionsBg.stateChange("exit");
			widgets.optionsBookmark.stateChange("exit");
			this.sendBookmark();
			this.stopPlayer();
		break;

		default:
			this.showButtonsPanel();
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
		break;
		
	}	
	return true;
}
anytimePlayer.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	var widgets = this.widgets;
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":	
    	case "KEY_DOWN":
			this.currentFrame = "buttons";
			widgets.buttons.setFocus(true);
			this.home.disableSearchHeader();
			unsetTimeAlarm(this.hideButtonsDelay);
			if(widgets.bgControls.stateGet() == "enter"){
				widgets.bgControls.animation.move(0,110,150).start();
			}
			if(tpng.player.status == "PLAY"){
				this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
			}
    	break;
	   default:
	   		this.home.onKeyPress(_key);			
		break;
    }
	return true;
}

anytimePlayer.prototype.onKeyPressError = function onKeyPressError(_key){
	var widgets = this.widgets;
	switch(_key){			
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.closeSection(this);		
    	break;

    }
	return true;
}
anytimePlayer.prototype.goToAction = function goToAction(_control){
	var program = this.widgets.buttonsPanel.data
		widgets = this.widgets;
	unsetTimeAlarm(this.hideButtonsDelay);
	switch(_control){
		case "KEY_TV_PLAY": //PLAY
			widgets.buttons.scrollTo(2);
		case "PAUSE":
		case "PLAY":
			this.playPause();
		break;
		case "KEY_PAGE_PREV": //SKIP -10 MIN
		case "SKIP_RW": 
			this.skipPrev();
			widgets.vodControls.data.text = "";
			widgets.vodControls.refresh();
			widgets.bgControls.stateChange("exit");
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
		break;		
		case "KEY_PIP":
		case "SKIP_FF": 
			this.skipNext();
			widgets.vodControls.data.text = "";
			widgets.vodControls.refresh();
			widgets.bgControls.stateChange("exit");
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
		break;		
		case "KEY_NEXT": //FAST FORWARD
			widgets.buttons.scrollTo(3);
		case "FF": 		
			this.speedNext();
		break;
		case "KEY_PREV": //REWIND
			widgets.buttons.scrollTo(1);
		case "RW": 
			this.speedPrev();
		break;
		case "KEY_TV_STOP": //STOP
		case "STOP": 
			widgets.optionsBg.stateChange("exit");
			widgets.optionsBookmark.stateChange("exit");
			this.sendBookmark();
			this.stopPlayer();
		break;	
		/*case "INFO": 
			
			if(tpng.player.status == "PLAY"){
				unsetTimeAlarm(this.timerToShowButton);
				unsetTimeAlarm(this.hideButtonsDelay);
				clearTimeout(this.timer);
				unsetTimeAlarm(this.showPanelDelay);
				this.hideButtonsPanel();
				widgets.anytimeLogo.stateChange("exit");
				this.home.openSection("programDetail",{"home":this.home,"parentP" :this,"program": program, "statusPlayer":true},false,null,true);
			
			}else if(tpng.player.status == "PAUSE"){
				unsetTimeAlarm(this.timerToShowButton);
				unsetTimeAlarm(this.hideButtonsDelay);
				clearTimeout(this.timer);
				unsetTimeAlarm(this.showPanelDelay);
				this.hideButtonsPanel();
				widgets.vodControls.data.text = "";
				widgets.vodControls.refresh();
				widgets.bgControls.stateChange("exit");
				widgets.anytimeLogo.stateChange("exit");
				this.home.openSection("programDetail",{"home":this.home,"parentP" :this,"program": program, "statusPlayer":true},false,null,true);
			}
		
		break;*/
		case "AUDIOS":
			if(this.auxAudios){
				this.changeLanguage();
				unsetTimeAlarm(this.hideChangeLanguage);
				this.hideChangeLanguage = this.hidechangeLanguage.bind(this).delay(2000);
			}
		break;	
	}
}

anytimePlayer.prototype.speedPrev = function speedPrev(_control){
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
		//buttons.redraw();		
		//Lógica del speed rw
		this.speed --;
		var str = this.speedText(this.speed);
		this.home.setPlayerStatus("SPEED", this.speed);
		text.data.text = str;
		buttons.redraw();		
		text.redraw();
	}

}
anytimePlayer.prototype.speedNext = function speedNext(_control){	
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
	}
	  	

}
anytimePlayer.prototype.speedText = function speedText(_speed){
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

anytimePlayer.prototype.skipPrev = function skipPrev(_control){
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

anytimePlayer.prototype.skipNext = function skipNext(_control){
	var position = (this.home.playerGetProperty("POSITION"))/60000;
	this.speed = 0;
   	position = (((Math.floor(position/10))+1)*10)*60000;
	this.home.setPlayerStatus("SEEK", parseInt(position+(5*1000))); //No se por q le teniamos q agregar 1 min
	
	var buttons = this.widgets.buttons;
	buttons.list[2].img_on = "img/commons/player/pauseON.png";
	buttons.list[2].img_off = "img/commons/player/pauseOFF.png";
	buttons.list[2].text = "Pausa";
	buttons.redraw();
	tpng.player.status = "PLAY";
}
anytimePlayer.prototype.playPause = function playPause(_control){
	var widgets = this.widgets;
	this.speed = 0;
		if(tpng.player.status == "PLAY"){
			widgets.bgControls.setDataAnimated({"detail":this.program},"exit","enter");
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
anytimePlayer.prototype.changeLanguage = function changeLanguage(_control){
	var widgets = this.widgets;
		widgets.bgControls.setDataAnimated({},"exit","enter");
		widgets.vodControls.data.text = "No disponible";
		widgets.vodControls.redraw();
		this.auxAudios = false;
}
anytimePlayer.prototype.hidechangeLanguage = function hidechangeLanguage(_control){
	var widgets = this.widgets;
		widgets.bgControls.stateChange("exit");
		widgets.vodControls.data.text = "";
		widgets.vodControls.refresh();
		this.auxAudios = true;
}
anytimePlayer.prototype.initButtons = function initButtons(_data){	
	var data = [
		
		{"x": 387, "text": "-10 min", "action":"SKIP_RW","img_on":"img/commons/player/skiprewON.png", "img_off":"img/commons/player/skiprewOFF.png"},
		{"x": 451, "text": "Regresar", "action":"RW",	"img_on":"img/commons/player/rewON.png", "img_off":"img/commons/player/rewOFF.png"},
		{"x": 515, "text": "Pausa", "action":"PAUSE",	"img_on":"img/commons/player/pauseON.png", "img_off":"img/commons/player/pauseOFF.png"},
		{"x": 579, "text": "Adelantar", "action":"FF",		"img_on":"img/commons/player/ffON.png", "img_off":"img/commons/player/ffOFF.png"},
		{"x": 643, "text": "+10 min", "action":"SKIP_FF","img_on":"img/commons/player/skipffON.png", "img_off":"img/commons/player/skipffOFF.png"},
		{"x": 707, "text": "Detener", "action":"STOP",	"img_on":"img/commons/player/stopON.png", "img_off":"img/commons/player/stopOFF.png"}	
	  // **{"x": 707, "text": "Audios", "action":"AUDIOS","img_on":"img/commons/player/idiomaON.png", "img_off":"img/commons/player/idiomaOFF.png"},
	  // **{"x": 771, "text": "info", "action":"INFO","img_on":"img/commons/player/infoON.png", "img_off":"img/commons/player/infoOFF.png"}
	];
	return data;
}

anytimePlayer.drawButtonsPanel = function drawButtonsPanel(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    
	//Panel
    var custo = JSON.stringify(this.themaData.es4_09);
	custo = JSON.parse(custo);
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
 	//tp_draw.getSingleton().drawImage("img/vod/1x1_moreinfo.png", ctx, 610, 45);
 	
	ctx.drawObject(ctx.endObject());	
}
anytimePlayer.drawProgressBar = function drawProgressBar(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();  

	var progress = (_data.progress * 1146) / 100;
	
	Canvas.drawShape(ctx, "rect", [67,0,1146,4], {"fill": "rgba(240, 240, 250, .3)"});
    Canvas.drawShape(ctx, "rect", [0,0,67,4], {"fill": "rgba(190,50,120,1)"});
    
   	Canvas.drawShape(ctx, "rect", [67,0,progress,4], {"fill": "rgba(190,50,120,1)"});
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
  	
   
	var custo_f = {"fill": "rgba(240,240,250,1)",
   		"font_family" : "Oxygen-Regular",
   		"font_size" : 18 * tpng.thema.text_proportion,
   		"text_align" : "right,top",
   		"text_wrap" : "auto",
   		"text_multiline" : true};
		
	Canvas.drawText(ctx, _data.min+" min / "+_data.duration+" min", new Rect(67,15,1146,ctx.viewportHeight), custo_f);
  	
	 	
	ctx.drawObject(ctx.endObject());	
}

anytimePlayer.drawButtons = function drawButtons(_data){ 		
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

anytimePlayer.drawButtonsHeader = function drawButtonsHeader(_data){ 		
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	var custo_f = JSON.stringify(this.themaData.standarBlackFont);
	custo_f = JSON.parse(custo_f);		
	custo_f.text_align = "center,top";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text, new Rect(_data.x+5, 27, 174, 32), custo_f);
	tp_draw.getSingleton().drawImage("img/commons/player/TextBalloon3x3.png", ctx, _data.x, 0,null,null,null,"destination-over");
	
	ctx.drawObject(ctx.endObject());	
}

anytimePlayer.drawProgramBg = function drawProgramBg(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	var custo = JSON.stringify(this.themaData.es4_09);
	custo = JSON.parse(custo);
			
	
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
	
	custo_f.text_align = "right,middle";
	custo_f.font_size = 20;
	
	//_data.episodeTitle = "";
	//_data.season = 18;
	//_data.episode = 2;


	Canvas.drawText(ctx, "Estás a punto de ver:", new Rect(67,142-6,506,32), custo_f);
	custo_f.line_increment = 50;
	custo_f.text_align = "right,middle";
	
	var programInfo =	"<!size=42>" + _data.name + "<!>|" +					 	
					 	"<!size=22>" + (_data.episodeTitle ? _data.episodeTitle + "<!>" : "");
	
	Canvas.drawText(ctx, programInfo, new Rect(67,178-6,506,140), custo_f); //Lo normal son 108 px pero necesito agregar más
	
	//Línea separador
	custo.fill = "rgba(240,240,250,1)";
	Canvas.drawShape(ctx, "rect", [643,178-6,2,180], custo);
	
	//Info del asset	
	custo_f.text_align = "left,middle";
	custo_f.font_size = 22;
	custo_f.line_increment = 35;
	
	var assetInfo = "" + (_data.season ? "Temporada " + _data.season + "|" : "") +
					"" + (_data.episode ? "Episodio " + _data.episode + "|" : "") +
					"" + "Canal " + _data.ChannelVO.number + " - " +  _data.ChannelVO.name + "|" +
					"" + "Fecha " + longFormatDate(new Date(_data.startTime)) + "|" +
					"" + "Caduca en " + "6 días";
	
	Canvas.drawText(ctx, assetInfo, new Rect(707,178-6,506,176), custo_f);
	custo_f.text_align = "left,top";
	tp_draw.getSingleton().drawImage("img/commons/player/iconoAT.png", ctx, 130, 322);
	Canvas.drawText(ctx, "con AnytimeTv, sólo por", new Rect(195,322,400,32), custo_f);
	tp_draw.getSingleton().drawImage("img/commons/player/logoTP.png", ctx, 451, 322);
	
	ctx.drawObject(ctx.endObject());	
}

anytimePlayer.drawAnytimeLogo = function drawAnytimeLogo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    tp_draw.getSingleton().drawImage("img/commons/player/1x1_MarcaAguaAT.png", ctx, 0, 0,null,null,null,"destination-over");	
	ctx.drawObject(ctx.endObject());
}
anytimePlayer.drawOptionsBookmark = function drawOptionsBookmark(_data){ 		
	this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);		
		custo_f.text_align = "center,middle";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		
		custo_f.fill = focus ? "rgba(240,240,250,1)" : "rgba(240,240,250,.3)";
		Canvas.drawText(ctx, _data.label, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo_f);

		ctx.drawObject(ctx.endObject());	
	}
}
anytimePlayer.drawOptionsBg = function drawOptionsBg(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth,ctx.viewportHeight],this.themaData.es4_09);
	Canvas.drawShape(ctx, "rect", [639, 290, 1,140],{"fill":"rgba(240, 240, 250, 1)"});
    
    ctx.drawObject(ctx.endObject());	
}
anytimePlayer.drawVodControls = function drawVodControls(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);		
		custo_f.text_align = "center,middle";
		//custo_f.fill = "rgba(240,240,250,1)";
		
	if(_data.text){
		custo_f.font_size = 50 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.text+"", new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo_f);
	}
	ctx.drawObject(ctx.endObject());
}
anytimePlayer.drawBgControls = function drawBgControls(_data){ 	
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
		
	
		var year = _data.detail.year ? _data.detail.year : "0";
			year = year != "0" ? year+" / " : "";	
		
		Canvas.drawText(ctx, "<!line-height=25>------ / "+year+_data.detail.description+"<!>", new Rect(67, 153, 570, 167), custo_f);
	   // 
	    //autores
		custo_f.fill = "rgba(170,170,180,1)";
		custo_f.text_align = "left,top";
		Canvas.drawText(ctx, "<!i>"+_data.detail.actors+"<!>", new Rect(67, 118, 570, 32), custo_f);
		
		//originalName
		//Canvas.drawText(ctx, "<!i>"+toUpperCase(_data.detail.originalName)+"<!>", new Rect(67, 118, 570, 32), custo_f);
		
		//RATING
		tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.detail.parentalRating+".png", ctx, 67, 159);
		
    
    }
	
	
	
	ctx.drawObject(ctx.endObject());
}
anytimePlayer.drawNotFound = function drawNotFound(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
	
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
				custo_f = JSON.parse(custo_f);	
				custo_f.text_align = "center,middle";
				custo_f.font_size = 30;
				custo_f.fill = "rgba(255,255,240,1)";	

	Canvas.drawText(ctx,toUpperCase(data.message), new Rect(0, 0, ctx.viewportWidth,ctx.viewportHeight), custo_f);

	ctx.drawObject(ctx.endObject());
}
anytimePlayer.drawAnytimeImg = function drawAnytimeImg(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);		

    tp_draw.getSingleton().drawImage("img/tv/anytime/estasviendoctv.png", ctx, 0, 0,null, null, null,"destination-over");
    //tp_draw.getSingleton().drawImage("img/tv/anytime/estasviendoctv.png", ctx, 0, 0);
	Canvas.drawShape(ctx, "rect",[66, 25, 189, 107], this.themaData.whiteStrokePanelTimeline);
	
	var afterDraw = function(){
		var ctx = this.getContext("2d");

		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f),
			data = _data;	
		
			
			custo_f.font_size = 18 * tpng.thema.text_proportion;
			custo_f.text_align = "center,middle";
			
			if(data.showTittle)
				Canvas.drawText(ctx, data.name + "", new Rect(67, 26, 187, 105), custo_f);	
			
	}.bind(this);
	
	tp_draw.getSingleton().drawImage(_data.images.url3X3, ctx, 67, 26, 187, 105, afterDraw);
	
	custo_f.fill = "rgba(220, 150, 190, 1)";
	custo_f.font_size = 17 * tpng.thema.text_proportion;
	custo_f.text_align = "left,top";
	Canvas.drawText(ctx,"Estás viendo:" , new Rect(67, 0, 120, 32), custo_f);
	
	
	
	ctx.drawObject(ctx.endObject());	
}

anytimePlayer.drawMalla = function drawMalla(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		tp_draw.getSingleton().drawImage("img/tmp/DevsOnion.png", ctx, 0, 0);	
		
		ctx.drawObject(ctx.endObject());
}