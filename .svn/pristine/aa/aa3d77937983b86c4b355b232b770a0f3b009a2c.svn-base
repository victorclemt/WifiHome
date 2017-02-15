
FormWidget.registerTypeStandard("previews");

function previews(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
}

previews.inherits(FormWidget);

previews.prototype.onEnter = function onEnter(_data){
	NGM.trace(" ");
	NGM.trace("previews");	
	this.home = _data.home;
	
	//var previewURL = "img/tmp/5b_Avatar1.jpg";
	var preview = this.widgets.base;
	preview.setData({"img": previewURL});
	preview.stateChange("enter");	
	
}


previews.prototype.onKeyPress = function onKeyPress(_key){
	switch(_key){		
		case "KEY_LEFT":			
		break;
		
		case "KEY_RIGHT":			
		break;
		
		case "KEY_IRBACK":
			this.formClose();
		break;
	}	
	return true;
}

drawPreview = function drawPreview(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    
    
 	tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0, null, null, null,"destination-over");
 	tp_draw.getSingleton().drawImage("img/tools/DevsOnion.png", ctx, 0, 0);	
 	
	ctx.drawObject(ctx.endObject());	
}
