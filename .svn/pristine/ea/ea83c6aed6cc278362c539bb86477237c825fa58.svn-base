
FormWidget.registerTypeStandard("demoTv");

function demoTv(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
}

demoTv.inherits(FormWidget);

demoTv.prototype.onEnter = function onEnter(_data){
	NGM.trace(" ");
	NGM.trace("demoTv");	
	this.home = _data.home;
	
	var params = ["alias=DEMOPDV"];
	getServices.getSingleton().call("ADMIN_GET_BANNERS", params,  this.responseGetBanners.bind(this));
	
}

demoTv.prototype.onExit = function onExit(_data){
	NGM.trace(" ");
	NGM.trace("demoTv on exit");	
}

demoTv.prototype.responseGetBanners = function responseGetBanners(response){
	if(response.status == 200){
		
		//tpng.app.showTutorial = response.data.showTutorial;
		var banners_data = response.data.ResponseVO.arrayBanners;
		var banner = response.data.ResponseVO.arrayBanners[0].ItemVO;
		
		var banners = this.widgets.banners;
		banners.setData(banners_data);
		banners.stateChange("enter");
		
		//TODO, hacer que se repitan los banners
				
	}else{
	//MINIERROR
	}
	
}


demoTv.prototype.onKeyPress = function onKeyPress(_key){
	//this.home.onKeyPress(_key);
	
	switch(_key){												
			case "KEY_TV_FAV":
			case "KEY_TV_AUDIO":
			case "KEY_TV_SUBTITLE":
			case "KEY_TV_SWAP":
			case "KEY_IRBACK":
			case "KEY_PIP":
			case "KEY_TV_0":
			case "KEY_TV_1":
			case "KEY_TV_2":
			case "KEY_TV_3":
			case "KEY_TV_4":
			case "KEY_TV_5":
			case "KEY_TV_6":
			case "KEY_TV_7":
			case "KEY_TV_8":
			case "KEY_TV_9":	  
			case "KEY_TV_CHNL_UP":
		    case "KEY_TV_CHNL_UP_LONG":	    	
	    	case "KEY_TV_CHNL_DOWN":
		    case "KEY_TV_CHNL_DOWN_LONG":
	    	case "KEY_TV_AUDIO":
	    		return false;
	    	break;
	    	case "KEY_MENU":
	    	case "KEY_LEFT":
		    case "KEY_RIGHT":
		    case "KEY_UP":
		    case "KEY_DOWN":
		    case "KEY_DOWN":
	    		return false;
	    		this.formClose();
	    	break;
	    	default:
	    		return true;
	    	break;
		}
		
	
}

