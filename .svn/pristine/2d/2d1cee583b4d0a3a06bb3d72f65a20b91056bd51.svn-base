
FormWidget.registerTypeStandard("startOverPlayer");

function startOverPlayer(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.speed = 0;
   	this.secondsToHide = 5;
}

startOverPlayer.inherits(FormWidget);

startOverPlayer.prototype.onStreamEvent = function onStreamEvent(event) {

	var player = this.home.widgets.player;
	NGM.trace("event: " + event.type);
	switch(event.type){
		case "beginOfFile":
			this.playPause();
		break;
		case "start":
			this.initialTS = new Date().getTime();
			this.showButtonsPanel();
			unsetTimeAlarm(this.updateTimer);
			this.updateTimer = this.updateProgressBar.bind(this).repeat(1000);
		break;
		case "error":
            NGM.trace("Error in startOverPlayer");
            // fallthru
		case "endOfFile":
		case "end":
			this.stopPlayer();
		break;
		case "back2live":
			if(this.firstTime){
				//Si es la primera vez y me envía esto lo ignoro, no debería hacer esto pero es un WA para el error del player
				this.firstTime = false;
			}else{
				//Ponerlo en pausa para que salga la pantalla de salir a en vivo				
				player.pause();
				this.widgets.bgControls.stateChange("exit");
				this.hideButtonsPanel();
				this.optionsPlayer();
				unsetTimeAlarm(this.hideButtonsDelay);
				unsetTimeAlarm(this.timerToShowButton);
			}
		break;
		case "rewinded":
			var bgControls = this.widgets.bgControls;
			this.widgets.vodControls.data.text = "";
			this.widgets.vodControls.refresh();
			bgControls.stateChange("exit");
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);//Lo desaparezco en 10 seg	
		break;
	}
}

startOverPlayer.prototype.onEnter = function onEnter(_data){	
	this.home = _data.home;
	this.home.objectChild = this; //Player Events
	
	//this.widgets.malla.setData();
	//this.widgets.malla.stateChange("enter")
	
	//Aumentar los 10 min de colchon que trae el player
	this.firstTime = true;
	this.program = _data.program; //Programa que reproducirá start over
	this.program.duration = this.program.duration + 10; //le agrego los 10 min que tengo de buffer hacía atrás.
	
	if(!this.program.images)
		this.getProgramInfoBE(this.program)
	
	
	if(_data.program.urlRestart){
		//Si la urlRestart viene dentro del program se envia directamente al player
		this.initPlayer(_data.program.urlRestart);
	}else{
		//Para este player nosotros armaremos la URL del HLS ya que los programas en vivo no usan servicios backend.
		this.initPlayer(tpng.backend.url + "StartOver?lchId=" + _data.program.ChannelVO.lchId + "&session=" + tpng.backend.session + "&f=.m3u8");
	}
	
	
	//this.initPlayer(tpng.backend.url + "RestartAdaptive?channel=" + _data.program.ChannelVO.number + "&format=HLS&tsStartProgram="+this.program.startTime+"&tsFirstTime="+new Date().getTime() +"&session=" + tpng.backend.session + "&f=.m3u8");
}
startOverPlayer.prototype.getProgramInfoBE = function getProgramInfoBE(_data){
	var params = ["epgId=" + _data.id, "channel=" + _data.ChannelVO.number, "lchId=" + _data.ChannelVO.lchId];
	getServices.getSingleton().call("EPG_GET_PROGRAM", params, this.responseGetProgramInfoBE.bind(this));
}
startOverPlayer.prototype.responseGetProgramInfoBE = function responseGetProgramInfoBE(response){
	if(response.status == 200){
		this.program = response.data.ProgramVO;
	}
}

startOverPlayer.prototype.initPlayer = function initPlayer(_url){
	NGM.trace(_url);
	this.playVideo(_url);	
}

startOverPlayer.prototype.playVideo = function playVideo(_url){
	//PARA ESTE CASO NO USAREMOS EL PLAY VIDEO DEL HOME YA QUE NO PODEMOS PONER EL START POSITION
	//player.player.mwPlayer.seekToLive();
	var player = this.home.widgets.player;	
	player.setData();
    player.setData(_url,{"playerType": "hls", "seekable": true, "noInfo": true});
	player.stateChange("enter");
	//player.player.state = "vod";
	//HACEMOS UN SEEK DE 5 MIN, NO SE PUDO CON EL START POSITION POR ESO LO HICE CON UN SEEK INMEDIATO
	player.seek(10*60000);
	this.speedTrickDelay.bind(this).delay(900);		
}

startOverPlayer.prototype.speedTrickDelay = function speedTrickDelay(){
	//Esta función es un truco para atrasar el player y luego empezar a reproducir
	//porque por alguna razón para poder adelantar y llegar a back2Live necesitabas primero un FW
	var player = this.home.widgets.player;
	player.speedSet(-5);
	player.play();
	tpng.player.status = "PLAY"; //para players anytime/vod	
}

startOverPlayer.prototype.showButtonsPanel = function showButtonsPanel(){
	var w = this.widgets,
		panel = w.buttonsPanel,
		logo = w.startOverLogo,
		progressBar = w.progressBar,
		buttons = this.initButtons();
	this.home.showHeader({"section": "anytimePlayer", "fill": "rgba(50,20,30,.9)"});
	
	var min = 10;	
	logo.setData();
	w.anytimeImg.setData(this.program);
	w.buttons.setData(buttons,0);
	w.vodControls.setData({"text": ""});	
	panel.setData(this.program);
	progressBar.setData({"progress": (min*100)/(this.program.duration), "min": min, "duration": this.program.duration, "program": this.program });
	
	
	this.client.lock();
		w.buttons.stateChange("enter");
		logo.stateChange("enter");
		progressBar.stateChange("enter");
		panel.stateChange("enter");
		w.anytimeImg.stateChange("enter");
		w.vodControls.stateChange("enter");
	this.client.unlock();

	this.currentFrame = "buttons";
	
	unsetTimeAlarm(this.hideButtonsDelay);
	this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
	
}
startOverPlayer.prototype.hideButtonsPanel = function hideButtonsPanel(_data){
	var widgets = this.widgets;
	//unsetTimeAlarm(this.progressBarTimer);
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
startOverPlayer.prototype.updateProgressBar = function updateProgressBar(){
	var player = this.home.widgets.player;	
	var progressBar = this.widgets.progressBar;
	var d = player.propertyGet("duration");
	var p = player.propertyGet("position");
	var min = Math.round(this.home.playerGetProperty("POSITION")/60000);
	
	//NGM.trace("duracion: " + d);
	//NGM.trace("posicion: " + p);
	//NGM.trace("min: " + min);
	
	if(min > this.program.duration){
		this.stopPlayer();
	}else{	
		progressBar.setData({"progress": (min*100)/(this.program.duration), "min": min, "duration": this.program.duration, "program": this.program});	
		progressBar.refresh();
	}
}



startOverPlayer.prototype.onExit = function onExit(_data){
	this.home.objectChild = null; //<--Para quitar la referencia del evento en el homeFrame 
	this.widgets.anytimeImg.stateChange("exit");
	var seconds = ((new Date().getTime())-this.initialTS)/1000;
	seconds = Math.round(seconds);
	tpng.statistics.startOvers.push({"ts": new Date().getTime(),"id": this.program.id, "value": seconds});
	unsetTimeAlarm(this.updateTimer);
	this.home.hideBackground();
}
startOverPlayer.prototype.closing = function closing(){	
	this.home.hideBackground();
	this.home.hideHeader();
	this.home.closeSection(this);
}
startOverPlayer.onFocusButtons = function onFocusButtons(_focus, _data){
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

startOverPlayer.prototype.stopPlayer = function stopPlayer(_data){
	var widgets = this.widgets;
	this.home.setPlayerStatus("STOP");
	unsetTimeAlarm(this.hideButtonsDelay);
	unsetTimeAlarm(this.timerToShowButton);
	unsetTimeAlarm(this.updateTimer);
	this.home.hideBackground();
	this.home.hideHeader();
	this.home.setPlayerStatus("STOP");
	widgets.buttonsPanel.stateChange("exit");
	widgets.buttons.stateChange("exit");
	widgets.progressBar.stateChange("exit");
	widgets.buttonsHeader.stateChange("exit");
	widgets.vodControls.stateChange("exit");
	widgets.anytimeImg.stateChange("exit");
	if(_data)
		this.formClose();
	else
		this.home.closeSection(this);		
}

startOverPlayer.prototype.onKeyPress = function onKeyPress(_key){
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
		case "search":
			this.onKeyPressSearch(_key); 
		break;
	}
	return true;
}
startOverPlayer.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	var widgets = this.widgets;
	switch(_key){			
    	case "KEY_MENU":
		case "KEY_IRBACK":	
    	case "KEY_DOWN":
			this.currentFrame = "buttons";
			widgets.buttons.setFocus(true);
			this.home.disableSearchHeader();
			unsetTimeAlarm(this.hideButtonsDelay);
			if(this.widgets.bgControls.stateGet() == "enter"){
				this.widgets.bgControls.animation.move(0,110,150).start();
			}
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
    	break;
	   default:
	   		this.home.onKeyPress(_key);			
		break;
    }
	return true;
}
startOverPlayer.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
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
			
				unsetTimeAlarm(this.timerToShowButton);
				this.timerToShowButton = this.widgets.buttonsHeader.stateChange.delay(1000, this.widgets.buttonsHeader, "exit");
				unsetTimeAlarm(this.hideButtonsDelay);
				this.hideButtonsPanel();
				this.home.openSection("programDetail",{"home":this.home,"parentP":this,"program": program, "statusPlayer":true,"transparent":true},false);
			}else if(tpng.player.status == "PAUSE"){
				
				this.widgets.vodControls.data.text = "";
				this.widgets.vodControls.refresh();
				this.widgets.bgControls.stateChange("exit");
				unsetTimeAlarm(this.timerToShowButton);
				unsetTimeAlarm(this.hideButtonsDelay);
				this.timerToShowButton = this.widgets.buttonsHeader.stateChange.delay(1000, this.widgets.buttonsHeader, "exit");
				this.hideButtonsPanel();
				this.home.openSection("programDetail",{"home":this.home,"parentP":this,"program": program, "statusPlayer":true,"transparent":true},false);
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
startOverPlayer.prototype.onKeyPressPlayer = function onKeyPressPlayer(_key){
	switch(_key){
		case "KEY_TV_PLAY": //PLAY
		case "KEY_IRENTER":
			this.showButtonsPanel();
			this.playPause();
			unsetTimeAlarm(this.hideButtonsDelay);
		break;
		/*case "KEY_NEXT": //FAST FORWARD
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
		break;*/
		case "KEY_TV_STOP": //STOP
			widgets.optionsBg.stateChange("exit");
			widgets.optionsBookmark.stateChange("exit");
			this.stopPlayer();
		break;
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.optionsPlayer();
			//this.hideButtonsPanel();
			unsetTimeAlarm(this.hideButtonsDelay);
			unsetTimeAlarm(this.timerToShowButton);
			//this.currentFrame = "optionsPlayer";
		break;
		default:
			this.showButtonsPanel();
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
		break;
		
	}	
	return true;
}
startOverPlayer.prototype.onKeyPressOptions = function onKeyPressOptions(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			//this.home.closeSection(this);
			widgets.optionsBg.stateChange("exit");
			widgets.optionsBookmark.stateChange("exit");
			this.showButtonsPanel();
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
					this.stopPlayer();
				break;
				case "SEGUIR":
					this.home.setPlayerStatus("PLAY");
						
					widgets.optionsBg.stateChange("exit");
					widgets.optionsBookmark.stateChange("exit");
					this.showButtonsPanel();
				break;
			}
		break;
		
	}	
	return true;
}
startOverPlayer.prototype.goToAction = function goToAction(_control){
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
		/*case "KEY_PAGE_PREV": //SKIP -10 MIN
		case "SKIP_RW": 
			this.skipPrev();
			widgets.vodControls.data.text = "";
			widgets.vodControls.refresh();
			widgets.bgControls.stateChange("exit");
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
		break;		
		case "SKIP_FF": 
			this.skipNext();
			widgets.vodControls.data.text = "";
			widgets.vodControls.refresh();
			widgets.bgControls.stateChange("exit");
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
		break;	*/	
		/*case "KEY_NEXT": //FAST FORWARD
			widgets.buttons.scrollTo(3);
		case "FF": 		
			this.speedNext();
		break;
		case "KEY_PREV": //REWIND
			widgets.buttons.scrollTo(1);
		case "RW": 
			this.speedPrev();
		break;*/
		/*case "INFO": 
			if(tpng.player.status == "PLAY"){
				unsetTimeAlarm(this.timerToShowButton);
				unsetTimeAlarm(this.hideButtonsDelay);
				this.timerToShowButton = this.widgets.buttonsHeader.stateChange.delay(1000, this.widgets.buttonsHeader, "exit");
				unsetTimeAlarm(this.hideButtonsDelay);
				this.hideButtonsPanel();
				this.home.openSection("programDetail",{"home":this.home,"parentP":this,"program": program, "statusPlayer":true,"transparent":true},false);
			}else if(tpng.player.status == "PAUSE"){
				widgets.vodControls.data.text = "";
				widgets.vodControls.refresh();
				widgets.bgControls.stateChange("exit");
				unsetTimeAlarm(this.timerToShowButton);
				unsetTimeAlarm(this.hideButtonsDelay);
				this.timerToShowButton = this.widgets.buttonsHeader.stateChange.delay(1000, this.widgets.buttonsHeader, "exit");
				this.hideButtonsPanel();
				this.home.openSection("programDetail",{"home":this.home,"parentP":this,"program": program, "statusPlayer":true,"transparent":true},false);
			}
		break;*/
		case "KEY_TV_STOP": //STOP
		case "STOP": 
			this.home.hideHeader();
			this.client.lock();
				widgets.vodControls.stateChange("exit");
				widgets.buttonsPanel.stateChange("exit");
				widgets.buttons.stateChange("exit");
				widgets.progressBar.stateChange("exit");
				widgets.buttonsHeader.stateChange("exit");
				widgets.bgControls.stateChange("exit");
				widgets.anytimeImg.stateChange("exit");
			this.client.unlock();
			this.optionsPlayer();
			unsetTimeAlarm(this.hideButtonsDelay);
			unsetTimeAlarm(this.timerToShowButton);
		break;	
	}
}
startOverPlayer.prototype.playPause = function playPause(_control){
	var widgets = this.widgets;
	this.speed = 0;
		/*if(tpng.player.status == "PLAY"){
			widgets.bgControls.setDataAnimated({},"exit","enter");
			widgets.buttons.list[2].img_on = "img/commons/player/playON.png";
			widgets.buttons.list[2].img_off = "img/commons/player/playOFF.png";
			widgets.buttons.list[2].text = "Reproducir";
			widgets.buttonsHeader.data.text = "Reproducir";
			widgets.vodControls.data.text = "Pausa";
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
		}*/
		if(tpng.player.status == "PLAY"){
			widgets.bgControls.setDataAnimated({"detail":this.program},"exit","enter");
			widgets.buttons.list[0].img_on = "img/commons/player/playON.png";
			widgets.buttons.list[0].img_off = "img/commons/player/playOFF.png";
			widgets.buttons.list[0].text = "Reproducir";
			widgets.buttonsHeader.data.text = "Reproducir";
			widgets.vodControls.data.text = "";
			widgets.buttons.redraw();		
			widgets.buttonsHeader.redraw();
			widgets.vodControls.redraw();
			this.home.setPlayerStatus("PAUSE");	
			unsetTimeAlarm(this.hideButtonsDelay);
		}else if (tpng.player.status == "PAUSE" || tpng.player.status == "SPEED" || tpng.player.status == "SKIP" || tpng.player.status == "SEEK"){
			widgets.buttons.list[0].img_on = "img/commons/player/pauseON.png";
			widgets.buttons.list[0].img_off = "img/commons/player/pauseOFF.png";
			widgets.buttons.list[0].text = "Pausa";
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
startOverPlayer.prototype.optionsPlayer = function optionsPlayer(_data){
	var widgets =  this.widgets;
		options = [
			{"label":"<!size=50>Regresar<!> || a tv en vivo","action":"SALIR"},
			{"label":"<!size=50>Seguir<!>|| la reproducción","action":"SEGUIR"}
		];
		widgets.optionsBg.setData("");
		widgets.optionsBg.stateChange("enter");
		widgets.optionsBg.refresh();
		widgets.optionsBookmark.setData(options);
		//widgets.optionsBookmark.scrollNext();
		widgets.optionsBookmark.stateChange("enter");
		this.currentFrame = "optionsPlayer";
	
	
}
startOverPlayer.prototype.skipPrev = function skipPrev(_control){
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
startOverPlayer.prototype.skipNext = function skipNext(_control){
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
startOverPlayer.prototype.speedPrev = function speedPrev(_control){
	if(this.speed > 0) 
		this.speed = 0; //Para reiniciar el speed en caso de que venga del otro speed
	if(this.speed > -4){
		var buttons = this.widgets.buttons;
		var text = this.widgets.vodControls;
		var bgControls = this.widgets.bgControls;
		//Lógica para cambiar los botones de pausa a reproducir
		bgControls.setData("");
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
startOverPlayer.prototype.speedNext = function speedNext(_control){	
	if(this.speed < 0) 
		this.speed = 0; //Para reiniciar el speed en caso de que venga del otro speed
	if(this.speed < 4){
		var buttons = this.widgets.buttons;
		var text = this.widgets.vodControls;
		var bgControls = this.widgets.bgControls;
		//Lógica para cambiar los botones de pausa a reproducir
		bgControls.setData("");
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
startOverPlayer.prototype.speedText = function speedText(_speed){
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
startOverPlayer.prototype.initButtons = function initButtons(_data){	
	/*var data = [
		{"x": 387, "text": "-10 min", "action":"SKIP_RW","img_on":"img/commons/player/skiprewON.png", "img_off":"img/commons/player/skiprewOFF.png"},
		{"x": 451, "text": "Regresar", "action":"RW",	"img_on":"img/commons/player/rewON.png", "img_off":"img/commons/player/rewOFF.png"},
		{"x": 515, "text": "Pausa", "action":"PAUSE",	"img_on":"img/commons/player/pauseON.png", "img_off":"img/commons/player/pauseOFF.png"},
		{"x": 579, "text": "Adelantar", "action":"FF",		"img_on":"img/commons/player/ffON.png", "img_off":"img/commons/player/ffOFF.png"},
		{"x": 643, "text": "+10 min", "action":"SKIP_FF","img_on":"img/commons/player/skipffON.png", "img_off":"img/commons/player/skipffOFF.png"},
		{"x": 707, "text": "Ir a live", "action":"STOP",	"img_on":"img/tv/anytime/goliveON.png", "img_off":"img/tv/anytime/goliveOFF.png"},
		];*/
	var data = [
		{"x": 515, "text": "Pausa", "action":"PAUSE",	"img_on":"img/commons/player/pauseON.png", "img_off":"img/commons/player/pauseOFF.png"},
		{"x": 579, "text": "Ir a live", "action":"STOP",	"img_on":"img/tv/anytime/goliveON.png", "img_off":"img/tv/anytime/goliveOFF.png"}
		/*{"x": 609, "text": "info", "action":"INFO","img_on":"img/commons/player/infoON.png", "img_off":"img/commons/player/infoOFF.png"}*/
		
		];
	return data;
}


startOverPlayer.drawStartOverLogo = function drawStartOverLogo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    tp_draw.getSingleton().drawImage("img/tv/anytime/1x1_MarcaAguaSTARTOVER.png", ctx, 0, 0,null,null,null,"destination-over");	
	ctx.drawObject(ctx.endObject());
}

/*startOverPlayer.drawMsg = function drawMsg(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    
    tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 0);
	ctx.drawObject(ctx.endObject());	
}*/

startOverPlayer.drawProgressBar = function drawProgressBar(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();  
      
	
	
	 	//Fondo barra de progreso
 	//var fillBase = this.themaData.fillBase
 	Canvas.drawShape(ctx, "rect", [67,0,1146,4], {"fill": "rgba(240, 240, 250, .3)"});
	Canvas.drawShape(ctx, "rect", [1213,0,67,4], {"fill": "rgba(240, 240, 250, .3)"});  
	Canvas.drawShape(ctx, "rect", [0,0,67,4], {"fill": "rgba(190,50,120,1)"}); 
    var custo = {"fill": "rgba(190,50,120,1)"}; //RS2, no sé por qué no lo jala del thema
   	
   	/****************************************************************/
   	//BARRA DE PROGRESO LIVE
	var minlive = Math.floor((new Date().getTime() - _data.program.startTime)/60000) + 10; //por los 10 min antes
	var liveProgress = ((minlive) * 100) / _data.program.duration;
	var liveWidth = (liveProgress * 1146) / 100;
	//NGM.trace("minutos de live: " + minlive + " /live progress: " + liveProgress + "   w:  " + liveWidth +"   duracion: " + _data.program.duration);
	//TODO: validar los que cuando llegue a 100 el progreso ya no pintar	
	custo.fill = "rgba(130, 220, 250, 1)";	
	Canvas.drawShape(ctx, "rect", [67,0,liveWidth,4], custo);
	
	//BARRA DE PROGRESO DEL BUFFER GRABADO
	var minbuffer = minlive - 4; //le resto los 4 min de delay que hay en LIVE HLS
	var bufferProgress = ((minbuffer) * 100) / _data.program.duration;
	var bufferWidth = (bufferProgress * 1146) / 100;	
	custo.fill = "rgba(220, 150, 190, 1)";
	Canvas.drawShape(ctx, "rect", [67,0,bufferWidth,4], custo);
	
	/****************************************************************/
   	
   	//Barra rosa
   	custo = {"fill": "rgba(190,50,120,1)"}; //RS2, no sé por qué no lo jala del thema
    var progress = (_data.progress * 1146) / 100;
	Canvas.drawShape(ctx, "rect", [67,0,progress,4], custo);
	
	
	//Definir # de segmentos y ancho
 	var bloques =_data.duration;
  	var size = (1146/bloques)*10;
  	
  	Canvas.drawShape(ctx, "rect", [67,0,1, 4], {"fill": "rgba(40,20,40,1)"});
  	
  	while(size < 1146){
	  	Canvas.drawShape(ctx, "rect", [size+67,0,1, 4], {"fill": "rgba(40,20,40,1)"});
  		size += (1146/bloques)*10;
  	}
	Canvas.drawShape(ctx, "rect", [1213,0,1,4], {"fill": "rgba(40,20,40,1)"});
  	
	//Línea blanca al final de la barra
	custo.fill = "rgba(240, 240, 240, 1)"; //igual no lo jala del thema
	Canvas.drawShape(ctx, "rect", [(progress+67),0,1,4], custo);
	
	//Números
	//Canvas.drawText(ctx, (_data.min-10) + " min / "+_data.duration+" min", new Rect(963,8, 186, 32), custo_f);
	
	var tsStart = _data.program.startTime + ((_data.min-10) * 60000);
	
	var custo_f = {"fill": "rgba(240,240,250,1)",
   		"font_family" : "Oxygen-Regular",
   		"font_size" : 22,
   		"text_align" : "right,top",
   		"text_wrap" : "auto",
   		"text_multiline" : true};
	
	Canvas.drawText(ctx, getHourFromTs(tsStart) + " / "+ getHourFromTs(_data.program.endTime)+" hrs", new Rect(963,8, 186, 32), custo_f);
	 	
	ctx.drawObject(ctx.endObject());	
}

startOverPlayer.drawButtonsPanel = function drawButtonsPanel(_data){ 	
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
startOverPlayer.drawButtons = function drawButtons(_data){ 		
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
startOverPlayer.drawButtonsHeader = function drawButtonsHeader(_data){ 		
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
startOverPlayer.drawAnytimeImg = function drawAnytimeImg(_data){ 	
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
startOverPlayer.drawVodControls = function drawVodControls(_data){ 	
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
startOverPlayer.drawBgControls = function drawBgControls(_data){ 	
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
		if(_data.detail.actors)
			Canvas.drawText(ctx, "<!i>"+_data.detail.actors+"<!>", new Rect(67, 118, 570, 32), custo_f);
		
		//originalName
		//Canvas.drawText(ctx, "<!i>"+toUpperCase(_data.detail.originalName)+"<!>", new Rect(67, 118, 570, 32), custo_f);
		
		//RATING
		tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.detail.parentalRating+".png", ctx, 67, 159);
		
    
    }
	
	
	
	
	
	ctx.drawObject(ctx.endObject());
}
startOverPlayer.drawOptionsBg = function drawOptionsBg(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth,ctx.viewportHeight],this.themaData.es4_09);
	Canvas.drawShape(ctx, "rect", [639, 290, 1,140],{"fill":"rgba(240, 240, 250, 1)"});
    
    ctx.drawObject(ctx.endObject());	
}
startOverPlayer.drawOptionsBookmark = function drawOptionsBookmark(_data){ 		
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
startOverPlayer.drawMalla = function drawMalla(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		tp_draw.getSingleton().drawImage("img/tmp/DevsOnion.png", ctx, 0, 0);	
		
		ctx.drawObject(ctx.endObject());
}