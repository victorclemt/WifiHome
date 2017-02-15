//invoice.js - Rolas

FormWidget.registerTypeStandard("invoicePay");

function invoicePay(config, options){
    this.super(config, options);
    this.focus ="";
    this.fullList = [];
    this.firstList = [];
    this.secondList = [];
}

invoicePay.inherits(FormWidget);

invoicePay.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	var url = "img/commons/0x0-Back_Wood-BW_HD.jpg";
	this.home.setBg(url);
	this.home.showHeader({"section":"defaulting","simple": false,"fill": "rgba(0,0,0,0)"});
	this.BillVO = _data.billData;
	this.home.setPlayerStatus("STOP");
	this.getReferences();
	
}

invoicePay.prototype.getReferences = function getReferences(){
	var w = this.widgets;

	var bill = { "name":this.BillVO.name,"address":this.BillVO.address};
			w.clientdata.setData(bill);
	var data = {"text1":this.BillVO.text1,"text2":this.BillVO.text2,"text3":this.BillVO.text3,"text4":this.BillVO.text4};
			w.headers.setData(data);
			w.line.setData();
			var banks = [];
			var values = [];
			for(var i = 0; i< this.BillVO.bankReferences.length; i++){
				values[i] = this.BillVO.bankReferences[i].bankReferenceVO.value;
				banks[i] = this.BillVO.bankReferences[i].bankReferenceVO.label;
			}
			var str = "";
			for(var b = 0; b< this.BillVO.bankReferences.length; b++){
				if(banks[b] == "BANAMEX"){
					str = banks[b] + "----------------" + values[b];
				}

				if(banks[b] == "BANCO AZTECA"){
					str = str+"|"+ banks[b] + "------------------" + values[b];
				}
				if(banks[b] == "BANCOMER"){
					str = str+"|"+ banks[b] + "-- " + values[b];
				}
				if(banks[b] == "BANORTE"){
					str = str+"|"+ banks[b] + " ----- " + values[b];
				}
				if(banks[b] == "HSBC"){
					str = str+"|"+ banks[b] + " ---- " + values[b];
				}
				if(banks[b] == "SANTANDER"){
					str = str+"|"+ banks[b] + " ----- " + values[b];
				}
				if(banks[b] == "SCOTIABANK"){
					str = str+"|"+ banks[b] + "- " + values[b];
				}
			}

			w.references.setData({"text1":"Selecciona tu método de pago:","text2":"Recuerda que también puedes pagar en efectivo directamente en ventanilla de los bancos:","text3":str});
			w.line2.setData();
			w.comingsoon.setData({"text1":"Próximamente podrás pagar directamente en tu tv.","text2":"¡Manténte al pendiente!"});
		
		this.client.lock();
			w.clientdata.stateChange("enter");
			w.headers.stateChange("enter");
			w.line.stateChange("enter");
			w.references.stateChange("enter");
			w.line2.stateChange("enter");
			w.comingsoon.stateChange("enter");
			this.focus = "details";
		this.client.unlock();	
}

/*
invoicePay.prototype.responseGetInvoice = function responseGetInvoice(response){
	var w = this.widgets;
	if(response.status == 200){
		
		this.BillVO = response.data.BillVO;
		
		if(this.BillVO.status == 0){
			var bill = { "name":this.BillVO.Name[0],"address":this.BillVO.Address[0]};
			w.clientdata.setData(bill);
			
			
			var data = {"text1":"TU NÚMERO DE CUENTA","text2":this.BillVO.Account[0],"text3":"TU NÚMERO TELEFÓNICO","text4":this.BillVO.Telephone[0]};
			w.headers.setData(data);
			
			var payment = {"text1":this.BillVO.Plan[0],"text2":"Antes del|"+this.BillVO.DateDiscountPayment[0],"text3":"$"+this.BillVO.DiscountPayment[0],"text4":"Pronto |Pago","text5":"Antes del|"+this.BillVO.DatePayment[0],"text6":"$"+this.BillVO.ListPrice[0],"text7":"Precio de|lista"};
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
				//NGM.dump(this.BillVO);
			
				this.focus = "bill";
			this.client.unlock();
		
			
		}else if (this.BillVO.status == -1){
				w.notFound.setData();
				w.notFound.stateChange("enter");
				this.focus = "notFound";
			}
		
		}else{
		this.home.openSection("miniError", {"home": this.home,"code":response.status}, false,,true);
	}
}
*/

invoicePay.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
	switch(this.focus){
		case "details":
			switch(_key){
				case "KEY_IRENTER":
				case "KEY_IRBACK":
				case "KEY_MENU":
				
				this.client.lock();
					w.clientdata.stateChange("exit");
					w.headers.stateChange("exit");
					w.line.stateChange("exit");
					w.references.stateChange("exit");
					w.line2.stateChange("exit");
					w.comingsoon.stateChange("exit");
				this.client.unlock();
				
				this.home.hideBg();	
				this.home.hideHeader();
				this.home.closeSection(this);
				
				break;
				
				case "KEY_UP":
					
				
				break;
				
				/*case "KEY_TV_RED":
					this.formOpenChild("previews", {"home":this}, false);
				break;*/
		
			}
			break;
		case "bill":
			this.onKeyPressBillDetail(_key);
			break;
		/*case "charges":
			this.onKeyPressChargesDetail(_key);
			break;
		case "pay":
			this.onKeyPressPayButton(_key);
			break;*/
	}
	return true;
}

invoicePay.prototype.onKeyPressBillDetail = function onKeyPressBillDetail(_key){
	var w = this.widgets;
	switch(_key){
		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.hideBg();	
			this.home.hideHeader();
			this.home.closeSection(this);
		break;
		
		case "KEY_UP":
			w.billDetail.scrollPrev();
		break;
		
		case "KEY_DOWN":
			if(w.billDetail.stateGet() == "enter"){
				w.billDetail.scrollNext();
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
			}
		
		break;
		
		
		
		/*
		case "KEY_TV_RED":
			this.formOpenChild("previews", {"home":this}, false);
		break;*/
				
	
	}
	return true;
}

invoicePay.drawNotFound = function drawNotFound(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear(); 

	var custoErrorText = JSON.stringify(this.themaData.standardFont);
		custoErrorText = JSON.parse(custoErrorText);

		custoErrorText.font_size = 32* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,top";

	Canvas.drawText(ctx,"<!i>El estado de cuenta no está disponible por el momento<!i>", new Rect(67,72,1146,36), custoErrorText);
	
		custoErrorText.font_size = 26* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,bottom";
		
	Canvas.drawText(ctx,"<!i>Por favor inténtalo más tarde.<!i>", new Rect(387,108,507,32), custoErrorText);
	
		custoErrorText.font_size = 18* tpng.thema.text_proportion;
		custoErrorText.text_align = "center,middle";
		
	Canvas.drawText(ctx,"<!i>Presiona OK para salir.<!i>", new Rect(451,180,378,32), custoErrorText);
	
	ctx.drawObject(ctx.endObject());
}

invoicePay.drawClientData = function drawClientData(_data){ 	
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

invoicePay.drawHeaders = function drawHeaders(_data){ 	
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
	
	Canvas.drawShape(ctx, "rect", [256,0,250,32],custo);
	
	Canvas.drawText(ctx, _data.text3, new Rect(256,0,250,32), custo_f);
	custo_f.font_size = 24* tpng.thema.text_proportion;	
	
	custo.fill = "rgba(85,95,105,1)";
	
	Canvas.drawShape(ctx, "rect", [0,32,250,32],custo); //FONDO
	Canvas.drawText(ctx, _data.text2, new Rect(0,32,250,32), custo_f);
	
	Canvas.drawShape(ctx, "rect", [256,32,250,32],custo); //FONDO
	Canvas.drawText(ctx, _data.text4, new Rect(256,32,250,32), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

invoicePay.drawReferences = function drawReferences(_data){ 	
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
	
	
	Canvas.drawText(ctx, _data.text3, new Rect(0,180,ctx.viewportWidth,176), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

invoicePay.drawPayment = function drawPayment(_data){ 	
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
	Canvas.drawText(ctx,"   Plan "+_data.text1, new Rect(0,34,122,32), custo_f);
	
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

invoicePay.drawLine = function drawLine(_data){ 	
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

invoicePay.drawLine2 = function drawLine2(){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custoW = {fill: "rgba(240,240,250,1)"};
    Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);  
    
		
	ctx.drawObject(ctx.endObject());	
}

invoicePay.drawPayButton = function drawPayButton(_data){
	var ctx = this.getContext("2d");
    ctx.beginObject();
  	ctx.clear();
  	
  	var custoB = {"fill" : "rgba(0, 90,120, 1)",
					  "stroke_width"  : 0,
					  "stroke_pos": "inside",
					  "stroke": "rgba(240,240,250, 1)"};
  	//tp_draw.getSingleton().drawImage("imgs/billing/invoice/pago.png", false, ctx, 0, 0);
  	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoB);
  	var custoT = JSON_Complete({font_size : 32,
					fill: "rgba(255, 255, 255, 1)",
					font_family: "Oxygen-Regular",
					text_align: "center,middle",
					text_multiline: true});
  	/*if(_data.show == "true"){
  		custoT.font_size = 24;
	  	Canvas.drawText(ctx, "<b>Saldo actual<!b>"+"|<!size=22!b>(total a pagar)<!>", new Rect(0, 0, ctx.viewportWidth, 161), custoT);
	  	Canvas.drawText(ctx, "<!size=42!b>$"+_data.price+"<!>", new Rect(10, 134, ctx.viewportWidth, 133), custoT);
	  	
	  	custoT.font_size = 22;
	  	custoT.text_align = "left,bottom";
	  	Canvas.drawText(ctx, "Saldo actual", new Rect(10, 114, ctx.viewportWidth, 47), custoT);
  	}else {
  		if(_data.show == "false"){*/
  			custoT.font_size = 24;
		  	Canvas.drawText(ctx, "Saldo actual<!b>"+"|<!size=20>(total a pagar)<!>", new Rect(0, 0, ctx.viewportWidth, 68), custoT);
	  		Canvas.drawText(ctx, "<!size=42!b>$"+_data.price+"<!>", new Rect(0, 72, ctx.viewportWidth, 68), custoT);
	  		
		  	custoT.font_size = 18;
		  	custoT.text_align = "left,middle";
		  	Canvas.drawText(ctx, "<!b>  Tarjeta de Débito o Crédito:<!>", new Rect(0, 144, ctx.viewportWidth, 32), custoT);
		  	custoT.text_align = "left,top";
		  	Canvas.drawText(ctx, "  Marca al 15798000", new Rect(0, 176, ctx.viewportWidth, 32), custoT);
		  	Canvas.drawText(ctx, "<!b>  En efectivo:<!>", new Rect(0, 208, ctx.viewportWidth, 32), custoT);
		  	Canvas.drawText(ctx, " Banco Azteca| Bancomer| HSBC", new Rect(0, 240, ctx.viewportWidth/2, 68), custoT);
		  	Canvas.drawText(ctx, " Banorte| Scotiabank| Santander", new Rect(128, 240, ctx.viewportWidth/2, 68), custoT);
		  	Canvas.drawText(ctx, " Banamex", new Rect(128, 298, ctx.viewportWidth, 32), custoT);
		  //}
  	//}
  	
  	if(_data.focus){
  		var custo = { "stroke": "rgba(240,240,250,1)",
  				 	  "stroke_width": 5,
  				 	  "stroke_pos": "inside",
  				 	  "rx":0};
  		Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custo);
  	}
  	
	ctx.drawObject(ctx.endObject());
}

invoicePay.drawComingSoon = function drawComingSoon(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
 
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	
	
	custo_f.text_align = "center,middle"; 
	
	custo_f.font_size = 32* tpng.thema.text_proportion;
	Canvas.drawText(ctx,_data.text1, new Rect(0,32,ctx.viewportWidth,68), custo_f);
	custo_f.font_size = 20* tpng.thema.text_proportion;
	Canvas.drawText(ctx,_data.text2, new Rect(0,110,ctx.viewportWidth,32), custo_f);
	//custo_f.font_family = "Oxygen-Bold";
	
	
	//Canvas.drawText(ctx, _data.text3, new Rect(0,180,ctx.viewportWidth,176), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}