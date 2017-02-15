// unlockProgram.js

function unlockProgram(config, options){  
    this.super(config, options);
    
    this._lastFocusedInput;
    this.actualFocus;
    this.home;
}

unlockProgram.inherits(FormWidget);

unlockProgram.prototype.onEnter = function onEnter(_data){

	var widgets = this.widgets;
	this.home = _data.home;
	this.parentAP = _data.parentAP;
	this.blockChannel = _data.blockChannel;
	this.section = _data.section;
	this.onEnterProgram(_data);
	this.enterInputs();
}


unlockProgram.prototype.onExit = function onExit(_data){

	var widgets = this.widgets;
	widgets.mainBackgroundChannel.stateChange("exit");	
	widgets.mainMessage.stateChange("exit");
	widgets.messageAliasError.stateChange("exit");	
	widgets.buttons_unlockProgram.stateChange("exit");
	widgets.showInfo.stateChange("exit");
	widgets.passwordInput_1.stateChange("exit");
	widgets.passwordInput_2.stateChange("exit");
	widgets.passwordInput_3.stateChange("exit");
	widgets.passwordInput_4.stateChange("exit");

}

unlockProgram.prototype.onEnterProgram = function onEnterProgram(_data){
	var widgets = this.widgets,
		buttons = [{"text": "Regresar"}];
	
	this.channelNumber = _data.channel.number;
	var channelLocked = _data.program.isLocked;
		
	if(this.blockChannel){
		widgets.mainMessage.setData({"text": "Usa los números en tu control remoto para ingresar el NIP del usuario principal para bloquear el canal:", "Channellocked": channelLocked});
		widgets.showInfo.setData({"profile":tpng.user.profile, "program": _data.program, "channel":_data.channel, "messageFooter": true, "section": this.section, "message":"<!i>El NIP es el código de 4 dígitos del administrador del sistema, si no lo sabes ponte en contacto con él y pídeselo. Si no deseas volver a ingresar este NIP pídele que ajuste tus opciones de usuario<!>"});		
	}else{
		widgets.mainMessage.setData({"text": "Usa los números en tu control remoto para ingresar el NIP del usuario principal para desbloquear el programa:", "Channellocked": channelLocked});
		widgets.showInfo.setData({"profile":tpng.user.profile, "program": _data.program, "channel":_data.channel, "messageFooter": true, "section": this.section, "message":"<!i>El NIP es el código de 4 dígitos del administrador del sistema, si no lo sabes ponte en contacto con él y pídeselo. Si no deseas volver a ingresar este NIP pídele que ajuste tus opciones de usuario<!>"});
	}

		widgets.mainBackgroundChannel.setData();
		if(tpng.user.profile.isRoot)
			widgets.messageAliasError.setData({"text": "NIP de " +tpng.user.profile.alias+":"});
		else
			widgets.messageAliasError.setData({"text": "Introduce el NIP del Administrador :"});

		widgets.buttons_unlockProgram.setData(buttons);

	
		widgets.mainBackgroundChannel.stateChange("enter");	
		widgets.mainMessage.stateChange("enter");
		widgets.messageAliasError.stateChange("enter");	
		widgets.buttons_unlockProgram.stateChange("enter");
		widgets.showInfo.stateChange("enter");
	
}


unlockProgram.prototype.enterInputs = function enterInputs(_data){

	var widgets = this.widgets,
		passwordInput_1 = widgets.passwordInput_1,
		passwordInput_2 = widgets.passwordInput_2,
		passwordInput_3 = widgets.passwordInput_3,
		passwordInput_4 = widgets.passwordInput_4;
		
		passwordInput_1.setData();
		passwordInput_2.setData();
		passwordInput_3.setData();
		passwordInput_4.setData();
	
		passwordInput_1.stateChange("enter");
		passwordInput_2.stateChange("enter");
		passwordInput_3.stateChange("enter");
		passwordInput_4.stateChange("enter");
	this.actualFocus = "Nip";
	this.setInputFocus(passwordInput_1);	
}

unlockProgram.prototype.setInputFocus = function setInputFocus (newInput){

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

unlockProgram.prototype.nextInput = function nextInput(){
    var widgets = this.widgets,
        input_1 = widgets.passwordInput_1,
        input_2 = widgets.passwordInput_2,
        input_3 = widgets.passwordInput_3,
        input_4 = widgets.passwordInput_4,
        oldInput = this._lastFocusedInput,
        newInput;
    
    switch (oldInput) {
        case null:
            newInput = widgets.passwordInput_1;
            break;
        case widgets.passwordInput_1:
            newInput = widgets.passwordInput_2;
            break;
        case widgets.passwordInput_2:
            newInput = widgets.passwordInput_3;
            break;
        case widgets.passwordInput_3:
            newInput = widgets.passwordInput_4;
            break;
        case widgets.passwordInput_4:
        	this.nip = input_1.getData()+input_2.getData()+input_3.getData()+input_4.getData();
        	var id = tpng.user.profile.proId;
        	widgets.messageAliasError.setData({});
			widgets.messageAliasError.stateChange("exit");
            var ciphertext = encryptByDES(this.nip, tpng.stb.keyNip);
            var params = ["passwd="+ciphertext+"&proId="+id];
			getServices.getSingleton().call("ADMIN_SEND_ADMIN_PASSWORD", params, this.responseSendPasswd.bind(this));
            break;
    }
    this.setInputFocus(newInput);
}

unlockProgram.prototype.previousInput = function previousInput(){
    var widgets = this.widgets,
        oldInput = this._lastFocusedInput,
        newInput;
    
    switch (oldInput) { 
       case widgets.passwordInput_4:
            newInput = widgets.passwordInput_3;
            break;
        case widgets.passwordInput_3:
            newInput = widgets.passwordInput_2;
            break;
        case widgets.passwordInput_2:
            newInput = widgets.passwordInput_1;
            break;
        case widgets.passwordInput_1:
            newInput = widgets.passwordInput_1;
            break;                                                        
    }
    newInput.setData();
    this.setInputFocus(newInput);
}


unlockProgram.prototype.responseSendPasswd = function responseSendPasswd(responseCode){
	
	if(responseCode.status == 200){
		var isValid = responseCode.data.ResponseVO.isValid;		
		if(!isValid){
		// error en nip	
			this.widgets.messageAliasError.setData({"text": "Nip Incorrecto ingresalo nuevamente"});
			this.widgets.messageAliasError.stateChange("enter");
			this.enterInputs();
		}else{
			if(this.blockChannel){
				this.blockChannelList();
			}else{
				if(this.parentAP){
					//Cuando viene desde las guias
					this.parentAP.openNextSection();
				}else{
					this.home.unlockProgram();
				}
				this.home.closeSection(this);
			}
		}
		
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}


unlockProgram.prototype.blockChannelList = function blockChannelList(_data){
	var params = ["lchNumber="+this.channelNumber];
	getServices.getSingleton().call("ADMIN_SEND_BLOCK_CHANNEL", params, this.responseUpdateChannel.bind(this));
}

unlockProgram.prototype.responseUpdateChannel = function responseUpdateChannel(response){
	
	if(response.status == 200){
		if(this.section == "home" || this.section == "miniGuide" || this.section == "timeline" ){
			this.home.hideMoreInfo(); 
			this.home.hideHeader();
		}
			tpng.app.sections = [];
			this.home.closeSection(this);
			this.home.updateChannelList();
	}else{	
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
			
						
	}
}


unlockProgram.prototype.onKeyPress = function onKeyPress(_key){
	
	switch(this.actualFocus){
		case "Nip":
			this.onKeyPressNip(_key);
		break;
		case "Buttons":
			this.onKeyPressButtons(_key);
		break;
	}
	return true;	
	
}


unlockProgram.prototype.onKeyPressNip = function onKeyPressNip(_key){
	var widgets = this.widgets,
   		lastInput = this._lastFocusedInput;
   	
   	 switch (_key) {    	
   	 		
		case "KEY_LEFT":
			if(lastInput.name == "passwordInput_1"){
				this.actualFocus = "Buttons";
				widgets.passwordInput_1.setFocus(false);
				widgets.buttons_unlockProgram.setFocus(true);
			}
		break;
		
    	case "KEY_MENU":
		case "KEY_IRBACK":
			this.closeUnlock();			
		break;
		
		case "KEY_TV_RED":
//			widgets.back.setData();
//			widgets.back.stateChange("enter");
		break;
        
        case "KEY_BACKSPACE":
	        this.previousInput();
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
     
    return true;
}

unlockProgram.prototype.closeUnlock = function closeUnlock(_key){
	
	if(this.section == "anytimePlayer")
		this.home.closeAllNew(true);
	else
		this.home.closeSection(this);
}

unlockProgram.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
	var widgets = this.widgets,
		buttons_unlockProgram = widgets.buttons_unlockProgram;
		
		 switch (_key){
		 		 
		 	case "KEY_IRENTER":
				switch(buttons_unlockProgram.selectItem.text){
					case "Regresar":
						//this.home.closeSection(this);
						this.closeUnlock();
					break;
				}
		 	break;	 
    		
    		case "KEY_MENU":
			case "KEY_IRBACK":
				//this.home.closeSection(this);
				this.closeUnlock();
			break;	
 			
 			case "KEY_LEFT":
	 			buttons_unlockProgram.scrollPrev();
 			break;
 			 
	 		case "KEY_RIGHT": 
	 			if(buttons_unlockProgram.scrollNext()){
	 			}else{
		 			this.actualFocus = "Nip";
	 				widgets.passwordInput_1.setFocus(true);
	 				widgets.buttons_unlockProgram.setFocus(false);
	 			}
			break;

		 } 
		 return true;
}


unlockProgram.drawMainBackground = function drawMainBackground(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custoW = {fill: "rgba(30,30,40, .95)"};    
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);
		
	ctx.drawObject(ctx.endObject());	
}



unlockProgram.drawButtonsUnlockProgram = function drawButtonsUnlockProgram(_data){ 
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    	
	    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
					    
	    var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		
		if(focus){
			custo_f.text_align = "left,middle";
			custo_f.font_size = 18 * tpng.thema.text_proportion;
			custo_f.fill = "rgba(0,0,0,1)";		
			Canvas.drawText(ctx, _data.text+"", new Rect(5,0,100,ctx.viewportHeight), custo_f);
			var custoF = {fill: "rgba(255,255,255,1)"};
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoF); // fondo negro con transparencia
			tp_draw.getSingleton().drawImage("img/tv/btn_RegresarON.png", ctx, 0, 0);
		}
		
		custo_f.text_align = "left,middle";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.text+"", new Rect(5,0,100,ctx.viewportHeight), custo_f);
	    tp_draw.getSingleton().drawImage("img/tv/btn_RegresarOFF.png", ctx, 0, 0, null, null, null,"destination-over");
	    
	    ctx.drawObject(ctx.endObject());
	}
}	

// MUESTRA EL MENSAJE PRINCIPAL
unlockProgram.drawMainMessage = function drawMainMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
         
   // NGM.dump(_data);     
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,middle";
	custo_f.font_size = 28 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
	/*
	custo_f.font_size = 16 * tpng.thema.text_proportion;
	custo_f.fill = "rgba(85,95,105,1)";
	Canvas.drawText(ctx, _data.text_footer, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f); 
	*/
	ctx.drawObject(ctx.endObject());	
}

// MENSAJE DE ALIAS Y ERROR 
unlockProgram.drawMessage = function drawMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,middle";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	custo_f.fill = "rgba(110,30,40,1)";
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

unlockProgram.drawShowInfo = function drawShowInfo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
       
     var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
	/*
	NGM.trace("------------> drawShowInfo ____________________");
	NGM.dump(_data);*/	
	
	// img avatar
	tp_draw.getSingleton().drawImage(_data.profile.images.url1X1A, ctx, 321, 3);
	
	// alias
	custo_f.text_align = "left,top";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, "Perfil: "+_data.profile.alias, new Rect(385,0,200,22), custo_f); //al x +50
	
	if(_data.section){
		if(_data.section == "player"){
			Canvas.drawText(ctx, "Desbloquear: Canal "+ _data.channel.number, new Rect(385,22,400,22), custo_f);	
		}else{
			Canvas.drawText(ctx, "Bloquear: Canal "+ _data.channel.number, new Rect(385,22,400,22), custo_f);			
		}
	}else{
		Canvas.drawText(ctx, "Desbloquear: Canal "+ _data.channel.number +" - "+_data.channel.name, new Rect(385,22,400,22), custo_f);	
	}
	
	/*
	// Canal y Nombre del Canal 
	if(_data.channel.name){
	NGM.trace("1 ----------------------> ");
		Canvas.drawText(ctx, "Desbloquear: Canal "+ _data.channel.number +" - "+_data.channel.name, new Rect(320,20,400,18), custo_f);	
	}else{
	NGM.trace("--------------------------> 2 ");
		Canvas.drawText(ctx, "Bloquera: Canal "+ _data.channel.number, new Rect(320,20,400,18), custo_f);	
	}
	*/
	
	if(_data.messageFooter){
		custo_f.text_align = "center,middle";
		//if(_data.section == "anytimePlayer"){
			//Canvas.drawText(ctx, "<!i>Este contenido se encuentra bloqueado para este usuario debido a su clasificación. Para aumentarla, ponte en contacto con el administrador.<!>", new Rect(0,108,ctx.viewportWidth,50), custo_f);		
		//}else{
			Canvas.drawText(ctx, _data.message, new Rect(0,108,ctx.viewportWidth,68), custo_f);
		//}
	}
	
		
	// Programa
	custo_f.text_align = "left,top";
	if(!_data.section){
		if(_data.program.name)	
			Canvas.drawText(ctx, "Programa: "+_data.program.name, new Rect(385,44,400,22), custo_f);	
	}else if(_data.section == "player"){
		Canvas.drawText(ctx, "Programa: "+_data.program.name, new Rect(385,44,400,22), custo_f);	
	}
	
	// Clasificacion
	if(!_data.section){
		if(_data.program.rating.clasif)
			Canvas.drawText(ctx, "Clasificación: "+_data.program.rating.clasif, new Rect(385,66,400,22), custo_f);	
	}
	
	ctx.drawObject(ctx.endObject());	
}


drawBackX = function drawBackX(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	tp_draw.getSingleton().drawImage("img/tools/DevsOnion.png", ctx, 0, 0); //tmp el w y h	
	ctx.drawObject(ctx.endObject());	
}