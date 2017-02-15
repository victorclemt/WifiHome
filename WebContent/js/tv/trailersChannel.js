function trailersChannel(_json, _options){
    this.super(_json, _options);
    this.currentTrailer = 0; // en QA
    this.playList = [];
   
}

trailersChannel.inherits(FormWidget);

trailersChannel.prototype.onExit = function onExit(){
	this.home.setPlayerStatus("STOP");
	this.home.objectChild = null;
	unsetTimeAlarm(this.delay);
	
}

trailersChannel.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	
	this.home.objectChild = this;

	getServices.getSingleton().call("VOD_GET_TRAILERS", , this.responseGetTrailers.bind(this));
}


trailersChannel.prototype.responseGetTrailers = function responseGetTrailers(response){	
	if(response.status == 200 && response.error.error == null){	
		var a = this.widgets.available;		
		//Real
		this.playList = response.data.ResponseVO.vods;		
		this.widgets.trailerLogo.setData();
		this.widgets.trailerLogo.stateChange("enter");
		
		if(this.playList.length > 0){
			a.setData();
			
			this.playTrailers();
			this.showTrailerInfo();	
		}else{
			var w = this.widgets;
			w.mainBg.setData({"url":"img/tv/trailer/pelicula.jpg"});
			w.mainMessage.setData({"text":"Tu clasificación no es suficiente para mostrarte los tráilers actuales."});
			w.messageSub.setData({"text":"Inténtalo de nuevo más tarde."});
			w.mainMessage.stateChange("enter");
			w.messageSub.stateChange("enter");
			w.mainBg.stateChange("enter");
			this.frame = "nothing";				
			//TODO: qué haremos cuando no traiga trailers
			//supongo que una placa
		}
		
	}
	else{
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status},  false);			
	}
}

trailersChannel.prototype.playTrailers = function playTrailers() {
		var trailer = this.playList[this.currentTrailer].VodMovieVO;
		this.home.playVideo(trailer.urlTrailer+"", "HLS", 0); // QA: para no ver todo el trailer =/


}

trailersChannel.prototype.showTrailerInfo = function showTrailerInfo() { 
	var w = this.widgets,
		available = w.available,
		info = w.trailerInfo,	
		cover = w.cover,
		okAdvice = w.okAdvice,
		leftArrowTra = w.leftArrowTra,
		rightArrowTra = w.rightArrowTra;
		
	
	var trailer = this.playList[this.currentTrailer].VodMovieVO;
	info.setData(trailer);
	cover.setData(trailer);
	
	leftArrowTra.setData({"url": "img/tv/arrowLeftOn.png" ,"line": false, "position": "left"});
	rightArrowTra.setData({"url": "img/tv/arrowRightOn.png" ,"line": false, "position": "right"});
		
	this.client.lock();		
		available.stateChange("enter");
		cover.stateChange("enter");
		info.stateChange("enter");
		okAdvice.stateChange("enter");
		leftArrowTra.stateChange("enter");
		rightArrowTra.stateChange("enter");
	this.client.unlock();
	
	this.frame = "info";
}


trailersChannel.prototype.hideTrailerInfo = function hideTrailerInfo() {
	var w = this.widgets,
		info = w.trailerInfo,
		okAdvice = w.okAdvice,
		leftArrowTra = w.leftArrowTra,
		rightArrowTra = w.rightArrowTra;
	
	info.stateChange("exit");
	leftArrowTra.stateChange("exit");
	rightArrowTra.stateChange("exit");
	okAdvice.setData();
	okAdvice.stateChange("enter");

	this.frame = "cover";
}

trailersChannel.prototype.onStreamEvent = function onStreamEvent(event) {	

	
	switch(event.type){		
		case "starting":
			;
		break;
		case "start":
			//this.showTrailerInfo();	
			unsetTimeAlarm(this.delay);	
			this.delay = this.hideTrailerInfo.bind(this).delay(8000);			
		break;
		
		case "endOfFile":
		case "end":
			if(this.currentTrailer < this.playList.length-1) 						
				this.currentTrailer++;
			else
				this.currentTrailer = 0;
				//this.hideTrailerInfo();
			this.playTrailers();
			this.showTrailerInfo();	
		break;
		case "error":						
			;
		break;
	}	
}



trailersChannel.prototype.onKeyPress = function onKeyPress(_key){   	
    	
    	switch(this.frame){			
			case "info":
				this.onKeyPressInfo(_key); 
			break;
			case "cover":
				this.showTrailerInfo();	
				unsetTimeAlarm(this.delay);	
				this.delay = this.hideTrailerInfo.bind(this).delay(6000);
			break;
			
			case "nothing":
				switch(_key){
					case "KEY_TV_CHNL_UP":
					case "KEY_TV_CHNL_UP_LONG":
					case "KEY_TV_CHNL_DOWN":
					case "KEY_TV_CHNL_DOWN_LONG":
						this.home.closeAll();
						//this.home.closeSection(this);
						this.home.onKeyPressHome(_key);	
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
    					this.number = this.setNumber(_key.substr(_key.length-1,1));
					break;
				
				}
			break;
    	}
  return true;
}


trailersChannel.prototype.onKeyPressInfo = function onKeyPressInfo(_key){
	switch(_key){		
    	/*case "KEY_TV_GREEN":    		
    		this.formOpenChild("previews", {"home":this}, false);
    	break;*/
    	case "KEY_IRENTER":   			    	
	    		this.home.openSection("vodDetail", {"home":this.home, "VodMovieVO": this.playList[this.currentTrailer].VodMovieVO},true,,false);
    	break;
    	
    	case "KEY_RIGHT":
    		var w = this.widgets,
    			cover = w.cover,
    			info = w.trailerInfo,
    			available = w.available,
    			okAdvice = w.okAdvice;
    			
		    var points = [
		    	{"x":  160, "y": 578},
		    	{"x": -350, "y": 678}
		    ]		    
    		 var anim = cover.animation.move(points[0].x, points[0].y).setEnable().show();
    		 for (var i = 1, l = points.length; i < l; i++) {
		            anim.addPoint(anim.PARAM_X, points[i].x, 500).
		                 addPoint(anim.PARAM_Y, points[i].y, 500);
		        };
			anim.alpha(0,100);
        	anim.start(); 
        	available.stateChange("exit",500);
        	info.stateChange("exit",500);
        	okAdvice.stateChange("exit",500);
    		  		
    		this.currentTrailer++;
    		this.currentTrailer %= this.playList.length; 
    		this.playTrailers();
    		this.showTrailerInfo();	
    	break;
    	
    	case "KEY_LEFT":
    		var w = this.widgets,
    			cover = w.cover,
    			info = w.trailerInfo,
    			available = w.available,
    			okAdvice = w.okAdvice;
    			
		    var points = [
		    	{"x":   0, "y": 578},
		    	{"x": 160, "y": 578}
		    ]		    
    		 var anim = cover.animation.move(points[0].x, points[0].y).setEnable().show();
    		 for (var i = 1, l = points.length; i < l; i++) {
		            anim.addPoint(anim.PARAM_X, points[i].x, 500).
		                 addPoint(anim.PARAM_Y, points[i].y, 500);
		        };
			anim.alpha(0,100);
        	anim.start(); 
        	available.stateChange("exit",500);
        	info.stateChange("exit",500);
        	okAdvice.stateChange("exit",500);
    	   	
    		
    		if(this.currentTrailer > 0)
    			this.currentTrailer--;
    		else
    			this.currentTrailer = this.playList.length-1;
    		
    		
    		this.playTrailers();
    		this.showTrailerInfo();	
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
    		this.number = this.setNumber(_key.substr(_key.length-1,1));
		break;
		case "KEY_TV_CHNL_UP":
	    case "KEY_TV_CHNL_UP_LONG":
	    case "KEY_TV_CHNL_DOWN":
	    case "KEY_TV_CHNL_DOWN_LONG":
			this.home.closeAll();
			//this.home.closeSection(this);
			this.home.onKeyPressHome(_key);		
    	break;
    	
    	
	}
	return true;
}

trailersChannel.prototype.setNumber = function setNumber(_num){	
	var widgets = this.widgets;
	tpng.app.channelNumber = tpng.app.channelNumber + _num;
	if(tpng.app.channelNumber.length <= 3){

		this.showChannelBar(tpng.app.channelNumber);
		var timer = tpng.app.channelNumber.length < 3 ? 3000 : 1000;
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){
		
			var index = this.home.findChannelIndex(tpng.app.channelNumber,tpng.app.channelList);
		
			tpng.app.channelNumber ="";
			this.home.widgets.player.stateChange("exit");
			this.home.widgets.player.setData();
			this.home.tuneInByNumber(tpng.app.channelList[index].ChannelVO.number*1,false,false);
		}.bind(this), timer);
		clearTimeout(this.timerExit);
		this.timerExit = setTimeout(function(){this.home.closeSection(this)}.bind(this), timer);
				
	}
	
}

trailersChannel.prototype.showChannelBar = function showChannelBar(_num){
	var w = this.widgets.channelNumberBar;
		w.setData({"number": _num});
		w.stateChange("enter");
		w.refresh();
}


trailersChannel.prototype.createPoint = function createPoint(x, y)
{
    var canvas = new Canvas.JSCanvas();
    canvas.init(10, 10, 1, "red");

    canvas.animation.move(x, y).setEnable().show().start();

    return {
        "x": x,
        "y": y,
        "c": canvas
    };
}




trailersChannel.drawOkAdvice = function drawOkAdvice(_data){	

		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 
		
		var custo = JSON.stringify(this.themaData.standardFont);
		custo = JSON.parse(custo);
		custo.font_size = 16* tpng.thema.text_proportion;
		custo.fill = "rgba(240,200,255,1)";	
		custo.text_align = "left,top";
		Canvas.drawText(ctx, "Presiona OK para más información.", new Rect(259,195,700,32), custo);	
		
		ctx.drawObject(ctx.endObject());
	
}

trailersChannel.drawTrailerInfo = function drawTrailerInfo(_data){	

		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 
		
		tp_draw.getSingleton().drawImage("img/tv/trailer/placa.png",ctx, 0, 124);
		
		var custo = JSON.stringify(this.themaData.standardFont);
		custo = JSON.parse(custo);
		custo.text_align = "left,bottom";
		custo.font_size = 16* tpng.thema.text_proportion;
		custo.fill = "rgba(240,200,255,1)";	
		Canvas.drawText(ctx, "Estás viendo cortos de:", new Rect(259,124,700,32), custo);
		
		custo.font_size = 20* tpng.thema.text_proportion;
		custo.fill = "rgba(255,240,200,1)";	
		custo.text_align = "left,middle";
		Canvas.drawText(ctx, _data.name, new Rect(259,159,700,32), custo);	
		
		custo.font_size = 16* tpng.thema.text_proportion;
		custo.fill = "rgba(240,200,255,1)";	
		custo.text_align = "left,top";
		Canvas.drawText(ctx, "Presiona OK para más información.", new Rect(259,195,700,32), custo);	
		
		custo.text_align = "right,middle";
		custo.fill = "rgba(255,240,200,1)";	
		Canvas.drawText(ctx, "¡Disponible ahora!", new Rect(963,139,186,32), custo);	
		
		custo.fill = "rgba(240,200,255,1)";
		custo.font_size = 24* tpng.thema.text_proportion;
		Canvas.drawText(ctx, "desde $"+_data.formats[0].VodFormatVO.price, new Rect(963,172,186,32), custo);	
		
		
		ctx.drawObject(ctx.endObject());
	
}

trailersChannel.drawTrailerLogo = function drawTrailerLogo(_data){	
		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 		
		tp_draw.getSingleton().drawImage("img/tv/totalPreview.png",ctx, 76, 40);
		ctx.drawObject(ctx.endObject());
	
}


trailersChannel.drawCover = function drawCover(_data){	
		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 

		tp_draw.getSingleton().drawImage(_data.images.url3X3,ctx, 2, 2);
		var custo = {"fill":"rgba(44,44,44,0)","stroke": "rgba(255,255,255,1)","stroke_width":4, "stroke_pos" : "inside"};
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){
			Canvas.drawShape(ctx, "rect",  new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo);	
		}.bind(this), 200);
		ctx.drawObject(ctx.endObject());
	
}

trailersChannel.drawAvailable = function drawAvailable(_data){	
		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 		
		tp_draw.getSingleton().drawImage("img/tv/trailer/available.png",ctx, 0, 0);
		ctx.drawObject(ctx.endObject());
	
}

trailersChannel.drawChannelNumberBar = function drawChannelNumberBar(_data){ 	
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

trailersChannel.drawBgTrailers = function drawBgTrailers(_data){

	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();   
     
     var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		 custo = JSON.parse(custo); 
   	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO  
	tp_draw.getSingleton().drawImage(_data.url,ctx, 0, 0,null,null,null,"destination-over");
	//tp_draw.getSingleton().drawImage("images/4e_Quiniela2014LOGO.png", true, ctx, 0, 0,null,null,null,"destination-over");	
    ctx.drawObject(ctx.endObject());
}

trailersChannel.drawMainMessageT = function drawMainMessageT(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,middle";
	custo_f.font_size = 28 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
	ctx.drawObject(ctx.endObject());	
}

trailersChannel.drawMessageT = function drawMessageT(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	

	custo_f.text_align = "center,middle";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	custo_f.fill = "rgba(180,40,60,1)";
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

trailersChannel.drawArrowsTra = function drawArrowsTra(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
    
	var custoW = {fill: "rgba(240,240,250,1)"};
	
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [0,0,1,ctx.viewportHeight], custoW);
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [0,0,1,ctx.viewportHeight], custoW);	
	
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 0);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}