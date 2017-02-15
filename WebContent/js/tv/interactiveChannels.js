function interactiveChannels(_json, _options){
    this.super(_json, _options);
    this.channel;
}

interactiveChannels.inherits(FormWidget);


interactiveChannels.prototype.onEnter = function onEnter(_data){
	var w = this.widgets;
	//NGM.dump(this.widgets);
	this.home = _data.home;
	this.channel = _data
	//NGM.dump(this.home);
	var bg = this.channel.images.urlL;
	w.bg.setData(_data);
	w.bg.stateChange("enter");
}

interactiveChannels.drawBg = function drawBg(_data){
NGM.dump(_data);
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
	tp_draw.getSingleton().drawImage(_data.images.urlL,ctx, 0, 0);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}
interactiveChannels.prototype.onKeyPress = function onKeyPress( _key ){
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
    		this.setNumber(_key.substr(_key.length-1,1));
		break;
		
		case "KEY_TV_CHNL_UP":
	    case "KEY_TV_CHNL_UP_LONG":
	    case "KEY_TV_CHNL_DOWN":
	    case "KEY_TV_CHNL_DOWN_LONG":			
			this.home.closeSection(this);		
			return false;
    	break;
    	case "KEY_IRENTER":
    	
    	break;
	}    	
}	

interactiveChannels.prototype.setNumber = function setNumber(_num){	
	var widgets = this.widgets;
	tpng.app.channelNumber = tpng.app.channelNumber + _num;
	if(tpng.app.channelNumber.length <= 3){

		this.showChannelBar(tpng.app.channelNumber);
		
		var index = this.home.findChannelIndex(tpng.app.channelNumber,tpng.app.channelList);
		var timer = tpng.app.channelNumber.length < 3 ? 5000 : 1000;
		clearTimeout(this.timer);
		//AQUI HACE EL TUNEIN POR NÚMERO DE CANAL
		this.timer = setTimeout(function(){tpng.app.channelNumber ="",this.home.widgets.player.setData(),this.home.tuneInByNumber(tpng.app.channelList[index].ChannelVO.number*1,false,false)}.bind(this), timer);
		clearTimeout(this.timerExit);
		this.timerExit = setTimeout(function(){this.formClose(this)}.bind(this), 1200);
				
	}
	
}

interactiveChannels.prototype.showChannelBar = function showChannelBar(_num){
	var w = this.widgets.channelNumberBar;
		w.setData({"number": _num});
		w.stateChange("enter");
		w.refresh();
}

interactiveChannels.drawChannelNumberBar = function drawChannelNumberBar(_data){ 	
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		
		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 56*tpng.thema.text_proportion;
			
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

