// menu.js

FormWidget.registerTypeStandard("menu");

function menu(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	
   	this.cont = 0;
   	this.home;
   	this.totalItems;
   	this.selectIndex = 0;
   	this.bannersTimer;
   	this.timerfocusMainMenu;
	this.getService;
   	this.first = true;
}

menu.inherits(FormWidget);

menu.prototype.onExit = function onExit(_data){
	//NGM.trace("onexit");
	unsetTimeAlarm(this.bannersTimer);
	clearTimeout(this.timerfocusMainMenu);
	clearTimeout(this.timerExit);
	this.exitBanners(); 
}

menu.prototype.onDestroy = function onDestroy(_data){
	//NGM.trace("onDestroy");
}

menu.prototype.onEnter = function onEnter(_data){

	this.home = _data.home;
	this.home.showHeader();
	//this.actualFocus = "menu";
	
	/*
	if(tpng.menu.tsMenu == 0 || tpng.menu.tsMenu < new Date().getTime()){
		
	}else{
		this.showMenu(tpng.menu.data);
	}
	*/
	//Ya no guarda en caché el menú
	getServices.getSingleton().call("ADMIN_GET_FULL_MENU","",this.responseGetMenu.bind(this));
}

menu.prototype.responseGetMenu = function responseGetMenu(response){
	
	if(response.status == 200){
		var menu = response.data.ResponseVO.menu,
			updateTime = response.data.ResponseVO.updateTime,
			widgets = this.widgets;
			
		tpng.menu.tsMenu = updateTime;
		tpng.menu.data = menu;

		//tpng.menu.data[0].menuVO.title = tpng.user.profile.networkImg ? tpng.user.profile.networkAlias.toUpperCase(): tpng.user.profile.alias.toUpperCase();
		tpng.menu.data[0].menuVO.title = tpng.menu.data[0].menuVO.title;
		tpng.menu.data[0].menuVO.images = tpng.user.profile.images;
		//tpng.menu.data[0].menuVO.focus = true;
		
	
		//SUBMENU - PERFIL
		var profileSubMenu = tpng.menu.data[0].menuVO.submenuVO.ResponseVO.arrayBottom[0].ItemVO;
		if(profileSubMenu.title == "Profile"){
			profileSubMenu.title = "Cambiar|perfil";
			profileSubMenu.color = "0-rgba(0,0,0,0)|1-rgba(0,0,0,0)";
			
			if(tpng.user.profile.networkImg)
				profileSubMenu.imageBackground = tpng.user.profile.networkImgL;			
			else
				profileSubMenu.imageBackground = tpng.user.profile.images.url3X5A;			
		}
		
		tpng.menu.data[0].menuVO.submenuVO.ResponseVO.arrayBottom[0].ItemVO = profileSubMenu;
		
		this.showMenu(tpng.menu.data);

		
	}else{
		clearTimeout(this.timerExit);
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false, null, true);
	}
	
}

menu.prototype.showMenu = function showMenu(_menu){

	var widgets = this.widgets,
		backgroundMenu = widgets.backgroundMenu,
		backgroundSubMenu = widgets.backgroundSubMenu,
		menu = widgets.mainMenu;
	
	backgroundSubMenu.setData();
	backgroundMenu.setData();
	menu.setData(_menu);
	backgroundSubMenu.stateChange("enter");
	backgroundMenu.stateChange("enter");
	menu.stateChange("enter");	
	
	menu.refresh();
	menu.setFocus(false);
	menu.focusIndex = tpng.menu.lastMenuIndex;
	menu.setFocus(true);
	
	this.actualFocus = "menu";

	
}


menu.onFocusMainMenu = function onFocusMainMenu(_focus,_data){   

   	if(_focus){  		
   		var widgets = this.widgets;
		var submenu = _data.item.menuVO.submenuVO.ResponseVO;
   		if(this.first){
   			this.first = false;
   			this.setDataMenu(submenu);
   		}else{
	   		unsetTimeAlarm(this.timerfocusMainMenu);
		   	this.timerfocusMainMenu = setTimeout(function(){
		   	
		   		widgets.rightArrowTopSubMenu.stateChange("exit");
		   		widgets.rightArrowBottomSubMenu.stateChange("exit");		   		
		   		widgets.leftArrowTopSubMenu.stateChange("exit");
		   		widgets.leftArrowBottomSubMenu.stateChange("exit");		   		
				widgets.lineBottom.stateChange("exit_banner");
				widgets.lineTop.stateChange("exit_banner");
				this.change_submenu("exit_banner");
				unsetTimeAlarm(this.menuDelay);
		    	this.menuDelay = this.setDataMenu.bind(this,submenu).delay(10); 	
		   }.bind(this), 400);
		}
   	}else{  	
   		
   	}         
}

menu.prototype.setDataMenu = function setDataMenu(submenu){

	var widgets = this.widgets;	
	var tsStart = new Date().getTime();
	this.haveBanner = true;
	this.totalItems = 4;
	if(submenu.arrayBanners.length > 1)
		this.change_banners(submenu.arrayBanners);
	else
		widgets.recommendations.setData(submenu.arrayBanners);   				
	
	widgets.subMenu_top.setData(submenu.arrayTop);		
	widgets.subMenu_bottom.setData(submenu.arrayBottom);		
	//NGM.trace("tiempo set juntos: " + ((new Date().getTime()) - tsStart));
	//NGM.trace("stateGet: " + widgets.subMenu_bottom.stateGet());
   	//NGM.trace(" ");
   	this.change_submenu("enter_banner");
   
   	this.client.lock();	
	if(widgets.subMenu_top.list.length > 4){
		widgets.rightArrowTopSubMenu.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
		widgets.rightArrowTopSubMenu.stateChange("enter_banner");
	}else{
		widgets.lineTop.setData({"banner": true, "position": widgets.subMenu_top.list.length+2});
		widgets.lineTop.stateChange("enter");
	}
   	
   	if(widgets.subMenu_bottom.list.length > 4){
		widgets.rightArrowBottomSubMenu.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
		widgets.rightArrowBottomSubMenu.stateChange("enter_banner");
	}else{
		widgets.lineBottom.setData({"banner": true, "position": widgets.subMenu_bottom.list.length+2});
		widgets.lineBottom.stateChange("enter");

	}
		
 	this.client.unlock();
   	//Cambiar el menú seleccionado (dibujar marco)
   	
   	var menu = widgets.mainMenu;
  	for(var i = 0, l = menu.list.length; i<l ; i++){
   		menu.list[i].menuVO.focus = false;
   	}
   	menu.selectItem.menuVO.focus = true;
	tpng.menu.lastMenuIndex = menu.focusIndex;
   	menu.redraw();
   	
	clearTimeout(this.timerExit);
		this.timerExit = setTimeout(function(){
		var state = this.haveBanner ? "exit_banner" : "exit";
		this.animateWidgets([menu,widgets.backgroundMenu,widgets.backgroundSubMenu,[widgets.subMenu_bottom,widgets.rightArrowBottomSubMenu,widgets.leftArrowBottomSubMenu,widgets.recommendations,widgets.strokeFocus,widgets.lineBottom],[widgets.subMenu_top,widgets.rightArrowTopSubMenu,widgets.leftArrowTopSubMenu,widgets.lineTop]], 200, state, this.exitMenuAnimation.bind(this));
	}.bind(this), 20000);   	

   	
}

menu.prototype.change_submenu = function change_submenu(_state){

	var widgets = this.widgets;
	this.client.lock();   		   				
   		widgets.subMenu_bottom.stateChange(_state);
		widgets.subMenu_top.stateChange(_state);
		widgets.recommendations.stateChange(_state);	
	this.client.unlock();

}

menu.prototype.change_banners = function change_banners(_banners){

	var recommendations = this.widgets.recommendations;			
	for(var i = 0; i< _banners.length; i++){
			_banners[i].ItemVO.total = _banners.length;
			if(_banners.length <= 3){
				_banners[i].ItemVO.index = i+1;
			}
		}	
	if(_banners.length > 0){
		recommendations.setData(_banners,this.positionBanner);
		if(_banners.length > 1){
			var interval = _banners[0].ItemVO.timer-0;
			unsetTimeAlarm(this.bannersTimer);  
			this.bannersTimer = this.change_next_banner.bind(this).repeat(interval);
		}
	}

}

menu.prototype.change_next_banner = function change_next_banner(){

	var recommendations = this.widgets.recommendations;	
	recommendations.scrollNext();
}




menu.prototype.animateWidgets = function animateWidgets(_widgets, _delay, _state, _callback, _index){		

	_index = _index ? _index : 0;
	if(_index == 0){
		//Siempre nos aseguramos quitar el control del onKeyPress
		this.actualFocus = "";
	}
			
	if(_index < _widgets.length){
		if(_widgets[_index].length){
			//NGM.trace("es un array");
			var widgets = _widgets[_index];	
			for(var i = 0, l = _widgets[_index].length ; i<l ; i++){
				widgets[i].stateChange(_state);
			}
			widgets = null;
		}else{
			//NGM.trace("es un widget");
			_widgets[_index].stateChange(_state);
		}		
		_index++;
		this.animateWidgets.bind(this,_widgets, _delay, _state, _callback, _index).delay(_delay);
	}else{
		//Cuando termina de animar todo, regresa el control al onkeypress
		if(_callback){
			//NGM.trace("callback");
			_callback();
		}else{
			//NGM.trace("NADA");
			this.actualFocus = "menu";
			return;
		}
		
	}
}



menu.onFocusButtonsTop = function onFocusButtonsTop(_focus,_data){
	var widgets = this.widgets;
   	if(_focus){
    	if(this.actualFocus == "recommendations"){
        	widgets.subMenu_top.setFocus(false);   
        }else{
        }
   }
         
}

menu.onFocusSubMenuBottom = function onFocusSubMenuBottom(_focus,_data){
	var widgets = this.widgets;
   	if(_focus){
    	if(this.actualFocus == "recommendations"){
        	widgets.subMenu_bottom.setFocus(false);   
        }else{
        }
   }
         
}


menu.prototype.onKeyPress = function onKeyPress(_key){
	var widgets = this.widgets;
	
	switch(this.actualFocus){ 
		case "menu":
			this.onKeyPressMenu(_key);
		break;
		case "subMenuTop":
			this.onKeyPressSubMenu_Top(_key);
		break;
		case "subMenuBottom":
			this.onKeyPressSubMenu_Bottom(_key);
		break;
		case "recommendations":
			this.onKeyPressRecommendations(_key);
		break;		
		case "search":
			this.onKeyPressSearch(_key);
		break;
	}
	
	return true;

}
menu.prototype.onKeyPressMenu = function onKeyPressMenu(_key){
	var widgets = this.widgets,
		menu = widgets.mainMenu,
		backgroundMenu = widgets.backgroundMenu,
		backgroundSubMenu = widgets.backgroundSubMenu,
    	subMenu_top = widgets.subMenu_top,
    	subMenu_bottom = widgets.subMenu_bottom,
    	strokeFocus = widgets.strokeFocus,
    	rightArrowTopSubMenu = widgets.rightArrowTopSubMenu,
    	rightArrowBottomSubMenu = widgets.rightArrowBottomSubMenu,
    	leftArrowTopSubMenu = widgets.leftArrowTopSubMenu,
    	leftArrowBottomSubMenu = widgets.leftArrowBottomSubMenu,
    	recommendations = widgets.recommendations,
    	lineTop = widgets.lineTop,
    	lineBottom = widgets.lineBottom;
    	
    		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":		
			var state = this.haveBanner ? "exit_banner" : "exit";
			this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
		break;
				
		case "KEY_RIGHT":
		case "KEY_LEFT":
			_key == "KEY_LEFT" ? menu.scrollPrev() : menu.scrollNext();
			clearTimeout(this.timerExit);
				this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);
			
		break;	
		
		case "KEY_UP":
			clearTimeout(this.timerfocusMainMenu);
			if(this.haveBanner){
				menu.setFocus(false);
				if(menu.focusIndex >= 2){
					if(menu.focusIndex > subMenu_bottom.maxItem){
						subMenu_bottom.focusIndex = subMenu_bottom.maxItem;
					}else{
						subMenu_bottom.focusIndex = menu.focusIndex-1;
					}				
					this.actualFocus = "subMenuBottom";
					subMenu_bottom.setFocus(true);
				}else{
				
					strokeFocus.setData();
					strokeFocus.stateChange("enter");
					this.actualFocus = "recommendations";
					recommendations.setFocus(true);
				}	
				
			}else{
				this.actualFocus = "subMenuBottom";
				menu.setFocus(false);
				
				if(menu.focusIndex >= subMenu_bottom.maxItem)
					subMenu_bottom.focusIndex = subMenu_bottom.maxItem;
				else
					subMenu_bottom.focusIndex = (menu.focusIndex)+1;
						
				subMenu_bottom.setFocus(true);
			}
			clearTimeout(this.timerExit);
				this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);
		
			subMenu_bottom.animation.zIndex(3).start();
    		subMenu_top.animation.zIndex(2).start();
		break;			
		
		}
		
	return true;
}

menu.prototype.exitMenuAnimation = function exitMenuAnimation(){
	this.home.hideHeader();
	unsetTimeAlarm(this.bannersTimer);
	clearTimeout(this.timerfocusMainMenu);
	clearTimeout(this.timerExit);
	this.exitBanners(); 
	this.home.closeSection(this);
	//this.exitMenuDelay.bind(this).delay(200);
}

menu.prototype.exitMenuDelay = function exitMenuDelay(){
	this.home.hideHeader();
	unsetTimeAlarm(this.bannersTimer); 
	clearTimeout(this.timerfocusMainMenu);
	clearTimeout(this.timerExit);
	this.home.closeSection(this);
}

menu.prototype.exitBanners = function exitBanners(){
	var recommendations = this.widgets.recommendations;
	if(recommendations.stateGet() != "exit_banner"){
		unsetTimeAlarm(this.bannersTimer);
		recommendations.stateChange("exit_banner");
	}
}

menu.prototype.onKeyPressSubMenu_Top = function onKeyPressSubMenu_Top(_key){
	var widgets = this.widgets,
		menu = widgets.mainMenu,
		backgroundMenu = widgets.backgroundMenu,
		backgroundSubMenu = widgets.backgroundSubMenu,
    	subMenu_top = widgets.subMenu_top,
    	subMenu_bottom = widgets.subMenu_bottom,
    	strokeFocus = widgets.strokeFocus,
    	rightArrowTopSubMenu = widgets.rightArrowTopSubMenu,
    	rightArrowBottomSubMenu = widgets.rightArrowBottomSubMenu,
    	leftArrowTopSubMenu = widgets.leftArrowTopSubMenu,
    	leftArrowBottomSubMenu = widgets.leftArrowBottomSubMenu,
    	recommendations = widgets.recommendations,
    	lineTop = widgets.lineTop,
    	lineBottom = widgets.lineBottom;

	switch(_key){
		
		case "KEY_MENU":
		case "KEY_IRBACK":
			var state = this.haveBanner ? "exit_banner" : "exit";
			this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
		break;
		
		case "KEY_IRENTER":	
			var state = this.haveBanner ? "exit_banner" : "exit";
			this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations, lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu, lineTop]], 200, state, this.openItem.bind(this,subMenu_top.selectItem.ItemVO));
		break;
		
		case "KEY_RIGHT":
			subMenu_top.scrollNext();
			
			// VALIDACION DE FLECHAS
			if(subMenu_top.maxItem > this.totalItems){
				if(subMenu_top.selectIndex >= this.totalItems){				
					leftArrowTopSubMenu.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});					
					leftArrowTopSubMenu.stateChange("enter_banner");
							
				}
				if(subMenu_top.selectIndex == (subMenu_top.maxItem-1)){
					rightArrowTopSubMenu.setData({"url": "" ,"line":true, "position": "right"});	
					rightArrowTopSubMenu.stateChange("enter_banner"); 
					
				}	
			}
			
			clearTimeout(this.timerExit);
				this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);
			
		break;
		
		case "KEY_LEFT":
			
			if(subMenu_top.selectIndex <= 0 && this.haveBanner){
			//	this.positionBanner = widgets.bannersVod.selectIndex; ***
			//	unsetTimeAlarm(this.bannersTimer); // ***
				this.actualFocus = "recommendations";
				subMenu_top.setFocus(false);
				strokeFocus.setData();
				strokeFocus.stateChange("enter");				
			}else{
				subMenu_top.scrollPrev();
			}
			
			// VALIDACION DE FLECHAS
			if(subMenu_top.maxItem > this.totalItems){
				if(subMenu_top.selectIndex == 0){
					if(this.haveBanner){			
						leftArrowTopSubMenu.setData({"url":"", "line":false, "position": "left"});
						leftArrowTopSubMenu.stateChange("exit_banner");
					}else{
						leftArrowTopSubMenu.setData({"url":"", "line":true, "position": "left"});
						leftArrowTopSubMenu.stateChange("enter");
					}
				}
				 
				if(subMenu_top.selectIndex+1 <= (subMenu_top.maxItem-this.totalItems)){
					rightArrowTopSubMenu.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
					if(this.haveBanner)
						rightArrowTopSubMenu.stateChange("enter_banner");
					else
						rightArrowTopSubMenu.stateChange("enter");
					
				}
			}
			
			clearTimeout(this.timerExit);
				this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);
			
		break;		
		

		case "KEY_DOWN":
			this.actualFocus = "subMenuBottom";
			subMenu_top.setFocus(false);
			if(subMenu_top.focusIndex > subMenu_bottom.maxItem)
				subMenu_bottom.focusIndex = subMenu_bottom.maxItem;
			else
				subMenu_bottom.focusIndex = subMenu_top.focusIndex;
			
			subMenu_bottom.setFocus(true);
			clearTimeout(this.timerExit);
				this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);
			subMenu_bottom.animation.zIndex(3).start();
			subMenu_top.animation.zIndex(2).start();			
		break;	
		
		case "KEY_UP":
			this.actualFocus = "search";
	   		this.home.enableSearchHeader();
	   		subMenu_top.setFocus(false);
	   		clearTimeout(this.timerExit);
		break;
			
	}	
	
	return true;
}

menu.prototype.onKeyPressSearch = function onKeyPressSearch(_key){	
	var widgets = this.widgets,
		menu = widgets.mainMenu,
		backgroundMenu = widgets.backgroundMenu,
		backgroundSubMenu = widgets.backgroundSubMenu,
    	subMenu_top = widgets.subMenu_top,
    	subMenu_bottom = widgets.subMenu_bottom,
    	strokeFocus = widgets.strokeFocus,
    	rightArrowTopSubMenu = widgets.rightArrowTopSubMenu,
    	rightArrowBottomSubMenu = widgets.rightArrowBottomSubMenu,
    	leftArrowTopSubMenu = widgets.leftArrowTopSubMenu,
    	leftArrowBottomSubMenu = widgets.leftArrowBottomSubMenu,
    	recommendations = widgets.recommendations,
    	lineTop = widgets.lineTop,
    	lineBottom = widgets.lineBottom;
			
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			this.home.disableSearchHeader();
			this.actualFocus = "subMenuTop";
			subMenu_top.setFocus(true);
			clearTimeout(this.timerExit);
			this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop], [recommendations,strokeFocus]], 100, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);
    		subMenu_top.animation.zIndex(3).start();
			subMenu_bottom.animation.zIndex(2).start();			
		break;
		
		default:
			this.home.onKeyPress(_key);
		break;
	}
	return true
}


menu.prototype.onKeyPressSubMenu_Bottom = function onKeyPressSubMenu_Bottom(_key){
	
	var widgets = this.widgets,
		menu = widgets.mainMenu,
		backgroundMenu = widgets.backgroundMenu,
		backgroundSubMenu = widgets.backgroundSubMenu,
    	subMenu_top = widgets.subMenu_top,
    	subMenu_bottom = widgets.subMenu_bottom,
    	strokeFocus = widgets.strokeFocus,
    	rightArrowTopSubMenu = widgets.rightArrowTopSubMenu,
    	rightArrowBottomSubMenu = widgets.rightArrowBottomSubMenu,
    	leftArrowTopSubMenu = widgets.leftArrowTopSubMenu,
    	leftArrowBottomSubMenu = widgets.leftArrowBottomSubMenu,
    	recommendations = widgets.recommendations,
    	lineTop = widgets.lineTop,
    	lineBottom = widgets.lineBottom;
    	
	switch(_key){
	
		case "KEY_MENU":
		case "KEY_IRBACK":
			var state = this.haveBanner ? "exit_banner" : "exit";
			this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu, lineTop]], 200, state, this.exitMenuAnimation.bind(this));
		break;
		
		case "KEY_IRENTER":
			var state = this.haveBanner ? "exit_banner" : "exit";
			this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations, lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu, lineTop]], 200, state, this.openItem.bind(this,subMenu_bottom.selectItem.ItemVO));
		break;
		
		case "KEY_LEFT":

			if(subMenu_bottom.selectIndex <= 0 && this.haveBanner){
			//	unsetTimeAlarm(this.bannersTimer); // ***
				this.actualFocus = "recommendations";
				subMenu_bottom.setFocus(false);
				strokeFocus.setData();
				strokeFocus.stateChange("enter");
			}else{
				subMenu_bottom.scrollPrev();
			}
			
			// * VALIDACION DE LAS FLECHAS
			if(subMenu_bottom.maxItem > this.totalItems){
				if(subMenu_bottom.selectIndex == 0){
					if(this.haveBanner){
						leftArrowBottomSubMenu.stateChange("exit_banner");
					}else{
						leftArrowBottomSubMenu.setData({"url":"", "line":true, "position": "left"});
						leftArrowBottomSubMenu.stateChange("enter");
					}
				}
				 
				if(subMenu_bottom.selectIndex+1 <= (subMenu_bottom.maxItem-this.totalItems)){
					rightArrowBottomSubMenu.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
					if(this.haveBanner){
						rightArrowBottomSubMenu.stateChange("enter_banner");
					}else{
						rightArrowBottomSubMenu.stateChange("enter");
					}
				}
			}	
			
			clearTimeout(this.timerExit);
				this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);
			
		break;
		
		case "KEY_RIGHT":
			subMenu_bottom.scrollNext();

			// * VALIDACION DE LAS FLECHAS
			if(subMenu_bottom.maxItem > this.totalItems){	
				if(subMenu_bottom.selectIndex >= this.totalItems){
					leftArrowBottomSubMenu.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					if(this.haveBanner){
						leftArrowBottomSubMenu.stateChange("enter_banner");
					}else{
						lineBottom.setData({"banner": true, "position": 0});
						lineBottom.redraw();
						leftArrowBottomSubMenu.stateChange("enter");
					}
				}
				if(subMenu_bottom.selectIndex == (subMenu_bottom.maxItem-1)){
					rightArrowBottomSubMenu.setData({"url": "" ,"line":true, "position": "right"});
					if(this.haveBanner){
						rightArrowBottomSubMenu.stateChange("enter_banner");
					}else{
						rightArrowBottomSubMenu.stateChange("enter");
					}
				}	
			}
			clearTimeout(this.timerExit);
				this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);						
			
		break;
		
		case "KEY_UP":
		
			this.actualFocus = "subMenuTop";
			subMenu_bottom.setFocus(false);
			if(subMenu_bottom.focusIndex >= subMenu_top.maxItem){
				subMenu_top.focusIndex = subMenu_top.maxItem;
			}else{
				subMenu_top.focusIndex = subMenu_bottom.focusIndex;			
			}
			subMenu_top.setFocus(true);		
			clearTimeout(this.timerExit);
				this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);			
			
    		subMenu_top.animation.zIndex(3).start();
			subMenu_bottom.animation.zIndex(2).start();
		break;
		
		case "KEY_DOWN":
			this.actualFocus = "menu";
			subMenu_bottom.setFocus(false);
			menu.focusIndex = tpng.menu.lastMenuIndex;
			menu.setFocus(true);		
			this.getService =  false;
			clearTimeout(this.timerfocusMainMenu);
	
			clearTimeout(this.timerExit);		
				this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);	
		break;
						
	}	
	return true;
}

menu.prototype.onKeyPressRecommendations = function onKeyPressRecommendations(_key){
	var widgets = this.widgets,
		menu = widgets.mainMenu,
		backgroundMenu = widgets.backgroundMenu,
		backgroundSubMenu = widgets.backgroundSubMenu,
    	subMenu_top = widgets.subMenu_top,
    	subMenu_bottom = widgets.subMenu_bottom,
    	strokeFocus = widgets.strokeFocus,
    	rightArrowTopSubMenu = widgets.rightArrowTopSubMenu,
    	rightArrowBottomSubMenu = widgets.rightArrowBottomSubMenu,
    	leftArrowTopSubMenu = widgets.leftArrowTopSubMenu,
    	leftArrowBottomSubMenu = widgets.leftArrowBottomSubMenu,
    	recommendations = widgets.recommendations,
    	lineTop = widgets.lineTop,
    	lineBottom = widgets.lineBottom;
			
	switch(_key){		
		case "KEY_IRBACK":
		case "KEY_MENU":
			var state = this.haveBanner ? "exit_banner" : "exit";
			this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop], [recommendations,strokeFocus]], 100, state, this.exitMenuAnimation.bind(this));
	    break;

    	case "KEY_IRENTER":
			var state = this.haveBanner ? "exit_banner" : "exit";
	    	this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.openItem.bind(this,recommendations.selectItem.ItemVO));
    	break;

    	case "KEY_RIGHT":
    	
    		this.actualFocus = "subMenuTop";
    		subMenu_top.focusIndex = 1;
			subMenu_top.setFocus(true);
			strokeFocus.stateChange("exit");
			clearTimeout(this.timerExit);
				this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop], [recommendations,strokeFocus]], 100, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);
    		subMenu_top.animation.zIndex(3).start();
			subMenu_bottom.animation.zIndex(2).start();
    	
    	break;
    	    	
    	case "KEY_DOWN":
			this.actualFocus = "menu";
			strokeFocus.stateChange("exit");
			recommendations.setFocus(false);
			
			menu.focusIndex = tpng.menu.lastMenuIndex;
			menu.setFocus(true);		
			this.getService =  false;
			clearTimeout(this.timerfocusMainMenu);

			clearTimeout(this.timerExit);
				this.timerExit = setTimeout(function(){
				var state = this.haveBanner ? "exit_banner" : "exit";
				this.animateWidgets([menu,backgroundMenu,backgroundSubMenu,[subMenu_bottom,rightArrowBottomSubMenu,leftArrowBottomSubMenu,recommendations,strokeFocus,lineBottom], [subMenu_top,rightArrowTopSubMenu,leftArrowTopSubMenu,lineTop]], 200, state, this.exitMenuAnimation.bind(this));
			}.bind(this), 20000);
		break;		
		
		case "KEY_UP":	
			this.actualFocus = "search";
	   		this.home.enableSearchHeader();
		 	strokeFocus.stateChange("exit");
	   		clearTimeout(this.timerExit);
		break;
    		    
	}	

	return true;
}



menu.prototype.openItem = function openItem(_item){
	this.home.hideHeader();
	this.exitBanners();
	unsetTimeAlarm(this.bannersTimer); 
	clearTimeout(this.timerExit);
	this.home.openLink(_item.link, null, 1, _item.itemId, _item);
}


menu.drawBackgroundMenu = function drawBackgroundMenu(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
	
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	ctx.drawObject(ctx.endObject());	
}

menu.drawBackgroundSubMenu = function drawBackgroundSubMenu(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	var custo = {"fill": '0-rgba(0,0,0,0)|1-rgba(30,30,40,.9)'};
	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custo);
	ctx.drawObject(ctx.endObject());	
}

menu.drawMainMenu = function drawMainMenu(_data){ 
	this.draw = function draw(focus) { 
		var ctx = this.getContext("2d");
  	  	ctx.clear();
		ctx.beginObject();	
		
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "center, middle";
		custo_f.font_size = 16 * tpng.thema.text_proportion;
		
		//No sé por que pasa esto, q a veces ya llega el menú VO 
		_data = _data.menuVO ? _data.menuVO : _data;
		
			if(focus){				
	   			var custoX = {fill: "rgba(240,240,250,1)"};
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,68], custoX);

				if(_data.focus){
					custo_f.fill = _data.color;
					Canvas.drawText(ctx, _data.title, new Rect(0, 2, ctx.viewportWidth, 60), custo_f);		
				}else{
					custo_f.fill = "rgba(0,0,0,1)";
					Canvas.drawText(ctx, _data.title, new Rect(0, 2, ctx.viewportWidth, 60), custo_f);
				}

			}else{
				if(_data.focus){		
					// BARRA
					var custoX = {fill: _data.color};
					Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,10], custoX);
					
					//TEXTO
					custo_f.fill = _data.color;
					Canvas.drawText(ctx, _data.title, new Rect(0, 2, ctx.viewportWidth, 60), custo_f);					
					
				}else{
					custo_f.fill =  "rgba(255,255,255,1)";
					Canvas.drawText(ctx, _data.title, new Rect(0, 2, ctx.viewportWidth, 60), custo_f);
				}
			}
		
		ctx.drawObject(ctx.endObject());
	}	
}

menu.drawSubMenu = function drawSubMenu(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
		
		var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocusR);
		custo = JSON.parse(custo);
		custo.fill=null;
   		
		//SUBMENÚ TIPO PERFIL		
		if(_data.ItemVO.imageBackground){	
				tp_draw.getSingleton().drawImage(_data.ItemVO.imageBackground, ctx, 5, 5, 186, 104, null,"destination-over", "aspectFit"); //tmp el w y h
			 	var custoShadow = {"fill": "0-rgba(30,30,40,0)|1-rgba(30,30,40,1)"};
				Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custoShadow);
				tp_draw.getSingleton().drawImage(_data.ItemVO.images.url3X3A, ctx, 5, 5);
		}else if(_data.ItemVO.color){
		//SUBMENÚ TIPO BOTÓN
			var custoBackground = {"fill": _data.ItemVO.color,"fill_coords":  "0,0,.6,-.4"};
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10], custoBackground);
			tp_draw.getSingleton().drawImage(_data.ItemVO.images.url3X3A, ctx, 5, 5);
		}else{
		//SUBMENÚ CON IMAGEN			
			tp_draw.getSingleton().drawImage(_data.ItemVO.images.url3X3, ctx, 5, 5, null, null, null,"destination-over");
			
			if(_data.ItemVO.images.url1X1){ 
				tp_draw.getSingleton().drawImage("img/menu/3x3_SOMBRAlogos.png", ctx, 5, 5, null , null, 
						function(){
							var ctx = this.getContext("2d");
							if(_data.ItemVO.showTittle){
								custo_f.text_align = "center,middle";
								Canvas.drawText(ctx, _data.ItemVO.title, new Rect(5,5,ctx.viewportWidth-10,55), custo_f);
							}
							tp_draw.getSingleton().drawImage(_data.ItemVO.images.url1X1, ctx, 110, 61);					
				}.bind(this));
			}else{
				
				
			}	
					
   		}
   		
   		Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10], custo); //FONDO
   		
   		//TÍTULOS 
   		if(_data.ItemVO.showTittle){
   			var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,top";
			custo_f.font_size = 18 * tpng.thema.text_proportion;				
			custo_f.text_align = "center,middle";
			Canvas.drawText(ctx, _data.ItemVO.title, new Rect(60, 5, 130, ctx.viewportHeight-10), custo_f);
		}
   		
		//FOCUS
		if(focus){
			var custo = {"stroke": "rgba(240, 240, 250, 1)", "rx":5, "stroke_width": 5, "stroke_pos":"inside" };
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
			var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_pos" : "inside"};
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10], strokeF);
		}
		
		ctx.drawObject(ctx.endObject());
	}	
}

menu.drawRecommendations = function drawRecommendations(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
			ctx.beginObject();
    		ctx.clear();	

			var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);
			custo_f.text_align = "center, middle";
			custo_f.font_size = 18 * tpng.thema.text_proportion;
  	
  		// image count
  		if(_data.ItemVO.total > 1 && _data.ItemVO.total <= 3)
			tp_draw.getSingleton().drawImage("img/menu/"+_data.ItemVO.index+"de"+_data.ItemVO.total+".png", ctx, 0, 72, null, null, null,"destination-over"); //tmp el w y h		

		//  imagen
		tp_draw.getSingleton().drawImage(_data.ItemVO.images.url6X6, ctx, 5, 5, null, null, null,"destination-over"); //tmp el w y h 	
			
		if(_data.ItemVO.haveVodBookmark){
			tp_draw.getSingleton().drawImage("img/menu/playVOD.png", ctx, 165, 74);
			if(_data.ItemVO.subtitle){
				var custoBookmaark = {"fill": "rgba(130, 60, 150, .8)"};
				Canvas.drawShape(ctx, "rect", [5,175,ctx.viewportWidth-10,20], custoBookmaark); // line progress	
				Canvas.drawText(ctx, "Seguir viendo", new Rect(64, 121, 250, 30), custo_f); 
				Canvas.drawText(ctx, _data.ItemVO.subtitle, new Rect(64, 167, 250, 30), custo_f); 
			}
		}
		
		if(_data.ItemVO.haveCtvBookmark){
			tp_draw.getSingleton().drawImage("img/menu/playAT.png", ctx, 165, 74);
			if(_data.ItemVO.subtitle){
				var custoBookmaark = {"fill": "rgba(190, 50, 120, .8)"};
				Canvas.drawShape(ctx, "rect", [5,175,ctx.viewportWidth-10,20], custoBookmaark); // line progress	
				Canvas.drawText(ctx, _data.ItemVO.title, new Rect(0, 121, ctx.viewportWidth, 30), custo_f); 
				Canvas.drawText(ctx, _data.ItemVO.subtitle, new Rect(0, 167, ctx.viewportWidth, 30), custo_f);
			}
		}
			
/*		var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocusR);
			custo = JSON.parse(custo);
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10], custo); //FONDO					
*/
		ctx.drawObject(ctx.endObject());
	}	
}

menu.drawFocusStroke = function drawFocusStroke(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();

	var custoFocus = { "fill"  : null, "stroke": "rgba(240, 240, 250, 1)","stroke_width": 5, "rx": 5,"stroke_pos" : "inside"};
	var strokeF = { "fill"  : null, "stroke": "rgba(0,0,0,1)", "stroke_width": 1, "rx": 0, "stroke_pos" : "inside"};

	Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], strokeF);		
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
	ctx.drawObject(ctx.endObject());
}


menu.drawArrowSubMenus = function drawArrowSubMenus(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     
	
	var custoW = {"fill": "rgba(220, 220, 230, 1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [10,0,1,ctx.viewportHeight], custoW);
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [17,0,1,ctx.viewportHeight], custoW);	
		
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 36);

    ctx.drawObject(ctx.endObject());
}


menu.drawLineSubMenus = function drawLineSubMenus(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	
	var custoLine = {"fill": "rgba(220, 220, 230, 1)"};	
	if(_data.banner){
	}else{
		Canvas.drawShape(ctx, "rect", [10,0,1,ctx.viewportHeight], custoLine);
	}

	switch(_data.position){
		case 0:
		break;
		case 1:
			Canvas.drawShape(ctx, "rect", [209,0,1,ctx.viewportHeight], custoLine); // 1
		break;
		case 2:
			Canvas.drawShape(ctx, "rect", [401,0,1,ctx.viewportHeight], custoLine); // 2
		break;
		case 3:
			Canvas.drawShape(ctx, "rect", [593,0,1,ctx.viewportHeight], custoLine); // 3
		break;
		case 4:
			Canvas.drawShape(ctx, "rect", [785,0,1,ctx.viewportHeight], custoLine); // 4
		break;	
		case 5:
			Canvas.drawShape(ctx, "rect", [977,0,1,ctx.viewportHeight], custoLine); // 5
		break;		
		case 6:
			Canvas.drawShape(ctx, "rect", [1169,0,1,ctx.viewportHeight], custoLine); // 6		
		break;
	}
	
	ctx.drawObject(ctx.endObject());	
}


menu.drawBackX = function drawBackX(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	tp_draw.getSingleton().drawImage("img/DevsOnion.png", ctx, 0, 0); //tmp el w y h	
	ctx.drawObject(ctx.endObject());	
}

