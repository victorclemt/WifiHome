function vodTest(config, options){  
    this.super(config, options);
} 

vodTest.inherits(FormWidget); 
vodTest.prototype.onEnter = function onEnter(_data){
	this.home = _data.home;

	var url = "img/commons/0x0-Back_Wood-BW_HD.jpg";
	this.home.setBg(url);
	this.home.showHeader({"section":"vodPlayer","stroke":"rgba(130, 60, 150, 1)"});
	if(tpng.user.profile.isTest && !tpng.user.unlock){
		var title = "Sección Restringida, para continuar es necesario que ingreses el codigo de seguridad"
		this.home.openSection("nipValidator",{"home":this.home, "formP":this, "formData":{"nipRoot": "","nipTest":true, "title":title, "txt1":"", "txt2":"", "txt3":"","txt4":""}}, false,null,true);	
	}else{
		this.getVodList();
	}
}

vodTest.prototype.getVodList = function getVodList(){
	setTimeout(getServices.getSingleton().call("VOD_GET_TEST_LIST","",this.getVodMovies.bind(this)),500);
}
vodTest.prototype.getVodMovies = function getVodMovies(response){
	if(response.status == 200){
		var arrayVods = response.data.ResponseVO.vods;
		this.widgets.list.setData(arrayVods);
		this.widgets.list.stateChange("enter");
	
	}
}
vodTest.prototype.openNextSection = function openNextSection(_status,_nip){
	if(_status){
		this.getVodList();
	}else{
		this.home.closeSection(this);
	}

}
vodTest.prototype.onKeyPress = function onKeyPress(_key){
	var nipPanel = this.widgets.nipPanelBg,
		pass = this.widgets.nip01_topInput
		list = this.widgets.list;	
	switch(_key){
		case KEY_NAME_ALT_BACK:
		case "KEY_MENU":
        case "KEY_IRBACK":
			this.home.closeSection(this);
		break;
		case "KEY_DOWN":
		case "KEY_UP":
			_key ==  "KEY_UP" ? this.widgets.list.scrollPrev() : this.widgets.list.scrollNext();
		break;
		case "KEY_IRENTER":
				if(list.selectItem.VodMovieVO.url)
					this.home.openSection("genericPlayer", {"name": "genericPlayer", "home":this.home,"vodInfo":list.selectItem.VodMovieVO}, false);
		break;
	}
	
	return true;
}
vodTest.drawList = function drawList(data){
 this.draw = function draw(focus) {	
		var ctx = this.getContext("2d");
		ctx.beginObject();
    	ctx.clear();		    
     	var custoText = JSON.stringify(this.themaData.standardFont);
		custoText = JSON.parse(custoText);		
		custoText.text_align = "left,middle";
		custoText.font_size = 20 * tpng.thema.text_proportion;				    
    	if(focus) {
	    		custo = {"fill": "rgba(255,255,255,1)", "stroke": "white",};
	    		Canvas.drawShape(ctx, "rect", [0,0,1199,29], custo);
	    		custoText.fill = "rgba(0,0,0,1)";
		}
	 	Canvas.drawText(ctx,"<!b>Nombre: <!>"+data.VodMovieVO.name+"<!b>    Clasif: <!>"+data.VodMovieVO.rating+",<!b>    ID: <!>"+data.VodMovieVO.vodId, new Rect(0,0,ctx.viewportWidth,ctx.viewportHeight), custoText);
		
		ctx.drawObject(ctx.endObject());
    }    	    	
}

vodTest.prototype.onExit = function onExit(){
	this.home.hideHeader();
	this.widgets.list.stateChange("exit");
	
}