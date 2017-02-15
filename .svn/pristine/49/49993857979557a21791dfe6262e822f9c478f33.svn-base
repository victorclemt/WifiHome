//LOGIN.js Rolando

FormWidget.registerTypeStandard("login");

function login(_json, _options){
	this.super(_json, _options);
    this.home;
    this.users;
    this._lastFocusedInput;
    this.nip1 = "";
    this.nip2 = "";

}

login.inherits(FormWidget);

login.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	var widgets = this.widgets;
	var url = "img/commons/0x0-Back_Wood-BW_HD.jpg";
	
	this.home.setBg(url);
	this.home.showHeader({"section":"login","simple": true,"fill": "rgba(0,0,0,0)"});
	
	getServices.getSingleton().call("ADMIN_GET_USERS", "", this.responseSendGetProfiles.bind(this));
}

login.prototype.onEnterWelcome = function onEnterWelcome(){
	var widgets= this.widgets,
		list = widgets.list;
		
	widgets.welcome.setData();
	widgets.avatarImg.setData();
	widgets.avatarImg.stateChange("exit_welcome");
	widgets.avatarImg.setData({"img":list.list[list.selectIndex].ProfileVO.images.url3X5A,"root":list.list[list.selectIndex].ProfileVO.isRoot,"alias":list.list[list.selectIndex].ProfileVO.alias});
	this.client.lock();
		widgets.welcome.stateChange("enter");
		widgets.avatarImg.stateChange("enter_welcome");
	this.client.unlock();
}

login.prototype.onExitWelcome = function onExitWelcome(){
	this.home.hideBackground();
	this.home.hideHeader();
	tpng.menu.data = [];
	tpng.menu.tsMenu = "";
	tpng.menu.lastMenuIndex = 0;
	setTimeout(function(){
		this.widgets.welcome.stateChange("exit");
		this.widgets.avatarImg.stateChange("exit_welcome");
	}.bind(this), 1500);	
	
	this.home.onEnter({"section": this});	
}

login.prototype.responseSendGetProfiles = function responseSendGetProfiles(responseCode){

	if(responseCode.status == 200){	
			this.users = responseCode.data.ResponseVO.profiles;
			this.phone = responseCode.data.ResponseVO.callCenterPhone;		
			this.showList(this.users);
	}else{
		this.home.openSection("miniError", {"home": this.home,"code":response.status, "message":response.error.message,"suggest":response.error.suggest}, false);
	}
}

login.prototype.responseSendLogin = function responseSendLogin(responseCode){
	var widgets = this.widgets,
		list = this.widgets.list;	
	if(responseCode.status == 200 && responseCode.error.error == null){
		widgets.list.stateChange("exit");
		widgets.rightArrow.stateChange("exit");
		widgets.leftArrow.stateChange("exit");
		widgets.titleF.stateChange("exit");
		this.onEnterWelcome();
   		//this.onExitWelcome.bind(this).delay(1000);  
		this.onExitWelcome(); 
	}
	else{
		this.home.openSection("miniError", {"home": this.home, "code":response.status, "message":response.error.message, "suggest":response.error.suggest}, false);	
	}
}

login.prototype.responseUpdateNip = function responseUpdateNip(responseCode){
	var widgets = this.widgets;
		if(responseCode.status == 200){
						widgets.nipMessage.stateChange("exit");
						widgets.nipMessageSub.stateChange("exit");
						widgets.nipInput_1.setData();
						widgets.nipInput_2.setData();
						widgets.nipInput_3.setData();
						widgets.nipInput_4.setData();
						widgets.nipInput_1.stateChange("exit_n");
						widgets.nipInput_2.stateChange("exit_n");
						widgets.nipInput_3.stateChange("exit_n");
						widgets.nipInput_4.stateChange("exit_n");
						widgets.recoverMessage.setData({"title":"¡NIP actualizado!","text":"Ingresa a tu perfil con el nuevo NIP que definiste.","footer":"Puedes cambiarlo en cualquier momento desde Ajustes > Administra tu NIP > Cambia tu NIP."});
						widgets.recoverMessage.stateChange("enter");
						widgets.buttonBack.setData([{"text":"Regresar"}]);
						widgets.buttonBack.stateChange("enter");
						this.actualFocus = "nipChanged";
		}else{
			this.home.openSection("miniError", {"home": this.home, "code":response.status, "message":response.error.message,"suggest":response.error.suggest}, false);		
		}
}


login.prototype.responseSendPasswd = function responseSendPasswd(responseCode){
	var widgets = this.widgets,
		list = this.widgets.list;
		if(responseCode.status == 200){
		var isValid = responseCode.data.ResponseVO.isValid;
		if(!isValid){
			var enter = "enter_"+list.focusIndex;
			var exit = "exit_"+list.focusIndex;
			widgets.messageAliasError.setData();
			widgets.messageAliasError.stateChange(exit);
			widgets.messageAliasError.setData({"text": "Nip Incorrecto"});
			widgets.messageAliasError.stateChange(enter);	
			this.enterInputs(list.focusIndex);
		}else{
			var input_1 = widgets.nipInput_1,
				input_2 = widgets.nipInput_2,
				input_3 = widgets.nipInput_3,
				input_4 = widgets.nipInput_4,
				lostNip = widgets.lostNip;
				
			var exit = "exit_"+list.focusIndex;
			
			input_1.stateChange(exit);
			input_2.stateChange(exit);
			input_3.stateChange(exit);
			input_4.stateChange(exit);
			lostNip.stateChange(exit);
			
			
			 var id = list.list[list.selectIndex].ProfileVO.proId,
	            params = ["proId="+id];
				getServices.getSingleton().call("ADMIN_SEND_LOGIN", params, this.responseSendLogin.bind(this));		
		}
		
	}else{
		this.home.openSection("error", {"home": this.home, "code":response.status, "message":response.error.message, "suggest":response.error.suggest}, false);
	}
}






login.prototype.showList = function showList(_data){
	var w = this.widgets;
	this.actualFocus = "listUsers";
	w.list.setData(_data);
	w.list.stateChange("enter");
	w.titleF.setData();
	w.titleF.stateChange("enter");
	w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
	w.leftArrow.stateChange("enter");	
	if(_data.length > 6){
		this.state = "exit_6";
		w.rightArrow.setData({"url":"", "line": false, "position": "right"});
		w.rightArrow.stateChange(this.state);
		this.state = "enter_6";
		w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
		w.rightArrow.stateChange(this.state);
	}else{
		this.state = "exit_"+_data.length;
		w.rightArrow.setData({"url":"", "line": false, "position": "right"});
		w.rightArrow.stateChange(this.state);
		this.state = "enter_"+_data.length;
		w.rightArrow.setData({"url":"", "line": true, "position": "right"});
		w.rightArrow.stateChange(this.state);
	}
	

}

login.prototype.recoverNip = function recoverNip(_data){
			var widgets = this.widgets;
			this.actualFocus = "recoverNip";
			if(_data.question == "Sin pregunta" && _data.mail == undefined){
				var tempArray = [
						{"option":"question", "text1": "Responde tu pregunta secreta: ", "text2":"No tienes pregunta secreta asignada", "text3":"Ve a Ajustes > Pregunta Secreta para asignarla"},
						{"option":"mail", "text1": "Envia mi NIP a mi correo: ", "text2":"No tienes un correo definido", "text3":"Ve a Ajustes > Correo electrónico para definirlo"}
				];
			}
			else if(_data.question == "Sin pregunta" && _data.mail != undefined){
				var tempArray = [
						{"option":"question", "text1": "Responde tu pregunta secreta: ", "text2":"No tienes pregunta secreta asignada", "text3":"Ve a Ajustes > Pregunta Secreta para asignarla"},
						{"option":"mail", "text1": "Envia mi NIP a mi correo: ", "text2":_data.mail, "text3":"Presiona Ok para enviar tu NIP"}
				];
			}
			else if(_data.question != "Sin pregunta" && _data.mail == undefined){
				var tempArray = [
						{"option":"question", "text1": "Responde tu pregunta secreta: ", "text2":_data.question, "text3":"Presiona Ok para escribir tu respuesta"},
						{"option":"mail", "text1": "Envia mi NIP a mi correo: ", "text2":"No tienes un correo definido", "text3":"Comunícate al 1579-8000"}
				];
			
			}else if(_data.question != "Sin pregunta" && _data.mail != undefined){
				var tempArray = [
						{"option":"question", "text1": "Responde tu pregunta secreta: ", "text2":_data.question, "text3":"Presiona Ok para escribir tu respuesta"},
						{"option":"mail", "text1": "Envia mi NIP a mi correo: ", "text2":_data.mail, "text3":"Presiona Ok para enviar tu NIP"}
				];
			}
			
			var nipInput_1 = widgets.nipInput_1,
				nipInput_2 = widgets.nipInput_2,
				nipInput_3 = widgets.nipInput_3,
				nipInput_4 = widgets.nipInput_4,
				lostNip = widgets.lostNip,
				list = widgets.list,
				right = widgets.rightArrow,
				left = widgets.leftArrow;
			
			widgets.titleF.stateChange("exit");
			widgets.list.stateChange("exit");
			left.stateChange("exit");
			var exit = "exit_"+list.focusIndex;
			nipInput_1.setData();
			nipInput_2.setData();
			nipInput_3.setData();
			nipInput_4.setData();
			lostNip.setData();
			nipInput_1.stateChange(exit);
			nipInput_2.stateChange(exit);
			nipInput_3.stateChange(exit);
			nipInput_4.stateChange(exit);
			lostNip.stateChange(exit);
			right.stateChange(exit);
			this.actualFocus = "recoverNip";
			this._lastFocusedInput = "";
			
			
			widgets.listRecoverNip.setData(tempArray);
			widgets.avatarImg.stateChange("exit");
			widgets.avatarImg.setData({"img":list.list[list.selectIndex].ProfileVO.images.url3X5A,"root":list.list[list.selectIndex].ProfileVO.isRoot,"pass":list.list[list.selectIndex].ProfileVO.usePasswd,"alias":list.list[list.selectIndex].ProfileVO.alias});
			widgets.titleL.setData();
			widgets.footer.setData({"phone":this.phone});
			widgets.footer.stateChange("enter");
			widgets.titleL.stateChange("enter");
			widgets.avatarImg.stateChange("enter");
			widgets.listRecoverNip.stateChange("enter");
}


login.prototype.changeNip = function changeNip(_data){
		var listRecoverNip = this.widgets.listRecoverNip,
			tempArray = [
					{"option":"question"}
				];
		listRecoverNip.setData(tempArray);
		listRecoverNip.stateChange("enterButton");
		this.actualFocus = "nip";

}

login.prototype.enterInputs = function enterInputs(_data){

	var exit = "exit_"+_data;
	var enter = "enter_"+_data;
	
	var widgets = this.widgets,
		nipInput_1 = widgets.nipInput_1,
		nipInput_2 = widgets.nipInput_2,
		nipInput_3 = widgets.nipInput_3,
		nipInput_4 = widgets.nipInput_4,
		lostNip = widgets.lostNip;

	
			
	this.client.lock();
		nipInput_1.stateChange(exit);
		nipInput_2.stateChange(exit);
		nipInput_3.stateChange(exit);
		nipInput_4.stateChange(exit);
		lostNip.stateChange(exit);
		nipInput_1.setData();
		nipInput_2.setData();		
		nipInput_3.setData();
		nipInput_4.setData();
		lostNip.setData();
		nipInput_1.stateChange(enter);
		nipInput_2.stateChange(enter);
		nipInput_3.stateChange(enter);
		nipInput_4.stateChange(enter);
		lostNip.stateChange(enter);	
	this.client.unlock();
	
	this.actualFocus = "nip";
	this.setInputFocus(nipInput_1);
	
}

login.prototype.setInputFocus = function setInputFocus (newInput){

    var widgets = this.widgets,
        oldInput = this._lastFocusedInput;
    if (newInput === oldInput) 
    return;
        
    if (oldInput) {
        oldInput.setFocus(false);
    }    
    if (newInput){
    	newInput.setFocus(true);	
    }
    this._lastFocusedInput = newInput;

}

login.prototype.nextInput = function nextInput(){
    var widgets = this.widgets,
        input_1 = widgets.nipInput_1,
        input_2 = widgets.nipInput_2,
        input_3 = widgets.nipInput_3,
        input_4 = widgets.nipInput_4,
        oldInput = this._lastFocusedInput,
        list = widgets.list,
        titleF = widgets.titleF,
        messageAliasError = widgets.messageAliasError,
        recoverMessage = widgets.recoverMessage,
        buttonBack = widgets.buttonBack,
        nipMessageSub = widgets.nipMessageSub,
        errorNipMessage = widgets.errorNipMessage,
        newInput;
			if(errorNipMessage.stateGet()=="enter"){
				errorNipMessage.stateChange("exit");
			}
	        var enter = "enter_"+list.focusIndex;
	    	if(messageAliasError.stateGet()==enter){
	    		var exit = "exit_"+list.focusIndex;
	    		messageAliasError.setData();
	    		messageAliasError.stateChange(exit);
	    	}
    switch (oldInput) {
        case null:
            newInput = input_1;
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
        	if(this.actualFocus == "nip"){
	        	var nip = input_1.getData()+input_2.getData()+input_3.getData()+input_4.getData();
	        	widgets.messageAliasError.setData({});
				widgets.messageAliasError.stateChange("exit");
	            newInput = widgets.passwordInput_4;		
	            var id = widgets.list.list[widgets.list.selectIndex].ProfileVO.proId;
	            var ciphertext = encryptByDES(nip, tpng.stb.keyNip);
	            params = ["passwd="+ciphertext+"&proId="+id];
				getServices.getSingleton().call("ADMIN_SEND_USER_PASSWORD", params, this.responseSendPasswd.bind(this));
			}
			if(this.actualFocus == "newNip"){
			
				if(this.nip1 == "" && this.nip2 == ""){
					this.nip1 = input_1.getData()+input_2.getData()+input_3.getData()+input_4.getData();
					input_1.setData();
					input_2.setData();
					input_3.setData();
					input_4.setData();
					//this._lastFocusedInput = "";
					newInput = input_1;
					nipMessageSub.setData({"text":"Confirma tu nuevo NIP:"});
					nipMessageSub.refresh();
					//this.setInputFocus(input_1);
				}
				else{
					this.nip2 = input_1.getData()+input_2.getData()+input_3.getData()+input_4.getData();
				}	
				
				if(this.nip1 != "" && this.nip2 != ""){
						if(this.nip1 == this.nip2){
							var id = widgets.list.list[widgets.list.selectIndex].ProfileVO.proId,
							params = ["proId=" +id+ "&updateType=2&value="+this.nip1];
							getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdateNip.bind(this));
								//servicio para setear nuevo nip
								
						}	
						else{
							errorNipMessage.setData({"text":"Los nips no coinciden, inténtalo de nuevo."});
							errorNipMessage.stateChange("enter");
							nipMessageSub.setData({"text":"Ingresa tu nuevo NIP:"});
							nipMessageSub.refresh();
							this.nip1 = "";
							this.nip2 = "";
							input_1.setData();
							input_2.setData();
							input_3.setData();
							input_4.setData();
							newInput = input_1;
						}
				}
		}
        		
            break;
    }
    this.setInputFocus(newInput);
}

login.prototype.previousInput = function previousInput(){
    var widgets = this.widgets,
        input_1 = widgets.nipInput_1,
        input_2 = widgets.nipInput_2,
        input_3 = widgets.nipInput_3,
        input_4 = widgets.nipInput_4,
        oldInput = this._lastFocusedInput,
        newInput;
    
    switch (oldInput) {
        case input_1:
            newInput = input_1;
            break;
        case input_2:
            newInput = input_1;
            input_1.setData();
            break;
        case input_3:
            newInput = input_2;
            input_2.setData();
            break;
        case input_4:
        	newInput = input_3;
        	input_3.setData();
        break;    
    }
    this.setInputFocus(newInput);
    
}

login.prototype.onKeyPress = function onKeyPress(_key){
	switch(this.actualFocus){
    		case "listUsers":
				this.onKeyPressListUsers(_key); 
			break;
			case "recoverNip":
				this.onKeyPressRecoverNip(_key);
			break;
			case "nip":
				this.onKeyPressNip(_key);
			break;
			case "mail":
				this.onKeyPressMail(_key);
			break;
			case "lostNip":
				this.onKeyPressLostNip(_key);
			break;
			case "newNip":
				this.onKeyPressNewNip(_key);
			break;
			case "nipChanged":
				this.onKeyPressNipChanged(_key);
			break;
	}
	return true;
}

login.prototype.onKeyPressListUsers = function onKeyPressListUsers(_key){
	var w = this.widgets;
	var list = this.widgets.list;
	
	switch(_key){
	
		case "KEY_LEFT":
				case "KEY_RIGHT":			
					_key == "KEY_LEFT"
					if(_key == "KEY_LEFT"){
						if(list.scrollPrev()){
							if(list.maxItem > 6){		
										if(list.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(list.selectIndex == (list.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(list.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(list.selectIndex+1 <= list.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
							}
						}
					}
					else{
						if(list.scrollNext()){
							if(list.maxItem > 6){		
										if(list.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(list.selectIndex == (list.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(list.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(list.selectIndex+1 <= list.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}	
							}
						}
					}
		break;
		case "KEY_IRENTER":
			if(list.selectItem.ProfileVO.havePasswd){
				this.enterInputs(list.focusIndex);
				list.setFocus(false);
			}else{
			 var id = list.list[list.selectIndex].ProfileVO.proId,
	            params = ["proId="+id];
				getServices.getSingleton().call("ADMIN_SEND_LOGIN", params, this.responseSendLogin.bind(this));		
			}
			
		break;	
		
		case "KEY_DOWN":

		break;
		
	}	
	
	
	
	return true;
}

login.prototype.onKeyPressNip = function onKeyPressNip(_key){
	var widgets = this.widgets,
   		lastInput = this._lastFocusedInput,
		list = this.widgets.list;
   	
   	 switch (_key) {    	
 		case "KEY_UP":
		case "KEY_IRBACK":
		case "KEY_MENU":
		var nipInput_1 = widgets.nipInput_1,
		nipInput_2 = widgets.nipInput_2,
		nipInput_3 = widgets.nipInput_3,
		nipInput_4 = widgets.nipInput_4,
		lostNip = widgets.lostNip;
		var exit = "exit_"+list.focusIndex;
		nipInput_1.setData();
		nipInput_2.setData();
		nipInput_3.setData();
		nipInput_4.setData();
		lostNip.setData();
		nipInput_1.stateChange(exit);
		nipInput_2.stateChange(exit);
		nipInput_3.stateChange(exit);
		nipInput_4.stateChange(exit);
		lostNip.stateChange(exit);
		var enter = "enter_"+widgets.list.focusIndex;
   	 	var exit = "exit_"+widgets.list.focusIndex;
   		if(widgets.messageAliasError.stateGet(enter))
   			widgets.messageAliasError.stateChange(exit);
		list.setFocus(true);
		this.actualFocus = "listUsers";
		break;
        
        case "KEY_BACKSPACE":
	        this.previousInput();
       	break;
       	
       	case "KEY_DOWN":
	        widgets.lostNip.setData(true);
	        widgets.lostNip.refresh();
	        this._lastFocusedInput.setFocus(false);
	        this.actualFocus = "lostNip";
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

login.prototype.onKeyPressMail = function onKeyPressMail(_key){
	var widgets = this.widgets,
   		lastInput = this._lastFocusedInput,
		list = this.widgets.list;
   	
   	 switch (_key) {    	
 		
		case "KEY_IRBACK":
		case "KEY_MENU":
		case "KEY_IRENTER":
		widgets.avatarImg.stateChange("exit_recover");
			widgets.avatarImg.stateChange("exit");
			widgets.recoverMessage.stateChange("exit");
			widgets.nipInput_1.stateChange("exit_n");
			widgets.nipInput_2.stateChange("exit_n");
			widgets.nipInput_3.stateChange("exit_n");
			widgets.nipInput_4.stateChange("exit_n");
			widgets.errorNipMessage.stateChange("exit");
			widgets.buttonBack.stateChange("exit");
			widgets.nipMessage.stateChange("exit");
			widgets.nipMessageSub.stateChange("exit");
			widgets.list.stateChange("enter");
			widgets.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
			widgets.leftArrow.stateChange("enter");	
				if(widgets.list.list.length > 6){
					this.state = "exit_6";
					widgets.rightArrow.setData({"url":"", "line": false, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
					this.state = "enter_6";
					widgets.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
				}else{
					this.state = "exit_"+list.list.length;
					widgets.rightArrow.setData({"url":"", "line": false, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
					this.state = "enter_"+list.list.length;
					widgets.rightArrow.setData({"url":"", "line": true, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
				}
			this.actualFocus = "listUsers";
			this._lastFocusedInput = "";
			list.setFocus(true);
		break;
     }
     
    return true;
}

login.prototype.onKeyPressNipChanged = function onKeyPressNipChanged(_key){
	var widgets = this.widgets,
   		lastInput = this._lastFocusedInput,
		list = this.widgets.list;
   	
   	 switch (_key) {    	
 		
		case "KEY_IRBACK":
		case "KEY_MENU":
		break;
		
		case "KEY_IRENTER":
		widgets.avatarImg.stateChange("exit");
		widgets.recoverMessage.stateChange("exit");
		widgets.buttonBack.stateChange("exit");
		this.actualFocus = "";
		this.home.hideBackground();
		this.home.hideHeader();
		this.home.onEnter();
		
		break;
     }
     
    return true;
}

login.prototype.onKeyPressNewNip = function onKeyPressNewNip(_key){
	var widgets = this.widgets,
	lastInput = this._lastFocusedInput,
	list = this.widgets.list;
   	
   	 switch (_key) {    	
 		
 		case "KEY_DOWN":
 				if(this._lastFocusedInput.focusEnable){
						widgets.buttonBack.setFocus(true);
						this._lastFocusedInput.setFocus(false);
					}
					else{
					}
 		break;
 		
 		case "KEY_UP":
					this._lastFocusedInput.setFocus(true);
					widgets.buttonBack.setFocus(false);
 		break;
 		
		case "KEY_IRBACK":
		case "KEY_MENU":
			widgets.avatarImg.stateChange("exit_recover");
			widgets.avatarImg.stateChange("exit");
			widgets.recoverMessage.stateChange("exit");
			widgets.nipInput_1.stateChange("exit_n");
			widgets.nipInput_2.stateChange("exit_n");
			widgets.nipInput_3.stateChange("exit_n");
			widgets.nipInput_4.stateChange("exit_n");
			widgets.errorNipMessage.stateChange("exit");
			widgets.buttonBack.stateChange("exit");
			widgets.nipMessage.stateChange("exit");
			widgets.nipMessageSub.stateChange("exit");
			widgets.list.stateChange("enter");
			widgets.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
			widgets.leftArrow.stateChange("enter");	
				if(widgets.list.list.length > 6){
					this.state = "exit_6";
					widgets.rightArrow.setData({"url":"", "line": false, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
					this.state = "enter_6";
					widgets.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
				}else{
					this.state = "exit_"+list.list.length;
					widgets.rightArrow.setData({"url":"", "line": false, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
					this.state = "enter_"+list.list.length;
					widgets.rightArrow.setData({"url":"", "line": true, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
				}
			this.actualFocus = "listUsers";
			this._lastFocusedInput = "";
			list.setFocus(true);
		break;
		
		 case "KEY_BACKSPACE":
	        this.previousInput();
       	break;
       	
       	case "KEY_IRENTER":
       		if(this._lastFocusedInput.focusEnable){
       		
       		}
       		else{
       			widgets.avatarImg.stateChange("exit_recover");
			widgets.avatarImg.stateChange("exit");
			widgets.recoverMessage.stateChange("exit");
			widgets.nipInput_1.stateChange("exit_n");
			widgets.nipInput_2.stateChange("exit_n");
			widgets.nipInput_3.stateChange("exit_n");
			widgets.nipInput_4.stateChange("exit_n");
			widgets.errorNipMessage.stateChange("exit");
			widgets.buttonBack.stateChange("exit");
			widgets.nipMessage.stateChange("exit");
			widgets.nipMessageSub.stateChange("exit");
			widgets.list.stateChange("enter");
			widgets.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
			widgets.leftArrow.stateChange("enter");	
				if(widgets.list.list.length > 6){
					this.state = "exit_6";
					widgets.rightArrow.setData({"url":"", "line": false, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
					this.state = "enter_6";
					widgets.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
				}else{
					this.state = "exit_"+list.list.length;
					widgets.rightArrow.setData({"url":"", "line": false, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
					this.state = "enter_"+list.list.length;
					widgets.rightArrow.setData({"url":"", "line": true, "position": "right"});
					widgets.rightArrow.stateChange(this.state);
				}
			this.actualFocus = "listUsers";
			this._lastFocusedInput = "";
			list.setFocus(true);
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
     
    return true;
}


login.prototype.onKeyPressLostNip = function onKeyPressLostNip(_key){
	var widgets = this.widgets,
   		lastInput = this._lastFocusedInput,
   		nipInput_1 = widgets.nipInput_1,
		nipInput_2 = widgets.nipInput_2,
		nipInput_3 = widgets.nipInput_3,
		nipInput_4 = widgets.nipInput_4,
		lostNip = widgets.lostNip,
		list = widgets.list;
   	
   	 switch (_key) { 
   	 case "KEY_UP":
	   	 this._lastFocusedInput.setFocus(true);
	   	 widgets.lostNip.setData(false);
		 widgets.lostNip.refresh();
		 this.actualFocus = "nip";
   	 break;
   	 
   	 case "KEY_IRENTER":
   	 	var enter = "enter_"+widgets.list.focusIndex;
   	 	var exit = "exit_"+widgets.list.focusIndex;
   		if(widgets.messageAliasError.stateGet(enter))
   			widgets.messageAliasError.stateChange(exit);
   	 	this.recoverNip({"mail":list.list[list.selectIndex].ProfileVO.mail,"question":list.list[list.selectIndex].ProfileVO.question});
   	 break;
   	 
   	 case "KEY_IRBACK":
	 case "KEY_MENU":
		var exit = "exit_"+list.focusIndex;
		nipInput_1.setData();
		nipInput_2.setData();
		nipInput_3.setData();
		nipInput_4.setData();
		lostNip.setData();
		nipInput_1.stateChange(exit);
		nipInput_2.stateChange(exit);
		nipInput_3.stateChange(exit);
		nipInput_4.stateChange(exit);
		lostNip.stateChange(exit);
		this._lastFocusedInput = "";
		list.setFocus(true);
		this.actualFocus = "listUsers";
		var stateExit = "exit_"+widgets.list.focusIndex;
		widgets.messageAliasError.stateChange(stateExit);
		break;
     }
     
    return true;
}

login.prototype.onKeyPressRecoverNip = function onKeyPressRecoverNip(_key){
	var listRecoverNip = this.widgets.listRecoverNip,
		list = this.widgets.list,
		avatarImg = this.widgets.avatarImg,
		leftArrow = this.widgets.leftArrow,
		title = this.widgets.titleL,
		titleF = this.widgets.titleF,
		rightArrow = this.widgets.rightArrow,
		recoverMessage = this.widgets.recoverMessage,
		buttonBack = this.widgets.buttonBack,
		nipMessage = this.widgets.nipMessage,
		nipMessageSub = this.widgets.nipMessageSub,
		nipInput_1 = this.widgets.nipInput_1,
		nipInput_2 = this.widgets.nipInput_2,	
		nipInput_3 = this.widgets.nipInput_3,
		nipInput_4 = this.widgets.nipInput_4,
		footer = this.widgets.footer;
		
	switch(_key){
				
		case "KEY_IRBACK":
		case "KEY_MENU":
			title.stateChange("exit");
			footer.stateChange("exit");
			listRecoverNip.stateChange("exit");
			avatarImg.stateChange("exit");
			titleF.stateChange("enter");
			list.stateChange("enter");
			leftArrow.setData({"url": "" ,"line": true, "position": "left"});
			leftArrow.stateChange("enter");	
				if(list.list.length > 6){
					this.state = "exit_6";
					rightArrow.setData({"url":"", "line": false, "position": "right"});
					rightArrow.stateChange(this.state);
					this.state = "enter_6";
					rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
					rightArrow.stateChange(this.state);
				}else{
					this.state = "exit_"+list.list.length;
					rightArrow.setData({"url":"", "line": false, "position": "right"});
					rightArrow.stateChange(this.state);
					this.state = "enter_"+list.list.length;
					rightArrow.setData({"url":"", "line": true, "position": "right"});
					rightArrow.stateChange(this.state);
				}
			this.actualFocus = "listUsers";
			list.setFocus(true);
		break;
		
		case "KEY_LEFT":
		case "KEY_RIGHT":
			_key == "KEY_LEFT" ? listRecoverNip.scrollPrev() : listRecoverNip.scrollNext();
		break;

		case "KEY_IRENTER":
			if(listRecoverNip.selectItem.option == "mail"){
				if(listRecoverNip.selectItem.text2 == "No tienes un correo definido"){
					
				}
				else{
					title.stateChange("exit");
					listRecoverNip.stateChange("exit");
					footer.stateChange("exit");
					avatarImg.stateChange("exit");
					avatarImg.stateChange("exit_recover");
					var id = list.list[list.selectIndex].ProfileVO.proId;
					var params = ["proId="+id];
					getServices.getSingleton().call("ADMIN_SEND_EMAIL", params, this.sendMail.bind(this));
					//this.sendMail();
					
				}
			}else{
				if(listRecoverNip.selectItem.text2 == "No tienes pregunta secreta asignada"){
					
				}
				else{
					this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu respuesta: ","text2":"Respuesta incorrecta, inténtalo de nuevo.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":true}, true,,true);
				}
			}
		break;	
		
		case "KEY_DOWN":
		break;
		
	}	
	
	
	
	return true;
}

login.prototype.sendMail = function sendMail(responseCode){


var avatarImg = this.widgets.avatarImg,
	recoverMessage = this.widgets.recoverMessage,
	buttonBack = this.widgets.buttonBack;
		
		if(responseCode.status == 200){	
			if(responseCode.data.ResultVO.status == 0){
			avatarImg.stateChange("enter_recover");
			recoverMessage.setData({"title":"¡Correo enviado!","text":"Ingresa a tu perfil con el nuevo NIP que hemos enviado a tu correo.","footer":"Puedes cambiarlo en cualquier momento desde Ajustes > Administra tu NIP > Cambia tu NIP."});
			recoverMessage.stateChange("enter");
			buttonBack.setData([{"text":"Regresar"}]);
			buttonBack.stateChange("enter");
			this.actualFocus = "mail";
			}
			else{
				this.home.openSection("error", {"home": this.home, "title": gettext("ERROR_TITLE"),"code":response.status, "message":response.error.message,"suggest":response.error.suggest}, false);
			}
	}else{
			this.home.openSection("error", {"home": this.home, "title": gettext("ERROR_TITLE"),"code":response.status, "message":response.error.message,"suggest":response.error.suggest}, false);
	}
		
		
	

}

login.prototype.validateAnswer = function validateAnswer(answer){
var widgets = this.widgets;
var id = widgets.list.list[widgets.list.selectIndex].ProfileVO.proId,
 params = ["proId="+id+"&answer="+answer];
				getServices.getSingleton().call("ADMIN_SEND_ANSWER", params, this.responseSendAnswer.bind(this));		
}

login.prototype.responseSendAnswer = function responseSendAnswer(response){
	if(response.status == 200 && response.error.error == null){
			if(response.data.ResponseVO.isValid){
				var listRecoverNip = this.widgets.listRecoverNip,
					list = this.widgets.list,
					avatarImg = this.widgets.avatarImg,
					leftArrow = this.widgets.leftArrow,
					title = this.widgets.titleL,
					titleF = this.widgets.titleF,
					rightArrow = this.widgets.rightArrow,
					recoverMessage = this.widgets.recoverMessage,
					buttonBack = this.widgets.buttonBack,
					nipMessage = this.widgets.nipMessage,
					nipMessageSub = this.widgets.nipMessageSub,
					nipInput_1 = this.widgets.nipInput_1,
					nipInput_2 = this.widgets.nipInput_2,	
					nipInput_3 = this.widgets.nipInput_3,
					nipInput_4 = this.widgets.nipInput_4;
				
				
				title.stateChange("exit");
				listRecoverNip.stateChange("exit");
				avatarImg.stateChange("exit");
				avatarImg.stateChange("exit_recover");
				avatarImg.stateChange("enter_recover");
				nipMessage.setData({"title":"¡Respuesta Correcta!"});
				nipMessageSub.setData({"text":"Ingresa tu nuevo NIP:"});
				nipMessage.stateChange("enter");
				nipMessageSub.stateChange("enter");
				nipInput_1.stateChange("exit_n");
				nipInput_2.stateChange("exit_n");
				nipInput_3.stateChange("exit_n");
				nipInput_4.stateChange("exit_n");
				nipInput_1.setData();
				nipInput_2.setData();
				nipInput_3.setData();
				nipInput_4.setData();
				nipInput_1.stateChange("enter_n");
				nipInput_2.stateChange("enter_n");
				nipInput_3.stateChange("enter_n");
				nipInput_4.stateChange("enter_n");
				buttonBack.setData([{"text":"Regresar"}]);
				buttonBack.stateChange("enter");
				buttonBack.setFocus(false);
				nipInput_1.setFocus(true);
				this.setInputFocus(nipInput_1);
				
				this.actualFocus = "newNip";
			}
			else{
				this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu respuesta: ","text2":"Respuesta incorrecta, inténtalo de nuevo.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, true,,true);
			}
		
	}else{
		this.home.openSection("error", {"home": this.home, "title": gettext("ERROR_TITLE"),"code":response.status, "message":response.error.message,"suggest":response.error.suggest}, false);		
	}
	
}


login.drawList_users = function drawList_users(_data){
	
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();      

		//IMAGE AVATAR
		tp_draw.getSingleton().drawImage(_data.ProfileVO.images.url3X5A,ctx, 5, 5, null, null, null,"destination-over");
		
		//panel negro no foco
		var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
		custo = JSON.parse(custo);
		custo.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.9)";
		Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo);
		
		//nombre del perfil
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 18 * tpng.thema.text_proportion;	
		Canvas.drawText(ctx, _data.ProfileVO.alias, new Rect(64,3,119,ctx.viewportHeight-6), custo_f);
		
		//IMAGE ROOT
		if(_data.ProfileVO.isRoot)
			tp_draw.getSingleton().drawImage("img/admin/login/badge_Root.png",ctx, 0, 5);
		
		// PASS
		if(_data.ProfileVO.havePasswd)
			tp_draw.getSingleton().drawImage("img/admin/login/badge_NIP.png",ctx, 0, 80);
			
		if(_data.ProfileVO.isSystemProfile)
			tp_draw.getSingleton().drawImage("img/admin/login/1x1-perfilespredeterminados.png",ctx, 130, 0);
			
			//AGREGAR PAR LAS REDES SOCIALES VARIABLE
		//if(_data.ProfileVO.)
		
			var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : null;
			custo = JSON.parse(custo);
			if(focus){
				custo.rx = 5;
				custo.stroke_width = 5;
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

				var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_position" : "inside"};
				Canvas.drawShape(ctx, "rect", [6, 6, ctx.viewportWidth-12,ctx.viewportHeight-12], strokeF);
				//388 //222
			}
		/*	
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
			custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);	
		*/
		ctx.drawObject(ctx.endObject());
	}
}

login.drawTitleL = function drawTitleL(){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_h = JSON.stringify(this.themaData.standardFont);
	custo_h = JSON.parse(custo_h);
	
	custo_h.text_align = "center,middle";
	custo_h.font_size = 20 * tpng.thema.text_proportion;	
	custo_h.fill = "rgba(240,240,250,1)";
	Canvas.drawText(ctx, "Selecciona una opción para recuperar tu NIP:", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_h);
		
	ctx.drawObject(ctx.endObject());	
}

login.drawTitleF = function drawTitleF(){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_h = JSON.stringify(this.themaData.standardFont);
	custo_h = JSON.parse(custo_h);
	
	custo_h.text_align = "center,middle";
	custo_h.font_size = 20 * tpng.thema.text_proportion;	
	custo_h.fill = "rgba(240,240,250,1)";
	Canvas.drawText(ctx, "Selecciona tu perfil:", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_h);
		
	ctx.drawObject(ctx.endObject());	
}

login.drawFooter = function drawFooter(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_h = JSON.stringify(this.themaData.standardFont);
	custo_h = JSON.parse(custo_h);
	
	custo_h.text_align = "center,middle";
	custo_h.font_size = 20 * tpng.thema.text_proportion;	
	custo_h.fill = "rgba(240,240,250,1)";
	Canvas.drawText(ctx, "O bien comunícate al "+_data.phone+" y con gusto te atenderemos.", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_h);
		
	ctx.drawObject(ctx.endObject());	
}

login.drawList_recoverNip = function drawList_recoverNip(_data){

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();    		
	
			
		
		if(focus){
			custoFocus = {  
				fill: "rgba(240,240,250,1)"
			};
			
			Canvas.drawShape(ctx, "rect", [2,146,438,28], custoFocus);
			
			var custo_t = JSON.stringify(this.themaData.standardFont);
				custo_t = JSON.parse(custo_t);
				custo_t.text_align = "center,middle";
				custo_t.font_size = 22 * tpng.thema.text_proportion;
				custo_t.fill = "rgba(240,240,250,1)";
				Canvas.drawText(ctx,_data.text1, new Rect(0,36,442,32), custo_t);
				custo_t.font_size = 24* tpng.thema.text_proportion;	
				Canvas.drawText(ctx, _data.text2, new Rect(0,72,442,64), custo_t);
				custo_t.font_size = 20* tpng.thema.text_proportion;	
				custo_t.text_align = "center,top";
				if(_data.text2 != "No tienes pregunta secreta asignada" && _data.text2 != "No tienes un correo definido"){
					custo_t.fill = "rgba(30,30,40,1)";	
					Canvas.drawText(ctx, _data.text3, new Rect(3,145,439,29), custo_t);	
				}
				//no pregunta secreta
				else{
					custo_t.text_align = "center,middle"
					custo_t.font_size = 18* tpng.thema.text_proportion;	
					custo_t.fill = "rgba(180,40,60,1)";	
					Canvas.drawText(ctx, _data.text3, new Rect(3,145,439,29), custo_t);
				}
		}
		else{
			custo = {  
				stroke: "rgba(240,240,250,1)",
				stroke_width: 2,
				stroke_pos: "inside"
			};
			//botones
				Canvas.drawShape(ctx, "rect", [0, 144, 442, 32], custo);
		
			var custo_t = JSON.stringify(this.themaData.standardFont);
				custo_t = JSON.parse(custo_t);
				custo_t.text_align = "center,middle";
				custo_t.font_size = 22 * tpng.thema.text_proportion;
				custo_t.fill = "rgba(240,240,250,1)";
				Canvas.drawText(ctx,_data.text1, new Rect(0,36,442,32), custo_t);
				custo_t.font_size = 24* tpng.thema.text_proportion;	
				Canvas.drawText(ctx, _data.text2, new Rect(0,72,442,64), custo_t);
				
			if(_data.text2 != "No tienes pregunta secreta asignada" && _data.text2 != "No tienes un correo definido"){
					custo_t.font_size = 20 * tpng.thema.text_proportion;	
					custo_t.text_align = "center,top";
					Canvas.drawText(ctx, _data.text3, new Rect(3,145,439,29), custo_t);
			}
			//no pregunta secreta
			else{
					custo_t.text_align = "center,middle"
					custo_t.font_size = 18* tpng.thema.text_proportion;	
					Canvas.drawText(ctx, _data.text3, new Rect(3,145,439,29), custo_t);	
			}		
		
		
			
		}
		
		ctx.drawObject(ctx.endObject());
		ctx.swapBuffers();
	}
}

login.drawButtonBack = function drawButtonBack(_data){

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();      
		
		var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "center,top";
		custo_t.font_size = 18* tpng.thema.text_proportion;
		custo_t.fill = "rgba(240,240,250,1)";
		if(focus){
		custoFocus = {  
			fill: "rgba(240,240,250,1)",
			stroke: "rgba(240,240,250,.7)",
			stroke_width: 2
		};
		custo_t.fill = "rgba(30,30,40,1)";
		}
		else{
		custoFocus = {  
			stroke: "rgba(240,240,250,.7)",
			stroke_width: 2
		};
		}
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
		Canvas.drawText(ctx,_data.text, new Rect(3,3,ctx.viewportWidth-6,ctx.viewportHeight-6), custo_t);
	
		

		//selector
		/*custoFocus = {  
			fill: "rgba(240,240,250,1)"
		};
		//if(focus){
			Canvas.drawShape(ctx, "rect", [0,144,442,32], custoFocus);
			//custo_t.fill = "rgba(30,30,40,1)";	
			//Canvas.drawText(ctx, _data.text3, new Rect(0,144,442,32), custo_t);		
		}
		else{
			custo = {  
				stroke: "rgba(240,240,250,.7)",
				stroke_width: 2
			};
				Canvas.drawShape(ctx, "rect", [0, 144, 442, 32], custo);
		}*/
		
		ctx.drawObject(ctx.endObject());
		ctx.swapBuffers();
	}
}


login.drawAvatarImg = function drawAvatarImg(_data){

	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    	tp_draw.getSingleton().drawImage(_data.img,ctx, 0, 0,null,null,null,"destination-over");
	    	var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
		custo = JSON.parse(custo);
		custo.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.9)";
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);		
	    //nombre del perfil
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.alias, new Rect(64,3,119,ctx.viewportHeight-6), custo_f);	
		//badge root
	    	if(_data.root){
	    		tp_draw.getSingleton().drawImage("img/admin/login/badge_Root.png",ctx, 0, 0);
	    	}
	    //badge pass	
	    	if(_data.pass){
	    		tp_draw.getSingleton().drawImage("img/admin/login/badge_NIP.png",ctx, 0, 70);
	    	}
		ctx.drawObject(ctx.endObject());
}


login.drawArrowsL = function drawArrowsL(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
	var custoW = {fill: "rgba(240,240,250,1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [13,0,2,ctx.viewportHeight], custoW);
	
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [18,0,2,ctx.viewportHeight], custoW);	
	
	
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 71);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}

login.drawLostNip = function drawLostNip(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "center, middle";
		custo_t.font_size = 18 * tpng.thema.text_proportion;	
		//custo_t.fill = "rgba(240,240,250,1)";
	if(_data){
		custo_t.fill = "rgba(240,240,250,1)";
		}
		else{
		custo_t.fill = "rgba(90,90,100,1)";
		}
		Canvas.drawText(ctx, "Olvidé mi NIP", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight-6), custo_t);
		
		ctx.drawObject(ctx.endObject());
}

login.drawErrorLoginMessage = function drawErrorLoginMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,middle";
	custo_f.font_size = 18 * tpng.thema.text_proportion;	
	custo_f.fill = "rgba(220,60,70,1)";
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

login.drawRecoverMessage = function drawRecoverMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "left,top";
	custo_f.font_size = 32 * tpng.thema.text_proportion;	
	custo_f.fill = "rgba(240,240,250,1)";
	Canvas.drawText(ctx, _data.title, new Rect(0,0,ctx.viewportWidth,35), custo_f);
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text, new Rect(0,36,ctx.viewportWidth,50), custo_f);
	Canvas.drawText(ctx, _data.footer, new Rect(0,85,ctx.viewportWidth,44), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

login.drawNipMessage = function drawNipMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "left,top";
	custo_f.font_size = 30 * tpng.thema.text_proportion;	
	custo_f.fill = "rgba(240,240,250,1)";
	Canvas.drawText(ctx,_data.title, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
		
	ctx.drawObject(ctx.endObject());	
}

login.drawNipMessageSub = function drawNipMessageSub(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "left,top";
	custo_f.fill = "rgba(240,240,250,1)";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
		
	ctx.drawObject(ctx.endObject());	
}

login.drawErrorNipMessage = function drawErrorNipMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "left,top";
	custo_f.font_size = 18 * tpng.thema.text_proportion;	
	custo_f.fill = "rgba(220,60,70,1)";
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

login.drawWelcomeBg = function drawWelcomeBg(_data){
	var ctx = this.getContext("2d");
    ctx.beginObject();
	ctx.clear(); 
	
	var custoWelcomeBg = this.themaData.mediumBlackPanel;
	
	custoWelcomeBg.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.5)";
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoWelcomeBg);
	var custo_z = JSON.stringify(this.themaData.standardFont);
		custo_z = JSON.parse(custo_z);
		custo_z.text_align = "right,middle";
		custo_z.font_size = 24 * tpng.thema.text_proportion;
	Canvas.drawText(ctx,"Bienvenido", new Rect(387,362,122,32), custo_z);	
	
	ctx.drawObject(ctx.endObject());
}