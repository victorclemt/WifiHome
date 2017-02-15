// welcomeAddOns.js


FormWidget.registerTypeStandard("welcomeAddOns");

function welcomeAddOns(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	
}

welcomeAddOns.inherits(FormWidget);

welcomeAddOns.prototype.onEnter = function onEnter(_data){
	tpng.app.sections = [];
	this.home=_data.home;
	this.home.hideHeader();
	this.categories = _data.channels;
	this.bundleVO = _data.bundleVO;
	this.widgets.bg.setData({"url":"img/tv/sinimagenFull.jpg"});
	this.widgets.bg.stateChange("enter");
	this.init();
	unsetTimeAlarm(this.hideScreenDelay);
	this.hideScreenDelay = this.hideFullScreen.bind(this).delay(6*1000); //Quitar en 8 segundos
}



welcomeAddOns.prototype.init = function init(){
	var widgets = this.widgets;
	widgets.vodPlayerInfo.setData({"message":"<!size=28>¡Disfruta tus nuevos canales!","expiration":""});
	widgets.vodLoadChannels.setData(this.bundleVO);
	widgets.vodPlayerInfo.stateChange("enter");
	widgets.vodLoadChannels.stateChange("enter");
	this.home.updateChannelList(true, this.categories[0].ChannelVO.number, null, true);
}


welcomeAddOns.prototype.hideFullScreen = function hideFullScreen (){
	this.widgets.stateChange("exit");
	this.formClose();
}

welcomeAddOns.drawVodPlayerInfo = function drawVodPlayerInfo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
     var custo_f = JSON.stringify(this.themaData.standardFont);
		 custo_f = JSON.parse(custo_f);
		 custo_f.text_align = "center,middle";
		 custo_f.font_size = 18 * tpng.thema.text_proportion;
		 custo_f.fill = "rgba(240, 240, 250, 1)";
	
		if(_data.message){
			Canvas.drawText(ctx,"" , new Rect(963, 182, 186, 32), custo_f);
			Canvas.drawText(ctx,"Gracias por tu renta.|"+_data.message+"||<!> <!color=rgba(110,60,130,1)>"+_data.expiration+"<!>" , new Rect(0, 542, ctx.viewportWidth, 104), custo_f);
		}else{
			Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth,ctx.viewportHeight],{"fill":"rgba(40,20,40,.5)"});
	    	Canvas.drawShape(ctx, "rect", [639, 290, 1,140],{"fill":"rgba(240, 240, 250, 1)"});
	    }
    ctx.drawObject(ctx.endObject());	
}

welcomeAddOns.drawVodPlayerfocus = function drawVodPlayerfocus(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	
	var custo = JSON.stringify(this.themaData.whiteStrokePanel)
		custo = JSON.parse(custo);
	
	
	var  custo_f = JSON.stringify(this.themaData.standardFont);
		 custo_f = JSON.parse(custo_f);
		 custo_f.text_align = "center,middle";
		 custo_f.font_size = 18 * tpng.thema.text_proportion;
		 custo_f.fill = "rgba(240, 240, 250, 1)";
		 
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	
	
	ctx.drawObject(ctx.endObject());	
}
welcomeAddOns.drawVodLoadChannels = function drawVodLoadChannels(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    		
    	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "center,middle";
		custo_f.font_size = 32 * tpng.thema.text_proportion;
		custo_f.fill = "rgba(240, 240, 250, 1)";
		
		Canvas.drawText(ctx, _data.name, new Rect(0, 108, ctx.viewportWidth, 68), custo_f);
		
   		custo_f.text_align = "center,middle";
		custo_f.font_size = 22 * tpng.thema.text_proportion;
   		Canvas.drawText(ctx, "Estamos activando tus canales.", new Rect(0, 180, ctx.viewportWidth, 32), custo_f);
   		
   		custo_f.text_align = "center,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
   		Canvas.drawText(ctx, "espera unos minutos para ver tu señal.", new Rect(0, 216, ctx.viewportWidth, 32), custo_f);
   		
		
	
	ctx.drawObject(ctx.endObject());	
}
