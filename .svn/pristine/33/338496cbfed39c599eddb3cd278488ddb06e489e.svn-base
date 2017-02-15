// notifications.js
FormWidget.registerTypeStandard("notifications");

function notifications(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.home;
   	this.section = true;
}

notifications.inherits(FormWidget);


notifications.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.home.showHeader();
	this.getNotifications();
}

notifications.prototype.getNotifications = function getNotifications(){
	getServices.getSingleton().call("ADMIN_GET_NOTIFICATIONS", , this.responseGetNotifications.bind(this));
}

notifications.prototype.responseGetNotifications = function responseGetNotifications(response){
	if(response.status == 200){
		var notifications = response.data.ResponseVO.arrayNotifications;
		this.showNotifications(notifications);
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code": response.status}, false);		
	}
		
}

notifications.prototype.showNotifications = function showNotifications(_notifications){
	var widgets = this.widgets,
		listNotifications = widgets.listNotifications,
		listDates = widgets.listDates,
		panelNotifications = widgets.panelNotifications,
//		rightArrowBottomReminders = widgets.rightArrowBottomReminders,
		lineNotifications = widgets.lineNotifications,
		lineDates = widgets.lineDates;
		
	if(_notifications == ""){
		this.actualFocus = "nothing";
		panelNotifications.setData({"title": "Notificaciones", "subTitle": "Todas las notificaciones que recibas se guardaran aquí", "NoReminders": "No tienes ninguna notificación.|Regresa más tarde. "});
		listDates.stateChange("exitFast");
		lineDates.stateChange("exitFast");
		lineNotifications.stateChange("exitFast");
	}else{
		panelNotifications.setData({"title": "Notificaciones", "subTitle": "Todas las notificaciones que recibas se guardaran aquí"});
	
		// setData
		for(var i = 0; i < _notifications.length; i++){
			_notifications[i].NotificationVO.day = returnDay(_notifications[i].NotificationVO.displayDate);
			_notifications[i].NotificationVO.index = i;
		}
		
		
		this.actualFocus = "notifications";
		var arrayDates = this.returnDates(_notifications),
			_arrayNotifications = [{
			"name": "Regresar",
			"image":"img/profile/1x1-regresar.png",
			"index": -1,
			"color": "0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)",
			"button": true
			}];
		
		for(var i = 0; i<_notifications.length; i++){
			_arrayNotifications.push({
				"notId": _notifications[i].NotificationVO.notId,
				"link": _notifications[i].NotificationVO.link,
				"type": _notifications[i].NotificationVO.type,
				"message":_notifications[i].NotificationVO.message,
				"img": _notifications[i].NotificationVO.images.url3X3,
				"day":_notifications[i].NotificationVO.day,
				"startDate":_notifications[i].NotificationVO.displayDate,
				"index":_notifications[i].NotificationVO.index,
				"button":false,
				"changePrev": false			
			});
						
			if(_notifications[i+1].NotificationVO.day > _notifications[i].NotificationVO.day){
				_arrayNotifications[i+1].changePrev = true;
			}				
		}
		
		listNotifications.setData(_arrayNotifications);
		listDates.setData(arrayDates);
		lineDates.setData({"position" : arrayDates.length});

		listNotifications.stateChange("enter");
		listDates.stateChange("enter");	
		lineDates.stateChange("enter");
	
		// FLECHAS REMINDERS
		if(_notifications.length > 6){
		//	rightArrowBottomReminders.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
		//	rightArrowBottomReminders.stateChange("enter");
		}else{
			lineNotifications.setData({"position" :_notifications.length+1});
			lineNotifications.stateChange("enter");
			lineNotifications.redraw();
	}

	// states 
	//this.home.showMoreInfoButtonsBar(listNotifications, 100, listDates, 200, rightArrowBottomReminders, 100);
	//this.home.showMoreInfoButtonsBar(listNotifications, 100, listDates, 200);	
	}
	panelNotifications.stateChange("enter");

}


notifications.prototype.returnDates = function returnDates(notifications){

	var arrayDates = [],
				 x = false;
			
	for(var i = 0; i < notifications.length; i++){
		if(arrayDates.length > 0){
			for(var j = 0; j< arrayDates.length; j++){
				if(arrayDates[j].day == returnDay(notifications[i].NotificationVO.displayDate)){	
					x = false;
				}else{
					x = true;
				}
			}
			if(x){
				arrayDates.push({"id": i, "day": returnDay(notifications[i].NotificationVO.displayDate),"month": returnMonth(notifications[i].NotificationVO.displayDate), "num": j, "focus":false});
				x = false;
			}
		}else{
			arrayDates.push({"id": i, "day": returnDay(notifications[i].NotificationVO.displayDate),"month": returnMonth(notifications[i].NotificationVO.displayDate),"num": 0, "focus":false});	
		}
	}
	
	return arrayDates;

}


notifications.prototype.showButtons = function showButtons(_data){

	var widgets = this.widgets;
	this.actualFocus = "buttons";
	widgets.panelButtons.setData({"name": _data.message, "text":"Selecciona una opción: "});
	widgets.panelButtons.stateChange("enter");
	
	var buttons = [
		{"text":"Regresar",	"Action":"Back",	"color":"0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)", "image":"img/profile/1x1-regresar.png"},
		{"text":"Ir a la sección",	"Action":"Ir", 	"color":"0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)", "image":"img/profile/1x1-television.png"},			
		{"text":"Eliminar|notificación", "Action":"remove", "color":"0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)", "image":"img/profile/1x1-eliminar.png"}
	];
	
	widgets.lineButtons.setData({"position" : buttons.length});
	widgets.lineButtons.stateChange("enter");

	this.notId = _data.notId;
	this.notType = _data.type;
	
	this.sectionLink = _data.link;
	widgets.buttons_notifications.setData(buttons);
	widgets.buttons_notifications.stateChange("enter");
	
}

notifications.prototype.onKeyPress = function onKeyPress(_key){
	var widgets = this.widgets;
	switch(this.actualFocus){ 
		case "notifications":
			this.onKeyPressListNotifications(_key);
		break;
		case "days":
			this.onKeyPressDates(_key);
		break;
		case "buttons":
			 this.onKeyPressButtons(_key);
		break;
		case "nothing":
			this.onKeyPressNothing(_key);
		break;
		case "search":
			this.onKeyPressSearch(_key);
		break;		
	}
	return true;

}


notifications.prototype.onKeyPressListNotifications = function onKeyPressListNotifications(_key){
	var widgets = this.widgets,
		listDates = widgets.listDates,
		listNotifications = widgets.listNotifications;
//		leftArrowBottomReminders = widgets.leftArrowBottomReminders,
//		rightArrowBottomReminders = widgets.rightArrowBottomReminders,
//		lineMenuBottom = widgets.lineMenuBottom;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":
			if(listNotifications.selectItem.button)
				this.home.closeSection(this);
			else
				this.showButtons(listNotifications.selectItem);
			
		break;
			
		case "KEY_RIGHT":
		
			listNotifications.scrollNext();	
			
			if(listNotifications.maxItem > 6){
				if(listNotifications.selectIndex >= 6){
					leftArrowBottomNotifications.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					leftArrowBottomNotifications.stateChange("enter");
					lineMenuBottom.stateChange("exit");
				}
				if(listNotifications.selectIndex == (listNotifications.maxItem-1)){
					rightArrowBottomNotifications.setData({"url": "" ,"line":true, "position": "right"});
					rightArrowBottomNotifications.stateChange("enter");
				}	
			}
			
			for(var i=0; i < listDates.list.length; i++){
				if(listNotifications.selectItem.day == listDates.list[i].day){
			 	 	if(listNotifications.selectItem.index == listDates.list[i].id){
			 	 		if(listNotifications.selectIndex == 1){
			 	 		}else{
				 	 		listDates.scrollNext();
				 	 		//listReminders.selectItem.change = true;
			 	 		}
			 	 	}
			 	 }
			}

			listDates.selectItem.focus = false;
			listDates.redraw(listDates.selectItem);	
		break;
		
				
		case "KEY_LEFT":
		listNotifications.scrollPrev();	 	 

			if(listNotifications.maxItem > 6){
				if(listNotifications.selectIndex == 0){	
					leftArrowBottomNotifications.setData({"url":"", "line":true, "position": "left"});
					leftArrowBottomNotifications.stateChange("enter");
				}
				
				if(listNotifications.selectIndex+1 <= (listNotifications.maxItem-6)){
					rightArrowBottomNotifications.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
					rightArrowBottomNotifications.stateChange("enter");
				}
			}			

/*	 	 for(var i=0; i < listDates.list.length; i++){
			if(listNotifications.selectItem.day < listDates.list[i].day){
				this.section = false;
				 listDates.scrollPrev();
			 }
	 	 }
*/			
			if(listNotifications.selectItem.changePrev == true){
				this.section = false;
		 		listDates.scrollPrev();
			}

			listDates.selectItem.focus = false;
			listDates.redraw(listDates.selectItem);			 	 		
		break;
		
		case "KEY_UP":
			this.actualFocus = "days";
			listDates.setFocus(true);
			listNotifications.setFocus(false);
			this.section = true;
			listDates.selectItem.focus = true;
			listDates.redraw(listDates.selectItem);
		break;				
	}	
	return true;
}

notifications.prototype.onKeyPressDates = function onKeyPressDates(_key){
	var widgets = this.widgets,
		listNotifications = widgets.listNotifications,
		listDates = widgets.listDates;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_RIGHT":
			listDates.scrollNext();
			listDates.selectItem.focus = true;
			listDates.redraw(listDates.selectItem);			
		break;
		
		case "KEY_LEFT":
			listDates.scrollPrev();
			listDates.selectItem.focus = true;
			listDates.redraw(listDates.selectItem);				
		break;
				
		case "KEY_DOWN":
			this.actualFocus = "notifications";
			listNotifications.setFocus(false);
			listNotifications.setFocus(true);
			this.section = false;
			listDates.selectItem.focus = false;
			listDates.redraw(listDates.selectItem);		
		break;		
		
		case "KEY_UP":
			this.actualFocus = "search";
	   		this.home.enableSearchHeader();
			listDates.selectItem.focus = false;
			listDates.redraw(listDates.selectItem);
		break;
		
	}	
}

notifications.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
	var widgets = this.widgets,
		listDates = widgets.listDates,
		listNotifications = widgets.listNotifications,
		buttons = widgets.buttons_notifications,
		lineButtons = widgets.lineButtons,
		panelButtons = widgets.panelButtons;
		
	switch(_key){	
		
		case "KEY_IRBACK":
		case "KEY_MENU":
			this.actualFocus = "notifications";
			buttons.stateChange("exit");
			panelButtons.stateChange("exit");
			lineButtons.stateChange("exit");
		break;
		
		case "KEY_IRENTER":
			switch(buttons.selectItem.Action){
				case "Back":
					this.actualFocus = "notifications";
					buttons.stateChange("exit");
					panelButtons.stateChange("exit");
					lineButtons.stateChange("exit");
				break;

				case "Ir":
					this.home.openLink(this.sectionLink, null, 13);
				break;

				case "remove":
					this.actualFocus = "notifications";
					listNotifications.stateChange("exit");			
					this.timer = setTimeout(function(){
						buttons.stateChange("exit");
						lineButtons.stateChange("exit");
						panelButtons.stateChange("exit");						
					}.bind(this), 900);
					this.deleteNotifications();
				break;
			}
		break;
		
		case "KEY_LEFT":
		case "KEY_RIGHT":
			_key == "KEY_LEFT" ? buttons.scrollPrev() : buttons.scrollNext();
		
		case "KEY_UP":
		break;		
		
	}	
	return true;
}

notifications.prototype.onKeyPressNothing = function onKeyPressNothing(_key){
	
	switch(_key){	
		case "KEY_IRBACK":
		case "KEY_MENU":
		case "KEY_IRENTER":
			this.home.closeSection(this);
		break;	
	}
	return true;
}

notifications.prototype.onKeyPressSearch = function onKeyPressSearch(_key){	
	var widgets = this.widgets;
			
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":

			//CÓDIGO PARA ACTIVAR LA SECCIÓN
			//HABILITAR FOCUS, REDRAWS, ETC
			this.home.disableSearchHeader();
			this.actualFocus = "days";
			widgets.listDates.setFocus(true);  
			widgets.listDates.selectItem.focus = true;
			widgets.listDates.redraw(listDates.selectItem);					
		break;
		
		default:
			this.home.onKeyPress(_key);
		break;
	}
	return true
}

notifications.onFocuslistDates = function onFocuslistDates(_focus, _data){
	var widgets = this.widgets,
		listNotifications = widgets.listNotifications;
	if(_focus && this.section){
		var position = _data.item.id;
		//listNotifications.setFocus(false);
		listNotifications.scrollTo(position+1);
		//listNotifications.setFocus(true);
	}else{
	}	
}

notifications.onFocusNotifications = function onFocusNotifications(_focus, _data){
	var widgets = this.widgets;
	if(_focus){
		if(this.actualFocus == "days"){
		//	widgets.listNotifications.setFocus(false);
		}
	}
}

notifications.drawGeneralPanel = function drawGeneralPanel(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "left,top";
		custo_f.font_size = 24 * tpng.thema.text_proportion;
		
	Canvas.drawText(ctx, _data.title, new Rect(67, 0, 445, 40), custo_f);
	
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.subTitle, new Rect(130, 36, 700, 40), custo_f);
	
	var custoX = {fill: "rgba(170,170,180,1)"};
	Canvas.drawShape(ctx, "rect", [67,103,1145,1], custoX); //FONDO
	
	if(_data.NoReminders){
		custo_f.text_align = "center,top";
		Canvas.drawText(ctx, _data.NoReminders, new Rect(0, 210, ctx.viewportWidth, 60), custo_f);
	}
	
	if(_data.titleItem){
		Canvas.drawText(ctx, _data.titleItem, new Rect(67, 115, 600, 30), custo_f);
		Canvas.drawText(ctx, "Selecciona una opción: ", new Rect(67, 150, 600, 30), custo_f);
	}
	ctx.drawObject(ctx.endObject());	
}

notifications.drawArrowNotifications = function drawArrowNotifications(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     

	//custoX = {fill: "rgba(255,0,0,.3)"};
	//Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportHeight,ctx.viewportHeight], custoX);
	
	var custoW = {fill: "rgba(220, 220, 230, 1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [11,0,1,ctx.viewportHeight], custoW);
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [17,0,1,ctx.viewportHeight], custoW);	
		
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 36);

    ctx.drawObject(ctx.endObject());
}

notifications.drawListDates = function drawListDates(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 	
		var custo_f = focus ? JSON.stringify(this.themaData.standardFont) : JSON.stringify(this.themaData.standarGrayFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,top";
			custo_f.font_size = 20 * tpng.thema.text_proportion;
	
		if(focus){
			if(_data.focus){
				var custoW = {fill: "rgba(255,255,255,1)"};			
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);	
				custo_f.fill = "rgba(0,190,230,1)";
			}
			custo_f.fill = "rgba(0,190,230,1)";
			Canvas.drawText(ctx,_data.day+"", new Rect(0,5,ctx.viewportWidth,25),custo_f); // day
			Canvas.drawText(ctx,_data.month+"", new Rect(0,30,ctx.viewportWidth,25), custo_f); // month
		}else{
			// day
			Canvas.drawText(ctx,_data.day+"", new Rect(0,5,ctx.viewportWidth,25),custo_f);
			// month
			Canvas.drawText(ctx,_data.month+"", new Rect(0,30,ctx.viewportWidth,25), custo_f);	
		}

		
	ctx.drawObject(ctx.endObject());
	}	
}

notifications.drawListNotifications = function drawListNotifications(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 	
   	 	
   	 	// titulo 
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
	//	Canvas.drawText(ctx,_data.message, new Rect(0,30,ctx.viewportWidth,60), custo_f);
	
		// button
		if(_data.button){		
			var custoBackground = {"fill": _data.color,"fill_coords": "0,0,.6,-.4"};
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custoBackground); //FONDO
			tp_draw.getSingleton().drawImage(_data.image, ctx, 0, 35);
			Canvas.drawText(ctx,_data.name, new Rect(70,37,100,25), custo_f);
		}
		   	 	
		//  stroke
		if(_data.color && !focus){
			var custoW = JSON.stringify(this.themaData.outLineGeneralPanelNoFocusR);
				custoW = JSON.parse(custoW);
				custoW.fill = null;	
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custoW); //FONDO	
		}else{
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
				Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo); //FONDO		
			}
		}
				
		// image notification	
		tp_draw.getSingleton().drawImage(_data.img, ctx, 5, 5, null, null, null,"destination-over"); //tmp el w y h
	
	ctx.drawObject(ctx.endObject());
	}	
}

notifications.drawButtonsNotifications = function drawButtonsNotifications(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
	// fill	
	var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocusReminder);
		custo = JSON.parse(custo);
	if(focus){
		custo.rx = 5;
		custo.stroke_width = 5;
		Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custo); //FONDO
	}else{
		Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo); //FONDO
	}
		
	// titulo 
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		Canvas.drawText(ctx,_data.text, new Rect(64, 37, ctx.viewportWidth-64, 50), custo_f);
	
	
	tp_draw.getSingleton().drawImage(_data.image, ctx, 0, 35);
		
		ctx.drawObject(ctx.endObject());
	}	
}

notifications.drawGeneralPanelButtons = function drawGeneralPanelButtons(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo = JSON.stringify(this.themaData.outLineGeneralPanelP);
	custo = JSON.parse(custo);
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "left,top";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		
		Canvas.drawText(ctx, _data.name, new Rect(67, 5, 1180, 30), custo_f);
		custo_f.font_size = 19 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.text, new Rect(67, 40, 500, 30), custo_f);

	ctx.drawObject(ctx.endObject());
}


notifications.drawLineBottom = function drawLineBottom(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	//var custoW = {fill: "rgba(0, 255, 0, .4)"};
	//Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);

	var custoW = {fill: "rgba(220, 220, 230, 1)"};
	Canvas.drawShape(ctx, "rect", [1,0,1,ctx.viewportHeight], custoW);
	
	switch(_data.position){
		case 1:
			Canvas.drawShape(ctx, "rect", [199,0,1,ctx.viewportHeight], custoW);	
		break;
		case 2:
			Canvas.drawShape(ctx, "rect", [391,0,1,ctx.viewportHeight], custoW);
		break;
		case 3:
			Canvas.drawShape(ctx, "rect", [583,0,1,ctx.viewportHeight], custoW);
		break;	
		case 4:
			Canvas.drawShape(ctx, "rect", [775,0,1,ctx.viewportHeight], custoW);
		break;
		case 5:
			Canvas.drawShape(ctx, "rect", [967,0,1,ctx.viewportHeight], custoW);
		break;
		case 6:
			Canvas.drawShape(ctx, "rect", [1159,0,1,ctx.viewportHeight], custoW);
		break;
		case 7:
			Canvas.drawShape(ctx, "rect", [1159,0,1,ctx.viewportHeight], custoW);
		break;
	}
	
	ctx.drawObject(ctx.endObject());	
}

notifications.drawLineDates = function drawLineDates(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();


	var custoW = {fill: "rgba(255, 255, 255, 1)"};
	//Canvas.drawShape(ctx, "rect", [3,0,1,ctx.viewportHeight], custoW);
	Canvas.drawShape(ctx, "rect", [1,0,1,ctx.viewportHeight], custoW);

	switch(_data.position){
		case 1:
			Canvas.drawShape(ctx, "rect", [71,0,1,ctx.viewportHeight], custoW);	
		break;
		case 2:
			Canvas.drawShape(ctx, "rect", [135,0,1,ctx.viewportHeight], custoW);
		break;
		case 3:
			Canvas.drawShape(ctx, "rect", [199,0,1,ctx.viewportHeight], custoW);
		break;
		case 4:
	Canvas.drawShape(ctx, "rect", [263,0,1,ctx.viewportHeight], custoW);
		break;	
		case 5:
	Canvas.drawShape(ctx, "rect", [327,0,1,ctx.viewportHeight], custoW);
		break;
		case 6:
	Canvas.drawShape(ctx, "rect", [391,0,1,ctx.viewportHeight], custoW);
		break;
		case 7:
	Canvas.drawShape(ctx, "rect", [455,0,1,ctx.viewportHeight], custoW);
		break;
		case 8:
	Canvas.drawShape(ctx, "rect", [519,0,1,ctx.viewportHeight], custoW);
		break;
		case 9:
	Canvas.drawShape(ctx, "rect", [583,0,1,ctx.viewportHeight], custoW);
		break;
		case 10:
	Canvas.drawShape(ctx, "rect", [647,0,1,ctx.viewportHeight], custoW);
		break;
		case 11:
	Canvas.drawShape(ctx, "rect", [711,0,1,ctx.viewportHeight], custoW);
		break;
		case 12:
	Canvas.drawShape(ctx, "rect", [775,0,1,ctx.viewportHeight], custoW);
		break;
		case 13:
	Canvas.drawShape(ctx, "rect", [839,0,1,ctx.viewportHeight], custoW);
		break;
		case 14:
	Canvas.drawShape(ctx, "rect", [903,0,1,ctx.viewportHeight], custoW);
		break;
	}
	ctx.drawObject(ctx.endObject());	
}



notifications.prototype.onExit = function onExit(){ 

	var widgets = this.widgets;
	
	widgets.panelNotifications.stateChange("exit");
	widgets.lineDates.stateChange("exit");
	widgets.listNotifications.stateChange("exit");
	widgets.listDates.stateChange("exit");
	widgets.lineNotifications.stateChange("exit");
	widgets.lineDates.stateChange("exit");
	widgets.lineButtons.stateChange("exit");
	widgets.panelButtons.stateChange("exit");
	widgets.buttons_notifications.stateChange("exit");
	this.home.hideHeader();
}

notifications.prototype.deleteNotifications = function deleteNotifications(){
	var params = ["status=Y","notId="+this.notId,"notType="+this.notType];
	getServices.getSingleton().call("ADMIN_DELETE_NOTIFICATIONS",params, this.responseDeleteNotifications.bind(this));
}

notifications.prototype.responseDeleteNotifications = function responseDeleteNotifications(response){
	if(response.status == 200){
		this.getNotifications();

	}else{
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);		
	}
		
}
