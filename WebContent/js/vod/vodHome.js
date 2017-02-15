// vodHome.js

FormWidget.registerTypeStandard("vodHome");

function vodHome(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.indexBg=true;
   	clearTimeout(this.deleyPlayer);
   	clearTimeout(this.timerLoadData);
	this.init = true;
   	
}

vodHome.inherits(FormWidget);

vodHome.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;

	//Iniciando la pantalla
	var url = "img/vod/fondoVod.jpg";
	this.home.showHeader({"stroke":"rgba(130, 60, 150, 1)"});
	//this.home.widgets.mainBg.setDataAnimated({"url":url},{"toState":"enter"});	
	this.widgets.mainBg.setDataAnimated();
	this.widgets.mainBg.stateChange("enter",0);
	this.widgets.notFound.setDataAnimated({"message": "Estamos cargando tu contenido."});
	this.widgets.notFound.stateChange("enter",0);
	this.widgets.myLoadingIndicator.start();		
	
		
				
		
	//Variables de OSCAR
	this.lockKey = true;
	this.actualFocus = 2;
	this.counting = 0;
	this.alias = _data.parameters.alias;
	this.update = _data.parameters.update;
	this.haveService = null;
	this.clubType = null;
	
	if(_data.parameters){
		switch(this.alias){
			case "TRANS":
				//NGM.trace("1");
				if(tpng.vod.home_response){
					this.responseCache(tpng.vod.home_response);
				}else{
					var params = ["club=TRANS" , "maxRows=10"];
					getServices.getSingleton().call("VOD_GET_CATEGORIES_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 5000);
				}
				break;
			case "KIDS":
				//NGM.trace("2");
				this.alias="TRANS";
				var params = ["club=TRANS" , "maxRows=10"];
				getServices.getSingleton().call("VOD_GET_KIDS_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 5000);
				break;
			case "SUSC":
				//NGM.trace("3");
				var params = ["club=SUSC" , "maxRows=10"];
				getServices.getSingleton().call("VOD_GET_CATEGORIES_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 5000);
			break;
			default:
				//NGM.trace("4");
				//CUANDO LLEGA DE LA TECLA DEL CONTROL REMOTO
				if(tpng.vod.home_response && this.alias == "TRANS"){
					this.responseCache(tpng.vod.home_response);
				}else{
					var params = ["club="+this.alias , "maxRows=10"];
					getServices.getSingleton().call("VOD_GET_CUSTOM_CAT_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 5000);
				}
			break;
		}
	}else{
		if(tpng.vod.home_response){
			this.responseCache(tpng.vod.home_response);
		}else{
			//NGM.trace("5");
			this.alias = "TRANS";
			var params = ["club=TRANS" , "maxRows=10"];
			getServices.getSingleton().call("VOD_GET_CATEGORIES_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 5000);
		}
	}
	
	this.widgets.footerList.setData({"title": "¿No encontraste lo que buscabas?", "subtitle": "Intenta usando  la búsqueda o encuentra contenido grabado en la sección Anytimetv."});
		
}

vodHome.prototype.responseGetCategories = function responseGetCategories(response){	
	if(response.status == 200){
		//Agrego a las categorías datos extras
		var categories = response.data.ResponseVO.categories;
			for(var x = 0; x < categories.length; x++){
				if(categories[x].CategoryVO.images){
					var objectCategory = [{
						"img": categories[x].CategoryVO.images.url3X3,
						"back":	categories[x].CategoryVO.images.url18X18,
						"type": "Category",
						"cvcId": categories[x].CategoryVO.cvcId
					}];
					categories[x].CategoryVO.vodsArray.push({"VodCategoryVO": objectCategory});				
					categories[x].CategoryVO.vodsArray.unshift({"VodCategoryVO": objectCategory});		
				}				
				categories[x].CategoryVO.catName = categories[x].CategoryVO.categoryName;
				categories[x].CategoryVO.categoryName = (x+1)+". " + categories[x].CategoryVO.categoryName;	
			}
			
			response.data.ResponseVO.categories = categories;
			
			if(this.alias == "TRANS"){
				tpng.vod.home_response = response;
			}
			this.responseCache(response);
			
		
		
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}
vodHome.prototype.responseCache = function responseCache(response){
		var widgets = this.widgets;
		
		//AUX, SÓLO PARA PRUEBAS
		this.ts_start = new Date().getTime();
		
		//Vaciar listas
		/*
		widgets.oneCategoriesList.setData();
		widgets.headerCategoriesOne.setData();
		widgets.twoCategoriesList.setData();
		widgets.headerCategoriesTwo.setData();
		widgets.threeCategoriesList.setData();
		widgets.headerCategoriesThree.setData();
		widgets.fourCategoriesList.setData();
		widgets.headerCategoriesFour.setData();
		*/
		//NGM.trace("vaciar listas: " + (new Date().getTime() - this.ts_start));
	
		//this.categories = tpng.vod.home_response.data.ResponseVO.categories;
		this.categories = response.data.ResponseVO.categories;
		var bannersVod = this.arrayBanners =  response.data.ResponseVO.arrayBanners;
		
		//Banners VOD
		widgets.bannersVod.setDataAnimated(bannersVod);
			
		widgets.pointsBanners.setDataAnimated({"total": bannersVod.length, "index": 1},{"toState":"enter"});
		widgets.arrowsBanners.setDataAnimated({},{"toState":"enter"});			
		//Quitar todos los indicadores de "cargando"
				
		widgets.notFound.stateChange("exit",0);			
		widgets.bannersVod.stateChange("enter",0);
		widgets.arrowsBanners.stateChange("enter",0);
		widgets.myLoadingIndicator.stop();
		
		//TODO: REVISAR POR QUÉ EL GRIS SALE AL FINAL
				
		//widgets.mainBg.setDataAnimated({"data":1},{"toState":"enter"});	
		
		
		if(this.categories.length > 0){
			this.actualPos = 0;
			if(response.data.ResponseVO.haveService == true || response.data.ResponseVO.haveService==false){
				this.haveService = response.data.ResponseVO.haveService;
			}			
			this.clubType = response.data.ResponseVO.clubType;
			this.totalPos = this.categories.length-1;					
			
			//NGM.trace(" ");
			//NGM.trace("*********** MIDIENDO EL TIEMPO DE DIBUJADO **************** ");
			//NGM.trace("initList: " + (new Date().getTime() - this.ts_start));
			this.initList(bannersVod);
	}else{
			this.home.openSection("miniError", {"home": this.home, "title": gettext("ERROR_TITLE"),"code":"-250"}, false);
	}
}

vodHome.prototype.initList = function initList(_banners){
	var widgets = this.widgets;
	var sectionIndex = -1;
	this.init = true;
	
		
	
	for(var x = 0; x < tpng.app.sections.length; x++){
		if(tpng.app.sections[x].name == "vodHome" && tpng.app.sections[x].params.indexList >= 0){
			sectionIndex = x;
			this.init = false;
		}
	}
				
	if(this.init){
		//La primera lista por alguna razón la setean al inicio
		widgets.oneCategoriesList.setData(this.categories[this.actualPos].CategoryVO.vodsArray);
		widgets.headerCategoriesOne.setData({"total":this.categories[this.actualPos].CategoryVO.totalElements,"position": 1,"categoryName": this.categories[this.actualPos].CategoryVO.categoryName, "focus": true});
		
		if(widgets.oneCategoriesList.maxItem > 6){
			widgets.arrowsLR.setDataAnimated({"left": false, "right": true, "total": widgets.oneCategoriesList.maxItem});
		}else{
			widgets.arrowsLR.setDataAnimated({"left": true, "right": false, "total": widgets.oneCategoriesList.maxItem});
		}
	
		if(this.categories.length == 1){
			this.widgets.footerList.stateChange("enter");
		}
		
		widgets.twoCategoriesList.setDataAnimated(this.categories[this.actualPos+1].CategoryVO.vodsArray);
		widgets.headerCategoriesTwo.setDataAnimated({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
		widgets.threeCategoriesList.setDataAnimated(this.categories[this.actualPos+2].CategoryVO.vodsArray);
		widgets.headerCategoriesThree.setDataAnimated({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
		widgets.fourCategoriesList.setDataAnimated(this.categories[this.actualPos+3].CategoryVO.vodsArray);
		widgets.headerCategoriesFour.setDataAnimated({"total":this.categories[this.actualPos+3].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
		
		//NGM.trace("INIT setData: " + (new Date().getTime() - this.ts_start));
		
	}else{
		widgets.bannersVod.setFocus(false);
		widgets.layerBanners.setDataAnimated({});
		widgets.layerBanners.stateChange("enter",0);
		widgets.arrowsBanners.stateChange("exit");
		//this.showBanners(this.arrayBanners);

		this.actualPos = tpng.app.sections[sectionIndex].params.indexList;
		this.actualFocus = tpng.app.sections[sectionIndex].params.focusPos;
		
		widgets.oneCategoriesList.setData(this.categories[this.actualPos].CategoryVO.vodsArray, tpng.app.sections[sectionIndex].params.posList);
		widgets.headerCategoriesOne.setData({"total":this.categories[this.actualPos].CategoryVO.totalElements,"position": 1,"categoryName": this.categories[this.actualPos].CategoryVO.categoryName, "focus": true});
		
		//NGM.trace("RETURN setData: " + (new Date().getTime() - this.ts_start));
		
		if(widgets.oneCategoriesList.maxItem > 6){
			widgets.arrowsLR.setDataAnimated({"left": false, "right": true, "total": widgets.oneCategoriesList.maxItem});
		}else{
			widgets.arrowsLR.setDataAnimated({"left": true, "right": false, "total": widgets.oneCategoriesList.maxItem});
		}
	
		if(this.actualPos == 0){
			//Solo elementos hacia abajo
			widgets.twoCategoriesList.setDataAnimated(this.categories[this.actualPos+1].CategoryVO.vodsArray);
			widgets.headerCategoriesTwo.setDataAnimated({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
			widgets.threeCategoriesList.setDataAnimated(this.categories[this.actualPos+2].CategoryVO.vodsArray);
			widgets.headerCategoriesThree.setDataAnimated({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setDataAnimated(this.categories[this.actualPos+3].CategoryVO.vodsArray);
			widgets.headerCategoriesFour.setDataAnimated({"total":this.categories[this.actualPos+3].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
			
		}else if(this.actualPos == this.categories.length-1){
			//Solo elementos hacia arriba
			widgets.threeCategoriesList.setDataAnimated(this.categories[this.actualPos-2].CategoryVO.vodsArray);
			widgets.headerCategoriesThree.setDataAnimated({"total":this.categories[this.actualPos-2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setDataAnimated(this.categories[this.actualPos-1].CategoryVO.vodsArray);
			widgets.headerCategoriesFour.setDataAnimated({"total":this.categories[this.actualPos-1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-1].CategoryVO.categoryName, "focus": false});
			
			widgets.footerList.stateChange("enter",0);

			
		}else if((this.actualPos+3) <= this.categories.length-1 && (this.actualPos-3) >= 0){
			
			//Mas de 3 elementos hacia ambos lados
			
			widgets.twoCategoriesList.setDataAnimated(this.categories[this.actualPos+1].CategoryVO.vodsArray);
			widgets.headerCategoriesTwo.setDataAnimated({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
			widgets.threeCategoriesList.setDataAnimated(this.categories[this.actualPos+2].CategoryVO.vodsArray);
			widgets.headerCategoriesThree.setDataAnimated({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setDataAnimated(this.categories[this.actualPos-1].CategoryVO.vodsArray);
			widgets.headerCategoriesFour.setDataAnimated({"total":this.categories[this.actualPos-1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-1].CategoryVO.categoryName, "focus": false});
			
			
		}else{
			//Mas de 3 elementos hacia ambos lados
			
			widgets.twoCategoriesList.setDataAnimated(this.categories[this.actualPos+1].CategoryVO.vodsArray);
			widgets.headerCategoriesTwo.setDataAnimated({"total":this.categories[this.actualPos+1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+1].CategoryVO.categoryName, "focus": false});
			widgets.threeCategoriesList.setDataAnimated(this.categories[this.actualPos+2].CategoryVO.vodsArray);
			widgets.headerCategoriesThree.setDataAnimated({"total":this.categories[this.actualPos+2].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos+2].CategoryVO.categoryName, "focus": false});
			widgets.fourCategoriesList.setDataAnimated(this.categories[this.actualPos-1].CategoryVO.vodsArray);
			widgets.headerCategoriesFour.setDataAnimated({"total":this.categories[this.actualPos-1].CategoryVO.totalElements, "position": null, "categoryName": this.categories[this.actualPos-1].CategoryVO.categoryName, "focus": false});
			
		}
		
		//NGM.trace("END OF RETURN: " + (new Date().getTime() - this.ts_start));
		
	}
	
	

	
	//Animar los widgets para que aparezcan en orden
	this.animateWidgets([						 
						 [widgets.twoCategoriesList, widgets.headerCategoriesTwo],
						 [widgets.oneCategoriesList, widgets.headerCategoriesOne,widgets.arrowsLR],
						 [widgets.threeCategoriesList, widgets.headerCategoriesThree],
						 [widgets.fourCategoriesList, widgets.headerCategoriesFour]],
					 2,
					 [
						 ["enterDOWN", "enterDOWN"],
						 ["enterUP", "enterUP","enter"],
						 ["exitDOWN", "exitDOWN"],
						 ["exitUP", "exitUP"]]);
	
	//Poner en foco la primera lista
	this.setFocusIndex(widgets.oneCategoriesList);
	
	//NGM.trace("stateChange: " + (new Date().getTime() - this.ts_start));
	//NGM.trace("************************************************* ");
	//NGM.trace(" ");
	
}

vodHome.prototype.onFocus = function onFocus(_key){
	//NGM.trace("DE REGRESO A VODHOME");
	this.home.showHeader({"stroke":"rgba(130, 60, 150, 1)"});
	
	var widgets = this.widgets;
	var currentList = this.getWidgetFocus(true);
	switch(this.lastForm){
		case "vod":			
			widgets.bannersVod.animation.alpha(255,100).start();
			widgets.pointsBanners.animation.alpha(255,100).start();
			
			widgets.mainBg.animation.alpha(255,100).start();
			widgets.layerBanners.animation.alpha(255,100).start();
			widgets.arrowsLR.animation.alpha(255,100).start();
			
			if(currentList.name == "oneCategoriesList"){
				widgets.oneCategoriesList.animation.alpha(255,100).start();
				widgets.headerCategoriesOne.animation.alpha(255,100).start();
				widgets.twoCategoriesList.animation.alpha(255,100).start();
				widgets.headerCategoriesTwo.animation.alpha(255,100).start();
			}
			else if(currentList.name == "twoCategoriesList"){
				widgets.twoCategoriesList.animation.alpha(255,100).start();
				widgets.headerCategoriesTwo.animation.alpha(255,100).start();			
				widgets.threeCategoriesList.animation.alpha(255,100).start();
				widgets.headerCategoriesThree.animation.alpha(255,100).start();
			}
			else if(currentList.name == "threeCategoriesList"){
				widgets.threeCategoriesList.animation.alpha(255,100).start();
				widgets.headerCategoriesThree.animation.alpha(255,100).start();
				widgets.fourCategoriesList.animation.alpha(255,100).start();
				widgets.headerCategoriesFour.animation.alpha(255,100).start();
			}
			else if(currentList.name == "fourCategoriesList"){
				widgets.fourCategoriesList.animation.alpha(255,100).start();
				widgets.headerCategoriesFour.animation.alpha(255,100).start();
				widgets.oneCategoriesList.animation.alpha(255,100).start();
				widgets.headerCategoriesOne.animation.alpha(255,100).start();
				
					
			}
			if(this.actualPos == this.categories.length-1)
					widgets.footerList.animation.alpha(255,100).start();
			
		break;
	
	}
	
		
	widgets.myLoadingIndicator.stop();
	this.actualForm = this.lastForm;

}

vodHome.prototype.onBlur = function onBlur(_key){
	//NGM.trace("ONBLUR VODHOME");
	var widgets = this.widgets;
	var currentList = this.getWidgetFocus(true);
	
	switch(this.lastForm){
		case "vod":			
			widgets.bannersVod.animation.alpha(0,100).start();
			widgets.pointsBanners.animation.alpha(0,100).start();
			widgets.arrowsBanners.animation.alpha(0,100).start();
			
			widgets.mainBg.animation.alpha(0,100).start();
			widgets.layerBanners.animation.alpha(0,100).start();
			widgets.arrowsLR.animation.alpha(0,100).start();
			
			if(currentList.name == "oneCategoriesList"){
				widgets.oneCategoriesList.animation.alpha(0,100).start();
				widgets.headerCategoriesOne.animation.alpha(0,100).start();
				widgets.twoCategoriesList.animation.alpha(0,100).start();
				widgets.headerCategoriesTwo.animation.alpha(0,100).start();
			}
			else if(currentList.name == "twoCategoriesList"){
				widgets.twoCategoriesList.animation.alpha(0,100).start();
				widgets.headerCategoriesTwo.animation.alpha(0,100).start();			
				widgets.threeCategoriesList.animation.alpha(0,100).start();
				widgets.headerCategoriesThree.animation.alpha(0,100).start();
			}
			else if(currentList.name == "threeCategoriesList"){
				widgets.threeCategoriesList.animation.alpha(0,100).start();
				widgets.headerCategoriesThree.animation.alpha(0,100).start();
				widgets.fourCategoriesList.animation.alpha(0,100).start();
				widgets.headerCategoriesFour.animation.alpha(0,100).start();
			}
			else if(currentList.name == "fourCategoriesList"){
				widgets.fourCategoriesList.animation.alpha(0,100).start();
				widgets.headerCategoriesFour.animation.alpha(0,100).start();
				widgets.oneCategoriesList.animation.alpha(0,100).start();
				widgets.headerCategoriesOne.animation.alpha(0,100).start();
				
			}
			
			if(this.actualPos == this.categories.length-1)
				widgets.footerList.animation.alpha(0,100).start();
			
		break;
		
	
	}
	
	widgets.myLoadingIndicator.stop();
}

vodHome.prototype.onExit = function onExit(_data){
	if(this.actualForm == "open"){
		this.closeLists();
	}
	
	clearTimeout(this.deleyPlayer);
   	clearTimeout(this.timerLoadData);

	unsetTimeAlarm(this.bannersTimer);
	this.exitBanners(); 
	
	//this.exitBanners(); 

	this.client.lock();
		this.home.setPlayerStatus("STOP");
		this.home.objectChild = null;
		this.home.hideHeader();
		this.home.hideBg();
	this.client.unlock();
	
	//Cuando se sale y regresa a live borramos cache
	tpng.vod.home_response = null;
	
}


vodHome.prototype.secondInit = function secondInit(init){
	this.setWidgetFocus(this.init);
	this.widgets.headerCategoriesOne.data.position = this.getWidgetFocus(true).selectIndex+1;
	this.widgets.headerCategoriesOne.refresh();
	this.widgets.headerCategoriesOne.stateChange("enterUP");
	this.actualForm = this.init ? "bannersVod" : "vod";
}










vodHome.prototype.responseExecuteBuyVod = function responseExecuteBuyVod(response){
	if(response.status == 200){
		if(response.data.ResponseVO.status == 0){
			//this.hideBackground();
			tpng.menu.data = [];
 			tpng.menu.tsMenu = "";
 			tpng.menu.lastMenuIndex = 0;
			this.home.openSection("vodPlayer", {"name": "vodPlayer", "home":this.home,"vodId":this.getWidgetFocus(true).selectItem.VodMovieVO.vodId}, false);
		}else{
			this.home.openSection("miniError", {"home": this.home, "code":response.data.ResponseVO.status, "message":response.data.ResponseVO.message, "suggest":response.data.ResponseVO.suggest}, false);
		}
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}


vodHome.drawNotFound = function drawNotFound(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	var custoErrorText = JSON.stringify(this.themaData.standardFont);
		custoErrorText = JSON.parse(custoErrorText);

		custoErrorText.font_size = 32* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,top";
		Canvas.drawText(ctx,data.message, new Rect(67,72,1146,42), custoErrorText);
	//Canvas.drawText(ctx,"<!i>El estado de cuenta no está disponible por el momento<!i>", new Rect(67,72,1146,36), custoErrorText);
	
		custoErrorText.font_size = 26* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,bottom";
		
	Canvas.drawText(ctx,"<!i>Espera un momento por favor.<!i>", new Rect(337,110,607,34), custoErrorText);
	
		custoErrorText.font_size = 18* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,middle";
		
	//Canvas.drawText(ctx,"<!i>Presiona OK para salir.<!i>", new Rect(451,180,378,32), custoErrorText);
	
	ctx.drawObject(ctx.endObject());
}




vodHome.prototype.showBanners = function showBanners(_banners){
	var widgets = this.widgets;
	
		widgets.layerBanners.setData();
		widgets.layerBanners.stateChange("enter");

		for(var i = 0; i< _banners.length; i++){
			_banners[i].ItemVO.total = _banners.length;
			if(_banners.length <= 3){
				_banners[i].ItemVO.index = i+1;
			}
		}

		if(_banners.length > 0){
				widgets.bannersVod.setData(_banners,this.positionBanner);
			if(_banners.length > 1){
				var interval = _banners[0].ItemVO.timer-0;
				unsetTimeAlarm(this.bannersTimer);  
				this.bannersTimer = this.changeBannersVod.bind(this).repeat(interval);
			}
		}
		
}

vodHome.prototype.exitBanners = function exitBanners(){
	var bannersVod = this.widgets.bannersVod;
	if(bannersVod.stateGet() != "exit"){
		unsetTimeAlarm(this.bannersTimer);
		bannersVod.stateChange("exit");
	}
}

vodHome.prototype.changeBannersVod = function changeBannersVod(){
	var bannersVod = this.widgets.bannersVod;	
	bannersVod.scrollNext();
	this.widgets.pointsBanners.setData({"total": bannersVod.list.length, "index": bannersVod.selectIndex+1});
	this.widgets.pointsBanners.refresh();	
}

vodHome.prototype.animateWidgets = function animateWidgets(_widgets, _delay, _state, _callback, _index){		
	
	
	_index = _index ? _index : 0;
	

	if(_index == 0){
		//Siempre nos aseguramos quitar el control del onKeyPress
		this.actualForm = "";
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

vodHome.prototype.exitAnimation = function exitAnimation(){
	clearTimeout(this.deleyPlayer);
	clearTimeout(this.timerLoadData);
		
	unsetTimeAlarm(this.bannersTimer);
	
	var widgets = this.widgets;
	this.animation.alpha(0,200).start();
	this.home.closeSection(this);
}

vodHome.prototype.onKeyPress = function onKeyPress(_key){
	switch(this.actualForm){
		case "search":
			this.onKeyPressSearch(_key);
			break;
		case "vod":
			this.onKeyPressVod(_key);
			break;
		case "bannersVod":
			this.onKeyPressBannersVod(_key);
		break;
	}
	return true;
	
}

vodHome.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			this.home.disableSearchHeader();
			/*
			this.getWidgetFocus(true).setFocus(true);
			this.getWidgetFocus(false).data.position=this.getWidgetFocus(true).selectIndex+1;
			this.getWidgetFocus(false).refresh();
			*/
			this.actualForm = "bannersVod";
			widgets.bannersVod.setFocus(true);
			widgets.layerBanners.stateChange("exit");		
			widgets.arrowsBanners.stateChange("enter");	
			//widgets.pointsBanners.setData({"total": widgets.bannersVod.list.length, "index": widgets.bannersVod.selectIndex+1});		
			widgets.pointsBanners.stateChange("enter");										
		break;

		default:
			this.home.onKeyPress(_key);
			break;
	}
}
vodHome.prototype.onKeyPressBannersVod = function onKeyPressBannersVod(_key){
	var widgets = this.widgets;
	
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.actualForm = "close";
			this.closeVodHome();
			break;
		break;
		case "KEY_IRENTER":
    		var _section = widgets.bannersVod.selectItem.ItemVO.link;
			this.home.openLink(_section,null,6);
		break;
		
		case "KEY_LEFT":
		case "KEY_RIGHT":
			_key == "KEY_LEFT" ? widgets.bannersVod.scrollPrev() : widgets.bannersVod.scrollNext();	
				widgets.pointsBanners.setData({"total": widgets.bannersVod.list.length, "index": widgets.bannersVod.selectIndex+1});		
				widgets.pointsBanners.refresh();
			
		break;

		case "KEY_DOWN":
			this.positionBanner = widgets.bannersVod.selectIndex;
			this.actualForm = "vod";
			//widgets.oneCategoriesList.setFocus(true);
			this.setWidgetFocus();			
			widgets.arrowsBanners.stateChange("exit");
			this.showBanners(this.arrayBanners);
		break;
		
		case "KEY_UP":
			this.actualForm = "search";
			this.home.enableSearchHeader();
			widgets.bannersVod.setFocus(false);			
			widgets.layerBanners.setData();
			widgets.layerBanners.stateChange("enter");
			widgets.arrowsBanners.stateChange("exit");	
					
		break;
	}
}
vodHome.prototype.onKeyPressVod = function onKeyPressVod(_key){
	var oneList   = this.widgets.oneCategoriesList,
		twoList   = this.widgets.twoCategoriesList,
		threeList = this.widgets.threeCategoriesList,
		fourList  = this.widgets.fourCategoriesList,
		widgets   = this.widgets;
	if(_key == "KEY_TV_1"){
		this.widgets.myLoadingIndicator.stop();
	}
	
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
							
							
							twoList.stateChange("exit_3",0);
							threeList.setData(this.categories[this.actualPos+3].CategoryVO.vodsArray, this.categories[this.actualPos+3].selectIndex);
							widgets.headerCategoriesThree.setData({"total": this.categories[this.actualPos+3].CategoryVO.totalElements,"position": null, "categoryName": this.categories[this.actualPos+3].CategoryVO.categoryName, "focus": false});
							
							this.client.lock();
								threeList.stateChange("exitDOWN");
								widgets.headerCategoriesThree.stateChange("exitDOWN");
								
								twoList.stateChange("enterDOWN");
								widgets.headerCategoriesTwo.stateChange("enterDOWN");
							this.client.unlock();
							
							fourList.stateChange("exitUP");
							widgets.headerCategoriesFour.stateChange("exitUP");
							break;
					}
					//this.setWidgetFocus();
					
					if(this.actualPos == (this.totalPos-1)){
						widgets.footerList.stateChange("enter");
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
					
					////NGM.trace("twoList: " + oneList.stateGet());
					
					switch(oneList.stateGet()){
						case "enterUP":
							this.actualFocus = oneList.focusIndex;
							this.client.lock();
								oneList.stateChange("enterDOWN");
								widgets.headerCategoriesOne.stateChange("enterDOWN");
								twoList.stateChange("exit_3",250);
								widgets.headerCategoriesTwo.stateChange("exit_3",250);
							this.client.unlock();							
							
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
							
							twoList.stateChange("exitDOWN",0);
							widgets.headerCategoriesTwo.stateChange("exitDOWN",0);
							
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
					
					if(this.actualPos == this.totalPos){
						widgets.footerList.stateChange("exit");
					
					}
					
					this.client.unlock();
					this.actualPos--;
					
				}else{
					this.getWidgetFocus(true).setFocus(false);
					this.actualForm = "bannersVod";
					widgets.bannersVod.setFocus(true);
					unsetTimeAlarm(this.bannersTimer);
					widgets.arrowsBanners.stateChange("enter");
					widgets.layerBanners.stateChange("exit");
					this.getWidgetFocus(false).data.position = null;
					this.getWidgetFocus(false).refresh();
				}
				break;
			case "KEY_LEFT":
				if(this.getWidgetFocus(true).scrollPrev()){
				
					this.getWidgetFocus(false).data.position = this.getWidgetFocus(true).selectIndex+1;
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
				
					this.getWidgetFocus(false).data.position = this.getWidgetFocus(true).selectIndex+1;
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
					if(tpng.app.sections[x].name == "vodHome"){
						tpng.app.sections[x].params.indexList = this.actualPos;
						tpng.app.sections[x].params.posList = this.getWidgetFocus(true).selectIndex-(this.getWidgetFocus(true).focusIndex-2);
						tpng.app.sections[x].params.focusPos = this.getWidgetFocus(true).focusIndex;
					}
				}
				//NGM.dump(tpng.app.sections[0].params,2);
				if(this.alias != "TRANS"){
					//CUANDO ES UN CONTENIDO DE SUSCRIPTION O HBO
					//Ya no importa que no tenga contratado lo dejo pasar a que vea los episodios
					this.openNextSection(true);
			}else{
					if(!this.getWidgetFocus(true).selectItem.VodMovieVO.isUseRootPasswd){
						this.openNextSection(true);
					}else{
						this.home.openSection("nipValidator",{"home":this.home, 
							"formP":this,
							"formData":{
								"nipRoot": true, 
								"title":"Usa los números en tu control remoto para ingresar el nip del usuario indicado para desbloquear el contenido",
								"txt1": "Desbloquear: "+this.getWidgetFocus(true).selectItem.VodMovieVO.name,
								"txt2": "Clasificación: "+this.getWidgetFocus(true).selectItem.VodMovieVO.rating,
								"txt3": ""
								}}, false,null,true);
					}
				}
				break;
		}
	}
}


vodHome.prototype.closeVodHome = function closeVodHome(){
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
	//NGM.trace("exit");
	/*
	this.animateWidgets( arrWidgets,
						 200,
						 [["exitOne", "exitOne"],
						  ["exitTwo", "exitTwo"],
						  ["exitTwo", "exitTwo"],
						  ["exitTwo", "exitTwo"]],
						  this.exitAnimation.bind(this));
	*/
	this.exitAnimation();
}


vodHome.prototype.openNextSection = function openNextSection(_allow){
	
	var currentWidget = this.getWidgetFocus(true),
	movie = currentWidget.selectItem.VodMovieVO;
	if(_allow){
		//SI ES PELÍCULA	
		if(movie.type == "VID"){			
			//********************************************************
			//   SUSCRIPCIÓN
			//********************************************************			
			if(movie.isActiveSuscription){
				//SI LA PELÍCULA ESTÁ COMPRADA O ESTÁ VISTA
				if(movie.isBuy){
					this.actualForm = "open";
					this.home.openSection("vodPlayer", {"name": "vodPlayer", "home":this.home,"vodId":movie.vodId,"statusPlayer":true}, false);
				}else{//SINO ABRE EL VOD DETAIL
					this.lastForm = this.actualForm;
					this.actualForm = "open";					
					this.home.openVODSection("vodDetail", {"home":this.home, "VodMovieVO": movie}, this,true);
				}
			//********************************************************
			//   TRANSACCIÓN
			//********************************************************
			}else if(movie.isBuy){
				//SI ESTÁ COMPRADA ABRO EL VOD PLAYER
					this.actualForm = "open";
					this.home.openSection("vodPlayer", {"name": "vodPlayer", "home":this.home,"vodId":movie.vodId,"statusPlayer":true}, false);
			}else{
				//SINO ESTÁ COMPRADA ABRE EL DETAIL PARA COMPRARLA
				this.lastForm = this.actualForm;
				this.actualForm = "open";
				this.home.openVODSection("vodDetail", {"home":this.home, "VodMovieVO": movie}, this,true);
			}
		//********************************************************
		//   TEMPORADAS Y SERIES
		//********************************************************
		}else if(movie.type == "SER" || movie.type == "SEA"){
			//SI ES SERIE Y TEMPORADA (PADRES) LO MANDA A VOD SEASONS
			this.lastForm = this.actualForm;
			this.actualForm = "open";
			
			//this.home.openSection("vodSeasons", {"home":this.home,
			// "vodId": movie.vodId, "club":this.alias, "type":movie.type, "name":replaceAll(movie.name, "@", " ")}, true);
			 
			this.home.openVODSection("vodSeasons", {"home":this.home,
			"vodId": movie.vodId, "club":this.alias, "type":movie.type, "name":replaceAll(movie.name, "@", " ")}, this);
			 
		//********************************************************
		//   CATEGORIAS
		//********************************************************
		}else if(currentWidget.selectItem.VodCategoryVO[0].type == "Category"){
			this.lastForm = this.actualForm;
			this.actualForm = "open";
			NGM.trace("this.alias: " + this.alias);
			if(this.alias){
				var id = currentWidget.selectItem.VodCategoryVO[0].cvcId;
				var name = this.categories[this.actualPos].CategoryVO.catName;
				this.home.openVODSection("vodAZ",{"home":this.home, "club": this.alias, "id": id, "name": name},this,true);		
			}else{
				NGM.trace("REVISAR PQ ESTA UNDEFINED");
			}
		}
	}
}


vodHome.prototype.setKeyTrue = function setKeyTrue(){
	this.lockKey = true;
}

vodHome.prototype.setFocusIndex = function setFocusIndex(list){
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

vodHome.prototype.getWidgetFocus = function getWidgetFocus(_list){
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

vodHome.prototype.setWidgetFocus = function setWidgetFocus(state){
	var widgets = this.widgets;
	if(!state){
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
		widgets.oneCategoriesList.setFocus(false);
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


vodHome.prototype.getTimeFormat = function getTimeFormat(_data){
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


vodHome.onFocusLists = function onFocusLists(_focus, _data){
}

vodHome.prototype.parseDescription = function parseDescription(_data){
	
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
		
		if(this.clubType == "T"){
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
				}
			}
		}else if(this.clubType == "S"){
			if(this.haveService == true){
				_price = "Contratado";
			}else{
				_price = "Suscríbete";
			}
		}
		/////////////////////////Nombre
		_name=_data.VodMovieVO.name;
		/////////////////////////Clasificacion
		_rating=_data.VodMovieVO.rating;
		/////////////////////////Adicional
		var text="";
		text += getDetailData(getQualities(_data.VodMovieVO.formats));
		text += getDetailData(_data.VodMovieVO.year);
		text += getDetailData(_data.VodMovieVO.duration+" min");
		text += getDetailData(getLanguages(_data.VodMovieVO.formats));
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
			"description": _description};
}


vodHome.drawMainPanel = function drawMainPanel(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	Canvas.drawShape(ctx, "rect", [0, 106, ctx.viewportWidth, ctx.viewportHeight-106], custo);
	custo.stroke = "rgba(130,60,150,1)";	
	Canvas.drawShape(ctx, "rect", [0, 434, ctx.viewportWidth, 286], custo);
	//tp_draw.getSingleton().drawImage("img/tools/DevsOnion.png", ctx, 0, 0); //tmp el w y h		
	ctx.drawObject(ctx.endObject());	
}

vodHome.drawArrawsBanners = function drawArrawsBanners(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	tp_draw.getSingleton().drawImage("img/vod/arrowLeftON.png", ctx, 16, 0); //tmp el w y h		
	tp_draw.getSingleton().drawImage("img/vod/arrowRightON.png", ctx, 1100, 0); //tmp el w y h		
	
	ctx.drawObject(ctx.endObject());	
}

vodHome.drawPointsBanner = function drawPointsBanner(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();


	if(_data.total > 1){
		tp_draw.getSingleton().drawImage("img/vod/"+_data.index+"de"+_data.total+".png", ctx, 0, 0,); //tmp el w y 
	}
	
	ctx.drawObject(ctx.endObject());	
}

vodHome.drawLayerBanners = function drawLayerBanners(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custoW = {"fill": "rgba(30,30,40,.6)"};
	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoW);
	ctx.drawObject(ctx.endObject());	
}



vodHome.drawBannersVod = function drawBannersVod(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		
		tp_draw.getSingleton().drawImage(_data.ItemVO.images.url18X10, ctx, 0, -32, null, null, null, "destination-over");					
		//tp_draw.getSingleton().drawImage(_data.img, ctx, 0, -32, null, null, null, "destination-over");					
		ctx.drawObject(ctx.endObject());	
	}
}



vodHome.prototype.closeLists = function closeLists(){
	var widgets = this.widgets;

	clearTimeout(this.timerLoadData);

	unsetTimeAlarm(this.bannersTimer);
	this.exitBanners(); 
	
	this.client.lock();
		widgets.expiration.stateChange("exit");
		widgets.playerMessage.stateChange("exit");
		widgets.arrowsLR.stateChange("exit");
		widgets.footerList.stateChange("exit");

		widgets.mainBg.stateChange("exit");
		widgets.arrowsBanners.stateChange("exit");
		widgets.layerBanners.stateChange("exit");
		widgets.bannersVod.stateChange("exit");
		widgets.pointsBanners.stateChange("exit");
		
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



