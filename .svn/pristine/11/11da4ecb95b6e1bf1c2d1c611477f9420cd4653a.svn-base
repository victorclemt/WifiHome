// reminders.js
FormWidget.registerTypeStandard("reminders");

function reminders(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData; 
   	
   	this.home;
   	this.reminders = [];
   	this.channelNumber = "";
   	this.idProgram ="";
   	this.section = true;
   	this.change = true;
   	
}

reminders.inherits(FormWidget);


reminders.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.home.showHeader();
	this.getReminders();
}

reminders.prototype.getReminders = function getReminders(){
	getServices.getSingleton().call("ADMIN_GET_REMINDERS", , this.responseGetReminders.bind(this));
}

reminders.prototype.responseGetReminders = function responseGetReminders(response){
	if(response.status == 200){
		var reminders = response.data.ResponseVO.arrayPrograms;
		this.showReminders(reminders);
	
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
		
}

reminders.prototype.showReminders = function showReminders(_reminders){

	var widgets = this.widgets,
		listReminders = widgets.listReminders,
		listDates = widgets.listDates,
		panelReminders = widgets.panelReminders,
		rightArrowBottomReminders = widgets.rightArrowBottomReminders,
		lineMenuBottom = widgets.lineMenuBottom,
		lineDates = widgets.lineDates;
		
	if(_reminders == ""){
		this.actualFocus = "nothing";
		panelReminders.setData({"title": "Recordatorios", "subTitle": "Puedes ver y editar todos tus recordatorios programados aquí", "errorTilte": "No tienes recordatorios programados", "errorSubtitle":"Puedes programar recordatorios presionando Ok sobre cualquier programa de la guía y presionando Recordar"});
		listDates.stateChange("exitFast");
		lineDates.stateChange("exitFast");
		lineMenuBottom.stateChange("exitFast");
		
	}else{
		panelReminders.setData({"title": "Recordatorios", "subTitle": "Puedes ver y editar todos tus recordatorios programados aquí"});
		
		this.actualFocus = "reminders";
		for(var i = 0; i < _reminders.length; i++){
			_reminders[i].ProgramVO.day = returnDay(_reminders[i].ProgramVO.startTime);
			_reminders[i].ProgramVO.index = i;
		}

		var arrayD = this.returnDates(_reminders);		
		var _arrayReminders = [{
			"name": "Regresar",
			"image":"img/profile/1x1-regresar.png",
			"index": -1,
			"color": "0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)",
			"button": true
			}];
		
		for(var i = 0; i<_reminders.length; i++){
			_arrayReminders.push({
				"id":_reminders[i].ProgramVO.id,
				"name":_reminders[i].ProgramVO.name,
				"imgProgram":_reminders[i].ProgramVO.images.url3X3,
				"imgLogo":_reminders[i].ProgramVO.images.url1X1,
				"day":_reminders[i].ProgramVO.day,
				"channelNumber":_reminders[i].ProgramVO.channelNumber,
				"startDate":_reminders[i].ProgramVO.startDate,
				"index":_reminders[i].ProgramVO.index,
				"showTittle":_reminders[i].ProgramVO.showTittle,
				"button":false,
				"changePrev": false			
			});
						
			if(_reminders[i+1].ProgramVO.day > _reminders[i].ProgramVO.day){
				_arrayReminders[i+1].changePrev = true;
			}				

		}
			
			
		listReminders.setData(_arrayReminders);
		listDates.setData(arrayD)
		lineDates.setData({"position" : arrayD.length});
		lineDates.stateChange("enter");
	
		lineMenuBottom.setData({"position" :_reminders.length});
		lineMenuBottom.stateChange("enter");
		lineMenuBottom.redraw();
	
		// FLECHAS REMINDERS
		if(_reminders.length >= 6){
			rightArrowBottomReminders.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
		}else{
			//rightArrowBottomReminders.setData({"url":"", "line":true, "position": "right"});
		}
	
		// states 
		rightArrowBottomReminders.stateChange("enter");
		listReminders.stateChange("enter");
		listReminders.refresh();
		
		listDates.stateChange("enter");
		//this.home.showMoreInfoButtonsBar(listReminders, 100, listDates, 200, rightArrowBottomReminders, 100);
	}
		panelReminders.stateChange("enter");
}

reminders.prototype.returnDates = function returnDates(reminders){

	var arrayDates = [],
		x = false;
	
	for(var i = 0; i < reminders.length; i++){
		if(arrayDates.length > 0){
			for(var j = 0; j< arrayDates.length; j++){
				if(arrayDates[j].day == returnDay(reminders[i].ProgramVO.startTime)){	
					x = false;
				}else{
					x = true;
				}
			}
			if(x){
				arrayDates.push({"id": i, "day": returnDay(reminders[i].ProgramVO.startTime),"month": returnMonth(reminders[i].ProgramVO.startTime), "num": j, "focus":false, "name":reminders[i].ProgramVO.name });
				x = false;
			}
		}else{
			arrayDates.push({"id": i, "day": returnDay(reminders[i].ProgramVO.startTime),"month": returnMonth(reminders[i].ProgramVO.startTime),"num": 0, "focus":false, "name":reminders[i].ProgramVO.name});	
		}


	}
	
	return arrayDates;

}

reminders.prototype.showButtons = function showButtons(_data){

	var widgets = this.widgets;
	this.actualFocus = "buttons";
	widgets.panelButtons.setData({"name": _data.name, "text":"Selecciona una opción: "});
	widgets.panelButtons.stateChange("enter");
	
	var buttons = [
		{"text":"Regresar",				  "Action":"Back",	"color":"0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)", "image":"img/profile/1x1-regresar.png"},
		{"text":"Ir al canal",			  "Action":"Ir", 	"color":"0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)", "image":"img/profile/1x1-television.png"},			
		{"text":"Eliminar|recordatorio",  "Action":"removeReminder", "color":"0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)", "image":"img/profile/1x1-recordatorio.png"}
	];
	
	widgets.lineButtons.setData({"position" : buttons.length, "section": "buttons"});
	widgets.lineButtons.stateChange("enter");
	
	this.channelNumber = _data.channelNumber;
	this.idProgram = _data.id;
	widgets.buttons_reminders.setData(buttons);
	widgets.buttons_reminders.stateChange("enter");
	
}

reminders.onFocuslistDates = function onFocuslistDates(_focus, _data){
	var widgets = this.widgets,
		listReminders = widgets.listReminders;
	if(_focus && this.section){
		if(this.change){
			var position = _data.item.id;
			listReminders.scrollTo(position+1);
		}
		
	}else{
	}	

}

reminders.onFocusReminders = function onFocusReminders(_focus, _data){
	var widgets = this.widgets;
	if(_focus){
		if(this.actualFocus == "days"){
		//	widgets.listReminders.setFocus(true);

		}
	}
}


/*
reminders.onFocuslistReminders = function onFocuslistReminders(_focus, _data){
	var widgets = this.widgets,
		listDates = widgets.listDates,
		listReminders = widgets.listReminders;
	if(_focus){
	
		//NGM.dump(_data.item.ProgramVO.day);
	
		for(var i=0; i < listDates.list.length; i++){
			if(_data.item.ProgramVO.day == listDates.list[i].day){
		 	//	NGM.trace("listReminders.selectItem.ProgramVO.day "+_data.item.ProgramVO.day+" listDates.list[i].day "+listDates.list[i].day+" listDates.list[i].x "+listDates.list[i].x);
	 			//listDates.setFocus(false);
	 			//listDates.focusIndex = listDates.list[i].x;
	 			//listDates.setFocus(true);
	 		
		 	 }
	 	 }
	
	}else{
	}	
}
*/

reminders.prototype.onKeyPress = function onKeyPress(_key){
	var widgets = this.widgets;
			
	switch(this.actualFocus){ 
		case "reminders":
			this.onKeyPressListReminders(_key);
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

reminders.prototype.onKeyPressDates = function onKeyPressDates(_key){
	var widgets = this.widgets,
		listReminders = widgets.listReminders,
		listDates = widgets.listDates,
		buttons = [];
		
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
			this.actualFocus = "reminders";
			listReminders.setFocus(false);
//			listReminders.focusIndex = 2;
			listReminders.setFocus(true);
			this.section = false;
			listDates.selectItem.focus = false;
			listDates.redraw(listDates.selectItem);			
			
		break;		
				
		case "KEY_UP":
			this.actualFocus = "search";
	   		this.home.enableSearchHeader();
	   		listReminders.setFocus(false);
			listDates.selectItem.focus = false;
			listDates.redraw(listDates.selectItem);		
		break;
	}	
	return true;
	
}

reminders.prototype.onKeyPressListReminders = function onKeyPressListReminders(_key){
	var widgets = this.widgets,
		listDates = widgets.listDates,
		listReminders = widgets.listReminders,
		leftArrowBottomReminders = widgets.leftArrowBottomReminders,
		rightArrowBottomReminders = widgets.rightArrowBottomReminders,
		lineMenuBottom = widgets.lineMenuBottom;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":
			if(listReminders.selectItem.button)
				this.home.closeSection(this);
			else
				this.showButtons(listReminders.selectItem);
		break;
			
		case "KEY_RIGHT":
	 	 	listReminders.scrollNext();		

			if(listReminders.maxItem > 6){
				if(listReminders.selectIndex >= 6){
					leftArrowBottomReminders.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					leftArrowBottomReminders.stateChange("enter");
					lineMenuBottom.stateChange("exit");
				}
				if(listReminders.selectIndex == (listReminders.maxItem-1)){
					rightArrowBottomReminders.setData({"url": "" ,"line":true, "position": "right"});
					rightArrowBottomReminders.stateChange("enter");
				}	
			}
			
			for(var i=0; i < listDates.list.length; i++){
				if(listReminders.selectItem.day == listDates.list[i].day){
			 	 	if(listReminders.selectItem.index == listDates.list[i].id){
			 	 		if(listReminders.selectIndex == 1){
			 	 		}else{
				 	 		listDates.scrollNext();
				 	 		listReminders.selectItem.change = true;
			 	 		}
			 	 	}
			 	 }
			}

			listDates.selectItem.focus = false;
			listDates.redraw(listDates.selectItem);						
		break;
		
				
		case "KEY_LEFT":
			
			listReminders.scrollPrev();	 

			if(listReminders.maxItem > 6){
				if(listReminders.selectIndex == 0){	
					leftArrowBottomReminders.setData({"url":"", "line":true, "position": "left"});
					leftArrowBottomReminders.stateChange("enter");
				}
				
				if(listReminders.selectIndex+1 <= (listReminders.maxItem-6)){
					rightArrowBottomReminders.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
					rightArrowBottomReminders.stateChange("enter");
				}
			}			
			
			if(listReminders.selectItem.changePrev == true){
				this.section = false;
		 		listDates.scrollPrev();
			}

			listDates.selectItem.focus = false;
			listDates.redraw(listDates.selectItem);				
		break;
		
		case "KEY_UP":
			this.actualFocus = "days";
			listDates.setFocus(true);
			listReminders.setFocus(false);
			this.section = true;		
			listDates.selectItem.focus = true;
			listDates.redraw(listDates.selectItem);
		break;		
	}	
	return true;
}

reminders.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
	var widgets = this.widgets,
		listDates = widgets.listDates,
		listReminders = widgets.listReminders,
		buttons = widgets.buttons_reminders,
		lineButtons = widgets.lineButtons,
		panelButtons = widgets.panelButtons;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			buttons.stateChange("exit");
			panelButtons.stateChange("exit");
			lineButtons.stateChange("exit");
			this.actualFocus = "reminders";
			this.channelNumber = "";
		break;
		
		case "KEY_IRENTER":
			switch(buttons.selectItem.Action){
			
				case "Back":
					buttons.stateChange("exit");
					panelButtons.stateChange("exit");
					lineButtons.stateChange("exit");
					this.actualFocus = "reminders";
					this.channelNumber = "";
				break;

				case "Ir":
					this.home.tuneInByNumber(this.channelNumber);
				break;

				case "removeReminder":
					this.actualFocus = "reminders";
					listReminders.stateChange("exit");		
					this.timer = setTimeout(function(){
						buttons.stateChange("exit");
						lineButtons.stateChange("exit");
						panelButtons.stateChange("exit");
					}.bind(this), 900);
					this.home.setReminder(this.idProgram);
					this.getReminders();
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

reminders.prototype.onKeyPressNothing = function onKeyPressNothing(_key){
	
	switch(_key){	
		case "KEY_IRBACK":
		case "KEY_MENU":
		case "KEY_IRENTER":
			this.home.closeSection(this);
		break;	
	}
	return true;
}

reminders.prototype.onKeyPressSearch = function onKeyPressSearch(_key){	
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

reminders.drawGeneralPanel = function drawGeneralPanel(_data){ 	
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
	Canvas.drawText(ctx, _data.subTitle, new Rect(130, 43, 700, 40), custo_f);
	
	var custoX = {fill: "rgba(170,170,180,1)"};
	Canvas.drawShape(ctx, "rect", [67,103,1145,1], custoX); //FONDO
	
	// ****** CAMBIO
	if(_data.errorTilte){
		custo_f.text_align = "center,top";
		Canvas.drawText(ctx, "<!i>"+_data.errorTilte+"<!i>", new Rect(340, 210, 600, 30), custo_f);
		custo_f.font_size = 16* tpng.thema.text_proportion;
		Canvas.drawText(ctx, "<!i>"+_data.errorSubtitle+"<!i>", new Rect(0, 245, ctx.viewportWidth, 60), custo_f);		
	}
	
	if(_data.titleItem){
		Canvas.drawText(ctx, _data.titleItem, new Rect(67, 115, 600, 30), custo_f);
		Canvas.drawText(ctx, "Selecciona una opción: ", new Rect(67, 150, 600, 30), custo_f);
	}
	ctx.drawObject(ctx.endObject());	
}

drawBackX = function drawBackX(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	tp_draw.getSingleton().drawImage("img/tools/DevsOnion.png", ctx, 0, 0); //tmp el w y h	
	ctx.drawObject(ctx.endObject());	
}

reminders.drawListDates = function drawListDates(_data){ 	

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

/*
reminders.drawListReminders = function drawListReminders(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 	
   	 	var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

		// titulo 
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
	
		if(_data.ProgramVO.showTittle){
			Canvas.drawText(ctx,_data.ProgramVO.name, new Rect(0,30,ctx.viewportWidth,60), custo_f);
		}
		
		// image program	
		tp_draw.getSingleton().drawImage(_data.ProgramVO.images.url3X3, ctx, 1, 1, null, null, null,"destination-over"); //tmp el w y h
		
		// image logo canal
		tp_draw.getSingleton().drawImage(_data.ProgramVO.images.url1X1, ctx, 110, 61);
		
		// badge
		var badge = "img/commons/badges/badge_Recordatorios.png";
		tp_draw.getSingleton().drawImage(badge, ctx, 153, 4);
		
		custo_f.font_size = 16 * tpng.thema.text_proportion;
		custo_f.text_align = "left,top";
		Canvas.drawText(ctx,_data.ProgramVO.startDate, new Rect(5,5,150,30), custo_f);
		
	ctx.drawObject(ctx.endObject());
	}	
}
*/


reminders.drawListReminders = function drawListReminders(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 	
		
		// titulo 
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		
		// button
		if(_data.button){		
			var custoBackground = {"fill": _data.color,"fill_coords":    "0,0,.6,-.4"};
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], custoBackground); //FONDO
			tp_draw.getSingleton().drawImage(_data.image, ctx, 0, 35);
			Canvas.drawText(ctx,_data.name, new Rect(70,37,100,25), custo_f);
		}

		//  stroke
		if(_data.color && !focus){
			var custoW = JSON.stringify(this.themaData.outLineGeneralPanelNoFocusR);
				custoW = JSON.parse(custoW);
				custoW.fill = null;	
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], custoW); //FONDO	
		}else{
			var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
				custo = JSON.parse(custo);
			if(focus){
				custo.rx = 5;
				custo.stroke_width = 5;
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
				var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_position" : "inside"};
				Canvas.drawShape(ctx, "rect", [6, 6, ctx.viewportWidth-12,ctx.viewportHeight-12], strokeF);
				//388 //222
			}else{
				Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo); //FONDO		
			}
		}
	
		if(_data.showTittle)
			Canvas.drawText(ctx,_data.name, new Rect(5,40,ctx.viewportWidth-10,60), custo_f);
		
		// image program	
		tp_draw.getSingleton().drawImage(_data.imgProgram, ctx, 5, 5, null, null, null,"destination-over"); //tmp el w y h
		
		// image logo canal
		tp_draw.getSingleton().drawImage(_data.imgLogo, ctx, 110, 61);
		
		// badge
		if(!_data.button){
			var badge = "img/commons/badges/badge_Recordatorios.png";
			tp_draw.getSingleton().drawImage(badge, ctx, 159, 9);
		}
		custo_f.font_size = 16 * tpng.thema.text_proportion;
		custo_f.text_align = "left,top";
		Canvas.drawText(ctx,_data.startDate, new Rect(6,10,150,30), custo_f);
		
	ctx.drawObject(ctx.endObject());
	}	
}

reminders.drawButtonsReminders = function drawButtonsReminders(_data){ 	

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

reminders.drawGeneralPanelButtons = function drawGeneralPanelButtons(_data){ 	
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
		
		Canvas.drawText(ctx, _data.name, new Rect(67, 5, 600, 30), custo_f);
		custo_f.font_size = 19 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.text, new Rect(67, 40, 600, 30), custo_f);

	ctx.drawObject(ctx.endObject());	
}


reminders.drawArrowReminders = function drawArrowReminders(_data){
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

reminders.drawLineBottom = function drawLineBottom(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custoW = {fill: "rgba(220, 220, 230, 1)"};
	Canvas.drawShape(ctx, "rect", [1,0,1,ctx.viewportHeight], custoW);
	
	
	switch(_data.position){
		case 1:
			Canvas.drawShape(ctx, "rect", [391,0,1,ctx.viewportHeight], custoW);
		break;
		case 2:
			Canvas.drawShape(ctx, "rect", [583,0,1,ctx.viewportHeight], custoW);
		break;
		case 3:
			Canvas.drawShape(ctx, "rect", [775,0,1,ctx.viewportHeight], custoW);
		break;	
		case 4:
			Canvas.drawShape(ctx, "rect", [967,0,1,ctx.viewportHeight], custoW);
		break;
		case 5:
			Canvas.drawShape(ctx, "rect", [1159,0,1,ctx.viewportHeight], custoW);
		break;
		case 7:
		break;
		case 8:
		break;
	}
	
	ctx.drawObject(ctx.endObject());	
}

reminders.drawLineButtons = function drawLineButtons(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custoW = {fill: "rgba(220, 220, 230, 1)"};
	Canvas.drawShape(ctx, "rect", [1,0,1,ctx.viewportHeight], custoW);
	
	switch(_data.position){
		case 3:
			Canvas.drawShape(ctx, "rect", [583,0,1,ctx.viewportHeight], custoW);
		break;	
	}
	
	ctx.drawObject(ctx.endObject());	
}

reminders.drawLineDates = function drawLineDates(_data){ 	
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


reminders.prototype.onExit = function onExit(){ 

	var widgets = this.widgets;

	widgets.panelReminders.stateChange("exit");
	widgets.listReminders.stateChange("exit");
	widgets.listDates.stateChange("exit");
	widgets.lineDates.stateChange("exit");
	widgets.lineMenuBottom.stateChange("exit");
	widgets.rightArrowBottomReminders.stateChange("exit");
	widgets.leftArrowBottomReminders.stateChange("exit");
	this.home.hideHeader();
}