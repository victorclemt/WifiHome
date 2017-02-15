
FormWidget.registerTypeStandard("genericPlayer");

function genericPlayer(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.speed = 0;
   	this.secondsToHide = 5;
}
genericPlayer.inherits(FormWidget);
genericPlayer.prototype.onEnter = function onEnter(_data){	
	this.home = _data.home;
	this.home.objectChild = this; //Player Events
	this.vodInfo = _data.vodInfo;
	this.home.playVideo(this.vodInfo.url,"HLS",0);	
}
genericPlayer.prototype.showButtonsPanel = function showButtonsPanel(){
	var w = this.widgets,
		panel = w.buttonsPanel,
		logo = w.startOverLogo,
		progressBar = w.progressBarVod,
		buttons = this.initButtons(),
		min = this.home.playerGetProperty("POSITION")/60000;;
	
	this.home.showHeader({"section":"anytimePlayer","fill":"rgba(40,20,40,.8)"});
	w.vodControls.setData({"text": ""});
	w.buttons.setData(buttons,2);	
	panel.setData(this.vodInfo);

	progressBar.setData({"progress":(min*100)/this.vodInfo.duration,"duration":this.vodInfo.duration});

	this.client.lock();
		w.buttons.stateChange("enter");
		progressBar.stateChange("enter");
		panel.stateChange("enter");
		w.vodControls.stateChange("enter");
	this.client.unlock();

	this.currentFrame = "buttons";
	
	unsetTimeAlarm(this.hideButtonsDelay);
	this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
	
}
genericPlayer.prototype.hideButtonsPanel = function hideButtonsPanel(_data){
	var widgets = this.widgets;
	this.home.hideHeader();
	this.client.lock();
		widgets.buttonsPanel.stateChange("exit");
		widgets.buttons.stateChange("exit");
		widgets.progressBarVod.stateChange("exit");
		widgets.buttonsHeader.stateChange("exit");
	this.client.unlock();
	this.currentFrame = "player";
}
genericPlayer.prototype.updateProgressBar = function updateProgressBar(){
	var player = this.home.widgets.player;	
	var progressBar = this.widgets.progressBarVod;
	var position = this.home.playerGetProperty("POSITION");
	var duration = this.home.playerGetProperty("DURATION");	
	progressBar.setData({"progress": ((position/60000)*100)/this.vodInfo.duration,"min":parseInt(position/60000),"duration":this.vodInfo.duration});	
	progressBar.refresh();
}
genericPlayer.onFocusButtons = function onFocusButtons(_focus, _data){
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
genericPlayer.prototype.onKeyPress = function onKeyPress(_key){
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

	}
	return true;
}
genericPlayer.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
	var buttons = this.widgets.buttons,
		program = this.widgets.buttonsPanel.data;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			if(tpng.player.status == "PLAY"){
				this.hideButtonsPanel();
				unsetTimeAlarm(this.timerToShowButton);
			}else if(tpng.player.status == "PAUSE"){
				this.widgets.bgControls.stateChange("exit");
				this.hideButtonsPanel();
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
		case "KEY_IRENTER":
			this.goToAction(buttons.selectItem.action);
		break;
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
genericPlayer.prototype.onKeyPressPlayer = function onKeyPressPlayer(_key){
	switch(_key){
		case "KEY_TV_PLAY": //PLAY
		case "KEY_IRENTER":
			this.showButtonsPanel();
			this.playPause();
			unsetTimeAlarm(this.hideButtonsDelay);
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
			this.home.closeSection(this);
		break;
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.optionsPlayer();
			unsetTimeAlarm(this.hideButtonsDelay);
			unsetTimeAlarm(this.timerToShowButton);
		break;
		default:
			this.showButtonsPanel();
			unsetTimeAlarm(this.hideButtonsDelay);
			this.hideButtonsDelay = this.hideButtonsPanel.bind(this).delay(this.secondsToHide*1000);
		break;
		
	}	
	return true;
}
genericPlayer.prototype.onKeyPressOptions = function onKeyPressOptions(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
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
					this.home.closeSection(this);		
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
genericPlayer.prototype.goToAction = function goToAction(_control){
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
			this.home.closeSection(this);	
		break;	
	}
}
genericPlayer.prototype.playPause = function playPause(_control){
	var widgets = this.widgets;
	this.speed = 0;
		if(tpng.player.status == "PLAY"){
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
		}
}
genericPlayer.prototype.optionsPlayer = function optionsPlayer(_data){
	var widgets =  this.widgets;
		options = [
			{"label":"<!size=50>Salir<!> || De la reproducción","action":"SALIR"},
			{"label":"<!size=50>Seguir<!>|| La reproducción","action":"SEGUIR"}
		];
		widgets.optionsBg.setData("");
		widgets.optionsBg.stateChange("enter");
		widgets.optionsBg.refresh();
		widgets.optionsBookmark.setData(options);
		widgets.optionsBookmark.scrollNext();
		widgets.optionsBookmark.stateChange("enter");
		this.currentFrame = "optionsPlayer";
	
	
}
genericPlayer.prototype.skipPrev = function skipPrev(_control){
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
genericPlayer.prototype.skipNext = function skipNext(_control){
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
genericPlayer.prototype.speedPrev = function speedPrev(_control){
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
genericPlayer.prototype.speedNext = function speedNext(_control){	
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
genericPlayer.prototype.speedText = function speedText(_speed){
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
genericPlayer.prototype.initButtons = function initButtons(_data){	
	var data = [
		{"x": 387, "text": "-10 min", "action":"SKIP_RW","img_on":"img/commons/player/skiprewON.png", "img_off":"img/commons/player/skiprewOFF.png"},
		{"x": 451, "text": "Regresar", "action":"RW",	"img_on":"img/commons/player/rewON.png", "img_off":"img/commons/player/rewOFF.png"},
		{"x": 515, "text": "Pausa", "action":"PAUSE",	"img_on":"img/commons/player/pauseON.png", "img_off":"img/commons/player/pauseOFF.png"},
		{"x": 579, "text": "Adelantar", "action":"FF",		"img_on":"img/commons/player/ffON.png", "img_off":"img/commons/player/ffOFF.png"},
		{"x": 643, "text": "+10 min", "action":"SKIP_FF","img_on":"img/commons/player/skipffON.png", "img_off":"img/commons/player/skipffOFF.png"},
		{"x": 707, "text": "Detener", "action":"STOP",	"img_on":"img/commons/player/stopON.png", "img_off":"img/commons/player/stopOFF.png"},
		];
	return data;
}
genericPlayer.prototype.onStreamEvent = function onStreamEvent(event) {
	var player = this.home.widgets.player;
	switch(event.type){
		case "start":
			this.showButtonsPanel();
			unsetTimeAlarm(this.updateTimer);
			this.updateTimer = this.updateProgressBar.bind(this).repeat(1000);
		break;
		case "endOfFile":
		case "end":
			this.home.closeSection(this);		
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

genericPlayer.drawProgressBarVod = function drawProgressBarVod(_data){ 	
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

genericPlayer.drawButtonsPanel = function drawButtonsPanel(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    

	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], {"fill": "rgba(40,20,40,.8)"});
 	tp_draw.getSingleton().drawImage("img/vod/1x1_moreinfo.png", ctx, 610, 45);
	ctx.drawObject(ctx.endObject());	
}
genericPlayer.drawButtons = function drawButtons(_data){ 		
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
genericPlayer.drawButtonsHeader = function drawButtonsHeader(_data){ 		
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	var custo_f = JSON.stringify(this.themaData.standarBlackFont);
	custo_f = JSON.parse(custo_f);		
	custo_f.text_align = "center,top";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	tp_draw.getSingleton().drawImage("img/commons/player/TextBalloon3x3.png", ctx, _data.x, 0);
	Canvas.drawText(ctx, _data.text, new Rect(_data.x+5, 27, 174, 32), custo_f);
	
	ctx.drawObject(ctx.endObject());	
}
genericPlayer.drawVodControls = function drawVodControls(_data){ 	
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
genericPlayer.drawBgControls = function drawBgControls(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight], {"fill":"rgba(0,0,0,.4)"});

	ctx.drawObject(ctx.endObject());
}
genericPlayer.drawOptionsBg = function drawOptionsBg(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth,ctx.viewportHeight],this.themaData.es4_09);
	Canvas.drawShape(ctx, "rect", [639, 290, 1,140],{"fill":"rgba(240, 240, 250, 1)"});
    
    ctx.drawObject(ctx.endObject());	
}
genericPlayer.drawOptionsBookmark = function drawOptionsBookmark(_data){ 		
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
genericPlayer.prototype.onExit = function onExit(_data){
	var widgets = this.widgets;
	this.home.setPlayerStatus("STOP");
	unsetTimeAlarm(this.hideButtonsDelay);
	unsetTimeAlarm(this.timerToShowButton);
	unsetTimeAlarm(this.updateTimer);
	this.home.hideHeader();
	this.home.setPlayerStatus("STOP");
	widgets.buttonsPanel.stateChange("exit");
	widgets.buttons.stateChange("exit");
	widgets.progressBarVod.stateChange("exit");
	widgets.buttonsHeader.stateChange("exit");
	widgets.vodControls.stateChange("exit");
	this.home.objectChild = null; //<--Para quitar la referencia del evento en el homeFrame 
}
