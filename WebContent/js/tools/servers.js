// mosaic.js
function servers(_json, _options){
    this.super(_json, _options);
    
    this.WL_servers = [
    	{"name": "node_01" , "ip": "http://10.1.0.58:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},		
		{"name": "node_02" , "ip": "http://10.1.0.58:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_03" , "ip": "http://10.1.0.59:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_04" , "ip": "http://10.1.0.59:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_05" , "ip": "http://10.1.0.60:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_06" , "ip": "http://10.1.0.60:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_07" , "ip": "http://10.1.0.61:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_08" , "ip": "http://10.1.0.61:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_09" , "ip": "http://10.1.0.62:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_10" , "ip": "http://10.1.0.62:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_11" , "ip": "http://10.1.0.63:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_12" , "ip": "http://10.1.0.63:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_13" , "ip": "http://10.1.0.64:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_14" , "ip": "http://10.1.0.64:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_15" , "ip": "http://10.1.0.65:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_16" , "ip": "http://10.1.0.65:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_17" , "ip": "http://10.1.0.66:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_18" , "ip": "http://10.1.0.66:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_19" , "ip": "http://10.1.0.67:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_20" , "ip": "http://10.1.0.67:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_21" , "ip": "http://10.1.0.68:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_22" , "ip": "http://10.1.0.68:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_23" , "ip": "http://10.1.0.69:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_24" , "ip": "http://10.1.0.69:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_25" , "ip": "http://10.1.0.70:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_26" , "ip": "http://10.1.0.70:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_27" , "ip": "http://10.1.0.71:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_28" , "ip": "http://10.1.0.71:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_29" , "ip": "http://10.1.0.72:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_30" , "ip": "http://10.1.0.72:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_31" , "ip": "http://10.1.0.73:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_32" , "ip": "http://10.1.0.73:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_33" , "ip": "http://10.1.0.74:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_34" , "ip": "http://10.1.0.74:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_35" , "ip": "http://10.1.0.75:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_36" , "ip": "http://10.1.0.75:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_37" , "ip": "http://10.1.0.76:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_38" , "ip": "http://10.1.0.76:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_39" , "ip": "http://10.1.0.77:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_40" , "ip": "http://10.1.0.77:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		//NUEVOS NODOS
		{"name": "node_41" , "ip": "http://10.1.0.83:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_42" , "ip": "http://10.1.0.83:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_43" , "ip": "http://10.1.0.84:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_44" , "ip": "http://10.1.0.84:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_45" , "ip": "http://10.1.0.85:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_46" , "ip": "http://10.1.0.85:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_47" , "ip": "http://10.1.0.86:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_48" , "ip": "http://10.1.0.86:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_49" , "ip": "http://10.1.0.87:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_50" , "ip": "http://10.1.0.87:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},		
		{"name": "node_51" , "ip": "http://10.1.0.88:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_52" , "ip": "http://10.1.0.88:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_53" , "ip": "http://10.1.0.89:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_54" , "ip": "http://10.1.0.89:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_55" , "ip": "http://10.1.0.90:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_56" , "ip": "http://10.1.0.90:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_57" , "ip": "http://10.1.0.91:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_58" , "ip": "http://10.1.0.91:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_59" , "ip": "http://10.1.0.92:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_60" , "ip": "http://10.1.0.92:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_61" , "ip": "http://10.1.0.93:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_62" , "ip": "http://10.1.0.93:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_63" , "ip": "http://10.1.0.94:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_64" , "ip": "http://10.1.0.94:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},		
		{"name": "node_65" , "ip": "http://10.1.0.94:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_66" , "ip": "http://10.1.0.94:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_67" , "ip": "http://10.1.0.95:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_68" , "ip": "http://10.1.0.95:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_69" , "ip": "http://10.1.0.96:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_70" , "ip": "http://10.1.0.96:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_71" , "ip": "http://10.1.0.97:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_72" , "ip": "http://10.1.0.97:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_73" , "ip": "http://10.1.0.98:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_74" , "ip": "http://10.1.0.98:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_75" , "ip": "http://10.1.0.99:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_76" , "ip": "http://10.1.0.99:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_77" , "ip": "http://10.1.0.100:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_78" , "ip": "http://10.1.0.100:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_79" , "ip": "http://10.1.0.101:9901/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null},
		{"name": "node_80" , "ip": "http://10.1.0.101:9902/TPMCOREWeb/", "status": 0, "ms": 0, "url": "", "error": null}
	   
    ];
   
	this.WL_servers_initial = this.WL_servers;
	
}

servers.inherits(FormWidget);


servers.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	
	var url = "img/commons/0x0-Back_Wood-BW_HD.jpg";
	this.home.setBg(url);
	this.home.showHeader({"section":this});
	
	/*
	if(tpng.user.profile.isTest == "Y" && !tpng.user.unlock){
		this.showNipPanel();	
	}else{
		this.getBEServices();	
	}	
	*/
	
	if(tpng.user.profile.isTest && !tpng.user.unlock){
		var title = "Sección Restringida, para continuar es necesario que ingreses el codigo de seguridad"
		this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"nipRoot": "","nipTest":true, "title":title, "txt1":"", "txt2":"", "txt3":"","txt4":""}}, false,null,true);	
	}else{
		//this.getVodList();
		this.getBEServices();
	}
	
		
}

servers.prototype.openNextSection = function openNextSection(_status,_nip){
	if(_status){
		this.getBEServices();
	}else{
		this.home.closeSection(this);
	}

}

servers.prototype.showNipPanel = function showNipPanel(){
		
		var nipPanel = this.widgets.nipPanelBg,
			pass = this.widgets.nip01_topInput;
		
		nipPanel.setData();
		nipPanel.stateChange("enter");
		pass.setData();
		pass.stateChange("enter");
		pass.setFocus(true);
		this.frame = "nip";
}

servers.prototype.hideNipPanel = function hideNipPanel(){
		
		var nipPanel = this.widgets.nipPanelBg,
			pass = this.widgets.nip01_topInput;
			
			nipPanel.stateChange("exit");
			pass.stateChange("exit");
		
}




servers.prototype.getBEServices = function getBEServices (_data){
	var services = getServices.getSingleton().backEndServices;
	var servicesList = this.widgets.BEServices;
	var servicesHeader = this.widgets.servicesHeader;
	var header = this.widgets.parametersHeader;
	
	
	var tmp = [];
	
	
	for (var name in services) {
	  if(services[name].isMon)
	  	tmp.push({"id": name, "service":services[name].service , "type":services[name].type, "section":services[name].section, "description":services[name].description, "params":services[name].params});
	}
	tmp.sort();
	services = tmp;
	
	
	servicesHeader.setData({"title": "Servicios TPMCORE"});
	header.setData({"title": "Parámetros: "});
	servicesList.setData(services,0);
	
	this.client.lock();
		servicesHeader.stateChange("enter");	
		servicesList.stateChange("enter");		
		header.stateChange("enter");
	this.client.unlock();
	
	this.frame = "services";
}

servers.onFocusParams = function onFocusParams(_focus, _data){
	if(_focus){		
		var i = _data.index;
		var w = this.widgets;
		switch(i){
			case 0:
				if(this.selectInput)
					this.selectInput.setFocus(false);
				this.selectInput = w.param_1;
				this.selectInput.setFocus(true);
				
			break;
			case 1:
				if(this.selectInput)
					this.selectInput.setFocus(false);
				this.selectInput = this.widgets.param_2;
				this.selectInput.setFocus(true);
			break;
			case 2:
				if(this.selectInput)
					this.selectInput.setFocus(false);
				this.selectInput = this.widgets.param_3;
				this.selectInput.setFocus(true);
			break;
		}
		
	}
}


servers.onFocusServices = function onFocusServices(_focus, _data){
	if(_focus){		
			var parameters = this.widgets.parameters;
			var w = this.widgets;
			w.param_1.setData();
			w.param_1.stateChange("exit");
			w.param_2.setData();
			w.param_2.stateChange("exit");
			w.param_3.setData();
			w.param_3.stateChange("exit");
			
			if(_data.item.params.length > 0){				

				parameters.setData(_data.item.params);
				parameters.setFocus(false);
				parameters.stateChange("enter");
				
				for(var i = 0, l = _data.item.params.length; i < l; i++){
					switch(i){
						case 0:
							if(_data.item.params[i] == "ts")
								w.param_1.setData(new Date().getTime());
							else
								w.param_1.setData();
							w.param_1.stateChange("enter");
							w.param_1.setFocus(false);
						break;
						case 1:
							if(_data.item.params[i] == "ts")
								w.param_2.setData(new Date().getTime());
							else
								w.param_2.setData();
							w.param_2.setData();
							w.param_2.stateChange("enter");
							w.param_2.setFocus(false);
						break;
						case 2:
							if(_data.item.params[i] == "ts")
								w.param_3.setData(new Date().getTime());
							else
								w.param_3.setData();
							w.param_3.setData();
							w.param_3.stateChange("enter");
							w.param_3.setFocus(false);
						break;
					}
				}
				
			}else{
				parameters.setData();
				parameters.setFocus(false);
				parameters.stateChange("exit");
			}			
	}	
}


servers.prototype.onKeyPress = function onKeyPress(_key){	
	switch(this.frame){
			case "services":
				this.onKeyPressServices(_key); 
			break;
			case "params":
				this.onKeyPressParams(_key); 
			break;
			case "request":
				this.onKeyPressRequest(_key); 
			break;
			case "nip":
				this.onKeyPressNip(_key); 
			break;
			
    }
    return true;
}



servers.prototype.onKeyPressServices = function onKeyPressServices(_key){	
	var servicesList = this.widgets.BEServices;
	var params = this.widgets.parameters;
	var w = this.widgets;
	switch(_key){
		case "KEY_UP":
			servicesList.scrollPrev();
		break; 
		case "KEY_DOWN":			
			servicesList.scrollNext();
		break;	
		case "KEY_RIGHT":			
			var p = servicesList.selectItem.params;
			
			servicesList.setFocus(false);			
			params.setFocus(true);
			
			if(p.length > 0){
				w.param_1.setFocus(true);			
			}
			this.frame = "params";
			
		break;	
		 case "KEY_IRBACK":
		 case "KEY_MENU":	
		 	this.home.hideBg();	
			this.home.hideHeader();		
			this.home.closeSection(this);
		break;	
		case "KEY_IRENTER":
			var p = servicesList.selectItem.params;
			if(p.length == 0)
				this.startServices();
		break;
		   	
	}
	return true;	
}

servers.prototype.onKeyPressParams = function onKeyPressParams(_key){	
	var servicesList = this.widgets.BEServices;
	var params = this.widgets.parameters;
	switch(_key){
		case "KEY_UP":
			params.scrollPrev();
		break; 
		case "KEY_IRENTER":
		case "KEY_DOWN":			
			if(params.selectIndex < (params.maxItem-1)){
				if(this.selectInput.getData())
					params.scrollNext();
			}else{
				if(this.selectInput)
					this.selectInput.setFocus(false);
				this.startServices();
			}
		break;	
		case "KEY_LEFT":			
			
			params.setFocus(false);
			this.frame = "services";
			servicesList.setFocus(true);
			
			
		break;	
		 case "KEY_IRBACK":
		 case "KEY_MENU":
		 	this.home.hideBg();	
			this.home.hideHeader();		
			this.home.closeSection(this);
		break;	
		default:
		   if (this.selectInput.isFocused()) {
		        var keyHandled = this.selectInput.keyHandler(_key);
		    }
        break;
		   	
	}
	return true;	
}

servers.prototype.onKeyPressRequest = function onKeyPressRequest(_key){	
	
	var r = this.widgets.requests;
	var d = this.widgets.detail;
	
	switch(_key){
		case "KEY_UP":
			r.scrollPrev();
		break; 			
		case "KEY_DOWN":			
			r.scrollNext();
		break;			
		case "KEY_IRENTER":			
			if(r.selectItem.error){
				d.setData(r.selectItem);
				d.stateChange("enter");	
				this.f = "detail";	
			}
				
		break;
		
		case "KEY_IRBACK":
			if(this.f == "detail"){
				d.stateChange("exit");
				this.f = "request";
			}else			
				this.hideRequests();
		break;	
		
		   	
	}
	return true;	
}

servers.prototype.onKeyPressNip = function onKeyPressNip(_key){	
	var nipPanel = this.widgets.nipPanelBg,
		pass = this.widgets.nip01_topInput;	
	
	switch(_key){
		case "KEY_IRBACK":			
			this.home.closeSection(this);
		break;
		
		case "KEY_IRENTER":
			if(pass.getData() == tpng.app.unlock_pass){
					tpng.user.unlock = true; //desbloqueado para que no vuelva a pedirle el nip (al menos hasta q entre al menú)
					this.hideNipPanel();
					this.getBEServices();
					pass.setFocus(false);
				}else{						
					nipPanel.setData({"error":true})
					pass.setData();				
				}		
		break;
		
		default:
		   if (pass.isFocused()) {
		        var keyHandled = pass.keyHandler(_key);
		    }
        break;	
		
		   	
	}
	return true;	
}

servers.prototype.hideRequests = function hideRequests(){
	var r = this.widgets.requests;
	var header = this.widgets.requestHeader;
	var services = this.widgets.BEServices;
	this.WL_servers = [];
	
	r.setData(this.WL_servers);
	r.stateChange("exit");
	this.WL_servers = this.WL_servers_initial.concat(this.WL_servers);
	
	header.stateChange("exit");
	services.setFocus(true);
	this.frame = "services";

}



servers.prototype.startServices = function startServices(_data){
	
	NGM.trace("lalalallala");
	
	var p = this.widgets.parameters.list;
	var services = this.widgets.BEServices;
	var s = services.list[services.selectIndex];
	if(p.length > 0)	
		var params = [];
	else
		var params = null;
		
	var input = null;
	
	
	
	if(p.length > 0){			
		for(var i = 0, l = p.length; i<l; i++){
			switch(i){
				case 0:
					input = this.widgets.param_1;
				break;
				case 1:
					input = this.widgets.param_2;
				break;
				case 2:
					input = this.widgets.param_3;
				break;
			}
			
			params.push(""+p[i]+"="+input.getData());
		}
	}
	this.frame = "";
	var header = this.widgets.requestHeader;
	var r = this.widgets.requests;
	header.setData({"title": "Requests: "});
	header.stateChange("enter");
	this.widgets.parameters.setFocus(false);
	r.setData(this.WL_servers);
	r.stateChange("enter");
	this.request = {
		"index": 0,
		"params": params,
		"service": s.id
	
	};
	
	NGM.trace("this.request.service: " + this.request.service);
	NGM.trace("ip: " + this.WL_servers[this.request.index].ip);

	NGM.dump(this.request,2)
	
	getServices.getSingleton().call(this.request.service, ["ts="+ new Date().getTime()],  this.responseDummy.bind(this), this.WL_servers[this.request.index].ip,true);

}

servers.prototype.responseDummy = function responseDummy(response){	
	var r = this.widgets.requests;
	this.WL_servers[this.request.index].ms = tpng.backend.msResponse-tpng.backend.msRequest;
	this.WL_servers[this.request.index].url = tpng.backend.request;
	
	if(response.status == 200){		
		this.WL_servers[this.request.index].status = 1;
		this.WL_servers[this.request.index].error = null;		
	}else{
		this.WL_servers[this.request.index].status = 2;
		this.WL_servers[this.request.index].error = response_err;	
	}
	r.redraw();
	r.scrollNext();		
	this.request.index ++;		
	if(this.request.index < this.WL_servers.length){
		getServices.getSingleton().call(this.request.service, ["ts=" + new Date().getTime()],  this.responseDummy.bind(this), this.WL_servers[this.request.index].ip+"",true);
	}else{
		this.frame = "request";
	}
}



servers.drawBEServices = function drawBEServices(data){

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 
		
		var custo = {  
	 		fill: "rgba(0,0,0,0.8)"
		};  
		var custo_f = JSON_Complete({	font_size:18,fill: "rgba(255,255,255,1)",
							font_family: "DINPro",
							text_align: "left,middle",
							text_multiline:true});
		if(focus){
			custo.fill =  "rgba(255,255,255,0.8)";
			custo_f.fill = "rgba(0,0,0,1)";
		}
		
		Canvas.drawShape(ctx, "rect",  new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo);	
		Canvas.drawText(ctx, "<!b><!color=#0489B1>"+data.section+"<!> ["+data.id+"] :<!> "+ data.description, new Rect(20,0,ctx.viewportWidth-50,ctx.viewportHeight), custo_f);	
			
		
		
		ctx.drawObject(ctx.endObject());
	}
}

servers.drawParams = function drawParams(_data){

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 
		
		var custo = {  
	 		fill: "rgba(0,0,0,0.8)"
		};  
		var custo_f = JSON_Complete({	font_size:18,fill: "rgba(255,255,255,1)",
							font_family: "DINPro",
							text_align: "left,middle",
							text_multiline:true});
		if(focus){
			custo.fill =  "rgba(255,255,255,0.8)";
			custo_f.fill = "rgba(0,0,0,1)";
		}
		
		Canvas.drawShape(ctx, "rect",  new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo);	
		Canvas.drawText(ctx, "<!b>"+_data+"<!>", new Rect(20,0,ctx.viewportWidth-50,ctx.viewportHeight), custo_f);	
			

		
		ctx.drawObject(ctx.endObject());
	}
}



servers.drawHeader = function drawHeader(_data){	
		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 
		
		var custo = {  
	 		fill: "rgba(0,0,0,0.8)"
		};  
		Canvas.drawShape(ctx, "rect",  new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo);
		
 		custo = JSON_Complete({	font_size:22,fill: "rgba(255,255,255,1)",
							font_family: "DINPro",
							text_align: "left,middle",
							text_multiline:true});
	
		Canvas.drawText(ctx, "<!b>"+_data.title+"<!>", new Rect(20,0,ctx.viewportWidth-50,ctx.viewportHeight), custo);	
			
		
		
		ctx.drawObject(ctx.endObject());
	
}

servers.drawRequest = function drawRequest(_data){	
		
		this.draw = function draw(focus) {
			var ctx = this.getContext("2d");		
		    ctx.beginObject();
			ctx.clear(); 			
			var custo = {  
		 		fill: "rgba(0,0,0,0.8)"
			};  
			if(focus)
				custo.fill =  "rgba(255,255,255,0.8)";
			Canvas.drawShape(ctx, "rect",  new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo);
			
			custo = JSON_Complete({	font_size:16,fill: "rgba(255,255,255,1)",
							font_family: "DINPro",
							text_align: "left,middle",
							text_multiline:true});
	
			if(focus)
				custo.fill =  "rgba(0,0,0,1)";
		
			switch(_data.status*1){
				case 0:
					var status = "<!b !color=#FFFF00>CONNECTING...<!>";
				break;
				case 1:
					var status = "<!b !color=#00FF33>OK<!>";
				break;
				case 2:
					var status = "<!b !color=#FF0000>FAILED<!>";
				break;
			
			}				
			Canvas.drawText(ctx, "<!color=#0489B1>"+_data.name+"<!>  ["+ _data.url+ "]          "+status + "     <!color=#9900CC>["+_data.ms+" ms]<!>", new Rect(20,0,ctx.viewportWidth-50,ctx.viewportHeight), custo);	
			ctx.drawObject(ctx.endObject());
		}
}

servers.drawDetail = function drawDetail(_data){	
		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 
		
		var custo = {  
	 		fill: "rgba(0,0,0,.9)"
		};  
		Canvas.drawShape(ctx, "rect",  new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo);
		
		/*
		error ... [Object] (object/constructor) {
		      description .. "Parameter 2 is requested",
		      error ........ "Error del Backend",
		      status ....... 400   (number),
		   },
			
		*/
		
 		custo = JSON_Complete({	font_size:32,fill: "rgba(255,255,255,1)",
							font_family: "DINPro",
							text_align: "center,top",
							text_multiline:true});
		var error = _data.error;
		Canvas.drawText(ctx, "<!b!color=#FF0000>"+error.error+"<!>", new Rect(0,20,ctx.viewportWidth,100), custo);
		custo.font_size = 20;
		Canvas.drawText(ctx, _data.url, new Rect(0,70,ctx.viewportWidth,100), custo);
		custo.font_size = 28;
		Canvas.drawText(ctx, "<!b!color=#0489B1>HTTP code: "+error.status+"<!>", new Rect(0,110,ctx.viewportWidth,100), custo);
		custo.font_size = 24;
		Canvas.drawText(ctx, error.description, new Rect(0,160,ctx.viewportWidth,100), custo);
		//|HTTP code: " + error.status+" | " + error.description	
			
		
		
		ctx.drawObject(ctx.endObject());
	
}

