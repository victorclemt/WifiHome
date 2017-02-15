// message.js
function message(config, options){  
    this.super(config, options); 
    this.home;
} 

message.inherits(FormWidget);  

message.prototype.onEnter = function onEnter(_data){
	var widgets = this.widgets;
	this.home = _data.home;
	
	widgets.messagePanel.setData({"title":_data.title,  "active": _data.active});
	widgets.messagePanel.stateChange("enter");
	
	
	clearTimeout(this.exitTimer);
	this.exitTimer = setTimeout(
			function (){
				widgets.stateChange("exit");
				this.home.closeSection(this);
			}.bind(this)
	, 3000);
	
	
}


message.prototype.onKeyPress = function onKeyPress(_key){	
    switch(_key){
       	case "KEY_MENU":
       	case "KEY_IRBACK":
       	case "KEY_IRENTER":
       		//this.home.closeAll(this);	
       	break;
      		/*
      	case "KEY_TV_RED":
			this.formOpenChild("previews", {"home":this}, false);
		break;*/	
    }
    return true;
}

message.drawMessagePanel = function drawMessagePanel(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear(); 
	
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		var img = "alertaRoja";
		if(_data.active){
			img = "alertaVerde";
		}
		tp_draw.getSingleton().drawImage("img/commons/"+img+".png",ctx, 579, 15,null,null,null);
	var custoErrorText = JSON.stringify(this.themaData.standardFont);
		custoErrorText = JSON.parse(custoErrorText);
		
		custoErrorText.text_align = "left,bottom";
		custoErrorText.fill ="rgba(220, 60, 70, 1)";
		custoErrorText.font_family = "Oxygen-Light";
		custoErrorText.font_size = 18 * tpng.thema.text_proportion;
		if(_data.active){
			custoErrorText.fill ="rgba(190, 220, 50, 1)";
		}
		
		
	
		custoErrorText.font_size = 26* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,bottom";

	Canvas.drawText(ctx,"<!i>"+_data.title+"<!i>", new Rect( 10, 87, ctx.viewportWidth-20, 32), custoErrorText);
	
		custoErrorText.font_size = 22* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,bottom";
	var subtitle = "Se dejará de grabar a partir de éste momento.";
	if(_data.active){
		subtitle = "Será grabado en todos los canales que cuentan con Anytimetv a partir de éste momento.";
	}
	Canvas.drawText(ctx,"<!i>"+ subtitle +"<!i>", new Rect( 10, 123, ctx.viewportWidth-20, 32), custoErrorText);
	
		custoErrorText.font_size = 18 * tpng.thema.text_proportion;
		custoErrorText.text_align = "center,middle";
	
	var lastMsg = "Recuerda: puedes volver a grabar este programa en cualquier momento.";
	if(_data.active){
		lastMsg = "Puedes ver tus grabaciones desde Menú / Televisión / Mis grabaciones.";
	}
	
	
	Canvas.drawText(ctx,"<!i>"+lastMsg+"<!i>", new Rect(10, 195, ctx.viewportWidth-20, 32), custoErrorText);
	
	ctx.drawObject(ctx.endObject());
}
