
FormWidget.registerTypeStandard("interactiveMsg");

function interactiveMsg(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
}

interactiveMsg.inherits(FormWidget);

interactiveMsg.prototype.onEnter = function onEnter(_data){	
	this.home = _data.home;
	this.notification = _data.notification;
	var notification = this.widgets.notification;	
	notification.setData({"url":_data.notification.images.url18X18});
	notification.stateChange("enter");	
	unsetTimeAlarm(this.hidePopUpDelay);
	this.hidePopUpDelay = this.closing.bind(this).delay(30000);//10 segundos
}

interactiveMsg.prototype.closing = function closing(){	
	this.formClose();
}


interactiveMsg.prototype.onKeyPress = function onKeyPress(_key){	
	switch(_key){		
		case "KEY_IRENTER":
			if(this.notification.link){
				this.home.openLink(this.notification.link, null, 4);
			}
		break;
		case "KEY_MENU":
		case "KEY_IRBACK":
			unsetTimeAlarm(this.hidePopUpDelay);
			this.home.closeSection(this);
		break;
	}	
	return true;
}


interactiveMsg.drawMsg = function drawMsg(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();    
    tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 0);
	ctx.drawObject(ctx.endObject());	
}
