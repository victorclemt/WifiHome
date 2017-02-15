// vodHome.js

FormWidget.registerTypeStandard("vodHomeC");

function vodHomeC(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.indexBg=true;
   	clearTimeout(this.deleyPlayer);
   	clearTimeout(this.timerLoadData);
	this.init = true;   	
}


vodHomeC.inherits(FormWidget);

vodHomeC.prototype.onExit = function onExit(){
	var widgets = this.widgets;
	unsetTimeAlarm(this.delayTimer);
	widgets.stateChange("exit");
}

vodHomeC.prototype.onEnter = function onEnter(_data){

	this.home = _data.home;
	
	var url = "img/vod/fondoVod.jpg";
	this.home.setBg(url);	

	this.widgets.notFound.setData({"message": "Estamos cargando tu contenido."});
	this.widgets.notFound.stateChange("enter");
	this.widgets.myLoadingIndicator.start();
	
	this.lockKey = true;
	this.actualFocus = 2;	
	
	//this.home.objectChild = this; //Esto se ocupaba cuando había un trailer y sinopsis, por si regresa lo dejamos.
	this.counting = 0;
	this.home.showHeader({"stroke":"rgba(130, 60, 150, 1)"});
	
	this.alias = _data.parameters.alias;
	this.update = _data.parameters.update;
	this.haveService=null;
	this.clubType=null;
	if(_data.parameters){

		switch(this.alias){
			case "TRANS":
				if(!tpng.vod.dataHome){
					var params = ["club=TRANS" , "maxRows=10"];
					getServices.getSingleton().call("VOD_GET_CATEGORIES_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 10000);
				}else{
					this.initHome(tpng.vod.dataHome);
				}
			break;
			case "KIDS":
				this.alias="TRANS";
				var params = ["club=TRANS" , "maxRows=10"];
				getServices.getSingleton().call("VOD_GET_KIDS_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 10000);
				break;
			case "SUSC":
				var params = ["club=SUSC" , "maxRows=10"];
				getServices.getSingleton().call("VOD_GET_CATEGORIES_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 10000);
				break;
			default:
				var params = ["club="+this.alias , "maxRows=10"];
				getServices.getSingleton().call("VOD_GET_CUSTOM_CAT_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 10000);
				break;				
		}
	}else{
		if(!tpng.vod.dataHome){
			this.alias = "TRANS";
			var params = ["club=TRANS" , "maxRows=10"];
			getServices.getSingleton().call("VOD_GET_CATEGORIES_LIST", params,  this.responseGetCategories.bind(this), null, null, null, 10000);
		}else{
			this.initHome(tpng.vod.dataHome);
		}
	}
}

vodHomeC.prototype.responseGetCategories = function responseGetCategories(response){
	
	if(response.status == 200){
		tpng.vod.dataHome = response; //recuerda poner en NULL este valor cuando compren y cuando cierren sesion
		
		//TODO: REVISAR ESTE FOR, ME LLEVA MUCHO TIEMPO ---> 4ms, igual y no es tanto
		var start = new Date().getTime();
		
		for(var x = 0; x < tpng.vod.dataHome.data.ResponseVO.categories.length; x++){
			if(tpng.vod.dataHome.data.ResponseVO.categories[x].CategoryVO.images){
				var objectCategory = [{
					"img": tpng.vod.dataHome.data.ResponseVO.categories[x].CategoryVO.images.url3X3,
					"back":	tpng.vod.dataHome.data.ResponseVO.categories[x].CategoryVO.images.url18X18,
					"type": "Category",
					"cvcId": tpng.vod.dataHome.data.ResponseVO.categories[x].CategoryVO.cvcId,
					"name": "" + (x+1) + " -> " + tpng.vod.dataHome.data.ResponseVO.categories[x].CategoryVO.categoryName
				}];
				tpng.vod.dataHome.data.ResponseVO.categories[x].CategoryVO.vodsArray.push({"VodCategoryVO": objectCategory});				
				tpng.vod.dataHome.data.ResponseVO.categories[x].CategoryVO.vodsArray.unshift({"VodCategoryVO": objectCategory});		
			}				
			tpng.vod.dataHome.data.ResponseVO.categories[x].CategoryVO.catName = tpng.vod.dataHome.data.ResponseVO.categories[x].CategoryVO.categoryName;
			tpng.vod.dataHome.data.ResponseVO.categories[x].CategoryVO.categoryName = (x+1)+". "+tpng.vod.dataHome.data.ResponseVO.categories[x].CategoryVO.categoryName;	
		}
		var end =  new Date().getTime();
		NGM.trace("tiempo del for: " + (end - start) + " ms.");
		
		this.initHome(tpng.vod.dataHome);

		
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home,"code":response.status}, false);
	}
}



vodHomeC.prototype.initHome = function initHome(_data){
		var widgets = this.widgets;
		var start = new Date().getTime();
		
		
		//TODO: VER SI SE PUEDE MEJORAR ESTE O SI LO PASAMOS FUERA DEL INIT HOME... ES LO MAS SEGURO
		this.categories = _data.data.ResponseVO.categories;
		var bannersVod =  _data.data.ResponseVO.arrayBanners;		
		
		//Siempre cargo las primeras 3 categorias.. TODO: Revisar si hay menos qué pasa???
		widgets.headerCategories_1.setDataAnimated({"categoryName": this.categories[0].CategoryVO.categoryName, "total": null,"position": null,"focus": false},{"fromState":"exit","toState":"enter"},0);
		widgets.headerCategories_2.setDataAnimated({"categoryName": this.categories[1].CategoryVO.categoryName, "total": null,"position": null,"focus": false},{"fromState":"exit","toState":"enter"},0);
		widgets.headerCategories_3.setDataAnimated({"categoryName": this.categories[2].CategoryVO.categoryName, "total": null,"position": null,"focus": false},{"fromState":"exit","toState":"enter"},0);
		widgets.categoriesList_1.setDataAnimated(this.categories[0].CategoryVO.vodsArray,{"fromState":"exit","toState":"enter"},0);
		widgets.categoriesList_2.setDataAnimated(this.categories[1].CategoryVO.vodsArray,{"fromState":"exit","toState":"enter"},0);
		widgets.categoriesList_3.setDataAnimated(this.categories[2].CategoryVO.vodsArray,{"fromState":"exit","toState":"enter"},0);
		
		//NOTA: No importa que se quede el indice lastSelectitem pq cuando se salga de todo VOD lo voy a borrar
		
		//Banners y demás widgets (bolitas contadoras y flechas)
		widgets.bannersVod.setDataAnimated(bannersVod,{"fromState":"exit","toState":"enter"});

		
		this.client.lock();
			this.home.widgets.mainBg.stateChange("exit");			
			widgets.myLoadingIndicator.stop();
			widgets.notFound.stateChange("exit");
			//contenedores			
			widgets.containerA.stateChange("enter");
			widgets.containerB.stateChange("enter");
			widgets.containerC.stateChange("enter"); 
			widgets.containerD.stateChange("enter");			
		this.client.unlock();
		
		//-----------TRACES PARA PRUEBAS --> BORRAR CUANDO TERMINE-------
		end =  new Date().getTime();
		NGM.trace("tiempo de pintado: " + (end - start) + " ms.");	
		//---------------------------------------------------------------	
			
		this.currentCategory = widgets.containerA;
		this.category_i  = 0; //El index de la categoría que está en el container auxiliar
		this.screenFocus = 0;
				
		unsetTimeAlarm(this.delayTimer);
		this.delayTimer = this.delayFocus.bind(this).delay(100); //Para poner el foco, porque por alguna razón si lo pongo luego luego no lo pinta, supongo que es por el setDataAnimated
	
}

vodHomeC.prototype.delayFocus = function delayFocus(){
	var widgets = this.widgets;
	//Control Remoto ONKEYPRESS
	this.actualForm = "vod";
	widgets.categoriesList_1.setFocus(true);
}

vodHomeC.prototype.onKeyPress = function onKeyPress(_key){
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

vodHomeC.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			this.home.disableSearchHeader();
		break;
		default:
			this.home.onKeyPress(_key);
		break;
	}
}

vodHomeC.prototype.onKeyPressVod = function onKeyPressVod(_key){
	
	var widgets = this.widgets;
	var currentList = this.getCurrentList();
	
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.hideHeader();
			this.home.closeSection(this);
		break;
		
		case "KEY_DOWN":
			this.nextCategory();
		break;
		
		case "KEY_UP":
			this.prevCategory();
		break;
		
		case "KEY_LEFT":
			//currentList.setFocus(true);
			currentList.scrollPrev();
			this.screenFocus = currentList.focusIndex - 2 ;
			NGM.trace("this.screenFocus: " + this.screenFocus);
			
		break;
		
		case "KEY_RIGHT":
			//currentList.setFocus(true);
			currentList.scrollNext();
			this.screenFocus = currentList.focusIndex - 2 ;
			NGM.trace("this.screenFocus: " + this.screenFocus);
			
		break;
		
		case "KEY_IRENTER":
			
			this.home.openVODSection("vodDetail", {"home":this.home, "VodMovieVO": currentList.selectItem.VodMovieVO}, this);	
			//this.home.openSection("vodDetail", {"home":this.home, "VodMovieVO": currentList.selectItem.VodMovieVO}, false, this, false, true);	
			//this.animation.alpha(0).start();
			//this.formOpenChild("vodDetail", ,{"home":this.home, "VodMovieVO": currentList.selectItem.VodMovieVO}, false, null, false);	
		break;
		
		default:
			//this.home.onKeyPress(_key);
		break;
	}
}

vodHomeC.prototype.onFocus = function onFocus(_key){
	NGM.trace("DE REGRESO A VOD HOME");
	this.home.showHeader({"stroke":"rgba(130, 60, 150, 1)"});
	this.widgets.stateChange("enter");
	//this.animation.alpha(255).start();
	
}

vodHomeC.prototype.onBlur = function onBlur(_key){
	NGM.trace("ADIOS A VOD HOME");
	//this.animation.alpha(0).start();
	//this.widgets.stateChange("exit");
}


vodHomeC.prototype.getContainers = function getContainers(_key){
	var widgets = this.widgets;
	var containers = null;
	if(this.currentCategory.name == "containerA"){
		var aux_top = widgets.containerD,
			top = widgets.containerA,
			bottom = widgets.containerB,
			aux_bottom = widgets.containerC;
		var aux_list = widgets.categoriesList_4;		
		var aux_list_2 = widgets.categoriesList_3;		
		var aux_header = widgets.headerCategories_4;
		var aux_header_2 = widgets.headerCategories_3;
	}else if(this.currentCategory.name == "containerB"){
		var aux_top = widgets.containerA,
			top = widgets.containerB,
			bottom = widgets.containerC,
			aux_bottom = widgets.containerD;
		var aux_list = widgets.categoriesList_1;
		var aux_list_2 = widgets.categoriesList_4;
		var aux_header = widgets.headerCategories_1;
		var aux_header_2 = widgets.headerCategories_4;
		
	}else if(this.currentCategory.name == "containerC"){
		var aux_top = widgets.containerB,
			top = widgets.containerC,
			bottom = widgets.containerD,
			aux_bottom = widgets.containerA;
		var aux_list = widgets.categoriesList_2;
		var aux_list_2 = widgets.categoriesList_1;
		var aux_header = widgets.headerCategories_2;
		var aux_header_2 = widgets.headerCategories_1;
	}else if(this.currentCategory.name == "containerD"){
		var aux_top = widgets.containerC,
			top = widgets.containerD,
			bottom = widgets.containerA,
			aux_bottom = widgets.containerB;
		var aux_list = widgets.categoriesList_3;
		var aux_list_2 = widgets.categoriesList_2;
		var aux_header = widgets.headerCategories_3;
		var aux_header_2 = widgets.headerCategories_2;
	}
	
	containers = {
		"aux_top": aux_top,
		"top": top,
		"bottom": bottom,
		"aux_bottom": aux_bottom,
		"aux_list": aux_list,
		"aux_list_2": aux_list_2,
		"aux_header": aux_header,
		"aux_header_2": aux_header_2  
	};
	
	return containers;
}

vodHomeC.onFocusLists = function onFocusLists(_focus, _data){

	if(_focus){
		
	}

}

vodHomeC.prototype.nextCategory = function nextCategory(_key){	
	var containers = this.getContainers();
	if((this.category_i + 2)  <= this.categories.length){
		//IMPORTANTE: Si algún "y" cambiara en el JSON se tiene que cambiar también aquí.
		this.client.lock();						
			containers.top.animation.zIndex(0).alpha(0,300).start(); //PROD
			containers.bottom.animation.move(0, 432, 300).alpha(255).zIndex(1).alpha(255).start(); // "y" del top /
			containers.aux_bottom.animation.move(0, 576, 300).alpha(255).start(); // "y" del bottom
			containers.aux_top.animation.move(0, 722, 0).alpha(0,0).start(); // "y" del aux								
		this.client.unlock();
		//Guardar la posición del último item seleccionado en la categoría.
		this.categories[this.category_i].CategoryVO.lastSelectIndex = this.getCurrentList().selectIndex;
		
		//Cambio de categoría en la lista auxiliar
		this.category_i  ++;
		this.currentCategory = containers.bottom;		
		var category = this.categories[this.category_i +2].CategoryVO;
		
		this.client.lock();
			this.setCurrentFocus();
		this.client.unlock();
		
		containers.aux_header.setData({"categoryName": category.categoryName, "total": null,"position": null,"focus": false});
		containers.aux_list.setData(category.vodsArray,category.lastSelectIndex);
		
		
		//containers.aux_list.focusIndex = category.lastSelectIndex;
		this.client.lock();
			containers.aux_header.stateChange("enter");
			containers.aux_list.stateChange("enter");
			containers.aux_list.refresh();
			containers.aux_header.refresh();
		this.client.unlock();
				
		//TODO: poner el disclaimer cuando sea la última categoria
	}
}

vodHomeC.prototype.prevCategory = function prevCategory(_key){		
	var containers = this.getContainers();	
	if(this.category_i > 0){
		//IMPORTANTE: Si algún "y" cambiara en el JSON se tiene que cambiar también aquí.
		this.client.lock();						
			containers.aux_top.animation.move(0, 432, 300).alpha(255,300).zIndex(1).start();
			containers.top.animation.move(0,576,300).alpha(255).zIndex(1).start();
			containers.bottom.animation.move(0, 722, 300).zIndex(1).start();
			containers.aux_bottom.animation.move(0, 434).alpha(0).zIndex(0).start();		
		this.client.unlock();
		//Guardar la posición del último item seleccionado en la categoría.
		this.categories[this.category_i].CategoryVO.lastSelectIndex = this.getCurrentList().selectIndex;
		var nextIndex = this.getCurrentList().focusIndex;
		//Cambio de categoría en la lista auxiliar
		this.category_i  --;
		this.currentCategory = containers.aux_top;
		var category = this.categories[this.category_i-1].CategoryVO;
		this.setCurrentFocus();
		containers.aux_header_2.setData({"categoryName": category.categoryName, "total": null,"position": null,"focus": false});
		containers.aux_list_2.setData(category.vodsArray, category.lastSelectIndex);
		
		//containers.aux_list_2.focusIndex = category.lastSelectIndex;
		this.client.lock();
			containers.aux_list_2.stateChange("enter");
			containers.aux_header_2.stateChange("enter");
			containers.aux_list_2.refresh();
			containers.aux_header_2.refresh();
		this.client.unlock();
				
	}
}

vodHomeC.prototype.getCurrentList = function getCurrentList(){
	var widgets = this.widgets;
	switch(this.currentCategory.name){
		case "containerA":
			return widgets.categoriesList_1;
		break;
		case "containerB":
			return widgets.categoriesList_2;
		break;
		case "containerC":
			return widgets.categoriesList_3;
		break;
		case "containerD":
			return widgets.categoriesList_4;
		break;
	}
	
}

vodHomeC.prototype.setCurrentFocus = function setCurrentFocus(){
	var widgets = this.widgets;
	
	
	
	switch(this.currentCategory.name){
		case "containerA":
			widgets.categoriesList_1.setFocus(true);
			//widgets.categoriesList_1.focusIndex = 5;
			widgets.categoriesList_2.setFocus(false);
			widgets.categoriesList_3.setFocus(false);
			widgets.categoriesList_4.setFocus(false);
		break;
		case "containerB":
			widgets.categoriesList_1.setFocus(false);
			//widgets.categoriesList_2.setFocus(true);
			widgets.categoriesList_3.setFocus(false);
			widgets.categoriesList_4.setFocus(false);
		break;
		case "containerC":
			widgets.categoriesList_1.setFocus(false);
			widgets.categoriesList_2.setFocus(false);
			//widgets.categoriesList_3.setFocus(true);
			widgets.categoriesList_4.setFocus(false);
		break;
		case "containerD":
			widgets.categoriesList_1.setFocus(false);
			widgets.categoriesList_2.setFocus(false);
			widgets.categoriesList_3.setFocus(false);
			//widgets.categoriesList_4.setFocus(true);
		break;
		
	}
	
	var currentList = this.getCurrentList();
	var index = this.screenFocus < currentList.list.length ? this.screenFocus : (currentList.list.length -1) ;
	NGM.trace("index: " + index + " --- length: " + currentList.list.length);
	currentList.scrollTo(index,{"duration":0});
	
}



vodHomeC.drawBanners = function drawBaners(ctx, bounds, custo, edata, _data){
	tp_draw.getSingleton().drawImage(_data.ItemVO.images.url18X10, ctx, 0, -32, null, null, null, "destination-over");					
}

vodHomeC.drawMovie = function drawMovie(ctx, bounds, custo, edata, _data){
	this.draw = function draw(focus) {
		 
		 
		 var image = _data.VodMovieVO ? _data.VodMovieVO.images.url3X3 : _data.VodCategoryVO[0].img;
		 tp_draw.getSingleton().drawImage(image, ctx, 0, 36, null , null, 
						function(){
							
		}.bind(this));
		NGM.trace("focus: " + focus);
		if(focus){
	        Canvas.drawShape(ctx, "rect",[0, 36, ctx.viewportWidth, ctx.viewportHeight-36],this.themaData.whiteStrokePanel);
	    }	
    }				
}