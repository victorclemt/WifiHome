// mosaic.js

function mosaic(_json, _options){
    this.super(_json, _options);
    this.col;
    this.row = 0;
    this.mosaicNumber;
    this.dir = "";
    this.allMosaics = [];
    this.currentM;
    this.allCurrentChannels;
    this.banners = [];
    this.firstM = [];
    this.url = "";
    this.six = "";
    this.index = 0;
}

mosaic.inherits(FormWidget);

mosaic.prototype.onEnter = function onEnter(_data){	
	
	this.keyAvailable = false;
	this.home = _data.home;
	this.mosaicNumber = _data.ch;
	this.home.objectChild = this;
	this.initMosaic();	
	
	//this.widgets.back.setData();
	//this.widgets.back.stateChange("enter");
	
}

mosaic.prototype.onExit = function onExit(){
	this.widgets.stateChange("exit");
	this.home.widgets.player.setData();
	this.home.objectChild = null;
	this.home.hideHeader();
}
mosaic.prototype.onStreamEvent = function onStreamEvent(event) {	
	var w = this.widgets;
	
	switch(event.type){		
		case "start":	
			if(this.allMosaics.length > 0 && this.dir != ""){
				this.reShowMosaics();
			}
			
			/*if(this.allMosaics.length > 0 && this.dir != ""){
				this.reShowMosaics();
			}*/
			
			
			
			/*if(this.allMosaics.length >0 && this.dir == ""){
				this.showMosaics();
			}
			else{					
				this.reShowMosaics();
			}*/
		break;
		case "starting":
		
		break;
	}	
}

mosaic.prototype.initMosaic = function initMosaic(){
	getServices.getSingleton().call("EPG_GET_MOSAICS",, this.responseCurrentMosaic.bind(this));
}

mosaic.prototype.responseCurrentMosaic = function responseCurrentMosaic(response){
	this.keyAvailable = true;
	var w = this.widgets;
	if(response.error.error == null && response.status == 200){	
		//ELIMINA EL PRIMER CANAL DE CADA ARREGLO
		for(var i = 0; i<response.data.arrayMosaics.length; i++){
			this.firstM[i] = response.data.arrayMosaics[i].MosaicVO.arrayMosaic.shift();
		}
		//OBTIENE EL MOSAICO ACTUAL DEPENDIENDO DEL NÚMERO THIS.MOSAICNUMBER
		for(var i = 0; i<response.data.arrayMosaics.length; i++){
			if(this.mosaicNumber == response.data.arrayMosaics[i].MosaicVO.channelMosaic.ChannelVO.number){
				this.url = response.data.arrayMosaics[i].MosaicVO.channelMosaic.ChannelVO.url;
				this.index = i;
				break;
			}
		}
		//ARREGLO QUE LLENA EL HEADER
		this.allMosaics = response.data.arrayMosaics;
		this.banners = this.allMosaics[this.index].MosaicVO.arrayBanners;
		//this.keyAvailable = true;		
		if(this.url == "" || this.url == undefined){
		
			switch(this.mosaicNumber){
				case 100:
				case 6:
				case "6":
				case "100":
					var bg = "img/tv/mosaics/100-TvAbierta.jpg"; 
				break;
				
				case 200:
				case "200":
					var bg = "img/tv/mosaics/200-Entretenimiento.jpg";
				break;
				
				case 300:
				case "300":
					var bg = "img/tv/mosaics/300-Infantil.jpg";
				break;
				
				case 350:
				case "350":
					var bg = "img/tv/mosaics/350-MundoyCultura.jpg";
				break;
				
				case 400:
				case "400":
					var bg = "img/tv/mosaics/400-Cine.jpg";
				break;
				
				case 500:
				case "500":
					var bg = "img/tv/mosaics/500-Deportes.jpg";
				break;
				
				case 600:
				case "600":
					var bg = "img/tv/mosaics/600-Noticias.jpg";
				break;
				
				case 650:
				case "650":
					var bg = "img/tv/mosaics/650-Internacionales.jpg";
				break;
			
				case 700:
				case "700":
					var bg = "img/tv/mosaics/700-Musica.jpg";
				break;
			}
			this.home.setBg(bg);
			w.noMosaics.setData({"text1":"Estamos trabajando en tus mosaicos.","text2":"Por favor vuelve más tarde."});
			w.noMosaics.stateChange("enter");
			this.col = "nm";
		}
		else{
	    	this.home.playVideo(this.url,"MOSAIC");		
		}
		
		
		this.showMosaics();
		
		
	}else{
			var w = this.widgets;
			var bg = "img/tv/mosaics/700-Musica.jpg";
			this.home.setBg(bg);
			w.noMosaics.setData({"text1":"Estamos trabajando en tus mosaicos.","text2":"Por favor vuelve más tarde."});
			w.noMosaics.stateChange("enter");
			this.col = "nm";
		//this.home.openSection("error", {"home": this.home, "title": gettext("ERROR_TITLE"),"code":response.status, "message":response.error.message,"suggest":response.error.suggest}, false);
	}
		
}

mosaic.prototype.showMosaics = function showMosaics (){
		
		var w = this.widgets;
		//MOSAICO ACTUAL CON CANALES DE LISTAS
		this.firstChannelM = this.firstM[this.index];
		this.currentM = this.allMosaics[this.index].MosaicVO.arrayMosaic;

		//CANALES CORRESPONDIENTES A MOSAICO ACTUAL		
		this.allCurrentChannels = this.allMosaics[this.index].MosaicVO.arrayChannels;

		if(this.index == 8){
			this.lastChannel = this.allMosaics[0].MosaicVO.arrayChannels[0].ChannelVO;
		}
		else{
			this.lastChannel = this.allMosaics[this.index+1].MosaicVO.arrayChannels[0].ChannelVO;
		}
		if(this.index == 0){
			var l = this.allMosaics[this.allMosaics.length-1].MosaicVO.arrayChannels.length-1;
			this.firstChannel = this.allMosaics[this.allMosaics.length-1].MosaicVO.arrayChannels[l].ChannelVO;
		}else{
			var l = this.allMosaics[this.index-1].MosaicVO.arrayChannels.length-1;
			this.firstChannel = this.allMosaics[this.index-1].MosaicVO.arrayChannels[l].ChannelVO;
		}
		w.first.setData(this.firstChannel);
		w.last.setData(this.lastChannel);
		w.headerMosaics.setData(this.allMosaics,this.index);
		w.headerLegendMosaics.setData(this.allMosaics,this.index);
		w.firstCol.setData([this.firstChannelM]);
		w.firstColWhite.setData();
		w.cols.setData(this.currentM);
		w.channelList.setData(this.allCurrentChannels);
		w.banners.setData(this.banners);
		w.leftArrowC.setData({"url":"img/tv/arrowLeftOn.png"});
		w.rightArrowC.setData({"url":"img/tv/arrowRightOn.png"});
		w.leftArrowL.setData({"url":"img/tv/arrowLeftOn.png"});
		w.rightArrowL.setData({"url":"img/tv/arrowRightOn.png"});
		this.client.lock();
				this.home.showHeader({"section":"mosaic","simple": false,"fill": "rgba(0,0,0,0)"});
				w.leftArrowC.stateChange("enter");
				w.rightArrowC.stateChange("enter");
				w.leftArrowL.stateChange("enter");
				w.rightArrowL.stateChange("enter");
				w.headerMosaics.stateChange("enter");
				w.headerLegendMosaics.stateChange("enter");
				w.first.stateChange("enter");
				w.channelList.stateChange("enter");
				w.cols.stateChange("enter");
				w.firstCol.stateChange("enter");
				w.firstColWhite.stateChange("enter");
				w.banners.stateChange("enter");
				w.channelList.setFocus(false);
				w.headerMosaics.setFocus(false);
				w.headerLegendMosaics.setFocus(false);
				w.cols.setFocus(false);
				this.col = "l";
				
				
		this.client.unlock();
	
}

mosaic.prototype.reShowMosaics = function reShowMosaics(){
var w = this.widgets
this.firstChannelM = this.firstM[this.index];
this.currentM = this.allMosaics[this.index].MosaicVO.arrayMosaic;
		//CANALES CORRESPONDIENTES A MOSAICO ACTUAL
		this.allCurrentChannels = this.allMosaics[this.index].MosaicVO.arrayChannels;
		
		if(this.index == 8){
			this.lastChannel = this.allMosaics[0].MosaicVO.arrayChannels[0].ChannelVO;
		}
		else{
			this.lastChannel = this.allMosaics[this.index+1].MosaicVO.arrayChannels[0].ChannelVO;
		}
		if(this.index == 0){
			var l = this.allMosaics[this.allMosaics.length-1].MosaicVO.arrayChannels.length-1;
			this.firstChannel = this.allMosaics[this.allMosaics.length-1].MosaicVO.arrayChannels[l].ChannelVO;
		}else{
			var l = this.allMosaics[this.index-1].MosaicVO.arrayChannels.length-1;
			this.firstChannel = this.allMosaics[this.index-1].MosaicVO.arrayChannels[l].ChannelVO;
		}
		switch(this.col){
		//HEADER MOSAICOS
		case "h":
		if(this.dir == "left"){
		this.client.lock();
			w.cols.speed = 300;
			w.firstCol.speed = 300;
			w.banners.speed = 300;
			w.channelList.setData(this.allCurrentChannels);
			w.first.setData(this.firstChannel);
			w.last.setData(this.lastChannel);
			w.headerMosaics.setData(this.allMosaics,this.index);
			w.headerLegendMosaics.setData(this.allMosaics,this.index);
			w.firstColWhite.setData();
			w.firstCol.setData([this.firstChannelM]);
			w.cols.updateData(this.currentM);
			w.banners.setData(this.banners);
				w.headerMosaics.stateChange("enter");
				w.headerLegendMosaics.stateChange("enter_2");
				w.channelList.stateChange("enter");
				w.first.stateChange("enter");
				w.banners.stateChange("enter");
				w.firstColWhite.stateChange("exit");
				w.firstCol.stateChange("enter");
				w.cols.stateChange("enter_2");
				w.leftArrowC.stateChange("enter");
				w.rightArrowC.stateChange("enter");
				w.leftArrowL.stateChange("enter");
				w.rightArrowL.stateChange("enter");
				w.leftArrowC.setFocus(false);
				w.rightArrowC.setFocus(false);
				w.leftArrowL.setFocus(false);
				w.rightArrowL.setFocus(false);
				w.cols.setFocus(false);
				w.firstCol.setFocus(false);
				w.banners.setFocus(false);
				w.headerMosaics.setFocus(true);
				w.headerLegendMosaics.setFocus(true);
			this.client.unlock();
		}
		else if(this.dir == "right"){
			this.client.lock();
			w.cols.speed = 300;
			w.banners.speed = 300;
			w.channelList.setData(this.allCurrentChannels);
			w.first.setData(this.firstChannel);
			w.last.setData(this.lastChannel);
			w.headerMosaics.setData(this.allMosaics,this.index);
			w.headerLegendMosaics.setData(this.allMosaics,this.index);
			w.cols.updateData(this.currentM);
			w.firstCol.setData([this.firstChannelM]);
			w.firstColWhite.setData();
			w.banners.setData(this.banners);
				w.headerMosaics.stateChange("enter");
				w.headerLegendMosaics.stateChange("enter_2");
				w.channelList.stateChange("enter");
				w.first.stateChange("enter");
				w.banners.stateChange("enter");	
				w.firstCol.stateChange("enter");
				w.firstColWhite.stateChange("exit");			
				w.cols.stateChange("enter_2");
				w.leftArrowC.stateChange("enter");
				w.rightArrowC.stateChange("enter");
				w.leftArrowL.stateChange("enter");
				w.rightArrowL.stateChange("enter");
				w.leftArrowC.setFocus(false);
				w.rightArrowC.setFocus(false);
				w.leftArrowL.setFocus(false);
				w.rightArrowL.setFocus(false);
				w.cols.setFocus(false);
				w.firstCol.setFocus(false);
				w.banners.setFocus(false);
				w.headerMosaics.setFocus(true);
				w.headerLegendMosaics.setFocus(true);
			this.client.unlock();	
		}
		break;
		
		//LISTA MOSAICOS
		case 0:
		if(this.dir == "left"){
		this.client.lock();	
			w.cols.speed = 300;
			w.firstCol.speed = 300;
			w.banners.speed = 300;
			w.headerMosaics.setData(this.allMosaics,this.index);
			w.headerLegendMosaics.setData(this.allMosaics,this.index);
			w.cols.updateData(this.currentM);
			w.firstCol.setData([this.firstChannelM]);
			w.firstColWhite.setData();
			w.channelList.setData(this.allCurrentChannels);
			w.first.setData(this.firstChannel);
			w.last.setData(this.lastChannel);
			w.banners.setData(this.banners);
				w.headerMosaics.stateChange("enter");
				w.headerLegendMosaics.stateChange("enter_2");
				w.cols.stateChange("enter_2");
				w.firstCol.stateChange("enter");
				w.channelList.stateChange("enter");
				w.first.stateChange("enter");
				w.banners.stateChange("enter");
				w.leftArrowC.stateChange("enter");
				w.rightArrowC.stateChange("enter");
				w.leftArrowL.stateChange("enter");
				w.rightArrowL.stateChange("enter");
				w.leftArrowC.setFocus(false);
				w.rightArrowC.setFocus(false);
				w.leftArrowL.setFocus(false);
				w.rightArrowL.setFocus(false);
				w.cols.focusIndex = 4;
				w.headerMosaics.setFocus(false);
				w.headerLegendMosaics.setFocus(false);
				w.banners.setFocus(false);
				w.cols.setFocus(true);
				w.firstCol.setFocus(false);
		this.client.unlock();	
		}
		else if(this.dir == "right"){
				if(w.cols.selectIndex == 5){
					this.client.lock();
						w.cols.speed = 300;
						w.firstCol.speed = 300;
						w.banners.speed = 300;
						w.cols.updateData(this.currentM);
						w.firstCol.setData([this.firstChannelM]);
						w.firstColWhite.setData();
						w.headerMosaics.setData(this.allMosaics,this.index);
						w.headerLegendMosaics.setData(this.allMosaics,this.index);
						w.channelList.setData(this.allCurrentChannels);	
						w.first.setData(this.firstChannel);
						w.last.setData(this.lastChannel);
						w.banners.setData(this.banners);
							w.headerMosaics.stateChange("enter");
							w.headerLegendMosaics.stateChange("enter_2");
							w.cols.stateChange("enter_2");
							w.firstCol.stateChange("enter");
							w.firstColWhite.stateChange("exit");
							w.channelList.stateChange("enter");
							w.first.stateChange("enter");
							w.banners.stateChange("enter");
							w.leftArrowC.stateChange("enter");
							w.rightArrowC.stateChange("enter");
							w.leftArrowL.stateChange("enter");
							w.rightArrowL.stateChange("enter");
							w.leftArrowC.setFocus(false);
							w.rightArrowC.setFocus(false);
							w.leftArrowL.setFocus(false);
							w.rightArrowL.setFocus(false);
							w.headerMosaics.setFocus(false);
							w.headerLegendMosaics.setFocus(false);
							w.cols.setFocus(false);
							w.firstCol.setFocus(false);
							this.six = true;
					this.client.unlock();
				}
				//NO ES INDEX 6
				else{	
			this.client.lock();
				w.cols.speed = 300;
				w.firstCol.speed = 300;
				w.firstCol.setData([this.firstChannelM]);
				w.firstColWhite.setData();
				w.cols.updateData(this.currentM);
				w.headerMosaics.setData(this.allMosaics,this.index);
				w.headerLegendMosaics.setData(this.allMosaics,this.index);
				w.channelList.setData(this.allCurrentChannels);
				w.first.setData(this.firstChannel);
				w.last.setData(this.lastChannel);
				w.banners.setData(this.banners);	
					w.headerMosaics.stateChange("enter");
					w.headerLegendMosaics.stateChange("enter_2");
					w.cols.stateChange("enter_2");
					w.firstCol.stateChange("enter");
					w.firstColWhite.stateChange("enter");
					w.channelList.stateChange("enter");
					w.first.stateChange("enter");
					w.banners.stateChange("enter");
					w.leftArrowC.stateChange("enter");
					w.rightArrowC.stateChange("enter");
					w.leftArrowL.stateChange("enter");
					w.rightArrowL.stateChange("enter");
					w.leftArrowC.setFocus(false);
					w.rightArrowC.setFocus(false);
					w.leftArrowL.setFocus(false);
					w.rightArrowL.setFocus(false);
					w.headerMosaics.setFocus(false);
					w.headerLegendMosaics.setFocus(false);
					w.cols.setFocus(false);
					w.firstCol.setFocus(true);
			this.client.unlock();	
				}
		}else if(this.dir == ""){
		this.client.lock();
			w.headerMosaics.setData(this.allMosaics,this.index);
			w.headerLegendMosaics.setData(this.allMosaics,this.index);
			w.firstCol.setData([this.firstChannelM]);
			w.firstColWhite.setData();
			w.cols.updateData(this.currentM);
			w.channelList.setData(this.allCurrentChannels);
			w.first.setData(this.firstChannel);
			w.last.setData(this.lastChannel);
				w.headerMosaics.stateChange("enter");
				w.headerLegendMosaics.stateChange("enter");
				w.channelList.stateChange("enter");
				w.first.stateChange("enter");
				w.firstCol.stateChange("enter");
				w.firstColWhite.stateChange("enter");
				w.cols.stateChange("enter");
				w.leftArrowC.stateChange("enter");
				w.rightArrowC.stateChange("enter");
				w.leftArrowL.stateChange("enter");
				w.rightArrowL.stateChange("enter");
				w.leftArrowC.setFocus(false);
				w.rightArrowC.setFocus(false);
				w.leftArrowL.setFocus(false);
				w.rightArrowL.setFocus(false);
				w.channelList.setFocus(false);
				w.headerMosaics.setFocus(false);
				w.headerLegendMosaics.setFocus(false);
				w.firstCol.setFocus(true);
				w.cols.setFocus(false);
			this.client.unlock();
		}
		break;
		
		case "l":
		if(this.dir == "left"){
		this.client.lock();	
		w.cols.speed = 300;
		w.firstCol.speed = 300;
		w.banners.speed = 300;
		w.headerMosaics.setData(this.allMosaics,this.index);
		w.headerLegendMosaics.setData(this.allMosaics,this.index);
		w.cols.updateData(this.currentM);
		w.firstCol.setData([this.firstChannelM]);
		w.firstColWhite.setData();
		w.channelList.setData(this.allCurrentChannels);
		w.first.setData(this.firstChannel);
		w.last.setData(this.lastChannel);
		w.banners.setData(this.banners);
			w.headerMosaics.stateChange("enter");
			w.headerLegendMosaics.stateChange("enter_2");
			w.cols.stateChange("enter_2");
			w.firstCol.stateChange("enter");
			w.firstColWhite.stateChange("exit");
			w.channelList.stateChange("enter");
			w.first.stateChange("enter");
			w.banners.stateChange("enter");
			w.leftArrowC.stateChange("enter");
			w.rightArrowC.stateChange("enter");
			w.leftArrowL.stateChange("enter");
			w.rightArrowL.stateChange("enter");
			w.leftArrowC.setFocus(false);
			w.rightArrowC.setFocus(false);
			w.leftArrowL.setFocus(false);
			w.rightArrowL.setFocus(false);
			w.cols.focusIndex = 2;
			w.headerMosaics.setFocus(false);
			w.headerLegendMosaics.setFocus(false);
			w.banners.setFocus(false);
			w.firstCol.setFocus(false);
			w.cols.setFocus(true);
			this.col = 0;
		this.client.unlock();	
		}
		else if(this.dir == "right"){
			this.client.lock();
				w.cols.speed = 300;
				w.firstCol.speed = 300;
				w.cols.updateData(this.currentM);
				w.firstCol.setData([this.firstChannelM]);
				w.firstColWhite.setData();
				w.headerMosaics.setData(this.allMosaics,this.index);
				w.headerLegendMosaics.setData(this.allMosaics,this.index);
				w.channelList.setData(this.allCurrentChannels);
				w.first.setData(this.firstChannel);
				w.last.setData(this.lastChannel);
				w.banners.setData(this.banners);	
					w.headerMosaics.stateChange("enter");
					w.headerLegendMosaics.stateChange("enter_2");
					w.cols.stateChange("enter_2");
					w.firstCol.stateChange("enter");
					w.firstColWhite.stateChange("enter");
					w.channelList.stateChange("enter");
					w.first.stateChange("enter");
					w.banners.stateChange("enter");
					w.leftArrowC.stateChange("enter");
					w.rightArrowC.stateChange("enter");
					w.leftArrowL.stateChange("enter");
					w.rightArrowL.stateChange("enter");
					w.leftArrowC.setFocus(false);
					w.rightArrowC.setFocus(false);
					w.leftArrowL.setFocus(false);
					w.rightArrowL.setFocus(false);
					w.headerMosaics.setFocus(false);
					w.headerLegendMosaics.setFocus(false);
					w.cols.setFocus(false);
					w.firstCol.setFocus(true);
			this.client.unlock();	
		}else if(this.dir == ""){
		this.client.lock();
			w.headerMosaics.setData(this.allMosaics,this.index);
			w.headerLegendMosaics.setData(this.allMosaics,this.index);
			w.cols.updateData(this.currentM);
			w.firstCol.setData([this.firstChannelM]);
			w.firstColWhite.setData();
			w.channelList.setData(this.allCurrentChannels);
			w.first.setData(this.firstChannel);
			w.last.setData(this.lastChannel);
				w.headerMosaics.stateChange("enter");
				w.headerLegendMosaics.stateChange("enter");
				w.channelList.stateChange("enter");
				w.first.stateChange("enter");
				w.cols.stateChange("enter");
				w.firstCol.stateChange("enter");
				w.firstColWhite.stateChange("enter");
				w.leftArrowC.stateChange("enter");
				w.rightArrowC.stateChange("enter");
				w.leftArrowL.stateChange("enter");
				w.rightArrowL.stateChange("enter");
				w.leftArrowC.setFocus(false);
				w.rightArrowC.setFocus(false);
				w.leftArrowL.setFocus(false);
				w.rightArrowL.setFocus(false);
				w.channelList.setFocus(false);
				w.headerMosaics.setFocus(false);
				w.headerLegendMosaics.setFocus(false);
				w.firstCol.setFocus(true);
				w.cols.setFocus(false);
			this.client.unlock();
		}
		break;
		
		
		
		//LISTA CANALES DEL MOSAICO
		case "n":
		if(this.dir == "left"){
		this.client.lock();
		w.cols.speed = 300;
		w.firstCol.speed = 300;
		w.banners.speed = 300;
		w.headerMosaics.setData(this.allMosaics,this.index);
		w.headerLegendMosaics.setData(this.allMosaics,this.index);
		w.channelList.setData(this.allCurrentChannels, this.allCurrentChannels.length-8);
		w.channelList.focusIndex = 9;
		w.first.setData(this.firstChannel);
		w.last.setData(this.lastChannel);
		w.firstCol.setData([this.firstChannelM]);
		w.firstColWhite.setData();
		w.cols.updateData(this.currentM);
		w.banners.setData(this.banners);
			w.headerMosaics.stateChange("enter");
			w.headerLegendMosaics.stateChange("enter_2");
			w.channelList.stateChange("enter");
			w.last.stateChange("enter");
			w.banners.stateChange("enter");
			w.firstCol.stateChange("enter");
			w.firstColWhite.stateChange("exit");
			w.cols.stateChange("enter_2");
			w.leftArrowC.stateChange("enter");
			w.rightArrowC.stateChange("enter");
			w.leftArrowL.stateChange("enter");
			w.rightArrowL.stateChange("enter");
			w.leftArrowC.setFocus(false);
			w.rightArrowC.setFocus(false);
			w.leftArrowL.setFocus(false);
			w.rightArrowL.setFocus(false);
			w.cols.setFocus(false);
			w.firstCol.setFocus(false);
			w.banners.setFocus(false);
			w.headerMosaics.setFocus(false);
			w.headerLegendMosaics.setFocus(false);
			w.channelList.setFocus(true);
		this.client.unlock();
		}
		else if(this.dir == "right"){
		this.client.lock();
		w.cols.speed = 300;
		w.firstCol.speed = 300;
		w.banners.speed = 300;
		w.headerMosaics.setData(this.allMosaics,this.index);
		w.headerLegendMosaics.setData(this.allMosaics,this.index);
		w.channelList.setData(this.allCurrentChannels);
		w.first.setData(this.firstChannel);
		w.last.setData(this.lastChannel);
		w.cols.updateData(this.currentM);
		w.firstCol.setData([this.firstChannelM]);
		w.firstColWhite.setData();
		w.banners.setData(this.banners);
			w.headerMosaics.stateChange("enter");
			w.headerLegendMosaics.stateChange("enter_2");
			w.channelList.stateChange("enter");
			w.first.stateChange("enter");
			w.cols.stateChange("enter_2");
			w.firstCol.stateChange("enter");
			w.firstColWhite.stateChange("exit");
			w.banners.stateChange("enter");	
			w.leftArrowC.stateChange("enter");
			w.rightArrowC.stateChange("enter");
			w.leftArrowL.stateChange("enter");
			w.rightArrowL.stateChange("enter");
			w.leftArrowC.setFocus(false);
			w.rightArrowC.setFocus(false);
			w.leftArrowL.setFocus(false);
			w.rightArrowL.setFocus(false);		
			w.cols.setFocus(false);
			w.firstCol.setFocus(false);
			w.headerMosaics.setFocus(false);
			w.headerLegendMosaics.setFocus(false);
			w.channelList.setFocus(true);
			w.banners.setFocus(false);
		this.client.unlock();	
		}
		break;
	case "b":
	this.client.lock();	
		w.cols.speed = 300;
		w.banners.speed = 300;
		w.firstCol.speed = 300;
		w.headerMosaics.setData(this.allMosaics,this.index);
		w.headerLegendMosaics.setData(this.allMosaics,this.index);
		w.firstCol.setData([this.firstChannelM]);
		w.firstColWhite.setData();
		w.cols.updateData(this.currentM);
		w.channelList.setData(this.allCurrentChannels);
		w.first.setData(this.firstChannel);
		w.last.setData(this.lastChannel);
		w.headerMosaics.setData(this.allMosaics,i);
		w.banners.setData(this.banners);
			w.headerMosaics.stateChange("enter");
			w.headerLegendMosaics.stateChange("enter_2");
			w.firstCol.stateChange("enter");
			w.firstColWhite.stateChange("exit");
			w.cols.stateChange("enter_2");
			w.channelList.stateChange("enter");
			w.first.stateChange("enter");
			w.banners.stateChange("enter");
			w.leftArrowC.stateChange("enter");
			w.rightArrowC.stateChange("enter");
			w.leftArrowL.stateChange("enter");
			w.rightArrowL.stateChange("enter");
			w.leftArrowC.setFocus(false);
			w.rightArrowC.setFocus(false);
			w.leftArrowL.setFocus(false);
			w.rightArrowL.setFocus(false);
			w.cols.focusIndex = 5;
			w.cols.scrollTo(5);
			w.headerMosaics.setFocus(false);
			w.banners.setFocus(false);
			w.headerLegendMosaics.setFocus(false);
			w.cols.setFocus(true);
			w.firstCol.setFocus(false);
			this.col = 0;
		this.client.unlock();	
	
	break;	
		}
			if(this.six == true){
					if(this.banners.length >0){
						this.lock = true;
						w.banners.setFocus(true);
						this.col = "b";
						this.dir = "";
						this.six = "";
					}
					else{
						w.cols.speed = 0;
						w.cols.scrollTo(2);
						w.cols.setFocus(true);
						this.col = 0;
						this.dir = "";
						this.six = "";
					}	
			}
			else{
				this.dir = "";
				this.six = "";
			}
}

mosaic.prototype.reEnterMosaics = function reEnterMosaics(){
		var w = this.widgets;
		this.home.setPlayerStatus("STOP");
		for(var i = 0; i<this.allMosaics.length; i++){
			if(this.mosaicNumber == this.allMosaics[i].MosaicVO.channelMosaic.ChannelVO.number){
			this.index = i;
			this.url = this.allMosaics[this.index].MosaicVO.channelMosaic.ChannelVO.url;
			this.banners = this.allMosaics[this.index].MosaicVO.arrayBanners;
			break;
			}
		}
		
	switch(this.col){
		//HEADER MOSAICOS
		case "h":
		if(this.dir == "left"){
		this.client.lock();
			w.cols.speed = 300;
			w.banners.speed = 300;
			w.firstCol.speed = 300;
			w.firstCol.stateChange("exit_l");
			w.firstColWhite.stateChange("exit");
			w.cols.stateChange("exit_l");
			w.channelList.stateChange("exit_l");
			w.first.stateChange("exit_l");
			w.last.stateChange("exit_l");
			w.banners.stateChange("exit_l");
			w.headerMosaics.stateChange("exit");
			w.headerLegendMosaics.stateChange("exit_l");
			w.leftArrowC.stateChange("exit");
			w.rightArrowC.stateChange("exit");
			w.leftArrowL.stateChange("exit");
			w.rightArrowL.stateChange("exit");
		this.client.unlock();	
		}
		else if(this.dir == "right"){
			this.client.lock();
				w.cols.speed = 300;
				w.banners.speed = 300;
				w.firstCol.speed = 300;
				w.firstCol.stateChange("exit_r");
				w.firstColWhite.stateChange("exit");
				w.cols.stateChange("exit_r");
				w.channelList.stateChange("exit_r");
				w.first.stateChange("exit_r");
				w.last.stateChange("exit_r");
				w.banners.stateChange("exit_r");
				w.headerMosaics.stateChange("exit");
				w.headerLegendMosaics.stateChange("exit_r");
				w.leftArrowC.stateChange("exit");
				w.rightArrowC.stateChange("exit");
				w.leftArrowL.stateChange("exit");
				w.rightArrowL.stateChange("exit");
			this.client.unlock();	
		}
		break;
		
		case "l":
			if(this.dir == "left"){
				this.client.lock();	
					w.cols.speed = 300;
					w.firstCol.speed = 300;
					w.banners.speed = 300;
					w.cols.stateChange("exit_l");
					w.firstCol.stateChange("exit_l");
					w.firstColWhite.stateChange("exit");
					w.channelList.stateChange("exit_l");
					w.first.stateChange("exit_l");
					w.last.stateChange("exit_l");
					w.banners.stateChange("exit_l");
					w.headerMosaics.stateChange("exit");
					w.headerLegendMosaics.stateChange("exit_l");
					w.leftArrowC.stateChange("exit");
					w.rightArrowC.stateChange("exit");
					w.leftArrowL.stateChange("exit");
					w.rightArrowL.stateChange("exit");
				this.client.unlock();	
		}
		else if(this.dir == "right"){
			this.client.lock();
				w.cols.speed = 300;	
				w.firstCol.speed = 300;
				w.banners.speed = 300;
				w.firstCol.stateChange("exit_r");
				w.firstColWhite.stateChange("exit");
				w.cols.stateChange("exit_r");
				w.channelList.stateChange("exit_r");
				w.first.stateChange("exit_r");
				w.last.stateChange("exit_r");
				w.banners.stateChange("exit_r");
				w.headerMosaics.stateChange("exit");
				w.headerLegendMosaics.stateChange("exit_r");
				w.leftArrowC.stateChange("exit");
				w.rightArrowC.stateChange("exit");
				w.leftArrowL.stateChange("exit");
				w.rightArrowL.stateChange("exit");
			this.client.unlock();
		}
		break;
		//LISTA MOSAICOS
		case 0:
		if(this.dir == "left"){
			this.client.lock();	
			w.cols.speed = 300;
			w.firstCol.speed = 300;
			w.banners.speed = 300;
			w.firstCol.stateChange("exit_l");
			w.firstColWhite.stateChange("exit");
			w.cols.stateChange("exit_l");
			w.channelList.stateChange("exit_l");
			w.first.stateChange("exit_l");
			w.last.stateChange("exit_l");
			w.banners.stateChange("exit_l");
			w.headerMosaics.stateChange("exit");
			w.headerLegendMosaics.stateChange("exit_l");
			w.leftArrowC.stateChange("exit");
			w.rightArrowC.stateChange("exit");
			w.leftArrowL.stateChange("exit");
			w.rightArrowL.stateChange("exit");
			this.client.unlock();	
		}
		else if(this.dir == "right"){
			this.client.lock();
				w.cols.speed = 300;	
				w.banners.speed = 300;
				w.firstCol.speed = 300;
				w.firstCol.stateChange("exit_r");
				w.firstColWhite.stateChange("exit");
				w.cols.stateChange("exit_r");
				w.channelList.stateChange("exit_r");
				w.first.stateChange("exit_r");
				w.last.stateChange("exit_r");
				w.banners.stateChange("exit_r");
				w.headerMosaics.stateChange("exit");
				w.headerLegendMosaics.stateChange("exit_r");
				w.leftArrowC.stateChange("exit");
				w.rightArrowC.stateChange("exit");
				w.leftArrowL.stateChange("exit");
				w.rightArrowL.stateChange("exit");
			this.client.unlock();
		}
		break;
		
		//LISTA CANALES DEL MOSAICO
		case "n":
		if(this.dir == "left"){
		this.client.lock();
			w.cols.speed = 300;
			w.banners.speed = 300;
			w.firstCol.speed = 300;
			w.firstCol.stateChange("exit_l");
			w.firstColWhite.stateChange("exit");
			w.cols.stateChange("exit_l");
			w.channelList.stateChange("exit_l");
			w.first.stateChange("exit_l");
			w.last.stateChange("exit_l");
			w.banners.stateChange("exit_l");
			w.headerMosaics.stateChange("exit");
			w.headerLegendMosaics.stateChange("exit_l");
			w.leftArrowC.stateChange("exit");
			w.rightArrowC.stateChange("exit");
			w.leftArrowL.stateChange("exit");
			w.rightArrowL.stateChange("exit");
		this.client.unlock();
		}
		else if(this.dir == "right"){
		this.client.lock();
			w.cols.speed = 300;
			w.banners.speed = 300;
			w.firstCol.speed = 300;
			w.firstCol.stateChange("exit_r");
			w.firstColWhite.stateChange("exit");
			w.cols.stateChange("exit_r");
			w.channelList.stateChange("exit_r");
			w.first.stateChange("exit_r");
			w.last.stateChange("exit_r");
			w.banners.stateChange("exit_r");
			w.headerMosaics.stateChange("exit");
			w.headerLegendMosaics.stateChange("exit_r");
			w.leftArrowC.stateChange("exit");
			w.rightArrowC.stateChange("exit");
			w.leftArrowL.stateChange("exit");
			w.rightArrowL.stateChange("exit");
		this.client.unlock();	
		}
		break;
	case "b":
	this.client.lock();	
		w.cols.speed = 300;
		w.banners.speed = 300;
		w.firstCol.speed = 300;
		w.firstCol.stateChange("exit_l");
		w.firstColWhite.setData();
		w.firstColWhite.stateChange("exit");
		w.cols.stateChange("exit_l");
		w.channelList.stateChange("exit_l");
		w.first.stateChange("exit_l");
		w.last.stateChange("exit_l");
		w.banners.stateChange("exit_l");
		w.headerMosaics.stateChange("exit");
		w.headerLegendMosaics.stateChange("exit_l");
		w.leftArrowC.stateChange("exit");
		w.rightArrowC.stateChange("exit");
		w.leftArrowL.stateChange("exit");
		w.rightArrowL.stateChange("exit");
	this.client.unlock();	
	
	break;	
		}
		
		//SEÑAL DEL MOSAICO
		this.home.showHeader({"section":"mosaic","simple": false,"fill": "rgba(0,0,0,0)"});
	    //this.home.playVideo(this.url,"MOSAIC");
	    if(this.url == "" || this.url == undefined){
	    //NGM.dump(this.mosaicNumber);
			switch(this.mosaicNumber){
				case 6:
				case 100:
				case "6":
				case "100":
					var bg = "img/tv/mosaics/100-TvAbierta.jpg"; 
				break;
				
				case 200:
				case "200":
					var bg = "img/tv/mosaics/200-Entretenimiento.jpg";
				break;
				
				case 300:
				case "300":
					var bg = "img/tv/mosaics/300-Infantil.jpg";
				break;
				
				case 350:
				case "350":
					var bg = "img/tv/mosaics/350-MundoyCultura.jpg";
				break;
				
				case 400:
				case "400":
					var bg = "img/tv/mosaics/400-Cine.jpg";
				break;
				
				case 500:
				case "500":
					var bg = "img/tv/mosaics/500-Deportes.jpg";
				break;
				
				case 600:
				case "600":
					var bg = "img/tv/mosaics/600-Noticias.jpg";
				break;
				
				case 650:
				case "650":
					var bg = "img/tv/mosaics/650-Internacionales.jpg";
				break;
			
				case 700:
				case "700":
					var bg = "img/tv/mosaics/700-Musica.jpg";
				break;
			}
			this.home.setBg(bg);
			w.noMosaics.setData({"text1":"Por el momento no están disponibles los mosaicos.","text2":"Vuelve más tarde."});
			w.noMosaics.stateChange("enter");
			this.col = "nm";
		}
		else{
	    	this.home.playVideo(this.url,"MOSAIC");		
		}
		//MOSAICO ACTUAL CON CANALES DE LISTAS
		
}

mosaic.prototype.onKeyPress = function onKeyPress( _key ){
	if(this.keyAvailable){
		var w = this.widgets;
		switch(_key){
			case "KEY_TV_0":
			case "KEY_TV_1":
			case "KEY_TV_2":
			case "KEY_TV_3":
			case "KEY_TV_4":
			case "KEY_TV_5":
			case "KEY_TV_6":
			case "KEY_TV_7":
			case "KEY_TV_8":
			case "KEY_TV_9":	 
			if(this.col == "s"){
				
			}
			else{	 
		    	this.number = this.setNumber(_key.substr(_key.length-1,1));
		    		this.chb = true;
		    	}	
				break;
				
				case "KEY_TV_CHNL_UP":
			    case "KEY_TV_CHNL_UP_LONG":
			    case "KEY_TV_CHNL_DOWN":
			    case "KEY_TV_CHNL_DOWN_LONG":
			    if(this.col == "s"){
			    
			    }
			    else{					
					this.home.closeAll(this);
					this.home.onKeyPressHome(_key);		
					}
		    	break;
		    	
		    	case "KEY_IRENTER":
		    	if(this.chb == true){
		    	}
		    	else{
			    	if(this.col == "h"){}
			    	else if(this.col == "b"){
			    		this.home.closeSection(this);	
			    		this.home.openLink(w.banners.selectItem.ItemVO.link,"mosaic", 3);
			    	}else if(this.col == "s"){
			    			this.home.onKeyPress(_key);
			    	}
			    	else if(this.col == "nm"){
			    	}
			    	else{
						this.goToMosaic();
					}
				}
				break;
				
				case "KEY_LEFT":
				if(!this.chb){
					if(this.dir =="left"){
					}else{
						this.moveLeft();
					}
					if(this.col == "s"){
						this.home.onKeyPress(_key);
					}
				}	
				break;
				
				
				case "KEY_RIGHT":
				if(!this.chb){
					if(this.dir =="right"){
					}
					else{
					this.moveRight();
					
					}
					if(this.col == "s"){
						this.home.onKeyPress(_key);
					}
				}	
				break;
				
				case "KEY_UP":
				if(!this.chb)
					this.moveUp();
				break;
				
				case "KEY_DOWN":
				if(!this.chb)
					this.moveDown();
				break;
				/*
				case "KEY_TV_RED":
		    		this.formOpenChild("previews", {"home":this}, true);
		    	break;*/
		    	
		    	case "KEY_IRBACK":
		    	case "KEY_MENU":
		    		if(this.col == "s"){
		    			this.col = "h";
						this.home.disableSearchHeader();
						w.headerMosaics.setFocus(true);
		    		}
		    	break;
			}
		}	
	return true;
}

mosaic.prototype.goToMosaic = function goToMosaic(){
	var w = this.widgets;
	if(this.col==0){
		var data = w.cols.selectItem.ChannelVO.number;  
   }
   else if(this.col == "n"){
   		var data = w.channelList.selectItem.ChannelVO.number;
   }else if(this.col == "l"){	
   		var data = w.firstCol.selectItem.ChannelVO.number;
   }
//AQUI HACE EL TUNEIN POR ENTER EN CUALQUIER MOSAICO
this.home.closeSection(this);	 
this.home.tuneInByNumber(data*1);
}

mosaic.prototype.setNumber = function setNumber(_num){	
	var widgets = this.widgets;
	tpng.app.channelNumber = tpng.app.channelNumber + _num;
	if(tpng.app.channelNumber.length <= 3){

		this.showChannelBar(tpng.app.channelNumber);
		var timer = tpng.app.channelNumber.length < 3 ? 3000 : 1000;
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){
		
			var index = this.home.findChannelIndex(tpng.app.channelNumber,tpng.app.channelList);
		
			this.home.objectChild = null;
			this.home.closeAll(this);
			//this.home.closeSection(this);
			//if(this.home.widgets.mainBg.stateGet()=="enter")
				//this.home.hideBg(); 
			this.home.tuneInByNumber(tpng.app.channelList[index].ChannelVO.number*1,true,true,true);
		}.bind(this), timer);
		//clearTimeout(this.timerExit);
		//this.timerExit = setTimeout(function(){this.home.closeSection(this); this.home.objectChild = null;}.bind(this), timer);
				
	}
	
}

mosaic.prototype.showChannelBar = function showChannelBar(_num){
	var w = this.widgets.channelNumberBar;
		w.setData({"number": _num});
		w.stateChange("enter");
		w.refresh();
}


mosaic.prototype.moveLeft = function moveLeft(){	
	var w = this.widgets;
	switch(this.col){
	
	case "h":
	w.headerMosaics.scrollPrev();
	for(var i = 0; i<this.allMosaics.length; i++){
				if(this.allMosaics[i].MosaicVO.channelMosaic.ChannelVO.number == this.mosaicNumber){
					if(i == 0){
					this.mosaicNumber = this.allMosaics[this.allMosaics.length-1].MosaicVO.channelMosaic.ChannelVO.number;
					break;
					}
					else{
					this.mosaicNumber = this.allMosaics[i-1].MosaicVO.channelMosaic.ChannelVO.number
					break;
					 }
				}
			}
		this.dir = "left";	
		this.lock = true;
		clearTimeout(this.timeInfoSpeed);
		this.timeInfoSpeed = setTimeout(function(){	
			this.reEnterMosaics();
		}.bind(this), 500);	
	break;
	
	case "l":
	for(var i = 0; i<this.allMosaics.length; i++){
			if(this.allMosaics[i].MosaicVO.channelMosaic.ChannelVO.number == this.mosaicNumber){
				if(i == 0){
				this.mosaicNumber = this.allMosaics[this.allMosaics.length-1].MosaicVO.channelMosaic.ChannelVO.number;
				break;
				}
				else{
				this.mosaicNumber = this.allMosaics[i-1].MosaicVO.channelMosaic.ChannelVO.number
				break;
				 }
			}
		}
		this.dir = "left";
		this.col = 0;
		this.lock = true;
		clearTimeout(this.timeInfoSpeed);
		this.timeInfoSpeed = setTimeout(function(){
			this.reEnterMosaics()
		}.bind(this), 500);
	break;
	
	
	case 0:
		if(w.cols.selectIndex == 0 || w.cols.selectIndex == 1){
			this.col = "l";
			w.cols.setFocus(true);
			w.cols.setFocus(false);
			w.firstCol.setFocus(true);
			w.firstColWhite.stateChange("enter");
		}
		else if(w.cols.selectIndex == 2){
				if(this.banners.length == 0){
						w.firstCol.setFocus(true);
						w.firstColWhite.setData();
						w.firstColWhite.stateChange("enter");
						w.cols.setFocus(false);
						this.col = "l";
				}
				else{
						w.banners.scrollTo(w.banners.list.length-1);
						w.cols.setFocus(false);
						w.banners.setFocus(true);
						this.col = "b";
				}
		}
		else if(w.cols.selectIndex == 3){ 
			w.cols.speed = 0;
			w.cols.scrollPrev();
			w.cols.scrollPrev();
			w.cols.scrollPrev();
			//w.cols.scrollTo(0);
		}
		else if(w.cols.selectIndex == 4){
			w.cols.speed = 0;
			w.cols.scrollPrev();
			w.cols.scrollPrev();
			w.cols.scrollPrev();
			//w.cols.scrollTo(1);
		}
		else if(w.cols.selectIndex == 5){
			w.cols.speed = 0;
			w.cols.scrollPrev();
			w.cols.scrollPrev();
			w.cols.scrollPrev();
			//w.cols.scrollTo(2);
		}
	break;
	
	case "n":
	w.channelList.speed = 200;
	if(w.channelList.scrollPrev()){
		if(w.channelList.selectIndex == 0){
		w.first.stateChange("enter");
		}
		if(w.channelList.selectIndex == w.channelList.list.length-9){
		w.last.stateChange("exit");
		}
	}
	else{
	for(var i = 0; i<this.allMosaics.length; i++){
				if(this.allMosaics[i].MosaicVO.channelMosaic.ChannelVO.number == this.mosaicNumber){
					if(i == 0){
					this.mosaicNumber = this.allMosaics[this.allMosaics.length-1].MosaicVO.channelMosaic.ChannelVO.number;
					break;
					}
					else{
					this.mosaicNumber = this.allMosaics[i-1].MosaicVO.channelMosaic.ChannelVO.number
					break;
					 }
				}
			}
		this.dir = "left";
		this.lock = true;
		clearTimeout(this.timeInfoSpeed);	
		this.timeInfoSpeed = setTimeout(function(){	
			this.reEnterMosaics()
		}.bind(this), 500);
	}
	break;
	case "b":
	w.banners.speed = 300;
	if(w.banners.scrollPrev()){}
	else{
	for(var i = 0; i<this.allMosaics.length; i++){
			if(this.allMosaics[i].MosaicVO.channelMosaic.ChannelVO.number == this.mosaicNumber){
				if(i == 0){
				this.mosaicNumber = this.allMosaics[this.allMosaics.length-1].MosaicVO.channelMosaic.ChannelVO.number;
				break;
				}
				else{
				this.mosaicNumber = this.allMosaics[i-1].MosaicVO.channelMosaic.ChannelVO.number
				break;
				 }
			}
		}
		this.dir = "left";
		this.lock = true;
		clearTimeout(this.timeInfoSpeed);	
		this.timeInfoSpeed = setTimeout(function(){
			this.reEnterMosaics()
		}.bind(this), 500);	
	}	
	break;
	}
}

mosaic.prototype.moveRight = function moveRight(){
	var w = this.widgets;

	switch(this.col){
	case "h":
	w.headerMosaics.scrollNext();
	for(var i = 0; i<this.allMosaics.length; i++){
				if(this.allMosaics[i].MosaicVO.channelMosaic.ChannelVO.number == this.mosaicNumber){
					if(i == this.allMosaics.length-1){
					this.mosaicNumber = this.allMosaics[0].MosaicVO.channelMosaic.ChannelVO.number;
					break;
					}
					else{
					this.mosaicNumber = this.allMosaics[i+1].MosaicVO.channelMosaic.ChannelVO.number;
					break;
					 }
				}
			}
			this.dir = "right";
			this.lock = true;
			clearTimeout(this.timeInfoSpeed);	
		this.timeInfoSpeed = setTimeout(function(){
			this.reEnterMosaics();	
		}.bind(this), 500);		
	break;
	
	case "l":
		w.firstCol.setFocus(false);
		w.firstColWhite.stateChange("exit");
		w.cols.speed = 0;
		w.cols.scrollTo(0);
		w.cols.setFocus(true);
		this.col = 0;
	break;
	
	case 0:
		if(w.cols.selectIndex == 0){
			w.cols.speed = 0;
			w.cols.scrollNext();
			w.cols.scrollNext();
			w.cols.scrollNext();
			//w.cols.scrollTo(3);
		}
		else if(w.cols.selectIndex == 1){
			w.cols.speed = 0;
			w.cols.scrollNext();
			w.cols.scrollNext();
			w.cols.scrollNext();
			//w.cols.scrollTo(4);
		}
		else if(w.cols.selectIndex == 2){
			w.cols.speed = 0;
			w.cols.scrollNext();
			w.cols.scrollNext();
			w.cols.scrollNext();
			//w.cols.scrollTo(5);
		}
		else if(w.cols.selectIndex == 3 || w.cols.selectIndex == 4 || w.cols.selectIndex == 5){
			for(var i = 0; i<this.allMosaics.length; i++){
				if(this.allMosaics[i].MosaicVO.channelMosaic.ChannelVO.number == this.mosaicNumber){
					if(i == this.allMosaics.length-1){
						this.mosaicNumber = this.allMosaics[0].MosaicVO.channelMosaic.ChannelVO.number;
					break;
					}
					else{
						this.mosaicNumber = this.allMosaics[i+1].MosaicVO.channelMosaic.ChannelVO.number;
					break;
					 }
				}
			}
		this.col = "l";	
		this.lock = true;
		this.dir = "right";
		clearTimeout(this.timeInfoSpeed);	
		this.timeInfoSpeed = setTimeout(function(){
			this.reEnterMosaics();
		}.bind(this), 500);	
		}
	break;
	
	case "n":
	w.channelList.speed = 200;
	if(w.channelList.scrollNext()){
	if(w.channelList.selectIndex == w.channelList.list.length-1){
	w.last.stateChange("enter");
	}
	if(w.channelList.selectIndex == 8){
	w.first.stateChange("exit");
	}
	}
	else{
	for(var i = 0; i<this.allMosaics.length; i++){
				if(this.allMosaics[i].MosaicVO.channelMosaic.ChannelVO.number == this.mosaicNumber){
					if(i == this.allMosaics.length-1){
					this.mosaicNumber = this.allMosaics[0].MosaicVO.channelMosaic.ChannelVO.number;
					break;
					}
					else{
					this.mosaicNumber = this.allMosaics[i+1].MosaicVO.channelMosaic.ChannelVO.number;
					break;
					 }
				}
			}
			this.lock = true;
			this.dir = "right";			
			clearTimeout(this.timeInfoSpeed);	
			this.timeInfoSpeed = setTimeout(function(){
				this.reEnterMosaics();
			}.bind(this), 500);	
	}
	break;
	
	case "b":
	w.banners.speed = 300;
		if(w.banners.scrollNext()){}
		else{
			this.col = 0;
			w.banners.setFocus(false);
			w.cols.scrollTo(2);
			w.cols.setFocus(true);
		}
	break;		
	}
}

mosaic.prototype.moveUp = function moveUp(){
	var w = this.widgets;	
	switch(this.col){
	//COLUMNA IZQUIERDA
		case "l":
		w.firstCol.setFocus(false);
		w.firstColWhite.setData();
		w.firstColWhite.stateChange("exit");
		w.headerMosaics.setFocus(true);
		w.headerLegendMosaics.setFocus(true);
		this.col = "h";
		break;
		
		case 0:
		if(w.cols.selectIndex == 0 || w.cols.selectIndex == 3){
			w.cols.setFocus(true);
			w.cols.setFocus(false);
			w.headerMosaics.setFocus(true);
			w.headerLegendMosaics.setFocus(true);
			this.col = "h";
		}
		else if(w.cols.selectIndex == 1 || w.cols.selectIndex == 2 || w.cols.selectIndex == 4 || w.cols.selectIndex == 5){
			w.cols.scrollPrev();
		}
		break;
		//SI ESTÁ EN LA LISTA DE CANALES
		case "n":
			if(w.channelList.focusIndex == 6 || w.channelList.focusIndex == 7){
				w.channelList.setFocus(false);
				w.cols.speed = 0;
				w.cols.scrollTo(2);
				w.cols.setFocus(true);
				this.col = 0;
			}
			if(w.channelList.focusIndex == 8 || w.channelList.focusIndex == 9){
				w.channelList.setFocus(false);
				w.cols.speed = 0;
				w.cols.scrollTo(5);
				w.cols.setFocus(true);
				this.col = 0;
			}
			if(w.channelList.focusIndex == 5 || w.channelList.focusIndex == 4 || w.channelList.focusIndex == 3 || w.channelList.focusIndex == 2){
				w.channelList.setFocus(false);
				if(this.banners.length > 0){
						w.channelList.setFocus(false);
						
							if(w.channelList.focusIndex == 2 || w.channelList.focusIndex == 3){
								w.banners.scrollTo(0);
								w.banners.setFocus(true);
							}
							if(w.channelList.focusIndex == 4 || w.channelList.focusIndex == 5){
								w.banners.scrollTo(1);
								w.banners.setFocus(true);
							}
					
					
					this.col = "b";
				}
				else{
					w.firstCol.setFocus(true);
					w.firstColWhite.setData();
					w.firstColWhite.stateChange("enter");
					this.col = "l";
				}
			}
		break;
		
		case "b":
			this.col = "l";
			w.banners.setFocus(false);
			w.firstCol.setFocus(true);
			w.firstColWhite.setData();
			w.firstColWhite.stateChange("enter");
		break;
		
		case "h":
			this.col = "s";
			this.home.enableSearchHeader();
			w.headerMosaics.setFocus(false);
		break;
		
	}
}

mosaic.prototype.moveDown = function moveDown(){
	var w = this.widgets;

	switch(this.col){
		//SI ESTÁ EN EL HEADER
		case "s":
			this.col = "h";
			this.home.disableSearchHeader();
			w.headerMosaics.setFocus(true);
		break;
		
		case "h":
			this.col = "l";
			w.firstCol.setFocus(true);
			w.firstColWhite.setData();
			w.firstColWhite.stateChange("enter");
			w.headerMosaics.setFocus(false);
			w.headerLegendMosaics.setFocus(false);
		break;
		
		case "l":
			if(this.banners.length>0){
				this.col = "b";
				w.banners.scrollTo(0);
				w.banners.setFocus(true);
				w.firstCol.setFocus(false);
				w.firstColWhite.setData();
				w.firstColWhite.stateChange("exit");
			}else{
				w.channelList.focusIndex = 2;
				w.firstCol.speed = 0;
				w.firstCol.setFocus(false);
				w.firstColWhite.setData();
				w.firstColWhite.stateChange("exit");
				w.channelList.setFocus(true);
				this.col = "n";
			}
		break;
		
		case 0:
		if(w.cols.selectIndex == 0 || w.cols.selectIndex == 1 || w.cols.selectIndex == 3 || w.cols.selectIndex == 4){
			w.cols.scrollNext();
		}
		else if(w.cols.selectIndex == 2){
				w.channelList.focusIndex = 6;
				w.cols.speed = 0;
				w.cols.setFocus(true);
				w.cols.setFocus(false);
				w.channelList.setFocus(true);
				this.col = "n";
		}
		else if(w.cols.selectIndex == 5){
				w.channelList.focusIndex = 8;
				w.cols.speed = 0;
				w.cols.setFocus(true);
				w.cols.setFocus(false);
				w.channelList.setFocus(true);
				this.col = "n";
		}
		break;
		case "b":
			if(w.banners.selectIndex == 0){w.channelList.focusIndex = 2;}
			if(w.banners.selectIndex == 1){w.channelList.focusIndex = 4;}
			w.banners.setFocus(false);
			w.channelList.setFocus(true);
			this.col = "n";
		break;
	}
}

mosaic.onFocusChannelList = function onFocusChannelList(_focus, _data){
	var w = this.widgets;
	if(_focus){
		w.cols.setFocus(false);
	}
}

mosaic.onFocusColMosaic = function onFocusColMosaic(_focus, _data){
	var w = this.widgets;
	if(_focus){
		w.channelList.setFocus(false);
	}
}

mosaic.onFocusHeader = function onFocusHeader(_focus, _data){
	var w = this.widgets;
	if(_focus){
		w.cols.setFocus(false);
	}
}

mosaic.onFocusBanners = function onFocusBanners(_focus, _data){
	var w = this.widgets;
	if(_focus){
		w.cols.setFocus(false);
		w.channelList.setFocus(false);
	}
}

mosaic.drawAllMosaics = function drawAllMosaics(_data){									
	this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();

		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : null;
			custo = JSON.parse(custo);

		if(focus){
				custo.rx = 5;
				custo.stroke_width = 5;
				Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

				var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_position" : "inside"};
				Canvas.drawShape(ctx, "rect", [6, 6, ctx.viewportWidth-12,ctx.viewportHeight-12], strokeF);
		}		
		
		tp_draw.getSingleton().drawImage(_data.ChannelVO.images.url1X1,ctx,173,96);		
		ctx.drawObject(ctx.endObject());	
	}			
}

mosaic.drawFirstMosaic = function drawFirstMosaic(_data){								
		var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		if(_data[0].ChannelVO.images.url1X1 !="http://10.213.12.163:9900/TPMCOREWeb/MasterImage?mimId=75107"){
		tp_draw.getSingleton().drawImage(_data[0].ChannelVO.images.url1X1,ctx,430,240);
		}
		ctx.drawObject(ctx.endObject());			
}

mosaic.drawFirstMosaicWhite = function drawFirstMosaicWhite()
{
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();
	
	//Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], { "stroke" : "rgba(255, 255, 255, 1)", "stroke_width" : 5, "stroke_pos" : "inside" });	
	var custo = JSON.stringify(this.themaData.whiteStrokePanel);
		custo = JSON.parse(custo);			
		custo.rx = 5;
		custo.stroke_width = 5;
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO

		var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_position" : "inside"};
		Canvas.drawShape(ctx, "rect", [6, 6, ctx.viewportWidth-12,ctx.viewportHeight-12], strokeF);
	
	ctx.drawObject(ctx.endObject());		
}

mosaic.drawChannelList = function drawChannelList( _data )
{
this.draw = function draw(focus) {
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();

	_data = _data.ChannelVO;
	var logo = _data.images.url1X1 + "";
	tp_draw.getSingleton().drawImage(logo,ctx,25, 10,70,38);	
	
	var  text = JSON.stringify(this.themaData.standardFont);
	text = JSON.parse(text);
	text.text_align = "center,middle";	
	text.font_size = 22*tpng.thema.text_proportion;

	var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : null;
		custo = JSON.parse(custo);			
	
	if(focus){
	//Canvas.drawShape(ctx, "rect", [3, 3, ctx.viewportWidth-6, ctx.viewportHeight-6], { "stroke" : "rgba(255, 255, 255, 1)", "stroke_width" : 5, "stroke_pos" : "outside" });	
		custo.rx = 5;
		custo.stroke_width = 5;
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		
		var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_position" : "inside"};
		Canvas.drawShape(ctx, "rect", [6, 6, ctx.viewportWidth-12,ctx.viewportHeight-12], strokeF);		
	}
	var n = _data.number.toString();
	Canvas.drawText(ctx,n, new Rect(26, 54, 70, 50), text);	
	ctx.drawObject(ctx.endObject());	
	}
}

mosaic.drawBanners = function drawBanners( _data ){
	this.draw = function draw(focus) {
		var ctx = this.getContext("2d");
		ctx.beginObject();
		ctx.clear();
		var logo = _data.ItemVO.images.url4X4 + "";
		tp_draw.getSingleton().drawImage(logo,ctx,5, 5);
	
		var custo = focus ? JSON.stringify(this.themaData.whiteStrokePanel) : null;
			custo = JSON.parse(custo);			
		if(focus){
			//	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], { "stroke" : "rgba(255, 255, 255, 1)", "stroke_width" : 5, "stroke_pos" : "inside" });	
			custo.rx = 5;
			custo.stroke_width = 5;
			Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custo); //FONDO
		
			var strokeF = {"fill": null, "stroke": "rgba(0,0,0,1)","stroke_width": 1,"rx": 0, "stroke_position" : "inside"};
			Canvas.drawShape(ctx, "rect", [6, 6, ctx.viewportWidth-12,ctx.viewportHeight-12], strokeF);	
		}	
	ctx.drawObject(ctx.endObject());	
	}
}


mosaic.drawLegendMosaics = function drawLegendMosaics(_data){
this.draw = function draw(focus) {
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();

	var name = _data.MosaicVO.channelMosaic.ChannelVO.categoryName;
	var number = _data.MosaicVO.channelMosaic.ChannelVO.number;
	var channel = gettext("CHANNEL");
	var header = channel + " " + number + " " + gettext("DASH") + " " + name;
	
	if(focus){
	var custoText = JSON.stringify(this.themaData.standardFont);
	custoText = JSON.parse(custoText);
	custoText.text_align = "center,middle";
	custoText.font_size = 22*tpng.thema.text_proportion;
	custoText.fill =  "rgba(0,0,0,1)";	
	Canvas.drawText(ctx,header, new Rect(0, 0,ctx.viewportWidth, ctx.viewportHeight), custoText)
	var custoText = "";	
	}
	else{
		var custoText = JSON.stringify(this.themaData.standardFont);
		custoText = JSON.parse(custoText);
		custoText.text_align = "center,middle";
		custoText.font_size = 22*tpng.thema.text_proportion;
		Canvas.drawText(ctx,header, new Rect(0, 0,ctx.viewportWidth, ctx.viewportHeight), custoText);	
		var custoText = "";
	}
	ctx.drawObject(ctx.endObject());
	}
}



mosaic.drawHeaderMosaics = function drawHeaderMosaics(_data){
this.draw = function draw(focus) {
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();

	var color = _data.MosaicVO.channelMosaic.ChannelVO.cccColor;

	if(focus){
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight],{ "fill" : "rgba(255,255,255,1)"});
		tp_draw.getSingleton().drawImage("img/tv/arrowLeftOnCLEAN.png",ctx, 0, 0);
		tp_draw.getSingleton().drawImage("img/tv/arrowRightOnCLEAN.png",ctx, 990, 0);
	}
	else{
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight],{ "fill" : "rgba("+color+")"});
		tp_draw.getSingleton().drawImage("img/tv/arrowLeftOff.png",ctx, 0, 0);
		tp_draw.getSingleton().drawImage("img/tv/arrowRightOff.png",ctx, 990, 0);
	}
	ctx.drawObject(ctx.endObject());
	}
}

mosaic.drawArrow = function drawArrow(_data){

	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();   
    
	tp_draw.getSingleton().drawImage(_data.url,ctx, 0, 0);
    
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}

mosaic.drawFirst = function drawFirst(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();   
    
	tp_draw.getSingleton().drawImage(_data.images.urlS,ctx,0, 10,104,47);
	var  text = JSON.stringify(this.themaData.standardFont);
	text = JSON.parse(text);
	text.text_align = "center,middle";	
	text.font_size = 22*tpng.thema.text_proportion;
	var n = _data.number.toString();
	Canvas.drawText(ctx,n, new Rect(20, 54, 70, 50), text);	
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}

mosaic.drawLast = function drawLast(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();   

	tp_draw.getSingleton().drawImage(_data.images.urlS,ctx,0, 10,104,47);
    var  text = JSON.stringify(this.themaData.standardFont);
	text = JSON.parse(text);	
	text.font_size = 22*tpng.thema.text_proportion;
	text.text_align = "center,middle";
	var n = _data.number.toString();
	Canvas.drawText(ctx,n, new Rect(20, 54, 70, 50), text);	
    ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
}



mosaic.drawChannelNumberBar = function drawChannelNumberBar(_data){ 	
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		
		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 56*tpng.thema.text_proportion;
			
		var custoBackground = {
	       		fill:           "0.5-rgba(28, 121, 156, .8)|1-rgba(5, 65, 100, .8)",
	        	fill_coords:    "0,0,.3,-2",
	        	stroke:         "rgba(90,90,90, 1)",
	        	stroke_coords:  "1,0,0,0",
	        	stroke_width:   2,
	    	};
	    	
		_data.number = _data.number.toString();
		if(_data.number.length < 3)
			_data.number = _data.number + "_";
			
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoBackground);
		Canvas.drawText(ctx, "<!size=22>ir a canal<!>" + "<!placeholder=30>"+ _data.number+ "<!>", new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);	
		
	ctx.drawObject(ctx.endObject());	
}

mosaic.drawNoMosaics = function drawNoMosaics(_data){ 	
	var ctx = this.getContext("2d");
		ctx.beginObject();
	    ctx.clear();
		
		var custo_f = JSON.stringify(this.themaData.standardFont);
			custo_f = JSON.parse(custo_f);	
			custo_f.text_align = "center,middle";
			custo_f.font_size = 36*tpng.thema.text_proportion;
			
	/*	var custoBackground = {
	       		fill:           "0.5-rgba(28, 121, 156, .8)|1-rgba(5, 65, 100, .8)",
	        	fill_coords:    "0,0,.3,-2",
	        	stroke:         "rgba(90,90,90, 1)",
	        	stroke_coords:  "1,0,0,0",
	        	stroke_width:   2,
	    	};
	    	
		_data.number = _data.number.toString();
		if(_data.number.length < 3)
			_data.number = _data.number + "_";
			
		Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoBackground);*/
		Canvas.drawText(ctx,_data.text1, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		custo_f.font_size = 24*tpng.thema.text_proportion;	
		Canvas.drawText(ctx,_data.text2, new Rect(0,36,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
		custo_f.font_size = 18*tpng.thema.text_proportion;	
		Canvas.drawText(ctx,"Para salir cambia de canal.", new Rect(0,108,ctx.viewportWidth,ctx.viewportHeight), custo_f);
		
	ctx.drawObject(ctx.endObject());	
}

/*
mosaic.drawBackX = function drawBackX(_data){ 	
	var ctx = this.getContext("2d");
	ctx.beginObject();
    ctx.clear();

	tp_draw.getSingleton().drawImage("img/DevsOnion.png", ctx, 0, 0); //tmp el w y h	
	ctx.drawObject(ctx.endObject());	
}
*/