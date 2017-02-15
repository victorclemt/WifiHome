FormWidget.registerTypeStandard("stbName");

function stbName(config, options){  
    this.super(config, options);
    this.home;
}


stbName.inherits(FormWidget);

stbName.prototype.onEnter = function onEnter(_data){
	
	this.home = _data.home;
	
	var name = settings.get("account.service.dial.boxname");

	this.home.showHeader();
	this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa el nuevo nombre de tu decodificador: ","text2":"El nombre del decodificador debe contener entre 4 y 20 caracteres.","pattern":name,"ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":true}, false,,true);	
	
}

stbName.prototype.nothing = function nothing(){
		this.home.closeSection(this);
}

stbName.prototype.setStbName = function setStbName(stbName){
			settings.set("account.service.dial.boxname",stbName);
			this.home.closeSection(this);
}
