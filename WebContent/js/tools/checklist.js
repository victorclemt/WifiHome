
FormWidget.registerTypeStandard("checklist");

function checklist(_json, _options){
   	this.super(_json, _options);
   	this._userData = _options.userData;
   	
   	this.diagnostic_data = [
   	
   		{"isHeader": true},
   		
   		{"alias": "SERVICIOS TP", "host": "10.1.0.146", "packages": "--", "time": "--"},
   		{"alias": "SERVICIOS TPDN", "host": "iptvcore.totalplay.com.mx", "packages": "--", "time": "--"},
   		{"alias": "DMS TP", "host": "upgradetp.prod.totalplay.iusacell.com.mx", "packages": "--", "time": "--"},
   		{"alias": "EPG TP", "host": "epgtp.prod.totalplay.iusacell.com.mx", "packages": "--", "time": "--"},
   		{"alias": "CDN TP", "host": "vod.cdn.iutpcdn.com", "packages": "--", "time": "--"},
   		{"alias": "NG APPS", "host": "10.213.8.212", "packages": "--", "time": "--"},
   		{"alias": "NETFLIX", "host": "netflix.com", "packages": "--", "time": "--"},
   		
   		{"alias": "GOOGLE", "host": "google.com", "packages": "--", "time": "--"}
   	];
   	
   	this.v_results_data = [
   		{"isHeader": true}
   	];
   	
   	this.cm = Netgem.middleware.connectionManager;
   	this.counter = 1;
   	this.videoCounter = 0;
   
}

checklist.inherits(FormWidget);

checklist.prototype.onExit = function onExit(){
	this.widgets.dots.stop();
	this.widgets.player.setData();
	this.cm.removeEventListener("pingEvent", this.boundCallback, true);
	this.cm = null;
}

checklist.prototype.onEnter = function onEnter(_data){
	NGM.trace(" ");
	NGM.trace("checklist");	
	NGM.trace("   ");
	this.home = _data.home;
	
	//HEADER Y BACKGROUND
	this.home.showHeader({"stroke":"rgba(130, 60, 150, 1)","section":this});
	this.home.refreshHeader(2, "selected", true);		
	this.home.setBg("img/tools/bg.jpg");

	//CONNECTION MANAGER LISTENER
	this.boundCallback = this.callback.bind(this);
	this.cm.addEventListener("pingEvent", this.boundCallback, true);
	
	
	//INTERFAZ
	var list = this.widgets.pings;
	var dots = this.widgets.dots;
	var message = this.widgets.message;
	var title = this.widgets.title;
	var ico = this.widgets.ico;
	
	
	list.setData(this.diagnostic_data);
	message.setData({"message": "<!b>Espera mientras hacemos el diagnóstico<!>"});
	title.setData({"message": "<!size=30>Diagnosticando Conexión de Red<!>"});
	ico.setData({"img": "img/tools/icon.png"});
	
	this.client.lock();
		list.stateChange("enter");
		message.stateChange("enter");
		title.stateChange("enter");
		ico.stateChange("enter");
	this.client.unlock();
	
	this.initialTs = new Date().getTime();
	this.ping();
	dots.start();
	
}


checklist.prototype.ping = function ping(){
	for(var i = 1; i < this.diagnostic_data.length; i++){
		var command = "-c 5 " + this.diagnostic_data[i].host;
		NGM.trace("ping " + command);
		this.cm.ping(command);
	}	
	
}


checklist.prototype.callback = function callback(ev){
	var host = ev.command.split(' ').pop();
	var ret = {
		status: ev.status,
		command: ev.command,
		output: []
	};

	if (!ev.byteBuffer) {
		ret.output.push("<no response>");
	} else {
		var line = ev.byteBuffer.getLine();
		while (line !== null) {
			ret.output.push(line + '');
			line = ev.byteBuffer.getLine();
		}
	}
	var line = this.pingParser(ret);
	var res = line.split("=");
		
	//Actualizar información del PING
	var msTotal = new Date().getTime() - this.initialTs;
	var pings = this.widgets.pings;
	var item = this.findItemByHost(host);
	var times = res[res.length -1].split("/");
	item.packages = ret.lossRate;
	item.time = ret.error ?  msTotal + " ms" : times[1] + " / " + msTotal + " ms";

	pings.redraw();
	
	if(++this.counter === this.diagnostic_data.length){
		NGM.trace("TERMINO LOS PINGS");
		var message = this.widgets.message;
		message.setData({"message": "<!color=#0489B1!b>PRESIONA OK <!><!b>PARA CONTINUAR<!>"});
		message.refresh();
		this.widgets.dots.stop();
		this.actualFocus = "ping";
	}
	
	
}


checklist.prototype.findItemByHost = function findItemByHost(host){
	var item, i, pings = this.widgets.pings;
	for(i = 0, count = pings.list.length; i < count; i++){
		item = pings.list[i];
		if(item.host == host){
			return item;
		}
	}
	return false;
};

checklist.prototype.pingParser = function pingParser(resp) {
	var error = false;
	var numLines = resp.output.length;
	var lossRate, line, matches;
	
	//We got a "ping: unknown host" response.
	if(numLines === 1){
		resp.lossRate = 100;
		resp.error = true;
	}else{
		//The stats are in the next to last line
		line = resp.output[numLines - 2];
		//NGM.trace(line);
		matches = line.match(/([0-9]{1,3})%/);
		if(!matches){
			resp.error = true;
			resp.lossRate = 100;
		}else{
			resp.lossRate = matches[1];
		}
	}
	
	NGM.dump(resp.output);
	return resp.output[numLines - 1];

}



checklist.prototype.onKeyPress = function onKeyPress(_key){
		switch(this.actualFocus){ 
			case "ping":
				 this.onKeyPressPing(_key);
			break;
			case "videos":
				 this.onKeyPressVideos(_key);
			break;
			case "results":
				 this.onKeyPressResults(_key);
			break;
		}
	return true;
}

checklist.prototype.onKeyPressPing = function onKeyPressPing(_key){	 
	switch(_key){	     
	  case "KEY_IRENTER":
	  	this.actualFocus = "";
	  	this.getVideoData();
	  break; 		
	}	
	return true;
}

checklist.prototype.onKeyPressVideos = function onKeyPressVideos(_key){	 
	switch(_key){
	  case "KEY_IRENTER":
	  	this.showResults();
	  break; 		
	}	
	return true;
}

checklist.prototype.onKeyPressResults = function onKeyPressResults(_key){	 
	switch(_key){
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
			this.home.hideHeader();
	    	this.home.closeSection(this);
	    break;
	}	
	return true;
}



checklist.prototype.getVideoData = function getVideoData() {
	getServices.getSingleton().call("ADMIN_GET_CUSTOMER_DATA", , this.responseGetUserData.bind(this));
}

checklist.prototype.responseGetUserData = function responseGetUserData(_response) {
	if(_response.status == 200){		
		var pings = this.widgets.pings;
		var message = this.widgets.message;
		var title = this.widgets.title;
		var dots = this.widgets.dots;
		var videos = this.widgets.videos;
		
		this.videos_data = [
			{"title": "TV en vivo", "url": _response.data.ResponseVO.channel.ChannelVO.url + "", "mode": "stop"},
			{"title": "Anytime Tv", "url": _response.data.ResponseVO.program.ProgramVO.urlCtv, "mode": "stop", "type": "hls"},
			{"title": "On Demand", "url": _response.data.ResponseVO.vod.VodMovieVO.formats[0].VodFormatVO.url, "mode": "stop", "type": "hls"}
		];
		
		pings.animation.alpha(0,300).move(-600,0,300).start();
		
		title.setData({"message": "<!size=30>Diagnosticando Señales de Video<!>"});
		message.setData({"message": "<!b>Espera mientras hacemos el diagnóstico<!>"});
		
		videos.setData(this.videos_data);
		
		
		this.client.lock();
			message.refresh("enter");
			title.refresh("enter");
			videos.stateChange("enter");
			videos.refresh();
		this.client.unlock(); 
		
		this.playVideo();
		dots.start();
	}else{
		//a la chingada pq no hay con que probar video
		//supongo que mandaré al resumen
		this.showResults();
	}
	
}
checklist.prototype.playVideo = function playVideo() {
	var player = this.widgets.player;
	var dots = this.widgets.dots;
	var videos = this.widgets.videos;
	
	videos.redraw();	
	if(this.videoCounter < this.videos_data.length){
		unsetTimeAlarm(this.playVideoDelay);
		this.playVideoDelay = this.playVideo.bind(this).delay(10000);		
	}else{
		var dots = this.widgets.dots;
		var message = this.widgets.message;
		player.setData();		
		message.setData({"message": "<!color=#0489B1!b>PRESIONA OK <!><!b>PARA CONTINUAR<!>"});
		message.refresh();
		dots.stop();
		this.actualFocus = "videos";
		return;	
	}
	NGM.trace(" ");
	NGM.trace(" ");
	NGM.trace("playVideo: " + this.videos_data[this.videoCounter].url);	
	var o = this.videos_data[this.videoCounter].type ? {"playerType": this.videos_data[this.videoCounter].type} : {};
	this.videos_data[this.videoCounter].mode = "error";
	player.setData();
	player.setData(this.videos_data[this.videoCounter].url,o);
	player.stateChange("preview_"+this.videoCounter);	
	this.videoCounter ++;
}

checklist.prototype.showResults = function showResults() {
	var pings = this.widgets.pings;
	var message = this.widgets.message;
	var title = this.widgets.title;
	var dots = this.widgets.dots;
	var videos = this.widgets.videos;
	var v_results = this.widgets.v_results;
	
	pings.animation.move(1800,0,0).start();
	videos.animation.alpha(0,300).move(-1000,0,300).start();
	title.setData({"message": "<!size=30>Resumen del Diagnóstico<!>"});
	message.setData({"message": "<!color=#0489B1!b>PRESIONA OK <!><!b>PARA FINALIZAR<!>"});
	var array = this.v_results_data.concat(this.videos_data);
	v_results.setData(array);
	
	pings.animation.alpha(255,300).move(-300,0,300).start();
	v_results.stateChange("enter");
	this.client.lock();
		title.refresh();
		message.refresh();		
	this.client.unlock();
	this.actualFocus = "results";
}

checklist.prototype.onStreamEvent = function onStreamEvent(event) {
	NGM.trace("event.type: " + event.type);
	switch(event.type){
		
		case "firstFrameDisplayed":
			this.videos_data[this.videoCounter-1].mode = "ok";
		break;
		case "start":
				
		break;
        case "error":
        	unsetTimeAlarm(this.playVideoDelay);
			this.playVideo();
        break;
        default:
            ;
        break;
	}
	if(this.objectChild){
		this.objectChild.onStreamEvent(event);
	}
}


checklist.drawPings = function drawPings(_data){

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 
		
		//color azul facebook: <!color=#0489B1>
		
		var custo = {"fill": "rgba(170,170,180,1)"};  
		var custo_f = JSON_Complete({	
							"font_size":18,
							"fill": "rgba(170,170,180,1)",
							"font_family": "Oxygen-Light",
							"text_align": "center,middle",
							"text_multiline":true});
				
		if(_data.isHeader){
			Canvas.drawShape(ctx, "rect",  new Rect(0,ctx.viewportHeight-1,ctx.viewportWidth,1), custo);
			Canvas.drawText(ctx, "HOST", new Rect(0,-5,122,ctx.viewportHeight), custo_f);
			Canvas.drawText(ctx, "TIEMPO|AVG/TOTAL", new Rect(162,-5,182,ctx.viewportHeight), custo_f);
			Canvas.drawText(ctx, "PAQUETES|ENVIADOS", new Rect(390,-5,122,ctx.viewportHeight), custo_f);		
		}else{
			//Canvas.drawShape(ctx, "rect",  new Rect(0,0,ctx.viewportWidth,30), custo);	
			//custo_f.text_align = "center,middle";
			custo_f.font_size = 16;
			custo_f.text_multiline = false;
			custo_f.fill = "rgba(240,240,240,1)";
			Canvas.drawText(ctx, _data.alias, new Rect(0,0,152,30), custo_f);	
			Canvas.drawText(ctx, _data.time, new Rect(152,0,202,30), custo_f);				
			if(_data.packages != "--"){
				var sentPackages = 100 - _data.packages;
				if(sentPackages >= 90) custo_f.fill = "rgba(190,220,50,1)";
				else if(sentPackages >= 40) custo_f.fill = "rgba(250,180,60,1)";
				else custo_f.fill = "rgba(220,60,70,1)";
			}
			var packages = _data.packages == "--" ? _data.packages : sentPackages + "%";
			Canvas.drawText(ctx, packages, new Rect(390,0,122,30), custo_f);	
		}
				
		ctx.drawObject(ctx.endObject());
	}
}

checklist.drawMessage = function drawMessage(_data){
	var ctx = this.getContext("2d");		
    ctx.beginObject();
	ctx.clear(); 
	var custo_f = JSON_Complete({	
						"font_size":18,
						"fill": "rgba(240,240,240,1)",
						"font_family": "Oxygen-Light",
						"text_align": "center,middle",
						"text_multiline":true});
	
	Canvas.drawText(ctx, _data.message, new Rect(0,-5,ctx.viewportWidth,ctx.viewportHeight), custo_f);		
	ctx.drawObject(ctx.endObject());
}

checklist.drawIco = function drawIco(_data){
	var ctx = this.getContext("2d");		
    ctx.beginObject();
	ctx.clear(); 
	tp_draw.getSingleton().drawImage(_data.img, ctx, 0, 0);	
	ctx.drawObject(ctx.endObject());
}

checklist.drawVideo = function drawVideo(_data){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 
		
		var custo_f = JSON_Complete({	
						"font_size":22,
						"fill": "rgba(240,240,240,1)",
						"font_family": "Oxygen-Light",
						"text_align": "center,top",
						"text_multiline":true});
	
		Canvas.drawText(ctx, _data.title, new Rect(0,0,ctx.viewportWidth,30), custo_f);
		
		if(_data.mode == "stop")
			tp_draw.getSingleton().drawImage("img/tools/videoPreview.jpg", ctx, 0, 36);	
		else if(_data.mode == "ok")
			tp_draw.getSingleton().drawImage("img/tools/videoOk.png", ctx, 0, 36);
		else
			tp_draw.getSingleton().drawImage("img/tools/videoNoOk.png", ctx, 0, 36);
			
		ctx.drawObject(ctx.endObject());
	}
}

checklist.drawVResults = function drawVResults(_data){

	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");		
	    ctx.beginObject();
		ctx.clear(); 
		
		//color azul facebook: <!color=#0489B1>
		
		var custo = {"fill": "rgba(170,170,180,1)"};  
		var custo_f = JSON_Complete({	
							"font_size":18,
							"fill": "rgba(170,170,180,1)",
							"font_family": "Oxygen-Light",
							"text_align": "center,middle",
							"text_multiline":true});
				
		if(_data.isHeader){
			Canvas.drawShape(ctx, "rect",  new Rect(0,ctx.viewportHeight-1,ctx.viewportWidth,1), custo);
			Canvas.drawText(ctx, "VIDEO", new Rect(0,-5,122,ctx.viewportHeight), custo_f);
			Canvas.drawText(ctx, "ESTATUS", new Rect(78,-5,182,ctx.viewportHeight), custo_f);				
		}else{
			custo_f.font_size = 16;
			custo_f.text_multiline = false;
			custo_f.fill = "rgba(240,240,240,1)";
			Canvas.drawText(ctx, _data.title.toUpperCase(), new Rect(0,0,122,30), custo_f);	
			var img = _data.mode == "ok" ? "img/tools/videoOk-Small.png" : "img/tools/videoFail-Small.png" ;
			tp_draw.getSingleton().drawImage(img, ctx, 122, 3);
			
		}		
		ctx.drawObject(ctx.endObject());
	}
}
