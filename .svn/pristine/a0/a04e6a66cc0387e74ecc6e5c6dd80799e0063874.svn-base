function textProportion(config, options){  
    this.super(config, options);
    this.buttons;
    this.home;
    this.state;
    this.focus = "textProportion";
}

textProportion.inherits(FormWidget);

textProportion.prototype.onEnter = function onEnter(_data){
	
	var w = this.widgets;
	this.home = _data.home;
	
	w.bg.setData();
	w.header.setData();
	
	this.client.lock();
		w.bg.stateChange("enter");
		w.header.stateChange("enter");
	this.client.unlock();
	
	this.home.showHeader();
	this.getTextProportion();
}

textProportion.prototype.getTextProportion = function getTextProportion(){
var w = this.widgets;
var buttons = [
			{"id":"r","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png"},
			{"id":1,"text":"100% (Normal)"},
			{"id":1.1,"text":"110%","selected":false},
			{"id":1.2,"text":"120%","selected":false},
			{"id":1.3,"text":"130%","selected":false},
			{"id":1.4,"text":"140%","selected":false},
			{"id":1.5,"text":"150%","selected":false},
			{"id":1.6,"text":"160%","selected":false}
		];
		for(var i = 0; i < buttons.length; i++){
			if(buttons[i].id == tpng.thema.text_proportion){
				buttons[i].selected = true;
				break;
			}
			
		}
	w.proportions.setData(buttons);
	w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
	w.leftArrow.stateChange("enter");	
	w.proportions.stateChange("enter");
	w.proportions.setFocus(true);
						
	if(buttons.length > 6){
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

textProportion.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
		switch(this.focus){
		case "search":
			switch(_key){
			
			case "KEY_DOWN":
			case "KEY_MENU":
			case "KEY_IRBACK":
				this.home.disableSearchHeader();
				w.proportions.setFocus(true);
				this.focus = "textProportion";
			break;
			
			default:
				this.home.onKeyPress(_key);
			break;
			
			}
		break;
	
		case "textProportion":
			switch(_key){		
				case "KEY_LEFT":
				case "KEY_RIGHT":			
					_key == "KEY_LEFT"
					if(_key == "KEY_LEFT"){
						if(w.proportions.scrollPrev()){
							if(w.proportions.maxItem > 6){		
										if(w.proportions.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.proportions.selectIndex == (w.proportions.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.proportions.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.proportions.selectIndex+1 <= w.proportions.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
							}
						}
					}
					else{
						if(w.proportions.scrollNext()){
							if(w.proportions.maxItem > 6){		
										if(w.proportions.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.proportions.selectIndex == (w.proportions.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.proportions.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.proportions.selectIndex < 4 && w.proportions.maxItem-3){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}	
							}
						}
					}	
				break;
				
				case "KEY_IRENTER":
					switch(w.proportions.selectItem.id){
						case "r":
							w.bg.stateChange("exit");
							w.header.stateChange("exit");
							w.proportions.stateChange("exit");
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							this.home.closeSection(this);
						break;
						
						default:
							tpng.thema.text_proportion = w.proportions.selectItem.id;
							settings.set("totalplay.iptvcore.text_proportion",tpng.thema.text_proportion);
							this.home.closeSection(this);
						break;
						
					}
				break;
				
				case "KEY_UP":
					this.home.enableSearchHeader();
					w.proportions.setFocus(false);
					this.focus = "search";
				break;
				
				
				case "KEY_MENU":
				case "KEY_IRBACK":
					w.bg.stateChange("exit");
					w.header.stateChange("exit");
					w.proportions.stateChange("exit");
					w.leftArrow.stateChange("exit");
					w.rightArrow.stateChange("exit");
					this.home.closeSection(this);
				break;
			}	
			break;
			
	}
	return true;
}




textProportion.drawProportions = function drawProportions(_data){
	
	
		this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		//imagen
			//tp_draw.getSingleton().drawImage(_data.url3X5A, ctx, 0, 0,null, null, null,"destination-over");
			
			//  if(_data.text == "Regresar"){
					Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
			//	}
			
			//panel negro no foco
			/*if(_data.text != "Regresar"){
				var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
				custo = JSON.parse(custo);
				custo.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.9)";
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
			}*/
			
			
			//título
		    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);
			custo_f.text_align = "center,middle";
			custo_f.font_size = 20* tpng.thema.text_proportion;
			custo_f.fill = "rgba(255,240,200,1)";	
			Canvas.drawText(ctx, _data.text+"", new Rect(3,3,ctx.viewportWidth-6,ctx.viewportHeight-6), custo_f);
				if(_data.selected){
					Canvas.drawShape(ctx, "rect", [5,144,186,32], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
					custo_f.text_align = "center,middle";
					custo_f.font_size = 18* tpng.thema.text_proportion;
					custo_f.fill = "rgba(255,255,255,1)";	
					Canvas.drawText(ctx, "Tamaño actual", new Rect(5,144,186,32), custo_f);
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

textProportion.drawBgProportions = function drawBgProportions(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		
		ctx.drawObject(ctx.endObject());
}

textProportion.drawHeaderProportions = function drawHeaderProportions(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "left,top";
		custo_t.font_size = 24* tpng.thema.text_proportion;
		custo_t.fill = "rgba(240,240,250,1)";
		
		Canvas.drawText(ctx, "Tamaño de la letra", new Rect(0,0,ctx.viewportWidth-67,ctx.viewportHeight-6), custo_t);
		
		custo_t.font_size = 20* tpng.thema.text_proportion;
			
		Canvas.drawText(ctx, "Puedes hacer más grande la letra en algunas secciones del sistema sin embargo, algunos textos pueden estar incompletos si seleccionas un tamaño muy alto.", new Rect(64,38,ctx.viewportWidth-131,ctx.viewportHeight-44), custo_t);
		
		ctx.drawObject(ctx.endObject());
}


textProportion.drawArrowsProp = function drawArrows(_data){
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

