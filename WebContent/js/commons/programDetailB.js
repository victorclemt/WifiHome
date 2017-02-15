FormWidget.registerTypeStandard("programDetailBB");

function programDetailB(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.actualFocus;
   	this.home;
}

programDetailB.inherits(FormWidget);

programDetailB.prototype.onEnter = function onEnter(_data){
	this.transparent = _data.transparent;
	this.home = _data.home;
	this.parentP = _data.parentP;

	//this.widgets.back.setData(); 
	//this.widgets.back.stateChange("enter");
	
	//this.home.showHeader();
	this.statusPlayer = _data.statusPlayer;
	if(_data.program){
		var timer = setTimeout(function (){this.showFullInfo(_data.program);}.bind(this), 200);
	}else{
		this.getDataRecommendations(_data.parameters);
	}
	
}

programDetailB.prototype.onExit = function onExit(_data){
	var widgets = this.widgets;
	
	widgets.programFullInfo.stateChange("exit");
	widgets.recommendationsFullInfo.stateChange("exit");

	widgets.rightArrowButtons.stateChange("exit");
	widgets.leftArrowButtons.stateChange("exit");
	
	widgets.rightArrowRecommendations.stateChange("exit");
	widgets.leftArrowRecommendations.stateChange("exit");

	widgets.buttons_top.stateChange("exit");
	widgets.buttons_bottom.stateChange("exit");	
	widgets.button_back.stateChange("exit");	
	widgets.tooltip_button_back.stateChange("exit");	
	
	this.home.widgets.mainBg.animation.zIndex(-1).start();
	unsetTimeAlarm(this.timerToShowButton);
	this.home.hideHeader();
	if(tpng.app.currentChannel.type == "C") //Para que nunca me quite el bg en caso de los interactivo
		this.home.hideBackground();
	if((tpng.app.currentChannel.type == "S" && this.imageBg) || tpng.app.lockedStream){
		this.home.hideBackground();
	}
	clearTimeout(this.timerFocusButtons);
}


programDetailB.prototype.getDataRecommendations = function getDataRecommendations(_section){
	var params = ["epgId="+ _section.epgId, "channel=" + _section.channel];
	getServices.getSingleton().call("EPG_GET_PROGRAM", params, this.responseGetRecommendationSection.bind(this));
}

programDetailB.prototype.responseGetRecommendationSection = function responseGetRecommendationSection(response){
	if(response.status == 200){
		var program = response.data.ProgramVO;
		this.showFullInfo(program);
	}else{
		this.home.openSection("miniError", {"home": this.home,"code":response.status}, false, null, true);
	}
}

programDetailB.prototype.showFullInfo = function showFullInfo(_program){
	
	var widgets = this.widgets,
		programFullInfo = widgets.programFullInfo,
		buttons_top = widgets.buttons_top,
		buttons_bottom = widgets.buttons_bottom,
		button_back = widgets.button_back,
		recommendations = widgets.recommendationsFullInfo,
		rightArrowButtons = widgets.rightArrowButtons,
		leftArrowButtons = widgets.leftArrowButtons;
		
		this.program = _program;
		this.idProgram = _program.id;
		this.nameProgram = _program.name;		
		this.channelNumber = _program.ChannelVO.number;
				
		var tActual = new Date().getTime();	
		if(_program.startTime < tActual && _program.endTime > tActual){
			//this.home.setBg("");
			this.current = true;
			this.home.showHeader({"current": this.current});
		}else{
			this.imageBg = true;
			var url = _program.images.url18X18;
			 this.home.widgets.mainBg.animation.zIndex(1).start();
			if(!this.transparent) //Cuando lo abres desde el player y necesitamos que se quede transparente
				this.home.setBg(url);
			this.current = false;	
			this.home.showHeader();		
		}					
		
		_program.statusPlayer = this.statusPlayer;	 
		programFullInfo.setData(_program);
		var buttons_data = this.home.getButtons(_program, "full_info");
		

		buttons_top.setData(buttons_data.top,0);
		buttons_bottom.setData(buttons_data.bottom,0);
		button_back.setData([{"id":"0","text": "REGRESAR"}]);
		
		
		if(buttons_data.bottom.length > 5){
			rightArrowButtons.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
		}else if(buttons_data.bottom.length <= 5){
			rightArrowButtons.setData({"url": "" ,"line":true, "position": "right"});
		}else{
			
		}
		
		var state = "enter_"+buttons_data.bottom.length+"";
		leftArrowButtons.setData({"url": "" ,"line":true, "position": "left"});
		leftArrowButtons.stateChange("enter");
		rightArrowButtons.stateChange(state);
		

		this.client.lock();	
			programFullInfo.stateChange("enter");
			buttons_top.stateChange("enter");
			buttons_bottom.stateChange("enter");
			button_back.stateChange("enter");
		this.client.unlock();
		
		this.actualFocus = "buttonsBottom";
		buttons_bottom.setFocus(false);
		buttons_bottom.focusIndex = 1;
		buttons_bottom.setFocus(true);
		this.getRecommandations(_program.id, _program.ChannelVO.number);
}

programDetailB.prototype.getRecommandations = function getRecommandations(_idEpg, _channel){
//	var values = this.current ? "2,1,0,1,0" : "1,2,0,1,0";
	var values = this.current ? "2,2,2,2,0" : "2,2,2,2,0";
	var params = ["values="+values,"epgId="+_idEpg, "channel=" + _channel];
	getServices.getSingleton().call("RECOMMENDATION_GET_ID_EPG", params, this.responseGetRecommandations.bind(this));
}

programDetailB.prototype.responseGetRecommandations = function responseGetRecommandations(response){

	if(response.status == 200){
		this.haveR = true;
		var widgets = this.widgets,
			recommendations = widgets.recommendationsFullInfo,
			rightArrowRecommendations = widgets.rightArrowRecommendations,
			leftArrowRecommendations = widgets.leftArrowRecommendations,			
			recommendationLive = response.data.ResponseVO.liveArray,
			recommendationFuture = response.data.ResponseVO.futureArray,
			recommendationCtv = response.data.ResponseVO.ctvArray,
			recommendationVod = response.data.ResponseVO.vodArray,
			total = [];
	
		for(var i = 0; i<recommendationLive.length; i++){
			total[i] = recommendationLive[i];
		}
		
		var l2 = recommendationLive.length+recommendationCtv.length;
		for(var i = recommendationLive.length; i<l2; i++){
			total[i] = recommendationCtv[i-recommendationLive.length];
		}
		
		var l3 = recommendationLive.length+recommendationCtv.length+recommendationFuture.length;
		for(var i = l2; i<l3; i++){
			total[i] = recommendationFuture[i-l2];
		}
		
		var l4 = recommendationLive.length+ recommendationCtv.length+ recommendationFuture.length+recommendationVod.length;  
		
		for(var i = l3; i<l4; i++){
			total[i] = recommendationVod[i-l3];
		}
		
		//var totalLength = "enter_"+total.length;			
		//leftArrowBottomRecommendations.setData({"url": "" ,"line": true, "position": "left"});
		
		// REVISAR + a DETALLE
		if(total.length > 5){
			rightArrowRecommendations.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
		}
		
		leftArrowRecommendations.setData({"url": "" ,"line":true, "position": "left"});
		recommendations.setData(total);
		recommendations.setFocus(false);
		this.client.lock();
			recommendations.stateChange("enter");
			leftArrowRecommendations.stateChange("enter");
			rightArrowRecommendations.stateChange("enter_5");
		this.client.unlock();

	}else{	
		this.haveR = false;
	}

}

programDetailB.prototype.responseUpdateChannel = function responseUpdateChannel(response){
	
	var w = this.widgets;
	if(response.status == 200){
		this.home.updateChannelList(null, null, this);
	}else{	
		this.home.openSection("miniError", {"home": this.home,"code":response.status}, true,,true);
			
						
	}
}

programDetailB.prototype.responseRecording =  function responseRecording(response){
	
	if(response.status == 200){
		var buttons_bottom = this.widgets.buttons_bottom;
		if(buttons_bottom.selectItem.label == "Grabar"){
	 		buttons_bottom.selectItem.label = "Dejar de grabar";
	 		this.home.openSection("message", {"home":this.home, "title": this.home.widgets.programInfo.data.name, "active": true}, false, null, true);
		 }else{
		 	this.home.openSection("message", {"home":this.home, "title": this.home.widgets.programInfo.data.name, "active": false}, false, null, true);
		 	buttons_bottom.selectItem.label = "Grabar";
		 }
		 buttons_bottom.redraw();				

	}else{
		this.home.openSection("miniError", {"home": this.home,"code":responseCode.status}, false);
	}

}

programDetailB.prototype.responseReminder =  function responseReminder(responseCode){
	
	if(responseCode.status == 200){
		var widgets = this.widgets;
		var buttons_bottom =  widgets.buttons_bottom;

		for(var x = 0; x < buttons_bottom.list.length; x++){
			if(buttons_bottom.list[x].action == "REMINDER"){
				if(buttons_bottom.list[x].label == "Recordar"){
			 		buttons_bottom.list[x].label = "No recordar";
				 }else{
				 	buttons_bottom.list[x].label = "Recordar";
				 }
				 	buttons_bottom.redraw();
			}
		}
						 	
	}else{
		this.home.openSection("miniError", {"home": this.home,"code":responseCode.status}, false);
	}
}


programDetailB.prototype.hide_Widgets = function hide_Widgets(){
	var widgets = this.widgets;
	this.actualFocus = "viewBack";
	this.home.hideHeader();
	
	widgets.exitSections.setData();
	widgets.exitSections.stateChange("enter");
	
	widgets.programFullInfo.stateChange("exit");
	widgets.lineTop.stateChange("exit");
	widgets.leftArrowRecommendations.stateChange("exit");
	widgets.rightArrowRecommendations.stateChange("exit");
	widgets.buttons_top.stateChange("exit");
	widgets.buttons_bottom.stateChange("exit");
	widgets.recommendationsFullInfo.stateChange("exit");
}

programDetailB.prototype.show_Widgets = function show_Widgets(){
	var widgets = this.widgets;
	this.actualFocus = "buttonsBottom";
	this.home.showHeader({"current": this.current});	
	
	widgets.exitSections.setData();
	widgets.exitSections.stateChange("exit");
	
		
	widgets.programFullInfo.stateChange("enter");
	widgets.lineTop.stateChange("enter");
	widgets.leftArrowRecommendations.stateChange("enter");
	widgets.rightArrowRecommendations.stateChange("enter");
	widgets.buttons_top.stateChange("enter");
	widgets.buttons_bottom.stateChange("enter");
	widgets.recommendationsFullInfo.stateChange("enter");
}


programDetailB.prototype.onKeyPress = function onKeyPress(_key){
	var widgets = this.widgets;
	switch(this.actualFocus){
		case "recommendations":
			this.onKeyPressRecommendations(_key);
		break;
		case "buttonsTop":
			this.onKeyPressButtonsTop(_key);
		break;
		case "buttonsBottom":
			this.onKeyPressButtonsBottom(_key);
		break;
		case "search":
			this.onKeyPressSearch(_key);
		break;
		case "viewBack":
			this.onKeyPressBackground(_key);		
		break;
		case "exit_info":
			this.onKeyPressExit(_key);		
		break;
		
	}
	return true;

}


programDetailB.prototype.onKeyPressButtonsTop = function onKeyPressButtonsTop(_key){
	var widgets = this.widgets,
	buttons_top = widgets.buttons_top,
	tooltipsSocialNetwork = widgets.tooltipsSocialNetwork,
	buttons_bottom = widgets.buttons_bottom;
	 
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			if(this.statusPlayer){
				this.home.setPlayerStatus("PLAY");
			}
			if(tpng.app.twitter){
	    		this.home.tweetFeed();
	    	}
			this.home.closeSection(this);
	    break;
	
		case "KEY_LEFT":
		case "KEY_RIGHT":		
			_key == "KEY_LEFT" ? buttons_top.scrollPrev() : buttons_top.scrollNext();
    	break;
    	
    	case "KEY_UP":
	    	this.actualFocus = "search"; 
    		this.home.enableSearchHeader();
    		buttons_top.setFocus(false);

    	break;
    
    	case "KEY_DOWN":
    		this.actualFocus = "buttonsBottom";
    		buttons_top.setFocus(false);
    		buttons_bottom.setFocus(true);
		break;		
		
		case "KEY_IRENTER":	
			switch(buttons_top.selectItem.action){
		
				case "ONTWEETFEED":
					this.home.closeSection(this);
					if(tpng.app.currentProgram.tweetFeed)	
	    				this.home.tweetFeed();
	    		break;
	    		
	    		case "OFFTWEETFEED":
					if(buttons_top.selectItem.tooltip == "DESACTIVAR"){
						buttons_top.selectItem.tooltip = "ACTIVAR";
						buttons_top.selectItem.action = "ONTWEETFEED";
						tpng.app.twitter = false;
						this.home.closeSection(tpng.app.twitterApp);
						tooltipsSocialNetwork.setData({"position_x": buttons_top.selectItem.position_x, "text":buttons_top.selectItem.tooltip});
						tooltipsSocialNetwork.refresh();
					}	    		
	    		break;	

			}
			
		break;
				
	}
	return true;
}

programDetailB.prototype.onKeyPressButtonsBottom = function onKeyPressButtonsBottom(_key){
	var widgets = this.widgets,
	buttons_top = widgets.buttons_top,
	buttons_bottom = widgets.buttons_bottom,
	button_back = widgets.button_back,
	leftArrowButtons = widgets.leftArrowButtons,
	rightArrowButtons = widgets.rightArrowButtons,
   	recommendations = widgets.recommendationsFullInfo;
	 
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			if(this.statusPlayer)
				this.home.setPlayerStatus("PLAY");
			
			if(tpng.app.twitter){
	    		this.home.tweetFeed();
	    	}
			this.home.closeSection(this);
	    break;
    	
    	case "KEY_LEFT":
			if(buttons_bottom.scrollPrev()){
				if(buttons_bottom.maxItem > 5){
					if(buttons_bottom.selectIndex == 0){					
						leftArrowButtons.setData({"url":"", "line":true, "position": "left"});
						leftArrowButtons.refresh();
						button_back.stateChange("enter");
					}	
					if(buttons_bottom.selectIndex+1 <= (buttons_bottom.maxItem-5)){
						rightArrowButtons.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
						rightArrowButtons.refresh();
					}
				}		
			}else{
				this.actualFocus = "exit_info";
	    		buttons_bottom.setFocus(false);
	    		button_back.setFocus(true);
			}

    	break;

		case "KEY_RIGHT":		
			buttons_bottom.scrollNext();
			if(buttons_bottom.maxItem > 5){
				if(buttons_bottom.selectIndex >= 5){
					leftArrowButtons.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					leftArrowButtons.refresh();
					button_back.stateChange("exit");
					}
				}
			if(buttons_bottom.selectIndex == (buttons_bottom.maxItem-1)){
				rightArrowButtons.setData({"url": "" ,"line":true, "position": "right"});
				rightArrowButtons.refresh();
			}			
    	break;
    	
    	case "KEY_UP":
    	    buttons_bottom.setFocus(false);
    	    if(buttons_top.list.length > 0){//O sea que si hay botones en top
    			this.actualFocus = "buttonsTop";    		
    			buttons_top.setFocus(true);
    		}else{//No hay botones en top, se salta a header
	   			this.actualFocus = "search"; 
   				this.home.enableSearchHeader();    		
   			}	

			
    	break;
    	
    	case "KEY_DOWN":
    		if(this.haveR){
				buttons_bottom.setFocus(false);
	    		this.actualFocus = "recommendations";
	    		if(buttons_bottom.focusIndex > 3){
	    		//if(buttons_bottom.focusIndex == 5 || buttons_bottom.focusIndex == 4){
		    		recommendations.focusIndex = 4;	    		
	    		}else{
	    			recommendations.focusIndex = buttons_bottom.focusIndex;
				}
	    		recommendations.setFocus(true);
	    		recommendations.animation.zIndex(3).start();
	   		}
	   		 
    	break;

		case "KEY_IRENTER":
			switch(buttons_bottom.selectItem.action){
				case "AUDIOS":
					this.home.changeAudio();
				break;
				case "SUB":
					this.home.changeSubtitle();
				break;
				
				case "REMINDER":
				 	var params = ["idEpg="+this.idProgram];
					getServices.getSingleton().call("EPG_REMINDER", params, this.responseReminder.bind(this));
					
				break;
				
				case "PLAY":
					this.home.openSection("anytimePlayer",{"home":this.home, "program": this.program},false);
				break;
	
				case "RECORDING":
					getServices.getSingleton().call("EPG_RECORDING_NPVR", ["epgId="+this.idProgram],  this.responseRecording.bind(this));
				break;			
				case "SEARCH":
					if(this.statusPlayer){
		    			this.parentP.stopPlayer(true);
		    		}
					this.nameProgram = replaceAll(this.nameProgram, " ", "@");
					this.home.openSection("search",{"home":this.home, "pattern": this.nameProgram, "related":true, "channel":this.program.ChannelVO.number, "epgId":this.program.id},true, ,false);
					
				break;
				case "LOCKCHANNEL":
					if(this.statusPlayer){
		    			this.parentP.stopPlayer(true);
		    		}
					this.home.openSection("unlockProgram",{"home":this.home, "channel": this.program.ChannelVO, "program": this.program, "blockChannel": true, "section": "programDetailB"},true, ,false);
				break;
				case "HELP":
					if(this.statusPlayer){
		    			this.parentP.stopPlayer(true);
		    		}
					this.home.openSection("help",{"home":this.home},true, ,false);
				break;
				case "GALLERY":
					this.hide_Widgets();
				break;
				case "ONTWEETFEED":
					this.home.closeSection(this);
					if(tpng.app.currentProgram.tweetFeed)	
	    				this.home.tweetFeed();
	   
	    		break;
	    		case "OFFTWEETFEED":
					if(buttons_bottom.selectItem.label == "Desactivar Tweet Feed"){
						buttons_bottom.selectItem.label = "Activar Tweet Feed";
						tpng.app.twitter = false;
						this.home.closeSection(tpng.app.twitterApp);
					}else{
						this.home.closeSection(this);
						if(tpng.app.currentProgram.tweetFeed){
	    					this.home.tweetFeed();
	    				}
	    				
					}
					buttons_bottom.redraw();
					
	    		break;				
			}
		break;
    	
	}
	return true;
}
programDetailB.prototype.onKeyPressRecommendations = function onKeyPressRecommendations(_key){
	var widgets = this.widgets,
		recommendations = widgets.recommendationsFullInfo,
		programFullInfo = widgets.programFullInfo,
		rightArrowRecommendations = widgets.rightArrowRecommendations,
		leftArrowRecommendations = widgets.leftArrowRecommendations,
		buttons_top = widgets.buttons_top,
		button_back = widgets.button_back,
		buttons_bottom = widgets.buttons_bottom;
			
	switch(_key){		
		case "KEY_IRBACK":
		case "KEY_MENU":
			if(this.statusPlayer)
				this.home.setPlayerStatus("PLAY");
			
			this.home.closeSection(this);
	    break;
	    
	    case "KEY_LEFT":
			if(!recommendations.scrollPrev()){
				this.actualFocus = "exit_info";
				recommendations.setFocus(false);
	    		button_back.setFocus(true);
			}else{
				if(recommendations.maxItem > 5){
					if(recommendations.selectIndex == 0){					
						leftArrowRecommendations.setData({"url":"", "line":true, "position": "left"});
						leftArrowRecommendations.refresh();
					}	
					if(recommendations.selectIndex+1 <= (recommendations.maxItem-5)){
						rightArrowRecommendations.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
						rightArrowRecommendations.refresh();
					}
				}
    			
			}
			
	    break;
		
		case "KEY_RIGHT":			
			recommendations.scrollNext();

			if(recommendations.maxItem > 5){
				if(recommendations.selectIndex >= 5){
					leftArrowRecommendations.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					leftArrowRecommendations.refresh();
					}
				}
			if(recommendations.selectIndex == (recommendations.maxItem-1)){
				rightArrowRecommendations.setData({"url": "" ,"line":true, "position": "right"});
				rightArrowRecommendations.refresh();
			}				

		break;
 	
    	case "KEY_IRENTER":
    		var item = recommendations.selectItem.ItemVO;
    		var _section = recommendations.selectItem.ItemVO.link;
    		if(this.statusPlayer){
	    		this.parentP.stopPlayer(true);
	    	}
			_section.parameters.isRecom = true;
			this.home.openLink(_section);
    	break;
    	
    	case "KEY_UP":
   			this.actualFocus = "buttonsBottom";
    		recommendations.setFocus(false);

			if(buttons_bottom.list.length == 5){
				buttons_bottom.focusIndex = 5;
			}else{
	    		if(buttons_bottom.list.length < 5){

	    			if(buttons_bottom.list.length == 1){
	    				buttons_bottom.focusIndex = 1;
					}
					
					if(buttons_bottom.list.length == 2){
		    			if(recommendations.focusIndex <= 2){
		    				buttons_bottom.focusIndex = recommendations.focusIndex;	    			
		    			}else{
			    			buttons_bottom.focusIndex = 2;	    			
		    			}	
					}
	    			
	    			if(buttons_bottom.list.length == 3){
		    			if(recommendations.focusIndex <= 3){
		    				buttons_bottom.focusIndex = recommendations.focusIndex;	    			
		    			}else{
			    			buttons_bottom.focusIndex = 3;	    			
		    			}	
					}
	    			
					if(buttons_bottom.list.length == 4){
						if(recommendations.focusIndex == 5){
	    					buttons_bottom.focusIndex = recommendations.focusIndex-1;
						}else{
	    					buttons_bottom.focusIndex = recommendations.focusIndex;
	    				}
	    			}	    			
	    						    			
	    		}else{
		    		buttons_bottom.focusIndex = buttons_bottom.list.length;	
	    		}
			}
									
			buttons_bottom.setFocus(true);
    		buttons_bottom.animation.zIndex(3).start();
    		recommendations.animation.zIndex(2).start();
    	break;
	    
	}	

	return true;
}

programDetailB.prototype.onKeyPressSearch = function onKeyPressSearch(_key){	
	var widgets = this.widgets;	
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			//CÓDIGO PARA ACTIVAR LA SECCIÓN
			//HABILITAR FOCUS, REDRAWS, ETC
	   	    if(widgets.buttons_top.list.length > 0){//O sea que si hay botones en top
	   	    	this.actualFocus = "buttonsTop";
				widgets.buttons_top.setFocus(true);
	   	    }else{
	   	    	this.actualFocus = "buttonsBottom";
   				widgets.buttons_bottom.setFocus(true);
	   	    }
			
			this.home.disableSearchHeader();
			break;
		
		default:
			this.home.onKeyPress(_key);
		break;
	}
	return true
}



programDetailB.prototype.onKeyPressBackground = function onKeyPressBackground(_key){	
	var widgets = this.widgets;	
	switch(_key){
		
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
			this.show_Widgets();
		break;	
	
	}
	
	return true
}

programDetailB.prototype.onKeyPressExit = function onKeyPressExit(_key){	
	var widgets = this.widgets,
	buttons_bottom = widgets.buttons_bottom,
	buttons_top = widgets.buttons_top,
	button_back = widgets.button_back;
		
	switch(_key){
		
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
			if(this.statusPlayer){
				this.home.setPlayerStatus("PLAY");
			}
			if(tpng.app.twitter){
	    		this.home.tweetFeed();
	    	}
			this.home.closeSection(this);		
		break;	
		
		case "KEY_RIGHT":
    		this.actualFocus = "buttonsBottom";
    		button_back.setFocus(false);
    		
			buttons_bottom.setFocus(false);
			buttons_bottom.focusIndex = 1;
			buttons_bottom.setFocus(true);
    		buttons_bottom.animation.zIndex(3).start();

    	break;
		case "KEY_UP":
	    		if(buttons_top.list.length){
    			this.actualFocus  = "buttonsTop";
				button_back.setFocus(false);
				buttons_top.setFocus(true);
    		}else{
    			this.actualFocus = "search"; 
    			this.home.enableSearchHeader();
				button_back.setFocus(false);
    		}
		break;
	
	}
	
	return true
}

programDetailB.onFocusButtonsTop = function onFocusButtonsTop(_focus, _data){
   	var widgets = this.widgets;
	if(_focus){	
    	widgets.tooltipsSocialNetwork.setData({"position_x": _data.item.position_x, "text": _data.item.tooltip});
   		this.timerToShowButton = widgets.tooltipsSocialNetwork.stateChange.delay(500, widgets.tooltipsSocialNetwork, "enter");
	}else{
		unsetTimeAlarm(this.timerToShowButton);
		this.timerToShowButton = null;
		widgets.tooltipsSocialNetwork.stateChange("exit");
	}	
}

programDetailB.onFocusButtonsBottom = function onFocusButtonsBottom(_focus, _data){
   	var widgets = this.widgets;
	
	if(_focus){		
		if(this.actualFocus == "exit_info"){
        	widgets.buttons_bottom.setFocus(false);
        }
        
        if(this.actualFocus == "buttonsBottom"){
           	widgets.tooltip_button_back.stateChange("exit");
           	unsetTimeAlarm(this.timerFocusButtons);
        }
	}		
}

programDetailB.onFocusRecommendations = function onFocusRecommendations(_focus, _data){
   	var widgets = this.widgets;
	
	if(_focus){		
		if(this.actualFocus == "exit_info"){
        	widgets.recommendationsFullInfo.setFocus(false);    
        }
	}
	
		
}

programDetailB.onFocusButtonBack = function onFocusButtonBack(_focus, _data){
   	var widgets = this.widgets;
	if(_focus){		
		if(this.actualFocus == "exit_info"){
        	widgets.buttons_bottom.setFocus(false);    
        }
	    
	    this.timerFocusButtons = setTimeout(function (){
	   		widgets.tooltip_button_back.setData({"x": 0, "text": "REGRESAR"});
   			widgets.tooltip_button_back.stateChange("enter");
		}.bind(this), 500);
	}else{
		unsetTimeAlarm(this.timerFocusButtons);
		widgets.tooltip_button_back.stateChange("exit");
	}	
}

programDetailB.drawProgramFullInfo = function drawProgramFullInfo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
		
	// validacion para el color del backGround 
	var tActual = new Date().getTime();//time actual
	if(_data.startTime < tActual && _data.endTime > tActual){
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
	}else{
		custo.fill = "rgba(30,30,40,.7)";
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
	}

	if(_data.ChannelVO.isCtv) //TODO: VALIDAR LOS GRISES/ROSAS/AZULES
		tp_draw.getSingleton().drawImage("img/tv/AnytimetvBadgeONfullinfo.png", ctx, 0, 0);
	else if(_data.ChannelVO.isNpvr)
		tp_draw.getSingleton().drawImage("img/tv/AnytimetvBadgeOFFfullinfo.png", ctx, 0, 0);
	
	/*
	if(_data.profileLoked){
		tp_draw.getSingleton().drawImage("img/tv/programa_bloqueado.png", ctx, 1155, 0);
	}else{
		if(_data.tweetFeed){
			tp_draw.getSingleton().drawImage("img/tv/badge_tweetON.png", ctx,904,13);
		}
	}
	*/
	
	// tweet feed
	if(_data.tweetFeed){	
		var positionX_name = 215;
		tp_draw.getSingleton().drawImage("img/tv/badge_tweetON.png", ctx, 193, 68);
	}else{
		var positionX_name = 195;
	}

	// name	
	custo_f.text_align = "left,middle";
	custo_f.font_size = 34 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.name, new Rect(positionX_name, 10, 704, 100), custo_f);	
	
	//horario
	custo_f.text_align = "right,top";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	var horary = _data.startTime ? startTimeEndTime(_data.startTime, _data.endTime): "";
	//Canvas.drawText(ctx, horary, new Rect(912,4,175,20), custo_f);
			
	//barra progreso 
	var custoLine = { "fill": "rgba(121,121,121,1)" };
	Canvas.drawShape(ctx, "rect", new Rect(195,126,826,4), custoLine);
	var percentX = percent(_data.startTime, _data.endTime, 826);

	if(_data.startTime < tActual && _data.endTime > tActual){
		var custoLinePorcent = { "fill": "rgba(24,166,196,.7)" };
		Canvas.drawShape(ctx, "rect", new Rect(195,126,percentX,4),custoLinePorcent);
		Canvas.drawShape(ctx, "rect", [percentX+195,126,1,4],{"fill" : "rgba(240, 240, 250, 1)"});
		
		//tiempo restante
		custo_f.text_align = "left,middle";
		custo_f.fill = "rgba(0,190,230,1)";
		//var timeL = _data.startTime ? timeLeft(data.startTime, _data.endTime): "";
		//Canvas.drawText(ctx, timeL, new Rect(912,25,175,20), custo_f);
		Canvas.drawText(ctx, horary, new Rect(1053,116,175,20), custo_f);	
		tp_draw.getSingleton().drawImage("img/tv/miniguia.png", ctx, 1030, 110);			
	}else{
	
		// main fill pasado & futuro
		if(_data.isCtvRecorded || _data.isNpvrRecorded){
			var custoLinePorcent = { "fill": "rgba(200, 0, 100, 1)" };	
			Canvas.drawShape(ctx, "rect", new Rect(195,126,826,4),custoLinePorcent);	
			custo_f.fill = "rgba(190,50,120,1)";
			custo_f.text_align = "left,top";
			//Canvas.drawText(ctx, dateToText(_data.startTime), new Rect(955,40,150,25), custo_f);			
			Canvas.drawText(ctx, horary, new Rect(1053,116,175,20), custo_f);	
			tp_draw.getSingleton().drawImage("img/tv/miniguiaANYTIMETV.png", ctx, 1030, 110);			

		}else if(!_data.isCtvRecorded || !_data.isNpvrRecorded){
			var custoLine = { "fill": "rgba(121,121,121,1)" };
			Canvas.drawShape(ctx, "rect", new Rect(195,126,826,4),custoLine);
			custo_f.fill = "rgba(170, 170, 180, 1)";			
			custo_f.text_align = "left,top";
			//Canvas.drawText(ctx, dateToText(_data.startTime), new Rect(955,40,150,25), custo_f);
			Canvas.drawText(ctx, horary, new Rect(1053,116,175,20), custo_f);	
			tp_draw.getSingleton().drawImage("img/tv/miniguiaFUTURO.png", ctx, 1030, 110);
		}	
	}

	custo_f.text_align = "left,top";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	custo_f.fill = "rgba(255,255,255,1)";
	
	// logo canal
	tp_draw.getSingleton().drawImage(_data.ChannelVO.images.url1X1, ctx, 112, 42);

	// descripcion
	Canvas.drawText(ctx, _data.description, new Rect(195, 256, 890, 70), custo_f);
	
		
	// recomendaciones
	custo_f.text_align = "right,middle";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx,"Otros también vieron:" , new Rect(64, 488, 122, 68), custo_f);

	//
	custo_f.text_align = "left,top";
	custo_f.fill = "rgba(170,170,170,1)";
	custo_f.font_size = 20 * tpng.thema.text_proportion;

	if(_data.rating)
		tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.rating.value+".png", ctx, 195, 159);
	else
		tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.parentalRating+".png", ctx, 195, 159);

	custo_f.text_align = "left,bottom";		
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, getProgramInfoStr(_data), new Rect(245,148,704,32), custo_f);

	// numero canal
	custo_f.text_align = "center,bottom";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	custo_f.font_family = "Oxygen-Bold";
	Canvas.drawText(ctx, _data.ChannelVO.number+"", new Rect(112, 80, 70, 32), custo_f);

	
	//var custoLine = {fill: "rgba(90, 90, 90, 1)"};
	//Canvas.drawShape(ctx, "rect", [188, 435, 1, 106], custoLine);
	
	ctx.drawObject(ctx.endObject());	
}

// draw -> recomendaciones left y right

/*
programDetailB.prototype.showButtonsBar = function showButtonsBar(firstButtonBar, firstButtonBarDelay, secondButtonBar, secondButtonBarDelay, thirdButtonBar, thirdButtonBarDelay, fourButtonBar, fourButtonBarDelay, fiveButtonBar, fiveButtonBarDelay, sixButtonBar, sixButtonBarDelay, sevenButtonBar, sevenButtonBarDelay){
	if (firstButtonBar){
		var buttonsEnter = function(){firstButtonBar.stateChange("enter");}; 
		firstButtonBar.buttonsEnterTimer = buttonsEnter.delay(firstButtonBarDelay, null);
		this.showButtonsBar(secondButtonBar, secondButtonBarDelay, thirdButtonBar, thirdButtonBarDelay, fourButtonBar, fourButtonBarDelay, fiveButtonBar, fiveButtonBarDelay, sixButtonBar, sixButtonBarDelay, sevenButtonBar, sevenButtonBarDelay);	
	}else{
		return;
	}	
};
*/


drawBackX = function drawBackX(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	tp_draw.getSingleton().drawImage("img/tools/DevsOnion.png", ctx, 0, 0); //tmp el w y h	
	ctx.drawObject(ctx.endObject());	
}

programDetailB.drawLineTop = function drawLineTop(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
	var custoW = {fill: "rgba(220, 220, 230, 1)"};
	Canvas.drawShape(ctx, "rect", [12,0,1,ctx.viewportHeight], custoW);
	
	switch(_data.position){
		case 1:
			Canvas.drawShape(ctx, "rect", [147,0,1,ctx.viewportHeight], custoW);	
		break;
		case 2:
			Canvas.drawShape(ctx, "rect", [275,0,1,ctx.viewportHeight], custoW);
		break;
		case 3:
			Canvas.drawShape(ctx, "rect", [403,0,1,ctx.viewportHeight], custoW);
		break;
		case 4:
			Canvas.drawShape(ctx, "rect", [531,0,1,ctx.viewportHeight], custoW);
		break;	
		case 5:
			Canvas.drawShape(ctx, "rect", [659,0,1,ctx.viewportHeight], custoW);
		break;
		case 6:
			Canvas.drawShape(ctx, "rect", [787,0,1,ctx.viewportHeight], custoW);
		break;
		case 7:
			Canvas.drawShape(ctx, "rect", [915,0,1,ctx.viewportHeight], custoW);
		break;
		case 8:
			Canvas.drawShape(ctx, "rect", [1043,0,1,ctx.viewportHeight], custoW);
		break;								
	}
	
//	tp_draw.getSingleton().drawImage("img/tv/arrowLeftOn.png", ctx, 0, 18);
	ctx.drawObject(ctx.endObject());	
}


programDetailB.drawExitsections = function drawExitsections(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     

	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
	//	custo_f.fill = "rgba(30, 30, 40, 1)";
	//	custo_f.font_size = 15 * tpng.thema.text_proportion;

	custo_f.font_size = 15 * tpng.thema.text_proportion;
	Canvas.drawText(ctx,"Presiona OK para salir", new Rect(0,5,ctx.viewportWidth,20), custo_f);
	tp_draw.getSingleton().drawImage("img/help/4x2-oksalir.png", ctx, 0, 0);

    ctx.drawObject(ctx.endObject());
}

