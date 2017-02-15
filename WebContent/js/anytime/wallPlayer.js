
FormWidget.registerTypeStandard("wallPlayer");

function wallPlayer(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
}

wallPlayer.inherits(FormWidget);

wallPlayer.prototype.onStreamEvent = function onStreamEvent(event) {
	NGM.trace("WALL OVER ONSTREAM EVENT: " + event.type);
	NGM.trace(" ");
	switch(event.type){
		case "start":
			;
		break;
		case "buffering":
			;
		break;
		
		case "error":
		case "end":
		case "endOfFile":
			if(this.currentTrailer < this.playList.length-1) 						
				this.currentTrailer++;
			else
				this.currentTrailer = 0;
			this.playTrailers();
		break;
	}
}

wallPlayer.prototype.onEnter = function onEnter(_data){	
	this.home = _data.home;
	this.home.objectChild = this; //Player Events
	this.currentTrailer = 0;
		
	//Armando la lista de prueba	
	this.playList = [
		{"url": "http://www.promoespacio.com.mx/sistema/Spots/Escondites_Magicos_2.mp4"},
		{"url": "http://www.promoespacio.com.mx/sistema/Spots/Full_HD_TRIVIAS_SEM_.mp4"},	
		{"url": "http://www.promoespacio.com.mx/sistema/Spots/AhorraTips.mp4"},
		{"url": "http://www.promoespacio.com.mx/sistema/Spots/EsconditesMagicos4.mp4"},
		{"url": "http://www.promoespacio.com.mx/sistema/Spots/Loquenosabias.mp4"},
		{"url": "http://www.promoespacio.com.mx/sistema/Spots/EsconditesMagicos5.mp4"},
		{"url": "http://www.promoespacio.com.mx/sistema/Spots/TRIVIAS_1.mp4"},
		{"url": "http://www.promoespacio.com.mx/sistema/Spots/EsconditesMagicos_3.mp4"},
		{"url": "http://www.promoespacio.com.mx/sistema/Spots/AhorraTips2.mp4"},
		{"url": "http://www.promoespacio.com.mx/sistema/Spots/Escondites_Magicos_1.mp4"}
		
	];	
		
	this.playTrailers();
}

wallPlayer.prototype.playTrailers = function playTrailers() {
		var trailer = this.playList[this.currentTrailer];
		this.home.playVideo(trailer.url, "MPG4", 0);
}


wallPlayer.prototype.onExit = function onExit(_data){
	this.home.objectChild = null; //<--Para quitar la referencia del evento en el homeFrame 
	unsetTimeAlarm(this.updateTimer);
}
wallPlayer.prototype.closing = function closing(){	
	this.formClose();
}
