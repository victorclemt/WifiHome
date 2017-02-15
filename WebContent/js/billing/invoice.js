//invoice.js - Rolas

FormWidget.registerTypeStandard("invoice");

function invoice(config, options){
    this.super(config, options);
    this.fullList = [];
    this.firstList = [];
    this.secondList = [];
}

invoice.inherits(FormWidget);

invoice.prototype.onEnter = function onEnter(_data){
	var w = this.widgets;
	this.home = _data.home;

	var url = "img/commons/0x0-Back_Wood-BW_HD.jpg";
	this.home.setBg(url);
	this.home.showHeader({"section":"defaulting","simple": false,"fill": "rgba(0,0,0,0)"});

	this.home.setPlayerStatus("STOP");
	w.loading.setData();
	w.loading.stateChange("enter");
	
	var password = tpng.backend.mac_address.replace( /:/g, "");	
	var ciphertext = encryptByDES(password, tpng.stb.key);
	
	getServices.getSingleton().call("ADMIN_GET_INVOICE",["auth="+ciphertext], this.responseGetInvoice.bind(this),null, null, null, 15000);
	
}

invoice.prototype.responseGetInvoice = function responseGetInvoice(response){
	var w = this.widgets;
	if(response.status == 200){
		w.loading.stateChange("exit");
		this.BillVO = response.data.BillVO;
		this.callCenterPhone = response.data.callCenterPhone;
		
		if(this.BillVO.status == 0){
			var bill = { "name":this.BillVO.Name,"address":this.BillVO.Address};
			w.clientdata.setData(bill);
			
			if(this.BillVO.Telephone){
				var data = {"text1":"TU NÚMERO DE CUENTA","text2":this.BillVO.Account,"text3":"TU NÚMERO TELEFÓNICO","text4":this.BillVO.Telephone};
			}
			else{
				var data = {"text1":"TU NÚMERO DE CUENTA","text2":this.BillVO.Account};
			}
			w.headers.setData(data);
			
			var payment = {"text1":this.BillVO.Plan,"text2":"Antes del|"+this.BillVO.DateDiscountPayment,"text3":"$"+this.BillVO.DiscountPayment,"text4":"Pronto |Pago","text5":"Antes del|"+this.BillVO.DatePayment,"text6":"$"+this.BillVO.ListPrice,"text7":"Precio de|lista"};
			w.payment.setData(payment);
			
			w.line.setData();
			this.client.lock();
				w.clientdata.stateChange("enter");
				w.headers.stateChange("enter");
				w.payment.stateChange("enter");
				w.line.stateChange("enter");
				
			
				this.fullList.push({"BillDetailVO":{"type":["btn"],"label":["Saldo al corte"],"value":this.BillVO.billDetail[0].BillDetailVO.value,"img":"menos"}});
					for(var x = 0; x < this.BillVO.billDetail.length; x++){
						this.fullList.push(this.BillVO.billDetail[x]);
						this.firstList.push(this.BillVO.billDetail[x]);
					}
			
					for(var x = 0; x < this.BillVO.chargesDetail.length; x++){
						if(x == 0){
							this.fullList.push({"BillDetailVO":{"type":["btn"],"label":this.BillVO.chargesDetail[x].ChargesDetailVO.label+"","value": this.BillVO.chargesDetail[x].ChargesDetailVO.value,"img":"menos"}});
						}else{
							this.secondList.push({"BillDetailVO":{"value":this.BillVO.chargesDetail[x].ChargesDetailVO.value+"","label":this.BillVO.chargesDetail[x].ChargesDetailVO.label+""}});
							this.fullList.push({"BillDetailVO":{"value":this.BillVO.chargesDetail[x].ChargesDetailVO.value+"","label":this.BillVO.chargesDetail[x].ChargesDetailVO.label+""}});
						}
					}	
				w.billDetail.setData(this.fullList);
				w.billDetail.stateChange("enter");
				
				w.payButton.setData({"focus": false, "price": this.BillVO.currentBilling, "show": this.BillVO.ShowButton});
				w.payButton.stateChange("enter");
				this.references = this.BillVO.bankReferences;
				
				if(this.fullList.length > 9){
					w.downArrow.setData({"url": "img/tv/arrowDown.png" ,"line": false, "position": "down"});
					w.downArrow.stateChange("enter");
				}
				
				this.focus = "bill";
			this.client.unlock();
		
			
		}else{
		// if(this.BillVO.status == -1 || this.BillVO.status == -2){
			w.notFound.setData({"message":this.BillVO.message});
			w.notFound.stateChange("enter");
			this.focus = "notFound";
		}
		}else{
			this.home.openSection("miniError", {"home": this.home,"suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);
	}
}

invoice.prototype.getReferences = function getReferences(){
		var w = this.widgets;
			var banks = [];
			
			for(var i = 0; i< this.BillVO.bankReferences.length; i++){
				banks.push({"value":this.BillVO.bankReferences[i].bankReferenceVO.value,"label":this.BillVO.bankReferences[i].bankReferenceVO.label});
			}
			
			var buttons = [
	
						{"id":"n","legend":"Presiona OK para regresar", "active":true}
					];
			w.buttons.setData(buttons);
			w.references.setData({"text1":"Selecciona tu método de pago:","text2":"*Puedes pagar en efectivo directamente en ventanilla de los bancos:","text3":banks});
			w.line.setData();
			w.line2.setData();
			w.comingsoon.setData({"text1":"Recuerda que también puedes pagar en la línea Totalplay "+this.callCenterPhone+"**","text2":"**El pago se verá reflejado inmediatamente.","text3":"","text4":""});
      		w.conditions.setData({"text1":"*El pago se verá reflejado en 24 hrs."});
      		w.line.stateChange("enter2");
      		w.line2.stateChange("enter");
      		w.references.stateChange("enter");
      		w.conditions.stateChange("enter");
      		w.comingsoon.stateChange("enter");
      		w.buttons.stateChange("enter");
      		this.focus = "details";					
}

invoice.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
	switch(this.focus){
		case "notFound":
			switch(_key){
				case "KEY_IRBACK":
				case "KEY_MENU":
				case "KEY_IRENTER":
					w.notFound.stateChange("exit");
					this.home.hideBg();	
					this.home.hideHeader();
					this.home.closeSection(this);
				break;
				
				case "KEY_UP":
					
				
				break;
		
			}
			break;
		case "bill":
			this.onKeyPressBillDetail(_key);
			break;
		case "charges":
			this.onKeyPressChargesDetail(_key);
			break;
		case "pay":
			this.onKeyPressPayButton(_key);
			break;
		
		case "details":
			this.onKeyPressDetails(_key);
			break;	
			
		case "search":
			switch(_key){
				case "KEY_DOWN":
				case "KEY_MENU":
				case "KEY_IRBACK":
					this.home.disableSearchHeader();
					this.focus = this.lastFocus;
					if(this.focus == "bill"){
						w.billDetail.setFocus(true);
					}
					else if(this.focus == "pay"){
						var payData = w.payButton.data;
							payData.focus = true;
							w.payButton.setData(payData);
							w.payButton.refresh();
					}else if(this.focus == "details"){
							w.buttons.setFocus(true);
					}
				break;
				
				default:
					this.home.onKeyPress(_key);
				break;	
			}
			break;	
	}
	return true;
}

invoice.prototype.onKeyPressBillDetail = function onKeyPressBillDetail(_key){
	var w = this.widgets;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			this.client.lock();
				w.billDetail.stateChange("exit");
				w.clientdata.stateChange("exit");
				w.headers.stateChange("exit");
				w.line.stateChange("exit");
				w.payButton.stateChange("exit");
				w.payment.stateChange("exit");
				if(w.upArrow.stateGet() == "enter"){
					w.upArrow.stateChange("exit");
				}
				if(w.downArrow.stateGet() == "enter"){
					w.downArrow.stateChange("exit");
				}
			this.client.unlock();
			
			this.home.hideBg();	
			this.home.hideHeader();
			this.home.closeSection(this);
		break;
		
		case "KEY_UP":
			if(w.billDetail.scrollPrev()){
				if(w.billDetail.selectIndex < w.billDetail.list.length - 9){
					w.downArrow.stateChange("enter");
				}
				if(w.billDetail.selectIndex == 0){
					w.upArrow.stateChange("exit");
				}
			}
			else{
				this.home.enableSearchHeader();
				w.billDetail.setFocus(false);
				this.focus = "search";
				this.lastFocus = "bill";
			}
		break;
		
		case "KEY_DOWN":
			if(w.billDetail.stateGet() == "enter"){
				w.billDetail.scrollNext();
				if(w.billDetail.selectIndex == w.billDetail.list.length-1 && w.downArrow.stateGet()=="enter"){
					w.downArrow.stateChange("exit");
				}
				if(w.billDetail.selectIndex > 8){
					w.upArrow.setData({"url": "img/tv/arrowUp.png" ,"line": false, "position": "down"});
					w.upArrow.stateChange("enter");
				}
			}
		break;
			
		case "KEY_RIGHT":
			w.billDetail.setFocus(false);
			var payData = w.payButton.data;
			payData.focus = true;
			w.payButton.setData(payData);
			w.payButton.refresh();
			this.focus = "pay";
			
		break;
				
		case "KEY_IRENTER":
			var shortList = [];
			var index = w.billDetail.selectIndex;
			var focusIndex = w.billDetail.focusIndex;
			if(w.billDetail.selectItem.BillDetailVO.type == "btn"){
				var img = w.billDetail.selectItem.BillDetailVO.img;
				img == "menos" ? img="mas" : img="menos";
				w.billDetail.selectItem.BillDetailVO.img = img;
				var tam = w.billDetail.list.length, active = false;
				
				if(w.billDetail.selectIndex == 0){
					shortList.push(w.billDetail.selectItem);
					
					if(img == "mas"){
						for(var x = 1; x < tam; x++){
							if(w.billDetail.list[x].BillDetailVO.type=="btn"){
								active = true;
							}
							if(active){
								shortList.push(w.billDetail.list[x]);
							}
						}
					}else{
						shortList = shortList.concat(this.firstList);
						for(var x = 1; x < tam; x++){
							if(w.billDetail.list[x].BillDetailVO.type=="btn"){
								active = true;
							}
							if(active){
								shortList.push(w.billDetail.list[x]);
							}
						}
					}
				}else{
					active = true;
					shortList.push(w.billDetail.list[0]);
					if(img == "mas"){
						for(var x = 1; x < tam; x++){
							if(w.billDetail.list[x].BillDetailVO.type=="btn"){
								shortList.push(w.billDetail.list[x]);
								active = false;
							}
							if(active){
								shortList.push(w.billDetail.list[x]);
							}
						}
					}else{
						for(var x = 1; x < tam; x++){
							shortList.push(w.billDetail.list[x]);
						}
						shortList = shortList.concat(this.secondList);
					}
				}
				w.billDetail.setData(shortList);
				w.billDetail.setFocus(false);
				if(index != 0){
					var pos = 0;
					for(var x = 0; x < w.billDetail.list.length; x++){
						if(w.billDetail.list[x].BillDetailVO.type == "btn"){
							pos = x;
						}
					}
				}
				w.billDetail.scrollTo(pos,{duration: 1});
				w.billDetail.stateChange("enter");
				w.billDetail.setFocus(true);
				
				if(shortList.length < 9 && w.downArrow.stateGet() == "enter"){
					w.downArrow.stateChange("exit");
				}
				else if(shortList.length >= 9 && w.downArrow.stateGet() == "exit"){
					w.downArrow.stateChange("enter");
				}
				
				if(shortList.length < 9 && w.upArrow.stateGet() == "enter"){
					w.upArrow.stateChange("exit");
				}
			}
		
		break;
	
	}
	return true;
}

invoice.prototype.onKeyPressPayButton = function onKeyPressPayButton(_key){
	var w = this.widgets;
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
			this.client.lock();
				w.billDetail.stateChange("exit");
				w.clientdata.stateChange("exit");
				w.headers.stateChange("exit");
				w.line.stateChange("exit");
				w.payButton.stateChange("exit");
				w.payment.stateChange("exit");
				if(w.upArrow.stateGet() == "enter"){
					w.upArrow.stateChange("exit");
				}
				if(w.downArrow.stateGet() == "enter"){
					w.downArrow.stateChange("exit");
				}
			this.client.unlock();
			
			this.home.hideBg();	
			this.home.hideHeader();
			this.home.closeSection(this);
			
			break;
		case "KEY_IRENTER":
				w.line.speed = 0;
				w.line.setData();
				w.line.stateChange("exit");
			this.client.lock();
				w.billDetail.stateChange("exit");
				w.line.setData();
				w.line.stateChange("exit2");
				w.payButton.stateChange("exit");
				w.payment.stateChange("exit");
				if(w.upArrow.stateGet()=="enter"){
					w.upArrow.stateChange("exit");
					this.up = true;
				}
				else{
					this.up = false;
				}
				if(w.downArrow.stateGet()=="enter"){
					w.downArrow.stateChange("exit");
					this.down = true;	
				}
				else{
					this.down = false;
				}
				this.getReferences();
			this.client.unlock();
				
			break;
		case "KEY_LEFT":
			var payData = w.payButton.data;
			payData.focus = false;
			w.payButton.setData(payData);
			w.payButton.refresh();
			w.billDetail.setFocus(true);
			this.focus = "bill";
		break
		
		case "KEY_UP":
			this.home.enableSearchHeader();
			var payData = w.payButton.data;
			payData.focus = false;
			w.payButton.setData(payData);
			w.payButton.refresh();
			this.focus = "search";
			this.lastFocus = "pay";
		break;
		
	}
	return true;
}

invoice.prototype.onKeyPressDetails = function onKeyPressDetails(_key){
	var w = this.widgets;
			switch(_key){
				case "KEY_IRBACK":
				case "KEY_MENU":
				case "KEY_IRENTER":
				this.client.lock();
					w.billDetail.stateChange("enter");
					w.buttons.stateChange("exit");
					w.line.stateChange("exit2");
      				w.line2.stateChange("exit");
      				w.references.stateChange("exit");
      				w.comingsoon.stateChange("exit");
      				w.conditions.stateChange("exit");
					w.line.setData();
					w.line.stateChange("exit");
					w.line.setData();
					w.line.stateChange("enter");
					w.payButton.stateChange("enter");
					w.payment.stateChange("enter");
					if(this.down){
						w.downArrow.stateChange("enter");
						this.down = false;
					}
							
					if(this.up){
						w.upArrow.stateChange("enter");
						this.up = false;
					}	
					this.focus = "pay";
				this.client.unlock();
				
				break;
				
				case "KEY_UP":
					this.home.enableSearchHeader();
					w.buttons.setFocus(false);
					this.lastFocus = "details";
					this.focus = "search";
				break;
				
		
			}
}

invoice.drawLoading = function drawLoading(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
 
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	
	custo_f.text_align = "center,middle"; 
	
	custo_f.font_size = 22* tpng.thema.text_proportion;
	Canvas.drawText(ctx,"<!i>Cargando, por favor espera...<!i>", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

invoice.drawNotFound = function drawNotFound(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear(); 
	var custoErrorText = JSON.stringify(this.themaData.standardFont);
		custoErrorText = JSON.parse(custoErrorText);

		custoErrorText.font_size = 32* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,top";
		Canvas.drawText(ctx,data.message, new Rect(67,72,1146,36), custoErrorText);
		
		custoErrorText.font_size = 26* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,bottom";
		
	Canvas.drawText(ctx,"<!i>Por favor inténtalo más tarde.<!i>", new Rect(387,108,507,32), custoErrorText);
	
		custoErrorText.font_size = 18* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,middle";
		
	Canvas.drawText(ctx,"<!i>Presiona OK para salir.<!i>", new Rect(451,180,378,32), custoErrorText);
	
	ctx.drawObject(ctx.endObject());
}

invoice.drawClientData = function drawClientData(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "left,top";
	custo_f.font_size = 22* tpng.thema.text_proportion;
	Canvas.drawText(ctx,"<!b>"+_data.name+"<!>|<!size=18>"+_data.address+"<!>", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
			
	ctx.drawObject(ctx.endObject());	
}

invoice.drawHeaders = function drawHeaders(_data){ 	
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
	custo_f.font_size = 16* tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text1, new Rect(0,0,250,32), custo_f);
	
	if(_data.text3){
		Canvas.drawShape(ctx, "rect", [256,0,250,32],custo);
		Canvas.drawText(ctx, _data.text3, new Rect(256,0,250,32), custo_f);
	}
	custo_f.font_size = 24* tpng.thema.text_proportion;	
	
	custo.fill = "rgba(85,95,105,1)";
	
	Canvas.drawShape(ctx, "rect", [0,32,250,36],custo); //FONDO
	Canvas.drawText(ctx, _data.text2, new Rect(0,32,250,36), custo_f);
	if(_data.text4){
		Canvas.drawShape(ctx, "rect", [256,32,250,36],custo); //FONDO
		Canvas.drawText(ctx, _data.text4, new Rect(256,32,250,36), custo_f);
	}	
	ctx.drawObject(ctx.endObject());	
}

invoice.drawPayment = function drawPayment(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
	tp_draw.getSingleton().drawImage("img/billing/bar.png", ctx, 0, 0);	
 
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	custo_f.font_family = "Oxygen-Bold";
	
	custo_f.text_align = "center,bottom";
	custo_f.font_size = 24* tpng.thema.text_proportion;
	Canvas.drawText(ctx,"  A PAGAR", new Rect(0,0,122,32), custo_f);
	custo_f.font_size = 18* tpng.thema.text_proportion;
	custo_f.text_align = "center,middle";
	Canvas.drawText(ctx,"   Plan "+_data.text1, new Rect(0,34,244,32), custo_f);
	
	custo_f.font_family = "Oxygen-Light";
	custo_f.fill = "rgba(0,90,120,1)";
	
	Canvas.drawText(ctx, _data.text2, new Rect(256,0,122,68), custo_f);
	
	custo_f.font_family = "Oxygen-Bold";
	custo_f.font_size = 36* tpng.thema.text_proportion;
	custo_f.text_align = "center,middle";
	custo_f.fill = "rgba(20, 150, 160,1)";
	Canvas.drawText(ctx, _data.text3, new Rect(384,0,186,68), custo_f);
	custo_f.font_size = 20* tpng.thema.text_proportion;
	custo_f.font_family = "Oxygen-Light";
	custo_f.fill = "rgba(0,90,120,1)";
	Canvas.drawText(ctx,_data.text4, new Rect(576,0,122,68), custo_f);
	
	custo_f.fill = "rgba(30,30,40,1)";
	Canvas.drawText(ctx,_data.text5, new Rect(704,0,122,68), custo_f);
	
	custo_f.text_align = "left,middle";
	custo_f.font_size = 30* tpng.thema.text_proportion;
	custo_f.font_family = "Oxygen-Regular";
	
	Canvas.drawText(ctx,_data.text6, new Rect(896,0,122,68), custo_f);
	
	custo_f.font_size = 20* tpng.thema.text_proportion;
	custo_f.font_family = "Oxygen-Light";
	custo_f.text_align = "center,middle";
	Canvas.drawText(ctx,_data.text7, new Rect(1024,0,122,68), custo_f);
	
		
	ctx.drawObject(ctx.endObject());	
}

invoice.drawLine = function drawLine(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
	tp_draw.getSingleton().drawImage("img/billing/bar.png", ctx, 0, 0);	
 
	
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	
	custo.stroke = "";
	custo.fill = "rgba(240,240,250,1)";
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight],custo); //FONDO
	
	
		
	ctx.drawObject(ctx.endObject());	
}

invoice.drawBillDetail = function drawBillDetail(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
	  	ctx.beginObject();
	  	ctx.clear();
	  	
		var custoB = {"fill" : "rgba(60, 65, 75, 1)",
					  "stroke_width"  : 0,
					  "stroke_pos": "inside",
					  "stroke": "rgba(240,240,250, 1)"};
		var custoT = JSON_Complete({font_size : 24,
				fill: "rgba(240,240,250, 1)",
				font_family: "Oxygen-Regular",
				text_align: "left,middle",
				text_multiline: false});
		var custoP = JSON_Complete({font_size : 18,
				fill: "rgba(240,240,250, 1)",
				font_family: "Oxygen-Regular",
				text_align: "left,top",
				text_multiline: false});
		var url = "img/billing/"+_data.BillDetailVO.img+"OFF.png";
		var custoBtn = {"fill" : "rgba(20, 150, 160, 1)"};
		
		if (focus) {
			custoB = {"fill" : "rgba(240,240,250, 1)"};
			custoBtn = custoB;
			custoT = JSON_Complete({font_size : 24,
				fill: "rgba(30,30,40, 1)",
				font_family: "Oxygen-Regular",
				text_align: "left,middle",
				text_multiline: false});
			custoP = JSON_Complete({font_size : 18,
				fill: "rgba(30,30,40, 1)",
				font_family: "Oxygen-Regular",
				text_align: "left,top",
				text_multiline: false});
			url = "img/billing/"+_data.BillDetailVO.img+"ON.png";
			
		}
		
		
		if(_data.BillDetailVO.type == "btn"){
			if(_data.BillDetailVO.label == "Saldo al corte"){
				Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoBtn);
				
				Canvas.drawText(ctx, "<!b>"+_data.BillDetailVO.label+"<!>", new Rect(10, 0, 432, ctx.viewportHeight), custoT);
				Canvas.drawText(ctx, "<!b>$<!>", new Rect(704, 0, 58, 32), custoT);
				custoT.text_align = "right,middle";
				Canvas.drawText(ctx, "<!b>"+_data.BillDetailVO.value+"<!>", new Rect(704, 0, 122, 32), custoT);
				
				tp_draw.getSingleton().drawImage(url, ctx, 832, 0);	
			}else{
				Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoBtn);
				Canvas.drawText(ctx, "<!b>Cargos del Mes<!>", new Rect(10, 0, 432, ctx.viewportHeight), custoT);
				custoP.text_align = "left,middle";
				Canvas.drawText(ctx, "("+_data.BillDetailVO.value+")"/*fechaTextoX(_data.BillDetailVO.value)*/, new Rect(442, 0, 332, ctx.viewportHeight), custoP);
				tp_draw.getSingleton().drawImage(url, ctx, 832, 0);
			}
		}else{
			Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoB);
			custoT.text_align = "left,top";
			Canvas.drawText(ctx, _data.BillDetailVO.label, new Rect(35, 0, 663, ctx.viewportHeight), custoT);
			Canvas.drawText(ctx, "$", new Rect(704, 0, 58, ctx.viewportHeight), custoT);
			custoT.text_align = "right,middle";
			Canvas.drawText(ctx, _data.BillDetailVO.value, new Rect(704, 0, 122, ctx.viewportHeight), custoT);
		}
		
		ctx.drawObject(ctx.endObject());
    }
}

invoice.drawPayButton = function drawPayButton(_data){
	var ctx = this.getContext("2d");
    ctx.beginObject();
  	ctx.clear();
  	
  	/*var custoB = {"fill" : "rgba(0, 90,120, 1)",
					  "stroke_width"  : 0,
					  "stroke_pos": "inside",
					  "stroke": "rgba(240,240,250, 1)"};
 	
  	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoB);*/
  	tp_draw.getSingleton().drawImage("img/billing/btnPAGO.jpg", ctx, 0, 0);	
  	var custoT = JSON_Complete({font_size : 32,
					fill: "rgba(255, 255, 255, 1)",
					font_family: "Oxygen-Regular",
					text_align: "center,middle",
					text_multiline: true});
  	
  			custoT.font_size = 24;
		  	Canvas.drawText(ctx, "Saldo actual<!b>"+"|<!size=20>(total a pagar)<!>", new Rect(3, 0, ctx.viewportWidth-6, 68), custoT);
	  		Canvas.drawText(ctx, "<!size=42!b>$"+_data.price+"<!>", new Rect(3, 72, ctx.viewportWidth-6, 68), custoT);
		  	custoT.font_size = 18;
		  	custoT.text_align = "center,middle";
  	
  	if(_data.focus){
  		var custo = { "stroke": "rgba(240,240,250,1)",
  				 	  "stroke_width": 5,
  				 	  "stroke_pos": "inside",
  				 	  "rx":0};
  		Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custo);
  	}
  	
	ctx.drawObject(ctx.endObject());
}

invoice.drawReferences = function drawReferences(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	
	custo_f.text_align = "right,top"; 
	
	custo_f.font_size = 42* tpng.thema.text_proportion;
	Canvas.drawText(ctx,_data.text1, new Rect(64,0,ctx.viewportWidth-64,104), custo_f);
	custo_f.font_size = 20* tpng.thema.text_proportion;
	Canvas.drawText(ctx,_data.text2, new Rect(0,108,ctx.viewportWidth,68), custo_f);
	custo_f.font_family = "Oxygen-Bold";
	var banks = "";
	var values = "";
	for(var i = 0; i< _data.text3.length; i++){
		if(i <= _data.text3.length-1){
			banks = banks + _data.text3[i].label+"|";
		}
		else{
			banks = banks + _data.text3[i].label;
		}
		
	}
	for(var i = 0; i< _data.text3.length; i++){
		if(i <= _data.text3.length-1){
			values = values + _data.text3[i].value+"|";
		}
		else{
			values = values + _data.text3[i].value;
		}
		
	}
	custo_f.text_align = "left,top"; 
	Canvas.drawText(ctx,banks, new Rect(0,180,ctx.viewportWidth/2,ctx.viewportHeight-190), custo_f);
	custo_f.text_align = "right,top";
	Canvas.drawText(ctx,values, new Rect(0,180,ctx.viewportWidth,ctx.viewportHeight-190), custo_f);
	
	ctx.drawObject(ctx.endObject());	
}

invoice.drawLine2 = function drawLine2(){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custoW = {fill: "rgba(240,240,250,1)"};
    Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);  
    
		
	ctx.drawObject(ctx.endObject());	
}

invoice.drawComingSoon = function drawComingSoon(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
 
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	
	custo_f.text_align = "center,middle"; 
	
	custo_f.font_size = 32 * tpng.thema.text_proportion;
	Canvas.drawText(ctx,_data.text1, new Rect(0,0,ctx.viewportWidth,104), custo_f);
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	Canvas.drawText(ctx,_data.text2, new Rect(0,108,ctx.viewportWidth,68), custo_f);
	
	ctx.drawObject(ctx.endObject());	
}

invoice.drawConditions = function drawConditions(_data){

var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
 
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	
	custo_f.text_align = "right,middle"; 
	
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	Canvas.drawText(ctx,_data.text1, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
	
	ctx.drawObject(ctx.endObject());	

}

invoice.drawButtonList = function drawButtonList(_data){
		
	this.draw = function draw(focus) {
			var ctx = this.getContext("2d");
				ctx.beginObject();
	    		ctx.clear();
	    		if(focus){
					custoFocus = {  
						fill: "rgba(240,240,250,1)"
					};
			
					Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoFocus);
			
					var custo_t = JSON.stringify(this.themaData.standardFont);
						custo_t = JSON.parse(custo_t);
						custo_t.text_align = "center,middle";
						custo_t.fill = "rgba(30,30,40,1);"
						custo_t.font_size = 18* tpng.thema.text_proportion;
						Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_t);	
		}
		else{
			if(_data.active){
			custo = {  
				fill: "rgba(0,150,190,1)"
			};
			}
			else{
			custo = {  
				fill: "rgba(0,90,120,1)"
			};	
			
			}
			//botones
				Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custo);
		
			var custo_t = JSON.stringify(this.themaData.standardFont);
				custo_t = JSON.parse(custo_t);
				custo_t.text_align = "center,middle";
				custo_t.font_size = 18* tpng.thema.text_proportion;
				Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_t);	
		}
		
		    ctx.drawObject(ctx.endObject());
	   }
}

invoice.drawArrowsInv = function drawArrowsInv(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
    
	var custoW = {fill: "rgba(90,90,90,1)"};
	
	/*if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [13,0,2,ctx.viewportHeight], custoW);
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [18,0,2,ctx.viewportHeight], custoW);	*/
	
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 0);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}



function fechaTextoX(str){
	var date = getDateFromTextX(str);
	return date;	
}

function getDateFromTextX(str){

	var months = ["ene","feb","mar","abr","may","jun","jul","ago", "sep","oct","nov","dic"];
	
	str = str+"";
	var d1 = str.substring(0, str.indexOf('-'));
	var d2 = str.substring(str.indexOf('-')+1,str.length);
	day1 = d1.substring(0,str.indexOf('/'));
	day2 = d2.substring(0,str.indexOf('/'));
	month1 = d1.substring(str.indexOf('/')+1,str.indexOf('/')+3);
	month2 = d2.substring(str.indexOf('/')+1,str.indexOf('/')+3);
	month1 = month1-1;
	month2 = month2-1;
	
	var date1 = day1+"/"+months[month1];
	var date2 = day2+"/"+months[month2]; 
	
	var date = "(periodo "+date1+" - "+date2+")";
	
	return date;	
		
}
