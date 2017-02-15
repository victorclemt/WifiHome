// programDetail.js
function programDetail(_json, _options){
   	this.super(_json, _options);
}
programDetail.inherits(FormWidget);

programDetail.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.home.objectChild = this;
	this.program = _data.program;
	this.startTime = _data.startTime ? _data.startTime : new Date().getTime();
	//this.vodPlayer -> sirve para desabilitar funciones tales como: reproducir.
	//this.vodPlayer = _data.statusPlayer;

 	var now = new Date().getTime();
 	
 	
 	if(this.program.startTime < now && this.program.endTime > now){
 		var params = ["channel=" + this.program.ChannelVO.number, "startTime=" + this.startTime, "lchId=" + this.program.ChannelVO.lchId];
		getServices.getSingleton().call("EPG_GET_PROGRAM_INFO", params, this.responseGetProgramInfoBE.bind(this));
 	}else{
	 	if(this.program){
			var timer = setTimeout(function (){this.showInfo(_data.program)}.bind(this), 200);
		}else{
			this.getDataRecommendations(_data.parameters);
		}
 	}
 	
 	
}
programDetail.prototype.responseGetProgramInfoBE = function responseGetProgramInfoBE(response){
	if(response.status == 200){
		var _program = response.data.ResponseVO.program.ProgramVO;
			_program.ChannelVO = this.program.ChannelVO;
			
		this.showInfo(_program);
	
	}else if(response.error){	
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}	
}
programDetail.prototype.showInfo = function showInfo(_data){

	var widgets =  this.widgets,
		buttons = [],
		buttons_opt = [],
		format = null,
		now = new Date().getTime();
	
	_data.timeProgram = dateToText(_data.startTime);	
	
	this.home.showHeader();	
	this.home.setBg(_data.images.url18X18,true);	

	widgets.detail.setData(_data);
	widgets.detail.stateChange("enter");
	
	if(_data.startTime < now && _data.endTime > now){
		
		if(_data.ChannelVO.type != "S"){
			this.home.widgets.player.stateChange("playerDetail");
		}else{
			//this.home.widgets.mainBg.animation.zIndex(1).start();
			widgets.bgPlayer.setData({"url":this.widgets.detail.data.images.url6X6});
			widgets.bgPlayer.stateChange("enter");
		
		}
	}else{
		if(_data.endTime < now){
			if(_data.ChannelVO.isNpvr){
				var label = _data.isNpvrChecked ? "DEJAR DE GRABAR" : "GRABAR";
				buttons_opt.push({"label":label,"type":"RECORDING"});
			}
		}else{
			if(_data.ChannelVO.isNpvr){
				var label_1 = _data.isNpvrChecked ? "DEJAR DE GRABAR" : "GRABAR";
				buttons_opt.push({"label":label_1,"type":"RECORDING"});
			}
		
				var label = _data.hasReminder ? "NO RECORDAR" : "RECORDAR";
				buttons_opt.push({"label":label,"type":"REMINDER"});
		}
		
		var bookmark = _data.bookmark ? _data.bookmark : 10*60000;	
		
		
		if((_data.ChannelVO.isCtv && _data.isCtvRecorded) || (_data.ChannelVO.isNpvr && _data.isNpvrRecorded)){
				this.home.widgets.mainBg.animation.zIndex(-1).start();
				this.home.playVideo(_data.urlCtv,"VIDEO",bookmark,"playerDetail");
			}else{
				this.home.widgets.mainBg.animation.zIndex(1).start();
				widgets.bgPlayer.setData({"url":this.widgets.detail.data.images.url6X6});
				widgets.bgPlayer.stateChange("enter");
			}
	
	}
	
	widgets.focusPlayer.setData("");
	widgets.focusPlayer.stateChange("enter");
	
	widgets.buttons_opt.setData(buttons_opt);
	widgets.buttons_opt.stateChange("enter");
	widgets.button_back.setData([{"id":"0","text": "REGRESAR"}]);
	widgets.button_back.stateChange("enter");
	
	
	this.getRecommandations(_data.id, _data.ChannelVO.number);
	this.activeFocus = "player";
	
}
programDetail.prototype.getDataRecommendations = function getDataRecommendations(_section){
	var params = ["epgId="+ _section.epgId, "channel=" + _section.channel,  "startTime=" + this.startTime,"lchId=" + _section.lchId];
	getServices.getSingleton().call("EPG_GET_PROGRAM", params, this.responseGetRecommendationSection.bind(this));
}
programDetail.prototype.getRecommandations = function getRecommandations(_idEpg, _channel){
	var values = "0,5,0,0,0";
	var params = ["values="+values,"epgId="+_idEpg, "channel=" + _channel];
	getServices.getSingleton().call("RECOMMENDATION_GET_ID_EPG", params, this.responseGetRecommandations.bind(this));
}
programDetail.prototype.responseGetRecommendationSection = function responseGetRecommendationSection(response){
	if(response.status == 200){
		var program = response.data.ProgramVO;
		this.showInfo(program);
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}
programDetail.prototype.responseGetRecommandations = function responseGetRecommandations(response){
	
	if(response.status == 200){
		var widgets = this.widgets,
			recommendationCtv = response.data.ResponseVO.ctvArray;
		widgets.recommendations.setData(recommendationCtv);	
		widgets.recommendations.stateChange("enter");
		
			
	}
}
programDetail.prototype.responseReminder =  function responseReminder(responseCode){
	
	if(responseCode.status == 200){
		var widgets = this.widgets;
		var buttons_opt =  widgets.buttons_opt;

		for(var x = 0; x < buttons_opt.list.length; x++){
			if(buttons_opt.list[x].type == "REMINDER"){
				if(buttons_opt.list[x].label == "RECORDAR"){
			 		buttons_opt.list[x].label = "NO RECORDAR";
				 }else{
				 	buttons_opt.list[x].label = "RECORDAR";
				 }
				 	buttons_opt.redraw();
			}
		}
						 	
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}
programDetail.prototype.responseRecording =  function responseRecording(response){
	
	if(response.status == 200){
		var buttons_opt = this.widgets.buttons_opt;
		if(buttons_opt.selectItem.label == "GRABAR"){
	 		buttons_opt.selectItem.label = "DEJAR DE GRABAR";
	 		this.home.openSection("message", {"home":this.home, "title": this.home.widgets.programInfo.data.name, "active": true}, false, null, true);
		 }else{
		 	this.home.openSection("message", {"home":this.home, "title": this.home.widgets.programInfo.data.name, "active": false}, false, null, true);
		 	buttons_opt.selectItem.label = "GRABAR";
		 }
		 buttons_opt.redraw();				

	}else{
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}

}
programDetail.prototype.fullplayer = function fullplayer(){
	this.home.hideHeader();
	this.widgets.stateChange("exit");
	this.home.widgets.player.stateChange("enter");
	this.activeFocus = "fullplayer";
}
programDetail.prototype.miniplayer = function miniplayer(){
	this.home.showHeader({"stroke":"rgba(130, 60, 150, 1)"});
	this.widgets.buttons_opt.setFocus(false);
	this.widgets.stateChange("enter");
	this.widgets.tooltip_button_back.stateChange("exit");
	this.widgets.bgPlayer.stateChange("exit");
	this.home.widgets.player.stateChange("playerDetail");
	this.activeFocus = "player";
}
/*programDetail.prototype.closeDetail = function closeDetail(){

	this.home.setPlayerStatus("PLAY");
	//this.home.setPlayerStatus("STOP");
	this.home.closeSection(this);
	this.home.widgets.player.stateChange("enter");
}*/
programDetail.onFocusRecommendation = function onFocusRecommendation(_focus, _data){
   	var widgets = this.widgets;
	if(_focus && this.activeFocus != "recommendations")
        	widgets.recommendations.setFocus(false);
    		
}
programDetail.onFocusButtons = function onFocusButtons(_focus, _data){
   	var widgets = this.widgets;
	if(_focus && this.activeFocus != "buttons")
        	widgets.buttons.setFocus(false);
    		
}
programDetail.onFocusButtonBack = function onFocusButtonBack(_focus, _data){
   	var widgets = this.widgets;
	if(_focus){		
	    this.timerFocusButtons = setTimeout(function (){
	    	widgets.tooltip_button_back.setData({"x": 0, "text": "REGRESAR"});
   			widgets.tooltip_button_back.stateChange("enter");
		}.bind(this), 500);
	}else{
		unsetTimeAlarm(this.timerFocusButtons);
		widgets.tooltip_button_back.stateChange("exit");
	}	
}
programDetail.prototype.onStreamEvent = function onStreamEvent(event) {

	switch(event.type){
		case "error":
			//this.widgets.buttons_opt.stateChange("exit")
			
			this.widgets.bgPlayer.setData({"url":this.widgets.detail.data.images.url6X6});
			this.widgets.bgPlayer.stateChange("enter");
		break;
		case "endOfFile":
		case "end":
			this.home.setPlayerStatus("STOP");
			this.miniplayer();
			this.widgets.bgPlayer.setData({"url":this.widgets.detail.data.images.url6X6});
			this.widgets.bgPlayer.stateChange("enter");
		break;
		
		
	}
}
programDetail.prototype.onKeyPress = function onKeyPress(_key){
	
	switch(this.activeFocus){
		case "buttons":
			this.onKeyPress_buttons(_key);
		break;
		case "buttons_opt":
			this.onKeyPress_buttons_opt(_key);
		break;
		case "player":
			this.onKeyPress_player(_key);
		break;
		case "exit":
			this.onKeyPress_exit(_key);
		break;
		case "recommendations":
			this.onKeyPress_recommendations(_key);
		break;
		case "fullplayer":
			this.onKeyPress_fullplayer(_key);
		break;
		case "search":
			this.onKeyPress_search(_key);
		break;
	}
	return true;	
}
programDetail.prototype.onKeyPress_buttons_opt = function onKeyPress_buttons_opt(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			if(widgets.detail.data.actualProgram && widgets.detail.data.ChannelVO.type != "S"){
						this.widgets.stateChange("exit");
						this.home.widgets.player.stateChange("enter");
				}else{
					this.home.setPlayerStatus("STOP");
				}
			this.home.closeSection(this);	
		break;	
		case "KEY_RIGHT":
			widgets.buttons_opt.scrollNext();
		break;
		case "KEY_LEFT":
			if(!widgets.buttons_opt.scrollPrev()){
				widgets.buttons_opt.setFocus(false);
				widgets.button_back.setFocus(true);
				this.activeFocus = "exit";
			}
		break;
		case "KEY_DOWN":
			if(widgets.recommendations.maxItem >0){
				this.activeFocus = "recommendations";
				widgets.buttons_opt.setFocus(false);
				widgets.recommendations.setFocus(true);
			}
		break;
		case "KEY_UP":
			widgets.focusPlayer.stateChange("enter");
			widgets.buttons_opt.setFocus(false);
			this.activeFocus = "player";
			
		break;
		case "KEY_IRENTER":
			switch(widgets.buttons_opt.selectItem.type){
				case "RECORDING":
					getServices.getSingleton().call("EPG_RECORDING_NPVR", ["epgId="+widgets.detail.data.id],  this.responseRecording.bind(this));
				break;
				case "REMINDER":
					getServices.getSingleton().call("EPG_REMINDER", ["idEpg="+widgets.detail.data.id], this.responseReminder.bind(this));
					
				break;
			}
		break;
	}	
	return true;
}
programDetail.prototype.onKeyPress_player = function onKeyPress_player(_key){
	var widgets = this.widgets,
		program = widgets.detail.data;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			if(program.actualProgram && program.ChannelVO.type != "S"){
					this.widgets.stateChange("exit");
					this.home.widgets.player.stateChange("enter");
				}else{
					this.home.setPlayerStatus("STOP");
				}
				this.home.closeSection(this);	
		break;	
		case "KEY_LEFT":
			widgets.focusPlayer.stateChange("exit");
			widgets.button_back.setFocus(true);
			this.activeFocus = "exit";
		break;
		case "KEY_UP":
			this.activeFocus = "search"; 
    		this.home.enableSearchHeader();
    		widgets.focusPlayer.stateChange("exit");
		break;
		case "KEY_DOWN":
			if(widgets.buttons_opt.list.length > 0){
				widgets.buttons_opt.setFocus(true);
				this.activeFocus = "buttons_opt";
				widgets.focusPlayer.stateChange("exit");
			}else{
				if(widgets.recommendations.maxItem > 0){
					this.activeFocus = "recommendations";
					widgets.recommendations.setFocus(true);
					widgets.buttons_opt.setFocus(false);
					widgets.focusPlayer.stateChange("exit");
				}
				
			}
		break;
		case "KEY_IRENTER":
    		if(program.actualProgram && program.ChannelVO.type != "S"){
					this.widgets.stateChange("exit");
					this.home.widgets.player.stateChange("enter");
					this.home.closeSection(this);
			}else{
				if(widgets.detail.data.urlCtv)
	    			this.home.openSection("anytimePlayer",{"home":this.home, "program": widgets.detail.data},false);
	    			
			}
    	break;
		/*case "KEY_TV_RED":
			widgets.malla.stateChange("exit");
    	break;
    	case "KEY_TV_BLUE":
    		widgets.malla.stateChange("enter");
    	break;*/
	}	
	return true;
}
programDetail.prototype.onKeyPress_exit = function onKeyPress_exit(_key){	
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
			if(widgets.detail.data.actualProgram && widgets.detail.data.ChannelVO.type != "S"){
					this.widgets.stateChange("exit");
					this.home.widgets.player.stateChange("enter");
				}else{
					this.home.setPlayerStatus("STOP");
				}
					
			this.home.closeSection(this);	
		break;	
		case "KEY_RIGHT":
			widgets.focusPlayer.stateChange("enter");
			widgets.button_back.setFocus(false);
			this.activeFocus = "player";
    	break;
		case "KEY_UP":
			this.activeFocus = "search"; 
    		this.home.enableSearchHeader();
    		widgets.button_back.setFocus(false);
		break;
	
	}
	
	return true
}
programDetail.prototype.onKeyPress_fullplayer = function onKeyPress_fullplayer(_key){	
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
			this.miniplayer();
		break;
	
	}
	
	return true
}
programDetail.prototype.onKeyPress_search = function onKeyPress_search(_key){	
	var widgets = this.widgets;	
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			this.home.disableSearchHeader();
			widgets.focusPlayer.stateChange("enter");
			this.activeFocus = "player";
		break;
		
		default:
			this.home.onKeyPress(_key);
		break;
	}
	return true
}
programDetail.prototype.onKeyPress_recommendations = function onKeyPress_recommendations(_key){
	var widgets = this.widgets;
	switch(_key){		
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.setPlayerStatus("STOP");
			this.home.closeSection(this);
		break;	
	    case "KEY_LEFT":
	   		if(!widgets.recommendations.scrollPrev()){
	   			this.activeFocus = "exit";
	   			widgets.recommendations.setFocus(false);
				widgets.button_back.setFocus(true);
				
			}
	    break;
	    case "KEY_UP":
	    	if(widgets.buttons_opt.list.length > 0){
		    	this.activeFocus = "buttons_opt";
		    	widgets.recommendations.setFocus(false);
		    	widgets.buttons_opt.setFocus(true);
	    	}else{
	    		widgets.focusPlayer.stateChange("enter");
				widgets.recommendations.setFocus(false);
				this.activeFocus = "player";
	    	}
	    break;
		case "KEY_RIGHT":			
			widgets.recommendations.scrollNext();
    	break;
    	case "KEY_IRENTER":
    		this.home.hideBackground();
    		this.home.setPlayerStatus("STOP");
	    	var section = widgets.recommendations.selectItem.ItemVO.link;
	    	this.home.openLink(section,null,5);
	    	
    	
    	break;
	}	
	return true;
}
programDetail.drawDetail = function drawDetail(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
     var custo_f = JSON.stringify(this.themaData.standardFont);
		 custo_f = JSON.parse(custo_f);
  	
   if(_data.ChannelVO.isCtv) //TODO: VALIDAR LOS GRISES/ROSAS/AZULES
		tp_draw.getSingleton().drawImage("img/tv/AnytimetvONnew.png", ctx, 0, 0);
	else if(_data.ChannelVO.isNpvr)
		tp_draw.getSingleton().drawImage("img/tv/AnytimetvOFFnew.png", ctx, 0, 0);
	
   //logo
   tp_draw.getSingleton().drawImage(_data.ChannelVO.images.url1X1, ctx, 90, 60);

	Canvas.drawShape(ctx, "rect", [80,108,84,1], {fill: "rgba(220, 220, 230, 1)"});
   // numero canal
	custo_f.text_align = "center,top";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.ChannelVO.number+"", new Rect(90, 112, 58, 32), custo_f);
   
   //name
    custo_f.text_align = "left,bottom";
	custo_f.font_size = 34 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, toUpperCase(_data.name) , new Rect(643, 37, 570, 76), custo_f);
	
	 //duration
    custo_f.text_align = "right,bottom";
    custo_f.font_size = 20 * tpng.thema.text_proportion;
	if(_data.timeProgram)
		Canvas.drawText(ctx, "<!i>"+toUpperCase(_data.timeProgram)+"<!i>", new Rect(323, 48, 250, 32), custo_f);
	
	custo_f.text_align = "right,middle";
	Canvas.drawText(ctx, "<!i>"+getHourFromTs(_data.startTime)+"-"+getHourFromTs(_data.endTime)+" hrs<!>", new Rect(323, 76, 250, 32), custo_f);
	
	//puntuación
	/*tp_draw.getSingleton().drawImage("img/tv/EstrellaIMDB.png", ctx, 195, 83);
	custo_f.text_align = "left,middle";
	Canvas.drawText(ctx, "<!i>7.2<!>", new Rect(222, 76, 122, 32), custo_f);
	*/
	//description
	custo_f.text_align = "left,top";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	
	var year = _data.year ? _data.year : "0";
		year = year != "0" ? year+" / " : "";	

	var category = _data.category ? _data.category+" / " : "";
	Canvas.drawText(ctx, "<!line-height=25>------ / "+year + category + _data.description+"<!>", new Rect(643, 148, 570, 212), custo_f);
   
    //autores
	custo_f.fill = "rgba(170,170,180,1)";
	custo_f.text_align = "left,middle";
	Canvas.drawText(ctx, "<!i>"+_data.actors+"<!>", new Rect(643, 112, 570, 32), custo_f);
	
	//originalName
	//Canvas.drawText(ctx, "<!i>"+toUpperCase(_data.originalName)+"<!>", new Rect(576, 76, 570, 32), custo_f);
	//RATING
	if(_data.rating)
		tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.rating.value+".png", ctx, 643, 154);
	else
		tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.parentalRating+".png", ctx, 643, 154);
	

   // if(!_data.vodPlayer){
    	//custo_f.text_align = "right,middle";
    	Canvas.drawText(ctx,"CONTENIDO SIMILAR" , new Rect(195, 400, 314, 32), custo_f);
    //}
    
    ctx.drawObject(ctx.endObject());	
}
programDetail.drawBgPlayer = function drawBgPlayer(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();

		tp_draw.getSingleton().drawImage(_data.url, ctx, 5, 5);
		
		ctx.drawObject(ctx.endObject());
}
programDetail.drawFocusPlayer = function drawFocusPlayer(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
	
		var custo = JSON.stringify(this.themaData.whiteStrokePanel)
		custo = JSON.parse(custo);
		custo.stroke_width = 5;
		custo.rx = 5;
		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

		ctx.drawObject(ctx.endObject());
}
programDetail.drawRecommendations = function drawRecommendations(_data){ 	
	
   
	this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
		tp_draw.getSingleton().drawImage(_data.ItemVO.images.url3X3, ctx, 5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10, null,"destination-over");
		
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);

		if(focus){
			custo.stroke_width = 5;
			custo.rx = 5;
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
			
			var strokeF = {"stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_position" : "inside"};
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], strokeF);
		}else{
			Canvas.drawShape(ctx, "rect", [5,5, ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
		}

		ctx.drawObject(ctx.endObject());
	}	
}
programDetail.drawButtons_opt = function drawButtons_opt(_data){ 	
	
	this.draw = function draw(focus) {	
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 16 * tpng.thema.text_proportion;	

		var custo = { "fill": "rgba(30,30,40,.7)",
                	  "shadow": null,
                	  "rx": 10,
                	  "stroke": "rgba(85,95,105,1)",
               	 	  "stroke_width": 1,
               	 	  "stroke_pos" : "inside"	
					}
			
			
		if(focus){
			custo.stroke = "rgba(240,240,240,1)";
			custo.rx = 10;
			custo.fill = "rgba(240,240,240,1)";
			Canvas.drawShape(ctx, "rect", [3,3,ctx.viewportWidth-6,ctx.viewportHeight-6], custo); //FONDO
			custo_f.fill = "rgba(30,30,40,1)";
		}else{
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
		}
		
		Canvas.drawText(ctx, _data.label, new Rect(5,5,ctx.viewportWidth-10, ctx.viewportHeight-10), custo_f);
		
		ctx.drawObject(ctx.endObject());	
	}
}
programDetail.drawStatusPlayer = function drawStatusPlayer(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
	
		var custo = JSON.stringify(this.themaData.whiteStrokePanel)
		custo = JSON.parse(custo);
		custo.stroke_width = 5;
		custo.rx = 5;
		
		tp_draw.getSingleton().drawImage("img/menu/playAT.png", ctx, 170, 88);

		ctx.drawObject(ctx.endObject());
}
//temp
programDetail.drawMalla = function drawMalla(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		tp_draw.getSingleton().drawImage("img/tmp/DevsOnion.png", ctx, 0, 0);	
		
		ctx.drawObject(ctx.endObject());
}
programDetail.prototype.onExit = function onExit(_data){
	this.widgets.stateChange("exit");
	this.home.hideHeader();
	this.home.hideBackground();
	unsetTimeAlarm(this.timerFocusButtons);
	this.home.objectChild = null;
	this.home.widgets.mainBg.animation.zIndex(-1).start();
}