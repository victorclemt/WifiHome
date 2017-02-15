function avatar(config, options){  
    this.super(config, options);
    this.buttons;
    this.home;
    this.state;
    this.focus = "avatar";
}
//CAMBIAR TEXTOS DE AVATAR Y DE HEADER ESTÁN AL REVÉS
avatar.inherits(FormWidget);

avatar.prototype.onEnter = function onEnter(_data){
	
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
	this.getAvatars();
}

avatar.prototype.getAvatars = function getAvatars(){
	getServices.getSingleton().call("ADMIN_GET_AVATARS", ,this.responseGetAvatars.bind(this));
}



avatar.prototype.responseGetAvatars = function responseGetAvatars(response){
	if(response.status == 200){
		var avatars = response.data.ResponseVO.avatars;
		
		var w = this.widgets;
				if(avatars.length >0){ 
					for(var i = 0; i<avatars.length; i++){
						this.buttons.push({"id":avatars[i].AvatarVO.cavId,"text": avatars[i].AvatarVO.alias,"badge":"img/admin/avatar/1x1-avatar.png","url1X1A":avatars[i].AvatarVO.images.url1X1A,"urlL":avatars[i].AvatarVO.images.urlL,"url3X5A":avatars[i].AvatarVO.images.url3X5A,"used":avatars[i].AvatarVO.used})
					}
					w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
					w.avatars.setData(this.buttons);
					w.leftArrow.stateChange("enter");	
					w.avatars.stateChange("enter");
					w.avatars.setFocus(true);
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
				this.home.openSection("miniError", {"home": this.home,"suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"}, false);
			}				
	}else if(response.error){	
				this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

avatar.prototype.updateAvatar = function updateAvatar(id){
var params = ["proId="+tpng.user.profile.proId+"&updateType=0&value="+id];
	getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdateAvatar.bind(this));
}

avatar.prototype.responseUpdateAvatar = function responseUpdateAvatar(response){
	var w = this.widgets;
	if(response.status == 200 && response.data.ResponseVO.status == 0 && response.data.ResponseVO.message =="Operación Exitosa"){	
		tpng.user.profile.images.url1X1A = w.avatars.selectItem.url1X1A;
		tpng.user.profile.images.url3X5A = w.avatars.selectItem.url3X5A;
		tpng.user.profile.images.urlL = w.avatars.selectItem.urlL;
		tpng.menu.data = [];
	 	tpng.menu.tsMenu = "";
	 	tpng.menu.lastMenuIndex = 0;
	 	this.home.refreshHeader(0, "img_off", tpng.user.profile.images.url1X1A);
		this.home.closeSection(this);
		
	}else if(response.error){	
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}



avatar.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
		switch(this.focus){
		case "search":
			switch(_key){
			
			case "KEY_DOWN":
			case "KEY_MENU":
			case "KEY_IRBACK":
				this.home.disableSearchHeader();
				w.avatars.setFocus(true);
				this.focus = "avatar";
			break;
			
			default:
				this.home.onKeyPress(_key);
			break;
			
			}
		break;
	
		case "avatar":
			switch(_key){		
				case "KEY_LEFT":
				case "KEY_RIGHT":			
					_key == "KEY_LEFT"
					if(_key == "KEY_LEFT"){
						if(w.avatars.scrollPrev()){
							if(w.avatars.maxItem > 6){		
										if(w.avatars.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.avatars.selectIndex == (w.avatars.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.avatars.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.avatars.selectIndex+1 <= w.avatars.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
							}
						}
					}
					else{
						if(w.avatars.scrollNext()){
							if(w.avatars.maxItem > 6){		
										if(w.avatars.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.avatars.selectIndex == (w.avatars.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.avatars.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.avatars.selectIndex < 4 && w.avatars.maxItem-3){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}	
							}
						}
					}	
				break;
				
				case "KEY_IRENTER":
					switch(w.avatars.selectItem.id){
						case "r":
							w.bg.stateChange("exit");
							w.header.stateChange("exit");
							w.avatars.stateChange("exit");
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							this.home.closeSection(this);
						break;
						
						default:
							this.focus = "";
							this.updateAvatar(w.avatars.selectItem.id);
						break;
						
					}
				break;
				
				case "KEY_UP":
					this.home.enableSearchHeader();
					w.avatars.setFocus(false);
					this.focus = "search";
				break;
				
				
				case "KEY_MENU":
				case "KEY_IRBACK":
					w.bg.stateChange("exit");
					w.header.stateChange("exit");
					w.avatars.stateChange("exit");
					w.leftArrow.stateChange("exit");
					w.rightArrow.stateChange("exit");
					this.home.closeSection(this);
				break;
			}	
			break;
			
	}
	return true;
}




avatar.drawAvatars = function drawAvatars(_data){
	
	
		this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		//imagen
			tp_draw.getSingleton().drawImage(_data.url3X5A, ctx, 5, 5,null, null, null,"destination-over");
			
			  if(_data.text == "Regresar"){
					Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
				}
			
			//panel negro no foco
			if(_data.text != "Regresar"){
			/*
				var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
				custo = JSON.parse(custo);
				custo.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.9)";
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
			*/
				
			}
			
			
			//título
		    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);
			custo_f.text_align = "left,middle";
			custo_f.font_size = 20* tpng.thema.text_proportion;
			custo_f.fill = "rgba(255,240,200,1)";	
			Canvas.drawText(ctx, _data.text+"", new Rect(93,0,90,ctx.viewportHeight-6), custo_f);
				if(_data.used){
					Canvas.drawShape(ctx, "rect", [5,149,186,32], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
					custo_f.text_align = "center,middle";
					custo_f.font_size = 18* tpng.thema.text_proportion;
					custo_f.fill = "rgba(255,255,255,1)";	
					Canvas.drawText(ctx, "Avatar actual", new Rect(5,149,186,32), custo_f);
				}	
			//badge	
			tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);			
				
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
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
			*/
		    ctx.drawObject(ctx.endObject());
	   }
}

avatar.drawBgAvatars = function drawBgAvatars(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		
		ctx.drawObject(ctx.endObject());
}

avatar.drawHeader = function drawHeader(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "left,top";
		custo_t.font_size = 24* tpng.thema.text_proportion;
		custo_t.fill = "rgba(240,240,250,1)";
		
		Canvas.drawText(ctx, "Cambia tu avatar", new Rect(0,0,ctx.viewportWidth-67,ctx.viewportHeight-6), custo_t);
		
		custo_t.font_size = 20* tpng.thema.text_proportion;
			
		Canvas.drawText(ctx, "El avatar es la forma como te identificarás dentro del sistema. Selecciona uno acorde a tu personalidad.", new Rect(64,38,ctx.viewportWidth-131,ctx.viewportHeight-44), custo_t);
		
		ctx.drawObject(ctx.endObject());
}


avatar.drawArrowsA = function drawArrows(_data){
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

