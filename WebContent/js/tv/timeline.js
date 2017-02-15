
function timeline(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	
   	clearTimeout(this.timeInfoSpeed);
	clearTimeout(this.timeUpdateProgram);
}

timeline.inherits(FormWidget);

timeline.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	var widgets = this.widgets;

	
	widgets.bgDate.setData({"focus":false});
	var data = [{"ProgramVO":{"name":"Cargando..."}},{"ProgramVO":{"name":"Cargando..."}},{"ProgramVO":{"name":"Cargando..."}},{"ProgramVO":{"name":"Cargando..."}},{"ProgramVO":{"name":"Cargando..."}}];
	
	widgets.arrowTimeline.setData({"left": true, "right":true});
	widgets.arrowDate.setData({"left": true, "right":true, "focus": false});
	
	widgets.programList.setData(data,2);

	this.client.lock();
		this.home.showHeader();
		widgets.bgDate.stateChange("enter");
		widgets.programList.stateChange("enter");
		widgets.arrowDate.stateChange("enter");
		widgets.arrowTimeline.stateChange("enter");
	this.client.unlock();
	this.lock = false; //bloquea la funcion down cuando se cambia la fecha hasta que se carguen completamente los datos
	this.enter = true; //funciona para saber si es la primera vez que se entra al timeline y no resintonice
	
	//widgets.malla.setData();
	//widgets.malla.stateChange("exit");
	
	
	
	var indexDate = 7;
	if(tpng.app.sections[0].params.fromTimeline){
		indexDate = tpng.app.sections[0].params.datePos;
	}
	widgets.dateList.setData(this.createDateList(), indexDate);
	
	var indexChannel = this.home.findChannelIndex(tpng.app.currentChannel.number, tpng.app.channels);
	widgets.channelList.setData(tpng.app.channels, indexChannel);
	widgets.channelList.stateChange("enter");
	
	this.actualForm = "init";

	
}

timeline.prototype.onExit = function onExit(_data){
	this.widgets.stateChange("exit");
	this.home.hideHeader();
	this.home.hideMoreInfo();
	clearTimeout(this.timeUpdateProgram);
	clearTimeout(this.timerExit);
	clearTimeout(this.timeUpdateProgram);
	
	clearTimeout(this.timerArrow);
	clearTimeout(this.timeScroll);
}

timeline.prototype.responseGetChannelProgram = function responseGetChannelProgram(response){
	if(response.status == 200){
		var widgets = this.widgets;
		
		this.client.lock();
		if(this.actualForm == "init"){
			var indexTimeline = response.data.ResponseVO.actualIndex;
			
			if(indexTimeline < 0){
				indexTimeline = 0;
				this.widgets.arrowTimeline.data.left = false;
				this.widgets.arrowTimeline.refresh();
			}
			if(tpng.app.sections[0].params.fromTimeline){
				indexTimeline = tpng.app.sections[0].params.timelinePos;
			}
			
			var programation = response.data.ResponseVO.programs;
			if(programation.length <= 0){
				programation = [{"ProgramVO":{"name":"Programación no disponible"}}];
			}
			widgets.programList.setData(programation, indexTimeline);
			widgets.programList.stateChange("enter");
			
			/*clearTimeout(this.timerArrow);
			this.timerArrow =
				setTimeout(function(){
					widgets.arrowTimeline.stateChange("enter");
				}.bind(this), 100);*/
		}else{
			var indexTimeline = response.data.ResponseVO.actualIndex;
			if(indexTimeline < 0){
				if(this.widgets.dateList.selectIndex == 14){
					indexTimeline = response.data.ResponseVO.programs.length-1;
				}else{
					indexTimeline = 0;
				}
				
				this.widgets.arrowTimeline.data.left = false;
				this.widgets.arrowTimeline.refresh();
			}
			
			
			if(this.actualForm == "timeline"){
				widgets.programList.options.nofirstfocus = false;
				widgets.dateList.options.nofirstfocus = true;
			}else if(this.actualForm == "date"){
				widgets.programList.options.nofirstfocus = true;
				widgets.dateList.options.nofirstfocus = false;
			}
			
			var programation = response.data.ResponseVO.programs;
			if(programation.length <= 0){
				programation = [{"ProgramVO":{"name":"Programación no disponible"}}];
			}
			
			
			widgets.programList.animatedSetData(programation,"exit", "enter", indexTimeline);
			/*clearTimeout(this.timerArrow);
			this.timerArrow =
				setTimeout(function(){
					widgets.arrowTimeline.stateChange("enter");
				}.bind(this), 100);*/
		}
		widgets.arrowTimeline.stateChange("enter");
		widgets.bgDate.stateChange("enter");
		widgets.dateList.stateChange("enter");
		widgets.arrowDate.stateChange("enter");
		widgets.channelList.stateChange("enter");
		this.client.unlock();
		
		
		
		this.lock = false;
		if(this.actualForm == "init"){
			this.actualForm = "timeline";
			widgets.programList.setFocus(true);
		}
		
		
		this.activeTimeout();
		
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
	
}
timeline.prototype.responseRecording =  function responseRecording(responseCode){
	
	if(responseCode.status == 200){
		var buttons_bottom =  this.home.widgets.buttons_bottom;
		if(buttons_bottom.selectItem.label == "Grabar"){
			//this.home.openSection.bind(this, "message", {"home":this, "title": this.home.widgets.programInfo.data.name, "active": true}, true).delay(2000);
			this.home.openSection("message", {"home":this.home, "title": this.home.widgets.programInfo.data.name, "active": true}, false, null, true);
	 		buttons_bottom.selectItem.label = "Dejar de grabar";
		 }else{
		 	//this.home.openSection.bind(this, "message", {"home":this, "title": this.home.widgets.programInfo.data.name, "active": false}, true).delay(2000);
		 	this.home.openSection("message", {"home":this.home, "title": this.home.widgets.programInfo.data.name, "active": false}, false, null, true);
		 	buttons_bottom.selectItem.label = "Grabar";
		 }
		 	buttons_bottom.redraw();
		
		var _data = this.widgets.programList.selectItem.ProgramVO; 
			_data.isNpvrChecked = responseCode.data.ResultVO.status == 1 ? true : false;
			this.widgets.programList.redraw(true); 	
	}else{
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

timeline.prototype.responseReminder =  function responseReminder(responseCode){
	
	if(responseCode.status == 200){
		var buttons_bottom =  this.home.widgets.buttons_bottom;

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
		
		var _data = this.widgets.programList.selectItem.ProgramVO; 
			_data.hasReminder = responseCode.data.ResponseVO.status == 0 ? true : false;
			this.widgets.programList.redraw(true); 	
				 	
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}


timeline.prototype.responseUpdateChannels = function responseUpdateChannels(responseCode){

	if(responseCode.status == 200){
	
		var buttons_bottom =  this.home.widgets.buttons_bottom;

		if(buttons_bottom.selectItem.label == "Bloquear Canal"){
	 		buttons_bottom.selectItem.label = "Desbloquear Canal";
		 }else{
		 	buttons_bottom.selectItem.label = "Bloquear Canal";
		 }
		 	buttons_bottom.redraw();
		 	
	 	var _data = this.widgets.programList.selectItem.ProgramVO; 
		_data.profileLoked = responseCode.data.ResultVO.status == 0 ? true : false;
		this.widgets.programList.redraw(true); 	
		 
		this.home.hideHeader();
		this.home.hideMoreInfo();
		this.home.updateChannelList();
		this.home.closeSection(this);
		
	}else{	
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);					
	}
}
timeline.prototype.onKeyPress = function onKeyPress(_key){
	var widgets = this.widgets;
	
	switch(this.actualForm){
		case "timeline":
			this.onKeyPressTimeline(_key);
			break;
		case "searchB":
		case "search":
			this.onKeyPressSearch(_key);
			break;
		case "date":
			this.onKeyPressDate(_key);
			break;
		case "buttons":
			this.onKeyPressButtons(_key);
			break;
		case "buttons_Top":
			this.onKeyPress_Buttons_Top(_key);
		break;
		case "buttons_Bottom":
			this.onKeyPress_Buttons_Bottom(_key);
			break;
		case "moreInfoRecommendations":
			this.onKeyPressMoreInfo_Recommendations(_key); 
			break;
		case "numbers":
			this.onKeyPressNumbers(_key);
			break;
		case "exit_info":
			this.onKeyPressExit_Info(_key);
			break;
	}
	return true;
}

timeline.prototype.onKeyPressTimeline = function onKeyPressTimeline(_key){
	this.activeTimeout();
	
	var widgets = this.widgets;
	var programList = this.widgets.programList;
	var dateList = this.widgets.dateList;
	
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.hideHeader();
			this.home.closeSection(this);
			break;
		case "KEY_TV_CHNL_UP_LONG":
		case "KEY_TV_CHNL_UP":
			if(widgets.channelList.scrollNext()){
				clearTimeout(this.timer);
				clearTimeout(this.timeUpdateProgram);
				this.widgets.programList.stateChange("opaque");
				this.widgets.arrowTimeline.stateChange("opaque");
			}
			break;
		case "KEY_TV_CHNL_DOWN_LONG":
		case "KEY_TV_CHNL_DOWN":
			if(widgets.channelList.scrollPrev()){
			clearTimeout(this.timer);
				clearTimeout(this.timeUpdateProgram);
				this.widgets.programList.stateChange("opaque");
				this.widgets.arrowTimeline.stateChange("opaque");
				
			}
			break;
		case "KEY_LEFT":
			if(widgets.programList.stateGet() != "opaque"){
				widgets.programList.scrollPrev();
				
				var tsItemSelected = dateList.list[dateList.selectIndex].ts;
				
				var endDay = new Date(tsItemSelected);
				endDay.setHours(0);
				endDay.setMinutes(0);
				endDay.setSeconds(1);
				var startTime = new Date(programList.selectItem.ProgramVO.startTime);
				var endTime = new Date(programList.selectItem.ProgramVO.endTime);
				
				if(endDay.getTime() > startTime.getTime() || endDay.getTime() > endTime.getTime()){
					dateList.scrollPrev();
					
					clearTimeout(this.timeScroll);
					this.timeScroll =
						setTimeout(function(){
							dateList.setFocus(false);
						}.bind(this), 301);
					
				}
				dateList.setFocus(false);
			}
			break;
		case "KEY_RIGHT":
			if(widgets.programList.stateGet() != "opaque"){
				widgets.programList.scrollNext();
				
				tsItemSelected = dateList.list[dateList.selectIndex].ts;
				
				var endDay = new Date(tsItemSelected);
				endDay.setHours(23);
				endDay.setMinutes(59);
				endDay.setSeconds(59);
				var startTime = new Date(programList.selectItem.ProgramVO.startTime);
				var endTime = new Date(programList.selectItem.ProgramVO.endTime);
							
				if(endDay.getTime() < startTime.getTime() || endDay.getTime() < endTime.getTime()){
					dateList.scrollNext();
					clearTimeout(this.timeScroll);
					this.timeScroll =
						setTimeout(function(){
							dateList.setFocus(false);
						}.bind(this), 301);
				}
				dateList.setFocus(false);
			}
			break;
		case "KEY_UP":
			this.actualForm = "date";
			widgets.programList.setFocus(false);
			this.client.lock(); 
			widgets.bgDate.data.focus = true;
			widgets.bgDate.refresh();
			widgets.arrowDate.data.focus = true;
			widgets.arrowDate.refresh();
			widgets.dateList.setFocus(true);		
			this.client.unlock(); 
			
			break;
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
    			this.setNumber(_key.substr(_key.length-1,1));
		break;
    	case "KEY_IRENTER":
    		this.widgets.arrowTimeline.stateChange("exit");
    		if(this.widgets.programList.stateGet() != "opaque" && this.widgets.programList.stateGet() != "exit"){
    			clearTimeout(this.timerExit);
	    		var _program = widgets.programList.selectItem.ProgramVO,
				channel = widgets.channelList.selectItem.ChannelVO;
				
				if(_program){
				
					_program.ChannelVO = {
						"images":channel.images,
		              	"number":channel.number,
		              	"name":channel.name,
		              	"isCtv":channel.isCtv,
		             	"isNpvr":channel.isNpvr,
		             	"type":channel.type
		             }
		             _program.rating = {"value":_program.parentalRating}
		             _program.draw="more";
		            
		            //Limpiamos el actualForm para evitar que le den clin hasta que la animación termine.
		            this.actualForm = "";
					this.home.showMoreInfo(_program, null, this.onKeyPressRecover.bind(this));			
					this.widgets.stateChange("exit");
				}
    		}
    		
		break;
	}
}
timeline.prototype.onKeyPressRecover = function onKeyPressRecover(){
	this.onKeyPressRecoverDelay.bind(this).delay(1000);
}
timeline.prototype.onKeyPressRecoverDelay = function onKeyPressRecoverDelay(){
	this.actualForm = "buttons_Bottom";
}

// onkeypress timeline
timeline.prototype.onKeyPress_Buttons_Top = function onKeyPress_Buttons_Top(_key){
	var w = this.home.widgets,
		buttons_top = w.buttons_top,
		buttons_bottom = w.buttons_bottom,
		recommendations = w.recommendations,
		_program = w.programInfo.data,
		widgets = this.widgets;
	
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
				if(this.home.widgets.buttons_bottom.stateGet() == "enter" && 
					this.home.widgets.buttons_top.stateGet() == "enter" &&
					this.home.widgets.recommendations.stateGet() == "enter"){
					this.home.hideMoreInfo();
					this.showTimeline();
					this.activeTimeout();
					this.actualForm = "timeline";
				}
			break;
		case "KEY_LEFT":
			if(buttons_top.scrollPrev()){
			}else{
				if(recommendations.maxItem>0){
					buttons_top.setFocus(false);
					this.actualForm = "moreInfoRecommendations";
					tpng.app.section = "moreInfoRecommendations";
					recommendations.setFocus(true);		
				}
			}
    	break;
     	case "KEY_RIGHT":
    		buttons_top.scrollNext();
    	break;
     	case "KEY_UP":
     		this.home.enableSearchHeader();
     		buttons_top.setFocus(false);
    		this.actualForm = "searchB";
    	break;
    	case "KEY_DOWN":
    		buttons_bottom.setFocus(true);
    		buttons_bottom.scrollTo(buttons_top.selectIndex);
    		buttons_top.setFocus(false);
    		this.actualForm = "buttons_Bottom";
    	break;
		case "KEY_IRENTER":
			//switch(buttons_top.selectItem.action){
				
				
			//}
		break;
	}
}
timeline.prototype.onKeyPress_Buttons_Bottom = function onKeyPress_Buttons_Bottom(_key){

	var w = this.home.widgets,
		buttons_top = w.buttons_top,
		buttons_bottom = w.buttons_bottom,
		_program = w.programInfo.data,
		recommendations = w.recommendations,
		widgets = this.widgets;
	switch(_key){	
    	case "KEY_LEFT":
			if(buttons_bottom.scrollPrev()){
			}else{
				this.actualForm = "exit_info";
		    	this.home.widgets.button_back.setFocus(true);
	    		buttons_bottom.setFocus(true);	
	    		buttons_bottom.setFocus(false);	
			}
    	break;
     	case "KEY_RIGHT":
    		buttons_bottom.scrollNext();
    	break;	
    	case "KEY_UP":
			buttons_bottom.setFocus(false);
    		if(buttons_top.list.length > 0){//O sea que si hay botones en top
	    		this.actualForm = "buttons_Top";
    			buttons_top.setFocus(true);
    		}else{//No hay botones en top, se salta a header
     			this.home.enableSearchHeader();
     			buttons_bottom.setFocus(false);
    			this.actualForm = "searchB";
    			this.home.enableHeaderHome();
    		}	    		
    	break;
    	case "KEY_MENU":
	    case "KEY_IRBACK":
	    	this.home.hideMoreInfo();
	    	this.activeTimeout();
	    	this.showTimeline();
			this.actualForm = "timeline";
	    break;
	    case "KEY_IRENTER":
	    	
			switch(buttons_bottom.selectItem.action){
				case "LOCKCHANNEL":
					this.home.openSection("unlockProgram",{"home":this.home, "channel": {"number":_program.channelNumber}, "program": _program, "section": "timeline", "blockChannel": true},false, null, false);
					break;
				case "HELP":
					tpng.app.sections[0].params.datePos = widgets.dateList.selectIndex;
					tpng.app.sections[0].params.timelinePos = widgets.programList.selectIndex;
					//tpng.app.sections[0].params.fromTimeline = true;
					this.home.hideMoreInfo();
					this.home.openSection("help",{"home":this.home},true, ,false);				
				break;
				case "SEARCH":
					this.home.hideMoreInfo();
					tpng.app.sections[0].params.datePos = widgets.dateList.selectIndex;
					tpng.app.sections[0].params.timelinePos = widgets.programList.selectIndex;
					//tpng.app.sections[0].params.fromTimeline = true;
					this.nameProgram = replaceAll(_program.name, " ", "@");
					this.home.openSection("search",{"home":this.home, "pattern": this.nameProgram, "related":true , "channel": _program.ChannelVO.number, "epgId":_program.id },true, ,false);
				break;
				case "PLAY":
					this.home.hideMoreInfo();
					this.home.hideHeader();
					this.home.openSection("anytimePlayer",{"home":this.home, "program": _program},false);
				break;
				case "START_OVER":
					this.home.hideHeader();
					this.home.hideMoreInfo(); 
					this.home.openSection("startOverPlayer",{"home":this.home, "program": _program},false);  
				break;
				case "BACK":
					/*if(this.home.widgets.buttons_bottom.stateGet() == "enter" && 
					this.home.widgets.buttons_top.stateGet() == "enter" &&
					this.home.widgets.recommendations.stateGet() == "enter"){
					*/
						this.home.hideMoreInfo();  
						this.showTimeline();
						this.activeTimeout();
						this.actualForm = "timeline";
					/*}*/
					break;
				case "AUDIOS":
					this.home.changeAudio();
				break;
				case "SUB":
					this.home.changeSubtitle();
				break;
				case "INFO":
					/*if(this.home.widgets.buttons_bottom.stateGet() == "enter" && 
						this.home.widgets.buttons_top.stateGet() == "enter" &&
						this.home.widgets.recommendations.stateGet() == "enter"){
						*/
						this.home.hideMoreInfo();
						tpng.app.sections[0].params.datePos = widgets.dateList.selectIndex;
						tpng.app.sections[0].params.timelinePos = widgets.programList.selectIndex;
						//tpng.app.sections[0].params.fromTimeline = true;
						
						this.home.openSection("programDetail",{"home":this.home, "program": _program},false);
					/*}*/
				
				break;
				case "REMINDER":
				 	var params = ["idEpg="+_program.id];
					getServices.getSingleton().call("EPG_REMINDER", params, this.responseReminder.bind(this));
					break;
					
				case "RECORDING":
					// aqui va el codigo para que se abra el mensaje creado
					getServices.getSingleton().call("EPG_RECORDING_NPVR", ["epgId="+_program.id],  this.responseRecording.bind(this));		
				break;
	    		default:			
    				this.home.hideMoreInfo();    	
					this.home.openLink(buttons_bottom.selectItem.ItemVO.link,null,4);				
	    		break;				
			}
		break;
    }
}

timeline.prototype.onKeyPressExit_Info = function onKeyPressExit_Info(_key){	
	var widgets = this.home.widgets,
	buttons_bottom = widgets.buttons_bottom,
	buttons_top = widgets.buttons_top;		
	
	switch(_key){
		
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
	   		this.home.hideMoreInfo();  
			this.showTimeline();
			this.activeTimeout();
			this.actualForm = "timeline"; 
		break;	
		
		case "KEY_RIGHT":
    		this.actualForm = "buttons_Bottom";
	    	this.home.widgets.button_back.setFocus(false);
    		buttons_bottom.setFocus(true);	
		break;
	
		case "KEY_UP":
			buttons_bottom.setFocus(false);
	    	this.home.widgets.button_back.setFocus(false);			
    		if(buttons_top.list.length > 0){//O sea que si hay botones en top
	    		this.actualForm = "buttons_Top";
    			buttons_top.setFocus(true);
    		}else{//No hay botones en top, se salta a header
    			this.home.enableSearchHeader();
     			buttons_bottom.setFocus(false);
    			this.actualForm = "searchB";
    			this.home.enableHeaderHome();
    			
    		}
		break;

	}
	
	return true;
}



timeline.prototype.onKeyPressMoreInfo_Recommendations = function onKeyPressMoreInfo_Recommendations(_key){
	var w = this.home.widgets,
		buttons_top = w.buttons_top,
		buttons_bottom = w.buttons_bottom,
		recommendations = w.recommendations;
		
	switch(_key){
    	case "KEY_RIGHT":
    		tpng.app.section = "";
			buttons_top.setFocus(true);
			this.actualForm = "buttons_Top";
			recommendations.setFocus(false);
    	break;
    	case "KEY_MENU":
	    case "KEY_IRBACK":
	    	this.home.hideMoreInfo();
	    	this.activeTimeout();
	    	this.showTimeline();
			this.actualForm = "timeline";
	    break;
	    case "KEY_IRENTER":
	    	var section = recommendations.selectItem.ItemVO.link;
	    	if(section){
	    		
	    		tpng.app.sections[0].params.datePos = this.widgets.dateList.selectIndex;
				tpng.app.sections[0].params.timelinePos = this.widgets.programList.selectIndex;
				//tpng.app.sections[0].params.fromTimeline = true;
   				this.home.hideMoreInfo();
    			//this.home.getDataRecommendations(section,"recomendations");
    			this.home.openLink(section,null,4);
    			
    			//this.home.openSection(section.ref,{"home":this.home, "parameters": section.parameters},true);
	    	}
	    break;
    }
}
// onkeypress timeline


timeline.prototype.onKeyPressDate = function onKeyPressDate(_key){
	this.activeTimeout();
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.hideHeader();
			this.home.closeSection(this);
			break;
		case "KEY_TV_CHNL_UP_LONG":
		case "KEY_TV_CHNL_UP":
			
			if(widgets.channelList.scrollNext()){
				clearTimeout(this.timeUpdateProgram);
				this.widgets.programList.stateChange("opaque");
				this.widgets.arrowTimeline.stateChange("opaque");
			}
			break;
		case "KEY_TV_CHNL_DOWN_LONG":
		case "KEY_TV_CHNL_DOWN":
		
			if(widgets.channelList.scrollPrev()){
				clearTimeout(this.timeUpdateProgram);
				this.widgets.programList.stateChange("opaque");
				this.widgets.arrowTimeline.stateChange("opaque");
			}
			break;
		case "KEY_LEFT":
			if(widgets.dateList.scrollPrev()){
				widgets.programList.stateChange("opaque");
				widgets.arrowTimeline.stateChange("opaque");
				
				this.lock = true;
				clearTimeout(this.timeInfoSpeed);
				this.timeInfoSpeed =
					setTimeout(function(){
					
					var ts = new Date(widgets.dateList.selectItem.ts);
					var hr = new Date(widgets.programList.list[widgets.programList.selectIndex].ProgramVO.startTime);
					
					
					ts.setHours(hr.getHours());
					ts.setMinutes(hr.getMinutes());
					ts.setSeconds(hr.getSeconds());
					
					var c = widgets.channelList.list[widgets.channelList.selectIndex].ChannelVO;
					var params = ["channel="+ c.number , "daysMinus=-7", "daysMore=7", "ts="+ts.getTime(), "lchId=" + c.lchId];
					getServices.getSingleton().call("EPG_GET_CHANNEL_PROGRAM", params,  this.responseGetChannelProgram.bind(this));}.bind(this), 1000);
			}
			break;
		case "KEY_RIGHT":
			if(widgets.dateList.scrollNext()){
				widgets.programList.stateChange("opaque");
				widgets.arrowTimeline.stateChange("opaque");
				
				this.lock = true;
				clearTimeout(this.timeInfoSpeed);
				this.timeInfoSpeed =
					setTimeout(function(){
						var ts = new Date(widgets.dateList.selectItem.ts);
						var hr = new Date(widgets.programList.list[widgets.programList.selectIndex].ProgramVO.startTime);
						
						ts.setHours(hr.getHours());
						ts.setMinutes(hr.getMinutes());
						ts.setSeconds(hr.getSeconds());
					
						var c = widgets.channelList.list[widgets.channelList.selectIndex].ChannelVO;
						var params = ["channel=" + c.number , "daysMinus=-7", "daysMore=7", "ts="+ts.getTime(), "lchId=" + c.lchId];
						getServices.getSingleton().call("EPG_GET_CHANNEL_PROGRAM", params,  this.responseGetChannelProgram.bind(this));
					}.bind(this), 1000);
			}
			break;
		case "KEY_DOWN":
				if(widgets.programList.stateGet() == "enter"){
					this.actualForm = "timeline";
					this.client.lock();
					widgets.programList.setFocus(true);
					widgets.bgDate.data.focus = false;
					widgets.bgDate.refresh();
					widgets.arrowDate.data.focus = false;
					widgets.arrowDate.refresh();
					widgets.dateList.setFocus(false);
					this.client.unlock();
						
				}
			break;
		case "KEY_UP":
			this.home.enableSearchHeader();
			clearTimeout(this.timerExit);
			this.client.lock();
				widgets.bgDate.data.focus = false;
				widgets.bgDate.refresh();
				widgets.arrowDate.data.focus = false;
				widgets.arrowDate.refresh();
				widgets.dateList.setFocus(false);
			this.client.unlock();
			
			
			this.actualForm = "search";
			break;
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
    			this.setNumber(_key.substr(_key.length-1,1));
		break;
	}
	return true;
}

timeline.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	//clearTimeout(this.timerExit);
	//this.timerExit = setTimeout(function(){this.home.closeSection(this);this.home.hideHeader();}.bind(this), 20000);
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			if(this.actualForm == "search"){
				this.home.disableSearchHeader();
				this.client.lock(); 
					widgets.bgDate.data.focus = true;
					widgets.bgDate.refresh();
					widgets.arrowDate.data.focus = true;
					widgets.arrowDate.refresh();
					widgets.dateList.setFocus(true);		
				this.client.unlock();
				this.activeTimeout();
				this.actualForm = "date";
			}else if(this.actualForm == "searchB"){
				if(this.home.widgets.buttons_top.list.length > 0){
					this.actualForm = "buttons_Top";
					this.home.widgets.buttons_top.setFocus(true);
				}else{
		    		this.actualForm = "buttons_Bottom";				
					this.home.widgets.buttons_bottom.setFocus(true);
	    			this.home.disableHeaderHome();
					
				}
		    		this.home.disableSearchHeader();				
			}
			
			break;
		default:
			this.home.onKeyPress(_key);
			break;
	}
}


timeline.prototype.activeControls = function activeControls(_state){
	this.actualForm = _state;
}



timeline.prototype.activeTimeout = function activeTimeout(){
	clearTimeout(this.timerExit);
	this.timerExit = setTimeout(function(){this.home.disableSearchHeader();this.home.hideMoreInfo();this.home.hideHeader();this.home.closeSection(this);}.bind(this), 20000);
		
}


timeline.prototype.showTimeline = function showTimeline(){
	var widgets = this.widgets;
	widgets.bgDate.stateChange("enter");
	widgets.arrowTimeline.stateChange("enter");
	widgets.arrowDate.stateChange("enter");
	widgets.channelList.stateChange("enter");
	widgets.programList.stateChange("enter");
	widgets.dateList.stateChange("enter");
}

timeline.prototype.onKeyPressNumbers = function onKeyPressNumbers(_key){	
//Este onkeypress es un fix para evitar que cuando este presionando numeros y de ok antes de que cargue la guía se encime todo.
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
				var number = _key.substr(_key.length-1,1);
    			this.setNumber(number);
		break;	
	}
	return true;
}


timeline.prototype.setNumber = function setNumber(_num){	

	var widgets = this.widgets;
	this.tpmActualForm = this.tpmActualForm == null ? this.actualForm : this.tpmActualForm;
	this.actualForm = "numbers";
	tpng.app.channelNumber = tpng.app.channelNumber + _num;
	var numberChannel = tpng.app.channelNumber.substring(0,3); // se agrego para limitar el numero que se digita
	
	if(tpng.app.channelNumber.length <= 3){
		this.showChannelBar(tpng.app.channelNumber);	
		var index = this.home.findChannelIndex(numberChannel,widgets.channelList.list);		
		var timer = tpng.app.channelNumber.length < 3 ? 1500 : 1000;

		clearTimeout(this.timer);	
		this.timer = setTimeout(function(){
			this.actualForm = "";		
			if(widgets.programList.stateGet() == "enter"){
				this.showTimeLine(index);
			}else{
				this.showTimeLine(index);	
			}

			tpng.app.channelNumber ="";			
		}.bind(this), timer);
		
	}
}

timeline.prototype.showTimeLine = function showTimeLine(_index){
	var widgets = this.widgets;
	clearTimeout(this.timer);

	this.client.lock();
	widgets.channelNumberBar.stateChange("exit");
	this.client.unlock();	
	
	this.actualForm = "timeline";
	widgets.programList.stateChange("opaque");
	widgets.arrowTimeline.stateChange("opaque");
	//this.actualForm = this.tpmActualForm;
	widgets.channelList.setData(widgets.channelList.list,_index);
	widgets.channelList.stateChange("enter");
	this.showTimeLineDelay.bind(this).delay(1700);
}

timeline.prototype.showTimeLineDelay = function showTimeLineDelay(){
	NGM.trace("dando el delay: " + this.tpmActualForm);
	this.actualForm = this.tpmActualForm;
	this.tpmActualForm = null;

}


	

timeline.prototype.showChannelBar = function showChannelBar(_num){
	var w = this.widgets.channelNumberBar;
		w.setData({"number": _num});
		w.stateChange("enter");
		w.refresh();
}


timeline.drawBgDate = function drawBgDate(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		var custoTxt;
		
		
		
		var custoTxt = _data.focus ? this.themaData.whitePanel : this.themaData.darkBlackPanel;
		Canvas.drawShape(ctx, "rect", [186, 0, 192, ctx.viewportHeight],custoTxt);
		Canvas.drawShape(ctx, "rect",[0, 0, 378, ctx.viewportHeight], this.themaData.whiteStrokePanelTimeline);
		
		var custoT = JSON.stringify(this.themaData.standarBlackFont);
		custoT = JSON.parse(custoT);
		custoT.font_size = 18 * tpng.thema.text_proportion;
		
		tp_draw.getSingleton().drawImage("img/help/4x2-oksalir.png", ctx, 441, 0);	
		Canvas.drawText(ctx, "Presiona Menú/Atrás para salir", new Rect(444, 4, 378, ctx.viewportHeight), custoT);
		 	
		ctx.drawObject(ctx.endObject());
}



timeline.drawArrowTimeline = function drawArrowTimeline(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		var arrowLeft = "img/tv/arrowLeftOn.png";
		var arrowRight = "img/tv/arrowRightOn.png";
			
		
		if(_data.left)
			tp_draw.getSingleton().drawImage(arrowLeft, ctx, 0, 0);
			
		if(_data.right)
			tp_draw.getSingleton().drawImage(arrowRight, ctx, ctx.viewportWidth-32, 0);
		
		ctx.drawObject(ctx.endObject());
}

timeline.drawArrowDate = function drawArrowDate(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		var arrowLeft = "img/tv/arrowLeftOff.png";
		var arrowRight = "img/tv/arrowRightOff.png";
			
		if(_data.focus){
			arrowLeft = "img/tv/arrowLeftOnCLEAN.png";
			arrowRight = "img/tv/arrowRightOnCLEAN.png";
		}
		
		if(_data.left)
			tp_draw.getSingleton().drawImage(arrowLeft, ctx, 0, 0);
			
		if(_data.right)
			tp_draw.getSingleton().drawImage(arrowRight, ctx, ctx.viewportWidth-32, 0);
		
		ctx.drawObject(ctx.endObject());
}


timeline.drawChannelList = function drawChannelList(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   		ctx.clear();
		
		var custo = JSON.stringify(this.themaData.whiteStrokePanelTimeline);
		custo = JSON.parse(custo);
		custo.fill = "rgba(30, 30, 40, .9)";
        Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],custo);
        
        
        if(_data.ChannelVO.isCtv)
			tp_draw.getSingleton().drawImage("img/tv/anytime/AnytimetvBadgeON.png", ctx, 0, 0);
		else if(_data.ChannelVO.isNpvr)
			tp_draw.getSingleton().drawImage("img/tv/anytime/AnytimetvBadgeOFF.png", ctx, 0, 0);	
        
        //Canvas.drawShape(ctx, "rect",[50, 5, 58, 32],{"fill": "rgba(255,0,0,.3)"});
		tp_draw.getSingleton().drawImage(_data.ChannelVO.images.url1X1, ctx, 95, 5, 58, 32);
		
		
		//Canvas.drawShape(ctx, "rect",[0, 0, 55, ctx.viewportHeight],{"fill": "rgba(0,255,0,.3)"});
   		Canvas.drawText(ctx, ""+_data.ChannelVO.number, new Rect(37, 0, 40, ctx.viewportHeight), this.themaData.custoDateNumber);
   		
   		ctx.drawObject(ctx.endObject());
   	}
}

timeline.onFocusChannelList = function onFocusChannelList(_focus, _data){
	if(_focus){
	
		var indexDate = 7;
		if(tpng.app.sections[0].params.fromTimeline){
			indexDate = tpng.app.sections[0].params.datePos;
		}
		if(this.actualForm == "date"){
			this.widgets.programList.options.nofirstfocus = true;
			this.widgets.dateList.options.nofirstfocus = false;
		}
		this.widgets.dateList.setData(this.createDateList(), indexDate);
		this.widgets.dateList.refresh();
		var ts = new Date();
		var params = ["channel="+_data.item.ChannelVO.number , "daysMinus=-7", "daysMore=7", "ts="+ts.getTime(), "lchId=" + _data.item.ChannelVO.lchId];
		
		
		clearTimeout(this.timeUpdateProgram);
		if(!this.enter){
			this.timeUpdateProgram =
			setTimeout(function(){
				getServices.getSingleton().call("EPG_GET_CHANNEL_PROGRAM", params,  this.responseGetChannelProgram.bind(this));
				if(!this.enter){
					tpng.app.programInfo = "timeline";
					this.home.tuneInByNumber(this.widgets.channelList.selectItem.ChannelVO.number,true,null);
				}
			}.bind(this), 500);
		}else{
			this.enter = false;
			getServices.getSingleton().call("EPG_GET_CHANNEL_PROGRAM", params,  this.responseGetChannelProgram.bind(this));
		}
	}
}

timeline.drawDateList = function drawDateList(_data){
	this.draw = function draw(focus) {
	var ctx = this.getContext("2d");
		ctx.beginObject();
   		ctx.clear();
   		
   		var custoTxt =  focus ? this.themaData.dateBlack : this.themaData.dateWhite;
   		
		
   		//Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight], this.themaData.whiteStrokePanelTimeline);
   		Canvas.drawText(ctx, _data.txt, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custoTxt);
   		
   		ctx.drawObject(ctx.endObject());
   	}
}

timeline.onFocusDateList = function onFocusDateList(_focus, _data){
	var dateList = this.widgets.dateList;
	var widgets = this.widgets;
	if(_focus){
		if(this.actualForm == "timeline"){
			widgets.bgDate.data.focus = false;
			widgets.bgDate.refresh();
			widgets.arrowDate.data.focus = false;
			widgets.arrowDate.refresh();
			widgets.dateList.setFocus(false);		
			}
	}
	
	if(dateList.selectIndex+1 == dateList.maxItem){
		this.widgets.arrowDate.data.right = false;
		this.widgets.arrowDate.refresh();
	}else{
		if(dateList.selectIndex == 0){
			this.widgets.arrowDate.data.left = false;
			this.widgets.arrowDate.refresh();
		}else{
			this.widgets.arrowDate.data.right = true;
			this.widgets.arrowDate.data.left = true;
			this.widgets.arrowDate.refresh();
		}
	}
}


timeline.prototype.createDateList = function createDateList(){
	var arrDate = [];
	
	var today = new Date();
		
	
	for(var i=7; i>0; i--){
		arrDate.push({"txt": this.dateToText(new Date(today.getTime() - ( i * 24 * 3600 * 1000))), "ts": new Date(today.getTime() - ( i * 24 * 3600 * 1000)).getTime()});
	}
	for(var i=0; i<8; i++){
		arrDate.push({"txt": this.dateToText(new Date(today.getTime() + ( i * 24 * 3600 * 1000))), "ts": new Date(today.getTime() + ( i * 24 * 3600 * 1000)).getTime()});
	}
	return arrDate;
}


timeline.prototype.dateToText = function dateToText(ts){
	var date = new Date(ts);
	var fechaTxt = "";
	var today = new Date();
	var tsA = new Date(today.getTime() - ( 1 * 24 * 3600 * 1000));
		tsA.setHours(0);
		tsA.setMinutes(0);
		tsA.setSeconds(1);
		tsA.setMilliseconds(0);
		
	var tsM = new Date(today.getTime() + ( 1 * 24 * 3600 * 1000));
		tsM.setHours(0);
		tsM.setMinutes(0);
		tsM.setSeconds(1);
		tsM.setMilliseconds(0);
	
	
	if(date.getDate() != new Date().getDate()){
		if(date.getTime() == tsA.getTime()){
			fechaTxt=fechaTxt+"Ayer";
		}else{
			if(date.getTime() == tsM.getTime()){
				fechaTxt=fechaTxt+"Mañana";
			}else{
				switch(date.getDay()){
					case 0:
						fechaTxt=fechaTxt+"Domingo";
						break;
					case 1:
						fechaTxt=fechaTxt+"Lunes"
						break;
					case 2:
						fechaTxt=fechaTxt+"Martes"
						break;
					case 3:
						fechaTxt=fechaTxt+"Miércoles"
						break;
					case 4:
						fechaTxt=fechaTxt+"Jueves"
						break;
					case 5:
						fechaTxt=fechaTxt+"Viernes"
						break;
					case 6:
						fechaTxt=fechaTxt+"Sábado"
						break;
				}
			}
		}
	}else{
		fechaTxt=fechaTxt+"Hoy"
	}
	fechaTxt=fechaTxt+" "+date.getDate()+" ";
	switch(date.getMonth()){
		case 0:
			fechaTxt=fechaTxt+"Ene"
			break;
		case 1:
			fechaTxt=fechaTxt+"Feb"
			break;
		case 2:
			fechaTxt=fechaTxt+"Mar"
			break;
		case 3:
			fechaTxt=fechaTxt+"Abr"
			break;
		case 4:
			fechaTxt=fechaTxt+"May"
			break;
		case 5:
			fechaTxt=fechaTxt+"Jun"
			break;
		case 6:
			fechaTxt=fechaTxt+"Jul"
			break;
		case 7:
			fechaTxt=fechaTxt+"Ago"
			break;
		case 8:
			fechaTxt=fechaTxt+"Sep"
			break;
		case 9:
			fechaTxt=fechaTxt+"Oct"
			break;
		case 10:
			fechaTxt=fechaTxt+"Nov"
			break;
		case 11:
			fechaTxt=fechaTxt+"Dic"
			break;
	}
	
	return fechaTxt;
	
}


timeline.drawProgramList = function drawProgramList(_data){
	this.draw = function draw(focus) {
	var ctx = this.getContext("2d");
		ctx.beginObject();
   		ctx.clear();
   		
   		var urlImage = _data.ProgramVO.images.url7X7;
   		if(urlImage.length > 0){
   			tp_draw.getSingleton().drawImage(urlImage, ctx, 0, 0,null,null,null,"destination-over");
   		}
   		
   		var custoProgressBar, custoTxt, custoDuration;
   		var custoBG = this.themaData.darkBlackTimeline;
   		var custoBG2;
   		if(focus){
			//custoBG = this.themaData.whiteTimeline;
			//custoTxt = this.themaData.pogramNameBlack;
			//custoDuration = this.themaData.durationBlack;
			
			custoBG = this.themaData.whiteTimeline;
			var custoBG2 = this.themaData.whiteTimeline2;
			custoTxt = this.themaData.pogramNameWhite;
			custoDuration = this.themaData.durationWhite;
		}else{
			custoBG = this.themaData.darkBlackTimeline;
			custoBG2 = this.themaData.darkTimeline2;
			custoTxt = this.themaData.pogramNameWhite;
			custoDuration = this.themaData.durationWhite;
		}
		//fondo de items y stroke
		Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight], custoBG);
		Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight], this.themaData.whiteStrokePanelTimeline);
	    
	    //fondo de barra de progreso
	    Canvas.drawShape(ctx, "rect", [0, 98, ctx.viewportWidth, 6], this.themaData.fillBase);
	    
	    
	    //nombre del programa
		Canvas.drawText(ctx, _data.ProgramVO.name, new Rect(5, 0, ctx.viewportWidth-10, 68), custoTxt);
		
		//hora de inicio y hora de fin
		Canvas.drawText(ctx, startTimeEndTime(_data.ProgramVO.startTime, _data.ProgramVO.endTime), new Rect(15, 72, 186, 32), custoDuration);
		
		
		var tEnd = new Date(_data.ProgramVO.endTime),//time End
			tStart = new Date(_data.ProgramVO.startTime),//time Start
			tNow = new Date();
		
		if(tEnd < tNow){
		
			//NGM.trace("Programa pasado");
			if(_data.ProgramVO.isCtvRecorded || _data.ProgramVO.isNpvrRecorded){
				
				// barra de progreso rosa JSON.stringify(this.themaData.standardFont)
				Canvas.drawShape(ctx, "rect",[0, 98, ctx.viewportWidth, 6], this.themaData.fillPink);
									
				var custo_t = JSON.stringify(this.themaData.standardFont);
				custo_t = JSON.parse(custo_t);
				custo_t.fill = "rgba(247, 194, 222, 1)";
				if(focus){
					//custo_t.fill  = "rgba(200, 0, 100, .5)";
				}
				custo_t.font_size = 18 * tpng.thema.text_proportion;
				custo_t.text_align = "left,top";
				
				// texto reproducir
				Canvas.drawText(ctx, "reproducir", new Rect(262, 72, 186, 32), custo_t);
			}else{
				// barra de progreso gris
				Canvas.drawShape(ctx, "rect",[0, 98, ctx.viewportWidth, 6], this.themaData.fillGray);
			}
			
		}else{
			if(tStart < tNow && tEnd > tNow){
				//NGM.trace("Programa actual");
				
		   		var width = percent(_data.ProgramVO.startTime, _data.ProgramVO.endTime, ctx.viewportWidth);
				Canvas.drawShape(ctx, "rect", [ 0, 98, width, 6],this.themaData.fillBlue);
				Canvas.drawShape(ctx, "rect", [ width+1, 98, 1, 6],{"fill" : "rgba(255, 255, 255, 1)"});
				
				var custo_t = JSON.stringify(this.themaData.standardFont);
				custo_t = JSON.parse(custo_t);
				custo_t.fill = "rgba(24, 166, 196, 1)";
				custo_t.font_size = 16 * tpng.thema.text_proportion;
				custo_t.text_align = "left,top";
				Canvas.drawText(ctx, timeLeft(_data.ProgramVO.startTime, _data.ProgramVO.endTime), new Rect(262, 72, 186, 32), custo_t);
				
				
			}else{
				//NGM.trace("Programa futuro");
				
			}
		}
		
		Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight], custoBG2);
		
		if(_data.ProgramVO.profileLoked){
			tp_draw.getSingleton().drawImage("img/tv/programa_bloqueado.png", ctx, 326, 0);
		}else{
			if(_data.ProgramVO.isPopular){
				tp_draw.getSingleton().drawImage("img/tv/badgePopular.png", ctx, 349, 1);
			}
		}
		
		if(_data.ProgramVO.hasReminder){
			tp_draw.getSingleton().drawImage("img/tv/badgeRecordado.png", ctx, 212, 71);
		}
		
		ctx.drawObject(ctx.endObject());
	}
}

timeline.onFocusProgramList = function onFocusProgramList(_focus, _data){
	var programList = this.widgets.programList;
	var dateList = this.widgets.dateList;
	
	if(_focus){
		if(this.actualForm == "date")
			programList.setFocus(false);
	}
	if(programList.selectIndex+1 == programList.maxItem){
		this.widgets.arrowTimeline.data.right = false;
		this.widgets.arrowTimeline.refresh();
	}else{
		if(programList.selectIndex == 0){
			this.widgets.arrowTimeline.data.left = false;
			this.widgets.arrowTimeline.refresh();
		}else{
			this.widgets.arrowTimeline.data.right = true;
			this.widgets.arrowTimeline.data.left = true;
			this.widgets.arrowTimeline.refresh();
		}
	}
	
}


timeline.drawChannelNumberBar = function drawChannelNumberBar(_data){ 	
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		
		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 56 * tpng.thema.text_proportion;
			
		var custoBackground = {
	       		fill:           "0.5-rgba(28, 121, 156, .8)|1-rgba(5, 65, 100, .8)",
	        	fill_coords:    "0,0,.3,-2",
	        	stroke:         "rgba(90,90,90, 1)",
	        	stroke_coords:  "1,0,0,0",
	        	stroke_width:   2,
	    	};
	    	
		
		
		if(_data.number){
		_data.number = _data.number.toString();
			if(_data.number.length < 3)
				_data.number = _data.number + "_";
				
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoBackground);
			Canvas.drawText(ctx, "<!size=22>ir a canal<!>" + "<!placeholder=30>"+ _data.number+ "<!>", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);	
		}
	ctx.drawObject(ctx.endObject());	
}