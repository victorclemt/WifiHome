// setup.js

function setup(config, options){  
    this.super(config, options);
    this.items = [];
    this._lastFocusedInput;
    this.actualFocus = "";
    this.step = 0;
    this.totalSteps = 8;
    this.home;
    this.nip1 = "";
    this.nip2 = "";
    this.alias = "";
    this.nipFinal = "";
    this.question = "";
    this.answer = "";
    this.mail = "";
    this.avatar = "";
}

setup.inherits(FormWidget);

setup.prototype.onEnter = function onEnter(_data){

	var widgets = this.widgets;
	this.home = _data.home;
	//this.widgets.malla.setData("");
	//this.widgets.malla.stateChange("enter");
	
	var url = "img/admin/setup/18x18-Logo.jpg";
	this.home.setBg(url);
	this.home.widgets.player.setData();
	//this.home.setPlayerStatus("STOP");
	
	clearTimeout(this.timerLoadData);
	this.getMail();	
	this.timerLoadData =
		setTimeout(function(){
		this.home.hideBg(url);
		this.init();	
		//this.eighth("next");
		}.bind(this), 5000);
	
}

setup.prototype.init = function init(){
	var w = this.widgets;
		
		this.home.showHeader({"section":"setup","simple": true,"fill": "rgba(0,0,0,0)"});
		var url = "img/commons/0x0-Back_Wood-BW_HD.jpg";
		this.home.setBg(url);
		w.bg.setData();
		w.bg.stateChange("enter");
		w.line.setData();
		w.line.stateChange("enter");
		w.legend.setData({"legend":"Hola, gracias por elegir Totalplay."});
		w.headerText.setData({"legend":"Prepárate para vivir una experiencia completamente diferente en tu tv. Día a día nos adaptamos al futuro de la televisión y trabajamos constantemente para ofrecerte las últimas tecnologías desarrolladas en el mundo digital. Esperamos que difrutes tu sistema tanto como nosotros disfrutamos desarrollándolo."});
		w.footerText.setData({"legend":"XoXo Totalplay."});
		var buttons = [
	
						{"id":"n","legend":"Siguiente", "active":true}
					];
		w.buttons.setData(buttons);
		this.client.lock();
			w.legend.stateChange("enter");
			w.headerText.stateChange("enter");
			w.footerText.stateChange("enter");
			w.buttons.stateChange("enter");
			w.buttons.setFocus(true);
			this.actualFocus = "buttons";
			this.step = 1;
			w.steps.setData({"step":this.step,"total":this.totalSteps});
			w.steps.stateChange("enter");
		this.client.unlock();
	
}

setup.prototype.first = function first(dir){
	var w = this.widgets;
	
	if(dir == "prev"){
		w.legend.stateChange("exit_r");
		w.headerText.stateChange("exit_r");
		w.footerText.stateChange("exit_r");
		w.buttons.stateChange("exit_r");
		w.line.stateChange("exit_r");
		w.aliasInput.stateChange("exit_r");
		w.steps.stateChange("exit_r");
		
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.aliasInput.setData();
			w.steps.setData();
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.aliasInput.stateChange("exit_l");
			w.steps.stateChange("exit_l");
		}.bind(this), 300);	
		
		
		clearTimeout(this.timerLoadData);
		
	this.timerLoadData =
			setTimeout(function(){
		w.legend.setData({"legend":"Hola, gracias por elegir Totalplay."});
		w.headerText.setData({"legend":"Prepárate para vivir una experiencia completamente diferente en tu tv. Día a día nos adaptamos al futuro de la televisión y trabajamos constantemente para ofrecerte las últimas tecnologías desarrolladas en el mundo digital. Esperamos que difrutes tu sistema tanto como nosotros disfrutamos desarrollándolo."});
		w.footerText.setData({"legend":"XoXo Totalplay."});
		var buttons = [
	
						{"id":"n","legend":"Siguiente","active":true}
					];
		w.buttons.setData(buttons);
		this.client.lock();
			w.legend.stateChange("enter");
			w.headerText.stateChange("enter");
			w.footerText.stateChange("enter");
			w.buttons.stateChange("enter");
			w.line.stateChange("enter");
			w.buttons.setFocus(true);
			this.actualFocus = "buttons";
			this.step = 1;
			w.steps.setData({"step":this.step,"total":this.totalSteps});
			w.steps.stateChange("enter");
		this.client.unlock();
		}.bind(this), 1000);
	
	}
	
}
setup.prototype.second = function second(dir){
	var w = this.widgets;
	
		if(dir == "next"){
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			//w.aliasInput.stateChange("exit_l");
			w.steps.stateChange("exit_l");
			w.timeZone.stateChange("exit_l");
			w.timeZoneImg.stateChange("exit_l");
			w.timeZoneImgBg.stateChange("exit_l");
			
				clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.aliasInput.setData();
			w.steps.setData();
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.aliasInput.stateChange("exit_r");
			w.steps.stateChange("exit_r");
		}.bind(this), 300);	
		
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Necesitarás un alias"});
				w.headerText.setData({"legend":"Escribe un nombre corto para identificarte dentro del sistema."});
				w.footerText.setData({"legend":"<!i>Máximo 20 caracteres. Podrás cambiarlo después cuantas veces quieras."});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active": true},
							{"id":"n","legend":"Siguiente","active":false}
						];
				w.buttons.setData(buttons);
				w.aliasInput.setData("OK para escribir alias");
				
				
				this.client.lock();
				
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					w.aliasInput.stateChange("enter");
					this.actualFocus = "alias";
					w.buttons.setFocus(false);
					w.aliasInput.setFocus(true);
					this.step = 3;
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				
				}.bind(this), 2000);
		}
		if(dir == "prev"){
		
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.steps.stateChange("exit_l");
			w.aliasInput.stateChange("exit_l");
			
		clearTimeout(this.timerLoad);
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.line.setData();
			w.steps.setData();
			w.timeZone.setData();
			w.buttons.setData();
			w.timeZoneImg.setData();
			w.timeZoneImgBg.setData();
			w.legend.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.steps.stateChange("exit_r");
			w.timeZone.stateChange("exit_r");
			w.timeZoneImg.stateChange("exit_r");
			w.timeZoneImgBg.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
		}.bind(this), 300);	

		clearTimeout(this.timerLoadData);
		this.timerLoadData =
			setTimeout(function(){
				this.client.lock();
					
					
					var tz = settings.get("options.tzoffset");
					
					w.legend.setData({"legend":"Selecciona zona horaria:"});
					
					var timeZone = [
								{"id":-300,"label":"UTC-5 Tiempo del Sureste","url":"img/admin/setup/timeZone/ZonaHorariaD.png","selected":false},
								{"id":-360,"label":"UTC-6 Tiempo del Centro","url":"img/admin/setup/timeZone/ZonaHorariaC.png","selected":false},
								{"id":-420,"label":"UTC-7 Tiempo del Pacífico","url":"img/admin/setup/timeZone/ZonaHorariaB.png","selected":false},
								{"id":-480,"label":"UTC-8 Tiempo del Noroeste","url":"img/admin/setup/timeZone/ZonaHorariaA.png","selected":false}
							];
					
					
					for(var i = 0; i < timeZone.length; i++){
						if(timeZone[i].id == tz){
							timeZone[i].selected = true;
						break;
						}
					}	
					
					w.timeZone.setData(timeZone);
					
					var buttons = [
								{"id":"p","legend":"Atrás","active": true},
								{"id":"n","legend":"Siguiente","active":false}
							];
					w.buttons.setData(buttons);
					
					w.timeZoneImgBg.setData({"logo":"img/admin/setup/timeZone/ZonaHorariaBACK.png"});
					w.timeZoneImgBg.stateChange("enter");
					
					w.timeZoneImg.setDataAnimated({"logo":w.timeZone.selectItem.url},"exit", "enter");
					
					
					w.timeZone.stateChange("enter");
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					this.actualFocus = "timeZone";
					w.buttons.setFocus(false);
					this.step = 2;
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				
				}.bind(this), 2000);
	
		}
	
}

setup.prototype.second_1 = function second_1(dir){
	var w = this.widgets;

		if(dir == "next"){
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.steps.stateChange("exit_l");
			
			
		clearTimeout(this.timerLoad);
		this.timerLoad =
			setTimeout(function(){
			this.actualFocus = "";
			w.legend.setData();
			w.line.setData();
			w.steps.setData();
			w.timeZone.setData();
			w.buttons.setData();
			w.timeZoneImg.setData();
			w.timeZoneImgBg.setData();
			w.legend.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.steps.stateChange("exit_r");
			w.timeZone.stateChange("exit_r");
			w.timeZoneImg.stateChange("exit_r");
			w.timeZoneImgBg.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
		}.bind(this), 300);	

		clearTimeout(this.timerLoadData);
		this.timerLoadData =
			setTimeout(function(){
				this.client.lock();
					
					var tz = settings.get("options.tzoffset");

					w.legend.setData({"legend":"Selecciona zona horaria:"});
					
					
					var timeZone = [
								{"id":-300,"label":"UTC-5 Tiempo del Sureste","url":"img/admin/setup/timeZone/ZonaHorariaD.png","selected":false},
								{"id":-360,"label":"UTC-6 Tiempo del Centro","url":"img/admin/setup/timeZone/ZonaHorariaC.png","selected":false},
								{"id":-420,"label":"UTC-7 Tiempo del Pacífico","url":"img/admin/setup/timeZone/ZonaHorariaB.png","selected":false},
								{"id":-480,"label":"UTC-8 Tiempo del Noroeste","url":"img/admin/setup/timeZone/ZonaHorariaA.png","selected":false}
							];
							
					
					for(var i = 0; i < timeZone.length; i++){
						if(timeZone[i].id == tz){
							timeZone[i].selected = true;
						break;
						}
					}		
							
					w.timeZone.setData(timeZone);
					
					var buttons = [
								{"id":"p","legend":"Atrás","active": true},
								{"id":"n","legend":"Siguiente","active":false}
							];
					w.buttons.setData(buttons);
					
					
					w.timeZoneImgBg.setData({"logo":"img/admin/setup/timeZone/ZonaHorariaBACK.png"});
					w.timeZoneImgBg.stateChange("enter");
					
					w.timeZoneImg.setDataAnimated({"logo":w.timeZone.selectItem.url},"exit", "enter");
				
					//w.timeZone.setFocus(true);
					w.timeZone.stateChange("enter");
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					
					w.buttons.setFocus(false);
					
					
					this.step = 2;
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
					
					this.actualFocus = "timeZone";
				this.client.unlock();
				
				
				}.bind(this), 2000);
		}
		
		
		if(dir == "prev"){
			w.legend.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.avatars.stateChange("exit_r");
			w.timeZone.stateChange("exit_r");
			w.timeZoneImg.stateChange("exit_r");
			w.timeZoneImgBg.stateChange("exit_r");
			
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.legend.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.steps.stateChange("exit_l");
		}.bind(this), 300);	
		
			w.steps.stateChange("exit_r");
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Hola, gracias por elegir Totalplay."});
				w.headerText.setData({"legend":"Prepárate para vivir una experiencia completamente diferente en tu tv. Día a día nos adaptamos al futuro de la televisión y trabajamos constantemente para ofrecerte las últimas tecnologías desarrolladas en el mundo digital. Esperamos que difrutes tu sistema tanto como nosotros disfrutamos desarrollándolo."});
				w.footerText.setData({"legend":"XoXo Totalplay."});
				
				var buttons = [
							{"id":"n","legend":"Siguiente","active":false}
						];
				w.buttons.setData(buttons);
		
				this.client.lock();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					//w.aliasInput.stateChange("enter");
					w.buttons.setFocus(true);
					this.actualFocus = "buttons";
					this.step = 1;
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				
				}.bind(this), 1000);
		}
	
}

setup.prototype.third = function third(dir){
	var w = this.widgets;
		if(dir == "next"){
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.aliasInput.stateChange("exit_l");
			w.steps.stateChange("exit_l");
			clearTimeout(this.timerLoadData);
			
				clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.avatars.setData();
			w.avatars.stateChange("exit_r");
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.steps.stateChange("exit_r");
		}.bind(this), 300);	
			
			
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Elige un avatar"});
				w.headerText.setData({"legend":"Escoge una imagen que defina tu personalidad."});
				w.footerText.setData({"legend":"<!i>Podrás cambiarlo después cuantas veces quieras."});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":false}
						];
				w.buttons.setData(buttons);
				this.getAvatars();
				//w.aliasInput.setData("OK para escribir alias");
				
				this.client.lock();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					this.actualFocus = "avatars";
					this.step = 4;
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				
				}.bind(this), 1000);
		}
		if(dir == "prev"){
			
				
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.avatars.stateChange("exit_r");
			w.aliasInput.stateChange("exit_r");
			w.leftArrow.stateChange("exit");
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.aliasInput.setData();
			w.steps.setData();
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.aliasInput.stateChange("exit_l");
			w.steps.stateChange("exit_l");
		}.bind(this), 300);	
			
			
			
			var state = w.rightArrow.stateGet();
				switch(state){
					case "enter_1":
						this.state = "exit_1";
					break;
					case "enter_2":
						this.state = "exit_2";
					break;
					case "enter_3":
						this.state = "exit_3";
					break;
				}
			w.rightArrow.stateChange(this.state);
			w.steps.stateChange("exit_r");
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Necesitarás un alias"});
				w.headerText.setData({"legend":"Escribe un nombre corto para identificarte dentro del sistema."});
				w.footerText.setData({"legend":"<!i>Máximo 20 caracteres. Podrás cambiarlo después cuantas veces quieras."});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":false}
						];
				w.buttons.setData(buttons);
				w.aliasInput.setData("OK para escribir alias");
				this.client.lock();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					w.aliasInput.stateChange("enter");
					w.buttons.setFocus(false);
					w.aliasInput.setFocus(true);
					this.actualFocus = "alias";
					this.step = 3;
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				
				}.bind(this), 1000);
			
		}	
	
}

setup.prototype.fourth = function fourth(dir){
	var w = this.widgets;
		if(dir == "next"){
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.avatars.stateChange("exit_l");
			w.steps.stateChange("exit_l");
			w.inputNip_1.stateChange("exit_l");
			w.inputNip_2.stateChange("exit_l");
			w.inputNip_3.stateChange("exit_l");
			w.inputNip_4.stateChange("exit_l");
			w.leftArrow.stateChange("exit");
			var state = w.rightArrow.stateGet();
				switch(state){
					case "enter_1":
						this.state = "exit_1";
					break;
					case "enter_2":
						this.state = "exit_2";
					break;
					case "enter_3":
						this.state = "exit_3";
					break;
				}
			w.rightArrow.stateChange(this.state);
			
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.inputNip_1.stateChange("exit_r");
			w.inputNip_2.stateChange("exit_r");
			w.inputNip_3.stateChange("exit_r");
			w.inputNip_4.stateChange("exit_r");
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.steps.stateChange("exit_r");
		}.bind(this), 300);	
			
			
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Define un NIP."});
				w.headerText.setData({"legend":"Escribe 4 dígitos que recuerdes fácilmente para autorizar compras y hacer cambios en el sistema."});
				w.footerText.setData({"legend":"<!i>Escribe con tu control remoto."});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":false}
						];
				w.buttons.setData(buttons);
		
				
				this.client.lock();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					w.inputNip_1.stateChange("enter");
					w.inputNip_2.stateChange("enter");
					w.inputNip_3.stateChange("enter");
					w.inputNip_4.stateChange("enter");
					this.actualFocus = "nip";
					this.step = 5;
					w.buttons.setFocus(false);
					this.setInputFocus(w.inputNip_1);
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				
				}.bind(this), 1000);
		}
	if(dir == "prev"){
			
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.inputNip_1.stateChange("exit_r");
			w.inputNip_2.stateChange("exit_r");
			w.inputNip_3.stateChange("exit_r");
			w.inputNip_4.stateChange("exit_r");
			w.steps.stateChange("exit_r");
			w.avatars.setData();
			w.avatars.stateChange("exit_r");
			
			this.avatar = "";
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.avatars.stateChange("exit_l");
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.steps.stateChange("exit_l");
		}.bind(this), 300);	
			
			
			
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Elige un avatar"});
				w.headerText.setData({"legend":"Escoge una imagen que defina tu personalidad."});
				w.footerText.setData({"legend":"<!i>Podrás cambiarlo después cuantas veces quieras."});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":false}
						];
				w.buttons.setData(buttons);
				
				this.client.lock();
					this.getAvatars();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					this.actualFocus = "avatars";
					this.step = 4;
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				
				}.bind(this), 1000);
		
	}
	
}

setup.prototype.fifth = function fifth(dir){
	var w = this.widgets;
		if(dir == "next"){
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.steps.stateChange("exit_l");
			w.inputNip_1.stateChange("exit_l");
			w.inputNip_2.stateChange("exit_l");
			w.inputNip_3.stateChange("exit_l");
			w.inputNip_4.stateChange("exit_l");
			w.questions.stateChange("exit_l");
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.questions.setData();
			w.questions.stateChange("exit_r");
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.steps.stateChange("exit_r");
		}.bind(this), 300);	
			
			
		clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Selecciona una pregunta secreta."});
				w.headerText.setData({"legend":"Con esta podrás recuperar contraseñas y hacer cambios en el sistema."});
				w.footerText.setData({"legend":"<!i>Podrás cambiarla después cuantas veces quieras."});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":false}
						];
				w.buttons.setData(buttons);
				
				this.client.lock();
					this.getQuestions();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					
					this.step = 6;
					this.actualFocus = "questions";
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				
				}.bind(this), 1000);
		}
	if(dir == "prev"){
			
		w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.questions.stateChange("exit_r");
			w.inputNip_1.stateChange("exit_r");
			w.inputNip_2.stateChange("exit_r");
			w.inputNip_3.stateChange("exit_r");
			w.inputNip_4.stateChange("exit_r");
			w.leftArrow.stateChange("exit");
			var state = w.rightArrow.stateGet();
				switch(state){
					case "enter_1":
						this.state = "exit_1";
					break;
					case "enter_2":
						this.state = "exit_2";
					break;
					case "enter_3":
						this.state = "exit_3";
					break;
				}
			w.rightArrow.stateChange(this.state);
			w.steps.stateChange("exit_r");
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.inputNip_1.stateChange("exit_l");
			w.inputNip_2.stateChange("exit_l");
			w.inputNip_3.stateChange("exit_l");
			w.inputNip_4.stateChange("exit_l");
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.steps.stateChange("exit_l");
		}.bind(this), 300);	
			
			
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Define un NIP."});
				w.headerText.setData({"legend":"Escribe 4 dígitos que recuerdes fácilmente para autorizar compras y hacer cambios en el sistema."});
				w.footerText.setData({"legend":"<!i>Escribe con tu control remoto."});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":false}
						];
				w.buttons.setData(buttons);
				this.client.lock();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					w.inputNip_1.stateChange("enter");
					w.inputNip_2.stateChange("enter");
					w.inputNip_3.stateChange("enter");
					w.inputNip_4.stateChange("enter");
					this.actualFocus = "nip";
					this.step = 5;
					w.buttons.setFocus(false);
					this.setInputFocus(w.inputNip_1);
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				
				}.bind(this), 1000);
	}	
	
}

setup.prototype.sixth = function sixth(dir){
	var w = this.widgets;
		if(dir == "next"){
						
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.steps.stateChange("exit_l");
			w.questions.stateChange("exit_l");
			w.leftArrow.stateChange("exit");
			w.mail.stateChange("exit_l");
			var state = w.rightArrow.stateGet();
				switch(state){
					case "enter_1":
						this.state = "exit_1";
					break;
					case "enter_2":
						this.state = "exit_2";
					break;
					case "enter_3":
						this.state = "exit_3";
					break;
				}
			w.rightArrow.stateChange(this.state);
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.mail.setData();
			w.mail.stateChange("exit_r");
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.steps.stateChange("exit_r");
		}.bind(this), 300);	
			
			
			
		clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Verifica tu e-mail."});
				w.headerText.setData({"legend":"Esta es la dirección de correo ligada a tu cuenta. Verifica que sea correcta:"});
				w.footerText.setData({"legend":"<!i>En caso de ser incorrecto comunícate al 1579-8000 para cambiarlo.<!>"});
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				var m = this.mail;
				if(m == ""){
					w.mail.setData("<!b>Por favor revisa tu e-mail en:<!>|<!b>Menú > Ajustes > Cuenta<!>");
				}
				else{
					w.mail.setData(this.mail);
				}
				
			//setTimeout(function(){		
				this.client.lock();
					//w.mailInput.stateChange("enter");
					//this.actualFocus = "";
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.mail.stateChange("enter");
					w.buttons.scrollNext();
					w.buttons.setFocus(true);
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					this.step = 7;
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
					this.actualFocus = "buttons";
				this.client.unlock();
			}.bind(this), 1000);
				
				//}.bind(this), 1000);
		}
		if(dir == "prev"){
			
			//NGM.trace("---entrooooo aqui");
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.mail.stateChange("exit_r");
			w.questions.stateChange("exit_r");
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.questions.setData();
			w.questions.stateChange("exit_l");
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.steps.stateChange("exit_l");
		}.bind(this), 300);	
			
			
			var state = w.rightArrow.stateGet();
				switch(state){
					case "enter_1":
						this.state = "exit_1";
					break;
					case "enter_2":
						this.state = "exit_2";
					break;
					case "enter_3":
						this.state = "exit_3";
					break;
				}
			w.rightArrow.stateChange(this.state);
			w.steps.stateChange("exit_r");
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Selecciona una pregunta secreta."});
				w.headerText.setData({"legend":"Con esta podrás recuperar contraseñas y hacer cambios en el sistema."});
				w.footerText.setData({"legend":"<!i>Podrás cambiarla después cuantas veces quieras."});
				
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":false}
						];
				w.buttons.setData(buttons);
				this.client.lock();
					this.getQuestions();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					
					this.step = 6;
					this.actualFocus = "questions";
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				
				}.bind(this), 1000);
			
			/*w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.steps.stateChange("exit_r");
			w.mail.stateChange("exit_r");
			w.ratings.stateChange("exit_r");
			w.leftArrowR.stateChange("exit");
			w.rightArrowR.stateChange("exit");
			
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.mail.stateChange("exit_l");
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.steps.stateChange("exit_l");
		}.bind(this), 300);	
			
			
			
			this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Verifica tu e-mail."});
				w.headerText.setData({"legend":"Esta es la dirección de correo ligada a tu cuenta. Verifica que sea correcta:"});
				w.footerText.setData({"legend":"<!i>En caso de ser incorrecto comunícate al 1579-8000 para cambiarlo.<!>"});
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				
				var m = this.mail;
				if(m == ""){
					w.mail.setData("<!b>Por favor revisa tu e-mail en:<!>|<!b>Menú > Ajustes > Cuenta<!>");
				}
				else{
					w.mail.setData(this.mail);
				}
				this.client.lock();
					this.actualFocus = "buttons";
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.mail.stateChange("enter");
					w.buttons.setFocus(true);
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					this.step = 7;
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				}.bind(this), 1000);*/
		
		}
	
}

setup.prototype.seventh = function seventh(dir){
	var w = this.widgets;
		if(dir == "next"){
			
			w.leftArrow.stateChange("exit");
			w.rightArrow.stateChange("exit");			
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.steps.stateChange("exit_l");
			w.mail.stateChange("exit_l");
			w.ratings.stateChange("exit_l");
			
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.ratings.setData();
			w.ratings.stateChange("exit_r");
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.steps.stateChange("exit_r");
		}.bind(this), 300);	
			
			
			
		clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Asígnale una clasificación a tu cuenta."});
				w.headerText.setData({"legend":"Bloquea automáticamente en tu cuenta los programas con clasificación mayor de: "});
				w.footerText.setData({"legend":"<!i>Podrás cambiar tu clasificación después con tu NIP."});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Crear cuenta","active":false}
						];
				var ratings = [
							{"id":"AA","text":"AA","badge":"img/tv/ratings/AA.png","active":false},
							{"id":"A","text":"A","badge":"img/tv/ratings/A.png","active":false},
							{"id":"B","text":"B","badge":"img/tv/ratings/B.png","active":false},
							{"id":"B-15","text":"B-15","badge":"img/tv/ratings/B-15.png","active":false},
							{"id":"C","text":"C","badge":"img/tv/ratings/C.png","active":false},
							{"id":"D","text":"D","badge":"img/tv/ratings/D.png","active":false}
						];		
				w.ratings.setData(ratings);	
				w.buttons.setData(buttons);
				
				
				w.leftArrowR.setData({"url": "" ,"line": false, "position": "left"});
				w.leftArrowR.stateChange("enter");	
				w.rightArrowR.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
				w.rightArrowR.stateChange("enter");
								
				this.client.lock();
					w.ratings.stateChange("enter");
					this.actualFocus = "ratings";
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.buttons.setFocus(false);
					w.ratings.setFocus(true);
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					this.step = 8;
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				
				}.bind(this), 1000);
		}
		
		if(dir == "prev"){

			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.steps.stateChange("exit_r");
			w.mail.stateChange("exit_r");
			w.ratings.stateChange("exit_r");
			w.leftArrowR.stateChange("exit");
			w.rightArrowR.stateChange("exit");
			
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.mail.stateChange("exit_l");
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.footerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.steps.stateChange("exit_l");
		}.bind(this), 300);	
			
			
			
			this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"Verifica tu e-mail."});
				w.headerText.setData({"legend":"Esta es la dirección de correo ligada a tu cuenta. Verifica que sea correcta:"});
				w.footerText.setData({"legend":"<!i>En caso de ser incorrecto comunícate al 1579-8000 para cambiarlo.<!>"});
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				
				var m = this.mail;
				if(m == ""){
					w.mail.setData("<!b>Por favor revisa tu e-mail en:<!>|<!b>Menú > Ajustes > Cuenta<!>");
				}
				else{
					w.mail.setData(this.mail);
				}
				this.client.lock();
					this.actualFocus = "buttons";
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.mail.stateChange("enter");
					w.buttons.setFocus(true);
					w.headerText.stateChange("enter");
					w.footerText.stateChange("enter");
					this.step = 7;
					w.steps.setData({"step":this.step,"total":this.totalSteps});
					w.steps.stateChange("enter");
				this.client.unlock();
				
				}.bind(this), 1000);
		
		}
		
	
}

setup.prototype.eighth = function eighth (){
	var w = this.widgets;
	
	w.legend.stateChange("exit_l");
	w.headerText.stateChange("exit_l");
	w.footerText.stateChange("exit_l");
	w.buttons.stateChange("exit_l");
	w.line.stateChange("exit_l");
	w.steps.stateChange("exit_l");
	w.ratings.stateChange("exit_l");
	w.leftArrowR.stateChange("exit");
	w.rightArrowR.stateChange("exit");
	
	clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.steps.stateChange("exit_r");
		}.bind(this), 300);	
		
	clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){	
	w.legend.setData({"legend":"Graba tus programas favoritos con Anytimetv."});
	w.headerText.setData({"legend":"Tu cuenta ha sido creada. Te recomendamos grabar el contenido más visto en Totalplay"});
	w.footerText.setData({"legend":"<!i>Recuerda que puedes grabar programas desde las opciones al presionar OK sobre una señal."});
	var buttons = [
							{"id":"n","legend":"Ir a la TV","active":true}/*,
							{"id":"p","legend":"Ver tutorial","active":true}*/
				  ];
	this.getPrograms();
	//w.buttons.setData();
	//w.buttons.stateChange("exit");			  
	w.buttons.setData(buttons);
	w.buttons.stateChange("enter");
	w.legend.stateChange("enter");
	w.headerText.stateChange("enter");
	w.footerText.stateChange("enter");
	w.line.stateChange("enter");
	
	this.actualFocus = "programs";
	this.step = 9;
	}.bind(this), 1000);
}
/*
setup.prototype.ninth = function ninth (){
	var w = this.widgets;
	
	w.legend.stateChange("exit_l");
	w.headerText.stateChange("exit_l");
	w.footerText.stateChange("exit_l");
	w.buttons.stateChange("exit_l");
	w.line.stateChange("exit_l");
	w.steps.stateChange("exit_l");
	w.ratings.stateChange("exit_l");
	w.leftArrowR.stateChange("exit");
	w.rightArrowR.stateChange("exit");
	
	clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.footerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.steps.setData();
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.footerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.steps.stateChange("exit_r");
		}.bind(this), 300);	
		
	clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){	
	w.legend.setData({"legend":"Cuenta creada."});
	w.headerText.setData({"legend":"¡Disfruta de tu nuevo sistema!"});
	var buttons = [
							{"id":"n","legend":"Ir a la TV","active":true}
				  ];
	w.buttons.setData();
	w.buttons.stateChange("exit_last");			  
	w.buttons.setData(buttons);
	w.buttons.stateChange("enter_last");
	w.legend.stateChange("enter");
	w.headerText.stateChange("enter");
	
	this.actualFocus = "buttons";
	this.step = 8;
	}.bind(this), 1000);
}*/

setup.prototype.getAvatars = function getAvatars(){
	getServices.getSingleton().call("ADMIN_GET_AVATARS", ,this.responseGetAvatars.bind(this));
}

setup.prototype.getQuestions = function getQuestions(){
	getServices.getSingleton().call("ADMIN_GET_QUESTIONS", ,this.responseGetQuestions.bind(this));
}

setup.prototype.getMail = function getMail(){
	getServices.getSingleton().call("ADMIN_GET_MAIL", ,this.responseGetMail.bind(this),null, null, null);
}

setup.prototype.getPrograms = function getPrograms(){
	getServices.getSingleton().call("EPG_GET_PROGRAMS", ,this.responseGetPrograms.bind(this));
}

setup.prototype.sendData = function sendData(){
	if(this.mail == ""){
		this.mail = "ejemplo@mail.com";
	}
	 var ciphertext = encryptByDES(this.nipFinal, tpng.stb.keyNip);
	var params = ["&rating="+this.rating+"&cavId="+this.avatar+"&alias="+this.alias+"&passwd="+ciphertext+"&mail="+this.mail+"&idQuestion="+this.question+"&answer="+this.answer+"&mac="+tpng.backend.mac_address];	
	getServices.getSingleton().call("ADMIN_NEW_ROOT",params,this.responseSendData.bind(this));
}

setup.prototype.tutorial = function tutorial(){
		this.home.hideBg();
		this.home.hideHeader();
		this.home.closeSection(this);
		this.home.onEnter();
}

setup.prototype.setPrograms = function setPrograms(programs){
	var program = "";
	for(var i = 0; i < programs.length; i++){
		if(i == 0){
			program = programs[i].id;
		}
		else{
			program = program + "," + programs[i].id; 
		}
	}
	if(program == ""){
		this.home.hideBg();
		this.home.hideHeader();
		this.home.closeSection(this);
		this.home.onEnter();
	}
	else{
		var params = ["ccaIds="+program]
		getServices.getSingleton().call("EPG_SET_PROGRAMS",params,this.responseSetPrograms.bind(this));
	}
}

setup.prototype.responseSetPrograms = function responseSetPrograms(response){
	//poner servicio de setear programas aquí
	this.home.hideBg();
	this.home.hideHeader();
	this.home.closeSection(this);
	this.home.onEnter();
}


setup.prototype.responseGetPrograms = function responseGetPrograms(response){
	if(response.status == 200){
		var programs = response.data.ResponseVO.arrayCca;
		this.items = [];
		var w = this.widgets;
		
				if(programs.length >0){ 
					for(var i = 0; i<programs.length; i++){
						this.items.push({"id":programs[i].CcaVO.ccaId,"text": programs[i].CcaVO.name,"badge":"","url3x3":programs[i].CcaVO.images.url3X3,"active":false,"showtitle":programs[i].CcaVO.showTittle})
					}
					w.leftArrowP.setData({"url": "" ,"line": false, "position": "left"});
					w.programs.setData(this.items);
					w.leftArrowP.stateChange("enter");	
					w.programs.stateChange("enter");
					w.programs.setFocus(true);
					w.buttons.setFocus(false);
						if(this.items.length > 3){
							this.state = "exit_3";
							w.rightArrowP.setData({"url":"", "line": false, "position": "right"});
							w.rightArrowP.stateChange(this.state);
							this.state = "enter_3";
							w.rightArrowP.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
							w.rightArrowP.stateChange(this.state);
						}else{
							this.state = "exit_"+this.items.length;
							w.rightArrowP.setData({"url":"", "line": false, "position": "right"});
							w.rightArrowP.stateChange(this.state);
						    this.state = "enter_"+this.items.length;
						    w.rightArrowP.setData({"url":"", "line": false, "position": "right"});
						    w.rightArrowP.stateChange(this.state);
						}
			}
			else{
				this.home.openSection("miniError", {"home": this.home,"code":response.status}, false,,true);		
			}				
	}else if(response.error){	
				this.home.openSection("miniError", {"home": this.home,"code":response.status}, false,,true);
	}

}

setup.prototype.responseSendData = function responseSendData(response){
var w = this.widgets;
	if(response.status == 200){
		//this.idUser = 
		this.eighth(); 
	}
	else{
		this.home.openSection("miniError", {"home": this.home,"code":response.status}, false,,true);
	}
}

setup.prototype.responseGetMail = function responseGetMail(response){
	var w = this.widgets;
	if(response.status == 200){
			var mail = response.data.ResponseVO.email;
			if(mail){
				this.mail = mail;
			}
			else{
				this.mail = "";
			}
			
			if(response.data.ResponseVO.message != "No existe la cuenta en BRM" && mail){
				/*w.mailInput.setData(mail);
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				this.actualFocus = "mail";
				w.buttons.setFocus(false);*/
			}else{
				this.mail = "";
				/*w.mailInput.setData("OK para escribir correo");
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":false}
						];
				w.buttons.setData(buttons);
				this.actualFocus = "mail";
				w.buttons.setFocus(false);*/				
			}	
	}
	else{
		this.mail = "";
		/*this.mail = "";
		w.mailInput.setData("OK para escribir correo");
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":false}
						];
				w.buttons.setData(buttons);
				this.actualFocus = "mail";
				w.buttons.setFocus(false);*/		
	}
}

setup.prototype.responseGetAvatars = function responseGetAvatars(response){
	if(response.status == 200){
		var avatars = response.data.ResponseVO.avatars;
		this.items = [];
		var w = this.widgets;
		
				if(avatars.length >0){ 
					for(var i = 0; i<avatars.length; i++){
						this.items.push({"id":avatars[i].AvatarVO.cavId,"text": avatars[i].AvatarVO.alias,"badge":"img/admin/avatar/1x1-avatar.png","url1X1A":avatars[i].AvatarVO.images.url1X1A,"urlL":avatars[i].AvatarVO.images.urlL,"url3X5A":avatars[i].AvatarVO.images.url3X5A,"active":false})
					}
					w.leftArrow.setData({"url": "" ,"line": false, "position": "left"});
					w.avatars.setData(this.items);
					w.leftArrow.stateChange("enter");	
					w.avatars.stateChange("enter");
					w.avatars.setFocus(true);
					w.buttons.setFocus(false);
						if(this.items.length > 3){
							this.state = "exit_3";
							w.rightArrow.setData({"url":"", "line": false, "position": "right"});
							w.rightArrow.stateChange(this.state);
							this.state = "enter_3";
							w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
							w.rightArrow.stateChange(this.state);
						}else{
							this.state = "exit_"+this.items.length;
							w.rightArrow.setData({"url":"", "line": false, "position": "right"});
							w.rightArrow.stateChange(this.state);
						    this.state = "enter_"+this.items.length;
						    w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						    w.rightArrow.stateChange(this.state);
						}
			}
			else{
				this.home.openSection("miniError", {"home": this.home,"code":response.status}, false,,true);		
			}				
	}else if(response.error){	
				this.home.openSection("miniError", {"home": this.home,"code":response.status}, false,,true);
	}
}

setup.prototype.responseGetQuestions = function responseGetQuestions(response){
	if(response.status == 200){
		var forgot = response.data.ResponseVO.arrayQuestions;
		this.items = [];
		var w = this.widgets;
		
			if(forgot.length >0){ 
				for(var i = 0; i<forgot.length; i++){
					this.items.push({"id":forgot[i].QuestionVO.cquId,"text": forgot[i].QuestionVO.question,"used":forgot[i].QuestionVO.used})
				}
				w.leftArrow.setData({"url": "" ,"line": false, "position": "left"});
				w.questions.setData(this.items);
				w.leftArrow.stateChange("enter");	
				w.questions.stateChange("enter");
				w.questions.setFocus(true);
				w.buttons.setFocus(false);
					if(this.items.length > 3){
						this.state = "exit_3";
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
						this.state = "enter_3";
						w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
					}else{
						this.state = "exit_"+this.items.length;
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
					    this.state = "enter_"+this.items.length;
					    w.rightArrow.setData({"url":"", "line": false, "position": "right"});
					    w.rightArrow.stateChange(this.state);
					}
		}
		else{
			this.home.openSection("miniError", {"home": this.home, "title": gettext("ERROR_TITLE"),"code":response.data.ResponseVO.status}, false);	
		}
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "title": gettext("ERROR_TITLE"),"code":response.data.ResponseVO.status}, false);	
	}		
}

setup.onFocusTimeZone = function onFocusTimeZone(_focus, _data){
	if(_focus && this.actualFocus == "buttons"){
		this.widgets.timeZone.setFocus(false);
		
	}


}

setup.prototype.onKeyPress = function onKeyPress(_key){
	switch(this.actualFocus){		
		case "buttons":
			this.onKeyPressButtons(_key);
		break;
		case "timeZone":
			this.onKeyPressTimeZone(_key);
		break;
		case "alias":
			this.onKeyPressInput(_key);
		break;
		
		case "avatars":
			this.onKeyPressAvatars(_key);
		break;
		
		case "nip":
			this.onKeyPressNip(_key);
		break;
		
		case "questions":
			this.onKeyPressQuestions(_key);
		break;
		
		case "mail":
			this.onKeyPressMail(_key);
		break;
		
		case "ratings":
			this.onKeyPressRatings(_key);
		break;
		
		case "programs":
			this.onKeyPressPrograms(_key);
		break;
		
	}	
	return true;
}
		
		
setup.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
	var w = this.widgets;
	switch(_key){	
		case "KEY_UP":
				switch(this.step){
					case 1:
					break;
					
					case 2:
						this.actualFocus = "timeZone";
						w.timeZone.setFocus(true);
						w.buttons.setFocus(false);
						
					break;
					
					
					case 3:
						w.aliasInput.setFocus(true);
						w.buttons.setFocus(false);
						this.actualFocus = "alias";
					break;
					
					case 4:
						w.avatars.setFocus(true);
						w.buttons.setFocus(false);
						this.actualFocus = "avatars";
					break;
					
					case 5:
					if(w.check.stateGet() == "enter"){
					}
					else{
							this.actualFocus = "nip";
							this.setInputFocus(this._lastFocusedInput);
							this._lastFocusedInput.setFocus(true);
							w.buttons.setFocus(false);
						}
					break;
					
					case 6:
						w.questions.setFocus(true);
						w.buttons.setFocus(false);
						this.actualFocus = "questions";
					break;
					
					case 6:
						//w.mailInput.setFocus(true);
						//w.buttons.setFocus(false);
						//this.actualFocus = "mail";
					break;
					
					case 7:
						//w.ratings.setFocus(true);
						//w.buttons.setFocus(false);
						//this.actualFocus = "ratings";
					break;
					
					case 8:
						//NGM.trace("-------------------->")
						w.ratings.setFocus(true);
						w.buttons.setFocus(false);
						this.actualFocus = "ratings";
					break;
					
				}
		break;
			
		case "KEY_RIGHT":
			w.buttons.scrollNext();
		break;
		
		case "KEY_LEFT":
			w.buttons.scrollPrev();
		break;
		
		case "KEY_IRENTER":
			switch(w.buttons.selectItem.id){
					case "n":
						switch(this.step){
							case 1:
								this.second_1("next");
							break;
							case 2:
								this.second("next");
							break;
							case 3:
								if(this.alias != undefined && this.alias != "" && this.alias.length >= 4){
									this.third("next");
								}else{
									
								}
							break;
							
							case 4:
								if(this.avatar!= undefined && this.avatar != ""){
									this.fourth("next");	
								}
							break;
							
							case 5:
								if(this.nipFinal != undefined && this.nipFinal != ""){
									w.check.stateChange("exit");
									this.fifth("next");
								}
							break;
							
							case 6:
								if(this.question!= undefined && this.question != "" && this.answer != undefined && this.answer != ""){	
									this.sixth("next");
								}
							break;
							
							case 7:
								if(this.mail!= undefined){	
									this.seventh("next");
								}
							break;	
							
							case 8:
								if(this.rating!= undefined && this.rating != ""){
									this.sendData();
									//this.eighth();
								}
							break;	
							
							case 9:
								this.programs = [];
								for(var i = 0; i< w.programs.list.length; i++){
									if(w.programs.list[i].active){
										this.programs.push(w.programs.list[i]);
									}
									
								}
								this.setPrograms(this.programs);
							break;
						
						}
					break;
					
					case "p":
						switch(this.step){
							case 1:
								
							break;
							case 2:
								//NGM.trace("-------->");
								this.second_1("prev");
								
							break;
							case 3:
								this.alias = "";
								this.second("prev");
							break;
							
							case 4:
								this.alias = "";
								for(var i = 0; i< w.avatars.list.length; i++){
									if(w.avatars.list[i].active){
										w.avatars.list[i].active = false;
									}
								}
								this.avatar = "";
								//this.second("prev");
								this.third("prev");
							break;
							
							case 5:
								this.nipFinal = "";
								this.nip1 = "";
								this.nip2 = "";
								w.inputNip_1.setData();
								w.inputNip_2.setData();
								w.inputNip_3.setData();
								w.inputNip_4.setData();
								if(w.nipMessageSub.stateGet() == "enter"){
									w.nipMessageSub.stateChange("exit");
								}
								if(w.check.stateGet() == "enter"){
									w.check.stateChange("exit");
								}
								//this.third("prev");
								this.fourth("prev");
							break;
							
							case 6:
								this.nipFinal = "";
								this.nip1 = "";
								this.nip2 = "";
								this.answer = "";
								this.question = "";
								w.inputNip_1.setData();
								w.inputNip_2.setData();
								w.inputNip_3.setData();
								w.inputNip_4.setData();
								if(w.nipMessageSub.stateGet() == "enter"){
									w.nipMessageSub.stateChange("exit");
								}
								if(w.check.stateGet() == "enter"){
									w.check.stateChange("exit");
								}
								//this.fourth("prev");
								this.fifth("prev");
							break;
							
							case 7:
								//this.mail = "";
								this.answer = "";
								this.question = "";
								//this.fifth("prev");
								this.sixth("prev");
							break;
							
							case 8:
								//this.mail = "";
								this.rating = "";
								//w.mailInput.setData();
								this.seventh("prev");
								
							break;
							
							case 9:
								//this.tutorial();
							break;
						
						}
					break;
				
				}
		break;

	}	
	return true;
}
setup.prototype.onKeyPressTimeZone = function onKeyPressTimeZone(_key){
	var w = this.widgets;

	switch(_key){
	
		case "KEY_DOWN":
		if(!w.timeZone.scrollNext()){
			this.actualFocus = "buttons";
			w.timeZone.setFocus(false);
			w.buttons.setFocus(true);
			
			
		}else{
			w.timeZoneImg.setDataAnimated({"logo":w.timeZone.selectItem.url},"exit", "enter");
			//w.timeZoneImg.setData({"logo":w.timeZone.selectItem.url});
			//w.timeZoneImg.refresh();
		}
		break;
		case "KEY_UP":
			if(w.timeZone.scrollPrev()){
				w.timeZoneImg.setDataAnimated({"logo":w.timeZone.selectItem.url},"exit", "enter");
				//w.timeZoneImg.setData({"logo":w.timeZone.selectItem.url});
				//w.timeZoneImg.refresh();
			}
		break;		
		
		case "KEY_IRENTER":
			for(var i = 0; i < w.timeZone.maxItem; i++){
				w.timeZone.list[i].selected = false;
				
			}
			w.timeZone.selectItem.selected = true;
			w.timeZone.refresh();
			
			settings.set("options.tzoffset",w.timeZone.selectItem.id);
			
		break;

	}	
	return true;
}
setup.prototype.onKeyPressInput = function onKeyPressInput(_key){
	var w = this.widgets,
		input = w.aliasInput;
	/*if(input.isFocused()){
        	
        	var keyHandled = input.keyHandler(_key);  
        	   
        	if (keyHandled == true){	
				return true;	
        	}
	}*/
	switch(_key){
	
		case "KEY_DOWN":
			w.aliasInput.setFocus(false);
			w.buttons.setFocus(true);
			this.actualFocus = "buttons";
		break;		
		
		case "KEY_IRENTER":
				w.aliasInput.setData("OK para escribir alias");
				w.buttons.list[1].active = false;
				w.buttons.refresh();	
				this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu alias: ","text2":"No has ingresado alias o el formato es inválido, ingresa uno válido.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":true}, true,,true);	
		break;

	}	
	return true;
}
setup.prototype.onKeyPressAvatars = function onKeyPressAvatars(_key){
var w = this.widgets;	
	switch(_key){
	case "KEY_DOWN":
			w.avatars.setFocus(false);
			w.buttons.setFocus(true);
			this.actualFocus = "buttons";
	break;
	
	case "KEY_LEFT":
		case "KEY_RIGHT":			
			_key == "KEY_LEFT"
			if(_key == "KEY_LEFT"){
				if(w.avatars.scrollPrev()){
					if(w.avatars.maxItem > 6){		
								if(w.avatars.selectIndex >= 3){
									w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
									w.leftArrow.stateChange("enter");
								}
								if(w.avatars.selectIndex == (w.avatars.maxItem-1)){
									w.rightArrow.setData({"url": "" ,"line":false, "position": "right"});
									w.rightArrow.stateChange(this.state);
								}
								if(w.avatars.selectIndex == 0){
									w.leftArrow.setData({"url":"", "line":false, "position": "left"});
									w.leftArrow.stateChange("enter");
								}
								if(w.avatars.selectIndex+1 <= w.avatars.maxItem-3){
									w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
									w.rightArrow.stateChange(this.state);
								}
					}
				}
			}
			else{
				if(w.avatars.scrollNext()){
					if(w.avatars.maxItem > 3){		
								if(w.avatars.selectIndex >= 3){
									w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
									w.leftArrow.stateChange("enter");
								}
								if(w.avatars.selectIndex == (w.avatars.maxItem-1)){
									w.rightArrow.setData({"url": "" ,"line":false, "position": "right"});
									w.rightArrow.stateChange(this.state);
								}
								if(w.avatars.selectIndex == 0){
									w.leftArrow.setData({"url":"", "line":false, "position": "left"});
									w.leftArrow.stateChange("enter");
								}
								if(w.avatars.selectIndex < 4 && w.avatars.maxItem-3){
									w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
									w.rightArrow.stateChange(this.state);
								}	
					}
				}
			}	
		break;
		
		case "KEY_IRENTER":
				for(var i = 0; i< w.avatars.list.length; i++){
					if(w.avatars.list[i].active){
						w.avatars.list[i].active = false;
					}
				}
				w.avatars.selectItem.active = true;			
				w.avatars.refresh();
				this.avatar = w.avatars.selectItem.id;
				w.buttons.list[1].active = true;
				w.avatars.setFocus(false);
				if(w.buttons.selectIndex == 1){
					w.buttons.setFocus(true);
				}
				else{
					w.buttons.scrollNext();
				}	
				this.actualFocus = "buttons";
				w.buttons.refresh();
				
		break;
		
	}

}

setup.prototype.onKeyPressNip = function onKeyPressNip(_key){
	var widgets = this.widgets,
	lastInput = this._lastFocusedInput,
	list = this.widgets.list;
   	
   	 switch (_key) {    	
 		
 		case "KEY_DOWN":
 				if(this._lastFocusedInput.focusEnable){
 						this.actualFocus = "buttons";
						widgets.buttons.setFocus(true);
						this.setInputFocus(this._lastFocusedInput);
						this._lastFocusedInput.setFocus(false);
					}
					else{
					}
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

setup.prototype.onKeyPressQuestions = function onKeyPressQuestions(_key){
var w = this.widgets;	
	switch(_key){
	case "KEY_DOWN":
			w.questions.setFocus(false);
			w.buttons.setFocus(true);
			this.actualFocus = "buttons";
	break;
	
	case "KEY_LEFT":
		case "KEY_RIGHT":			
			_key == "KEY_LEFT"
			if(_key == "KEY_LEFT"){
				if(w.questions.scrollPrev()){
					if(w.questions.maxItem > 6){		
								if(w.questions.selectIndex >= 3){
									w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
									w.leftArrow.stateChange("enter");
								}
								if(w.questions.selectIndex == (w.questions.maxItem-1)){
									w.rightArrow.setData({"url": "" ,"line":false, "position": "right"});
									w.rightArrow.stateChange(this.state);
								}
								if(w.questions.selectIndex == 0){
									w.leftArrow.setData({"url":"", "line":false, "position": "left"});
									w.leftArrow.stateChange("enter");
								}
								if(w.questions.selectIndex+1 <= w.questions.maxItem-3){
									w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
									w.rightArrow.stateChange(this.state);
								}
					}
				}
			}
			else{
				if(w.questions.scrollNext()){
					if(w.questions.maxItem > 3){		
								if(w.questions.selectIndex >= 3){
									w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
									w.leftArrow.stateChange("enter");
								}
								if(w.questions.selectIndex == (w.questions.maxItem-1)){
									w.rightArrow.setData({"url": "" ,"line":false, "position": "right"});
									w.rightArrow.stateChange(this.state);
								}
								if(w.questions.selectIndex == 0){
									w.leftArrow.setData({"url":"", "line":false, "position": "left"});
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
			if(w.buttons.list[1].active){
				w.buttons.list[1].active = false;
				w.buttons.refresh();
			}
				
				for(var i = 0; i< w.questions.list.length; i++){
					if(w.questions.list[i].active){
						w.questions.list[i].active = false;
					}
				}
				w.questions.refresh();
			
				this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu respuesta: ","text2":"No has ingresado una respuesta.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":true}, true,,true);	
		break;
		
	}

}
/*
setup.prototype.onKeyPressMail = function onKeyPressMail(_key){
	var w = this.widgets,
		input = w.aliasInput;
	/*if(input.isFocused()){
        	
        	var keyHandled = input.keyHandler(_key);  
        	   
        	if (keyHandled == true){	
				return true;	
        	}
	}
	switch(_key){
	
		case "KEY_DOWN":
			//w.mailInput.setFocus(false);
			w.buttons.setFocus(true);
			this.actualFocus = "buttons";
		break;		
		
		case "KEY_IRENTER":
				if(w.buttons.list[1].active){
					w.buttons.list[1].active = false;
					w.buttons.refresh();
				}
				this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu mail: ","text2":"No has ingresado mail o el formato es inválido, ingresa uno válido.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":true}, true,,true);	
		break;

	}	
	return true;
}
*/

setup.prototype.onKeyPressRatings = function onKeyPressRatings(_key){
var w = this.widgets;	
	switch(_key){
	case "KEY_DOWN":
			w.ratings.setFocus(false);
			w.buttons.setFocus(true);
			this.actualFocus = "buttons";
	break;
	
	case "KEY_LEFT":
		case "KEY_RIGHT":			
			_key == "KEY_LEFT"
			if(_key == "KEY_LEFT"){
				if(w.ratings.scrollPrev()){
					if(w.ratings.maxItem > 4){		
								if(w.ratings.selectIndex >= 4){
									w.leftArrowR.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
									w.leftArrowR.stateChange("enter");
								}
								if(w.ratings.selectIndex == (w.ratings.maxItem-1)){
									w.rightArrowR.setData({"url": "" ,"line":false, "position": "right"});
									w.rightArrowR.stateChange(this.state);
								}
								if(w.ratings.selectIndex == 0){
									w.leftArrowR.setData({"url":"", "line":false, "position": "left"});
									w.leftArrowR.stateChange("enter");
								}
								if(w.ratings.selectIndex+1 <= w.ratings.maxItem-4){
									w.rightArrowR.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
									w.rightArrowR.stateChange(this.state);
								}
					}
				}
			}
			else{
				if(w.ratings.scrollNext()){
					if(w.ratings.maxItem > 4){		
								if(w.ratings.selectIndex >= 4){
									w.leftArrowR.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
									w.leftArrowR.stateChange("enter");
								}
								if(w.ratings.selectIndex == (w.ratings.maxItem-1)){
									w.rightArrowR.setData({"url": "" ,"line":false, "position": "right"});
									w.rightArrowR.stateChange(this.state);
								}
								if(w.ratings.selectIndex == 0){
									w.leftArrowR.setData({"url":"", "line":false, "position": "left"});
									w.leftArrowR.stateChange("enter");
								}
								if(w.ratings.selectIndex < 4 && w.ratings.maxItem-4){
									w.rightArrowR.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
									w.rightArrowR.stateChange(this.state);
								}	
					}
				}
			}	
		break;
		
		case "KEY_IRENTER":
				for(var i = 0; i< w.ratings.list.length; i++){
					if(w.ratings.list[i].active){
						w.ratings.list[i].active = false;
					}
				}
				w.ratings.selectItem.active = true;			
				w.ratings.refresh();
				this.rating = w.ratings.selectItem.id;
				w.buttons.list[1].active = true;
				if(w.buttons.selectIndex == 1){
					w.buttons.setFocus(true);
				}
				else{
					w.buttons.scrollNext();
				}
				w.ratings.setFocus(false);	
				w.buttons.refresh();
				this.actualFocus = "buttons";
		break;
		
	}

}

setup.prototype.onKeyPressPrograms = function onKeyPressPrograms(_key){
var w = this.widgets;	
	switch(_key){
	case "KEY_DOWN":
			w.programs.setFocus(false);
			w.buttons.setFocus(true);
			this.actualFocus = "buttons";
	break;
	
	case "KEY_LEFT":
		case "KEY_RIGHT":			
			_key == "KEY_LEFT"
			if(_key == "KEY_LEFT"){
				if(w.programs.scrollPrev()){
					if(w.programs.maxItem > 6){		
								if(w.programs.selectIndex >= 3){
									w.leftArrowP.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
									w.leftArrowP.stateChange("enter");
								}
								if(w.programs.selectIndex == (w.programs.maxItem-1)){
									w.rightArrowP.setData({"url": "" ,"line":false, "position": "right"});
									w.rightArrowP.stateChange(this.state);
								}
								if(w.programs.selectIndex == 0){
									w.leftArrowP.setData({"url":"", "line":false, "position": "left"});
									w.leftArrowP.stateChange("enter");
								}
								if(w.programs.selectIndex+1 <= w.programs.maxItem-3){
									w.rightArrowP.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
									w.rightArrowP.stateChange(this.state);
								}
					}
				}
			}
			else{
				if(w.programs.scrollNext()){
					if(w.programs.maxItem > 3){		
								if(w.programs.selectIndex >= 3){
									w.leftArrowP.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
									w.leftArrowP.stateChange("enter");
								}
								if(w.programs.selectIndex == (w.programs.maxItem-1)){
									w.rightArrowP.setData({"url": "" ,"line":false, "position": "right"});
									w.rightArrowP.stateChange(this.state);
								}
								if(w.programs.selectIndex == 0){
									w.leftArrowP.setData({"url":"", "line":false, "position": "left"});
									w.leftArrowP.stateChange("enter");
								}
								if(w.programs.selectIndex < 4 && w.programs.maxItem-3){
									w.rightArrowP.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
									w.rightArrowP.stateChange(this.state);
								}	
					}
				}
			}	
		break;
		
		case "KEY_IRENTER":
				if(!w.programs.selectItem.active){
					w.programs.selectItem.active = true;
					w.programs.refresh();
				}	
				else{
					w.programs.selectItem.active = false;
					w.programs.refresh();
				}		
		break;
		
	}

}



setup.prototype.setAlias = function setAlias(alias){

var w = this.widgets;
	
		var nochars =[":"," ",";",",","!","?","¿","¡","@"];
		var flag = 0;
	
	if(alias.length >= 4){
			var a = alias.split("");
		for(var i = 0; i< a.length; i++){
					for(var k = 0; k < nochars.length; k++){
						if(a[i] == nochars[k]){
							flag = 1;
							break;
						}
					}
		}
		if(flag == 1){
			this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu alias: ","text2":"El alias sólo puede contener letras, números o los caracteres '.','-','_'","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, true,,true);
		}else if(alias.length > 20){
			this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu alias: ","text2":"El alias debe ser de 20 o menos caracteres","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, true,,true);
		}
		else{
			this.alias = alias;	
			w.aliasInput.setData(alias);
			w.buttons.list[1].active = true;
			w.aliasInput.setFocus(false);
			if(w.buttons.selectIndex == 1){
				w.buttons.setFocus(true);
			}
			else{
				w.buttons.scrollNext();
			}	
			this.actualFocus = "buttons";
			w.buttons.refresh();
		}	
	}
	else{
		//this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu alias: ","text2":"El alias debe ser mayor a 4 caracteres.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, true,,true);	
	}
}

setup.prototype.setQuestion = function setQuestion(answer){
	var w = this.widgets; 
		w.questions.selectItem.active = true;			
		w.questions.refresh();
		this.question = w.questions.selectItem.id;
		this.answer = answer;
		w.buttons.setFocus(true);
		w.questions.setFocus(false);
		w.buttons.list[1].active = true;
		if(w.buttons.selectIndex == 1){
				w.buttons.setFocus(true);
			}
			else{
				w.buttons.scrollNext();
			}	
		w.buttons.scrollNext();
		w.buttons.refresh();
		this.actualFocus = "buttons";
	
	
}

setup.prototype.setMail = function setMail(mail){
	var w = this.widgets; 
	this.mail = mail;
	w.mailInput.setData(mail);
	w.mailInput.setFocus(false);
	w.buttons.list[1].active = true;
	if(w.buttons.selectIndex == 1){
				w.buttons.setFocus(true);
			}
			else{
				w.buttons.scrollNext();
			}	
	w.buttons.refresh();
	this.actualFocus = "buttons";
	
	
}


setup.prototype.enterInputs = function enterInputs(_data){

	var exit = "exit_"+_data;
	var enter = "enter_"+_data;
	
	var widgets = this.widgets,
		nipInput_1 = widgets.inputNip_1,
		nipInput_2 = widgets.inputNip_2,
		nipInput_3 = widgets.inputNip_3,
		nipInput_4 = widgets.inputNip_4;

	
			
	this.client.lock();
		nipInput_1.stateChange(exit);
		nipInput_2.stateChange(exit);
		nipInput_3.stateChange(exit);
		nipInput_4.stateChange(exit);
		nipInput_1.setData();
		nipInput_2.setData();		
		nipInput_3.setData();
		nipInput_4.setData();
		nipInput_1.stateChange(enter);
		nipInput_2.stateChange(enter);
		nipInput_3.stateChange(enter);
		nipInput_4.stateChange(enter);
	this.client.unlock();
	
	this.focus = "nip";
	this.setInputFocus(nipInput_1);
	
}

setup.prototype.setInputFocus = function setInputFocus (newInput){
    var widgets = this.widgets,
        oldInput = this._lastFocusedInput;
      
    if (newInput == oldInput && this.actualFocus == "nip") {
    	oldInput.setFocus(true);
    }
    if (newInput == oldInput && this.actualFocus == "buttons") {
    	oldInput.setFocus(true);
    	newInput.setFocus(false);
    }
    
    if (newInput != oldInput) {
    	if(oldInput){
        	oldInput.setFocus(false);
        }
        if(newInput){
        	newInput.setFocus(true);
        }
    }    
   /* if (newInput){
    	newInput.setFocus(true);	
    }*/
    this._lastFocusedInput = newInput;
	
}

setup.prototype.nextInput = function nextInput(){
    var widgets = this.widgets,
        input_1 = widgets.inputNip_1,
        input_2 = widgets.inputNip_2,
        input_3 = widgets.inputNip_3,
        input_4 = widgets.inputNip_4,
        oldInput = this._lastFocusedInput,
        nipMessageSub = widgets.nipMessageSub,
        newInput;
        
  		if(nipMessageSub.data.text == "<!i>Los Nips no coinciden"){
  			nipMessageSub.setData({"text":""});
			nipMessageSub.stateChange("exit");
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
	            newInput = widgets.passwordInput_4;		
				
				if(this.nip1 == "" && this.nip2 == ""){
					this.nip1 = input_1.getData()+input_2.getData()+input_3.getData()+input_4.getData();
					input_1.setData();
					input_2.setData();
					input_3.setData();
					input_4.setData();
					newInput = input_1;
					nipMessageSub.setData({"text":"<!i>Repite tu NIP"});
					nipMessageSub.stateChange("enter");
				}
				else{
					this.nip2 = input_1.getData()+input_2.getData()+input_3.getData()+input_4.getData();
				}
			}
			
			if(this.nip1 != "" && this.nip2 != ""){
				if(this.nip1 == this.nip2){
					this.nipFinal = this.nip1;
					nipMessageSub.stateChange("exit");
					widgets.check.setData({"img":"img/admin/setup/flechaVerde.png"});
					widgets.check.stateChange("enter");
					widgets.buttons.list[1].active = true;
					widgets.buttons.scrollNext();
					widgets.buttons.refresh();
					widgets.buttons.setFocus(true);
					this.actualFocus = "buttons";
				}
				else{
					nipMessageSub.setData({"text":"<!i>Los Nips no coinciden"});
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
            break;
    }
    this.setInputFocus(newInput);
}

setup.prototype.previousInput = function previousInput(){
    var widgets = this.widgets,
        input_1 = widgets.inputNip_1,
        input_2 = widgets.inputNip_2,
        input_3 = widgets.inputNip_3,
        input_4 = widgets.inputNip_4,
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




setup.drawLegend = function drawLegend(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "right,top";
	custo_f.font_size = 40;
	Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

setup.drawLine = function drawLine(){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custoW = {fill: "rgba(240,240,250,1)"};
    Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);  
    
		
	ctx.drawObject(ctx.endObject());	
}

setup.drawHeaderText = function drawHeaderText(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "left,top";
	custo_f.font_size = 20;
	Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

setup.drawFooterText = function drawFooterText(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "left,bottom";
	custo_f.font_size = 20;
	Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

setup.drawMail = function drawMail(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,middle";
	custo_f.font_size = 20;
	Canvas.drawText(ctx, _data, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}


setup.drawSteps = function drawSteps(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "right,top";
	custo_f.font_size = 20;
	Canvas.drawText(ctx, _data.step+"/"+_data.total, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

setup.drawButtonList = function drawButtonList(_data){
		
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
			if(_data.active){
			custo = {  
				fill: "rgba(0,150,190,1)"
			};
			}
			else{
			custo = {  
				fill: "rgba(0,90,120,1)"
			};	
			
			}
			//botones
				Canvas.drawShape(ctx, "rect", [0, 0, 186, 32], custo);
		
			var custo_t = JSON.stringify(this.themaData.standardFont);
				custo_t = JSON.parse(custo_t);
				custo_t.text_align = "center,middle";
				custo_t.font_size = 18* tpng.thema.text_proportion;
				Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_t);	
		}
		
		    ctx.drawObject(ctx.endObject());
	   }
}
setup.drawTimeZone = function drawTimeZone(_data){
		
	this.draw = function draw(focus) {
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
	    		
	var custo = { "fill": "",
            	  "shadow": null,
            	  "rx": null,
            	  "stroke": "rgba(85,95,105,1)",
           	 	  "stroke_width": 5,
           	 	  "stroke_pos" : "inside"	
				}	
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "left,middle";
			custo_f.font_size = 22 * tpng.thema.text_proportion;	
		

	if(focus){
			custo.stroke = "rgba(240,240,240,1)";
			custo.rx = 5;
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
			
		
		}else{
			custo.stroke_width = 1;
			Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
		}
			
	Canvas.drawText(ctx, _data.label, new Rect(20,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);	
	
	if(_data.selected)
		tp_draw.getSingleton().drawImage("img/admin/setup/flechaVerde.png", ctx, 326, 24,null, null, null);
		
		
	ctx.drawObject(ctx.endObject());
	}
}
setup.drawTimeZoneImg = function drawTimeZoneImg(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
	tp_draw.getSingleton().drawImage(_data.logo, ctx, 0, 0);
    
    ctx.drawObject(ctx.endObject());
}
setup.drawTimeZoneImgBg = function drawTimeZoneImgBg(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
	tp_draw.getSingleton().drawImage(_data.logo, ctx, 0, 0);
    
    ctx.drawObject(ctx.endObject());
}
setup.drawAvatars = function drawAvatars(_data){
	

		this.draw = function draw(focus) {
			var ctx = this.getContext("2d");
				ctx.beginObject();
	    		ctx.clear();
		//imagen
			tp_draw.getSingleton().drawImage(_data.url3X5A, ctx, 5, 5,null, null, null,"destination-over");
			
			//panel negro no foco
				var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
				custo = JSON.parse(custo);
				custo.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.9)";
				Canvas.drawShape(ctx, "rect", [5,5,ctx.viewportWidth-10,ctx.viewportHeight-10], custo);
			
			
			//título
		    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);
			custo_f.text_align = "center,middle";
			custo_f.font_size = 20* tpng.thema.text_proportion;
			custo_f.fill = "rgba(255,240,200,1)";	
			Canvas.drawText(ctx, _data.text+"", new Rect(67,3,116,ctx.viewportHeight-6), custo_f);
				
				
					if(_data.active){
						tp_draw.getSingleton().drawImage("img/admin/setup/flechaVerde.png", ctx, 134, 139,null, null, null);
					
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
			var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_pos" : "inside"};
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10], strokeF);
			}else{
				Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo); //FONDO		
			}				
		    ctx.drawObject(ctx.endObject());
	   }
}

setup.drawRatings = function drawRatings(_data){
	
		this.draw = function draw(focus) {
			var ctx = this.getContext("2d");
				ctx.beginObject();
	    		ctx.clear();
		
			//título
		    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);
			custo_f.text_align = "center,top";
			custo_f.font_size = 40* tpng.thema.text_proportion;
			if(focus){
				custo_f.fill = "rgba(30,30,40,1)";	
			}
			else{
				custo_f.fill = "rgba(240,240,250,1)";
			}
			var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
				custo = JSON.parse(custo);
				custo.fill = focus ? "rgba(240,240,250,1)":"rgba(240,240,250,0)";
				custo.stroke = "";
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
				//badge	
				tp_draw.getSingleton().drawImage(_data.badge, ctx, 42, 69, null, null, null);		
				if(_data.active){
						tp_draw.getSingleton().drawImage("img/admin/setup/flechaVerde.png", ctx, 59, 5,null, null, null);
					
					}
				Canvas.drawText(ctx, _data.text+"", new Rect(0,10,ctx.viewportWidth,ctx.viewportHeight), custo_f);
				
		    ctx.drawObject(ctx.endObject());
	   }
}

setup.drawCheck = function drawCheck(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 16,null, null, null); 
   
		
	ctx.drawObject(ctx.endObject());	
}


setup.drawPrograms = function drawPrograms(_data){
	

		this.draw = function draw(focus) {
			var ctx = this.getContext("2d");
				ctx.beginObject();
	    		ctx.clear();
		//imagen
			tp_draw.getSingleton().drawImage(_data.url3x3, ctx, 0, 0,null, null, null,"destination-over");
			
			//panel negro no foco
				var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
				custo = JSON.parse(custo);
				custo.fill = "0-rgba(30,30,40,0)|1-rgba(30,30,40,.9)";
				
			
			
			//título
		    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);
			custo_f.text_align = "center,top";
			custo_f.font_size = 18* tpng.thema.text_proportion;
			custo_f.fill = "rgba(255,240,200,1)";	
			if(_data.showtitle){
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
				Canvas.drawText(ctx, _data.text+"", new Rect(0,30,ctx.viewportWidth,60), custo_f);
			}	
				
					if(_data.active){
						tp_draw.getSingleton().drawImage("img/admin/setup/flechaVerde.png", ctx, 77, 67,null, null, null);
					
					}
						
				
			//stroke
			var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
			custo = JSON.parse(custo);
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
			
		    ctx.drawObject(ctx.endObject());
	   }
}

setup.drawQuestions = function drawQuestions(_data){
	

		this.draw = function draw(focus) {
			var ctx = this.getContext("2d");
				ctx.beginObject();
	    		ctx.clear();
		//imagen
			
			//título
		    var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);
			custo_f.text_align = "center,middle";
			custo_f.font_size = 20* tpng.thema.text_proportion;
			if(focus){
				custo_f.fill = "rgba(240,240,250,1)";	
			}
			else{
				custo_f.fill = "rgba(240,240,250,.3)";	
			}
			Canvas.drawText(ctx, _data.text+"", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
				
				
					if(_data.active){
						tp_draw.getSingleton().drawImage("img/admin/setup/flechaVerde.png", ctx, 134, 5,null, null, null);
					
					}
				
					
				
			//stroke
			//var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
			//custo = JSON.parse(custo);
			//Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
			
		    ctx.drawObject(ctx.endObject());
	   }
}

setup.drawArrowsS = function drawArrows(_data){
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

setup.drawArrowsRating = function drawArrowsRating(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
    
	var custoW = {fill: "rgba(90,90,90,1)"};
	
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [13,0,2,ctx.viewportHeight], custoW);
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [18,0,2,ctx.viewportHeight], custoW);	
	
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 36);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}

setup.drawArrowsP = function drawArrowsP(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
    
	var custoW = {fill: "rgba(90,90,90,1)"};
	
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [13,0,2,ctx.viewportHeight], custoW);
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [18,0,2,ctx.viewportHeight], custoW);	
	
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 31);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}

setup.drawNipMessageSub = function drawNipMessageSub(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "center,middle";
	if(_data.text == "<!i>Los Nips no coinciden"){
		custo_f.fill = "rgba(220,60,70,1)";
	}
	else{
		custo_f.fill = "rgba(240,240,250,1)";
	}
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
		
	ctx.drawObject(ctx.endObject());	
}

setup.drawBg = function drawBg(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custoW = {fill: "rgba(30,30,40,.3)"};
    Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);
	ctx.drawObject(ctx.endObject());	
}
//temp
setup.drawMalla = function drawMalla(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		tp_draw.getSingleton().drawImage("img/tmp/DevsOnion.png", ctx, 0, 0);	
		
		ctx.drawObject(ctx.endObject());
}
