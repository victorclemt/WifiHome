// tutorials.js
function tutorials(config, options){  
    this.super(config, options);
    this.items = [];
    this.actualFocus = "";
    this.step = 1;
    this.home;
    this.dir = "";
}

tutorials.inherits(FormWidget);

tutorials.prototype.onEnter = function onEnter(_data){

	var widgets = this.widgets;
	this.home = _data.home;
	
		this.getUserData();
	
}

tutorials.prototype.onExit = function onExit(_data){
	tpng.app.section = "home";
}

tutorials.prototype.getUserData = function getUserData(){

getServices.getSingleton().call("ADMIN_GET_TUTORIALS",, this.responseGetUserData.bind(this));

}

tutorials.prototype.responseGetUserData = function responseGetUserData(response){
var w = this.widgets;
if(response.status == 200){
		
			this.tutorials = response.data.array;
			this.imgs = [];
			
			for(var i = 0; i < this.tutorials.length; i++){
				if(this.tutorials[i].img != ""){
				this.imgs[i] = tpng.backend.url+this.tutorials[i].img;
				}
				else{
					this.imgs[i] = "";
				}
			}
			
			
			if(this.tutorials){
				this.start();
				//this.init();
			}
			else{
				this.home.openSection("miniError", {"home": this.home, "suggest":response.error.suggest, "message": response.error.message, "code":response.status}, false);	
				//HACER ALGO CUANDO NO VENGA NADA EN EL SERVICIO
			}
	}
	else if(response.error){
		this.home.openSection("miniError", {"home": this.home,"code":response.status}, false);
	}	
}			

tutorials.onFocusButtons = function onFocusButtons(_focus,_data){
	var w = this.widgets;

	if(_focus){
			if(this.actualFocus == "exit"){	
				w.buttons.setFocus(false);
			}	
		}
}

tutorials.onFocusExitB = function onFocusExitB(_focus,_data){
	var w = this.widgets;

	if(_focus){
				if(this.actualFocus == "buttons"){	
					w.exit_button.setFocus(false);
				}
				
		}
}

tutorials.onFocusList = function onFocusList(_focus, _data){
	if(_focus){
	var w = this.widgets;
	
		if(this.step > 1 && this.step < this.totalSteps){
			var buttons = [
					{"id":"p","legend":"Anterior", "active":true},
					{"id":"n","legend":"Siguiente", "active":true}
					 ];
				var exitButton = [
					{"id":"e","legend":"Salir del tutorial", "active":true}
					 ];
				w.buttons.stateChange("exit");	 			  
				w.exit_button.setData(exitButton);
				w.buttons.setData(buttons);
				w.buttons.stateChange("enter");
				w.exit_button.stateChange("enter");	
				w.exit_button.setFocus(false);
				w.buttons.setFocus(true);
				this.actualFocus = "buttons";
				this.loadPaintImg(this.imgs[this.step-1]);
		}
		else{
			if(this.step == 1){
					var buttons = [
							{"id":"n","legend":"Siguiente", "active":true}
								  ];
			}
			else{
					var buttons = [
							{"id":"p","legend":"Anterior", "active":true},
							{"id":"n","legend":"Ir a la tv", "active":true}
					 	  ];
			}
		
						var exitButton = [
							{"id":"e","legend":"Salir del tutorial", "active":true}
								  ];			  
						w.exit_button.setData(exitButton);
						w.buttons.setData(buttons);
						w.data.stateChange("enter");
						w.bg.stateChange("enter");
						w.line.stateChange("enter");
						if(this.step == 1){
							w.buttons.stateChange("enter_first");
						}
						else{
							w.buttons.stateChange("enter");
						}
						w.exit_button.stateChange("enter");	
						w.exit_button.setFocus(false);
						
						this.actualFocus = "buttons";
						this.loadPaintImg(this.imgs[this.step-1]);
		
				
		}
		if(this.dir == "next" && w.buttons.list.length > 1)
					w.buttons.scrollNext();
					
		if(this.dir == "prev" && w.buttons.list.length > 1)
					w.buttons.scrollPrev();	
	}
}

tutorials.prototype.loadPaintImg = function loadPaintImg(_url){
	//Función que pinta la imagen hasta que se descarga
	//Para transiciones de vodHome, menú y wizard VOD
		for(var i = 0 ; i< this.tutorials.length; i++){
			if(this.tutorials[i].step == this.step){
				var pos = "over";
				break;
			}
		
		}
	var o = {"widgets":this.widgets,"position":pos, "step":this.step}; //Argumentos que mandamos a la función callback
	//Verificamos que la imagen esté en caché
	var img = NGM.imageCache.get(_url);
	//NGM.dump("----------------->"+" "+_url);
	
	//Si está en cache mandamos directamente a la función callback
    if (img) {
    	//NGM.trace("desde cache: ");
        this.imgLoadCb(_url, img, o);
        return;
    }else{
    //sino descargamos la imagen del backend y enviamos la función callback
    	//NGM.trace("descargando imagen: ");
		var options = {"id"        : _url,
	                   "noload"    : false,
	                   "persistent": true,
	                   "expireIn"  : 12*60*60,    // could be replace by this.expireIn for setting management
	                   "callback"  : this.imgLoadCb,
	                   "opaque"    : o};
	     NGM.imageCache.add(_url, options);
     }
}

tutorials.prototype.imgLoadCb = function imgLoadCb(url, img, arg){
	//Función callback que setea la imagen en el background principal
	//del HOME, adicional cambia el speed de entrada para lograr una 
	//mejor transición.
	if(img.size){
	//NGM.dump(arg);
	//NGM.dump(img);
	
	if(arg.position == "over"){
		var pic = arg.widgets.imgOver;
	}
	else if(arg.position == "above"){
		var pic = arg.widgets.imgAbove;
			/*if(arg.step >=4 && arg.step <=15){
				var highlight = arg.widgets.highlight;	
			}*/
	}
			pic.setData({"img":img.url});
			pic.stateChange("enter",500);
			
			/*if(arg.step >=4 && arg.step <=15){
				highlight.setData({"step":arg.step});
				highlight.stateChange("enter",100);
			}*/
	}	
//	delete img;
	//Importante siempre borrar la imagen para no llenar la buffer gráfico.
}

tutorials.prototype.start = function start(){
	var w = this.widgets;
			w.bg.setData();
			w.line.setData();
			this.totalSteps = this.tutorials[0].totalSteps;
			w.data.setData(this.tutorials);
			var buttons = [
							{"id":"n","legend":"Siguiente", "active":true}
								  ];
						var exitButton = [
							{"id":"e","legend":"Salir del tutorial", "active":true}
								  ];			  
						w.exit_button.setData(exitButton);
						w.buttons.setData(buttons);
						w.data.stateChange("enter");
						w.bg.stateChange("enter");
						w.line.stateChange("enter");
						w.buttons.stateChange("enter_first");
						w.exit_button.stateChange("enter");	
						w.exit_button.setFocus(false);
						this.actualFocus = "buttons";
						this.lockKey = true;
}

tutorials.prototype.onKeyPress = function onKeyPress(_key){
	switch(this.actualFocus){		
		
		case "exit":
			this.onKeyPressExit(_key);
		break;
		
		case "buttons":
			this.onKeyPressButtons(_key);
		break;
		
	}	
	return true;
}

tutorials.prototype.onKeyPressExit = function onKeyPressExit(_key){
	var w = this.widgets;

	switch(_key){	

		case "KEY_RIGHT":
			this.actualFocus = "buttons";
			w.exit_button.setFocus(false);
			w.buttons.setFocus(true);
			
		break;
			
		case "KEY_IRENTER":
				clearTimeout(this.timerLoad);
				clearTimeout(this.timerLoad2);
				unsetTimeAlarm(this.timerLoad);
				unsetTimeAlarm(this.timerLoad2);
				this.home.closeSection(this);
				tpng.app.section = "home";
	
		break;

	}	
	return true;
}

		
		
tutorials.prototype.onKeyPressButtons = function onKeyPressButtons(_key){
	var w = this.widgets;
if(this.lockKey){
	switch(_key){	
			
		case "KEY_RIGHT":
		this.lockKey = false;
		this.setKeyTrue.bind(this).delay(500); 
			if(w.buttons.scrollNext()){}
		break;
		
		case "KEY_LEFT":
		this.lockKey = false;
		this.setKeyTrue.bind(this).delay(500); 
			if(w.buttons.scrollPrev()){}
			else{
				this.actualFocus = "exit";
				w.buttons.setFocus(false);
				w.exit_button.setFocus(true);
				
				
			}
		break;
		
		case "KEY_IRENTER":
		this.lockKey = false;
		this.setKeyTrue.bind(this).delay(1700); 
				switch(w.buttons.selectItem.id){
					case "n":
					this.client.lock();
						if(w.data.scrollNext()){
							if(this.step == 1 || this.step == this.totalSteps){
								w.buttons.stateChange("exit_first");
								
							}else{
								w.buttons.stateChange("exit");	
							}	
							w.exit_button.stateChange("exit");
							if(w.imgOver.stateGet() == "enter")
								w.imgOver.stateChange("exit");
							this.actualFocus = "";
							
							if(this.step < this.totalSteps){
									this.step++;
									this.dir = "next";
							}		
							
									
					}	
					else{
						clearTimeout(this.timerLoad);
						clearTimeout(this.timerLoad2);
						unsetTimeAlarm(this.timerLoad);
						unsetTimeAlarm(this.timerLoad2);
						this.home.closeSection(this);
						this
					}
					this.client.unlock();
					break;
					
					case "p":
						this.client.lock();
							if(w.data.scrollPrev()){
								if(this.step == 2 || this.step == this.totalSteps){
									w.buttons.stateChange("exit");
									w.buttons.setData();
									w.buttons.stateChange("exit_first");	
								}
								else{
									w.buttons.stateChange("exit");
									
								}
								w.exit_button.stateChange("exit");
								if(w.imgOver.stateGet() == "enter")
									w.imgOver.stateChange("exit");
								this.actualFocus = "";
								
								if(this.step > 0){
									this.step--;
									this.dir = "prev";
								}		
								
										
							}	
						this.client.unlock();
					break;				
			}	
		break;
	//FIN DE TECLAS	

	}	
	//return true;
	}	
}

tutorials.prototype.setKeyTrue = function setKeyTrue(){
	this.lockKey = true;
}

tutorials.drawBg = function drawBg(){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	    
		custo = JSON.parse(custo);
		custo.fill = "rgba(0,30,50,.8)";
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
		 
		ctx.drawObject(ctx.endObject());
}

tutorials.drawImgOver = function drawImgOver(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0,null, null, null);
		 
		ctx.drawObject(ctx.endObject());
}

tutorials.drawImgAbove = function drawImgAbove(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
		custo = JSON.parse(custo);
		tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0,null, null, null);
		 
		ctx.drawObject(ctx.endObject());
}

tutorials.drawData = function drawData(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
      
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);
	custo_f.font_family = "Oxygen-Light";
	custo_f.text_align = "left,middle";
	custo_f.font_size = 28;
	if(_data.step < 10){
		Canvas.drawText(ctx, _data.step+"", new Rect(55,0,22,32), custo_f);
	}
	else if(_data.step == 16){
	
	}
	else{
		Canvas.drawText(ctx, _data.step+"", new Rect(44,0,44,32), custo_f);
	}
	custo_f.font_size = 20;
	
	if(_data.step == 16){
	}
	else{
		Canvas.drawText(ctx, "/"+_data.totalSteps, new Rect(73,3,47,32), custo_f);
	}
	custo_f.font_size = 40;
	custo_f.text_align = "left,bottom";
	
	Canvas.drawText(ctx, _data.title, new Rect(128,0,634,40), custo_f);
	custo_f.text_align = "justify,top";
	custo_f.font_size = 20;
	custo_f.font_family = "Oxygen-Regular";
	Canvas.drawText(ctx, _data.text, new Rect(128,72,634,104), custo_f);
	ctx.drawObject(ctx.endObject());	
}

tutorials.drawLine = function drawLine(){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custoW = {fill: "rgba(240,240,250,1)"};
    Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);  
    
		
	ctx.drawObject(ctx.endObject());	
}

tutorials.drawButtonList = function drawButtonList(_data){
		
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
				stroke_width : 2,
				stroke : "rgba(240, 240, 250, .5)"
			};
			}
			else{
			custo = {  
				fill: "rgba(0,90,120,1)"
			};	
			
			}
			
				Canvas.drawShape(ctx, "rect", [0, 0, 186, 32], custo);
		
			var custo_t = JSON.stringify(this.themaData.standardFont);
				custo_t = JSON.parse(custo_t);
				custo_t.text_align = "center,middle";
				custo_t.font_size = 18* tpng.thema.text_proportion;
				Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_t);	
		}
		
		    ctx.drawObject(ctx.endObject());
	   }
}

tutorials.drawExitButton = function drawExitButton(_data){
		
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
				stroke_width : 2,
				stroke : "rgba(240, 240, 250, .5)"
			};
			}
			else{
			custo = {  
				fill: "rgba(0,90,120,1)"
			};	
			
			}
			
				Canvas.drawShape(ctx, "rect", [0, 0, 186, 32], custo);
		
			var custo_t = JSON.stringify(this.themaData.standardFont);
				custo_t = JSON.parse(custo_t);
				custo_t.text_align = "center,middle";
				custo_t.font_size = 18* tpng.thema.text_proportion;
				Canvas.drawText(ctx, _data.legend, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_t);	
		}
		
		    ctx.drawObject(ctx.endObject());
	   }
}