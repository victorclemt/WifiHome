function forgot(config, options){  
    this.super(config, options);
    this.buttons;
    this.home;
    this.state;
    this.id;
    this.answer;
    this.focus = "questions";
    this.newnip;
    this.noreturn = false;
}
//CAMBIAR TEXTOS DE AVATAR Y DE HEADER ESTÁN AL REVÉS
forgot.inherits(FormWidget);

forgot.prototype.onEnter = function onEnter(_data){
	var w = this.widgets;
	this.home = _data.home;
	if(_data.nip){
		this.nip = _data.nip;
		this.parent = _data.parent;
	}
		
	var buttons = [
		{"id":"r","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png","img":""}
	];
	//VARIABLE PARA METER EL OTRO ARREGLO Y EL DEL BOTON REGRESAR
	this.buttons = buttons;
	
	w.bg.setData();
	w.headerQ.setData();
	
	this.client.lock();
		w.bg.stateChange("enter");
		w.headerQ.stateChange("enter");
	this.client.unlock();
	if(this.home == undefined){
		this.home = this.formParent;
		this.home.showHeader();
	}
	this.getQuestions();
}

forgot.prototype.getQuestions = function getQuestions(){
	getServices.getSingleton().call("ADMIN_GET_QUESTIONS", ,this.responseGetQuestions.bind(this));

}



forgot.prototype.responseGetQuestions = function responseGetQuestions(response){
	if(response.status == 200){
		var forgot = response.data.ResponseVO.arrayQuestions;
		var w = this.widgets;
			if(forgot.length >0){ 
				for(var i = 0; i<forgot.length; i++){
					this.buttons.push({"id":forgot[i].QuestionVO.cquId,"text": forgot[i].QuestionVO.question,"used":forgot[i].QuestionVO.isSelected})
				}
				w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
				w.questions.setData(this.buttons);
				w.leftArrow.stateChange("enter");	
				w.questions.stateChange("enter");
				w.questions.setFocus(true);
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
			
			/*if(tpng.user.profile.havePasswd && !this.noreturn){
				this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"title":"Es necesario ingresar el NIP para hacer cambios en este perfil.", "txt1": "Sección: Cambia tu pregunta secreta","txt4":"Este perfil está protegido por NIP.|Para omitir este paso deberás desactivar tu NIP desde Ajustes > Administra tu NIP."}}, false,null,true);
			}
			else{*/			
				this.focus = "questions";		
			//}	
		}else{
			w.message.setData({"text":"Por el momento no hay preguntas secretas disponibles, vuelve más tarde"});
			w.message.stateChange("enter");
		}				
	}else if(response.error){	
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);	
	}
}

forgot.prototype.openNextSection = function openNextSection(_allow){
	if(_allow){
			this.focus = "questions";
			this.noreturn = true;
	}
	else{
		this.home.closeSection(this);
	}
}

forgot.prototype.updateQuestion = function updateQuestion(answer,nip){
this.newnip = nip;
this.answer = answer.trim();

if(this.answer.length > 0){
var params = ["proId="+tpng.user.profile.proId+"&updateType=14&value="+this.id];
	getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdateQuestion.bind(this));
	}
	else{
		his.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu respuesta: ","text2":"La respuesta no puede estar vacía, inténtalo de nuevo","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, true,,true);
	}
}

forgot.prototype.responseUpdateQuestion = function responseUpdateQuestion(response){
	if(response.status == 200 && response.data.ResponseVO.status == 0 && response.data.ResponseVO.message =="Operación Exitosa"){
		this.updateAnswer();
		//this.home.closeSection(this);	
	}else if(response.error){	
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);	
	}
}

forgot.prototype.updateAnswer = function updateAnswer(){
	var params = ["proId="+tpng.user.profile.proId+"&updateType=15&value="+this.answer];
	getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseUpdateAnswer.bind(this));
	
}

forgot.prototype.responseUpdateAnswer = function responseUpdateAnswer(response){
	if(response.status == 200 && response.data.ResponseVO.status == 0 && response.data.ResponseVO.message =="Operación Exitosa"){
		if(this.newnip != undefined){
		var params = ["proId=" +tpng.user.profile.proId+"&updateType=2&value="+this.newnip];
			getServices.getSingleton().call("ADMIN_SET_PROFILE", params, this.responseSendPasswd.bind(this));
		}else{
			this.onEnter();			
		}	
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);	
	}
}

forgot.prototype.responseSendPasswd = function responseSendPasswd(responseCode){
	
	if(responseCode.status == 200){
		this.home.closeAllNew(true);
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status},false);			
	}
}	



forgot.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
	switch(this.focus){	
		case "search":
			switch(_key){
				case "KEY_DOWN":
				case "KEY_MENU":
				case "KEY_IRBACK":
					this.home.disableSearchHeader();
					this.focus = "questions";
					w.questions.setFocus(true);
				break;
				
				default:
					this.home.onKeyPress(_key);
				break;
			}
		break;		
		
		case "questions":
			switch(_key){		
				case "KEY_LEFT":
				case "KEY_RIGHT":			
					_key == "KEY_LEFT"
					if(_key == "KEY_LEFT"){
						if(w.questions.scrollPrev()){
							if(w.questions.maxItem > 6){		
										if(w.questions.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.questions.selectIndex == (w.questions.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.questions.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.questions.selectIndex+1 <= w.questions.maxItem-6){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
							}
						}
					}
					else{
						if(w.questions.scrollNext()){
							if(w.questions.maxItem > 6){		
										if(w.questions.selectIndex >= 6){
											w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.questions.selectIndex == (w.questions.maxItem-1)){
											w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}
										if(w.questions.selectIndex == 0){
											w.leftArrow.setData({"url":"", "line":true, "position": "left"});
											w.leftArrow.stateChange("enter");
										}
										if(w.questions.selectIndex < 4 && w.questions.maxItem-3){
											w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
											w.rightArrow.stateChange(this.state);
										}	
							}
						}
					}	
				break;
				
				case "KEY_IRENTER":
					switch(w.questions.selectItem.id){
						case "r":
						if(this.nip){
							w.bg.stateChange("exit");
							w.headerQ.stateChange("exit");
							w.questions.stateChange("exit");
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							this.home.closeSection(this);
							this.parent.cancelNip();
						}
						else{
							w.bg.stateChange("exit");
							w.headerQ.stateChange("exit");
							w.questions.stateChange("exit");
							w.leftArrow.stateChange("exit");
							w.rightArrow.stateChange("exit");
							this.home.closeSection(this);
						}	
						break;
						
						default:
							this.id = w.questions.selectItem.id;
							this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu respuesta: ","text2":"La respuesta no puede estar vacía, inténtalo de nuevo","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":true,"nip":this.nip}, true,,true);
						break;
						
					}
				break;
				
				case "KEY_MENU":
				case "KEY_IRBACK":
					if(this.nip){
						w.bg.stateChange("exit");
						w.headerQ.stateChange("exit");
						w.questions.stateChange("exit");
						w.leftArrow.stateChange("exit");
						w.rightArrow.stateChange("exit");
						this.home.closeSection(this);
						this.parent.cancelNip();
					}
					else{
						w.bg.stateChange("exit");
						w.headerQ.stateChange("exit");
						w.questions.stateChange("exit");
						w.leftArrow.stateChange("exit");
						w.rightArrow.stateChange("exit");
						this.home.closeSection(this);
					}
					
				break;
				
				case "KEY_UP":
				if(this.nip){
				}
				else{
					w.questions.setFocus(false);
					this.home.enableSearchHeader();
					this.focus = "search";
					}
				break;
			}	
			break;
	}	
	return true;	
}




forgot.drawQuestions = function drawQuestions(_data){
	
	
		this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		//imagen
		tp_draw.getSingleton().drawImage(_data.img, ctx, 5, 5 ,null, null, null,"destination-over");
		
		
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
		if(_data.used){
			Canvas.drawShape(ctx, "rect", [0,144,186,32], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
				 var custo_f = JSON.stringify(this.themaData.standardFont);
				custo_f = JSON.parse(custo_f);
				custo_f.text_align = "center,top";
				custo_f.font_size = 18* tpng.thema.text_proportion;
				custo_f.fill = "rgba(255,255,255,1)";	
				Canvas.drawText(ctx, "Pregunta actual", new Rect(0,144,186,32), custo_f);
		
		}
		
		
		//título
		if(_data.text == "Regresar"){
	    var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "left,middle";
		custo_f.font_size = 20* tpng.thema.text_proportion;
		custo_f.fill = "rgba(255,240,200,1)";	
		Canvas.drawText(ctx, _data.text+"", new Rect(93,0,90,ctx.viewportHeight-6), custo_f);
		//badge	
		tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);	
		}		
		else{
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "center,middle";
		custo_f.font_size = 20* tpng.thema.text_proportion;
		custo_f.fill = "rgba(255,240,200,1)";	
		Canvas.drawText(ctx, _data.text+"", new Rect(3,3,ctx.viewportWidth-6,ctx.viewportHeight-6), custo_f);
		
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
		
		/*
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		*/
		
	    
	    ctx.drawObject(ctx.endObject());
	}
}

forgot.drawBgQuestions = function drawBgQuestions(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
		 ctx.drawObject(ctx.endObject());
}

forgot.drawHeaderQ = function drawHeaderQ(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "left,top";
		custo_t.font_size = 24* tpng.thema.text_proportion;
		custo_t.fill = "rgba(240,240,250,1)";
		Canvas.drawText(ctx, "Cambia tu pregunta secreta", new Rect(0,0,ctx.viewportWidth-67,ctx.viewportHeight-6), custo_t);
		custo_t.font_size = 20* tpng.thema.text_proportion;	
		Canvas.drawText(ctx, "Selecciona una pregunta secreta y escribe su respuesta para recuperar tu NIP en caso de perderlo.", new Rect(64,38,ctx.viewportWidth-131,ctx.viewportHeight-44), custo_t);
		
		
		ctx.drawObject(ctx.endObject());
}


forgot.drawArrowsQ = function drawArrows(_data){
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

forgot.drawMessageDevices = function drawMessageDevices(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,middle";
	custo_f.fill = "rgba(240,240,250,1)";
	
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
		
	ctx.drawObject(ctx.endObject());	
}

