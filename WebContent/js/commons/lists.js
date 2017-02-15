
FormWidget.registerTypeStandard("lists");

function lists(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
}

lists.inherits(FormWidget);

lists.prototype.onEnter = function onEnter(_data){	
	this.home = _data.home;
	var preview = this.widgets.base;
	preview.setData({"name": "lists"});
	preview.stateChange("enter");	
	
}


lists.prototype.onKeyPress = function onKeyPress(_key){
	switch(_key){		
		case "KEY_IRBACK":
			this.home.closeSection(this);
		break;
		case "KEY_IRENTER":
			this.home.openSection("details", {"home":this.home}, true);
		break;
	}	
	return true;
}

