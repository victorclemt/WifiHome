FormWidget.registerTypeStandard("confirm");

function confirm(_json, _options){
	this.super(_json, _options);
    this.home;
    this.alias;
}

confirm.inherits(FormWidget);

confirm.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.formP = _data.formP;
	this.formData = _data.formData;
	this.widgets.logoutBg.setData();
	this.widgets.logoutBg.stateChange("enter");
	this.initConfirm();
	/*
	var logoutBg = this.widgets.logoutBg,
		logoutAlert = this.widgets.logoutAlert;
		this.par = "";
		this.bundleVO="";
		this.alias="";
		this.categories = "";
	if(_data.parent.formName == "addOns"){
		this.categories = _data.channels;
		this.par = _data.parent;
		this.bundleVO = _data.bundleVO;
		this.alias=_data.alias;
		logoutBg.setData({"msj": "¿Confirmas un único pago de $"+this.bundleVO.price+" por 1 mes de "+this.bundleVO.name+"?"});
		logoutBg.stateChange("enter");
		
		var buttons = this.widgets.buttons,
			list = [
			{"text": "Sí","imgOn":"img/admin/avatar/1x1-regresar.png","imgOff":"img/admin/avatar/1x1-regresar.png"},
			{"text": "No","imgOn":"img/admin/avatar/1x1-regresar.png","imgOff":"img/admin/avatar/1x1-regresar.png"}
		];
		buttons.setData(list);
		buttons.focusIndexMin = 0;
		buttons.focusIndexMax = 1;
		buttons.stateChange("enter");
	}else{
		this.alias = tpng.user.profile.alias;
		this.onEnterLogout(); 
		this.onEnterButtons();
	}
	*/
	
}


confirm.prototype.initConfirm = function initConfirm(){
	var widgets = this.widgets;
	
	widgets.mainMessage.setData({"text": this.formData.title});
	
	widgets.showInfo.setData({"alias": tpng.user.profile.alias+"", 
							  "avatar":tpng.user.profile.images.url1X1A,
							  "txt1":this.formData.txt1,
							  "txt2": this.formData.txt2,
							  "txt3": this.formData.txt3})
	widgets.buttons.setData([{"text": "Sí","imgOn":"img/admin/logout/1x1_aceptarON.png","imgOff":"img/admin/logout/1x1_aceptarOFF.png"},
							 {"text": "No","imgOn":"img/admin/logout/1x1_regresarON.png","imgOff":"img/admin/logout/1x1_regresarOFF.png"}]);
	
	if(this.formData.txt4){
		widgets.footerList.setData({"subtitle": this.formData.txt4});
	}
	
	this.client.lock();
		widgets.mainMessage.stateChange("enter");
		widgets.buttons.stateChange("enter");
		widgets.showInfo.stateChange("enter");
		widgets.footerList.stateChange("enter");
	this.client.unlock();
	
}

confirm.prototype.onEnterLogout = function onEnterLogout(){
	var logoutBg = this.widgets.logoutBg,
		logoutAlert = this.widgets.logoutAlert;

	logoutBg.setData({"msj": "¿Deseas cerrar tu sesión "+this.alias+"?"});
	logoutBg.stateChange("enter");
	this.home.showHeader("login");
}
confirm.prototype.onEnterButtons = function onEnterButtons(){
	var buttons = this.widgets.buttons,
		list = [
		{"text": "Sí","imgOn":"img/admin/avatar/1x1-regresar.png","imgOff":"img/admin/avatar/1x1-regresar.png"},
		{"text": "No","imgOn":"img/admin/avatar/1x1-regresar.png","imgOff":"img/admin/avatar/1x1-regresar.png"}
	];
	buttons.setData(list);
	buttons.focusIndexMin = 0;
	buttons.focusIndexMax = 1;
	buttons.stateChange("enter");

}
		    	
confirm.prototype.onKeyPress = function onKeyPress(_key){
	var buttons = this.widgets.buttons;
	switch (_key) {
    	case "KEY_RIGHT":
			buttons.scrollNext();
		break;
		case "KEY_LEFT":
			buttons.scrollPrev();
		break;
		case "KEY_IRENTER":
			if (buttons.selectItem.text=="Sí"){
				this.home.closeSection(this);
				//case delete users 
				if(this.formP.asknip == 1){
					this.formP.openNextSection({"valid":true,"sect":"del"});
				}
				else{
					this.formP.openNextSection(true);
				}
			}else if(buttons.selectItem.text=="No"){
				this.home.closeSection(this);
				//case delete users 
				if(this.formP.asknip == 1){
					this.formP.openNextSection({"valid":false,"sect":"del"});
				}
				else{
					this.formP.openNextSection(false);
				}
			}
		break;		
		case "KEY_MENU":
    	case "KEY_IRBACK":
        	this.home.closeSection(this);
			if(this.formP.asknip == 1){
					this.formP.openNextSection({"valid":false,"sect":"del"});
				}
				//case enter users
				else if(this.formP.asknip == 0){
					this.formP.openNextSection({"valid":false,"sect":"enter"});
				}
				else{
					this.formP.openNextSection(false);
				}
        break;
     }
    return true;
	
}

confirm.drawLogoutBg = function drawLogoutBg(data){
	var ctx = this.getContext("2d");
    ctx.beginObject();
	ctx.clear(); 
		
	var custoW = {fill: "rgba(30,30,40, .95)"};    
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);
	
	ctx.drawObject(ctx.endObject());
}


confirm.drawLogoutButton = function drawLogoutButton(data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
    	ctx.beginObject();
		ctx.clear();
		 var custo_t  = JSON.stringify(this.themaData.standardFont);
		 	 custo_t = JSON.parse(custo_t);	 
		 	 
		 	 custo_t.text_align = "center,middle";
		     custo_t.font_size = tpng.thema.text_proportion * 18;
		 	 	
			custoFocus = {  
				fill: "rgba(240,240,250,1)"
			};
		
		if(focus){
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
			custo_t.fill = "rgba(30,30,40,1)";	
			Canvas.drawText(ctx, data.text, new Rect(64,0,122,ctx.viewportHeight), custo_t);	
			tp_draw.getSingleton().drawImage(data.imgOn,ctx, 0, 35,null,null,null);
		}
		else{
			custo = {  
				stroke: "rgba(240,240,250,.7)",
				stroke_width: 2
			};
			//botones
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
				Canvas.drawText(ctx, data.text, new Rect(64,0,122,ctx.viewportHeight), custo_t);
				tp_draw.getSingleton().drawImage(data.imgOff,ctx, 0, 35,null,null,null,"destination-over");	
		}
		
		ctx.drawObject(ctx.endObject());
	}

}

confirm.drawShowInfo = function drawShowInfo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	// img avatar
	tp_draw.getSingleton().drawImage(_data.avatar, ctx, 256, 3);
	
	// alias
	custo_f.text_align = "left,top";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, "Perfil: "+_data.alias, new Rect(320,0,200,22), custo_f);
	
	// datos del perfil
	Canvas.drawText(ctx, _data.txt1, new Rect(320,22,400,22), custo_f);
	Canvas.drawText(ctx, _data.txt2, new Rect(320,44,400,22), custo_f);	
	Canvas.drawText(ctx, _data.txt3, new Rect(320,66,400,22), custo_f);	
	
	
	ctx.drawObject(ctx.endObject());	
}

confirm.drawMainMessage = function drawMainMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,bottom";
	custo_f.font_size = 28 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
	ctx.drawObject(ctx.endObject());	
}