// error.js
function miniError(config, options){  
    this.super(config, options); 
    this.home;
} 

miniError.inherits(FormWidget);  

miniError.prototype.onEnter = function onEnter(_data){
	
	var widgets = this.widgets;
	this.home = _data.home;
	this.section = _data.section;
	widgets.miniErrorPanel.setData({"code":_data.code, "message":_data.message, "suggest":_data.suggest});
	widgets.miniErrorPanel.stateChange("enter");
}


miniError.prototype.onKeyPress = function onKeyPress(_key){	
    switch(_key){
       	case "KEY_MENU":
       	case "KEY_IRBACK":
       	case "KEY_IRENTER":
       		this.home.closeAll(this);	
       	break;
      		/*
      	case "KEY_TV_RED":
			this.formOpenChild("previews", {"home":this}, false);
		break;*/	
    }
    return true;
}

miniError.drawMiniError = function drawMiniError(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear(); 
		
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		
	// img
	tp_draw.getSingleton().drawImage("img/commons/alertaAmarilla.png",ctx, 100, 68, null, null, null);
	
	var custoErrorText = JSON.stringify(this.themaData.standardFont);
		custoErrorText = JSON.parse(custoErrorText);
		
	custoErrorText.text_align = "right,middle";
	custoErrorText.fill ="rgba(255,220,0,.8)";
	custoErrorText.font_family = "Oxygen-Light";
	custoErrorText.font_size = 20 * tpng.thema.text_proportion;		
	Canvas.drawText(ctx, "Código: "+"<!i>"+data.code+"<!i>", new Rect(1020,0,193,32), custoErrorText);
	
	custoErrorText.font_size = 28* tpng.thema.text_proportion;
	custoErrorText.text_align = "left,bottom";		
	//Canvas.drawText(ctx,"<!i>Esta pantalla no cargó correctamente.<!i>", new Rect(323,72,890,32), custoErrorText);
	Canvas.drawText(ctx,"<!i>"+data.message+"<!i>", new Rect(323,72,890,32), custoErrorText);
	
	custoErrorText.font_size = 18* tpng.thema.text_proportion;		
	//Canvas.drawText(ctx,"<!i>Presiona OK para intentarlo de nuevo.<!i>", new Rect(323,108,890,32), custoErrorText);
	Canvas.drawText(ctx,"<!i>"+data.suggest+"<!i>", new Rect(323,108,890,32), custoErrorText);
	
	ctx.drawObject(ctx.endObject());
}
