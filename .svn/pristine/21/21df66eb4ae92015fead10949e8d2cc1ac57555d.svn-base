function email(config, options){  
    this.super(config, options);
    this.buttons;
    this.home;
    this.state;
    this.mail;
    this.focusEmail = "mail";
}

email.inherits(FormWidget);

email.prototype.onEnter = function onEnter(_data){
	var w = this.widgets;
	this.home = _data.home;
	var buttons = [
		{"id":"r","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png","img":""}
	];
	//VARIABLE PARA METER EL OTRO ARREGLO Y EL DEL BOTON REGRESAR
	this.buttons = buttons;
	
	w.bg.setData();
	w.header.setData();
	
	this.client.lock();
		w.bg.stateChange("enter");
		w.header.stateChange("enter");
	this.client.unlock();
	
	this.home.showHeader();
	this.getEmail();
}

email.prototype.getEmail = function getEmail(){
		var w = this.widgets;
		var profile = tpng.user.profile.proId;
		var mail = tpng.user.profile.mail;
		this.buttons.push({"id":profile,"text":mail,"badge":"img/admin/avatar/1x1-avatar.png"});
		w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
				w.maillist.setData(this.buttons);
				w.leftArrow.stateChange("enter");	
				w.maillist.stateChange("enter");
				w.maillist.setFocus(true);
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

email.prototype.updateEmail = function updateEmail(mail){
this.mail = mail.trim();

if(this.mail.length>0){
var params = ["proId="+tpng.user.profile.proId+"&updateType=5&value="+this.mail];
	getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdateEmail.bind(this));
	}
	else{
		this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu nuevo mail: ","text2":"No has ingresado email o el formato es inválido, ingresa uno válido.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, true,,true);	
	}
}

email.prototype.responseUpdateEmail = function responseUpdateEmail(response){
var w = this.widgets;
	if(response.status == 200 && response.data.ResponseVO.status == 0 && response.data.ResponseVO.message == "Operación Exitosa"){
		
		tpng.user.profile.mail = this.mail;
		w.maillist.selectItem.text = tpng.user.profile.mail;
		w.maillist.refresh();
	}else if(response.status == 200 && response.data.ResponseVO.status == -100 && response.data.ResponseVO.message == "Formato invalido de correo"){
		this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu nuevo mail: ","text2":"No has ingresado email o el formato es inválido, ingresa uno válido.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, true,,true);
	}
	else if(response.status != 200){
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);	
	}

}




email.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
		switch(this.focusEmail){	
	//if(this.focusEmail == "search"){
		case "search":
			switch(_key){
				case "KEY_DOWN":
				case "KEY_MENU":
				case "KEY_IRBACK":
					this.home.disableSearchHeader();
					this.focusEmail = "mail";
					w.maillist.setFocus(true);
				break;
				
				default:
					this.home.onKeyPress(_key);
				break;
			}	
		break;
	
		case "mail":
			switch(_key){		
				case "KEY_LEFT":
				case "KEY_RIGHT":			
					_key == "KEY_LEFT"
					if(_key == "KEY_LEFT"){
						if(w.maillist.scrollPrev()){
							if(w.maillist.maxItem > 6){		
										if(w.maillist.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.maillist.selectIndex == (w.maillist.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.maillist.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.maillist.selectIndex+1 <= w.maillist.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
							}
						}
					}
					else{
						if(w.maillist.scrollNext()){
							if(w.maillist.maxItem > 6){		
										if(w.maillist.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.maillist.selectIndex == (w.maillist.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.maillist.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.maillist.selectIndex < 4 && w.maillist.maxItem-3){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}	
							}
						}
					}	
				break;
				
				case "KEY_IRENTER":
					switch(w.maillist.selectItem.id){
						case "r":
							w.bg.stateChange("exit");
							w.header.stateChange("exit");
							w.maillist.stateChange("exit");
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							this.home.closeSection(this);
						break;
						
						default:
							//this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu nuevo mail: ","text2":"No has ingresado email, ingresa uno válido.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":true}, true,,true);
						break;
						
					}
				break;
				
				case "KEY_MENU":
				case "KEY_IRBACK":
					w.bg.stateChange("exit");
					w.header.stateChange("exit");
					w.maillist.stateChange("exit");
					w.leftArrow.stateChange("exit");
					w.rightArrow.stateChange("exit");
					this.home.closeSection(this);
				break;
				
				case "KEY_UP":
					this.home.enableSearchHeader();
					this.focusEmail = "search";
					w.maillist.setFocus(false);
				break;
			}
			break;	
	}
	return true;
}




email.drawEmail = function drawEmail(_data){
	
	
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
		}
		else{
			if(_data.text == undefined){
				_data.text = "Sin correo";
			}
		Canvas.drawText(ctx, _data.text+"", new Rect(3,3,ctx.viewportWidth-6,ctx.viewportHeight-32), custo_f);
		}	
			
		//stroke
		/*
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		*/
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

email.drawBgEmail = function drawBgEmail(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
		 ctx.drawObject(ctx.endObject());
}

email.drawHeaderE = function drawHeaderE(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "left,top";
		custo_t.font_size = 24* tpng.thema.text_proportion;
		custo_t.fill = "rgba(240,240,250,1)";
		Canvas.drawText(ctx, "Correo electrónico", new Rect(0,0,ctx.viewportWidth-67,ctx.viewportHeight-6), custo_t);
		custo_t.font_size = 20* tpng.thema.text_proportion;
		Canvas.drawText(ctx, "A este mail se enviará todo lo relacionado con tu sistema. Llama al "+tpng.user.callCenterPhone+" para agregar o cambiar tu correo.", new Rect(64,38,ctx.viewportWidth-131,ctx.viewportHeight-44), custo_t);
		
		
		ctx.drawObject(ctx.endObject());
}


email.drawArrowsE = function drawArrows(_data){
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

