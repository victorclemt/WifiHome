
FormWidget.registerTypeStandard("details");

function details(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
}

details.inherits(FormWidget);

details.prototype.onEnter = function onEnter(_data){	
	this.home = _data.home;
	var preview = this.widgets.base;
	preview.setData({"name": "details"});
	preview.stateChange("enter");	
	
}


details.prototype.onKeyPress = function onKeyPress(_key){
	switch(_key){		
		case "KEY_TV_CHNL_UP":
	    case "KEY_TV_CHNL_UP_LONG":
	    case "KEY_TV_CHNL_DOWN":
	    case "KEY_TV_CHNL_DOWN_LONG":
	    	this.formClose();
	    	return false;
	    break;
	}	
	return true;
}

