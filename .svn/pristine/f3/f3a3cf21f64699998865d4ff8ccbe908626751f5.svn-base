// installer.js
function installer(config, options){  
    this.super(config, options);
    this.items = [];
    this.actualFocus = "";
    this.step = 0;
    this.totalSteps = 7;
    this.home;
    this.any = false;
    this.telev = false;
    this.vod = false;
    this.tel = false;
    this.hastel = false;
}

installer.inherits(FormWidget);

installer.prototype.onEnter = function onEnter(_data){

	var widgets = this.widgets;
	this.home = _data.home;
	this.home.objectChild = this;
	
		this.getUserData();
	
}

installer.prototype.getUserData = function getUserData(){

getServices.getSingleton().call("ADMIN_GET_CUSTOMER_DATA", , this.responseGetUserData.bind(this));

}

installer.prototype.onStreamEvent = function onStreamEvent(event) {	
	var w = this.widgets;
	
	switch(event.type){		
		case "start":	
				switch(this.step){
					case 2:
						w.outline.setData();
						w.outline.stateChange("exit");	
					break;
					
					case 3:
						w.outline.setData();
						w.outline.stateChange("exit");	
					break;
					
					case 4:
						w.outline.setData();
						w.outline.stateChange("exit");
					break;
				}
		break;
		
		case "starting":
			switch(this.step){
					case 2:
						this.any = true;
					break;
					
					case 3:
						this.telev = true;
					break;
					
					case 4:
						this.vod = true;
					break;
				}
		break;
	}	
}

installer.prototype.responseGetUserData = function responseGetUserData(response){
var w = this.widgets;

		if(response.status == 200){
		
			this.installer = response.data.ResponseVO;
			if(this.installer){
				this.init();
			}else{
				//HACER ALGO CUANDO NO VENGA NADA EN EL SERVICIO
			}
		}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);		
		}
}			

installer.prototype.init = function init(){
	var w = this.widgets;

		this.home.showHeader({"section":"setup","simple": true,"fill": "rgba(0,0,0,0)"});
		var url = "img/admin/installer/18x18-instalador.jpg";
		this.home.setBg(url);
		w.line.setData();
		w.line.stateChange("enter");
		w.legend.setData({"legend":"Totalplay v 3.0"});
		var susc = this.installer.susName;
		var bundle = this.installer.mainBundleName;
		var channels = this.installer.totalChannels;
		var stbs = this.installer.totalDevices;
		var addons = this.installer.services;
		var tel = this.installer.susMdnHome;
		//var tel = undefined;
		if(tel != undefined){
			this.hastel = true;
			w.headerText.setData({
			"legend":"Cliente "+"<!size=24 !b>"+susc+"<!> |"+"Paquete contratado "+"<!size=24 !b>"+bundle+"<!> |"+"Canales"+"<!size=24 !b>"+channels+"<!> |"+"Terminales "+"<!size=24 !b>"+stbs+"<!> |"+"Add-Ons "+"<!size=24 !b>"+addons+"<!> |"+"Número de teléfono "+"<!size=24 !b>"+tel+"<!>"
			});
		}
		else{
			w.headerText.setData({
			"legend":"Cliente "+"<!size=24 !b>"+susc+"<!> |"+"Paquete contratado "+"<!size=24 !b>"+bundle+"<!> |"+"Canales"+"<!size=24 !b>"+channels+"<!> |"+"Terminales "+"<!size=24 !b>"+stbs+"<!> |"+"Add-Ons "+"<!size=24 !b>"+addons+"<!>"
			});
		}
		var buttons = [
				{"id":"p","legend":"Configuración", "active":true},
				{"id":"n","legend":"Siguiente", "active":true}
					  ];
		w.buttons.setData(buttons);
		w.footerText.setData({
			"legend":"<!i>Pantalla para uso exclusivo de instaladores de Totalplay<!>",
			"legend2":"<!i>Si estás viendo esta pantalla por error, comunícate al 1780-5000<!>"
			});
		this.client.lock();
			w.legend.stateChange("enter");
			w.headerText.stateChange("enter");
			w.footerText.stateChange("enter");
			w.buttons.stateChange("enter");
			w.buttons.setFocus(true);
			this.actualFocus = "buttons";
			this.step = 1;
		this.client.unlock();
	
}

installer.prototype.first = function first(dir){
	var w = this.widgets;
	
	if(dir == "prev"){
		w.legend.stateChange("exit_r");
		w.headerText.stateChange("exit_r");
		w.buttons.stateChange("exit_r");
		w.line.stateChange("exit_r");
		w.outline.stateChange("exit_r");
		tpng.player.status = "STOP";
				//this.home.widgets.player.setData();
		this.home.widgets.player.stateChange("installer_r");
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			this.client.lock();
				w.legend.setData();
				w.headerText.setData();
				w.buttons.setData();
				w.line.setData();
				this.home.widgets.player.setData();
				w.legend.stateChange("exit_l");
				w.headerText.stateChange("exit_l");
				w.buttons.stateChange("exit_l");
				w.line.stateChange("exit_l");
				//this.home.setPlayerStatus("STOP");
			this.client.unlock();
		}.bind(this), 300);	
		
		
		clearTimeout(this.timerLoadData);
		
	this.timerLoadData =
			setTimeout(function(){
		w.legend.setData({"legend":"Totalplay v 3.0"});
		var susc = this.installer.susName;
		var bundle = this.installer.mainBundleName;
		var channels = this.installer.totalChannels;
		var stbs = this.installer.totalDevices;
		var addons = this.installer.services;
		var tel = this.installer.susMdnHome;
		//var tel = undefined;	
		if(tel != undefined){
			this.hastel = true;
			w.headerText.setData({
			"legend":"Cliente "+"<!size=24 !b>"+susc+"<!> |"+"Paquete contratado "+"<!size=24 !b>"+bundle+"<!> |"+"Canales"+"<!size=24 !b>"+channels+"<!> |"+"Terminales "+"<!size=24 !b>"+stbs+"<!> |"+"Add-Ons "+"<!size=24 !b>"+addons+"<!> |"+"Número de teléfono "+"<!size=24 !b>"+tel+"<!>"
			});
		}
		else{
			w.headerText.setData({
			"legend":"Cliente "+"<!size=24 !b>"+susc+"<!> |"+"Paquete contratado "+"<!size=24 !b>"+bundle+"<!> |"+"Canales"+"<!size=24 !b>"+channels+"<!> |"+"Terminales "+"<!size=24 !b>"+stbs+"<!> |"+"Add-Ons "+"<!size=24 !b>"+addons+"<!>"
			});
		}
		var buttons = [
						{"id":"p","legend":"Configuración", "active":true},
						{"id":"n","legend":"Siguiente", "active":true}
					];
		w.buttons.setData(buttons);
			this.client.lock();
				w.legend.stateChange("enter");
				w.headerText.stateChange("enter");
				w.buttons.stateChange("enter");
				w.line.stateChange("enter");
				w.buttons.setFocus(true);
				this.actualFocus = "buttons";
				this.step = 1;
			this.client.unlock();
		}.bind(this), 1000);
	
	}
	
}

installer.prototype.second = function second(dir){
	var w = this.widgets;

		if(dir == "next"){
			w.legend.stateChange("exit_l");
			w.headerText.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			
				clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.buttons.setData();
			w.outline.setData();
			w.line.setData();
			w.legend.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.outline.stateChange("exit_r");
			
		}.bind(this), 300);	
			
			clearTimeout(this.timerLoadData);
			
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"¿La señal de Anytime tv es correcta?"});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active": true},
							{"id":"n","legend":"Siguiente","active":true}
						];
					w.buttons.setData(buttons);
					w.outline.setData({"img":"img/vod/miniplayer_FUTURO.png"});
					w.outline.stateChange("enter");
				this.client.lock();
					this.anytime = this.installer.program.ProgramVO.urlCtv;
					this.home.playVideo(this.anytime,"VIDEO",,"installer");	
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					this.actualFocus = "buttons";
					w.buttons.setFocus(true);
					this.step = 2;
				this.client.unlock();
				
				
				}.bind(this), 2000);
		}
		if(dir == "prev"){
			w.legend.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.outline.stateChange("exit_r");
			tpng.player.status = "STOP";
			//this.home.widgets.player.setData();
			this.home.widgets.player.stateChange("installer_r");
			//this.home.setPlayerStatus("STOP");
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.buttons.setData();
			w.line.setData();
			this.home.widgets.player.setData();
			w.legend.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.outline.setData();
			w.outline.stateChange("exit_l");
		}.bind(this), 300);	
			
			
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"¿La señal de Anytime tv es correcta?"});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				w.outline.setData({"img":"img/vod/miniplayer_FUTURO.png"});
				w.outline.stateChange("enter");
				this.client.lock();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.buttons.setFocus(true);
					this.actualFocus = "buttons";
					this.step = 2;
					this.anytime = this.installer.program.ProgramVO.urlCtv;
					this.home.playVideo(this.anytime,"VIDEO",,"installer");	
				this.client.unlock();
				
				}.bind(this), 1000);
		}
	
}

installer.prototype.third = function third(dir){
	var w = this.widgets;
		if(dir == "next"){
			w.legend.stateChange("exit_l");
			//this.home.setPlayerStatus("STOP");
			tpng.player.status = "STOP";
			//this.home.widgets.player.setData();
			this.home.widgets.player.stateChange("installer_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			clearTimeout(this.timerLoadData);
			
				clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.buttons.setData();
			w.line.setData();
			this.home.widgets.player.setData();
			w.legend.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.outline.setData();
			w.outline.stateChange("exit_r");
		}.bind(this), 300);	
			
			
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"¿La televisión funciona correctamente?"});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				w.outline.setData({"img":"img/vod/miniplayer_FUTURO.png"});
				w.outline.stateChange("enter");
				this.client.lock();
					this.tv = this.installer.channel.ChannelVO.number;
					var channel = NGM.main.getChannelByZap(this.tv);
					this.home.widgets.player.setData(channel);
					this.home.widgets.player.stateChange("installer");	
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					this.actualFocus = "buttons";
					this.step = 3;
				this.client.unlock();
				
				
				}.bind(this), 1000);
		}
		if(dir == "prev"){
			w.legend.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.outline.stateChange("exit_r");
			//this.home.setPlayerStatus("STOP");
			tpng.player.status = "STOP";
			//this.home.widgets.player.setData();
			this.home.widgets.player.stateChange("installer_r");
				
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.buttons.setData();
			w.line.setData();
			this.home.widgets.player.setData();
			w.legend.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.outline.setData();
			w.outline.stateChange("exit_l");
		}.bind(this), 300);	
			
			
			
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"¿La televisión funciona correctamente?"});
				
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				w.outline.setData({"img":"img/vod/miniplayer_FUTURO.png"});
				w.outline.stateChange("enter");
				
				this.client.lock();
					this.tv = this.installer.channel.ChannelVO.number;
					var channel = NGM.main.getChannelByZap(this.tv);
					this.home.widgets.player.setData(channel);
					this.home.widgets.player.stateChange("installer");	
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					this.actualFocus = "buttons";
					this.step = 3;
				this.client.unlock();
				
				
				}.bind(this), 1000);
	
		}	
	
}

installer.prototype.fourth = function fourth(dir){
	var w = this.widgets;
		if(dir == "next"){
			w.legend.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			//this.home.setPlayerStatus("STOP");
			tpng.player.status = "STOP";
			//this.home.widgets.player.setData();
			this.home.widgets.player.stateChange("installer_l");
				
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.buttons.setData();
			w.line.setData();
			this.home.widgets.player.setData();
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.outline.setData();
			w.outline.stateChange("exit_r");
		}.bind(this), 300);	
			
			
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"¿La película funciona correctamente?"});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				w.outline.setData({"img":"img/vod/miniplayer_FUTURO.png"});
				w.outline.stateChange("enter");
				
				this.client.lock();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					//if(this.installer.vod.VodMovieVO.formats.VodFormatVO.quality.length == 2 || this.installer.vod.VodMovieVO.formats.VodFormatVO.quality.length == 3){
					 	this.movie = this.installer.vod.VodMovieVO.formats[0].VodFormatVO.url;
					//}
					//else{
						//this.movie = this.installer.vod.VodMovieVO.formats[0].VodFormatVO.url;
					//}
					this.home.playVideo(this.movie,"VIDEO",,"installer");
					this.actualFocus = "buttons";
					this.step = 4;
					w.buttons.setFocus(true);
				this.client.unlock();
				
				}.bind(this), 1000);
		}
	if(dir == "prev"){
			w.legend.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.headerText2.stateChange("exit_r");
			w.check1.stateChange("exit_r");
			w.check2.stateChange("exit_r");
			w.check3.stateChange("exit_r");
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.buttons.setData();
			w.line.setData();
			w.legend.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.outline.setData();
			w.outline.stateChange("exit_l");
		}.bind(this), 300);	
			
			
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"¿La película funciona correctamente?"});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				w.outline.setData({"img":"img/vod/miniplayer_FUTURO.png"});
				w.outline.stateChange("enter");
				this.client.lock();
					this.movie = this.installer.vod.VodMovieVO.formats[0].VodFormatVO.url;
					this.home.playVideo(this.movie,"VIDEO",,"installer");
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					this.actualFocus = "buttons";
					this.step = 4;
					w.buttons.setFocus(true);
				this.client.unlock();
				
				
				}.bind(this), 1000);
	}
	
}

installer.prototype.fourth2 = function fourth2(dir){
	var w = this.widgets;
		/*if(dir == "next"){
			w.legend.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			this.home.setPlayerStatus("STOP");
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText.setData();
			w.buttons.setData();
			w.line.setData();
			w.legend.stateChange("exit_r");
			w.headerText.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.outline.setData();
			w.outline.stateChange("exit_r");
		}.bind(this), 300);	
			
			
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"¿La película funciona correctamente?"});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				w.outline.setData({"img":"img/vod/miniplayer_FUTURO.png"});
				w.outline.stateChange("enter");
				
				this.client.lock();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					//if(this.installer.vod.VodMovieVO.formats.VodFormatVO.quality.length == 2 || this.installer.vod.VodMovieVO.formats.VodFormatVO.quality.length == 3){
					 	this.movie = this.installer.vod.VodMovieVO.formats[0].VodFormatVO.url;
					//}
					//else{
						//this.movie = this.installer.vod.VodMovieVO.formats[0].VodFormatVO.url;
					//}
					this.home.playVideo(this.movie,"INSTALLER");
					this.actualFocus = "buttons";
					this.step = 4;
					w.buttons.setFocus(true);
				this.client.unlock();
				
				}.bind(this), 1000);
		}*/
	if(dir == "prev"){
			w.legend.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.headerText3.stateChange("exit_r");
			w.check1.stateChange("exit_r");
			w.check2.stateChange("exit_r");
			w.check3.stateChange("exit_r");
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.buttons.setData();
			w.line.setData();
			w.legend.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			w.outline.setData();
			w.outline.stateChange("exit_l");
		}.bind(this), 300);	
			
			
			clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"¿La película funciona correctamente?"});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				w.outline.setData({"img":"img/vod/miniplayer_FUTURO.png"});
				w.outline.stateChange("enter");
				this.client.lock();
					this.movie = this.installer.vod.VodMovieVO.formats[0].VodFormatVO.url;
					this.home.playVideo(this.movie,"VIDEO",,"installer");
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					this.actualFocus = "buttons";
					this.step = 4;
					w.buttons.setFocus(true);
				this.client.unlock();
				
				
				}.bind(this), 1000);
	}
	
}

installer.prototype.fifth = function fifth(dir){
	var w = this.widgets;
		if(dir == "next"){
			w.legend.stateChange("exit_l");
			w.headerText2.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			//this.home.setPlayerStatus("STOP");
			tpng.player.status = "STOP";
			//this.home.widgets.player.setData();
			this.home.widgets.player.stateChange("installer_l");
			
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText2.setData();
			w.buttons.setData();
			w.line.setData();
			w.check1.setData();
			w.check2.setData();
			w.check3.setData();
			this.home.widgets.player.setData();
			w.legend.stateChange("exit_r");
			w.headerText2.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.check1.stateChange("exit_r");
			w.check2.stateChange("exit_r");
			w.check3.stateChange("exit_r");
		}.bind(this), 300);	
			
			
		clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				if(this.any){
					w.check1.setData({"img":"img/admin/setup/flechaVerde.png"});
				}
				else{
					w.check1.setData({"img":"img/admin/setup/tacheRojo.png"});
				}
				if(this.telev){
					w.check2.setData({"img":"img/admin/setup/flechaVerde.png"});
				}
				else{
					w.check2.setData({"img":"img/admin/setup/tacheRojo.png"});
				}
				if(this.vod){
					w.check3.setData({"img":"img/admin/setup/flechaVerde.png"});
				}
				else{
					w.check3.setData({"img":"img/admin/setup/tacheRojo.png"});
				}
				
				w.legend.setData({"legend":"¿Están todos los sistemas listos y comprobados?"});
				w.headerText2.setData({"legend":"|Anytime tv |||Señal de tv |||Películas"});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Terminar","active":true}
						];
				w.buttons.setData(buttons);
				
				this.client.lock();
					w.check1.stateChange("enter");
					w.check2.stateChange("enter");
					w.check3.stateChange("enter");
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText2.stateChange("enter");
					this.step = 5;
					this.actualFocus = "buttons";
				this.client.unlock();
				
				}.bind(this), 1000);
		}
}

installer.prototype.fifth2 = function fifth2(dir){
	var w = this.widgets;
		if(dir == "next"){
			w.legend.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			//this.home.setPlayerStatus("STOP");
			tpng.player.status = "STOP";
			this.home.widgets.player.stateChange("installer_l");
			//this.home.widgets.player.setData();
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText3.setData();
			w.buttons.setData();
			w.line.setData();
			this.home.widgets.player.setData();
			w.legend.stateChange("exit_r");
			w.headerText3.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
		}.bind(this), 300);	
			
			
		clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"¿La llamada funciona correctamente?"});
				w.headerText3.setData({"legend":"|||||||llamando...","img":"img/admin/installer/llamada.png"});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				
				this.client.lock();
					
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText3.stateChange("enter");
					var s = this.installer.callCenterPhone;
					var a = s.split("-"); 
					var phone = "";
					for(var i = 0; i<a.length; i++){
						phone = phone+a[i];
					}
					
					var params = ["mdnDest="+phone];
					getServices.getSingleton().call("ADMIN_SEND_CALL",params, this.responseGetCall.bind(this));
	
					this.home.widgets.player.setData();
					this.step = 5;
					this.actualFocus = "buttons";
				this.client.unlock();
				
				
				}.bind(this), 1000);
		}
	  if(dir == "prev"){
	  		w.legend.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.headerText4.stateChange("exit_r");
			w.check1.stateChange("exit_2r");
			w.check2.stateChange("exit_2r");
			w.check3.stateChange("exit_2r");
			w.check4.stateChange("exit_r");
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText3.setData();
			w.buttons.setData();
			w.line.setData();
			w.legend.stateChange("exit_l");
			w.headerText3.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
		}.bind(this), 300);	
			
			
		clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				w.legend.setData({"legend":"¿La llamada funciona correctamente?"});
				w.headerText3.setData({"legend":"|||||||llamando...","img":"img/admin/installer/llamada.png"});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Siguiente","active":true}
						];
				w.buttons.setData(buttons);
				
				this.client.lock();
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText3.stateChange("enter");
					var s = this.installer.callCenterPhone;
					var a = s.split("-"); 
					var phone = "";
					for(var i = 0; i<a.length; i++){
						phone = phone+a[i];
					}
					
					var params = ["mdnDest="+phone];
					getServices.getSingleton().call("ADMIN_SEND_CALL",params, this.responseGetCall.bind(this));
	
	
					this.step = 5;
					this.actualFocus = "buttons";
				this.client.unlock();
				
				
				}.bind(this), 1000); 
	  }	
}

installer.prototype.sixth = function sixth(dir){
	var w = this.widgets;
		if(dir == "next"){
			w.legend.stateChange("exit_l");
			w.headerText3.stateChange("exit_l");
			w.buttons.stateChange("exit_l");
			w.line.stateChange("exit_l");
			//this.home.setPlayerStatus("STOP");
			tpng.player.status = "STOP";
			//this.home.widgets.player.setData();
			this.home.widgets.player.stateChange("installer_l");
			clearTimeout(this.timerLoad);
	
		this.timerLoad =
			setTimeout(function(){
			w.legend.setData();
			w.headerText4.setData();
			w.buttons.setData();
			w.line.setData();
			w.check1.setData();
			w.check2.setData();
			w.check3.setData();
			w.check4.setData();
			this.home.widgets.player.setData();
			w.legend.stateChange("exit_r");
			w.headerText4.stateChange("exit_r");
			w.buttons.stateChange("exit_r");
			w.line.stateChange("exit_r");
			w.check1.stateChange("exit_2r");
			w.check2.stateChange("exit_2r");
			w.check3.stateChange("exit_2r");
			w.check4.stateChange("exit_r");
		}.bind(this), 300);	
			
			
		clearTimeout(this.timerLoadData);
	
		this.timerLoadData =
			setTimeout(function(){
				if(this.any){
					w.check1.setData({"img":"img/admin/setup/flechaVerde.png"});
				}
				else{
					w.check1.setData({"img":"img/admin/setup/tacheRojo.png"});
				}
				if(this.telev){
					w.check2.setData({"img":"img/admin/setup/flechaVerde.png"});
				}
				else{
					w.check2.setData({"img":"img/admin/setup/tacheRojo.png"});
				}
				if(this.vod){
					w.check3.setData({"img":"img/admin/setup/flechaVerde.png"});
				}
				else{
					w.check3.setData({"img":"img/admin/setup/tacheRojo.png"});
				}
				if(this.tel){
					w.check4.setData({"img":"img/admin/setup/flechaVerde.png"});
				}
				else{
					w.check4.setData({"img":"img/admin/setup/tacheRojo.png"});
				}
				
				w.legend.setData({"legend":"¿Están todos los sistemas listos y comprobados?"});
				w.headerText4.setData({"legend":"Anytime tv |||Señal de tv |||Películas |||Teléfono"});
				
				var buttons = [
							{"id":"p","legend":"Atrás","active":true},
							{"id":"n","legend":"Terminar","active":true}
						];
				w.buttons.setData(buttons);
				
				this.client.lock();
					w.check1.stateChange("enter_2");
					w.check2.stateChange("enter_2");
					w.check3.stateChange("enter_2");
					w.check4.stateChange("enter");
					w.buttons.stateChange("enter");
					w.line.stateChange("enter");
					w.legend.stateChange("enter");
					w.headerText4.stateChange("enter");
					this.step = 6;
					this.actualFocus = "buttons";
				this.client.unlock();
				
				}.bind(this), 1000);
		}
}


installer.prototype.getSuscriptor = function getSuscriptor(){
	getServices.getSingleton().call("ADMIN_GET_SUSCRIPTOR", ,this.responseGetSuscriptor.bind(this));
}

installer.prototype.responseGetPrograms = function responseGetPrograms(response){
	if(response.status == 200){
		var details = response.data.ResponseVO.arrayCca;
		this.items = [];
		var w = this.widgets;
		
				if(details.length >0){ 
					for(var i = 0; i<details.length; i++){
						this.items.push({"id":details[i].CcaVO.ccaId,"text": details[i].CcaVO.name,"badge":"","url1X1A":details[i].CcaVO.images.url1X1A,"urlL":details[i].CcaVO.images.urlL,"url3X5A":details[i].CcaVO.images.url3X5A})
					}
			}else{
				this.home.openSection("miniError", {"home": this.home, "suggest":gettext("ERROR_SUGGEST"), "message": gettext("ERROR_MESSAGE"), "code":"-250"}, false,,true);		
			}				
	}else if(response.error){	
				this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false,,true);
	}

}

installer.prototype.updateStatus = function updateStatus(){
var params = ["mac="+tpng.backend.mac_address];
	getServices.getSingleton().call("ADMIN_UPDATE_STATUS",params,this.responseUpdateStatus.bind(this));
}

installer.prototype.responseUpdateStatus = function responseUpdateStatus(response){
	if(response.status == 200 && response.data.ResponseVO.status == 0){
		this.home.hideHeader();
		this.home.setBg();
		this.home.closeSection(this);
		this.home.onEnter();			
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false,,true);
	}else{
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false,,true);
	}

}


installer.prototype.responseGetCall = function responseGetCall(response){
	if(response.status == 200){
		this.tel = true;
	}else{
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
		
}

installer.prototype.onKeyPress = function onKeyPress(_key){
	switch(this.actualFocus){		
		case "buttons":
			this.onKeyPressButtons(_key);
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
		
		
installer.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
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
					case "n":
						switch(this.step){
							case 1:
								this.second("next");
							break;
							
							case 2:
								this.third("next");
							break;
							
							case 3:
								this.fourth("next");	
							break;
							
							case 4:
								if(this.hastel){
									this.fifth2("next");
								}
								else{
									this.fifth("next");
								}
							break;
							
							case 5:
								if(this.hastel){
									this.sixth("next");
								}
								else{
									this.updateStatus();
								}
							break;
							
							case 6:
									this.updateStatus();
							break;
							
						
						}
						if(w.outline.stateGet() == "enter"){
							w.outline.stateChange("exit");
						}
					break;
					
					case "p":
						switch(this.step){
							case 1:
								NGM.application.open("setup", {'title': "setup", "url": "setup"});
							break;
							
							case 2:
								this.first("prev");
							break;
							
							case 3:
								this.second("prev");
							break;
							
							case 4:
								this.third("prev");
							break;
							
							case 5:
								if(this.hastel){
									//this.fifth2("next");
									this.fourth2("prev");
								}
								else{
									//this.fifth("next");
									this.fourth("prev");
								}
								
							break;
							
							case 6:
								this.fifth2("prev");
							break;
							
						}
					break;
				
				}
		break;

	}	
	return true;
}


installer.drawLegend = function drawLegend(_data){ 	
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

installer.drawLine = function drawLine(){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custoW = {fill: "rgba(240,240,250,1)"};
    Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);  
    
		
	ctx.drawObject(ctx.endObject());	
}

installer.drawHeaderText = function drawHeaderText(_data){ 	
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

installer.drawHeaderText2 = function drawHeaderText2(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	custo_f.text_align = "left,top";
	custo_f.font_size = 22;
	Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

installer.drawHeaderText3 = function drawHeaderText3(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	custo_f.text_align = "left,top";
	custo_f.font_size = 22;
	Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0,null, null, null); 
		
	ctx.drawObject(ctx.endObject());	
}

installer.drawHeaderText4 = function drawHeaderText4(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	custo_f.text_align = "left,top";
	custo_f.font_size = 22;
	Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0,null, null, null); 
		
	ctx.drawObject(ctx.endObject());	
}

installer.drawFooterText = function drawFooterText(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	custo_f.text_align = "center, top";
	custo_f.font_size = 22;
	Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight/2), custo_f);
	custo_f.font_size = 16;
	custo_f.text_align = "center, top";
	Canvas.drawText(ctx, _data.legend2, new Rect(0,28,ctx.viewportWidth,ctx.viewportHeight/2), custo_f);	
	ctx.drawObject(ctx.endObject());	
}


installer.drawButtonList = function drawButtonList(_data){
		
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

installer.drawCheck = function drawCheck(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0,null, null, null); 
   
		
	ctx.drawObject(ctx.endObject());	
}

installer.drawOutline = function drawOutline(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custoW = {"fill": "rgba(170,170,180,0)","stroke":"rgba(170,170,180,1)","stroke_width":5,"stroke_pos":inside};
    Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);
	tp_draw.getSingleton().drawImage(_data.img, ctx, 189, 92,null, null, null); 
	ctx.drawObject(ctx.endObject());	
}