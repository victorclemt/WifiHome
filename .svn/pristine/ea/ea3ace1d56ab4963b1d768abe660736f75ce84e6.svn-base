// promotions.js

FormWidget.registerTypeStandard("promotions");

function promotions(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
  	this.change = true;
   	
}

promotions.inherits(FormWidget);


promotions.prototype.onEnter = function onEnter(_data){
	var widgets = this.widgets;
	this.home = _data.home;
	this.home.showHeader();
	this.getPromotions();
}

promotions.prototype.onExit = function onExit(){ 

	var widgets = this.widgets;
	widgets.panelPromotions.stateChange("exit");
	widgets.listPromotions.stateChange("exit");
	widgets.linePromotions.stateChange("exit");
	widgets.listDates.stateChange("exit");
	widgets.lineDates.stateChange("exit");
	widgets.rightArrowBottomPromotions.stateChange("exit");
	widgets.leftArrowBottomPromotions.stateChange("exit");
	widgets.buttons_promotions.stateChange("exit");
	widgets.panelButtons.stateChange("exit");
	widgets.lineButtons.stateChange("exit");
	this.home.hideHeader();
}

promotions.prototype.getPromotions = function getPromotions(){
	getServices.getSingleton().call("ADMIN_GET_PROMOS", , this.responseGetPromotions.bind(this));
}

promotions.prototype.responseGetPromotions = function responseGetPromotions(response){
	if(response.status == 200){
		var promotions = response.data.ResponseVO.arrayPromos;
		this.showPromotions(promotions);
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
		
}

promotions.prototype.showPromotions = function showPromotions(_promotions){

	var widgets = this.widgets,
		listPromotions = widgets.listPromotions,
		listDates = widgets.listDates,
		panelPromotions = widgets.panelPromotions,
		rightArrowBottomPromotions= widgets.rightArrowBottomPromotions,
		linePromotions = widgets.linePromotions,
		lineDates = widgets.lineDates;
	
	if(_promotions == ""){
		this.actualFocus = "nothing";
		panelPromotions.setData({"title": "Promociones", "subTitle": "Aprovecha todos los descuentos exclusivos para clientes Totalplay", "NoReminders": "No tienes promociones en tu bandeja de entrada.|Puedes ver todas las promociones aqui "});
		panelPromotions.stateChange("enter");
	}else{
		panelPromotions.setData({"title": "Promociones", "subTitle": "Aprovecha todos los descuentos exclusivos para clientes Totalplay", "NoReminders":""});
		panelPromotions.stateChange("enter");
		this.actualFocus = "promotions";
		for(var i = 0; i < _promotions.length; i++){
			_promotions[i].PromoVO.day = returnDay(_promotions[i].PromoVO.startDate);
			_promotions[i].PromoVO.index = i;
		}

		var arrayD = this.returnDates(_promotions),
			_arrayPromotions = [{
			"name": "Regresar",
			"index": -1,
			"image":"img/profile/1x1-regresar.png",
			"color": "0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)",
			"button": true
			}];
		
		for(var i = 0; i < _promotions.length; i++){
			_arrayPromotions.push({
				"prmId":_promotions[i].PromoVO.prmId,
				"name":_promotions[i].PromoVO.name,
				"day":_promotions[i].PromoVO.day,
				"image": _promotions[i].PromoVO.images.url3X3,
				"startDate":_promotions[i].PromoVO.startDate,
				"index":_promotions[i].PromoVO.index,
				"link":_promotions[i].PromoVO.link,
				"button":false,
				"changePrev": false			
			});
						
			if(_promotions[i+1].PromoVO.day > _promotions[i].PromoVO.day){
				_arrayPromotions[i+1].changePrev = true;
			}
		}
					
		//NGM.dump(arrayD[0]);
		listPromotions.setData(_arrayPromotions);
		listDates.setData(arrayD);
	
		lineDates.setData({"position" : arrayD.length});
		lineDates.stateChange("enter");
	
		linePromotions.setData({"position" :_promotions.length+1});
		linePromotions.stateChange("enter");
	
	
		// FLECHAS REMINDERS
		if(_promotions.length > 5){
			rightArrowBottomPromotions.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
			rightArrowBottomPromotions.stateChange("enter");
		}else{
			//rightArrowBottomPromotions.setData({"url":"", "line":true, "position": "right"});
			//rightArrowBottomPromotions.stateChange("enter");
		}
	
		// states 
		
		listPromotions.stateChange("enter");
		listDates.stateChange("enter");
		//this.home.showMoreInfoButtonsBar(listReminders, 100, listDates, 200, rightArrowBottomReminders, 100);
	}
		
}

promotions.prototype.returnDates = function returnDates(promotions){

	var arrayDates = [],
		x = false;
	
	for(var i = 0; i < promotions.length; i++){
//	NGM.trace("?????? ==== "+ new Date(promotions[i].PromoVO.startDate));
		if(arrayDates.length > 0){
			for(var j = 0; j< arrayDates.length; j++){
				if(arrayDates[j].day == returnDay(promotions[i].PromoVO.startDate)){	
					x = false;
				}else{
					x = true;
				}
			}
			if(x){
				arrayDates.push({"id": i, "day": returnDay(promotions[i].PromoVO.startDate),"month": returnMonth(promotions[i].PromoVO.startDate), "num": j, "focus":false});
				x = false;
			}
		}else{
			arrayDates.push({"id": i, "day": returnDay(promotions[i].PromoVO.startDate),"month": returnMonth(promotions[i].PromoVO.startDate),"num": 0, "focus":false});	
		}
	}
	
	return arrayDates;

}

promotions.prototype.showButtons = function showButtons(_data){

	var widgets = this.widgets;
	this.actualFocus = "buttons";
	widgets.panelButtons.setData({"name": _data.name, "text":"Selecciona una opción: "});
	widgets.panelButtons.stateChange("enter");
	
	var buttons = [
		{
			"text":"Regresar",
			"Action":"Back",
			"color":"0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)",
			"image":"img/profile/1x1-regresar.png"
		},
		{
			"text":"Ir a la promoción",
			"Action":"Ir",
			"link":_data.link,
			"color":"0-rgba(160, 40, 60, 1)|1-rgba(120, 20, 40, 1)",
			"image":"img/profile/1x1-television.png"
		}
	];
	
	widgets.lineButtons.setData({"position" : buttons.length, "section": "buttons"});
	widgets.lineButtons.stateChange("enter");
	
	widgets.buttons_promotions.setData(buttons);
	widgets.buttons_promotions.stateChange("enter");
	
}

promotions.onFocuslistDates = function onFocuslistDates(_focus, _data){
	var widgets = this.widgets,
		listPromotions = widgets.listPromotions;
	if(_focus && this.section){
		if(this.change){
			var position = _data.item.id;
			listPromotions.scrollTo(position+1);
		}
	}else{
	}	
}

promotions.onFocusPromotions = function onFocusPromotions(_focus, _data){
	var widgets = this.widgets;
	if(_focus){
		if(this.actualFocus == "days"){
			//widgets.listPromotions.setFocus(false);
		}
	}
}

promotions.prototype.onKeyPress = function onKeyPress(_key){
	var widgets = this.widgets;
		
	switch(this.actualFocus){
		case "promotions":
			this.onKeyPressListPromotions(_key);
		break;
		case "days":
			this.onKeyPressDates(_key);
		break;
		case "buttons":
		 	this.onKeyPressButtons(_key);
		break;
		case "nothing":
			this.onKeypressNothing(_key);
		break;
		case "search":
			this.onKeyPressSearch(_key);
		break;		
	}
	return true;

}

promotions.prototype.onKeyPressDates = function onKeyPressDates(_key){
	var widgets = this.widgets,
		listPromotions = widgets.listPromotions,
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
			this.actualFocus = "promotions";
			listPromotions.setFocus(false);
			listPromotions.focusIndex = 2;
			listPromotions.setFocus(true);
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

promotions.prototype.onKeyPressListPromotions = function onKeyPressListPromotions(_key){
	var widgets = this.widgets,
	listPromotions = widgets.listPromotions,
	listDates = widgets.listDates,
	leftArrowBottomPromotions = widgets.leftArrowBottomPromotions,
	rightArrowBottomPromotions = widgets.rightArrowBottomPromotions;
	//lineMenuBottom = widgets.lineMenuBottom;	

	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":
			
			if(listPromotions.selectItem.button){
				this.home.closeSection(this);
			}else{
				this.home.openLink(listPromotions.selectItem.link);
			}
		break;
		
		case "KEY_RIGHT":
			listPromotions.scrollNext();
			if(listPromotions.maxItem > 6){
				if(listPromotions.selectIndex >= 6){
					leftArrowBottomPromotions.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					leftArrowBottomPromotions.stateChange("enter");
				//	lineMenuBottom.stateChange("exit");
				}
				if(listPromotions.selectIndex == (listPromotions.maxItem-1)){
					rightArrowBottomPromotions.setData({"url": "" ,"line":true, "position": "right"});
					rightArrowBottomPromotions.stateChange("enter");
				}	
			}

			for(var i=0; i < listDates.list.length; i++){
				if(listPromotions.selectItem.day == listDates.list[i].day){
			 	 	if(listPromotions.selectItem.index == listDates.list[i].id){
			 	 		if(listPromotions.selectIndex == 1){
			 	 		}else{
				 	 		listDates.scrollNext();
				 	 		listPromotions.selectItem.change = true;				 	 		
			 	 		}
			 	 	}
			 	 }
			}

			listDates.selectItem.focus = false;
			listDates.redraw(listDates.selectItem);				
			
		break;
		
		case "KEY_LEFT":
		
			listPromotions.scrollPrev();
			if(listPromotions.maxItem > 6){
				if(listPromotions.selectIndex == 0){	
					leftArrowBottomPromotions.setData({"url":"", "line":true, "position": "left"});
					leftArrowBottomPromotions.stateChange("enter");
				}
				
				if(listPromotions.selectIndex+1 <= (listPromotions.maxItem-6)){
					rightArrowBottomPromotions.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
					rightArrowBottomPromotions.stateChange("enter");
				}
			}
			
			if(listPromotions.selectItem.changePrev == true){
				this.section = false;
		 		listDates.scrollPrev();
			}

			listDates.selectItem.focus = false;
			listDates.redraw(listDates.selectItem);							
		break;
		
		case "KEY_UP":
			this.actualFocus = "days";
			listDates.setFocus(true);
			listPromotions.setFocus(false);
			this.section = true;		
			listDates.selectItem.focus = true;
			listDates.redraw(listDates.selectItem);							
		break;		
		
	}	
	return true;
}

promotions.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
	var widgets = this.widgets,
		listDates = widgets.listDates,
		buttons = widgets.buttons_promotions,
		lineButtons = widgets.lineButtons,
		panelButtons = widgets.panelButtons;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			buttons.stateChange("exit");
			panelButtons.stateChange("exit");
			lineButtons.stateChange("exit");
			this.actualFocus = "promotions";
		break;
		
		case "KEY_IRENTER":
			switch(buttons.selectItem.Action){
				case "Back":
					buttons.stateChange("exit");
					panelButtons.stateChange("exit");
					lineButtons.stateChange("exit");
					this.actualFocus = "promotions";
				break;

				case "Ir":
					var _section = buttons.selectItem.link;
					if(_section.type == "S"){
						// --> SIEMPRE los de tipo "S" cierran el menu y abren otra seccion
						if(_section.ref == "anytimePlayer"){
							this.home.openSection(_section.ref,{"home": this.home, "parameters":_section.parameters},false, ,false);
						}else{
							this.home.openSection(_section.ref,{"home": this.home, "parameters":_section.parameters},true, ,false);					
						}
					}else if(_section.type == "C"){ 
						// --> los de tipo "C" no cierran el menu
						this.home.tuneInByNumber(_section.parameters.channel);
					}else{
						this.home.openLink(_section);
					}
				
				break;

				case "removePromotion":
					buttons.stateChange("exit");
					panelButtons.stateChange("exit");
					lineButtons.stateChange("exit");
				//	this.home.setReminder(this.idProgram);
					this.actualFocus = "promotions";
					this.home.openSection("promotions",{"home":this.home}, false);
				break;
			}
		break;
				
		case "KEY_LEFT":
		case "KEY_RIGHT":
			_key == "KEY_LEFT" ? buttons.scrollPrev() : buttons.scrollNext();

		case "KEY_UP":
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

promotions.prototype.onKeypressNothing = function onKeypressNothing(_key){
	
	switch(_key){	
		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;	
	}
	return true;
}

promotions.prototype.onKeyPressSearch = function onKeyPressSearch(_key){	
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



promotions.drawGeneralPanel = function drawGeneralPanel(_data){ 	
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

promotions.drawListDates = function drawListDates(_data){ 	

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

promotions.drawListPromotions = function drawListPromotions(_data){ 	

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
			var custoBackground = {"fill": _data.color,"fill_coords":"0,0,.6,-.4"};
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoBackground); //FONDO
			tp_draw.getSingleton().drawImage(_data.image, ctx, 0, 35);
			Canvas.drawText(ctx,_data.name, new Rect(70,37,100,25), custo_f);
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
	
		// image program	
	tp_draw.getSingleton().drawImage(_data.image, ctx, 0, 0, null, null, null,"destination-over"); //tmp el w y h		
	ctx.drawObject(ctx.endObject());

	
	}	
}

promotions.drawButtonsPromotions = function drawButtonsPromotions(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
	// fill	
	var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocusReminder);
		custo = JSON.parse(custo);
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	
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

promotions.drawGeneralPanelButtons = function drawGeneralPanelButtons(_data){ 	
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

promotions.drawLinePromotions = function drawLinePromotions(_data){ 	
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
		break;
		case 8:
		break;
	}
	
	ctx.drawObject(ctx.endObject());	
}

promotions.drawLineDates = function drawLineDates(_data){ 	
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


promotions.drawArrowPromotions = function drawArrowPromotions(_data){
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

