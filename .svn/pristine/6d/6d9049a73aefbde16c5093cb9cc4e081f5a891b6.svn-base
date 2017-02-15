function alias(config, options){  
    this.super(config, options);
    this.home;
}


alias.inherits(FormWidget);

alias.prototype.onEnter = function onEnter(_data){
	
	this.home = _data.home;
	var alias = _data.alias;
	
	this.home.showHeader();
	this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu nuevo alias: ","text2":"No has ingresado alias o el formato es inválido, ingresa uno válido.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":true}, false,,true);	
	
}

alias.prototype.nothing = function nothing(){
		this.home.closeSection(this);
}

alias.prototype.setAlias = function setAlias(alias){
			this.alias = alias;
			this.updateAlias();
}

alias.prototype.updateAlias = function updateAlias(){
this.userId = tpng.user.profile.proId;
params = ["proId=" +this.userId+ "&updateType=1&value=" + this.alias];
getServices.getSingleton().call("ADMIN_SET_PROFILE",params,this.responseUpdateAlias.bind(this));

}

alias.prototype.responseUpdateAlias = function responseUpdateAlias(response){
	
	if(response.status == 200 && response.data.ResponseVO.status == 0 && response.data.ResponseVO.message =="Operación Exitosa"){
		tpng.user.profile.alias = this.alias;
		tpng.menu.data = [];
	 	tpng.menu.tsMenu = "";
	 	tpng.menu.lastMenuIndex = 0;
		this.home.closeSection(this);
	}else if(response.data.ResponseVO.status == -201){
			this.home.closeSection(this);
			this.home.openSection("keyboard", {"home":this.home,"type":"ks","text1":"Ingresa tu nuevo alias: ","text2":"El alias ya existe.","ok":"Aceptar","cancel":"Cancelar","parent" : this,"valid":false}, false,,true);
		}	
	 else if(response.error){	
	 		this.home.closeSection(this);
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false); // }, true,,true);
	}

}
