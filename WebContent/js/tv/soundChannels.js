// soundChannels.js
FormWidget.registerTypeStandard("soundChannels");

function soundChannels(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.actualFocus;
}

soundChannels.inherits(FormWidget);

soundChannels.prototype.onEnter = function onEnter(_data){
	
	this.home = _data.home;
	var widgets = this.widgets;
	widgets.song.setData();
	widgets.song.stateChange("enter");
}

soundChannels.drawSong = function drawSong(){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     
	var custoText = JSON.stringify(this.themaData.standardFont);
	custoText = JSON.parse(custoText);	
	custoText.font_size = 40*tpng.thema.text_proportion;
	Canvas.drawText(ctx,"PLAY HARD", new Rect(259, 300,300, 100), custoText);
	custoW = {fill: "rgba(255,255,255,.7)"};
	Canvas.drawShape(ctx, "rect", [600, 300, 1, 200], custoW);	
   	custoText.font_size = 30*tpng.thema.text_proportion;
    Canvas.drawText(ctx,"Artista 							David Guetta", new Rect(637, 300,300, 100), custoText);	
    Canvas.drawText(ctx,"Album 								Single", new Rect(637, 350,300, 100), custoText);
    Canvas.drawText(ctx,"Año  								2013", new Rect(637, 400,300, 100), custoText);
    //Canvas.drawText(ctx,"Duración	David Guetta", new Rect(637, 450,ctx.viewportWidth, ctx.viewportHeight), custoText);
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}


soundChannels.prototype.onKeyPress = function onKeyPress( _key ){
	var w = this.widgets;
	switch(_key){
		/*case "KEY_TV_0":
		case "KEY_TV_1":
		case "KEY_TV_2":
		case "KEY_TV_3":
		case "KEY_TV_4":
		case "KEY_TV_5":
		case "KEY_TV_6":
		case "KEY_TV_7":
		case "KEY_TV_8":
		case "KEY_TV_9":*/	  
		case "KEY_TV_CHNL_UP":
	    case "KEY_TV_CHNL_UP_LONG":
	    case "KEY_TV_CHNL_DOWN":
	    case "KEY_TV_CHNL_DOWN_LONG":	
    	//case "KEY_IRENTER":	
    	//case "KEY_LEFT":
    	//case "KEY_RIGHT":
    	//case "KEY_UP":	
    	//case "KEY_DOWN":
			this.home.closeSection(this);		
			return false;
		break;
    	
    return true;	 
	}
}