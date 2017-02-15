// defaulting.js - Rolas

function defaulting(config, options){  
    this.super(config, options);
    this.home;
}

defaulting.inherits(FormWidget);

defaulting.prototype.onEnter = function onEnter(_data){

	var widgets = this.widgets;
	this.home = _data.home;
	var url = "img/commons/0x0-Back_Wood-BW_HD.jpg";
	//var url = "http://10.213.12.163:9900/TPMCOREWeb/img/18x18-EDOCTAback.jpg";
	this.home.widgets.mainBg.setData({"url":url});
	this.home.widgets.mainBg.stateChange("enter");
	this.home.showHeader({"section":"defaulting","simple": true,"fill": "rgba(0,0,0,0)"});
	this.home.widgets.player.setData();
	//this.home.setPlayerStatus("STOP");
	getServices.getSingleton().call("ADMIN_DEFAULTING", , this.responseDefaulting.bind(this),null, null, null, 15000);
	
	
}





defaulting.prototype.responseDefaulting = function responseDefaulting(responseCode){
	var w = this.widgets;
	if(responseCode.status == 200){
		var data = responseCode.data.ResponseVO;
		var susc = data.suscriptorVO;
		var phone = data.callCenterPhone;
				if(data.bankReferences){
					var ref = [];
					ref = data.bankReferences;
				}
				else{
					
				}	
			var balance = susc.susBalance;
			var name = susc.susName;
			var contract = susc.susContract;
			if(susc.susMdnHome){
				var tel = susc.susMdnHome;
			}
			w.clientdata.setData(name);
			w.message.setData(balance);
			if(ref){
				w.references.setData({"references":ref,"phone":phone});
			}
			else{
				w.references.setData({"phone":phone});
			}
			w.line.setData();
			if(tel){
				w.headers.setData({"contract":contract,"tel":tel});
			}
			else{
				w.headers.setData({"contract":contract});
			}	
			this.client.lock();
				w.clientdata.stateChange("enter");
				w.message.stateChange("enter");
				w.line.stateChange("enter");
				w.headers.stateChange("enter");
				w.references.stateChange("enter");
			this.client.unlock();
			
	}else{
		this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}	

defaulting.prototype.onKeyPress = function onKeyPress(_key){
	
	switch(_key){
	}
	return true;	
	
}



defaulting.drawMessage = function drawMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "right,top";
	custo_f.font_family = "Oxygen-Regular";
	custo_f.font_size = 42;
	Canvas.drawText(ctx,"Tu cuenta presenta un saldo vencido por", new Rect(0,0,ctx.viewportWidth,104), custo_f);
	Canvas.drawText(ctx,"$"+_data, new Rect(0,108,ctx.viewportWidth,68), custo_f);
	custo_f.font_size = 20;
	Canvas.drawText(ctx,"Tu sistema se encuentra bloqueado. ¡En cuanto registremos tu pago podrás seguir disfrutando de la experiencia Totalplay!", new Rect(0,180,ctx.viewportWidth,70), custo_f);
	ctx.drawObject(ctx.endObject());	
}

defaulting.drawReferences = function drawReferences(_data){ 
	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
     var banks = [];
     var accounts = [];
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
		for(var i = 0; i<_data.references.length; i++){
			banks.push(_data.references[i].bankReferenceVO.label);
			accounts.push(_data.references[i].bankReferenceVO.value);
		} 
		
	
	
	if(_data.references){
			
		custo_f.text_align = "left,top";
		custo_f.font_family = "Oxygen-Regular";
		custo_f.font_size = 20;
		Canvas.drawText(ctx, "Usa alguna de las siguientes opciones para pagar:", new Rect(0,0,ctx.viewportWidth,32), custo_f);
		custo_f.text_align = "left,bottom";
		custo_f.font_family = "Oxygen-Bold";
		Canvas.drawText(ctx,"Con tarjeta de Débito o Crédito:", new Rect(0,36,ctx.viewportWidth,32), custo_f);
		custo_f.font_family = "Oxygen-Regular";
		Canvas.drawText(ctx,"Línea Totalplay (marca al "+_data.phone+")", new Rect(40,72,ctx.viewportWidth-40,32), custo_f);
		
		
		//referencias
		custo_f.text_align = "left,bottom";
		custo_f.font_family = "Oxygen-Regular";
		custo_f.font_size = 20;
		Canvas.drawText(ctx,"<!b>En efectivo:<!>", new Rect(0,108,ctx.viewportWidth,32), custo_f);
		custo_f.font_size = 18;
		var y = 108;
			for(var i = 0 ; i<banks.length; i++){
				y = y + 30;
				Canvas.drawText(ctx,banks[i], new Rect(0,y,146,32), custo_f);
			}
	custo_f.text_align = "right,bottom";
		var y = 108;	
		
			for(var i = 0 ; i<accounts.length; i++){
				y = y + 30;
				Canvas.drawText(ctx,accounts[i], new Rect(132,y,ctx.viewportWidth-168,32), custo_f);
			}
		
	}
	else{
		custo_f.text_align = "left,bottom";
		custo_f.font_family = "Oxygen-Regular";
		custo_f.font_size = 20;
		Canvas.drawText(ctx, "Usa alguna de las siguientes opciones para pagar:", new Rect(0,0,ctx.viewportWidth,32), custo_f);
		custo_f.font_family = "Oxygen-Bold";
		Canvas.drawText(ctx,"Con tarjeta de Débito o Crédito:", new Rect(0,36,ctx.viewportWidth,32), custo_f);
		custo_f.font_family = "Oxygen-Regular";
		Canvas.drawText(ctx,"Línea Totalplay (marca al "+_data.phone+")", new Rect(40,72,ctx.viewportWidth,32), custo_f);
	}
	ctx.drawObject(ctx.endObject());	
}

defaulting.drawHeaders = function drawHeaders(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);

	custo.stroke = "";
	Canvas.drawShape(ctx, "rect", [0,0,250,32],custo); //FONDO
	
	custo_f.text_align = "center,middle";
	custo_f.font_size = 20;
	Canvas.drawText(ctx, "TU NÚMERO DE CUENTA", new Rect(0,0,250,32), custo_f);
	
	if(_data.tel){
		Canvas.drawShape(ctx, "rect", [256,0,250,32],custo);
	
		Canvas.drawText(ctx, "TU NÚMERO TELEFÓNICO", new Rect(256,0,250,32), custo_f);
	}	
	custo_f.font_size = 26;	
	
	custo.fill = "rgba(85,95,105,1)";
	custo_f.text_align = "center,top";
	Canvas.drawShape(ctx, "rect", [0,32,250,32],custo); //FONDO
	Canvas.drawText(ctx, _data.contract, new Rect(0,32,250,32), custo_f);
	
	if(_data.tel){
		Canvas.drawShape(ctx, "rect", [256,32,250,32],custo); //FONDO
		Canvas.drawText(ctx, _data.tel, new Rect(256,32,250,32), custo_f);
	}	
	ctx.drawObject(ctx.endObject());	
}

defaulting.drawClientData = function drawClientData(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "left,top";
	custo_f.font_size = 28;
	Canvas.drawText(ctx, _data, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}
