// addOnsInter.js

FormWidget.registerTypeStandard("addOnsInter");

function addOnsInter(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.indexBg=true;
	this.urlV;
   	clearTimeout(this.deleyPlayer);
   	clearTimeout(this.timerLoadData);
   	
}

addOnsInter.inherits(FormWidget);

addOnsInter.prototype.onEnter = function onEnter(_data){
	NGM.trace(" ");
	NGM.trace("addOnsInter");
	
	this.home = _data.home;
	this.lockKey = true;
	this.actualFocus = 2;
	this.alias = _data.parameters.alias;
	//Para asegurarnos que el background
	//ya esté setteado desde el principio
	
	//this.home.widgets.back.setData();
	//this.home.widgets.back.stateChange("enter");
	
	this.home.objectChild = this;
	this.counting = 0;
	this.home.showHeader({"section":this});
	
	if(this.alias != "ADULT"){
		if(_data.parameters){
			var params = ["alias="+this.alias];
			getServices.getSingleton().call("ADMIN_GET_DESCRIPTION_ADDON", params,  this.responseGetDescription.bind(this));
		}
	}else{
		this.initAdult();
	}
	
	
	this.widgets.playerMessage.setData("");
}

addOnsInter.prototype.initAdult = function initAdult(_data){
	
	this.setBackground("img/tv/addOnsAdult/18x18.jpg");
	this.widgets.disclamerFull.setData("");
	this.widgets.disclamerFull.stateChange("enter");
	this.widgets.accessButtons.setData([{"name":"NIP", "label": "Ingresa tu NIP", "image": "img/tv/addOnsAdult/btn_nip.jpg"}]);
	this.widgets.accessButtons.stateChange("enter");
	var buttons = [
		{"id":"r","text": "REGRESAR"}
	];
	this.widgets.backButton.setData(buttons);
	this.widgets.backButton.stateChange("enter");
	this.widgets.backButton.setFocus(false);
	this.actualForm="nipButtons";
	
}



addOnsInter.prototype.onExit = function onExit(_data){
	clearTimeout(this.deleyPlayer);
	clearTimeout(this.timerLoadData);
	this.closeLists();
	
	this.client.lock();
		this.setBackground("");
		this.home.widgets.player.stateChange("mini");
		this.home.objectChild = null;
		this.home.hideHeader();
		this.home.hideBg();
	this.client.unlock();
	
	this.home.setPlayerStatus("STOP");
	this.home.widgets.player.setData("");
	this.home.widgets.player.stateChange("exit");
}

addOnsInter.prototype.closeLists = function closeLists(){
	var widgets = this.widgets;
	
	this.client.lock();
	widgets.arrowsUD.stateChange("exit");
	widgets.expiration.stateChange("exit");
	widgets.playerMessage.stateChange("exit");
	widgets.descriptionItem.stateChange("exit");
	widgets.arrowsLR.stateChange("exit");
	widgets.footerList.stateChange("exit");
	
	switch("enterUP"){
		case widgets.oneCategoriesList.stateGet():
			widgets.oneCategoriesList.stateChange("exitOne");
			widgets.headerCategoriesOne.stateChange("exitOne");
			break;
		case widgets.twoCategoriesList.stateGet():
			widgets.twoCategoriesList.stateChange("exitOne");
			widgets.headerCategoriesTwo.stateChange("exitOne");
			break;
		case widgets.threeCategoriesList.stateGet():
			widgets.threeCategoriesList.stateChange("exitOne");
			widgets.headerCategoriesThree.stateChange("exitOne");
			break;
		case widgets.fourCategoriesList.stateGet():
			widgets.fourCategoriesList.stateChange("exitOne");
			widgets.headerCategoriesFour.stateChange("exitOne");
			break;
	}
	
	switch("enterDOWN"){
		case widgets.oneCategoriesList.stateGet():
			widgets.oneCategoriesList.stateChange("exitTwo");
			widgets.headerCategoriesOne.stateChange("exitTwo");
			break;
		case widgets.twoCategoriesList.stateGet():
			widgets.twoCategoriesList.stateChange("exitTwo");
			widgets.headerCategoriesTwo.stateChange("exitTwo");
			break;
		case widgets.threeCategoriesList.stateGet():
			widgets.threeCategoriesList.stateChange("exitTwo");
			widgets.headerCategoriesThree.stateChange("exitTwo");
			break;
		case widgets.fourCategoriesList.stateGet():
			widgets.fourCategoriesList.stateChange("exitTwo");
			widgets.headerCategoriesFour.stateChange("exitTwo");
			break;
	}
	
	this.client.unlock()
}

//TODO: ver si esta función la pasamos a la librería IMG
addOnsInter.prototype.loadPaintImg = function loadPaintImg(_url){
	//Función que pinta la imagen hasta que se descarga
	//Para transiciones de addOnsInter, menú y wizard VOD
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

addOnsInter.prototype.imgLoadCb = function imgLoadCb(url, img, arg){
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


addOnsInter.prototype.setBackground = function setBackground(_url){
	
	NGM.trace("Pintando background: "+_url);
	var bg = this.home.widgets.mainBg;
	//Antes de la carga de la imagen pasamos a medium el background
	//para lograr el efecto de medium a enter
	bg.stateChange("medium");
	this.loadPaintImg(_url);
}


addOnsInter.prototype.responseGetDescription = function responseGetDescription(response){
	
	if(response.status == 200){
		this.categories = response.data.ResponseVO.bundlesArray;
		if(this.categories.length > 0){
			this.actualPos = 0;
			this.totalPos = 0;
			
			this.initList();
		}else{
			this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"}, false);
		}
		
		
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

addOnsInter.prototype.responseGetCategories = function responseGetCategories(response){
	
	if(response.status == 200){
		this.channels = response.data.ResponseVO.channels;
		if(this.channels.length > 0){
			this.home.openSection("welcomeAddOns", {"name": "welcomeAddOns", "home":this.home, "bundleVO":this.getWidgetFocus(true).selectItem.BundleVO, "channels": this.channels}, false);
		}else{
			this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"}, false);
		}
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

addOnsInter.prototype.responseGetChannelList = function responseGetChannelList(response){
	
	if(response.status == 200){
		this.channels = response.data.ResponseVO.channels;
		if(this.channels.length > 0){
			this.home.closeSection(this);
			this.home.tuneInByNumber(this.channels[0].ChannelVO.number,true,null);
			
		}else{
			this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"}, false);
		}
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

addOnsInter.prototype.responseBuyAddons = function responseBuyAddons(response){
	if(response.status == 200){
		if(response.data.ResponseVO.status == 0){
			var params = ["alias="+this.getWidgetFocus(true).selectItem.BundleVO.alias];
			getServices.getSingleton().call("ADMIN_GET_LIST_ADDON", params,  this.responseGetCategories.bind(this));
		}else{
			this.actualForm="vod";
			this.home.openSection("miniError", {"home": this.home, "code":response.data.ResponseVO.status, "message":response.data.ResponseVO.message, "suggest":response.data.ResponseVO.suggest}, false);
		}
	}else{
		this.home.openSection("miniError", {"home": this.home, "code": response.status, "message": response.error.message, "suggest": response.error.suggest}, false);	
	}
}

addOnsInter.onFocusButtonBack = function onFocusButtonBack(_focus, _data){
	if(_focus){		
    	var widgets = this.widgets;
    	widgets.tooltip.setData({"x": widgets.backButton.selectItem.x, "text": widgets.backButton.selectItem.text});
    	this.timerToShowButton = widgets.tooltip.stateChange.delay(500, widgets.tooltip, "enter");
	} else {
		unsetTimeAlarm(this.timerToShowButton);
		this.timerToShowButton = null;
		this.widgets.tooltip.stateChange("exit");
	}	
}

addOnsInter.prototype.initList = function initList(_data){
	var widgets = this.widgets;
	var sectionIndex = -1;
	var init = true;
	for(var x = 0; x < tpng.app.sections.length; x++){
		if(tpng.app.sections[x].name == "addOnsInter" && tpng.app.sections[x].params.indexList >= 0){
			sectionIndex = x;
			init = false;
		}
	}
	
	
	
	if(init){
		widgets.oneCategoriesList.setData(this.categories);
		widgets.headerCategoriesOne.setData({"total":this.categories.length,"position": 1,"categoryName": "", "focus": true});
		
		if(widgets.oneCategoriesList.maxItem > 6){
			widgets.arrowsLR.setData({"left": false, "right": true, "total": widgets.oneCategoriesList.maxItem});
		}else{
			widgets.arrowsLR.setData({"left": true, "right": false, "total": widgets.oneCategoriesList.maxItem});
		}
		widgets.arrowsUD.setData({"up": false, "down": false});
	}else{
		this.actualPos = tpng.app.sections[sectionIndex].params.indexList;
		this.actualFocus = tpng.app.sections[sectionIndex].params.focusPos;
		
		widgets.oneCategoriesList.setData(this.categories, tpng.app.sections[sectionIndex].params.posList);
		widgets.headerCategoriesOne.setData({"total":this.categories.length,"position": 1,"categoryName": "", "focus": true});
		
		
		if(widgets.oneCategoriesList.maxItem > 6){
			widgets.arrowsLR.setData({"left": false, "right": true, "total": widgets.oneCategoriesList.maxItem});
		}else{
			widgets.arrowsLR.setData({"left": true, "right": false, "total": widgets.oneCategoriesList.maxItem});
		}
		widgets.arrowsUD.setData({"up": false, "down": false});
	}
	widgets.footerList.stateChange("enter");
	
	
	
	/*if(init){
		widgets.oneCategoriesList.setData(this.categories);
		widgets.headerCategoriesOne.setData({"total":this.categories.length,"position": 1,"categoryName": "", "focus": true});
		
		if(widgets.oneCategoriesList.maxItem > 6){
			widgets.arrowsLR.setData({"left": false, "right": true, "total": widgets.oneCategoriesList.maxItem});
		}else{
			widgets.arrowsLR.setData({"left": true, "right": false, "total": widgets.oneCategoriesList.maxItem});
		}/*
		/*if(this.categories.length == 1){
			widgets.arrowsUD.setData({"up": false, "down": false});
		}else if (this.categories.length > 1){
			widgets.arrowsUD.setData({"up": false, "down": true});
		}*/
		//widgets.arrowsUD.setData({"up": false, "down": false});
		
		/*
		widgets.twoCategoriesList.setData(this.categories[this.actualPos+1].CategoryVO.vodsArray);
		widgets.headerCategoriesTwo.setData({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
		widgets.threeCategoriesList.setData(this.categories[this.actualPos+2].CategoryVO.vodsArray);
		widgets.headerCategoriesThree.setData({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
		widgets.fourCategoriesList.setData(this.categories[this.actualPos+3].CategoryVO.vodsArray);
		widgets.headerCategoriesFour.setData({"total":this.categories[this.actualPos+3].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
		*/
		
		/*
	}else{
		this.actualPos = tpng.app.sections[sectionIndex].params.indexList;
		this.actualFocus = tpng.app.sections[sectionIndex].params.focusPos;
		
		widgets.oneCategoriesList.setData(this.categories, tpng.app.sections[sectionIndex].params.posList);
		widgets.headerCategoriesOne.setData({"total":this.categories.length,"position": 1,"categoryName": "", "focus": true});
		
		
		if(widgets.oneCategoriesList.maxItem > 6){
			widgets.arrowsLR.setData({"left": false, "right": true, "total": widgets.oneCategoriesList.maxItem});
		}else{
			widgets.arrowsLR.setData({"left": true, "right": false, "total": widgets.oneCategoriesList.maxItem});
		}*/
		/*if(this.categories.length == 1){
			widgets.arrowsUD.setData({"up": false, "down": false});
		}else if (this.categories.length > 1){
			widgets.arrowsUD.setData({"up": false, "down": true});
		}*/
		//widgets.arrowsUD.setData({"up": false, "down": false});
		/*
		if(this.actualPos == 0){
			//Solo elementos hacia abajo
			widgets.twoCategoriesList.setData(this.categories[this.actualPos+1].CategoryVO.vodsArray);
			widgets.headerCategoriesTwo.setData({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
			widgets.threeCategoriesList.setData(this.categories[this.actualPos+2].CategoryVO.vodsArray);
			widgets.headerCategoriesThree.setData({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setData(this.categories[this.actualPos+3].CategoryVO.vodsArray);
			widgets.headerCategoriesFour.setData({"total":this.categories[this.actualPos+3].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
			
		}else if(this.actualPos == this.categories.length-1){
			//Solo elementos hacia arriba
			widgets.threeCategoriesList.setData(this.categories[this.actualPos-2].CategoryVO.vodsArray);
			widgets.headerCategoriesThree.setData({"total":this.categories[this.actualPos-2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setData(this.categories[this.actualPos-1].CategoryVO.vodsArray);
			widgets.headerCategoriesFour.setData({"total":this.categories[this.actualPos-1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-1].CategoryVO.categoryName, "focus": false});
			
			widgets.footerList.stateChange("enter");
			widgets.arrowsUD.data.up=true;
			widgets.arrowsUD.data.down=false;
			widgets.arrowsUD.refresh();
			
			
		}else if((this.actualPos+3) <= this.categories.length-1 && (this.actualPos-3) >= 0){
			
			//Mas de 3 elementos hacia ambos lados
			
			widgets.twoCategoriesList.setData(this.categories[this.actualPos+1].CategoryVO.vodsArray);
			widgets.headerCategoriesTwo.setData({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
			widgets.threeCategoriesList.setData(this.categories[this.actualPos+2].CategoryVO.vodsArray);
			widgets.headerCategoriesThree.setData({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setData(this.categories[this.actualPos-1].CategoryVO.vodsArray);
			widgets.headerCategoriesFour.setData({"total":this.categories[this.actualPos-1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-1].CategoryVO.categoryName, "focus": false});
			
			widgets.arrowsUD.data.up=true;
			widgets.arrowsUD.refresh();
			
		}else{
			//Mas de 3 elementos hacia ambos lados
			
			widgets.twoCategoriesList.setData(this.categories[this.actualPos+1].CategoryVO.vodsArray);
			widgets.headerCategoriesTwo.setData({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
			widgets.threeCategoriesList.setData(this.categories[this.actualPos+2].CategoryVO.vodsArray);
			widgets.headerCategoriesThree.setData({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setData(this.categories[this.actualPos-1].CategoryVO.vodsArray);
			widgets.headerCategoriesFour.setData({"total":this.categories[this.actualPos-1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-1].CategoryVO.categoryName, "focus": false});
			
			widgets.arrowsUD.data.up=true;
			widgets.arrowsUD.refresh();
		}*/
		
		
		//this.setFocusIndex(widgets.oneCategoriesList);
	//}
	this.setFocusIndex(widgets.oneCategoriesList);
	
	this.client.lock();
		widgets.oneCategoriesList.stateChange("enterUP");
		widgets.headerCategoriesOne.stateChange("enterUP");
		
		/*widgets.twoCategoriesList.stateChange("enterDOWN");
		widgets.headerCategoriesTwo.stateChange("enterDOWN");
		
		widgets.threeCategoriesList.stateChange("exitDOWN");
		widgets.headerCategoriesThree.stateChange("exitDOWN");
		
		widgets.fourCategoriesList.stateChange("exit");
		widgets.headerCategoriesFour.stateChange("exit");*/
		widgets.arrowsLR.stateChange("enter");
		widgets.arrowsUD.stateChange("enter");
	this.client.unlock();
	
	if(init){
		this.setWidgetFocus("init");
	}else{
		this.setWidgetFocus("");
		
	}
	
	widgets.headerCategoriesOne.data.position = this.getWidgetFocus(true).selectIndex+1;
	widgets.headerCategoriesOne.refresh();
	widgets.headerCategoriesOne.stateChange("enterUP");
	
	this.actualForm="vod"
	
}
addOnsInter.prototype.onKeyPress = function onKeyPress(_key){
	if(_key == "KEY_TV_RED")
		this.formOpenChild("previews");
	
	switch(this.actualForm){
		case "search":
			this.onKeyPressSearch(_key);
			break;
		case "vod":
			this.onKeyPressVod(_key);
			break;
		case "nipButtons":
			this.onKeyPressNipButtons(_key);
			break;
		case "backButton":
			this.onKeyPressBackButton(_key);
			break;	
			
	}
	return true;
	
}

addOnsInter.prototype.onKeyPressNipButtons = function onKeyPressNipButtons(_key){
	switch(_key){
		case "KEY_TV_VOD":
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.widgets.stateChange("exit");
			this.home.closeSection(this);
			break;
		case "KEY_LEFT":
			if(this.widgets.accessButtons.scrollPrev()){}
			else{
				this.actualForm="backButton";
				this.widgets.backButton.setFocus(true);
				this.widgets.accessButtons.setFocus(false);
			}
			
			break;
		case "KEY_RIGHT":
			this.widgets.accessButtons.scrollNext();
			break;
		case "KEY_IRENTER":
			NGM.trace("this.widgets.accessButtons.selectItem.name "+this.widgets.accessButtons.selectItem.name);
			if(this.widgets.accessButtons.selectItem.name == "NIP"){
				this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":"Es necesario ingresar el NIP del Administrador para acceder a este contenido.", "txt1": "Contratar AdulTv ", "txt2": "", "txt3": ""}}, false,null,true);
			}else if(this.widgets.accessButtons.selectItem.name == "back"){
				this.widgets.stateChange("exit");
				this.home.closeSection(this);
			}
			break;
			
			case "KEY_UP":
				this.lastFocus = this.actualForm;
				this.actualForm="search";
				this.widgets.accessButtons.setFocus(false);
				this.home.enableSearchHeader();
			break;
	}
}

addOnsInter.prototype.onKeyPressBackButton = function onKeyPressBackButton(_key){
	switch(_key){
		case "KEY_TV_VOD":
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.widgets.stateChange("exit");
			this.home.closeSection(this);
			break;
		case "KEY_RIGHT":
				this.actualForm="nipButtons";
				this.widgets.backButton.setFocus(false);
				this.widgets.accessButtons.setFocus(true);
			break;
		case "KEY_RIGHT":
			this.widgets.accessButtons.scrollNext();
			break;
		case "KEY_IRENTER":
		if(this.widgets.backButton.selectItem.id == "r"){
				this.widgets.stateChange("exit");
				this.home.closeSection(this);
		}
		break;
		
		case "KEY_UP":
			this.lastFocus = this.actualForm;
			this.actualForm="search";
			
			this.widgets.backButton.setFocus(false);
			this.home.enableSearchHeader();	
		break;	
	}
}

addOnsInter.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			this.home.disableSearchHeader();
			if(this.lastFocus == "nipButtons" || this.lastFocus == "backButton"){
				if(this.lastFocus == "nipButtons"){
					this.actualForm = "nipButtons";
					this.lastFocus = "";
					this.widgets.accessButtons.setFocus(true);
				}
				if(this.lastFocus == "backButton"){
					this.actualForm = "backButton";
					this.lastFocus = "";
					this.widgets.backButton.setFocus(true);
				}
			}
			else{
				this.getWidgetFocus(true).setFocus(true);
				this.actualForm="vod";
			}
			break;
		default:
			this.home.onKeyPress(_key);
			break;
	}
}

addOnsInter.prototype.onKeyPressVod = function onKeyPressVod(_key){
	var oneList   = this.widgets.oneCategoriesList,
		twoList   = this.widgets.twoCategoriesList,
		threeList = this.widgets.threeCategoriesList,
		fourList  = this.widgets.fourCategoriesList,
		widgets   = this.widgets;
	
	
	if(this.lockKey){
	
		switch(_key){
			case "KEY_MENU":
			case "KEY_IRBACK":
				this.home.closeSection(this);
				break;
			case "KEY_DOWN":
				this.lockKey = false;
				this.setKeyTrue.bind(this).delay(300);
				
				if(this.actualPos < this.totalPos){
					this.widgets.arrowsLR.stateChange("opaque");
					this.client.lock();
					switch(oneList.stateGet()){
						case "enterUP":
							this.actualFocus = oneList.focusIndex;
							oneList.stateChange("exitUP");
							widgets.headerCategoriesOne.stateChange("exitUP");
							this.setFocusIndex(twoList);
							
							twoList.stateChange("enterUP");
							this.setWidgetFocus();
							widgets.headerCategoriesTwo.data.position = this.getWidgetFocus(true).selectIndex+1;
							widgets.headerCategoriesTwo.refresh();
							widgets.headerCategoriesTwo.stateChange("enterUP");
							
							threeList.stateChange("enterDOWN");
							widgets.headerCategoriesThree.stateChange("enterDOWN");
							fourList.setData(this.categories[this.actualPos+3].CategoryVO.vodsArray, this.categories[this.actualPos+3].selectIndex);
							widgets.headerCategoriesFour.setData({"total": this.categories[this.actualPos+3].CategoryVO.totalElements,"position": null, "categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
							
							fourList.stateChange("exitDOWN");
							widgets.headerCategoriesFour.stateChange("exitDOWN");
							break;
						case "exitUP":
							this.actualFocus = twoList.focusIndex;
							oneList.setData(this.categories[this.actualPos+3].CategoryVO.vodsArray, this.categories[this.actualPos+3].selectIndex);
							widgets.headerCategoriesOne.setData({"total": this.categories[this.actualPos+3].CategoryVO.totalElements,"position": null, "categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
							oneList.stateChange("exitDOWN");
							widgets.headerCategoriesOne.stateChange("exitDOWN");
							
							twoList.stateChange("exitUP");
							widgets.headerCategoriesTwo.stateChange("exitUP");
							
							this.setFocusIndex(threeList);
							threeList.stateChange("enterUP");
							this.setWidgetFocus();
							widgets.headerCategoriesThree.data.position = this.getWidgetFocus(true).selectIndex+1;
							widgets.headerCategoriesThree.refresh();
							widgets.headerCategoriesThree.stateChange("enterUP");
							
							fourList.stateChange("enterDOWN");
							widgets.headerCategoriesFour.stateChange("enterDOWN");
							break;
						case "exitDOWN":
							this.actualFocus = threeList.focusIndex;
							oneList.stateChange("enterDOWN");
							widgets.headerCategoriesOne.stateChange("enterDOWN");
														
							twoList.setData(this.categories[this.actualPos+3].CategoryVO.vodsArray, this.categories[this.actualPos+3].selectIndex);
							widgets.headerCategoriesTwo.setData({"total": this.categories[this.actualPos+3].CategoryVO.totalElements,"position": null,"categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
							twoList.stateChange("exitDOWN");
							widgets.headerCategoriesTwo.stateChange("exitDOWN");
							
							threeList.stateChange("exitUP");
							widgets.headerCategoriesThree.stateChange("exitUP");
							
							this.setFocusIndex(fourList);
							fourList.stateChange("enterUP");
							this.setWidgetFocus();
							widgets.headerCategoriesFour.data.position = this.getWidgetFocus(true).selectIndex+1;
							widgets.headerCategoriesFour.refresh();
							widgets.headerCategoriesFour.stateChange("enterUP");
							break;
						case "enterDOWN":
							this.actualFocus = fourList.focusIndex;
							this.setFocusIndex(oneList);
							oneList.stateChange("enterUP");
							this.setWidgetFocus();
							widgets.headerCategoriesOne.data.position = this.getWidgetFocus(true).selectIndex+1;
							widgets.headerCategoriesOne.refresh();
							widgets.headerCategoriesOne.stateChange("enterUP");
							
							twoList.stateChange("enterDOWN");
							widgets.headerCategoriesTwo.stateChange("enterDOWN");

							threeList.setData(this.categories[this.actualPos+3].CategoryVO.vodsArray, this.categories[this.actualPos+3].selectIndex);
							widgets.headerCategoriesThree.setData({"total": this.categories[this.actualPos+3].CategoryVO.totalElements,"position": null, "categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
							threeList.stateChange("exitDOWN");
							widgets.headerCategoriesThree.stateChange("exitDOWN");
							
							fourList.stateChange("exitUP");
							widgets.headerCategoriesFour.stateChange("exitUP");
							break;
					}
					//this.setWidgetFocus();
					
					if(this.actualPos == (this.totalPos-1)){
						widgets.footerList.stateChange("enter");
						widgets.arrowsUD.data.down=false;
						widgets.arrowsUD.refresh();
					}
					if(this.actualPos == 0){
						widgets.arrowsUD.data.up=true;
						widgets.arrowsUD.refresh();
					}
					this.client.unlock();
					this.actualPos++;
				}
				break;
			case "KEY_UP":
				this.lockKey = false;
				this.setKeyTrue.bind(this).delay(300); 
				
				if(this.actualPos > 0){
					this.client.lock()
					switch(oneList.stateGet()){
						case "enterUP":
							this.actualFocus = oneList.focusIndex;
							oneList.stateChange("enterDOWN");
							widgets.headerCategoriesOne.stateChange("enterDOWN");
							
							twoList.stateChange("exitDOWN");
							widgets.headerCategoriesTwo.stateChange("exitDOWN");
							
							threeList.setData(this.categories[this.actualPos-2].CategoryVO.vodsArray, this.categories[this.actualPos-2].selectIndex);
							widgets.headerCategoriesThree.setData({"total": this.categories[this.actualPos-2].CategoryVO.totalElements,"position": null, "categoryName": this.categories[this.actualPos-2].CategoryVO.categoryName, "focus": false});
							threeList.stateChange("exitUP");
							widgets.headerCategoriesThree.stateChange("exitUP");
							
							this.setFocusIndex(fourList);
							fourList.stateChange("enterUP");
							this.setWidgetFocus();
							widgets.headerCategoriesFour.data.position = this.getWidgetFocus(true).selectIndex+1;
							widgets.headerCategoriesFour.refresh();
							widgets.headerCategoriesFour.stateChange("enterUP");
							break;
						case "enterDOWN":
							this.actualFocus = fourList.focusIndex;
							oneList.stateChange("exitDOWN");
							widgets.headerCategoriesOne.stateChange("exitDOWN");
							
							twoList.setData(this.categories[this.actualPos-2].CategoryVO.vodsArray, this.categories[this.actualPos-2].selectIndex);
							widgets.headerCategoriesTwo.setData({"total": this.categories[this.actualPos-2].CategoryVO.totalElements,"position": null, "categoryName": this.categories[this.actualPos-2].CategoryVO.categoryName, "focus": false});
							twoList.stateChange("exitUP");
							widgets.headerCategoriesTwo.stateChange("exitUP");
							
							this.setFocusIndex(threeList);
							threeList.stateChange("enterUP");
							this.setWidgetFocus();
							widgets.headerCategoriesThree.data.position = this.getWidgetFocus(true).selectIndex+1;
							widgets.headerCategoriesThree.refresh();
							widgets.headerCategoriesThree.stateChange("enterUP");
							
							fourList.stateChange("enterDOWN");
							widgets.headerCategoriesFour.stateChange("enterDOWN");
							break;
						case "exitDOWN":
							this.actualFocus = threeList.focusIndex;
							oneList.setData(this.categories[this.actualPos-2].CategoryVO.vodsArray, this.categories[this.actualPos-2].selectIndex);
							widgets.headerCategoriesOne.setData({"total": this.categories[this.actualPos-2].CategoryVO.totalElements,"position": null, "categoryName": this.categories[this.actualPos-2].CategoryVO.categoryName, "focus": false});
							oneList.stateChange("exitUP");
							widgets.headerCategoriesOne.stateChange("exitUP");
							
							this.setFocusIndex(twoList);
							twoList.stateChange("enterUP");
							this.setWidgetFocus();
							widgets.headerCategoriesTwo.data.position = this.getWidgetFocus(true).selectIndex+1;
							widgets.headerCategoriesTwo.refresh();
							widgets.headerCategoriesTwo.stateChange("enterUP");
							
							threeList.stateChange("enterDOWN");
							widgets.headerCategoriesThree.stateChange("enterDOWN");
							
							fourList.stateChange("exitDOWN");
							widgets.headerCategoriesFour.stateChange("exitDOWN");
							break;
						case "exitUP":
							this.actualFocus = twoList.focusIndex;
							this.setFocusIndex(oneList);
							oneList.stateChange("enterUP");
							this.setWidgetFocus();
							widgets.headerCategoriesOne.data.position = this.getWidgetFocus(true).selectIndex+1;
							widgets.headerCategoriesOne.refresh();
							widgets.headerCategoriesOne.stateChange("enterUP");
							
							twoList.stateChange("enterDOWN");
							widgets.headerCategoriesTwo.stateChange("enterDOWN");
							
							threeList.stateChange("exitDOWN");
							widgets.headerCategoriesThree.stateChange("exitDOWN");
							
							fourList.setData(this.categories[this.actualPos-2].CategoryVO.vodsArray, this.categories[this.actualPos-2].selectIndex);
							widgets.headerCategoriesFour.setData({"total": this.categories[this.actualPos-2].CategoryVO.totalElements,"position": null, "categoryName": this.categories[this.actualPos-2].CategoryVO.categoryName, "focus": false});
							fourList.stateChange("exitUP");
							widgets.headerCategoriesFour.stateChange("exitUP");
							break;
					}
					//this.setWidgetFocus();
					
					if(this.actualPos == this.totalPos){
						widgets.footerList.stateChange("exit");
						widgets.arrowsUD.data.down=true;
						widgets.arrowsUD.refresh();
					}
					if(this.actualPos == 1){
						widgets.arrowsUD.data.up=false;
						widgets.arrowsUD.refresh();
					}
					this.client.unlock();
					this.actualPos--;
					
				}else{
					this.getWidgetFocus(true).setFocus(false);
					this.home.enableSearchHeader();
					this.actualForm = "search";
				}
				break;
			case "KEY_LEFT":
				if(this.getWidgetFocus(true).scrollPrev()){
				
					this.getWidgetFocus(false).data.position=this.getWidgetFocus(true).selectIndex+1;
					this.getWidgetFocus(false).refresh();
					
					var firstVod = this.getWidgetFocus(true).selectIndex-(this.getWidgetFocus(true).focusIndex-2)
					this.categories[this.actualPos].selectIndex = firstVod;
					this.categories[this.actualPos].focusIndex = this.getWidgetFocus(true).focusIndex;
					
					if(this.getWidgetFocus(true).selectIndex < (this.getWidgetFocus(true).maxItem-6)){
						widgets.arrowsLR.data.right = true;
						if(this.getWidgetFocus(true).selectIndex == 0){
							widgets.arrowsLR.data.left = false;
						}
						widgets.arrowsLR.data.total = this.getWidgetFocus(true).maxItem;
						widgets.arrowsLR.refresh();
					}
				}				
				break;
			case "KEY_RIGHT":
				if(this.getWidgetFocus(true).scrollNext()){
				
					this.getWidgetFocus(false).data.position=this.getWidgetFocus(true).selectIndex+1;
					this.getWidgetFocus(false).refresh();
					
					var firstVod = this.getWidgetFocus(true).selectIndex-(this.getWidgetFocus(true).focusIndex-2)
					this.categories[this.actualPos].selectIndex = firstVod;
					this.categories[this.actualPos].focusIndex = this.getWidgetFocus(true).focusIndex;
					
					if(this.getWidgetFocus(true).selectIndex > 5){
						widgets.arrowsLR.data.left = true;
						if(this.getWidgetFocus(true).selectIndex == (this.getWidgetFocus(true).maxItem-1)){
							widgets.arrowsLR.data.right = false;
						}
						widgets.arrowsLR.data.total = this.getWidgetFocus(true).maxItem;
						widgets.arrowsLR.refresh();
					}
				}
				break;
			case "KEY_IRENTER":
				var enter;
				/*for(var x = 0; x < tpng.app.sections.length; x++){
					if(tpng.app.sections[x].name == "addOnsInter"){
						tpng.app.sections[x].params.indexList = this.actualPos;
						tpng.app.sections[x].params.posList = this.getWidgetFocus(true).selectIndex-(this.getWidgetFocus(true).focusIndex-2);
						tpng.app.sections[x].params.focusPos = this.getWidgetFocus(true).focusIndex;
					}
				}*/
				if(!this.getWidgetFocus(true).selectItem.BundleVO.isActive){
					this.actualForm="comprando";
					this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":"Usa los números en tu control remoto para ingresar el nip del usuario indicado para contratar "+this.getWidgetFocus(true).selectItem.BundleVO.name, "txt1": "Contratar: "+this.getWidgetFocus(true).selectItem.BundleVO.name, "txt2": "", "txt3": ""}}, false,null,true);
				}else{
					tpng.app.sections = [];
					tpng.app.programInfo = "timeline";
					var params = ["alias="+this.getWidgetFocus(true).selectItem.BundleVO.alias];
					getServices.getSingleton().call("ADMIN_GET_LIST_ADDON", params,  this.responseGetChannelList.bind(this));
					tpng.app.programInfo = "zap";
					
				}
				break;
		}
	}
}



addOnsInter.prototype.onStreamEvent = function onStreamEvent(event) {
	switch(event.type){
		case "end":
		case "endOfFile":
			this.home.playVideo(this.urlV, "VIDEO", 0, "mini");
			this.home.widgets.player.stateChange("mini");
		break;

	}
}

addOnsInter.prototype.openNextSection = function openNextSection(_allow){
	if(_allow){
	NGM.dump(this.actualForm);
		if(this.actualForm == "comprando"){
			var params = ["alias="+this.getWidgetFocus(true).selectItem.BundleVO.alias];
			getServices.getSingleton().call("ADMIN_BUY_ADONS", params,  this.responseBuyAddons.bind(this));
		}else if(this.actualForm == "nipButtons"){
			this.client.lock();
				this.widgets.backButton.stateChange("exit");
				this.widgets.disclamerFull.stateChange("exit");
				this.widgets.accessButtons.stateChange("exit");
			this.client.unlock();
			var params = ["alias="+this.alias];
			getServices.getSingleton().call("ADMIN_GET_DESCRIPTION_ADDON", params,  this.responseGetDescription.bind(this));
		}else{
			this.home.closeSection(this);
		}
	}else{
		if(this.actualForm != "nipButtons"){
			this.actualForm = "vod";
		}
	}
	
}

addOnsInter.prototype.setKeyTrue = function setKeyTrue(){
	this.lockKey = true;
}

addOnsInter.prototype.setFocusIndex = function setFocusIndex(list){
	list.focusIndexMin = 2;
	list.focusIndexMax = 7;
	
	if(this.actualFocus < 2 || this.actualFocus > 7){
		list.focusIndex = 2;
	}else{
		if(list.maxItem < this.actualFocus){
			list.focusIndex = list.maxItem+1;
		}else{
			list.focusIndex = this.actualFocus;
		}
	}
}

addOnsInter.prototype.getWidgetFocus = function getWidgetFocus(_list){
	var widgets = this.widgets;
	switch("enterUP"){
		case widgets.oneCategoriesList.stateGet():
			if(_list){
				return widgets.oneCategoriesList;
			}else{
				return widgets.headerCategoriesOne;
			}
			break;
		case widgets.twoCategoriesList.stateGet():
			if(_list){
				return widgets.twoCategoriesList;
			}else{
				return widgets.headerCategoriesTwo;
			}
			break;
		case widgets.threeCategoriesList.stateGet():
			if(_list){
				return widgets.threeCategoriesList;
			}else{
				return widgets.headerCategoriesThree;
			}
			break;
		case widgets.fourCategoriesList.stateGet():
			if(_list){
				return widgets.fourCategoriesList;
			}else{
				return widgets.headerCategoriesFour;
			}
			break;
		default:
			return null;
			break;
	}
}

addOnsInter.prototype.setWidgetFocus = function setWidgetFocus(state){
	var widgets = this.widgets;
	if(state != "init"){
		switch("enterUP"){
			case widgets.oneCategoriesList.stateGet():
				widgets.twoCategoriesList.setFocus(false);
				widgets.fourCategoriesList.setFocus(false);
				
				widgets.oneCategoriesList.setFocus(true);
				break;
			case widgets.twoCategoriesList.stateGet():
				widgets.oneCategoriesList.setFocus(false);
				widgets.threeCategoriesList.setFocus(false);
				
				widgets.twoCategoriesList.setFocus(true);
				break;
			case widgets.threeCategoriesList.stateGet():
				widgets.twoCategoriesList.setFocus(false);
				widgets.fourCategoriesList.setFocus(false);
				
				widgets.threeCategoriesList.setFocus(true);
				break;
			case widgets.fourCategoriesList.stateGet():
				widgets.oneCategoriesList.setFocus(false);
				widgets.threeCategoriesList.setFocus(false);
				
				widgets.fourCategoriesList.setFocus(true);
				break;
		}		
	}else{
		widgets.oneCategoriesList.setFocus(true);
		this.setFocusIndex(widgets.oneCategoriesList,2);
	}
	
	var focusI = this.getWidgetFocus(true).focusIndex-2;
	var selectI = this.getWidgetFocus(true).selectIndex;
	var maxI = this.getWidgetFocus(true).maxItem;
	var res = focusI - selectI;
	if(res < 0){
		widgets.arrowsLR.data.left = true;
	}else{
		widgets.arrowsLR.data.left = false;
	}
	
	focusI = (5-focusI);
	res = (focusI + 1 + selectI);
	if(maxI > res){
		widgets.arrowsLR.data.right = true;
	}else{
		widgets.arrowsLR.data.right= false;
	}
	widgets.arrowsLR.data.total = this.getWidgetFocus(true).maxItem;
	widgets.arrowsLR.refresh();
	widgets.arrowsLR.stateChange("enter");
	
	if(widgets.headerCategoriesOne.data.position)
		widgets.headerCategoriesOne.data.position=null;
	
	if(widgets.headerCategoriesTwo.data.position)
		widgets.headerCategoriesTwo.data.position=null;
	
	if(widgets.headerCategoriesThree.data.position)
		widgets.headerCategoriesThree.data.position=null;
	
	if(widgets.headerCategoriesFour.data.position)
		widgets.headerCategoriesFour.data.position=null;
	
	widgets.headerCategoriesOne.refresh();
	widgets.headerCategoriesTwo.refresh();
	widgets.headerCategoriesThree.refresh();
	widgets.headerCategoriesFour.refresh();
	
	
}


addOnsInter.prototype.getTimeFormat = function getTimeFormat(_data){
	var time = _data;
	var min;
	var seg;
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
	return "min "+min;
}


addOnsInter.onFocusLists = function onFocusLists(_focus, _data){
	var widgets = this.widgets;
	clearTimeout(this.timerLoadData);
	
	//NGM.dump(_data.item.ChannelVO);
	
	
	if(_focus || this.widgets.descriptionItem.stateGet() != "enter"){
		this.timerLoadData =
		setTimeout(function(){
			widgets.footerList.stateChange("opaque");
			widgets.descriptionItem.setDataAnimated(this.parseDescription(_data.item, this.bundleVO), "exit", "enter");
			widgets.footerList.setData({"subtitle": _data.item.BundleVO.terms});
			widgets.footerList.stateChange("enter");
			widgets.footerList.refresh();
			
			// _data.item.BundleVO.url = "http://vod.cdn.iutpcdn.com:80/VOD/H01/HD/WBK0446SStrl/index.m3u8";
			this.urlV = _data.item.BundleVO.url;
			if(_data.item.BundleVO.url){
				this.home.playVideo(_data.item.BundleVO.url, "VIDEO", 0, "mini");
				this.home.widgets.player.stateChange("mini");
			}else{
				this.home.widgets.player.setData();
				this.home.widgets.player.stateChange("exit");
			}
			
			if(_data.item.BundleVO.images.url18X18){
				this.setBackground(_data.item.BundleVO.images.url18X18);
			}
			
		}.bind(this), 1000);
	}
}


addOnsInter.prototype.pausePlayer = function pausePlayer(){
	this.home.setPlayerStatus("PAUSE");
	this.widgets.playerMessage.setData(this.getTimeFormat(this.getWidgetFocus(true).selectItem.VodMovieVO.bookmark));
	this.widgets.playerMessage.stateChange("enter");
}



addOnsInter.prototype.parseDescription = function parseDescription(_data, bundleVO){
	//this.bundleVO;
	//this.categories
	var _qualify = -1,
		_price = null,
		_name=null,
		_rating=null;
		_aditional=null,
		_actors=null,
		_description=null;
	
	if(_data.BundleVO){
		///////////////////////// Estrellas
		_qualify = -1;
		/////////////////////////Precio
		if(_data.BundleVO.isActive){
			_price = "Actualmente contratado";
		}else{
			_price = _data.BundleVO.fullPrice ? _data.BundleVO.fullPrice + "" : "$" + _data.BundleVO.price;
		}

		/////////////////////////Nombre
		_name= _data.BundleVO.name;
		/////////////////////////Clasificacion
		_rating=_data.BundleVO.rating;
		/////////////////////////Adicional
		_aditional = "";
		/////////////////////////Actores
		_actors="";
		/////////////////////////Descripcion
		_description=_data.BundleVO.description;
		
	}
	
	
	
	
	return {"qualify": _qualify,
			"price": _price,
			"name": _name,
			"rating": _rating,
			"aditional":_aditional,
			"actors": _actors,
			"description": _description,
			"fullPB": true};
}

drawAccessButtons = function drawAccessButtons(_data){ 		
	this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		
		if(_data.image){
			tp_draw.getSingleton().drawImage(_data.image, ctx, 5, 5, null, null, null,"destination-over");
		}else{
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], {"fill":"rgba(0,150,190,1)"});
			if(_data.imageBtn){
				tp_draw.getSingleton().drawImage(_data.imageBtn, ctx, 65, 0);
			}
		}
		
		/*
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) :JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
		custo = JSON.parse(custo);
		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		*/
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
		if(focus){
				custo.rx = 5;
				custo.stroke_width = 5;
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

				var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_position" : "inside"};
				Canvas.drawShape(ctx, "rect", [7, 7, ctx.viewportWidth-14,ctx.viewportHeight-14], strokeF);
				//388 //222
		}else{
				Canvas.drawShape(ctx, "rect", [5 ,5 ,ctx.viewportWidth-10,ctx.viewportHeight-10], custo); //FONDO		
			}		
		
		
		
		var custo = JSON.stringify(this.themaData.custoDateNumber);
		custo = JSON.parse(custo);
		custo.text_align = "left,middle";
		custo.fill = "rgba(250, 250, 240, 1)";
		custo.font_size = 18* tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.label , new Rect(5, 0, ctx.viewportWidth, ctx.viewportHeight), custo);
		
		ctx.drawObject(ctx.endObject());	
	}
}

addOnsInter.drawBackButton = function drawBackButton(_data){ 
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    	
	    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
					    
	    //var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
		//custo = JSON.parse(custo);
		//Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		
		if(focus){
			//custo_f.text_align = "left,middle";
			//custo_f.font_size = 18 * tpng.thema.text_proportion;
			//custo_f.fill = "rgba(0,0,0,1)";		
			//Canvas.drawText(ctx, _data.text+"", new Rect(5,0,100,ctx.viewportHeight), custo_f);
			//var custoF = {fill: "rgba(255,255,255,1)"};
			//Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoF); // fondo negro con transparencia
			tp_draw.getSingleton().drawImage("img/tv/AtrasON.png", ctx, 35, 26);
		}
		
		//custo_f.text_align = "left,middle";
		//custo_f.font_size = 18 * tpng.thema.text_proportion;
		//Canvas.drawText(ctx, _data.text+"", new Rect(5,0,100,ctx.viewportHeight), custo_f);
	    tp_draw.getSingleton().drawImage("img/tv/AtrasOFF.png", ctx, 35, 26, null, null, null,"destination-over");
	    
	    ctx.drawObject(ctx.endObject());
	}
}	

addOnsInter.drawTooltip = function drawTooltip(_data){ 		
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	var custo_f = JSON.stringify(this.themaData.standarBlackFont);
	custo_f = JSON.parse(custo_f);		
	custo_f.text_align = "center,middle";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text+"", new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo_f);
	tp_draw.getSingleton().drawImage("img/commons/TextBalloon.png", ctx, _data.x, 0,null,null,null,"destination-over");
	
	ctx.drawObject(ctx.endObject());	
}

drawDisclamerFull = function drawDisclamerFull(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
	var custo = JSON.stringify(this.themaData.custoDateNumber);
	custo = JSON.parse(custo);
	custo.text_align = "top,left";
	custo.fill = "rgba(250, 250, 240, 1)";
	custo.font_size = 20* tpng.thema.text_proportion;
	Canvas.drawText(ctx, "Disclamer<!br>Al entrar en \"Adultv\" estas aceptando y declarando:<!br>1. Estar consciente de que \"Adultv\" es una aplicacion con contenido para adultos.<!br>"+"2. Ser mayor de edad en tu país y que el contenido dentro de \"Adultv\" no contraria tus principios morales y/o religiosos.<!br>"+"3. Liberar y exonerar a los proveedores, dueños, creadores y personas relacionadas de cualquiero forma a \"Adultv\" de toda responsabilidad derivada por el uso que hagas de la información y material aquí contenido.<!br><!br>"+"<!i>*Para entrar en esta sección es necesario que ingreses el NIP del Administrador<!>", new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo);
	ctx.drawObject(ctx.endObject());
}


