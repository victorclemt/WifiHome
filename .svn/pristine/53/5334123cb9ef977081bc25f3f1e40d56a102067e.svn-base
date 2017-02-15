function esnNetflix(config, options){  
    this.super(config, options);
    this.buttons;
    this.home;
    this.state;
    this.esn;
    this.focusESN = "ESN";
}

esnNetflix.inherits(FormWidget);

esnNetflix.prototype.onEnter = function onEnter(_data){
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
	this.getESN();
}

esnNetflix.prototype.getESN = function getESN(){
		var w = this.widgets;

		if(Netgem.applications.System.externalModules.netflix.esn){
			var text = "ESN: "+Netgem.applications.System.externalModules.netflix.esn;
		}
		else{
			var text = "ESN no disponible.";
		}
		this.buttons.push({"id":"ESN","text":text,"badge":""});
		w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
				w.esnlist.setData(this.buttons);
				w.leftArrow.stateChange("enter");	
				w.esnlist.stateChange("enter");
				w.esnlist.setFocus(true);
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

esnNetflix.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
		switch(this.focusESN){	

		case "search":
			switch(_key){
				case "KEY_DOWN":
				case "KEY_MENU":
				case "KEY_IRBACK":
					this.home.disableSearchHeader();
					this.focusESN = "ESN";
					w.esnlist.setFocus(true);
				break;
				
				default:
					this.home.onKeyPress(_key);
				break;
			}	
		break;
	
		case "ESN":
			switch(_key){		
				case "KEY_LEFT":
				case "KEY_RIGHT":			
					_key == "KEY_LEFT"
					if(_key == "KEY_LEFT"){
						if(w.esnlist.scrollPrev()){
							if(w.esnlist.maxItem > 6){		
										if(w.esnlist.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.esnlist.selectIndex == (w.esnlist.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.esnlist.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.esnlist.selectIndex+1 <= w.esnlist.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
							}
						}
					}
					else{
						if(w.esnlist.scrollNext()){
							if(w.esnlist.maxItem > 6){		
										if(w.esnlist.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.esnlist.selectIndex == (w.esnlist.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.esnlist.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.esnlist.selectIndex < 4 && w.esnlist.maxItem-3){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}	
							}
						}
					}	
				break;
				
				case "KEY_IRENTER":
					switch(w.esnlist.selectItem.id){
						case "r":
							w.bg.stateChange("exit");
							w.header.stateChange("exit");
							w.esnlist.stateChange("exit");
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							this.home.closeSection(this);
						break;
						
						default:
							if(w.esnlist.selectItem.text == "ESN no disponible."){}
							else{
								this.home.openSection("confirm",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":"Si confirmas borrarás toda la información guardada que la aplicación de Netflix tiene sobre tus preferencias.", "txt1": "Eliminar ESN", "txt2": "", "txt3": ""}}, false,null,true);
							}
						break;
						
					}
				break;
				
				case "KEY_MENU":
				case "KEY_IRBACK":
					w.bg.stateChange("exit");
					w.header.stateChange("exit");
					w.esnlist.stateChange("exit");
					w.leftArrow.stateChange("exit");
					w.rightArrow.stateChange("exit");
					this.home.closeSection(this);
				break;
				
				case "KEY_UP":
					this.home.enableSearchHeader();
					this.focusESN = "search";
					w.esnlist.setFocus(false);
				break;
			}
			break;	
	}
	return true;
}

esnNetflix.prototype.openNextSection = function openNextSection(_allow){
	if(_allow){
		settings.getSection("account.service.netflix").set("cleanup", 1);
		this.home.closeSection();
	}
	else{
	}
	
}


esnNetflix.drawESN = function drawESN(_data){
	
	
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
		
		
		
		if(_data.text == "Regresar"){
		//badge	
		tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);	
		Canvas.drawText(ctx, _data.text+"", new Rect(64,3,120,ctx.viewportHeight-6), custo_f);
		}
		else{
		Canvas.drawText(ctx, _data.text+"", new Rect(3,3,ctx.viewportWidth-6,ctx.viewportHeight-32), custo_f);
		/*Canvas.drawShape(ctx, "rect", [0,144,186,32], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
		custo_f.text_align = "center,top";
		custo_f.font_size = 18* tpng.thema.text_proportion;
		custo_f.fill = "rgba(255,255,255,1)";	
		Canvas.drawText(ctx, "Cambia tu correo", new Rect(0,144,186,32), custo_f);	*/	
		}	
			
		//stroke
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		
		
	    
	    ctx.drawObject(ctx.endObject());
	}
}

esnNetflix.drawBgESN = function drawBgESN(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
		 ctx.drawObject(ctx.endObject());
}

esnNetflix.drawHeaderESN = function drawHeaderESN(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "left,top";
		custo_t.font_size = 24* tpng.thema.text_proportion;
		custo_t.fill = "rgba(240,240,250,1)";
		Canvas.drawText(ctx, "Datos de la cuenta Netflix", new Rect(0,0,ctx.viewportWidth-67,ctx.viewportHeight-6), custo_t);
		custo_t.font_size = 20* tpng.thema.text_proportion;
		Canvas.drawText(ctx, "Este número es para uso exclusivo de Netflix.", new Rect(64,38,ctx.viewportWidth-131,ctx.viewportHeight-44), custo_t);
		
		
		ctx.drawObject(ctx.endObject());
}


esnNetflix.drawArrowsESN = function drawArrowsESN(_data){
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

