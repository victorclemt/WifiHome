function vodCode(config, options){  
    this.super(config, options);
    this.home;
	
}


vodCode.inherits(FormWidget);

vodCode.prototype.onEnter = function onEnter(_data){
	
	this.home = _data.home;
	this.home.showHeader();
	this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu código de promoción: ","text2":"El código que has ingresado no es válido.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":true}, false,,true);	
	
}

vodCode.prototype.nothing = function nothing(){
		this.home.closeSection(this);
}

vodCode.prototype.validateCode = function validateCode(code){
			this.code = code;
			this.updateCode();
}

vodCode.prototype.updateCode = function updateCode(){

params = ["code=" + this.code];
getServices.getSingleton().call("VOD_SEND_CODE",params,this.responseUpdateCode.bind(this));

}

vodCode.prototype.responseUpdateCode = function responseUpdateCode(response){
	
	if(response.status == 200 && response.data.ResultVO.status == 0){
		this.home.closeSection(this);
		var vod = {
			"vodId":response.data.ResultVO.idVod
		};
			this.home.openSection("vodDetail",{"home": this.home, "parameters":vod},true, ,false);
	}else if(response.data.ResultVO.status == -202){
			this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa el código de promoción: ","text2":response.data.ResultVO.message,"ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, false,,true);
	}else if(response.data.ResultVO.status == -201){
			this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa el código de promoción: ","text2":response.data.ResultVO.message,"ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, false,,true);
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status},false);			
	}

}
