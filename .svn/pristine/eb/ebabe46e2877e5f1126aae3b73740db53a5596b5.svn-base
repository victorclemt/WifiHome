// vodHomeB.js

FormWidget.registerTypeStandard("vodHomeB");

function vodHomeB(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.indexBg=true;
   	clearTimeout(this.deleyPlayer);
   	clearTimeout(this.timerLoadData);
   	this.home;
   	this.indexHeaderFocus = 0;
   	
}

vodHomeB.inherits(FormWidget);

vodHomeB.prototype.onEnter = function onEnter(_data){
	NGM.trace(" ");
	NGM.trace("vodHomeB");
	
	//this.widgets.back.setData();
	this.home = _data.home;
	this.home.objectChild = this;
	this.alias = _data.parameters.alias;
	if(_data.parameters){
		switch(this.alias){
			var params;
			case "TRANS":
				params = ["club=TRANS" , "maxRows=300"];
				getServices.getSingleton().call("VOD_GET_CATEGORIES_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 10000);
				break;
			case "KIDS":
				this.alias = "TRANS";
				params = ["club=TRANS" , "maxRows=300"];
				getServices.getSingleton().call("VOD_GET_KIDS_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 10000);
				break;
			case "SUSC":
				params = ["club=SUSC" , "maxRows=300"];
				getServices.getSingleton().call("VOD_GET_CATEGORIES_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 10000);
				break;
			default:
				params = ["club="+this.alias , "maxRows=300"];
				getServices.getSingleton().call("VOD_GET_CATEGORIES_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 10000);
		}
	}else{
		this.alias = "TRANS";
		var params = ["club=TRANS" , "maxRows=300"];
		getServices.getSingleton().call("VOD_GET_CATEGORIES_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 10000);
	}
	
	
}


vodHomeB.prototype.onExit = function onExit(_data){
	this.home.objectChild = null;
	var widgets = this.widgets;
	
	
	
	this.client.lock();
		widgets.stateChange("exit");
		this.home.setPlayerStatus("STOP");
		this.home.objectChild = null;
		this.home.hideHeader();
		this.home.hideBg();
		clearTimeout(this.deleyPlayer);
		clearTimeout(this.timerLoadData);
	this.client.unlock();
}


vodHomeB.prototype.responseGetCategories = function responseGetCategories(response){
	
	if(response.status == 200){
		this.categories = response.data.ResponseVO.categories;
		if(response.data.ResponseVO.haveService == true || response.data.ResponseVO.haveService==false){
			this.haveService = response.data.ResponseVO.haveService;
		}
		
		for(var x = 0; x < this.categories.length; x++){
			this.categories[x].CategoryVO.focus=false;
		}
		this.categories[0].CategoryVO.focus=true;
		this.widgets.focusStrokePlayer.setData("");
		if(this.categories.length > 0){
			this.init();
		}else{
			this.home.openSection("miniError", {"home": this.home, "title": gettext("ERROR_TITLE"),"code":response.data.ResultVO.status}, false);
		}
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home,"code":response.status}, false);
	}
}

vodHomeB.prototype.responseGetSubCategories = function responseGetSubCategories(response){
	
	if(response.status == 200){
		this.subCategories = response.data.ResponseVO.categories;
		this.widgets.subCategoriesList.setData(this.subCategories);
		this.widgets.subCategoriesList.stateChange("enter");
		
		if(this.subCategories.length > 0){
			this.initSub();
		}else{
			this.home.openSection("miniError", {"home": this.home, "title": gettext("ERROR_TITLE"),"code":response.data.ResultVO.status}, false);
		}
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home,"code":response.status}, false);
	}
}

vodHomeB.prototype.responseSendWishlist = function responseSendWishlist(response){
	if(response.status == 200){
		var isInWishlist = false;
		if(response.data.ResponseVO.status == 0){
			isInWishlist = true;
		}
		this.widgets.wishBtn.data.isInWishlist = isInWishlist;
		this.widgets.vodList.list[this.widgets.vodList.selectIndex].VodMovieVO.isInWishlist = isInWishlist;
		this.widgets.wishBtn.refresh();
	}
}

vodHomeB.prototype.onStreamEvent = function onStreamEvent(event) {
	if(event.type == "end"){
		if(this.home.widgets.player.stateGet() == "enter"){
			this.showWid();
		}
	}
}

vodHomeB.prototype.init = function init(_data){
	this.home.showHeader({"section":this});
	var widgets = this.widgets;
	this.actualForm="headerList";
	widgets.headerList.setData("");
	widgets.categoriesList.setData(this.categories);
	
	widgets.vodList.setData(widgets.categoriesList.selectItem.CategoryVO.vodsArray);
	widgets.descriptionItem.setData(this.parseDescription(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0]));
	this.setBackground(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.images.url18X18);
	widgets.wishBtn.setData({"focus":false, "isInWishlist": widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.isInWishlist});
	
	if(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.isBuy){
			if(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.bookmark > 60000){
				bookmark = widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.bookmark-60000;
			}else{
				bookmark = 0;
			}
			
			this.home.playVideo(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.formats[0].VodFormatVO.url, "VIDEO", bookmark, "miniB");	
			this.home.widgets.player.stateChange("miniB");
			
			this.deleyPlayer = this.pausePlayer.bind(this).delay(60000);  //this.pausePlayer.bind(this).delay(120000);
			
		}else{
			if(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.urlTrailer){
				this.home.playVideo(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.urlTrailer, "VIDEO", 0, "miniB");
				this.home.widgets.player.stateChange("miniB");
			}else{
				this.home.setPlayerStatus("STOP");
			}
		}
	
	
	if(widgets.vodList.maxItem > 6){
		widgets.arrowsLR.setData({"left": false, "right": true, "total": widgets.vodList.maxItem});
	}else{
		widgets.arrowsLR.setData({"left": true, "right": false, "total": widgets.vodList.maxItem});
	}
	
	widgets.headerList.stateChange("enterOne");
	widgets.categoriesList.stateChange("enter");
	widgets.vodList.stateChange("enter");
	widgets.descriptionItem.stateChange("enter");
	widgets.wishBtn.stateChange("enter");
	widgets.arrowsLR.stateChange("enter");
	
}

vodHomeB.prototype.initSub = function initSub(_data){
	var widgets = this.widgets;
	
	widgets.subCategoriesList.setData(this.subCategories);
	
	widgets.vodList.setData(widgets.subCategoriesList.selectItem.CategoryVO.vodsArray);
	widgets.descriptionItem.setData(this.parseDescription(widgets.subCategoriesList.selectItem.CategoryVO.vodsArray[0]));
	this.setBackground(widgets.subCategoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.images.url18X18);
	widgets.wishBtn.setData({"focus":false});
	
	if(widgets.vodList.maxItem > 6){
		widgets.arrowsLR.setData({"left": false, "right": true, "total": widgets.vodList.maxItem});
	}else{
		widgets.arrowsLR.setData({"left": true, "right": false, "total": widgets.vodList.maxItem});
	}
	
	widgets.headerList.stateChange("enterOne");
	widgets.categoriesList.stateChange("enter");
	widgets.vodList.stateChange("enter");
	widgets.descriptionItem.stateChange("enter");
	widgets.wishBtn.stateChange("enter");
	widgets.arrowsLR.stateChange("enter");
	
	widgets.vodList.setFocus(true);
	this.actualForm="vod";
}

//TODO: ver si esta función la pasamos a la librería IMG
vodHomeB.prototype.loadPaintImg = function loadPaintImg(_url){
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

vodHomeB.prototype.imgLoadCb = function imgLoadCb(url, img, arg){
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


vodHomeB.prototype.setBackground = function setBackground(_url){

	var bg = this.home.widgets.mainBg;

	//Antes de la carga de la imagen pasamos a medium el background
	//para lograr el efecto de medium a enter
	bg.stateChange("medium");
	this.loadPaintImg(_url);
}


vodHomeB.prototype.animateWidgets = function animateWidgets(_widgets, _delay, _state, _callback, _index){		
	_index = _index ? _index : 0;
	if(_index == 0){
		//Siempre nos aseguramos quitar el control del onKeyPress
		this.actualFocus = "";
	}		
	if(_index < _widgets.length){
		if(_widgets[_index].length){
			var widgets = _widgets[_index];
			var state = _state[_index];	
			for(var i = 0, l = _widgets[_index].length ; i<l ; i++){
				widgets[i].stateChange(state[i]);
			}
			widgets = null;
		}else{
			_widgets[_index].stateChange(_state);
		}		
		_index++;
		this.animateWidgets.bind(this,_widgets, _delay, _state, _callback, _index).delay(_delay);
	}else{
		//Cuando termina de animar todo, regresa el control al onkeypress
		if(_callback){
			_callback();
		}else{
			return;
		}
		
	}
}


vodHomeB.prototype.onKeyPress = function onKeyPress(_key){
	switch(this.actualForm){
		case "search":
			this.onKeyPressSearch(_key);
			break;
			break;
		case "headerList":
			this.onKeyPressHeaderList(_key);
			break;
		case "subHeaderList":
			this.onKeyPressSubHeaderList(_key);
			break;
		case "wish":
			this.onKeyPressWish(_key);
			break;
		case "vod":
			this.onKeyPressVod(_key);
			break;
		case "movie":
			this.onKeyPressMovie(_key);
			break;
			
	}
	return true;
	
}

vodHomeB.prototype.onKeyPressHeaderList = function onKeyPressHeaderList(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_TV_VOD":
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.actualForm = "close";
			this.home.hideHeader();
			this.home.closeSection(this);
			break;
		case "KEY_LEFT":
			widgets.categoriesList.scrollPrev();
			break;
		case "KEY_RIGHT":
			widgets.categoriesList.scrollNext();
			break;	
		case "KEY_DOWN":
			widgets.categoriesList.scrollTo(this.indexHeaderFocus,{"duration":20000});
			if(widgets.subCategoriesList.stateGet() == "enter"){
				widgets.categoriesList.setFocus(false);
				widgets.subCategoriesList.setFocus(true);
				this.actualForm = "subHeaderList";
			}else{
				widgets.categoriesList.setFocus(false);
				widgets.wishBtn.data.focus = true;
				widgets.wishBtn.refresh();
				this.actualForm="wish";
			}
			
			break;
		case "KEY_UP":
			widgets.categoriesList.setFocus(false);
			this.home.enableSearchHeader();
			this.actualForm = "search";
			break;			
		case "KEY_IRENTER":
			clearTimeout(this.deleyPlayer);
			widgets.categoriesList.list[this.indexHeaderFocus].CategoryVO.focus = false
			this.indexHeaderFocus = widgets.categoriesList.selectIndex;
			widgets.categoriesList.selectItem.CategoryVO.focus=true;
			widgets.categoriesList.refresh();
			if(widgets.subCategoriesList.stateGet() == "enter"){
				widgets.subCategoriesList.setData();
				widgets.subCategoriesList.stateChange("exit");
			}
			
			
			this.setBackground(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.images.url18X18);
			widgets.vodList.stateChange("exit");
			widgets.vodList.animatedUpdateData(widgets.categoriesList.selectItem.CategoryVO.vodsArray, "exit", "enter");
			this.updateArrows.bind(this).delay(100);
			this.widgets.playerMessage.stateChange("exit");
			widgets.descriptionItem.setDataAnimated(this.parseDescription(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0]), "exit", "enter");
			//widgets.wishBtn.setData({"focus":false, "isInWishlist": widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.isInWishlist});
			widgets.wishBtn.setDataAnimated({"focus":false, "isInWishlist": widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.isInWishlist}, "exit", "enter");
			
			
			if(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.isBuy){
				if(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.bookmark > 60000){
					bookmark = widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.bookmark-60000;
				}else{
					bookmark = 0;
				}
				
				this.home.playVideo(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.formats[0].VodFormatVO.url, "VIDEO", bookmark, "miniB");	
				this.home.widgets.player.stateChange("miniB");
				
				this.deleyPlayer = this.pausePlayer.bind(this).delay(60000);  //this.pausePlayer.bind(this).delay(120000);
				
			}else{
				if(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.urlTrailer){
					this.home.playVideo(widgets.categoriesList.selectItem.CategoryVO.vodsArray[0].VodMovieVO.urlTrailer, "VIDEO", 0, "miniB");
					this.home.widgets.player.stateChange("miniB");
				}else{
					this.home.setPlayerStatus("STOP");
				}
			}
			
			break;
	}
}


vodHomeB.prototype.onKeyPressSubHeaderList = function onKeyPressSubHeaderList(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_TV_VOD":
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.actualForm = "close";
			this.home.hideHeader();
			this.home.closeSection(this);
			break;
		case "KEY_LEFT":
			widgets.subCategoriesList.scrollPrev();
			break;
		case "KEY_RIGHT":
			widgets.subCategoriesList.scrollNext();
			break;
		case "KEY_DOWN":
			widgets.subCategoriesList.setFocus(false);
			widgets.wishBtn.data.focus = true;
			widgets.wishBtn.refresh();
			this.actualForm="wish";
			break;
		case "KEY_UP":
			this.actualForm = "headerList";
			widgets.subCategoriesList.setFocus(false);
			widgets.categoriesList.setFocus(true);
			break;
		case "KEY_IRENTER":
			widgets.vodList.animatedUpdateData(widgets.subCategoriesList.selectItem.CategoryVO.vodsArray, "exit", "enter");
			widgets.descriptionItem.setDataAnimated(this.parseDescription(widgets.subCategoriesList.selectItem.CategoryVO.vodsArray[0]), "exit", "enter");
			break;
		}
}


vodHomeB.prototype.onKeyPressWish = function onKeyPressWish(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_TV_VOD":
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.actualForm = "close";
			this.home.hideHeader();
			this.home.closeSection(this);
			break;
		case "KEY_DOWN":
			widgets.wishBtn.data.focus = false;
			widgets.wishBtn.refresh();
			this.actualForm="vod";
			widgets.vodList.setFocus(true);
			
			break;
		case "KEY_UP":
			if(widgets.subCategoriesList.stateGet() == "enter"){
				this.actualForm = "subHeaderList";
				widgets.wishBtn.data.focus = false;
				widgets.wishBtn.refresh();
				widgets.subCategoriesList.setFocus(true);
			}else{
				this.actualForm="headerList";
				widgets.wishBtn.data.focus = false;
				widgets.wishBtn.refresh();
				widgets.categoriesList.setFocus(true);
			}
			break;
		case "KEY_RIGHT":
			//if(widgets.vodList.list[widgets.vodList.selectIndex].VodMovieVO.urlTrailer || widgets.vodList.list[widgets.vodList.selectIndex].VodMovieVO.isBuy == true){
			if(widgets.descriptionItem.data.urlTrailer ||
			   widgets.descriptionItem.data.isBuy == true){
				widgets.wishBtn.data.focus = false;
				widgets.wishBtn.refresh();
				widgets.focusStrokePlayer.stateChange("enter");
				this.actualForm="movie";
			}
			break;
		case "KEY_IRENTER":
			getServices.getSingleton().call("VOD_ADD_WISHLIST", ["vodId="+widgets.vodList.list[widgets.vodList.selectIndex].VodMovieVO.vodId],  this.responseSendWishlist.bind(this));
			break;
	}
}


vodHomeB.prototype.onKeyPressMovie = function onKeyPressMovie(_key){
	var widgets = this.widgets;
	NGM.trace("onKeyPressMovie");
	if(this.home.widgets.player.stateGet() == "enter"){
		this.showWid();
	}else{
		switch(_key){
			case "KEY_TV_VOD":
			case "KEY_MENU":
			case "KEY_IRBACK":
				this.actualForm = "close";
				this.home.hideHeader();
				this.home.closeSection(this);
				break;
			case "KEY_LEFT":
				widgets.focusStrokePlayer.stateChange("exit");
				widgets.wishBtn.data.focus = true;
				widgets.wishBtn.refresh();
				this.actualForm="wish";
				break;
			case "KEY_UP":
				if(widgets.subCategoriesList.stateGet() == "enter"){
					this.actualForm = "subHeaderList";
					widgets.focusStrokePlayer.stateChange("exit");
					widgets.subCategoriesList.setFocus(true);
					
				}else{
					this.actualForm="headerList";
					widgets.focusStrokePlayer.stateChange("exit");
					widgets.categoriesList.setFocus(true);
					
				}
				break;
			case "KEY_DOWN":
				widgets.focusStrokePlayer.stateChange("exit");
				this.actualForm="vod";
				widgets.vodList.setFocus(true);
				
				break;
			case "KEY_IRENTER":
				this.hideWid();
				break;
		}
	}
}


vodHomeB.prototype.onKeyPressVod = function onKeyPressVod(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_TV_VOD":
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.actualForm = "close";
			this.home.hideHeader();
			this.home.closeSection(this);
			break;
		case "KEY_UP":
			widgets.vodList.setFocus(false);
			widgets.wishBtn.data.focus = true;
			widgets.wishBtn.refresh();
			this.actualForm="wish";
			break;
		case "KEY_LEFT":
			if(widgets.vodList.scrollPrev()){
				if(widgets.vodList.selectIndex < (widgets.vodList.maxItem-6)){
					widgets.arrowsLR.data.right = true;
					if(widgets.vodList.selectIndex == 0){
						widgets.arrowsLR.data.left = false;
					}
					widgets.arrowsLR.data.total = widgets.vodList.maxItem;
					widgets.arrowsLR.refresh();
				}
			}
			break;
		case "KEY_RIGHT":
			if(widgets.vodList.scrollNext()){
				if(widgets.vodList.selectIndex > 5){
					widgets.arrowsLR.data.left = true;
					if(widgets.vodList.selectIndex == (widgets.vodList.maxItem-1)){
						widgets.arrowsLR.data.right = false;
					}
					widgets.arrowsLR.data.total = widgets.vodList.maxItem;
					widgets.arrowsLR.refresh();
				}
			}
			break;
		case "KEY_IRENTER":
			NGM.trace(this.alias);
			if(this.alias != "TRANS"){
				if(!this.haveService){
					this.actualForm = "open";
					this.home.openSection("suscription",{"home":this.home, "club":widgets.vodList.selectItem.VodMovieVO.clubAlias}, false,null,false);
				}else{
					this.openNextSection(true);
				}
			}else{
				//this.home.openSection("vodDetail", {"home":this.home, "VodMovieVO": this.widgets.vodList.selectItem.VodMovieVO}, false, null, false);
				if(!widgets.vodList.selectItem.VodMovieVO.isUseRootPasswd){
					this.openNextSection(true);
				}else{
					this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":"Usa los números en tu control remoto para ingresar el nip del usuario indicado para desbloquear el contenido", "txt1": "Desbloquear: "+widgets.vodList.selectItem.VodMovieVO.name, "txt2": "Clasificación: "+widgets.vodList.selectItem.VodMovieVO.rating, "txt3": ""}}, false,null,true);
				}
			}
			break;
	}
}

vodHomeB.prototype.onKeyPressSearch = function onKeyPressSearch(_key){

	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			this.home.disableSearchHeader();
			this.actualForm="headerList";
			this.widgets.categoriesList.setFocus(true);
			
			break;
		default:
			this.home.onKeyPress(_key);
			break;
	}
}


vodHomeB.prototype.openNextSection = function openNextSection(_allow){
	if(_allow){
		if(this.widgets.vodList.selectItem.VodMovieVO.type == "VID"){
			if(this.widgets.vodList.selectItem.VodMovieVO.isBuy){
				this.actualForm = "open";
				this.home.openSection("vodPlayer", {"name": "vodPlayer", "home":this.home,"vodId":this.widgets.vodList.selectItem.VodMovieVO.vodId,"statusPlayer":true}, false);
			}else{
				this.actualForm = "open";
				this.home.setPlayerStatus("STOP");
				this.home.openSection("vodDetail", {"home":this.home, "VodMovieVO": this.widgets.vodList.selectItem.VodMovieVO}, false, null, false);
			}
		}else if(this.widgets.vodList.selectItem.VodMovieVO.type == "SER" || this.widgets.vodList.selectItem.VodMovieVO.type == "SEA"){
			var params = ["club="+this.widgets.vodList.selectItem.VodMovieVO.clubAlias, "maxRows=300", "vodId="+this.widgets.vodList.selectItem.VodMovieVO.vodId];
			getServices.getSingleton().call("VOD_GET_SEASONS_LIST", params,  this.responseGetSubCategories.bind(this), null, null, null, 10000);
			//this.actualForm = "open";
			//this.home.openSection("vodSeasons", {"home":this.home, "vodId": this.widgets.vodList.selectItem.VodMovieVO.vodId, "club":this.alias}, true);
			
			
			
		}
	}
}

vodHomeB.prototype.parseDescription = function parseDescription(_data){
	
	
	var _qualify = -1,
		_price = null,
		_name=null,
		_rating=null;
		_aditional=null,
		_actors=null,
		_description=null,
		_urlTrailer = null,
		_isBuy = null;
		
	if(_data.VodMovieVO){
		_urlTrailer = _data.VodMovieVO.urlTrailer;
		_isBuy = _data.VodMovieVO.isBuy;
		///////////////////////// Estrellas
		_qualify = _data.VodMovieVO.qualify;
		/////////////////////////Precio
		if(_data.VodMovieVO.isBuy){
			_price = "Rentada";
		}else{
			if(_data.VodMovieVO.formats.length > 0){
				var minPrice = _data.VodMovieVO.formats[0].VodFormatVO.price;
				for(var x = 0; x < _data.VodMovieVO.formats.length; x++){
					if(_data.VodMovieVO.formats[x].VodFormatVO.price <= minPrice)
						minPrice = _data.VodMovieVO.formats[x].VodFormatVO.price;			
				}
				_price = "desde $"+minPrice;
			}else{
				_price = "";
			}
		}
		/////////////////////////Nombre
		_name=_data.VodMovieVO.name;
		/////////////////////////Clasificacion
		_rating=_data.VodMovieVO.rating;
		/////////////////////////Adicional
		var text = "I ";
		text += getQualities(_data.VodMovieVO.formats);
		text += " I ";
		text += _data.VodMovieVO.year+" I ";
		text += _data.VodMovieVO.duration+" min I ";
		text += getLanguages(_data.VodMovieVO.formats);
		_aditional = text;
		/////////////////////////Actores
		_actors=_data.VodMovieVO.actors;
		/////////////////////////Descripcion
		_description=_data.VodMovieVO.description;
	}
	
	
	
	
	return {"qualify": _qualify,
			"price": _price,
			"name": _name,
			"rating": _rating,
			"aditional":_aditional,
			"actors": _actors,
			"description": _description,
			"urlTrailer": _urlTrailer,
			"isBuy": _isBuy};
			
}


vodHomeB.drawWishBtn = function drawWishBtn(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		var custoBg = {"fill": "rgba(60, 30, 70, 1)"};
		var custoTxt = JSON.stringify(this.themaData.custoDateNumber);
		custoTxt = JSON.parse(custoTxt);
		custoTxt.text_align = "center,middle";
		custoTxt.fill = "rgba(240, 240, 250, 1)";
		custoTxt.font_size = 18* tpng.thema.text_proportion;
		
		if(_data.focus){
			custoBg = {"fill": "rgba(240, 240, 250, 1)"};
			custoTxt.fill = "rgba(0, 0, 0, 1)"
			
		}
		
		Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight], custoBg);
		if(_data.isInWishlist){			
			Canvas.drawText(ctx, "Quitar a mi lista", new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custoTxt);
		}else{
			Canvas.drawText(ctx, "Agregar a mi lista", new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custoTxt);
		}
		
		
	ctx.drawObject(ctx.endObject());
}		


vodHomeB.onFocusLists = function onFocusLists(_focus, _data){
	var widgets = this.widgets;
	clearTimeout(this.timerLoadData);
	var bookmark;
	
	if(_focus){
		if(this.actualForm != "vod"){
			widgets.vodList.setFocus(false);
		}else{
			if(_data.item.VodMovieVO.name != widgets.descriptionItem.data.name){
				this.timerLoadData =
				setTimeout(function(){
				if(this.formName == "vodHomeB"){
					widgets.descriptionItem.setDataAnimated(this.parseDescription(_data.item), "exit", "enter");
					this.widgets.playerMessage.stateChange("exit");
					var focusWB=false;
					if(widgets.wishBtn.data.focus == true){
						focusWB=true;
					}
					widgets.wishBtn.setDataAnimated({"focus":focusWB, "isInWishlist": _data.item.VodMovieVO.isInWishlist}, "exit", "enter");
					/*this.animateWidgets(	[[widgets.wishBtn] ,[widgets.wishBtn]],
							 300,
							 [["exit"], ["enter"]]);
					*/
					
					clearTimeout(this.deleyPlayer);
					if(_data.item.VodMovieVO.isBuy){
						if(_data.item.VodMovieVO.bookmark > 60000){
							bookmark = _data.item.VodMovieVO.bookmark-60000;
						}else{
							bookmark = 0;
						}
						
						this.home.playVideo(_data.item.VodMovieVO.formats[0].VodFormatVO.url, "VIDEO", bookmark, "miniB");	
						this.home.widgets.player.stateChange("miniB");
						
						this.deleyPlayer = this.pausePlayer.bind(this).delay(60000);  //this.pausePlayer.bind(this).delay(120000);
						
					}else{
						if(_data.item.VodMovieVO.urlTrailer){
							this.home.playVideo(_data.item.VodMovieVO.urlTrailer, "VIDEO", 0, "miniB");
							this.home.widgets.player.stateChange("miniB");
						}else{
							this.home.setPlayerStatus("STOP");
						}
					}
					this.setBackground(_data.item.VodMovieVO.images.url18X18);
				}
				}.bind(this), 1000); //regresar el delay a 1000
			}
			
		}
	}
}



vodHomeB.prototype.pausePlayer = function pausePlayer(){
	if(this.home.widgets.player.stateGet() == "enter"){
		this.home.widgets.player.stateChange("miniB");
		this.showWid();
	}
	var widgets = this.widgets;
	this.home.setPlayerStatus("PAUSE");
	this.widgets.playerMessage.setData(this.getTimeFormat(widgets.vodList.selectItem.VodMovieVO.bookmark));
	this.widgets.playerMessage.stateChange("enter");
}

vodHomeB.prototype.hideWid = function hideWid(){
	var widgets = this.widgets;
	NGM.trace(this.home);
	
	this.client.lock();
		widgets.focusStrokePlayer.stateChange("exit");
		this.home.hideHeader();
		widgets.headerList.stateChange("exit");
		widgets.categoriesList.stateChange("exit");
		widgets.subCategoriesList.stateChange("exit");
		widgets.descriptionItem.stateChange("exit");
		widgets.wishBtn.stateChange("exit");
		widgets.arrowsLR.stateChange("exit");
		widgets.vodList.stateChange("exit");
	this.client.unlock();	
	this.home.widgets.player.stateChange("enter");
}

vodHomeB.prototype.showWid = function showWid(){
	var widgets = this.widgets;
	NGM.trace(this.home);
	this.home.widgets.player.stateChange("miniB");
	this.client.lock();
		this.home.showHeader({"section":this});
		widgets.headerList.stateChange("enterOne");
		widgets.categoriesList.stateChange("enter");
		if(widgets.subCategoriesList.list.length > 0){
			widgets.subCategoriesList.stateChange("enter");
		}
		widgets.descriptionItem.stateChange("enter");
		widgets.wishBtn.stateChange("enter");
		widgets.focusStrokePlayer.stateChange("enter");
		widgets.arrowsLR.stateChange("enter");
		widgets.vodList.stateChange("enter");
	this.client.unlock(); 
	
	
}

vodHomeB.prototype.updateArrows = function updateArrows(){
	var widgets = this.widgets;
	
	if(widgets.vodList.stateGet() == "enter" ){
		if(widgets.vodList.maxItem > 6){
			widgets.arrowsLR.setData({"left": false, "right": true, "total": widgets.vodList.maxItem});
		}else{
			widgets.arrowsLR.setData({"left": false, "right": false, "total": widgets.vodList.maxItem});
		}
	}else{
		this.updateArrows.bind(this).delay(100);
	}
		
}

vodHomeB.onFocusCategoriesHeaderList = function onFocusCategoriesHeaderList(_focus, _data){
	if(_focus){
		if(this.actualForm != "headerList")
			this.widgets.categoriesList.setFocus(false);
	}
}


vodHomeB.prototype.getTimeFormat = function getTimeFormat(_data){
	var time = _data;
	var min;
	var seg;
	var txt ="";
	if(_data > 60000){
		min= time/60000;
	  	min = parseInt(min);
	  	time -= min*60000;
	
	  	seg= time/1000;
	  	seg=parseInt(seg);
	
	  	if(min<10){
	  		min="0"+min;
	  	}
	  	if(seg<10){
	  		seg="0"+seg;
	  	}
	  	txt = "<!size=20>Bookmark<!br><!size=18>min "+min+"<!>";
  	}else{
  		txt = "<!size=20>Seguir viendo ...<!>";
  	}
  	
  	
	return txt;
}
