function nip(config, options){  
    this.super(config, options);
    this.buttons;
    this.home;
    this.state;
    this.root = "";
    this.focus = "";
    this.asknip = 0;
}
//si es root: tiene todos los botones y el primero no se puede clickear(falta ponerle opacidad al primer botón)
//si es usuario: si tiene activo el primer botón aparecen todos los botones, si no lo tiene activo desaparecen


//falta validar en el caso que no es root que cuando desactive el primer botón desaparezca los otros dos botones al mismo tiempo que pone el active false-- listo con algunos detalles
//falta validar que cuando venga del servicio no protegido en el get buttons el primer botón lo ponga en false y no mande los dos últimos botones
 

nip.inherits(FormWidget);

nip.prototype.onEnter = function onEnter(_data){
	var w = this.widgets;
	this.home = _data.home;

	if(_data.nipask)
		this.asknip = _data.nipask;
	var buttons = [
		{"id":"r","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png","img":""}
	];

	this.buttons = buttons;
	
	w.bg.setData();
	w.header.setData();
	
	this.client.lock();
		w.bg.stateChange("enter");
		w.header.stateChange("enter");
	this.client.unlock();

	this.home.showHeader();
	this.getUser();
}

nip.prototype.getUser = function getUser(){
getServices.getSingleton().call("ADMIN_GET_USERS", ,this.responseGetUser.bind(this));

}

nip.prototype.responseGetUser = function responseGetUser(response){

	if(response.error.error == null && response.status == 200){

		this.buttons =[];
		var profiles = response.data.ResponseVO.profiles;
		var w = this.widgets;
		//FUNCIÓN PARA QUE COMPARE LOS IDS, ME TRAIGA LOS VALORES PREDETERMINADOS DE LOS SWITCHES
			//usePassword = rest
			//havePassword = pass
			if(profiles.length >0){
				for(var i = 0; i<profiles.length; i++){
					if(profiles[i].ProfileVO.proId == tpng.user.profile.proId){
						if(!profiles[i].ProfileVO.usePasswd){
							var rest = false;
						}
						else if(profiles[i].ProfileVO.usePasswd){
							var rest = true;
						}
						if(!profiles[i].ProfileVO.havePasswd){
							var pass = false;
						}
						else if(profiles[i].ProfileVO.havePasswd){
							var pass = true;
						}
					}
				}
				
			if(this.asknip == 0){	
						var hasP = false;	
							for(var i = 0; i<profiles.length; i++){
							
								if(profiles[i].ProfileVO.proId == tpng.user.profile.proId){
									if(profiles[i].ProfileVO.havePasswd){
										hasP = true;
										break;
									}
									else{
									
									}
								}
							}
					if(hasP){
						this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"title":"Es necesario ingresar el NIP para acceder a las opciones de este perfil.", "txt1": "Sección: Administra tu NIP","txt4":"Este perfil está protegido por NIP.|Para omitir este paso deberás desactivar tu NIP desde Ajustes > Administra tu NIP."}}, false,null,true);
					}
					else{		
						this.focus = "nip";		
					}
				}
				else{
					this.focus = "nip";
				}
					
			this.getButtons(rest,pass);
					
		}else{
			this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"},false);			
		}				
	}else if(response.error != null){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);			
	}
//}

}

nip.prototype.openNextSection = function openNextSection(_allow){
	if(_allow){
		this.focus = "nip";
		this.asknip = 1;
	}
	else{
		this.home.closeSection(this);
	}
}



nip.prototype.getButtons = function getButtons(rest,pass){
		this.root = tpng.user.profile.isRoot;
		var w = this.widgets;
		//este lleva siempre this.root
		//if(this.root){
		if(this.root){
			if(rest){
			var buttons = [
				{"id":"b","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png"},
				{"id":"a","text": "Comprar CON autorización","badge":"img/admin/nip/1x1-pago.png","active":true},
				{"id":"n","text": "Cambia tu NIP","badge":"img/admin/nip/1x1-cambio.png"},
				{"id":"q","text": "Cambia tu pregunta secreta","badge":"img/admin/nip/1x1-PreguntaSecreta.png"}
			];
			}
			if(!rest){
			var buttons = [
				{"id":"b","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png"},
				{"id":"a","text": "Comprar SIN autorización","badge":"img/admin/nip/1x1-pago.png","active":false},
				{"id":"n","text": "Cambia tu NIP","badge":"img/admin/nip/1x1-cambio.png"},
				{"id":"q","text": "Cambia tu pregunta secreta","badge":"img/admin/nip/1x1-PreguntaSecreta.png"}
				
			];
			}
		}
		else{
			if(pass && rest){
			var buttons = [
				{"id":"b","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png"},
				{"id":"p","text": "Tu cuenta está protegida","badge":"img/admin/nip/1x1-nip.png","active":true},
				{"id":"a","text": "Comprar CON autorización","badge":"img/admin/nip/1x1-pago.png","active":true},
				{"id":"n","text": "Cambia tu NIP","badge":"img/admin/nip/1x1-cambio.png"},
				{"id":"q","text": "Cambia tu pregunta secreta","badge":"img/admin/nip/1x1-PreguntaSecreta.png"}
			];
			}
			if(pass && !rest){
			var buttons = [
				{"id":"b","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png"},
				{"id":"p","text": "Tu cuenta está protegida","badge":"img/admin/nip/1x1-nip.png","active":true},
				{"id":"a","text": "Comprar SIN autorización","badge":"img/admin/nip/1x1-pago.png","active":false},
				{"id":"n","text": "Cambia tu NIP","badge":"img/admin/nip/1x1-cambio.png"},
				{"id":"q","text": "Cambia tu pregunta secreta","badge":"img/admin/nip/1x1-PreguntaSecreta.png"}
				
			];
			}
			if(!pass){
				var buttons = [
					{"id":"b","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png"},
					{"id":"p","text": "Tu cuenta no está protegida","badge":"img/admin/nip/1x1-nip.png","active":false}
				];
			}
		}
			
		
	
			if(buttons.length >0){ 
				w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
				w.nip.setData(buttons);	
				w.leftArrow.stateChange("enter");	
				w.nip.stateChange("enter");
				w.nip.setFocus(true);
				
					if(buttons.length > 6){
						this.state = "exit_6";
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
						this.state = "enter_6";
						w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
					}else{
						this.state = "exit_"+buttons.length;
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
					    this.state = "enter_"+buttons.length;
					    w.rightArrow.setData({"url":"", "line": true, "position": "right"});
					    w.rightArrow.stateChange(this.state);
					}
					
		}else{
			this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"}, false);			
		}				
}

nip.prototype.updatePasswd = function updatePasswd(active){
	if(active){
		var val = "Y";
	}
	else{
		var val = -1;
	}
var params = ["proId="+tpng.user.profile.proId+"&updateType=2&value="+val];
	getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdatePasswd.bind(this));
}

nip.prototype.updateRestricted = function updateRestricted(active){
//checar el type aquí, no saben cual es...
	if(active){
		var val = "Y";	
	}
	else{
		var val = "N";
	}
var params = ["proId="+tpng.user.profile.proId+"&updateType=13&value="+val];
	getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdateRestricted.bind(this));
}


nip.prototype.responseUpdatePasswd = function responseUpdatePasswd(response){
	if(response.status == 200 && response.data.ResponseVO.status == 0 && response.data.ResponseVO.message =="Operación Exitosa"){
		var w = this.widgets;

		if(w.nip.selectItem.active){
		var buttons = [
						{"id":"b","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png"},
						{"id":"p","text": "Tu cuenta está protegida","badge":"img/admin/nip/1x1-nip.png","active":true},
						{"id":"a","text": "Comprar SIN autorización","badge":"img/admin/nip/1x1-pago.png","active":false},
						{"id":"n","text": "Cambia tu nip","badge":"img/admin/nip/1x1-cambio.png"}
					  ];
						tpng.user.profile.havePasswd = true;		  
						w.nip.setData(buttons);
						w.nip.refresh();
						this.state = "exit_"+buttons.length;
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
					    this.state = "enter_"+buttons.length;
					    w.rightArrow.setData({"url":"", "line": true, "position": "right"});
					    w.rightArrow.stateChange(this.state);
		}else{
		var buttons = [
								{"id":"b","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png"},
								{"id":"p","text": "Tu cuenta no está protegida","badge":"img/admin/nip/1x1-nip.png","active":false}
						];
						tpng.user.profile.havePasswd = false;
						w.nip.setData(buttons);
						w.nip.refresh();
						this.state = "exit_"+buttons.length;
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
					    this.state = "enter_"+buttons.length;
					    w.rightArrow.setData({"url":"", "line": true, "position": "right"});
					    w.rightArrow.stateChange(this.state);	
		
		}
	}else if(response.status == 200 && response.error.error == null){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);		
	}else if(response.status != 200 && response.error.error){
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status},false);
	}
}

nip.prototype.responseUpdateRestricted = function responseUpdateRestricted(response){
	if(response.status == 200 && response.data.ResponseVO.status == 0 && response.data.ResponseVO.message =="Operación Exitosa"){
		var w = this.widgets;
		w.nip.redraw(w.nip.selectItem);
		
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status},false);		
	}
}


nip.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
		switch(this.focus){
			case "search":
		//if(this.focus == "search"){
			switch(_key){
				case "KEY_DOWN":
				case "KEY_MENU":
				case "KEY_IRBACK":	
					this.home.disableSearchHeader();
					w.nip.setFocus(true);
					this.focus = "nip";
				break;
				
				default:
					this.home.onKeyPress(_key);
				break;
			}
			break;
			
			case "nip":
				switch(_key){		
					case "KEY_LEFT":
					case "KEY_RIGHT":			
						_key == "KEY_LEFT"
						if(_key == "KEY_LEFT"){
							if(w.nip.scrollPrev()){
								if(w.nip.maxItem > 6){		
											if(w.nip.selectIndex >= 6){
												w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
												w.leftArrow.stateChange("enter");
											}
											if(w.nip.selectIndex == (w.nip.maxItem-1)){
												w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
												w.rightArrow.stateChange(this.state);
											}
											if(w.nip.selectIndex == 0){
												w.leftArrow.setData({"url":"", "line":true, "position": "left"});
												w.leftArrow.stateChange("enter");
											}
											if(w.nip.selectIndex+1 <= w.nip.maxItem-6){
												w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
												w.rightArrow.stateChange(this.state);
											}
								}
							}
						}
						else{
							if(w.nip.scrollNext()){
								if(w.nip.maxItem > 6){		
											if(w.nip.selectIndex >= 6){
												w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
												w.leftArrow.stateChange("enter");
											}
											if(w.nip.selectIndex == (w.nip.maxItem-1)){
												w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
												w.rightArrow.stateChange(this.state);
											}
											if(w.nip.selectIndex == 0){
												w.leftArrow.setData({"url":"", "line":true, "position": "left"});
												w.leftArrow.stateChange("enter");
											}
											if(w.nip.selectIndex < 4 && w.nip.maxItem-3){
												w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
												w.rightArrow.stateChange(this.state);
											}	
								}
							}
						}	
					break;
					
					case "KEY_IRENTER":
						switch(w.nip.selectItem.id){
							case "b":
								w.bg.stateChange("exit");
								w.header.stateChange("exit");
								w.nip.stateChange("exit");
								w.leftArrow.stateChange("exit");
								w.rightArrow.stateChange("exit");
								this.home.closeSection(this);
							break;
							
							case "p":
							//este lleva siempre !this.root
							if(!this.root){
								if(!w.nip.selectItem.active){
									//w.nip.selectItem.active = true;
									this.home.hideHeader();
									this.home.openSection("nipChange", {"home":this.home,"parent":this,"change":false}, true,,true);
									//this.updatePasswd(w.nip.selectItem.active);
								}	
								else{
									w.nip.selectItem.active = false;
									this.updatePasswd(w.nip.selectItem.active);
								}
								
							}	
							break;
						
							case "a":
								if(!w.nip.selectItem.active){
									w.nip.selectItem.active = true;
									this.updateRestricted(w.nip.selectItem.active);
								}	
								else{
									w.nip.selectItem.active = false;
									this.updateRestricted(w.nip.selectItem.active);
								}	
							break;
							
							case "ta":
								if(!w.nip.selectItem.active){
									w.nip.selectItem.active = true;
									w.nip.redraw(w.nip.selectItem);
								}	
								else{
									w.nip.selectItem.active = false;
									w.nip.redraw(w.nip.selectItem);
								}	
							break;
							
							case "n":
								this.home.hideHeader();
								this.home.openSection("nipChange", {"home":this.home,"parent":this,"change":true}, true,,true);
							break;
							
							case "q":
								//this.home.hideHeader();
								this.home.openSection("forgot", {"home":this.home,"parent":this,"change":false}, true,,true);
							break;
						}
					break;
					
					case "KEY_MENU":
					case "KEY_IRBACK":
						w.bg.stateChange("exit");
						w.header.stateChange("exit");
						w.nip.stateChange("exit");
						w.leftArrow.stateChange("exit");
						w.rightArrow.stateChange("exit");
						this.home.closeSection(this);
					break;
					
					case "KEY_UP":
						this.home.enableSearchHeader();
						w.nip.setFocus(false);
						this.focus = "search";
					break;
				}	
				break;
		}
		return true;	
}




nip.drawNip = function drawNip(_data){
	
		
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
		
		
		//título
	if(_data.text == "Regresar" || _data.text == "Cambia tu NIP" || _data.text == "Cambia tu pregunta secreta"){
	    var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "center,middle";
		custo_f.font_size = 18* tpng.thema.text_proportion;
		custo_f.fill = "rgba(255,240,200,1)";	
		Canvas.drawText(ctx, _data.text+"", new Rect(64,3,120,ctx.viewportHeight-6), custo_f);
		//badge	
		tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);			
	}
	//botones de nip
	else{
		if(_data.text == "Tu cuenta está protegida" || _data.text == "Tu cuenta no está protegida"){
			if(!_data.active){
				_data.text == "Tu cuenta no está protegida";	
				tp_draw.getSingleton().drawImage("img/admin/nip/1x1-switchOFF.png", ctx, 0, 72,null, null, null);
			}
			else{
				_data.text == "Tu cuenta está protegida";
				tp_draw.getSingleton().drawImage("img/admin/nip/1x1-switchON.png", ctx, 0, 72,null, null, null);
			}
			//siempre va isRoot
		if(tpng.user.profile.isRoot){
				var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
				custo = JSON.parse(custo);
				custo.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.9)";
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
				}	
		}
		else{
			if(!_data.active){	
				if(_data.text == "Comprar CON autorización"){
					_data.text = "Comprar SIN autorización";
				}
				if(_data.text == "Todos los perfiles piden autorización"){
					_data.text = "Ningún perfil pide autorización";
				}
				tp_draw.getSingleton().drawImage("img/admin/nip/1x1-switchOFFbloq.png", ctx, 0, 72,null, null, null);
			}
			else{
				if(_data.text == "Comprar SIN autorización"){
					_data.text = "Comprar CON autorización";
				}
				if(_data.text == "Ningún perfil pide autorización"){
					_data.text = "Todos los perfiles piden autorización";
				}
				tp_draw.getSingleton().drawImage("img/admin/nip/1x1-switchONbloq.png", ctx, 0, 72,null, null, null);
			}
		}
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "center,middle";
		custo_f.font_size = 18* tpng.thema.text_proportion;
		custo_f.fill = "rgba(255,240,200,1)";	
		Canvas.drawText(ctx, _data.text+"", new Rect(3,125,ctx.viewportWidth-6,45), custo_f);
		//badge	
		tp_draw.getSingleton().drawImage(_data.badge, ctx, 63, 20, null, null, null);		
	
	}	
		//stroke
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
		/*
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);*/
		
	    ctx.drawObject(ctx.endObject());
	}
}

nip.drawBgNip = function drawBgNip(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
		 ctx.drawObject(ctx.endObject());
}

nip.drawHeaderNip = function drawHeaderNip(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "left,top";
		custo_t.font_size = 24* tpng.thema.text_proportion;
		custo_t.fill = "rgba(240,240,250,1)";
		Canvas.drawText(ctx, "Administra tu NIP", new Rect(0,0,ctx.viewportWidth-134,ctx.viewportHeight-6), custo_t);
		custo_t.font_size = 20* tpng.thema.text_proportion;	
		Canvas.drawText(ctx, "Cuando el switch está en \"ON\" se requerirá tu NIP de 4 dígitos para ingresar a tu perfil, así como a algunas secciones de tu sistema. En estado \"OFF\" no se pedirá tu contraseña para realizar acción alguna. ", new Rect(64,38,ctx.viewportWidth-198,ctx.viewportHeight-44), custo_t);
		
		
		ctx.drawObject(ctx.endObject());
}


nip.drawArrowsN = function drawArrowsN(_data){
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

