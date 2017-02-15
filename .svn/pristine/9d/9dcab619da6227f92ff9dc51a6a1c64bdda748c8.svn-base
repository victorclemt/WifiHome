// advertising.js
function advertising(config, options){  
    this.super(config, options);
}

advertising.inherits(FormWidget);

advertising.prototype.onEnter = function onEnter(_data){
	
	this.home =  _data.home;
	getServices.getSingleton().call("ADMIN_GET_USER_PROFILE", ,this.responseGetUser.bind(this));
		
}
advertising.prototype.responseGetUser = function responseGetUser(responseCode){
	var widgets = this.widgets;
	if(responseCode.status == 200){	
			
			this.user = responseCode.data.ProfileVO;
			
			var buttons = [];
		
			buttons.push({"id":"BACK","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png","img":""});
			buttons.push({"id":"NEXT","text": "Publicidad Apagada","badge":"img/admin/nip/1x1-pago.png","active":this.user.advertising});
		
			widgets.list.setData(buttons);
			
			
			widgets.bg.setData("");
			widgets.header.setData("");
			widgets.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
			widgets.rightArrow.setData({"url":"", "line": true, "position": "right"});
			
			this.client.lock();
				widgets.list.stateChange("enter");
				widgets.leftArrow.stateChange("enter");
				widgets.rightArrow.stateChange("enter_2");
				widgets.bg.stateChange("enter");
				widgets.header.stateChange("enter");
			this.client.unlock();
	
			this.home.showHeader();
			this.focusAdvertising = "buttons";
			
			
	}else{
		this.home.openSection("miniError", {"home": this.home,"code":response.status, "message":response.error.message,"suggest":response.error.suggest}, false);
	}
}
advertising.prototype.updateAdvertising = function updateAdvertising(_active){

	var active = _active ? "Y" : "N";
	
    var params = ["proId="+tpng.user.profile.proId+"&updateType=17&value="+active];
	getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdate.bind(this));

}
advertising.prototype.responseUpdate = function responseUpdate(response){
	
	
	if(response.status == 200){
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);		
	}
}
advertising.prototype.onKeyPress = function onKeyPress(_key){
	
	switch(this.focusAdvertising){
		case "buttons":
			this.onKeyPress_buttons(_key);
		break;
		case "search":
			this.onKeyPress_search(_key);
		break;
	}
	return true;	
}
advertising.prototype.onKeyPress_search = function onKeyPress_search(_key){	
	var widgets = this.widgets;	
	switch(_key){	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			this.home.disableSearchHeader();
			this.activeFocus = "buttons";
		break;
		
		default:
			this.home.onKeyPress(_key);
		break;
	}
	return true
}
advertising.prototype.onKeyPress_buttons = function onKeyPress_buttons(_key){
	var w = this.widgets;
			switch(_key){		
				case "KEY_LEFT":
				case "KEY_RIGHT":
					_key == "KEY_RIGHT"	? w.list.scrollNext() : w.list.scrollPrev();	
				break;
				
				case "KEY_IRENTER":
				
				switch(w.list.selectItem.id){
				
					case "NEXT":
										
						var active = w.list.selectItem.active ? false : true;
						w.list.selectItem.active = active;
						w.list.redraw(true);	
						this.updateAdvertising(active);
						
					break;
					case "BACK":
						this.home.closeSection(this);
					break;
			
				}
				

				
				break;
				
				case "KEY_MENU":
				case "KEY_IRBACK":
					this.home.closeSection(this);
				break;
				case "KEY_UP":
					this.home.enableSearchHeader();
					this.focusAdvertising = "search";
					w.list.setFocus(false);
				break;
			}
	return true;
}
advertising.drawArrowsE = function drawArrows(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
	var custoW = {fill: "rgba(90,90,90,1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [13,0,2,ctx.viewportHeight], custoW);
	
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [18,0,2,ctx.viewportHeight], custoW);	
	
	
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 71);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}
advertising.drawBgEmail = function drawBgEmail(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
		 ctx.drawObject(ctx.endObject());
}

advertising.drawHeaderE = function drawHeaderE(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "left,top";
		custo_t.font_size = 24* tpng.thema.text_proportion;
		custo_t.fill = "rgba(240,240,250,1)";
		Canvas.drawText(ctx, "Publicidad", new Rect(0,0,ctx.viewportWidth-67,ctx.viewportHeight-6), custo_t);
		custo_t.font_size = 20* tpng.thema.text_proportion;
		Canvas.drawText(ctx, 'Cuando el switch está en "ON" a publicidad aparecerá en el sistema a modo de notificaciones y en la barra de canales. Apágalo para no recibir publiciada.', new Rect(64,38,ctx.viewportWidth-131,ctx.viewportHeight-44), custo_t);
		
		
		ctx.drawObject(ctx.endObject());
}
advertising.drawList = function drawList(_data){
	
	
		this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
		Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
		
		//título
	    var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "center,middle";
		custo_f.font_size = 20* tpng.thema.text_proportion;
		custo_f.fill = "rgba(255,240,200,1)";	
		
		
		
		if(_data.text == "Regresar"){
		//badge	
			tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);	
			Canvas.drawText(ctx, _data.text+"", new Rect(64,3,120,ctx.viewportHeight-6), custo_f);
		}else{
			if(_data.active){
				_data.text = "Publicidad Apagada";
				tp_draw.getSingleton().drawImage("img/admin/nip/1x1-switchOFF.png", ctx, 0, 72,null, null, null);
			}else{
				
				_data.text = "Publicidad Encendida";	
				tp_draw.getSingleton().drawImage("img/admin/nip/1x1-switchON.png", ctx, 0, 72,null, null, null);
			}
			
			Canvas.drawText(ctx, _data.text, new Rect(3,125,ctx.viewportWidth-6,45), custo_f);
		}

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
			custo.fill = null;
			Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo); //FONDO		
		}				
		
	    
	    ctx.drawObject(ctx.endObject());
	}
}
advertising.prototype.onExit = function onExit(_data){
	this.widgets.stateChange("exit");
	this.home.hideHeader();
}