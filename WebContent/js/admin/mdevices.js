function mdevices(config, options){  
    this.super(config, options);
    this.buttons;
    this.home;
    this.state;
    this.focus = "devices";
}


mdevices.inherits(FormWidget);

mdevices.prototype.onEnter = function onEnter(_data){
	
	var w = this.widgets;
	this.home = _data.home;
	var buttons = [
		{"id":"r","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png","img":""}
	];
	//VARIABLE PARA METER EL OTRO ARREGLO Y EL DEL BOTON REGRESAR
	this.buttons = buttons;
	
	w.bg.setData();
	
		w.bg.stateChange("enter");
		
	
	this.home.showHeader();
	this.getmdevices();
	
}

mdevices.prototype.getmdevices = function getmdevices(){
	getServices.getSingleton().call("ADMIN_GET_DEVICES", ,this.responseGetmdevices.bind(this));
}



mdevices.prototype.responseGetmdevices = function responseGetmdevices(response){
	if(response.status == 200){
		var devices = response.data.ResponseVO.arrayTerminals;
		var numdev = response.data.ResponseVO.maxSessions;
		var w = this.widgets; 
		w.header.setData({"devices":numdev});
		w.header.stateChange("enter");
				if(devices.length > 0){
				for(var i = 0; i<devices.length; i++){
					this.buttons.push({"id":devices[i].TerminalVO.id,"text": devices[i].TerminalVO.terminalName,"badge":"img/admin/mdevices/1x1-dispositivo.png","date":devices[i].TerminalVO.registerDate})
				}
				//this.buttons.push({"id":"m","text":"Dispositivos","badge":"img/admin/mdevices/1x1-agregar.png"});
				w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
				w.devices.setData(this.buttons);
				w.leftArrow.stateChange("enter");	
				w.devices.stateChange("enter");
				
				w.devices.setFocus(true);
					if(this.buttons.length > 6){
						this.state = "exit_6";
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
						this.state = "enter_6";
						w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
					}else{
						this.state = "exit_"+this.buttons.length;
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
					    this.state = "enter_"+this.buttons.length;
					    w.rightArrow.setData({"url":"", "line": true, "position": "right"});
					    w.rightArrow.stateChange(this.state);
					}
			}
			else{
				w.message.setData({"text":"No tienes dispositivos asociados a tu cuenta."});
				w.message.stateChange("enter");
			
			}				
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false,,true);
	}
}

mdevices.prototype.unlinkDevice = function unlinkDevice(id){
var params = ["sesId="+id];
	getServices.getSingleton().call("ADMIN_UNLINK_DEVICE", params, this.responseUpdatemdevices.bind(this));
}

mdevices.prototype.responseUpdatemdevices = function responseUpdatemdevices(response){
	if(response.status == 200 && response.data.SessionVO.status == 0 && response.data.SessionVO.message == "Logout exitoso"){
		this.home.closeSection(this);	
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false,,true);		
	}
}



mdevices.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
		switch(this.focus){
			
			case "search":
				switch(_key){
					case "KEY_DOWN":
					case "KEY_MENU":
					case "KEY_IRBACK":
						this.focus = "devices";
						this.home.disableSearchHeader();
						w.devices.setFocus(true);
					break;
					
					default:
						this.home.onKeyPress(_key);
					break;
				}
			break;
			
			case "devices":
			switch(_key){		
				case "KEY_LEFT":
				case "KEY_RIGHT":			
					_key == "KEY_LEFT"
					if(_key == "KEY_LEFT"){
						if(w.devices.scrollPrev()){
							if(w.devices.maxItem > 6){		
										if(w.devices.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.devices.selectIndex == (w.devices.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.devices.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.devices.selectIndex+1 <= w.devices.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
							}
						}
					}
					else{
						if(w.devices.scrollNext()){
							if(w.devices.maxItem > 6){		
										if(w.devices.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.devices.selectIndex == (w.devices.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.devices.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.devices.selectIndex < 4 && w.devices.maxItem-3){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}	
							}
						}
					}	
				break;
				
				case "KEY_IRENTER":
					switch(w.devices.selectItem.id){
						case "r":
							w.bg.stateChange("exit");
							w.devices.stateChange("exit");
							w.header.stateChange("exit");
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							this.home.closeSection(this);
						break;
						
						default:
							if(w.devices.list.length > 0){
								this.unlinkDevice(w.devices.selectItem.id);
							}
							else{
							
							}
						break;
						
					}
				break;
				
				case "KEY_MENU":
				case "KEY_IRBACK":
					w.bg.stateChange("exit");
					w.devices.stateChange("exit");
					w.header.stateChange("exit");
					w.leftArrow.stateChange("exit");
					w.rightArrow.stateChange("exit");
					if(w.message.stateGet() == "enter"){
						w.message.stateChange("exit");
					}
					this.home.closeSection(this);
				break;
				
				case "KEY_UP":
					this.focus = "search";
					this.home.enableSearchHeader();
					w.devices.setFocus(false);
				break;
			}	
		break;	
	}		
	return true;
}




mdevices.drawDevices = function drawDevices(_data){
	
	
		this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    	
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
	
		//título
	    var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "center,middle";
		custo_f.font_size = 20* tpng.thema.text_proportion;
		custo_f.fill = "rgba(255,240,200,1)";	
		Canvas.drawText(ctx, _data.text+"", new Rect(64,3,120,ctx.viewportHeight-6), custo_f);
			if(_data.text != "Regresar" && _data.text != "Dispositivos"){
				Canvas.drawShape(ctx, "rect", [0,144,186,32], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
				custo_f.text_align = "center,middle";
				custo_f.font_size = 16* tpng.thema.text_proportion;
				custo_f.fill = "rgba(255,255,255,1)";	
				var d = _data.date.split(" ");
				Canvas.drawText(ctx, "Desde "+d[0], new Rect(0,140,186,36), custo_f);
				}
		//badge	
		tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);			
			
		//stroke
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		
		
	    
	    ctx.drawObject(ctx.endObject());
	}
}

mdevices.drawBgDevices = function drawBgDevices(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
		 ctx.drawObject(ctx.endObject());
}

mdevices.drawHeaderD = function drawHeaderD(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "left,top";
		custo_t.font_size = 24* tpng.thema.text_proportion;
		custo_t.fill = "rgba(240,240,250,1)";
		Canvas.drawText(ctx, "Dispositivos asociados", new Rect(0,0,ctx.viewportWidth-67,ctx.viewportHeight-6), custo_t);
		custo_t.font_size = 20* tpng.thema.text_proportion;	
		Canvas.drawText(ctx, "Tu cuenta Totalplay te permite tener hasta " +_data.devices+ " dispositivos conectados simultáneamente a tu cuenta. Presiona OK sobre el dispositivo que quieras desconectar.", new Rect(64,38,ctx.viewportWidth-131,ctx.viewportHeight-44), custo_t);
		
		
		ctx.drawObject(ctx.endObject());
}


mdevices.drawArrowsD = function drawArrows(_data){
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

mdevices.drawMessageDevices = function drawMessageDevices(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,middle";
	custo_f.fill = "rgba(240,240,250,1)";
	
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
		
	ctx.drawObject(ctx.endObject());	
}

