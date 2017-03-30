//types teclado
/*
 k - teclado completo con últimas búsquedas
 ks - teclado completo sin últimas búsquedas
 n - teclado numérico con últimas búsquedas
 ns - teclado numérico sin últimas búsquedas
 NO SUBIR YA QUE ESTÁ HARDCODEADO PARA QUE SE PUEDA USAR LOCALMENTE, 
 PARA SUBIR CAMBIAR LÍNEAS QUE INDICA ABAJO
 */

FormWidget.registerTypeStandard("keyboard");

function keyboard(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	this.focus = "letters";
   	this.alpha = true;
   	this.lastFocus = "";
   	this.first = 0;
   	this.capital = 1;
   	this.at =[];
}

keyboard.inherits(FormWidget);

keyboard.prototype.onEnter = function onEnter(_data){	
	var www = settings.get("tpng.app.lastWords");
	if(www.length > 0){
		//BINARIO
		tpng.app.lastWords = www.split(",");
		//PRUEBAS LOCALES
		//tpng.app.lastWords = www;
	}
	this.type = _data.type;
	this.text1 = _data.text1;
	this.text2 = _data.text2;
	this.section = _data.parent.formName;
	if(_data.pattern)
	this.pattern = _data.pattern;
	
	if(_data.nip)
	this.nip = _data.nip;
	
	this.ok = _data.ok;
	this.cancel = _data.cancel;
	this.parent = _data.parent;
	this.valid = _data.valid;
	if(this.section == "setup" && this.parent.answer != "" && this.parent.step == 5){
		this.parent.answer = "";
		//this.parent.question = "";
	}
	if(this.section == "setup" && this.parent.alias != "" && this.parent.step == 2){
		this.parent.alias = "";
	}
	
	if(this.section == "setup" && this.parent.mail != "" && this.parent.step == 6){
		this.parent.mail = "";
	}
	
	this.home = _data.home;
	
	this.showPanel();
	
}


keyboard.prototype.showPanel = function showPanel(){
	var w = this.widgets,
		panel = w.panelKeyboard,
		panel2 = w.panelKeyboard2,
		panel3 = w.panelKeyboard3,
		letters = w.letters,
		shift = w.shift,
		space = w.space,
		confirmButtons = w.confirmButtons,
		zero = w.zero,
		symbols = w.symbols,
		words = w.words,
		counter = w.counter;

	
	panel.setData({"text1":this.text1,"text2":this.text2,"valid":this.valid});
	panel2.setData();
	panel3.setData();
	
	switch(this.type){
	// teclado con búsquedas
		case "k":
		var back = w.back;
		var ws = [];
		var six = 0;
		var input = w.keyboardInput;
		this.at.push({"word":"gmail.com"});
		this.at.push({"word":"outlook.com"});
		this.at.push({"word":"hotmail.com"});
		this.at.push({"word":"yahoo.com"});	
		
		if(tpng.app.lastWords.length > 0){
			for(var i = tpng.app.lastWords.length-1; i >= 0 && six<6; i--){
				ws.push({"word":tpng.app.lastWords[i]});
				six++;
			}
			ws.push({"id":"delete"});
			words.setData(ws);
			words.stateChange("enter");
			words.setFocus(false);
		}
		else{
			//words.setData(this.at);
			//words.stateChange("enter");
			//words.setFocus(false);
		}	
				
			
			letters.setData(this.fillCapitalLetters());
			shift.setData({"active":false,"capital":1});
			space.setData({"active":false});
			back.setData({"active":false});
			zero.setData({"active":false});
			symbols.setData({"active":false,"text":"@#:"});
			var confirm =[{"id":"ok","value":this.ok},
						  {"id":"cancel","value":this.cancel}];
			confirmButtons.setData(confirm);
				if(this.pattern){
					input.setData(this.pattern);
				}else{
					input.setData();
				}
			counter.setData(input.maxLength-input.data.length);		

			input.setFocus(true);
			input.isRightToLeft = true;
			panel.stateChange("enter");
	 		panel2.stateChange("enter");
	 		panel3.stateChange("enter");
			letters.stateChange("enter");
			input.stateChange("enter");
			counter.stateChange("enter");
			shift.stateChange("enter");
			space.stateChange("enter");
			back.stateChange("enter");
			zero.stateChange("enter");
			symbols.stateChange("enter");
			confirmButtons.stateChange("enter");
			confirmButtons.setFocus(false);
			letters.setFocus(true);
			
			this.focus = "letters";
		
		break;
		
		//teclado simple
		case "ks":
			var back = w.back;
			var input = w.keyboardInput;
			letters.setData(this.fillCapitalLetters());
			shift.setData({"active":false,"capital":1});
			space.setData({"active":false});
			back.setData({"active":false});
			zero.setData({"active":false});
			symbols.setData({"active":false,"text":"@#:"});
			var confirm =[{"id":"ok","value":this.ok},
						  {"id":"cancel","value":this.cancel}];
			confirmButtons.setData(confirm);
			
			if(this.pattern){
				input.setData(this.pattern);
			}else{
				input.setData();
			}
			counter.setData(input.maxLength-input.data.length);
			
			input.setFocus(true);
			input.isRightToLeft = true;
			panel.stateChange("enter");
			panel2.stateChange("enter");
			panel3.stateChange("enter");
			letters.stateChange("enter");
			input.stateChange("enter");
			counter.stateChange("enter");
			shift.stateChange("enter");
			space.stateChange("enter");
			back.stateChange("enter");
			zero.stateChange("enter");
			symbols.stateChange("enter");
			confirmButtons.stateChange("enter");
			confirmButtons.setFocus(false);
			letters.setFocus(true);
			
			this.focus = "letters";
		
		break;
	
	}	
	this.widgets.keyboardInput.canvas.resetTextColor = true;

	//Carlos did this
	if(this.section == "wifiHome"){
		NGM.trace(this.parent.objectWithFocus.getData());
		this.widgets.keyboardInput.setData(this.parent.objectWithFocus.getData());
	}
	//Carlos stopped doing it...
}

keyboard.prototype.setTextWhitecolor = function setTextWhitecolor(status){
	this.widgets.keyboardInput.canvas.resetTextColorFocus = status;
	this.widgets.keyboardInput.setFocus(false);
	this.widgets.keyboardInput.setFocus(true);	
}



keyboard.prototype.fillCapitalLetters = function fillCapitalLetters(){
			var	letters =[	{"value": "Q", "size": 48},
						 	{"value": "W", "size": 48},
						 	{"value": "E", "size": 48},
						 	{"value": "R", "size": 48},
						 	{"value": "T", "size": 48},
						 	{"value": "Y", "size": 48},
						 	{"value": "U", "size": 48},
						 	{"value": "I", "size": 48},
						 	{"value": "O", "size": 48},
						 	{"value": "P", "size": 48},
						 	{"value": "1", "size": 48},
						 	{"value": "2", "size": 48},
						 	{"value": "3", "size": 48},
						 	
						 	{"value": "A", "size": 48},
						 	{"value": "S", "size": 48},
						 	{"value": "D", "size": 48},
						 	{"value": "F", "size": 48},
						 	{"value": "G", "size": 48},
						 	{"value": "H", "size": 48},
						 	{"value": "J", "size": 48},
						 	{"value": "K", "size": 48},
						 	{"value": "L", "size": 48},
						 	{"value": "Ñ", "size": 48},
						 	{"value": "4", "size": 48},
						 	{"value": "5", "size": 48},
						 	{"value": "6", "size": 48},
						 	
						 	{"value": "Z", "size": 48},
						 	{"value": "X", "size": 48},
						 	{"value": "C", "size": 48},
						 	{"value": "V", "size": 48},
						 	{"value": "B", "size": 48},
						 	{"value": "N", "size": 48},
						 	{"value": "M", "size": 48},
						 	{"value": "@", "size": 48},
						 	{"value": "/", "size": 48},
						 	{"value": ".", "size": 48},
						 	{"value": "7", "size": 48},
						 	{"value": "8", "size": 48},
						 	{"value": "9", "size": 48} 
						 	];
	return letters;
}

keyboard.prototype.fillLetters = function fillLetters(){
			var	letters =[	{"value": "q", "size": 48},
						 	{"value": "w", "size": 48},
						 	{"value": "e", "size": 48},
						 	{"value": "r", "size": 48},
						 	{"value": "t", "size": 48},
						 	{"value": "y", "size": 48},
						 	{"value": "u", "size": 48},
						 	{"value": "i", "size": 48},
						 	{"value": "o", "size": 48},
						 	{"value": "p", "size": 48},
						 	{"value": "1", "size": 48},
						 	{"value": "2", "size": 48},
						 	{"value": "3", "size": 48},
						 	
						 	{"value": "a", "size": 48},
						 	{"value": "s", "size": 48},
						 	{"value": "d", "size": 48},
						 	{"value": "f", "size": 48},
						 	{"value": "g", "size": 48},
						 	{"value": "h", "size": 48},
						 	{"value": "j", "size": 48},
						 	{"value": "k", "size": 48},
						 	{"value": "l", "size": 48},
						 	{"value": "ñ", "size": 48},
						 	{"value": "4", "size": 48},
						 	{"value": "5", "size": 48},
						 	{"value": "6", "size": 48},
						 	
						 	{"value": "z", "size": 48},
						 	{"value": "x", "size": 48},
						 	{"value": "c", "size": 48},
						 	{"value": "v", "size": 48},
						 	{"value": "b", "size": 48},
						 	{"value": "n", "size": 48},
						 	{"value": "m", "size": 48},
						 	{"value": "@", "size": 48},
						 	{"value": "/", "size": 48},
						 	{"value": ".", "size": 48},
						 	{"value": "7", "size": 48},
						 	{"value": "8", "size": 48},
						 	{"value": "9", "size": 48}
						 	];
	return letters;
}

keyboard.prototype.fillSymbols = function fillSymbols(){
			var	symbols =[	{"value": "<", "size": 48},
						 	{"value": ">", "size": 48},
						 	{"value": "[", "size": 48},
						 	{"value": "]", "size": 48},
						 	{"value": "{", "size": 48},
						 	{"value": "}", "size": 48},
						 	{"value": "(", "size": 48},
						 	{"value": ")", "size": 48},
						 	{"value": "¿", "size": 48},
						 	{"value": "?", "size": 48},
						 	{"value": "1", "size": 48},
						 	{"value": "2", "size": 48},
						 	{"value": "3", "size": 48},
						 	
						 	{"value": "^", "size": 48},
						 	{"value": "&", "size": 48},
						 	{"value": "$", "size": 48},
						 	{"value": "%", "size": 48},
						 	{"value": "\"", "size": 48},
						 	{"value": "_", "size": 48},
						 	{"value": "-", "size": 48},
						 	{"value": "*", "size": 48},
						 	{"value": "¡", "size": 48},
						 	{"value": "!", "size": 48},
						 	{"value": "4", "size": 48},
						 	{"value": "5", "size": 48},
						 	{"value": "6", "size": 48},
						 	
						 	{"value": "+", "size": 48},
						 	{"value": "=", "size": 48},
						 	{"value": ".", "size": 48},
						 	{"value": ":", "size": 48},
						 	{"value": ";", "size": 48},
						 	{"value": ",", "size": 48},
						 	{"value": "#", "size": 48},
						 	{"value": "@", "size": 48},
						 	{"value": "/", "size": 48},
						 	{"value": ".", "size": 48},
						 	{"value": "7", "size": 48},
						 	{"value": "8", "size": 48},
						 	{"value": "9", "size": 48}
						 	];
	return symbols;
}

keyboard.onFocusWords = function onFocusWords(_focus, _data){
	if(_focus){
			if(this.focus == "letters"){
			var w = this.widgets;
			w.words.setFocus(false);
			}
		}
}

keyboard.onFocusLetters = function onFocusLetters(_focus, _data){
	if(_focus){
			if(this.focus == "words" || this.focus == "confirmButtons" || this.focus == "shift" || this.focus == "back" || this.focus == "symbols"){
			var w = this.widgets;
			w.letters.setFocus(false);
			}
		}
}

keyboard.onFocusConfirmButtons = function onFocusConfirmButtons(_focus, _data){
	if(_focus){
			if(this.focus == "letters" || this.focus == "words"){
			var w = this.widgets;
			w.confirmButtons.setFocus(false);
			}
		}
}

keyboard.onFocusShift = function onFocusShift(_focus, _data){
	if(_focus){
		if(this.focus == "letters"){
			var w = this.widgets;
			w.shift.setFocus(false);
		}
	}	
}

keyboard.prototype.validateSections = function validateSections(){
		var w = this.widgets;
		var panel = w.panelKeyboard;
		var panel2 = w.panelKeyboard2;
		var input = w.keyboardInput;

		NGM.trace("hola");
		NGM.trace("Section: " + this.section);
		
		switch (this.section){
			//Carlos did this
			case "wifiHome":
				var s = input.getData();
				this.parent.objectWithFocus.setData(s);
				this.home.closeSection(this);
				break;
			//Carlos stopped doing it...

			//aquí hay que poner las secciones que usan el teclado y que harán cuando dé click		
			 case "login":
			 	var s = input.getData();
			 	if(s.length == 0){}
					else{
						var a = s.split("");
						var cs = 0;
						    for(var i = 0; i< a.length; i++){
								if(a[i] == " "){
									cs++;
									a[i] = "%20";
								}
							}
							
						if(cs > 0){
							var str = "";
							for(var lo = 0; lo < a.length; lo++){
								str = str+a[lo];	
							}
						}	
							
							if(cs == a.length){
								this.valid = false;
						    	panel.setData({"text1":"Ingresa tu respuesta: ","text2":"No has ingresado una respuesta.","valid":this.valid});
						    	panel.refresh();
							}
							else{
								if(s.length > 50){
										this.valid = false;
										panel.setData({"text1":"Ingresa tu respuesta: ","text2":"La respuesta debe ser de 50 o menos caracteres.","valid":this.valid});
						    			panel.refresh();
								}else if(s.length < 3){
										this.valid = false;
										panel.setData({"text1":"Ingresa tu respuesta: ","text2":"La respuesta debe ser igual o mayor a 3 caracteres.","valid":this.valid});
						    			panel.refresh();
								}else{
							
									if(str.length > 0){
										this.home.closeSection(this);
										this.parent.validateAnswer(str);
									}
									else{
										this.home.closeSection(this);
				    					this.parent.validateAnswer(s);
				    				}
			    				}
							}					
					}
			 break;
			    			
			 case "users":
			 var s = input.getData();				
			    	if(s.length >= 4){
			    		var a = s.split("");
						var cs = 0;
						for(var i = 0; i< a.length; i++){
							if(a[i] == " "){
								cs++;
							}
						}
						
						if(cs == a.length){
							this.valid = false;
						    panel.setData({"text1":"Ingresa el alias del nuevo perfil: ","text2":"No has ingresado una respuesta.","valid":this.valid});
						    panel.refresh();
						}
						
			    	var nochars =[":"," ",";",",","!","?","¿","¡","@"];
					var flag = 0;
			    	var a = s.split("");
			    		for(var i = 0; i< a.length; i++){
							for(var k = 0; k < nochars.length; k++){
								if(a[i] == nochars[k]){
									flag = 1;
									break;
								}
							}
						}
						
						if(flag == 1){
							this.valid = false;
			    			panel.setData({"text1":"Ingresa el alias del nuevo perfil: ","text2":"El alias sólo puede contener letras, números o los caracteres '.','-','_'","valid":this.valid});
			    			panel.refresh();
						}else if(s.length > 20){
							this.valid = false;
							panel.setData({"text1":"Ingresa el alias del nuevo perfil: ","text2":"El alias debe contener entre 4 y 20 caracteres.","valid":this.valid});
			    			panel.refresh();
						}else if(s.length < 4){
							this.valid = false;
							panel.setData({"text1":"Ingresa el alias del nuevo perfil: ","text2":"El alias debe contener entre 4 y 20 caracteres.","valid":this.valid});
			    			panel.refresh();
						}	
						else{
							this.home.closeSection(this);
			    			this.parent.createNewUser(s);
						}	
			   	}
			    else{
					this.valid = false;
					panel.setData({"text1":"Ingresa el alias del nuevo perfil: ","text2":"El alias debe contener entre 4 y 20 caracteres.","valid":this.valid});
			    	panel.refresh();
				}		
			break;
			    			
			case "stbName":
				var s = input.getData();
			    	if(s.length >= 4){
			    		var a = s.split("");
						var cs = 0;
						    for(var i = 0; i< a.length; i++){
								if(a[i] == " "){
										cs++;
								}
							}
							
							if(cs == a.length){
								this.valid = false;
						    	panel.setData({"text1":"Ingresa el nuevo nombre de tu decodificador: ","text2":"El nombre del decodificador debe contener entre 4 y 20 caracteres.","valid":this.valid});
						    	panel.refresh();
							}
							
			    	var nochars =[":"," ",";",",","!","?","¿","¡","@"];
					var flag = 0;
			    	var a = s.split("");
			    		for(var i = 0; i< a.length; i++){
							for(var k = 0; k < nochars.length; k++){
								if(a[i] == nochars[k]){
									flag = 1;
									break;
								}
							}
						}
						
					if(flag == 1){
						this.valid = false;
			    		panel.setData({"text1":"Ingresa el nuevo nombre de tu decodificador: ","text2":"El nombre del decodificador sólo puede contener letras, números o los caracteres '.','-','_'","valid":this.valid});
			    		panel.refresh();
					}else if(s.length > 20){
						this.valid = false;
						panel.setData({"text1":"Ingresa el nuevo nombre de tu decodificador: ","text2":"El nombre del decodificador debe contener entre 4 y 20 caracteres.","valid":this.valid});
			    		panel.refresh();
					}else if(s.length < 4){
						this.valid = false;
						panel.setData({"text1":"Ingresa el nuevo nombre de tu decodificador: ","text2":"El nombre del decodificador debe contener entre 4 y 20 caracteres.","valid":this.valid});
			    		panel.refresh();
					}	
					else{
						this.home.closeSection(this);
						this.parent.setStbName(s);
						}
			    					
			    }
			    else{
					this.valid = false;
					panel.setData({"text1":"Ingresa el nuevo nombre de tu STB: ","text2":"El nombre del decodificador debe contener entre 4 y 20 caracteres.","valid":this.valid});
			    	panel.refresh();
				}	
		break;
			    			
		case "alias":
			var s = input.getData();    				
			    if(s.length >= 4){
			    	var a = s.split("");
					var cs = 0;
				
					for(var i = 0; i< a.length; i++){
						if(a[i] == " "){
							cs++;
						}
					}
					
					if(cs == a.length){
						this.valid = false;
						panel.setData({"text1":"Ingresa tu nuevo alias: ","text2":"El alias sólo puede contener letras, números o los caracteres '.','-','_'","valid":this.valid});
						panel.refresh();
					}
			    				
			    	var nochars =[":"," ",";",",","!","?","¿","¡","@"];
					var flag = 0;
			    	var a = s.split("");
			    		for(var i = 0; i< a.length; i++){
							for(var k = 0; k < nochars.length; k++){
								if(a[i] == nochars[k]){
									flag = 1;
									break;
								}
							}
						}
						
						if(flag == 1){
							this.valid = false;
			    			panel.setData({"text1":"Ingresa tu nuevo alias: ","text2":"El alias sólo puede contener letras, números o los caracteres '.','-','_'","valid":this.valid});
			    			panel.refresh();
						}else if(s.length > 20){
							this.valid = false;
							panel.setData({"text1":"Ingresa tu nuevo alias: ","text2":"El alias debe contener entre 4 y 20 caracteres.","valid":this.valid});
			    			panel.refresh();
						}else if(s.length < 4){
							this.valid = false;
							panel.setData({"text1":"Ingresa tu nuevo alias: ","text2":"El alias debe contener entre 4 y 20 caracteres.","valid":this.valid});
			    			panel.refresh();
						}	
						else{
							this.home.closeSection(this);
							this.parent.setAlias(s);
						}	
			  }
			  else{
					this.valid = false;
					panel.setData({"text1":"Ingresa tu nuevo alias: ","text2":"El alias debe contener entre 4 y 20 caracteres.","valid":this.valid});
			    	panel.refresh();
			  }	
		break;
			    			
		case "setup":
			    			
			 var s = input.getData();
				if(this.parent.alias == ""){
					if(s.length >= 4){
						 this.home.closeSection(this);
						 this.parent.setAlias(s);
					}
					else{
						var nochars =[":"," ",";",",","!","?","¿","¡","@"];
						var flag = 0;
						var a = s.split("");
						    
						    for(var i = 0; i< a.length; i++){
								for(var k = 0; k < nochars.length; k++){
										if(a[i] == nochars[k]){
											flag = 1;
											break;
										}
								}
							}
						
						if(flag == 1){
							this.valid = false;
						    panel.setData({"text1":"Ingresa tu alias: ","text2":"El alias sólo puede contener letras, números o los caracteres '.','-','_'","valid":this.valid});
						    panel.refresh();
						}else if(s.length > 20){
							this.valid = false;
							panel.setData({"text1":"Ingresa tu alias: ","text2":"El alias debe contener entre 4 y 20 caracteres.","valid":this.valid});
						    panel.refresh();
						}else if(s.length < 4){
							this.valid = false;
							panel.setData({"text1":"Ingresa tu alias: ","text2":"El alias debe contener entre 4 y 20 caracteres.","valid":this.valid});
						    panel.refresh();
						}
				}
		  }
		  else if(this.parent.answer == "" && this.parent.alias != ""){
				if(s.length == 0){}
					else{
						var a = s.split("");
						var cs = 0;
						    for(var i = 0; i< a.length; i++){
								if(a[i] == " "){
									cs++;
									a[i] = "%20";
								}
							}
							
						if(cs > 0){
							var str = "";
							for(var lo = 0; lo < a.length; lo++){
								str = str+a[lo];	
							}
						}	
							
							if(cs == a.length){
								this.valid = false;
						    	panel.setData({"text1":"Ingresa tu respuesta: ","text2":"No has ingresado una respuesta.","valid":this.valid});
						    	panel.refresh();
							}
							else{
								if(s.length > 50){
										this.valid = false;
										panel.setData({"text1":"Ingresa tu respuesta: ","text2":"La respuesta debe ser de 50 o menos caracteres","valid":this.valid});
						    			panel.refresh();
								}else if(s.length < 3){
										this.valid = false;
										panel.setData({"text1":"Ingresa tu respuesta: ","text2":"La respuesta debe ser igual o mayor a 3 caracteres.","valid":this.valid});
						    			panel.refresh();
								}else{
							
									if(str.length > 0){
										this.home.closeSection(this);
										this.parent.setQuestion(str);
									}
									else{
										this.home.closeSection(this);
				    					this.parent.setQuestion(s);
				    				}
			    				}
							}					
					}	
												
		}
		else if(this.parent.mail == "" && this.parent.answer != "" && this.parent.alias != ""){
				if(s.length > 0){
					expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
						if ( !expr.test(s) ){
								this.valid = false;
						    	panel.setData({"text1":"Ingresa tu correo: ","text2":"El correo no tiene un formato válido","valid":this.valid});
						    	panel.refresh();
						}
						else{
							var a = s.split("");
							var cs = 0;
						    for(var i = 0; i< a.length; i++){
								if(a[i] == " "){
									cs++;
								}
							}
							
								if(cs > 0){
									this.valid = false;
							    	panel.setData({"text1":"Ingresa tu correo: ","text2":"El correo no tiene un formato válido","valid":this.valid});
							    	panel.refresh();
								}
								else{
							    	this.home.closeSection(this);
							    	this.parent.setMail(s);
							    }	
						    }	
				}
											
		}
												    				
		break;
			    			
		case "home":
			 var s = input.getData();
			   	if(s.length > 0){
			   		if(s.length >= 2){
			    		var a = s.split("");
							var cs = 0;
						    for(var i = 0; i< a.length; i++){
								if(a[i] == " " || a[i] == "@"){
									cs++;
								}
							}
			    		if(cs > 0){
			    			if(cs == a.length){
								this.valid = false;
								panel.setData({"text1":"Ingresa tu búsqueda: ","text2":"Tu búsqueda debe de ser mayor a 2 caracteres.","valid":this.valid});
								panel.refresh();
							}
							else{
								
			    				if(this.type == "k"){
					    				var ex = 0;
					    				for(var i = 0; i<tpng.app.lastWords.length; i++){
					    					if(tpng.app.lastWords[i] == s){
					    							ex = 1;	
					    					}
					    				}
					    				if(ex == 0){
					    					tpng.app.lastWords.push(s);
					    				}
				    				}	
				    			this.home.hideMoreInfo(); 
			    				this.home.disableSearchHeader();
			    				this.home.openSection("search",{"home":this.home,"pattern":s}, false, this);	
							}
			    		}
			    	else{
			    		
			    		if(this.type == "k"){
					    				var ex = 0;
					    				for(var i = 0; i<tpng.app.lastWords.length; i++){
					    					
					    					if(tpng.app.lastWords[i] == s){
					    							ex = 1;	
					    					}
					    				}
					    				if(ex == 0){
					    					tpng.app.lastWords.push(s);
					    				}
				    				}	
				    this.home.hideMoreInfo(); 
			    	this.home.disableSearchHeader();
			    	this.home.openSection("search",{"home":this.home,"pattern":s}, false, this);				
			    	}
			    }
			    else{
			    	this.valid = false;
					panel.setData({"text1":"Ingresa tu búsqueda: ","text2":"Tu búsqueda debe de ser mayor a 2 caracteres.","valid":this.valid});
					panel.refresh();
			    }
			  } 
			  else{
			    this.valid = false;
				panel.setData({"text1":"Ingresa tu búsqueda: ","text2":"Tu búsqueda debe de ser mayor a 2 caracteres.","valid":this.valid});
				panel.refresh();
			  }
		break;
			    			
		case "email":
			  var s = input.getData();
			  if(s.length > 0){
					expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
						if ( !expr.test(s) ){
								this.valid = false;
						    	panel.setData({"text1":"Ingresa tu nuevo mail: ","text2":"El formato de tu email no es válido. Inténtalo de nuevo.","valid":this.valid});
						    	panel.refresh();
						}
						else{
						    	this.home.closeSection(this);
						    	this.parent.updateEmail(s);
						    }	
				}
			  
		break;
			    			
		case "forgot":
			    	var s = input.getData();
			    	if(s.length == 0){}
					else{
						var a = s.split("");
						var cs = 0;
						    for(var i = 0; i< a.length; i++){
								if(a[i] == " "){
									cs++;
									a[i] = "%20";
								}
							}
							
						if(cs > 0){
							var str = "";
							for(var lo = 0; lo < a.length; lo++){
								str = str+a[lo];	
							}
						}	
							
							if(cs == a.length){
								this.valid = false;
						    	panel.setData({"text1":"Ingresa tu respuesta: ","text2":"No has ingresado una respuesta.","valid":this.valid});
						    	panel.refresh();
							}
							else{
								if(s.length > 50){
										this.valid = false;
										panel.setData({"text1":"Ingresa tu respuesta: ","text2":"La respuesta debe ser de 50 o menos caracteres","valid":this.valid});
						    			panel.refresh();
								}else if(s.length < 3){
										this.valid = false;
										panel.setData({"text1":"Ingresa tu respuesta: ","text2":"La respuesta debe ser igual o mayor a 3 caracteres.","valid":this.valid});
						    			panel.refresh();
								}else{
							
									if(str.length > 0){
										this.home.closeSection(this);
										this.parent.updateQuestion(str,this.nip);
									}
									else{
										this.home.closeSection(this);
				    					this.parent.updateQuestion(s,this.nip);
				    				}
			    				}
							}					
					}
		break;
		
		case "vodCode":
			var s = input.getData();
				 if(s.length == 9){
				    this.parent.validateCode(s);
				    this.home.closeSection(this);
				 }
				 else{
				    this.valid = false;
				    panel.setData({"text1":this.text1,"text2":this.text2,"valid":this.valid});
				    panel.refresh();
				    input.setData();
				    }	    			
		break;
			    		
	}
}

keyboard.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets,
		letters = w.letters,
		numbers = w.numbers,
		shift = w.shift,
		space = w.space,
		back = w.back,
		zero = w.zero,
		confirmButtons = w.confirmButtons,
		symbols = w.symbols,
		words = w.words,
		panel = w.panelKeyboard,
		counter = w.counter;
		
        this.client.lock();
		if(!panel.data.valid){
			this.valid = true;
			panel.setData({"text1":this.text1,"text2":this.text2,"valid":this.valid});
			panel.refresh();
		}
	
	//teclado completo
	if(this.type == "k" || this.type == "ks"){
			var back = w.back;
			var input = w.keyboardInput;

			if(input.data.length == 1 && _key == "KEY_BACKSPACE" && this.first == 1 && this.alpha){
	        		this.first = 0;
	        		this.capital = 1;
	        		if(this.focus == "shift"){
	        			shift.setData({"active":true,"capital":1});
	        			shift.redraw();
	    				letters.updateData(this.fillCapitalLetters(),letters.selectIndex-letters.focusIndex);
						letters.setFocus(false);
	        		}
	        		else if(this.focus == "space" || this.focus == "back" || this.focus == "words" || this.focus == "input" || this.focus == "confirmButtons" || this.focus == "symbols" || this.focus == "zero"){
	        			shift.setData({"active":false,"capital":1});
	        			shift.redraw();
	    				letters.updateData(this.fillCapitalLetters(),letters.selectIndex-letters.focusIndex);
						letters.setFocus(false);
	        		}
	        		//cuando está en la lista de letras
	        		else{
	        			shift.setData({"active":false,"capital":1});
	        			shift.redraw();
	        			var f = letters.focusIndex;
	    				letters.updateData(this.fillCapitalLetters(),letters.selectIndex-letters.focusIndex);
						letters.focusIndex = f;
						//CHECAR ESTO CON MAU
						if(letters.focusIndex == 0){
							letters.scrollPrev(0);
						}
						else{
							letters.scrollPrev(0);		
							letters.scrollNext(0);
						}
	        		}
					
	    			
	    			if(this.focus == "numbers"){
	    				letters.setFocus(false);
	    			}
	    			else{
	    				
	    			}
	        	}
	     //FOCO EN CUALQUIER LUGAR QUE NO SEA INPUT Y ES ALFANUMÉRICO  	
        	if(this.focus != "input" && this.alpha){
        	//MOVERSE
	        	if(_key == "KEY_IRENTER" || _key == "KEY_UP" || _key == "KEY_DOWN" || _key == "KEY_LEFT" || _key == "KEY_RIGHT" || _key == "KEY_MENU" || _key == "KEY_IRBACK" || _key =="KEY_TV_RED"){
	        		if(_key == "KEY_IRENTER" && this.focus == "back"){
	        			  if(input.data.length > 0){	
	        				var keyHandled = input.keyHandler(_key);
	        					counter.setData(input.maxLength-input.data.length);
								counter.refresh();
								
							var keys = [];
	        				var data = input.data;
	        				var cKey = [];
	        							
	        					cKey = data.split("");
	        							
	        				var current = cKey[input.dataIndex-1];
	        				if(current == "@" && cKey[input.dataIndex-2] != "@"){	
	        					words.setData();
	        					words.stateChange("exit");
	        					if(tpng.app.lastWords.length > 0){
										var ws = [];
										var six = 0;
										for(var i = tpng.app.lastWords.length-1; i >= 0 && six<6; i--){
											ws.push({"word":tpng.app.lastWords[i]});
											six++;
										}
											ws.push({"id":"delete"});
											words.setData(ws);
											words.stateChange("enter");
											if(this.focus != "words")
											words.setFocus(false);
								}
	        					//words.setData(this.at);
	        					//words.stateChange("enter");
	        					
							}
							else if(current == "@" || cKey[input.dataIndex-2] == "@"){
								words.setData(this.at);
	        					words.stateChange("enter");
	        					words.setFocus(false);
							}
							else{
								for(var i = 0; i < words.list.length; i++){
									 		if(words.list[i].word == "outlook.com"){
									 			
									 			var ws = [];
												var six = 0; 
									 			
									 			if(tpng.app.lastWords.length > 0){
													for(var i = tpng.app.lastWords.length-1; i >= 0 && six<6; i--){
														ws.push({"word":tpng.app.lastWords[i]});
														six++;
													}
														ws.push({"id":"delete"});
														words.setData(ws);
														words.stateChange("enter");
														if(this.focus != "words")
														words.setFocus(false);
												}
												else{
														words.setData();
														words.stateChange("exit");
														if(this.focus == "words"){
															this.focus = "letters";
															letters.focusIndex = 0;
															letters.selectIndex = 0;
															letters.setFocus(true);
														}
												}		
									 		}
									 		
								}		
							}  
	        										
	        			}
	        		}
	        	
	        	}
	        	else{
	        		//TECLA BORRAR EN CUALQUIERA QUE NO SEA INPUT
	        		if(_key == "KEY_BACKSPACE"){
	        			
	        			  if(input.data.length > 0){	
	        				var keyHandled = input.keyHandler(_key);
	        					counter.setData(input.maxLength-input.data.length);
								counter.refresh();
								
							var keys = [];
	        				var data = input.data;
	        				var cKey = [];
	        							
	        					cKey = data.split("");
	        							
	        				var current = cKey[input.dataIndex-1];

	        				if(current == "@"){	
	        					words.setData(this.at);
	        					words.stateChange("enter");
	        					if(this.focus != "words")
	        					words.setFocus(false);
							}
							else{
								for(var i = 0; i < words.list.length; i++){
									 		if(words.list[i].word == "outlook.com"){
									 			var ws = [];
												var six = 0;

									 			if(tpng.app.lastWords.length > 0){
													for(var i = tpng.app.lastWords.length-1; i >= 0 && six<6; i--){
														ws.push({"word":tpng.app.lastWords[i]});
														six++;
													}
														ws.push({"id":"delete"});
														words.setData(ws);
														words.stateChange("enter");
														if(this.focus != "words")
														words.setFocus(false);
												}
												else{
														words.setData();
														words.stateChange("exit");
														if(this.focus == "words"){
															this.focus = "letters";
															letters.focusIndex = 0;
															letters.selectIndex = 0;
															letters.setFocus(true);
														}
												}		
									 		}
									 		
								}		
							}  
	        										
	        			}
	        			//PARA QUE PARPADEE LA TECLA AL PULSARLA
	        			
	        			
	        			if(this.focus != "back"){
	        				back.setData({"active":true});
	        				back.refresh();
	        				back.setData({"active":false});
	        				back.refresh
	        			}
	        		}
	        		//CUALQUIER OTRA TECLA QUE NO SEA BACKSPACE EN CUALQUIER LUGAR QUE NO SEA INPUT
	        		else{	
	        			
	        			var keyHandled = input.keyHandler(_key);
	        				var k = _key;
	        				switch(k){
	        					case "KEY_TV_1":
	        					case "KEY_TV_2":
	        					case "KEY_TV_3":
	        					case "KEY_TV_4":
	        					case "KEY_TV_5":
	        					case "KEY_TV_6":
	        					case "KEY_TV_7":
	        					case "KEY_TV_8":
	        					case "KEY_TV_9":
	        					case "KEY_TV_0":
	        					case "KEY_IRENTER":
	        							var keys = [];
	        							var data = input.data;
	        							var cKey = [];
	        							
	        							cKey = data.split("");
	        							
	        							var current = cKey[input.dataIndex-1];
	        							
	        							for(var i = 0; i < letters.list.length; i++){
	        								if(current == letters.list[i].value.toLowerCase()){
	        									letters.selectIndex = i;
	        									letters.focusIndex = i;
	        									
	        									if(letters.selectIndex == 0){
													letters.scrollNext(0);
													letters.scrollPrev(0);
												}
												else{
													letters.scrollPrev(0);
													letters.scrollNext(0);
												}
												var exist = 1;
	        								}
	        							}
	        							if(exist){}
	        							else{
	        									if(this.focus != "space" && current == " "){
	        										space.setData({"active":true});
	        										space.redraw();
	        										space.setData({"active":false});
	        										space.redraw();
	        									}
	        									if(this.focus != "zero" && current == "0"){
	        										zero.setData({"active":true});
	        										zero.redraw();
	        										zero.setData({"active":false});
	        										zero.redraw();
	        									}
	        							}
	        						if(current == "@"){	
	        							words.setData(this.at);
	        							words.stateChange("enter");
										
										if(this.focus != "words")
	        								words.setFocus(false);	
										
										
									 }
									 else{
									 	for(var i = 0; i < words.list.length; i++){
									 		if(words.list[i].word == "outlook.com"){
									 			var ws = [];
												var six = 0;
									 			if(tpng.app.lastWords.length > 0){
													for(var i = tpng.app.lastWords.length-1; i >= 0 && six<6; i--){
														ws.push({"word":tpng.app.lastWords[i]});
														six++;
													}
														ws.push({"id":"delete"});
														words.setData(ws);
														words.stateChange("enter");
														if(this.focus != "words")
														words.setFocus(false);
												}
												else{
												
														words.setData();
														words.stateChange("exit");
														if(this.focus == "words"){
															this.focus = "letters";
															letters.focusIndex = 0;
															letters.selectIndex = 0;
															letters.setFocus(true);
														}
												}		
									 		}
									 		
									 	} 
									 } 
									 if(this.focus == "back" || this.focus == "space" || this.focus == "zero" || this.focus == "shift" || this.focus == "symbols"){
											 setTimeout(function() {
													letters.setFocus(false);
											 }, 1000);
									 
									 }      							
	        					    break;
	        				}
	        			
	        			counter.setData(input.maxLength-input.data.length);
						counter.refresh();
	        		}
                    this.client.unlock();
	        		return true;
	        	}	
        	}
        	//FOCO EN INPUT Y ES ALFANUMÉRICO 
        	else if(this.alpha && this.focus == "input"){
        		if(_key == "KEY_UP" || _key == "KEY_DOWN" || _key == "KEY_MENU" || _key == "KEY_IRBACK" || _key == "KEY_IRENTER" || _key =="KEY_TV_RED"){}
        		else{
        		//BACKSPACE EN INPUT
        			if(_key == "KEY_BACKSPACE"){
	        			
	        			  if(input.data.length > 0){	
	        				var keyHandled = input.keyHandler(_key);
	        					counter.setData(input.maxLength-input.data.length);
								counter.refresh();
								
							var keys = [];
	        				var data = input.data;
	        				var cKey = [];
	        							
	        					cKey = data.split("");
	        							
	        				var current = cKey[input.dataIndex-1];
	        				if(current == "@"){	
	        					words.setData(this.at);
	        					words.stateChange("enter");
	        					words.setFocus(false);
							}
							else{
								for(var i = 0; i < words.list.length; i++){
									 		if(words.list[i].word == "outlook.com"){
									 			var ws = [];
												var six = 0;
									 			if(tpng.app.lastWords.length > 0){
													for(var i = tpng.app.lastWords.length-1; i >= 0 && six<6; i--){
														ws.push({"word":tpng.app.lastWords[i]});
														six++;
													}
														ws.push({"id":"delete"});
														words.setData(ws);
														words.stateChange("enter");
														if(this.focus != "words")
														words.setFocus(false);
												}
												else{
														words.setData();
														words.stateChange("exit");
														if(this.focus == "words"){
															this.focus = "letters";
															letters.focusIndex = 0;
															letters.selectIndex = 0;
															letters.setFocus(true);
														}
												}		
									 		}
									 		
								}		
							}  
	        										
	        			}
	        			//PARA QUE PARPADEE LA TECLA AL PULSARLA
	        			back.setData({"active":true});
	        			back.refresh();
	        			
	        			back.setData({"active":false});
	        			back.refresh
	        		}
	        		//CUALQUIER OTRA TECLA QUE NO SEA BACKSPACE EN INPUT
	        		else{				
	        			
	        			var keyHandled = input.keyHandler(_key);
	        				var k = _key;
	        				switch(k){
	        					case "KEY_TV_1":
	        					case "KEY_TV_2":
	        					case "KEY_TV_3":
	        					case "KEY_TV_4":
	        					case "KEY_TV_5":
	        					case "KEY_TV_6":
	        					case "KEY_TV_7":
	        					case "KEY_TV_8":
	        					case "KEY_TV_9":
	        					case "KEY_TV_0":
	        							var keys = [];
	        							var data = input.data;
	        							var cKey = [];
	        							
	        							cKey = data.split("");
	        							
	        							var current = cKey[input.dataIndex-1];
	        							
	        							for(var i = 0; i < letters.list.length; i++){
	        								if(current == letters.list[i].value.toLowerCase()){
	        									letters.selectIndex = i;
	        									letters.focusIndex = i;
	        									
	        									if(letters.selectIndex == 0){
													letters.scrollNext(0);
													letters.scrollPrev(0);
													
													
													setTimeout(function() {
															letters.setFocus(false);
													}, 1000);
												}
												else{
													letters.scrollPrev(0);
													letters.scrollNext(0);
													
													setTimeout(function() {
															letters.setFocus(false);
													}, 1000);
												}
												var exist = 1;
	        								}
	        							}
	        							if(exist){}
	        							else{
	        									if(current == " "){
	        										space.setData({"active":true});
	        										space.redraw();
	        										space.setData({"active":false});
	        										space.redraw();
	        									}
	        									if(current == "0"){
	        										zero.setData({"active":true});
	        										zero.redraw();
	        										zero.setData({"active":false});
	        										zero.redraw();
	        									}
	        							}
	        							
	        						if(current == "@"){	
	        							words.setData(this.at);
	        							words.stateChange("enter");
										words.setFocus(false);
											
									 }
									 else{
									 	for(var i = 0; i < words.list.length; i++){
									 		if(words.list[i].word == "outlook.com"){
									 			var ws = [];
												var six = 0;
									 			if(tpng.app.lastWords.length > 0){
													for(var i = tpng.app.lastWords.length-1; i >= 0 && six<6; i--){
														ws.push({"word":tpng.app.lastWords[i]});
														six++;
													}
														ws.push({"id":"delete"});
														words.setData(ws);
														words.stateChange("enter");
														if(this.focus != "words")
														words.setFocus(false);
												}
												else{
														words.setData();
														words.stateChange("exit");
														if(this.focus == "words"){
															this.focus == "letters";
															letters.focusIndex = 0;
															letters.selectIndex = 0;
															letters.setFocus(true);
														}
												}		
									 		}
									 		
									 	} 
									 }       							
	        					    break;
	        				}
	        			
	        			counter.setData(input.maxLength-input.data.length);
						counter.refresh();
	        		}
                    this.client.unlock();
	        		return true;
        		}
        	}
        	//FOCO NO ALFANUMÉRICO
        	else{
        		if(_key == "KEY_UP" || _key == "KEY_DOWN" || _key == "KEY_LEFT" || _key == "KEY_RIGHT" || _key == "KEY_IRENTER"){
        		}
        		else{
        		var keyHandled = input.keyHandler(_key);
	        					counter.setData(input.maxLength-input.data.length);
								counter.refresh();
								
							var keys = [];
	        				var data = input.data;
	        				var cKey = [];
	        							
	        					cKey = data.split("");
	        							
	        				var current = cKey[input.dataIndex-1];
	        				if(current == "@" && cKey[input.dataIndex-1] != "@"){	
	        					words.setData();
	        					words.stateChange("exit");
	        					if(tpng.app.lastWords.length > 0){
										var ws = [];
										var six = 0;
										for(var i = tpng.app.lastWords.length-1; i >= 0 && six<6; i--){
											ws.push({"word":tpng.app.lastWords[i]});
											six++;
										}
											ws.push({"id":"delete"});
											words.setData(ws);
											words.stateChange("enter");
											if(this.focus != "words")
											words.setFocus(false);
								}
	        					
							}
							else if(current == "@" || cKey[input.dataIndex-1] == "@"){
								words.setData(this.at);
	        					words.stateChange("enter");
	        					words.setFocus(false);
							}
							else{
								for(var i = 0; i < words.list.length; i++){
									 		if(words.list[i].word == "outlook.com"){
									 			var ws = [];
												var six = 0; 
									 			if(tpng.app.lastWords.length > 0){
													for(var i = tpng.app.lastWords.length-1; i >= 0 && six<6; i--){
														ws.push({"word":tpng.app.lastWords[i]});
														six++;
													}
														ws.push({"id":"delete"});
														words.setData(ws);
														words.stateChange("enter");
														if(this.focus != "words")
														words.setFocus(false);
												}
												else{
														words.setData();
														words.stateChange("exit");
														if(this.focus == "words"){
															this.focus = "letters";
															letters.focusIndex = 0;
															letters.selectIndex = 0;
															letters.setFocus(true);
														}
												}		
									 		}
									 		
								}		
							} 				
								
								
				}				

        	}  
    switch(this.focus){
    
    	case "input":
    		switch(_key){
    		
    		case "KEY_LEFT":
    		break;
    		
    		case "KEY_RIGHT":
    		break;
   
    		case "KEY_DOWN":
    		if(this.type == "k" && words.stateGet()=="enter"){
				if(words.list.length >0){
					this.focus = "words";
					words.setFocus(true); 		
				}								
							   		
    		}
    		else{
    				if(this.lastFocus == "letters"){
    					letters.selectIndex = 0;
    					letters.focusIndex = 0;
    					letters.setFocus(true);
    					this.focus = "letters";
    				}
    				else if(this.lastFocus == "confirmButtons"){
    					confirmButtons.setFocus(true);
    					this.focus = "confirmButtons";
    				}else if(this.lastFocus == "back"){
    					letters.animation.zIndex(1).start();
						back.animation.zIndex(2).start();
    					back.setData({"active":true});
    					back.redraw();
    					this.focus = "back";
    				}
    				else{
    					letters.focusIndex = 0;
    					letters.selectIndex = 0;
    					letters.setFocus(true);
    					this.focus = "letters";
    					
    				}
    		}
    			this.setTextWhitecolor(false);
    		break;
    		
    		case "KEY_IRBACK":
			case "KEY_MENU":
					if(this.section == "alias" || this.section == "stbName" || this.section == "vodCode"){
						this.home.closeSection(this);
						this.parent.nothing();
					}
					else{
						this.home.closeSection(this);
					}
    		break;
    		
    		case "KEY_IRENTER":    		
			    		this.validateSections();
			break;
    		
    		}
    	break;
    	
    	case "words":
    		switch(_key){
    		case "KEY_LEFT":
    			words.scrollPrev();
    		break;
    		
    		case "KEY_RIGHT":
    			words.scrollNext();
    		break;
    	
    		case "KEY_IRENTER":
    			input.setFocus(true);
    			if(words.selectItem.id == "delete"){
    				words.setData();
    				settings.set("tpng.app.lastWords","");
    				tpng.app.lastWords = [];
    				this.focus = "letters";
					letters.focusIndex = 0;
					letters.selectIndex = 0;
					letters.setFocus(true);
    				words.stateChange("exit");
    			}
    			else{
    				if(input.data.length > 0){
    					var data = input.getData();
    					input.setData(data+words.selectItem.word);
    				}
    				else{
    					input.setData(words.selectItem.word);
    				}
    					
    				for(var i = 0; i < words.list.length; i++){
									 		if(words.list[i].word == "outlook.com"){
									 			var ws = [];
												var six = 0;
									 			if(tpng.app.lastWords.length > 0){
													for(var i = tpng.app.lastWords.length-1; i >= 0 && six<6; i--){
														ws.push({"word":tpng.app.lastWords[i]});
														six++;
													}
														ws.push({"id":"delete"});
														words.setData(ws);
														words.stateChange("enter");
												}
												else{
														words.setData();
														words.stateChange("exit");
														if(this.focus == "words"){
															this.focus = "letters";
															letters.focusIndex = 0;
															letters.selectIndex = 0;
															letters.setFocus(true);
														}
												}		
									 		}
									 		
								}
    				
    				
    				counter.setData(input.maxLength-input.data.length);
					counter.refresh();	
    			}
    		break;
    		
    		case "KEY_IRBACK":
			case "KEY_MENU":
					if(this.section == "alias" || this.section == "stbName" || this.section == "vodCode"){
						this.home.closeSection(this);
						this.parent.nothing();
					}
					else{
						this.home.closeSection(this);
					}
    		break;
    		
    		
    		
    		case "KEY_DOWN":
    			if(words.focusIndex == 0){
    				this.focus = "confirmButtons";
    				words.setFocus(false);
    				confirmButtons.setFocus(true);
    				confirmButtons.animation.zIndex(2).start();
    				words.animation.zIndex(1).start();
    			}
    			else{
    				letters.animation.zIndex(2).start();
    				words.animation.zIndex(1).start();
    			if(words.focusIndex == 1){
    				letters.focusIndex = 0;
    			}
    			if(words.focusIndex == 2){
    				letters.focusIndex = 3;
    			}
    			if(words.focusIndex == 3){
    				letters.focusIndex = 6;
    			}
    			if(words.focusIndex == 4){
    				letters.focusIndex = 9;
    			}
    			if(words.focusIndex == 5){
    				letters.focusIndex = 12;
    			}
    			if(words.focusIndex == 6){
    				letters.focusIndex = 15;
    			}
    			
    			this.focus = "letters";
    			words.setFocus(false);
    			letters.setFocus(true);
    			}
    		break;
    		
    		case "KEY_UP":
    			input.setFocus(true);
    			words.setFocus(false);
    			this.lastFocus = this.focus;
    			this.focus = "input";
    			this.setTextWhitecolor(true);
    		break;
    		}	
    	break;		
    
    
	    case "letters":
	    	
			switch(_key){		
					
    		case "KEY_TV_RED":
				this.formOpenChild("previews", {"home":this}, false);
			break;
					case "KEY_IRBACK":
					case "KEY_MENU":
							if(this.section == "alias" || this.section == "stbName" || this.section == "vodCode"){
								this.home.closeSection(this);
								this.parent.nothing();
							}
							else{
								this.home.closeSection(this);
							}
					break;
					case "KEY_LEFT":
						//input.setFocus(false);
						if(letters.focusIndex == 0 || letters.focusIndex == 13 || letters.focusIndex == 26){
							if(letters.focusIndex == 0){
								confirmButtons.focusIndex = 0;
							}
							else{
								confirmButtons.focusIndex = 1;
							}
							this.focus = "confirmButtons";	
							letters.animation.zIndex(1).start();
							confirmButtons.animation.zIndex(2).start();
							letters.setFocus(false);
							confirmButtons.setFocus(true);
						}else{
							if(letters.scrollPrev()){}
						}	
					break;		
					
					case "KEY_RIGHT":
						
						if(letters.selectIndex == 12 || letters.selectIndex == 25 || letters.selectIndex == 38){
							if(letters.selectIndex == 12){
								letters.setFocus(false);
								back.setData({"active":true});
								back.redraw();
								letters.animation.zIndex(1).start();
								back.animation.zIndex(2).start();
								this.focus = "back";
							}
							if(letters.selectIndex == 25){
								letters.setFocus(false);
								shift.setData({"active":true,"capital":this.capital});
	        					shift.redraw();
	        					letters.animation.zIndex(1).start();
								shift.animation.zIndex(2).start();
								this.focus = "shift";
							}
							if(letters.selectIndex == 38){
								letters.setFocus(false);
								if(this.alpha){
									symbols.setData({"active":true,"text":"@#:"});
								}
								else{
									symbols.setData({"active":true,"text":"ABC"});
								}
								symbols.redraw();
								letters.animation.zIndex(1).start();
								symbols.animation.zIndex(2).start();
								this.focus = "symbols";
								//back.setFocus(true);
								//this.focus = "back";
							}
						}
						else{
							letters.scrollNext();
						}	
					break;
					
					case "KEY_UP":
						if(this.type == "k" && w.words.stateGet()=="enter"){
							if(letters.focusIndex >= 0 && letters.focusIndex <= 12){
							if(words.list.length >= 6){
								if(letters.focusIndex == 0 || letters.focusIndex == 1 || letters.focusIndex == 2) 
									words.focusIndex = 1;
								if(letters.focusIndex == 3 || letters.focusIndex == 4 || letters.focusIndex == 5) 	
									words.focusIndex = 2;
								if(letters.focusIndex == 6 || letters.focusIndex == 7 || letters.focusIndex == 8) 	
									words.focusIndex = 3;
								if(letters.focusIndex == 9 || letters.focusIndex == 10 || letters.focusIndex == 11) 	
									words.focusIndex = 4;
								if(letters.focusIndex == 12) 	
									words.focusIndex = 5;	
									
							}else if(words.list.length == 5){
								if(letters.focusIndex == 0 || letters.focusIndex == 1 || letters.focusIndex == 2) 
									words.focusIndex = 1;
								if(letters.focusIndex == 3 || letters.focusIndex == 4 || letters.focusIndex == 5) 	
									words.focusIndex = 2;
								if(letters.focusIndex == 6 || letters.focusIndex == 7 || letters.focusIndex == 8) 	
									words.focusIndex = 3;
								if(letters.focusIndex == 9 || letters.focusIndex == 10 || letters.focusIndex == 11 || letters.focusIndex == 12) 	
									words.focusIndex = 4; 
									
							} else if(words.list.length == 4){
								if(letters.focusIndex == 0 || letters.focusIndex == 1 || letters.focusIndex == 2) 
									words.focusIndex = 1;
								if(letters.focusIndex == 3 || letters.focusIndex == 4 || letters.focusIndex == 5) 	
									words.focusIndex = 2;
								if(letters.focusIndex >= 6  && letters.focusIndex <= 12) 	
									words.focusIndex = 3;
							
							} else if(words.list.length == 3){
								if(letters.focusIndex == 0 || letters.focusIndex == 1 || letters.focusIndex == 2) 
									words.focusIndex = 1;
								if(letters.focusIndex >= 3 && letters.focusIndex <= 12) 	
									words.focusIndex = 2;	
										
							} else if(words.list.length == 2){
								if(letters.focusIndex >= 0 && letters.focusIndex <= 12) 
									words.focusIndex = 1;		
							}			
							this.lastFocus = this.focus;
							this.focus = "words";
							letters.animation.zIndex(1).start();
							words.animation.zIndex(2).start();
							letters.setFocus(false);
							words.setFocus(true);
							}
							else{
								//si no es de los primeros 13 y hay palabras
								var f = letters.focusIndex;
								letters.focusIndex = f - 13;
								letters.selectIndex = letters.focusIndex;
								if(letters.selectIndex == 0){
										letters.scrollNext(0);
										letters.scrollPrev(0);
									}
								else{
										letters.scrollPrev(0);
										letters.scrollNext(0);
								}
							}
						}
						else{
							//si es de los primeros 13
							if(letters.focusIndex >= 0 && letters.focusIndex <= 12){
	    						input.setFocus(true);
	    						letters.setFocus(false);
	    						this.setTextWhitecolor(true);
	    						this.lastFocus = this.focus;
	    						this.focus = "input";
    						}
    						//si no es de los primeros 13
    						else{
    							if(letters.focusIndex >= 13){
									var f = letters.focusIndex;
									letters.focusIndex = f - 13;
									letters.selectIndex = letters.focusIndex;
									if(letters.selectIndex == 0){
										letters.scrollNext(0);
										letters.scrollPrev(0);
									}
									else{
										letters.scrollPrev(0);
										letters.scrollNext(0);
									}
								}
								else{
									input.setFocus(true);
		    						letters.setFocus(false);
		    						this.setTextWhitecolor(true);
		    						this.lastFocus = this.focus;
									this.focus = "input";
								}
    						}
    						
					}
					
					break;
					
					
					case "KEY_DOWN":
							if(letters.focusIndex <= 25){
								var f = letters.focusIndex;
								letters.focusIndex = f + 13;
								letters.selectIndex = letters.focusIndex;
								if(letters.selectIndex == 0){
										letters.scrollNext(0);
										letters.scrollPrev(0);
									}
									else{
										letters.scrollPrev(0);
										letters.scrollNext(0);
									}
								if(f >= 13 && f <= 25){
									letters.animation.zIndex(2).start();
									space.animation.zIndex(1).start();	
								}
							}
							else{
								if(letters.focusIndex >= 36 && letters.focusIndex <= 38){
									letters.setFocus(false);
									zero.setData({"active":true});
									letters.animation.zIndex(1).start();
									zero.animation.zIndex(2).start();
									zero.redraw();
									this.focus = "zero";
								}
								else{
									letters.setFocus(false);
									space.setData({"active":true});
									letters.animation.zIndex(1).start();
									space.animation.zIndex(2).start();
									space.redraw();
									this.focus = "space";
								}	
							}
					break;
					
			    	case "KEY_IRENTER":    		
			    		
			    		this.addLetter(letters.selectItem.value);
			    		counter.setData(input.maxLength-input.data.length);
	        			counter.refresh();
			    	if(this.alpha){	
			    		if(this.first == 0){
			    			if(this.capital == 1){
								switch(letters.selectItem.value){
									case "0":
									case "1":
									case "2":
									case "3":
									case "4":
									case "5":
									case "6":
									case "7":
									case "8":
									case "9":
									break;
									
									default:
										this.first = 1;
										this.capital = 0;
			    						shift.setData({"active":false, "capital":0});
										shift.redraw();
								var f = letters.focusIndex;
										letters.updateData(this.fillLetters(),letters.selectIndex-letters.focusIndex);
										letters.focusIndex = f;
								//CHECAR ESTO CON MAU
								if(letters.focusIndex == 0){
									letters.scrollPrev(0);
								}
								else{
									letters.scrollPrev(0);		
									letters.scrollNext(0);
								}
									break;
								}
							}
							else if(this.capital == 2){
								this.first = 1;
							}
							else if(this.capital == 0){
								this.first = 1;
							}
			    		}
			    		else{
			    			if(this.capital == 1){
			    				this.capital = 0;
			    				shift.setData({"active":false, "capital":0});
								shift.redraw();
								var f = letters.focusIndex;
								
								letters.updateData(this.fillLetters(),letters.selectIndex-letters.focusIndex);
								letters.focusIndex = f;
								if(letters.focusIndex == 0){
									letters.scrollPrev(0);
								}
								else{
									letters.scrollPrev(0);		
									letters.scrollNext(0);
								}
								//letters.updateData(this.fillLetters(),letters.selectIndex-letters.focusIndex);
			    			}
			    			if(this.capital == 2){
			    			}
			    		}	
			    		}
			    	break;
				}	
				
		break;
		
		case "zero":
	    	
			switch(_key){		
					
    		case "KEY_TV_RED":
				this.formOpenChild("previews", {"home":this}, false);
			break;
					case "KEY_IRBACK":
					case "KEY_MENU":
							if(this.section == "alias" || this.section == "stbName" || this.section == "vodCode"){
								this.home.closeSection(this);
								this.parent.nothing();
							}
							else{
								this.home.closeSection(this);
							}
					break;
					case "KEY_LEFT":
							this.focus = "space";	
							zero.animation.zIndex(1).start();
							space.animation.zIndex(2).start();
							zero.setData({"active":false});
							zero.redraw();
							space.setData({"active":true});
							space.redraw();
					break;		
					
					case "KEY_RIGHT":
						zero.setData({"active":false});
						zero.redraw();
						if(this.alpha){
									symbols.setData({"active":true,"text":"@#:"});
								}
								else{
									symbols.setData({"active":true,"text":"ABC"});
								}
						symbols.redraw();		
						zero.animation.zIndex(1).start();
						symbols.animation.zIndex(2).start();
						this.focus = "symbols";
					break;
					
					case "KEY_UP":
						this.focus = "letters";	
						zero.animation.zIndex(1).start();
						letters.animation.zIndex(2).start();
						zero.setData({"active":false});
						zero.redraw();
						letters.focusIndex = 36;
						letters.selectIndex = letters.focusIndex;
						letters.scrollPrev(0);
						letters.scrollNext(0);
						letters.setFocus(true);
					break;
					
					
					case "KEY_DOWN":
					break;
					
			    	case "KEY_IRENTER":    		
			    		this.addLetter("0");
			    		counter.setData(input.maxLength-input.data.length);
	        			counter.refresh();
			    	break;
				}	
				
		break;
		
		case "shift":
	    	
			switch(_key){		
					case "KEY_IRBACK":
					case "KEY_MENU":
							if(this.section == "alias" || this.section == "stbName" || this.section == "vodCode"){
								this.home.closeSection(this);
								this.parent.nothing();
							}
							else{
								this.home.closeSection(this);
							}
					break;
			
					
					case "KEY_UP":
						this.focus = "back";
						back.setData({"active":true});
						back.redraw();	
						shift.setData({"active":false,"capital":this.capital});
						shift.redraw();	
						this.client.lock();
							back.animation.zIndex(2).start();	
							shift.animation.zIndex(1).start();
							letters.animation.zIndex(1).start();
						this.client.unlock();
					break;
					
					case "KEY_LEFT":
						this.focus = "letters";
						letters.focusIndex = 25;
						letters.setFocus(true);
						shift.setData({"active":false,"capital":this.capital});
						shift.redraw();	
						shift.animation.zIndex(1).start();	
						letters.animation.zIndex(2).start();
					break;
					
			    	case "KEY_IRENTER":    
			    	if(this.alpha){	
				    		if(this.capital == 0){
				    			letters.updateData(this.fillCapitalLetters());
				    			letters.setFocus(false);
				    			shift.setData({"active":true,"capital":1});
								shift.redraw();
				    			this.capital = 1;
				    		}
				    		else if(this.capital == 1){
				    			this.capital = 2;
				    			shift.setData({"active":true,"capital":2});
								shift.redraw();
				    		}
				    		else if(this.capital == 2){
				    		
				    			letters.updateData(this.fillLetters());
				    			letters.setFocus(false);
				    			this.capital = 0;
				    			shift.setData({"active":true,"capital":0});
								shift.redraw();
				    		}
			    		}	
			    	break;
			    	
			    	case "KEY_DOWN":
			    		shift.setData({"active":false,"capital":this.capital});
						shift.redraw();
						if(this.alpha){
							symbols.setData({"active":true,"text":"@#:"});
								}
						else{
							symbols.setData({"active":true,"text":"ABC"});
						}
						symbols.redraw();
						shift.animation.zIndex(1).start();
						symbols.animation.zIndex(2).start();
						this.focus = "symbols";
			    	break;
			}	
		break;
		
		case "symbols":
	    	
			switch(_key){		
					case "KEY_IRBACK":
					case "KEY_MENU":
							if(this.section == "alias" || this.section == "stbName" || this.section == "vodCode"){
								this.home.closeSection(this);
								this.parent.nothing();
							}
							else{
								this.home.closeSection(this);
							}
					break;
			
					
					case "KEY_UP":
						this.focus = "shift";
						shift.setData({"active":true,"capital":this.capital});
						shift.redraw();	
						if(this.alpha){
							symbols.setData({"active":false,"text":"@#:"});
						}
						else{
							symbols.setData({"active":false,"text":"ABC"});
						}
						symbols.redraw();	
						this.client.lock();
							shift.animation.zIndex(2).start();	
							symbols.animation.zIndex(1).start();
							letters.animation.zIndex(1).start();
						this.client.unlock();
					break;
					
					case "KEY_LEFT":
						this.focus = "letters";
						letters.focusIndex = 38;
						letters.setFocus(true);
						if(this.alpha){
							symbols.setData({"active":false,"text":"@#:"});
						}
						else{
							symbols.setData({"active":false,"text":"ABC"});
						}
						symbols.redraw();
						symbols.animation.zIndex(1).start();	
						letters.animation.zIndex(2).start();
					break;
					
			    	case "KEY_IRENTER":    
			    		if(this.alpha){
			    			letters.updateData(this.fillSymbols());
			    			symbols.setData({"active":true,"text":"ABC"});
			    			symbols.redraw();
			    			this.alpha = false;
			    		}	
			    		else{
			    			if(this.capital == 1 || this.capital == 2){
			    				letters.updateData(this.fillCapitalLetters());	
			    			}
			    			else{
			    				letters.updateData(this.fillLetters());	
			    			}
			    			symbols.setData({"active":true,"text":"@#:"});
			    			symbols.redraw();
			    			this.alpha = true;
			    		}
			    		letters.setFocus(false);	
			    	break;
			    	
			    	case "KEY_DOWN":
			    	break;
			}	
		break;
		
		case "space":
	    	
			switch(_key){		
					case "KEY_IRBACK":
					case "KEY_MENU":
							if(this.section == "alias" || this.section == "stbName" || this.section == "vodCode"){
								this.home.closeSection(this);
								this.parent.nothing();
							}
							else{
								this.home.closeSection(this);
							}
					break;
					case "KEY_LEFT":
					break;	
						
					case "KEY_RIGHT":
						this.focus = "zero";	
						space.animation.zIndex(1).start();
						zero.animation.zIndex(2).start();
						space.setData({"active":false});
						space.redraw();
						zero.setData({"active":true});
						zero.redraw();
						/*this.focus = "back";
						space.setData({"active":false});
						space.redraw();
						back.setData({"active":true});
						back.redraw();*/
					break;
					
					case "KEY_UP":
					if(letters.focusIndex >= 36){
						letters.focusIndex = 33;
					}
						this.focus = "letters";
						letters.animation.zIndex(2).start();
						space.animation.zIndex(1).start();
						letters.setFocus(true);
						space.setData({"active":false});
						space.redraw();
					break;
					
			    	
			    	case "KEY_IRENTER":    		
			    		this.addLetter("space");
			    		counter.setData(input.maxLength-input.data.length);
	        			counter.refresh();
			    	break;
			}	
		break;
		
		case "back":
	    	
			switch(_key){		
					case "KEY_IRBACK":
					case "KEY_MENU":
							if(this.section == "alias" || this.section == "stbName" || this.section == "vodCode"){
								this.home.closeSection(this);
								this.parent.nothing();
							}
							else{
								this.home.closeSection(this);
							}
					break;
					
					case "KEY_LEFT":
						this.focus = "letters";
						letters.focusIndex = 12;
						letters.setFocus(true);
						back.setData({"active":false});
						back.redraw();
						back.animation.zIndex(1).start();	
						letters.animation.zIndex(2).start();
					break;	
						
					case "KEY_UP":
						if(words.stateGet() == "enter"){
							if(words.list.length >= 6){
								back.setData({"active":false});
								back.redraw();
								words.focusIndex = 5;
								words.setFocus(true);
								back.animation.zIndex(1).start();	
								words.animation.zIndex(2).start();
								this.focus = "words";
							}
							else{
								back.setData({"active":false});
								back.redraw();
								words.focusIndex = words.list.length-1;
								back.animation.zIndex(1).start();	
								letters.animation.zIndex(2).start();
								words.setFocus(true);
								this.focus = "words";
							}
						}
						else{
							this.lastFocus = this.focus;
							input.setFocus(true);
		    				back.setData({"active":false});
							back.redraw();
		    				this.setTextWhitecolor(true);
		    				this.focus = "input";
		    			}	
					break;
					
					case "KEY_DOWN":
						back.setData({"active":false});
						back.redraw();
						shift.setData({"active":true,"capital":this.capital});
	        			shift.redraw();
	        			back.animation.zIndex(1).start();
	        			letters.animation.zIndex(1).start();	
						shift.animation.zIndex(2).start();
						this.focus = "shift";
					break;
			    	
			    	case "KEY_IRENTER": 
			    	   	input.setFocus(true);	
			    	   if(this.alpha){
			    	   	  if(input.data.length > 0){
			    	   	  		if(input.data.length == 1){
        	   			//if(input.data.length == 152){
        	   						this.first = 0;
        	   						this.capital = 1;
        	   						shift.setData({"active":false,"capital":1});
        							shift.redraw();
    								letters.updateData(this.fillCapitalLetters(),letters.selectIndex-letters.focusIndex);
									letters.setFocus(false);
			    	   	  		}
	        				input.keyHandler("KEY_BACKSPACE");  
			    			counter.setData(input.maxLength-input.data.length);
	        				counter.refresh();
	        			}		
	        			else{
	        			
	        			}
        	   		}else{
        	   			input.setFocus(true);	
        	   			input.keyHandler("KEY_BACKSPACE");  
			    		counter.setData(input.maxLength-input.data.length);
	        			counter.refresh();
        	   		}		 
        	   			  
			    	break;
			}	
		break;
		
		case "confirmButtons":
			switch(_key){	
				case "KEY_IRBACK":
				case "KEY_MENU":
					if(this.section == "alias" || this.section == "stbName" || this.section == "vodCode"){
							this.home.closeSection(this);
							this.parent.nothing();
					}
					else{
							this.home.closeSection(this);
						}
				break;
				
				case "KEY_IRENTER":
					switch(confirmButtons.selectItem.id){
						case "ok":
							this.validateSections();
						break;
				
						case "cancel":
							if(this.section == "alias" || this.section == "stbName" || this.section == "vodCode"){
								this.home.closeSection(this);
								this.parent.nothing();
							}
							else{
								this.home.closeSection(this);
							}
						break;
					}		
				break;
				
				case "KEY_DOWN":
					if(confirmButtons.scrollNext()){
						letters.animation.zIndex(1).start();
						confirmButtons.animation.zIndex(2).start();
					}
				break;
				
				case "KEY_UP":
					if(confirmButtons.scrollPrev()){
						letters.animation.zIndex(1).start();
						confirmButtons.animation.zIndex(2).start();
					}
					else{
						if(words.stateGet()=="enter"){
							confirmButtons.animation.zIndex(1).start();
							words.animation.zIndex(2).start();
							confirmButtons.setFocus(false);
							words.focusIndex = 0;
							words.setFocus(true);
							this.focus = "words";
						}
						else{
							this.lastFocus = this.focus;
							input.setFocus(true);
	    					confirmButtons.setFocus(false);
	    					this.setTextWhitecolor(true);
	    					this.focus = "input";
						}
					}
				break;
				
				case "KEY_RIGHT":
					switch(confirmButtons.selectItem.id){
						case "ok":
							this.focus = "letters";
							letters.animation.zIndex(2).start();
							confirmButtons.animation.zIndex(1).start();
							confirmButtons.setFocus(false);
							letters.focusIndex = 0;
							letters.setFocus(true);
						break;
						
						case "cancel":
							this.focus = "letters";
							letters.animation.zIndex(2).start();
							confirmButtons.animation.zIndex(1).start();							
							confirmButtons.setFocus(false);
							letters.focusIndex = 13;
							letters.setFocus(true);
						break;
					
					}
				break;
			}
			
			
			
		break;
		
		//CAMBIAR TODO ESTE CASE PARA QUE FUNCIONE DE ACUERDO AL TECLADO DE SÍMBOLOS (SÓLO OK, Y MOVIMIENTOS)
		
		 /*case "keySymbols":
	    	
			switch(_key){		
					case "KEY_IRBACK":
					case "KEY_MENU":
							if(this.section == "alias" || this.section == "stbName" || this.section == "vodCode"){
								this.home.closeSection(this);
								this.parent.nothing();
							}
							else{
								this.home.closeSection(this);
							}
					break;
					case "KEY_LEFT":
						//input.setFocus(false);
						if(letters.focusIndex == 0 || letters.focusIndex == 13 || letters.focusIndex == 26){
							if(letters.focusIndex == 0){
								confirmButtons.focusIndex = 0;
							}
							else{
								confirmButtons.focusIndex = 1;
							}
							this.focus = "confirmButtons";	
							letters.animation.zIndex(1).start();
							confirmButtons.animation.zIndex(2).start();
							letters.setFocus(false);
							confirmButtons.setFocus(true);
						}else{
							if(letters.scrollPrev()){}
						}	
					break;		
					
					case "KEY_RIGHT":
						
						if(letters.selectIndex == 12 || letters.selectIndex == 25 || letters.selectIndex == 38){
							if(letters.selectIndex == 12){
								letters.setFocus(false);
								back.setData({"active":true});
								back.redraw();
								letters.animation.zIndex(1).start();
								back.animation.zIndex(2).start();
								this.focus = "back";
							}
							if(letters.selectIndex == 25){
								letters.setFocus(false);
								shift.setData({"active":true,"capital":this.capital});
	        					shift.redraw();
	        					letters.animation.zIndex(1).start();
								shift.animation.zIndex(2).start();
								this.focus = "shift";
							}
							if(letters.selectIndex == 38){
								letters.setFocus(false);
								if(this.alpha){
									symbols.setData({"active":true,"text":"@#:"});
								}
								else{
									symbols.setData({"active":true,"text":"ABC"});
								}
								symbols.redraw();
								letters.animation.zIndex(1).start();
								symbols.animation.zIndex(2).start();
								this.focus = "symbols";
								//back.setFocus(true);
								//this.focus = "back";
							}
						}
						else{
							letters.scrollNext();
						}	
					break;
					
					case "KEY_UP":
						if(this.type == "k" && w.words.stateGet()=="enter"){
							if(letters.focusIndex >= 0 && letters.focusIndex <= 12){
							if(words.list.length >= 6){
								if(letters.focusIndex == 0 || letters.focusIndex == 1 || letters.focusIndex == 2) 
									words.focusIndex = 1;
								if(letters.focusIndex == 3 || letters.focusIndex == 4 || letters.focusIndex == 5) 	
									words.focusIndex = 2;
								if(letters.focusIndex == 6 || letters.focusIndex == 7 || letters.focusIndex == 8) 	
									words.focusIndex = 3;
								if(letters.focusIndex == 9 || letters.focusIndex == 10 || letters.focusIndex == 11) 	
									words.focusIndex = 4;
								if(letters.focusIndex == 12) 	
									words.focusIndex = 5;	
									
							}else if(words.list.length == 5){
								if(letters.focusIndex == 0 || letters.focusIndex == 1 || letters.focusIndex == 2) 
									words.focusIndex = 1;
								if(letters.focusIndex == 3 || letters.focusIndex == 4 || letters.focusIndex == 5) 	
									words.focusIndex = 2;
								if(letters.focusIndex == 6 || letters.focusIndex == 7 || letters.focusIndex == 8) 	
									words.focusIndex = 3;
								if(letters.focusIndex == 9 || letters.focusIndex == 10 || letters.focusIndex == 11 || letters.focusIndex == 12) 	
									words.focusIndex = 4; 
									
							} else if(words.list.length == 4){
								if(letters.focusIndex == 0 || letters.focusIndex == 1 || letters.focusIndex == 2) 
									words.focusIndex = 1;
								if(letters.focusIndex == 3 || letters.focusIndex == 4 || letters.focusIndex == 5) 	
									words.focusIndex = 2;
								if(letters.focusIndex >= 6  && letters.focusIndex <= 12) 	
									words.focusIndex = 3;
							
							} else if(words.list.length == 3){
								if(letters.focusIndex == 0 || letters.focusIndex == 1 || letters.focusIndex == 2) 
									words.focusIndex = 1;
								if(letters.focusIndex >= 3 && letters.focusIndex <= 12) 	
									words.focusIndex = 2;	
										
							} else if(words.list.length == 2){
								if(letters.focusIndex >= 0 && letters.focusIndex <= 12) 
									words.focusIndex = 1;		
							}			
							this.lastFocus = this.focus;
							this.focus = "words";
							letters.animation.zIndex(1).start();
							words.animation.zIndex(2).start();
							letters.setFocus(false);
							words.setFocus(true);
							}
							else{
								//si no es de los primeros 13 y hay palabras
								var f = letters.focusIndex;
								letters.focusIndex = f - 13;
								letters.selectIndex = letters.focusIndex;
								if(letters.selectIndex == 0){
										letters.scrollNext(0);
										letters.scrollPrev(0);
									}
								else{
										letters.scrollPrev(0);
										letters.scrollNext(0);
								}
							}
						}
						else{
							//si es de los primeros 13
							if(letters.focusIndex >= 0 && letters.focusIndex <= 12){
	    						input.setFocus(true);
	    						letters.setFocus(false);
	    						this.setTextWhitecolor(true);
	    						this.lastFocus = this.focus;
	    						this.focus = "input";
    						}
    						//si no es de los primeros 13
    						else{
    							if(letters.focusIndex >= 13){
									var f = letters.focusIndex;
									letters.focusIndex = f - 13;
									letters.selectIndex = letters.focusIndex;
									if(letters.selectIndex == 0){
										letters.scrollNext(0);
										letters.scrollPrev(0);
									}
									else{
										letters.scrollPrev(0);
										letters.scrollNext(0);
									}
								}
								else{
									input.setFocus(true);
		    						letters.setFocus(false);
		    						this.setTextWhitecolor(true);
		    						this.lastFocus = this.focus;
									this.focus = "input";
								}
    						}
    						
					}
					
					break;
					
					
					case "KEY_DOWN":
							if(letters.focusIndex <= 25){
								var f = letters.focusIndex;
								letters.focusIndex = f + 13;
								letters.selectIndex = letters.focusIndex;
								if(letters.selectIndex == 0){
										letters.scrollNext(0);
										letters.scrollPrev(0);
									}
									else{
										letters.scrollPrev(0);
										letters.scrollNext(0);
									}
								if(f >= 13 && f <= 25){
									letters.animation.zIndex(2).start();
									space.animation.zIndex(1).start();	
								}
							}
							else{
								if(letters.focusIndex >= 36 && letters.focusIndex <= 38){
									letters.setFocus(false);
									zero.setData({"active":true});
									letters.animation.zIndex(1).start();
									zero.animation.zIndex(2).start();
									zero.redraw();
									this.focus = "zero";
								}
								else{
									letters.setFocus(false);
									space.setData({"active":true});
									letters.animation.zIndex(1).start();
									space.animation.zIndex(2).start();
									space.redraw();
									this.focus = "space";
								}	
							}
					break;
					
			    	case "KEY_IRENTER":    		
			    		this.addLetter(letters.selectItem.value);
			    		counter.setData(input.maxLength-input.data.length);
	        			counter.refresh();
	      
			    		if(this.first == 0){
			    			if(this.capital == 1){
								switch(letters.selectItem.value){
									case "0":
									case "1":
									case "2":
									case "3":
									case "4":
									case "5":
									case "6":
									case "7":
									case "8":
									case "9":
									break;
									
									default:
										this.first = 1;
										this.capital = 0;
			    						shift.setData({"active":false, "capital":0});
										shift.redraw();
								var f = letters.focusIndex;
										letters.updateData(this.fillLetters(),letters.selectIndex-letters.focusIndex);
										letters.focusIndex = f;
								//CHECAR ESTO CON MAU
								if(letters.focusIndex == 0){
									letters.scrollPrev(0);
								}
								else{
									letters.scrollPrev(0);		
									letters.scrollNext(0);
								}
									break;
								}
							}
							else if(this.capital == 2){
								this.first = 1;
							}
							else if(this.capital == 0){
								this.first = 1;
							}
			    		}
			    		else{
			    			if(this.capital == 1){
			    				this.capital = 0;
			    				shift.setData({"active":false, "capital":0});
								shift.redraw();
								var f = letters.focusIndex;
								
								letters.updateData(this.fillLetters(),letters.selectIndex-letters.focusIndex);
								letters.focusIndex = f;
								if(letters.focusIndex == 0){
									letters.scrollPrev(0);
								}
								else{
									letters.scrollPrev(0);		
									letters.scrollNext(0);
								}
								//letters.updateData(this.fillLetters(),letters.selectIndex-letters.focusIndex);
			    			}
			    			if(this.capital == 2){
			    			}
			    			
			    		}
			    	break;
				}	
				
		break;
		*/
	}	
    this.client.unlock();
	return true;	
	             	
	}	        		
	this.client.unlock();
}

keyboard.prototype.addLetter = function addLetter(_key){
	var w = this.widgets,
		letters = w.letters,
		words = w.words;
		
		if(this.type == "k" || this.type == "ks"){
			input = w.keyboardInput;
		}
		
	if(_key == "space"){
		var let = " ";
		var data = input.getData();
		if(data.length < input.maxLength){
			input.setData(data + let);
		}
	}
	else{
		var data = input.getData();
		if(data.length < input.maxLength){
			input.setData(data + _key);
		}
	}	
		
		var keys = [];
	    var data = input.data;
	    var cKey = [];
	        							
	    cKey = data.split("");
	        							
	    var current = cKey[input.dataIndex-1];
	    
	    if(current == "@"){	
	        words.setData(this.at);
	        words.stateChange("enter");						
		}
		else{
			for(var i = 0; i < words.list.length; i++){
					if(words.list[i].word == "outlook.com"){
							var ws = [];
							var six = 0;
							if(tpng.app.lastWords.length > 0){
									for(var i = tpng.app.lastWords.length-1; i >= 0 && six<6; i--){
											ws.push({"word":tpng.app.lastWords[i]});
											six++;
									}
											ws.push({"id":"delete"});
											words.setData(ws);
											words.stateChange("enter");
											if(this.focus != "words")
												words.setFocus(false);
											}
											else{
												words.setData();
												words.stateChange("exit");
													if(this.focus == "words"){
														this.focus = "letters";
														letters.focusIndex = 0;
														letters.selectIndex = 0;
														letters.setFocus(true);
													}
											}		
						}
									 		
				} 
		} 
}

keyboard.drawPanelKeyboard = function drawPanelKeyboard(_data){ 
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	var custo = JSON_Complete({"fill":"rgba(30,30,40,.8)"});
				
				
   // var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	//custo = JSON.parse(custo);
	//custo.stroke_width = 0;
	//custo.stroke = "rgba(240,240,250,0)";
	//custo.fill = "rgba(30,30,40,1)";
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	custo_f.text_align = "center,bottom";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	
	//panel negro
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
	if(_data.valid){
		custo_f.fill = "rgba(240,240,250,1)";
		Canvas.drawText(ctx, _data.text1, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight-2), custo_f);
	}
	else{
		custo_f.fill = "rgba(220,60,70,1)";
		Canvas.drawText(ctx, _data.text2, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight-2), custo_f);
	}
	
	
	//linea
	var custoW = {fill: "rgba(0,190,230,1)"};
	Canvas.drawShape(ctx, "rect", [0,105,ctx.viewportWidth,1], custoW);
	//Canvas.drawShape(ctx, "rect", [0,249,ctx.viewportWidth,1], custoW);
	
	ctx.drawObject(ctx.endObject());

}

keyboard.drawPanelKeyboard2 = function drawPanelKeyboard2(_data){ 
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

   // var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	//custo = JSON.parse(custo);
	//custo.fill = "rgba(30,30,40,1)";
	var custo = JSON_Complete({"fill":"rgba(30,30,40,.85)"});
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	custo_f.text_align = "center,bottom";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	
	//panel negro
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
	
	if(_data.valid){
		custo_f.fill = "rgba(240,240,250,1)";
		Canvas.drawText(ctx, _data.text1, new Rect(0,66,ctx.viewportWidth,36), custo_f);
	}
	else{
		custo_f.fill = "rgba(220,60,70,1)";
		Canvas.drawText(ctx, _data.text2, new Rect(0,66,ctx.viewportWidth,36), custo_f);
	}
	
	
	//linea
	var custoW = {fill: "rgba(0,190,230,1)"};
	Canvas.drawShape(ctx, "rect", [0,143,ctx.viewportWidth,1], custoW);
	//Canvas.drawShape(ctx, "rect", [0,249,ctx.viewportWidth,1], custoW);
	
	ctx.drawObject(ctx.endObject());

}

keyboard.drawPanelKeyboard3 = function drawPanelKeyboard3(_data){ 
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	custo.fill = "rgba(30,30,40,1)";
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	custo_f.text_align = "center,bottom";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	
	//panel negro
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
	//Canvas.drawShape(ctx, "rect", [0,249,ctx.viewportWidth,1], custoW);
	
	ctx.drawObject(ctx.endObject());

}

keyboard.drawWords = function drawWords(_data){ 
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		custo.fill = focus ? "rgba(240,240,250,1)":"rgba(85,95,105,1)";
		custo.rx = focus ? 5:0;
		custo.stroke = "";
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.font_family = "Oxygen-Light";	
		custo_f.text_align = "center,middle";
		custo_f.text_multiline = false;
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		custo_f.fill = focus ? "rgba(30,30,40,1)":"rgba(240,240,250,1)";
		
		if(focus){
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		}
		else{
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
		}	
		if(_data.id){
			/*if(focus){
				tp_draw.getSingleton().drawImage("img/commons/keyboard/DeleteON.png",ctx, 0, 0,null,null,null);
			}
			else{
				tp_draw.getSingleton().drawImage("img/commons/keyboard/DeleteOFF.png",ctx, 0, 0,null,null,null);
			}*/
			custo_f.fill = focus ? "rgba(30,30,40,1)":"rgba(170,170,180,1)";	
			Canvas.drawText(ctx, "<!i>borrar historial<!>", new Rect(0,-5,ctx.viewportWidth,ctx.viewportHeight), custo_f);	
			
		}
		else{
			Canvas.drawText(ctx, _data.word, new Rect(0,-5,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		}
		
		ctx.drawObject(ctx.endObject());
	}

}

keyboard.drawKey = function drawKey(_data){ 
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		custo.fill = focus ? "rgba(240,240,250,1)":"rgba(45,45,55,1)";
		custo.rx = focus ? 5:0;
		custo.stroke = "";
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.font_family = "Oxygen-Light";	
		custo_f.text_align = "center,middle";
		custo_f.font_size = _data.size * tpng.thema.text_proportion;
		if(focus)
			custo_f.font_size = 58 * tpng.thema.text_proportion;
			
		custo_f.fill = focus ? "rgba(30,30,40,1)":"rgba(170,170,180,1)";
		
		if(focus){
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		}
		else{
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
		}
		
		if(focus){
			Canvas.drawText(ctx, _data.value, new Rect(0,-15,ctx.viewportWidth,ctx.viewportHeight+10), custo_f);
		}
		else{
			Canvas.drawText(ctx, _data.value, new Rect(0,-10,ctx.viewportWidth,ctx.viewportHeight+10), custo_f);
		}
		
		ctx.drawObject(ctx.endObject());
	}

}

keyboard.drawConfirmButtons = function drawConfirmButtons(_data){ 
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		custo.fill = focus ? "rgba(240,240,250,1)":"rgba(45,45,55,1)";
		custo.rx = focus ? 5:0;
		custo.stroke = "";
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.font_family = "Oxygen-Light";	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		if(focus)
			custo_f.font_size = 22 * tpng.thema.text_proportion;
			
		custo_f.fill = focus ? "rgba(30,30,40,1)":"rgba(220,220,230,1)";
		
		if(focus){
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
			if(_data.id == "ok")
				tp_draw.getSingleton().drawImage("img/commons/keyboard/aceptarON.png",ctx, 0, 4,null,null,null);
			if(_data.id == "cancel")
				tp_draw.getSingleton().drawImage("img/commons/keyboard/cancelarON.png",ctx, 0, 4,null,null,null);
				
			
		}
		else{
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
			if(_data.id == "ok")
				tp_draw.getSingleton().drawImage("img/commons/keyboard/aceptarOFF.png",ctx, 0, 4,null,null,null);
			if(_data.id == "cancel")
				tp_draw.getSingleton().drawImage("img/commons/keyboard/cancelarOFF.png",ctx, 0, 4,null,null,null);
			
		}
		
		
		
		Canvas.drawText(ctx, _data.value, new Rect(70,5,122,58), custo_f);
		
		
		ctx.drawObject(ctx.endObject());
	}

}

keyboard.drawShift = function drawShift(_data){ 

		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
	    
		if(_data.active && _data.capital == 2){
		//en foco y mayúsculas
		
			custoFocus = {  
				fill: "rgba(240,240,250,1)",
				rx: 5
			};
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
			tp_draw.getSingleton().drawImage("img/commons/keyboard/CapsLockACTIVO.png",ctx, 5, 5,null,null,null);	
		}
		
		else if(!_data.active && _data.capital == 2){
		//no foco y mayúsculas
		
			custo = {  
				fill: "rgba(45,45,55,1)"
				//stroke: "rgba(240,240,250,.7)",
				//stroke_width: 2
			};
			//botones
				Canvas.drawShape(ctx, "rect", [5, 5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
				tp_draw.getSingleton().drawImage("img/commons/keyboard/CapsLockACTIVO.png",ctx, 5, 5,null,null,null);
		}
		
		else if(_data.active && _data.capital == 0){
		//en foco y no mayúsculas
			custoFocus = {  
				fill: "rgba(240,240,250,1)",
				rx: 5
			};
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
			tp_draw.getSingleton().drawImage("img/commons/keyboard/ShiftON.png",ctx, 5, 5,null,null,null);
		
		}
		
		else if(!_data.active && _data.capital == 0){
		//no foco y no mayúsculas
		
			custo = {  
				fill: "rgba(45,45,55,1)"
				//stroke: "rgba(240,240,250,.7)",
				//stroke_width: 2
			};
			//botones
				Canvas.drawShape(ctx, "rect", [5, 5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
				tp_draw.getSingleton().drawImage("img/commons/keyboard/ShiftOFF.png",ctx, 5, 5,null,null,null);
		}
		else if(!_data.active && _data.capital == 1){
		//no foco y shift
		
		custo = {  
				fill: "rgba(45,45,55,1)"
				//stroke: "rgba(240,240,250,.7)",
				//stroke_width: 2
			};
			//botones
				Canvas.drawShape(ctx, "rect", [5, 5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
				tp_draw.getSingleton().drawImage("img/commons/keyboard/ShiftACTIVO.png",ctx, 5, 5,null,null,null);
		}
		else if(_data.active && _data.capital == 1){
		
			custoFocus = {  
			fill: "rgba(240,240,250,1)",
			rx: 5 
		};
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
			//en foco y shift
		tp_draw.getSingleton().drawImage("img/commons/keyboard/ShiftACTIVO.png",ctx, 5, 5,null,null,null);
		
		}
		
		
		ctx.drawObject(ctx.endObject());
	

}

keyboard.drawSymbols = function drawSymbols(_data){  

		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
	    custoFocus = {  
			fill: "rgba(240,240,250,1)",
			rx: 5
		};
		
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.font_family = "Oxygen-Light";	
		custo_f.text_align = "center,top";
		custo_f.font_size = 48 * tpng.thema.text_proportion;
		//if(_data.active)
			//custo_f.font_size = 48 * tpng.thema.text_proportion;
			
		custo_f.fill = _data.active ? "rgba(30,30,40,1)":"rgba(170,170,180,.9)";
		
		
		if(_data.active){
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
			//tp_draw.getSingleton().drawImage("img/commons/keyboard/DeleteON.png",ctx, 0, 0);
		}
		else{
		custo = {  
			fill: "rgba(45,45,55,1)"
			//stroke: "rgba(240,240,250,.7)",
			//stroke_width: 2
		};
		//botones
			Canvas.drawShape(ctx, "rect", [5, 5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
		}
		
		Canvas.drawText(ctx, _data.text, new Rect(5,5,ctx.viewportWidth-10,ctx.viewportHeight-10), custo_f);
		
		ctx.drawObject(ctx.endObject());

}


keyboard.drawSpace = function drawSpace(_data){ 

		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
	    custoFocus = {  
			fill: "rgba(240,240,250,1)",
			rx: 5
		};
		if(_data.active){
			
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
			tp_draw.getSingleton().drawImage("img/commons/keyboard/EspacioON.png",ctx, 291, 32,null,null,null)
		}
		else{
		custo = {  
			//stroke: "rgba(240,240,250,.7)",
			fill: "rgba(45,45,55,1)"
			//stroke_width: 2
		};
		//botones
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
			tp_draw.getSingleton().drawImage("img/commons/keyboard/EspacioOFF.png",ctx, 291, 32,null,null,null);
			
		}
		
		
		ctx.drawObject(ctx.endObject());

}
keyboard.drawZero = function drawZero(_data){ 

		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
	    custoFocus = {  
			fill: "rgba(240,240,250,1)",
			rx: 5
		};
		
		var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		custo.fill = _data.active ? "rgba(240,240,250,1)":"rgba(45,45,55,1)";
		custo.rx = _data.active ? 5:0;
		custo.stroke = "";
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.font_family = "Oxygen-Light";	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 48 * tpng.thema.text_proportion;
		if(_data.active)
			custo_f.font_size = 58 * tpng.thema.text_proportion;
			
		custo_f.fill = _data.active ? "rgba(30,30,40,1)":"rgba(170,170,180,.9)";
		
		if(_data.active){
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
			Canvas.drawText(ctx, "0", new Rect(0,-15,ctx.viewportWidth,ctx.viewportHeight+10), custo_f);
		}
		else{
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
			Canvas.drawText(ctx, "0", new Rect(0,-10,ctx.viewportWidth,ctx.viewportHeight+10), custo_f);
		}
		
		
		/*if(_data.active){
			
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
		}
		else{
		custo = {  
			fill: "rgba(45,45,55,1)"
		};
		//botones
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
			
		}*/
		
		
		ctx.drawObject(ctx.endObject());

}

keyboard.drawBack = function drawBack(_data){ 

		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
	    custoFocus = {  
			fill: "rgba(240,240,250,1)",
			rx: 5
		};
		if(_data.active){
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
			tp_draw.getSingleton().drawImage("img/commons/keyboard/DeleteON.png",ctx, 5, 5);
		}
		else{
		custo = {  
			fill: "rgba(45,45,55,1)"
			//stroke: "rgba(240,240,250,.7)",
			//stroke_width: 2
		};
		//botones
			Canvas.drawShape(ctx, "rect", [5, 5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
			tp_draw.getSingleton().drawImage("img/commons/keyboard/DeleteOFF.png",ctx, 5, 5);
		}
		
		ctx.drawObject(ctx.endObject());

}

keyboard.drawBackNum = function drawBackNum(_data){ 

		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
	    custoFocus = {  
			fill: "rgba(240,240,250,1)"
		};
		if(_data.active){
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
			tp_draw.getSingleton().drawImage("img/commons/keyboard/DeleteON.png",ctx, 31, 17,null,null,null);
		}
		else{
	
		//botones
			tp_draw.getSingleton().drawImage("img/commons/keyboard/DeleteOFF.png",ctx, 31, 17,null,null,null);

		}
		
		ctx.drawObject(ctx.endObject());

}

keyboard.drawArrowK = function drawArrowK(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
	var custoW = {fill: "rgba(90,90,90,1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [13,0,2,ctx.viewportHeight], custoW);
	
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [16,0,2,ctx.viewportHeight], custoW);	
	
	
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 18);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}

keyboard.prototype.onExit = function onExit(){
	var widgets = this.widgets;
	
	widgets.stateChange("exit");
	
	if(tpng.app.lastWords.length > 0)
		settings.set("tpng.app.lastWords",tpng.app.lastWords);
	if(tpng.app.lastNumbers.length > 0)
		settings.set("tpng.app.lastNumbers",tpng.app.lastNumbers);
}

keyboard.drawCounter = function drawCounter(_data){ 
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	   var count = _data.toString();
			var custo_t = JSON.stringify(this.themaData.standardFont);
				custo_t = JSON.parse(custo_t);
				custo_t.text_align = "center,bottom";
				if(_data >= 171){
					custo_t.fill = "rgba(120,210,30,1)";
				}else if(_data >= 120 && _data < 171){
					custo_t.fill = "rgba(120,210,30,1)";
				}else if(_data >= 60 && _data < 120){
					custo_t.fill = "rgba(255,220,0,1)";
				}else if(_data >= 0 && _data < 60){
					custo_t.fill = "rgba(220,60,70,1)";
				}
				custo_t.font_size = 18* tpng.thema.text_proportion;
				Canvas.drawText(ctx,count, new Rect(0,0,186,32), custo_t);
		ctx.drawObject(ctx.endObject());

}
