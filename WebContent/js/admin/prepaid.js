function prepaid(config, options){  
    this.super(config, options);
    this.buttons;
    this.home;
    this.state;
    this.focus = "prepaid";
}

prepaid.inherits(FormWidget);

prepaid.prototype.onEnter = function onEnter(_data){
	
	var w = this.widgets;
	this.home = _data.home;
	var buttons = [
		{"id":"r","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png","img":""},
		{"id":"p","text": "Tarjeta de prepago","badge":"img/admin/prepaid/1x1-prepago.png","img":"img/admin/prepaid/prepago.jpg"},
		{"id":"c","text": "Crédito o débito","badge":"img/admin/prepaid/1x1-credito.png","img":"img/admin/prepaid/credito.jpg"}
	];
	//VARIABLE PARA METER EL OTRO ARREGLO Y EL DEL BOTON REGRESAR
	this.buttons = buttons;
	
	
	this.home.showHeader();
	this.getOptions();
	
}

prepaid.prototype.getOptions = function getOptions(){
var w = this.widgets;
			
	//this.client.lock();		
				w.bg.setData();
				w.headerP.setData();
				w.prepaid.setData(this.buttons);
				w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
				
					if(this.buttons.length > 6){
						this.state = "exit_6";
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
						this.state = "enter_6";
						w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
					this.client.lock();	
						w.rightArrow.stateChange(this.state);
						w.leftArrow.stateChange("enter");	
						w.prepaid.stateChange("enter");
						w.prepaid.setFocus(true);
						w.bg.stateChange("enter");
						w.headerP.stateChange("enter");
					//this.client.unlock();	
					}else{
						this.state = "exit_"+this.buttons.length;
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
					    this.state = "enter_"+this.buttons.length;
					    w.rightArrow.setData({"url":"", "line": true, "position": "right"});
					//this.client.lock();   
					    w.rightArrow.stateChange(this.state);
					    w.leftArrow.stateChange("enter");	
						w.prepaid.stateChange("enter");
						w.prepaid.setFocus(true);
						w.bg.stateChange("enter");
						w.headerP.stateChange("enter");
					this.client.unlock();	
					}
					
}

/*
prepaid.prototype.getAvatars = function getAvatars(){
	getServices.getSingleton().call("ADMIN_GET_AVATARS", ,this.responseGetAvatars.bind(this));
}



prepaid.prototype.responseGetPrepaid = function responseGetPrepaid(response){
	if(response.status == 200){
		var avatars = response.data.ResponseVO.avatars;

		var w = this.widgets;
			if(prepaid.length >0){ 
				for(var i = 0; i<prepaid.length; i++){
					this.buttons.push({"id":prepaid[i].AvatarVO.cavId,"text": prepaid[i].AvatarVO.alias,"badge":"img/admin/avatar/1x1-avatar.png","img":prepaid[i].AvatarVO.images.url3X5A,"used":prepaid[i].AvatarVO.used})
				}
				w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
				w.prepaid.setData(this.buttons);
				w.leftArrow.stateChange("enter");	
				w.prepaid.stateChange("enter");
				w.prepaid.setFocus(true);
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
			this.home.openSection("error", {"home": this.home, "title": gettext("ERROR_TITLE"),"code":response.status, "message":response.error.message,"suggest":response.error.suggest}, false);		
		}				
	}else if(response.error){	
			this.home.openSection("error", {"home": this.home, "title": gettext("ERROR_TITLE"),"code":response.status, "message":response.error.message,"suggest":response.error.suggest}, false);		
	}
}
*/

prepaid.prototype.updatePrepaid = function updatePrepaid(id){
var params = ["proId="+tpng.user.profile.proId+"&updateType=0&value="+id];
	getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdateAvatar.bind(this));
}

prepaid.prototype.responseUpdatePrepaid = function responseUpdatePrepaid(response){
	if(response.status == 200 && response.data.ResponseVO.status == 0 && response.data.ResponseVO.message =="Operación Exitosa"){
		this.home.closeSection(this);	
	}else if(response.error){	
		this.home.openSection("miniError", {"home": this.home, "code":response.status, "message":response.error.message, "suggest":response.error.suggest}, false);		
	}
}



prepaid.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
		
		switch(this.focus){
			case "search":
				switch(_key){
					case "KEY_DOWN":
					case "KEY_MENU":
					case "KEY_IRBACK":
						this.focus = "prepaid";
						this.home.disableSearchHeader();
						w.prepaid.setFocus(true);
					break;
					
					default:
						this.home.onKeyPress(_key);
					break;
				}
			break;
			
			case "prepaid":
			switch(_key){		
				case "KEY_LEFT":
				case "KEY_RIGHT":			
					_key == "KEY_LEFT"
					if(_key == "KEY_LEFT"){
						if(w.prepaid.scrollPrev()){
							if(w.prepaid.maxItem > 6){		
										if(w.prepaid.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.prepaid.selectIndex == (w.prepaid.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.prepaid.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.prepaid.selectIndex+1 <= w.prepaid.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
							}
						}
					}
					else{
						if(w.prepaid.scrollNext()){
							if(w.prepaid.maxItem > 6){		
										if(w.prepaid.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.prepaid.selectIndex == (w.prepaid.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.prepaid.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.prepaid.selectIndex < 4 && w.prepaid.maxItem-3){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}	
							}
						}
					}	
				break;
				
				case "KEY_IRENTER":
					switch(w.prepaid.selectItem.id){
						case "r":
							w.bg.stateChange("exit");
							w.headerP.stateChange("exit");
							w.prepaid.stateChange("exit");
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							this.home.closeSection(this);
						break;
						case "p":
							/*w.bg.stateChange("exit");
							w.prepaid.stateChange("exit");
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							this.home.closeSection(this);*/
						break;
						case "c":
							/*w.bg.stateChange("exit");
							w.prepaid.stateChange("exit");
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							this.home.closeSection(this);*/
						break;
						
						default:
						//this.updateAvatar(w.avatars.selectItem.id);
		
						break;
						
					}
				break;
				
				case "KEY_MENU":
				case "KEY_IRBACK":
					w.bg.stateChange("exit");
					w.headerP.stateChange("exit");
					w.prepaid.stateChange("exit");
					w.leftArrow.stateChange("exit");
					w.rightArrow.stateChange("exit");
					this.home.closeSection(this);
				break;
				
				case "KEY_UP":
					this.home.enableSearchHeader();
					this.focus = "search";
					w.prepaid.setFocus(false);
				break;
			}	
			break;
		}
		return true;	
}




prepaid.drawPrepaid = function drawPrepaid(_data){
	
	
		this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		//imagen
		tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0,null, null, null,"destination-over");
		
		  if(_data.text == "Regresar"){
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
		}
		
		//panel negro no foco
		if(_data.text != "Regresar"){
			var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
			custo.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.9)";
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		}
		
		
		//título
	    var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "center,middle";
		custo_f.font_size = 20* tpng.thema.text_proportion;
		custo_f.fill = "rgba(255,240,200,1)";	
		Canvas.drawText(ctx, _data.text+"", new Rect(64,3,120,ctx.viewportHeight-6), custo_f);
		//badge	
		tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);			
			
		//stroke
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		
		
	    
	    ctx.drawObject(ctx.endObject());
	}
}

prepaid.drawBgPrepaid = function drawBgPrepaid(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
		 ctx.drawObject(ctx.endObject());
}

prepaid.drawHeaderP = function drawHeaderP(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "left,top";
		custo_t.font_size = 24* tpng.thema.text_proportion;
		custo_t.fill = "rgba(240,240,250,1)";
		Canvas.drawText(ctx, "Prepago", new Rect(0,0,ctx.viewportWidth-67,ctx.viewportHeight-6), custo_t);
		custo_t.font_size = 20* tpng.thema.text_proportion;	
		Canvas.drawText(ctx, "Agrega saldo a tu cuenta usando una tarjeta de prepago (adquiérela en tiendas Oxxo, 7-eleven, Elektra o Banco Azteca) o una tarjeta de crédito ó débito", new Rect(64,38,ctx.viewportWidth-131,ctx.viewportHeight-44), custo_t);
		
		
		ctx.drawObject(ctx.endObject());
}


prepaid.drawArrowsP = function drawArrows(_data){
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

