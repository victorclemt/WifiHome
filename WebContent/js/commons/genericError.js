// genericError.js
function genericError(config, options){  
    this.super(config, options); 
    this.home;
} 

genericError.inherits(FormWidget);  

genericError.prototype.onEnter = function onEnter(_data){
	var widgets = this.widgets;
	this.home = _data.home;
	this.section = _data.section;
	widgets.miniErrorPanel.setData({"code":_data.code,"message":_data.message});
	widgets.miniErrorPanel.stateChange("enter");
}


genericError.prototype.onKeyPress = function onKeyPress(_key){	
    switch(_key){
       	case "KEY_MENU":
       	case "KEY_IRBACK":
       	case "KEY_IRENTER":
       		this.home.closeSection(this);
       	break;
    }
    return true;
}

genericError.drawMiniError = function drawMiniError(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear(); 
	
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		tp_draw.getSingleton().drawImage("img/commons/alertaAmarilla.png",ctx, 579, 0,null,null,null);
	var custoErrorText = JSON.stringify(this.themaData.standardFont);
		custoErrorText = JSON.parse(custoErrorText);
		
		custoErrorText.text_align = "left,bottom";
		custoErrorText.fill ="rgba(255,220,0,.8)";
		custoErrorText.font_family = "Oxygen-Light";
		custoErrorText.font_size = 18 * tpng.thema.text_proportion;
		
	Canvas.drawText(ctx, "Código de Error: "+" "+data.code, new Rect(1020,0,193,32), custoErrorText);
	
		custoErrorText.font_size = 26* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,bottom";

	Canvas.drawText(ctx,"<!i>Lo sentimos... <!i>", new Rect(515,72,250,32), custoErrorText);
	
		custoErrorText.font_size = 26* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,bottom";
		
	Canvas.drawText(ctx,"<!i>"+data.message+"<!i>", new Rect(387,108,507,32), custoErrorText);
	
		custoErrorText.font_size = 18* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,middle";
		
	Canvas.drawText(ctx,"<!i>Presiona OK para salir.<!i>", new Rect(451,180,378,32), custoErrorText);
	
	ctx.drawObject(ctx.endObject());
}
