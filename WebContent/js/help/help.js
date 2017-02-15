// help.js

FormWidget.registerTypeStandard("help");

function help(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;

   	this.keyComb = "";
	this.ban1 = 0;
	this.ban9 = 0;
	this.ban8 = 0;
	this.ban7 = 0;
	this.controls = false;

}

help.inherits(FormWidget);

help.prototype.onEnter = function onEnter(_data){	
	this.home = _data.home;
	var widgets = this.widgets;
	this.getHelpData();
	this.home.objectChild = this; //Player Events			
}

help.prototype.onExit = function onExit(){
	var widgets = this.widgets;
	this.home.hideBg();
	this.widgets.stateChange("exit");
/*	widgets.listMainQuestions.stateChange("exit");
	widgets.listQuestionsTop.stateChange("exit");
	widgets.panelSocialNetwork.stateChange("exit");
	widgets.rightArrowHelp.stateChange("exit");
	widgets.LeftArrowHelp.stateChange("exit");
	widgets.terms.stateChange("exit");
*/
	this.home.hideHeader();	

}

help.prototype.onStreamEvent = function onStreamEvent(event) {
	var widgets = this.widgets;
	switch(event.type){
		case "end":
		case "endOfFile":
			widgets.exitVideo.stateChange("exit");		
			this.exitVideo();
		
		break;
	}
}
help.prototype.getHelpData = function getHelpData(){
	getServices.getSingleton().call("ADMIN_GET_DATA_HELP", , this.responseGetHelp.bind(this));
}

help.prototype.responseGetHelp = function responseGetHelp(response){
	if(response.status == 200){
		var questionsArray = response.data.ResponseVO.questionsArray,
			topQuestionsArray = response.data.ResponseVO.topQuestionsArray,
			callCenterPhone = response.data.ResponseVO.callCenterPhone;
		this.phoneCallCenter = response.data.ResponseVO.callCenterPhone;
		this.showHome(questionsArray, topQuestionsArray);
		this.callCenterPhoneS = replaceAll(callCenterPhone, "-", "");
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
		
}

help.prototype.showHome = function showHome(_arrayQuestion, _arrayTopQuestion){
	var widgets = this.widgets;
	this.home.showHeader({"section": "help"});
	
	var url = "img/help/18x18.jpg"; // imagen background
	this.setBackground(url);
	this.actualFocus = "section_top";

	this.mainQuestions = [
		{"id":0, "text":"Solución de|Problemas", "text2":"", "text3":"", "icon":"img/help/2x2-problemas.png", "background":"img/help/bannerProblemas.jpg"},
		{"id":1, "text":"Control|Remoto", "text2":"","text3":"","icon":"img/help/2x2-control.png", "background":"img/help/bannerControl.jpg"},
		{"id":2, "text":"Línea Totalplay|"+this.phoneCallCenter, "text2":"","text3":"", "icon":"img/help/2x2-telefono.png", "background":"img/help/bannerCallcenter.jpg"},
		{"id":3, "text":"Diagnóstico|del sistema", "text2":"","text3":"", "icon":"img/help/2x2-diagnostico.png", "background":"img/help/bannerDiagnostico.jpg"}
	];

	var statusMonitoring = Netgem.applications.monitgemcompanion && Netgem.applications.monitgemcompanion.status() == "connected" ? "Desactivar" : "Activar";
	//if(Netgem.applications.monitgemcompanion){
		this.mainQuestions.push({"id":4, "text":"Monitoreo|Remoto|","text3":"(Para uso exclusivo|de soporte técnico)", "text2":statusMonitoring, "icon":"img/help/2x2-monitoreo.png", "background":"img/help/bannerMonitoreo.jpg" });
	//}
	
	this._arrayQuestion = _arrayQuestion;
	widgets.listMainQuestions.setData(this.mainQuestions);
	widgets.listMainQuestions.stateChange("enter");
	
	widgets.LeftArrowHelp.setData({"url":"", "line":true, "position": "left"});
	widgets.LeftArrowHelp.stateChange("enter");

	widgets.LeftArrowHelpTop.setData({"url":"", "line":true, "position": "left"});
	widgets.LeftArrowHelpTop.stateChange("enter");
	
	if(_arrayTopQuestion.length > 6){
		widgets.rightArrowHelp.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
		widgets.rightArrowHelp.stateChange("enter");
	}
	
	if(_arrayTopQuestion.length > 3){
		widgets.rightArrowHelpTop.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
		widgets.rightArrowHelpTop.stateChange("enter");
	}

	widgets.listQuestionsTop.setData(_arrayTopQuestion);
	widgets.listQuestionsTop.stateChange("enter");

	widgets.panelSocialNetwork.setData();
	widgets.panelSocialNetwork.stateChange("enter");
	
/*------------------------------------------ */	
	widgets.terms.setData();
	widgets.terms.stateChange("enter");
	
	

}

help.prototype.step_1 = function step_1(_data){

	var widgets = this.widgets;	
	widgets.panelQuestions.setData({"title": "Tu problema está relacionado a:"});
	widgets.panelQuestions.stateChange("enter");
	
	this.actualFocus = "step_1";
	for(var i = 0; i < _data.length; i++){
		_data[i].HelpCategoryVO.index = i+1;
	}
	
	widgets.listCategories.setData(_data);
	widgets.listCategories.stateChange("enter");
}

help.prototype.step_2 = function step_2(_data){

	this.actualFocus = "step_2";
	var widgets = this.widgets;
	widgets.panelQuestions.setData({"title": "Selecciona la opción más adecuada:"});
	widgets.panelQuestions.refresh();

	widgets.listCategories.stateChange("exit");
	widgets.panelDescription.stateChange("exit");

	widgets.step_questions.setData(_data.questions);
	widgets.step_questions.stateChange("enter");
	
}

help.prototype.step_answer = function step_answer(_data, _section){

	var widgets = this.widgets;
	this.actualFocus = "step_answer";
	this.section = "top";
	widgets.panelQuestions.setData({
		"question": _data.question,
		"answer": _data.answer,
		"detail": _data.detail,
		"section": "answer"
	});
	
	widgets.panelQuestions.stateChange("enter");
	widgets.panelQuestions.refresh();
	widgets.step_questions.stateChange("exit");
	widgets.panelDescription.stateChange("exit");

}
//help.onFocusStep_1
help.onFocusStep_1 = function onFocusStep_1(_focus,_data){
	var widgets = this.widgets;
	if(_focus){
		widgets.panelDescription.setData({"description": _data.item.HelpCategoryVO.description});	
		widgets.panelDescription.stateChange("enter");
		widgets.panelDescription.refresh();

	}
}

help.onFocusStep_2 = function onFocusStep_2(_focus,_data){
	var widgets = this.widgets;
	if(_focus){
		widgets.panelDescription.setData({"description": _data.item.QuestionVO.answer});
		widgets.panelDescription.stateChange("enter");	
		widgets.panelDescription.refresh();
	}
}


help.onFocusDetailControls = function onFocusDetailControls(_focus,_data){
	var widgets = this.widgets;
	if(_focus){
		widgets.panelControlsDetail.setData(_data.item);
		widgets.panelControlsDetail.stateChange("enter");	
		widgets.panelControlsDetail.refresh();
	}
}

help.prototype.showControls = function showControls(){

	var widgets = this.widgets;
	this.actualFocus = "buttons_controls";
	this.controls = true;
	widgets.listMainQuestions.stateChange("exit");
	widgets.listQuestionsTop.stateChange("exit");
	widgets.panelSocialNetwork.stateChange("exit");
	widgets.rightArrowHelp.stateChange("exit");
	widgets.LeftArrowHelp.stateChange("exit");	
	widgets.terms.stateChange("exit");
	
	var buttonsControl = [
		{"text":"STB/TV", 		 "description": "Cambia entre controlar la STB o la TV.", "img":"img/help/controlSTBTV.png"},
		{"text":"STB ENCENDIDO", "description":"Encender/Apagar STB.", "img":"img/help/controlSTBENCENDIDO.png"},
		{"text":"TV ENCENDIDO",  "description":"Encender/Apagar la TV.",  "img":"img/help/controlTVENCENDIDO.png"},		
		{"text":"AV", 			 "description":"Cambia entre las diferentes entradas de tu TV.", "img":"img/help/controlAV.png"},
		{"text":"MENÚ", 		 "description":"Abre el menú principal.", "img":"img/help/controlMENU.png"},
		{"text":"ATRÁS", 		 "description":"Regresa a la sección anterior.", "img":"img/help/controlATRAS.png"},		
		{"text":"OK / ACEPTAR",  "description":"Acepta la selección actual.",  "img":"img/help/controlOKACEPTAR.png"},
		{"text":"ARRIBA", 		 "description":"Abre tus apps usadas recientemente (en modo TV), desplaza hacia arriba (dentro de cualquier sección).", "img":"img/help/controlARRIBA.png"},
		{"text":"IZQUIERDA", 	 "description":"Abre el timeline (en modo TV), desplaza a la izquierda (dentro de cualquier sección).", "img":"img/help/controlIZQ.png"},		
		{"text":"DERECHA",  	 "description":"Abre recomendaciones en vivo (en modo TV), desplaza a la derecha (dentro de cualquier sección).","img":"img/help/controlDERECHA.png"},
		{"text":"ABAJO", 		 "description":"Abre la miniguía (en modo TV), desplaza hacia abajo (dentro de cualquier sección).","img":"img/help/controlABAJO.png"},
		{"text":"VOLUMEN", 		 "description":"Sube y baja el volumen.", "img":"img/help/controlVOLUMEN.png"},		
		{"text":"MUTE",  		 "description":"Habilita o deshabilita el sonido.", "img":"img/help/controlMUTE.png"},
		{"text":"CANAL", 		 "description":"Cambia al canal anterior o siguiente.", "img":"img/help/controlCANAL.png"},
		{"text":"TECLADO NUMÉRICO", "description":"Ingresa el número o caracter propio del botón presionado.","img":"img/help/controlNUMERICO.png"},		
		{"text":"BORRAR", 		 "description":"Borra el último caracter ingresado.", "img":"img/help/controlBORRAR.png"},
		{"text":"INFORMACIÓN", 	 "description":"Muestra información de la selección actual.", "img":"img/help/controlINFORMACION.png"},
		{"text":"CANAL PREVIO",  "description":"Cambia entre el canal actual y el último canal sintonizado", "img":"img/help/controlCANALPREVIO.png"},		
		{"text":"IDIOMAS",  	 "description":"Ciclo entre los canales de audio disponibles en el programa de TV o VOD.", "img":"img/help/controlIDIOMAS.png"},
		{"text":"SUBTITULOS",  	 "description":"Ciclo entre los subtítulos disponibles en el programa de TV o VOD.","img":"img/help/controlSUBTITULOS.png"},
		{"text":"GUÍA",  		 "description":"Abre la mini guía de programación.", "img":"img/help/controlGUIA.png"},		
		{"text":"PELICULAS",  	 "description":"Abre la sección de Películas.", "img":"img/help/controlPELICULAS.png"},
		{"text":"APPS",  		 "description":"Abre Aplicaciones recientes.", "img":"img/help/controlAPPS.png"},
		{"text":"RECOMENDACIONES",  "description":"Abre sección de Recomendaciones en Vivo.", "img":"img/help/controlRECOMENDACIONES.png"},		
		{"text":"PIP",  		 "description":"Abre picture in picture.", "img":"img/help/controlPIP.png"},
		{"text":"SKIP BACK",  	 "description":"Retroceder 10 min an cualquier reproducción.", "img":"img/help/controlSKIPBACK.png"},
		{"text":"REW",  		 "description":"Retrocede el video.", "img":"img/help/controlREW.png"},		
		{"text":"PLAY / PAUSA",  "description":"Pausa/Reproduce en el modo video.", "img":"img/help/controlPLAYPAUSA.png"},
		{"text":"STOP",  		 "description":"Detiene el video.", "img":"img/help/controlSTOP.png"},
		{"text":"FF",  			 "description":"Adelanta el video.", "img":"img/help/controlFF.png"},		
		{"text":"SKIP FORWARD",  "description":"Avanzar 10 min an cualquier reproducción.", "img":"img/help/controlSKIPFORWARD.png"},
		{"text":"BUSCAR",  		 "description":"Ir a la búsqueda.", "img":"img/help/controlBUSCAR.png"}
	];
	
	widgets.buttons_controls.setData(buttonsControl);
	widgets.buttons_controls.stateChange("enter");
	/*
		widgets.LeftArrowHelp.setData({"url":"", "line":true, "position": "left"});
	widgets.LeftArrowHelp.stateChange("enter");
	
	if(_arrayTopQuestion.length > 6){
		widgets.rightArrowHelp.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
		widgets.rightArrowHelp.stateChange("enter");
	*/
	
	widgets.LeftArrowControls.setData({"url":"", "line":true, "position": "left"});	
	widgets.LeftArrowControls.stateChange("enter");
	
	widgets.rightArrowControls.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
	widgets.rightArrowControls.stateChange("enter");
	
	widgets.panelControls.setData();
	widgets.panelControls.stateChange("enter");

}

help.prototype.sendCall = function sendCall(_phone){
	var widgets = this.widgets;
	var params = ["mdnDest="+this.callCenterPhoneS];
	getServices.getSingleton().call("ADMIN_SEND_CALL",params, this.responseGetCall.bind(this));
	
	setTimeout(function (){
		widgets.panel_call.stateChange("exit");	
	}.bind(this), 3000);

}

help.prototype.responseGetCall = function responseGetCall(response){
	if(response.status == 200){
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code": response.status}, false);
	}
		
}

help.prototype.onKeyPress = function onKeyPress(_key){
	
	if(_key=="KEY_TV_1" || _key=="KEY_TV_9" || _key=="KEY_TV_8" || _key=="KEY_TV_6"){
		this.keyComb = this.validateKeyComb(_key);	
	}else{
		this.keyComb = "";
		this.ban1 = 0;
		this.ban9 = 0;
		this.ban8 = 0;
		this.ban6 = 0;
	}
	
	switch(this.actualFocus){ 
		case "section_top":
			this.onKeyPressSection_top(_key);
		break;
		case "section_bottom":
			this.onKeyPressSection_bottom(_key);
		break;
		case "step_1":
			this.onKeyPressStep_1(_key);
		break;
		case "step_2":
			this.onKeyPressStep_2(_key);
		break;
		case "step_answer":
			this.onKeyPressStep_answer(_key);
		break;
		case "buttons_controls":
			this.onKeyPressButtons_controls(_key);
		break;
		case "search":
			this.onKeyPressSearch(_key);
		break;		
		case "terms":
			this.onKeyPressTerms(_key);
		break;
		case "video":
			this.onKeyPressVideo(_key);
		break;
	}
	return true;

}

help.prototype.onKeyPressSection_top = function onKeyPressSection_top(_key){
	var widgets = this.widgets,
		listMainQuestions = widgets.listMainQuestions,
		listQuestionsTop = widgets.listQuestionsTop,
		panelQuestions = widgets.panelQuestions,
		LeftArrowHelpTop = widgets.LeftArrowHelpTop, 
		rightArrowHelpTop = widgets.rightArrowHelpTop;
		
	switch(_key){	

		case "KEY_TV_RED":
			NGM.trace(Netgem.applications.monitgemcompanion.status());
		break;
		
		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":
			switch(listMainQuestions.selectItem.id){
				case 0:
					this.step_1(this._arrayQuestion);
				break;
				case 1:
					// Control
					this.showControls();
				break;
				case 2:
					// Call
					widgets.panel_call.setData();
					widgets.panel_call.stateChange("enter");
					this.sendCall();					
				break;
				
				case 3:
					this.home.openSection("checklist",{"home":this.home}, true);					
				break;

				case 4: // monitoreo
					if(Netgem.applications.monitgemcompanion){
					this.actualFocus = "";
						for(var i = 0; i < listMainQuestions.list.length; i++){
							if(listMainQuestions.list[i].text2 == "Activar"){
								listMainQuestions.list[i].text2 = "Desactivar";	
								listMainQuestions.redraw(listMainQuestions.list[i]);
								Netgem.applications.monitgemcompanion.start();
							
							}else if(listMainQuestions.list[i].text2 == "Desactivar"){					
								listMainQuestions.list[i].text2 = "Activar";	
								listMainQuestions.redraw(listMainQuestions.list[i]);
								Netgem.applications.monitgemcompanion.end();						
							}
						}
				
						this.timer = setTimeout(function(){
							this.actualFocus = "section_top";
							this.home.setHeaderButtons();
							this.home.refreshHeader(2, "selected", true);
						}.bind(this), 2000);
					}
				break;	// case 3
			} // fin switch enter
		break;
		
		case "KEY_DOWN":
			this.actualFocus = "section_bottom";
			listMainQuestions.setFocus(false);
			listQuestionsTop.setFocus(true);				
		break;
		
		case "KEY_UP":
				this.actualFocus = "search";
	   			this.home.enableSearchHeader();
	   			listMainQuestions.setFocus(false);
		break;
		
		case "KEY_RIGHT":
		case "KEY_LEFT":
			_key == "KEY_LEFT" ? listMainQuestions.scrollPrev() : listMainQuestions.scrollNext();

			 if(listMainQuestions.maxItem > 3){
				if(listMainQuestions.selectIndex >= 3){
					LeftArrowHelpTop.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					LeftArrowHelpTop.stateChange("enter");
				}
				
				if(listMainQuestions.selectIndex == (listMainQuestions.maxItem-1)){
					rightArrowHelpTop.setData({"url": "" ,"line":true, "position": "right"});
					rightArrowHelpTop.stateChange("enter");
				}	
				
				
				if(listMainQuestions.selectIndex == 0){
					LeftArrowHelpTop.setData({"url":"", "line":true, "position": "left"});
					LeftArrowHelpTop.stateChange("enter");
				}
				 
				if(listMainQuestions.selectIndex+1 <= (listMainQuestions.maxItem-3)){
					rightArrowHelpTop.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
					rightArrowHelpTop.stateChange("enter");
				}
			}	
		break;


	}	
	return true;
}


help.prototype.onKeyPressSection_bottom = function onKeyPressSection_bottom(_key){
	var widgets = this.widgets,
		listMainQuestions = widgets.listMainQuestions,
		listQuestionsTop = widgets.listQuestionsTop,
		panelQuestions = widgets.panelQuestions,
		LeftArrowHelp = widgets.LeftArrowHelp,
		rightArrowHelp = widgets.rightArrowHelp;
		
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":	
			if(listQuestionsTop.selectItem.QuestionVO.urlVideo){
				this.showVideo(listQuestionsTop.selectItem.QuestionVO.urlVideo);					
			}else{
				this.actualFocus = "step_answer";
				this.section = "bottom";
				panelQuestions.setData({
					"question": listQuestionsTop.selectItem.QuestionVO.question,
					"answer": listQuestionsTop.selectItem.QuestionVO.answer,
					"detail": listQuestionsTop.selectItem.QuestionVO.detail,
					"section": "answer"
				});
				panelQuestions.stateChange("enter");	
			}
		break;
		
		case "KEY_UP":
			this.actualFocus = "section_top";
			listQuestionsTop.setFocus(false);
			listMainQuestions.setFocus(true);
		break;

		case "KEY_DOWN":
			this.showTerms();
		break;
	
		case "KEY_RIGHT":
		case "KEY_LEFT":
			_key == "KEY_LEFT" ? listQuestionsTop.scrollPrev() : listQuestionsTop.scrollNext();

			 if(listQuestionsTop.maxItem > 6){
				if(listQuestionsTop.selectIndex >= 6){
					LeftArrowHelp.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					LeftArrowHelp.stateChange("enter");
				}
				
				if(listQuestionsTop.selectIndex == (listQuestionsTop.maxItem-1)){
					rightArrowHelp.setData({"url": "" ,"line":true, "position": "right"});
					rightArrowHelp.stateChange("enter");
				}	
				
				if(listQuestionsTop.selectIndex == 0){
					LeftArrowHelp.setData({"url":"", "line":true, "position": "left"});
					LeftArrowHelp.stateChange("enter");
				}
				 
				if(listQuestionsTop.selectIndex+1 <= (listQuestionsTop.maxItem-6)){
					rightArrowHelp.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
					rightArrowHelp.stateChange("enter");
				}
			}			
			 
		break;
	
		case "KEY_TV_RED":
			//this.widgets.back.setData();
			//this.widgets.back.stateChange("enter");
		break;
	}	
	return true;
}

help.prototype.onKeyPressStep_1 = function onKeyPressStep_1(_key){
	var widgets = this.widgets,
		listMainQuestions = widgets.listMainQuestions,
		listQuestionsTop = widgets.listQuestionsTop,
		listCategories = widgets.listCategories,
		panelDescription = widgets.panelDescription,
		panelQuestions = widgets.panelQuestions;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.actualFocus = "section_top";
			panelQuestions.setData();
			panelQuestions.stateChange("exit");
			listCategories.stateChange("exit");
			panelDescription.stateChange("exit");
		break;
		
		case "KEY_IRENTER":		
			this.step_2(listCategories.selectItem.HelpCategoryVO);
		break;
		
		case "KEY_UP":
		break;
		
		case "KEY_RIGHT":
		case "KEY_LEFT":
			_key == "KEY_LEFT" ? listCategories.scrollPrev() : listCategories.scrollNext();
		break;

		case "KEY_TV_RED":
		//	this.widgets.back.setData();
		//	this.widgets.back.stateChange("enter");
		//	Netgem.applications.monitgemcompanion.status()		
		break;
	}	
	return true;
}

help.prototype.onKeyPressStep_2 = function onKeyPressStep_2(_key){
	var widgets = this.widgets;
		
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.actualFocus = "section_top";
			widgets.panelQuestions.setData();
			widgets.panelQuestions.stateChange("exit");
			widgets.step_questions.stateChange("exit");
			widgets.panelDescription.stateChange("exit");
		break;
		
		case "KEY_IRENTER":
			this.step_answer(widgets.step_questions.selectItem.QuestionVO);
		break;
				
		case "KEY_RIGHT":
		case "KEY_LEFT":
			_key == "KEY_LEFT" ? widgets.step_questions.scrollPrev() : widgets.step_questions.scrollNext();
		break;

		case "KEY_TV_RED":
			//this.widgets.back.setData();
			//this.widgets.back.stateChange("enter");
		break;
	}	
	return true;
}

help.prototype.onKeyPressStep_answer = function onKeyPressStep_answer(_key){
	var widgets = this.widgets,
		panelQuestions = widgets.panelQuestions,
		listCategories = widgets.listCategories;
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
		case "KEY_IRENTER":
			if(this.section == "top")
				this.actualFocus = "section_top";
			else
				this.actualFocus = "section_bottom";
		
			widgets.panelQuestions.setData();
			widgets.panelQuestions.stateChange("exit");
		break;
		
		case "KEY_TV_RED":
			//this.widgets.back.setData();
			//this.widgets.back.stateChange("enter");
		break;
	}	
	return true;
}

help.prototype.onKeyPressButtons_controls = function onKeyPressButtons_controls(_key){
	var widgets = this.widgets,
	buttons_controls = widgets.buttons_controls,
	rightArrowControls = widgets.rightArrowControls,
	LeftArrowControls = widgets.LeftArrowControls;
	
	switch(_key){	

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.actualFocus = "section_top";
			this.controls = false;
			// exit
			widgets.buttons_controls.stateChange("exit");
			widgets.panelControls.stateChange("exit");
			widgets.panelControlsDetail.stateChange("exit");
			widgets.rightArrowControls.stateChange("exit");
			widgets.LeftArrowControls.stateChange("exit");		
			// enter
			widgets.listMainQuestions.stateChange("enter");
			widgets.listQuestionsTop.stateChange("enter");
			widgets.panelSocialNetwork.stateChange("enter");
			widgets.rightArrowHelp.stateChange("enter");
			widgets.LeftArrowHelp.stateChange("enter");	
			widgets.terms.stateChange("enter");						
		break;
		
		case "KEY_RIGHT":
		case "KEY_LEFT":
			_key == "KEY_LEFT" ? buttons_controls.scrollPrev() : buttons_controls.scrollNext();

				 if(buttons_controls.maxItem > 6){
					if(buttons_controls.selectIndex >= 6){
						LeftArrowControls.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
						//LeftArrowControls.stateChange("enter");
						LeftArrowControls.redraw();
						
					}
					if(buttons_controls.selectIndex == (buttons_controls.maxItem-1)){
						rightArrowControls.setData({"url": "" ,"line":true, "position": "right"});
//						rightArrowControls.stateChange("enter");
						rightArrowControls.redraw();
					}
					
					if(buttons_controls.selectIndex == 0){
						LeftArrowControls.setData({"url":"", "line":true, "position": "left"});
						LeftArrowControls.stateChange("enter");
					}
				 
					if(buttons_controls.selectIndex+1 <= (buttons_controls.maxItem-6)){
						rightArrowControls.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
						rightArrowControls.stateChange("enter");
					}
						
				}
		break;		
	
		case "KEY_UP":
			this.actualFocus = "search";
   			this.home.enableSearchHeader();
   			buttons_controls.setFocus(false);
		break;
		
		case "KEY_TV_BLUE":
			this.widgets.back.stateChange("exit");
		break;

		
		case "KEY_TV_RED":
			this.widgets.back.setData();
			this.widgets.back.stateChange("enter");
		break;
	}	
	return true;
}

help.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	var widgets = this.widgets;	
	switch(_key){	
	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			//CÓDIGO PARA ACTIVAR LA SECCIÓN
			//HABILITAR FOCUS, REDRAWS, ETC
			this.home.disableSearchHeader();
			if(this.controls){
				this.actualFocus = "buttons_controls";
				widgets.buttons_controls.setFocus(true);
			}else{
				this.actualFocus = "section_top";
				widgets.listMainQuestions.setFocus(true);	
			}
	   	  	
	  	 	
		break;
		
		default:
			this.home.onKeyPress(_key);
		break;
	}
	return true
}


help.prototype.onKeyPressTerms = function onKeyPressTerms(_key){
	var widgets = this.widgets;	
	switch(_key){	
	
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.actualFocus = "section_bottom";
			widgets.terms.stateChange("enter");	
			widgets.exitTerms.stateChange("exit");
			widgets.arrowUp.stateChange("exit");
			widgets.arrowDown.stateChange("exit");	
		break;
	
		case "KEY_UP":	
			if(this.cont <= 0){
			//NGM.trace("this.cont== 1 "+this.cont);
			}else{

				this.cont = this.cont-1;
				//NGM.trace("this.cont== 2 "+this.cont);
				if(this.cont == 2){
					widgets.arrowUp.stateChange("exit");
				}
				if(this.cont == 20){
					widgets.arrowDown.stateChange("enter");
				}
				this.page.y = this.page.y + 50;
				widgets.terms.animation.move(this.page.x, this.page.y, 300, 0).start();
			}
		break;
	
		case "KEY_DOWN":
			if(1750 <= 650){
			}else{
				this.cont = this.cont+1;
				var resultX = 1750 - 650;
				var mov = resultX /50;
				this.move = Math.round(mov)+1;
				if(this.cont >= this.move){

					this.cont = this.move-1;
					widgets.arrowDown.stateChange("exit");
				}else{	
				if(this.cont > 3 ){
					widgets.arrowUp.setData({"img": "img/help/arrowUp.png"});
					widgets.arrowUp.stateChange("enter");
				}
					this.page.y = this.page.y - 50;
					widgets.terms.animation.move(this.page.x, this.page.y, 300, 0).start(); 
				}
			}
		break;
	
		
	}
	return true
}

help.prototype.onKeyPressVideo = function onKeyPressVideo(_key){
	var widgets = this.widgets;	
	switch(_key){
	
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":			
			widgets.exitVideo.setData();
			widgets.exitVideo.stateChange("exit");	
			this.exitVideo();
			
		break;	
	}
	return true
}

// FUNCION DEL ROLAS
help.prototype.showVideo = function showVideo(_url){

	var widgets = this.widgets;
	this.actualFocus = "video";
	this.home.hideHeader();		
	this.home.playVideo(_url, "HLS", 0);
	this.home.widgets.player.stateChange("enter");
	widgets.listMainQuestions.stateChange("exit");
	widgets.listQuestionsTop.stateChange("exit");
	widgets.panelSocialNetwork.stateChange("exit");
	widgets.rightArrowHelp.stateChange("exit");
	widgets.LeftArrowHelp.stateChange("exit");
	widgets.terms.stateChange("exit");
	widgets.exitVideo.setData({"text":"Presiona OK para salir del video"});
	widgets.exitVideo.stateChange("enter");	
}

help.prototype.exitVideo = function exitVideo(){
	var widgets = this.widgets;
	this.actualFocus = "section_bottom";
	this.home.showHeader({"section": "help"});
	
	this.home.setPlayerStatus("STOP");
	this.home.objectChild = null;
	this.home.widgets.player.stateChange("exit");

	widgets.listMainQuestions.stateChange("enter");
	widgets.listQuestionsTop.stateChange("enter");
	widgets.panelSocialNetwork.stateChange("enter");
	widgets.rightArrowHelp.stateChange("enter");
	widgets.LeftArrowHelp.stateChange("enter");
	widgets.terms.stateChange("enter");		

		
}

help.prototype.validateKeyComb = function validateKeyComb(_key){
	var n = "";
	switch(_key){
		
		case "KEY_TV_1":
			if(this.ban1 == 0){
				n = "1";
				this.ban1 = 1;
			}else{
				this.keyComb = "";
				this.ban1 = 0;
				this.ban9 = 0;
				this.ban8 = 0;
				this.ban6 = 0;
			}
		break;
		
		case "KEY_TV_9":
			if(this.ban9 == 0 && this.ban1 == 1){
				n = "9";
				this.ban9 = 1;
			}else{
				this.keyComb = "";
				this.ban1 = 0;
				this.ban9 = 0;
				this.ban8 = 0;
				this.ban6 = 0;
			}
		break;
		
		case "KEY_TV_8":
			if(this.ban8 == 0 && this.ban1 == 1 && this.ban9 == 1){
				n = "8";
				this.ban8 = 1;
			}else{
				this.keyComb = "";
				this.ban1 = 0;
				this.ban9 = 0;
				this.ban8 = 0;
				this.ban6 = 0;
			}
		break;
		
		case "KEY_TV_6":
			if(this.ban6 == 0 && this.ban1 == 1 && this.ban9 == 1 && this.ban8 == 1){
				n = "6";
				this.ban6 = 1;
			}else{
				this.keyComb = "";
				this.ban1 = 0;
				this.ban9 = 0;
				this.ban8 = 0;
				this.ban6 = 0;
			}
		break;
		
		default:
			n = "x";
		break;		
	}
	this.keyComb = this.keyComb + n;
	if (this.keyComb == "1986"){
		this.ban1 = 0;
		this.ban9 = 0;
		this.ban8 = 0;
		this.ban6 = 0;
		NGM.application.open("setup", {'title': "setup", "url": "setup"});
	}
	
	if (this.keyComb.length>=4)
		this.keyComb = "";
	return this.keyComb;
}

//TODO: ver si esta función la pasamos a la librería IMG
help.prototype.loadPaintImg = function loadPaintImg(_url){
	//Función que pinta la imagen hasta que se descarga
	//Para transiciones de vodHome, menú y wizard VOD
	var o = {"home":this.home}; //Argumentos que mandamos a la función callback
	//Verificamos que la imagen esté en caché
	var img = NGM.imageCache.get(_url);
	//Si está en cache mandamos directamente a la función callback
    if (img) {
    	//NGM.trace("desde cache: ");
        this.imgLoadCb(_url, img, o);
        return;
    }else{
    //sino descargamos la imagen del backend y enviamos la función callback
    	//NGM.trace("descargando imagen: ");
		var options = {"id"        : _url,
	                   "noload"    : false,
	                   "persistent": true,
	                   "expireIn"  : 12*60*60,    // could be replace by this.expireIn for setting management
	                   "callback"  : this.imgLoadCb,
	                   "opaque"    : o};
	     NGM.imageCache.add(_url, options);
     }
}

help.prototype.imgLoadCb = function imgLoadCb(url, img, arg){
	//Función callback que setea la imagen en el background principal
	//del HOME, adicional cambia el speed de entrada para lograr una 
	//mejor transición.
	if(img.size){
		var bg = arg.home.widgets.mainBg;
		bg.setData(img);
		bg.stateChange("enter",500);
	}	
//	delete img;
	//Importante siempre borrar la imagen para no llenar la buffer gráfico.
}


help.prototype.setBackground = function setBackground(_url){

	var bg = this.home.widgets.mainBg;

	//Antes de la carga de la imagen pasamos a medium el background
	//para lograr el efecto de medium a enter
	bg.stateChange("medium");
	this.loadPaintImg(_url);
}

help.prototype.showTerms = function showTerms(_url){

	var widgets = this.widgets;
	this.cont = 0;
	this.actualFocus = "terms";

	widgets.terms.setData();
	widgets.terms.animation.move(131, 146, 300, 0).start();
	this.page = {"x": 131, "y": 146};
	
	widgets.exitTerms.setData();
	widgets.exitTerms.stateChange("enter");
	
	widgets.arrowDown.setData({"img": "img/help/arrowDown.png"});
	widgets.arrowDown.stateChange("enter");
	
}

help.drawListMainQuestions = function drawListMainQuestions(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 	/*
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		*/
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
		if(focus){
				custo.rx = 5;
				custo.stroke_width = 5;
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

				var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_position" : "inside"};
				Canvas.drawShape(ctx, "rect", [6, 6, ctx.viewportWidth-12,ctx.viewportHeight-12], strokeF);
				//388 //222
		}else{
				Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo); //FONDO		
			}		
		// IMAGE
		tp_draw.getSingleton().drawImage(_data.background, ctx, 5,5, null, null, null,"destination-over");
		
		// TEXT0
		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "left,top";
			custo_f.font_size = 30 * tpng.thema.text_proportion;			

		Canvas.drawText(ctx, _data.text2, new Rect(130, 40, 250, 35), custo_f);	

		Canvas.drawText(ctx, _data.text, new Rect(130, 70, 250, 100), custo_f);	

		custo_f.font_size = 24 * tpng.thema.text_proportion;			
		Canvas.drawText(ctx, _data.text3, new Rect(130, 140, 250, 60), custo_f);	

		
		// ICON
		tp_draw.getSingleton().drawImage(_data.icon, ctx, 0, 75);

		ctx.drawObject(ctx.endObject());
	}
}

help.drawListQuestionsTop = function drawListQuestionsTop(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 /*
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		*/

		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
		if(focus){
				custo.rx = 5;
				custo.stroke_width = 5;
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

				var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_pos" : "inside"};
				Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10], strokeF);
				//388 //222
		}else{
				Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo); //FONDO		
			}		
		
		
		// IMAGE
		tp_draw.getSingleton().drawImage("img/help/3x3.jpg", ctx, 5, 5 , null, null, null,"destination-over");
		
		// TEXT0
		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 18 * tpng.thema.text_proportion;			
		Canvas.drawText(ctx, _data.QuestionVO.question, new Rect(0, 28, 190, 70), custo_f);	


		ctx.drawObject(ctx.endObject());
	}
}

help.drawStepSocialNetwork = function drawStepSocialNetwork(_data){
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
		var version = settings.get("tpng.lastversioninstalled");
                try {
                    tpng.stb.ip = Netgem.middleware.connectionManager.activeConnection.currentIpAddress;
                } catch(e)
                {
                    tpng.stb.ip = "?";
                }
	//	var custoW = {"fill": "rgba(0,0,0,.7)"};
	//	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);
	
		var custo_f = focus ? JSON.stringify(this.themaData.standardFont) : JSON.stringify(this.themaData.standarGrayFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "left,top";
			custo_f.font_size = 18 * tpng.thema.text_proportion;	
			
		// TOP
		Canvas.drawText(ctx, "Centro de ayuda", new Rect(0, 7, 190, 28), custo_f);			
		// MIDDLE
		Canvas.drawText(ctx, "Preguntas frecuentes", new Rect(0, 263, 190, 28), custo_f);	
		// BOTTOM
		custo_f.text_align = "right,top";
		Canvas.drawText(ctx, "<!b>"+"Totalplay STB Diagnóstico"+"<!>", new Rect(0, 420, 250, 28), custo_f);	

		//STB
		custo_f.text_align = "left,top";		
		Canvas.drawText(ctx, "Direccion MAC (S/N): "+tpng.backend.mac_address, new Rect(320, 420, 350, 25), custo_f);			
		//Canvas.drawText(ctx, "Direccion MAC de Wi-Fi): ", new Rect(320, 445, 350, 28), custo_f);			
		//Canvas.drawText(ctx, "Version de software: "+"v.3.0."+tpng.app.subversion, new Rect(320, 470, 350, 28), custo_f);			
		Canvas.drawText(ctx, "Red Local: "+tpng.stb.ip, new Rect(320, 445, 350, 28), custo_f);	
		Canvas.drawText(ctx, "Versión: "+version, new Rect(320, 470, 350, 28), custo_f);			
		//Canvas.drawText(ctx, "Internet: ", new Rect(320, 470, 350, 28), custo_f);				
		
		// NETWORKS		
		Canvas.drawText(ctx, "facebook/totalplay", new Rect(895, 433, 186, 26), custo_f);	
		Canvas.drawText(ctx, "@totalplaymx", new Rect(895, 460, 186, 26), custo_f);
		Canvas.drawText(ctx, "www.totalplay.com.mx", new Rect(895, 483, 190, 28), custo_f);				

		// IMAGES
		tp_draw.getSingleton().drawImage("img/socialNetworks/facebook14.png", ctx, 872, 437);		
		tp_draw.getSingleton().drawImage("img/socialNetworks/twitter14.png", ctx, 872, 466);	

		/*
		// TEXT0
		Canvas.drawText(ctx, "Visítanos en Facebook:", new Rect(0, 444, 190, 28), custo_f);	
		Canvas.drawText(ctx, "Visítanos en twitter:", new Rect(383, 444, 190, 28), custo_f);	
		Canvas.drawText(ctx, "Visita nuestra página:", new Rect(770, 444, 190, 28), custo_f);
	
		
		//LINKS
		custo_f.font_size = 22 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, "facebook/totalplay", new Rect(65, 483, 220, 28), custo_f);	
		Canvas.drawText(ctx, "@totalplaymx", new Rect(450, 483, 220, 28), custo_f);
		Canvas.drawText(ctx, "www.totalplay.com.mx", new Rect(770, 483, 300, 28), custo_f);
		*/
		ctx.drawObject(ctx.endObject());
}

help.drawListCategories = function drawListCategories(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	    	 
		var custo_f = focus ? JSON.stringify(this.themaData.standardFont) : JSON.stringify(this.themaData.standarGrayFont);
			custo_f = JSON.parse(custo_f);
			custo_f.text_align = "center,top";
			custo_f.font_size = 20 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.HelpCategoryVO.alias, new Rect(0, 80, ctx.viewportWidth, 60), custo_f);	
		
		if(focus){
			tp_draw.getSingleton().drawImage("img/help/"+_data.HelpCategoryVO.index+"_ON.png", ctx, 0, 0 , null, null, null,"destination-over");
		}else{
			tp_draw.getSingleton().drawImage("img/help/"+_data.HelpCategoryVO.index+"_OFF.png", ctx, 0, 0 , null, null, null,"destination-over");
		}


		ctx.drawObject(ctx.endObject());
	}
}

help.drawStep_questions = function drawStep_questions(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 	
		var custo_f = focus ? JSON.stringify(this.themaData.standardFont) : JSON.stringify(this.themaData.standarGrayFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 19 * tpng.thema.text_proportion;	
						
		// TEXT0
		Canvas.drawText(ctx,_data.QuestionVO.question, new Rect(0, 28, 185, 90), custo_f);	
		ctx.drawObject(ctx.endObject());
	}
}

help.drawPanelQuestions = function drawPanelQuestions(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	custo.fill = "rgba(30,30,40,.95)";
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	
	// TITULO
		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,top";
			custo_f.font_size = 30 * tpng.thema.text_proportion;

	if(_data.section == "answer"){				
		Canvas.drawText(ctx, _data.answer, new Rect(67, 182, 1145, 100), custo_f);	
		custo_f.font_size = 18 * tpng.thema.text_proportion;			
		Canvas.drawText(ctx, _data.detail, new Rect(67, 362, 1145, 120), custo_f);
	}else{
		Canvas.drawText(ctx, _data.title, new Rect(67, 182, 1145, 100), custo_f);
		//Canvas.drawText(ctx, _data.description, new Rect(0, 310, ctx.viewportWidth, 50), custo_f);		
	}

//	custo_f.fill = "rgba(30,30,40,1)";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx,"Presiona Menú/Atrás para salir", new Rect(514, 655, 262, 20), custo_f);
	tp_draw.getSingleton().drawImage("img/help/4x2-oksalir.png", ctx, 514, 650);		

	ctx.drawObject(ctx.endObject());
}


help.drawPanelDescription = function drawPanelDescription(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

    	// TITULO
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,top";
		custo_f.fill = "rgba(85,95,105,1)";
		custo_f.font_size = 20 * tpng.thema.text_proportion;

	Canvas.drawText(ctx, _data.description, new Rect(250, 0, 770, ctx.viewportHeight), custo_f);
	//Canvas.drawText(ctx, _data.answer, new Rect(250, 0, 770, ctx.viewportHeight), custo_f);		
	ctx.drawObject(ctx.endObject());	
}

help.drawButtonsControls = function drawButtonsControls(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   	 	ctx.clear();
   	 			 
		var custoBackground = {"fill": "0-rgba(150, 170, 40, 1)|1-rgba(100, 110, 20, 1)", "fill_coords":"0,0,.6,-.4"};
		Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custoBackground);

   	 	// TEXT0
		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 18 * tpng.thema.text_proportion;			
		Canvas.drawText(ctx, _data.text, new Rect(0, 38, 190, 30), custo_f);	


		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
		if(focus){
				custo.rx = 5;
				custo.stroke_width = 5;
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

				var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_pos" : "inside"};
				Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10], strokeF);
				//388 //222
		}else{
				Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo); //FONDO		
			}
// -----
   	 	/*if(focus){
   	 		var custoX = { 
				"fill"  : null,  
				"stroke": "rgba(240, 240, 250, 1)",
				"stroke_width": 4, 
				"rx": 0,
				"stroke_pos" : "inside"
			} 
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoX); //FONDO	
		 }else{
   	 		var custoX = { 
				"fill"  : null,  
				"stroke": "rgba(90,90,90,1)",
				"stroke_width": 1, 
				"rx": 0,
				"stroke_pos" : "inside"
			} 
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoX); //FONDO	
		 
		 }*/

		
		ctx.drawObject(ctx.endObject());
	}
}

help.drawPanelControls = function drawPanelControls(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "left,top";
		custo_f.font_size = 26 * tpng.thema.text_proportion;			
		
	Canvas.drawText(ctx, "Ubica tu control remoto:", new Rect(80, 149, 300, 40), custo_f);
	tp_draw.getSingleton().drawImage("img/help/control_BASE.png", ctx, 330, 0); //tmp el w y h	
	
	//	custo_f.fill = "rgba(30,30,40,1)";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx,"Presiona Menú/Atrás para salir", new Rect(519, 545, 262, 20), custo_f);
	tp_draw.getSingleton().drawImage("img/help/4x2-oksalir.png", ctx, 514, 540);
	
	ctx.drawObject(ctx.endObject());	
}

help.drawPanelControlsDetail = function drawPanelControlsDetail(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "left,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;			
		
	Canvas.drawText(ctx, _data.description, new Rect(962, 159, 200, 100), custo_f);
	tp_draw.getSingleton().drawImage(_data.img, ctx, 330, 0, null, null, null,"destination-over"); //tmp el w y h	
	
	ctx.drawObject(ctx.endObject());	
}


help.drawGeneralPanelLCall = function drawGeneralPanelLCall(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.fill = "rgba(120,210,30,1)";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
	
		Canvas.drawText(ctx,"<!i>Llamando Call Center - Totalplay <!>", new Rect(0, 0, ctx.viewportWidth,ctx.viewportHeight), custo_f);

	ctx.drawObject(ctx.endObject());	
}

help.drawArrowHelp = function drawArrowHelp(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     

	//var custoX = {fill: "rgba(0,255,0,.3)"};
	//Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportHeight,ctx.viewportHeight], custoX);
	
	var custoW = {fill: "rgba(220, 220, 230, 1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [11,0,1,ctx.viewportHeight], custoW);
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [19,0,1,ctx.viewportHeight], custoW);	
		
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 36);

    ctx.drawObject(ctx.endObject());
}

help.drawArrowHelpTop = function drawArrowHelpTop(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     
	
	var custoW = {fill: "rgba(220, 220, 230, 1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [10,0,1,ctx.viewportHeight], custoW);
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [19,0,1,ctx.viewportHeight], custoW);	
		
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 92);

    ctx.drawObject(ctx.endObject());
}

help.drawBackX = function drawBackX(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	tp_draw.getSingleton().drawImage("img/tools/DevsOnion.png", ctx, 0, 0); //tmp el w y h	
	//tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 0); //tmp el w y h	
	ctx.drawObject(ctx.endObject());	
}

help.drawTerms = function drawTerms(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	custoW = {"fill": "rgba(30,30,40,.9)"};
	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoW);
	
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
			
	var text = "Copyright (c) 2012, Vernon Adams (vern@newtypography.co.uk)||This Font Software is licensed under the SIL Open Font License, Version 1.1.||This license is copied below, and is also available with a FAQ at: http://scripts.sil.org/OFL||||-----------------------------------------------------------||SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007||-----------------------------------------------------------||PREAMBLE||The goals of the Open Font License (OFL) are to stimulate worldwide development of collaborative font projects, to support the font creation efforts of academic and linguistic communities, and to provide a free and open framework in which fonts may be shared and improved in partnership with others.||The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves. The fonts, including any derivative works, can be bundled, embedded, redistributed and/or sold with any software provided that any reserved names are not used by derivative works. The fonts and derivatives, however, cannot be released under any other type of license. The requirement for fonts to remain under this license does not apply to any document created using the fonts or their derivatives.||DEFINITIONS|| -Font Software- refers to the set of files released by the Copyright Holder(s) under this license and clearly marked as such. This may include source files, build scripts and documentation.||Reserved Font Name refers to any names specified as such after the copyright statement(s).||-Original Version- refers to the collection of Font Software components as distributed by the Copyright Holder(s).||-Modified Version- refers to any derivative made by adding to, deleting, or substituting -- in part or in whole -- any of the components of the Original Version, by changing formats or by porting the Font Software to a new environment.||-Author- refers to any designer, engineer, programmer, technical writer or other person who contributed to the Font Software.||||PERMISSION & CONDITIONS||Permission is hereby granted, free of charge, to any person obtaining a copy of the Font Software, to use, study, copy, merge, embed, modify, redistribute, and sell modified and unmodified copies of the Font Software, subject to the following conditions:||1) Neither the Font Software nor any of its individual components, in Original or Modified Versions, may be sold by itself.||2) Original or Modified Versions of the Font Software may be bundled, redistributed and/or sold with any software, provided that each copy contains the above copyright notice and this license. These can be included either as stand-alone text files, human-readable headers or in the appropriate machine-readable metadata fields within text or binary files as long as those fields can be easily viewed by the user.||3) No Modified Version of the Font Software may use the Reserved Font Name(s) unless explicit written permission is granted by the corresponding Copyright Holder. This restriction only applies to the primary font name as presented to the users.||4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font Software shall not be used to promote, endorse or advertise any Modified Version, except to acknowledge the contribution(s) of the Copyright Holder(s) and the Author(s) or with their explicit written permission.||5) The Font Software, modified or unmodified, in part or in whole, must be distributed entirely under this license, and must not be distributed under any other license. The requirement for fonts to remain under this license does not apply to any document created using the Font Software.||TERMINATION||This license becomes null and void if any of the above conditions are not met.||DISCLAIMER||THE FONT SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.";

	Canvas.drawText(ctx, text, new Rect(29, 15,  ctx.viewportWidth-58, ctx.viewportHeight), custo_f);
//	tp_draw.getSingleton().drawImage("img/help/copyright-2.jpg", ctx, 0, 0, 1018, 1581); //tmp el w y h
	ctx.drawObject(ctx.endObject());	
}

help.drawExitTerms = function drawExitTerms(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	custoW = {"fill": "rgba(30,30,40,.9)"};
	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoW);
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		custo_f.fill = "rgba(120,210,30,1)";		
		
	Canvas.drawText(ctx, "Presiona Menú/Atrás para salir", new Rect(29, 0,  ctx.viewportWidth-58, ctx.viewportHeight), custo_f);
	ctx.drawObject(ctx.endObject());	
}

help.drawArrows = function drawArrows(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	//custoW = {"fill": "rgba(255,0,0,.9)"};
	//Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoW);
	
	tp_draw.getSingleton().drawImage(_data.img, ctx, 45, 0);
	
	ctx.drawObject(ctx.endObject());	
}

help.drawExitVideo = function drawExitVideo(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     

	//var custoX = {fill: "rgba(220,220,230, .3)"};
//Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth,ctx.viewportHeight], custoX);

	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
	//	custo_f.fill = "rgba(30, 30, 40, 1)";
	//	custo_f.font_size = 15 * tpng.thema.text_proportion;

	custo_f.font_size = 15 * tpng.thema.text_proportion;
	Canvas.drawText(ctx,_data.text, new Rect(0,5,ctx.viewportWidth,20), custo_f);
	tp_draw.getSingleton().drawImage("img/help/4x2-oksalir.png", ctx, 0, 0);

//	Canvas.drawText(ctx,_data.text, new Rect(0, 0, ctx.viewportWidth,ctx.viewportHeight), custo_f);
    ctx.drawObject(ctx.endObject());
}