// error.js
function error(config, options){  
    this.super(config, options); 
    this.home;
} 

error.inherits(FormWidget);  

error.prototype.onEnter = function onEnter(_data){
	var widgets = this.widgets;
	this.home = _data.home;
	this.section = _data.section;
	widgets.errorPanel.setData({"title": _data.title,"code":_data.code,"message": _data.message,"suggest":_data.suggest});
	widgets.errorPanel.stateChange("enter");
}


error.prototype.onKeyPress = function onKeyPress(_key){	
    switch(_key){
       /*	case "KEY_TV_GREEN":
       	this.formOpenChild("previews", {"home":this}, false);
       	break;*/
      		
    }
    return true;
}

error.messagesPanelDraw = function messagesPanelDraw(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear(); 
	tp_draw.getSingleton().drawImage("img/commons/error.jpg",ctx, 0, 0);
	
	var custoErrorText = JSON.stringify(this.themaData.standardFont);
	custoErrorText = JSON.parse(custoErrorText);
	
	
	custoErrorText.text_align = "center,middle";
	custoErrorText.font_size = 30;
	
	Canvas.drawText(ctx, data.title, new Rect(67,290,1146,68), custoErrorText);
	
	custoErrorText.font_size = 18;
	custoErrorText.fill = "rgba(199,129,127,.8)";
	
	Canvas.drawText(ctx, "código: "+" "+data.code, new Rect(515,362,250,32), custoErrorText);
	
	custoErrorText.fill = "rgba(240,240,250,1)";
	
	custoErrorText.text_align = "left,top";
	custoErrorText.font_size = 16;	

	Canvas.drawText(ctx,data.message, new Rect(514,506,314,68), custoErrorText);
	Canvas.drawText(ctx,data.suggest, new Rect(514,578,314,68), custoErrorText);
	
	ctx.drawObject(ctx.endObject());
}
