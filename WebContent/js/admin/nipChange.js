function nipChange(config, options){  
    this.super(config, options);
    
    this._lastFocusedInput;
    this.actualFocus = "inputs";
    this.home;
    this.nip1 = "";
    this.nip2 = "";
}

nipChange.inherits(FormWidget);

nipChange.prototype.onEnter = function onEnter(_data){

	var widgets = this.widgets;
	this.home = _data.home;
	this.parent = _data.parent;
	this.change = _data.change;
	var buttons = [
		{"id":"r","text": "REGRESAR"}
	];
	
	widgets.nipBackground.setData();
	widgets.buttonsNipChange.setData(buttons);
	widgets.mainMessage.setData({"text": "Usa los números en tu control remoto para ingresar tu nuevo NIP:"});
	widgets.messageNipError.setData({"text": "Nuevo NIP de " +tpng.user.profile.alias+":"});
	widgets.showInfo.setData({"alias": tpng.user.profile.alias+"", 
							  "avatar":tpng.user.profile.images.url1X1A,
							  "txt1":"Sección: Cambio de NIP"});
	//widgets.showInfo.setData({"profile":tpng.user.profile, "program": _data.program, "channel":_data.channel});
	
	this.client.lock();
	widgets.nipBackground.stateChange("enter");	
	widgets.buttonsNipChange.stateChange("enter");
	widgets.mainMessage.stateChange("enter");
	widgets.messageNipError.stateChange("enter");
	widgets.showInfo.stateChange("enter");
	this.home.showHeader();	
	this.client.unlock();
	this.enterInputs();
}

nipChange.prototype.cancelNip = function cancelNip(_data){
	this.home.closeSection(this);

}

nipChange.prototype.enterInputs = function enterInputs(_data){

	var widgets = this.widgets,
		nipChangeInput_1 = widgets.nipChangeInput_1,
		nipChangeInput_2 = widgets.nipChangeInput_2,
		nipChangeInput_3 = widgets.nipChangeInput_3,
		nipChangeInput_4 = widgets.nipChangeInput_4;
		
		nipChangeInput_1.setData();
		nipChangeInput_2.setData();
		nipChangeInput_3.setData();
		nipChangeInput_4.setData();
	
		nipChangeInput_1.stateChange("enter");
		nipChangeInput_2.stateChange("enter");
		nipChangeInput_3.stateChange("enter");
		nipChangeInput_4.stateChange("enter");
	this.setInputFocus(nipChangeInput_1);	
}

nipChange.prototype.setInputFocus = function setInputFocus (newInput){

    var widgets = this.widgets,
        oldInput = this._lastFocusedInput;
    
    if (newInput === oldInput) return;
        
    if (oldInput) {
        oldInput.setFocus(false);
    }    
    if (newInput){
    	newInput.setFocus(true);	
    }
    this._lastFocusedInput = newInput;

}

nipChange.prototype.nextInput = function nextInput(){
    var widgets = this.widgets,
        input_1 = widgets.nipChangeInput_1,
        input_2 = widgets.nipChangeInput_2,
        input_3 = widgets.nipChangeInput_3,
        input_4 = widgets.nipChangeInput_4,
        oldInput = this._lastFocusedInput,
        newInput,
        messageNipError = widgets.messageNipError;
        if(messageNipError.data.text == "Los NIP's no coinciden, inténtalo de nuevo"){
        	messageNipError.setData({"text": "NIP de " +tpng.user.profile.alias+":"});
        	messageNipError.refresh();
        }
    switch (oldInput) {
        case null:
            newInput =  input_1;
            break;
        case input_1:
            newInput = input_2;
            break;
        case input_2:
            newInput = input_3;
            break;
        case input_3:
            newInput = input_4;
            break;
        case input_4:
         if(this.nip1 == "" && this.nip2 == ""){
       		this.nip1 = input_1.getData()+input_2.getData()+input_3.getData()+input_4.getData();
       				input_1.setData();
					input_2.setData();
					input_3.setData();
					input_4.setData();
					newInput = input_1;
					messageNipError.setData({"text": "Confirma tu NIP:"});
					messageNipError.refresh();
       	 
        }
        else{
        	this.nip2 = input_1.getData()+input_2.getData()+input_3.getData()+input_4.getData();
      	}
      	
      	if(this.nip1 != "" && this.nip2 != ""){
						if(this.nip1 == this.nip2){
							if(this.change){
								var params = ["proId=" +tpng.user.profile.proId+ "&updateType=2&value="+this.nip1];
								getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseSendPasswd.bind(this));
							}
							else{
								this.home.closeSection(this);
								this.home.openSection("forgot", {"home":this.home,"parent":this,"nip":this.nip1}, true,,true);
							}
								//servicio para setear nuevo nip
								
						}	
						else{
							messageNipError.setData({"text":"Los NIP's no coinciden, inténtalo de nuevo"});
							messageNipError.refresh();
							this.nip1 = "";
							this.nip2 = "";
							input_1.setData();
							input_2.setData();
							input_3.setData();
							input_4.setData();
							newInput = input_1;
						}
				}
      	
      	
      	
      	
      	  
      break; 
         
    }
    this.setInputFocus(newInput);
}

nipChange.prototype.previousInput = function previousInput(){
    var widgets = this.widgets,
        input_1 = widgets.nipChangeInput_1,
        input_2 = widgets.nipChangeInput_2,
        input_3 = widgets.nipChangeInput_3,
        input_4 = widgets.nipChangeInput_4,
        oldInput = this._lastFocusedInput,
        newInput;
    
    switch (oldInput) { 
       case input_4:
            newInput = input_3;
            break;
        case input_3:
            newInput = input_2;
            break;
        case input_2:
            newInput = input_1;
            break;
        case input_1:
            newInput = input_1;
            break;                                                        
    }
    newInput.setData();
    this.setInputFocus(newInput);
}


nipChange.prototype.responseSendPasswd = function responseSendPasswd(responseCode){
	
	if(responseCode.status == 200){
			this.parent.onEnter({"home":this.home, "nipask":1});
			this.home.closeSection(this);
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status},  true,,false);			
	}
}	

nipChange.prototype.onKeyPress = function onKeyPress(_key){
	var widgets = this.widgets,
   		lastInput = this._lastFocusedInput;
   	switch(this.actualFocus){
   	 
   		 case "inputs":
   	 
		   	 switch (_key) {    	
		   	 	
		    	case "KEY_MENU":
				case "KEY_IRBACK":
			    	this.home.closeSection(this);
				break;
		        
		        case "KEY_BACKSPACE":
			        this.previousInput();
		       	break;
		       	
		       	case "KEY_LEFT":
					if(lastInput.name == "nipChangeInput_1"){
						this.actualFocus = "button";
						widgets.nipChangeInput_1.setFocus(false);
						widgets.buttonsNipChange.setFocus(true);
					}
				break;
		       	
		       	
		       	default:
		       		if(lastInput){
		    			var keyHandled = lastInput.keyHandler(_key);      
						if (keyHandled) {
							this.nextInput();
						}
					}
				break;
					
		     }
     break;
     
     case "button":
     	switch (_key){
			case "KEY_IRENTER":
				switch(widgets.buttonsNipChange.selectItem.id){
					case "r":
						this.home.closeSection(this);
						//this.formP.openNextSection(false);
						break;
				}
				break;	 
    		case "KEY_MENU":
			case "KEY_IRBACK":
	    		this.home.closeSection(this);
	    		//this.formP.openNextSection(false);
				break;
 			case "KEY_LEFT":
	 			widgets.buttonsNipChange.scrollPrev();
 				break;
	 		case "KEY_RIGHT":
	 			if(!widgets.buttonsNipChange.scrollNext()){
					this.actualFocus = "inputs";
	 				widgets.nipChangeInput_1.setFocus(true);
	 				widgets.buttonsNipChange.setFocus(false);
	 			}
				break;
		}
     break;
   }  
     
    return true;
}

nipChange.onFocusButtonBack = function onFocusButtonBack(_focus, _data){
	if(_focus){		
    	var widgets = this.widgets;
    	widgets.tooltip.setData({"x": widgets.buttonsNipChange.selectItem.x, "text": widgets.buttonsNipChange.selectItem.text});
    	this.timerToShowButton = widgets.tooltip.stateChange.delay(500, widgets.tooltip, "enter");
	} else {
		unsetTimeAlarm(this.timerToShowButton);
		this.timerToShowButton = null;
		this.widgets.tooltip.stateChange("exit");
	}	
}

nipChange.drawTooltip = function drawTooltip(_data){ 		
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	var custo_f = JSON.stringify(this.themaData.standarBlackFont);
	custo_f = JSON.parse(custo_f);		
	custo_f.text_align = "center,middle";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text+"", new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo_f);
	tp_draw.getSingleton().drawImage("img/commons/TextBalloon.png", ctx, _data.x, 0,null,null,null,"destination-over");
	
	ctx.drawObject(ctx.endObject());	
}

nipChange.drawNipBackground = function drawNipBackground(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    custoW = {fill: "rgba(30,30,40,.9)"};
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);
	
	ctx.drawObject(ctx.endObject());	
}

nipChange.drawButtonsNipChange = function drawButtonsNipChange(_data){ 
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    	
	    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
					    
		if(focus){
			tp_draw.getSingleton().drawImage("img/tv/AtrasON.png", ctx, 35, 10);
		}
		
	    tp_draw.getSingleton().drawImage("img/tv/AtrasOFF.png", ctx, 35, 10, null, null, null,"destination-over");
	    
	    ctx.drawObject(ctx.endObject());
	}
}	

nipChange.drawMainMessage = function drawMainMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,middle";
	custo_f.font_size = 28;
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

nipChange.drawMessageNipChange = function drawMessageNipChange(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,middle";
	custo_f.font_size = 18;
	custo_f.fill = "rgba(180,40,60,1)";
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

nipChange.drawShowInfo = function drawShowInfo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	// img avatar
	tp_draw.getSingleton().drawImage(_data.avatar, ctx, 256, 3);
	
	// alias
	custo_f.text_align = "left,top";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, "Perfil: "+_data.alias, new Rect(320,0,200,22), custo_f);
	
	// datos del perfil
	Canvas.drawText(ctx, _data.txt1, new Rect(320,22,400,22), custo_f);
	
	
	ctx.drawObject(ctx.endObject());	
}
