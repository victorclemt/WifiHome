// phone.js
FormWidget.registerTypeStandard("phone");

function phone(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	
   	this.home;
   	this.phone = [];
   	this.channelNumber = "";
   	this.idProgram ="";
   	this.section = true;
   	this.change = false;
   	
}

phone.inherits(FormWidget);


phone.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.home.showHeader();
	this.getPhones();
}

phone.prototype.getPhones = function getPhones(){
	getServices.getSingleton().call("ADMIN_GET_REMINDERS", , this.responseGetPhones.bind(this));
}

phone.prototype.responseGetPhones = function responseGetPhones(response){
	if(response.status == 200){
		var phones = response.data.ResponseVO.arrayPrograms;
		this.showPhones(phones);
	
	}else{
		this.home.openSection("miniError", {"home": this.home,"code":response.status}, false);
	}
		
}

phone.prototype.showPhones = function showPhones(_phones){

	var widgets = this.widgets,
		listPhones = widgets.listPhones,
		listDates = widgets.listDates,
		panelPhones = widgets.panelPhones,
		rightArrowBottomPhone = widgets.rightArrowBottomPhone,
		leftArrowBottomPhone = widgets.leftArrowBottomPhone,
		lineMenuBottom = widgets.lineMenuBottom,
		lineDates = widgets.lineDates;
		
		leftArrowBottomPhone.setData({"url":"", "line":true, "position": "left"});
		leftArrowBottomPhone.stateChange("enter");
		
	if(_phones == ""){
		this.actualFocus = "phones";
		//panelPhones.setData({"title": "Teléfono", "subTitle": "Encuentra la cadena de tu preferencia y llama a tu sucursal más cercana.", "errorTitle": "No hay teléfonos disponibles", "errorSubtitle":"Puedes programar recordatorios presionando Ok sobre cualquier programa de la guía y presionando Recordar"});
		listDates.stateChange("exitFast");
		lineDates.stateChange("exitFast");
		panelPhones.setData({"title": "Teléfono", "subTitle": "Encuentra la cadena de tu preferencia y llama a tu sucursal más cercana."});
		
		this.actualFocus = "phones";
		for(var i = 0; i < _phones.length; i++){
			_phones[i].ProgramVO.day = returnDay(_phones[i].ProgramVO.startTime);
			_phones[i].ProgramVO.index = i;
		}

		var arrayD = this.returnDates(_phones);		
		var _arrayPhones = [{
			"name": "Regresar",
			"image":"img/profile/1x1-regresar.png",
			"index": -1,
			"color": "0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)",
			"button": true
			},{"name": "Otro número", 
			   "image":"img/profile/1x1-telefono.png",
			   "index":-2,
			   "color":"0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)",
			   "button": true}];
		listPhones.setData(_arrayPhones);
		listDates.setData(arrayD);	   
		
		lineMenuBottom.setData({"position" :_phones.length});
		lineMenuBottom.stateChange("enter");
		lineMenuBottom.redraw();
		
		rightArrowBottomPhone.stateChange("enter");
		listPhones.stateChange("enter");
		listPhones.refresh();
		
		panelPhones.stateChange("enter");
		lineMenuBottom.setData({"position" :1});
		lineMenuBottom.stateChange("enter");
		lineMenuBottom.redraw();
		
		//lineMenuBottom.stateChange("exitFast");
		
	}else{
		panelPhones.setData({"title": "Teléfono", "subTitle": "Encuentra la cadena de tu preferencia y llama a tu sucursal más cercana."});
		
		this.actualFocus = "phones";
		for(var i = 0; i < _phones.length; i++){
			_phones[i].ProgramVO.day = returnDay(_phones[i].ProgramVO.startTime);
			_phones[i].ProgramVO.index = i;
		}

		var arrayD = this.returnDates(_phones);		
		var _arrayPhones = [{
			"name": "Regresar",
			"image":"img/profile/1x1-regresar.png",
			"index": -1,
			"color": "0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)",
			"button": true
			},{"name": "Otro número", 
			   "image":"img/profile/1x1-telefono.png",
			   "index":-2,
			   "color":"0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)",
			   "button": true}];
		
		for(var i = 0; i<_phones.length; i++){
			_arrayPhones.push({
				"id":_phones[i].ProgramVO.id,
				"name":_phones[i].ProgramVO.name,
				"imgProgram":_phones[i].ProgramVO.images.url3X3,
				"imgLogo":_phones[i].ProgramVO.images.url1X1,
				"day":_phones[i].ProgramVO.day,
				"channelNumber":_phones[i].ProgramVO.channelNumber,
				"startDate":_phones[i].ProgramVO.startDate,
				"index":_phones[i].ProgramVO.index,
				"showTittle":_phones[i].ProgramVO.showTittle,
				"button":false
			});
		}
			
		listPhones.setData(_arrayPhones);
		listDates.setData(arrayD);
	
		lineDates.setData({"position" : arrayD.length});
		lineDates.stateChange("enter");
	
		if(_arrayPhones.length <= 6){
			lineMenuBottom.setData({"position" :_arrayPhones.length-1});
			lineMenuBottom.stateChange("enter");
			lineMenuBottom.redraw();
		}
	
		// FLECHAS REMINDERS
		if(_arrayPhones.length > 6){
			rightArrowBottomPhone.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
			rightArrowBottomPhone.stateChange("enter");
		}
		// states 
		
		listPhones.stateChange("enter");
		listPhones.refresh();
		
		listDates.stateChange("enter");
		listDates.setFocus(false);
		//this.home.showMoreInfoButtonsBar(listPhones, 100, listDates, 200, rightArrowBottomReminders, 100);
	}
		panelPhones.stateChange("enter");
}

phone.prototype.returnDates = function returnDates(phones){

	var arrayDates = [],
		x = false;
	
	for(var i = 0; i < phones.length; i++){
		if(arrayDates.length > 0){
			for(var j = 0; j< arrayDates.length; j++){
				if(arrayDates[j].day == returnDay(phones[i].ProgramVO.startTime)){	
					x = false;
				}else{
					x = true;
				}
			}
			if(x){
				arrayDates.push({"id": i, "day": returnDay(phones[i].ProgramVO.startTime),"month": returnMonth(phones[i].ProgramVO.startTime), "num": j});
				x = false;
			}
		}else{
			arrayDates.push({"id": i, "day": returnDay(phones[i].ProgramVO.startTime),"month": returnMonth(phones[i].ProgramVO.startTime),"num": 0});	
		}
	}
	
	return arrayDates;

}

phone.prototype.showButtons = function showButtons(_data){

	var widgets = this.widgets;
	this.actualFocus = "buttons";
	
	widgets.leftArrowBottomPhone2.setData({"url":"", "line":true, "position": "left"});
	widgets.leftArrowBottomPhone2.stateChange("enter");
	
	/*if(widgets.rightArrowBottomPhone == "enter"){
		widgets.rightArrowBottomPhone.stateChange("exit");
	}
	else{
		widgets.lineMenuBottom.stateChange("exit");	
	}*/
	
	
	
	
	var buttons = [
		{"text":"Regresar","Action":"Back","color":"0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)", "image":"img/profile/1x1-regresar.png","name":"Regresar al menú anterior"},
		{"text":"Sucursal 1","Action":1,"color":"", "image":"img/tv/addOnsAdult/btn_nip.jpg","phone":"5511223344","name":"Sucursal 1","address":"Calle 1 Número 1, Col Colonia 1 "},			
		{"text":"Sucursal 2","Action":2,"color":"", "image":"img/tv/addOnsAdult/btn_nip.jpg","phone":"5522334455","name":"Sucursal 2","address":"Calle 2 Número 1, Col Colonia 2 "},
		{"text":"Sucursal 3","Action":3,"color":"", "image":"img/tv/addOnsAdult/btn_nip.jpg","phone":"5533445566","name":"Sucursal 3","address":"Calle 3 Número 1, Col Colonia 3 "},
		{"text":"Sucursal 4","Action":4,"color":"", "image":"img/tv/addOnsAdult/btn_nip.jpg","phone":"5544556677","name":"Sucursal 4","address":"Calle 4 Número 1, Col Colonia 4 "},
		{"text":"Sucursal 5","Action":5,"color":"", "image":"img/tv/addOnsAdult/btn_nip.jpg","phone":"5555667788","name":"Sucursal 5","address":"Calle 5 Número 1, Col Colonia 5 "},
		{"text":"Sucursal 6","Action":6,"color":"", "image":"img/tv/addOnsAdult/btn_nip.jpg","phone":"5566778899","name":"Sucursal 6","address":"Calle 6 Número 1, Col Colonia 6 "}
	];
	  widgets.panelButtons.setData({"name": buttons[0].name, "text":""});		
	//widgets.panelButtons.setData({"name": buttons[1].name, "text":buttons[1].address});
	widgets.panelButtons.stateChange("enter");
	
		if(buttons.length <= 6){
			widgets.lineMenuBottom2.setData({"position" :buttons.length-1});
			widgets.lineMenuBottom2.stateChange("enter");
		}
		else{
			widgets.rightArrowBottomPhone2.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
			widgets.rightArrowBottomPhone2.stateChange("enter");
		}
		
	
	
	
	//poner flechas
	
	this.channelNumber = _data.channelNumber;
	this.idProgram = _data.id;
	widgets.buttons_phone.setData(buttons);
	widgets.buttons_phone.stateChange("enter");
	
}

phone.prototype.makeCall = function makeCall(phone){
	var w = this.widgets;
			this.lastFocus = this.actualFocus;
			this.actualFocus = "";
		w.panelcall.setData({"number":phone});
		w.panelcall.stateChange("enter");
		this.sendCall(phone);					
}

phone.prototype.sendCall = function sendCall(phone){
	var widgets = this.widgets;
	var params = ["mdnDest="+phone];
	getServices.getSingleton().call("ADMIN_SEND_CALL",params, this.responseGetCall.bind(this));
	
	setTimeout(function (){
		widgets.panelcall.stateChange("exit");
		this.actualFocus = this.lastFocus;
		//this.actualFocus = "";	
	}.bind(this), 3000);

}

phone.prototype.responseGetCall = function responseGetCall(response){
	if(response.status == 200){
	}else{
		this.home.openSection("miniError", {"home": this.home,"code":response.status}, false);
	}
		
}

phone.onFocuslistDates = function onFocuslistDates(_focus, _data){
	var widgets = this.widgets,
		listPhones = widgets.listPhones;
	if(_focus && this.section){
		
		if(this.change){
			var position = _data.item.id;
			listPhones.setFocus(false);
			listPhones.scrollTo(position+1);
			listPhones.setFocus(true);
		}
	}else{
	}	
}

phone.onFocusPhones = function onFocusPhones(_focus, _data){
	var widgets = this.widgets;
	if(_focus){
		if(this.actualFocus == "days"){
			widgets.listPhones.setFocus(false);

		}
	}
}


/*
reminders.onFocuslistPhones = function onFocuslistPhones(_focus, _data){
	var widgets = this.widgets,
		listDates = widgets.listDates,
		listPhones = widgets.listPhones;
	if(_focus){
	
		//NGM.dump(_data.item.ProgramVO.day);
	
		for(var i=0; i < listDates.list.length; i++){
			if(_data.item.ProgramVO.day == listDates.list[i].day){
		 	//	NGM.trace("listPhones.selectItem.ProgramVO.day "+_data.item.ProgramVO.day+" listDates.list[i].day "+listDates.list[i].day+" listDates.list[i].x "+listDates.list[i].x);
	 			//listDates.setFocus(false);
	 			//listDates.focusIndex = listDates.list[i].x;
	 			//listDates.setFocus(true);
	 		
		 	 }
	 	 }
	
	}else{
	}	
}
*/

phone.prototype.onKeyPress = function onKeyPress(_key){
	var widgets = this.widgets;
			
	switch(this.actualFocus){ 
		case "phones":
			this.onKeyPresslistPhones(_key);
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

phone.prototype.onKeyPressDates = function onKeyPressDates(_key){
	var widgets = this.widgets,
		listPhones = widgets.listPhones,
		listDates = widgets.listDates,
		buttons = [];
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_RIGHT":
			listDates.scrollNext();
		
		break;
		case "KEY_LEFT":
			listDates.scrollPrev();
		break;
		
		case "KEY_DOWN":
			this.actualFocus = "phones";
			listDates.setFocus(false);
			//listPhones.focusIndex = 2;
			listPhones.setFocus(true);
			this.section = false;
		break;		
				
		case "KEY_UP":
			this.actualFocus = "search";
	   		this.home.enableSearchHeader();
	   		listDates.setFocus(false);
		break;
	}	
	return true;
	
}

phone.prototype.onKeyPresslistPhones = function onKeyPresslistPhones(_key){
	var widgets = this.widgets,
		listDates = widgets.listDates,
		listPhones = widgets.listPhones,
		leftArrowBottomPhone = widgets.leftArrowBottomPhone,
		rightArrowBottomPhone = widgets.rightArrowBottomPhone,
		lineMenuBottom = widgets.lineMenuBottom;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":
			if(listPhones.selectItem.button){
				switch(listPhones.selectItem.index){
					case -1:
						this.home.closeSection(this);
					break;
					
					case -2:
						this.home.openSection("keyboard", {"home":this.home,"type":"ns","text1":"Ingresa el teléfono a marcar: ","text2":"El número ingresado no es válido.","ok":"Llamar","cancel":"Cancelar","parent" : this,"valid":true}, false,,true);	
					break; 
				}
			}	
			else{
				this.showButtons(listPhones.selectItem);
				}
			
		break;
			
		case "KEY_RIGHT":
	 	 	listPhones.scrollNext();		
			if(listPhones.maxItem > 6){
				if(listPhones.selectIndex >= 6){
					leftArrowBottomPhone.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					leftArrowBottomPhone.stateChange("enter");
					lineMenuBottom.stateChange("exit");
				}
				if(listPhones.selectIndex == (listPhones.maxItem-1)){
					rightArrowBottomPhone.setData({"url": "" ,"line":true, "position": "right"});
					rightArrowBottomPhone.stateChange("enter");
				}	
				

			}
				
			for(var i=0; i < listDates.list.length; i++){
				if(listPhones.selectItem.day == listDates.list[i].day){
			 	 	if(listPhones.selectItem.index == listDates.list[i].id){
			 	 		if(listPhones.selectIndex == 1 || listPhones.selectIndex == 2){		 	 	
			 	 		}else{
				 	 		listDates.scrollNext();
			 	 		}	
			 	 	}
			 	 }
			}
			
		break;
		
				
		case "KEY_LEFT":
			listPhones.scrollPrev();	 
			if(listPhones.maxItem > 6){
				if(listPhones.selectIndex == 0){	
					leftArrowBottomPhone.setData({"url":"", "line":true, "position": "left"});
					leftArrowBottomPhone.stateChange("enter");
				}
				
				if(listPhones.selectIndex+1 <= (listPhones.maxItem-6)){
					rightArrowBottomPhone.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
					rightArrowBottomPhone.stateChange("enter");
				}
			}			
								
			for(var i=0; i < listDates.list.length; i++){
				if(listPhones.selectItem.day < listDates.list[i].day){
			 	 	this.section = false;
				 	listDates.scrollPrev();
			 	 }
	 	 	}
			
		break;
		
		case "KEY_UP":
			if(listDates.stateGet() == "enter"){
				listDates.setFocus(true);
				listPhones.setFocus(false);
				this.actualFocus = "days";
				this.section = true;
			}
			else{
				this.actualFocus = "search";
	   			this.home.enableSearchHeader();
	   			listPhones.setFocus(false);
			}
		break;		
		/*
		case "KEY_TV_RED":
			this.widgets.rectPanel.setData();
			this.widgets.rectPanel.stateChange("enter");
		break;
		*/
	}	
	return true;
}

phone.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
	var widgets = this.widgets,
		listDates = widgets.listDates,
		listPhones = widgets.listPhones,
		buttons = widgets.buttons_phone,
		lineMenuBottom2 = widgets.lineMenuBottom2,
		panelButtons = widgets.panelButtons,
		leftArrowBottomPhone2 = widgets.leftArrowBottomPhone2,
		rightArrowBottomPhone2 = widgets.rightArrowBottomPhone2;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			buttons.stateChange("exit");
			panelButtons.stateChange("exit");
			//lineMenuBottom.stateChange("exit");
			if(lineMenuBottom2.stateGet()=="enter"){
				lineMenuBottom2.stateChange("exit");
			}
			else{
				rightArrowBottomPhone2.stateChange("exit");
			}
			leftArrowBottomPhone2.stateChange("exit");
			//lineButtons.stateChange("exit");
			this.actualFocus = "phones";
		break;
		
		case "KEY_IRENTER":
			switch(buttons.selectItem.Action){
			
				case "Back":
					buttons.stateChange("exit");
					panelButtons.stateChange("exit");
					if(lineMenuBottom2.stateGet()==="enter"){
						lineMenuBottom2.stateChange("exit");
					}
					else{
						rightArrowBottomPhone2.stateChange("exit");
					}
					leftArrowBottomPhone2.stateChange("exit");
					
					//lineButtons.stateChange("exit");
					this.actualFocus = "phones";
				break;

				/*case "Ir":
					this.home.tuneInByNumber(this.channelNumber);
				break;

				case "removeReminder":
					this.actualFocus = "phones";
					listPhones.stateChange("exit");		
					this.timer = setTimeout(function(){
						buttons.stateChange("exit");
						lineButtons.stateChange("exit");
						panelButtons.stateChange("exit");
					}.bind(this), 900);
					this.home.setReminder(this.idProgram);
					this.getPhones();
				break;*/
				
				default:
					this.makeCall(buttons.selectItem.phone);
					//this.lastFocus = this.actualFocus;
					//this.actualFocus = "";
					//NGM.dump(buttons.selectItem.phone);
				break;
			}
		break;
				
		/*case "KEY_LEFT":
		case "KEY_RIGHT":
			_key == "KEY_LEFT" ? buttons.scrollPrev() : buttons.scrollNext();
			 
			 if(buttons.selectIndex == 0){
			 	panelButtons.setData({"name": "Regresar al menú anterior", "text":""});
			 }
			 else{
			 	panelButtons.setData({"name": buttons.selectItem.name, "text":buttons.selectIndex.address});
			 }
			 panelButtons.refresh();
		case "KEY_UP":
		break;*/
		
		case "KEY_LEFT":
			buttons.scrollPrev();
			//if(buttons.selectItem.name
			panelButtons.setData({"name": buttons.selectItem.name, "text":buttons.selectItem.address});
			panelButtons.refresh();			 
			if(buttons.maxItem > 6){
				if(buttons.selectIndex == 0){	
					leftArrowBottomPhone2.setData({"url":"", "line":true, "position": "left"});
					leftArrowBottomPhone2.stateChange("enter");
				}
				
				if(buttons.selectIndex+1 <= (buttons.maxItem-6)){
					rightArrowBottomPhone2.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
					rightArrowBottomPhone2.stateChange("enter");
				}
			}	
		break;
		
		case "KEY_RIGHT":
	 	 	buttons.scrollNext();		
			panelButtons.setData({"name": buttons.selectItem.name, "text":buttons.selectItem.address});
			panelButtons.refresh();			 
			if(buttons.maxItem > 6){
				if(buttons.selectIndex >= 6){
					leftArrowBottomPhone2.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					leftArrowBottomPhone2.stateChange("enter");
					lineMenuBottom2.stateChange("exit");
				}
				if(buttons.selectIndex == (buttons.maxItem-1)){
					rightArrowBottomPhone2.setData({"url": "" ,"line":true, "position": "right"});
					rightArrowBottomPhone2.stateChange("enter");
				}	
				

			}
			break;		
		
	}
	return true;
}

phone.prototype.onKeyPressNothing = function onKeyPressNothing(_key){
	
	switch(_key){	
		case "KEY_IRBACK":
		case "KEY_MENU":
		case "KEY_IRENTER":
			this.home.closeSection(this);
		break;	
	}
	return true;
}

phone.prototype.onKeyPressSearch = function onKeyPressSearch(_key){	
	var widgets = this.widgets;
			
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			//CÓDIGO PARA ACTIVAR LA SECCIÓN
			//HABILITAR FOCUS, REDRAWS, ETC
		if(widgets.listDates.stateGet() == "enter"){
			this.home.disableSearchHeader();
			this.actualFocus = "days";
			widgets.listDates.setFocus(true);  
    	}
    	else{
    		this.home.disableSearchHeader();
    		widgets.listPhones.setFocus(true);
    		this.actualFocus = "phones";
    	}	
		break;
		
		default:
			this.home.onKeyPress(_key);
		break;
	}
	return true
}

phone.drawGeneralPanel = function drawGeneralPanel(_data){ 	
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
	if(_data.errorTitle){
		custo_f.text_align = "center,top";
		Canvas.drawText(ctx, "<!i>"+_data.errorTitle+"<!i>", new Rect(340, 210, 600, 30), custo_f);
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

phone.drawListDates = function drawListDates(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
	
		var custo_f = focus ? JSON.stringify(this.themaData.standardFont) : JSON.stringify(this.themaData.standarGrayFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,top";
			custo_f.font_size = 20 * tpng.thema.text_proportion;
		
		// day
		Canvas.drawText(ctx,_data.day+"", new Rect(0,5,ctx.viewportWidth,25),custo_f);
		// month
		Canvas.drawText(ctx,_data.month+"", new Rect(0,30,ctx.viewportWidth,25), custo_f);
		
	ctx.drawObject(ctx.endObject());
	}	
}

/*
reminders.drawlistPhones = function drawlistPhones(_data){ 	

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


phone.drawListPhones = function drawListPhones(_data){ 	

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
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoBackground); //FONDO
			tp_draw.getSingleton().drawImage(_data.image, ctx, 0, 35);
			Canvas.drawText(ctx,_data.name, new Rect(70,37,100,50), custo_f);
		}

		//  stroke
		if(_data.color && !focus){
			var custoW = JSON.stringify(this.themaData.outLineGeneralPanelNoFocusR);
				custoW = JSON.parse(custoW);
				custoW.fill = null;	
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW); //FONDO	
		}else{
			var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
				custo = JSON.parse(custo);
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		}
	
		if(_data.showTittle)
			Canvas.drawText(ctx,_data.name, new Rect(0,30,ctx.viewportWidth,60), custo_f);
		
		// image program	
		tp_draw.getSingleton().drawImage(_data.imgProgram, ctx, 0, 0, null, null, null,"destination-over"); //tmp el w y h
		
		// image logo canal
		tp_draw.getSingleton().drawImage(_data.imgLogo, ctx, 110, 61);
		
		// badge
		if(!_data.button){
			var badge = "img/commons/badges/badge_Recordatorios.png";
			tp_draw.getSingleton().drawImage(badge, ctx, 154, 4);
		}
		custo_f.font_size = 16 * tpng.thema.text_proportion;
		custo_f.text_align = "left,top";
		Canvas.drawText(ctx,_data.startDate, new Rect(5,5,150,30), custo_f);
		
	ctx.drawObject(ctx.endObject());
	}	
}

phone.drawButtonsPhone = function drawButtonsPhone(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
	// fill	
	var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocusReminder);
		custo = JSON.parse(custo);
	if(_data.image == "img/profile/1x1-regresar.png"){
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	
	// titulo 
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		Canvas.drawText(ctx,_data.text, new Rect(70,37,100,50), custo_f);
	
	
	tp_draw.getSingleton().drawImage(_data.image, ctx, 0, 35);
	}
	else{
		tp_draw.getSingleton().drawImage(_data.image, ctx, 0, 0,null, null, null,"destination-over");
		
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
		custo = JSON.parse(custo);
		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		
		
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "left,bottom";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		Canvas.drawText(ctx,_data.text, new Rect(4, 3, ctx.viewportWidth-8, (ctx.viewportHeight/2)-3), custo_f);
		custo_f.text_align = "left,top";
		Canvas.drawText(ctx,_data.phone, new Rect(4, ctx.viewportHeight/2, ctx.viewportWidth-8, (ctx.viewportHeight/2)-3), custo_f);
		
		
		

		
	}	
		ctx.drawObject(ctx.endObject());
	}	
}

phone.drawGeneralPanelButtons = function drawGeneralPanelButtons(_data){ 	
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


phone.drawArrowPhone = function drawArrowPhone(_data){
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

phone.drawArrowPhone2 = function drawArrowPhone2(_data){
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

phone.drawLineBottom = function drawLineBottom(_data){ 	
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

phone.drawLineBottom2 = function drawLineBottom2(_data){ 	
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

/*
phone.drawLineButtons = function drawLineButtons(_data){ 	
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
}*/



phone.drawLineDates = function drawLineDates(_data){ 	
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

phone.drawGeneralPanelCall = function drawGeneralPanelCall(_data){ 	
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
	if(_data.name != undefined){	
		Canvas.drawText(ctx,"<!i>Llamando <!>"+ _data.name, new Rect(0, 0, ctx.viewportWidth,ctx.viewportHeight), custo_f);
	}
	else{
		Canvas.drawText(ctx,"<!i>Llamando <!>"+ _data.number, new Rect(0, 0, ctx.viewportWidth,ctx.viewportHeight), custo_f);
	}
	ctx.drawObject(ctx.endObject());	
}


phone.prototype.onExit = function onExit(){ 

	var widgets = this.widgets;

	widgets.panelPhones.stateChange("exit");
	widgets.listPhones.stateChange("exit");
	widgets.listDates.stateChange("exit");
	widgets.lineDates.stateChange("exit");
	widgets.lineMenuBottom.stateChange("exit");
	widgets.rightArrowBottomPhone.stateChange("exit");
	widgets.leftArrowBottomPhone.stateChange("exit");
	this.home.hideHeader();
}