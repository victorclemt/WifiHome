// anytimetvChapters.js


FormWidget.registerTypeStandard("anytimetvChapters");

function anytimetvChapters(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.indexBg=true;
   	clearTimeout(this.deleyPlayer);
   	clearTimeout(this.timerLoadData);
   	
}

anytimetvChapters.inherits(FormWidget);

anytimetvChapters.prototype.onEnter = function onEnter(_data){
	NGM.trace(" ");
	NGM.trace("anytimetvChapters");
	

	this.home = _data.home;
	this.lockKey = true;
	this.actualFocus = 2;
	//Para asegurarnos que el background
	//ya esté setteado desde el principio
	var bg = this.home.widgets.mainBg;
   	bg.setData();
	
	
	this.home.objectChild = this;
	this.counting = 0;
	this.home.showHeader({"section":this});
	this.haveService=null;
	
	this.ccaId = _data.ccaId;
	this.channelNumber = _data.channelNumber;
	var params = ["ccaId="+this.ccaId, "channelNumber="+this.channelNumber];
	getServices.getSingleton().call("EPG_ANYTIME_TV_CHAP", params,  this.responseGetCategories.bind(this));
	
	this.widgets.footerList.setData({"title": "¿No encontraste lo que buscabas?", "subtitle": "Intenta usando  la búsqueda o encuentra contenido grabado en la sección Anytimetv."});
	this.widgets.playerMessage.setData("");
}

anytimetvChapters.prototype.onExit = function onExit(_data){
	if(this.actualForm == "open"){
		this.closeLists();
	}
	
	clearTimeout(this.deleyPlayer);
   	clearTimeout(this.timerLoadData);
	
	this.widgets.descriptionItem.setData(null);

	this.client.lock();
		this.home.setPlayerStatus("STOP");
		this.home.objectChild = null;
		this.home.hideHeader();
		this.home.hideBg();
	this.client.unlock();
}

anytimetvChapters.prototype.closeLists = function closeLists(){
	var widgets = this.widgets;
	
	
	this.client.lock();
		widgets.arrowsUD.stateChange("exit");
		widgets.expiration.stateChange("exit");
		widgets.playerMessage.stateChange("exit");
		widgets.descriptionItem.stateChange("exit");
		widgets.arrowsLR.stateChange("exit");
		widgets.footerList.stateChange("exit");
		widgets.buttonStopRecording.stateChange("exit");
		
	this.client.unlock()
	
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
anytimetvChapters.prototype.loadPaintImg = function loadPaintImg(_url){
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

anytimetvChapters.prototype.imgLoadCb = function imgLoadCb(url, img, arg){
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


anytimetvChapters.prototype.setBackground = function setBackground(_url){

	var bg = this.home.widgets.mainBg;

	//Antes de la carga de la imagen pasamos a medium el background
	//para lograr el efecto de medium a enter
	bg.stateChange("medium");
	this.loadPaintImg(_url);
}


anytimetvChapters.prototype.responseGetCategories = function responseGetCategories(response){
	
	if(response.status == 200){
		this.categories = response.data.ResponseVO.categories;
		if(this.categories.length > 0){
			this.actualPos = 0;
			this.totalPos = this.categories.length-1;
			this.initList();
		}else{
			this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"}, false);
		}
		
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}




anytimetvChapters.prototype.initList = function initList(_data){
	var widgets = this.widgets;
	var sectionIndex = -1;
	var init = true;
	for(var x = 0; x < tpng.app.sections.length; x++){
		if(tpng.app.sections[x].name == "anytimetvChapters" && tpng.app.sections[x].params.indexList >= 0){
			sectionIndex = x;
			init = false;
		}
	}

	widgets.buttonStopRecording.setData({"focus":false});
	widgets.buttonStopRecording.stateChange("enter");	
	
	if(init){
		widgets.oneCategoriesList.setData(this.categories[this.actualPos].CategoryVO.programsArray);
		widgets.headerCategoriesOne.setData({"total":this.categories[this.actualPos].CategoryVO.totalElements,"position": 1,"categoryName": this.categories[this.actualPos].CategoryVO.categoryName, "focus": true});
		
		if(widgets.oneCategoriesList.maxItem > 6){
			widgets.arrowsLR.setData({"left": false, "right": true, "total": widgets.oneCategoriesList.maxItem});
		}else{
			widgets.arrowsLR.setData({"left": true, "right": false, "total": widgets.oneCategoriesList.maxItem});
		}
		if(this.categories.length == 1){
			widgets.arrowsUD.setData({"up": false, "down": false});
		}else if (this.categories.length > 1){
			widgets.arrowsUD.setData({"up": false, "down": true});
		}
		
		
		widgets.twoCategoriesList.setData(this.categories[this.actualPos+1].CategoryVO.programsArray);
		widgets.headerCategoriesTwo.setData({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
		widgets.threeCategoriesList.setData(this.categories[this.actualPos+2].CategoryVO.programsArray);
		widgets.headerCategoriesThree.setData({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
		widgets.fourCategoriesList.setData(this.categories[this.actualPos+3].CategoryVO.programsArray);
		widgets.headerCategoriesFour.setData({"total":this.categories[this.actualPos+3].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
		
		
		
	}else{
		this.actualPos = tpng.app.sections[sectionIndex].params.indexList;
		this.actualFocus = tpng.app.sections[sectionIndex].params.focusPos;
		
		widgets.oneCategoriesList.setData(this.categories[this.actualPos].CategoryVO.programsArray, tpng.app.sections[sectionIndex].params.posList);
		widgets.headerCategoriesOne.setData({"total":this.categories[this.actualPos].CategoryVO.totalElements,"position": 1,"categoryName": this.categories[this.actualPos].CategoryVO.categoryName, "focus": true});
		
		if(widgets.oneCategoriesList.maxItem > 6){
			widgets.arrowsLR.setData({"left": false, "right": true, "total": widgets.oneCategoriesList.maxItem});
		}else{
			widgets.arrowsLR.setData({"left": true, "right": false, "total": widgets.oneCategoriesList.maxItem});
		}
		if(this.categories.length == 1){
			widgets.arrowsUD.setData({"up": false, "down": false});
		}else if (this.categories.length > 1){
			widgets.arrowsUD.setData({"up": false, "down": true});
		}
		
		if(this.actualPos == 0){
			//Solo elementos hacia abajo
			widgets.twoCategoriesList.setData(this.categories[this.actualPos+1].CategoryVO.programsArray);
			widgets.headerCategoriesTwo.setData({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
			widgets.threeCategoriesList.setData(this.categories[this.actualPos+2].CategoryVO.programsArray);
			widgets.headerCategoriesThree.setData({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setData(this.categories[this.actualPos+3].CategoryVO.programsArray);
			widgets.headerCategoriesFour.setData({"total":this.categories[this.actualPos+3].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
			
		}else if(this.actualPos == this.categories.length-1){
			//Solo elementos hacia arriba
			widgets.threeCategoriesList.setData(this.categories[this.actualPos-2].CategoryVO.programsArray);
			widgets.headerCategoriesThree.setData({"total":this.categories[this.actualPos-2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setData(this.categories[this.actualPos-1].CategoryVO.programsArray);
			widgets.headerCategoriesFour.setData({"total":this.categories[this.actualPos-1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-1].CategoryVO.categoryName, "focus": false});
			
			widgets.footerList.stateChange("enter");
			widgets.arrowsUD.data.up=true;
			widgets.arrowsUD.data.down=false;
			widgets.arrowsUD.refresh();
			
			
		}else if((this.actualPos+3) <= this.categories.length-1 && (this.actualPos-3) >= 0){
			
			//Mas de 3 elementos hacia ambos lados
			
			widgets.twoCategoriesList.setData(this.categories[this.actualPos+1].CategoryVO.programsArray);
			widgets.headerCategoriesTwo.setData({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
			widgets.threeCategoriesList.setData(this.categories[this.actualPos+2].CategoryVO.programsArray);
			widgets.headerCategoriesThree.setData({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setData(this.categories[this.actualPos-1].CategoryVO.programsArray);
			widgets.headerCategoriesFour.setData({"total":this.categories[this.actualPos-1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-1].CategoryVO.categoryName, "focus": false});
			
			widgets.arrowsUD.data.up=true;
			widgets.arrowsUD.refresh();
			
		}else{
			//Mas de 3 elementos hacia ambos lados
			
			widgets.twoCategoriesList.setData(this.categories[this.actualPos+1].CategoryVO.programsArray);
			widgets.headerCategoriesTwo.setData({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
			widgets.threeCategoriesList.setData(this.categories[this.actualPos+2].CategoryVO.programsArray);
			widgets.headerCategoriesThree.setData({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setData(this.categories[this.actualPos-1].CategoryVO.programsArray);
			widgets.headerCategoriesFour.setData({"total":this.categories[this.actualPos-1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-1].CategoryVO.categoryName, "focus": false});
			
			widgets.arrowsUD.data.up=true;
			widgets.arrowsUD.refresh();
		}
		
		
		
	}
	this.setFocusIndex(widgets.oneCategoriesList);
	this.client.lock();
		this.animateWidgets([[widgets.twoCategoriesList, widgets.headerCategoriesTwo],
						 [widgets.oneCategoriesList, widgets.headerCategoriesOne],
						 [widgets.threeCategoriesList, widgets.headerCategoriesThree],
						 [widgets.fourCategoriesList, widgets.headerCategoriesFour]],
						 200,
						 [["enterDOWN", "enterDOWN"],
						  ["enterUP", "enterUP"],
						  ["exitDOWN", "exitDOWN"],
						  ["exitUP", "exitUP"]]);
		
	
		widgets.arrowsLR.stateChange("enter");
		widgets.arrowsUD.stateChange("enter");
	this.client.unlock();
	
	
}

anytimetvChapters.prototype.secondInit = function secondInit(init){
	if(init){
		this.setWidgetFocus("init");
	}else{
		this.setWidgetFocus("");
	}
	this.widgets.headerCategoriesOne.data.position = this.getWidgetFocus(true).selectIndex+1;
	this.widgets.headerCategoriesOne.refresh();
	this.widgets.headerCategoriesOne.stateChange("enterUP");
	
	this.actualForm="vod";
}

anytimetvChapters.prototype.animateWidgets = function animateWidgets(_widgets, _delay, _state, _callback, _index){		
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

anytimetvChapters.prototype.exitAnimation = function exitAnimation(){
	clearTimeout(this.deleyPlayer);
	clearTimeout(this.timerLoadData);
	var widgets = this.widgets;
	this.client.lock();
		widgets.arrowsUD.stateChange("exit");
		widgets.expiration.stateChange("exit");
		widgets.playerMessage.stateChange("exit");
		widgets.descriptionItem.stateChange("exit");
		widgets.arrowsLR.stateChange("exit");
		widgets.footerList.stateChange("exit");
	this.client.unlock();
	
	if(this.actualForm == "close")
		this.home.closeSection(this);
}

anytimetvChapters.prototype.onKeyPress = function onKeyPress(_key){
	switch(this.actualForm){
		case "search":
			this.onKeyPressSearch(_key);
			break;
		case "vod":
			this.onKeyPressVod(_key);
			break;
		case "recording":
			this.onKeyPressRecording(_key);
		break;			
	}
	return true;
	
}

anytimetvChapters.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			this.home.disableSearchHeader();	
			this.actualForm = "recording";
			widgets.buttonStopRecording.setData({"focus":true});
			widgets.buttonStopRecording.refresh();

			break;
		default:
			this.home.onKeyPress(_key);
			break;
	}
}

anytimetvChapters.prototype.onKeyPressRecording = function onKeyPressRecording(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.actualForm = "close";
			this.closeVodHome();		
		break;
		
		case "KEY_UP":
			this.actualForm = "search";		
			this.getWidgetFocus(true).setFocus(false);
			this.home.enableSearchHeader();
			widgets.buttonStopRecording.setData({"focus":false});
			widgets.buttonStopRecording.refresh();	
		break;
		
		case "KEY_DOWN":
//			this.home.disableSearchHeader();
			this.actualForm = "vod";
			this.getWidgetFocus(true).setFocus(true);
			widgets.buttonStopRecording.setData({"focus":false});
			widgets.buttonStopRecording.refresh();			
		break;
		
		case "KEY_IRENTER":

			getServices.getSingleton().call("EPG_RECORDING_NPVR", ["epgId="+this.epgId],  this.responseRecording.bind(this));		
		break;
			
		default:
			this.home.onKeyPress(_key);
		break;
	}
}


anytimetvChapters.prototype.onKeyPressVod = function onKeyPressVod(_key){
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
				this.closeVodHome();
				break;
			case "KEY_DOWN":
				this.lockKey = false;
				this.setKeyTrue.bind(this).delay(400); 
				
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
							fourList.setData(this.categories[this.actualPos+3].CategoryVO.programsArray, this.categories[this.actualPos+3].selectIndex);
							widgets.headerCategoriesFour.setData({"total": this.categories[this.actualPos+3].CategoryVO.totalElements,"position": null, "categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
							
							fourList.stateChange("exitDOWN");
							widgets.headerCategoriesFour.stateChange("exitDOWN");
							break;
						case "exitUP":
							this.actualFocus = twoList.focusIndex;
							oneList.setData(this.categories[this.actualPos+3].CategoryVO.programsArray, this.categories[this.actualPos+3].selectIndex);
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
														
							twoList.setData(this.categories[this.actualPos+3].CategoryVO.programsArray, this.categories[this.actualPos+3].selectIndex);
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

							threeList.setData(this.categories[this.actualPos+3].CategoryVO.programsArray, this.categories[this.actualPos+3].selectIndex);
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
				this.setKeyTrue.bind(this).delay(400); 
				
				if(this.actualPos > 0){
					this.client.lock();
					switch(oneList.stateGet()){
						case "enterUP":
							this.actualFocus = oneList.focusIndex;
							oneList.stateChange("enterDOWN");
							widgets.headerCategoriesOne.stateChange("enterDOWN");
							
							twoList.stateChange("exitDOWN");
							widgets.headerCategoriesTwo.stateChange("exitDOWN");
							
							threeList.setData(this.categories[this.actualPos-2].CategoryVO.programsArray, this.categories[this.actualPos-2].selectIndex);
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
							
							twoList.setData(this.categories[this.actualPos-2].CategoryVO.programsArray, this.categories[this.actualPos-2].selectIndex);
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
							oneList.setData(this.categories[this.actualPos-2].CategoryVO.programsArray, this.categories[this.actualPos-2].selectIndex);
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
							
							fourList.setData(this.categories[this.actualPos-2].CategoryVO.programsArray, this.categories[this.actualPos-2].selectIndex);
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
					this.actualForm = "recording";
					this.getWidgetFocus(true).setFocus(false);
					widgets.buttonStopRecording.setData({"focus":true});
					widgets.buttonStopRecording.refresh();
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

				for(var x = 0; x < tpng.app.sections.length; x++){
					if(tpng.app.sections[x].name == "anytimetvChapters"){
						tpng.app.sections[x].params.indexList = this.actualPos;
						tpng.app.sections[x].params.posList = this.getWidgetFocus(true).selectIndex-(this.getWidgetFocus(true).focusIndex-2);
						tpng.app.sections[x].params.focusPos = this.getWidgetFocus(true).focusIndex;
					}
				}	
				this.home.openSection("anytimePlayer",{"home":this.home, "program": this.getWidgetFocus(true).selectItem.ProgramVO}, false);
				
				break;
		}
	}
}


anytimetvChapters.prototype.closeVodHome = function closeVodHome(){
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

anytimetvChapters.prototype.responseRecording =  function responseRecording(response){
	var widgets = this.widgets;
	
	if(response.status == 200){
		this.actualForm = "";	
		this.actualForm = "close";
		this.home.openSection("message", {"home":this.home, "title": this.nameProgram, "active": false}, false, null, true);
		setTimeout(function(){
			this.closeVodHome();
		}.bind(this), 2500);

	}else{
		this.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}

}

anytimetvChapters.prototype.openNextSection = function openNextSection(_allow){
	if(_allow){
		if(this.getWidgetFocus(true).selectItem.VodMovieVO.type == "VID"){
			if(this.getWidgetFocus(true).selectItem.VodMovieVO.isBuy){
				this.actualForm = "open";
				this.home.openSection("vodPlayer", {"name": "vodPlayer", "home":this.home,"vodId":this.getWidgetFocus(true).selectItem.VodMovieVO.vodId,"statusPlayer":true}, false);
			}else{
				this.actualForm = "open";
				this.home.setPlayerStatus("STOP");
				this.home.openSection("vodDetail", {"home":this.home, "VodMovieVO": this.getWidgetFocus(true).selectItem.VodMovieVO}, false, null, false);
			}
		}else if(this.getWidgetFocus(true).selectItem.VodMovieVO.type == "SER" || this.getWidgetFocus(true).selectItem.VodMovieVO.type == "SEA"){
			this.actualForm = "open";
			this.home.openSection("vodSeasons", {"home":this.home, "vodId": this.getWidgetFocus(true).selectItem.VodMovieVO.vodId, "club":this.alias, "type":this.getWidgetFocus(true).selectItem.VodMovieVO.type, "name":replaceAll(this.getWidgetFocus(true).selectItem.VodMovieVO.name, "@", " ")}, true);
		}
	}
}

anytimetvChapters.prototype.onStreamEvent = function onStreamEvent(event) {
	
	switch(event.type){
	 case "end":
		 this.home.setPlayerStatus("STOP");
	 break;

	 case "start":
		this.deleyPlayer = this.pausePlayer.bind(this).delay(120000);  //this.pausePlayer.bind(this).delay(120000);	 
	 break;

	}	
}


anytimetvChapters.prototype.setKeyTrue = function setKeyTrue(){
	this.lockKey = true;
}

anytimetvChapters.prototype.setFocusIndex = function setFocusIndex(list){
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

anytimetvChapters.prototype.getWidgetFocus = function getWidgetFocus(_list){
	var widgets = this.widgets;
    if (!widgets.oneCategoriesList.stateGet)
        return;
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

anytimetvChapters.prototype.setWidgetFocus = function setWidgetFocus(state){
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


anytimetvChapters.prototype.getTimeFormat = function getTimeFormat(_data){
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


anytimetvChapters.onFocusLists = function onFocusLists(_focus, _data){
	var widgets = this.widgets;
	clearTimeout(this.timerLoadData);
	var bookmark;
	
	this.epgId = _data.item.ProgramVO.id;
	this.nameProgram = _data.item.ProgramVO.name;
	
	if(_focus || this.widgets.descriptionItem.stateGet() != "enter"){
			this.timerLoadData =
			setTimeout(function(){
				widgets.descriptionItem.setDataAnimated(this.parseDescription(_data.item), "exit", "enter");
				widgets.playerMessage.stateChange("exit");
				if(_data.item.ProgramVO.expiration){
					widgets.expiration.setData({"date":_data.item.ProgramVO.expiration});
					widgets.expiration.stateChange("enter");
				}else{
					widgets.expiration.stateChange("exit");
				}
				
				if(_data.item.ProgramVO.urlCtv){
					this.home.playVideo(_data.item.ProgramVO.urlCtv, "VIDEO", 600000, "mini");
				}else{
					this.home.widgets.player.setData();
				}
				
				widgets.expiration.setData({"date":getDateSearch(_data.item.ProgramVO.startTime, _data.item.ProgramVO.endTime), "anytime":true});
				widgets.expiration.stateChange("enter");
				
				this.setBackground(_data.item.ProgramVO.images.url18X18);
			}.bind(this), 1000); //regresar el delay a 1000
		}
	
}


anytimetvChapters.prototype.pausePlayer = function pausePlayer(){
	unsetTimeAlarm(this.deleyPlayer);	
	this.home.setPlayerStatus("PAUSE");
	this.widgets.playerMessage.setData({"anytime":this.getTimeFormat(this.getWidgetFocus(true).selectItem.VodMovieVO.bookmark)});
	this.widgets.playerMessage.stateChange("enter");
}



anytimetvChapters.prototype.parseDescription = function parseDescription(_data){
	
	
	var _qualify = -1,
		_price = null,
		_name=null,
		_rating=null;
		_aditional=null,
		_actors=null,
		_description=null;
	
	if(_data.VodMovieVO){
		///////////////////////// Estrellas
		_qualify = _data.VodMovieVO.qualify;
		/////////////////////////Precio
		if(_data.VodMovieVO.isBuy){
			_price = "Rentada";
		}else{
			if(this.haveService){
				_price = "Contratado";
			}else{
				if(_data.VodMovieVO.formats.length > 0){
					var minPrice = _data.VodMovieVO.formats[0].VodFormatVO.price;
					for(var x = 0; x < _data.VodMovieVO.formats.length; x++){
						if(_data.VodMovieVO.formats[x].VodFormatVO.price <= minPrice)
							minPrice = _data.VodMovieVO.formats[x].VodFormatVO.price;			
					}
					if(minPrice == -1){
						_price = "Suscríbete";
					}else{
						_price = "desde $"+minPrice;
					}
				}else{
					_price = "";
				}
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
	}else if(_data.ProgramVO){
		///////////////////////// Estrellas
		/////////////////////////Precio
		/////////////////////////Nombre
		_name=_data.ProgramVO.name;
		/////////////////////////Clasificacion
		_rating=_data.ProgramVO.parentalRating;
		/////////////////////////Adicional
		var text = "";
		text+="I Canal "+_data.ProgramVO.channelNumber+" ";
		text+="I "+_data.ProgramVO.category+" ";
		
		_aditional = text;
		/////////////////////////Actores
		_actors=_data.ProgramVO.actors;
		/////////////////////////Descripcion
		_description=_data.ProgramVO.description;
	}
	
	
	
	
	return {"qualify": _qualify,
			"price": _price,
			"name": _name,
			"rating": _rating,
			"aditional":_aditional,
			"actors": _actors,
			"description": _description};
}


anytimetvChapters.drawExpiration = function drawExpiration(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		var custoT = JSON.stringify(this.themaData.custoDateNumber);
		custoT = JSON.parse(custoT);
		
		custoT.text_align = "right,middle";
		custoT.font_size = 18 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.date, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custoT);
		
		ctx.drawObject(ctx.endObject());
}

anytimetvChapters.drawButtonsStopRecording = function drawButtonsStopRecording(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	custo_f.text_align = "center,middle"; 
	custo_f.font_size = 18* tpng.thema.text_proportion;

	var img;
    if(_data.focus){
		custo_f.fill = "rgba(30,30,40,1)";
    	var custoButton = {"fill": "rgba(250,250,240,1)"};
    	img = "img/tv/DejarDeGrabarON.png";
    }else{
    	img = "img/tv/DejarDeGrabarOFF.png";
	    var custoButton = {"fill": "rgba(180,40,60,1)"};
    }
 	
	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoButton); 
	Canvas.drawText(ctx,"Dejar de grabar este programa", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	tp_draw.getSingleton().drawImage(img, ctx, 38, 0);
			
	ctx.drawObject(ctx.endObject());	
}
