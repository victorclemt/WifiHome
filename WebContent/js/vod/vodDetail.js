// vodDetailB.js

function vodDetail(_json, _options){
   	this.super(_json, _options);
   	 this.imdb = new imdb();
}
vodDetail.inherits(FormWidget);

vodDetail.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.home.objectChild = this;
	this.parameters = _data.parameters;	
	//this.parameters.vodId = 30360
 	if(this.parameters){
		getServices.getSingleton().call("VOD_GET_INFO", ["vodId="+this.parameters.vodId],  this.responseGetInfo.bind(this));		
	}else{
		this.showVodInfo(_data.VodMovieVO);
	}
}

vodDetail.prototype.responseGetInfo = function responseGetInfo(responseCode){
	if(responseCode.status == 200){
		this.showVodInfo(responseCode.data.ResponseVO.vod.VodMovieVO);
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}
vodDetail.prototype.showVodInfo = function showVodInfo(_data){

	var widgets =  this.widgets,
		buttons = [],
		buttons_opt = [],
		format = null;
	
	
	this.home.showHeader({"stroke":"rgba(130, 60, 150, 1)"});
	this.home.setBg(_data.images.url18X18,true);	
	widgets.focusPlayer.setData("");
	var label = _data.isInWishlist ? "-QUITAR DE MI LISTA" : "+LISTA DE DESEOS";
		buttons_opt.push({"label":label,"type":"WISHLIST"});



	if(_data.clubAlias != "TRANS"){
		widgets.button_susc.setData([{"label":"VER AHORA","quality":_data.formats[0].VodFormatVO.quality,"audio":getLanguagesBuy(_data.formats,_data.formats[0].VodFormatVO.quality),"type":"PLAY_SUSC"}]);
		widgets.button_susc.stateChange("enter");
		if(_data.isActiveSuscription)
			_data.label = "SUSCRIPCIÓN VIGENTE";
		
		this.activeFocus = "button_susc";
	}else{
		if(_data.isBuy){
			_data.label = "RENTA VIGENTE";	
			widgets.button_susc.setData([{"label":"VER AHORA","quality":_data.formats[0].VodFormatVO.quality,"audio":getLanguagesBuy(_data.formats,_data.formats[0].VodFormatVO.quality),"type":"PLAY_TRANS"}]);
			widgets.button_susc.stateChange("enter");
			this.activeFocus = "button_susc";
		}else{
			for(var i=0; i<_data.formats.length; i++){
						var aux=false;
						for(var j=0; j< buttons.length; j++){
							if ("<!size=40>$<!>" + _data.formats[i].VodFormatVO.price == buttons[j].label){
								aux=true;
								break;
							}
						}
						if(!aux){
							buttons.push({"label":"<!size=40>$<!>" + _data.formats[i].VodFormatVO.price,"type":"BUY","price":_data.formats[i].VodFormatVO.price,"quality":_data.formats[i].VodFormatVO.quality,"audio":getLanguagesBuy(_data.formats,_data.formats[i].VodFormatVO.quality)});
						}
					}
			_data.label = "RÉNTALA AHORA";
			this.activeFocus = "buttons";	
		}
	}
	widgets.detail.setData(_data);
	widgets.detail.stateChange("enter");
	
	
	if(_data.isBuy){
		for(var i=0; i<_data.formats.length; i++){
				if(_data.formats[i].VodFormatVO.url){
					var url = _data.formats[i].VodFormatVO.url;
				}
			}
		var bookmark = _data.bookmark != -1 ? _data.bookmark-60000 : 0;
		
		
		this.home.playVideo(url,"VIDEO",bookmark,"playerDetail");
		
	}else{
		if(_data.urlTrailer){
			this.home.playVideo(_data.urlTrailer,"VIDEO",0,"playerDetail");
			buttons_opt.push({"label":"VER TRAILER","type":"TRAILER"});
		}else{
			widgets.bgPlayer.setData({"url":_data.images.url6X6});
			widgets.bgPlayer.stateChange("enter");
		}
	}
	
	widgets.buttons_opt.setData(buttons_opt);
	widgets.buttons_opt.stateChange("enter");
	widgets.button_back.setData([{"id":"0","text": "REGRESAR"}]);
	widgets.button_back.stateChange("enter");
	
	
	
	widgets.buttons.setData(buttons);
	widgets.buttons.stateChange("enter");
	
	
	this.imdb.getMovie(_data.originalName,this.getMovieImdb.bind(this));
	
	var params = ["values=0,0,0,3,0","vodId="+_data.vodId];
	getServices.getSingleton().call("RECOMMENDATION_GET_ID_VOD", params, this.responseGetRecommandations.bind(this));
	
}

vodDetail.prototype.getMovieImdb = function getMovieImdb(responseCode){
	if(responseCode.status == 200){
		var detail = this.imdb.getImdbMovie();
		if (this.widgets.imdb) {
                    this.widgets.imdb.setData(detail);
                    this.widgets.imdb.stateChange("enter");
                }
		
	}else{
	NGM.trace("error Imdb- "+responseCode.status);
	}
}
vodDetail.prototype.responseGetRecommandations = function responseGetRecommandations(response){
	var widgets = this.widgets;
	if(response.status == 200){
		var recommendationVod = response.data.ResponseVO.vodArray;
		
			widgets.recommendations.setData(recommendationVod);	
			widgets.recommendations.stateChange("enter");
			
	}
}
vodDetail.prototype.openNextSection = function openNextSection(_status,_nip){
	if(_status){
		var price = this.widgets.buttons.selectItem.price,
			quality = this.widgets.buttons.selectItem.quality,
			vodId = this.widgets.detail.data.vodId;
		
		var password = tpng.backend.mac_address.replace( /:/g, "");	
		var ciphertext = encryptByDES(password, tpng.stb.key);

		var nip = _nip ? _nip : "-1";
			nip = encryptByDES(nip, tpng.stb.keyNip);

		var params = ["vodId="+vodId, "quality="+quality, "passwd="+nip, "auth="+ciphertext];
			getServices.getSingleton().call("VOD_RENT_MOVIE", params, this.responseExecuteBuyVod.bind(this));
	}

}
vodDetail.prototype.responseExecuteBuyVod = function responseExecuteBuyVod(response){
	
	if(response.status == 200){
		if(response.data.ResponseVO.status == 0){
			tpng.menu.data = [];
 			tpng.menu.tsMenu = "";
 			tpng.menu.lastMenuIndex = 0;
 			//Limpiamos el cache guardado
 			tpng.vod.home_response = null;
			this.home.openSection("vodPlayer", {"name": "vodPlayer", "home":this.home,"vodId":this.widgets.detail.data.vodId, "isEncrypted":this.widgets.detail.data.isEncrypted}, false);
		}else{
			this.home.openSection("miniError", {"home": this.home,"code":response.data.ResponseVO.status, "message":response.data.ResponseVO.message, "suggest":response.data.ResponseVO.suggest},false);
		}
	}else{
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status},false);
	}
}
vodDetail.prototype.responseSendWishlist = function responseSendWishlist(response){
	
	NGM.dump(response,3);
	if(response.status == 200){	
		//Limpiamos el cache guardado
 		tpng.vod.home_response = null;
		var buttons_opt = this.widgets.buttons_opt;
		for(var x = 0; x < buttons_opt.list.length; x++){
			if(buttons_opt.list[x].type == "WISHLIST"){
				if(buttons_opt.list[x].label == "+LISTA DE DESEOS"){
			 		buttons_opt.list[x].label = "-QUITAR DE MI LISTA";
			 		this.widgets.detail.data.isInWishlist = true;
				 }else{
				 	buttons_opt.list[x].label = "+LISTA DE DESEOS";
				 	this.widgets.detail.data.isInWishlist = false;
				 }
				 	buttons_opt.redraw();
			}
		}	
	}else{
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}
vodDetail.prototype.fullplayer = function fullplayer(){
	this.home.hideHeader();
	this.widgets.stateChange("exit");
	this.home.widgets.player.stateChange("enter");
	this.activeFocus = "fullplayer";
}
vodDetail.prototype.miniplayer = function miniplayer(_state){
	this.home.showHeader({"stroke":"rgba(130, 60, 150, 1)"});
	this.widgets.buttons_opt.setFocus(false);
	this.widgets.buttons.setFocus(false);
	this.widgets.recommendations.setFocus(false);
	this.widgets.stateChange("enter");
	this.widgets.tooltip_button_back.stateChange("exit");
	this.widgets.bgPlayer.stateChange("exit");
	this.home.widgets.player.stateChange("playerDetail");
	//if(_state){
		//this.widgets.focusPlayer.stateChange("exit");
		this.activeFocus = "player";
	//}

}
vodDetail.prototype.pausePlayer = function pausePlayer(){
	unsetTimeAlarm(this.deleyPlayer);	
	this.home.setPlayerStatus("PAUSE");
	this.widgets.statusPlayer.setData("");
	this.widgets.statusPlayer.stateChange("enter");
}
vodDetail.onFocusRecommendation = function onFocusRecommendation(_focus, _data){
   	var widgets = this.widgets;
	if(_focus && this.activeFocus != "recommendations")
        	widgets.recommendations.setFocus(false);
    		
}
vodDetail.onFocusButtons = function onFocusButtons(_focus, _data){
   	var widgets = this.widgets;
	if(_focus && (this.activeFocus == "exit" || this.activeFocus == "recommendations"))
        	widgets.buttons.setFocus(false);
        
    		
}
vodDetail.onFocusButtons_opt = function onFocusButtons_opt(_focus, _data){
   	var widgets = this.widgets;
	if(_focus && (this.activeFocus == "buttons" || this.activeFocus == "recommendations"))
        	widgets.buttons_opt.setFocus(false);
    		
}
vodDetail.onFocusButtonBack = function onFocusButtonBack(_focus, _data){
   	var widgets = this.widgets;
	if(_focus){		
	    this.timerFocusButtons = setTimeout(function (){
	    	widgets.tooltip_button_back.setData({"x": 0, "text": "REGRESAR"});
   			widgets.tooltip_button_back.stateChange("enter");
		}.bind(this), 500);
	}else{
		unsetTimeAlarm(this.timerFocusButtons);
		widgets.tooltip_button_back.stateChange("exit");
	}	
}
vodDetail.prototype.onStreamEvent = function onStreamEvent(event) {
	//NGM.trace("--->"+event.type)
	switch(event.type){
		case "error":
			this.widgets.bgPlayer.setData({"url":this.widgets.detail.data.images.url6X6});
			this.widgets.bgPlayer.stateChange("enter");
			this.errorUrl = true;
		break;
		case "endOfFile":
		case "end":
			this.home.setPlayerStatus("STOP");
			this.miniplayer();
			this.widgets.bgPlayer.setData({"url":this.widgets.detail.data.images.url6X6});
			this.widgets.bgPlayer.stateChange("enter");
		break;
		case "start":
			if(this.widgets.detail.data.isBuy){
				this.errorUrl = false;
				unsetTimeAlarm(this.deleyPlayer);
				this.deleyPlayer = this.pausePlayer.bind(this).delay(60000); 
			}
			
		break;
		
		
		
	}
}
vodDetail.prototype.onKeyPress = function onKeyPress(_key){
	
	switch(this.activeFocus){
		case "buttons":
			this.onKeyPress_buttons(_key);
		break;
		case "buttons_opt":
			this.onKeyPress_buttons_opt(_key);
		break;
		case "button_susc":
			this.onKeyPress_button_susc(_key);
		break;
		case "player":
			this.onKeyPress_player(_key);
		break;
		case "exit":
			this.onKeyPress_exit(_key);
		break;
		case "recommendations":
			this.onKeyPress_recommendations(_key);
		break;
		case "fullplayer":
			this.onKeyPress_fullplayer(_key);
		break;
		case "search":
			this.onKeyPress_search(_key);
		break;
	}
	return true;	
}
vodDetail.prototype.onKeyPress_buttons_opt = function onKeyPress_buttons_opt(_key){
	var widgets = this.widgets,
		vodInfo = widgets.detail.data;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.closeSection(this);
		break;
		case "KEY_RIGHT":
			if(!widgets.buttons_opt.scrollNext() && widgets.recommendations.maxItem > 0){
				this.activeFocus = "recommendations";
				widgets.buttons_opt.setFocus(false);
				widgets.recommendations.setFocus(true);
			}
		break;
		case "KEY_LEFT":
			if(!widgets.buttons_opt.scrollPrev()){
				widgets.buttons_opt.setFocus(false);
				widgets.button_back.setFocus(true);
				this.activeFocus = "exit";
			}
		break;
		case "KEY_DOWN":
				if(vodInfo.clubAlias != "TRANS"){
					this.activeFocus = "button_susc";
					widgets.button_susc.setFocus(true);
					widgets.buttons_opt.setFocus(false);	
				}else{
					if(vodInfo.isBuy){
						this.activeFocus = "button_susc";
						widgets.button_susc.setFocus(true);
						widgets.buttons_opt.setFocus(false);
					}else{
						widgets.buttons_opt.selectIndex == 0 ? widgets.buttons.scrollPrev() : widgets.buttons.scrollNext();
						this.activeFocus = "buttons";
						widgets.buttons.setFocus(true);
						widgets.buttons_opt.setFocus(false);
					}
				}
		break;
		case "KEY_UP":
			widgets.focusPlayer.stateChange("enter");
			widgets.buttons_opt.setFocus(false);
			this.activeFocus = "player";
			
		break;
		case "KEY_IRENTER":
			switch(widgets.buttons_opt.selectItem.type){
				case "WISHLIST":
					getServices.getSingleton().call("VOD_ADD_WISHLIST", ["vodId="+widgets.detail.data.vodId],  this.responseSendWishlist.bind(this));
				break;
				case "TRAILER":
					if(!this.errorUrl){
						if(widgets.bgPlayer.data.url){
							this.home.playVideo(widgets.detail.data.urlTrailer,"VIDEO",0,"enter");
							widgets.bgPlayer.data.url = null;
						}
						this.fullplayer();
					}
				break;
			}
		break;
	}	
	return true;
}
vodDetail.prototype.onKeyPress_buttons = function onKeyPress_buttons(_key){
	var widgets = this.widgets,
		vodInfo = widgets.detail.data;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.closeSection(this);
		break;
		case "KEY_RIGHT":
			if(!widgets.buttons.scrollNext() && widgets.recommendations.maxItem > 0){
				this.activeFocus = "recommendations";
				widgets.buttons.setFocus(false);
				widgets.recommendations.setFocus(true);
			}
		break;
		case "KEY_LEFT":
			if(!widgets.buttons.scrollPrev()){
				this.activeFocus = "exit";
				widgets.buttons.setFocus(false);
				widgets.button_back.setFocus(true);
			}
		break;
		case "KEY_UP":
			widgets.buttons.selectIndex == 0 ? widgets.buttons_opt.scrollPrev() : widgets.buttons_opt.scrollNext();
			this.activeFocus = "buttons_opt";
			widgets.buttons_opt.setFocus(true);
			widgets.buttons.setFocus(false);
			
			
		break;
		
		case "KEY_IRENTER":
			switch(widgets.buttons.selectItem.type){
				case "BUY":
					var price = widgets.buttons.selectItem.price,
						quality = widgets.buttons.selectItem.quality,
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
							var nip = encryptByDES("-1", tpng.stb.keyNip);
							var params = ["vodId="+vodInfo.vodId,"quality="+vodInfo.formats[0].VodFormatVO.quality,"passwd="+nip];
							//var params = ["vodId="+vodInfo.vodId,"quality="+vodInfo.formats[0].VodFormatVO.quality,"passwd=-1"];
							getServices.getSingleton().call("VOD_RENT_MOVIE", params, this.responseExecuteBuyVod.bind(this));
						}else{
							this.home.openSection("suscription",{"home":this.home, "club":vodInfo.clubAlias, "update": false, "vodInfo": vodInfo}, false,null,false);
						}
					}else{
						this.home.openSection("vodPlayer",{"home":this.home, "vodId":widgets.detail.data.vodId, "isEncrypted":this.widgets.detail.data.isEncrypted}, false);
					}
				break;
			
			}
		break;
	}	
	return true;
}
vodDetail.prototype.onKeyPress_player = function onKeyPress_player(_key){
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.closeSection(this);
		break;
		case "KEY_RIGHT":
			if(widgets.recommendations.maxItem > 0){
				this.activeFocus = "recommendations";
				widgets.focusPlayer.stateChange("exit");
				widgets.recommendations.setFocus(true);
			}
			
		break;
		case "KEY_UP":
			this.activeFocus = "search"; 
    		this.home.enableSearchHeader();
    		widgets.focusPlayer.stateChange("exit");
		break;
		case "KEY_LEFT":
			widgets.focusPlayer.stateChange("exit");
			widgets.button_back.setFocus(true);
			this.activeFocus = "exit";
		break;
		case "KEY_DOWN":
			widgets.focusPlayer.stateChange("exit");
			widgets.buttons_opt.setFocus(true);
			widgets.buttons_opt.scrollPrev();
			this.activeFocus = "buttons_opt";
		break;
		case "KEY_IRENTER":
    		if(!this.errorUrl){
		    		if(widgets.detail.data.urlTrailer){
			    		if(widgets.bgPlayer.data.url && !this.errorUrl){
							this.home.playVideo(widgets.detail.data.urlTrailer,"VIDEO",0,"enter");
							widgets.bgPlayer.data.url = null;
						}
						this.fullplayer();
					}
					
					if(widgets.detail.data.isBuy){
						this.home.openSection("vodPlayer", {"name": "vodPlayer", "home":this.home,"vodId":widgets.detail.data.vodId,"isEncrypted":this.widgets.detail.data.isEncrypted}, false);
					
					}
					
				}
    	break;
	}	
	return true;
}
vodDetail.prototype.onKeyPress_exit = function onKeyPress_exit(_key){	
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
			this.home.closeSection(this);
		break;	
		case "KEY_RIGHT":
			widgets.focusPlayer.stateChange("enter");
			widgets.button_back.setFocus(false);
			this.activeFocus = "player";
    	break;
    	case "KEY_UP":
			this.activeFocus = "search"; 
    		this.home.enableSearchHeader();
    		widgets.button_back.setFocus(false);
		break;
	
	}
	
	return true
}
vodDetail.prototype.onKeyPress_button_susc = function onKeyPress_button_susc(_key){	
	var widgets = this.widgets,
		vodInfo = widgets.detail.data;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.home.closeSection(this);
		break;	
		case "KEY_UP":
			widgets.buttons_opt.setFocus(true);
			widgets.button_susc.setFocus(false);
			this.activeFocus = "buttons_opt";
    	break;
    	case "KEY_RIGHT":
			this.activeFocus = "recommendations";
			widgets.button_susc.setFocus(false);
			widgets.recommendations.setFocus(true);
    	break;
    	case "KEY_LEFT":
			if(!widgets.button_susc.scrollPrev()){
				widgets.button_susc.setFocus(false);
				widgets.button_back.setFocus(true);
				this.activeFocus = "exit";
			}
		break;
    	case "KEY_IRENTER":
			switch(widgets.button_susc.selectItem.type){
				case "PLAY_SUSC":
					if(vodInfo.clubAlias != "TRANS"){
						if(vodInfo.isActiveSuscription){
							var nip = encryptByDES("-1", tpng.stb.keyNip);
							var params = ["vodId="+vodInfo.vodId,"quality="+vodInfo.formats[0].VodFormatVO.quality,"passwd="+nip];
							getServices.getSingleton().call("VOD_RENT_MOVIE", params, this.responseExecuteBuyVod.bind(this));
						}else{
							this.home.openSection("suscription",{"home":this.home, "club":vodInfo.clubAlias, "update": false, "vodInfo": vodInfo}, false);
						}
					}else{
						this.home.openSection("vodPlayer",{"home":this.home, "vodId":widgets.detail.data.vodId, "isEncrypted":this.widgets.detail.data.isEncrypted}, false);
					}
				break;
				case "PLAY_TRANS":
						this.home.openSection("vodPlayer", {"name": "vodPlayer", "home":this.home,"vodId":widgets.detail.data.vodId,"isEncrypted":this.widgets.detail.data.isEncrypted}, false);
				break;
			
			}
		break;
    	
	
	}
	
	return true
}
vodDetail.prototype.onKeyPress_fullplayer = function onKeyPress_fullplayer(_key){	
	var widgets = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
			
			this.miniplayer();
			
		break;
	
	}
	
	return true
}
vodDetail.prototype.onKeyPress_search = function onKeyPress_search(_key){	
	var widgets = this.widgets;	
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			this.home.disableSearchHeader();
			widgets.focusPlayer.stateChange("enter");
			this.activeFocus = "player";
		break;
		
		default:
			this.home.onKeyPress(_key);
		break;
	}
	return true
}
vodDetail.prototype.onKeyPress_recommendations = function onKeyPress_recommendations(_key){
	var widgets = this.widgets,
		vodInfo = widgets.detail.data;
	switch(_key){		
		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
	    break;
	    case "KEY_UP":
	    	this.activeFocus = "player";
			widgets.focusPlayer.stateChange("enter");
			widgets.recommendations.setFocus(false);
			
		break;
	    case "KEY_LEFT":
	   		if(!widgets.recommendations.scrollPrev()){
		   			if(vodInfo.clubAlias != "TRANS"){
		   				this.activeFocus = "button_susc";
		   				widgets.button_susc.setFocus(true);
		   				widgets.recommendations.setFocus(false);
		   			}else{
		   				if(vodInfo.isBuy){
			   				this.activeFocus = "button_susc";
			   				widgets.button_susc.setFocus(true);
			   				widgets.recommendations.setFocus(false);
		   				}else{
			   				this.activeFocus = "buttons";
							widgets.buttons.scrollNext();
							widgets.buttons.setFocus(true);
							widgets.recommendations.setFocus(false);
		   				}
		   			}
			}
	    break;
		case "KEY_RIGHT":			
			widgets.recommendations.scrollNext();
    	break;
    	case "KEY_IRENTER":
    		this.home.setPlayerStatus("STOP");
    		this.home.hideBg();
	    	var section = widgets.recommendations.selectItem.ItemVO.link;
	    	this.home.openLink(section);
    		
    	break;
	}	
	return true;
}
vodDetail.drawDetail = function drawDetail(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
     var custo_f = JSON.stringify(this.themaData.standardFont);
		 custo_f = JSON.parse(custo_f);
  	
   //name
    custo_f.text_align = "left,bottom";
	custo_f.font_size = 34 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, toUpperCase(_data.name) , new Rect(576, 0, 570, 76), custo_f);
	
	 //duration
    custo_f.text_align = "right,middle";
    custo_f.font_size = 20 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, "<!i>"+_data.duration+" min<!>", new Rect(256, 40, 250, 32), custo_f);
	
	//puntuación
	/*tp_draw.getSingleton().drawImage("img/tv/EstrellaIMDB.png", ctx, 128, 47);
	custo_f.text_align = "left,middle";
	Canvas.drawText(ctx, "<!i>7.2<!>", new Rect(155, 40, 122, 32), custo_f);
	*/
	//description
	custo_f.text_align = "left,top";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	var year = _data.year ? _data.year+" / " : "";
	Canvas.drawText(ctx, "<!line-height=25>------ / "+year+_data.description+"<!>", new Rect(576, 157, 570, 167), custo_f);
   // 
    //autores
	custo_f.fill = "rgba(170,170,180,1)";
	custo_f.text_align = "left,middle";
	Canvas.drawText(ctx, "<!i>"+_data.actors+"<!>", new Rect(576, 112, 570, 32), custo_f);
	
	//originalName
	Canvas.drawText(ctx, "<!i>"+toUpperCase(_data.originalName)+"<!>", new Rect(576, 76, 570, 32), custo_f);
	
	//RATING
	tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.rating+".png", ctx, 576, 164);
		
	// recomendaciones
	custo_f.text_align = "left,middle";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	custo_f.fill = "rgba(240, 240, 250, 1)";
	Canvas.drawText(ctx,"OTROS VIERON" , new Rect(576, 364, 186, 32), custo_f);

    // RENTA
    if(_data.label)
    	Canvas.drawText(ctx,_data.label , new Rect(128, 364, 314, 32), custo_f);
    
    
    ctx.drawObject(ctx.endObject());	
}
vodDetail.drawBgPlayer = function drawBgPlayer(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();

		tp_draw.getSingleton().drawImage(_data.url, ctx, 5, 5);
		
		ctx.drawObject(ctx.endObject());
}
vodDetail.drawFocusPlayer = function drawFocusPlayer(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
	
		var custo = JSON.stringify(this.themaData.whiteStrokePanel)
		custo = JSON.parse(custo);
		custo.stroke_width = 5;
		custo.rx = 5;
		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

		ctx.drawObject(ctx.endObject());
}
vodDetail.drawStatusPlayer = function drawStatusPlayer(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
	
		var custo = JSON.stringify(this.themaData.whiteStrokePanel)
		custo = JSON.parse(custo);
		custo.stroke_width = 5;
		custo.rx = 5;
		
		tp_draw.getSingleton().drawImage("img/vod/playVOD.png", ctx, 170, 88);

		ctx.drawObject(ctx.endObject());
}
vodDetail.drawRecommendations = function drawRecommendations(_data){ 	
	
   
	this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
		tp_draw.getSingleton().drawImage(_data.ItemVO.images.url3X3, ctx, 5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10, null,"destination-over");
		
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);

		if(focus){
			custo.stroke_width = 5;
			custo.rx = 5;
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
			
			var strokeF = {"stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_position" : "inside"};
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], strokeF);
		}else{
			Canvas.drawShape(ctx, "rect", [5,5, ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
		}

		ctx.drawObject(ctx.endObject());
	}	
}
vodDetail.drawButton_susc = function drawButton_susc(_data){ 	
	
	this.draw = function draw(focus) {	
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,top";
			custo_f.font_size = 40 * tpng.thema.text_proportion;	
		
		var custo = { "fill": "rgba(30,30,40,.7)",
            	  "shadow": null,
            	  "rx": null,
            	  "stroke": "rgba(85,95,105,1)",
           	 	  "stroke_width": 5,
           	 	  "stroke_pos" : "inside"	
				}	
			
			
		if(focus){
			custo.stroke = "rgba(240,240,240,1)";
			custo.rx = 5;
			custo.fill = "rgba(240,240,240,1)";
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo); //FONDO
			custo_f.fill = "rgba(30,30,40,1)";
		
		}else{
			custo.stroke_width = 1;
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
		}
		
		Canvas.drawText(ctx, _data.label, new Rect(0,25,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		custo_f.font_size = 16 * tpng.thema.text_proportion;
		if(_data.audio)
			Canvas.drawText(ctx, "("+_data.audio+")", new Rect(5,76,ctx.viewportWidth-10,32), custo_f);
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		custo_f.text_align = "center,middle";
		Canvas.drawText(ctx, _data.quality, new Rect(334,5,48,32), custo_f);
		
		
		ctx.drawObject(ctx.endObject());	
	}
}
vodDetail.drawButtons = function drawButtons(_data){ 	
	
	this.draw = function draw(focus) {	
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 60 * tpng.thema.text_proportion;	
		
		var custo = { "fill": "rgba(30,30,40,.7)",
            	  "shadow": null,
            	  "rx": null,
            	  "stroke": "rgba(85,95,105,1)",
           	 	  "stroke_width": 5,
           	 	  "stroke_pos" : "inside"	
				}	
			
			
		if(focus){
			custo.stroke = "rgba(240,240,240,1)";
			custo.rx = 5;
			custo.fill = "rgba(240,240,240,1)";
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
			custo_f.fill = "rgba(30,30,40,1)";
		
		}else{
			custo.stroke_width = 1;
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
		}
		
		Canvas.drawText(ctx, _data.label, new Rect(5,5,ctx.viewportWidth-10,72), custo_f);
		custo_f.font_size = 16 * tpng.thema.text_proportion;
		if(_data.audio)
			Canvas.drawText(ctx, "("+_data.audio+")", new Rect(5,76,ctx.viewportWidth-10,32), custo_f);
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		custo_f.text_align = "center,middle";
		Canvas.drawText(ctx, _data.quality, new Rect(142,5,48,32), custo_f);
		
		
		ctx.drawObject(ctx.endObject());	
	}
}
vodDetail.drawButtons_opt = function drawButtons_opt(_data){ 	
	
	this.draw = function draw(focus) {	
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 16 * tpng.thema.text_proportion;	

		var custo = { "fill": "rgba(30,30,40,.7)",
                	  "shadow": null,
                	  "rx": 10,
                	  "stroke": "rgba(85,95,105,1)",
               	 	  "stroke_width": 1,
               	 	  "stroke_pos" : "inside"	
					}
			
			
		if(focus){
			custo.stroke = "rgba(240,240,240,1)";
			custo.rx = 10;
			custo.fill = "rgba(240,240,240,1)";
			Canvas.drawShape(ctx, "rect", [3,3,ctx.viewportWidth-6,ctx.viewportHeight-6], custo); //FONDO
			custo_f.fill = "rgba(30,30,40,1)";
		}else{
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
		}
		
		Canvas.drawText(ctx, _data.label, new Rect(5,5,ctx.viewportWidth-10, ctx.viewportHeight-10), custo_f);
		
		ctx.drawObject(ctx.endObject());	
	}
}
vodDetail.drawMalla = function drawMalla(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		tp_draw.getSingleton().drawImage("img/tmp/DevsOnion.png", ctx, 0, 0);	
		
		ctx.drawObject(ctx.endObject());
}
vodDetail.drawImdb = function drawImdb(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		
		//puntuación
		if(_data.imdbRating){
			tp_draw.getSingleton().drawImage("img/tv/EstrellaIMDB.png", ctx, 0, 8);
			tp_draw.getSingleton().drawImage("img/vod/imdb.png", ctx, 70, 4);
			custo_f.text_align = "left,middle";
			Canvas.drawText(ctx, "<!i>"+_data.imdbRating+"<!>", new Rect(30, 0, ctx.viewportWidth, ctx.viewportHeight), custo_f);
		}
		
		ctx.drawObject(ctx.endObject());
}
//temp
vodDetail.drawLabel = function drawLabel(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		 var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
		if(_data.label)
			Canvas.drawText(ctx, _data.label, new Rect(0,0,ctx.viewportWidth-10, ctx.viewportHeight-10), custo_f);
		
		ctx.drawObject(ctx.endObject());
}
vodDetail.prototype.onExit = function onExit(_data){
	this.widgets.stateChange("exit");
	this.home.setPlayerStatus("STOP");
	this.home.hideHeader();
	this.home.hideBg();
	unsetTimeAlarm(this.timerFocusButtons);
	unsetTimeAlarm(this.deleyPlayer);
	this.home.objectChild = null;
}