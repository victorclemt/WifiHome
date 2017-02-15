FormWidget.registerTypeStandard("logout");

function logout(_json, _options){
	this.super(_json, _options);
    this.home;
    this.alias;
    this.focus = "buttons";
}

logout.inherits(FormWidget);

logout.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	this.alias = tpng.user.profile.alias;
		this.onEnterLogout(); 
		this.onEnterButtons();
	
}


logout.prototype.onEnterLogout = function onEnterLogout(){
	var logoutBg = this.widgets.logoutBg,
		logoutAlert = this.widgets.logoutAlert;

	logoutBg.setData({"msj": "¿Deseas cerrar tu sesión "+this.alias+"?"});
	logoutBg.stateChange("enter");
	//this.home.showHeader("login");
}
logout.prototype.onEnterButtons = function onEnterButtons(){
	var buttons = this.widgets.buttons,
		list = [
		{"text": "Sí","imgOn":"img/admin/logout/1x1_aceptarON.png","imgOff":"img/admin/logout/1x1_aceptarOFF.png"},
		{"text": "No","imgOn":"img/admin/logout/1x1_regresarON.png","imgOff":"img/admin/logout/1x1_regresarOFF.png"}
	];
	buttons.setData(list);
	buttons.focusIndexMin = 0;
	buttons.focusIndexMax = 1;
	buttons.stateChange("enter");

}
	
logout.prototype.responseSendLogOutProfile = function responseSendLogOutProfile(response){
	if(response.status == 200){
		this.home.widgets.stateChange("exit");		
		this.home.widgets.player.setData();	
		this.home.onEnter({"section": this});
		
	}else if(response.status == 0){
		this.home.openSection("miniError", {"home": this.home, "code":response.status, "message":response.error.message, "suggest":response.error.suggest}, false);	
	}else{
		this.home.openSection("miniError", {"home": this.home, "code":response.status, "message":response.error.message, "suggest":response.error.suggest}, false);	
	
	}
}
		    	
logout.prototype.onKeyPress = function onKeyPress(_key){
	
	var buttons = this.widgets.buttons;
	if(this.focus == "buttons"){
	switch (_key) {
	
    	case "KEY_RIGHT":
			buttons.scrollNext();
		break;
		
		case "KEY_LEFT":
			buttons.scrollPrev();
		break;
		
		case "KEY_IRENTER":
			this.focus = "";
			if (buttons.selectIndex == 1){
				this.home.closeSection(this);
			}else{		
				if(this.vodInfo){
					this.vodBuyMovie(this.vodInfo);
				}else{					
					tpng.app.sections = [];
					this.home.closeAllNew(true);
					if(this.home.widgets.programInfo.stateGet() == "more"){
						this.home.hideMoreInfo();
					}
					
					
					getServices.getSingleton().call("ADMIN_SEND_LOGOUT",, this.responseSendLogOutProfile.bind(this));
				}	
			}
			
		break;		
		
		case "KEY_MENU":
    	case "KEY_IRBACK":
        	this.home.closeSection(this);
        break;
        
     }
    return true;
	}
}

drawLogoutBg = function drawLogoutBg(data){
	var ctx = this.getContext("2d");
    ctx.beginObject();
	ctx.clear(); 
	
	var custoTextLogout  = JSON.stringify(this.themaData.standardFont);
		custoTextLogout = JSON.parse(custoTextLogout);
	
	custoTextLogout.font_size = 32;	
	custoTextLogout.text_align = "center,bottom";
	
	Canvas.drawShape(ctx, "rect", [0,0,1280,720], {"fill": "rgba(0,0,0,.9)"});
	//Canvas.drawShape(ctx, "rect", [0,110,ctx.viewportWidth,248], {fill:"rgba(255,255,255,.8)"});
	Canvas.drawText(ctx, data.msj, new Rect(67,110,1146,248), custoTextLogout);
	
	//Canvas.drawShape(ctx, "rect", [322,600,634,44], {fill:"rgba(255,255,255,.3)"});
	custoTextLogout.text_align = "center,middle";
	custoTextLogout.font_size = 16 * tpng.thema.text_proportion;
	custoTextLogout.fill = "rgba(170,170,180,1)";
	
	if(data.type == "vod")
		Canvas.drawText(ctx, "Para cancelar es necesario comunicarte a la Linea Totalplay al  1579-8000| El costo de las suscripciones extra a tu servicio regular.", new Rect(322,600,634,44), custoTextLogout);
	
	ctx.drawObject(ctx.endObject());
}


drawLogoutButton = function drawLogoutButton(data){
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