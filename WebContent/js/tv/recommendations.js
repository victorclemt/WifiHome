function recommendations(_json, _options){
    this.super(_json, _options);
    this.recommendations;
  	this.actualP;
  	this.focus = "recommendations";
}

recommendations.inherits(FormWidget);


recommendations.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	var w = this.widgets;
	
	this.getRecommendations();
	
	
}

recommendations.prototype.onExit = function onExit(){
			var w = this.widgets;
			w.programInfo.speed = 200;
			w.programInfo.stateChange("exit");
			w.recommendations.stateChange("exit");
			w.header.stateChange("exit");
			w.bg.stateChange("exit");
			w.line.stateChange("exit");
}

recommendations.prototype.getRecommendations = function getRecommendations(){
	getServices.getSingleton().call("RECOMMENDATION_GET_PROGRAM", , this.responseGetRecommendations.bind(this));
}

recommendations.prototype.responseGetRecommendations = function responseGetRecommendations(response){
	if(response.status == 200){
	var w = this.widgets;
	
	this.recommendations = response.data.ResponseVO.arrayPrograms;
	if(this.recommendations.length > 0){
	this.client.lock();	
		w.recommendations.setData(this.recommendations);
		var p = this.getProgramInfo(this.recommendations,this.widgets.recommendations.selectIndex);
	
		if(this.recommendations.length > 6){
			state = "exit_6";
			w.rightArrow.setData({"url":"", "line": false, "position": ""});
			w.rightArrow.stateChange(state);
			state = "enter_6";
			w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": ""});
		}else{
			var state = "exit_"+this.recommendations.length;
			w.rightArrow.setData({"url":"", "line": false, "position": ""});
			w.rightArrow.stateChange(state);
		    state = "enter_"+this.recommendations.length;
		    w.rightArrow.setData({"url":"", "line": true, "position": ""});
		}
	
	
		w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
		w.bg.setData();
		w.programInfo.setData(p);
		w.header.setData();
		w.line.setData();
		this.home.showHeader();
		w.leftArrow.stateChange("enter");
		w.rightArrow.stateChange(state);
		w.bg.stateChange("enter");
		w.programInfo.stateChange("enter");
		w.recommendations.stateChange("enter");
		w.header.stateChange("enter");
		w.line.stateChange("enter");
		w.recommendations.setFocus(true);
	this.client.unlock();
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"}, false);		
	}	
	}else if(response.error){	
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);		
	}	
}

recommendations.onFocusProgramsRec = function onFocusProgramsRec(_focus,_data){
	var w = this.widgets;

	if(_focus){
				w.programInfo.speed = 100;
				w.programInfo.stateChange("exit_2");
				var p = this.getProgramInfo(this.recommendations,this.widgets.recommendations.selectIndex);
				w.programInfo.setData(p);
				w.programInfo.stateChange("enter");	
				w.programInfo.speed = 200;
		}
}


recommendations.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
	switch(this.focus){
	
	case "recommendations":
	
		switch(_key){		
			case "KEY_LEFT":
			case "KEY_RIGHT":			
				_key == "KEY_LEFT"
				if(_key == "KEY_LEFT"){
					if(w.recommendations.scrollPrev()){
								
						if(w.recommendations.maxItem > 6){		
									if(w.recommendations.selectIndex >= 6){
										w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
										w.leftArrow.stateChange("enter");
									}
									if(w.recommendations.selectIndex == (w.recommendations.maxItem-1)){
										w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
										w.rightArrow.stateChange("enter");
									}
									if(w.recommendations.selectIndex == 0){
										w.leftArrow.setData({"url":"", "line":true, "position": "left"});
										w.leftArrow.stateChange("enter");
									}
									if(w.recommendations.selectIndex+1 <= w.recommendations.maxItem-6){
										w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
										w.rightArrow.stateChange("enter");
									}
						}
					}
				}
				else{
					if(w.recommendations.scrollNext()){
						if(w.recommendations.maxItem > 6){		
									if(w.recommendations.selectIndex >= 6){
										w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
										w.leftArrow.stateChange("enter");
									}
									if(w.recommendations.selectIndex == (w.recommendations.maxItem-1)){
										w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
										w.rightArrow.stateChange("enter");
									}
									if(w.recommendations.selectIndex == 0){
										w.leftArrow.setData({"url":"", "line":true, "position": "left"});
										w.leftArrow.stateChange("enter");
									}
									if(w.recommendations.selectIndex < 4 && w.recommendations.maxItem-3){
										w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
										w.rightArrow.stateChange("enter");
									}	
						}
					}
				}	
			break;
			
			case "KEY_IRENTER":
				this.home.tuneInByNumber(w.recommendations.selectItem.number*1,true);
				this.home.hideHeader();
				this.home.closeSection(this);   	
			break;
			
			case "KEY_MENU":
			case "KEY_IRBACK":
				this.home.closeSection(this);
				this.home.hideHeader();
			break;
		
			case "KEY_UP":
				w.recommendations.setFocus(false);
				this.home.enableSearchHeader();
				this.focus = "search";
			break;
		}	
		return true;
	break;
	
	case "search":
		switch(_key){
			case "KEY_DOWN":
			case "KEY_IRBACK":
			case "KEY_MENU":
				w.recommendations.setFocus(true);
				this.home.disableSearchHeader();
				this.focus = "recommendations";
			break;
			
			default:
					this.home.onKeyPress(_key);
			break;
		
		}
		return true;
	break;
	
	}
	
}
recommendations.prototype.getProgramInfo = function getProgramInfo(rec,i){
	var program = rec[i];
	program.section = "recommendations";
	program.id = program.ProgramVO.id*1;
	program.name = program.ProgramVO.name;
	program.number = program.ProgramVO.channelNumber;
	program.startTime = program.ProgramVO.startDate;
	program.endTime = program.ProgramVO.endDate
	program.duration = program.ProgramVO.duration;
	program.description = program.ProgramVO.description;
	program.parentalRating = program.ProgramVO.parentalRating;
	program.tweetFeed = program.ProgramVO.country;
	program.isPopular = program.ProgramVO.isPopular;
	program.useRootPassword = program.ProgramVO.useRootPasswd;
	program.category = program.ProgramVO.category;
	program.hasReminder = false; 
	
	for(var i = 0; i<tpng.app.channelList.length; i++){
		if(tpng.app.channelList[i].ChannelVO.number == program.number){
		program.channelImg = tpng.app.channelList[i].ChannelVO.images.url1X1;
		}
		
	
	}
	return program;
	
}

drawHeaderRec = function drawHeaderRec(){
var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	custo_f.text_align = "left,middle";
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight],{ fill : "rgba(30,120,160,1)"});
	Canvas.drawText(ctx, gettext("HEADER_RECOMMENDATIONS"), new Rect(67, 0,ctx.viewportWidth, ctx.viewportHeight), custo_f);
	ctx.drawObject(ctx.endObject());
}

drawLineRec = function drawLineRec(){
var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight],{ fill : "rgba(90,90,90,1)"});
	 ctx.drawObject(ctx.endObject());
}

drawArrows = function drawArrows(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
	var custoW = {fill: "rgba(90,90,90,1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [13,0,2,ctx.viewportHeight], custoW);
	
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [13,0,2,ctx.viewportHeight], custoW);	
	
	
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 35);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}


drawBgRec = function drawBgRec(){
var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
	 ctx.drawObject(ctx.endObject());
}

drawRecommendationsRec = function drawRecommendationsRec(_data){ 	

	
	this.draw = function draw(focus) {
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	//TEXTO FOCO TÍTULO

	var custoText = JSON.stringify(this.themaData.standardFont);
	custoText = JSON.parse(custoText);	
	custoText.text_align = "center,top";
	custoText.font_size = 18 * tpng.thema.text_proportion;
	
	if(!focus){
		//TEXTO NO FOCO TÍTULO	
		var custoText = JSON.stringify(this.themaData.standardFont);
		custoText = JSON.parse(custoText);
		custoText.text_align = "center,top";
		custoText.font_size = 18 * tpng.thema.text_proportion;
		
		//PANTALLA NEGRA ENCIMA DE IMÁGENES
		var img = "img/menu/3x3_SOMBRAlogos.png";
		tp_draw.getSingleton().drawImage(img, ctx, 0, 0,ctx.viewportWidth,ctx.viewportHeight,null,"destination-over"); //tmp el w y h
		//var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
		//custo = JSON.parse(custo);
		//Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
	}
	
	//VERIFICA QUE ESTÉ EN FOCO PARA PINTAR EL STROKE SI NO PINTA EL OUTLINE GRIS
	 var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
		custo = JSON.parse(custo);
		//OBTIENE LAS IMÁGENES DE CANAL
		for(var i = 0; i<tpng.app.channelList.length; i++){
					if(_data.ProgramVO.channelNumber == tpng.app.channelList[i].ChannelVO.number){
						var img = tpng.app.channelList[i].ChannelVO.images.url1X1;
					}
				}
		//IMAGEN DE FONDO DE ELEMENTO
		tp_draw.getSingleton().drawImage(_data.ProgramVO.images.url3X3, ctx, 0, 0,185,104,null,"destination-over"); //tmp el w y h
		//IMAGEN LOGO DE CANAL
		tp_draw.getSingleton().drawImage(img, ctx, 110, 61,70,38); //tmp el w y h	
		//SI NO TIENE IMAGEN DE PROGRAMA MUESTRA EL TÍTULO
		if(_data.ProgramVO.showTittle == true){
			Canvas.drawText(ctx,_data.ProgramVO.name, new Rect(5,20,ctx.viewportWidth-10,45), custoText);
		}
		
		//STROKE BLANCO U OUTLINE GRIS
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		ctx.drawObject(ctx.endObject());
	}	
}

drawProgramInfoRec = function drawProgramInfoRec(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	
	
    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	
	custo_f.text_align = "left,top";
	custo_f.font_size = 22 * tpng.thema.text_proportion;
		
	//PINTA EL LOGO DE ANYTIME GRIS O ROSA
		for(var i = 0; i<tpng.app.channelList.length; i++){
						if(_data.ProgramVO.channelNumber == tpng.app.channelList[i].ChannelVO.number){
								if(tpng.app.channelList[i].ChannelVO.isCtv){
									tp_draw.getSingleton().drawImage("img/tv/AnytimetvBadgeON.png", ctx, 0, 0);
								}
								else if(tpng.app.channelList[i].ChannelVO.isNpvr){
									tp_draw.getSingleton().drawImage("img/tv/AnytimetvBadgeOFF.png", ctx, 0, 0);
								}
						}
					}
		//NOMBRE DEL PROGRAMA
		Canvas.drawText(ctx, _data.name, new Rect(258, 3, 699, 32), custo_f);
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		var horary = _data.startTime ? startTimeEndTime(_data.ProgramVO.startTime, _data.ProgramVO.endTime): "";
		var timeL = _data.startTime ? timeLeft(_data.ProgramVO.startTime, _data.ProgramVO.endTime): "";
		custo_f.text_align = "right,middle";
		
		//HORARIO DEL PROGRAMA
		custo_f.fill = "rgba(0,190,240,1)";
		Canvas.drawText(ctx,horary, new Rect(972,25,186,20), custo_f);
		
		// IMG TIME
		tp_draw.getSingleton().drawImage("img/tv/miniguia.png", ctx, 966, 20);
		
		//TIEMPO RESTANTE
		//Canvas.drawText(ctx,timeL, new Rect(963,25,186,20), custo_f);
		
		//BARRA PROGRESO GRIS
		var custoLine = { "fill": "rgba(121,121,121,1)" };
		Canvas.drawShape(ctx, "rect", new Rect(258,35,704,5), custoLine);
		
		//BARRA PROGRESO
		var custoLine = { fill: "rgba(121,121,121,1)" };
		Canvas.drawShape(ctx, "rect", new Rect(258,35,704,5), custoLine);
		var percentX = percent(_data.ProgramVO.startTime, _data.ProgramVO.endTime, 704);	
		var custoLinePorcent = { "fill": "rgba(24,166,196,.7)" };
		
		//TIEMPO TRANSCURRIDO
		Canvas.drawShape(ctx, "rect", new Rect(258,35,percentX,5),custoLinePorcent);
		Canvas.drawShape(ctx, "rect", [percentX+258,35,1,5],{"fill" : "rgba(240, 240, 250, 1)"});
			custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "left,top";
			custo_f.font_size = 20 * tpng.thema.text_proportion;
		
			//IMAGEN DE CANAL SOBRE EL NÚMERO DE CANAL
			tp_draw.getSingleton().drawImage(_data.channelImg, ctx, 150, 4);
		
			//NÚMERO DE CANAL
			custo_f.text_align = "center middle";
			Canvas.drawText(ctx,"<!b>"+_data.number+"<!>" , new Rect(150, 42, 58, 32), custo_f);

			//DESCRIPCIÓN DEL PROGRAMA
			custo_f.text_align = "left,top";
			Canvas.drawText(ctx, _data.description, new Rect(258, 76, 890, 68), custo_f);

			//Cambio de color ->
			custo_f.fill = "rgba(130,130,130,1)";

			//CLASIFICACIÓN DEL PROGRAMA
			tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.parentalRating+".png", ctx, 258, 50);			
			custo_f.text_align = "left,middle";
			/*
			//CATEGORIA
			var text = "I<!placeholder=10>"+_data.category;
			//AÑO
			 if (_data.year){
			 text = text +"<!placeholder=10>I<!placeholder=10>"+ _data.year;
			 }

			 //EPISODIO ACTUAL
			 if(_data.ep){
			 text = text +"<!placeholder=10>I<!placeholder=10>"+ _data.ep;
			 }
	//PINTA LA CADENA DE CATEGORIA+AÑO+EPISODIO*/
	Canvas.drawText(ctx, getProgramInfoStr(_data), new Rect(313, 40, 634, 32), custo_f);		
	ctx.drawObject(ctx.endObject());	
}


