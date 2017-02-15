function users(config, options){  
    this.super(config, options);
    this.buttons;
    this.home;
    this.state;
    this.asknip = 0;
    this.focus = "";
    this.lastFocus = "";
    this.selected = "";
    this.clasif = "";
    this.tempw = "";
    this.list = [];
    this.buttons = [];
}
//CAMBIAR TEXTOS DE AVATAR Y DE HEADER ESTÁN AL REVÉS
users.inherits(FormWidget);

users.prototype.onEnter = function onEnter(_data){
	
	var w = this.widgets;
	this.home = _data.home;
	
	this.home.showHeader();
	this.getUsers();
}

users.prototype.getUsers = function getUsers(){
	getServices.getSingleton().call("ADMIN_GET_USERS", ,this.responseGetUsers.bind(this));
	
}

users.prototype.responseGetUsers = function responseGetUsers(response){
	if(response.error.error == null && response.status == 200){
	
		this.buttons =[];
		var profiles = response.data.ResponseVO.profiles;
		var w = this.widgets;
			if(profiles.length >0){
				//VARIABLE PARA METER EL OTRO ARREGLO Y EL DEL BOTON REGRESAR
				this.buttons.push({"id":"r","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png","img":""});
				w.bg.setData();
				var header = [
							{"title":"Control parental","sub": "Crea y edita las preferencias de los perfiles asociados a tu cuenta."}
				];
				w.header.setData(header);
				
				
				for(var i = 0; i<profiles.length; i++){
					if(!profiles[i].ProfileVO.isSystemProfile){
							if(profiles[i].ProfileVO.balance == -1){
								var balance = "Sin Límite";
							}
							else{
								var balance = profiles[i].ProfileVO.balance;
							}
			
						this.buttons.push({"id":profiles[i].ProfileVO.proId,"text": profiles[i].ProfileVO.alias,"badge1":"img/admin/users/icono-rating-S.png","badge2":"img/admin/users/icono-wallet-S.png","badge3":"img/admin/users/icono-lockedChannel-S.png","img":profiles[i].ProfileVO.images.url3X5A,"root":profiles[i].ProfileVO.isRoot,"balance":balance,"clasif":profiles[i].ProfileVO.rating,"lockedChannels":profiles[i].ProfileVO.totalLokedChannels,"safenight":profiles[i].ProfileVO.isSafeNight});
					}
				}
				this.buttons.push({"id":"n","text":"Nuevo perfil","badge1":"img/admin/users/1x1-nuevousuario.png"})
				w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
				w.users.setData(this.buttons);
				w.bg.stateChange("enter");
				w.header.stateChange("enter");
				w.leftArrow.stateChange("enter");	
				w.users.stateChange("enter");
				w.users.setFocus(true);
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
						this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"title":"Es necesario ingresar tu NIP para acceder a esta sección.", "txt1": "Sección: Control Parental.","txt4":"Administra las opciones de todos los perfiles creados."}}, false,null,true);
					}
					else{		
						this.focus = "users";		
					}
				}
				else{
					this.focus = "users";
				}
			}else{
				this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"},false);			
			}				
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);			
	}
}





users.prototype.responseGetBlockedChannels = function responseGetBlockedChannels(response){
if(response.error.error == null && response.status == 200){
	var channels = response.data.ResponseVO.channels;
	var w = this.widgets;
	if(channels.length > 0){
			for(var i = 0; i<channels.length; i++){
				var c = {"id":channels[i].ChannelVO.lchId,"text": channels[i].ChannelVO.number,"badge":"img/admin/users/icono-lockedChannel.png","img":channels[i].ChannelVO.images.url1X1,"locked":channels[i].ChannelVO.locked}
				this.list.push(c);
			}
			var save = {"id":"save","text": "Guardar y regresar","badge":"img/admin/users/icono-save.png","img":this.img}
			this.list.push(save);
			w.channels.setData(this.list);
			w.channels.stateChange("enter");		
			w.rightArrow.stateChange("exit_6");	
			this.state = "enter_6";
				if(this.root){
					w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
				}
				else{
					w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
				}
			w.rightArrow.stateChange(this.state);
	
			var header = [
							{"title":"Perfil: "+this.user,"sub": "Selecciona los canales a bloquear para este perfil. No olvides guardar los cambios al salir."}
				  		];
			w.header.setData(header);
			w.header.refresh();
	}else{
			this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"}, false);			
		 }			
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);			
			}
}


/*
users.prototype.updateChannels = function updateChannels(){
	var str = "";
	var w = this.widgets;
	for(var i = 0; i< this.blocked.length; i++){
			if(i <this.blocked.length-1){
					str = str + this.blocked[i]+":";
				}
				else{
					str = str + this.blocked[i];
				}
	}
	if(this.locked == "0"){
		if(this.blocked.length >0){
			params = ["proId=" +this.userId+ "&updateType=11&value="+str];
			getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdateChannels.bind(this));
		}
		else{
		str = "-1";
		params = ["proId=" +this.userId+ "&updateType=11&value="+str];
			getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdateChannels.bind(this));
			
		}
	}
	else{
		if(this.blocked){
			if(this.blocked.length >0){
				params = ["proId=" +this.userId+ "&updateType=11&value="+str];
				getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdateChannels.bind(this));
			}
			else{
				str = "-1";
				params = ["proId=" +this.userId+ "&updateType=11&value="+str];
				getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdateChannels.bind(this));
			}
		}
		else{
			this.responseUpdateChannels();
		}
		
	}	
}
*/
users.prototype.openNextSection = function openNextSection(_allow){
	if(_allow.sect == "del" && _allow.valid){
		this.deleteUsers();
	}
	else if(_allow.sect == "del" && !_allow.valid){
	}
	else if(_allow){
		this.focus = "users";
		this.asknip = 1;
	}else if(!allow){
		this.home.closeSection(this);
	}
	
	
}

users.prototype.updateSafe = function updateSafe (active){
	if(active){
		var val = "Y";	
	}
	else{
		var val = "N";
	}
	tpng.user.profile.isSafeNight = active;
	this.safenight = active;
	
	 
}


users.prototype.deleteUsers = function deleteUsers(){

params = ["proId=" +this.userId+ "&updateType=12&value=2001"];
getServices.getSingleton().call("ADMIN_SET_PROFILE",params,this.responseDeleteUsers.bind(this));
}

users.prototype.updateAll = function updateAll(){
	//VALUE 1 SAFENIGHT
	//VALUE 2 BLOCKED CHANNELS
	//this.rating RATINGS
	//this.wallet WALLET
	//16 safenight
	//11 blocked channels
	//9 rating
	//10 wallet
	var w = this.widgets;
	if(this.safenight){
		var val1 = "Y"; 
	}
	else{
		var val1 = "N";
	}
	
	var val2 = "";
	for(var i = 0; i< this.blocked.length; i++){
			if(i <this.blocked.length-1){
					val2 = val2 + this.blocked[i]+":";
				}
				else{
					val2 = val2 + this.blocked[i];
				}
	}
	if(this.locked == "0"){
		if(this.blocked.length >0){
		}
		else{
		val2 = "-1";
		}
	}
	else{
		if(this.blocked){
			if(this.blocked.length >0){
			}
			else{
				val2 = "-1";
			}
		}
		else{
		NGM.trace("NO ESTÁ EL ARREGLO DE CANALES");
			//this.responseUpdateChannels();
		}
		
	}

	 		if(w.options.list.length == 7){
	 			var params = ["proId="+this.userId+"&updateTypes=16;11;9;10&values="+val1+";"+val2+";"+this.rating+";"+this.wallet];
				getServices.getSingleton().call("ADMIN_SEND_USER_PARAMS", params, this.responseUpdateAll.bind(this));
	 		}
	 		else{
	 			var params = ["proId="+this.userId+"&updateTypes=16;11;9&values="+val1+";"+val2+";"+this.rating];
				getServices.getSingleton().call("ADMIN_SEND_USER_PARAMS", params, this.responseUpdateAll.bind(this));	
	 		}
}

users.prototype.responseUpdateAll = function responseUpdateAll(response){
	var w = this.widgets;
	if(response.error.error == null && response.status == 200){
			if(this.userId == tpng.user.profile.proId){
	 			tpng.user.profile.rating = this.rating;
	 			tpng.menu.data = [];
	 			tpng.menu.tsMenu = "";
	 			tpng.menu.lastMenuIndex = 0;
	 			this.home.updateChannelList();
	 		}
	 		if(w.options.list.length == 7){
	 			w.leftArrow.stateChange("exit");
	 			w.rightArrow.stateChange("exit_6");
	 			w.header.stateChange("exit");
				w.options.stateChange("exit");
				w.bg.stateChange("exit");
				w.header.stateChange("exit"); 
				this.focus = "";
	 			this.getUsers();
	 		}
	 		else{
	 			w.leftArrow.stateChange("exit");
	 			w.rightArrow.stateChange("exit_5");
	 			w.header.stateChange("exit");
				w.bg.stateChange("exit");
				w.header.stateChange("exit"); 
				w.options.stateChange("exit");
				this.focus = "";
				this.home.hideBg();
	 			this.getUsers();
	 		}
	}
	else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);			
	}
}

users.prototype.responseDeleteUsers = function responseDeleteUsers(response){
	
	var w = this.widgets;
	if(response.error.error == null && response.status == 200){
	 			w.leftArrow.stateChange("exit");
	 			w.rightArrow.stateChange("exit_5");
	 			w.header.stateChange("exit");
				w.bg.stateChange("exit");
				w.header.stateChange("exit");
				w.options.stateChange("exit"); 
				this.focus = "";
	 			this.getUsers();
	}
	else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);			
	}
}

users.prototype.createNewUser = function createNewUser(alias){
this.alias = alias.trim();

	if(this.alias.length >0){
	var params = ["rating=AA&alias="+this.alias+"&credit=0&lChannels=-1"];
	getServices.getSingleton().call("ADMIN_NEW_USER", params, this.responseNewUser.bind(this));
	
	}
	else{
	this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa el alias del nuevo perfil: ","text2":"No has ingresado alias o el formato es inválido, ingresa uno válido.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, true,,true);
	}

}

users.prototype.responseNewUser = function responseNewUser(response){
	var w = this.widgets;
	if(response.status == 200 && response.data.ResponseVO.status == 0 && response.data.ResponseVO.message =="Operación Exitosa"){
	
		this.getUsers();
		
	}else if(response.data.ResponseVO.status == -201){
			this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa el alias del nuevo perfil: ","text2":"El alias ya existe.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, true,,true);
		}	
	 else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

users.prototype.preferences = function preferences(id,root,text,img,clasif,bal,blocked,safenight){

var w = this.widgets;
this.userId = id;
this.root = root;
this.user = text;
this.img = img;
this.clasif = clasif;
this.bal = bal;
this.safenight = safenight;
this.locked = blocked;		
//NGM.dump(clasif);
//NGM.dump(this.tempr);
//NGM.dump(this.bal);
//NGM.dump(this.tempw);
	var t = "Eliminar Perfil";
		if(this.bal == "Sin Límite"){
			var b = bal;
			var idb = "-1";
		}
		else{
			var b = "$"+bal;
			var idb = bal;
		}
		

		if(this.safenight){	
			var sN = "Noche segura activada";
		}
		else{
			var sN = "Noche segura desactivada";
		}
		if(this.tempr)
			this.clasif = this.tempr;
		
		if(this.tempw != ""){
				if(this.bal == "Sin Límite"){
					var b = this.tempw;
					var idb = "-1";
				}
				else{
					var b = "$"+this.tempw;
					var idb = this.tempw;
				}	
			}
			
			
		if(this.root){
			
			var options = [
					{"selector":"back","id":"back","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png","img":""},
					{"selector":"save","id":"save","text": "Guardar y salir","badge":"img/admin/users/icono-save.png","img":img},
					{"selector":"rating","id":this.clasif,"badge":"img/admin/users/icono-rating-L.png"},
					{"selector":"block","id":"block","text": blocked,"badge":"img/admin/users/icono-lockedChannel.png","img":""},
					{"selector":"safe","id":"safe","text": sN, "badge":"","active":this.safenight}
			];
		}
		else{
			var options = [
					{"selector":"back","id":"back","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png","img":""},
					{"selector":"save","id":"save","text": "Guardar y salir","badge":"img/admin/users/icono-save.png","img":img},
					{"selector":"rating","id":this.clasif,"badge":"img/admin/users/icono-rating-L.png"},
					{"selector":"wallet","id": idb,"name":b,"badge":"img/admin/users/icono-wallet-L.png"},
					{"selector":"block","id":"block","text": blocked,"badge":"img/admin/users/icono-lockedChannel.png","img":""},
					{"selector":"safe","id":"safe","text": sN, "badge":"","active":this.safenight},
					{"selector":"del","id":"del","text": t, "badge":"img/admin/users/1x1-cancelar.png"} 
			];
		}
		w.users.stateChange("exit");
		w.options.setData(options);
		w.options.stateChange("enter");
				if(this.root){
					w.rightArrow.setData();
					w.rightArrow.stateChange("exit_5");	
					this.state = "enter_5";
					w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
					w.rightArrow.setData({"url":"", "line": true, "position": "right"});
		  			w.rightArrow.stateChange(this.state);
		  			w.leftArrow.stateChange("enter");
				
				}
				else{
					w.rightArrow.setData();
					w.rightArrow.stateChange("exit_6");	
					this.state = "enter_6";
					w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
					w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
	  				w.rightArrow.stateChange(this.state);	
	  				w.leftArrow.stateChange("enter");
				}
				this.focus = "preferences";
				
				var header = [
					{"title":"Perfil: "+text,"sub": "Edita las preferencias de este perfil."}
				];
				w.header.setData(header);
				w.header.refresh();
				
		
}

users.prototype.blockChannels = function blockChannels(id,img){

var w = this.widgets;

w.options.stateChange("exit");
		
//cambiar ícono por el de "x"
var back = {"id":"back","text": "Cancelar","badge":"img/admin/users/1x1-cancelar.png","img":""}
			
var save = {"id":"save","text": "Guardar y regresar","badge":"img/admin/users/icono-save.png","img":this.img}
this.list = [];

this.list.push(back);			
this.list.push(save);
var params = ["&proId="+this.userId]
getServices.getSingleton().call("ADMIN_GET_BLOCKED_CHANNELS",params,this.responseGetBlockedChannels.bind(this));

}

users.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
	switch(this.focus){
		//caso lista usuarios
		case "search":
			switch(_key){	
				case "KEY_DOWN":
				case "KEY_MENU":
				case "KEY_IRBACK":
					this.home.disableSearchHeader();
						switch(this.lastFocus){
							case "users":
								w.users.setFocus(true);
								this.focus = "users";
							break;
							
							case "preferences":
								w.options.setFocus(true);
								this.focus = "preferences";
							break;
							
							case "blocked":
								w.channels.setFocus(true);
								this.focus = "blocked";
							break;
							
							
						
						}
					
				break;
				
				default:
					this.home.onKeyPress(_key);
				break;
			}
		break;
		
		case "users":
			switch(_key){		
				case "KEY_LEFT":
				case "KEY_RIGHT":			
					_key == "KEY_LEFT"
					if(_key == "KEY_LEFT"){
						if(w.users.scrollPrev()){
							if(w.users.maxItem > 6){		
										if(w.users.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.users.selectIndex == (w.users.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.users.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.users.selectIndex+1 <= w.users.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
							}
						}
					}
					else{
						if(w.users.scrollNext()){
							if(w.users.maxItem > 6){		
										if(w.users.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.users.selectIndex == (w.users.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.users.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.users.selectIndex+1 <= w.users.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}	
							}
						}
					}	
				break;
				
				case "KEY_IRENTER":
					switch(w.users.selectItem.id){
						case "r":
							w.bg.stateChange("exit");
							w.users.stateChange("exit");
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							w.header.stateChange("exit");
							this.home.closeSection(this);
						break;
						
						case "n":
						this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa el alias del nuevo perfil: ","text2":"No has ingresado alias o el formato es inválido, ingresa uno válido.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":true}, true,,true);
						
						break;
						
						default:
							this.preferences(w.users.selectItem.id,w.users.selectItem.root,w.users.selectItem.text,w.users.selectItem.img,w.users.selectItem.clasif,w.users.selectItem.balance,w.users.selectItem.lockedChannels,w.users.selectItem.safenight);
						break;
						
					}
				break;
				
				case "KEY_MENU":
				case "KEY_IRBACK":
					w.bg.stateChange("exit");
					w.users.stateChange("exit");
					w.leftArrow.stateChange("exit");
					w.rightArrow.stateChange("exit");
					w.header.stateChange("exit");
					this.home.closeSection(this);
				break;
				
				case "KEY_UP":
					this.home.enableSearchHeader();
					this.lastFocus = this.focus;
					w.users.setFocus(false);
					this.focus = "search";
				break;
			}
		break;
		
	//caso menú de preferencias de usuario	
		case "preferences":
		
		switch(_key){
			case "KEY_LEFT":
			if(w.options.scrollPrev()){
					if(w.options.maxItem > 6){		
										if(w.options.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.options.selectIndex == (w.options.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.options.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.options.selectIndex+1 <= w.options.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
							}
						
			
			
			
				if(this.root){
					
					switch(w.options.selectItem.selector){
				
						case "back":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Edita las preferencias de este perfil."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "save":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Guardar los cambios realizados."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "rating":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Cambia la clasificación máxima de contenido que este usuario podrá ver en el sistema."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "block":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Edita los canales que este usuario tendrá bloqueados."}
							];	
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "safe":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "\"Noche segura\" es la función de Totalplay que bloquea los programas con clasificación D a partir de las "+ tpng.app.safeNightStart +" horas hasta las "+tpng.app.safeNightEnd+" horas."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "del":
						break;
					
					}
				}
				else{
					switch(w.options.selectItem.selector){
						
						case "back":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Edita las preferencias de este perfil."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "save":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Guardar los cambios realizados."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "rating":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Cambia la clasificación máxima de contenido que este usuario podrá ver en el sistema."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "wallet":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Asigna un límite de gasto mensual a este usuario."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "block":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Edita los canales que este usuario tendrá bloqueados."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "safe":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "\"Noche segura\" es la función de Totalplay que bloquea los programas con clasificación D a partir de las "+ tpng.app.safeNightStart +" horas hasta las "+tpng.app.safeNightEnd+" horas."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "del":
						break;
						
					
					}				
				}
			}
			break;	
			
			case "KEY_RIGHT":
			if(w.options.scrollNext()){
			
				if(w.options.maxItem > 6){		
										if(w.options.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.options.selectIndex == (w.options.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.options.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.options.selectIndex+1 <= w.options.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}	
							}
			
			
				if(this.root){
					switch(w.options.selectItem.selector){
						case "back":
						break;
						
						case "save":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Guardar los cambios realizados."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "rating":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Cambia la clasificación máxima de contenido que este usuario podrá ver en el sistema."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "block":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Edita los canales que este usuario tendrá bloqueados."}
							];	
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "safe":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "\"Noche segura\" es la función de Totalplay que bloquea los programas con clasificación D a partir de las "+ tpng.app.safeNightStart +" horas hasta las "+tpng.app.safeNightEnd+" horas."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "del":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Elimina permanentemente de todos tus dispositivos este perfil (esta acción no se puede deshacer)."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
					
					}
				}
				else{
					switch(w.options.selectItem.selector){
						case "back":
						break;
						
						case "save":
						var header = [
								{"title":"Perfil: "+this.user,"sub": "Guardar los cambios realizados."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "rating":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Cambia la clasificación máxima de contenido que este usuario podrá ver en el sistema."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "wallet":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Asigna un límite de gasto mensual a este usuario."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "block":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Edita los canales que este usuario tendrá bloqueados."}
							];	
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "safe":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "\"Noche segura\" es la función de Totalplay que bloquea los programas con clasificación D a partir de las "+ tpng.app.safeNightStart +" horas hasta las "+tpng.app.safeNightEnd+" horas."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
						case "del":
							var header = [
								{"title":"Perfil: "+this.user,"sub": "Elimina permanentemente de todos tus dispositivos este perfil (esta acción no se puede deshacer)."}
							];
							w.header.setData(header);
							w.header.refresh();
						break;
						
					
					}				
				}
			}	
			break;
			
			case "KEY_IRENTER":
				switch(w.options.selectItem.selector){
					case "back":
						var header = [
											{"title":"Control parental","sub": "Crea y edita las preferencias de los perfiles asociados a tu cuenta."}
								];
								w.header.setData(header);
								w.header.refresh();
								w.leftArrow.stateChange("exit");
								w.rightArrow.stateChange("exit");
								w.options.stateChange("exit");
								this.tempw = "";
								this.tempr = "";
								w.users.stateChange("enter");
								this.focus = "users";
								if(w.users.list.length-w.users.selectIndex <= 7){
									w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line": false, "position": "left"});
									w.leftArrow.stateChange("enter");
								
								}
								else{
									w.leftArrow.setData({"url":"", "line": true, "position": "left"});
									w.leftArrow.stateChange("enter");
								}
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
					break;
					
					case "save":
								var l = w.options.list.length;
								for(var i = 0; i<l; i++){
									if(w.options.list[i].selector == "rating"){
									
										this.rating = w.options.list[i].id;
									}
									if(w.options.list[i].selector == "wallet"){
								
										this.wallet = w.options.list[i].id;		
									}
								}
								this.focus = "";
								this.updateAll();
								
								//this.updateSafeNight();
								
					break;
					
					case "rating":
				
						switch(w.options.selectItem.id){
							case "AA":
								w.options.selectItem.id = "A";
							break;
							case "A":
								w.options.selectItem.id = "B";
							break;
							case "B":
								w.options.selectItem.id = "B-15";
							break;
							case "B-15":
								w.options.selectItem.id = "C";
							break;
							case "C":
								w.options.selectItem.id = "D";
							break;
							case "D":
								w.options.selectItem.id = "AA";
							break;
						}
						this.tempr = w.options.selectItem.id;
						
						w.options.redraw(true);
					break;
					
				case "wallet":
						switch(w.options.selectItem.id){
							case "-1":
								w.options.selectItem.id = "0";
								w.options.selectItem.name = "$0";
							break;
							case "0":
								w.options.selectItem.id = "50";
								w.options.selectItem.name = "$50";
							break;
							case "50":
								w.options.selectItem.id = "100";
								w.options.selectItem.name = "$100";
							break;
							case "100":
								w.options.selectItem.id = "200";
								w.options.selectItem.name = "$200";
							break;
							case "200":
								w.options.selectItem.id = "300";
								w.options.selectItem.name = "$300";
							break;
							case "300":
								w.options.selectItem.id = "1000";
								w.options.selectItem.name = "$1000";
							break;
							case "1000":
								w.options.selectItem.id = "-1";
								w.options.selectItem.name = "Sin Límite";
							break;
							
							default:
								if(this.bal > 0 && this.bal < 50){
									w.options.selectItem.id = "50";
									w.options.selectItem.name = "$50";
								}
								if(this.bal > 50 && this.bal < 100){
									w.options.selectItem.id = "100";
									w.options.selectItem.name = "$100";
								}
								if(this.bal > 100 && this.bal < 200){
									w.options.selectItem.id = "200";
									w.options.selectItem.name = "$200";
								}
								if(this.bal > 200 && this.bal < 300){
									w.options.selectItem.id = "300";
									w.options.selectItem.name = "$300";
								}
								if(this.bal > 300 && this.bal < 1000){
									w.options.selectItem.id = "1000";
									w.options.selectItem.name = "$1000";
								}
							break;
						}
						this.tempw = w.options.selectItem.id;
						w.options.redraw(true);
					break;	
					
				case "block":
					this.blockChannels(this.userId);
					this.focus = "blocked";
				break;	
				
				case "safe":
					if(!w.options.selectItem.active){
								this.active = w.options.selectItem.active;
								w.options.selectItem.active = true;
								w.options.redraw(true);
								this.updateSafe(w.options.selectItem.active);
								}
							else{
								this.active = w.options.selectItem.active
								w.options.selectItem.active = false;
								this.updateSafe(w.options.selectItem.active);
								w.options.redraw(true);
							}
				break;
				
				case "del":
					this.home.openSection("confirm",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":"¿Deseas eliminar el perfil "+this.user+" ?", "txt1": "Eliminar: "+this.user, "txt2": "", "txt3": ""}}, false,null,true);
					//this.deleteUsers();	
				break;
				}
			break;
				
				case "KEY_MENU":
				case "KEY_IRBACK":
					this.client.lock();	
							var header = [
										{"title":"Control parental","sub": "Crea y edita las preferencias de los perfiles asociados a tu cuenta."}
							];
							w.header.setData(header);
							w.header.refresh();
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							this.tempw = "";
							this.tempr = "";
							w.options.stateChange("exit");	
							w.users.stateChange("enter");
							this.focus = "users";
							
							if(w.users.list.length-w.users.selectIndex <= 7 && w.users.list.length >= 6){
									w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line": false, "position": "left"});
									w.leftArrow.stateChange("enter");
								
								}
								else { 
									w.leftArrow.setData({"url":"", "line": true, "position": "left"});
									w.leftArrow.stateChange("enter");
								}
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
					this.client.unlock();
				break;
				
				case "KEY_UP":
					this.home.enableSearchHeader();
					this.lastFocus = this.focus;
					w.options.setFocus(false);
					this.focus = "search";
				break;
			}
		break;
	
	//caso bloquear canales
	
	case "blocked":
		switch(_key){
			case "KEY_LEFT":
				case "KEY_RIGHT":			
					if(_key == "KEY_LEFT"){
						if(w.channels.scrollPrev()){
							if(w.channels.maxItem > 6){		
										if(w.channels.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.channels.selectIndex == (w.channels.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.channels.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.channels.selectIndex+1 <= w.channels.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
							}
						}
					}
					else{
						if(w.channels.scrollNext()){
							if(w.channels.maxItem > 6){		
										if(w.channels.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.channels.selectIndex == (w.channels.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.channels.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.channels.selectIndex+1 <= w.channels.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}	
							}
						}
					}	
				break;	
				
					
				case "KEY_IRENTER":
					switch(w.channels.selectItem.id){
						case "back":
						  this.client.lock();
								var header = [
											{"title":"Perfil: "+this.user,"sub": "Edita los canales que este usuario tendrá bloqueados."}
								];
								w.header.setData(header);
								w.header.refresh();
								w.leftArrow.stateChange("exit");
								w.rightArrow.stateChange("exit");
								w.channels.stateChange("exit");
								w.options.stateChange("enter");
								
								if(w.options.list.length == 6){
									w.rightArrow.setData({"url":"", "line": true, "position": "right"});
									w.rightArrow.stateChange("enter_5");
								}
								else{
								
									w.rightArrow.setData({"url":"", "line": true, "position": "right"});
									w.rightArrow.stateChange("enter_6");
								}
								w.channels.stateChange("exit");
								this.focus = "preferences";
								w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
								w.leftArrow.stateChange("enter");
						   this.client.unlock();
						break;
						
						case "save":
							  this.client.lock();
							  	  this.focus = "";	
								  this.blocked = [];
								  	for(var i = 2; i< w.channels.list.length; i++){
								  			if(w.channels.list[i].locked == true){
								  				this.blocked.push(w.channels.list[i].text);
								  			}
								  	}
										var header = [
												{"title":"Perfil: "+this.user,"sub": "Edita los canales que este usuario tendrá bloqueados."}
										];
									w.header.setData(header);
									w.header.refresh();
									w.leftArrow.stateChange("exit");
									w.rightArrow.stateChange("exit");
									w.channels.stateChange("exit");
									w.channels.stateChange("exit");
									this.focus = "preferences";
									//this.tempw = "";
									w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
									w.leftArrow.stateChange("enter");
									this.preferences(w.users.selectItem.id,w.users.selectItem.root,w.users.selectItem.text,w.users.selectItem.img,w.users.selectItem.clasif,w.users.selectItem.balance,this.blocked.length);
						   	  this.client.unlock();
						break;
						default:
							if(w.channels.selectItem.locked == false){
								w.channels.selectItem.locked = true;
								w.channels.redraw(w.channels.selectItem);
							}
							else{
								w.channels.selectItem.locked = false;
								w.channels.redraw(w.channels.selectItem);
							}
						break;
					}
				break;
				
				case "KEY_MENU":
				case "KEY_IRBACK":
						this.client.lock();	
							var header = [
											{"title":"Perfil: "+this.user,"sub": "Edita los canales que este usuario tendrá bloqueados."}
								];
								w.header.setData(header);
								w.header.refresh();
								w.leftArrow.stateChange("exit");
								w.rightArrow.stateChange("exit");
								w.channels.stateChange("exit");
								w.options.stateChange("enter");
								
								if(w.options.list.length == 6){
									w.rightArrow.setData({"url":"", "line": true, "position": "right"});
									w.rightArrow.stateChange("enter_5");
								}
								else{
								
									w.rightArrow.setData({"url":"", "line": true, "position": "right"});
									w.rightArrow.stateChange("enter_6");
								}
								w.channels.stateChange("exit");
								this.focus = "preferences";
								w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
								w.leftArrow.stateChange("enter");
					this.client.unlock();
				break;
				
				case "KEY_UP":
					this.home.enableSearchHeader();
					this.lastFocus = this.focus;
					w.channels.setFocus(false);
					this.focus = "search";
				break;
			}
	break;
		
	}	
	return true;
}




users.drawUsers = function drawUsers(_data){
	this.draw = function draw(focus) {
			var ctx = this.getContext("2d");
			ctx.beginObject();
		    ctx.clear();
			//imagen
			tp_draw.getSingleton().drawImage(_data.img, ctx, 5, 5,null, null, null,"destination-over");
			
			//si es usuario
			if(_data.text != "Regresar" && _data.text !="Nuevo perfil"){
					//panel negro no foco
							var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
							custo = JSON.parse(custo);
							custo.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.9)";
							Canvas.drawShape(ctx, "rect", [4, 4, ctx.viewportWidth-8, ctx.viewportHeight-8], custo);				
					//nombre del perfil
						    var custo_f = JSON.stringify(this.themaData.standardFont);
							custo_f = JSON.parse(custo_f);
							custo_f.text_align = "center,middle";
							custo_f.font_size = 18* tpng.thema.text_proportion;
							custo_f.fill = "rgba(255,240,200,1)";	
							Canvas.drawText(ctx, _data.text+"", new Rect(64,16,ctx.viewportWidth-68,64), custo_f);
					//clasificación
							custo_f.text_align = "center,middle";
							Canvas.drawText(ctx,_data.clasif, new Rect(131,71,ctx.viewportWidth-137,32), custo_f);
					//badge clasificación	
							tp_draw.getSingleton().drawImage(_data.badge1, ctx, 68, 71, null, null, null);
					//si es root
							if(_data.root){
										//badge root
										tp_draw.getSingleton().drawImage("img/admin/users/icono_Root.png", ctx, 5, 35, null, null, null);
										//badge canales
										tp_draw.getSingleton().drawImage(_data.badge3, ctx, 68, 105, null, null, null);
										//canales bloqueados
										_data.lockedChannels = _data.lockedChannels.toString();
										Canvas.drawText(ctx,_data.lockedChannels, new Rect(131,105,ctx.viewportWidth-137,34), custo_f);
							}
							else{
							//monedero
								if(_data.balance == "Sin Límite" || _data.balance == "1000"){
										
										if(_data.balance == "1000"){
											var balance = "$"+_data.balance;
											custo_f.font_size = 16* tpng.thema.text_proportion;
											custo_f.text_multiline = "true";
										}
										else{
											var balance = "Sin Límite";
											custo_f.font_size = 14* tpng.thema.text_proportion;
											custo_f.text_multiline = "true";
										}
										Canvas.drawText(ctx,balance, new Rect(131,105,ctx.viewportWidth-137,34), custo_f);
										custo_f.font_size = 18* tpng.thema.text_proportion;
									}
								else{
										if(_data.balance =="$1000"){
											custo_f.font_size = 16* tpng.thema.text_proportion;
											Canvas.drawText(ctx,_data.balance, new Rect(131,105,ctx.viewportWidth-137,34), custo_f);
										}
										else{
											Canvas.drawText(ctx,"$"+_data.balance, new Rect(131,105,ctx.viewportWidth-137,34), custo_f);
										}
								}
								//canales bloqueados	
									_data.lockedChannels = _data.lockedChannels.toString();
									Canvas.drawText(ctx,_data.lockedChannels, new Rect(131,140,ctx.viewportWidth-137,34), custo_f);
								//badge mondero
									tp_draw.getSingleton().drawImage(_data.badge2, ctx, 68, 105, null, null, null);
								//badge canales
									tp_draw.getSingleton().drawImage(_data.badge3, ctx, 68, 140, null, null, null);
							}	
					//badge	facebook o twitter falta validar cuando son fb y tw
							if(_data.fb){
								tp_draw.getSingleton().drawImage(_data.badge, ctx, 135, 3, null, null, null);
							}
							if(_data.tw){
								tp_draw.getSingleton().drawImage(_data.badge, ctx, 135, 3, null, null, null);				
							}
				}
			//si es el botón de regresar	
			else{
					if(_data.text == "Regresar"){
						//fondo naranja
							Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10, ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
							var custo_f = JSON.stringify(this.themaData.standardFont);
							custo_f = JSON.parse(custo_f);
							custo_f.text_align = "center,middle";
							custo_f.font_size = 20* tpng.thema.text_proportion;
							custo_f.fill = "rgba(255,240,200,1)";	
						//texto regresar
							Canvas.drawText(ctx, _data.text+"", new Rect(68,0,110,ctx.viewportHeight-6), custo_f);
						//badge regresar	
							tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);
					}
				//nuevo usuario
					else if(_data.text == "Nuevo perfil"){
							Canvas.drawShape(ctx, "rect", [5,5, ctx.viewportWidth-10, ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
							var custo_f = JSON.stringify(this.themaData.standardFont);
							custo_f = JSON.parse(custo_f);
							custo_f.text_align = "center,middle";
							custo_f.font_size = 20* tpng.thema.text_proportion;
							custo_f.fill = "rgba(255,240,200,1)";	
						//texto regresar
							Canvas.drawText(ctx, _data.text+"", new Rect(68,0,110,ctx.viewportHeight-6), custo_f);
						//badge regresar	
							tp_draw.getSingleton().drawImage(_data.badge1, ctx, 2, 72, null, null, null);
					}	
			}	
						
			//stroke
		    var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : null;
			custo = JSON.parse(custo);
			if(focus){
				custo.rx = 5;
				custo.stroke_width = 5;
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

				var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_position" : "inside"};
				Canvas.drawShape(ctx, "rect", [7, 7, ctx.viewportWidth-14,ctx.viewportHeight-14], strokeF);
				//388 //222
			}		
		    
		    ctx.drawObject(ctx.endObject());
	}
}

users.drawOptions = function drawOptions(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
				ctx.beginObject();
		    	ctx.clear();
		switch(_data.selector){
		
			case "back":
					Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
						var custo_f = JSON.stringify(this.themaData.standardFont);
						custo_f = JSON.parse(custo_f);
						custo_f.text_align = "center,middle";
						custo_f.font_size = 18* tpng.thema.text_proportion;
						custo_f.fill = "rgba(240,240,250,1)";	
				//texto
					Canvas.drawText(ctx, _data.text+"", new Rect(68,0,110,ctx.viewportHeight-6), custo_f);
				//badge
					tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 77, null, null, null);	
			break;
			
			case "save":
					//imagen
					tp_draw.getSingleton().drawImage(_data.img, ctx, 5, 5,null, null, null,"destination-over");
					
					//panel negro no foco
					var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
					custo = JSON.parse(custo);
					custo.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.9)";
					custo.stroke_width = null;
					Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], custo);
					
					var custo_f = JSON.stringify(this.themaData.standardFont);
					custo_f = JSON.parse(custo_f);
					custo_f.text_align = "center,middle";
					custo_f.font_size = 18* tpng.thema.text_proportion;
					custo_f.fill = "rgba(240,240,250,1)";		
					
					//texto regresar
					Canvas.drawText(ctx, _data.text+"", new Rect(68,0,110,ctx.viewportHeight-6), custo_f);
					
					//badge regresar	
					tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);
						
			break;
			
			case "block":
					Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
					
					var custo_f = JSON.stringify(this.themaData.standardFont);
					custo_f = JSON.parse(custo_f);
					custo_f.text_align = "center,middle";
					custo_f.font_size = 20* tpng.thema.text_proportion;
					custo_f.fill = "rgba(240,240,250,1)";		
						//texto regresar
						if(_data.text == 0){
							_data.text = "Ninguno";
						}
						else{
							_data.text = _data.text.toString();
						}
					Canvas.drawText(ctx, _data.text+"", new Rect(68,0,110,ctx.viewportHeight-6), custo_f);
					
					//badge regresar	
					tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);
					
					custo_f.font_size = 18* tpng.thema.text_proportion;
					custo_f.fill = "rgba(170,170,180,1)";	
					Canvas.drawText(ctx, "<!i>Canales bloqueados<!>", new Rect(3,125,ctx.viewportWidth-6,45), custo_f);
					
			break;
			
			case "safe":
					Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
				if(!_data.active){	
						if(_data.text == "Noche segura activada"){
							_data.text = "Noche segura desactivada";
						}
						tp_draw.getSingleton().drawImage("img/admin/nip/1x1-switchOFFbloq.png", ctx, 0, 72,null, null, null);
					}
					else if(_data.active){
						if(_data.text == "Noche segura desactivada"){
							_data.text = "Noche segura activada";
						}
						tp_draw.getSingleton().drawImage("img/admin/nip/1x1-switchONbloq.png", ctx, 0, 72,null, null, null);
					}	
			var custo_f = JSON.stringify(this.themaData.standardFont);
				custo_f = JSON.parse(custo_f);
				custo_f.text_align = "center,middle";
				custo_f.font_size = 18* tpng.thema.text_proportion;
				custo_f.fill = "rgba(170,170,180,1)";	
				Canvas.drawText(ctx, "<!i>"+_data.text+"<!>", new Rect(3,125,ctx.viewportWidth-6,45), custo_f);		
			break;
			
			case "del":
				Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
						var custo_f = JSON.stringify(this.themaData.standardFont);
						custo_f = JSON.parse(custo_f);
						custo_f.text_align = "center,middle";
						custo_f.font_size = 18* tpng.thema.text_proportion;
						custo_f.fill = "rgba(240,240,250,1)";	
				//texto
					Canvas.drawText(ctx, _data.text+"", new Rect(68,0,110,ctx.viewportHeight-6), custo_f);
				//badge
					tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);	
			break;
			
			case "rating":
				Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10 ,ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
					
			var custo_f = JSON.stringify(this.themaData.standardFont);
				custo_f = JSON.parse(custo_f);
				custo_f.text_align = "center,middle";
				custo_f.font_size = 20* tpng.thema.text_proportion;
				custo_f.fill = "rgba(240,240,250,1)";		
				
				//texto 
				Canvas.drawText(ctx, _data.id+"", new Rect(68,0,110,ctx.viewportHeight-6), custo_f);
				
				//badge	
				tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);
					
				custo_f.font_size = 18* tpng.thema.text_proportion;
				custo_f.fill = "rgba(170,170,180,1)";	
				Canvas.drawText(ctx, "<!i>Clasificación<!>", new Rect(3,125,ctx.viewportWidth-6,45), custo_f);

			break;
			
			case "wallet":
				Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
					
			var custo_f = JSON.stringify(this.themaData.standardFont);
				custo_f = JSON.parse(custo_f);
				custo_f.text_align = "center,middle";
				custo_f.font_size = 20* tpng.thema.text_proportion;
				custo_f.fill = "rgba(240,240,250,1)";		
				
				//texto 
				Canvas.drawText(ctx, _data.name+"", new Rect(68,0,110,ctx.viewportHeight-6), custo_f);
				
				//badge	
				tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);
				
				custo_f.font_size = 18* tpng.thema.text_proportion;
				custo_f.fill = "rgba(170,170,180,1)";	
				Canvas.drawText(ctx, "<!i>Monedero<!>", new Rect(3,125,ctx.viewportWidth-6,45), custo_f);
				
			break;
			
		}
		
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
	
	ctx.drawObject(ctx.endObject());
	}	    
}		

users.drawChannels = function drawChannels(_data){
	
		this.draw = function draw(focus) {
			var ctx = this.getContext("2d");
				ctx.beginObject();
	   			ctx.clear();
				if(_data.text != "Cancelar"){
					//si es canal#0-#b4283c|1-#dc3c46
						if(_data.text != "Guardar y regresar"){
								//panel naranja
								if(_data.locked){
									Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], {"fill":"0-rgba(180,40,60,1)|1-rgba(80,20,30,1)"});
								}
								else{
									Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});	
								}
								//imagen
								tp_draw.getSingleton().drawImage(_data.img, ctx, 60, 48,null, null, null);
								
								//nombre del perfil
							    var custo_f = JSON.stringify(this.themaData.standardFont);
								custo_f = JSON.parse(custo_f);
								custo_f.text_align = "center,top";
								custo_f.font_size = 24 * tpng.thema.text_proportion;
								custo_f.fill = "rgba(255,240,200,1)";	
								Canvas.drawText(ctx, "Canal "+_data.text+"", new Rect(3,105,ctx.viewportWidth-6,34), custo_f);
								
								if(_data.locked == true)
									tp_draw.getSingleton().drawImage(_data.badge, ctx, 128, 3, null, null, null);
									
							}
							//si es guardar y regresar
							else{
							
							//imagen
								tp_draw.getSingleton().drawImage(_data.img, ctx, 5, 5,null, null, null,"destination-over");
								var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
								custo = JSON.parse(custo);
								custo.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.9)";
								custo.stroke_width = null;
								Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);								

								//texto guardar y regresar
								var custo_f = JSON.stringify(this.themaData.standardFont);
								custo_f = JSON.parse(custo_f);
								custo_f.text_align = "left,middle";
								custo_f.font_size = 20* tpng.thema.text_proportion;
								custo_f.fill = "rgba(255,240,200,1)";	
								Canvas.drawText(ctx, _data.text+"", new Rect(93,0,90,ctx.viewportHeight-6), custo_f);
								//badge guardar y regresar	
								tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);
							}
					}
				//si es el botón de cancelar	
				else{
					//fondo naranja
						Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
						var custo_f = JSON.stringify(this.themaData.standardFont);
						custo_f = JSON.parse(custo_f);
						custo_f.text_align = "left,middle";
						custo_f.font_size = 20* tpng.thema.text_proportion;
						custo_f.fill = "rgba(255,240,200,1)";	
					//texto cancelar
						Canvas.drawText(ctx, _data.text+"", new Rect(93,0,90,ctx.viewportHeight-6), custo_f);
					//badge cancelar	
						tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 77, null, null, null);
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
		    ctx.drawObject(ctx.endObject());
		}
}



users.drawBgUsers = function drawBgUsers(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
		 
		ctx.drawObject(ctx.endObject());
}

users.drawAdvice = function drawAdvice(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
		    var custo_t = JSON.stringify(this.themaData.standardFont);
			custo_t = JSON.parse(custo_t);
			custo_t.text_align = "left,top";
			custo_t.font_size = 24* tpng.thema.text_proportion;
			custo_t.fill = "rgba(240,240,250,1)";
			
			Canvas.drawText(ctx, _data[0].title, new Rect(0,0,ctx.viewportWidth-67,ctx.viewportHeight-6), custo_t);
			
			custo_t.font_size = 20* tpng.thema.text_proportion;
			Canvas.drawText(ctx, _data[0].sub, new Rect(64,38,ctx.viewportWidth-131,ctx.viewportHeight-44), custo_t);
		
		ctx.drawObject(ctx.endObject());
}


users.drawArrowsU = function drawArrowsU(_data){
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

