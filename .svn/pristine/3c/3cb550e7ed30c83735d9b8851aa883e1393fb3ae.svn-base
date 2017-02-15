// suscription.js
FormWidget.registerTypeStandard("suscription");

function suscription(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
}

suscription.inherits(FormWidget);

suscription.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.alias = _data.club;
	this.update = _data.update;
	this.vodInfo = _data.vodInfo;
	
	var params = ["alias="+this.alias];
	getServices.getSingleton().call("ADMIN_GET_DESCRIPTION_ADDON", params,  this.responseGetDescription.bind(this));
	
}
suscription.prototype.onExit = function onExit(_data){
	this.widgets.stateChange("exit");
}


//TODO: ver si esta función la pasamos a la librería IMG
suscription.prototype.loadPaintImg = function loadPaintImg(_url){
	//Función que pinta la imagen hasta que se descarga
	//Para transiciones de vodHome, menú y wizard VOD
	var o = {"home":this.home}; //Argumentos que mandamos a la función callback
	//Verificamos que la imagen esté en caché
	var img = NGM.imageCache.get(_url);
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

suscription.prototype.imgLoadCb = function imgLoadCb(url, img, arg){
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


suscription.prototype.setBackground = function setBackground(_url){

	var bg = this.home.widgets.mainBg;

	//Antes de la carga de la imagen pasamos a medium el background
	//para lograr el efecto de medium a enter
	bg.stateChange("medium");
	this.loadPaintImg(_url);
}


suscription.prototype.responseGetDescription = function responseGetDescription(response){
	
	if(response.status == 200){
		this.bundleVO = response.data.ResponseVO.bundlesArray[0].BundleVO;
		
		this.home.showHeader({"section":this, "simple":true});
		
		this.widgets.line.setData("");
		this.widgets.line.stateChange("enter");
		
		this.setBackground(this.bundleVO.images.urlL);
		
		this.widgets.name.setData(this.bundleVO.name);
		this.widgets.name.stateChange("enter");
		
		this.widgets.description.setData(this.bundleVO.description);
		this.widgets.description.stateChange("enter");
		
		this.widgets.suscButtons.setData(["Si ir a pagar", "No, regresar"]);
		this.widgets.suscButtons.stateChange("enter");
		
		this.widgets.footerList.setData({"subtitle": this.bundleVO.terms});
		this.widgets.footerList.stateChange("enter");
		
		var params = ["values=0,0,0,7,0","club="+this.alias];
		getServices.getSingleton().call("RECOMMENDATION_GET_DATA", params,  this.responseGetRecomendations.bind(this));
	
		//this.widgets.footerList.setData({"title": this.bundleVO.name, "subtitle": this.bundleVO.terms});
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

suscription.prototype.responseGetRecomendations = function responseGetRecomendations(response){
	
	if(response.status == 200){
		this.arrayVod =  response.data.ResponseVO.vodArray;
		
		this.widgets.imgs.setData(this.arrayVod);
		this.widgets.imgs.stateChange("enter");		
		
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

suscription.prototype.openNextSection = function openNextSection(_allow){
	if(_allow){
		this.actualForm="comprando";
		if(this.alias){
			var params = ["alias="+this.alias];
		}else{
			var params = ["alias=SUSC"];
		}
		
		getServices.getSingleton().call("ADMIN_BUY_ADONS", params,  this.responseBuyAddons.bind(this));
	}else{
		this.actualForm="vod";
	}
}

suscription.prototype.responseBuyAddons = function responseBuyAddons(response){
	
	NGM.dump(response,3)
	
	if(response.status == 200){
		if(response.data.ResponseVO.status == 0){
			if(this.update){
				getServices.getSingleton().call("EPG_GET_CHANNEL_LIST", "",  this.responseSendSuscriptorChannels.bind(this));
			}else{
				if(this.vodInfo){
					this.widgets.stateChange("exit");
					this.home.hideHeader();
					this.home.hideBackground();
					//Si viene la información del VOD lo compramos y lo mandamos al player
					var password = tpng.backend.mac_address.replace( /:/g, "");	
					var ciphertext = encryptByDES(password, tpng.stb.key);
					
					//NGM.trace("--->");
					var nip = encryptByDES("-1", tpng.stb.keyNip);
					var params = ["vodId="+ this.vodInfo.vodId,"quality="+this.vodInfo.formats[0].VodFormatVO.quality,"passwd="+nip,"auth="+ciphertext];
					getServices.getSingleton().call("VOD_RENT_MOVIE", params, this.responseExecuteBuyVod.bind(this));
				}				
			}
		}else{
			this.home.openSection("miniError", {"home": this.home,"code":response.data.ResponseVO.status,"message":response.data.ResponseVO.message,"suggest":response.data.ResponseVO.suggest}, false);
		}
	}else if(response.status == 0){
		this.home.openSection("miniError", {"home": this.home, "code":response.status, "message":response.error.message,"suggest":response.error.suggest}, false);	
	}else{
		this.home.openSection("miniError", {"home": this.home, "code":response.status, "message":response.error.message,"suggest":response.error.suggest}, false);	
	
	}
}

/*
this.widgets.stateChange("exit");
this.home.showHeader();
this.home.hideBackground();
this.home.closeSection(this);
*/

/*
var params = ["vodId="+vodInfo.vodId+"&quality="+vodInfo.formats[0].VodFormatVO.quality+"&passwd=-1"];
getServices.getSingleton().call("VOD_RENT_MOVIE", params, this.responseExecuteBuyVod.bind(this));
*/

suscription.prototype.responseExecuteBuyVod = function responseExecuteBuyVod(response){
	if(response.status == 200){
		if(response.data.ResponseVO.status == 0){
			tpng.menu.data = [];
 			tpng.menu.tsMenu = "";
 			tpng.menu.lastMenuIndex = 0;
			this.home.openSection("vodPlayer", {"name": "vodPlayer", "home":this.home,"vodId":this.vodInfo.vodId, "isEncrypted":this.vodInfo.isEncrypted,"miniPlayer":true}, false, this);
		}else{
			this.home.openSection("miniError", {"home": this.home,"code":response.data.ResponseVO.status,"message":response.data.ResponseVO.message, "suggest":response.data.ResponseVO.suggest}, false);
		}
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

suscription.prototype.responseSendSuscriptorChannels = function responseSendSuscriptorChannels(response){
	if(response.status == 200){
		tpng.app.channelList = response.data.ResponseVO.channels;
		this.home.setChannelLists(tpng.app.channelList);	
		
		tpng.app.channelIndex = this.home.findChannelIndex(tpng.app.channelIndex);	
		
		var channels = this.home.widgets.channels;
		channels.list = tpng.app.channelList;
		channels.refresh();
		
		NGM.main.dmsCheck();
		
		this.widgets.stateChange("exit");
		this.home.showHeader();
		this.home.hideBackground();
		this.home.closeSection(this);
		
	}else if(response.error){	
		this.openSection("miniError", {"home": this,"code":response.status, "message":response.error.message,"suggest":response.error.suggest, "home": this}, false);		
	}	
}


suscription.prototype.onKeyPress = function onKeyPress(_key){
	var widgets = this.widgets;
	
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.widgets.stateChange("exit");
			this.home.showHeader();
			this.home.hideBackground();
			this.home.closeSection(this);
			break;
		case "KEY_LEFT":
			this.widgets.suscButtons.scrollPrev();
			break;
		case "KEY_RIGHT":
			this.widgets.suscButtons.scrollNext();
			break;
		case "KEY_IRENTER":
			switch(widgets.suscButtons.selectIndex){
				case 0:
					this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":"Es necesario ingresar el NIP del Administrador para acceder a este contenido", "txt1": "", "txt2": "", "txt3": ""}}, false,null,true);
					break;
				case 1:
					this.widgets.stateChange("exit");
					if(tpng.app.sections.length > 0){
						this.home.showHeader();
					}else{
						this.home.hideHeader();
					}
					
					this.home.hideBackground();
					this.home.closeSection(this);
					break;
			}
			break;
	}
	
	return true;
}





suscription.drawLine = function drawLine (_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
	Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth,ctx.viewportHeight],{"fill":"rgba(240,240,250,1)"});
	
	ctx.drawObject(ctx.endObject());
}


suscription.drawName = function drawName (_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
	var custo = JSON.stringify(this.themaData.custoDateNumber);
		custo = JSON.parse(custo);
	
	custo.font_size = 38* tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data, new Rect(0, 0, 442, ctx.viewportHeight), custo);
	//Canvas.drawShape(ctx, "rect",[467, 37, 1, 150],{"fill":"rgba(240,240,250,1)"});
	
	
	
	ctx.drawObject(ctx.endObject());
}


suscription.drawDescription = function drawDescription (_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
	var custo = JSON.stringify(this.themaData.custoDateNumber);
		custo = JSON.parse(custo);
	
	custo.font_size = 20* tpng.thema.text_proportion;
	custo.text_align = "left,middle";
	Canvas.drawText(ctx, _data, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo);
	
	
	
	ctx.drawObject(ctx.endObject());
}


suscription.drawSuscButtons = function drawSuscButtons(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   		ctx.clear();
   		
   		
   		var custo = focus ? this.themaData.whitePanel:{"fill":"rgba(0,0,0,0)"};
   		var custoTxt = focus ? this.themaData.standarBlackFont:  this.themaData.standarWhiteFont;
   		
   		custoTxt = JSON.stringify(custoTxt);
		custoTxt = JSON.parse(custoTxt);
		custoTxt.text_align = "center,top";
   		
        Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],custo);
		Canvas.drawText(ctx, _data, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custoTxt);
		
        
   		ctx.drawObject(ctx.endObject());
   	}
}

suscription.drawImgs = function drawImgs(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   		ctx.clear();
   		
   		tp_draw.getSingleton().drawImage(_data.ItemVO.images.url3X3, ctx, 0, 0);
        
   		ctx.drawObject(ctx.endObject());
   	}
}

