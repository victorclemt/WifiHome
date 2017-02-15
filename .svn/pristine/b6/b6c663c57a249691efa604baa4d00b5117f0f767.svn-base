// vodWizzard.js
function vodWizzard(_json, _options){
   	this.super(_json, _options);
   	this.indexBg=true;
   	this.lockKey = true;
   	this.active = true;	
}
vodWizzard.inherits(FormWidget);

vodWizzard.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
		getServices.getSingleton().call("VOD_GET_WIZZARD", ["club=TRANS&maxRows=10"],  this.responseGetWizzard.bind(this));		
}
vodWizzard.prototype.responseGetWizzard = function responseGetWizzard(responseCode){
	if(responseCode.status == 200){
		var widgets = this.widgets,
			button = [],
			arrButton = null;	
		
		var arrWizzard = responseCode.data.ResponseVO.arrayWizzard;
			this.client.lock();	
			this.home.showHeader({"section":"vod","stroke":"rgba(130, 60, 150, 1)"});
			for (var i = 0; i < arrWizzard.length; i++){
				arrWizzard[i].VodMovieVO.qualify = 0;
			}
			widgets.scrollQualify.setData(arrWizzard);
			widgets.label.setData("");
			
			button.push({"label":"Omitir esté paso", "action":"OMITIR"});
		
			widgets.button.setData(button);
			widgets.button.stateChange("enter");
			widgets.label.stateChange("enter");
			widgets.scrollQualify.stateChange("enter");
			this.activeFocus = "scrollQualify";
	this.client.unlock();	
	}
}
vodWizzard.prototype.responseSendQualifyVods = function responseSendQualifyVods(responseCode){
	if(responseCode.status == 200){
		if(responseCode.data.ResponseVO.status > 0){
			tpng.menu.data = [];
	 		tpng.menu.tsMenu = "";
	 		tpng.menu.lastMenuIndex = 0;
			this.home.openSection("vodHome", {"name": "vodHome", "home":this.home}, true);
		}else{
			this.home.openSection("miniError", {"home": this.home,"code":responseCode.data.ResponseVO.status, "message":responseCode.data.ResponseVO.message, "suggest":responseCode.data.ResponseVO.suggest}, false);
		}
	}else{
		this.home.openSection("miniError", {"home": this.home,"code":responseCode.status, "message":responseCode.error.message, "suggest":responseCode.error.suggest}, false);
	}
}
//TODO: ver si esta función la pasamos a la librería IMG
vodWizzard.prototype.loadPaintImg = function loadPaintImg(_url){
	//Función que pinta la imagen hasta que se descarga
	//Para transiciones de vodHome, menú y wizard VOD
	var o = {"home":this.home}; //Argumentos que mandamos a la función callback
	//Verificamos que la imagen esté en caché
	var img = NGM.imageCache.getLocal(_url);
	//Si está en cache mandamos directamente a la función callback
    if (img) {
    	//NGM.trace("desde cache: ");
        this.imgLoadCb(_url, img, o);
        return;
    }else{
    //sino descargamos la imagen del backend y enviamos la función callback
    	//NGM.trace("descargando imagen: ");
		var options = {"id"        : _url,
	                   "noload"    : false,
	                   "persistent": true,
	                   "expireIn"  : 12*60*60,    // could be replace by this.expireIn for setting management
	                   "callback"  : this.imgLoadCb,
	                   "opaque"    : o};
	     NGM.imageCache.add(_url, options);
     }
}

vodWizzard.prototype.imgLoadCb = function imgLoadCb(url, img, arg){
	//Función callback que setea la imagen en el background principal
	//del HOME, adicional cambia el speed de entrada para lograr una 
	//mejor transición.
	if(img.size){
		var bg = arg.home.widgets.mainBg;
		bg.setData(img);
		bg.stateChange("enter",500);
	}	
//	delete img;
	//Importante siempre borrar la imagen para no llenar la buffer gráfico.
}


vodWizzard.prototype.setBackground = function setBackground(_url){

	var bg = this.home.widgets.mainBg;

	//Antes de la carga de la imagen pasamos a medium el background
	//para lograr el efecto de medium a enter
	bg.stateChange("medium");
	this.loadPaintImg(_url);
}
vodWizzard.prototype.onKeyPress = function onKeyPress(_key){
	
	switch(this.activeFocus){
		case "scrollQualify":
			this.onKeyPress_ScrollQualify(_key);
		break;
		case "button":
			this.onKeyPress_Button(_key);
		break;
	}
	return true;	
}	
vodWizzard.prototype.onKeyPress_ScrollQualify = function onKeyPress_ScrollQualify(_key){
	
	var	bg = this.home.widgets.mainBg,
		widgets = this.widgets;

	if(this.lockKey){	
		this.lockKey = false;
		this.setKeyTrue.bind(this).delay(300);	
		switch(_key){
			case "KEY_IRENTER":
			if(this.active){
				var button = [];
				button.push({"label":"Terminar", "action":"TERMINAR"});
				
				widgets.button.setData(button);
				widgets.button.setFocus(false,0);
				widgets.button.refresh();
				
				this.active = false;
			}
			
			if(widgets.scrollQualify.selectItem.VodMovieVO.qualify < 5){
				var indexQualify = widgets.scrollQualify.selectItem.VodMovieVO.qualify;
				widgets.scrollQualify.selectItem.VodMovieVO.qualify = indexQualify + 1;
				widgets.scrollQualify.redraw(true);
			}else if(widgets.scrollQualify.selectItem.VodMovieVO.qualify == 5){
				this.indexQualify = 0;
				widgets.scrollQualify.selectItem.VodMovieVO.qualify = this.indexQualify;
				widgets.scrollQualify.redraw(true);
			}	
				
			break;
			case "KEY_MENU":
			case "KEY_IRBACK":
				this.home.closeSection(this);
			break;
			
			case "KEY_LEFT":
			case "KEY_RIGHT":
				_key == "KEY_LEFT" ? widgets.scrollQualify.scrollPrev() : widgets.scrollQualify.scrollNext();
			break;
			case "KEY_DOWN":
				widgets.scrollQualify.setFocus(false);
				widgets.button.setFocus(true);
				this.activeFocus = "button";
			break;
		}	
	}
	return true;
}
vodWizzard.prototype.onKeyPress_Button = function onKeyPress_Button(_key){

	var	bg = this.home.widgets.mainBg,
		widgets = this.widgets;
	if(this.lockKey){	
		this.lockKey = false;
		this.setKeyTrue.bind(this).delay(300);
		switch(_key){
		
			case "KEY_UP":
				widgets.button.setFocus(false);
				widgets.scrollQualify.setFocus(true);
				this.activeFocus = "scrollQualify";
			break;
			case "KEY_MENU":
			case "KEY_IRBACK":
				this.home.closeSection(this);
			break;
			case "KEY_IRENTER":
				switch(widgets.button.selectItem.action){
					case "OMITIR":
					getServices.getSingleton().call("VOD_SEND_QUALIFY_VODS", ["club=TRANS&vods=-1"],  this.responseSendQualifyVods.bind(this));		
					break;
					case "TERMINAR":
						getServices.getSingleton().call("VOD_SEND_QUALIFY_VODS", ["club=TRANS&vods="+this.qualify()],  this.responseSendQualifyVods.bind(this));		
					break;
				}
			break;
		}
	}	
		return true;
}
vodWizzard.prototype.qualify = function qualify(){
	var str = "",
		widgets = this.widgets;
		
		for(var i=0; i<widgets.scrollQualify.maxItem; i++){
			var a = str += widgets.scrollQualify.list[i].VodMovieVO.vodId+":"+widgets.scrollQualify.list[i].VodMovieVO.qualify+",";
		}
		
	var newStr = str.substring(0, str.length-1);	
	
	return newStr;
}

vodWizzard.prototype.setKeyTrue = function setKeyTrue(){
	this.lockKey = true;
}
vodWizzard.prototype.onQualifyFocus = function onQualifyFocus(_focus,_data){
	clearTimeout(this.timerLoadData);
	if(_focus){
		this.timerLoadData = setTimeout(function(){
			this.widgets.counter.setData({"index":(_data.index+1),"maxItem":this.widgets.scrollQualify.maxItem});
			this.setBackground(_data.item.VodMovieVO.images.url18X18);
		}.bind(this), 500); //regresar el delay a 1000
	}

}

vodWizzard.prototype.getButton = function getButton(_state){
	var button = [];
		if(_state)
			button.push({"label":"Omitir esté paso", "action":""});
		else
			button.push({"label":"Terminar", "action":""});
			
		return button;

}
vodWizzard.drawScrollQualify = function drawScrollQualify(_data){ 	
	
	this.draw = function draw(focus) {	
	var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
	  
	var custoBackground = {
        	"stroke":"rgba(240,240,250,1)",
        	"stroke_width": 5,
        	"stroke_pos" : "inside"
    	};	
    	
     var custo_f = JSON.stringify(this.themaData.standardFont);
		 custo_f = JSON.parse(custo_f);
		
		 custo_f.text_align = "center,top";
		 custo_f.font_size = 18 * tpng.thema.text_proportion;
		 custo_f.fill = "rgba(240,240,250,1)";

	
	if(focus){
		Canvas.drawShape(ctx, "rect", [0,212,ctx.viewportWidth,40],{"fill":"rgba(240,240,250,1)"}); //FONDO
		custo_f.fill = "rgba(170,170,180,1)";
		Canvas.drawText(ctx, "Presiona OK para agregar o quitar estrellas", new Rect(0,260,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		custo_f.fill = "rgba(30,30,40,1)";
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,212],custoBackground); //FONDO
	}else{
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,212],{fill:"rgba(30,30,40,.3)"}); //FONDO
		
	}
	
	tp_draw.getSingleton().drawImage(_data.VodMovieVO.images.url6X6, ctx, 0, 0,null, null, null,"destination-over");
	
	var img = "";
	var msj = "";
	
	if(_data.VodMovieVO.qualify == 0){
		img = "img/vod/qualify/calificar0.png";
		msj = "Sin calificar";
	}else if(_data.VodMovieVO.qualify == 1){
  		img = "img/vod/qualify/calificar1.png";
  		msj = "Mala";
  	}else if(_data.VodMovieVO.qualify== 2){
  		img = "img/vod/qualify/calificar2.png";
  		msj = "Regular";
  	}else if(_data.VodMovieVO.qualify == 3){
  		img = "img/vod/qualify/calificar3.png";
  		msj = "Buena";
  	}else if(_data.VodMovieVO.qualify == 4){
  		img = "img/vod/qualify/calificar4.png";
  		msj = "Muy buena";
  	}else if(_data.VodMovieVO.qualify == 5){
		img = "img/vod/qualify/calificar5.png";
		msj = "Excelente";
  	}
	custo_f.text_align = "right,middle";

	Canvas.drawText(ctx, msj, new Rect(0,212,186,40), custo_f);
	tp_draw.getSingleton().drawImage(img, ctx, 192, 215);	
		
	ctx.drawObject(ctx.endObject());	
	}
}

vodWizzard.drawlabel = function drawlabel(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    
    
    //Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight],{fill:"rgba(30,30,40,.4)"}); //FONDO
 	
 	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "center,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
	
	Canvas.drawText(ctx, "Ayúdanos a calificar éstos títulos para poderte recomendar las películas que mas te interesan", new Rect(0,30,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
	custo_f.font_size = 30 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, "Dinos por favor,¿qúe piensas de estos títulos?", new Rect(0,64,ctx.viewportWidth,ctx.viewportHeight), custo_f);

	ctx.drawObject(ctx.endObject());	
}
vodWizzard.drawButton = function drawButton(_data){ 	
	
	this.draw = function draw(focus) {	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
		custo_f = JSON_Complete({	font_size:18, fill: "rgba(240,240,250,1)",
									font_family: "Oxygen-Regular",
									text_align: "center,middle",
									text_multiline:false});	
		
		if(focus){
			custo_f.fill = 	"rgba(30,30,40,1)";
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], {"fill":"rgba(230,230,240,1)"});
		}
		
		
		Canvas.drawText(ctx, _data.label, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
	
		ctx.drawObject(ctx.endObject());	
	}
}
vodWizzard.drawCounter = function drawCounter(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    
    var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "right,middle";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
	
	Canvas.drawText(ctx, "<!size=20>"+_data.index +"<!>/"+_data.maxItem, new Rect(0,6,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
	ctx.drawObject(ctx.endObject());	
}

vodWizzard.prototype.onExit = function onExit(_data){
	var widgets =  this.widgets;
	widgets.button.stateChange("exit");
	widgets.label.stateChange("exit");
	widgets.scrollQualify.stateChange("exit");
	clearTimeout(this.timerLoadData);
	this.home.hideHeader();
	this.home.hideBackground();
}