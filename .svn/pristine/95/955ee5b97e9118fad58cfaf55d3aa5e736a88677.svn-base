// addOns.js


FormWidget.registerTypeStandard("addOns");

function addOns(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.indexBg=true;
   	clearTimeout(this.deleyPlayer);
   	clearTimeout(this.timerLoadData);
   	
}

addOns.inherits(FormWidget);

addOns.prototype.onEnter = function onEnter(_data){
	NGM.trace(" ");
	NGM.trace("addOns");
	
	
	this.home = _data.home;
	this.lockKey = true;
	this.actualFocus = 2;
	this.alias = _data.parameters.alias;
	//Para asegurarnos que el background
	//ya esté setteado desde el principio
	
	this.home.objectChild = this;	
	this.counting = 0;
	this.home.showHeader({"section":this});
	
	if(_data.parameters){
		var params = ["alias="+_data.parameters.alias];
		getServices.getSingleton().call("ADMIN_GET_DESCRIPTION_ADDON", params,  this.responseGetDescription.bind(this));
	}
	
	this.widgets.playerMessage.setData("");
}

addOns.prototype.onExit = function onExit(_data){
	if(this.actualForm == "open"){
		this.closeLists();
	}
	this.widgets.descriptionItem.setData(null);

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

addOns.prototype.closeLists = function closeLists(){
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
	
	this.client.unlock();
}

//TODO: ver si esta función la pasamos a la librería IMG
addOns.prototype.loadPaintImg = function loadPaintImg(_url){
	//Función que pinta la imagen hasta que se descarga
	//Para transiciones de addOns, menú y wizard VOD
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

addOns.prototype.imgLoadCb = function imgLoadCb(url, img, arg){
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


addOns.prototype.setBackground = function setBackground(_url){

	var bg = this.home.widgets.mainBg;

	//Antes de la carga de la imagen pasamos a medium el background
	//para lograr el efecto de medium a enter
	bg.stateChange("medium");
	this.loadPaintImg(_url);
}


addOns.prototype.responseGetDescription = function responseGetDescription(response){
	
	if(response.status == 200){
		this.bundleVO = response.data.ResponseVO.bundlesArray[0].BundleVO;
		this.urlV = response.data.ResponseVO.bundlesArray[0].BundleVO.url;
		//this.urlV = "http://vod.cdn.iutpcdn.com:80/VOD/H01/HD/WBK0446SStrl/index.m3u8";
		
		
		this.actualPos = 0;
		this.totalPos = this.bundleVO.length-1;
		
		var params = ["alias="+this.alias];
		getServices.getSingleton().call("ADMIN_GET_LIST_ADDON", params,  this.responseGetCategories.bind(this));
		
		this.widgets.footerList.setData({ "subtitle": this.bundleVO.terms});
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

addOns.prototype.responseGetCategories = function responseGetCategories(response){
	
	if(response.status == 200){
		this.categories = response.data.ResponseVO.channels;
		//var urlVideo = response.data.ResponseVO.urlVideo; // ******		
		if(this.categories.length > 0){
			this.initList();
		}else{
			this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"}, false);
		}
		
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

addOns.prototype.responseBuyAddons = function responseBuyAddons(response){
	if(response.status == 200){
		if(response.data.ResponseVO.status == 0){
			this.widgets.stateChange("exit");
			this.home.openSection("welcomeAddOns", {"name": "welcomeAddOns", "home":this.home, "bundleVO":this.bundleVO, "channels": this.categories}, false);
		}else{
			this.actualForm="vod";
			this.home.openSection("miniError", {"home": this.home, "code":response.data.ResponseVO.status, "message":response.data.ResponseVO.message, "suggest":response.data.ResponseVO.suggest}, false);
		}
	}else{
		this.home.openSection("miniError", {"home": this.home, "code":response.status, "message":response.error.message, "suggest":response.error.suggest}, false);	
	}
}



addOns.prototype.initList = function initList(_data){
	var widgets = this.widgets;
	var sectionIndex = -1;
	var init = true;
	for(var x = 0; x < tpng.app.sections.length; x++){
		if(tpng.app.sections[x].name == "addOns" && tpng.app.sections[x].params.indexList >= 0){
			sectionIndex = x;
			init = false;
		}
	}

	if(this.urlV){
		this.home.playVideo(this.urlV, "VIDEO", 0, "mini");
		this.home.widgets.player.stateChange("mini");
	}else{
		this.home.widgets.player.setData();
		this.home.widgets.player.stateChange("exit");
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
	
	
	
	this.setFocusIndex(widgets.oneCategoriesList);
	this.client.lock();
		this.animateWidgets([[widgets.oneCategoriesList, widgets.headerCategoriesOne]],
						 200,
						 [["enterUP", "enterUP"]]);
		
	
		widgets.arrowsLR.stateChange("enter");
		widgets.arrowsUD.stateChange("enter");
	this.client.unlock();
	
	
}


addOns.prototype.secondInit = function secondInit(init){
	if(init){
		this.setWidgetFocus("init");
	}else{
		this.setWidgetFocus("");
	}
	this.widgets.headerCategoriesOne.data.position = this.getWidgetFocus(true).selectIndex+1;
	this.widgets.headerCategoriesOne.refresh();
	this.widgets.headerCategoriesOne.stateChange("enterUP");
	this.widgets.headerCategoriesOne.stateChange("enterUP");
	this.actualForm="vod";
}


addOns.prototype.animateWidgets = function animateWidgets(_widgets, _delay, _state, _callback, _index){		
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
			if(this.actualForm == "close"){
				
			}else if(this.actualForm == "open"){
				
			}else{
				this.secondInit();
			}
			return;
		}
		
	}
}

addOns.prototype.exitAnimation = function exitAnimation(){
	clearTimeout(this.deleyPlayer);
	clearTimeout(this.timerLoadData);
	var widgets = this.widgets;
	widgets.stateChange("exit");
	/*
	this.client.lock();
		widgets.arrowsUD.stateChange("exit");
		widgets.expiration.stateChange("exit");
		widgets.playerMessage.stateChange("exit");
		widgets.descriptionItem.stateChange("exit");
		widgets.arrowsLR.stateChange("exit");
		widgets.footerList.stateChange("exit");
	this.client.unlock();
	*/
	if(this.actualForm == "close")
		this.home.closeSection(this);
}



addOns.prototype.onKeyPress = function onKeyPress(_key){
	switch(this.actualForm){
		case "search":
			this.onKeyPressSearch(_key);
			break;
		case "vod":
			this.onKeyPressVod(_key);
			break;
	}
	return true;
	
}

addOns.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			this.home.disableSearchHeader();
			this.getWidgetFocus(true).setFocus(true);
			this.actualForm="vod";
			break;
		default:
			this.home.onKeyPress(_key);
			break;
	}
}

addOns.prototype.onKeyPressVod = function onKeyPressVod(_key){
	var oneList   = this.widgets.oneCategoriesList,
		twoList   = this.widgets.twoCategoriesList,
		threeList = this.widgets.threeCategoriesList,
		fourList  = this.widgets.fourCategoriesList,
		widgets   = this.widgets;
	
	
	if(this.lockKey){
	
		switch(_key){
			case "KEY_TV_VOD":
			case "KEY_MENU":
			case "KEY_IRBACK":
				this.actualForm = "close";
				this.animateWidgets( [[this.widgets.oneCategoriesList,
								  this.widgets.headerCategoriesOne]],
								  200,
								  [["exitOne", "exitOne"]],
								  this.exitAnimation.bind(this));
				
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
				//NGM.dump(tpng.app.sections[0].params,2);
						
				/*for(var x = 0; x < tpng.app.sections.length; x++){
					if(tpng.app.sections[x].name == "addOns"){
						tpng.app.sections[x].params.indexList = this.actualPos;
						tpng.app.sections[x].params.posList = this.getWidgetFocus(true).selectIndex-(this.getWidgetFocus(true).focusIndex-2);
						tpng.app.sections[x].params.focusPos = this.getWidgetFocus(true).focusIndex;
					}
				}*/
				//NGM.dump(tpng.app.sections[0].params,2);
				
				if(!this.bundleVO.isActive){
					//this.home.openSection("confirm",{"home":this.home, "formP":this, "formData":{"title":"¿Confirmas un unico pago de $"+this.bundleVO.price+" por un  mes de "+this.bundleVO.name+"?", "txt1": "Total: $"+this.bundleVO.price, "txt2": "*Con cargo recurrente a tu estado de cuenta Totalplay", "txt3": ""}}, false,null,true);
					//this.home.openSection("confirm",{"home":this.home,  "alias": this.alias, "parent":this, "bundleVO":this.bundleVO, "channels":this.categories}, false,null,true);
					this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":"Usa los números en tu control remoto para ingresar el nip del usuario indicado para contratar "+this.bundleVO.name, "txt1": "Contratar: "+this.bundleVO.name, "txt2": "Clasificación: "+this.getWidgetFocus(true).selectItem.ChannelVO.rating, "txt3": ""}}, false,null,true);
				}else{
					setTimeout(function(){
						tpng.app.sections = [];
						this.home.closeSection(this);
						this.home.widgets.player.stateChange("enter");
						this.home.tuneInByNumber(this.getWidgetFocus(true).selectItem.ChannelVO.number,true,null);
						tpng.app.programInfo = "zap";
					}.bind(this), 2000);					
				}
				break;
		}
	}
}

addOns.prototype.closeVodHome = function closeVodHome(){
	var widgets = this.widgets;
	var arrWidgets = [0,0,0,0];
	
	switch("enterUP"){
		case widgets.oneCategoriesList.stateGet():
			var array=[];
			array.push(widgets.oneCategoriesList);
			array.push(widgets.headerCategoriesOne);
			arrWidgets[0]=array;
			break;
		case widgets.twoCategoriesList.stateGet():
			var array=[];
			array.push(widgets.twoCategoriesList);
			array.push(widgets.headerCategoriesTwo);
			arrWidgets[0]=array;
			break;
		case widgets.threeCategoriesList.stateGet():
			var array=[];
			array.push(widgets.threeCategoriesList);
			array.push(widgets.headerCategoriesThree);
			arrWidgets[0]=array;
			break;
		case widgets.fourCategoriesList.stateGet():
			var array=[];
			array.push(widgets.fourCategoriesList);
			array.push(widgets.headerCategoriesFour);
			arrWidgets[0]=array;
			break;
	}
	
	switch("enterDOWN"){
		case widgets.oneCategoriesList.stateGet():
			var array=[];
			array.push(widgets.oneCategoriesList);
			array.push(widgets.headerCategoriesOne);
			arrWidgets[1]=array;
			break;
		case widgets.twoCategoriesList.stateGet():
			var array=[];
			array.push(widgets.twoCategoriesList);
			array.push(widgets.headerCategoriesTwo);
			arrWidgets[1]=array;
			break;
		case widgets.threeCategoriesList.stateGet():
			var array=[];
			array.push(widgets.threeCategoriesList);
			array.push(widgets.headerCategoriesThree);
			arrWidgets[1]=array;
			break;
		case widgets.fourCategoriesList.stateGet():
			var array=[];
			array.push(widgets.fourCategoriesList);
			array.push(widgets.headerCategoriesFour);
			arrWidgets[1]=array;
			break;
	}
	
	switch("exitDOWN"){
		case widgets.oneCategoriesList.stateGet():
			var array=[];
			array.push(widgets.oneCategoriesList);
			array.push(widgets.headerCategoriesOne);
			arrWidgets[2]=array;
			break;
		case widgets.twoCategoriesList.stateGet():
			var array=[];
			array.push(widgets.twoCategoriesList);
			array.push(widgets.headerCategoriesTwo);
			arrWidgets[2]=array;
			break;
		case widgets.threeCategoriesList.stateGet():
			var array=[];
			array.push(widgets.threeCategoriesList);
			array.push(widgets.headerCategoriesThree);
			arrWidgets[2]=array;
			break;
		case widgets.fourCategoriesList.stateGet():
			var array=[];
			array.push(widgets.fourCategoriesList);
			array.push(widgets.headerCategoriesFour);
			arrWidgets[2]=array;
			break;
	}
	
	switch("exitUP"){
		case widgets.oneCategoriesList.stateGet():
			var array=[];
			array.push(widgets.oneCategoriesList);
			array.push(widgets.headerCategoriesOne);
			arrWidgets[3]=array;
			break;
		case widgets.twoCategoriesList.stateGet():
			var array=[];
			array.push(widgets.twoCategoriesList);
			array.push(widgets.headerCategoriesTwo);
			arrWidgets[3]=array;
			break;
		case widgets.threeCategoriesList.stateGet():
			var array=[];
			array.push(widgets.threeCategoriesList);
			array.push(widgets.headerCategoriesThree);
			arrWidgets[3]=array;
			break;
		case widgets.fourCategoriesList.stateGet():
			var array=[];
			array.push(widgets.fourCategoriesList);
			array.push(widgets.headerCategoriesFour);
			arrWidgets[3]=array;
			break;
	}
	
	switch("exit"){
		case widgets.oneCategoriesList.stateGet():
			var array=[];
			array.push(widgets.oneCategoriesList);
			array.push(widgets.headerCategoriesOne);
			arrWidgets[3]=array;
			break;
		case widgets.twoCategoriesList.stateGet():
			var array=[];
			array.push(widgets.twoCategoriesList);
			array.push(widgets.headerCategoriesTwo);
			arrWidgets[3]=array;
			break;
		case widgets.threeCategoriesList.stateGet():
			var array=[];
			array.push(widgets.threeCategoriesList);
			array.push(widgets.headerCategoriesThree);
			arrWidgets[3]=array;
			break;
		case widgets.fourCategoriesList.stateGet():
			var array=[];
			array.push(widgets.fourCategoriesList);
			array.push(widgets.headerCategoriesFour);
			arrWidgets[3]=array;
			break;
	}
	
	this.animateWidgets( arrWidgets,
						 200,
						 [["exitOne", "exitOne"],
						  ["exitTwo", "exitTwo"],
						  ["exitTwo", "exitTwo"],
						  ["exitTwo", "exitTwo"]],
						  this.exitAnimation.bind(this));
	
}

addOns.prototype.openNextSection = function openNextSection(_allow){
	if(_allow){
		//this.home.openSection("welcomeAddOns", {"name": "welcomeAddOns", "home":this.home, "bundleVO":this.bundleVO, "channels": this.categories}, false);
		this.actualForm="comprando";
		var password = tpng.backend.mac_address.replace( /:/g, "");	
		var ciphertext = encryptByDES(password, tpng.stb.key);
		
		var params = ["alias="+this.alias,"auth="+ciphertext];
		getServices.getSingleton().call("ADMIN_BUY_ADONS", params,  this.responseBuyAddons.bind(this));
	}else{
		this.actualForm="vod";
	}
}

addOns.prototype.setKeyTrue = function setKeyTrue(){
	this.lockKey = true;
}

addOns.prototype.setFocusIndex = function setFocusIndex(list){
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

addOns.prototype.getWidgetFocus = function getWidgetFocus(_list){
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

addOns.prototype.setWidgetFocus = function setWidgetFocus(state){
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


addOns.prototype.getTimeFormat = function getTimeFormat(_data){
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


addOns.onFocusLists = function onFocusLists(_focus, _data){
	var widgets = this.widgets;
	clearTimeout(this.timerLoadData);
	
	//NGM.dump(_data.item.ChannelVO);
	if(_focus || this.widgets.descriptionItem.stateGet() != "enter"){
		this.timerLoadData =
		setTimeout(function(){
			widgets.descriptionItem.setDataAnimated(this.parseDescription(_data.item, this.bundleVO), "exit", "enter");
			
			
			/*
			widgets.playerMessage.stateChange("exit");
			if(_data.item.VodMovieVO.expiration){
				widgets.expiration.setData(_data.item.VodMovieVO.expiration);
				widgets.expiration.stateChange("enter");
			}else{
				widgets.expiration.stateChange("exit");
			}
			
			clearTimeout(this.deleyPlayer);
			if(_data.item.VodMovieVO.isBuy){
				if(_data.item.VodMovieVO.bookmark){
					if(_data.item.VodMovieVO.bookmark > 120000){
						var bookmark = _data.item.VodMovieVO.bookmark-120000;
						bookmark = bookmark < 0 ? 0 : bookmark ;
						this.home.playVideo(_data.item.VodMovieVO.formats[0].VodFormatVO.url, "VIDEO", bookmark, "mini");	
						this.home.widgets.player.stateChange("mini");
						
						this.deleyPlayer = this.pausePlayer.bind(this).delay(120000);  //this.pausePlayer.bind(this).delay(120000);
					}else if(_data.item.VodMovieVO.bookmark > 0 && _data.item.VodMovieVO.bookmark < 120000){
						var bookmark = _data.item.VodMovieVO.bookmark;
						bookmark = bookmark < 0 ? 0 : bookmark ;
						this.home.playVideo(_data.item.VodMovieVO.formats[0].VodFormatVO.url, "VIDEO", bookmark, "mini");	
						this.home.widgets.player.stateChange("mini");
						
						this.deleyPlayer = this.pausePlayer.bind(this).delay(bookmark);  //this.pausePlayer.bind(this).delay(120000);
					}else if(_data.item.VodMovieVO.bookmark < 0){
						var bookmark = 3000;
						bookmark = bookmark < 0 ? 0 : bookmark ;
						this.home.playVideo(_data.item.VodMovieVO.formats[0].VodFormatVO.url, "VIDEO", bookmark, "mini");	
						this.home.widgets.player.stateChange("mini");
						
						this.deleyPlayer = this.pausePlayer.bind(this).delay(bookmark);  //this.pausePlayer.bind(this).delay(120000);
					}
				}else{
					
				}
				
			}else{
				if(_data.item.VodMovieVO.urlTrailer){
					this.home.playVideo(_data.item.VodMovieVO.urlTrailer, "VIDEO", 0, "mini");
					this.home.widgets.player.stateChange("mini");
				}else{
					this.home.widgets.player.setData();
					//this.home.widgets.player.stateChange("exit");
				}
			}*/
			
			if(_data.item.ChannelVO.program.ProgramVO.showTittle && _data.item.ChannelVO.program.ProgramVO.showTittle == false){
				this.setBackground(_data.item.ChannelVO.program.ProgramVO.images.url18X18);
			}else{
				this.setBackground(_data.item.ChannelVO.images.url18X18);
			}
			
		}.bind(this), 1000); //regresar el delay a 1000
	}
}

addOns.prototype.onStreamEvent = function onStreamEvent(event) {
	switch(event.type){
		case "end":
		case "endOfFile":
			this.home.playVideo(this.urlV, "VIDEO", 0, "mini");
			this.home.widgets.player.stateChange("mini");
		break;

	}	
}


addOns.prototype.pausePlayer = function pausePlayer(){
	unsetTimeAlarm(this.deleyPlayer);
	this.home.setPlayerStatus("PAUSE");
//	this.widgets.playerMessage.setData(this.getTimeFormat(this.getWidgetFocus(true).selectItem.VodMovieVO.bookmark));
	this.widgets.playerMessage.stateChange("enter");
	
}


addOns.prototype.parseDescription = function parseDescription(_data, bundleVO){
	//this.bundleVO;
	//this.categories
	var _qualify = -1,
		_price = null,
		_name=null,
		_rating=null;
		_aditional=null,
		_actors=null,
		_description=null;
	
	if(_data.ChannelVO){
		///////////////////////// Estrellas
			_qualify = -1;
			/////////////////////////Precio
			if(bundleVO.isActive){
				//_price = "Ya cuentas con "+bundleVO.name;
				_price = "Actualmente contratado";
			}else{
				_price = "Suscríbete por $"+bundleVO.price+" al mes";
			}
	
		if(_data.ChannelVO.program.ProgramVO.showTittle && _data.ChannelVO.program.ProgramVO.showTittle == false){
			/////////////////////////Nombre
			_name= bundleVO.name+"<!br>"+_data.ChannelVO.program.ProgramVO.name;
			/////////////////////////Clasificacion
			_rating="";
			/////////////////////////Adicional
			_aditional = "Canal "+_data.ChannelVO.number;
			/////////////////////////Actores
			_actors=_data.ChannelVO.program.ProgramVO.actors;
			/////////////////////////Descripcion
			_description=_data.ChannelVO.program.ProgramVO.description;
		}else{
			/////////////////////////Nombre
			_name= bundleVO.name+"<!br>"+_data.ChannelVO.name;
			/////////////////////////Clasificacion
			_rating= "";
			/////////////////////////Adicional
			_aditional = "Canal "+_data.ChannelVO.number;
			/////////////////////////Actores
			_actors="";
			/////////////////////////Descripcion
			_description=_data.ChannelVO.description;
		}
		
		
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





