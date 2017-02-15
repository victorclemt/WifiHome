//FALTA VALIDAR QUE EL CÓDIGO AÚN FUNCIONE Y VALIDAR CUANDO HAY MÁS REDES SOCIALES VINCULADAS
function socialNetworks(config, options){  
    this.super(config, options);
    this.home = "";
    this.state;
    this.buttons = [];
    this.focus = "socialN";
  	this.networks;
  	this.tw = new twitter();
}

socialNetworks.inherits(FormWidget);

socialNetworks.prototype.onEnter = function onEnter(_data){
	var w = this.widgets;
	if(this.home == "")
	this.home = _data.home;
	
	this.buttons.push({"id":"r","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png","img":""});
	this.client.lock();
		this.getSocialN();
		this.home.showHeader();
	this.client.unlock();	
}

socialNetworks.prototype.reEnter = function reEnter(_data){
	var w = this.widgets;
	if(this.home == "")
	this.home = _data.home;
	
	this.buttons.push({"id":"r","text": "Regresar","badge":"img/admin/avatar/1x1-regresar.png","img":""});
	this.client.lock();
		this.regetSocialN();
		this.home.showHeader();
	this.client.unlock();	
}


socialNetworks.prototype.getSocialN = function getSocialN(id){
	getServices.getSingleton().call("ADMIN_GET_SOCIAL_NETWORKS", , this.responseGetSocialN.bind(this));
}

socialNetworks.prototype.regetSocialN = function regetSocialN (id){
	getServices.getSingleton().call("ADMIN_GET_SOCIAL_NETWORKS", , this.responseRegetSocialN.bind(this));
}

socialNetworks.prototype.responseGetSocialN = function responseGetSocialN(response){
	if(response.status == 200){
		this.networks = response.data.ResponseVO.arrayNets;
		for(var i = 0; i < this.networks.length; i++){
			switch(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase()){
				case "FACEBOOK":
					if(this.networks[i].CatalogSocialNetworkVO.isLinked){
						this.positionFb = i	
					}			
				break;
				
				case "TWITTER":
					if(this.networks[i].CatalogSocialNetworkVO.isLinked){
						this.positionTw = i;
					}
				break;
				
				case "INSTAGRAM":
					if(this.networks[i].CatalogSocialNetworkVO.isLinked){
						this.positionIns = i;
					}
				break;
			}	
		}
		//FACEBOOK
		//NGM.dump(this.positionFb);
		if(this.positionFb>=0){	
			var aliasFb = this.networks[this.positionFb].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO.alias;
			var text = this.networks[this.positionFb].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO.user;

			if(aliasFb!=undefined && text != undefined){
				this.home.getNetworkImage(this.networks[this.positionFb].CatalogSocialNetworkVO.SocialNetwork.SocialNetworkVO);
				this.buttons.push({"id":aliasFb,"text":text,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFb].CatalogSocialNetworkVO.alias+".jpg","isLinked":this.networks[this.positionFb].CatalogSocialNetworkVO.isLinked,"badge":"img/admin/socialNetworks/1x1-vinculado.png","isMain":this.networks[this.positionFb].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFb].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Facebook.png"});	
			}
			else{
				for(var i = 0; i < this.networks.length; i++){
				if(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase() == "FACEBOOK")
					this.positionFakeFb = i	
				}
			this.buttons.push({"id":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.alias,"text":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.description,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFakeFb].CatalogSocialNetworkVO.alias+".jpg","badge":"img/admin/socialNetworks/1x1-desvinculado.png","isLinked":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.isLinked,"isMain":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Facebook.png"});
			}
		}
		else{
				for(var i = 0; i < this.networks.length; i++){
				if(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase() == "FACEBOOK")
					this.positionFakeFb = i	
				}
			this.buttons.push({"id":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.alias,"text":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.description,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFakeFb].CatalogSocialNetworkVO.alias+".jpg","badge":"img/admin/socialNetworks/1x1-desvinculado.png","isLinked":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.isLinked,"isMain":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Facebook.png"});
		}
	//TWITTER
	if(this.positionTw>=0){	
			
			this.aliasTw = this.networks[this.positionTw].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO.alias;
			this.textTw = this.networks[this.positionTw].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO.user;
			if(this.aliasTw!=undefined && this.textTw != undefined){
				this.home.getNetworkImage(this.networks[this.positionTw].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO);
				this.buttons.push({"id":this.aliasTw,"text":this.textTw,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionTw].CatalogSocialNetworkVO.alias+".jpg","isLinked":this.networks[this.positionTw].CatalogSocialNetworkVO.isLinked,"badge":"img/admin/socialNetworks/1x1-vinculado.png","isMain":this.networks[this.positionTw].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionTw].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Twitter.png"});	
			}
			else{
				for(var i = 0; i < this.networks.length; i++){
				if(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase() == "TWITTER")
					this.positionFakeTw = i	
				}
			this.buttons.push({"id":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.alias,"text":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.description,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFakeTw].CatalogSocialNetworkVO.alias+".jpg","badge":"img/admin/socialNetworks/1x1-desvinculado.png","isLinked":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.isLinked,"isMain":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Twitter.png"});
			}
	}
	else{
			for(var i = 0; i < this.networks.length; i++){
				if(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase() == "TWITTER")
					this.positionFakeTw = i	
				}
			this.buttons.push({"id":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.alias,"text":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.description,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFakeTw].CatalogSocialNetworkVO.alias+".jpg","badge":"img/admin/socialNetworks/1x1-desvinculado.png","isLinked":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.isLinked,"isMain":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Twitter.png"});
	}
		
		if(this.positionIns>=0)	{	
			this.aliasIns = this.networks[this.positionIns].CatalogSocialNetworkVO.alias.toUpperCase();
			this.textIns = this.networks[this.positionIns].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO.user;
				if(this.aliasIns!=undefined && this.textIns != undefined){
						this.home.getNetworkImage(this.networks[this.positionTw].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO);
						this.buttons.push({"id":this.aliasIns,"text":this.textIns,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionIns].CatalogSocialNetworkVO.alias+".jpg","isLinked":this.networks[this.positionIns].CatalogSocialNetworkVO.isLinked,"badge":"img/admin/socialNetworks/1x1-vinculado.png","isMain":this.networks[this.positionIns].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionIns].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_instagram.png"});	
					}
				this.buttons.push({"id":aliasIns,"text":tpng.user.profile.userName,"badge":"","img":tpng.user.profile.networkImgL,"isLinked":this.networks[this.positionIns].CatalogSocialNetworkVO.isLinked,"badge":"img/admin/socialNetworks/1x1-vinculado.png","isMain":this.networks[this.positionIns].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionIns].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_instagram.png"});	
		}
		else{
				for(var i = 0; i < this.networks.length; i++){
				if(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase() == "INSTAGRAM")
					this.positionFakeIns = i	
				}
			this.buttons.push({"id":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.alias,"text":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.description,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFakeIns].CatalogSocialNetworkVO.alias+".jpg","badge":"img/admin/socialNetworks/1x1-desvinculado.png","isLinked":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.isLinked,"isMain":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_instagram.png"});
		}
		
		var w = this.widgets;
				w.bg.setData();
				w.header.setData({"title":"Redes Sociales","sub":"Selecciona la red social a vincular"});
				w.socialN.setData(this.buttons);
				w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
				
					if(this.buttons.length > 6){
						this.state = "exit_6";
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
						this.state = "enter_6";
						w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
						w.leftArrow.stateChange("enter");	
						w.socialN.stateChange("enter");
						w.socialN.setFocus(true);
						w.bg.stateChange("enter");
						w.header.stateChange("enter");
				
					}else{
						this.state = "exit_"+this.buttons.length;
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
					    this.state = "enter_"+this.buttons.length;
					    w.rightArrow.setData({"url":"", "line": true, "position": "right"});
					    w.rightArrow.stateChange(this.state);
					    w.leftArrow.stateChange("enter");	
						w.socialN.stateChange("enter");
						w.socialN.setFocus(true);
						w.bg.stateChange("enter");
						w.header.stateChange("enter");	
					}
	}else if(response.error){	
		this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false,,true);
	}
}

socialNetworks.prototype.responseRegetSocialN = function responseRegetSocialN(response){
	if(response.status == 200){
		this.networks = response.data.ResponseVO.arrayNets;
		for(var i = 0; i < this.networks.length; i++){
			switch(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase()){
				case "FACEBOOK":
					if(this.networks[i].CatalogSocialNetworkVO.isLinked){
						this.positionFb = i	
					}			
				break;
				
				case "TWITTER":
					if(this.networks[i].CatalogSocialNetworkVO.isLinked){
						this.positionTw = i;
					}
				break;
				
				case "INSTAGRAM":
					if(this.networks[i].CatalogSocialNetworkVO.isLinked){
						this.positionIns = i;
					}
				break;
			}	
		}
		//FACEBOOK
		if(this.positionFb>=0){	
			var aliasFb = this.networks[this.positionFb].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO.alias;
			var text = this.networks[this.positionFb].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO.user;

			if(aliasFb!=undefined && text != undefined){
					this.home.getNetworkImage(this.networks[this.positionFb].CatalogSocialNetworkVO.SocialNetwork.SocialNetworkVO);
					this.buttons.push({"id":aliasFb,"text":text,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFb].CatalogSocialNetworkVO.alias+".jpg","isLinked":this.networks[this.positionFb].CatalogSocialNetworkVO.isLinked,"badge":"img/admin/socialNetworks/1x1-vinculado.png","isMain":this.networks[this.positionFb].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFb].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Facebook.png"});	
			}
			else{
				for(var i = 0; i < this.networks.length; i++){
				if(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase() == "FACEBOOK")
					this.positionFakeFb = i	
				}
			this.buttons.push({"id":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.alias,"text":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.description,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFakeFb].CatalogSocialNetworkVO.alias+".jpg","badge":"img/admin/socialNetworks/1x1-desvinculado.png","isLinked":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.isLinked,"isMain":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Facebook.png"});
			}
		}
		else{
				for(var i = 0; i < this.networks.length; i++){
				if(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase() == "FACEBOOK")
					this.positionFakeFb = i	
				}
			this.buttons.push({"id":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.alias,"text":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.description,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFakeFb].CatalogSocialNetworkVO.alias+".jpg","badge":"img/admin/socialNetworks/1x1-desvinculado.png","isLinked":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.isLinked,"isMain":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFakeFb].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Facebook.png"});
		}
		
		if(this.positionTw>=0){	
			var aliasTw = this.networks[this.positionTw].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO.alias;
			var text = this.networks[this.positionTw].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO.user;

			if(aliasTw!=undefined && text != undefined){
				this.home.getNetworkImage(this.networks[this.positionTw].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO);
				this.buttons.push({"id":aliasTw,"text":text,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionTw].CatalogSocialNetworkVO.alias+".jpg","isLinked":this.networks[this.positionTw].CatalogSocialNetworkVO.isLinked,"badge":"img/admin/socialNetworks/1x1-vinculado.png","isMain":this.networks[this.positionTw].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionTw].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Twitter.png"});	
			}
			else{
				for(var i = 0; i < this.networks.length; i++){
				if(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase() == "TWITTER")
					this.positionFakeTw = i	
				}
			this.buttons.push({"id":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.alias,"text":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.description,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFakeTw].CatalogSocialNetworkVO.alias+".jpg","badge":"img/admin/socialNetworks/1x1-desvinculado.png","isLinked":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.isLinked,"isMain":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Twitter.png"});
			}
		}
		else{
				for(var i = 0; i < this.networks.length; i++){
				if(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase() == "TWITTER")
					this.positionFakeTw = i	
				}
			this.buttons.push({"id":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.alias,"text":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.description,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFakeTw].CatalogSocialNetworkVO.alias+".jpg","badge":"img/admin/socialNetworks/1x1-desvinculado.png","isLinked":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.isLinked,"isMain":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFakeTw].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_Twitter.png"});
		}
		
		if(this.positionIns>=0){	
			var aliasIns = this.networks[this.positionIns].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO.alias;
			var text = this.networks[this.positionIns].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO.user;

			if(aliasIns!=undefined && text != undefined){
				this.home.getNetworkImage(this.networks[this.positionIns].CatalogSocialNetworkVO.socialNetwork.SocialNetworkVO);
				this.buttons.push({"id":aliasIns,"text":text,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionIns].CatalogSocialNetworkVO.alias+".jpg","isLinked":this.networks[this.positionIns].CatalogSocialNetworkVO.isLinked,"badge":"img/admin/socialNetworks/1x1-vinculado.png","isMain":this.networks[this.positionIns].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionIns].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_instagram.png"});	
			}
			else{
				for(var i = 0; i < this.networks.length; i++){
				if(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase() == "INSTAGRAM")
					this.positionFakeIns = i	
				}
			this.buttons.push({"id":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.alias,"text":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.description,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFakeIns].CatalogSocialNetworkVO.alias+".jpg","badge":"img/admin/socialNetworks/1x1-desvinculado.png","isLinked":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.isLinked,"isMain":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_instagram.png"});
			}
		}
		else{
				for(var i = 0; i < this.networks.length; i++){
				if(this.networks[i].CatalogSocialNetworkVO.alias.toUpperCase() == "INSTAGRAM")
					this.positionFakeIns = i	
				}
			this.buttons.push({"id":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.alias,"text":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.description,"badge":"","img":tpng.backend.url+"img/nets/"+this.networks[this.positionFakeIns].CatalogSocialNetworkVO.alias+".jpg","badge":"img/admin/socialNetworks/1x1-desvinculado.png","isLinked":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.isLinked,"isMain":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.isMain,"urlLink":this.networks[this.positionFakeIns].CatalogSocialNetworkVO.urlLink,"icon":"img/admin/socialNetworks/icono_instagram.png"});
		}
		
		var w = this.widgets;
				w.bg.setData();
				w.header.setData({"title":"Redes Sociales","sub":"Selecciona la red social a vincular"});
				w.socialN.setData(this.buttons);
				w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
				
					if(this.buttons.length > 6){
						this.state = "exit_6";
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
						this.state = "enter_6";
						w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
						w.leftArrow.stateChange("enter");	
						w.socialN.stateChange("enter");
						w.socialN.setFocus(true);
						w.bg.stateChange("enter");
						w.header.stateChange("enter");
				
					}else{
						this.state = "exit_"+this.buttons.length;
						w.rightArrow.setData({"url":"", "line": false, "position": "right"});
						w.rightArrow.stateChange(this.state);
					    this.state = "enter_"+this.buttons.length;
					    w.rightArrow.setData({"url":"", "line": true, "position": "right"});
					    w.rightArrow.stateChange(this.state);
					    w.leftArrow.stateChange("enter");	
						w.socialN.stateChange("enter");
						w.socialN.setFocus(true);
						w.bg.stateChange("enter");
						w.header.stateChange("enter");	
					}
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false,,true);
	}
}

/*
socialNetworks.prototype.getNetworkImage = function getNetworkImage(_network){
	var alias = _network.alias + "";
	//NGM.dump(alias);
	switch(alias.toLowerCase()){
		case "instagram":
			//var user_id = _network.value2;
			//var token = _network.value1;
			//var url = "https://api.instagram.com/v1/users/"+user_id+"/?access_token="+token;
			//tp_httpRequest.getSingleton().send(url, this.responseGetImageNetwork.bind(this));
		break;
		case "twitter":
			//var access_token = _network.value1;
			//var access_token_secret = _network.value2;
			//this.tw.getUser_linked(access_token,access_token_secret,this.getUser_linked.bind(this));
		//	NGM.trace("IMAGEN TWITTER.-,-.-..-.-,-..-,-.-,,-.-..-,-,-.-");
			//NGM.dump(this.picTw);
		break;
		case "facebook":
			
			//var username = _network.value2;
			
			//tpng.user.profile.networkImg = "http://graph.facebook.com/"+username+"/picture?type=small";
			//tpng.user.profile.networkImgL = "http://graph.facebook.com/"+username+"/picture?type=large";
			//tpng.user.profile.networkAlias = _network.user + "";
		break;
	}
}

socialNetworks.prototype.getUser_linked = function getUser_linked(responseCode, profile){
	if(responseCode.status == 200){
			var data = profile;
			this.picTw = data.profile_image_url.replace("_normal","");
			NGM.dump(this.picTw);
						//tpng.user.profile.networkImg = data.profile_image_url;
			//tpng.user.profile.networkImgL = data.profile_image_url.replace("_normal","");
			//tpng.user.profile.networkAlias = "@" + data.screen_name;
	}else{
		NGM.trace("error");
	}
}


socialNetworks.prototype.responseGetImageNetwork = function responseGetImageNetwork(response_err, responseCode){
	if(responseCode.status == 200){
		var data = responseCode.responseObject.data;
		tpng.user.networkImg = data.profile_picture;
		tpng.user.profile.userName = data.username;
	}else{
		NGM.trace("error");
	}
}*/


 
socialNetworks.prototype.checkStatus = function checkStatus(_token){
	var parameters = ["token="+_token];
	getServices.getSingleton().call("ADMIN_CHECK_STATUS_CODE",parameters,this.getResponseStatusCode.bind(this));
}

socialNetworks.prototype.getResponseStatusCode = function getResponseStatusCode(response){
	var w = this.widgets;
	if(response.status == 200){	
		var r = response.data.ResultVO;
		//NGM.dump(r);
		switch(r.status){
			case 0:
				//NADA PORQUE ESTÁ ESPERANDO
			break;
			
			case -1:
				w.showCode.setData({"id":w.socialN.selectItem.id,"code":"Código expirado.","link":"","img":this.img,"text1":"El código ha caducado, inténtalo de nuevo.||","text2":"||Presiona MENU/Back para salir.","text3":""});
				w.showCode.refresh();
				unsetTimeAlarm(this.checkStatusId);
			break;
			
			case -2:
			unsetTimeAlarm(this.checkStatusId);
			
			tpng.user.profile.network = w.socialN.selectItem.id+"";
			tpng.user.profile.userName = r.alias;
			tpng.user.profile.value1 = r.value1;
			tpng.user.profile.value2 = r.value2;
			tpng.user.profile.value3 = r.value3;
			
				
			var data = [];
			data.alias = w.socialN.selectItem.id;
			data.value1 = r.value1;
			data.value2 = r.value2;
			data.user = r.alias;
			this.home.getNetworkImage(data);
			
			
			switch(w.socialN.selectItem.id){
				case "facebook":
					this.idFb = w.socialN.selectItem.id;
					this.userFb = r.alias;
					this.value1Fb = r.value1;
					this.value2Fb = r.value2;
					this.value3Fb = r.value3;
					this.picFb = tpng.user.profile.networkImgL;
				break;
				
				case "twitter":
					this.idTw = w.socialN.selectItem.id;
					this.userTw = r.alias;
					this.value1Tw = r.value1;
					this.value2Tw = r.value2;
					this.value3Tw = r.value3;
					this.picTw = tpng.user.profile.networkImgL;
				break;
				
				case "instagram":
					this.idIns = w.socialN.selectItem.id;
					this.userIns = r.alias;
					this.value1Ins = r.value1;
					this.value2Ins = r.value2;
					this.value3Ins = r.value3;
					this.picIns = tpng.user.profile.networkImgL;
				break;
			
			
			}
			
			
			//CHECAR AQUÍ PARA ENVIAR EL VALOR A LA FUNCIÓN DEL HOME Y DESPUÉS VER COMO REPINTAR LA IMAGEN Y EL NOMBRE DE USUARIO IGUAL AL DESVINCULAR
			//NGM.dump(data);
			
				//NGM.dump(tpng.user.profile);
				//if(tpng.user.profile.network){ //validar si hay alguna vinculada
					//this.home.getNetworkImage(data);
				//}
				w.showCode.setData({"id":w.socialN.selectItem.id,"code":"||Vinculación exitosa.","link":"","img":this.img,"text1":"","text2":"Bienvenido "+tpng.user.profile.userName+".","text3":"|||Presiona MENU/Back para salir."});
				w.showCode.refresh();
			break;
			
			default:
			
			break;
			
		}
	}else{	
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false,,true);
	}
}






socialNetworks.prototype.responseGetCode = function responseGetCode(response){
	var w = this.widgets;
	if(response.status == 200){
		switch(w.socialN.selectItem.id){
			case "facebook":
				this.img = "img/admin/socialNetworks/FacebookLOGIN.jpg";
			break;
									
			case "twitter":
				this.img = "img/admin/socialNetworks/TwitterLOGIN.jpg";
			break;
									
			case "instagram":
				this.img = "img/admin/socialNetworks/InstagramLOGIN.jpg";
			break;
		}
		w.showCode.setData({"id":w.socialN.selectItem.id,"code":response.data.ResultVO.token,"link":w.socialN.selectItem.urlLink,"img":this.img,"text1":"Para usar esta App en Totalplay necesitas:|1. Ingresar desde tu computadora o tableta a: <!b>","text2":"<!>|2. Ingresa este código:||<!b>","text3":"<!>|| Y espera unos minutos..."});
		w.showCode.stateChange("enter");
		w.bg.stateChange("exit");
		w.header.stateChange("exit");
		w.socialN.stateChange("exit");
		w.leftArrow.stateChange("exit");
		w.rightArrow.stateChange("exit");
		this.focus = "linkFb";
		this.checkStatusId = this.checkStatus.bind(this).repeat(6*1000,this,response.data.ResultVO.token+"");				
		
	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false,,true);
	}
}

socialNetworks.prototype.responseUnlink = function responseUnlink(response){
	var w = this.widgets;
	if(response.status == 200){
		w.socialN.stateChange("exit");
		w.header.stateChange("exit");
		w.leftArrow.stateChange("exit");
		w.rightArrow.stateChange("exit");
		w.showCode.stateChange("exit");
		this.buttons = [];
   		this.focus = "socialN";
  		this.networks = "";
  		tpng.user.profile.network = null;
		tpng.user.profile.userName = null;
		tpng.user.profile.value1 = null;
		tpng.user.profile.value2 = null;
		tpng.user.profile.value3 = null;
		this.positionFb = "";
		this.positionTw = "";
		this.positionIns = "";
		//CHECAR ESTE PARA LA DESVINCULACIÓN
		this.home.hideHeader();
		this.reEnter();

	}else if(response.error){	
			this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false,,true);
	}
}

socialNetworks.prototype.openNextSection = function openNextSection(_allow){
	var w = this.widgets;
	if(_allow){
		var alias = w.socialN.selectItem.id.toLowerCase();
		var params = ["aliasApp="+alias+"&alias=null&value1=null&value2=null&value3=null&event=2"];
					getServices.getSingleton().call("ADMIN_UNLINK_SOCIAL",params, this.responseUnlink.bind(this));
	}
	else{
	
	}
	
	
	
}

socialNetworks.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
		switch(this.focus){
			case "search":	
				switch(_key){
					case "KEY_DOWN":
					case "KEY_MENU":
					case "KEY_IRBACK":
						this.focus = "socialN";
						this.home.disableSearchHeader();
						w.socialN.setFocus(true);
					break;
					
					default:
						this.home.onKeyPress(_key);
					break;
				}
			break;
			
			case "socialN":
				switch(_key){		
					case "KEY_LEFT":
					case "KEY_RIGHT":			
						_key == "KEY_LEFT"
						if(_key == "KEY_LEFT"){
							if(w.socialN.scrollPrev()){
								
								if(w.socialN.maxItem > 6){		
											if(w.socialN.selectIndex >= 6){
												w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
												w.leftArrow.stateChange("enter");
											}
											if(w.socialN.selectIndex == (w.socialN.maxItem-1)){
												w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
												w.rightArrow.stateChange(this.state);
											}
											if(w.socialN.selectIndex == 0){
												w.leftArrow.setData({"url":"", "line":true, "position": "left"});
												w.leftArrow.stateChange("enter");
											}
											if(w.socialN.selectIndex+1 <= w.socialN.maxItem-6){
												w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
												w.rightArrow.stateChange(this.state);
											}
								}
							}
						}
						else{
							if(w.socialN.scrollNext()){
								if(w.socialN.maxItem > 6){		
											if(w.socialN.selectIndex >= 6){
												w.leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
												w.leftArrow.stateChange("enter");
											}
											if(w.socialN.selectIndex == (w.socialN.maxItem-1)){
												w.rightArrow.setData({"url": "" ,"line":true, "position": "right"});
												w.rightArrow.stateChange(this.state);
											}
											if(w.socialN.selectIndex == 0){
												w.leftArrow.setData({"url":"", "line":true, "position": "left"});
												w.leftArrow.stateChange("enter");
											}
											if(w.socialN.selectIndex < 4 && w.socialN.maxItem-3){
												w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
												w.rightArrow.stateChange(this.state);
											}	
								}
							}
						}	
					break;
					
					case "KEY_IRENTER":
						switch(w.socialN.selectItem.id){
							case "r":
								w.bg.stateChange("exit");
								w.header.stateChange("exit");
								w.socialN.stateChange("exit");
								w.leftArrow.stateChange("exit");
								w.rightArrow.stateChange("exit");
								this.home.hideHeader();
								this.home.closeSection(this);
							break;
							
							default:
								if(w.socialN.selectItem.isLinked){
										switch(w.socialN.selectItem.id){
											case "FACEBOOK":
												this.home.openSection("confirm",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":"¿Deseas desvincular la cuenta "+w.socialN.selectItem.text+" ?", "txt1": "Eliminar Facebook de: "+tpng.user.profile.alias, "txt2": "", "txt3": ""}}, false,null,true);
											break;
											
											case "TWITTER":
												this.home.openSection("confirm",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":"¿Deseas desvincular la cuenta "+w.socialN.selectItem.text+" ?", "txt1": "Eliminar Twitter de: "+tpng.user.profile.alias, "txt2": "", "txt3": ""}}, false,null,true);
											break;
											
											case "INSTAGRAM":
												this.home.openSection("confirm",{"home":this.home, "formP":this, "formData":{"nipRoot": true, "title":"¿Deseas desvincular la cuenta "+w.socialN.selectItem.text+" ?", "txt1": "Eliminar Instagram de: "+tpng.user.profile.alias, "txt2": "", "txt3": ""}}, false,null,true);
											break;
										
										}
									
								}
								else{
									this.home.hideHeader();
									var params =["aliasApp="+w.socialN.selectItem.id];
										getServices.getSingleton().call("ADMIN_GET_SOCIAL_CODE",params, this.responseGetCode.bind(this));
								}							
							break;	
						}
					break;
					
					case "KEY_MENU":
					case "KEY_IRBACK":
						w.bg.stateChange("exit");
						w.socialN.stateChange("exit");
						w.header.stateChange("exit");
						w.leftArrow.stateChange("exit");
						w.rightArrow.stateChange("exit");
						this.home.hideHeader();
						this.home.closeSection(this);
					break;
					
					case "KEY_UP":
						this.focus = "search";
						this.home.enableSearchHeader();
						w.socialN.setFocus(false);
				
					break;
				}	
				break;
				
				case "linkFb":
					switch(_key){
						case "KEY_MENU":
						case "KEY_IRBACK":
							w.showCode.stateChange("exit");
							this.buttons = [];
   							this.focus = "socialN";
  							this.networks = "";
							this.home.hideHeader();
							
							this.reEnter();
							unsetTimeAlarm(this.checkStatusId);
						break;
					}
				break;
			}
	return true;				
}




socialNetworks.drawSocialN = function drawSocialN(_data){
	
		this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		
		//imagen
		tp_draw.getSingleton().drawImage(_data.img, ctx, 5, 5, 186, 176, null,"destination-over");
		
		
		  if(_data.text == "Regresar"){
			Canvas.drawShape(ctx, "rect", [5,5, ctx.viewportWidth-10, ctx.viewportHeight-10], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
		}
		
		//panel negro no foco
		if(_data.text != "Regresar"){
	/*
			var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
			custo.fill = "0-rgba(30,30,40,.5)|1-rgba(30,30,40,1)";
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], custo);
	*/
		}
		
		
		//título
	    var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
		custo_f.text_align = "center,middle";
		custo_f.font_size = 20* tpng.thema.text_proportion;
		custo_f.fill = "rgba(255,240,200,1)";	
		Canvas.drawText(ctx, _data.text+"", new Rect(64,3,120,ctx.viewportHeight-6), custo_f);
		if(_data.isLinked){
				if(_data.text == "Regresar"){}
				else{
				Canvas.drawShape(ctx, "rect", [0,144,186,32], {"fill":"0-rgba(250,180,60,1)|1-rgba(130,90,30,1)"});
				custo_f.text_align = "center,middle";
				custo_f.font_size = 18* tpng.thema.text_proportion;
				custo_f.fill = "rgba(255,255,255,1)";	
				Canvas.drawText(ctx, "Vinculada", new Rect(0,144,186,32), custo_f);
				}
			}	
		
		
		//badge	
		tp_draw.getSingleton().drawImage(_data.badge, ctx, 2, 72, null, null, null);			
		//icono red
		tp_draw.getSingleton().drawImage(_data.icon, ctx, 154, 9,null,null, null);
			
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

socialNetworks.drawBgSocialN = function drawBgSocialN(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight-1], custo);
		 ctx.drawObject(ctx.endObject());
}

socialNetworks.drawShowCode = function drawShowCode(_data){

	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0,null, null, null,"destination-over");
		
		 var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);
			custo_f.text_align = "center,middle";
			custo_f.font_size = 20* tpng.thema.text_proportion;
			if(_data.id == "instagram"){
				custo_f.fill = "rgba(30,30,40,1)";
			}
			else{
				custo_f.fill = "rgba(240,240,250,1)";	
			}
			if(_data.code == "Código expirado."){
				Canvas.drawText(ctx,_data.text1+_data.code+_data.text2, new Rect(0,432,ctx.viewportWidth,250), custo_f);
			}
			else if(_data.code == "Vinculación exitosa."){
				Canvas.drawText(ctx,_data.text2+_data.code+_data.text3, new Rect(0,432,ctx.viewportWidth,250), custo_f);
			}else if(_data.code != "Vinculación exitosa."){
				Canvas.drawText(ctx,_data.text1+_data.link+_data.text2+_data.code+_data.text3, new Rect(0,432,ctx.viewportWidth,250), custo_f);
			}		 
		 ctx.drawObject(ctx.endObject());
}

socialNetworks.drawHeaderS = function drawHeaderS(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    var custo_t = JSON.stringify(this.themaData.standardFont);
		custo_t = JSON.parse(custo_t);
		custo_t.text_align = "left,top";
		custo_t.font_size = 24* tpng.thema.text_proportion;
		custo_t.fill = "rgba(240,240,250,1)";
		Canvas.drawText(ctx, _data.title, new Rect(0,0,ctx.viewportWidth-67,ctx.viewportHeight-6), custo_t);
		custo_t.font_size = 20* tpng.thema.text_proportion;	
		Canvas.drawText(ctx, _data.sub, new Rect(64,38,ctx.viewportWidth-131,ctx.viewportHeight-44), custo_t);
		
		
		ctx.drawObject(ctx.endObject());
}


socialNetworks.drawArrowsS = function drawArrows(_data){
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


