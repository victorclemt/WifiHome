// vodDetail.js
function vodDetailB(_json, _options){
   	this.super(_json, _options);
   	this.indexQualify = 0;
   	this.activeFocus = "";
}
vodDetailB.inherits(FormWidget);

vodDetailB.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.home.objectChild = this;
	this.vodParent = _data.vodParent;
	this.vodPlayer = _data.vodPlayer;
	this.parameters = _data.parameters;
	
 	if(this.parameters){
		getServices.getSingleton().call("VOD_GET_INFO", ["vodId="+this.parameters.vodId],  this.responseGetInfo.bind(this));		
	}else{
		this.showVodInfo(_data.VodMovieVO);
	}
}

vodDetailB.prototype.responseGetInfo = function responseGetInfo(responseCode){
	if(responseCode.status == 200){
		this.showVodInfo(responseCode.data.ResponseVO.vod.VodMovieVO);
	}else{
		this.home.openSection("miniError", {"home": this.home,"code":response.status}, false, null, true);
	}
}

vodDetailB.prototype.responseSendQualify = function responseSendQualify(response){
	if(response.status == 200){
		this.indexQualify = 0;
	}
}
vodDetailB.prototype.responseSendWishlist = function responseSendWishlist(response){
	if(response.status == 200){
		var buttons_bottom = this.widgets.buttons_bottom;
		for(var x = 0; x < buttons_bottom.list.length; x++){
			if(buttons_bottom.list[x].action == "WISLIST"){
				if(buttons_bottom.list[x].label == "Agregar a mi lista"){
			 		buttons_bottom.list[x].label = "Quitar de mi lista";
			 		this.widgets.fullInfo.data.isInWishlist = true;
				 }else{
				 	buttons_bottom.list[x].label = "Agregar a mi lista";
				 	this.widgets.fullInfo.data.isInWishlist = false;
				 }
				 	buttons_bottom.redraw();
			}
		}	
	}
}
vodDetailB.prototype.responseGetRecommandations = function responseGetRecommandations(response){
	var widgets = this.widgets;
	if(response.status == 200){
		var recommendationVod = response.data.ResponseVO.vodArray;
			widgets.recommendations.setData(recommendationVod);	
			
			if(recommendationVod.length > 5)
				widgets.rightArrowRecommendations.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
			
			var i = recommendationVod.length > 5 ? 5 : recommendationVod.length;

			var state = "enter_"+i+"";
			widgets.leftArrowRecommendations.setData({"url": "" ,"line":true, "position": "left"});
			widgets.leftArrowRecommendations.stateChange("enter");
			widgets.rightArrowRecommendations.stateChange(state);
	}
}
vodDetailB.prototype.openNextSection = function openNextSection(_status,_nip){
	if(_status){
		var price = this.widgets.buttons_bottom.selectItem.price,
			quality = this.widgets.buttons_bottom.selectItem.quality,
			vodId = this.widgets.fullInfo.data.vodId;
		
		var nip = _nip ? _nip : -1;
		var params = ["vodId="+vodId+"&quality="+quality+"&passwd="+nip];
			getServices.getSingleton().call("VOD_RENT_MOVIE", params, this.responseExecuteBuyVod.bind(this));
	}

}
vodDetailB.prototype.responseExecuteBuyVod = function responseExecuteBuyVod(response){
	if(response.status == 200){
		if(response.data.ResponseVO.status == 0){
			tpng.menu.data = [];
 			tpng.menu.tsMenu = "";
 			tpng.menu.lastMenuIndex = 0;
			this.home.openSection("vodPlayer", {"name": "vodPlayer", "home":this.home,"vodId":this.widgets.fullInfo.data.vodId, "isEncrypted":this.widgets.fullInfo.data.isEncrypted,"miniPlayer":true}, false);
		}else{
			this.home.openSection("genericError", {"home": this.home,"code":response.data.ResponseVO.status,"message":response.data.ResponseVO.message}, false, null, true);
		}
	}else{
		this.home.openSection("miniError", {"home": this.home,"code":response.data.ResponseVO.status}, false, null, true);
	}
}
vodDetailB.prototype.onKeyPress = function onKeyPress(_key){
	
	switch(this.activeFocus){
		/*case "buttons_Top":
			this.onKeyPress_Buttons_Top(_key);
		break;*/
		case "buttons_Bottom":
			this.onKeyPress_Buttons_Bottom(_key);
		break;
		case "recommendations":
			this.onKeyPressRecommendations(_key);
		break;
		/*case "info":
			this.onKeyPressInfo(_key);
		break;*/
		case "qualify":
			this.onKeyPressQualify(_key);
		break;
		case "qualify_T":
			this.onKeyPressQualify_T(_key);
		break;
		case "gallery":
			this.onKeyPressGallery(_key);
		break;
		case "search":
			this.onKeyPressSearch(_key); 
		break;
		case "exitBtn":
			this.onKeyPressExitBtn(_key); 
		break;
	}
	return true;	
}
/*vodDetailB.prototype.onKeyPress_Buttons_Top = function onKeyPress_Buttons_Top(_key){
	var widgets = this.widgets,
		buttons_top = widgets.buttons_top,
		buttons_bottom = widgets.buttons_bottom,
		vodInfo = widgets.fullInfo.data;
	
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			if(this.vodPlayer){
				this.home.closeSection(this);
				this.home.setPlayerStatus("PLAY");
				this.vodParent.widgets.playerLogo.stateChange("enter");
				
			}else{
				this.home.setPlayerStatus("STOP");
				this.home.closeSection(this);
				if(widgets.fullInfo.stateGet() == "exit_off" || widgets.fullInfo.stateGet() == "exit"){
						this.home.setPlayerStatus("STOP");
						this.home.closeSection(this);
				}else{
					if(this.home.widgets.mainBg.stateGet() == "enter"){
						this.home.setPlayerStatus("STOP");
						//this.hideBackground();
						this.home.closeSection(this);
					}else{
						this.buttonMenosInfo();
						clearTimeout(this.timerExit);
						this.timerExit = setTimeout(function(){this.hideMoreInfo();}.bind(this), 10000);
					}
				}
			}
		break;
		case "KEY_RIGHT":
		case "KEY_LEFT":
			_key == "KEY_LEFT" ? buttons_top.scrollPrev() : buttons_top.scrollNext() ;
			if(!this.vodPlayer){
				if(widgets.fullInfo.stateGet() == "exit_off" || widgets.fullInfo.stateGet() == "exit"){
					clearTimeout(this.timerExit);
					this.timerExit = setTimeout(function(){this.hideMoreInfo();}.bind(this), 10000);
				}
			}
		break;
		case "KEY_UP":
			this.activeFocus = "search";
			buttons_top.setFocus(false);
    		this.home.enableSearchHeader();
    		clearTimeout(this.timerExit);
    		this.auxDetail = "detail";
    	break;
    	case "KEY_DOWN":
    		buttons_bottom.setFocus(true);
    		buttons_top.setFocus(false);
    		buttons_bottom.scrollTo(buttons_top.selectIndex);
    		this.activeFocus = "buttons_Bottom";
    	break;
		case "KEY_IRENTER":
			
	}	
	return true;
}*/
vodDetailB.prototype.onKeyPress_Buttons_Bottom = function onKeyPress_Buttons_Bottom(_key){
	var w = this.widgets,
		widgets = this.widgets;
		buttons_bottom = w.buttons_bottom,
		button_back = w.button_back,
		vodInfo = widgets.fullInfo.data;
	switch(_key){	
    	case "KEY_RIGHT":
    		if(buttons_bottom.scrollNext()){
	    		if(buttons_bottom.maxItem > 5 && buttons_bottom.selectIndex >= 5){
						widgets.leftArrowButtons.setData([{"url" : "img/tv/arrowLeftOn.png", "line" : false, "position": "left"}]);
						widgets.leftArrowButtons.refresh();
						button_back.stateChange("exit");
				}
				
				if(buttons_bottom.selectIndex == (buttons_bottom.maxItem-1)){
					widgets.rightArrowButtons.setData([{"url": "" ,"line":true, "position": "right"}]);
					widgets.rightArrowButtons.refresh();
				}	
    		}
    		
			if(!this.vodPlayer){
				if(w.fullInfo.stateGet() == "exit_off" || w.fullInfo.stateGet() == "exit"){
					clearTimeout(this.timerExit);
					this.timerExit = setTimeout(function(){this.hideMoreInfo();}.bind(this), 10000);
				}
			}
    		break;
		case "KEY_LEFT":
		
			if(buttons_bottom.scrollPrev()){
				if(buttons_bottom.maxItem > 5){
					if(buttons_bottom.selectIndex == 0){					
						widgets.leftArrowButtons.setData([{"url":"", "line":true, "position": "left"}]);
						widgets.leftArrowButtons.refresh();
						button_back.stateChange("enter");
					}	
					if(buttons_bottom.selectIndex+1 <= (buttons_bottom.maxItem-5)){
						widgets.rightArrowButtons.setData([{"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"}]);
						widgets.rightArrowButtons.refresh();
					}
				}	
			}else{
				this.activeFocus = "exitBtn";
	    		button_back.setFocus(true);
	    		buttons_bottom.setFocus(false);
	    		
			}
			
			if(!this.vodPlayer){
				if(w.fullInfo.stateGet() == "exit_off" || w.fullInfo.stateGet() == "exit"){
					clearTimeout(this.timerExit);
					this.timerExit = setTimeout(function(){this.hideMoreInfo();}.bind(this), 10000);
				}
			}
		break;
    	case "KEY_UP":
    		this.activeFocus = "search";
			buttons_bottom.setFocus(false);
    		this.home.enableSearchHeader();
    		clearTimeout(this.timerExit);
    		this.auxDetail = "detail";
    	break;
    	case "KEY_DOWN":
	    	if(w.fullInfo.stateGet() == "enter" && w.recommendations.maxItem>0){
	    		buttons_bottom.setFocus(false);
	    		this.activeFocus = "recommendations";
	    		w.recommendations.setFocus(true);
	    		w.recommendations.animation.zIndex(6).start();
	    	}
    	break;
    	case "KEY_IRENTER":
			switch(buttons_bottom.selectItem.action){
				case "BACK":
					if(this.vodPlayer){
						this.home.closeSection(this);
						this.home.setPlayerStatus("PLAY");
						this.vodParent.widgets.playerLogo.stateChange("enter");
						
					}else{
						this.home.setPlayerStatus("STOP");
						this.home.closeSection(this);
						/*if(widgets.fullInfo.stateGet() == "exit_off" || widgets.fullInfo.stateGet() == "exit"){
								this.home.setPlayerStatus("STOP");
								this.home.closeSection(this);
						}else{
							if(this.home.widgets.mainBg.stateGet() == "enter"){
								this.home.setPlayerStatus("STOP");
								//this.hideBackground();
								this.home.closeSection(this);
							}else{
								this.buttonMenosInfo();
								clearTimeout(this.timerExit);
								this.timerExit = setTimeout(function(){this.hideMoreInfo();}.bind(this), 10000);
							}
						}*/
					}
				break;
				case "INFO":
					//this.buttonMasInfo();
				break;
				case "LISTA":
				break;
				case "WISLIST":
					getServices.getSingleton().call("VOD_ADD_WISHLIST", ["vodId="+widgets.moreInfo.data.vodId],  this.responseSendWishlist.bind(this));
				break;
				case "BUY":
					var price = buttons_bottom.selectItem.price,
						quality = buttons_bottom.selectItem.quality,
						nipRoot = null,
						title = '¿Confirmas un pago único de $'+price+' para rentar esta película por un lapso de 24 hrs?',
						txt4 = "Tu renta estará disponible durante 24 horas. Terminando este plazo deberás rentarla para verla de nuevo. La renta estara disponible para cualquier perfil con la clasificación suficiente para verla";
						
					
				if(vodInfo.isUseRootPasswd){
					this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":title, "txt1": "Película: "+vodInfo.name, "txt2": "Idioma:"+getLanguagesBuy(vodInfo.formats,quality), "txt3": "Precio: $"+price,"txt4":txt4}}, false,null,true);					
				}else{
					if(vodInfo.isProRestricted){
						if((parseInt(vodInfo.proBalance) < parseInt(price)) && parseInt(vodInfo.proBalance) != -1){
							title = "Tu saldo es insuficiente. Introduce el nip del administrador para confirmar un pago único de $"+price;
							this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":title, "txt1": "Película: "+vodInfo.name, "txt2": "Idioma:"+getLanguagesBuy(vodInfo.formats,quality), "txt3": "Precio: $"+price,"txt4":txt4}}, false,null,true);					
						}else{
							//comprar
							if(vodInfo.isProUsePasswd){
								this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"nipRoot": "", "title":title, "txt1": "Película: "+vodInfo.name, "txt2": "Idioma:"+getLanguagesBuy(vodInfo.formats,quality), "txt3": "Precio: $"+price,"txt4":txt4}}, false,null,true);	
							}else{
								this.home.openSection("confirm",{"home":this.home, "formP":this, "formData":{"nipRoot": "", "title":title, "txt1": "Película: "+vodInfo.name, "txt2": "Idioma:"+getLanguagesBuy(vodInfo.formats,quality), "txt3": "Precio: $"+price,"txt4":txt4}}, false,null,true);					
							}
						}
					}else{
						if(vodInfo.isProUsePasswd){
							this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"nipRoot": "", "title":title, "txt1": "Película: "+vodInfo.name, "txt2": "Idioma:"+getLanguagesBuy(vodInfo.formats,quality), "txt3": "Precio: $"+price,"txt4":txt4}}, false,null,true);	
						}else{
							this.home.openSection("confirm",{"home":this.home, "formP":this, "formData":{"nipRoot": "", "title":title, "txt1": "Película: "+vodInfo.name, "txt2": "Idioma:"+getLanguagesBuy(vodInfo.formats,quality), "txt3": "Precio: $"+price,"txt4":txt4}}, false,null,true);					
						}
					}
				}
					
				break;
				case "PLAY":
					if(vodInfo.clubAlias != "TRANS"){
						if(vodInfo.isActiveSuscription){
							var params = ["vodId="+vodInfo.vodId+"&quality="+vodInfo.formats[0].VodFormatVO.quality+"&passwd=-1"];
							getServices.getSingleton().call("VOD_RENT_MOVIE", params, this.responseExecuteBuyVod.bind(this));
						}else{
							this.home.openSection("suscription",{"home":this.home, "club":vodInfo.clubAlias, "update": false, "vodInfo": vodInfo}, false,null,false);
						}
					}else{
						this.home.openSection("vodPlayer",{"home":this.home, "vodId":widgets.fullInfo.data.vodId, "isEncrypted":this.widgets.fullInfo.data.isEncrypted}, false);
					}
				break;
				case "TRAILER":
					if(this.home.widgets.mainBg.stateGet() == "enter"){
						this.hideBackground();
						this.home.playVideo(widgets.fullInfo.data.urlTrailer,"HLS",0,"enter");
					
					}
					this.home.hideHeader();
					w.fullInfo.stateChange("exit");
					w.recommendations.stateChange("exit");
					//w.buttons_top.stateChange("exit");
					w.buttons_bottom.stateChange("exit");
					w.button_back.stateChange("exit");
					w.rightArrowButtons.stateChange("exit");
					w.leftArrowButtons.stateChange("exit");
					w.leftArrowRecommendations.stateChange("exit");
					w.rightArrowRecommendations.stateChange("exit");
					w.tooltip_button_back.stateChange("exit");
					w.backGallery.setData("");
					w.backGallery.stateChange("enter");
					this.activeFocus = "gallery";
				break;
				case "QUALIFY":
					if(w.fullInfo.stateGet() == "enter")
						this.stateInfoQualify("exit");
					else
						this.stateMoreInfoQualify("exit");
						
					this.qualify(this.vodPlayer);
				break;
				case "GALLERY":
						if(this.vodPlayer){
							this.home.setPlayerStatus("PAUSE");	
							this.home.widgets.player.stateChange("exit");
							w.fullInfo.data.urlTrailer = false;
							clearTimeout(this.timerExit);
							this.showGallery()
						}else{
							clearTimeout(this.timerExit);
							this.showGallery(this.vodPlayer);
						}
				break;
				case "HELP":
					this.home.openSection("help",{"home":this.home},true, ,false);				
				break;
				
			}
		break;
    	case "KEY_MENU":
		case "KEY_IRBACK":
			if(this.vodPlayer){
				this.home.closeSection(this);
				this.home.setPlayerStatus("PLAY");
				this.vodParent.widgets.playerLogo.stateChange("enter");
				
			}else{
				this.home.setPlayerStatus("STOP");
				this.home.closeSection(this);
				/*if(w.fullInfo.stateGet() == "exit_off" || w.fullInfo.stateGet() == "exit"){
						this.home.setPlayerStatus("STOP");
						this.home.closeSection(this);
				}else{
					if(this.home.widgets.mainBg.stateGet() == "enter"){
						//this.hideBackground();
						this.home.closeSection(this);
					}else{
						this.activeFocus = "buttons_Bottom";
						this.buttonMenosInfo();
						clearTimeout(this.timerExit);
						this.timerExit = setTimeout(function(){this.hideMoreInfo();}.bind(this), 10000);
					}
				}*/
			}
		break;
    }
	return true;
}
/*vodDetailB.prototype.onKeyPressInfo = function onKeyPressInfo(_key){

	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
		case "KEY_UP":
		case "KEY_DOWN":
		case "KEY_LEFT":
		case "KEY_RIGHT":
			this.showMoreInfo();
			clearTimeout(this.timerExit);
			this.timerExit = setTimeout(function(){this.hideMoreInfo();}.bind(this), 10000);
		break;
	}	
	return true;
}*/
vodDetailB.prototype.onKeyPressQualify = function onKeyPressQualify(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			widgets.scrollQualify.stateChange("exit");
			widgets.qualifyBG.stateChange("exit");
			widgets.button.stateChange("exit");	
			this.stateInfoQualify("enter");
		break;
		case "KEY_DOWN":
			widgets.scrollQualify.setFocus(false);
			widgets.button.setFocus(true);
			this.activeFocus = "qualify_T";
    	break;
    	case "KEY_UP":
			this.activeFocus = "search";
			widgets.scrollQualify.setFocus(false);
    		this.home.enableSearchHeader();
    		this.auxDetail = "qualify";
    	break;
		case "KEY_MENU":
		case "KEY_IRENTER":
			if(this.indexQualify  < 5){
				this.indexQualify = this.indexQualify + 1;
				widgets.scrollQualify.selectItem.qualify = this.indexQualify;
				widgets.scrollQualify.redraw(true);
			}else if(this.indexQualify == 5){
				this.indexQualify = 0;
				widgets.scrollQualify.selectItem.qualify = this.indexQualify;
				widgets.scrollQualify.redraw(true);
			}
		break;
	}	
	return true;
}
vodDetailB.prototype.onKeyPressQualify_T = function onKeyPressQualify_T(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_UP":
			widgets.scrollQualify.setFocus(true);
			widgets.button.setFocus(false);
			this.activeFocus = "qualify";
    	break;
    	case "KEY_IRBACK":
    	case "KEY_IRMENU":
    		widgets.scrollQualify.stateChange("exit");
			widgets.qualifyBG.stateChange("exit");
			widgets.button.stateChange("exit");
			this.stateInfoQualify("enter");
    	break;
		case "KEY_IRENTER":
			widgets.scrollQualify.stateChange("exit");
			widgets.qualifyBG.stateChange("exit");
			widgets.button.stateChange("exit");
			this.stateInfoQualify("enter");
			getServices.getSingleton().call("VOD_SEND_QUALIFY", ["vodId="+widgets.fullInfo.data.vodId+"&qualify="+this.indexQualify],  this.responseSendQualify.bind(this));	
		break;
	}	
	return true;
}
vodDetailB.prototype.onKeyPressGallery = function onKeyPressGallery(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
		case "KEY_IRENTER":
			if(this.vodPlayer){
				this.home.setPlayerStatus("PLAY");	
				this.home.widgets.player.stateChange("enter");		
			}
			widgets.backGallery.stateChange("exit");
			this.showFullInfo();
			clearTimeout(this.timerExit);
		break;
	}	
	return true;
}
vodDetailB.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	var widgets = this.widgets;
	switch(_key){			
    	case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			if(this.auxDetail == "detail"){
				this.activeFocus = "buttons_Bottom";
				widgets.buttons_bottom.setFocus(true);
				this.home.disableSearchHeader();
			}else if(this.auxDetail == "qualify"){
				this.activeFocus = "qualify";
				widgets.scrollQualify.setFocus(true);
				this.home.disableSearchHeader();
			
			}
    	break;
	   default:
	   		this.home.onKeyPress(_key);			
		break;
    }
	return true;
}

vodDetailB.prototype.onKeyPressExitBtn = function onKeyPressExitBtn(_key){
	var w = this.widgets;
	switch(_key){
		case "KEY_UP":
		this.activeFocus = "search";
			w.button_back.setFocus(false);
    		this.home.enableSearchHeader();
    		clearTimeout(this.timerExit);
    		this.auxDetail = "detail";
    		break;
    	case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
			if(this.vodPlayer){
				this.home.closeSection(this);
				this.home.setPlayerStatus("PLAY");
				this.vodParent.widgets.playerLogo.stateChange("enter");
				
			}else{
				this.home.setPlayerStatus("STOP");
				this.home.closeSection(this);
				/*if(w.fullInfo.stateGet() == "exit_off" || w.fullInfo.stateGet() == "exit"){
						this.home.setPlayerStatus("STOP");
						this.home.closeSection(this);
				}else{
					if(this.home.widgets.mainBg.stateGet() == "enter"){
						//this.hideBackground();
						this.home.closeSection(this);
					}else{
						this.activeFocus = "buttons_Bottom";
						this.buttonMenosInfo();
						clearTimeout(this.timerExit);
						this.timerExit = setTimeout(function(){this.hideMoreInfo();}.bind(this), 10000);
					}
				}*/
			}
			
    	break;
		case "KEY_DOWN":
			if(w.fullInfo.stateGet() == "enter" && w.recommendations.maxItem>0){
	    		w.button_back.setFocus(false);
	    		this.activeFocus = "recommendations";
	    		w.recommendations.setFocus(true);
	    	}
			break;
	   	case "KEY_RIGHT":
	   		this.activeFocus = "buttons_Bottom";
    		this.widgets.button_back.setFocus(false);
    		this.widgets.buttons_bottom.setFocus(true);
		break;
    }
	return true;
}


vodDetailB.prototype.onKeyPressRecommendations = function onKeyPressRecommendations(_key){
	var widgets = this.widgets;
	switch(_key){		
		case "KEY_IRBACK":
		case "KEY_MENU":
			if(this.vodPlayer){
					this.home.closeSection(this);
					this.vodParent.widgets.playerLogo.stateChange("enter");
				}else{
					this.home.setPlayerStatus("STOP");
					this.home.closeSection(this);
					/*if(widgets.fullInfo.stateGet() == "exit_off" || widgets.fullInfo.stateGet() == "exit"){
							this.home.setPlayerStatus("STOP");
							this.home.closeSection(this);
					}else{
						if(this.home.widgets.mainBg.stateGet() == "enter"){
							//this.hideBackground();
							this.home.closeSection(this);
						}else{
							this.buttonMenosInfo();
							clearTimeout(this.timerExit);
							this.timerExit = setTimeout(function(){this.hideMoreInfo();}.bind(this), 10000);
						}
					}*/
				}
	    break;
	    case "KEY_LEFT":
	   		if(widgets.recommendations.scrollPrev()){
		   		if(widgets.recommendations.maxItem > 5 && widgets.recommendations.selectIndex == 0){			
						widgets.leftArrowRecommendations.setData({"url":"", "line":true, "position": "left"});
						widgets.leftArrowRecommendations.refresh();
				}	
				if(widgets.recommendations.selectIndex+1 <= (widgets.recommendations.maxItem-5)){
					widgets.rightArrowRecommendations.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
					widgets.rightArrowRecommendations.refresh();
				}
				
	   		}else{
	   			this.activeFocus = "exitBtn";
	    		widgets.button_back.setFocus(true);
	    		widgets.recommendations.setFocus(false);
	   		}
	    break;
		case "KEY_RIGHT":			
				widgets.recommendations.scrollNext();
				
				if(widgets.recommendations.maxItem > 5 && widgets.recommendations.selectIndex >= 5){
					widgets.leftArrowRecommendations.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					widgets.leftArrowRecommendations.refresh();
				}
			
				if(widgets.recommendations.selectIndex == (widgets.recommendations.maxItem-1)){
					widgets.rightArrowRecommendations.setData({"url": "" ,"line":true, "position": "right"});
					widgets.rightArrowRecommendations.refresh();
				}	
    	break;
    	case "KEY_IRENTER":
    		this.home.setPlayerStatus("PAUSE");
			if(this.vodPlayer){
				this.vodParent.sendBookmark();
				this.home.closeSection(this);
			}
	    	var section = widgets.recommendations.selectItem.ItemVO.link;
	    		section.parameters.isRecom = true;
	    	this.home.openLink(section);
	    	//this.home.openSection(section.ref,{"home":this.home, "parameters": section.parameters}, false);
    	break;
    	
    	case "KEY_UP":
    		this.activeFocus = "buttons_Bottom";
    		widgets.recommendations.setFocus(false);
    		widgets.buttons_bottom.setFocus(true);
    		widgets.buttons_bottom.animation.zIndex(6).start();
    		widgets.recommendations.animation.zIndex(5).start();
    	break;  
	}	
	return true;
}

vodDetailB.prototype.showVodInfo = function showVodInfo(_data){

	var VodMovieVO = this.VodMovieVO = _data,
		widgets =  this.widgets,
		w = this.widgets,
		buttons_data = null,
		url = VodMovieVO.images.url18X18;
		
	widgets.button_back.setData([{"id":"0","text": "REGRESAR"}]);
	
	if(VodMovieVO.urlTrailer && !this.vodPlayer){
		this.home.playVideo(VodMovieVO.urlTrailer,"HLS",0,"enter");
	}else{
		this.setBackground(url,this.vodPlayer);
	}
	
	buttons_data = this.getButtons(VodMovieVO,true);	
	var audios = getLanguages(VodMovieVO.formats);
	
	var videoData = "I "+getQualities(VodMovieVO.formats)+" I "+VodMovieVO.year+" I "+VodMovieVO.duration+" min I"+audios;
		VodMovieVO.videoData = videoData;
		
		
		widgets.moreInfo.setData(VodMovieVO);
		widgets.fullInfo.setData(VodMovieVO);
		//widgets.buttons_top.setData(buttons_data.top,);
		widgets.buttons_bottom.setData(buttons_data.bottom,0);
		
		widgets.progressBar.setData({"time":"00:00","duration":"","position":""});	

		if(buttons_data.bottom.length > 5){
			widgets.rightArrowButtons.setData([{"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"}]);
		}else if(buttons_data.bottom.length <= 5){
			widgets.rightArrowButtons.setData([{"url": "" ,"line":true, "position": "right"}]);
		}
		
		var i = buttons_data.bottom.length > 5 ? 5 : buttons_data.bottom.length;
		var state = "enter_"+i+"";
		widgets.leftArrowButtons.setData([{"url": "", "line" : true, "position": "left"}]);
		widgets.leftArrowButtons.stateChange("enter");
		widgets.rightArrowButtons.stateChange(state);
		
	
	this.client.lock();	
		
		this.home.showHeader({"stroke":"rgba(130, 60, 150, 1)"});
		widgets.fullInfo.stateChange("enter");
		//widgets.buttons_top.stateChange("enter");	
		widgets.buttons_bottom.stateChange("enter");
		widgets.button_back.stateChange("enter");
		widgets.recommendations.stateChange("enter");
		
		widgets.button_back.animation.move(0,-108,200).start();
		//widgets.buttons_top.animation.move(0,-108,200).start();
		widgets.buttons_bottom.animation.move(0,-108,200).start();
		widgets.leftArrowButtons.animation.move(0,-108,200).start();
		widgets.rightArrowButtons.animation.move(0,-108,200).start();
		widgets.tooltip_button_back.animation.move(0,-108,200).start();
		
			
	
		this.activeFocus = "buttons_Bottom";
		
		/*if(VodMovieVO.urlTrailer && !this.vodPlayer){
			this.home.showHeader();
			if(this.parameters.isRecom){
				widgets.fullInfo.stateChange("enter");
				widgets.buttons_top.stateChange("enter");	
				widgets.buttons_bottom.stateChange("enter");
				widgets.button_back.stateChange("enter");
				widgets.recommendations.stateChange("enter")
				
				widgets.button_back.animation.move(0,-108,200).start();
				widgets.buttons_top.animation.move(0,-108,200).start();
				widgets.buttons_bottom.animation.move(0,-108,200).start();
				widgets.leftArrowButtons.animation.move(0,-108,200).start();
				widgets.rightArrowButtons.animation.move(0,-108,200).start();
				widgets.tooltip_button_back.animation.move(0,-108,200).start();
					
				//widgets.tooltip_button_back.animation.move(0,-108,200).start();
			}else{
				widgets.progressBar.stateChange("enter");
				widgets.moreInfo.stateChange("enter");
				widgets.buttons_top.stateChange("enter");	
				widgets.buttons_top.scrollNext();		
				widgets.buttons_bottom.stateChange("enter");
				widgets.button_back.stateChange("enter");
				
				
				clearTimeout(this.timerProgressBar);
				this.timerProgressBar = setTimeout(function(){this.showTime()}.bind(this), 1000);
				
				clearTimeout(this.timerExit);
				this.timerExit = setTimeout(function(){this.hideMoreInfo()}.bind(this), 10000);
			}
		}else{
			//this.home.showHeader({"section":"vodDetailB","fill":"rgba(30,30,40,.7)"});
			this.home.showHeader();
			widgets.fullInfo.stateChange("enter");
			widgets.buttons_top.stateChange("enter");	
			widgets.buttons_bottom.stateChange("enter");
			widgets.button_back.stateChange("enter");
			
			
			widgets.recommendations.stateChange("enter");
			widgets.button_back.animation.move(0,-108,200).start();
			widgets.buttons_top.animation.move(0,-108,200).start();
			widgets.buttons_bottom.animation.move(0,-108,200).start();
			widgets.leftArrowButtons.animation.move(0,-108,200).start();
			widgets.rightArrowButtons.animation.move(0,-108,200).start();
			widgets.tooltip_button_back.animation.move(0,-108,200).start();
			
		}*/
		
	this.client.unlock();
	
	
	var params = ["values=0,0,0,10,0","vodId="+VodMovieVO.vodId];
	getServices.getSingleton().call("RECOMMENDATION_GET_ID_VOD", params, this.responseGetRecommandations.bind(this));
	
}
vodDetailB.prototype.showFullInfo =  function showFullInfo(){
	var w = this.widgets;

		this.home.showHeader();
		
		
		var buttons_data = this.getButtons(w.fullInfo.data,false);
		//w.buttons_top.setData(buttons_data.top,0);
		
		//w.buttons_bottom.setData(buttons_data.bottom,0);
		
		
	
		if(buttons_data.bottom.length > 5){
			w.rightArrowButtons.setData([{"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"}]);
		}else if(buttons_data.bottom.length <= 5){
			w.rightArrowButtons.setData([{"url": "" ,"line":true, "position": "right"}]);
		}
		
		var i = buttons_data.bottom.length > 5 ? 5 : buttons_data.bottom.length;
		var state = "enter_"+i+"";
		
		w.leftArrowButtons.setData([{"url": "" ,"line":true, "position": "left"}]);
		w.leftArrowButtons.stateChange("enter");
		w.rightArrowButtons.stateChange(state);
		
		if(w.recommendations.list.length > 5)
			w.rightArrowRecommendations.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
			
		var x = w.recommendations.list.length > 5 ? 5 : w.recommendations.list.length;
		var state = "enter_"+x+"";
		
		w.leftArrowRecommendations.setData({"url": "" ,"line":true, "position": "left"});
		w.leftArrowRecommendations.stateChange("enter");
		w.rightArrowRecommendations.stateChange(state);
		
		
		w.button_back.animation.move(0,-108,200).start();
		//w.buttons_top.animation.move(0,-108,200).start();
		w.buttons_bottom.animation.move(0,-108,200).start();
		w.tooltip_button_back.animation.move(0,-108,200).start();
		w.leftArrowButtons.animation.move(0,-108,200).start();
		w.rightArrowButtons.animation.move(0,-108,200).start();
		w.button_back.stateChange("enter");
	
		
		w.fullInfo.stateChange("enter");
		//w.buttons_top.stateChange("enter");	
		w.buttons_bottom.stateChange("enter");
		//w.recommendations.setFocus(false);
		w.recommendations.stateChange("enter");
		this.activeFocus = "buttons_Bottom";

}
/*vodDetailB.prototype.showMoreInfo =  function showMoreInfo(){
	var w = this.widgets;
	this.client.lock();
	w.progressBar.stateChange("enter");
	
	this.activeFocus = "buttons_Bottom";
	
	w.moreInfo.stateChange("enter");
	//w.buttons_top.stateChange("enter");
	w.buttons_bottom.stateChange("enter");
	w.button_back.stateChange("enter");
	w.leftArrowButtons.stateChange("enter");	
	
	if(w.buttons_bottom.list.length > 5){
		if(w.buttons_bottom.selectIndex == (w.buttons_bottom.maxItem-1)){
			w.rightArrowButtons.setData([{"url": "" ,"line":true, "position": "right"}]);
		}else{
			w.rightArrowButtons.setData([{"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"}]);
		}
	}else if(w.buttons_bottom.list.length <= 5){
		w.rightArrowButtons.setData([{"url": "" ,"line":true, "position": "right"}]);
	}
		
	var i = w.buttons_bottom.list.length ? 5 : w.buttons_bottom.list.length;
	var state = "enter_"+i+"";	
	w.rightArrowButtons.stateChange(state);	
	
	this.home.showHeader();
	w.buttons_bottom.setFocus(true);
	
	this.client.unlock();
}*/
vodDetailB.prototype.showTime = function showTime(){
	var duration = this.home.widgets.player.propertyGet("duration"),
		seg = parseInt(duration/1000);	

	this.widgets.progressBar.setData({"seg":seg,"time":"-"+getTimeFormat((duration - this.home.playerGetProperty("POSITION"))),"position":this.home.playerGetProperty("POSITION")});
	this.widgets.progressBar.refresh();
	
	clearTimeout(this.timerProgressBar);
	this.timerProgressBar = setTimeout(function(){this.showTime()}.bind(this), 1000);
}
vodDetailB.prototype.showGallery = function showGallery(_status){
	var w = this.widgets;
	
	this.home.hideHeader();
		
		if(w.fullInfo.data.urlTrailer || _status){
			
			if(_status){
				this.home.setPlayerStatus("PAUSE");
			}else{
				this.home.setPlayerStatus("STOP");
			}
			this.home.setPlayerStatus("STOP");
			this.setBackground(w.fullInfo.data.images.url18X18);
			w.progressBar.stateChange("exit");
			w.moreInfo.stateChange("exit");
		}
		
		w.fullInfo.stateChange("exit");
		w.recommendations.stateChange("exit");
		//w.buttons_top.stateChange("exit");
		w.buttons_bottom.stateChange("exit");
		//w.buttons_top.stateChange("exit");
		w.buttons_bottom.stateChange("exit");
		w.button_back.stateChange("exit");
		w.rightArrowButtons.stateChange("exit");
		w.leftArrowButtons.stateChange("exit");
		w.leftArrowRecommendations.stateChange("exit");
		w.rightArrowRecommendations.stateChange("exit");
		w.tooltip_button_back.stateChange("exit");
		w.backGallery.setData("");
		w.backGallery.stateChange("enter");
		this.activeFocus = "gallery";
	
}
vodDetailB.prototype.onStreamEvent = function onStreamEvent(event) {
	var widgets = this.widgets;
	if(event.type == "end" || event.type == "endOfFile"){
			this.home.setPlayerStatus("STOP");
			clearTimeout(this.timerProgressBar);
			
			if(widgets.fullInfo.stateGet() == "enter"){
				this.setBackground(widgets.fullInfo.data.images.url18X18);
		
			}else{
				this.setBackground(widgets.fullInfo.data.images.url18X18);
				this.showFullInfo();
				widgets.backGallery.stateChange("exit");
			}
			/*else if(widgets.moreInfo.stateGet() == "enter"){
				this.setBackground(widgets.fullInfo.data.images.url18X18);
				this.buttonMasInfo();
			}else if(widgets.scrollQualify.stateGet() == "enter"){
				this.setBackground(widgets.fullInfo.data.images.url18X18);
			}
			else{
				this.setBackground(widgets.fullInfo.data.images.url18X18);
				this.showFullInfo();
			}*/
	}
}
/*vodDetailB.prototype.hideMoreInfo = function hideMoreInfo(){
	var w = this.widgets;
	this.client.lock();
	w.progressBar.stateChange("exit");
	w.button_back.setFocus(false);
	//w.buttons_top.stateChange("exit");
	w.buttons_bottom.stateChange("exit");
	w.button_back.stateChange("exit");
	w.rightArrowButtons.stateChange("exit");
	w.leftArrowButtons.stateChange("exit");
	w.leftArrowRecommendations.stateChange("exit");
	w.rightArrowRecommendations.stateChange("exit");
	w.tooltip_button_back.stateChange("exit");
	w.moreInfo.stateChange("exit");
	this.activeFocus = "info"
	this.home.hideHeader();
	this.client.unlock();

}*/
/*vodDetailB.prototype.buttonMasInfo = function buttonMasInfo(){
	var widgets = this.widgets;	
	var w = this.widgets;
	this.client.lock();		
	var buttons_data = this.getButtons(w.fullInfo.data,false);
	//w.buttons_top.setData(buttons_data.top,0);
	

		if(buttons_data.bottom.length > 5){
			w.rightArrowButtons.setData([{"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"}]);
		}else if(buttons_data.bottom.length <= 5){
			w.rightArrowButtons.setData([{"url": "" ,"line":true, "position": "right"}]);
		}else{
			
		}
		
		var i = 0;
		if(buttons_data.bottom.length > 5){
			i = 5;
		}else{
			i = buttons_data.bottom.length;
		}
		var state = "enter_"+i+"";
		w.leftArrowButtons.setData([{"url": "" ,"line":true, "position": "left"}]);
		w.leftArrowButtons.stateChange("enter");
		w.rightArrowButtons.stateChange(state);
		
	
	
	
	w.buttons_bottom.setData(buttons_data.bottom,0);
	w.button_back.animation.move(0,-108,200).start();
	//w.buttons_top.animation.move(0,-108,200).start();
	w.buttons_bottom.animation.move(0,-108,200).start();
	w.tooltip_button_back.animation.move(0,-108,200).start();
	w.leftArrowButtons.animation.move(0,-108,200).start();
	w.rightArrowButtons.animation.move(0,-108,200).start();
	//w.buttons_bottom.setFocus(false,0);
	w.progressBar.stateChange("exit");
	w.moreInfo.stateChange("exit_off");
	w.fullInfo.stateChange("enter");
	
	//w.buttons_top.stateChange("enter");
	w.buttons_bottom.stateChange("enter")
	w.button_back.stateChange("enter");
	//w.rightArrowButtons.stateChange("enter");
	//w.leftArrowButtons.stateChange("enter");
	w.recommendations.setFocus(false);
	w.recommendations.stateChange("enter");
	clearTimeout(this.timerExit);
	
	
	this.client.unlock();
}*/
/*vodDetailB.prototype.buttonMenosInfo = function buttonMenosInfo(){
	var w = this.widgets;
	var widgets = this.widgets;
	this.client.lock();		
	var buttons_data = this.getButtons(w.fullInfo.data,true);
	w.buttons_top.setData(buttons_data.top,0);

		if(buttons_data.bottom.length > 5){
			w.rightArrowButtons.setData([{"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"}]);
		}else if(buttons_data.bottom.length <= 5){
			w.rightArrowButtons.setData([{"url": "" ,"line":true, "position": "right"}]);
		}else{
			
		}
		
		var i = 0;
		if(buttons_data.bottom.length > 5){
			i = 5;
		}else{
			i = buttons_data.bottom.length;
		}
		var state = "enter_"+i+"";
		w.leftArrowButtons.setData([{"url": "" ,"line":true, "position": "left"}]);
		w.leftArrowButtons.stateChange("enter");
		w.rightArrowButtons.stateChange(state);

	
	w.buttons_bottom.setData(buttons_data.bottom,0);
	w.button_back.animation.move(0,0,200).start();
	w.buttons_top.animation.move(0,0,200).start();
	w.buttons_bottom.animation.move(0,0,200).start();
	w.leftArrowButtons.animation.move(0,0,200).start();
	w.rightArrowButtons.animation.move(0,0,200).start();
	w.button_back.setFocus(false);
	w.tooltip_button_back.animation.move(0,0,200).start();
	//w.buttons_bottom.setFocus(false,0);
	
	w.recommendations.stateChange("exit");
	w.fullInfo.stateChange("exit_off");
	w.moreInfo.stateChange("enter");
	w.progressBar.stateChange("enter");
	w.buttons_top.stateChange("enter");
	w.buttons_bottom.stateChange("enter");
	w.button_back.stateChange("enter");
	
	this.client.unlock();	
}*/

vodDetailB.prototype.stateInfoQualify =  function stateInfoQualify(_state){
	var widgets = this.widgets;
	var buttons_data = this.getButtons(widgets.fullInfo.data,false);

	/*if(widgets.moreInfo.stateGet() == "exit"){
		widgets.button_back.animation.move(0,-108,200).start();
		widgets.buttons_top.animation.move(0,-108,200).start();
		widgets.buttons_bottom.animation.move(0,-108,200).start();
		widgets.leftArrowButtons.animation.move(0,-108,200).start();
		widgets.rightArrowButtons.animation.move(0,-108,200).start();
		widgets.tooltip_button_back.animation.move(0,-108,200).start();
	}*/
	
	widgets.fullInfo.stateChange(_state);
	widgets.buttons_top.stateChange(_state);	
	widgets.buttons_bottom.stateChange(_state);
	widgets.recommendations.stateChange(_state);
	widgets.button_back.stateChange(_state);
	

	if(buttons_data.bottom.length > 5){
		widgets.rightArrowButtons.setData([{"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"}]);
	}else if(buttons_data.bottom.length < 5){
		widgets.rightArrowButtons.setData([{"url": "" ,"line":true, "position": "right"}]);
	}else{
		
	}
	
	var i = buttons_data.bottom.length > 5 ? 5 : buttons_data.bottom.length;
	var state = "enter_"+i+"";
	widgets.leftArrowButtons.setData([{"url": "" ,"line":true, "position": "left"}]);
	widgets.leftArrowButtons.stateChange("enter");
	widgets.rightArrowButtons.stateChange(state);

	if(widgets.recommendations.list.length > 5){
		widgets.rightArrowRecommendations.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
	}

	var i = widgets.recommendations.list.length > 5 ? 5 : widgets.recommendations.list.length;

	var state = "enter_"+i+"";
	widgets.leftArrowRecommendations.setData({"url": "" ,"line":true, "position": "left"});
	widgets.leftArrowRecommendations.stateChange("enter");
	widgets.rightArrowRecommendations.stateChange(state);
		
	this.activeFocus = _state == "exit" ? "qualify" : "buttons_Bottom";

	clearTimeout(this.timerExit);
}
/*vodDetailB.prototype.stateMoreInfoQualify =  function stateMoreInfoQualify(_state){
	var widgets = this.widgets;
	widgets.progressBar.stateChange(_state);
	widgets.moreInfo.stateChange(_state);
	widgets.buttons_top.stateChange(_state);	
	widgets.buttons_bottom.stateChange(_state);
	widgets.button_back.stateChange(_state);
	widgets.rightArrowButtons.stateChange(_state);
	widgets.leftArrowButtons.stateChange(_state);
	widgets.leftArrowRecommendations.stateChange(_state);
	widgets.rightArrowRecommendations.stateChange(_state);
	this.activeFocus = "qualify";
	clearTimeout(this.timerExit);
	this.timerExit = setTimeout(function(){this.hideMoreInfo();}.bind(this), 10000);
}*/
vodDetailB.prototype.setBackground = function setBackground(_url,_layer){
	this.home.widgets.mainBg.setData({"url":_url,"layer":_layer});
	this.home.widgets.mainBg.stateChange("enter");
}
vodDetailB.prototype.hideBackground = function hideBackground(_url){
	this.home.widgets.mainBg.stateChange("exit");
}

vodDetailB.prototype.qualify = function qualify(_player){
	var widgets = this.widgets,
		_data = [{"qualify":this.indexQualify,"img":widgets.fullInfo.data.images.url6X6}],
		button = [];
		button.push({"label":"Terminar", "action":"TERMINAR"});
	
	widgets.leftArrowButtons.stateChange("exit");
	widgets.rightArrowButtons.stateChange("exit");
	widgets.leftArrowRecommendations.stateChange("exit");
	widgets.rightArrowRecommendations.stateChange("exit");
	widgets.qualifyBG.setData({"totalVotes":widgets.fullInfo.data.totalVotes});
	widgets.qualifyBG.stateChange("enter");
	widgets.scrollQualify.setData(_data);
	widgets.scrollQualify.stateChange("enter");
	widgets.button.setData(button);
	widgets.button.stateChange("enter");
	clearTimeout(this.timerExit);
		
}
vodDetailB.prototype.getButtons = function getButtons(_data,_section){

		var program_fill = "rgba(110,60,130,1)",
			buttons_top = [],
			buttons_bottom = [],
			img_on = null,
			img_off = null;
			
		//Botón de reproducción
		if(!this.vodPlayer && (_data.isBuy || (_data.isActiveSuscription && _data.clubAlias == "SUSC") || _data.clubAlias == "SUSC")){ //
			//SINO VIENE DEL PLAYER Y ESTÁ COMPRADA O TIENE SUSCRIPCIÓN O LA PELÍCULA ES DE SUSCRIPCIÓN
			buttons_bottom.push({"label":"Reproducir","action":"PLAY","img_on":"img/commons/buttons_on/btn_ReproducirON.png","img_off":"img/commons/buttons_off/btn_ReproducirOFF.png","fill":"0-rgba(110, 60, 130, 1)|1-rgba(70, 10, 100, 1)"});			
		}else{
			if(_data.isActiveSuscription && !this.vodPlayer){
					//COMENTÉ ESTO PQ YA ESTÁ ARRIBA PARA NO MODIFICAR EL CÓDIGO DE ABAJO
					//buttons_bottom.push({"label":"Reproducir","action":"PLAY","img_on":"img/commons/buttons_on/btn_ReproducirON.png","img_off":"img/commons/buttons_off/btn_ReproducirOFF.png","fill":"0-rgba(110, 60, 130, 1)|1-rgba(70, 10, 100, 1)"});
			}else{
				for(var i=0; i<_data.formats.length; i++){
					if(_data.formats[i].VodFormatVO.quality == "HD"){
						img_on = "img/commons/buttons_on/btn_RentarHDON.png";
						img_off = "img/commons/buttons_off/btn_RentarHDOFF.png";
					}
					if(_data.formats[i].VodFormatVO.quality == "SD"){
						img_on = "img/commons/buttons_on/btn_RentarSDON.png";
						img_off = "img/commons/buttons_off/btn_RentarSDOFF.png";
					}
					if(_data.formats[i].VodFormatVO.quality == "3D"){
						img_on = "img/commons/buttons_on/btn_Rentar3DON.png";
						img_off = "img/commons/buttons_off/btn_Rentar3DOFF.png";
					}
						
						var aux=false;
						for(var j=0; j< buttons_bottom.length; j++){
							if (" por $" + _data.formats[i].VodFormatVO.price == buttons_bottom[j].label){
								aux=true;
								break;
							}
						}
						if(!aux){
								if(!this.vodPlayer)
									buttons_bottom.push({"label":" por $" + _data.formats[i].VodFormatVO.price,"img_on":img_on,"img_off":img_off,"fill":"0-rgba(110, 60, 130, 1)|1-rgba(70, 10, 100, 1)","action":"BUY","price":_data.formats[i].VodFormatVO.price,"quality":_data.formats[i].VodFormatVO.quality});
						}
				}
			}
		}
		
		if(_data.isInWishlist)
			buttons_bottom.push({"label":"Quitar de mi lista","action":"WISLIST","img_on": "img/commons/buttons_on/btn_DeseadosON.png","img_off":"img/commons/buttons_off/btn_ListaDeseosOFF.png","fill":"0-rgba(110, 60, 130, 1)|1-rgba(70, 10, 100, 1)"});
		else
			buttons_bottom.push({"label":"Agregar a mi lista","action":"WISLIST","img_on": "img/commons/buttons_on/btn_DeseadosON.png","img_off":"img/commons/buttons_off/btn_ListaDeseosOFF.png","fill":"0-rgba(110, 60, 130, 1)|1-rgba(70, 10, 100, 1)"});
		
		
		if(!this.vodPlayer && _data.urlTrailer){
				buttons_bottom.push({"label":"Trailer","action":"TRAILER","img_on":"img/commons/buttons_on/btn_TrailerON.png","img_off":"img/commons/buttons_off/btn_TrailerOFF.png","fill":"0-rgba(110, 60, 130, 1)|1-rgba(70, 10, 100, 1)"});
		}

		
		//********************************BOTONES BOTTOM********************************
		buttons_bottom.push({"label":"Calificar","action":"QUALIFY","img_on":"img/commons/buttons_on/btn_CalificarON.png","img_off": "img/commons/buttons_off/btn_CalificarOFF.png","fill":"0-rgba(110, 60, 130, 1)|1-rgba(70, 10, 100, 1)"});
		buttons_bottom.push({"label":"Ver fondo","action":"GALLERY","img_on":"img/commons/buttons_on/btn_GaleriaON.png","img_off": "img/commons/buttons_off/btn_GaleriaOFF.png","fill":"0-rgba(110, 60, 130, 1)|1-rgba(70, 10, 100, 1)"});


		return {"top": buttons_top, "bottom": buttons_bottom};

}


vodDetailB.drawMoreInfo = function drawMoreInfo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);

    Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth,ctx.viewportHeight],this.themaData.outLineGeneralPanel);
    custo_f.text_align = "left,middle";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	//name
	Canvas.drawText(ctx, _data.name, new Rect(195, 4, 762, 68), custo_f);
    
    //description
    Canvas.drawText(ctx, _data.description, new Rect(195, 136, 1018, 32), custo_f);

   	//RATING Y CADENA DE INFORMACIÓN: AÑO, CATEGORIA , TEMPORADA Y EPISODIO
   	custo_f.fill = "rgba(170,170,180,1)";
	tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.rating+".png", ctx, 195, 106);
	Canvas.drawText(ctx, _data.videoData, new Rect(252, 94, 832, 32), custo_f);

   	//qualify
   	var img = "img/commons/qualify/"+_data.qualify+"star.png";
  	tp_draw.getSingleton().drawImage(img, ctx, 131, 21);
  	
    ctx.drawObject(ctx.endObject());	
}




vodDetailB.drawFullInfo = function drawFullInfo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
     var custo_f = JSON.stringify(this.themaData.standardFont);
		 custo_f = JSON.parse(custo_f);
	//BG
    Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth,ctx.viewportHeight],{"fill":"rgba(30,30,40,.7)"});
    
    //qualify
    var img = "img/commons/qualify/"+_data.qualify+"star.png";
  	tp_draw.getSingleton().drawImage(img, ctx, 131, 48);
    
   //name
    custo_f.text_align = "left,middle";
	custo_f.font_size = 34 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.name, new Rect(195, 10, 762, 100), custo_f);
	
	custo_f.text_align = "left,middle";
	//description
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.description, new Rect(195, 220, 1018, 88), custo_f);
    
	//RATING Y CADENA DE INFORMACIÓN: AÑO, CATEGORIA , TEMPORADA Y EPISODIO
  
	custo_f.text_align = "left,bottom";
	tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.rating+".png", ctx, 195, 164);
	Canvas.drawText(ctx, _data.videoData, new Rect(252, 153, 634, 32), custo_f);
	
	//autores
	custo_f.fill = "rgba(170,170,180,1)";
	Canvas.drawText(ctx, _data.actors, new Rect(195, 187, 954, 32), custo_f);


	//expiracion
    custo_f.text_align = "right,middle";
    custo_f.fill = "rgba(110,60,130,1)";
    Canvas.drawText(ctx, _data.expiration, new Rect(899, 5, 250, 32), custo_f);
    
    // recomendaciones
	custo_f.text_align = "right,top";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	custo_f.fill = "rgba(240, 240, 250, 1)";
	Canvas.drawText(ctx,"otros también vieron:" , new Rect(35, 495, 150, 50), custo_f);
    
    ctx.drawObject(ctx.endObject());	
}
vodDetailB.drawProgressBar = function drawProgressBar(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    


	var size=704/_data.seg;
	var pos  = _data.position / 1000;
	
    Canvas.drawShape(ctx, "rect", [195,36,704,4],{"fill" : "rgba(240, 240, 250, .3)"});
    Canvas.drawShape(ctx, "rect", [195,36,(size * pos),4],{"fill" : "rgba(110,60,130,1)"});
    Canvas.drawShape(ctx, "rect", [(size * pos)+195,36,1,4],{"fill" : "rgba(240, 240, 250, 1)"});
	
	custo = JSON_Complete({	font_size:20, fill: "rgba(110,60,130,1)",
									font_family: "Oxygen-Regular",
									text_align: "left,middle",
									text_multiline:false});	
										
	Canvas.drawText(ctx, _data.time+" min", new Rect(963, 20, 122, 32), custo);
   	
	ctx.drawObject(ctx.endObject());	
}
vodDetailB.drawLineDetail = function drawLineDetail(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     

	var custoW = {fill: "rgba(220, 220, 230, 1)"};
	//Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], {fill: "rgba(220, 220, 230, .5)"});
	
	if(_data.right){
		tp_draw.getSingleton().drawImage("img/tv/arrowRightOn.png", ctx, 1015,60);
	}
	if(_data.left){
		tp_draw.getSingleton().drawImage("img/tv/arrowLeftOn.png", ctx, 0,60);
	}
	if(_data.line){
		Canvas.drawShape(ctx, "rect", [0,0,1,ctx.viewportHeight], custoW);
	}
	if(_data.lineR){
		Canvas.drawShape(ctx, "rect", [9,0,1,ctx.viewportHeight], custoW);
	}
	
	switch(_data.position){
		case 1:
			Canvas.drawShape(ctx, "rect", [134,0,1,ctx.viewportHeight], custoW);
		break;
		case 2:
			Canvas.drawShape(ctx, "rect", [262,0,1,ctx.viewportHeight], custoW);
		break;
		case 3:
			Canvas.drawShape(ctx, "rect", [390,0,1,ctx.viewportHeight], custoW);
		break;
		case 4:
			Canvas.drawShape(ctx, "rect", [518,0,1,ctx.viewportHeight], custoW);
		break;
		case 5:
			Canvas.drawShape(ctx, "rect", [646,0,1,ctx.viewportHeight], custoW);
		break;
		case 6:
			Canvas.drawShape(ctx, "rect", [774,0,1,ctx.viewportHeight], custoW);
		break;
		case 7:
			Canvas.drawShape(ctx, "rect", [902,0,1,ctx.viewportHeight], custoW);
		break;
		case 8:
			Canvas.drawShape(ctx, "rect", [1024,0,1,ctx.viewportHeight], custoW);
		break;
		case 9:
			Canvas.drawShape(ctx, "rect", [1039,0,1,ctx.viewportHeight], custoW);
		break;
	}
	

    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}
vodDetailB.drawQualifyBG = function drawQualifyBG(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	custo_f.text_align = "center,middle";
	custo_f.font_size = 18 * tpng.thema.text_proportion;									

	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight],{"fill":"rgba(30,30,40,.7)"});	
	tp_draw.getSingleton().drawImage(_data.img, ctx, 451, 148);
	var totalVotes = _data.totalVotes > 1 ? _data.totalVotes+" personas han" :  _data.totalVotes+" persona ha";
	Canvas.drawText(ctx, totalVotes+" calificado éste título.| <!size=30>Califica éste título:<!>", new Rect(451,36,378,72), custo_f); 
	
	ctx.drawObject(ctx.endObject());	
}
vodDetailB.drawScrollQualify = function drawScrollQualify(_data){ 	
	
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
	
	tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0,null, null, null,"destination-over");

	if(focus){
		
		Canvas.drawShape(ctx, "rect", [0,212,ctx.viewportWidth,40],{"fill":"rgba(240,240,250,1)"}); //FONDO
		custo_f.fill = "rgba(170,170,180,1)";
		Canvas.drawText(ctx, "Presiona OK para agregar o quitar estrellas.", new Rect(0,260,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		custo_f.fill = "rgba(30,30,40,1)";
		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,212],custoBackground); //FONDO
	}
	
	var img = "";
	var msj = "";
	
	if(_data.qualify == 0){
		img = "img/vod/qualify/calificar0.png";
		msj = "Sin calificar";
	}else if(_data.qualify == 1){
  		img = "img/vod/qualify/calificar1.png";
  		msj = "Mala";
  	}else if(_data.qualify== 2){
  		img = "img/vod/qualify/calificar2.png";
  		msj = "Regular";
  	}else if(_data.qualify == 3){
  		img = "img/vod/qualify/calificar3.png";
  		msj = "Buena";
  	}else if(_data.qualify == 4){
  		img = "img/vod/qualify/calificar4.png";
  		msj = "Muy buena";
  	}else if(_data.qualify == 5){
		img = "img/vod/qualify/calificar5.png";
		msj = "Excelente";
  	}
	custo_f.text_align = "right,middle";

	Canvas.drawText(ctx, msj, new Rect(0,212,186,40), custo_f);
	tp_draw.getSingleton().drawImage(img, ctx, 192, 215);	
		
		ctx.drawObject(ctx.endObject());	
	}
}

vodDetailB.drawButton = function drawButton(_data){ 	
	
	this.draw = function draw(focus) {	
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
		custo_f = JSON_Complete({	font_size:18* tpng.thema.text_proportion, fill: "rgba(240,240,250,1)",
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
vodDetailB.drawBackGallery = function drawBackGallery(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    
    
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.fill = "rgba(30,30,40,1)";
		custo_f.text_align = "center,middle";
		custo_f.font_size = 18 * tpng.thema.text_proportion;			
		
	tp_draw.getSingleton().drawImage("img/help/4x2-oksalir.png", ctx, 512, 10);
	Canvas.drawText(ctx,"Presiona OK para salir", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
	ctx.drawObject(ctx.endObject());	
}
vodDetailB.prototype.onExit = function onExit(_data){
	var widgets = this.widgets;
	this.client.lock();
		widgets.buttons_top.stateChange("exit");
		widgets.buttons_bottom.stateChange("exit");
		widgets.button_back.stateChange("exit");
		widgets.rightArrowButtons.stateChange("exit");
		widgets.leftArrowButtons.stateChange("exit");
		widgets.leftArrowRecommendations.stateChange("exit");
		widgets.rightArrowRecommendations.stateChange("exit");
		widgets.tooltip_button_back.stateChange("exit");
		widgets.moreInfo.stateChange("exit");
		widgets.fullInfo.stateChange("exit");
		widgets.recommendations.stateChange("exit");
		
		
		widgets.progressBar.stateChange("exit");
	this.client.unlock();
	clearTimeout(this.timerProgressBar);
	clearTimeout(this.timerExit);
	//this.hideMoreInfo();
	this.home.hideHeader();
	this.home.objectChild = null;

	if(!this.vodParent){
		if(tpng.app.currentChannel.type == "C" || tpng.app.currentChannel.type == "I") //Para que nunca me quite el bg en caso de los interactivo
			this.home.hideBackground();
		if(tpng.app.currentChannel.type == "S" || tpng.app.lockedStream){
			this.home.hideBackground();
		}
	}
		clearTimeout(this.timerFocusButtons);
}


vodDetailB.onFocusButtonBack = function onFocusButtonBack(_focus, _data){
   	var widgets = this.widgets;
	if(_focus){
		if(this.actualFocus == "exit"){
        	widgets.buttons_bottom.setFocus(false);
    	}	
    	//widgets.tooltip_button_back.setData([""]);
    	//this.timerToShowButton = widgets.tooltip_button_back.stateChange.delay(500, widgets.tooltip_button_back, "enter");
		this.timerFocusButtons = setTimeout(function (){
	   		widgets.tooltip_button_back.setData([""]);
   			widgets.tooltip_button_back.stateChange("enter");
		}.bind(this), 500);
	}else{
       	unsetTimeAlarm(this.timerFocusButtons);
		widgets.tooltip_button_back.stateChange("exit");
	}	
}

vodDetailB.onFocusButtonBottom = function onFocusButtonBottom(_focus, _data){
   	var widgets = this.widgets;
	if(_focus){
		if(this.activeFocus != "buttons_Bottom" && this.activeFocus != ""){
        	widgets.buttons_bottom.setFocus(false);
	       	unsetTimeAlarm(this.timerFocusButtons);
			widgets.tooltip_button_back.stateChange("exit");
        	
    	}	
	}
}

vodDetailB.onFocusRecommendation = function onFocusRecommendation(_focus, _data){
   	var widgets = this.widgets;
	if(_focus){
		if(this.activeFocus != "recommendations"){
        	widgets.recommendations.setFocus(false);
    	}	
	}
}


vodDetailB.drawTooltip_button_back = function drawTooltip_button_back(_data){ 	
	var ctx = this.getContext("2d");
	this.draw = function draw(focus) {	
	
		ctx.beginObject();
	    ctx.clear();
	    
	    
	    if(focus){
	    	var custo_f = JSON.stringify(this.themaData.standarBlackFont);
			custo_f = JSON.parse(custo_f);		
			custo_f.text_align = "center,middle";
			custo_f.font_size = 15 * tpng.thema.text_proportion;
			//_data.text = "REGRESAR";
			Canvas.drawText(ctx, "REGRESAR", new Rect(0, 11, ctx.viewportWidth, ctx.viewportHeight-14), custo_f);
			tp_draw.getSingleton().drawImage("img/tv/tooltip.png", ctx, _data.x, 0,null,null,null,"destination-over");
	    }else{
	    	var custo_f = JSON.stringify(this.themaData.standarBlackFont);
			custo_f = JSON.parse(custo_f);		
			custo_f.text_align = "center,middle";
			custo_f.font_size = 15 * tpng.thema.text_proportion;
			//_data.text = "REGRESAR";
			Canvas.drawText(ctx, "REGRESAR", new Rect(0, 11, ctx.viewportWidth, ctx.viewportHeight-14), custo_f);
			tp_draw.getSingleton().drawImage("img/tv/tooltip.png", ctx, _data.x, 0,null,null,null,"destination-over");
	    }
		ctx.drawObject(ctx.endObject());
	}
	
}

vodDetailB.drawArrowButtons = function drawArrowButtons(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   		ctx.clear();
   		
   		
   		var custo = {"fill": "rgba(90, 90, 90, 1)"};
		if(_data.line && _data.position == "left"){
			Canvas.drawShape(ctx, "rect", [13,0,1,ctx.viewportHeight], custo);
		}
		if(_data.line && _data.position == "right"){
			Canvas.drawShape(ctx, "rect", [23,0,1,ctx.viewportHeight], custo);	
		}
		tp_draw.getSingleton().drawImage(_data.url, ctx, 3, 37);
   		
   		ctx.drawObject(ctx.endObject());
   	}
}
vodDetailB.drawArrowButtonsRecom = function drawArrowButtonsRecom(_data){
		var ctx = this.getContext("2d");
		ctx.beginObject();
   		ctx.clear();
   		
   		
   		var custo = {"fill": "rgba(90, 90, 90, 1)"};
		if(_data.line && _data.position == "left"){
			Canvas.drawShape(ctx, "rect", [13,0,1,ctx.viewportHeight], custo);
		}
		if(_data.line && _data.position == "right"){
			Canvas.drawShape(ctx, "rect", [23,0,1,ctx.viewportHeight], custo);	
		}
		tp_draw.getSingleton().drawImage(_data.url, ctx, 3, 37);
   		
   		ctx.drawObject(ctx.endObject());
  
}

/*
vodDetailB.drawArrowButtons = function drawArrowButtons(_data){ 	
		var ctx = this.getContext("2d");
	this.draw = function draw(focus) {
	    ctx.beginObject();
	   	ctx.clear();
	    
		if(focus){
		    var custoW = {"fill": "rgba(90, 90, 90, 1)"};
			if(_data.line && _data.position == "left")
				Canvas.drawShape(ctx, "rect", [13,0,1,ctx.viewportHeight], custoW);
			
			if(_data.line && _data.position == "right")
				Canvas.drawShape(ctx, "rect", [23,0,1,ctx.viewportHeight], custoW);	
				
			tp_draw.getSingleton().drawImage(_data.url, ctx, 3, 37);
	    }else{
	    	var custoW = {"fill": "rgba(90, 90, 90, 1)"};
			if(_data.line && _data.position == "left")
				Canvas.drawShape(ctx, "rect", [13,0,1,ctx.viewportHeight], custoW);
			
			if(_data.line && _data.position == "right")
				Canvas.drawShape(ctx, "rect", [23,0,1,ctx.viewportHeight], custoW);	
				
			tp_draw.getSingleton().drawImage(_data.url, ctx, 3, 37);
	    }
	    
	    
		ctx.drawObject(ctx.endObject());
	}
	
}
*/



