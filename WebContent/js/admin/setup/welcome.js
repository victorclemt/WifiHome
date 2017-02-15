// welcome.js

function welcome(config, options){  
    this.super(config, options);
    
    this._lastFocusedInput;
    this.actualFocus;
    this.home;
}

welcome.inherits(FormWidget);

welcome.prototype.onEnter = function onEnter(_data){

	var w = this.widgets;
	this.home = _data.home;
	//this.home.setPlayerStatus("STOP");
	var url = tpng.backend.url+"/img/Actualizacion.jpg";
	
	var buttons = [
							{"id":"t","legend":"Sí, ir al tutorial"},
							{"id":"n","legend":"No, ir a la tv"}
						];
						
	w.clientdata.setData(tpng.user.profile.alias);					
	w.buttons.setData(buttons);
	this.home.setBg(url);
	
	clearTimeout(this.timerLoad);
		
	this.timerLoad =
		setTimeout(function(){
		
		this.client.lock();	
			w.clientdata.stateChange("enter");
			w.buttons.stateChange("enter");	
		this.client.unlock();					
	}.bind(this), 1000);	
}

welcome.prototype.onExit = function onExit(_data){
	tpng.app.section = "home";
}

welcome.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
	switch(_key){
		case "KEY_RIGHT":
			w.buttons.scrollNext();
		break;
		
		case "KEY_LEFT":
			w.buttons.scrollPrev();
		break;
		
		case "KEY_IRENTER":
			switch(w.buttons.selectItem.id){
				case "t":
						//abrir tutorial
						this.home.closeSection(this);
						this.home.hideBg();
						clearTimeout(this.timerLoad);
						unsetTimeAlarm(this.timerLoad);
						this.home.openSection("tutorials", {"home":this.home}, true,false,false);	
				break;
				
				case "n":
						clearTimeout(this.timerLoad);
						unsetTimeAlarm(this.timerLoad);	
						this.home.closeSection(this);
						this.home.hideBg();
						//this.home.setPlayerStatus("PLAY");
				break;
				
			}
		
		break;
	}
	return true;	
	
}

welcome.drawClientData = function drawClientData(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "right,top";
	custo_f.font_size = 40;
	Canvas.drawText(ctx, _data, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

welcome.drawButtonList = function drawButtonList(_data){
		
	this.draw = function draw(focus) {
			var ctx = this.getContext("2d");
				ctx.beginObject();
	    		ctx.clear();
	    		if(focus){
					custoFocus = {  
						fill: "rgba(240,240,250,1)"
					};
			
					Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
			
					var custo_t = JSON.stringify(this.themaData.standardFont);
						custo_t = JSON.parse(custo_t);
						custo_t.text_align = "center,middle";
						custo_t.fill = "rgba(30,30,40,1);"
						custo_t.font_size = 18* tpng.thema.text_proportion;
						Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_t);	
		}
		else{
		
			var custo_t = JSON.stringify(this.themaData.standardFont);
				custo_t = JSON.parse(custo_t);
				custo_t.text_align = "center,middle";
				custo_t.font_size = 18* tpng.thema.text_proportion;
				Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_t);	
		}
		
		    ctx.drawObject(ctx.endObject());
	   }
}
