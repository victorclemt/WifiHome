
FormWidget.registerTypeStandard("vodAZ");

function vodAZ(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.vodCategoryVO = null;
}

vodAZ.inherits(FormWidget);

vodAZ.prototype.onEnter = function onEnter(_data){	
	this.home = _data.home;
	
	//NGM.dump(_data,2);
	//Parámetros
	if(_data.parameters){
		this.club = _data.parameters.club;
		this.id = _data.parameters.id;
		this.name = _data.parameters.name;
	}else{
		this.club = _data.club;
		this.id = _data.id;
		this.name = _data.name;
	}
	
	
	
	this.client.lock();
		this.home.showHeader({"stroke":"rgba(130, 60, 150, 1)","section":this});	
		this.home.setBg("img/vod/backgroundAalaZ.jpg");
		this.widgets.myLoadingIndicator.stateChange("enter");
	this.client.unlock();
	
	this.initContainers();
}
vodAZ.prototype.onExit = function onExit(){	
	
	this.widgets.myLoadingIndicator.stop();
	this.widgets.stateChange("exit");
	this.home.hideHeader();
	this.home.hideBackground();
	
}

vodAZ.prototype.initContainers = function initContainers(_index){
	var w = this.widgets,
		containerA = w.containerA,
		containerB = w.containerB,
		containerC = w.containerC,
		counter = w.counter,
		bg = w.bgPages;

 	counter.setData({"nameCategory":this.name});
 	counter.stateChange("enter");
	containerA.stateChange("enter");
	containerB.stateChange("enter");
	containerC.stateChange("enter");  
	
	for(var x = 0; x < tpng.app.sections.length; x++){
		if(tpng.app.sections[x].name == "vodAZ" && tpng.app.sections[x].params.lastPositionPage > 0){
			this.currentPage = tpng.app.sections[x].params.lastPositionPage;
		}else{
			this.currentPage = 0;
		}
	}


	w.myLoadingIndicator.stateChange("enter");
	w.myLoadingIndicator.start();
	w.notFound.setDataAnimated({"message": "Estamos cargando tu contenido."});
	w.notFound.stateChange("enter",0);
	

	//Obtener datos del backend
	this.getData();

}

/****************************************************************************
NUEVA FORMA DE HACER VOD AZ (CARGAR TODO EL CATÁLOGO)
*****************************************************************************/

vodAZ.prototype.getData = function getData(_page, _callback){
	if(this.id && this.club){
		var params = ["club="+this.club,"cvcId="+this.id,"maxRows=1000","page=1"];
		getServices.getSingleton().call("VOD_GET_CATE_VODS", params, this.responseGetData.bind(this));
	}else{
		var params = ["club=TRANS" , "page=1"];
		getServices.getSingleton().call("VOD_GET_AZ", params, this.responseGetData.bind(this));
	
	}
		
}

vodAZ.prototype.responseGetData = function responseGetData(response){	
	if(response.status == 200){		
		//Para pruebas
		this.ts_start = new Date().getTime();
		
		this.actualFocus = "movies";
		var page = response.data.ResponseVO.vods;
		this.total = response.data.ResponseVO.totalGlobal;
		
		NGM.trace("init AZ: " + (new Date().getTime() - this.ts_start));
		
		this.pages = this.sliceData(page); //Crear las páginas
		
		NGM.trace("slice data: " + (new Date().getTime() - this.ts_start));
		
		this.loadFirstPage();
		
		
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
	
}

vodAZ.prototype.sliceData = function sliceData(_data){
	var nItems = 12;
	var pages = [];	
	
	var ts = new Date().getTime();
	//Poner el indice en cada película. TODO: Ver como responde con mas de mil elementos =(
	var index = 1;
	for(var i = 0, l = _data.length; i < l ; i++){
		if(_data[i].VodMovieVO){
			_data[i].VodMovieVO.index = index;
			index++;
		}
	}
	
	
	//Paginar el contenido
	while (_data.length > 0)
	    pages.push(_data.splice(0, nItems));

	return pages;	
}


/****************************************************************************/
vodAZ.prototype.onKeyPress = function onKeyPress(_key){
		switch(this.actualFocus){ 
			case "movies":
				 this.onKeyPressMovies(_key);
			break;
			case "changePage":
				this.onKeyPressChangePage(_key);
			break;
			case "search":
				this.onKeyPressSearch(_key);
			break;
		}
	return true;
}

vodAZ.prototype.onKeyPressMovies = function onKeyPressMovies(_key){
	var widgets = this.widgets;
    
    
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.hideHeader();
	    	this.home.closeSection(this);
	    break;
	    
	   default:
	   		this.move(_key);
	   break;
	}	
	return true;
}

vodAZ.prototype.onKeyPressChangePage = function onKeyPressChangePage(_key){
	
	var widgets = this.widgets;
	if(this.currentContainer.name == "containerB"){
		var list = widgets.listB;
	}else if(this.currentContainer.name == "containerC"){
		var list = widgets.listC;
	}else{
		var list = widgets.listA;
	}		

	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.hideHeader();
	    	this.home.closeSection(this);
	    break;
						 
		case "KEY_RIGHT":
			if(this.pages.length > 1){
				list.setFocus(false);
				widgets.bgPages.setData({"page": this.currentPage + 1, "pages": this.pages.length, "focus": true});
				widgets.bgPages.refresh();
				if(this.currentPage < (this.pages.length -1)){
					this.currentPage ++;
					this.loadNextPage(list.selectIndex-25); //Con esto sabremos en que columna está
				}
			}
		break;
		
		case "KEY_LEFT":
		if(this.currentPage != 0){
			if(this.pages.length > 1){
				widgets.bgPages.setData({"page": this.currentPage, "pages": this.pages.length, "focus": true});
				widgets.bgPages.refresh();		
				list.setFocus(false);
				if(this.currentPage > 0){
					this.currentPage --;
					this.loadPrevPage(list.selectIndex+25); //Con esto sabremos en que columna está
				}		
			}
		}
		
		break;
				
		case "KEY_UP":
			this.actualFocus = "search";
	   		this.home.enableSearchHeader();
			widgets.bgPages.setData({"page": this.currentPage + 1, "pages": this.pages.length, "focus": false});
			widgets.bgPages.refresh();
		break;
		
		case "KEY_DOWN":
			this.actualFocus = "movies";
			list.setFocus(false);
			list.focusIndex = 0;
			list.setFocus(true);
			widgets.bgPages.setData({"page": this.currentPage + 1, "pages": this.pages.length, "focus": false});
			widgets.bgPages.refresh();

		break;			
	}	
	return true;
}


vodAZ.prototype.onKeyPressSearch = function onKeyPressSearch(_key){	
	var widgets = this.widgets;
			
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			//CÓDIGO PARA ACTIVAR LA SECCIÓN
			//HABILITAR FOCUS, REDRAWS, ETC
			this.home.disableSearchHeader();
			this.actualFocus = "changePage";
			widgets.bgPages.setData({"page": this.currentPage + 1, "pages": this.pages.length, "focus": true});
			widgets.bgPages.refresh();
		break;
		
		default:
			this.home.onKeyPress(_key);
		break;
	}
	return true
}

vodAZ.prototype.move = function move(_key){
	//Validar cual es la lista actual
	var widgets = this.widgets;
	if(this.currentContainer.name == "containerB"){
		var list = this.widgets.listB;
	}else if(this.currentContainer.name == "containerC"){
		var list = this.widgets.listC;
	}else{
		var list = this.widgets.listA;
	}
	
	switch(_key){
		case "KEY_IRENTER":
			this.item = list.selectItem.VodMovieVO;
			if(list.selectItem.VodMovieVO){
				if(list.selectItem.VodMovieVO.isUseRootPasswd){
					this.home.openSection("nipValidator",{"home":this.home, 
						"formP":this,
						"formData":{
						"nipRoot": true, 
						"title":"Usa los números en tu control remoto para ingresar el nip del usuario indicado para desbloquear el contenido",
						"txt1": "Desbloquear: "+list.selectItem.VodMovieVO.name,
						"txt2": "Clasificación: "+list.selectItem.VodMovieVO.rating,
						"txt3": ""
						}}, false,null,true);			
				}else if(list.selectItem.VodMovieVO.type == "SER" || list.selectItem.VodMovieVO.type == "SEA"){
					this.openNextSection(true);
				}else{
					for(var x = 0; x < tpng.app.sections.length; x++){
						if(tpng.app.sections[x].name == "vodAZ"){
							tpng.app.sections[x].params.lastPositionPage = this.currentPage;
							tpng.app.sections[x].params.focusIndex = list.focusIndex;
						}
					}
					//NGM.dump(list.selectItem.VodMovieVO)
					if(list.selectItem.VodMovieVO.isBuy){
						this.home.openSection("vodPlayer", {"name": "vodPlayer", "home":this.home,"vodId":list.selectItem.VodMovieVO.vodId,"isEncrypted":list.selectItem.VodMovieVO.isEncrypted}, false);
					}else{
						this.home.openVODSection("vodDetail", {"home":this.home, "VodMovieVO": list.selectItem.VodMovieVO}, this, true);
					}
					
					
				}
			}
		break;
		case "KEY_LEFT":	    	
			var r = list.selectIndex - 3;
			if(this.currentPage > 0){
				if( r < 0 ){
					if(this.currentPage > 0){
						this.currentPage --;
						this.loadPrevPage(list.selectIndex+9); //Con esto sabremos en que columna está
					}
				}else{
					list.setFocus(false);
					list.focusIndex = list.focusIndex-3;
					list.setFocus(true);
				}
			
			}else if(this.currentPage == 0){
				if(r < 0){
					list.setFocus(false);
					list.focusIndex = list.selectIndex;
					list.setFocus(true);
				}else{
					list.setFocus(false);
					list.focusIndex = list.focusIndex -3;
					list.setFocus(true);
				}
			}
					
		break;
		case "KEY_RIGHT":				    	
		// nuevo cambios de index
			var r = list.focusIndex + 3;
			if(r >= list.maxItem){
				if(this.currentPage < (this.pages.length -1)){
					this.currentPage ++;
					this.loadNextPage(list.selectIndex-9); //Con esto sabremos en que columna está
				}
			}else{
				list.setFocus(false);
				list.focusIndex = list.focusIndex +3;
				list.setFocus(true);
			}

		break;
		
		case "KEY_DOWN":			
			var r = list.scrollNext();
			if(!r &&  this.currentPage < (this.pages.length -1)){
				this.currentPage ++;
				this.loadNextPage(0); //Con esto sabremos en que columna está
			}
		break;
		case "KEY_UP":						
			if (list.selectIndex % 3 == 0){
				this.actualFocus = "changePage";
				list.setFocus(false);
				widgets.bgPages.setData({"page": this.currentPage+1, "pages": this.pages.length, "focus": true});
				widgets.bgPages.refresh();
			}else{
				var r = list.scrollPrev();
				if(!r && this.currentPage > 0){
					this.currentPage --;
					this.loadPrevPage(list.selectIndex+25); //Con esto sabremos en que columna está
				}
			}	
		break;
	}

}	 


vodAZ.prototype.openNextSection = function openNextSection(_allow){

	if(_allow){
		if(this.item.type == "SER" || this.item.type == "SEA"){
			this.home.openSection("vodSeasons", {
			"home":this.home,
			"vodId": this.item.vodId,
			"club":this.item.clubAlias,
			"type":this.item.type,
			"name":replaceAll(this.item.name,
			"@", " ")}, true);
		}else if(this.item.type == "VID" && this.item.rating == "D"){
			this.home.openVODSection("vodDetail", {"home":this.home, "VodMovieVO": this.item}, this, true);		
		}else{}
	}
}

vodAZ.prototype.onFocus = function onFocus(_key){
	//NGM.trace("DE REGRESO A VODAZ");
	this.home.setBg("img/vod/backgroundAalaZ.jpg");	
	this.home.showHeader({"stroke":"rgba(130, 60, 150, 1)"});	
	var w = this.widgets,
		containerA = w.containerA,
		containerB = w.containerB,
		containerC = w.containerC,
		counter = w.counter,
		bg = w.bgPages;
	containerA.animation.alpha(255,100).start();
	containerB.animation.alpha(255,100).start();
	containerC.animation.alpha(255,100).start();
	counter.animation.alpha(255,100).start();
	bg.animation.alpha(255,100).start(); 
	if(w.rightArrowAZ)
		w.rightArrowAZ.animation.alpha(255,100).start(); 
	if(w.leftArrowAZ)
		w.leftArrowAZ.animation.alpha(255,100).start(); 
	
}

vodAZ.prototype.onBlur = function onBlur(_key){
	//NGM.trace("ONBLUR VODAZ");
	var w = this.widgets,
		containerA = w.containerA,
		containerB = w.containerB,
		containerC = w.containerC,
		counter = w.counter,
		bg = w.bgPages,
		arrowR = w.rightArrowAZ,
		arrowL = w.leftArrowAZ;

	containerA.animation.alpha(0,100).start();
	containerB.animation.alpha(0,100).start();
	containerC.animation.alpha(0,100).start();
	counter.animation.alpha(0,100).start();
	bg.animation.alpha(0,100).start(); 
	if(arrowR.animation.alpha)
		arrowR.animation.alpha(0,100).start(); 
	if(arrowL.animation.alpha)
		arrowL.animation.alpha(0,100).start(); 
}

vodAZ.onFocusListA = function onFocusListA(_focus,_data){
	
	
   	if(_focus){
   		var w = this.widgets,
   			counter = w.counter,
   			bg = w.bgPages;
   			
		w.listB.setFocus(false);	
		w.listC.setFocus(false);
	
	
		if(this.actualFocus == "changePage"){
	  		w.listA.setFocus(false);
		}else{
	   		w.listA.setFocus(true);	
		}
	
		
   		if(_data.item.VodMovieVO)
			counter.setData({"index": _data.item.VodMovieVO.index, "total": this.total, "nameCategory":this.name});
		else
			counter.setData({"title": true, "nameCategory":this.name});
		counter.refresh();
   }         
}
vodAZ.onFocusListB = function onFocusListB(_focus,_data){
   	if(_focus){
   		var w = this.widgets,
   			counter = w.counter,
   			bg = w.bgPages;
   			
   		w.listA.setFocus(false);
		w.listC.setFocus(false);
		
		
		if(this.actualFocus == "changePage"){
	 		w.listB.setFocus(false);	
		}else{
	 		w.listB.setFocus(true);	
		}
		
		                
		if(_data.item.VodMovieVO)
			counter.setData({"index": _data.item.VodMovieVO.index, "total": this.total, "nameCategory":this.name});
		else
			counter.setData({"title": true, "nameCategory":this.name});
		counter.refresh();
   }         
}
vodAZ.onFocusListC = function onFocusListC(_focus,_data){
   	if(_focus){
   		var w = this.widgets,
   			counter = w.counter,
   			bg = w.bgPages;
   			
   		w.listA.setFocus(false);
 		w.listB.setFocus(false);	
		
		
		if(this.actualFocus == "changePage"){
			w.listC.setFocus(false);			
		}else{
			w.listC.setFocus(true);			
		}
		
		if(_data.item.VodMovieVO)
			counter.setData({"index": _data.item.VodMovieVO.index, "total": this.total, "nameCategory":this.name});
		else
			counter.setData({"title": true, "nameCategory":this.name});
		counter.refresh();
   }         
}

vodAZ.prototype.loadFirstPage = function loadFirstPage(){
		//Para este caso la velocidad estará en 0
		var speed = 0,
				w = this.widgets,
				bg = w.bgPages;
		
		var currentP = this.currentPage+1;
		
		if(currentP < this.pages.length){
			w.rightArrowAZ.setDataAnimated({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
			w.rightArrowAZ.stateChange("enter",0);
		}
	
		if(this.currentPage == 0){
			var prevPage = []; //en la primera página el prev está vacío
		}else{
			var prevPage = this.pages[this.currentPage-1];
		}
		var currentPage = this.pages[this.currentPage];
		var nextPage = this.pages[this.currentPage+1];
		
		
		
		//Contenedores
		var prevContainer = this.widgets.containerA;
 		var currentContainer = this.currentContainer = this.widgets.containerB;
 		var nextContainer = this.widgets.containerC;
 		
 		//Listas
 		var prevList = this.widgets.listA;
 		var currentList = this.widgets.listB;
 		var nextList = this.widgets.listC;
 	
		//Setear en la lista la página
		
 		currentList.setData(currentPage);
		nextList.setDataAnimated(nextPage);

		
		for(var x = 0; x < tpng.app.sections.length; x++){
			if(tpng.app.sections[x].name == "vodAZ" && tpng.app.sections[x].params.focusIndex > 0){
				var focusIndexList = tpng.app.sections[x].params.focusIndex;
			}else{
				var focusIndexList = 0;
			}
		}

		//Setear los focus
		prevList.setFocus(false);
 		currentList.setFocus(false);
 		currentList.focusIndex = focusIndexList;
 		currentList.setFocus(true); 		
		nextList.setFocus(false);
		
		
		//Mover el container "next" hacía el final de la pantalla, con eso tendremos precargada la siguiente página
	   if(prevPage){
	   		prevContainer.animation.alpha(0,0).move(-1024, 0, 0).start();	//Mover a la izquierda el prev 
			prevContainer.animation.alpha(255,speed).start();
			prevList.setDataAnimated(prevPage);	  
	   }
	   
	   nextContainer.animation.alpha(255,speed).move(1024,0,speed).start(); 

   		w.myLoadingIndicator.stateChange("exit");
		w.myLoadingIndicator.stop();

		

		w.notFound.stateChange("exit");		
		if(actualFocus =="changePage"){
			bg.setDataAnimated({"page": this.currentPage+1 , "pages": this.pages.length, "focus": true});
		}else{
			bg.setDataAnimated({"page": this.currentPage+1, "pages": this.pages.length, "focus": false});
		}
  		
	  
	    //Aparecer todas al mismo tiempo
	    this.client.lock();
	    	prevList.stateChange("enter");
	    	currentList.stateChange("enter");
	    	nextList.stateChange("enter");
			bg.stateChange("enter");
	    this.client.unlock();
	   
	   
	   //TODO: PENDIENTE
	   
	   
		 
	   NGM.trace("end loading AZ: " + (new Date().getTime() - this.ts_start));
}


vodAZ.prototype.loadNextPage = function loadNextPage(_col){
		var speed = 150;
		var nextPage = this.pages[this.currentPage+1];
		
		var currentP =  this.currentPage+1;
		if(currentP == this.pages.length){
			this.widgets.rightArrowAZ.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
			this.widgets.rightArrowAZ.stateChange("exit");
		}
		
		if(currentP > 1){
			this.widgets.leftArrowAZ.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "right"});
			this.widgets.leftArrowAZ.stateChange("enter");
		}
		
		if(this.actualFocus == "changePage"){
			this.widgets.bgPages.setData({"page": this.currentPage + 1, "pages": this.pages.length, "focus":true});
			this.widgets.bgPages.refresh();
		}else{
			this.widgets.bgPages.setData({"page": this.currentPage + 1, "pages": this.pages.length, "focus":false});
			this.widgets.bgPages.refresh();
		}

		if(this.currentContainer.name == "containerB"){
	 		var prevContainer = this.widgets.containerB;
	 		var currentContainer = this.currentContainer = this.widgets.containerC;
	 		var nextContainer = this.widgets.containerA;
	 		var prevList = this.widgets.listB;
 			var currentList = this.widgets.listC;
	 		var nextList = this.widgets.listA;	 				
		}else if(this.currentContainer.name == "containerC"){
			var prevContainer = this.widgets.containerC;
	 		var currentContainer = this.currentContainer = this.widgets.containerA;
	 		var nextContainer = this.widgets.containerB;
	 		var prevList = this.widgets.listC;
 			var currentList = this.widgets.listA;
	 		var nextList = this.widgets.listB;				
		}else{
			var prevContainer = this.widgets.containerA;
	 		var currentContainer = this.currentContainer = this.widgets.containerB;
	 		var nextContainer = this.widgets.containerC;
	 		var prevList = this.widgets.listA;
 			var currentList = this.widgets.listB;
	 		var nextList = this.widgets.listC;		
		}
	
		//TODO: revisar por qué se queda el focus del nextList, si pongo el setdata después de los setfocus lo deja siempre	
		//ANIMACIONES - SI HAY ALGO RARO EN LA ANIMACIÓN AQUÍ ES DONDE HAY QUE MOVERLE

		this.client.lock();			
			prevContainer.animation.move(-1024, 0, speed).start();	//Mover a la izquierda el prev	
			currentContainer.animation.move(0, 0, speed).start();	//Mover a 0 lo que antes era next, ahora current
			nextContainer.animation.alpha(0,0).move(1024,0,0).start(); 
			nextContainer.animation.alpha(255,0).start(); //antes tenía el speed
			nextList.setData(nextPage);			
		this.client.unlock();
		
		
		prevList.setFocus(false);		
		nextList.setFocus(false);
		if(this.actualFocus == "changePage"){
		 	currentList.setFocus(false);	
		}else{
			currentList.setFocus(false);
			if(this.pages[this.currentPage].length <= 2){
				if( _col <= 2 && this.pages[this.currentPage].length == 1){
					currentList.focusIndex = 0;
				}else if(_col <= 1 && this.pages[this.currentPage].length == 2){
					currentList.focusIndex = _col;
				}else if(_col == 2 && this.pages[this.currentPage].length == 2){
					currentList.focusIndex = 1;					
				}
			}else{
				currentList.focusIndex = _col;
			}
		 	currentList.setFocus(true);	
		}

		//}else if(this.pages[this.currentPage].length == 2){
			//			this.loadNextPage(list.selectIndex-8);
	
		//Setear los focus
		
		
}

vodAZ.prototype.loadPrevPage = function loadPrevPage(_col){
		var speed = 150;
		var prevPage = this.pages[this.currentPage-1];
		

																									
		var currentP =  this.currentPage;
		if(currentP == 0){
			this.widgets.leftArrowAZ.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "right"});
			this.widgets.leftArrowAZ.stateChange("exit");
		}
		
		var currentPP = this.currentPage+1;
		if(currentPP < this.pages.length){
			this.widgets.rightArrowAZ.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
			this.widgets.rightArrowAZ.stateChange("enter");
		}

		if(this.actualFocus == "changePage"){
			this.widgets.bgPages.setData({"page": this.currentPage + 1, "pages": this.pages.length, "focus":true});
			this.widgets.bgPages.refresh();
		}else{
			this.widgets.bgPages.setData({"page": this.currentPage + 1, "pages": this.pages.length, "focus":false});
			this.widgets.bgPages.refresh();
		}
		

		if(this.currentContainer.name == "containerB"){
	 		var prevContainer = this.widgets.containerC;
	 		var currentContainer = this.currentContainer = this.widgets.containerA;
	 		var nextContainer = this.widgets.containerB;
	 		var prevList = this.widgets.listC;
	 		var currentList = this.widgets.listA;
	 		var nextList = this.widgets.listB;
		}else if(this.currentContainer.name == "containerC"){
			var prevContainer = this.widgets.containerA;
	 		var currentContainer = this.currentContainer = this.widgets.containerB;
	 		var nextContainer = this.widgets.containerC;
	 		var prevList = this.widgets.listA;		
	 		var currentList = this.widgets.listB;
	 		var nextList = this.widgets.listC;			
		}else{ //Container A
			var prevContainer = this.widgets.containerB;
	 		var currentContainer = this.currentContainer = this.widgets.containerC;
	 		var nextContainer = this.widgets.containerA;
	 		var prevList = this.widgets.listB;
	 		var currentList = this.widgets.listC;
	 		var nextList = this.widgets.listA;	
		}
		/*
		//Setear los focus
		
		*/
	//ANIMACIONES - SI HAY ALGO RARO EN LA ANIMACIÓN AQUÍ ES DONDE HAY QUE MOVERLE
		this.client.lock();				
			currentContainer.animation.move(0, 0, speed).start();	//Mover a 0 lo que antes era next, ahora current
			nextContainer.animation.move(1024,0,speed).start();
			prevContainer.animation.alpha(0,0).move(-1024, 0, 0).start();	//Mover a la izquierda el prev 
			prevContainer.animation.alpha(255,speed).start();
			prevList.setData(prevPage);
		this.client.unlock();
		
		prevList.setFocus(false);		
		nextList.setFocus(false);
		
		//currentList.setFocus(true);			
		//currentList.scrollTo(_col);
		
		if(this.actualFocus == "changePage"){
 			currentList.setFocus(false); 			
 		}else{
	 		currentList.setFocus(false);
			currentList.focusIndex = _col;
			currentList.setFocus(true);	
 		}
		
}

//TODO: Quitar los colores de las listas y los otros dos draws

vodAZ.drawMovie = function drawMovie(_data){ 
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
 
		var vod = _data.VodMovieVO;	
		tp_draw.getSingleton().drawImage(vod.images.url4X4, ctx, 5, 5, null, null, null,"destination-over"); //tmp el w y h
		
		if(_data.VodMovieVO.ccoId == 317){
		   	tp_draw.getSingleton().drawImage("img/vod/testCover4x4.png", ctx, 5, 5);
		}

		if(vod.isBuy){
   			tp_draw.getSingleton().drawImage("img/vod/playVOD.png", ctx, 103, 51);
   			   			
   			var progress = (250/100) *  vod.progress;
   			Canvas.drawShape(ctx, "rect",[5, 130, 250, 6], this.themaData.fillBase);
   			Canvas.drawShape(ctx, "rect",[5, 130, progress, 6], this.themaData.vodExpirationBG);
   			
   		}
		if(focus){
			var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_pos" : "inside"};
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], strokeF);

			var custo = JSON.stringify(this.themaData.whiteStrokePanel);
				custo = JSON.parse(custo);
				custo.rx = 5;
				custo.stroke_width = 5;
			Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custo); //FONDO		

			}else{
				var stroke = { 				
					"fill": "rgba(30,30,40,.4)",
		        	"shadow": null,
        			"rx": null,
		        	"stroke": "rgba(90,90,90,1)",
        			"stroke_width": 1,
        			":focus": {
            			"fill"  :"rgba(30,30,30,.8)",
                		"shadow": null,
                		"rx": null,
                		"stroke":  "rgba(90,90,90,1)",
                		"stroke_width": 1
           			} 
				};			
				Canvas.drawShape(ctx, "rect", [5,6, ctx.viewportWidth-10,ctx.viewportHeight-12], stroke);
			}


		ctx.drawObject(ctx.endObject());
	}
}

vodAZ.drawCounter = function drawCounter(_data){ 

	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
        					
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	custo_f.text_align = "left,middle";
	custo_f.font_size = 22 * tpng.thema.text_proportion;
	var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
	custo = JSON.parse(custo);
	
	
	if(_data.index){	
		if(_data.nameCategory)
			Canvas.drawText(ctx, _data.nameCategory, new Rect(64,0,378,32), custo_f);
		else
			Canvas.drawText(ctx, "Catálogo de la A a la Z", new Rect(64,0,378,32), custo_f);
			
		custo_f.text_align = "right,middle";
		custo_f.font_size = 22 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.index + "<!size=20> de <!>" + _data.total, new Rect(0,0,ctx.viewportWidth-64,32), custo_f);
	}else if(_data.title){
		if(_data.nameCategory)
			Canvas.drawText(ctx, _data.nameCategory, new Rect(64,0,314,32), custo_f);
		else
			Canvas.drawText(ctx, "Catálogo de la A a la Z", new Rect(0,0,314,32), custo_f);

//		Canvas.drawText(ctx, "Catálogo de la A a la Z", new Rect(0,0,378,32), custo_f);
	}
	ctx.drawObject(ctx.endObject());
}

vodAZ.drawBgPages = function drawBgPages(_data){ 

	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	custo_f.text_align = "center,middle";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	
	var custo = JSON.stringify(this.themaData.darkBlackPanel);
	custo = JSON.parse(custo);
	
	if(_data.focus){
		var custoW = {"fill": "rgba(220, 220, 230, 1)"};
		custo_f.fill = "rgba(30,30,40,1)";
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW); //FONDO
		Canvas.drawText(ctx, "Página " + _data.page + " de " + _data.pages, new Rect(0,0,ctx.viewportWidth,32), custo_f);
		tp_draw.getSingleton().drawImage("img/vod/arrowLeftON_AZ.png", ctx, 1, 0); //tmp el w y h
		tp_draw.getSingleton().drawImage("img/vod/arrowRightON_AZ.png", ctx, 345, 0); //tmp el w y h

	}else{
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		Canvas.drawText(ctx, "Página " + _data.page + " de " + _data.pages, new Rect(0,0,ctx.viewportWidth,32), custo_f);
		tp_draw.getSingleton().drawImage("img/vod/arrowLeftON_AZ.png", ctx, 1, 0); //tmp el w y h
		tp_draw.getSingleton().drawImage("img/vod/arrowRightON_AZ.png", ctx, 345, 0); //tmp el w y h
	}
	

/*	if(_data){
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		Canvas.drawText(ctx, "Página " + _data.page + " de " + _data.pages, new Rect(0,0,ctx.viewportWidth,32), custo_f);
	}
*/
	ctx.drawObject(ctx.endObject());
}


vodAZ.drawMovieB = function drawMovieB(_data){ 
	
	this.draw = function draw(focus) {

		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    		
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		

		var vod = _data.VodMovieVO;

		if(vod){
			tp_draw.getSingleton().drawImage(vod.images.url3X3, ctx, 1, 1, null, null, null,"destination-over"); //tmp el w y h
			//Canvas.drawText(ctx, vod.name, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		}else{	
			var separator = _data.ItemVO;
			custo_f.font_size = 40 * tpng.thema.text_proportion;					
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
			Canvas.drawText(ctx, separator.title, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		}
		
		custo.fill = "rgba(0,255,0,.3)";
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		
		ctx.drawObject(ctx.endObject());
	}
}

vodAZ.drawMovieC = function drawMovieC(_data){ 
	
	this.draw = function draw(focus) {

		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    		
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		

		var vod = _data.VodMovieVO;

		if(vod){
			tp_draw.getSingleton().drawImage(vod.images.url3X3, ctx, 1, 1, null, null, null,"destination-over"); //tmp el w y h
			//Canvas.drawText(ctx, vod.name, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		}else{	
			var separator = _data.ItemVO;
			custo_f.font_size = 40 * tpng.thema.text_proportion;					
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
			Canvas.drawText(ctx, separator.title, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		}
		
		custo.fill = "rgba(0,0,255,.3)";
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		
		ctx.drawObject(ctx.endObject());
	}
}

vodAZ.drawBackX = function drawBackX(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	tp_draw.getSingleton().drawImage("img/tools/DevsOnion.png", ctx, 0, 0); //tmp el w y h	
	ctx.drawObject(ctx.endObject());	
}

vodAZ.drawArrowVodAZ = function drawArrowVodAZ(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     
	
	tp_draw.getSingleton().drawImage(_data.url, ctx, 1, 36);
    ctx.drawObject(ctx.endObject());
}

