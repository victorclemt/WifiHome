// nipValidator.js

function nipValidator(config, options){  
    this.super(config, options);
    
    this._lastFocusedInput;
    this.actualFocus;
    this.home;
}

nipValidator.inherits(FormWidget);

nipValidator.prototype.onEnter = function onEnter(_data){

	this.home = _data.home;
	this.formP = _data.formP;
	this.formData = _data.formData;
	this.oldMsg="";
	this.widgets.mainBackgroundChannel.setData();
	this.widgets.mainBackgroundChannel.stateChange("enter");
	
	this.initNipValidator();
	this.enterInputs();
}


nipValidator.prototype.initNipValidator = function initNipValidator(_data){
	var widgets = this.widgets;
	widgets.mainMessage.setData({"text": this.formData.title});
	if(this.formData.nipRoot){
		if(tpng.user.profile.isRoot){
			this.oldMsg="Introduce tu NIP";
			widgets.messageAliasError.setData("Introduce tu NIP");
		}else{
			this.oldMsg="Introduce el NIP del administrador";
			widgets.messageAliasError.setData("Introduce el NIP del administrador");
		}
	}else{
		if(this.formData.nipTest){
			this.oldMsg="Introduce el código de seguridad";
			widgets.messageAliasError.setData("Introduce el código de seguridad");
		}else{
			this.oldMsg="Introduce tu NIP";
			widgets.messageAliasError.setData("Introduce tu NIP");
		}
	}
	widgets.showInfo.setData({"alias": tpng.user.profile.alias+"", 
							  "avatar":tpng.user.profile.images.url1X1A,
							  "txt1":this.formData.txt1,
							  "txt2": this.formData.txt2,
							  "txt3": this.formData.txt3});
	if(this.formData.txt4){
		widgets.footerList.setData({"subtitle": this.formData.txt4});
	}
							  
	widgets.buttonsNipValidator.setData([{"id":"r","text": "REGRESAR"}]);
	this.client.lock();
		widgets.mainBackgroundChannel.setData();
		widgets.mainMessage.stateChange("enter");
		widgets.messageAliasError.stateChange("enter");
		widgets.showInfo.stateChange("enter");
		widgets.buttonsNipValidator.stateChange("enter");
		widgets.footerList.stateChange("enter");
	this.client.unlock();
	
}

nipValidator.prototype.enterInputs = function enterInputs(_data){

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

nipValidator.prototype.setInputFocus = function setInputFocus (newInput){

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

nipValidator.prototype.nextInput = function nextInput(){
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
        	this.nip = input_1.getData()+input_2.getData()+input_3.getData()+input_4.getData(),
        	id = tpng.user.profile.proId,	
        	params = ["passwd="+this.nip+"&proId="+id];
        			
        	widgets.messageAliasError.setData({});
			widgets.messageAliasError.stateChange("exit");
           newInput = widgets.passwordInput_1;
            
            var ciphertext = encryptByDES(this.nip, tpng.stb.keyNip);
            
            
            if(this.formData.nipRoot){
            	params = ["passwd="+ciphertext];
            	getServices.getSingleton().call("ADMIN_SEND_ADMIN_PASSWORD", params, this.responseSendPasswd.bind(this));
            }else if(this.formData.nipTest){
            	if(this.nip == tpng.app.unlock_pass){
					this.home.closeSection(this);
					this.formP.openNextSection(true, this.nip);
				}else{
					widgets.messageAliasError.setData("Código Incorrecto inténtalo nuevamente");
					widgets.messageAliasError.refresh();
					widgets.messageAliasError.stateChange("enter");
					
					clearTimeout(this.deleyMessage);
					this.deleyMessage = this.changeMessage.bind(this, this.oldMsg).delay(2000);
					
					this.enterInputs();
				}
            }else{
            	params = ["passwd="+ciphertext+"&proId="+id];
				getServices.getSingleton().call("ADMIN_SEND_USER_PASSWORD", params, this.responseSendPasswd.bind(this));
            }
            break;
    }
    this.setInputFocus(newInput);
}

nipValidator.prototype.previousInput = function previousInput(){
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


nipValidator.prototype.responseSendPasswd = function responseSendPasswd(responseCode){
	var widgets = this.widgets;
	if(responseCode.status == 200){
		var isValid = responseCode.data.ResponseVO.isValid;
		if(!isValid){
			widgets.messageAliasError.setData("NIP incorrecto, inténtalo nuevamente");
			widgets.messageAliasError.stateChange("enter");
			
			clearTimeout(this.deleyMessage);
			this.deleyMessage = this.changeMessage.bind(this, this.oldMsg).delay(2000);
			
			this.enterInputs();
		}else{
			this.home.closeSection(this);
			this.formP.openNextSection(true, this.nip);
		}
	}else if(response.error){
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

nipValidator.prototype.changeMessage = function changeMessage(_data){
	this.widgets.messageAliasError.setData(_data);
	this.widgets.messageAliasError.refresh();
}
/*
nipValidator.prototype.showTooltip = function showTooltip(){
	var widgets =  this.widgets;
		//this.client.lock();
		widgets.tooltip.stateChange("enter");
		//widgets.buttonsPanel.stateChange("exit");
		//widgets.buttonsHeader.stateChange("exit");
		//widgets.progressBarVod.stateChange("exit");
		//widgets.vodControls.stateChange("exit");
		//widgets.vodImg.stateChange("exit");
		//this.client.unlock();
		if(!_status){
			this.home.hideHeader();
			this.activeFocus = "info";
		}
	
}*/

nipValidator.prototype.onKeyPress = function onKeyPress(_key){
	
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


nipValidator.prototype.onKeyPressNip = function onKeyPressNip(_key){
	var widgets = this.widgets,
   		lastInput = this._lastFocusedInput;
	
	if(widgets.messageAliasError.data != this.oldMsg){
		clearTimeout(this.deleyMessage);
		this.changeMessage(this.oldMsg);
	}
	switch (_key) {
		case "KEY_LEFT":
			if(lastInput.name == "passwordInput_1"){
				this.actualFocus = "Buttons";
				widgets.passwordInput_1.setFocus(false);
				widgets.buttonsNipValidator.setFocus(true);
			//unsetTimeAlarm(this.showTooltipDelay);
			//this.showTooltipDelay = this.showTooltip.bind(this).delay(1000);//Lo desaparezco en 10 seg
			}
			break;
    	case "KEY_MENU":
		case "KEY_IRBACK":
	    	this.home.closeSection(this);
			this.formP.openNextSection(false);
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
}

nipValidator.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
	var widgets = this.widgets,
		buttonsNipValidator = widgets.buttonsNipValidator;
		switch (_key){
			case "KEY_IRENTER":
				switch(buttonsNipValidator.selectItem.id){
					case "r":
						this.home.closeSection(this);
						this.formP.openNextSection(false);
						break;
				}
				break;	 
    		case "KEY_MENU":
			case "KEY_IRBACK":
	    		this.home.closeSection(this);
	    		this.formP.openNextSection(false);
				break;
 			case "KEY_LEFT":
	 			buttonsNipValidator.scrollPrev();
 				break;
	 		case "KEY_RIGHT":
	 			if(!buttonsNipValidator.scrollNext()){
					this.actualFocus = "Nip";
	 				widgets.passwordInput_1.setFocus(true);
	 				widgets.buttonsNipValidator.setFocus(false);
	 			}
				break;
		}
}

nipValidator.onFocusButtonBack = function onFocusButtonBack(_focus, _data){
	if(_focus){		
    	var widgets = this.widgets;
    	
    	//widgets.tooltip.setData({"x": widgets.buttonsNipValidator.selectItem.x, "text": widgets.buttonsNipValidator.selectItem.text});
    	//this.timerToShowButton = widgets.tooltip.stateChange.delay(500, widgets.tooltip, "enter");
	    this.timerFocusButtons = setTimeout(function (){
	   		widgets.tooltip.setData({"x": widgets.buttonsNipValidator.selectItem.x, "text": widgets.buttonsNipValidator.selectItem.text});
   			widgets.tooltip.stateChange("enter");
		}.bind(this), 500);
	
	} else {
		//unsetTimeAlarm(this.timerToShowButton);
		//this.timerToShowButton = null;
		this.widgets.tooltip.stateChange("exit");
		clearTimeout(this.timerFocusButtons);
	}	
}

nipValidator.drawMainBackground = function drawMainBackground(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custoW = {fill: "rgba(30,30,40, .95)"};    
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);
	
	ctx.drawObject(ctx.endObject());	
}




nipValidator.drawMainMessage = function drawMainMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,bottom";
	custo_f.font_size = 28 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
	ctx.drawObject(ctx.endObject());	
}

nipValidator.drawMessage = function drawMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	

	custo_f.text_align = "center,middle";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	custo_f.fill = "rgba(180,40,60,1)";
	Canvas.drawText(ctx, _data, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

nipValidator.drawShowInfo = function drawShowInfo(_data){ 	
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
	Canvas.drawText(ctx, _data.txt2, new Rect(320,44,400,22), custo_f);	
	Canvas.drawText(ctx, _data.txt3, new Rect(320,66,400,22), custo_f);
	
	
	ctx.drawObject(ctx.endObject());	
}

nipValidator.drawTooltip = function drawTooltip(_data){ 		
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



nipValidator.prototype.onExit = function onExit(_data){
	clearTimeout(this.timerFocusButtons);
	this.home.closeSection(this);
}