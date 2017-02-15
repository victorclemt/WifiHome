function pipForm(_json, _options){
    this.super(_json, _options);
    this._userData = _options.userData;
    
    this.pipProgram = {
		"channel": null,
		"type": null,
		"channelName": null,
		"logo": null,
		"name": null,
		"isLocked": false,
		"hasPiP": false,
		"url":  "igmp://225.1.2.180:6180/49c"
	};
	
	this.position = 0;
	this.states = ["bottom_right", "top_right", "top_left", "bottom_left"];
	this.frame = "";
	
}

pipForm.inherits(FormWidget);


pipForm.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.frame = "info";
	this.getPipInfo(tpng.app.channelList[tpng.app.indexPip].ChannelVO);
}

pipForm.prototype.onExit = function onExit(){
	this.widgets.pip.setData();
}

pipForm.prototype.getPipInfo = function getPipInfo(_channel){

	var channel = NGM.main.getChannelByZap(_channel.number);
	NGM.trace("pip url: " + channel.dvbUrl);
	
	this.pipProgram.channel =  _channel.number+"";
	this.pipProgram.channelName = _channel.name+"";
	this.pipProgram.logo =  _channel.channelImageUrlS+"";
	this.pipProgram.url =  _channel.pipUrl+"";
	this.pipProgram.type = _channel.type+"";
	
	var channel = NGM.main.getChannelByZap(_channel.number+"");
	var program = NGM.epg.createByIndex(channel, 0);
			
	//Usar el IGMP del Multicast del XML.

	if(tpng.stb.target == "N7700")
		this.pipProgram.url = channel.dvbUrl;
	
	
	//NGM.dump(this.pipProgram);
	
	var xml = settings.get('totalplay.iptvcore.pipXML') ? true: false;	
	//Para pruebas: usar el PiP del XML.
	if(xml)	
		this.pipProgram.url =  channel.getData("pipUrl");
	
	//NGM.dump(program);
	this.matchPipInfo(program , "STB");
}

pipForm.prototype.matchPipInfo = function matchPipInfo(_program, _src){
	
	_program.isLocked = this.home.isLockedFunction(_program)?"Y":"N";	
	
	this.pipProgram.name = _program.nameProgram;
	if((!this.pipProgram.name || this.pipProgram.name == "Programa desconocido")){
		this.pipProgram.name = this.pipProgram.channelName;
	}
	
	this.pipProgram.isLocked = _program.isLocked;
	this.frame = "info";
	this.tuneIn(this.pipProgram);
}

pipForm.prototype.tuneInByIndex = function tuneInByIndex(_index){
	tpng.app.indexPip = _index;
	var channels = this.widgets.pipChannels;
	channels.setData(tpng.app.channelList, tpng.app.indexPip);
	channels.stateChange(this.getPosition());
	this.getPipInfo(channels.selectItem.LiveChannelVO);
}

pipForm.prototype.onStreamEvent = function onStreamEvent(event) {	
	NGM.trace(event.type);
	var bg = this.widgets.pipBg;	
	switch(event.type){		
		case "starting":
			bg.setData({"msg":"cargando video"});
		break;
		case "start":
			bg.setData({"msg":""});			
		break;
		case "error":						
			bg.setData({"msg":"error: " + event.subtype, "bg": "imgs/tv/pip/ss_falla.jpg"});
		break;
	}	
	bg.stateChange(this.getPosition());	
}

pipForm.prototype.swapPiP = function swapPiP(){
	var i = this.home.findChannel(tpng.app.currentChannel.number, tpng.app.channelList);		
	var p = this.pipProgram.channel;

	this.frame = "";	
	this.widgets.pip.setData(null);
	this.home.tuneInByNumber(p,true);
	this.tuneInByIndex.bind(this,i).delay(1000);			

}


pipForm.prototype.tuneIn = function tuneIn(_program){
	var pip = this.widgets.pip,
		bg = this.widgets.pipBg;	
		

	if(_program.hasPiP){
		if(_program.isLocked == "Y" && _program.type == "C"){
			pip.setData(null);
			bg.setData({"msg":"error" , "bg": "imgs/tv/pip/ss_bloqueado.jpg"});
			bg.stateChange(this.getPosition());	
			//unsetTimeAlarm(this.programInfoDelay);		 
			//this.programInfoDelay = this.hidePipInfo.bind(this).delay(2000);		
		}else if(_program.channel == tpng.app.currentChannel.number &&  _program.type == "C"){
			pip.setData(null);
			bg.setData({"msg":"|No puedes reproducir|" + _program.channelName+"|en ambos reproductores." , "bg": "imgs/tv/pip/ss_mismocanal.jpg"});
			bg.stateChange(this.getPosition());	
			//unsetTimeAlarm(this.programInfoDelay);		 
			//this.programInfoDelay = this.hidePipInfo.bind(this).delay(2000);
		}else if(_program.type == "C"){				
			pip.setData(null);		
			if(tpng.stb.target == "N7700"){			
				pip.setData(_program.url+"", {"playerType": "dvb", "pip":true});//señal PiP
			}else{
				pip.setData(_program.url+"", {"pip":true});//señal PiP
			}
			pip.stateChange(this.getPosition());	
		}else if(_program.type == "S"){
			pip.setData(null);
			bg.setData({"msg":"", "bg": "imgs/tv/pip/ss_nopuedes.jpg"});
		}
	}else{
		pip.setData(null);
		bg.setData({"msg":"", "bg": "imgs/tv/pip/ss_nopuedes.jpg"});
	}
	
	
}

pipForm.prototype.getPosition = function getPosition(){
	var x  = this.states[this.position];
	return this.states[this.position];
}

pipForm.prototype.changePipState = function changePipState(_direction){
	var last_state =  this.getPosition(),
		key = _direction;
	
	this.position += 1;
    this.position %= this.states.length;

    var state = this.getPosition();
    
    var w = this.widgets,
    	bg = w.pipBg,
    	pip = w.pip;
    
		pip.stateChange(pip.stateGet("")+"_exit");
        while (pip.client.compositerClient.getProperties().a != 0 || pip.client.compositerClient.getProperties().w != 0){}
                
        pip.stateChange(state+"_exit");
        while (pip.client.compositerClient.getProperties().a != 0 || pip.client.compositerClient.getProperties().w != 0){}        
        
        this.client.lock();
        	bg.stateChange(state);
        this.client.unlock();

        
   /*      
        var xpip = pip.curState[state].x-5,
            ypip = pip.curState[state].y-5;
//            bgx = optionsBg.client.compositerClient.getProperties().x,
//            bgy = optionsBg.client.compositerClient.getProperties().y;
        
        while(bgx != xpip || bgy != ypip){            
                bgx = optionsBg.client.compositerClient.getProperties().x;
                bgy = optionsBg.client.compositerClient.getProperties().y;                                
        } 
*/                   
        
       
        pip.stateChange(state);
}


pipForm.prototype.onKeyPress = function onKeyPress(_key){   	
    	switch(this.frame){
			case "info":
			case "pip":
				this.onKeyPressPip(_key); 
			break;
    	}
  return true;
}


pipForm.prototype.onKeyPressPip = function onKeyPressPip(_key){
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
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
		case "KEY_TV_CHNL_UP":
	    case "KEY_TV_CHNL_UP_LONG":
			this.home.nextChannel(); 
	    break;
    	case "KEY_TV_CHNL_DOWN":
	    case "KEY_TV_CHNL_DOWN_LONG":
			this.home.prevChannel();
    	break; 
    	
    	case "KEY_LEFT":
    	case "KEY_RIGHT":				
    	case "KEY_UP":
		case "KEY_DOWN":
		//	this.changePipState(_key);	
    	break;
    	
    	case "KEY_IRENTER":
    	//	this.swapPiP();
    	break;
    	
    	case "KEY_INFO":
  		
    	break;
	}
	return true;
}

pipForm.prototype.setNumber = function setNumber(_num){	
	var widgets = this.widgets;
	tpng.app.channelNumber = tpng.app.channelNumber + _num;
	if(tpng.app.channelNumber.length <= 3){

		this.showChannelBar(tpng.app.channelNumber);
		
		var index = this.home.findChannelIndex(tpng.app.channelNumber,tpng.app.channelList);

		var timer = tpng.app.channelNumber.length < 3 ? 5000 : 1000;
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){tpng.app.channelNumber ="",this.home.tuneInByNumber(tpng.app.channelList[index].ChannelVO.number*1,true,this)}.bind(this), timer);
		clearTimeout(this.timerExit);
		this.timerExit = setTimeout(function(){this.formClose(this)}.bind(this), 1200);
				
	}
	
}

pipForm.prototype.showChannelBar = function showChannelBar(_num){
	var w = this.widgets.channelNumberBar;
		w.setData({"number": _num});
		w.stateChange("enter");
		w.refresh();
}


pipForm.drawChannelNumberBar = function drawChannelNumberBar(_data){ 	
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		
		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 56;
			
		var custoBackground = {
	       		fill:           "0.5-rgba(28, 121, 156, .8)|1-rgba(5, 65, 100, .8)",
	        	fill_coords:    "0,0,.3,-2",
	        	stroke:         "rgba(90,90,90, 1)",
	        	stroke_coords:  "1,0,0,0",
	        	stroke_width:   2,
	    	};
	    	
		_data.number = _data.number.toString();
		if(_data.number.length < 3)
			_data.number = _data.number + "_";
			
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoBackground);
		Canvas.drawText(ctx, "<!size=22>ir a canal<!>" + "<!placeholder=30>"+ _data.number+ "<!>", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);	
		
	ctx.drawObject(ctx.endObject());	
}

pipForm.pipBg = function pipBg(_data){
	var ctx = this.getContext("2d");
    ctx.beginObject();
	ctx.clear(); 
	
	var custoW = {fill: "rgba(0,0,255,1)"};
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW); 
	
	var custoLoadText = this.themaData.custoLoadText,
		custoStrokePip  = this.themaData.custoStrokePip;

	Canvas.drawShape(ctx, "rect",  new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custoStrokePip);		
	
	if(_data.bg){
		
		custoStrokePip.fill = "rgba(0,0,0,0)"; 
		Canvas.drawShape(ctx, "rect",  new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custoStrokePip);	
		tp_draw.getSingleton().drawImage(_data.bg, false, ctx, 5, 5);	
	}else{			
		Canvas.drawShape(ctx, "rect",  new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custoStrokePip);
		if(_data.position)
			custo.text_align = "center,bottom";			
		Canvas.drawText(ctx, _data.msg , new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight-47), custoLoadText);
	}
	
	
	ctx.drawObject(ctx.endObject());
}
