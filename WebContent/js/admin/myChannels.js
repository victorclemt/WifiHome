function myChannels(_json, _options){
    this.super(_json, _options);
    this.myChannels;
  	this.actualP;
  	this.focus = "myHdChannels";
  	this.first = 0;
}

myChannels.inherits(FormWidget);


myChannels.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;
	var w = this.widgets;
	
	this.home.showHeader({"section":"defaulting","simple": false,"fill": "rgba(0,0,0,0)"});

	this.getPackageChannels();
	
	
}

myChannels.prototype.changePlayerMini = function changePlayerMini(){
	this.home.widgets.player.speed = 0;
	this.home.widgets.player.stateChange("myChannels");
}

myChannels.prototype.onStreamEvent = function onStreamEvent(event) {
	var w = this.widgets;
	
	if(event.type == "end"){
		this.home.setPlayerStatus("STOP");
	}
	if(event.type == "tuner"){
		var url = "img/billing/Az1_Inicio1.jpg";
		this.home.setBg(url);
		//this.setBackground(url);
	}
	if(event.type == "start"){
		if(this.first == 0){
					this.first = 1;
				
				if(this.chann.length > 8){
					var state = "exit_8";
					w.rightArrowHd.setData({"url":"", "line": false, "position": ""});
					w.rightArrowHd.speed = 0;
					w.rightArrowHd.stateChange(state);
					state = "enter_8";
					w.rightArrowHd.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": ""});
				}
				else{
					var state = "exit_"+this.chann.length;
					w.rightArrowHd.setData({"url":"", "line": false, "position": ""});
					w.rightArrowHd.speed = 0;
					w.rightArrowHd.stateChange(state);
				    state = "enter_"+this.chann.length;
				    w.rightArrowHd.setData({"url":"", "line": true, "position": "right"});
				}
				
				if(this.sdchann.length > 8){
					var state2 = "exit_8";
					w.rightArrowSd.setData({"url":"", "line": false, "position": ""});
					w.rightArrowSd.speed = 0;
					w.rightArrowSd.stateChange(state2);
					state2 = "enter_8";
					w.rightArrowSd.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": ""});
				}
				else{
					var state2 = "exit_"+this.sdchann.length;
					w.rightArrowSd.setData({"url":"", "line": false, "position": ""});
					w.rightArrowSd.speed = 0;
					w.rightArrowSd.stateChange(state2);
				    state2 = "enter_"+this.sdchann.length;
				    w.rightArrowSd.setData({"url":"", "line": true, "position": "right"});
				}
				w.shadow1.setData();
				w.shadow2.setData({"text1":"Mi Paquete: ","text2":"Básico","text3":this.chann.length,"text4":"Canales","text5":this.sdchann.length,"text6":"Canales HD","text7":"Add-on: ","text8":"HBO(10), FOX+(9),Al Jazeera(1)"});
				w.shadow3.setData();
				w.shadow1.stateChange("enter");
				w.shadow2.stateChange("enter");
				w.shadow3.stateChange("enter");
				var buttons = [
								{"id":"i","text":"Ir a mi Estado de cuenta"}
							  ];
				w.invButtons.setData(buttons);
				w.invButtons.stateChange("enter");
				w.invButtons.setFocus(false);
				
				
				w.leftArrowHd.stateChange("enter");
				w.leftArrowSd.stateChange("enter");
				w.hdChannels.stateChange("enter");
				w.countHd.setData({"text":"Canales HD","num":w.hdChannels.selectIndex+1,"total":w.hdChannels.list.length});
				w.sdChannels.stateChange("enter");
				w.countSd.setData({"text":"Canales","num":"","total":w.sdChannels.list.length});
				w.countSd.stateChange("enter");
				w.countHd.stateChange("enter");
				w.rightArrowHd.speed = 100;
				w.rightArrowHd.stateChange(state);
				w.rightArrowSd.speed = 100;
				w.rightArrowSd.stateChange(state2);	
				
				if(this.focus == "myHdChannels")
				w.sdChannels.setFocus(false);
				
				this.lockKey = true;
				
		}
		else{
			
			
		}
	}
}

myChannels.prototype.getPackageChannels = function getPackageChannels(){
		this.responseGetPackageChannels();
	//getServices.getSingleton().call("RECOMMENDATION_GET_PROGRAM", , this.responseGetRecommendations.bind(this));
}

myChannels.prototype.responseGetPackageChannels = function responseGetPackageChannels(response){
	
	//if(response.status == 200){
	var w = this.widgets;
	this.chann = [];
	this.sdchann = [];
	if(tpng.app.channelList.length > 0){
		for(var i = 0; i< 6; i++){
			if(tpng.app.channelList[i].ChannelVO.number == 6){}
			else{
				this.chann.push({"number":tpng.app.channelList[i].ChannelVO.number,"img":tpng.app.channelList[i].ChannelVO.images.url1X1});
			}
		} 
		for(var i = 0; i< 10; i++){
			if(tpng.app.channelList[i].ChannelVO.number == 6){}
			else{
				this.sdchann.push({"number":tpng.app.channelList[i].ChannelVO.number,"img":tpng.app.channelList[i].ChannelVO.images.url1X1});
			}
		} 
		
		w.hdChannels.setData(this.chann);
		w.sdChannels.setData(this.sdchann);
		w.leftArrowHd.setData({"url": "" ,"line": true, "position": "left"});
		w.leftArrowSd.setData({"url": "" ,"line": true, "position": "left"});
		
	
		
	this.client.lock();	
		
		
		this.currentCh = tpng.app.currentChannel;
		this.home.objectChild = this;
		tpng.app.programInfo = "timeline";
		this.home.tuneInByNumber(w.hdChannels.selectItem.number,false,null,false);
		this.changePlayerMiniVar = this.changePlayerMini.bind(this).delay(1000);
		
	this.client.unlock();
	
	}
}

myChannels.prototype.setKeyTrue = function setKeyTrue(){
	this.lockKey = true;
}

myChannels.prototype.loadPaintImg = function loadPaintImg(_url){
	//Función que pinta la imagen hasta que se descarga
	//Para transiciones de vodHome, menú y wizard VOD
	var o = {"home":this.home};//Argumentos que mandamos a la función callback
	//Verificamos que la imagen esté en caché
	var img = NGM.imageCache.get(_url);
	
	//Si está en cache mandamos directamente a la función callback
    if (img) {
        this.imgLoadCb(_url, img, o);
        return;
    }else{
    //sino descargamos la imagen del backend y enviamos la función callback
		var options = {"id"        : _url,
	                   "noload"    : false,
	                   "persistent": true,
	                   "expireIn"  : 12*60*60,    // could be replace by this.expireIn for setting management
	                   "callback"  : this.imgLoadCb,
	                   "opaque"    : o};
	     NGM.imageCache.add(_url, options);
     }
}

myChannels.prototype.imgLoadCb = function imgLoadCb(url, img, arg){
	//Función callback que setea la imagen en el background principal
	//del HOME, adicional cambia el speed de entrada para lograr una 
	//mejor transición.
	if(img.size){
	var bg = arg.home.widgets.mainBg;
		bg.setData(img);
		bg.stateChange("enter",500);
	}	
//	delete img;
	//Importante siempre borrar la imagen para no llenar la buffer gráfico.
}

myChannels.onFocusHdChannels = function onFocusHdChannels(_focus,_data){
	var w = this.widgets;

	if(_focus){
			var bg = this.home.widgets.mainBg;
			//var url = "img/billing/18x18-Back.jpg";
				//bg.setData(url);
				//bg.stateChange("medium");
			tpng.app.programInfo = "timeline";	
			this.home.tuneInByNumber(w.hdChannels.selectItem.number,false,null,false);
			this.changePlayerMiniVar = this.changePlayerMini.bind(this).delay(1000);
		}
}

myChannels.onFocusSdChannels = function onFocusSdChannels(_focus,_data){
	var w = this.widgets;

	if(_focus){
			var bg = this.home.widgets.mainBg;
			//var url = "img/billing/18x18-Back.jpg";
				//bg.setData(url);
				//bg.stateChange("medium");
			tpng.app.programInfo = "timeline";	
			this.home.tuneInByNumber(w.sdChannels.selectItem.number,false,null,false);
			this.changePlayerMiniVar = this.changePlayerMini.bind(this).delay(1000);
		}
}


myChannels.prototype.setBackground = function setBackground(_url){

	var bg = this.home.widgets.mainBg;
	this.loadPaintImg(_url);
}

myChannels.prototype.onKeyPress = function onKeyPress(_key){
	var w = this.widgets;
	switch(_key){
		case "KEY_MENU":
				case "KEY_IRBACK":
					this.home.closeSection(this);
					this.home.hideBg();
					this.home.hideHeader();
				break;
	}
	
	switch(this.focus){
		case "myHdChannels":
				this.onKeyPressHdChannels(_key);
			break;
		case "mySdChannels":
				this.onKeyPressSdChannels(_key);
			break;
		case "search":
				this.onKeyPressSearch(_key);	
			break;	
		case "buttons":
				this.onKeyPressButtons(_key);	
			break;	
			
	}
	return true;	
}

myChannels.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
		var w = this.widgets;
		switch(_key){
				case "KEY_DOWN":
				case "KEY_MENU":
				case "KEY_IRBACK":
					this.lockKey = false;
					this.setKeyTrue.bind(this).delay(300);
					this.home.disableSearchHeader();
					w.invButtons.setFocus(true);
					this.focus = "buttons";
				break;
				
				default:
					this.home.onKeyPress(_key);
				break;	
			}

}

myChannels.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
	var w = this.widgets;
			if(this.lockKey){
			switch(_key){
				case "KEY_MENU":
				case "KEY_IRBACK":
					w.invButtons.stateChange("exit");
					w.countHd.stateChange("exit");
					w.countSd.stateChange("exit");
					this.home.closeSection(this);
					this.home.hideBg();
					this.home.hideHeader();
				break;
					
				case "KEY_DOWN":	
					this.lockKey = false;
					this.setKeyTrue.bind(this).delay(3500);
					w.invButtons.setFocus(false);
					w.hdChannels.setFocus(true);
					//this.lastFocus = this.focus;
					this.focus = "myHdChannels";
				break;
				
				case "KEY_IRENTER":
					switch(w.invButtons.selectItem.id){
						case "i":
							w.invButtons.stateChange("exit");
							w.countHd.stateChange("exit");
							w.countSd.stateChange("exit");
							this.home.closeSection(this);
							this.home.openSection("invoice",{"home": this.home}, true);
						break;
					}
				break;
				
				/*case "KEY_LEFT":
				case "KEY_RIGHT":	
					_key == "KEY_LEFT"
				if(_key == "KEY_LEFT"){
					if(w.invButtons.scrollPrev()){
						this.lockKey = false;
						this.setKeyTrue.bind(this).delay(4000);
						if(w.invButtons.maxItem > 8){		
									if(w.invButtons.selectIndex >= 8){
										w.leftArrowHd.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
										w.leftArrowHd.stateChange("enter");
									}
									if(w.invButtons.selectIndex == (w.invButtons.maxItem-1)){
										w.rightArrowHd.setData({"url": "" ,"line":true, "position": "right"});
										w.rightArrowHd.stateChange("enter");
									}
									if(w.invButtons.selectIndex == 0){
										w.leftArrowHd.setData({"url":"", "line":true, "position": "left"});
										w.leftArrowHd.stateChange("enter");
									}
									if(w.invButtons.selectIndex+1 <= w.invButtons.maxItem-8){
										w.rightArrowHd.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
										w.rightArrowHd.stateChange("enter");
									}
						}
						w.countHd.setData({"text":"Canales HD","num":w.invButtons.selectIndex+1,"total":w.hdChannels.list.length});
						w.countHd.redraw();
						
					}	
					}
					else{
					  if(w.hdChannels.scrollNext()){
					  	this.lockKey = false;
					  	this.setKeyTrue.bind(this).delay(4000);
						if(w.hdChannels.maxItem > 8){		
									if(w.hdChannels.selectIndex >= 8){
										w.leftArrowHd.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
										w.leftArrowHd.stateChange("enter");
									}
									if(w.hdChannels.selectIndex == (w.hdChannels.maxItem-1)){
										w.rightArrowHd.setData({"url": "" ,"line":true, "position": "right"});
										w.rightArrowHd.stateChange("enter");
									}
									if(w.hdChannels.selectIndex == 0){
										w.leftArrowHd.setData({"url":"", "line":true, "position": "left"});
										w.leftArrowHd.stateChange("enter");
									}
									if(w.hdChannels.selectIndex < 4 && w.hdChannels.maxItem-3){
										w.rightArrowHd.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
										w.rightArrowHd.stateChange("enter");
									}	
						}
					w.countHd.setData({"text":"Canales HD","num":w.hdChannels.selectIndex+1,"total":w.hdChannels.list.length});
					w.countHd.redraw();
					}
					
					}
					
					
				break;
				*/
				case "KEY_UP":
					//this.lastFocus = this.focus;
					this.focus = "search";
					this.home.enableSearchHeader();
					w.invButtons.setFocus(false);
				break;
				
			}
	}
}




myChannels.prototype.onKeyPressHdChannels = function onKeyPressHdChannels(_key){
	var w = this.widgets;
			if(this.lockKey){
			switch(_key){
				case "KEY_MENU":
				case "KEY_IRBACK":
					w.invButtons.stateChange("exit");
					w.countHd.stateChange("exit");
					w.countSd.stateChange("exit");
					this.home.closeSection(this);
					this.home.hideBg();
					this.home.hideHeader();
				break;
					
				case "KEY_DOWN":	
				this.lockKey = false;
				this.setKeyTrue.bind(this).delay(3500);
				if(w.hdChannels.list.length > w.sdChannels.list.length){
					if(w.hdChannels.focusIndex >= w.sdChannels.list.length){
						w.sdChannels.focusIndex = w.sdChannels.list.length-1;
					}
					else{
						w.sdChannels.focusIndex = w.hdChannels.focusIndex;
					}
				} 	
				else{
					w.sdChannels.focusIndex = w.hdChannels.focusIndex;
				
				}
					w.hdChannels.setFocus(false);
					w.sdChannels.setFocus(true);
					w.countSd.setData({"text":"Canales","num":w.sdChannels.selectIndex+1,"total":w.sdChannels.list.length});
					w.countSd.redraw();	
					
					w.countHd.setData({"text":"Canales HD","num":"","total":w.hdChannels.list.length});
					w.countHd.redraw();
					//this.lastFocus = this.focus;
					this.focus = "mySdChannels";
					
				break;
				
				case "KEY_LEFT":
				case "KEY_RIGHT":	
					_key == "KEY_LEFT"
				if(_key == "KEY_LEFT"){
					if(w.hdChannels.scrollPrev()){
						this.lockKey = false;
						this.setKeyTrue.bind(this).delay(3500);
						if(w.hdChannels.maxItem > 8){		
									if(w.hdChannels.selectIndex >= 8){
										w.leftArrowHd.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
										w.leftArrowHd.stateChange("enter");
									}
									if(w.hdChannels.selectIndex == (w.hdChannels.maxItem-1)){
										w.rightArrowHd.setData({"url": "" ,"line":true, "position": "right"});
										w.rightArrowHd.stateChange("enter");
									}
									if(w.hdChannels.selectIndex == 0){
										w.leftArrowHd.setData({"url":"", "line":true, "position": "left"});
										w.leftArrowHd.stateChange("enter");
									}
									if(w.hdChannels.selectIndex+1 <= w.hdChannels.maxItem-8){
										w.rightArrowHd.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
										w.rightArrowHd.stateChange("enter");
									}
						}
						w.countHd.setData({"text":"Canales HD","num":w.hdChannels.selectIndex+1,"total":w.hdChannels.list.length});
						w.countHd.redraw();
						
					}	
					}
					else{
					  if(w.hdChannels.scrollNext()){
					  	this.lockKey = false;
					  	this.setKeyTrue.bind(this).delay(3500);
						if(w.hdChannels.maxItem > 8){		
									if(w.hdChannels.selectIndex >= 8){
										w.leftArrowHd.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
										w.leftArrowHd.stateChange("enter");
									}
									if(w.hdChannels.selectIndex == (w.hdChannels.maxItem-1)){
										w.rightArrowHd.setData({"url": "" ,"line":true, "position": "right"});
										w.rightArrowHd.stateChange("enter");
									}
									if(w.hdChannels.selectIndex == 0){
										w.leftArrowHd.setData({"url":"", "line":true, "position": "left"});
										w.leftArrowHd.stateChange("enter");
									}
									if(w.hdChannels.selectIndex < 4 && w.hdChannels.maxItem-3){
										w.rightArrowHd.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
										w.rightArrowHd.stateChange("enter");
									}	
						}
					w.countHd.setData({"text":"Canales HD","num":w.hdChannels.selectIndex+1,"total":w.hdChannels.list.length});
					w.countHd.redraw();
					}
					
					}
					
					
				break;
				
				case "KEY_UP":
					//this.lastFocus = this.focus;
					this.focus = "buttons";
					w.invButtons.setFocus(true);
					//this.home.enableSearchHeader();
					w.hdChannels.setFocus(false);
				break;
				
				case "KEY_IRENTER":
							w.invButtons.stateChange("exit");
							w.countHd.stateChange("exit");
							w.countSd.stateChange("exit");
							this.home.closeSection(this);
							this.home.tuneInByNumber(w.hdChannels.selectItem.number,false,null,false);
				break;
				
			}
	}
}

myChannels.prototype.onKeyPressSdChannels = function onKeyPressSdChannels(_key){
	var w = this.widgets;
			
			if(this.lockKey){
			switch(_key){

				case "KEY_MENU":
				case "KEY_IRBACK":
					w.invButtons.stateChange("exit");
					w.countHd.stateChange("exit");
					w.countSd.stateChange("exit");
					this.home.closeSection(this);
					this.home.hideBg();
					this.home.hideHeader();
				break;
				
				case "KEY_UP":	
					this.lockKey = false;
						this.setKeyTrue.bind(this).delay(3500);
					if(w.sdChannels.list.length > w.hdChannels.list.length){
						if(w.sdChannels.focusIndex >= w.hdChannels.list.length){
							w.hdChannels.focusIndex = w.hdChannels.list.length-1;
						}
						else{
							w.hdChannels.focusIndex = w.sdChannels.focusIndex;
						}
					} 	
					else{
						w.hdChannels.focusIndex = w.sdChannels.focusIndex;
				
					}
					w.hdChannels.setFocus(true);
					w.sdChannels.setFocus(false);
					w.countHd.setData({"text":"Canales HD","num":w.hdChannels.selectIndex+1,"total":w.hdChannels.list.length});
					w.countHd.redraw();
					
					w.countSd.setData({"text":"Canales","num":"","total":w.sdChannels.list.length});
					w.countSd.redraw();
					//this.lastFocus = this.focus;
					this.focus = "myHdChannels";
				break;
				
				case "KEY_LEFT":
				case "KEY_RIGHT":		
					_key == "KEY_LEFT"
				if(_key == "KEY_LEFT"){
					if(w.sdChannels.scrollPrev()){
						this.lockKey = false;
						this.setKeyTrue.bind(this).delay(3500);
						if(w.sdChannels.maxItem > 8){		
									if(w.sdChannels.selectIndex >= 8){
										w.leftArrowSd.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
										w.leftArrowSd.stateChange("enter");
									}
									if(w.sdChannels.selectIndex == (w.sdChannels.maxItem-1)){
										w.rightArrowSd.setData({"url": "" ,"line":true, "position": "right"});
										w.rightArrowSd.stateChange("enter");
									}
									if(w.sdChannels.selectIndex == 0){
										w.leftArrowSd.setData({"url":"", "line":true, "position": "left"});
										w.leftArrowSd.stateChange("enter");
									}
									if(w.sdChannels.selectIndex+1 <= w.sdChannels.maxItem-8){
										w.rightArrowSd.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
										w.rightArrowSd.stateChange("enter");
									}
						}
					}
					w.countSd.setData({"text":"Canales","num":w.sdChannels.selectIndex+1,"total":w.sdChannels.list.length});
					w.countSd.redraw();
					}
					else{
					  if(w.sdChannels.scrollNext()){
					  	this.lockKey = false;
					  	this.setKeyTrue.bind(this).delay(3500);
						if(w.sdChannels.maxItem > 8){		
									if(w.sdChannels.selectIndex >= 8){
										w.leftArrowSd.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
										w.leftArrowSd.stateChange("enter");
									}
									if(w.sdChannels.selectIndex == (w.sdChannels.maxItem-1)){
										w.rightArrowSd.setData({"url": "" ,"line":true, "position": "right"});
										w.rightArrowSd.stateChange("enter");
									}
									if(w.sdChannels.selectIndex == 0){
										w.leftArrowSd.setData({"url":"", "line":true, "position": "left"});
										w.leftArrowSd.stateChange("enter");
									}
									if(w.sdChannels.selectIndex < 4 && w.sdChannels.maxItem-3){
										w.rightArrowSd.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
										w.rightArrowSd.stateChange("enter");
									}	
						}
					}
					w.countSd.setData({"text":"Canales","num":w.sdChannels.selectIndex+1,"total":w.sdChannels.list.length});
					w.countSd.redraw();
					}
				
				
				break;
				
				case "KEY_IRENTER":
							w.invButtons.stateChange("exit");
							w.countHd.stateChange("exit");
							w.countSd.stateChange("exit");
							this.home.closeSection(this);
							this.home.tuneInByNumber(w.sdChannels.selectItem.number,false,null,false);
				break;
			}
	}
}


myChannels.drawInvoiceButtons = function drawInvoiceButtons(_data){ 	

	this.draw = function draw(focus) {
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custoText = JSON.stringify(this.themaData.standardFont);
	custoText = JSON.parse(custoText);	
	custoText.text_align = "center,middle";
	custoText.font_size = 20 * tpng.thema.text_proportion;
	
	if(!focus){	
		var custoText = JSON.stringify(this.themaData.standardFont);
		custoText = JSON.parse(custoText);
		custoText.text_align = "center,middle";
		custoText.font_size = 20 * tpng.thema.text_proportion;
		var custo = {fill: "0-rgba(190,50,120,0)|1-rgba(150,40,100,.9)"};
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		Canvas.drawText(ctx,_data.text, new Rect(3,3,ctx.viewportWidth-6,ctx.viewportHeight-6), custoText);
	}
	else{
		var custoText = JSON.stringify(this.themaData.standardFont);
		custoText = JSON.parse(custoText);
		custoText.text_align = "center,middle";
		custoText.fill = "rgba(30,30,40,1)";
		custoText.font_size = 20 * tpng.thema.text_proportion;
		var custo = {"fill": "rgba(240,240,250,1)","stroke_width":3,"stroke":"rgba(240,240,250,1)"};
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		Canvas.drawText(ctx,_data.text, new Rect(3,3,ctx.viewportWidth-6,ctx.viewportHeight-6), custoText);
	}
		ctx.drawObject(ctx.endObject());
	}	
}


myChannels.drawPackageChannels = function drawPackageChannels(_data){ 	

	
	this.draw = function draw(focus) {
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custoText = JSON.stringify(this.themaData.standardFont);
	custoText = JSON.parse(custoText);	
	custoText.text_align = "center,middle";
	custoText.font_size = 20 * tpng.thema.text_proportion;
	
	
	 var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLinePanel);
		 custo = JSON.parse(custo);
		//custo.fill = "rgba(30,30,30,.9)";
		
		
		//STROKE BLANCO U OUTLINE GRIS
		custo.fill = "rgba(30,30,40,.9)";
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		tp_draw.getSingleton().drawImage(_data.img, ctx, 30, 17); //tmp el w y h	
		var num = _data.number.toString();
			Canvas.drawText(ctx,"Canal "+num, new Rect(3,68,ctx.viewportWidth-6,32), custoText);
		ctx.drawObject(ctx.endObject());
	}	
}

myChannels.drawArrowsChan = function drawArrowsChan(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
	var custoW = {fill: "rgba(240,240,250,1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [13,0,2,ctx.viewportHeight], custoW);
	
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [13,0,2,ctx.viewportHeight], custoW);	
	
	
	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 35);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}

myChannels.drawShadow = function drawShadow(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
	var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
		custo = JSON.parse(custo);
		custo.fill = "rgba(30,30,40,.9)";
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);	
		var custoW = {fill: "rgba(0,190,230,1)"};
		
		Canvas.drawShape(ctx, "rect", [0,62,ctx.viewportWidth,8], custoW);	
		var custoText = JSON.stringify(this.themaData.standardFont);
		custoText = JSON.parse(custoText);
		
		custoText.text_align = "center,middle";
		custoText.font_size = 20 * tpng.thema.text_proportion;
		if(_data.text1 != undefined)
		Canvas.drawText(ctx,_data.text1, new Rect(0,0,122,68), custoText);
		
		custoText.font_size = 32 * tpng.thema.text_proportion;
		custoText.text_align = "left,middle";
		if(_data.text2 != undefined)
		Canvas.drawText(ctx,"<!b>"+_data.text2+"<!>", new Rect(128,0,122,68), custoText);
		
		custoText.font_size = 32 * tpng.thema.text_proportion;
		custoText.text_align = "center,middle";
		if(_data.text3 != undefined)
		Canvas.drawText(ctx,"<!b>"+_data.text3+"<!>", new Rect(128,72,64,68), custoText);
		
		custoText.font_size = 20 * tpng.thema.text_proportion;
		custoText.text_align = "center,bottom";
		if(_data.text4 != undefined)
		Canvas.drawText(ctx,_data.text4, new Rect(192,72,72,68), custoText);
    	
    	custoText.font_size = 32 * tpng.thema.text_proportion;
		custoText.text_align = "center,middle";
		if(_data.text5 != undefined)
		Canvas.drawText(ctx,"<!b>"+_data.text5+"<!>", new Rect(314,72,64,68), custoText);
		
		custoText.font_size = 20 * tpng.thema.text_proportion;
		custoText.text_align = "center,middle";
		if(_data.text6 != undefined)
		Canvas.drawText(ctx,_data.text6, new Rect(378,72,144,68), custoText);
		
		custoText.font_size = 20 * tpng.thema.text_proportion;
		custoText.text_align = "center,middle";
		if(_data.text7 != undefined)
		Canvas.drawText(ctx,"<!b>"+_data.text7+"<!>"+_data.text8, new Rect(0,144,570,32), custoText);
    	
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}

myChannels.drawCount = function drawCount(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
	var custo = JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
		custo = JSON.parse(custo);
			
		var custoText = JSON.stringify(this.themaData.standardFont);
		custoText = JSON.parse(custoText);
		custoText.text_align = "right,bottom";
		custoText.font_size = 20 * tpng.thema.text_proportion;
		Canvas.drawText(ctx,_data.text, new Rect(0,32,ctx.viewportWidth,20), custoText);
		if(_data.num > 0){
			Canvas.drawText(ctx,"<!size=25!b>"+_data.num+"<!>/"+_data.total+"<!>", new Rect(0,64,ctx.viewportWidth,20), custoText);
		}
		else{
			Canvas.drawText(ctx,"<!b>"+_data.total+"<!>", new Rect(0,64,ctx.viewportWidth,20), custoText);
		}
		//Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);	
		//var custoW = {fill: "rgba(0,190,230,1)"};
		
		//Canvas.drawShape(ctx, "rect", [0,62,ctx.viewportWidth,8], custoW);	
		
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}

myChannels.prototype.onExit = function onExit(_data){
	tpng.app.currentChannel = this.currentCh;
	this.home.disableSearchHeader();
	var w = this.widgets;
	//if(this.actualForm == "open"){
		//this.closeLists();
	//}
	//clearTimeout(this.changePlayerMiniVar);
	//clearTimeout(this.timerLoadData);
	//this.widgets.descriptionItem.setData(null);
	this.home.widgets.player.stateChange("exit");
	this.client.lock();
		w.shadow1.stateChange("exit");
		w.shadow2.stateChange("exit");
		w.leftArrowHd.stateChange("exit");
		w.leftArrowSd.stateChange("exit");
		w.sdChannels.stateChange("exit");
		w.hdChannels.stateChange("exit");
		w.rightArrowHd.speed = 100;
		switch(w.rightArrowHd.stateGet()){
			case "enter_1":
				w.rightArrowHd.stateChange("exit_1");
			break;
			
			case "enter_2":
				w.rightArrowHd.stateChange("exit_2");
			break;
			
			case "enter_3":
				w.rightArrowHd.stateChange("exit_3");
			break;
			
			case "enter_4":
				w.rightArrowHd.stateChange("exit_4");
			break;
			
			case "enter_5":
				w.rightArrowHd.stateChange("exit_5");
			break;
			
			case "enter_6":
				w.rightArrowHd.stateChange("exit_6");
			break;
			
			case "enter_7":
				w.rightArrowHd.stateChange("exit_7");
			break;
			
			case "enter_8":
				w.rightArrowHd.stateChange("exit_8");
			break;
		}
		
		switch(w.rightArrowSd.stateGet()){
			case "enter_1":
				w.rightArrowSd.stateChange("exit_1");
			break;
			
			case "enter_2":
				w.rightArrowSd.stateChange("exit_2");
			break;
			
			case "enter_3":
				w.rightArrowSd.stateChange("exit_3");
			break;
			
			case "enter_4":
				w.rightArrowSd.stateChange("exit_4");
			break;
			
			case "enter_5":
				w.rightArrowSd.stateChange("exit_5");
			break;
			
			case "enter_6":
				w.rightArrowSd.stateChange("exit_6");
			break;
			
			case "enter_7":
				w.rightArrowSd.stateChange("exit_7");
			break;
			
			case "enter_8":
				w.rightArrowSd.stateChange("exit_8");
			break;
		}
		this.home.setPlayerStatus("STOP");
		this.home.objectChild = null;
		this.home.hideHeader();
		this.home.hideBg();
		this.home.closeAllNew(true);
	this.client.unlock();
	
}