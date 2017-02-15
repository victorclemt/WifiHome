drawHeaderButtons = function drawHeaderButtons(_data){ 	
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	   	   		   	   	
		var img = focus ? _data.img_over : _data.img_off; 
		//ON: Amarillo, cuano estás en la sección
		//OVER: Blanco, cuando pasas sobre él
		//OFF: Gris, sin seleccionar.

		if(_data.selected && !focus)
			var img = _data.img_on; 
		else
			var img = focus ? _data.img_over : _data.img_off;

		var compositeOperation = null;
		if (_data.clip == "circle") {
			var bounds = Canvas.drawShape(ctx, "circle", [26, 16, 16], { fill: "#000000ff", scaleType: "aspectFit"});
			compositeOperation = "source-in";
		}
		tp_draw.getSingleton().drawImage(img, ctx, 10, 0, 32, 32, null, compositeOperation);	//Lo forzo a 32x32 por el avatar que está mal cargado
		
		ctx.drawObject(ctx.endObject());
	}
}

drawHeaderButtons_off = function drawHeaderButtons_off(_data){ 	

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		
		
	   	var img = focus ? _data.img_over : _data.img_off; 
		//ON: Amarillo, cuano estás en la sección
		//OVER: Blanco, cuando pasas sobre él
		//OFF: Gris, sin seleccionar.
		
		if(_data.selected && !focus){
			var img = _data.img_on;
		}else{
			var img = focus ? _data.img_over : _data.img_off;
		}
		
		var compositeOperation = null;
		if (_data.clip == "circle") {
			var bounds = Canvas.drawShape(ctx, "circle", [32, 31, 15], { "fill": "rgba(240,240,250,1)", "scaleType": "aspectFit"});
			compositeOperation = "source-in";
			tp_draw.getSingleton().drawImage(img, ctx, 16, 14, 32, 32, null, compositeOperation);	//Lo forzo a 32x32 por el avatar que está mal cargado
		}else{
			tp_draw.getSingleton().drawImage(img, ctx, 17, 14, 32, 32, null, compositeOperation);	//Lo forzo a 32x32 por el avatar que está mal cargado
		}				
		ctx.drawObject(ctx.endObject());
	}	
}

drawHeaderTooltips = function drawHeaderTooltips(_data){ 		
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	var custo_f = JSON.stringify(this.themaData.standarBlackFont);
	custo_f = JSON.parse(custo_f);		
	custo_f.text_align = "center,top";
	custo_f.font_size = 20 * tpng.thema.text_proportion;
	
	//tp_draw.getSingleton().drawImage("img/commons/TextBalloon.png", ctx, _data.x, 0,null,null,null,"destination-over");
	
	
	tp_draw.getSingleton().drawImage("img/commons/TextBalloon.png", ctx, _data.x, 0, null , null, 
					function(){
						var ctx = this.getContext("2d");
						Canvas.drawText(ctx, _data.text, new Rect(_data.x+5, 3, 112, 27), custo_f);//el tooltip mide 122 de ancho x 32 de alto			
	}.bind(this, _data));
	
	
	ctx.drawObject(ctx.endObject());	
}

drawAdvertising = function drawAdvertising(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();	
    tp_draw.getSingleton().drawImage(_data.images.url18X2, ctx, 0, 0);	//LOGO TOTALPLAY	
	ctx.drawObject(ctx.endObject());	
}

drawLoadingCounter = function drawLoadingCounter(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();	
    var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);		
	custo_f.text_align = "center,top";
	custo_f.font_size = 20 * tpng.thema.text_proportion;	
	Canvas.drawText(ctx, "Iniciará en " + _data + "...", new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo_f);	
	ctx.drawObject(ctx.endObject());	
}

drawSafeModeHeader = function drawSafeModeHeader(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	
	
    var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	//En lo que saco el thema de rogger
	
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	
	custo_f.text_align = "left,center";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
		
	//Barra gris
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
	//Barra verde
	custo.fill = "rgba(150,220,50,1)";
	Canvas.drawShape(ctx, "rect", [0,1,316,ctx.viewportHeight-2], custo);
	//Letras Blancas
	Canvas.drawText(ctx, "Algunas funciones están deshabilitadas en este momento. El servicio se restablecerá automáticamente.", new Rect(332, 3, ctx.viewportWidth-332, 32), custo_f);	
	//Letras grises
	custo_f.fill = "rgba(30,30,40,1)";
	Canvas.drawText(ctx, "Safe Mode Activado", new Rect(130, 3, 386, 32), custo_f);
	
	
	ctx.drawObject(ctx.endObject());	
}

drawMainHeader = function drawMainHeader(_data){ 	

	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
		
	var positionY = _data.position ? 50: 86 ;
	
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	
	if(_data.stroke) custo.stroke = _data.stroke;
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	

	if(_data.section || _data.transparent){
		custo.fill = _data.fill ? _data.fill : "rgba(30,30,40,0)";
			//si es login
			if(_data.simple){ // 50
				tp_draw.getSingleton().drawImage("img/commons/header/totalPlayLogo.png", ctx, 35, 70);	//LOGO TOTALPLAY	
			}else{//header transparente	
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
				tp_draw.getSingleton().drawImage("img/commons/header/totalPlayLogo.png", ctx, 35, 70);	//LOGO TOTALPLAY
			}	
		}else{
			//header normal
			if(_data.current == false){
				custo.fill = "rgba(30,30,40,7)";
			}
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO	
			tp_draw.getSingleton().drawImage("img/commons/header/totalPlayLogo.png", ctx, 35, 70);	//LOGO TOTALPLAY
		}

		custo_f.font_size = 16 * tpng.thema.text_proportion;
		custo_f.fill =  "rgba(240,240,250,.5)";
		Canvas.drawText(ctx, "v.3." + tpng.app.version + "." + tpng.app.subversion, new Rect(188, 77, 100, 20), custo_f); // cambiar parametros de x,y
		ctx.drawObject(ctx.endObject());	
}

drawMainHeader_off = function drawMainHeader_off(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();


	//Y = 56	
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
	   
	var custoInput = JSON.stringify(this.themaData.outLineGeneralPanel);
		custoInput = JSON.parse(custoInput);
		custoInput.fill = "rgba(240, 240, 250, 1)";
		custoInput.rx = 16;
	Canvas.drawShape(ctx, "rect", [466, 72, 348, 32], custoInput);
										//56

  	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	custo_f.text_align = "center,middle";
	custo_f.font_size = 16 * tpng.thema.text_proportion;
	custo_f.fill = "rgba(30,30,40,1)";
	Canvas.drawText(ctx, _data.text+"", new Rect(544,72,186,32), custo_f);

	tp_draw.getSingleton().drawImage("img/commons/header/0_FlechaIZQ.png", ctx, 454, 72);	
	tp_draw.getSingleton().drawImage("img/commons/header/0_FlechaDER.png", ctx, 819, 72);
	
	ctx.drawObject(ctx.endObject());	
}

drawMainBg = function drawMainBg(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custo = JSON.stringify(this.themaData.darkBlackPanel);
	custo = JSON.parse(custo);
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	
	custo_f.text_align = "center,top";
	custo_f.font_size = 100;

	if(_data.height && _data.width && _data.size){
		//Esto quiere decir que es uma imagen, el typeof es object 
		ctx.globalCompositeOperation = "destination-over";
		ctx.drawImage(_data, 0, 0);
		tp_draw.getSingleton().drawImage("img/commons/DegradadoBack.png", ctx, 0, 0);
	}else{	
		//Este es para los casos normales
		if(_data.url)
			tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 0, null, null, null,"destination-over");
		if(_data.layer)
			tp_draw.getSingleton().drawImage("img/commons/DegradadoBack.png", ctx, 0, 0);
		if(_data.error){
			custo_f.text_align = "center,top";
			custo_f.font_size = 36;
			Canvas.drawText(ctx, _data.error.error, new Rect(252,235,768,108), custo_f);
			custo_f.font_size = 22;
			Canvas.drawText(ctx, "<!color=rgba(207,134,134,1)>"+_data.error.cause+"<!>", new Rect(252,328,768,108), custo_f);
			Canvas.drawText(ctx, _data.error.suggest, new Rect(252,470,768, 72), custo_f);
				if(_data.error.img != "")
					tp_draw.getSingleton().drawImage(_data.error.img, ctx, 420, 180);
				
		}
	}
	ctx.drawObject(ctx.endObject());	
}

drawMainHelp = function drawMainHelp(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	
	if(_data.nameForm == "help"){
		custo.fill = "rgba(150,170,40,1)";
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);	
	}else{
		if(_data.focus){
			custo.fill = "rgba(240,240,250,1)";
		}else{
			custo.fill = null;
		}
	
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);	
	}
	
	
	if(_data.focus){
		tp_draw.getSingleton().drawImage("img/help/icono-ayudaON.png", ctx, 0, 0);
	}else{
		tp_draw.getSingleton().drawImage("img/help/icono-ayuda.png", ctx, 0, 0);
	}
	
	ctx.drawObject(ctx.endObject());	
}

drawStrokeAvatar = function drawStrokeAvatar(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
	
	if(tpng.user.profile.networkImg){ //siempre forzamos que las imágenes de perfil estén en 32x32
		tp_draw.getSingleton().drawImage(tpng.user.profile.networkImg, ctx, 0, 0, 32, 32, null,"destination-over");	
		//Dibujar iconos
		var img = "img/socialNetworks/"+ tpng.user.profile.network + "14.png";
		tp_draw.getSingleton().drawImage(img, ctx, 32, 0); //tmp el w y h
	}else{
		tp_draw.getSingleton().drawImage(tpng.user.profile.images.url1X1A, ctx, 0, 0, null, null, null,"destination-over");	
	}
		
	var custoX = { 
		fill  : null,  
		stroke: "rgba(240,240,250,1)",
		stroke_width: 2, 
		rx: 0,
		stroke_pos : "inside"
	};
	
	if(data.focus)
		Canvas.drawShape(ctx, "rect", [0,0,32,ctx.viewportHeight], custoX);
			
	ctx.drawObject(ctx.endObject());
}
drawRectSearch = function drawRectSearch(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
	
	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	custo.fill = null;
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);	
	
	tp_draw.getSingleton().drawImage("img/commons/header/busqueda.png", ctx, 5, 0);	//ICONO DE BÚSQUEDA 
	var line =  {fill: "rgba(170, 170, 180, 1)"}; 
	Canvas.drawShape(ctx, "rect", [41,3,1,26], line); //OUTLINE 
	
	
	ctx.drawObject(ctx.endObject());	
}


drawMainWatch = function drawMainWatch(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
       
  	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	custo_f.text_align = "right,middle";
	custo_f.font_size = 28 * tpng.thema.text_proportion;
	
	Canvas.drawText(ctx, _data.time + "|<!size=18>" + _data.date + "<!>", new Rect(0,16,ctx.viewportWidth-10,ctx.viewportHeight), custo_f);
	ctx.drawObject(ctx.endObject());	
}

drawProgramInfoBack = function drawProgramInfoBack(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	
	
	//Toda la infod debe empezar en y=32, esto porque en y=0 aparece información de 
	//popularidad y mensajes de NPVR.	
	//var masterY = _data.draw == "more" ? 32 : 32; //por la publicidad en la barra tuve que poner ambos en 32.. por ahora
	var masterY = 34;
	
	
	// main fill
	Canvas.drawShape(ctx, "rect", [0,masterY,ctx.viewportWidth,ctx.viewportHeight], custo);
	
	/*	
	// barra progreso gris
	var y = _data.draw == "more" ? masterY+70 : masterY+52;
	var w = _data.draw == "more" ? 826 : 570;
	Canvas.drawShape(ctx, "rect", new Rect(195, y, w, 4), fillBase);
	*/
	var y = _data.draw == "more" ? masterY : masterY+38;	
	var x = tpng.app.advertising ? 771 : 899; //TODO: Validar cuando no hay publicidad que x es
	
	if(_data.draw != "more"){
		// Open miniguide
		if(tpng.app.currentChannel.type == "C" && !tpng.app.isSafeMode)
			tp_draw.getSingleton().drawImage("img/tv/flechaDOWN.png", ctx, 835, y); //le subi 20 a todo

		// img time
		if(tpng.app.currentChannel.type == "C" && !tpng.app.isSafeMode)
			tp_draw.getSingleton().drawImage("img/tv/miniguia.png", ctx, 773, 72); //le subi 20 a todo
			
		//Publicidad en cambio de canal
		if(tpng.app.advertisingData.images.url4X2){
			tp_draw.getSingleton().drawImage(tpng.app.advertisingData.images.url4X2, ctx, 963, y-36); //le subi 20 a todo		
		}else{
			if(!tpng.app.isSafeMode)
				tp_draw.getSingleton().drawImage("img/tv/promoLogo.png", ctx, 963, y-36); //le subi 20 a todo
		}
		
		// img menu
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		custo_f.text_align = "center,middle";
		custo_f.fill = "rgba(85, 95, 105, 1)";
		if(tpng.app.currentChannel.type == "C" && !tpng.app.isSafeMode){
			tp_draw.getSingleton().drawImage("img/tv/flechaUP-2.png", ctx, 835, 39); //le subi 20 a todo
			custo_f.font_size = 16 * tpng.thema.text_proportion;
			custo_f.fill = "rgba(170, 170, 180, 1)";		
			Canvas.drawText(ctx,"MENÚ", new Rect(841,43,50,20), custo_f);
		}
		
	}	
	
	ctx.drawObject(ctx.endObject());	
}


drawProgramInfo = function drawProgramInfo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo = JSON.stringify(this.themaData.outLineGeneralPanel);
	custo = JSON.parse(custo);
	
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	custo_f.text_align = "left,top";
	
	var fillBase = this.themaData.fillBase,
	fillBlue = this.themaData.fillBlue,
	fillGray = this.themaData.fillGray;
	
	var todayDate = new Date().getTime();
	//Toda la infod debe empezar en y=32, esto porque en y=0 aparece información de 
	//popularidad y mensajes de NPVR.	
	//var masterY = _data.draw == "more" ? 32 : 32; //por la publicidad en la barra tuve que poner ambos en 32.. por ahora
	var masterY = 34;
	
	
	// main fill
	//Canvas.drawShape(ctx, "rect", [0,masterY,ctx.viewportWidth,ctx.viewportHeight], custo);
		
	// barra progreso gris
	var y = _data.draw == "more" ? masterY+70 : masterY+52;
	var w = _data.draw == "more" ? 826 : 570;
	Canvas.drawShape(ctx, "rect", new Rect(195, y, w, 4), fillBase);

	// name
	var y_name = _data.draw == "more" ? masterY-2 : masterY+2;
	var x = _data.tweetFeed ? 222 : 195;
	var heightName = _data.draw == "more" ? 68 : 40;
	custo_f.text_align = "left,middle";
	
	var sizeFont = _data.draw == "more" ?  28 : 22;
	custo_f.font_size = sizeFont * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.name, new Rect(x, y_name, w, heightName), custo_f);
	
	//tweed Feed
	if(_data.tweetFeed){
		var y_tweetF = _data.draw == "more" ? masterY+28 : masterY+19;
		tp_draw.getSingleton().drawImage("img/tv/badge_tweetON.png", ctx, 197, y_tweetF); //le subi 20 a todo
	}

			
	if(_data.draw == "more"){
	//DRAW MORE INFO
	
		// img AnyTime Npvr
		if(_data.ChannelVO.isCtv){ //TODO: VALIDAR LOS GRISES/ROSAS/AZULES
			tp_draw.getSingleton().drawImage("img/tv/AnytimetvBadgeON.png", ctx, 0, masterY);
		}else if(_data.ChannelVO.isNpvr){
			tp_draw.getSingleton().drawImage("img/tv/AnytimetvBadgeOFF.png", ctx, 0, masterY);
		}else{
			custoLine = { "fill": "rgba(90,90,100,1)" };
			custo = JSON.stringify(this.themaData.outLineGeneralPanel);
			custo = JSON.parse(custo);
			custo.fill = "rgba(90,90,100,1)";
			Canvas.drawShape(ctx, "rect", new Rect(771,0,509,28), custoLine);
			custo_f.fill = "rgba(240,240,250,1)";
			custo_f.font_size = 18 * tpng.thema.text_proportion;
			custo_f.text_align = "center, middle";
			Canvas.drawText(ctx, gettext("NPVR_CHANNEL_MESSAGE"), new Rect(771,0,442,28), custo_f);	
		}
		
				
		// horary		
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		custo_f.text_align = "left, middle";
		var horary = _data.startTime ? startTimeEndTime(_data.startTime, _data.endTime): "";	
		var y_horary = _data.draw == "more" ? masterY+57 : masterY+38;	
		//custo_f.fill =  "rgba(0, 190, 240, 1)";
		//Canvas.drawText(ctx, horary, new Rect(1056,y_horary,186,27), custo_f);
				
		//barra progreso 
		if(_data.endTime < todayDate){
			var color = fillGray;
			custo_f.fill = "rgba(170, 170, 180, 1)";
			var img_logo = "img/tv/miniguiaFUTURO.png";
			
			if(_data.isCtvRecorded || _data.isNpvrRecorded){
					color = {"fill": "rgba(190,50,120,1)"}; // ROSA rs2
					custo_f.fill = "rgba(230, 0, 120, 1)";
					tp_draw.getSingleton().drawImage("", ctx, 1027, 90);
				var img_logo = "img/tv/miniguiaANYTIMETV.png";
			}
			
			tp_draw.getSingleton().drawImage(img_logo, ctx, 1027, 90);			
			Canvas.drawShape(ctx, "rect", new Rect(195,y,826,4), color);
			Canvas.drawText(ctx, horary, new Rect(1056,y_horary,186,27), custo_f);
				
			
		}else{
			if(_data.startTime < todayDate && _data.endTime > todayDate){

				//*** PRESENTE 
				var percentX = percent(_data.startTime, _data.endTime, 826);
				Canvas.drawShape(ctx, "rect", new Rect(195,y,percentX,4),fillBlue);
				Canvas.drawShape(ctx, "rect", [percentX+195,y,1,4],{"fill" : "rgba(240, 240, 250, 1)"});

				tp_draw.getSingleton().drawImage("img/tv/miniguia.png", ctx, 1027, 90);
				custo_f.fill = "rgba(0, 190, 240, 1)";
				var timeL = _data.startTime ? timeLeft(data.startTime, _data.endTime): "";
				Canvas.drawText(ctx, horary, new Rect(1056,y_horary,186,27), custo_f);
			}else{
				//*** FUTURO
				tp_draw.getSingleton().drawImage("img/tv/miniguiaFUTURO.png", ctx, 1027, 90);
				custo_f.fill = "rgba(170, 170, 180, 1)";
				Canvas.drawText(ctx, horary, new Rect(1056,y_horary,186,27), custo_f);		
			}
		}
				
		// ***** DESCRIPTION 	 
		custo_f.fill = "rgba(240,240,250,1)";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		custo_f.text_align = "left, top";

		if(_data.parentalRating != "D"){
			Canvas.drawText(ctx, "<!line-height=32>------ "+getProgramInfoStr(_data)+"<!placeholder=7>I<!placeholder=7>"+_data.description+"<!>", new Rect(195, masterY+95, 850, 68), custo_f);		
		}else{
			if(_data.isLocked || tpng.app.safeNightOn || _data.profileLoked){
				Canvas.drawText(ctx, "Lo sentimos, para poder acceder a este programa es necesario el nip del Administrador. " , new Rect(258, masterY+95, 850, 49), custo_f);		
			}else{				
				Canvas.drawText(ctx, "<!line-height=32>------ "+getProgramInfoStr(_data)+"<!placeholder=7>I<!placeholder=7>"+_data.description+"<!>", new Rect(195, masterY+95, 850, 68), custo_f);
			}
		}
		
		
		// ***** RATING Y CADENA DE INFORMACIÓN: AÑO, CATEGORIA , TEMPORADA Y EPISODIO
		custo_f.text_align = "left, middle";
		custo_f.fill = "rgba(170,170,180,1)";
		
		if(_data.rating.value)
			tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.rating.value+".png", ctx, 195, masterY+100);
		else if(_data.parentalRating)
			tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.parentalRating+".png", ctx, 195, masterY+100);
		
		//custo_f.text_align = "left, middle";
		//custo_f.font_size = 20 * tpng.thema.text_proportion;
		//Canvas.drawText(ctx, getProgramInfoStr(_data), new Rect(239, masterY+90, 654, 32), custo_f);
	
		// ***** IMG NUMBER
		tp_draw.getSingleton().drawImage(_data.ChannelVO.images.url1X1, ctx, 112, masterY+4);

		// ***** CHANNEL NUMBER
		custo_f.text_align = "center, bottom";
		custo_f.fill = "rgba(240, 240, 250, 1)";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		custo_f.font_family = "Oxygen-Bold";		
		Canvas.drawText(ctx, _data.ChannelVO.number+"", new Rect(112, 72, 70, 32), custo_f);
	
	
	}else{
		//DRAW CAMBIO DE CANAL
		// ****** barra de canales
		//horario
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		custo_f.text_align = "center,middle";
		var horary = _data.startTime ? startTimeEndTime(_data.startTime, _data.endTime, true): "";	
		y = _data.draw == "more" ? masterY : masterY+38;	
		x = tpng.app.advertising ? 771 : 899; //TODO: Validar cuando no hay publicidad que x es
		custo_f.fill =  "rgba(0, 190, 240, 1)";
		Canvas.drawText(ctx, horary, new Rect(790,y,166,27), custo_f);
		
		
	
		// barra azul progreso
		var percentX = percent(_data.startTime, _data.endTime, 570);
		Canvas.drawShape(ctx, "rect", new Rect(195, masterY+52, percentX, 4),fillBlue);
		Canvas.drawShape(ctx, "rect", [percentX+195,86,1,4],{"fill" : "rgba(240, 240, 250, 1)"});
		
		
		
		
		
	}	
	
	ctx.drawObject(ctx.endObject());	
}




drawChannels = function drawChannels(_data){ 
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
		
		var channel = _data.ChannelVO;
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center, bottom";
		custo_f.font_family = "Oxygen-Bold";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		
		tp_draw.getSingleton().drawImage(channel.images.url1X1, ctx, 112, 4); //le subi 20 a todo
		Canvas.drawText(ctx, channel.number+"", new Rect(112,36,70,32), custo_f);

		if(channel.isCtv) //TODO: VALIDAR LOS GRISES/ROSAS/AZULES
			tp_draw.getSingleton().drawImage("img/tv/AnytimetvBadgeON.png", ctx, 0, 0);
		else if(channel.isNpvr)
			tp_draw.getSingleton().drawImage("img/tv/AnytimetvBadgeOFF.png", ctx, 0, 0);	
		
		if(channel.type == "C" && !tpng.app.isSafeMode)
			tp_draw.getSingleton().drawImage("img/tv/flechaLEFT.png", ctx, 65, 20);	
		
		ctx.drawObject(ctx.endObject());
	}
}


drawRecommendationsNew = function drawRecommendationsNew(_data){ 	
	
   
	this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
				
		if(_data.ItemVO.images.url1X1)
			tp_draw.getSingleton().drawImage("img/menu/3x3_SOMBRAlogos.png", ctx, 5, 5);
				
		if(_data.ItemVO.showTittle){
			Canvas.drawText(ctx, _data.ItemVO.title, new Rect(5,5,ctx.viewportWidth-5,60), custo_f);
		}	
		tp_draw.getSingleton().drawImage(_data.ItemVO.images.url3X3, ctx, 5, 5, null, null, null,"destination-over");
	
	    tp_draw.getSingleton().drawImage(_data.ItemVO.images.url1X1, ctx, 115, 65 );


	if(!focus){
			var stroke = { 
				"fill"  : null,  
				"stroke": "rgba(90,90,90,1)",
				"stroke_width": 1, 
				"rx": 0,
				"stroke_pos" : "inside"
			};
			
			Canvas.drawShape(ctx, "rect", [4,4, ctx.viewportWidth-8,ctx.viewportHeight-8], stroke);
		}
			
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanelNetworkSocial) : JSON.stringify(this.themaData.outLineGeneralPanelButtons);
		custo = JSON.parse(custo);
		custo.fill = null;
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

		ctx.drawObject(ctx.endObject());
	}	
}

drawRecommendations = function drawRecommendations(_data){ 	
	
   
	this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
				
		if(_data.ItemVO.showTittle)
			Canvas.drawText(ctx, _data.ItemVO.title, new Rect(5,40,ctx.viewportWidth-5,60), custo_f);

		tp_draw.getSingleton().drawImage(_data.ItemVO.images.url4X4, ctx, 5, 5, 250, 140, null,"destination-over");
		if(_data.ItemVO.images.url1X1)
			tp_draw.getSingleton().drawImage("img/tv/4x4_SOMBRAlogos.png", ctx, 5, 5, 250, 140);
	
	    tp_draw.getSingleton().drawImage(_data.ItemVO.images.url1X1, ctx, 160, 95);


	if(!focus){
			var stroke = { 
				"fill"  : null,  
				"stroke": "rgba(90,90,90,1)",
				"stroke_width": 1, 
				"rx": 0,
				"stroke_pos" : "inside"
			};
			
			Canvas.drawShape(ctx, "rect", [5,5, ctx.viewportWidth-10,ctx.viewportHeight-10], stroke);
		}
			
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanelNetworkSocial) : JSON.stringify(this.themaData.outLineGeneralPanelButtons);
		custo = JSON.parse(custo);
		custo.fill = null;
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

		ctx.drawObject(ctx.endObject());
	}	
}
drawButtonsSocial = function drawButtonsSocial(_data){
		this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();

		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);
			custo_f.text_align = "center, middle";
			custo_f.font_size = 16 * tpng.thema.text_proportion;			
			custo_f.fill = "rgba(0, 0, 0, 1)";
			custo_f.font_family = "Oxygen-Bold";

		if(focus){
			var custo = {"fill": "rgba(240, 240, 250, 1)"};					
			Canvas.drawShape(ctx, "rect", [1, 1, ctx.viewportWidth-2, ctx.viewportHeight-2], custo);			
			var stroke = { 
				"fill"  : null,  
				"stroke": "rgba(240, 240, 250, 1)",
				"stroke_width": 1, 
				"rx": 5,
				"stroke_pos" : "inside"
			};			
			Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], stroke);
		}else{
			var custo = {"fill": "rgba(214, 214, 214, 1)"};		
			custo.rx = 3;			
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], custo);
		}
		Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], custo);		
		Canvas.drawText(ctx, _data.text, new Rect(16, 3, ctx.viewportWidth-20, ctx.viewportHeight-10), custo_f);
		tp_draw.getSingleton().drawImage(_data.img, ctx, 9, 15);		
		ctx.drawObject(ctx.endObject());	
	}
}


drawButtons = function drawButtons(_data){ 		
	this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);
			custo_f.text_align = "center,middle";
			custo_f.font_size = 20 * tpng.thema.text_proportion;
	
		if(!focus){
			var stroke = { 
				"fill"  : null,  
				"stroke": "rgba(90,90,90,1)",
				"stroke_width": 1, 
				"rx": 0,
				"stroke_pos" : "inside"
			};
			Canvas.drawShape(ctx, "rect", [4, 4, ctx.viewportWidth-8, ctx.viewportHeight-8], stroke);
		}
				
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanelNetworkSocial) : JSON.stringify(this.themaData.outLineGeneralPanelButtons);
		custo = JSON.parse(custo);
		custo.fill = null;
	    
	    if(_data.ItemVO){
	    	tp_draw.getSingleton().drawImage(_data.ItemVO.images.url3X3, ctx, 5, 5);
	    }else{
			var custoBackground = {"fill": "rgba(45, 45, 55, 1)"};
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10, ctx.viewportHeight-10], custoBackground); //FONDO
	    }
	    
		Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custo); //FONDO
		Canvas.drawText(ctx, _data.label, new Rect(68, 5, 122, 104), custo_f);
		
		tp_draw.getSingleton().drawImage(_data.img_off, ctx, 5, 5);
		
		ctx.drawObject(ctx.endObject());	
	}
}

drawButton_back = function drawButton_back(_data){

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    					    				
	    var img = focus ? "img/tv/AtrasON.png" : "img/tv/AtrasOFF.png";
		tp_draw.getSingleton().drawImage(img, ctx, 35, 25);

	    ctx.drawObject(ctx.endObject());
	}
}	

drawArrowButtons = function drawArrowButtons(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     

	var custoW = {"fill": "rgba(90, 90, 90, 1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [13,0,1,ctx.viewportHeight], custoW);
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [23,0,1,ctx.viewportHeight], custoW);	
		
	tp_draw.getSingleton().drawImage(_data.url, ctx, 3, 37);	
  
    ctx.drawObject(ctx.endObject());
}

drawTooltip_button_back = function drawTooltip_button_back(_data){ 		
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
	var custo_f = JSON.stringify(this.themaData.standarBlackFont);
	custo_f = JSON.parse(custo_f);		
	custo_f.text_align = "center,middle";
	custo_f.font_size = 18 * tpng.thema.text_proportion;
	Canvas.drawText(ctx, _data.text+"", new Rect(0, 9, ctx.viewportWidth, ctx.viewportHeight-14), custo_f);
	tp_draw.getSingleton().drawImage("img/tv/tooltip.png", ctx, _data.x, 0,null,null,null,"destination-over");
	
	ctx.drawObject(ctx.endObject());	
}

drawTooltipsSocialNetwork = function drawTooltipsSocialNetwork(_data){
/*
	- este draw solo es para los archivos de .. home y programDetail
*/

	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     

	var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
		custo_f.text_align = "center,middle";
		custo_f.fill = "rgba(30, 30, 40, 1)";
		custo_f.font_size = 16 * tpng.thema.text_proportion;
	

	tp_draw.getSingleton().drawImage("img/commons/player/TextBalloon.png", ctx, _data.position_x, 0);
	Canvas.drawText(ctx,_data.text, new Rect(_data.position_x, 5, 122, 20 ), custo_f);
	
    ctx.drawObject(ctx.endObject());
}
drawChannelNumberBar = function drawChannelNumberBar(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custo = JSON.stringify(this.themaData.darkBlackPanel);
	custo = JSON.parse(custo);
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
		
	custo_f.text_align = "left,middle";
	custo_f.font_size = 56 * tpng.thema.text_proportion;
	_data.number = _data.number.toString();
	if(_data.number.length < 3)
		_data.number = _data.number + "_";
		var custoBackground = {
       		fill:           "0.5-rgba(28, 121, 156, .8)|1-rgba(5, 65, 100, .8)",
        	fill_coords:    "0,0,.3,-2",
        	stroke:         "rgba(90,90,90, 1)",
        	stroke_coords:  "1,0,0,0",
        	stroke_width:   2,
    	};
	Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoBackground);
	Canvas.drawText(ctx, "<!size="+(22*tpng.thema.text_proportion)+">ir al canal<!>" + "<!placeholder=30>"+ _data.number+ "<!>", new Rect(150,0,400,ctx.viewportHeight), custo_f);	
	
	ctx.drawObject(ctx.endObject());	
}

drawChannelMatches = function drawChannelMatches(_data){ 
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    var channel = _data.ChannelVO;
		var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);	
				
		//sombra
		tp_draw.getSingleton().drawImage("img/menu/3x3_SOMBRAlogos.png", ctx, 0, 0);		

		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
				
		// channel image
		tp_draw.getSingleton().drawImage(channel.images.url1X1, ctx, 110, 61);
		
		// Number Channel
		custo_f.text_align = "center,middle";
		Canvas.drawText(ctx, channel.number+"", new Rect(10,65,50,25), custo_f);	

		if(channel.program.ProgramVO){
			custo_f.font_size = 18 * tpng.thema.text_proportion;
			custo_f.text_align = "center,middle";
			// image background
			tp_draw.getSingleton().drawImage(channel.program.ProgramVO.images.url3X3, ctx, 0, 0, null, null, null,"destination-over");
			// text name program
			if(channel.program.ProgramVO.showTittle){
				Canvas.drawText(ctx, channel.program.ProgramVO.name, new Rect(3,16,ctx.viewportWidth-10,45), custo_f);	
			}
		}else if(channel.type == "I" || channel.type == "M"){
			tp_draw.getSingleton().drawImage(channel.images.url3X3, ctx, 0, 0, null, null, null,"destination-over");
		}
		

		ctx.drawObject(ctx.endObject());
	}
}

drawChannelMessage = function drawChannelMessage(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
  var custo_f = JSON.stringify(this.themaData.standardFont);
		custo_f = JSON.parse(custo_f);
	
	custo_f.text_align = "left,middle";
	custo_f.font_size = 22 * tpng.thema.text_proportion;
	
	Canvas.drawText(ctx, "Lo sentimos. No cuentas con este canal en tu paquete.|Te llevaremos al canal más próximo.", new Rect(500,0,700,ctx.viewportHeight), custo_f);	
	
	ctx.drawObject(ctx.endObject());	
}

drawArrowDetail = function drawArrowDetail(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();      
    
    
	//var custoX = {fill: "rgba(255,0,0,.7)"};
	//Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custoX);

	var custoW = {fill: "rgba(220,220,230,1)"};
	if(_data.line && _data.position == "left")
		Canvas.drawShape(ctx, "rect", [12,0,1,ctx.viewportHeight], custoW);
	
	if(_data.line && _data.position == "right")
		Canvas.drawShape(ctx, "rect", [18, 0, 1,ctx.viewportHeight], custoW);	

	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 36);
	
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}


drawArrowDetailRight = function drawArrowDetailRight(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();     

	
	var custoW = {fill: "rgba(220, 220, 230, 1)"};
	if(_data.section == "home")
		Canvas.drawShape(ctx, "rect", [15,0,1,ctx.viewportHeight], custoW);	
	else
		Canvas.drawShape(ctx, "rect", [17,0,1,ctx.viewportHeight], custoW);

	//tp_draw.getSingleton().drawImage("img/tv/arrowLeftOn.png", ctx, 0, 18);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}



drawBase = function drawBase(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();
    
    var custo = JSON.stringify(this.themaData.darkBlackPanel);
	custo = JSON.parse(custo);
	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	
	custo_f.text_align = "center,top";
	custo_f.font_size = 100 * tpng.thema.text_proportion;
	
	//Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo);
	var img = _data.images.url18X18;
	tp_draw.getSingleton().drawImage(img, ctx, 0, 0);
	//Canvas.drawText(ctx, "<!b>"+_data.name+"<!>|<!size=40>Sección pendiente, estamos trabajando rápido<!>", new Rect(0,150,ctx.viewportWidth,ctx.viewportHeight), custo_f);	
	
	NGM.trace("NGM.trace");
	
	ctx.drawObject(ctx.endObject());	
}

drawDemo = function drawDemo(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

    this.draw = function draw(focus) {
		var img = _data.ItemVO.images.url18X18;
		tp_draw.getSingleton().drawImage(img, ctx, 0, 0);	
		//NGM.trace("url: " + img);	
		//NGM.dump(_data,2);	
		ctx.drawObject(ctx.endObject());	
	}	
	
}




drawAudioSubtitleList = function drawAudioSubtitleList(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
	    
	    NGM.dump(_data,3);
	    
	    var custoW = {fill: "rgba(90,90,90,1)"},
	    	custoText = {"fill"			: "rgba(255,255,255,1)",
				   		 "font_family" 	: "Oxygen-Regular",
				   		 "font_size" 	: 30,
				   		 "text_align" 	: "center,middle",
				   		 "text_multiline": true}
	this.draw = function draw(focus) {
		Canvas.drawText(ctx, _data.str, new Rect(0, -17, 178, ctx.viewportHeight), custoText);	
		if(_data.audio){
			tp_draw.getSingleton().drawImage("img/commons/cambioAudios.png", ctx, 178, 38);
		}else{
			tp_draw.getSingleton().drawImage("img/commons/cambioSubs.png", ctx, 178, 38);
		}
		
		ctx.drawObject(ctx.endObject());
	}
}

drawNotificationPopUp = function drawNotificationPopUp(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	var custo_f = JSON.stringify(this.themaData.standardFont);
	custo_f = JSON.parse(custo_f);	
	custo_f.text_align = "right,middle";
	custo_f.font_size = 22 * tpng.thema.text_proportion;

	//tp_draw.getSingleton().drawImage("img/commons/header/totalPlayLogo.png", ctx, 85, 50);	//LOGO TOTALPLAY
	
	if(_data.focus){
		//rect
		var custoW = {fill: "rgba(220, 220, 230, 1)"};
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW); //FONDO
		// letra
		custo_f.fill = "rgba(30,30,40,1)";
		custo_f.text_align = "right,bottom";
		Canvas.drawText(ctx, _data.objeto.from, new Rect(67,38,186,32), custo_f);	

		custo_f.text_align = "right,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		custo_f.fill = "rgba(170,170,180,1)";
		Canvas.drawText(ctx, "<!i>"+_data.objeto.subject+"<!i>", new Rect(67,74,186,32), custo_f);

		custo_f.text_align = "left,middle";			
		custo_f.fill = "rgba(30,30,40,1)";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.objeto.message, new Rect(387,38,762,58), custo_f);
		
		tp_draw.getSingleton().drawImage(_data.objeto.images.url1X1, ctx, 290, 50);	//LOGO TOTALPLAY
	}else{
		var custoBackground = {
       		//"fill":           "0.5-rgba(28, 121, 156, .8)|1-rgba(5, 65, 100, .8)",
       		"fill":           _data.objeto.backGroundColor,
        	"fill_coords":    "0,0,.3,-2",
        	"stroke":         "rgba(90,90,90, 1)",
        	"stroke_coords":  "1,0,0,0",
        	"stroke_width":   2,
    	};
   	
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoBackground); //FONDO

		custo_f.text_align = "right,bottom";
		Canvas.drawText(ctx, _data.objeto.from, new Rect(67,38,186,32), custo_f);	

		custo_f.text_align = "right,top";
		custo_f.font_size = 18 * tpng.thema.text_proportion;
		custo_f.fill = "rgba(170,170,180,1)";
		Canvas.drawText(ctx, "<!i>"+_data.objeto.subject+"<!i>", new Rect(67,74,186,32), custo_f);

		custo_f.fill = "rgba(240, 240, 250, 1)";
		custo_f.font_size = 20 * tpng.thema.text_proportion;
		custo_f.text_align = "left,middle";	
		Canvas.drawText(ctx, _data.objeto.message, new Rect(387,38,762,58), custo_f);
		
		tp_draw.getSingleton().drawImage(_data.objeto.images.url1X1, ctx, 290, 50);	//LOGO TOTALPLAY
	}

	var custoL = {fill: "rgba(170, 170, 180, 1)"};
	Canvas.drawShape(ctx, "rect", [380,0,1,ctx.viewportHeight], custoL);
	
	ctx.drawObject(ctx.endObject());	
}

drawFocusStroke = function drawFocusStroke(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
		var custoX = { 
			"fill"  : null,  
			"stroke": "rgba(240,240,250,1)",
			"stroke_width": 2, 
			"rx": 0,
			"stroke_pos" : "inside"
		};
		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoX);
		
	ctx.drawObject(ctx.endObject());
}



drawDescriptionItem = function drawDescriptionItem (_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
	if(_data){
		if(_data.qualify != -1){
			tp_draw.getSingleton().drawImage("img/commons/qualify/"+_data.qualify+"star.png", ctx, 0, 0);
		}
		
		if(_data.price){
			if(_data.fullPB){
				Canvas.drawShape(ctx, "rect",[384, 0, 317, 32],this.themaData.custoPB);
				Canvas.drawText(ctx, _data.price, new Rect(389, -3, 287, 32), this.themaData.custoPrice);
			}else{
				Canvas.drawShape(ctx, "rect",[522, 0, 189, 32],this.themaData.custoBgPrice);
				Canvas.drawText(ctx, _data.price, new Rect(532, -3, 189, 32), this.themaData.custoPrice);
			}
		}
		
		if(_data.name){
			Canvas.drawText(ctx, _data.name, new Rect(0, 36, 644, 68), this.themaData.custoName);
		}		
		
		var x = 0;
		if(_data.rating){
			tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.rating+".png", ctx, 0, 124);
		}else{
			x = 56;
		}
		
		if(_data.aditional){
			Canvas.drawText(ctx, _data.aditional, new Rect(56-x, 108, 644-56, 36), this.themaData.custoAditional);
		}
		
		if(_data.actors){
			Canvas.drawText(ctx, _data.actors, new Rect(0, 147, 644, 28), this.themaData.custoActors);
		}
		
		if(_data.description){
			Canvas.drawText(ctx, _data.description, new Rect(0, 180, 644, 114), this.themaData.custoDescription);
		}
	}
	ctx.drawObject(ctx.endObject());
}

drawDescriptionItemB = function drawDescriptionItemB (_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
NGM.trace(" ??????? drawDescriptionItem __________ B _______");		


	if(_data){
		if(_data.qualify != -1){
			tp_draw.getSingleton().drawImage("img/commons/qualify/"+_data.qualify+"star.png", ctx, 0, 0);
		}
		
		if(_data.price){
			if(_data.fullPB){
				Canvas.drawShape(ctx, "rect",[0, 36, 317, 32],this.themaData.custoPB);
				Canvas.drawText(ctx, _data.price, new Rect(0, 36, 317, 32), this.themaData.custoPrice);
			}else{
				Canvas.drawShape(ctx, "rect",[0, 36, 189, 32],this.themaData.custoBgPrice);
				Canvas.drawText(ctx, _data.price, new Rect(0, 36, 189, 32), this.themaData.custoPrice);
			}
		}
		
		if(_data.name){
			Canvas.drawText(ctx, _data.name, new Rect(0, 68, ctx.viewportWidth, 68), this.themaData.custoName);
		}
		
		if(_data.rating){
			tp_draw.getSingleton().drawImage("img/tv/ratings/"+_data.rating+".png", ctx, 0, 152);
		}
		
		if(_data.aditional){
			Canvas.drawText(ctx, _data.aditional, new Rect(56, 144, ctx.viewportWidth-56 ,32), this.themaData.custoAditional);
		}
		
		if(_data.description){
			Canvas.drawText(ctx, _data.description, new Rect(0, 180, ctx.viewportWidth, 92), this.themaData.custoDescription);
		}
	}
	ctx.drawObject(ctx.endObject());
}

drawPlayerMessage = function drawPlayerMessage(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
			if(_data.future){
				if(_data.rating == "D"){
					var custoW = {"fill": "rgba(30,30,40, 1)"};
					Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight], custoW);
					tp_draw.getSingleton().drawImage("img/tv/programa_bloqueado.png", ctx, 199, 102);					
				}else{
					Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],this.themaData.darkBlackTimeline);
					tp_draw.getSingleton().drawImage("img/vod/miniplayer_FUTURO.png", ctx, 199, 102);
				}
			}else if(_data.noAnytime){
			
				if(_data.rating == "D"){
					var custoW = {"fill": "rgba(30,30,40, 1)"};
					Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight], custoW);
					tp_draw.getSingleton().drawImage("img/tv/programa_bloqueado.png", ctx, 199, 102);					
				}else{
					Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],this.themaData.darkBlackTimeline);
					tp_draw.getSingleton().drawImage("img/vod/miniplayer_ANYTIMETV.png", ctx, 199, 102);
				}			
			}else if(_data.anytime){
				//para recordingsHome ... 	anytimetvChapters	
				Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],this.themaData.darkBlackTimeline);
				var custo = JSON.stringify(this.themaData.custoDateNumber);
				custo = JSON.parse(custo);
				custo.font_size = 18 * tpng.thema.text_proportion;
				tp_draw.getSingleton().drawImage("img/menu/playAT.png", ctx, 199, 100);					
				Canvas.drawText(ctx, _data.anytime, new Rect(0, 60, ctx.viewportWidth, ctx.viewportHeight-60), custo);				
			
			}else{
				Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],this.themaData.darkBlackTimeline);
				var custo = JSON.stringify(this.themaData.custoDateNumber);
				custo = JSON.parse(custo);
				custo.font_size = 18 * tpng.thema.text_proportion;
				Canvas.drawText(ctx, _data, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo);				
				
				
			}
		ctx.drawObject(ctx.endObject());
}


drawCategoriesHeader = function drawCategoriesHeader(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();

		var custo = JSON.stringify(this.themaData.custoDateNumber);
		custo = JSON.parse(custo);
		custo.text_align = "left,middle";
		custo.font_size = 20* tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.categoryName, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo);
		
		
		/*
		custo.text_align = "right,middle";
		var txt = "";
		if(_data.position){
			txt = txt+_data.position+"/";
		}
		
		if(_data.total){
			txt = txt+"<!size=18>"+_data.total+"<!>";
			Canvas.drawText(ctx, txt, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo);
		}
		*/			
		ctx.drawObject(ctx.endObject());
}



drawCategoriesList = function drawCategoriesList(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   		ctx.clear();
   		
   		var _image = null;
   		var _isBuy = false;
   		var _showTitle = false;
   		var _title = "";
   		var _img1x1 = "";
   		var _dateBg = false;
   		var _date = null;
   		var _episode = "";
   		
    
   		if(_data.VodMovieVO){
	        _image = _data.VodMovieVO.images.url3X3;
	   		_isBuy = _data.VodMovieVO.isBuy;
	   		_episode = _data.VodMovieVO.episode;
        }else if(_data.ProgramVO){
        	//_dateBg=true;
        	_date = shortFormatDate(new Date(_data.ProgramVO.startTime));
        	_image = _data.ProgramVO.images.url3X3;
        	_showTitle = _data.ProgramVO.showTittle;
        	_title = _data.ProgramVO.name;
        	_img1x1 = _data.ProgramVO.ChannelVO.images.url1X1;
        }else if(_data.ChannelVO){
        	//_dateBg=true;
        	//_date = shortFormatDate(new Date(_data.ChannelVO.program.ProgramVO.startTime));
        	if(_data.ChannelVO.program.ProgramVO.showTittle && _data.ChannelVO.program.ProgramVO.showTittle == false){
        		_image = _data.ChannelVO.program.ProgramVO.images.url3X3;
	        	_showTitle = _data.ChannelVO.program.ProgramVO.showTittle;
	        	_title = _data.ChannelVO.program.ProgramVO.name;
	        	_img1x1 = _data.ChannelVO.program.ProgramVO.images.url1X1;
        	}else{
	        	_image = _data.ChannelVO.images.url3X3;
	        	_showTitle = false;
	        	_title = _data.ChannelVO.name;
	        	_img1x1 = _data.ChannelVO.images.url1X1;
        	}
        }else if(_data.CcaVO){
        	_image = _data.CcaVO.images.url3X3;
        	_showTitle = _data.CcaVO.showTittle;
        	_title = _data.CcaVO.name;
        	_img1x1 = _data.CcaVO.images.url1X1;
        }else if(_data.BundleVO){
        	_image = _data.BundleVO.images.url3X3;
        	_showTitle = false;
        	_title = _data.BundleVO.name;
        }else if(_data.VodCategoryVO){
        	_image = _data.VodCategoryVO[0].img;
        }
      
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
		
		if(focus){
			custo.rx = 5;
			custo.stroke_width = 5;
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
			var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_pos" : "inside"};
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10], strokeF);
			}else{
				Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo); //FONDO		
			}		
          
       if(_image)
        	tp_draw.getSingleton().drawImage(_image, ctx, 5, 5 ,null,null,null,"destination-over");
      

        if(_dateBg){
        	Canvas.drawShape(ctx, "rect",[45, 36, 97, 25], {"fill":"rgba(15,20,20,.7)"});
        	var custo = JSON.stringify(this.themaData.custoDateNumber);
			custo = JSON.parse(custo);
			custo.fill = "rgba( 240, 240, 250, 1)";
			Canvas.drawText(ctx, _date, new Rect(45, 36, 97, 25), custo);
        }
        
        
		if(_isBuy){
   			tp_draw.getSingleton().drawImage("img/vod/playVOD.png", ctx, 70, 28);
   			var progress = (186/100) *  _data.VodMovieVO.progress;
   			Canvas.drawShape(ctx, "rect",[5,95,ctx.viewportWidth-10,5], this.themaData.fillBase);
   			Canvas.drawShape(ctx, "rect",[5,95,progress,5], this.themaData.vodExpirationBG);
   		}
     	
     

		if(_img1x1){
			tp_draw.getSingleton().drawImage("img/menu/3x3_SOMBRAlogos.png", ctx, 5, 5, null , null, 
					function(){
						var ctx = this.getContext("2d");
						if(_showTitle){
						var custo = JSON.stringify(this.themaData.custoDateNumber);
							custo = JSON.parse(custo);
							custo.text_align = "center,middle";
							Canvas.drawText(ctx, _title, new Rect(5,5,ctx.viewportWidth-10,55), custo);
			
			
						}
					tp_draw.getSingleton().drawImage(_img1x1, ctx, 110, 61);
			}.bind(this));
		}else{
			if(_showTitle){
				var custo = JSON.stringify(this.themaData.custoDateNumber);
					custo = JSON.parse(custo);
					custo.text_align = "center,middle";
				Canvas.drawText(ctx, _title, new Rect(5,5,ctx.viewportWidth-10,ctx.viewportHeight-10), custo);
			}
		}
		

		if(_episode){
			var custo_f = JSON.stringify(this.themaData.standardFont);
				custo_f = JSON.parse(custo_f);
				custo_f.fill = "rgba(240, 240, 240, .5)";
				custo_f.text_align = "bottom,left";
				custo_f.font_size = 64 * tpng.thema.text_proportion;
				Canvas.drawText(ctx, _episode, new Rect(10,0,ctx.viewportWidth/2,ctx.viewportHeight), custo_f);
			
		}
     
   		ctx.drawObject(ctx.endObject());
   	}
   	
}



drawCategoriesList_c = function drawCategoriesList_c(_data){
	// draw solo para el vodHome **
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   		ctx.clear();

		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : JSON.stringify(this.themaData.outLineGeneralPanelNoFocus);
			custo = JSON.parse(custo);
		
		if(focus){
			custo.rx = 5;
			custo.stroke_width = 5;
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
			var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_pos" : "inside"};
			Canvas.drawShape(ctx, "rect", [5, 5, ctx.viewportWidth-10,ctx.viewportHeight-10], strokeF);
			}else{
				Canvas.drawShape(ctx, "rect", [4,4,ctx.viewportWidth-8,ctx.viewportHeight-8], custo); //FONDO		
			}		
          
	   var image = _data.VodMovieVO ? _data.VodMovieVO.images.url3X3 : _data.VodCategoryVO[0].img;      
	   tp_draw.getSingleton().drawImage(image, ctx, 5, 5 ,null,null,null,"destination-over");		
	   
	   if(_data.VodMovieVO.ccoId == 317){
	   	tp_draw.getSingleton().drawImage("img/vod/test.png", ctx, 5, 5);
	   }
		    
		if(_data.VodMovieVO.isBuy){
   			tp_draw.getSingleton().drawImage("img/vod/playVOD.png", ctx, 70, 28);
   			var progress = (186/100) *  _data.VodMovieVO.progress;
   			Canvas.drawShape(ctx, "rect",[5,95,ctx.viewportWidth-10,5], this.themaData.fillBase);
   			Canvas.drawShape(ctx, "rect",[5,95,progress,5], this.themaData.vodExpirationBG);
   		}
         
   		ctx.drawObject(ctx.endObject());
   	}
}

drawArrowsLRList = function drawArrowsLRList(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		if(_data.left){
			tp_draw.getSingleton().drawImage("img/tv/arrowLeftOn.png", ctx, 0, 36);
		}else{
			Canvas.drawShape(ctx, "rect",[13, 0, 1, ctx.viewportHeight], {"fill": "rgba(240, 240, 250, .5)"});
		}
		if(_data.right){
			tp_draw.getSingleton().drawImage("img/tv/arrowRightOn.png", ctx, ctx.viewportWidth-32, 36);
		}else{
			var posX = ctx.viewportWidth-11;
			if(_data.total < 7){
				posX = 16+(192*_data.total)
			}
			Canvas.drawShape(ctx, "rect",[posX, 0, 1, ctx.viewportHeight], {"fill": "rgba(240, 240, 250, .5)"});
		}
		ctx.drawObject(ctx.endObject());
}

drawArrowsUDList = function drawArrowsUDList(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();

		ctx.drawObject(ctx.endObject());
}

drawExpiration = function drawExpiration(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		var custo = JSON.stringify(this.themaData.vodExpirationBG);
		custo = JSON.parse(custo);
		
		var custoT = JSON.stringify(this.themaData.custoDateNumber);
		custoT = JSON.parse(custoT);
		
		if(_data.live){
			custo.fill = "rgba(0, 190, 230, 1)";
		}else if(_data.anytime){
			custo.fill = "rgba(190, 50, 120, 1)";
		}else if(_data.noAnytime){
			custo.fill = "rgba(220, 220, 230, 1)";
			custoT.fill= "rgba(15, 20, 20, 1)";
		}else if(_data.future){
			custo.fill = "rgba(220, 220, 230, 1)";
			custoT.fill= "rgba(15, 20, 20, 1)";
		}
		
		Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],custo);
		
		custoT.font_size = 18 * tpng.thema.text_proportion;
		Canvas.drawText(ctx, _data.date, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custoT);
		
		ctx.drawObject(ctx.endObject());
}

drawFooterList = function drawFooterList(_data){
	var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		
		var custo = JSON.stringify(this.themaData.custoDateNumber);
		custo = JSON.parse(custo);
		custo.text_align = "center,top";
		if(_data.noResult == true){
			custo.fill = "rgba(255, 220, 0, 1)";
		}else{
			custo.fill = "rgba(170, 170, 180, 1)";
		}
		
		if(_data.title){
			custo.font_size = 24* tpng.thema.text_proportion;
			Canvas.drawText(ctx, "<!i>"+_data.title+"<!>", new Rect(0, -2, ctx.viewportWidth, ctx.viewportHeight), custo);
			//¿No encontraste lo que buscabas?
			if(_data.subtitle){
				custo.font_size = 16* tpng.thema.text_proportion;
				custo.text_align = "center,top";
				Canvas.drawText(ctx, "<!i>"+_data.subtitle+"<!>", new Rect(0, 30, ctx.viewportWidth, ctx.viewportHeight), custo);
				//Intenta usando  la búsqueda o encuentra contenido grabado en la sección Anytimetv.
			}
		}else{
			if(_data.subtitle){
				custo.font_size = 16* tpng.thema.text_proportion;
				custo.text_align = "center,top";
				Canvas.drawText(ctx, "<!i>"+_data.subtitle+"<!>", new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo);
				//Intenta usando  la búsqueda o encuentra contenido grabado en la sección Anytimetv.
			}
		}
		
		
		
		ctx.drawObject(ctx.endObject());
}


drawBackgroundCatHeader = function drawBackgroundCatHeader (_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
		Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],{"fill":"rgba(15,20,20,1)"});
	ctx.drawObject(ctx.endObject());
}

drawCategoriesHeaderList = function drawCategoriesHeaderList(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   		ctx.clear();
   		
   		var custo = JSON.stringify(this.themaData.custoDateNumber);
		custo = JSON.parse(custo);
		custo.text_align = "center,middle";
		custo.fill = "rgba(170, 170, 180, 1)";
		custo.text_multiline = false;
		custo.font_size = 20* tpng.thema.text_proportion;
		
		Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],{"stroke": "rgba(190, 160, 200, .2)", "stroke_width": 1, "stroke_pos":"inside"});
   		if(focus){
   			if(_data.CategoryVO.focus){
   				custo.fill = "rgba(0, 0, 0, 1)";
   				Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],{"fill": "rgba(240, 240, 250, 1)"});
   			}else{
   				custo.fill = "rgba(0, 0, 0, 1)";
   				Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],{"fill": "rgba(240, 240, 250, 1)"});
   			}
   		}else{
   			if(_data.CategoryVO.focus){
   				custo.fill = "rgba(190, 160, 200, 1)";
   				Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],{"fill": "rgba(60, 30, 70, 1)"});
   			}
   		}
   		Canvas.drawText(ctx, _data.CategoryVO.categoryName, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo);
   		ctx.drawObject(ctx.endObject());
   	}
}

drawSubCategoriesHeaderList = function drawSubCategoriesHeaderList(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
   		ctx.clear();
   		
   		var custo = JSON.stringify(this.themaData.custoDateNumber);
		custo = JSON.parse(custo);
		custo.text_align = "center,middle";
		custo.fill = "rgba(170, 170, 180, 1)";
		custo.text_multiline = false;
		custo.font_size = 20* tpng.thema.text_proportion;
		
		Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],{"stroke": "rgba(190, 160, 200, .2)", "stroke_width": 1, "stroke_pos":"inside"});
   		if(focus){
   			custo.fill = "rgba(190, 160, 200, 1)";
   			Canvas.drawShape(ctx, "rect",[0, 0, ctx.viewportWidth, ctx.viewportHeight],{"fill": "rgba(60, 30, 70, 1)"});
   		}
   		Canvas.drawText(ctx, _data.CategoryVO.categoryName, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo);
   		ctx.drawObject(ctx.endObject());
   	}
}
drawNotificationTweet = function drawNotificationTweet(_data){
	
	this.draw = function draw(focus) {
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
		var custo = JSON.stringify(this.themaData.standardFont);
			custo = JSON.parse(custo);
			custo.fill = "rgba(0,0,0,1)";
			custo.text_multiline = true;
			custo.text_align = "left,top";
			custo.font_size = 24* tpng.thema.text_proportion;

	    tp_draw.getSingleton().drawImage(_data.user.profile_image_url,ctx, 67,15,43,43);
	    Canvas.drawText(ctx, "<!b>" + _data.user.name+"<!>" , new Rect(131,15,448,30), custo);		
	    custo.font_size = 18;
	    Canvas.drawText(ctx, _data.text, new Rect(67,70,512,68), custo);
	    custo.fill = "rgba(130,130,130,1)";
	    Canvas.drawText(ctx, "@"+_data.user.screen_name, new Rect(131,35,448,25), custo);
	   // Canvas.drawShape(ctx, "rect", [67,70,430,1], {fill:"rgba(90,90,90,1)"});
	
	    ctx.drawObject(ctx.endObject());
    }
}
drawBg_Twitter = function drawBg_Twitter(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear(); 
    tp_draw.getSingleton().drawImage(_data.url, ctx, 515, 0);
  	Canvas.drawShape(ctx, "rect", [0,0,579, ctx.viewportHeight], {fill:"rgba(240,240,240,1)","stroke": "rgba(220,220,230,1)","stroke_width": 1,"stroke_pos" : "inside"});
	
	
	ctx.drawObject(ctx.endObject());
}
drawActive_Twitter = function drawActive_Twitter(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear(); 
    
  	tp_draw.getSingleton().drawImage(_data.url, ctx, 0, 0);
	
	ctx.drawObject(ctx.endObject());
}
drawFocusStrokePlayerB = function drawFocusStrokePlayerB(data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
		var custoX = { 
			fill  : null,  
			stroke: "rgba(240,240,250,1)",
			stroke_width: 4, 
			rx: 0,
			stroke_pos : "inside"
		};
		
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoX);
		
	ctx.drawObject(ctx.endObject());
}

drawBackX = function drawBackX(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();


	tp_draw.getSingleton().drawImage("img/DevsOnion.png", ctx, 0, 0); //tmp el w y h	
	ctx.drawObject(ctx.endObject());	
}