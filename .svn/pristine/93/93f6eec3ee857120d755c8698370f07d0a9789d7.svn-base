// promotions_template_1.js

FormWidget.registerTypeStandard("promotions_template_1");

function promotions_template_1(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.actualFocus;
}

promotions_template_1.inherits(FormWidget);

promotions_template_1.prototype.onEnter = function onEnter(_data){
	
	this.home = _data.home;
	var idPromo = _data.parameters.prmId;
	this.getPromotion(idPromo);
	this.home.objectChild = this; //Player Events
}


promotions_template_1.prototype.onExit = function onExit(_data){

	var widgets = this.widgets;
	widgets.list01.stateChange("exit");
	widgets.list02.stateChange("exit");
	widgets.list03.stateChange("exit");
	widgets.mainApp.stateChange("exit");
	widgets.strokeFocus.stateChange("exit_all");
	widgets.terms.stateChange("exit");

	this.home.hideBg();
	this.home.objectChild = null;
	this.home.hideHeader();
	this.home.setPlayerStatus("STOP");
	
}

promotions_template_1.prototype.getPromotion = function getPromotion(id_promo){
	var params = ["prmId="+id_promo];
	getServices.getSingleton().call("ADMIN_GET_INTEREACTIVE_PROMO",params, this.responseGetPromotion.bind(this));
}

promotions_template_1.prototype.responseGetPromotion = function responseGetPromotion(response){
	if(response.status == 200){
		var promo = response.data.ResponseVO.promo.PromoVO;
		this.showHome(promo);
	}else{
		this.home.openSection("miniError", {"home": this.home, "code": response.status, "suggest": response.error.suggest, "message": response.error.message}, false);
	}
		
}


promotions_template_1.prototype.onStreamEvent = function onStreamEvent(event) {
	var widgets = this.widgets;
	switch(event.type){

		case "end":
		case "endOfFile":
//			this.home.setPlayerStatus("PLAY");	
			if(this.statusPlayer == "mini"){			
				this.statusPlayer = "mini";	
				this.home.playVideo(this.urlV,"HLS", 0);
				this.home.widgets.player.stateChange("player_promos_1");			
			}else if(this.statusPlayer == "enter"){
				this.home.showHeader({"section": "promos"});	
				this.statusPlayer = "mini";
				this.home.playVideo(this.urlV,"HLS", 0);
				this.home.widgets.player.stateChange("player_promos_1");
				widgets.list01.stateChange("enter");
				widgets.list02.stateChange("enter");
				widgets.mainApp.stateChange("enter");
				widgets.list03.stateChange("enter");
				widgets.exitSections.stateChange("exit");
				widgets.list03.setFocus(true);
				if(this.actualFocus == "video"){
					widgets.exitSections.stateChange("exit");
					this.actualFocus = "section_3";
				}			
			}
			
		break;
	}
}

promotions_template_1.prototype.showHome = function showHome(_promo){
	var widgets = this.widgets;

	var url = _promo.images.url18X18; // imagen background
	this.home.setBg(url);
	this.home.showHeader({"section": "promos"});	
			
	this.haveGallery = _promo.haveGallery;
	this.haveApp = _promo.haveApp;
	this.haveVideo = _promo.haveVideo;
	this.haveSucs = _promo.haveSucs;
	
	/*
	this.haveGallery = true;
	this.haveApp = false;
	this.haveVideo = true;
	this.haveSucs = true;
	*/
	
	// buttons - 1 
	var buttons = [{
			"text": "Regresar", 
			"prmId": _promo.prmId,
			"section": "exit", 
			"color_rect": _promo.color, 
			"color_font": _promo.fontColor,
			"color_selector": _promo.selectorColor,
			"img":"img/promotions/1x1-regresar.png"
		}];
		
	if(this.haveSucs)
		buttons.push({
			"text": _promo.sucsText,
		 	"prmId": _promo.prmId,
		 	"section": "sucs",
			"color_rect": _promo.color, 
			"color_font": _promo.fontColor,
			"color_selector": _promo.selectorColor,
		 	"img":_promo.images.url1X1
		 });

	// buttons - 2	
	var buttons2 = [];
		if(this.haveGallery){
			buttons2.push({
				//"text": _promo.galleryText,
				"text": "",
				"prmId": _promo.prmId,
				"section": "gallery", 
				"img": _promo.images.url7X7,
				"color_rect": _promo.color, 
				"color_font": _promo.fontColor,
				"color_selector": _promo.selectorColor
			});

			//LISTA 2
			widgets.list02.setData(buttons2);
			widgets.list02.stateChange("enter");
		}
			
	// buttons - 3
	var buttons3 = [];
		if(this.haveVideo){
			buttons3.push({
				"text": _promo.videoText, 
				"prmId": _promo.prmId, 
				"section": "video", 
				"color_rect": _promo.color, 
				"color_font": _promo.fontColor,
				"color_selector": _promo.selectorColor,				
				"img": "img/profile/promotions/7x7-play.png",
				"haveVideo": _promo.haveVideo
				});
			
			//LISTA 3
			widgets.list03.setData(buttons3);
			widgets.list03.stateChange("enter");
		
		}
	// PLAYER
	if(this.haveVideo){
		this.urlV = _promo.urlVideo;
		//this.urlV = "http://vod.cdn.iutpcdn.com:80/VOD/H01/HD/LINKINPARK/03.m3u8";
		this.home.playVideo(this.urlV,"HLS", 0);
		this.home.widgets.player.stateChange("player_promos_1");
		this.statusPlayer = "mini";
	}
	
	this.selectorColor = _promo.selectorColor;
	this.color_rect = _promo.color;

	// APP	
	if(this.haveApp){
		this.actualFocus = "app";
		// APP
		widgets.mainApp.setData({"logo": _promo.images.url3X8}); // imagen app
		widgets.mainApp.stateChange("enter");
	
		widgets.list01.setFocus(false);	
		widgets.strokeFocus.setData({"color":_promo.selectorColor});
		widgets.strokeFocus.stateChange("enter");
		this.link = _promo.link;
	}else{
		this.actualFocus = "section_1";
		widgets.list01.focusIndex = 0;
		widgets.strokeFocus.setData();
		widgets.strokeFocus.stateChange("exit");
	}
	

	// LISTA 1
	widgets.list01.setData(buttons);
	widgets.list01.stateChange("enter");

	widgets.terms.setData({"text": _promo.terms, "color": _promo.fontColor});
	widgets.terms.stateChange("enter");
	
	
}

promotions_template_1.prototype.getSucs = function getSucs(id_promo){
	var params = ["prmId="+id_promo];
	getServices.getSingleton().call("ADMIN_GET_SUCS_PROMOS",params, this.responseGetSucs.bind(this));

}

promotions_template_1.prototype.responseGetSucs = function responseGetSucs(response){
	if(response.status == 200){
		this.actualFocus = "sucs";	
		var sucs = response.data.ResponseVO.arrayPromoSucs;
		this.showListItems(sucs);
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
		
}

promotions_template_1.prototype.showListItems = function showListItems(_sucs){

	var widgets = this.widgets;
	this.sucs = _sucs;
	for(var i = 0; i < _sucs.length; i++){
		_sucs[i].PromoSucVO.color_rect = this.color_rect;
		_sucs[i].PromoSucVO.selector_color = this.selectorColor;
	}
		
	//if(_sucs.length > 1){
		widgets.panelList.setData();
		widgets.listSucs.setData(_sucs);
		widgets.panelList.stateChange("enter");
		widgets.listSucs.stateChange("enter");	
	//}else{
		//this.callItem(_sucs[0]);
	//}

}

promotions_template_1.prototype.callItem = function callItem(_data){

	this.actualFocus = "";	
	var widgets = this.widgets;
	widgets.call_item.setData({"text": "Llamando "+_data.PromoSucVO.name+"..."});
	widgets.call_item.stateChange("enter");	
	widgets.call_item.refresh();
	
	var phone = _data.PromoSucVO.phone+"";
	var numericString = phone.replace(/[^ 0-9]/g,'');
	numericString = replaceAll(numericString, " ", "");
		
	this.timer = setTimeout(function (){
		widgets.call_item.stateChange("exit");	
		this.sendCall(numericString);
	}.bind(this), 1500);
	
}

promotions_template_1.prototype.sendCall = function sendCall(_phone){
	var params = ["mdnDest="+_phone];
	getServices.getSingleton().call("ADMIN_SEND_CALL",params, this.responseGetCall.bind(this));

}

promotions_template_1.prototype.responseGetCall = function responseGetCall(response){
	if(response.status == 200){
	 	this.actualFocus = "sucs";	
		unsetTimeAlarm(this.timer); 
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
		
}

promotions_template_1.prototype.getGallery = function getGallery(id_promo){
	var params = ["prmId="+id_promo];
	getServices.getSingleton().call("ADMIN_GET_GALLERY_PROMOS",params, this.responseGetGallery.bind(this));

}

promotions_template_1.prototype.responseGetGallery = function responseGetGallery(response){
	if(response.status == 200){
		var gallery = response.data.ResponseVO.arrayPromoGallery;
		this.showGallery(gallery);
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
		
}
promotions_template_1.prototype.showGallery = function showGallery(_gallery){

	this.home.setPlayerStatus("PAUSE");
	this.statusPlayer = "mini";	
	var widgets = this.widgets;
	// Fondo Negro	
	//widgets.backGallery.setData();
	//widgets.backGallery.stateChange("enter");
	this.actualFocus = "gallery";
	for(var i = 0; i < _gallery.length; i++){
		_gallery[i].PromoGalleryVO.index = i+1,
		_gallery[i].PromoGalleryVO.total = _gallery.length,
		_gallery[i].PromoGalleryVO.item = _gallery[i].PromoGalleryVO.index+"/"+_gallery[i].PromoGalleryVO.total;
	}
	
	this.home.showHeader({"section": "promotions"});
	widgets.gallery.setData(_gallery);
	widgets.gallery.stateChange("enter");

	widgets.exitSections.setData({"text":"Presiona OK para salir de la Galería"});
	widgets.exitSections.stateChange("enter");
	
	if(_gallery.length > 1){
		widgets.rightArrowGallery.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
		
	}else{
			//rightArrowBottomReminders.setData({"url":"", "line":true, "position": "right"});
	}

	widgets.rightArrowGallery.stateChange("enter");
	
}

	

promotions_template_1.onFocusSucs = function onFocusSucs(_focus,_data){
	var widgets = this.widgets;
	if(_focus){
		widgets.panelList.setData({"adress": _data.item.PromoSucVO.address, "name": _data.item.PromoSucVO.name});	
		widgets.panelList.refresh();
	}
}

promotions_template_1.prototype.onKeyPress = function onKeyPress(_key){
	
	switch(this.actualFocus){ 
		case "app":
			this.onKeyPressApp(_key);
		break;
		case "section_1":
			this.onKeyPressList001(_key);
		break;
		case "section_2":
			this.onKeyPressList002(_key);
		break;
		case "section_3":
			this.onKeyPressList003(_key);
		break;
		case "sucs":
		 	this.onKeyPressListSucs(_key);
		break;
		case "gallery":
		 	this.onKeyPressListGallery(_key);
		break;
		case "video":
		 	this.onKeyPressVideo(_key);
		break;
		case "search":
		 	this.onKeyPressSearch(_key);
		break;

	}
	return true;

}

promotions_template_1.prototype.onKeyPressApp = function onKeyPressApp(_key){
	var widgets = this.widgets,
		list01 = widgets.list01,
		list02 = widgets.list02,
		list03 = widgets.list03,
		strokeFocus = widgets.strokeFocus;
		
	switch(_key){	

		case "KEY_UP":
			this.actualFocus = "search";
			this.section = "left_app";
			strokeFocus.stateChange("exit");
	   		this.home.enableSearchHeader();
		break;
 	
		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":
			this.home.openLink(this.link,null,12); 
			/*if(this.link.type == "S"){
				if(this.link.ref == "anytimePlayer"){
					this.home.openSection(this.link.ref,{"home": this.home, "parameters":this.link.parameters},false, ,false);
				}else{
					this.home.openSection(this.link.ref,{"home": this.home, "parameters":this.link.parameters},true, ,false);					
				}
			}else if(this.link.type == "C"){ 
				// --> los de tipo "C" no cierran el menu
				this.home.tuneInByNumber(this.link.parameters.channel);
			}else{
				this.home.openLink(this.link);
			}*/		
		break;
		
		case "KEY_DOWN":
			strokeFocus.stateChange("exit");
			this.actualFocus = "section_1";
			list01.focusIndex = 0;
			list01.setFocus(true);

		break;
		
		case "KEY_RIGHT":
			if(this.haveGallery){
				strokeFocus.stateChange("exit");
				this.actualFocus = "section_2";
				list02.setFocus(true);
			}else if(this.haveVideo){
				strokeFocus.stateChange("exit");
				this.actualFocus = "section_3";
				this.actualSection = "right";
				list03.setFocus(true);
			
			}
				
		break;
		
	}	
	return true;
}


promotions_template_1.prototype.onKeyPressList001 = function onKeyPressList001(_key){
	var widgets = this.widgets,
		list01 = widgets.list01,
		list02 = widgets.list02,
		list03 = widgets.list03;		
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":
			switch(list01.selectItem.section){
				case "exit":
					this.home.closeSection(this);
				break;
				case "sucs":
					this.getSucs(list01.selectItem.prmId);
				break;
			}
		break;
		
		case "KEY_RIGHT":
			if(this.haveGallery){
				list01.setFocus(false);		
				this.actualFocus = "section_2";
				list02.setFocus(true);
			}else if(this.haveVideo){
				list01.setFocus(false);		
				this.actualFocus = "section_3";
				this.actualSection = "right";
				list03.setFocus(true);
			}
		break;
		
		case "KEY_UP":
			if(list01.scrollPrev()){
			}else{
				if(this.haveApp){
					this.actualFocus = "app";
					list01.setFocus(false);
					widgets.strokeFocus.setData({"color": this.selectorColor});
					widgets.strokeFocus.stateChange("enter");
				}else{
					this.section = "left_back";
					this.actualFocus = "search";
					list01.setFocus(false);
					this.home.enableSearchHeader();
				}
			}

		break;		
		
		case "KEY_DOWN":
	 		list01.scrollNext();
		break;		
		
	}	
	return true;
}

promotions_template_1.prototype.onKeyPressList002 = function onKeyPressList002(_key){
	var widgets = this.widgets,
		list01 = widgets.list01,
		list02 = widgets.list02,
		list03 = widgets.list03,
		mainApp = widgets.mainApp,
		exitSections = widgets.exitSections;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":
			switch(list02.selectItem.section){
				case "gallery":
					this.getGallery(list02.selectItem.prmId);			
				break;
			}			


		break;
		
		case "KEY_LEFT":
			this.actualSection = "left";
			if(this.haveApp){
				this.actualFocus = "app";
				widgets.strokeFocus.setData({"color":this.selectorColor});
				widgets.strokeFocus.stateChange("enter");
				widgets.list02.setFocus(false);
			}else{
				this.actualFocus = "section_1";
				list02.setFocus(false);
				list01.setFocus(true);
			}
		break;

		case "KEY_UP":
			this.section = "right_gallery";
			this.actualFocus = "search";
			this.home.enableSearchHeader();
			list02.setFocus(false);
		break;

		case "KEY_DOWN":
			if(this.haveVideo){
				this.actualFocus = "section_3";
				list02.setFocus(false);
				list03.setFocus(true);
			}
			
		break;	
		
	}	
	return true;
}

promotions_template_1.prototype.onKeyPressList003 = function onKeyPressList003(_key){
	var widgets = this.widgets,
		list01 = widgets.list01,
		list02 = widgets.list02,
		list03 = widgets.list03,
		mainApp = widgets.mainApp,
		exitSections = widgets.exitSections;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":
			this.actualFocus = "video";
			this.statusPlayer = "enter";
			this.home.hideHeader();
			this.home.widgets.player.stateChange("enter");
			
			list01.stateChange("exit");
			list02.stateChange("exit");
			list03.stateChange("exit");
			mainApp.stateChange("exit");
			widgets.terms.stateChange("exit");
			
			exitSections.setData({"text":"Presiona OK para salir del video"});
			exitSections.stateChange("enter");	
		break;
		
		case "KEY_LEFT":
			this.actualSection = "left";
			if(this.haveApp){
				this.actualFocus = "app";
				widgets.strokeFocus.setData({"color":this.selectorColor});
				widgets.strokeFocus.stateChange("enter");
				widgets.list03.setFocus(false);
			}else{
				this.actualFocus = "section_1";
				list02.setFocus(false);
				list03.setFocus(false)
				list01.setFocus(true);
			}
		break;
		

		case "KEY_UP":
			if(this.haveGallery){
				this.actualFocus = "section_2";
				list03.setFocus(false);
				list02.setFocus(true);
			}else{
				this.section = "right_video";
				this.actualFocus = "search";
				list03.setFocus(false);
				this.home.enableSearchHeader();
			}		

		break;
		
	}	
	return true;
}

promotions_template_1.prototype.onKeyPressListSucs = function onKeyPressListSucs(_key){
	var widgets = this.widgets,
		listSucs = widgets.listSucs,
		call_item = widgets.call_item,
		panelList = widgets.panelList;
		
	switch(_key){	
		case "KEY_IRBACK":
		case "KEY_MENU":			
			listSucs.stateChange("exit");
			panelList.stateChange("exit");
			call_item.stateChange("exit");
			this.actualFocus = "section_1";			
			
			
		break;
		
		case "KEY_IRENTER":
			this.callItem(listSucs.selectItem);
		break;
		
		case "KEY_RIGHT":
		case "KEY_LEFT":
			_key == "KEY_LEFT" ? listSucs.scrollPrev() : listSucs.scrollNext();
		break;
		
		case "KEY_UP":
		break;		
		
	}	
	return true;
}

promotions_template_1.prototype.onKeyPressListGallery = function onKeyPressListGallery(_key){
	
	var widgets = this.widgets,
		listSucs = widgets.listSucs,
		call_item = widgets.call_item,
		panelList = widgets.panelList,
		gallery = widgets.gallery,
		rightArrowGallery = widgets.rightArrowGallery,
		LeftArrowGallery = widgets.LeftArrowGallery,
		exitSections = widgets.exitSections;
			
	switch(_key){	
		case "KEY_IRBACK":
		case "KEY_MENU":
		case "KEY_IRENTER":
			this.home.setPlayerStatus("PLAY");	
			gallery.stateChange("exit");
			rightArrowGallery.stateChange("exit");
			LeftArrowGallery.stateChange("exit");
			exitSections.stateChange("exit");
			this.actualFocus = "section_2";	
			//widgets.backGallery.setData();
			//widgets.backGallery.stateChange("exit");							
		break;
			
		case "KEY_RIGHT":
			gallery.scrollNext();
			if(gallery.maxItem > 1){
				if(gallery.selectIndex > 0){
					LeftArrowGallery.setData({"url":"img/tv/arrowLeftOn.png"});
					LeftArrowGallery.stateChange("enter");
				}
					
				if(gallery.selectIndex == gallery.maxItem-1){
					rightArrowGallery.setData({"url": ""});
					rightArrowGallery.refresh();
				}	
			}
		break;
		
		case "KEY_LEFT":
			gallery.scrollPrev();
			
			if(gallery.maxItem > 1){
				if(gallery.selectIndex == 0){	
					LeftArrowGallery.setData({"url":""});
					LeftArrowGallery.refresh();
				}
				
				if(gallery.selectIndex+1 <= (gallery.maxItem-1)){
					rightArrowGallery.setData({"url":"img/tv/arrowRightOn.png"});
					rightArrowGallery.stateChange("enter");
				}
			}	
		break;
		
	}	
	return true;
}


promotions_template_1.prototype.onKeyPressVideo = function onKeyPressVideo(_key){
	var widgets = this.widgets,
		list01 = widgets.list01,
		list02 = widgets.list02,
		list03 = widgets.list03,
		mainApp = widgets.mainApp,
		exitSections = widgets.exitSections;
		
	switch(_key){	
		case "KEY_IRBACK":
		case "KEY_MENU":
		case "KEY_IRENTER":
			this.home.widgets.player.stateChange("player_promos_1");
			this.actualFocus = "section_3";
			this.statusPlayer = "mini";

			this.home.showHeader({"section": "promos"});	
			list01.stateChange("enter");
			list02.stateChange("enter");
			list03.stateChange("enter");
			list03.setFocus(true);
			mainApp.stateChange("enter");
			widgets.terms.stateChange("enter");			
			exitSections.stateChange("exit");
		break;
		
	}	
	return true;
}

promotions_template_1.prototype.onKeyPressSearch = function onKeyPressSearch(_key){	
	var widgets = this.widgets;
			
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			//CÓDIGO PARA ACTIVAR LA SECCIÓN
			//HABILITAR FOCUS, REDRAWS, ETC
			
			this.home.disableSearchHeader();
			if(this.section == "right_video"){
				this.actualFocus = "section_3";
				widgets.list03.setFocus(true);						
			
			}else if(this.section == "right_gallery"){
				this.actualFocus = "section_2";
				widgets.list02.setFocus(true);			
			
			}else if(this.section == "left_app"){
				this.actualFocus = "app";
				widgets.strokeFocus.stateChange("enter");
				
			}else if(this.section == "left_back"){
				this.actualFocus = "section_1";
				widgets.list01.setFocus(true);				
			}
		break;
		
		default:
			this.home.onKeyPress(_key);
		break;
	}
	return true
}


promotions_template_1.onFocusList01 = function onFocusList01(_focus,_data){
	var widgets = this.widgets;
   	if(_focus){                        
    	if(this.actualFocus == "app" || this.actualFocus == "section_2" || this.actualFocus == "search"){
        	widgets.list01.setFocus(false);       
        }        
   }
         
}

promotions_template_1.onFocusList02 = function onFocusList02(_focus,_data){
	var widgets = this.widgets;
   	if(_focus){                             
    	if(this.actualFocus == "app" || this.actualFocus == "section_1" ){
        	widgets.list02.setFocus(false);       
        }
       
   }
         
}

promotions_template_1.onFocusList03 = function onFocusList03(_focus,_data){
	var widgets = this.widgets;

   	if(_focus){                             
    	if(this.actualFocus == "app" || this.actualFocus == "section_1"){
        	widgets.list03.setFocus(false);       
        }
       
   }
         
}

promotions_template_1.drawMainApp = function drawMainApp(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var strokeF = { 
				"fill"  : null,
				"stroke": "rgba(90,90,90,1)",
				"stroke_width": 1, 
				"rx": 0,
				"stroke_pos" : "inside"
			};
	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], strokeF);
    
	tp_draw.getSingleton().drawImage(_data.logo, ctx, 0, 0, null, null, null,"destination-over"); //tmp el w y h	
	ctx.drawObject(ctx.endObject());	
}

promotions_template_1.drawList01 = function drawList01(_data){ 	
	
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 	
		if(_data.color_rect){
			var custoBackground = {"fill": _data.color_rect, "fill_coords":"0,0,.6,-.4"};
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoBackground);
			tp_draw.getSingleton().drawImage(_data.ItemVO.images.url3X3A, ctx, 0, 0); //tmp el w y h	
		}	
		
		if(_data.color_rect && !focus){
			var custoW = JSON.stringify(this.themaData.outLineGeneralPanelNoFocusR);
				custoW = JSON.parse(custoW);
				custoW.fill = null;	
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW); //FONDO	
		}else{
			var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
				custo = JSON.parse(custo);
				custo.stroke = _data.color_selector;
				custo.fill_coords = "0,0,.6,-.4";
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		}
		
		// 3.- titulo 
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		custo_f.fill = _data.color_font;
		custo_f.text_align = "center,middle";
		Canvas.drawText(ctx, _data.text, new Rect(64, 0, 116, 104), custo_f);

		tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 35);
		ctx.drawObject(ctx.endObject());
	}	
}


promotions_template_1.drawList02 = function drawList02(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 
		if(_data.color_rect && !focus){
			var custoW = JSON.stringify(this.themaData.outLineGeneralPanelNoFocusR);
				custoW = JSON.parse(custoW);
				custoW.fill = null;	
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW); //FONDO	
		}else{
			var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
				custo = JSON.parse(custo);
				custo.stroke = _data.color_selector;
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		}
	
		// 3.- titulo
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		custo_f.fill = _data.color_font;
		
		if(_data.haveVideo)
			Canvas.drawText(ctx, _data.text, new Rect(0, 155, ctx.viewportWidth, 20), custo_f);
		else		
			Canvas.drawText(ctx, _data.text, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo_f);
		
		tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0, null, null, null,"destination-over");
		
		ctx.drawObject(ctx.endObject());
	}	
}

promotions_template_1.drawList03 = function drawList03(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 
		if(_data.color_rect && !focus){
			var custoW = JSON.stringify(this.themaData.outLineGeneralPanelNoFocusR);
				custoW = JSON.parse(custoW);
				custoW.fill = null;	
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW); //FONDO	
		}else{
			var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
				custo = JSON.parse(custo);
				custo.stroke = _data.color_selector;
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		}
	
		// 3.- titulo
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		custo_f.fill = _data.color_font;
		
		if(_data.haveVideo)
			Canvas.drawText(ctx, _data.text, new Rect(0, 155, ctx.viewportWidth, 20), custo_f);
		else		
			Canvas.drawText(ctx, _data.text, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo_f);
		
		tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0, null, null, null,"destination-over");
		
		ctx.drawObject(ctx.endObject());
	}	
}

promotions_template_1.drawGeneralPanelList = function drawGeneralPanelList(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "left,top";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.name, new Rect(67, 5, 600, 25), custo_f);
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.adress, new Rect(67, 29, 1147, 41), custo_f);

	ctx.drawObject(ctx.endObject());	
}

promotions_template_1.drawGeneralPanelLCall = function drawGeneralPanelLCall(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.fill = "rgba(120,210,30,1)";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
	
		Canvas.drawText(ctx, _data.text, new Rect(0, 0, ctx.viewportWidth,ctx.viewportHeight), custo_f);

	ctx.drawObject(ctx.endObject());	
}

promotions_template_1.drawListSucs = function drawListSucs(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();

		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
			custo.fill = _data.PromoSucVO.color_rect;
			//custo.stroke = _data.PromoSucVO.selector_color;
			custo.fill_coords = "0,0,.6,-.4";
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	

		// 3.- titulo 
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "left,middle";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		
		Canvas.drawText(ctx,_data.PromoSucVO.name, new Rect(6, 40, ctx.viewportWidth-10, 25), custo_f);
		Canvas.drawText(ctx,_data.PromoSucVO.phone, new Rect(6, 65, ctx.viewportWidth-10, 20), custo_f);
		
		ctx.drawObject(ctx.endObject());
	}
}



promotions_template_1.drawListGallery = function drawListGallery(_data){

	var url = _data.PromoGalleryVO.images.url18X18;

	var drawImage = function (canvas, url){
		var ctx = canvas.getContext("2d");
		ctx.clear();
		
			
		tp_draw.getSingleton().drawImage(url, ctx, 0, 0, null , null, 
			function(){

				if(_data.PromoGalleryVO.description){
					var custoW = {fill: "0-rgba(0, 0, 0, 0)|1-rgba(30, 30, 40, .7)", "fill_coords":"0,0,.5,-.4"};
					Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW); //FONDO
				}
				
				// text			
				var custo_f = JSON.stringify(canvas.themaData.standardFont);
				custo_f = JSON.parse(custo_f);	
				custo_f.text_align = "left,middle";
				custo_f.font_size = 18 * tpng.thema.text_proportion;
		
				Canvas.drawText(ctx,_data.PromoGalleryVO.description, new Rect(835, 146, 314, 428), custo_f);	
				custo_f.text_align = "center,middle";
				Canvas.drawText(ctx,_data.PromoGalleryVO.item, new Rect(1091, 614, 58, 32), custo_f);
				ctx.swapBuffers();				
		});
		
		drawImage = false;
	};

	this.draw = function draw(focus) {
		var canvas = this;
		ctx = this.getContext('2d');
		var custoW = {fill: "rgba(30,30,40,.95)"};

		// NGM.trace('Drawing image: '+url);
		var inCache = NGM.imageCache.get(url, {noload: true});


		if (inCache) {
			// NGM.trace('Drawing cause we\'re in cache');
			drawImage(canvas, url);
		}else{
			Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoW);
			ctx.swapBuffers();

			NGM.imageCache.get(url, {callback: function(img){
				// NGM.trace('loaded:'+img);
				// NGM.dump(arguments, 3);
				ctx.clear();
				ctx.swapBuffers();
				drawImage(canvas, img);
			}});
		}

			
		//tp_draw.getSingleton().drawImage(url, ctx, 0, 0);	// 3.- titulo 
		
	};
};

promotions_template_1.drawArrow = function drawArrow(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     

	//custoX = {fill: "rgba(0,255,0, .8)"};
	//Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportHeight,ctx.viewportHeight], custoX);

	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 19);
    ctx.drawObject(ctx.endObject());
}

promotions_template_1.drawExitsections = function drawExitsections(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     

	//var custoX = {fill: "rgba(220,220,230, .3)"};
//Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth,ctx.viewportHeight], custoX);

	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
	//	custo_f.fill = "rgba(30, 30, 40, 1)";
	//	custo_f.font_size = 15 * tpng.thema.text_proportion;

	custo_f.font_size = 15 * tpng.thema.text_proportion;
	Canvas.drawText(ctx,_data.text, new Rect(0,5,ctx.viewportWidth,20), custo_f);
	tp_draw.getSingleton().drawImage("img/help/4x2-oksalir.png", ctx, 0, 0);

//	Canvas.drawText(ctx,_data.text, new Rect(0, 0, ctx.viewportWidth,ctx.viewportHeight), custo_f);
    ctx.drawObject(ctx.endObject());
}

promotions_template_1.drawStroke = function drawStroke(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
	// RECIBIR COLOR DEL SERVICIO
	
		var custoX = { 
			"fill"  : null,  
			"stroke": data.color,
			"stroke_width": 5, 
			"rx": 0,
			"stroke_pos" : "inside"
		};
		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoX);
	
	ctx.drawObject(ctx.endObject());
}

/*promotions_template_1.prototype.loadPaintImg = function loadPaintImg(_url){
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

promotions_template_1.prototype.imgLoadCb = function imgLoadCb(url, img, arg){
	//Función callback que setea la imagen en el background principal
	//del HOME, adicional cambia el speed de entrada para lograr una 
	//mejor transición.
	if(img.size){
		var bg = arg.home.widgets.gallery;
		bg.setData(url);
		bg.stateChange("enter",500);
	}	
//	delete img;
	//Importante siempre borrar la imagen para no llenar la buffer gráfico.
}


promotions_template_1.prototype.setBackground = function setBackground(_url){

	var bg = this.widgets.gallery;
	//Antes de la carga de la imagen pasamos a medium el background
	//para lograr el efecto de medium a enter
	bg.stateChange("medium");
	this.loadPaintImg(_url);
}

*/
promotions_template_1.drawBackX = function drawBackX(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	tp_draw.getSingleton().drawImage("img/tools/DevsOnion.png", ctx, 0, 0); //tmp el w y h	
	ctx.drawObject(ctx.endObject());	
}

promotions_template_1.drawTerms = function drawTerms(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		custo_f.fill = _data.color;
		Canvas.drawText(ctx, _data.text, new Rect(67, 0,1146, 68), custo_f);
	ctx.drawObject(ctx.endObject());	
}

promotions_template_1.drawBackGallery = function drawBackGallery(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custoW = {fill: "rgba(30,30,40,.95)"};
	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoW);
	ctx.drawObject(ctx.endObject());	
}