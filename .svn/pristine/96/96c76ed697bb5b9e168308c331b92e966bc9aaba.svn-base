// miniGuide.js
function miniGuide(config, options){ 
    this.super(config, options);
}

miniGuide.inherits(FormWidget);

miniGuide.prototype.onEnter = function onEnter(_data){
	var widgets = this.widgets,
		programVO =[{"loading":true},{"loading":true},{"loading":true},{"loading":true}];

	this.home = _data.home;
	this.indexProgram = _data.indexProgram;
	this.fromMiniGuide = _data.fromMiniGuide;
	this.datePos =_data.datePos;
	this.indexTimeLineProgram = _data.indexTimeLineProgram;
	this.home.showHeader();
	widgets.dateBg.setData({"left": true, "right":true, "focus": false});
	widgets.dateBg.stateChange("enter");
	widgets.blackBg.setData("");
	widgets.blackBg.stateChange("enter");
	
	this.datePos = this.fromMiniGuide ? this.datePos : 7;
	this.auxMin = _data.auxMin;
	widgets.scrollDate.setData(this.createDateList(), this.datePos);
	
	widgets.scrollDate.stateChange("enter");
	widgets.programs.setData(programVO,0);	
	widgets.programs.stateChange("enter"); 

	var _date = _data.ts ? new Date(_data.ts) : new Date();
	getServices.getSingleton().call("EPG_GET_PROGRAMS_CHANNELS", ["ts="+_date.getTime()],  this.responseSendChannelsToday.bind(this));		
}
miniGuide.prototype.createDateList = function createDateList(){
	var arrDate = [],
		today = new Date();
	
	for(var i=7; i>0; i--){
		arrDate.push({"txt": dateToText(new Date(today.getTime() - ( i * 24 * 3600 * 1000))), "ts": new Date(today.getTime() - ( i * 24 * 3600 * 1000)).getTime()});
	}
	for(var i=0; i<8; i++){
		arrDate.push({"txt": dateToText(new Date(today.getTime() + ( i * 24 * 3600 * 1000))), "ts": new Date(today.getTime() + ( i * 24 * 3600 * 1000)).getTime()});
	}
	return arrDate;
}
miniGuide.prototype.responseSendChannelsToday = function responseSendChannelsToday(responseCode){
	if(responseCode.status == 200){
		var programVO = responseCode.data.ResponseVO.channels,
			widgets = this.widgets,
			index = this.home.findChannelIndex(tpng.app.currentChannel.number,programVO),
			todayDate = new Date();
			
		for(var i = 0, j = programVO.length; i < j; i++){
			programVO[i].ChannelVO.todayDate = todayDate;
			programVO[i].ChannelVO.dateProgram = widgets.scrollDate.selectItem.txt;
		}
		
		
		if(this.fromMiniGuide && !this.auxMin){
			widgets.programs.setData(programVO,this.indexProgram);
			var ts = new Date(this.createDateList()[this.datePos].ts);
			var c = widgets.programs.selectItem.ChannelVO;
			var parameters = ["ts="+ts.getTime(),"channel=" + c.number,"daysMinus=" + tpng.timeLine.daysMinus,"daysMore=" + tpng.timeLine.daysMore, "lchId=" + c.lchId];
			getServices.getSingleton().call("EPG_GET_CHANNEL_PROGRAM",parameters,this.responseGetTimeLine.bind(this));
		}else{
			var index = this.indexProgram ? this.indexProgram : this.home.findChannelIndex(tpng.app.currentChannel.number,programVO);
			widgets.programs.setData(programVO,index);
		}
			
		widgets.programs.setFocus(true);
		widgets.programs.stateChange("enter"); 
			
		this.actualonFocus = "miniGuide";
		clearTimeout(this.timerExit);
		this.timerExit = setTimeout(function(){this.home.closeSection(this)}.bind(this), 20000);
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest": responseCode.error.suggest, "message": responseCode.error.message, "code":responseCode.status}, false);	
	}
}

miniGuide.prototype.responseSendChannelsXDate = function responseSendChannelsXDate(responseCode){
	if(responseCode.status == 200){
		var programVO = responseCode.data.ResponseVO.channels,
			widgets = this.widgets,
			todayDate = new Date();
			
		for (var j=0; j < programVO.length; j++){
			programVO[j].ChannelVO.todayDate = todayDate,
			programVO[j].ChannelVO.dateProgram = widgets.scrollDate.selectItem.txt;
		}
		this.client.lock();
			widgets.programs.setData(programVO)
			widgets.programs.stateChange("enter");
			widgets.dateBg.refresh();
			widgets.blackBg.stateChange("enter");
			widgets.scrollDate.stateChange("enter");
		this.client.unlock();
		clearTimeout(this.timerExit);
		this.timerExit = setTimeout(function(){this.home.closeSection(this)}.bind(this), 20000);
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest": responseCode.error.suggest, "message": responseCode.error.message, "code":responseCode.status}, false);
	}
}

miniGuide.prototype.responseGetTimeLine = function responseGetTimeLine(responseCode){
	if(responseCode.status == 200){
		var programVO = responseCode.data.ResponseVO.programs;
			actualProgramIndex = responseCode.data.ResponseVO.actualIndex + this.index,
			actualProgram =  programVO[actualProgramIndex],
			widgets = this.widgets;
			this.client.lock();
               widgets.timeLineWidget.setData("");
               widgets.timeLineWidget.stateChange("enter");
              
               if(widgets.programs.focusIndex == 1)                               
                       widgets.timeLineWidget.animation.move(0,466).start();
               else if(widgets.programs.focusIndex == 2)                                
                       widgets.timeLineWidget.animation.move(0,538).start();
               else if(widgets.programs.focusIndex == 3)                                
                       widgets.timeLineWidget.animation.move(0,610).start();
                             
               widgets.timeLineBg.setData("");
               widgets.timeLineBg.stateChange("enter");
               widgets.timeLineLogo.setData(widgets.programs.selectItem.ChannelVO);
               widgets.timeLineLogo.stateChange("enter_On");
               widgets.timeLineArrows.setData({"left": true, "right":true});
   			   widgets.timeLineArrows.stateChange("enter");           
	          
	           actualProgramIndex = this.fromMiniGuide && !this.auxMin ? this.indexTimeLineProgram : actualProgramIndex;
               
               widgets.timeLinePrograms.setData(programVO, actualProgramIndex);
               widgets.timeLinePrograms.stateChange("enter");    
               this.actualonFocus = "timeLine";

			this.client.unlock();
	
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest": responseCode.error.suggest, "message": responseCode.error.message, "code":responseCode.status}, false);
	}
}
miniGuide.prototype.responseReminder =  function responseReminder(responseCode){
	
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
		
		var _data = this.widgets.timeLinePrograms.selectItem.ProgramVO; 
			_data.hasReminder = responseCode.data.ResponseVO.status == 0 ? true : false;
			this.widgets.timeLinePrograms.redraw(true); 	
			
		var _dataM = this.widgets.programs.selectItem.ChannelVO.program.ProgramVO; 
			_dataM.hasReminder = responseCode.data.ResponseVO.status == 0 ? true : false;
			this.widgets.programs.redraw(true); 	
		
		 	
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest": responseCode.error.suggest, "message": responseCode.error.message, "code":responseCode.status}, false);
	}
}
miniGuide.prototype.responseRecording =  function responseRecording(responseCode){
	
	if(responseCode.status == 200){
		var buttons_bottom =  this.home.widgets.buttons_bottom;

		if(buttons_bottom.selectItem.label == "Grabar"){
			this.home.openSection("message", {"home":this.home, "title": this.home.widgets.programInfo.data.name, "active": true}, false, null, true);
	 		buttons_bottom.selectItem.label = "Dejar de grabar";
		 }else{
		 	this.home.openSection("message", {"home":this.home, "title": this.home.widgets.programInfo.data.name, "active": false}, false, null, true);
		 	buttons_bottom.selectItem.label = "Grabar";
		 }
		 	buttons_bottom.redraw();
		
		var _data = this.widgets.timeLinePrograms.selectItem.ProgramVO; 
			_data.isNpvrChecked = responseCode.data.ResultVO.status == 1 ? true : false;
			this.widgets.timeLinePrograms.redraw(true);
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest": responseCode.error.suggest, "message": responseCode.error.message, "code":responseCode.status}, false);
	}
}
miniGuide.prototype.onKeyPress = function onKeyPress(_key){
	switch(this.actualonFocus){
		case "miniGuide":
			this.onKeyPress_miniGuide(_key);
		break;
		case "timeLine":
			this.onKeyPress_timeLine(_key);
		break;
		case "date":
			this.onKeyPress_Date(_key);
		break;
		case "buttons_Top":
			this.onKeyPress_Buttons_Top(_key);
		break;
		case "buttons_Bottom":
			this.onKeyPress_Buttons_Bottom(_key);
		break;
		case "search":
			this.onKeyPressSearch(_key); 
		break;
		case "moreInfoRecommendations":
			this.onKeyPressMoreInfo_Recommendations(_key); 
		break;
		case "exit_info":
			this.onKeyPressExit_Info(_key);
		break;
		
	}
	return true;	
}
miniGuide.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	var widgets = this.widgets;
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":	
    	case "KEY_DOWN":
    		if(widgets.scrollDate.stateGet() != "exit"){
	    		this.actualonFocus = "date";
	    		widgets.scrollDate.setFocus(true);
	    		
	    		if(this.indexDate == 0)
					widgets.dateBg.setData({"left": false, "right":true,"focus":true});
				else if(this.indexDate == 15)
					widgets.dateBg.setData({"left": true, "right":false,"focus":true});
				else
					widgets.dateBg.setData({"left": true, "right":true,"focus":true});
			
				widgets.dateBg.refresh();
    		}else{
    			this.actualonFocus = "buttons_Bottom";				
				this.home.widgets.buttons_bottom.setFocus(true);
    			this.home.disableHeaderHome();
    		}
    		this.home.disableSearchHeader();
    	break;
	   default:
			this.home.onKeyPress(_key);
		break;
    }
	return true;
}
miniGuide.prototype.onKeyPress_Buttons_Top = function onKeyPress_Buttons_Top(_key){
	var widgets = this.home.widgets,
		_program = widgets.programInfo.data,
		w = this.widgets,
		now = new Date().getTime(),
		_selectItem = w.programs.selectItem.ChannelVO.program.ProgramVO;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.hideMoreInfo();  
			if(this.auxMin){
				this.stateWidgets_One("enter");
				this.actualonFocus = "miniGuide";
			}else{
				this.stateWidgets("enter");
				this.actualonFocus = "timeLine";
			}
		break;
		case "KEY_LEFT":
			if(widgets.buttons_top.scrollPrev()){
			}else{
				if(widgets.recommendations.maxItem>0){
					widgets.buttons_top.setFocus(false);
					this.actualonFocus = "moreInfoRecommendations";
					tpng.app.section = "moreInfoRecommendations";
					widgets.recommendations.setFocus(true);		
				}
			}
    	break;
     	case "KEY_RIGHT":
    		widgets.buttons_top.scrollNext();
    	break;	
    	case "KEY_DOWN":
    		widgets.buttons_bottom.setFocus(true);
    		widgets.buttons_bottom.scrollTo(widgets.buttons_top.selectIndex);
    		widgets.buttons_top.setFocus(false);
    		this.actualonFocus = "buttons_Bottom";
    	break;
    	case "KEY_UP":
			this.actualonFocus = "search";
    		widgets.buttons_top.setFocus(false);
    		this.home.enableSearchHeader();
    	break;
		case "KEY_IRENTER":
		break;
	}	
	return true;
}
miniGuide.prototype.onKeyPress_Buttons_Bottom = function onKeyPress_Buttons_Bottom(_key){
	var widgets = this.home.widgets,
		_program = widgets.programInfo.data,
		w = this.widgets;
	switch(_key){	
    	case "KEY_LEFT":
			if(widgets.buttons_bottom.scrollPrev()){
			}else{
				this.actualonFocus = "exit_info";
				widgets.buttons_bottom.setFocus(true);	
				widgets.buttons_bottom.setFocus(false);	
		    	widgets.button_back.setFocus(true);
			}
    	break;
     	case "KEY_RIGHT":
    		widgets.buttons_bottom.scrollNext();
    	break;	
    	case "KEY_UP":
   			widgets.buttons_bottom.setFocus(false);
    		this.actualonFocus = "search";
    		widgets.buttons_top.setFocus(false);
    		this.home.enableSearchHeader();    
   			this.home.enableHeaderHome();			
    	break;
    	case "KEY_IRENTER":
			tpng.app.sections[0].params.indexProgram = w.programs.selectIndex;
			tpng.app.sections[0].params.indexTimeLineProgram = w.timeLinePrograms.selectIndex;
			tpng.app.sections[0].params.fromMiniGuide = true;
			tpng.app.sections[0].params.datePos = w.scrollDate.selectIndex;
			tpng.app.sections[0].params.ts = w.scrollDate.list[w.scrollDate.selectIndex].ts;
			tpng.app.sections[0].params.auxMin = this.auxMin;
			
			//NGM.dump(tpng.app.sections[0].params,2);
			switch(widgets.buttons_bottom.selectItem.action){
				case "LOCKCHANNEL":
					this.home.openSection("unlockProgram",{"home":this.home, "section":"miniGuide", "blockChannel": true, "program":_program,"channel":_program.ChannelVO}, false,null,false);
				break;
				case "HELP":
					this.home.openSection("help",{"home":this.home},true, ,false);				
				break;
				case "SEARCH":
					this.nameProgram = replaceAll(_program.name, " ", "@");
					this.home.openSection("search",{"home":this.home, "pattern": this.nameProgram, "related":true , "channel": _program.ChannelVO.number, "epgId":_program.id },true, ,false);
				break;
				case "BACK":
					this.home.hideMoreInfo();  
					if(this.auxMin){
						this.stateWidgets_One("enter");
						this.actualonFocus = "miniGuide";
					}else{
						this.stateWidgets("enter");
						this.actualonFocus = "timeLine";
					}
				break;
				case "AUDIOS":
					this.home.changeAudio();
				break;
				case "SUB":
					this.home.changeSubtitle();
				break;
				case "INFO":
					this.home.openSection("programDetail",{"home":this.home, "program": _program},false);
				break;
				case "REMINDER":
				 	var params = ["idEpg="+_program.id];
					getServices.getSingleton().call("EPG_REMINDER", params, this.responseReminder.bind(this));
				break;
				case "PLAY":
					this.home.openSection("anytimePlayer",{"home":this.home, "program": _program},false);
				break;
				case "RECORDING":
					getServices.getSingleton().call("EPG_RECORDING_NPVR", ["epgId="+_program.id],  this.responseRecording.bind(this));		
				break;
	    		default:			
    				this.home.hideMoreInfo();    	
					this.home.openLink(widgets.buttons_bottom.selectItem.ItemVO.link,null,4);				
	    		break;					
			}
		break;
    	case "KEY_MENU":
	    case "KEY_IRBACK":
			  this.home.hideMoreInfo();  
			if(this.auxMin){
				this.stateWidgets_One("enter");
				this.actualonFocus = "miniGuide";
			}else{
				this.stateWidgets("enter");
				this.actualonFocus = "timeLine";
			}
			  
			  
	    break;
    }
	return true;
}
miniGuide.prototype.onKeyPress_Date = function onKeyPress_Date(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_LEFT":
			clearTimeout(this.timerExit);
			if(widgets.scrollDate.scrollPrev()){	
				clearTimeout(this.timeInfoSpeed);
				var ts = new Date(widgets.scrollDate.selectItem.ts);
				this.indexDate = widgets.scrollDate.selectIndex;
				
				this.timeInfoSpeed = setTimeout(function(){
					widgets.programs.stateChange("exit");
					var params = ["ts="+ts.getTime()];
					getServices.getSingleton().call("EPG_GET_PROGRAMS_CHANNELS", params,  this.responseSendChannelsXDate.bind(this));		
				}.bind(this), 1000);
			}
		break;
		case "KEY_RIGHT":
			clearTimeout(this.timerExit);
			if(widgets.scrollDate.scrollNext()){	
				var ts = new Date(widgets.scrollDate.selectItem.ts);
				this.indexDate = widgets.scrollDate.selectIndex;
				clearTimeout(this.timeInfoSpeed);
				this.timeInfoSpeed = setTimeout(function(){
					widgets.programs.stateChange("exit");
					var params = ["ts="+ts.getTime()];
					getServices.getSingleton().call("EPG_GET_PROGRAMS_CHANNELS", params,  this.responseSendChannelsXDate.bind(this));		
				}.bind(this), 1000);
			}
		break;
		
		case "KEY_DOWN":
			this.actualonFocus = "miniGuide";
			widgets.scrollDate.setFocus(false);
			if(this.indexDate == 0)
				widgets.dateBg.setData({"left": false, "right":true,"focus":false});
			else if(this.indexDate == 15)
				widgets.dateBg.setData({"left": true, "right":false,"focus":false});
			else
				widgets.dateBg.setData({"left": true, "right":true,"focus":false});
			
			widgets.dateBg.refresh();
			widgets.programs.setFocus(true);
		break;
		case "KEY_UP":
			this.actualonFocus = "search";
    		widgets.scrollDate.setFocus(false);
    		
    		if(this.indexDate == 0)
				widgets.dateBg.setData({"left": false, "right":true,"focus":false});
			else if(this.indexDate == 15)
				widgets.dateBg.setData({"left": true, "right":false,"focus":false});
			else
				widgets.dateBg.setData({"left": true, "right":true,"focus":false});
			
			widgets.dateBg.refresh();
    		this.home.enableSearchHeader();
    		clearTimeout(this.timerExit);
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
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.closeSection(this);
		break;
	}	
	return true;
}

miniGuide.prototype.onKeyPress_timeLine = function onKeyPress_timeLine(_key){
	var widgets = this.widgets,
		programList = this.widgets.timeLinePrograms,
		now = new Date().getTime(),
		dateList = this.widgets.scrollDate;
	switch(_key){		
		case "KEY_LEFT":
			clearTimeout(this.timerExit1);
			programList.scrollPrev();
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
		break;
		case "KEY_RIGHT":
			clearTimeout(this.timerExit1);
			programList.scrollNext();
			var tsItemSelected = dateList.list[dateList.selectIndex].ts;
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
		break;
		case "KEY_UP":
			clearTimeout(this.timerExit1);
			this.client.lock();	
				widgets.timeLineBg.stateChange("exit");
				widgets.timeLinePrograms.stateChange("exit_On");
				widgets.timeLineLogo.stateChange("exit_On");
				widgets.timeLineArrows.stateChange("exit");
			if(widgets.programs.focusIndex == 1|| widgets.programs.focusIndex == 2 || widgets.programs.focusIndex == 3){
				this.actualonFocus = "miniGuide";
				widgets.programs.scrollPrev();
				
				this.indexDate = this.indexDate >=0 ? this.indexDate : this.datePos;
				widgets.scrollDate.setData(widgets.scrollDate.list, this.indexDate);

			}
			this.client.unlock();
			this.fromMiniGuide = "";
		break;
		case "KEY_DOWN":
			clearTimeout(this.timerExit1);
			this.client.lock();
			if(widgets.programs.focusIndex == 1 || widgets.programs.focusIndex == 2 || widgets.programs.focusIndex == 3){
				widgets.timeLineBg.stateChange("exit");
				widgets.timeLineLogo.stateChange("exit_On");
				widgets.timeLinePrograms.stateChange("exit_On");
				widgets.timeLineArrows.stateChange("exit");
				widgets.programs.scrollNext();
				
				this.indexDate = this.indexDate >=0 ? this.indexDate : this.datePos;
				widgets.scrollDate.setData(widgets.scrollDate.list, this.indexDate);
			
				this.actualonFocus = "miniGuide";	
			}
			this.client.unlock();
			this.fromMiniGuide = "";
		break;
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.client.lock();
				widgets.timeLineLogo.stateChange("exit_On");
				widgets.timeLineArrows.stateChange("exit");
				widgets.timeLineBg.stateChange("exit");
				widgets.timeLinePrograms.stateChange("exit_On");
				widgets.programs.setFocus(true);
				
				this.indexDate = this.indexDate >=0 ? this.indexDate : this.datePos;
				widgets.scrollDate.setData(widgets.scrollDate.list, this.indexDate);

				widgets.scrollDate.setFocus(false);
				widgets.scrollDate.refresh();
				this.actualonFocus = "miniGuide";
			this.client.unlock();
			this.fromMiniGuide = "";
			clearTimeout(this.timerExit);
			this.timerExit = setTimeout(function(){this.home.closeSection(this)}.bind(this), 20000);
		break;
		case "KEY_IRENTER":
		var item = widgets.timeLinePrograms.selectItem.ProgramVO,
			channel = widgets.programs.selectItem.ChannelVO,
			_program = item;
			
			_program.ChannelVO = {
				"images":channel.images,
              	"number":channel.number,
              	"isCtv":channel.isCtv,
             	"isNpvr":channel.isNpvr,
             	"type":channel.type
             }
             _program.rating = {"value":item.parentalRating}
             _program.draw="more";
			if(_program.startTime < now &&  _program.endTime > now){
				tpng.app.programInfo = "guide";
				tpng.netflix.fromMiniGuide = true;
				this.home.tuneInByNumber(_program.channelNumber,false,false);
				clearTimeout(this.timerExit1);
				this.timerExit1 = setTimeout(function(){
					this.stateWidgets("exit");
					this.home.closeSection(this);
				}.bind(this), 3000);
			}else{
				clearTimeout(this.timerExit1);
				this.timerExit1 = setTimeout(function(){
					this.auxMin = false;
					this.actualonFocus = "";
					this.stateWidgets("exit");
					this.home.showMoreInfo(_program,null, this.onKeyPressRecover.bind(this));
				}.bind(this), 1000);
			}
		break;
	}	
	return true;
}
miniGuide.prototype.onKeyPressRecover = function onKeyPressRecover(){
	this.onKeyPressRecoverDelay.bind(this).delay(1000);
}
miniGuide.prototype.onKeyPressRecoverDelay = function onKeyPressRecoverDelay(){
	this.actualonFocus = "buttons_Bottom";
}
miniGuide.prototype.onKeyPress_miniGuide = function onKeyPress_miniGuide(_key){
	var widgets = this.widgets,
		now = new Date().getTime();
	switch(_key){		
		case "KEY_UP":	
			if(widgets.programs.selectIndex <= 0){
				this.actualonFocus = "date";
				widgets.dateBg.data.focus = true;
				widgets.dateBg.refresh();
				widgets.scrollDate.setFocus(true);
				widgets.programs.setFocus(false);
			}else{
				widgets.programs.scrollPrev();
			}
			clearTimeout(this.timerExit1);
			clearTimeout(this.timerExit);
			this.timerExit = setTimeout(function(){this.home.closeSection(this)}.bind(this), 20000);
		break;
		case "KEY_DOWN":
			clearTimeout(this.timerExit1);
			widgets.programs.scrollNext();
			clearTimeout(this.timerExit);
			this.timerExit = setTimeout(function(){this.home.closeSection(this)}.bind(this), 20000);		
		break;
		case "KEY_RIGHT":
		case "KEY_LEFT":
			clearTimeout(this.timerExit);
			var ts = new Date(widgets.scrollDate.list[widgets.scrollDate.selectIndex].ts);
			_key == "KEY_LEFT" ? this.index = -1 : this.index= 1;
			
			if(widgets.programs.selectItem.ChannelVO.type == "M" || widgets.programs.selectItem.ChannelVO.type == "I"){
			}else{
				var c = widgets.programs.selectItem.ChannelVO;
				var parameters = ["ts="+ts.getTime(),"channel=" + c.number,"daysMinus=" + tpng.timeLine.daysMinus,"daysMore=" + tpng.timeLine.daysMore, "lchId=" + c.lchId];
				getServices.getSingleton().call("EPG_GET_CHANNEL_PROGRAM",parameters,this.responseGetTimeLine.bind(this));
			
			}
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
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.hideHeader();
			this.home.closeSection(this);
		break;
		case "KEY_IRENTER":
		var channel = widgets.programs.selectItem;
		 if(channel.ChannelVO.type == "I" || channel.ChannelVO.type == "M"){
				tpng.app.programInfo = "guide";
				tpng.netflix.fromMiniGuide = true;
				this.home.tuneInByNumber(channel.ChannelVO.number,false,false);
				clearTimeout(this.timerExit1);
				this.timerExit1 = setTimeout(function(){
					this.home.closeSection(this);
				}.bind(this), 3000);	
		}else{
			var _program  = channel.ChannelVO.program.ProgramVO;
				_program.ChannelVO = channel.ChannelVO;
				_program.draw = "more";
			if( _program.startTime < now &&  _program.endTime > now){
				tpng.app.programInfo = "guide";
				tpng.netflix.fromMiniGuide = true;
				this.home.tuneInByNumber(_program.channelNumber,false,false);
				clearTimeout(this.timerExit1);
				this.timerExit1 = setTimeout(function(){
					this.home.closeSection(this);
				}.bind(this), 3000);
			}else{
				this.auxMin = true;
				this.stateWidgets_One("exit");
				this.home.showMoreInfo(_program);
				this.actualonFocus = "buttons_Bottom";
				clearTimeout(this.timerExit);
			}
			
		}
		break;
	}	
	return true;
}
miniGuide.prototype.onKeyPressMoreInfo_Recommendations = function onKeyPressMoreInfo_Recommendations(_key){
	var w= this.widgets;
	switch(_key){	
    	case "KEY_RIGHT":
    		tpng.app.section = "";
			this.home.widgets.buttons_top.setFocus(true);
			this.actualonFocus = "buttons_Top";
			this.home.widgets.recommendations.setFocus(false);
    	break;		
	    case "KEY_IRENTER":
	    	tpng.app.sections[0].params.indexProgram = w.programs.selectIndex;
			tpng.app.sections[0].params.indexTimeLineProgram = w.timeLinePrograms.selectIndex;
			tpng.app.sections[0].params.fromMiniGuide = true;
			tpng.app.sections[0].params.datePos = w.scrollDate.selectIndex;
			tpng.app.sections[0].params.ts = w.scrollDate.selectItem.ts;
	    	var parameters = this.home.widgets.recommendations.selectItem.ItemVO.link;
	    		
	    	this.home.openLink(parameters, null,4);
			//this.home.openSection(parameters.ref,{"home":this.home, "parameters": parameters.parameters},false);
	    break; 
    }
	return true;
}


miniGuide.prototype.onKeyPressExit_Info = function onKeyPressExit_Info(_key){	
	var widgets = this.home.widgets,
	buttons_bottom = widgets.buttons_bottom,
	buttons_top = widgets.buttons_top;
	
	switch(_key){
		
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
	   		//this.home.hideHeader();
			this.home.hideMoreInfo();  
			this.stateWidgets("enter");
			this.actualonFocus = "timeLine";	
		break;	
		
		case "KEY_UP":
			buttons_bottom.setFocus(false);
	    	this.home.widgets.button_back.setFocus(false);			
    		if(buttons_top.list.length > 0){//O sea que si hay botones en top
	    		this.actualonFocus = "buttons_Top";
    			buttons_top.setFocus(true);
    		}else{//No hay botones en top, se salta a header
    			this.home.enableSearchHeader();
     			buttons_bottom.setFocus(false);
				this.actualonFocus = "search";
				this.home.enableHeaderHome();
    		}
		break;
		
		case "KEY_RIGHT":
    		this.actualonFocus = "buttons_Bottom";
	    	this.home.widgets.button_back.setFocus(false);
    		buttons_bottom.setFocus(true);	
		break;
	
	}
	
	return true;
}
miniGuide.prototype.setNumber = function setNumber(_num){	
	var widgets = this.widgets;
	tpng.app.channelNumber = tpng.app.channelNumber + _num;
	
	var numberChannel = tpng.app.channelNumber.substring(0,3); // se agrego para limitar el numero que se digita
	
	if(tpng.app.channelNumber.length <= 3){
		this.showChannelBar(tpng.app.channelNumber);
		var timer = tpng.app.channelNumber.length < 3 ? 1500 : 1000;
		
		clearTimeout(this.timerChannel);
		this.timerChannel = setTimeout(function(){
		
			var index = this.home.findChannelIndex(numberChannel,widgets.programs.list);	
			widgets.programs.stateChange("exitOff");
			clearTimeout(this.timerprog);
			this.timerprog = setTimeout(function(){
				widgets.programs.stateChange("exit");
				widgets.programs.setData(widgets.programs.list,index);
				widgets.programs.setFocus(true);
				widgets.programs.stateChange("enter");
			}.bind(this), 200);
		}.bind(this), 700);
		
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){widgets.channelNumberBar.stateChange("exit"),tpng.app.channelNumber =""}.bind(this), timer);
		clearTimeout(this.timerExit);
		this.timerExit = setTimeout(function(){this.home.closeSection(this)}.bind(this), 20000);
				
	}
}
miniGuide.prototype.showChannelBar = function showChannelBar(_num){
	var w = this.widgets.channelNumberBar;
		w.setData({"number": _num});
		w.stateChange("enter");
		w.refresh();
}
miniGuide.prototype.stateWidgets =  function stateWidgets(_state){
	var widgets =  this.widgets;
	this.client.lock();	
		widgets.timeLinePrograms.stateChange(_state);
		widgets.timeLineArrows.stateChange(_state);
		widgets.timeLineBg.stateChange(_state);
		widgets.timeLineLogo.stateChange(_state);
		widgets.programs.stateChange(_state);
		widgets.blackBg.stateChange(_state);
		widgets.dateBg.stateChange(_state);
		widgets.scrollDate.stateChange(_state);
	this.client.unlock();	
}
miniGuide.prototype.stateWidgets_One =  function stateWidgets_One(_state){
	var widgets =  this.widgets;
	this.client.lock();	
		widgets.timeLineLogo.stateChange(_state);
		widgets.programs.stateChange(_state);
		widgets.blackBg.stateChange(_state);
		widgets.dateBg.stateChange(_state);
		widgets.scrollDate.stateChange(_state);
	this.client.unlock();	
}
miniGuide.prototype.onMiniguideFocus = function onMiniguideFocus(_focus,_data){
   if(_focus){                             
           if (this.actualonFocus == "date" || this.actualonFocus == "search")
                   this.widgets.programs.setFocus(false);
                
   }
         
}

miniGuide.prototype.onScrollDateFocus = function onScrollDateFocus(_focus,_data){
	var dateList = this.widgets.scrollDate,
		dateBg = this.widgets.dateBg;
	if(_focus){
		if(this.actualonFocus == "miniGuide")
			dateList.setFocus(false);
	}
   if(dateList.selectIndex+1 == dateList.maxItem){
		dateBg.data.right = false;
		dateBg.refresh();
	}else{
		if(dateList.selectIndex == 0){
			dateBg.data.left = false;
			dateBg.refresh();
		}else{
			dateBg.data.right = true;
			dateBg.data.left = true;
			dateBg.refresh();
		}
	}
}

miniGuide.prototype.onScrollTimeLineProgramsFocus = function onScrollTimeLineProgramsFocus(_focus,_data){
	var timeLinePrograms = this.widgets.timeLinePrograms,
		timeLineArrows = this.widgets.timeLineArrows;

   if(timeLinePrograms.selectIndex+1 == timeLinePrograms.maxItem){
		timeLineArrows.data.right = false;
		timeLineArrows.refresh();
	}else{
		if(timeLinePrograms.selectIndex == 0){
			timeLineArrows.data.left = false;
			timeLineArrows.refresh();
		}else{
			timeLineArrows.data.right = true;
			timeLineArrows.data.left = true;
			timeLineArrows.refresh();
		}
	}
}
miniGuide.drawScrollDate = function drawScrollDate(_data){	
	this.draw = function draw(focus){
		var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();		

		var custo_t = JSON.stringify(this.themaData.program_2),
			custo_t = JSON.parse(custo_t);
		
		if(focus)
			custo_t.fill = "rgba(30,30,40,1)";
		
		Canvas.drawText(ctx, _data.txt, new Rect(0, 10, ctx.viewportWidth, ctx.viewportHeight), custo_t);
	
	ctx.drawObject(ctx.endObject());
	
	}
}
miniGuide.drawPrograms = function drawPrograms(_data){
	
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
			ctx.beginObject();
   			ctx.clear(); 


   		//fonts
   		var whiteBG = this.themaData.whitePanel,
   			fillBlue = this.themaData.fillBlue,
   			fillGray = this.themaData.fillGray,
   			fillBase = this.themaData.fillBase,
   			fillPink = this.themaData.fillPink,
   			custo_t = JSON.stringify(this.themaData.program),
			custo_t = JSON.parse(custo_t),
   			pogram_num = this.themaData.program_2,
   			date_program = this.themaData.date_program,
   			date_blue = JSON.stringify(this.themaData.date_blue),
			date_blue = JSON.parse(date_blue);
   		
		
		
		var tEnd = _data.ChannelVO.program.ProgramVO.endTime,//time End
			tStart = _data.ChannelVO.program.ProgramVO.startTime;//time Start
			
			
   		var custoBackground = {
        	"stroke":         "rgba(240,240,250,1)",
        	"stroke_width":   5,
        	"stroke_pos" : "inside"
        };
       
       	 //isCtv
   		if(_data.ChannelVO.isCtv)
			tp_draw.getSingleton().drawImage("img/tv/anytime/anytimeOn.png", ctx, 0, 1);
		else if(_data.ChannelVO.isNpvr)
			tp_draw.getSingleton().drawImage("img/tv/anytime/anytimeOff.png", ctx, 0, 1); 
   	
        //logo	
   		if(_data.ChannelVO.images.url1X1)
   			tp_draw.getSingleton().drawImage(_data.ChannelVO.images.url1X1, ctx, 112, 5);	
   		
   		//number
   		if(_data.ChannelVO.number)
   			Canvas.drawText(ctx,"<!b>"+_data.ChannelVO.number+"<!>", new Rect(112,45,70,68), pogram_num);//number

   		if(focus){
   			if(_data.ChannelVO.type == "I" || _data.ChannelVO.type == "S"){
					if(_data.ChannelVO.images.url13X2){
						//custo_t.fill = "rgba(30,30,40,1)";
						custo_t.fill = "rgba(240,240,250,1)";
   						tp_draw.getSingleton().drawImage(_data.ChannelVO.images.url13X2, ctx, 195, 0,null,null,nul,"destination-over");
   						//Canvas.drawShape(ctx, "rect", [195,0,826,ctx.viewportHeight], {"fill":"rgba(240,240,250,.5)"});	
   					}
   					Canvas.drawShape(ctx, "rect", [195,0,826,ctx.viewportHeight], custoBackground);
   			
   			}else{
   				custo_t.fill = "rgba(30,30,30,1)";
   				Canvas.drawShape(ctx, "rect", [195,0,826,ctx.viewportHeight], whiteBG);
   			}
   		
   		}else{
   		
   			if(_data.ChannelVO.type == "I" || _data.ChannelVO.type == "S"){
   					if(_data.ChannelVO.images.url13X2){
   						tp_draw.getSingleton().drawImage(_data.ChannelVO.images.url13X2, ctx, 195, 0,null,null,null,"destination-over");
  						Canvas.drawShape(ctx, "rect", [195,0,826,ctx.viewportHeight], {"fill":"rgba(30,30,40,.5)"});	
   					}
   					Canvas.drawText(ctx, _data.ChannelVO.program.ProgramVO.name, new Rect(204,22,826,ctx.viewportHeight), custo_t)
   			}
   		
   		}
   		
   		if(_data.ChannelVO.type == "S"){
   			Canvas.drawText(ctx, _data.ChannelVO.program.ProgramVO.name, new Rect(204,22,826,ctx.viewportHeight), custo_t);	
			Canvas.drawText(ctx, "Ok para", new Rect(1014,10,200,ctx.viewportHeight), date_program);
			Canvas.drawText(ctx, "Ir al canal", new Rect(1014,34,200,ctx.viewportHeight), date_program);	
		
		}else if(_data.ChannelVO.type == "I" || _data.ChannelVO.type == "M"){
			
			Canvas.drawText(ctx, _data.ChannelVO.name, new Rect(204,22,826,ctx.viewportHeight), custo_t);
			
			Canvas.drawText(ctx, "Ok para", new Rect(1014,10,200,ctx.viewportHeight), date_program);
			
			if(_data.ChannelVO.type == "M")
				Canvas.drawText(ctx, "Ir a Mosaico", new Rect(1014,34,200,ctx.viewportHeight), date_program);
			else
				Canvas.drawText(ctx, "Abrir App", new Rect(1014,34,200,ctx.viewportHeight), date_program);	
		}else{
			//name Program
			if(_data.ChannelVO.program.ProgramVO.name){
				Canvas.drawText(ctx, _data.ChannelVO.program.ProgramVO.name, new Rect(204,22,800,ctx.viewportHeight), custo_t);
 			}else{
 				if(!_data.loading)
 					Canvas.drawText(ctx, "Programa desconocido", new Rect(204,22,800,ctx.viewportHeight), custo_t);
 				else
 					Canvas.drawText(ctx, "<!i>Cargando...<!>", new Rect(204,22,800,ctx.viewportHeight), custo_t);
	 		}

	 		if(_data.ChannelVO.program.ProgramVO.profileLoked){
				tp_draw.getSingleton().drawImage("img/tv/badgePadlock.png", ctx, 993, 34);
		
			}else{
				if(_data.ChannelVO.program.ProgramVO.isPopular)
	 				tp_draw.getSingleton().drawImage("img/tv/badgePopular.png", ctx, 993, 34);
			
			}
			//Reminder
			if(_data.ChannelVO.program.ProgramVO.hasReminder)
	 			tp_draw.getSingleton().drawImage("img/tv/badgeRecordatorio.png", ctx, 176, 20);	
			//nube
	 		//	tp_draw.getSingleton().drawImage("img/tv/badgeGrabacion.png", ctx, 176, 34);	
			
			//Tweet Feed
			if(_data.ChannelVO.program.ProgramVO.tweetFeed)
				tp_draw.getSingleton().drawImage("img/tv/twitterOn.png", ctx, 1027, 27);
			else if(_data.ChannelVO.program.ProgramVO.tweetFeed == "Y")
				tp_draw.getSingleton().drawImage("img/tv/twitterOn.png", ctx, 1027, 27);

			//dates
			if(tStart || tEnd)
				Canvas.drawText(ctx, startTimeEndTime(tStart,tEnd), new Rect(1014,10,200,ctx.viewportHeight), date_program);
			else
				Canvas.drawText(ctx, "<!i>--:-- hrs / --:-- hrs<!>", new Rect(1014,10,200,ctx.viewportHeight), date_program);
			
			//barra
			Canvas.drawShape(ctx, "rect", [195,64,826,4], fillBase);
			
			if(!_data.loading){
				if(tEnd < _data.ChannelVO.todayDate.getTime()){
					//pasado
						var color = fillGray;
						date_blue.fill = "rgba(170, 170, 180, 1)";
						if(_data.ChannelVO.program.ProgramVO.isCtvRecorded || _data.ChannelVO.program.ProgramVO.isNpvrRecorded){
							color = fillPink;
							date_blue.fill = "rgba(230, 0, 120, 1)";
						}
	
						Canvas.drawShape(ctx, "rect", [195,64,826,4], color);
						Canvas.drawText(ctx, _data.ChannelVO.dateProgram, new Rect(1014,34,200,ctx.viewportHeight), date_blue);					
						
				}else{
					if(tStart < _data.ChannelVO.todayDate.getTime() && tEnd > _data.ChannelVO.todayDate.getTime()){
	
						Canvas.drawText(ctx, timeLeft(tStart,tEnd), new Rect(1014,34,200,ctx.viewportHeight), date_blue);
		   				//barra
						var xProgreso = percent(tStart,tEnd, 826);
		   				//Canvas.drawShape(ctx, "rect", [195,64,826,4], fillGray);
						Canvas.drawShape(ctx, "rect", [195,64,xProgreso,4], fillBlue);
						Canvas.drawShape(ctx, "rect", [xProgreso+195,64,1,4],{"fill" : "rgba(240, 240, 250, 1)"});
					}else{
						date_blue.fill = "rgba(170, 170, 180, 1)";
						Canvas.drawText(ctx, _data.ChannelVO.dateProgram, new Rect(1014,34,200,ctx.viewportHeight), date_blue);					
					}
				}
			}else{
				Canvas.drawText(ctx, "<!i>--:-- hrs<!>", new Rect(1014,34,200,ctx.viewportHeight), date_blue);
			}
		}
   	ctx.drawObject(ctx.endObject());
	}			
}

miniGuide.drawTimeLinePrograms = function drawTimeLinePrograms(_data){
	this.draw = function draw(focus) {
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		var	custo_t = JSON.stringify(this.themaData.program_2);
			custo_t = JSON.parse(custo_t),
			custo_t.font_size = 20,
   			colorBg = this.themaData.colorBg,
			fillGray = this.themaData.fillGray,
			fillBase = this.themaData.fillBase,
			fillPink = this.themaData.fillPink,
			fillBlue = this.themaData.fillBlue;
			
			
		var	custo_f = JSON.stringify(this.themaData.program_2);
			custo_f = JSON.parse(custo_f),
			custo_f.font_size = 18 * tpng.thema.text_proportion,
			custo_f.fill = "rgba(170,170,180,1)";
				
		var tEnd = _data.ProgramVO.endTime,//time End
			tStart = _data.ProgramVO.startTime;//time Start
		
		if(focus){
		 	custo_t.fill = "rgba(30,30,40,1)";
		 	custo_f.fill = "rgba(90,90,100,1)";
			colorBg = this.themaData.colorBgWhite;
			
		 }

		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], colorBg);
		Canvas.drawText(ctx, _data.ProgramVO.name, new Rect(10,15,ctx.viewportWidth-10,ctx.viewportHeight), custo_t);//Program name
		Canvas.drawText(ctx, startTimeEndTime(tStart,tEnd), new Rect(0,45,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		Canvas.drawShape(ctx, "rect", [0,72,ctx.viewportWidth,4], fillBase);

	
		if(_data.ProgramVO.profileLoked)
			tp_draw.getSingleton().drawImage("img/tv/badgePadlock.png", ctx, ctx.viewportWidth-50, 45);
		else{
			if(_data.ProgramVO.hasReminder)
				tp_draw.getSingleton().drawImage("img/tv/badgeRecordado.png", ctx, ctx.viewportWidth-50, 45);
		} 
		
		if(tEnd < tActual.getTime()){
			//pasado
			
			if(_data.ProgramVO.isCtvRecorded || _data.ProgramVO.isNpvrRecorded)
					Canvas.drawShape(ctx, "rect", [0,72,ctx.viewportWidth,6], fillPink);
				else
					Canvas.drawShape(ctx, "rect", [0,72,ctx.viewportWidth,6], fillGray);		
		
		}else{
			if(tStart < tActual.getTime() && tEnd > tActual.getTime()){
				//actual
				var xProgreso = percent(tStart,tEnd, 390);
				Canvas.drawShape(ctx, "rect", [0,72,xProgreso,4], fillBlue);
				Canvas.drawShape(ctx, "rect", [xProgreso,72,1,4],{"fill" : "rgba(240, 240, 250, 1)"});
			}	
		}
	ctx.drawObject(ctx.endObject());
	}
}
miniGuide.drawDateBg = function drawDateBg(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();

		var custo_t = JSON.stringify(this.themaData.program_2),
			custo_t = JSON.parse(custo_t);
			custo_t.fill = "rgba(30,30,40,1)";
			custo_t.text_align = "right,top",
			custo_t.font_size = 17 * tpng.thema.text_proportion,
			color = this.themaData.colorBg,
			imgLeft = "img/tv/arrowLeftOff.png",
			imgRight = "img/tv/arrowRightOff.png";
		
		//Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight],{"fill":"rgba(170,170,180,.8)"} );
		
		tp_draw.getSingleton().drawImage("img/help/4x2-oksalir.png", ctx, 764,0,null,null,null,"destination-over");			
		Canvas.drawText(ctx, "Presiona Menú/Atrás para salir", new Rect(0,5,ctx.viewportWidth-64,ctx.viewportHeight), custo_t);
		if(_data.focus){
			imgLeft = "img/tv/arrowLeftOnCLEAN.png";
			imgRight = "img/tv/arrowRightOnCLEAN.png";
			color = this.themaData.colorDate;
		}
		Canvas.drawShape(ctx, "rect", [378,0,262,ctx.viewportHeight],color);
		
		if(_data.left){
			tp_draw.getSingleton().drawImage(imgLeft, ctx, 378,5);
		}
		if(_data.right){
			tp_draw.getSingleton().drawImage(imgRight, ctx, 610,5);
		}
	ctx.drawObject(ctx.endObject());
}
//
miniGuide.drawBlackBg = function drawBlackBg(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], this.themaData.darkBlackPanel_m);
		ctx.drawObject(ctx.endObject());
}
//logo fecha
miniGuide.drawTimeLineLogo = function drawTimeLineLogo(_data){

	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
			
		var custo_t = JSON.stringify(this.themaData.program),
			custo_t = JSON.parse(custo_t);
			custo_t.text_align = "center,middle",
			custo_t.font_size = 17 * tpng.thema.text_proportion;
				
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], this.themaData.colorBg);	
			
	   		if(_data.isCtv)
				tp_draw.getSingleton().drawImage("img/tv/anytime/AnytimetvBadgeON.png", ctx, 0, 0);
			else if(_data.isNpvr)
				tp_draw.getSingleton().drawImage("img/tv/anytime/AnytimetvBadgeOFF.png", ctx, 0, 0); 
   	
			tp_draw.getSingleton().drawImage(_data.images.url1X1, ctx, 100, 1);
	   		Canvas.drawText(ctx, ""+_data.number, new Rect(35, 4, 58,32), custo_t);
	ctx.drawObject(ctx.endObject());
}


//Background timeLine
miniGuide.drawTimeLineBg = function drawTimeLineBg(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], this.themaData.darkBlackPanel_m);	
		ctx.drawObject(ctx.endObject());
}
//flechas de la fecha
miniGuide.drawTimeLineArrows = function drawTimeLineArrows(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();

		if(_data.left){
			tp_draw.getSingleton().drawImage("img/tv/arrowLeftOn.png", ctx, 40,19);
		}
		if(_data.right){
			tp_draw.getSingleton().drawImage("img/tv/arrowRightOn.png", ctx, 436,19);
		}
	ctx.drawObject(ctx.endObject());
}
//barra de canales
miniGuide.drawChannelNumberBar = function drawChannelNumberBar(_data){ 	
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		
		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 56 * tpng.thema.text_proportion;
			
		var custoBackground = {
	       		"fill":           "0.5-rgba(28, 121, 156, .8)|1-rgba(5, 65, 100, .8)",
	        	"fill_coords":    "0,0,.3,-2",
	        	"stroke":         "rgba(90,90,100, 1)",
	        	"stroke_coords":  "1,0,0,0",
	        	"stroke_width":   2,
	    	};
	    	
		_data.number = _data.number.toString();
		if(_data.number.length < 3)
			_data.number = _data.number + "_";
			
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoBackground);
		Canvas.drawText(ctx, "<!size=22>ir a canal<!>" + "<!placeholder=30>"+ _data.number+ "<!>", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);	
		
	ctx.drawObject(ctx.endObject());	
}

miniGuide.prototype.onExit = function onExit(_data){
	var widgets = this.widgets;
	this.client.lock();
		widgets.dateBg.stateChange("exit");
		widgets.blackBg.stateChange("exit");
		widgets.scrollDate.stateChange("exit");
		widgets.programs.stateChange("exit");
	this.client.unlock();
	this.home.hideHeader();
	this.home.hideMoreInfo();
	clearTimeout(this.timerExit);
	clearTimeout(this.timeInfoSpeed);
	clearTimeout(this.timerChannel);
	clearTimeout(this.timerprog);
	clearTimeout(this.timerExit1);
	clearTimeout(this.timeScroll);
	//this.home.closeSection(this);
}