
FormWidget.registerTypeStandard("devOnion");

function devOnion(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
}

devOnion.inherits(FormWidget);

devOnion.prototype.onEnter = function onEnter(_data){
	NGM.trace(" ");
	NGM.trace("devOnion");	
	this.home = _data.home;
	
	var preview = this.widgets.base;
	preview.setData();
	preview.stateChange("enter");	
	
}


devOnion.prototype.onKeyPress = function onKeyPress(_key){
	switch(_key){		
		case "KEY_TV_RED":
    		if(tpng.app.section == "info")
    			this.takeOutProgramInfo(); 
    		this.home.openSection("previews", {"home":this.home}, true);
    	break;		
		case "KEY_IRBACK":
			this.home.closeSection(this);
		break;
		default:
			return false;
		break;
	}	
	return true;
}

drawOnion = function drawOnion(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    

 	tp_draw.getSingleton().drawImage("img/tools/DevsOnion.png", ctx, 0, 0);	
 	
	ctx.drawObject(ctx.endObject());	
}
