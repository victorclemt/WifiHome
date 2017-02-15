// favoriteApps.js

FormWidget.registerTypeStandard("favoriteApps");

function favoriteApps(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
}

favoriteApps.inherits(FormWidget);

favoriteApps.prototype.onEnter = function onEnter(_data){	
	this.home = _data.home;
	var widgets = this.widgets;
	this.getFavoriteApps();
}

favoriteApps.prototype.onExit = function onExit(){
	var widgets = this.widgets;
	widgets.panelList.stateChange("exit");
	widgets.headerPanel.stateChange("exit");
	widgets.listApps.stateChange("exit");
	widgets.lineApss.stateChange("exit");
	this.home.hideHeader();	
}

favoriteApps.prototype.getFavoriteApps = function getFavoriteApps(){
	getServices.getSingleton().call("ADMIN_GET_FAVORITE_APPS", , this.responseGetApps.bind(this));
}

favoriteApps.prototype.responseGetApps = function responseGetApps(response){
	if(response.status == 200){
		var apps = response.data.ResponseVO.appsArray;
		this.showApps(apps);
	}else{
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
		
}

favoriteApps.prototype.showApps = function showApps(_apps){
	var widgets = this.widgets;
	this.home.showHeader();
	this.actualFocus = "apps";
	widgets.panelList.setData();
	widgets.panelList.stateChange("enter");
	
	widgets.headerPanel.setData({"text": "Apps Favoritas"});
	widgets.headerPanel.stateChange("enter");	
	
	widgets.listApps.setData(_apps);
	widgets.listApps.stateChange("enter");
	widgets.listApps.setFocus(true);
	widgets.listApps.focusIndex = 1;
	
	widgets.lineApss.setData({"position" : _apps.length});
	widgets.lineApss.stateChange("enter");
}

favoriteApps.prototype.onKeyPress = function onKeyPress(_key){
	
	switch(this.actualFocus){ 
		case "apps":
			this.onKeyPressApps(_key);
		break;
		
		case "search":
			this.onKeyPressSearch(_key);
		break;
	}
	return true;

}

favoriteApps.prototype.onKeyPressApps = function onKeyPressApps(_key){
	var widgets = this.widgets,
		listApps = widgets.listApps;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":
			this.home.openLink(listApps.selectItem.ItemVO.link);
		break;
		
		case "KEY_RIGHT":
		case "KEY_LEFT":
			_key == "KEY_LEFT" ? listApps.scrollPrev() : listApps.scrollNext();
		break;
		
		case "KEY_UP":
			this.actualFocus = "search";
	   		this.home.enableSearchHeader();
	   		listApps.setFocus(false);  
		break;		

		case "KEY_TV_RED":
			//this.widgets.back.setData();
			//this.widgets.back.stateChange("enter");
		break;
	}	
	return true;
}

favoriteApps.prototype.onKeyPressSearch = function onKeyPressSearch(_key){	
	var widgets = this.widgets;
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			//CÓDIGO PARA ACTIVAR LA SECCIÓN
			//HABILITAR FOCUS, REDRAWS, ETC
			this.home.disableSearchHeader();
			this.actualFocus = "apps";
			widgets.listApps.setFocus(true);  
    	break;
		
		default:
			this.home.onKeyPress(_key);
		break;
	}
	return true
}


favoriteApps.drawPanelList = function drawPanelList(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	
	ctx.drawObject(ctx.endObject());	
}

favoriteApps.drawPanelHeader = function drawPanelHeader(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	custo.fill = "rgba(90, 20, 60, .8)";	
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "left,top";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.text, new Rect(67, 3, 600, 25), custo_f);
	ctx.drawObject(ctx.endObject());	
}

favoriteApps.drawListApps = function drawListApps(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
				custo = JSON.parse(custo);
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		
		// IMAGE
		tp_draw.getSingleton().drawImage(_data.ItemVO.images.url3X3, ctx, 0, 0 , null, null, null,"destination-over");
	
		ctx.drawObject(ctx.endObject());
	}
}

favoriteApps.drawLineApps = function drawLineApps(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	//var custoX = {fill: "rgba(225, 0, 0, .4)"};
	//Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoX);
	
	var custoW = {fill: "rgba(220, 220, 230, 1)"};		
		Canvas.drawShape(ctx, "rect", [1,0,1,ctx.viewportHeight], custoW);
		
	switch(_data.position+1){
		case 2:
			Canvas.drawShape(ctx, "rect", [199,0,1,ctx.viewportHeight], custoW);
		break;
		case 3:
			Canvas.drawShape(ctx, "rect", [391,0,1,ctx.viewportHeight], custoW);
		break;
		case 4:
			Canvas.drawShape(ctx, "rect", [583,0,1,ctx.viewportHeight], custoW);
		break;	
		case 5:
			Canvas.drawShape(ctx, "rect", [775,0,1,ctx.viewportHeight], custoW);
		break;
		case 6:
			Canvas.drawShape(ctx, "rect", [967,0,1,ctx.viewportHeight], custoW);
		break;
		case 7:
			Canvas.drawShape(ctx, "rect", [1159,0,1,ctx.viewportHeight], custoW);
		break;
	}
	ctx.drawObject(ctx.endObject());	
}

favoriteApps.drawArrow = function drawArrow(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
    
    
	var custoX = {fill: "rgba(255,0,0,.7)"};
	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoX);

	var custoW = {fill: "rgba(220,220,230,1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [12,0,1,ctx.viewportHeight], custoW);
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [18, 0, 1,ctx.viewportHeight], custoW);	

	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 36);
	
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}

favoriteApps.drawBackX = function drawBackX(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	tp_draw.getSingleton().drawImage("img/tools/DevsOnion.png", ctx, 0, 0); //tmp el w y h	
	ctx.drawObject(ctx.endObject());	
}