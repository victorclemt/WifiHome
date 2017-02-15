function epg(_json, _options){
	this.super(_json, _options);
	this._userData = _options.userData;
	this.withoutEpg = 0;
	epg.custo = epg._custo();

}

epg.inherits(FormWidget);

epg._instance = null; //We keep a reference to the current instance mainly because the draw methods are static.

epg.cellSize = 1800; //Each cell represents half an hour.
epg.cellMargin = 6;

epg.daysAround = 2; //Max days to show before and after today.

/* !Colors definition */
epg.colors = {
	white:            "rgba(240, 240, 250, 1)",
	black:            "rgba(30, 30, 40, 1)",
	transparent:      "rgba(0, 0, 0, 0)",

	textColor:        "rgba(240, 240, 250, 1)",
	strokeColor:      "rgba(85, 95, 105, 1)",
	ctvRecColor:      "rgba(85, 95, 105, 1)",
	ctvColor:         "rgba(190, 50, 120, 1)",
	currentColor:     "rgba(0, 190, 240, 1)",
	futureColor:      "rgba(230, 230, 240, 1)",
	currentCellColor: "rgba(130, 220, 250, .1)",
	dummyColor:       "rgba(170, 170, 180, 1)",
	cellBG:           "rgba(240, 240, 250, .1)",
	hoursCellBG:      "rgba(30, 30, 40, 1)",
	focusColor:       "rgba(240, 240, 250, 1)",
	dummyfocusColor:  "rgba(85, 95, 105, .8)"
};

epg.fonts = {
	defaultFont: 'Oxygen-Regular'
};

/* !Custo */

/**
 * This is a lazy loaded class.
 * The epg constructor calls it and stores the instance in epg.custo.
 *
 * @return {Object}
 */
epg._custo = function(){
	var custo, pname, parent, c = epg.colors, f = epg.fonts;
	var custos = {
		cellText:{
			font_size:   20,
			fill:        c.textColor,
			font_family: f.defaultFont,
			text_align:  "left,middle"
		},
		cell:{
			fill: c.cellBG,
		},
		cellFocusText: {
			fill:  "rgba(1,1,1,1)",
			_inherits: 'cellText'
		},

		cellFocus:{
			fill: c.focusColor,
		},

		cellFocusLabel: {
			fill: c.white,
			stroke: c.strokeColor,
			stroke_pos: 'inside',
			stroke_width: 1,
			rx: 12
		},

		cellFocusLabelText: {
			_inherits: 'cellFocusText'
		}
	};

	//Simple inheritance
	for (pname in custos){
		if(!custos.propertyIsEnumerable(pname)){
			continue;
		}

		custo = custos[pname];
		if( (parent = custo._inherits) && (parent = custos[parent]) ){
			custo = custo.mergeJSON(parent);
		}
		delete custo._inherits;
	}

	// Releases this variables so we don't have unnecesary closure over them.
	f = c = pname = custo = parent = null;

	return {
		get: function(which){
			return custos[which].cloneJSON();
		}
	};
};

/**
 * The custo instance will live here.
 * @type {Object}
 */
epg.custo = null;

/**
 * This property holds which subsection holds focus.
 * @type {String}
 */
epg.prototype.currentFocus  = false;
/**
 * This property holds the index of the day displayed relatove to this.availableDays.
 * @type {Int}
 */
epg.prototype.currentDayIx = 0;
/**
 * This property holds a collection of the days that can be selected.
 * @type {Array}
 */
epg.prototype.availableDays = [];

/**
 * This property holds a list of timers so we can clean up after ourselves on exit.
 * @type {Object}
 */
epg.prototype.timers = {};

epg.prototype.unsetTimer = function unsetTimer(name)
{
	if(!this.timers[name]){
		return false;
	}

	unsetTimeAlarm(this.timers[name]);
	this.timers[name] = 0;
	return true;
};

epg.prototype.clearTimers = function clearTimers(name){
	var timerName;
	for(timerName in this.timers){
		if(!this.timers.propertyIsEnumerable(timerName)){
			continue;
		}
		this.unsetTimer(timerName);
	}
};

epg.prototype.onExit = function onExit(_data)
{
	this.home.hideBackground();
	this.home.hideHeader();

	this.clearTimers();

	/* It's important to delete our instance from the static variable for it to be garbage collected. */
	delete epg._instance;
	delete this.currentGrid;
	epg.custo = null; //To free up some RAM.
	NGM.trace('Bye bye EPG');
};

epg.prototype.onEnter = function onEnter(_data){

	var w = this.widgets;
	epg._instance = this;
	this.currentFocus = 'epg';
	this.home = _data.home;
	this.home.showHeader();
	this.home.setBg("img/vod/backgroundAalaZ.jpg");

	w.base.setData();
	w.base.stateChange("exit");
	// w.background.setData();
	// w.background.stateChange("enter");
	this.withoutEpg = 0;

	this.currentGrid = this.widgets.grid;

	this.currentGrid.observeEvent('scroll', this.onScroll.bind(this));
	this.currentGrid.observeEvent('shouldScroll', this.shouldScroll.bind(this));
	this.currentGrid.observeEvent('onCellFocus', this.cellFocused.bind(this));

	this.retrieveData(_data.focusedChannel, _data.gridTop);

	if (this.dataRetrieved) {
		// this.gridDataInit.horizontal.originValue = this.curChannel;
		this.showGrid(_data.focusTop);
	}

};

epg.prototype.showGrid = function showGrid(focusTop) {
	var w = this.widgets,
		// header = w.headerBg,
		date = w.dateBg,
		topLeft = w.topLeft,
		grid = this.currentGrid;

	//seteando datos
	// header.setData();//We no longer have a background for the hours header,
	// date.setData();  //We no longer have a background for the date header,

	this.gridDataInit.focusTopValue = focusTop;
	grid.setData(this.gridDataInit);
	grid.stateChange("exit");
	topLeft.setData({});
	grid.focusCellUpdate();
	delete this.gridDataInit.focusTopValue;

	// NGM.trace('shoooow');
	//si mas de 8 programas están sin EPG local
	//mando el msg de "guía no disponible".
	if(this.withoutEpg > 8){
		NGM.trace('Guia no disponible');
		w.info.setData({"error":true, "msg":"<!size=32>Lo sentimos. <!>|<!size=26>Por el momento la guía no está disponible.<!>| | <!size=18>Por favor inténtalo más tarde.<!>"});
		w.info.stateInstantChange("off");
		//a los showAlgo les mando un pequeño delay para evitar un brinco en pantalla
		this.showError.bind(this).delay(500);
	}else{
		//a los showAlgo les mando un pequeño delay para evitar un brinco en pantalla
		this.showGridDelay.bind(this).delay(500);
	}


};



epg.prototype.showErrorDelay = function showErrorDelay() {
	var w = this.widgets,
		header = w.headerBg,
		date = w.dateBg,
		grid = this.currentGrid;

	grid.lockClient(this.client, 'epgClient');
		header.stateChange("enter");
		date.stateChange("enter");
		grid.stateChange("exit");
	grid.unlockClient(this.client, 'epgClient');
	this.currentFocus = "error";
};

epg.prototype.showGridDelay = function showGridDelay() {
	this.initDates();
	var w = this.widgets,
		// header = w.headerBg,
		date = w.dateBg,
		topLeft = w.topLeft,
		grid = this.currentGrid;

		// NGM.trace('showGrid');
	grid.lockClient(this.client, 'epgClient');
		// header.stateChange("enter");
		date.stateChange("enter");
		grid.stateChange("enter");
		topLeft.stateChange("enter");
		this.updateTopDate(true);
	grid.unlockClient(this.client, 'epgClient');
	this.autoRefresh();
	// var cellsList = grid.getCellsList();
	// for (var i = cellsList.length - 1; i >= 0; i--) {
	//  NGM.dump(cellsList[i].data.channel.name);
	// }
	this.currentFocus = "epg";
};

epg.prototype._getHorizontalData = function _getHorizontalData(focusedChannel) {
	if(!focusedChannel){
		focusedChannel = tpng.app.currentChannel.number;
	}

	// var list = NGM.main.getChannelList();
	var list = tpng.app.channelList;
	var channels = tpng.app.isFavoriteMode ? tpng.app.favoriteChannels : tpng.app.channelList;
	var c = null;
	var ch = [];
	var prev = false;
	for(var i = 0, l= channels.length; i<l ;i++){
		c = NGM.main.getChannelByZap(channels[i].ChannelVO.number);

		if (c){
			ch.push(
				{

					"name": c.getData("name"),
					"url": c.getData("url"),
					"zapNumber": channels[i].ChannelVO.number*1,
					"type": channels[i].ChannelVO.type + "",
					"isLive": true,
					"link": channels[i].ChannelVO.link,
					"images": channels[i].ChannelVO.images,
					"isCTV": channels[i].ChannelVO.isCtv===true?true:false,
					"isCtvRec": channels[i].ChannelVO.isNpvr===true?true:false,
					"rating":channels[i].ChannelVO.rating,
					"description":channels[i].ChannelVO.description

				}
			);
		}else{
			ch.push({
					"name": channels[i].ChannelVO.name,
					"url": channels[i].ChannelVO.url,
					"zapNumber": channels[i].ChannelVO.number*1,
					"type": channels[i].ChannelVO.type + "",
					"isLive": true,
					"images": channels[i].ChannelVO.images,
					"isCTV": channels[i].ChannelVO.isCtv===true?true:false,
					"link": channels[i].ChannelVO.link,
					"isCtvRec": channels[i].ChannelVO.isNpvr===true?true:false,
					"rating":channels[i].ChannelVO.rating,
					"description":channels[i].ChannelVO.description
			});
		}

		if(channels[i].ChannelVO.number == focusedChannel){	
			this.curChannel = ch[ch.length-1];
		}

		c = null;

		if(prev === channels[i].ChannelVO.number){
			NGM.trace('Duplicated channel number '+ prev);
		}

		prev = channels[i].ChannelVO.number;

	}
	if(l<8){
		//si hay menos de 8 programas (tamaño estandar)
		//cambiaremos la configuración del JSON de acuerdo a los
		//programas (esto sucede en modo favoritos)
		NGM.trace("si hay menos de 8 programas (tamaño estandar)");
		var cols = l-1;
		this.currentGrid.json.column.number = cols;
		var h = 40 + (cols * 10) + (cols * 47);
		this.currentGrid.json.w = h;
		this.currentGrid.width = h;
	}

	// We're adding a dummy column at the end because we can't focus the last one.
	ch.push({
			"name":'',
			"url":'',
			"zapNumber": 0,
			"type": 'M',
			"isLive":'',
			"images":'',
			"isCTV":'',
			"isCtvRec":'',
			"rating":'',
			"description":''
	});

	this.firstChannel = ch[0];

	return ch;
};

epg.prototype.onKeyPress = function(_key) {
	this.updateLongPress(_key);
	if(this.ignoreKeyPress) {
		return true;
	}

	/* !GREEN */
	// if(_key === 'KEY_TV_GREEN'){
	// 	return this.toggleOnion();
	// }
	// if(_key === 'KEY_TV_RED'){
	// 	this.refreshCb(1,1);
	// 	// this.currentGrid.refreshDisplay();
	// 	return;
	// }
	// if(_key === 'KEY_TV_YELLOW'){
	// 	this.currentGrid.refreshDisplay();
	// 	return;
	// }

	switch(this.currentFocus){
		case "epg":
			this.onKeyPress_EPG(_key);
		break;
		case "buttons":
			this.onKeyPress_buttons(_key);
		break;
		case "error":
			this.onKeyPress_error(_key);
		break;
		case "hours":
			this.onKeyPress_hours(_key);
		break;
		case "days":
			this.onKeyPress_days(_key);
		break;
		case "channelBar":
			this.onKeyPress_channelBar(_key);
		break;
		case "search":
			this.onKeyPress_search(_key);
		break;
	}
	return true;
};


epg.prototype.handleNumberKeys = function handleNumberKeys(keyName)
{
	var numberKeys = ["KEY_TV_0","KEY_TV_1","KEY_TV_2","KEY_TV_3","KEY_TV_4","KEY_TV_5","KEY_TV_6","KEY_TV_7","KEY_TV_8","KEY_TV_9"];

	if(!numberKeys.contains(keyName)){
		return false;
	}
	this.focusChannelBar(keyName);
	return true;
};

epg.prototype.onKeyPress_EPG = function onKeyPress_EPG(keyName) {
	var w = this.widgets;
	var grid      = this.currentGrid,
		gridState = grid.state;

	var oldFocusAbsoluteTopValue = grid.getFocusAbsoluteTopValue();
	var gridDate = new Date(grid.getFocusAbsoluteTopValue() * 1000);
	var now = new Date();

	if(this.handleNumberKeys(keyName)){
		return;
	}

	if (gridState == "enter") {
		// NGM.trace(keyName);
		if (keyName === "KEY_IRBACK" || keyName === "KEY_MENU"){
			return this.home.closeSection(this);
		}

		if (keyName === "KEY_PREV"){
			this.scrollPage(-1);
			return;
		}

		if (keyName === "KEY_NEXT"){
			this.scrollPage(1);
			return;
		}

		if (keyName === "KEY_TV_PLAY"){
			return this.goToNow();
		}

		/* !Channel down */
		if (keyName === "KEY_TV_CHNL_DOWN"){
			return;
		}
		if (keyName === "KEY_TV_SWAP"){
			return this.focusHours();
		}

		if (keyName === "KEY_LEFT" && grid.getFocusData().gridTop <=  grid.getTopValue()) {
			if (this.tooFarInThePast()) {
				return true;
			}
		}

		if (keyName === "KEY_RIGHT" && grid.getFocusData().gridBottom >=  grid.getBottomValue()) {
			if (this.tooFarInTheFuture()) {
				return true;
			}
		}


		// grid key Handler
		if (grid.keyHandler(keyName)) {
			switch (keyName) {
				case "KEY_UP":
				case "KEY_DOWN":
				break;

				case "KEY_LEFT":
				case "KEY_RIGHT":
					var focusAbsoluteTopValue = grid.getFocusAbsoluteTopValue();
					//So we don't render a partial hour cell.
					this.gridDataInit.vertical.originValue = focusAbsoluteTopValue - (focusAbsoluteTopValue % 1800);

					this.gridDate = new Date(focusAbsoluteTopValue * 1000);
					// var oldDate = new Date(oldFocusAbsoluteTopValue * 1000);
					// if (this.gridDate.getDate() !== oldDate.getDate()) {
					//   this.widgets.dateBg.setData({"date":getDateEPGStr(grid.getFocusData().program)});
					//   this.widgets.dateBg.stateChange("enter");
					// }
					if(this.isLongPress()){
						/* Because this is a long press, we want to give the user time to notice the change.
						   when the user let's go of the key (i.e doesn't press for 300ms) we will stop ignoring.
						 */

						// NGM.trace('Focusing hours on long press');
						// this.ignoreKeyPress = true;
						this.focusHours();
					}

				break;

			}
			return true;
		}
		else {
			switch (keyName) {
				case "KEY_IRENTER":
					 if(!tpng.app.isSafeMode && !grid.getFocusData().program.isDummy)
							this.openProgramInfo(grid.getFocusData());
				return true;
			}
		}
		if(keyName === "KEY_TV_RED"){
			this.widgets.base.stateChange("enter");
		}else if(keyName === "KEY_TV_BLUE"){
			this.widgets.base.stateChange("exit");
		}
	}

	// NGM.trace('Uncatched Key Pressed: '+keyName);
	return false;
};


/**
 * Key handler for when the top bar has focus. It delegates to this.home who knows how to handle keypresses there.
 * @param  {string} _key
 * @return {void}
 */
epg.prototype.onKeyPress_search = function onKeyPress_search(_key)
{
	switch(_key){
		case "KEY_DOWN":
			 this.home.disableSearchHeader();
			this.widgets.daysFocus.stateChange('enter');
			this.focusDays();
		break;

		default:
			this.home.onKeyPress(_key);
		break;
	}
};

epg.prototype.onKeyPress_error = function onKeyPress_error(_key) {
	switch(_key){
		case KEY_NAME_ALT_BACK:
		case "KEY_IRBACK":
		case "KEY_MENU":
			 this.home.closeSection(this);
		break;
	}
};
/*
epg.prototype.onKeyPress_buttons = function onKeyPress_buttons(_key) {
	switch(_key){
		case KEY_NAME_ALT_BACK:
		case "KEY_IRBACK":
		case "KEY_MENU":
			 this.hideProgramInfo();
		break;

		case "KEY_LEFT":
		case "KEY_RIGHT":
			if(_key == "KEY_LEFT") {
				this.widgets.buttons.scrollPrev();
			}else{
				this.widgets.buttons.scrollNext();
			}
		break;

		case "KEY_IRENTER":
			switch(this.widgets.buttons.selectItem.type){
				case "LIVE":
					this.home.tuneInByNumber(this.selectProgram.channel*1,true,this);
				break;
				case "BACK":
					this.hideProgramInfo();
				break;
				case "CTV":
					this.home.openSection("ctvPlayer", {"name": "ctvPlayer", "home":this.home,"idEpg":this.selectProgram.program.id});
				break;
				case "NPVR":
					var parameters = ["idEpg="+this.selectProgram.program.id];
					getServices.getSingleton().call("TV_SET_PROGRAM_NPVR",parameters,this.responseSetProgNPVR.bind(this));

				break;
				case "HOR":
					this.home.openSection("search", {"chain":removeAcent(this.selectProgram.program.name+""),"home": this.home});
				break;
			}
		break;

	}
	return true;
};*/


epg.prototype.onKeyPress_days = function onKeyPress_days(_key)
{
	if(this.ignoreKeyPress){
		return true;
	}

	if(this.handleNumberKeys(_key)){
		return;
	}

	switch(_key){
		case "KEY_LEFT":
			this.scrollDays(-1);
		break;
		case "KEY_RIGHT":
			this.scrollDays(1);
		break;
		case "KEY_DOWN":
			this.focusHours();
		break;

		case "KEY_UP":
			this.home.enableSearchHeader();
			this.currentFocus = 'search';
			var data = this.getSelectedDay();
			data.active = true;
			this.widgets.daysFocus.setData(data);
		break;

		// case "KEY_TV_PLAY":
		//  this.goToNow();
		// break;

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
	}
};

epg.prototype.onKeyPress_hours = function onKeyPress_hours(_key)
{
	if(this.ignoreKeyPress){
		return true;
	}


	if(this.handleNumberKeys(_key)){
		return;
	}

	switch(_key){
		case "KEY_LEFT":
			this.scrollHours(-1);
		break;
		case "KEY_RIGHT":
			this.scrollHours(1);
		break;
		case "KEY_UP":
			this.widgets.hoursFocus.stateChange('toDays');
			this.focusDays();
		break;
		case "KEY_DOWN":
		case 'KEY_TV_SWAP':
		case 'KEY_IRENTER':
			this.widgets.hoursFocus.stateChange('exit');
			this.focusEpg();
		break;

		case "KEY_PREV":
			this.scrollPage(-1);
		break;

		case "KEY_NEXT":
			this.scrollPage(1);
		break;

		case "KEY_TV_PLAY":
			this.goToNow();
		break;

		case "KEY_IRBACK":
		case "KEY_MENU":
			this.home.closeSection(this);
		break;
	}
};

epg.prototype.onKeyPress_channelBar = function onKeyPress_channelBar(_key)
{
	switch (_key){
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
			this.sendKeyToChannelBar(_key);
		break;
		case "KEY_IRBACK":
			this.hideChannelBar();
		break;
	}
};

epg.prototype.scrollDays = function scrollDays(direction) {
	var w = this.widgets;

	this.unsetTimer('scrollDaysTimer');

	// NGM.trace(this.currentDayIx+' + '+direction);
	if(!this.selectDay(this.currentDayIx + direction, 'focus')){
		return false;
	}

	this.timers.scrollDaysTimer = this.doScrollDays.delay(150, this, direction);
};

/**
 * Returns a clone of the selected day's data.
 * @return {Object}
 */
epg.prototype.getSelectedDay = function getSelectedDay() {
	var dayObj = this.availableDays[this.currentDayIx];

	if(!dayObj){
		return false;
	}

	var data = dayObj.cloneJSON(dayObj);
	if(status){
		data[status] = true;
	}

	data.date = new Date(dayObj.date.getTime());
	return data;
};
/**
 * Selects a day in the top bar.
 * @param  {int} ix         The index
 * @param  {string} status  A single property name to set to true in the data sent to the drawMethod.
 * @return {bool}           If out of range, will return false.
 */
epg.prototype.selectDay = function selectDay(ix, status) {
	if(typeof ix === 'undefined'){
		ix = this.currentDayIx;
	}

	var dayObj = this.availableDays[ix];
	if(!dayObj){
		// NGM.trace('Trying to select undefined index: '+ix);
		return false;
	}
	this.currentDayIx = ix;
	data = this.getSelectedDay();
	if(status){
		data[status] = true;
	}
	this.widgets.daysFocus.setData(data);
	return true;
};


epg.prototype.goToNow = function goToNow()
{
	var now = new Date();
	var curMins = now.getMinutes();
	// NGM.trace(curMins);
	curMins -= curMins % 30;
	// NGM.trace(curMins + ' '+ curMins % 30);
	now.setMinutes(curMins);
	now.setSeconds(0);
	// NGM.trace(now);
	this.doScrollDays(now);
	this.updateTopDate();
};

epg.prototype.doScrollDays = function doScrollDays(newD)
{
	// NGM.trace('scrolling days!');
	var w = this.widgets;
	var grid = this.currentGrid;
	var selectedDay, topValue;
	var currentlyFocused = grid.getFocusData();
	var current, leftCol;

	this.ignoreKeyPress = true;

	if(!newD.instanceOf('Date')){
		selectedDay = this.getSelectedDay();
		current = this.getTopDate();
		newD = selectedDay.date;
		newD.setHours(current.getHours());
		newD.setMinutes(current.getMinutes());
	}

	newD.setSeconds(0);


	topValue = Math.floor(newD.getTime() / 1000);
	this.gridDataInit.vertical.originValue = topValue;

	// leftCol = grid.column[grid.column.atLeft];
	// NGM.dump(leftCol);
	this.setFocusedChannel(currentlyFocused.channel);
	this.refreshGrid();

	this.ignoreKeyPress = false;

};


epg.prototype.refreshGrid = function refreshGrid()
{
	var topLeft = this.widgets.topLeft;
	var grid = this.currentGrid;
	topLeft.stateChange('exit');
	grid.lockClient(this.client, 'epgClient');
	grid.setData(this.gridDataInit);
	this.updateTopLeft();
	topLeft.stateChange('enter');
	grid.unlockClient(this.client, 'epgClient');

};

epg.prototype.setFocusedChannel = function setFocusedChannel(channel)
{
	this.gridDataInit.horizontal.originValue = channel;
};

/**
 * Scrolls in 2 hour intervals.
 * @param  {int} direction    - 1 right -1 left
 * @return {void}
 */
epg.prototype.scrollPage = function scrollPage(direction)
{
	this.currentGrid.verticalScrollTo((direction < 1)?'up':'down', 7200*direction);
};

/**
 * Handles scroll when the hours selector has focus
 * @param  {int} direction    - 1 right -1 left
 * @return {void}
 */
epg.prototype.scrollHours = function scrollHours(direction)
{
	var grid = this.currentGrid;
	if(direction < 0){
		grid.moveUp();
	}else if(direction > 0){
		grid.moveDown();
	}
};

/*epg.prototype.responseSetProgNPVR = function responseSetProgNPVR(response_err, responseCode){
	var widgets = this.widgets;
	if(responseCode.status == 200){
		var res = responseCode.responseObject.ResultVO;
		NGM.dump(res);
		var status = res.status == 1 ? "Y" : "N";
		this.hideProgramInfo();
	}
}*/

epg.prototype.addParametersToSection = function addParametersToSection(name, parameters)
{
	for (var i = tpng.app.sections.length - 1; i >= 0; i--) {
		if(tpng.app.sections[i].name === name){
			tpng.app.sections[i].params = parameters.mergeJSONByRef(tpng.app.sections[i].params);
		}
	}

};

epg.prototype.openProgramInfo = function openProgramInfo(_data) {
		if(_data.isLocked === true){
            return false;
        }

		if(_data.isCurrent || _data.channel.type === 'M' || _data.channel.type === 'S'){
			
			tpng.app.sections = [];
			this.widgets.stateChange("exit");
			tpng.netflix.fromMiniGuide = true;	
			this.home.tuneInByNumber(_data.channel.zapNumber, false, false);
			this.home.closeSection(this);
			return;
		}

		var epgId = _data.program.id;
		var chnId = _data.channel.zapNumber;

		if(_data.channel.type !== 'C' && _data.channel.link){
			return this.home.openLink(_data.channel.link, null, 14);
		}

		// NGM.main.alert('This should open the program\'s info: \n '+_data.program.name);
		// NGM.trace(tsToString(this.currentGrid.getTopValue()));

		this.addParametersToSection('epg', {focusedChannel: chnId, gridTop: this.currentGrid.getTopValue(), focusTop: this.currentGrid.focus.topValue});
		NGM.trace("channel "+ chnId);
		this.home.openSection("programDetail", {"home": this.home, "parameters":{"epgId":epgId, "channel": chnId, "startTime": _data.program.startTime}});

/*
		var _program = _data;
		// NGM.dump(_program.program.id);

			_program.ChannelVO = {
				"images":_program.channel.images,
				"number":_program.channel.zapNumber,
				"isCtv":_program.channel.isCTV,
				"isNpvr":_program.channel.isCtvRec,
				"type":_program.channel.type,
				"name" : _program.channel.name
			 };
			 _program.startTime = _program.program.startTime*1000;
			 _program.endTime = _program.program.endTime*1000;
			 _program.name = _program.program.name;
			 _program.category = _program.program.category;
			 _program.description = _program.program.description;

			 _program.rating = {"value":_program.channel.rating};
			 _program.draw="more";


	this.home.openSection("programDetail",{"home":this.home, "program": _program},false);
*/
};


/*epg.prototype.showButtons = function showButtons(info) {
	var widgets = this.widgets;
	var buttons = [];

	if(info){
		var playButton = this.selectProgram.isCurrent ? "ver ahora" : "reproducir";
		var playButtonType = this.selectProgram.isCurrent ? "LIVE" : "CTV";
		var program = this.selectProgram.program;
		var isFuture = isFutFunction(program.name, program.startTime, program.endTime);


		//Botón reproducir o ver ahora, dependiendo de si es current o tiene CTV
		if(!this.selectProgram.isLocked){
			//PROGRAMA CON CTV O LIVE (LOS QUE MUESTRAN BOTÓN PLAY)
			if(this.selectProgram.isCurrent || (info.isCtv == "Y" && info.actIsCtv == "Y" && info.isCtvRec == "Y"))
				buttons.push({"label": playButton, "type": playButtonType ,"imgOn":"imgs/commons/buttons/btn_rep_On.png", "imgOff":"imgs/commons/buttons/btn_rep_Off.png"});
			//SI EL PROGRAMA ES NPVR Y SU CANAL ANYTIME
			else if (this.selectProgram.isPast){
				if(info.isCtv == "Y" && info.isNpvr == "Y" && info.actIsCtv == "Y")
					buttons.push({"label": playButton, "type": playButtonType ,"imgOn":"imgs/commons/buttons/btn_rep_On.png", "imgOff":"imgs/commons/buttons/btn_rep_Off.png"});
				else if (info.isCtv == "Y" && info.actIsCtv == "Y")
					buttons.push({"label": playButton, "type": playButtonType ,"imgOn":"imgs/commons/buttons/btn_rep_On.png", "imgOff":"imgs/commons/buttons/btn_rep_Off.png"});
			}


	   if(!this.selectProgram.isCurrent){
				if(info.isCtv == "Y" && info.isNpvr == "N" && info.isCtvRec == "N")
					buttons.push({"label": "grabar programa", "type": "NPVR", "imgOn":"imgs/commons/icons/episodeAC.png", "imgOff":"imgs/commons/icons/episodeOFF.png"});
				else if(info.isCtv == "Y" && info.isNpvr == "Y" && info.isCtvRec == "N")
					buttons.push({"label": "no grabar programa", "type": "NPVR", "imgOn":"imgs/commons/icons/episodeON.png", "imgOff":"imgs/commons/icons/episodeON.png"});
		   }


			//Botón de regresar
			buttons.push({"label": "regresar","type": "BACK" ,"imgOn":"imgs/commons/buttons/regresarOn.png", "imgOff":"imgs/commons/buttons/regresarOff.png"});
			buttons.push({"label": "+horarios", "type": "HOR","imgOn":"imgs/commons/buttons/btn_mas_On.png", "imgOff":"imgs/commons/buttons/btn_mas_Off.png"});
		}else{
			buttons.push({"label": "regresar","type": "BACK" ,"imgOn":"imgs/commons/buttons/regresarOn.png", "imgOff":"imgs/commons/buttons/regresarOff.png"});
		}
		widgets.buttons.setData(buttons, buttons.length);
		widgets.buttons.stateChange("enter");
		this.currentFocus = "buttons";

	}else{
		buttons.push({"label": "regresar","type": "BACK" ,"imgOn":"imgs/commons/buttons/regresarOn.png", "imgOff":"imgs/commons/buttons/regresarOff.png"});
		widgets.buttons.setData(buttons, buttons.length);
		widgets.buttons.stateChange("one_off", 0, 0);
		this.buttonsDelay.bind(this).delay(300);

	}
}*/



epg.prototype.tooFarInTheFuture = function tooFarInTheFuture() {
	var tooFarInTheFuture = false;

	if (this.getGridDate() >= this.getMidnight(EPG.MAX_FUTURE_DAYS) - 2*60*60) {
		tooFarInTheFuture = true;
	}
	return tooFarInTheFuture;
};

epg.prototype.tooFarInThePast = function tooFarInThePast() {
	var tooFarInThePast = false;

	if (this.getMidnight(-EPG.MAX_PAST_DAYS) >= this.getGridDate()) {
		tooFarInThePast = true;
	}

	return tooFarInThePast;
};

epg.prototype.getGridDate = function getGridDate() {
	var gridDate = (new Date(this.currentGrid.getTopValue() * 1000)).getTime() / 1000;
	return gridDate;
};

epg.prototype.getMidnight = function getMidnight(dayOffset) {
	var now = new Date();
	var midnight = (new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, 0)).getTime() / 1000;
	return midnight;
};



epg.prototype.retrieveData = function(focusChannel, originDate) {
	var horizontalDatas = this._getHorizontalData(focusChannel);
	var now, min, curProgram;

	/*  Force focus on the last channels to test */
	// this.curChannel = horizontalDatas[horizontalDatas.length - 10];

	// If it doesn't exist, take the first item from epg channel list
	if (!this.curChannel && horizontalDatas.length > 0) {
		this.curChannel = horizontalDatas[0];
	}

	originDate = (originDate) ? originDate : 0;
	NGM.trace(originDate + ': '+tsToString(originDate));
	// Make sure the current program is focused
	if(!originDate && this.curChannel){
		curProgram = NGM.epg.createByTime(this.curChannel.channel);
		if (curProgram){
			originDate = curProgram.startTime - this.currentGrid.focus.topValue;
		}

		now = new Date();
		min = Math.round(now / 1000);

		if (originDate < min)
			originDate = min;
	}

	originDate = Math.floor(originDate / 30 / 60) * 30 * 60;

	this.gridDate = now;

	//OBTIENE LOS DATOS
	this.gridDataInit = this.initGrid(this.curChannel, horizontalDatas, originDate, this.vDatas, this.vHeader);

	this.dataRetrieved = true;
};

epg.prototype.initGrid = function initGrid(horizontalOrigin, horizontalItems, verticalOrigin, verticalDataCallback, verticalHeaderCallback) {
	var minDate = new Date();
	var maxDate = new Date();
	minDate.setDate(minDate.getDate() -  epg.daysAround);
	minDate.setHours(0);
	minDate.setMinutes(0);
	minDate.setSeconds(0);

	maxDate.setDate(maxDate.getDate() +  epg.daysAround);
	maxDate.setHours(24);
	maxDate.setMinutes(30);
	maxDate.setSeconds(0);

	return {
		"safeZone": 70, // We consider this amount of pixels to be invisible to the user.
		"horizontal" : {
			"originValue" : horizontalOrigin,
			"items" : horizontalItems,
		},
		"vertical" : {
			"originValue" : verticalOrigin,
			"minValue" : Math.round(minDate.getTime() / 1000),
			"maxValue" : Math.round(maxDate.getTime() / 1000),
			"getDataCB" : verticalDataCallback,
			"getHeaderCB" : verticalHeaderCallback
		}
	};
};

/**
 * Adds the cells for the hours.
 * @param  {[type]} info      - The info related to the column. Currently it's always undefined.
 * @param  {Number} startTime - Timestamp of the start time to display
 * @param  {Number} endTime   - Timestamp of the end time to display
 * @return {array}
 */
epg.prototype.vHeader = function(info, startTime, endTime) {
	// NGM.trace('vHEader');

	var originalFrom = startTime;
	var step = 30 * 60, half = step >> 1, list = [];

	startTime += half;
	startTime = startTime - (startTime % step);

	for (var y = startTime; y < endTime; y += step) {
		list.push({
			"gridTop" : y,
			"gridBottom" : y + step,
		});
	}
	//list[-1] = {"gridTop": originalFrom, gridBottom: startTime};
	return list;
};

/**
 * Gets the program list for each channel at a given time slot.
 * @param  {Channel} channel
 * @param  {Number} startTime - Timestamp of the start time to display
 * @param  {Number} endTime   - Timestamp of the end time to display
 * @return {array}
 */
epg.prototype.vDatas = function(channel, startTime, endTime) {

	if(!channel){
		//NGM.trace('We didn\'t receive a channel.');
		return;
	}

	switch(channel.type){
		case "C":
			return this.getEPGChannelData(channel, startTime, endTime);
		case "I":
			return this.getInteractiveChannelData(channel, startTime, endTime);
		case "M":
			return this.getMosaicChannelData(channel, startTime, endTime);
		case "S":
			return this.getServiceChannelData(channel, startTime, endTime);
	}
};

epg.prototype.getServiceChannelData = function getServiceChannelData(channel, startTime, endTime)
{
	var cell = this.generateFullWidthCell(startTime, endTime);
	cell.program = {
		name : channel.name,
		type : channel.type,
	};
	cell.channel =  channel;
	//cell.drawCb = epg.drawService;

	return [cell];
};

epg.prototype.getMosaicChannelData = function getMosaicChannelData(channel, startTime, endTime)
{
	// NGM.dump(channel, 2);
	var cell = this.generateFullWidthCell(startTime, endTime);
	cell.program = {
		name : channel.name,
		type : channel.type,
	};
	cell.channel =  channel;
	cell.drawCb = epg.drawMosaic;

	return [cell];
};

epg.prototype.getInteractiveChannelData = function getInteractiveChannelData(channel, startTime, endTime)
{
	// NGM.trace('Getting data for channel '+channel.name);
	var cell = this.generateFullWidthCell(startTime, endTime);
	// NGM.dump(channel, 2);
	cell.program = {
		name : 'App - ' + channel.name,
		type : channel.type,
	};
	cell.channel =  channel;
	cell.drawCb = epg.drawInteractive;

	return [cell];
};

/**
 * Generates a cell that will span the whole width of the guide
 * @param  {Number} startTime
 * @param  {Number} endTime
 * @return {Object}
 */
epg.prototype.generateFullWidthCell = function(startTime, endTime) {
	return {
		//We take the easy (lazy) way out and add another cell to the width so that it never "scrolls"
		gridTop : startTime  - epg.cellSize,
		gridBottom : endTime + epg.cellSize,
		fullWidth : true
	};
};


/**
 * Queries the EPG and returns the program list for each channel at a given time slot.
 * @param  {Channel} channel
 * @param  {Number} startTime - Timestamp of the start time to display
 * @param  {Number} endTime   - Timestamp of the end time to display
 * @return {array}
 */
epg.prototype.getEPGChannelData = function getEPGChannelData(channel, startTime, endTime)
{
	var now = (new Date() / 1000) >> 0;
	// NGM.trace('Getting VDATA');
	// NGM.trace('Channel', channel.name);
	// NGM.trace('startTime', tsToString(startTime));
	// NGM.trace('endTime', tsToString(endTime));

	//We stretch the time slot to the nearest half hour
	// startTime -= startTime % epg.cellSize;
	// endTime   += epg.cellSize - endTime % epg.cellSize;

	var livechannel = NGM.main.getChannelByZap(channel.zapNumber),
		list = NGM.epg.createRange(livechannel, startTime, endTime, false, false),
		length = list.length;

	//NUNCA ENTRA AAQUÍ PQ SIEMRE ESTÁ UNDEFINED EL THE EDGE STEP: XFR
	if (this.toTheEdgeStep > 0) {
		if (endTime <= now)
			return;
		if (startTime <= now)
			startTime = now;
	}

	//Para controlar cuando no haya EPG
	if(length <= 1 && channel.type == "C"){ //sin EPG y que sean canales
		this.withoutEpg ++;
	}

	var genDummy = false;
	if (!length) {
		NGM.trace('epg.createRange didn\'t return anything. This shouldn\'t have happened.');
		NGM.dump(channel);
		genDummy = true;
		length = 1;
		list = [{
			startTime: startTime,
			endTime: endTime,
			duration: endTime - duration
		}];
		//this should never happen as at least a dummy program event should be returned
		// return null;
	}

	var firstProg = list[0];
	var lastProg = list[length - 1];
	var dummyProgram;
	if (genDummy || ( length === 1 && list[0].instanceOf('ProgramEventDummy') )) {
		dummyProgram = list[0];
		list[0] = {
			duration : dummyProgram.duration,
			startTime : dummyProgram.startTime,
			endTime : dummyProgram.endTime,
			name : (dummyProgram.endTime < now ? 'No disponible' : 'Programa desconocido'),
			isDummy : true,
		};
	} else {

		if (startTime < firstProg.startTime) {
			// NGM.trace('startTime < firstProg.startTime');
			list.unshift({
				duration : firstProg.startTime - startTime,
				startTime : startTime,
				endTime : firstProg.startTime,
				name : (firstProg.startTime < now ? 'No disponible' : 'Programa desconocido'),
				isDummy : true,
			});
			length++;
		}

		if (endTime > lastProg.endTime) {
			// NGM.trace('endTime > lastProg.endTime');
			// NGM.trace(tsToString(endTime) +' > '+ tsToString(lastProg.endTime));
			list.push({
				duration : endTime - lastProg.endTime,
				startTime : lastProg.endTime,
				endTime : endTime,
				name : (endTime < now ? 'No disponible' : 'Programa desconocido'),
				isDummy : true,
			});

			length++;
		}
	}

	var prevStartTime = 0;
	var prevEndTime = 0;
	var result = [];

	// NGM.trace('List length: ', length);
	for (var i = 0; i < length; i++) {

		var program = list[i];
		// Do not display program without name
		if (!program.name){
			continue;
		}

		// Duplicated program?
		if (program.startTime === prevStartTime){
			NGM.trace('Duplicated. Ignoring '+program.name);
			continue;
		}

		// Overlaping program?
		if (program.startTime < prevEndTime){
			NGM.trace('Overlapping. ('+channel.zapNumber+') Trimming '+program.name+' from: '+ tsToString(program.startTime)+ ' to: '+tsToString(prevEndTime));

			if(program.endTime <= prevEndTime){
				NGM.trace('Program ends before the previous one. Ignoring it instead');
				continue;
			}

			program.startTime = prevEndTime;
		}

		prevStartTime = program.startTime;
		prevEndTime = program.endTime;

		if (program.toString().indexOf("ProgramEventDummy") !== -1) {
			dummyProgram = program;
			program = {
				duration : dummyProgram.duration,
				startTime : dummyProgram.startTime,
				endTime : dummyProgram.endTime,
				name : (dummyProgram.endTime < now ? 'No disponible' : 'Programa desconocido'),
				isDummy : true,
			};
		}

		//convert past_nocatchup to dummy program
		//var programStatus = EPG.getProgramStatus(program);

		var programStatus = "";

		if (programStatus === 'past_nocatchup') {
			program = {
				duration : program.duration,
				startTime : program.startTime,
				endTime : program.endTime,
				name : 'No disponible',
				isDummy : true,
			};
		}

		//XFR: Matching con la información de los servicios
		//NGM.trace(program.name+"--"+program.startTime+"--"+program.endTime);
		var current = isCurrentFunction(program.name, program.startTime, program.endTime);
		var hasCTV = hasCTVFunction(program.name, program.startTime, program.endTime, channel);
		var rating = programRatingsSTB[program.parentalRating]; //This is a global variable stored in constants.js
		var isLocked = this.home.isLockedFunction({"rating": rating});
		var isPast = isPastFunction(program.name, program.endTime, hasCTV);
		var programStart, programEnd;
		var maxLength = 4 * 60 * 60;
		//duplicate the program every 6 hours if it is longer
		for (programStart = program.startTime; programStart < program.endTime; programStart += maxLength) {
			programEnd = programStart + maxLength;
			if (program.endTime < programEnd) {
				programEnd = program.endTime;
			}

			if (programEnd >= startTime && programStart <= endTime) {
				current = isCurrentFunction(program.name, programStart, programEnd);

				//program.startTime and program.endTime stay the same since program is immutable
				result.push({
					// internal grid widget fields
					"isCurrent": current,
					"hasCTV": hasCTV,
					"isLocked": isLocked,
					"isPast": isPast,
					"isRecordable": isRecordable,
					"isCtvRec": channel.isCtvRec,
					"gridTop" : programStart,
					"gridBottom" : programEnd,

					// users fields
					"program" : program,
					"channel" : channel,
					"eventCB" : {
						//This callback will be automaticly call by gridWidget before removing cell with the cell object as parameter.
						//"onRemove" : this._onProgramCellRemove, //This method doesn't exist
					},
				});
			}else{
				// NGM.trace('programEnd >= startTime && programStart <= endTime');
				// NGM.trace(tsToString(programEnd) +' >= ' + tsToString(startTime) +' && ' + tsToString(programStart) +' <= ' + tsToString(endTime));

			}
		}
	}

	// NGM.dump(result);
	return result;
};

function isCurrentFunction(name, start, end){
	var now = new Date().getTime();
	start = start * 1000;
	end = end * 1000;
	if((start < now) && (end > now))
		return true;
	else
		return false;
}

function isPastFunction(name, end, hasCTV){
	var now = new Date().getTime();
	end = end * 1000;

	if((end < now) && (name != "No disponible"))
		return true;
	else
		return false;
}



function isFutFunction(name, start, end){
	var now = new Date().getTime();
	start = start * 1000;
	end = end * 1000;

	if((end > now ) && (name != "No disponible"))
		return true;
	else
		return false;

}

//revisado

function hasCTVFunction(name, start, end, channel){
	var now = new Date().getTime();
	start = start * 1000;
	end = end * 1000;

	if((end < now) && (name != "No disponible") && (channel.isCTV))
		return true;
	else
		return false;
}

epg.prototype.showError = function showError() {
	var w = this.widgets,
		header = w.headerBg,
		date = w.dateBg,
		grid = this.currentGrid;

	w.info.stateChange("enter");
	this.showErrorDelay.bind(this).delay(300);


};

epg.prototype.initDates = function initDates()
{
	var w = this.widgets;
	var daysFocus = w.daysFocus;
	var listItems = [];
	var maxDays = epg.daysAround;
	var d;
	for (var i = -maxDays; i <= maxDays; i++) {
		d = new Date();
		d.setMinutes(0);
		d.setHours(1);
		d.setDate(d.getDate() + i);

		listItems.push({date: d, isFirst: (i === -maxDays), isLast: (i === maxDays)});
	}

	this.availableDays = listItems;
	this.currentDayIx = maxDays;
	daysFocus.setData(listItems[maxDays]);
	daysFocus.stateChange('enter');
};

/* !GROW */
epg.prototype.cellFocused = function cellFocused(cell, focusCanvas, focusPosition, animationParent){

	this.unsetTimer('growTimer');

	//Remember X and Y are flipped.
	var visibleLeft = cell.visibleTop;
	var visibleRight = cell.visibleBottom;

	var prog = cell.data.program;
	var width = visibleRight - visibleLeft;
	var height = cell.width;
	var deltaGrow, newWidth, growFocusedCell;
	var vpWidth = focusCanvas.getContext('2d').viewportWidth;
	var t = Canvas.makeText(prog.name+"" , new Rect(0, 0, 1280, 72), epg.custo.get('cellFocusText'));
	var labelCanvas;

	if(t.text.drawWidth > width - 20 - epg.cellMargin){
		newWidth  =  t.text.drawWidth + 40;


		focusCanvas.labelCanvas = labelCanvas = new Canvas.JSCanvas();
		labelCanvas.custo = focusCanvas.custo;
		labelCanvas.init(newWidth, height);
		labelCanvas.compositerClient.name = "FocusLabel";

		deltaGrow = newWidth - width;
		visibleRight += deltaGrow;

		// NGM.trace('Setting grow timer: '+deltaGrow);

		// NGM.trace('focusPosition.x: '+ focusPosition.x + ' visibleLeft: '+visibleLeft + ' visibleRight: '+visibleRight);
		focusPosition.x += visibleLeft;
		visibleRight += visibleLeft;
		visibleLeft = 0;

		//For testing
		// focusCanvas.getContext('2d').clear();
		// focusCanvas.getContext('2d').swapBuffers();

		this.timers.growTimer = this.growFocusedCellCB.delay(500, this, labelCanvas, cell, newWidth, height, deltaGrow, focusPosition, animationParent);
		// growFocusedCell();
	}

};

/**
 * Callback that calls the function that draws the popup label.
 *
 * @param  {Canvas}        canvas
 * @param  {Object}        cell
 * @param  {Number}        newWidth           The new width big enough to hold the text.
 * @param  {Number}        height
 * @param  {Number}        deltaGrow          By how much the canvas grew relative to the *visible* width.
 * @param  {Object}        position           Where to move the canvas.
 * @param  {VirtualClient} animationParent    The canvas'animation parent.
 * @return {void}
 */
epg.prototype.growFocusedCellCB = function growFocusedCellCB(canvas, cell, newWidth, height, deltaGrow, position, animationParent) {
	ctx = canvas.getContext('2d');
	var offset = {x: -10, y: 0};
	var originalWidth = newWidth - deltaGrow;

	epg.drawGrowLabel.call(canvas, cell.data, true, deltaGrow, offset);

	canvas.animation.setParent(animationParent)
		  .setEnable()
		  .zIndex(3)
		  // .move(position.x + offset.x + newWidth/2 ,position.y + offset.y + height/2)
		  .move(position.x + offset.x + originalWidth/2 ,position.y + offset.y + height/2)
		  .stretch(0, 0)
		  .show(1)
		  .move(position.x + offset.x ,position.y + offset.y, 100)
		  .stretch(newWidth, height, 100)
		  .start();

	// ctx.swapBuffers();

};

epg.prototype.prevScroll = {top: 0, left: 0};

/**
 * There's a scroll observer on hgrid.
 * I inverted the top left parameters because the hgrid is flipped for some reason.
 *
 * @param  {VirtualClient} client
 * @param  {Number} top    The amount that top scrolled
 * @param  {NUmber} left   The amount that left scrolled
 * @param  {Number} speed
 *
 * @return {void}
 */
epg.prototype.onScroll = function onScroll(client, top, left, speed){
	this.unsetTimer('refreshTimer');
	deltaTop = this.prevScroll.top - top;
	deltaLeft = this.prevScroll.left - left;
	this.prevScroll = {top: top, left: left};

	this.timers.refreshTimer = this.refreshCb.delay(200, this, deltaTop, deltaLeft);

	//We just care if the user scrolled horizontally.
	//When the data we scroll is in the grid's cache, this will be called with 0 0 so we horribly check which key was pressed last.
	if(left === 0 && this.longPressLastKey !== 'KEY_LEFT' && this.longPressLastKey !== 'KEY_RIGHT'){
		return;
	}

	switch(true){
		case this.currentFocus == 'hours':
			this.updateHoursFocus();
			//Fallthrough
		case this.currentFocus != 'days':
			this.updateTopLeft();
			this.updateTopDate();
		break;
	}

};

epg.prototype.refreshCurrent = function refreshCurrent()
{
	var program, i, len, isCurrent, isPast;
	var grid = this.currentGrid;
	var cells = grid.getCellsList();
	var now = new Date();
	var cellsToRefresh = [];
	var changedCell = false;
		// now.setMinutes(60);

	if(now.getMinutes() % 30 === 0){
		// NGM.trace('Refresh hour row!');
		cellsToRefresh = grid.column[-1].cells;
		changedCell = true;
		this.updateTopLeft();
	}

	for (i = 0, len = cells.length; i < len; i++) {
		data = cells[i].data;
		program = data.program;
		if(!program.startTime){
			continue;
		}

		if( isCurrentFunction(program.name, program.startTime, program.endTime) ){
			// NGM.trace('Will refresh cur' +program.name);
			data.isCurrent = true;
			cellsToRefresh.push(cells[i]);
			continue;
		}

		/*if(!changedCell){
			continue;
		}*/
	

		var end = Math.ceil(program.endTime);
		end = new Date(end * 1000);
		if(epg.compareDate(end, now, 60) === 0){
			data.isPast = true;
			data.isCurrent = false;
			data.hasCTV = !!data.channel.isCTV;
			// NGM.dump(data.channel);
			// NGM.trace('Will refresh prev '+program.name);
			cellsToRefresh.push(cells[i]);
		}
	}

	grid.redrawCells(cellsToRefresh);
};

epg.prototype.autoRefresh = function autoRefresh()
{
	var untilMinute = 60 - (new Date()).getSeconds();
	this.unsetTimer('minutesRefreshTimer');
	this.unsetTimer('startMinuteRepeat');
	this.timers.startMinuteRepeat = (function(){
		this.refreshCurrent();
		this.timers.minutesRefreshTimer = this.refreshCurrent.repeat(60000, this);
	}).delay(untilMinute * 1000, this);
};

/**
 * Returns every column that has a fullWidth cell in view.
 *
 * @return {[type]}      [description]
 */
epg.prototype.findFullWidthColumns = function findFullWidthColumns()
{
	var i, cell;
	var grid = this.currentGrid;
	var columns = grid.column;
	var len = columns.number;
	var ret = [];

	// NGM.trace('columns.atRight: '+columns.atRight + ' columns.atLeft: '+columns.atLeft);
	for(i = -1; i < len; i++){
		cell = columns[i].cells[0];

		if(!cell || !cell.data.fullWidth || i === columns.atRight){ //We do the last check because the lastOne is invisible
			continue;
		}
		// NGM.trace(i);
		// NGM.dump(cell);
		ret.push(cell);
	}

	return ret;


};

epg.prototype.refreshColHeader = function refreshColHeader()
{
	var grid      = this.currentGrid;
	grid.drawCurrentColumnHeader.delay(50, grid);
	// var length    = grid.column.number;
	// var colHeader = grid.colHeaderClient; 
	// var i, col;

	// for (i = 0; i < length; i++) {
	// 	col = colHeader[i];
	// 	if(! (col =  col[0]) ){
	// 		continue;
	// 	}

	// 	epg.drawColHeaderCB.call(col.canvas, col.data);
	// }


};

epg.prototype.refreshCb = function refreshCb(top, left)
{
	var grid = this.currentGrid;
	var fwcolumns;
	var fullRefresh = false;

	this.timers.refreshTimer = false;
	if(left !== 0){
		if( (fwcolumns = this.findFullWidthColumns()) && fwcolumns.length){
			fullRefresh = true;
			grid.refreshDisplay();
		}else{
			grid.redrawCells(grid.getCellsList());
		}

	}

	if(top !== 0 && !fullRefresh){
		this.refreshColHeader();
	}
};

epg.prototype.shouldScroll = function shouldScroll(top, left)
{
	var grid = this.currentGrid;
	var ret = true;
	var column, focus, currentZap, nextColIndex, nextCol, nextZap;
	// We only handle vertical* scrolling here.
	// We let hgrid handle the horizontal* constraints with verticalMinValue and verticalMaxValue.
	//Remember that top and left are switched.
	if(left === 0){
		return true;
	}

	focus = grid.getFocusData();
	column = grid.column;

	currentZap = focus.channel.zapNumber;

	nextColIndex = (left < 0)?column.atLeft:column.atRight;
	nextCol = column[nextColIndex];
	nextZap = nextCol.cells[0].data.channel.zapNumber;

	if(!nextCol.cells.length){
		NGM.trace('No cells');
		//If we are at the top, we focus the hours. We wait untill hgrid finishes its process first.
		if( left < 0){
			this.focusHours.delay(0, this);
		}

		return false;
	}

	if(left < 0){
		ret = nextZap !== 0 && nextZap <= currentZap; //For some reason there are channels with the same zapNumber
		//We validate that the channel is actually the top one before focusing the hours because when the scroll happens too fast columnAtLeft cycles.
		if(!ret && currentZap === this.firstChannel.zapNumber){
			//If we are at the top, we focus the hours. We wait untill hgrid finishes its process first.
			this.focusHours.delay(0, this);
		}
	}else if (left > 0){
		ret = nextZap > currentZap || nextZap === 0;
	}

	// if(!ret){
	// 	NGM.dump(nextCol.cells);
	// 	NGM.trace('nextZap !== 0 && nextZap < currentZap');
	// 	NGM.trace(nextZap+' !== 0 && '+nextZap+' < ' +currentZap);
	// }
	return ret;

};


epg.prototype.updateHoursFocus = function updateHoursFocus()
{
	var top = this.getTopDate();

	var hfocusData = {
		date: top
	};

	// this.widgets.hoursFocus.setData.delay(50, null, hfocusData);
	this.widgets.hoursFocus.setData(hfocusData);
};

epg.prototype.updateTopDate = function updateTopDate(deep)
{
	var curDate = this.getSelectedDay().date;
	var topDate = this.getTopDate();
	var status, ppp, i, testingDay;

	if(!curDate){
		NGM.trace('there\'s no selected date');
		return;
	}

	ppp = epg.compareDate(topDate, curDate, 86400);
	if(ppp === 0){
		// NGM.trace('Es hoy!');
		return;
	}

	status = (this.currentFocus === 'hours')?'active':false;
	if(!deep){
		this.selectDay(this.currentDayIx + ppp, status);
		return;
	}

	for (i = this.availableDays.length - 1; i >= 0; i--) {
		testingDay = this.availableDays[i];
		if(!epg.compareDate(topDate, testingDay.date, 86400)){
			this.selectDay(i, status);
			return true;
		}
	}

};

epg.prototype.updateTopLeft = function updateTopLeft()
{
	// var top = this.currentGrid.getTopValue();
	// var startDate = new Date(top * 1000);
	var startDate = this.getTopDate();
	var data = {date: startDate};

	this.widgets.topLeft.setData(data);
};

/**
 * Returns the date displayed at the 'top' (left) of the grid
 * @return {Date}
 */
epg.prototype.getTopDate = function getTopDate() {
	var top = this.currentGrid.getTopValue();
	return new Date( top * 1000 );
};


epg.prototype.lastChannelNumber = '';
epg.prototype.disableChannelBarInput = false;

/**
 * Manages keypresses for the number keys when the channelBar is in focus.
 * @param  {string} key The key pressed
 * @return {void}
 */
epg.prototype.sendKeyToChannelBar = function sendKeyToChannelBar(key)
{
	if(this.disableChannelBarInput){
		return;
	}

	var keyNumber = key.replace(/^[^\d]+(\d)$/, '$1');
	this.lastChannelNumber += '' + keyNumber;
	var channelComplete = this.lastChannelNumber.length === 3;

	this.widgets.channelBar.setData({number: this.lastChannelNumber});
	// NGM.dump(this.widgets.channelBar, 2);
	this.widgets.channelBar.canvas.getContext('2d').swapBuffers();
	if(this.timers.channelBarTimer || channelComplete){
		unsetTimeAlarm(this.timers.channelBarTimer);
	}

	if(channelComplete){
		this.selectChannelFromBar(this.lastChannelNumber);
	}else{
		this.timers.channelBarTimer = this.selectChannelFromBar.delay(2000, this, this.lastChannelNumber);
	}
};

/**
 * Finds the closest channel in the grid to the specified number.
 * @param  {int} number The zap number to look for.
 * @return {Channel}
 */
epg.prototype.findClosestChannel = function findClosestChannel(number) {
	var channels = this.gridDataInit.horizontal.items;
	var channel, lastDiff, diff, zap, lastChannel;

	/*  We have to loop because the epg has its own channel stereotype... */

	/*channel = NGM.main.getChannelByZap(number);
	if(channel){
		return channel;
	}*/

	for (var i = 0, length = channels.length; i < length; i++) {
		channel = channels[i];
		zap = channel.zapNumber;
		diff = Math.abs(number - zap);
		if(diff === 0){
			return channel;
		}
		//Last channel was closer
		if(diff > lastDiff){
			return lastChannel;
		}
		// NGM.trace('zap: ' + zap + ' number: '+number);
		// NGM.trace('diff: ' + diff + ' lastDiff: '+lastDiff);
		lastDiff = diff;
		lastChannel = channel;
	}

	return false;
};

/**
 * Finds the closest channel to number and selects it in the grid.
 * @param  {int} number
 * @return {void}
 */
epg.prototype.selectChannelFromBar = function selectChannelFromBar(number) {
	var channel;
	this.disableChannelBarInput = true;
	channel = this.findClosestChannel(number);
	if(channel){
		this.setFocusedChannel(channel);
		this.refreshGrid();
	}

	this.hideChannelBar();
	this.disableChannelBarInput = false;
};

epg.prototype.hideChannelBar = function hideChannelBar(key)
{
	unsetTimeAlarm(this.timers.channelBarTimer);
	this.widgets.channelBar.stateChange('exit');
	this.focusEpg();
};

epg.prototype.focusChannelBar = function focusChannelBar(key)
{
	this.disableChannelBarInput = false;
	this.lastChannelNumber = '';
	this.currentFocus = 'channelBar';
	this.sendKeyToChannelBar(key);
	this.widgets.channelBar.stateChange('enter');
};

epg.prototype.focusEpg = function focusEpg()
{
	this.widgets.hoursFocus.stateChange('exit');
	this.currentFocus = 'epg';
	this.selectDay();
	this.currentGrid.refreshFocusCell();
};

epg.prototype.focusHours = function focusHours()
{
	// NGM.trace('Focusing hours');
	this.currentFocus = 'hours';

	// this.currentGrid.focusCellSet(null);

	this.selectDay(this.currentDayIx, 'active');
	this.widgets.hoursFocus.setData({date: this.getTopDate()});
	this.widgets.hoursFocus.stateChange('enter');
	this.currentGrid.focusCellUpdate();
};

epg.prototype.focusDays = function focusDays()
{
	this.currentFocus = 'days';
	// NGM.trace('focusing days');
	var daysFocus = this.widgets.daysFocus;
	// daysFocus.setData({date: new Date(this.currentGrid.getTopValue() * 1000), focus: true});
	var data = this.getSelectedDay();
	data.focus = true;
	daysFocus.setData(data);
};

epg.prototype.longPressCount     = 0;
epg.prototype.longPressLastKey   = false;

epg.prototype.isLongPress = function isLongPress(threshold)
{
	if(!threshold){
		threshold = 5;
	}

	// NGM.trace('press count: ' + this.longPressCount);
	return this.longPressCount > threshold;
};

epg.prototype.updateLongPress = function updateLongPress(_key)
{
	this.longPressTimer();
	if(_key === this.longPressLastKey){
		this.longPressCount++;
	}else{
		this.longPressLastKey = _key;
		this.longPressResetTimer();
	}
};

epg.prototype.longPressResetTimer = function longPressResetTimer()
{
	this.longPressCount = 0;
	this.ignoreKeyPress = false;
};

epg.prototype.longPressTimer = function longPressTimer()
{
	this.unsetTimer('longPressTimerId');

	this.timers.longPressTimerId = this.longPressResetTimer.delay(200, this);
};

/* !Static methods */

epg.getInstance = function getInstance(){
	return epg._instance;
};

epg.formatDate = function formatDate(date, ppp) {
	var day = (ppp === 0)? 'Hoy':commons.weekdays_abrv[date.getDay()].toLowerCase();
	return day + ', ' + date.getDate() + ' ' + commons.months_abrv[date.getMonth()].toLowerCase();
};

epg.newDateItem = function newDateItem(_data) {
	var date = _data.date;
	var ppp = epg.compareDate(date, undefined, 86400 /*24 hours*/);
	var color, custo, txt = epg.formatDate(date, ppp);
	var ctx = this.getContext('2d');
	var size = 18;

	switch(true){
		case ppp === 0:
			color = epg.colors.currentColor;
			size = 20;
		break;
		case ppp < 0:
			color = epg.colors.ctvColor;
		break;
		case ppp > 0:
			color = epg.colors.textColor;
		break;
	}

	custo = JSON_Complete({
		font_size : size,
		fill : color,
		font_family : epg.fonts.defaultFont,
		text_align : "center,middle"
	});

	ctx.beginObject();
	ctx.clear();

	Canvas.drawText(ctx, txt, new Rect(0, 0, ctx.viewportWidth, ctx.viewportHeight), custo);
	ctx.drawObject(ctx.endObject());

};

epg.drawHoursFocus = function drawHoursFocus(_data)
{
	// NGM.dump(this);
	// NGM.dump(_data);
	// NGM.dump('drawing hours focus');
	// NGM.dump(_data);
	var ctx = this.getContext('2d');
	var custo = JSON_Complete({
		font_size : 20,
		fill : 'rgba(0,0,0,1)',
		font_family : epg.fonts.defaultFont,
		text_align : "center,middle"
	});

	var custo_text = JSON_Complete({
		font_size: 20,
		fill: 'black',
		font_family: epg.fonts.defaultFont,
		text_align: "center,middle"
	});

	var date   = _data.date;
	var txt    = getTimeHHMM(date) + ' hrs';
	var height = ctx.viewportHeight;
	var width  = ctx.viewportWidth;
	var x      = 0;
	var y      = 0;

	ctx.beginObject();
	ctx.clear();

	Canvas.drawShape(ctx, "rect", [x, y, width, height],           {fill: epg.colors.focusColor, stroke: epg.colors.focusColor,  stroke_width: 0, stroke_pos: 'inside',  rx: 12});
	Canvas.drawShape(ctx, "rect", [x+5, y+5, width-10, height-10], {fill: epg.colors.focusColor, stroke: epg.colors.strokeColor, stroke_width: 1, stroke_pos: 'inside',  rx: 12});

	Canvas.drawText(ctx, txt, new Rect(0, 0, width, height), custo_text);


	if(!_data.isFirst){
		// Canvas.drawShape(ctx, "circle", [12, height/2, 12], {fill: epg.colors.focusColor});
		tp_draw.getSingleton().drawImage("img/tv/arrowLeftOnCLEAN.png", ctx, -4, 5);
	}

	if(!_data.isLast){
		// Canvas.drawShape(ctx, "circle", [width - 12, height/2, 12], {fill: epg.colors.focusColor});
		tp_draw.getSingleton().drawImage("img/tv/arrowRightOnCLEAN.png", ctx, width - 29, 5);
	}

	ctx.drawObject(ctx.endObject());

};

epg.drawDaysFocus = function drawDaysFocus(_data)
{
	// NGM.dump('drawing days focus');
	// NGM.dump(_data);
	var ctx = this.getContext('2d');
	var custo_text = JSON_Complete({
		font_size : 20,
		fill : epg.colors.futureColor,
		font_family : epg.fonts.defaultFont,
		text_align : "center,middle"
	});
	var date = _data.date;
	var ppp = epg.compareDate(date, undefined, 86400 /*24 hours*/);
	var txt = epg.formatDate(date, ppp);
	var vpWidth = ctx.viewportWidth;
	var vpHeight = 28;
	var rectWidth = (_data.focus || _data.active)?262:128;
	var marginTop = 9;
	var margin = 0;//(_data.focus || _data.active)?1:19;
	var borderColor = epg.colors.futureColor;
	var x = (vpWidth / 2) - (rectWidth / 2);
	var y = marginTop;
	var suffix = 'FUT';
	var iconWidth = 16;
	var iconHeight = 9;
	var actionable = (_data.active || _data.focus);


	if(ppp < 0){
		custo_text.fill = epg.colors.ctvColor;
		borderColor = epg.colors.ctvColor;
		suffix = 'ANY';
	}else if(ppp === 0){
		custo_text.fill = epg.colors.currentColor;
		borderColor = epg.colors.currentColor;
		suffix = 'LIVE';
	}

	ctx.beginObject();
	ctx.clear();

	if(_data.active){
		Canvas.drawShape(ctx, "rect", [x, y, rectWidth, vpHeight], {fill: epg.colors.cellBG, stroke: borderColor, stroke_width: 1, stroke_pos: 'inside'});
	}else if(_data.focus){
		suffix = 'FUT';
		custo_text.fill = epg.colors.strokeColor;
		borderColor = epg.colors.focusColor;
		Canvas.drawShape(ctx, "rect", [x, y, rectWidth, vpHeight], {fill: 'rgba(0,0,0,0)', stroke: epg.colors.focusColor, stroke_width: 5, stroke_pos: 'outside', rx: 5});
		Canvas.drawShape(ctx, "rect", [x, y, rectWidth, vpHeight], {fill: epg.colors.focusColor, stroke: epg.colors.strokeColor, stroke_width: 1, stroke_pos: 'inside', rx: 5});
	}


	Canvas.drawShape(ctx, "rect", [0, Math.floor(vpHeight/2) + marginTop, x - margin, 1], {fill: borderColor});  //Left "border"
	Canvas.drawShape(ctx, "rect", [x + rectWidth + margin, Math.floor(vpHeight/2) + marginTop, x - margin, 1], {fill: borderColor}); //Right "border"

	Canvas.drawText(ctx, txt, new Rect(x, y-4, rectWidth, vpHeight), custo_text);
	// NGM.trace('date: '+ txt);

	if(actionable && !_data.isFirst){
		tp_draw.getSingleton().drawImage("img/tv/arrowLeft"+suffix+".png", ctx, x + 7, y+(vpHeight / 2) - (iconHeight / 2) - 4);
	}

	if(actionable && !_data.isLast){
		tp_draw.getSingleton().drawImage("img/tv/arrowRight"+suffix+".png", ctx, x + rectWidth - (iconWidth + 7), y+(vpHeight / 2) - (iconHeight / 2) - 4);
	}

	ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
};

//fecha de hoy
epg.drawDateBg = function drawDateBg(_data){
	return;
	// var ctx = this.getContext("2d");
	// ctx.beginObject();
	// ctx.clear();

	// var custo = {
	//  fill : "rgba(30, 30, 40, .9)"
	// };
	// Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custo);
	// ctx.drawObject(ctx.endObject());

};


epg.drawService = function drawService(param, focus, visibleLeft, visibleRight)
{
	var ctx = this.getContext("2d");
	var width = ctx.viewportWidth;
	var height = ctx.viewportHeight;
	var custo_cell = {
		fill: epg.colors.cellBG,
		stroke: epg.colors.strokeColor,
		stroke_width: 1,
		stroke_pos: "inside"
	};


	var custo_text = JSON_Complete({
		font_size: 20,
		fill: epg.colors.textColor,
		font_family: epg.fonts.defaultFont,
		text_align: "left,middle"
	});

	if(focus){
		custo_cell.fill = epg.colors.focusColor;
		custo_text.fill = epg.colors.textColor;
		custo_text.fill = "rgba(1,1,1,1)";
		if(epg.getInstance().currentFocus !== 'epg'){
			return epg.drawFocusCellOutOfFocus.call(this, param, visibleLeft, visibleRight);
		}
	}

	Canvas.drawShape(ctx, "rect", [visibleLeft - 10, 0, visibleRight, height], custo_cell);
	Canvas.drawText(ctx, param.program.name , new Rect(visibleLeft + 10, 0, visibleRight-10, height), custo_text);
	// tp_draw.getSingleton().drawImage("img/tv/anytime/anytimeOn.png", ctx, 0, 1);


};

epg.drawInteractive = function drawInteractive(param, focus, visibleLeft, visibleRight)
{

	// NGM.trace('param: ' + param + 'focus: ' + focus + 'visibleLeft: ' + visibleLeft + 'visibleRight: '+visibleRight);
	var ctx = this.getContext("2d");
	var margin = epg.cellMargin;
	var width = ctx.viewportWidth;
	var height = ctx.viewportHeight - margin;
	var y = margin;
	var img = param.channel.images.url13X2;
	var custo_cell = {
		fill: epg.colors.cellBG,
		stroke: epg.colors.strokeColor,
		stroke_width: 1,
		stroke_pos: "inside"
	};

	var custo_text = JSON_Complete({
		font_size: 20,
		fill: epg.colors.textColor,
		font_family: epg.fonts.defaultFont,
		text_align: "left,middle"
	});

	ctx.beginObject();
	ctx.clear();

	if(focus){
		custo_cell.fill = 'rgba(240,240,250,0)';
		custo_cell.stroke = epg.colors.textColor;
		custo_cell.stroke_width = (epg.getInstance().currentFocus === 'epg')? 5: 2;

		custo_text.fill = 'rgba(1,1,1,1)';
/*      if(epg.getInstance().currentFocus !== 'epg'){
			return epg.drawFocusCellOutOfFocus.call(this, param, visibleLeft, visibleRight);
		}
*/
		Canvas.drawShape(ctx, "rect", [visibleLeft, y, visibleRight - visibleLeft, height], custo_cell);
	}else{
		custo_cell.fill = 'rgba(240,240,20,1)';
		custo_cell.stroke = epg.colors.textColor;
		custo_cell.stroke_width = 5;

		if(img){
			tp_draw.getSingleton().drawImage(img, ctx, visibleLeft, y);
		}

		Canvas.drawText(ctx, 'OK PARA IR A LA APP' , new Rect(visibleLeft + 832 + 10, 0, visibleRight-10, height), custo_text);
	}


	ctx.drawObject(ctx.endObject());

};

/**
 * If a program is current, calculates the size of the progress bar.
 * @param  {Number} startTime
 * @param  {Number} endTime
 * @param  {Number} width
 * @return {Number}
 */
epg.progressWidth = function progressWidth(startTime, endTime, width)
{
	var min = 1;
	var now = Math.round((new Date()).getTime() / 1000);
	var fullLength =    endTime - startTime;
	var partialLength = now - startTime;
	var ret = width * (partialLength / fullLength);

	if(ret < min){
		ret = min;
	}

	// NGM.trace('startTime: '+ tsToString(startTime) + ' now: '+ tsToString(now) + ' width: '+ width + ' newWidth: '+(width * (partialLength / fullLength)));
	return ret;
};


//dibuja programa
epg.drawCellCB = function drawCellCB(param, focus, visibleLeft, visibleRight)
{

	var ctx = this.getContext("2d");

	var prog = param.program;

	// NGM.trace('Drawing '+prog.name);
	// NGM.trace(prog.name + ' visibleLeft: ' + visibleLeft + ' visibleRight: ' + visibleRight);
	var custo = {"fill" : "rgba(240, 240, 250, .3)"};

	var margin = epg.cellMargin;
	var custo_text = epg.custo.get('cellText');
	var custo_cell = epg.custo.get('cell');

	// NGM.trace(custo_text);
	var vpWidth = ctx.viewportWidth;
	var width = visibleRight - visibleLeft;
	var height = ctx.viewportHeight;
	var textMarginLeft = 10;
	var textMarginRight = 20 + margin;
	var x = visibleLeft;

	//colores
	var c = epg.colors;
	var ctvColor     = c.ctvColor,
		currentColor = c.currentColor,
		dummyColor   = c.dummyColor,
		focusColor   = c.focusColor;
	var indicatorWidth;

	height -= margin;

	if(focus && epg.getInstance().currentFocus !== 'epg'){
		return epg.drawFocusCellOutOfFocus.call(this, param, visibleLeft, visibleRight);
	}

	// NGM.trace('visibleLeft: '+ visibleLeft + ' visibleRight: '+ visibleRight+ ' width: '+ width);

	if(!prog){
		//DIBUJA EL PROGRAMA
		return NGM.trace('No prog');
	}

	ctx.beginObject();
	ctx.clear();

	if (!prog.isDummy) {
		indicatorWidth = vpWidth-margin;
		if(param.isCurrent){
			custo.fill = currentColor;
			custo_cell.fill = c.currentCellColor;
			indicatorWidth =  epg.progressWidth(param.gridTop, param.gridBottom, indicatorWidth);
		}else if(!param.isPast){
			custo.fill = c.transparent;
		} else if(param.isCtvRec && param.hasCTV){
			custo.fill = ctvColor;
		} else if(param.hasCTV){
			custo.fill = ctvColor;
		} else{
			custo.fill = dummyColor;
		}
		if(focus){
			custo_cell = epg.custo.get('cellFocus');
			custo_text = epg.custo.get('cellFocusText');
		}

		Canvas.drawShape(ctx, "rect", [x, 67, indicatorWidth - x, 4], custo);
	}else if(focus){
		custo_cell.fill = c.dummyfocusColor;
	}
	
	if(focus){
		textMarginLeft--;
	}

	Canvas.drawShape(ctx, "rect", [x, margin, width - margin, height], custo_cell);

	// if(prog.isDummy){
	// 	// NGM.trace('Drawing dummy program');
	// 	if(!focus){
	// 		Canvas.drawText(ctx, prog.name+"" , new Rect(x + textMarginLeft, 0, width-textMarginLeft, height), custo_text);
	// 	}
	// }else{
	// }
		
	Canvas.drawText(ctx, prog.name+"" , new Rect(x + textMarginLeft, 0, (width < textMarginRight) ? width : width - textMarginRight, height), custo_text);

	if(param.isLocked){
		tp_draw.getSingleton().drawImage('img/tv/bloqueado.png', ctx, visibleRight - 30, 6);
	}
	ctx.drawObject(ctx.endObject());

	// NGM.trace('Lock stats');
	// NGM.dump(epg.getInstance().currentGrid.lockCount);
};

/**
 * When a cell's text is too small to fit in the cell, draws a label that fits the cell.
 * @param  {Object} data
 * @param  {boolean} focus
 * @param  {Number} visibleLeft
 * @param  {Number} visibleRight
 * @param  {Number} deltaGrow    How much the canvas grew from the original cell.
 * @param  {Object} offset       If we moved the canvas off its original position and by how much
 * @return {void}
 */
epg.drawGrowLabel = function drawGrowLabel(data, focus, deltaGrow, offset)
{
	var ctx             = this.getContext('2d');
	var custoLabel      = epg.custo.get('cellFocusLabel');
	var custoLabelText  = epg.custo.get('cellFocusLabelText');
	var width          = ctx.viewportWidth;
	var height          = ctx.viewportHeight;
	var textMarginLeft  = 20;
	var textMarginRight = 20;
	var margin          = epg.cellMargin;
	var x               = 0;
	var y               = margin;
	var labelHeight     = 30;
	var labelY          = margin + (height / 2) - (labelHeight / 2) - 5;

	height -= margin;

	// NGM.trace('Grooooooow!!! '+offset.x);

	ctx.beginObject();
	ctx.clear();

	Canvas.drawShape(ctx, "rect", [x, labelY, width - margin, labelHeight], custoLabel);
	Canvas.drawText(ctx, data.program.name+"" , new Rect(x + textMarginLeft, 0, (width < textMarginRight) ? width : width - textMarginRight, height), custoLabelText);

	ctx.drawObject(ctx.endObject());

};

/**
 * Draws the EPG's currently focused cell when the epg does not have focus. e.g. When the hours or days list is focused.
 *
 * @param  {Objects} param        The parameters passed to the cell from the creator.
 * @param  {Number} visibleLeft
 * @param  {Number} visibleRight
 * @return {void}
 */
epg.drawFocusCellOutOfFocus = function drawFocusCellOutOfFocus(param, visibleLeft, visibleRight) {

	var canvas = this;
	var ctx = canvas.getContext('2d');

	var custo_cell = {
		fill: 'rgba(30,30,40, 1)',
		stroke: epg.colors.textColor,
		stroke_width: 2,
		stroke_pos: "inside"
	};

	var custo_text = JSON_Complete({
		font_size: 20,
		fill: epg.colors.textColor,
		font_family: epg.fonts.defaultFont,
		text_align : "left,middle"
	});

	var margin = epg.cellMargin;
	var x = 10;
	var y = margin;
	var width = ctx.viewportWidth - margin;
	var height = ctx.viewportHeight - margin  - 4;
	var prog = param.program;


	ctx.beginObject();
	ctx.clear();

	Canvas.drawShape(ctx, "rect", [visibleLeft, y, visibleRight - visibleLeft - margin, height], custo_cell);

	if (visibleLeft > 0) {
		x += visibleLeft;
		width = width - visibleLeft;
	}
	if(prog.isDummy){
		// NGM.trace('Drawing dummy program');
		Canvas.drawText(ctx, prog.name+"" , new Rect(x, 0, width-10, ctx.viewportHeight - margin), custo_text);
	}else{
		Canvas.drawText(ctx, prog.name+"" , new Rect(x, y, width-40, height - margin), custo_text);
	}


	ctx.drawObject(ctx.endObject());
};

/**
 * Draws the header cell containing the hours.
 * @param  {Object} param        The cell definition
 * @param  {bool} focus          If it's focused
 * @param  {[type]} visibleLeft  [description]
 * @param  {[type]} visibleRight [description]
 * @return {[type]}              [description]
 */
epg.drawRowHeaderCB = function drawRowHeaderCB(param, focus, visibleLeft, visibleRight)
{
	var ctx = this.getContext("2d");
	epg.drawHourCell(ctx, new Date(param.gridTop * 1000));
};

/**
 * Draws the top left pseudo-cell.
 * @param  {Object} _data
 * @return {void}
 */
epg.drawTopLeft = function drawTopLeft(_data)
{

	var startDate = _data.date;
	var ctx = this.getContext("2d");
	if(typeof startDate === 'undefined'){
//      NGM.trace('No date! Caller: '+ arguments.callee.caller.name);
		startDate = epg.getInstance().getTopDate();
	}

	var curMins = startDate.getMinutes();
	curMins -= curMins % 30;
	// NGM.trace(curMins + ' '+ curMins % 30);
	startDate.setMinutes(curMins - 30);
	startDate.setSeconds(0);

	epg.drawHourCell(ctx, startDate, {xOffset: -59, xTxtOffset: 24});
};

epg.drawHourCell = function drawHourCell(ctx, dateToDraw, conf){
	var c          = epg.colors;
	var custo_text = JSON_Complete({
		font_size:   18,
		fill:        c.futureColor,
		font_family: epg.fonts.defaultFont,
		text_align:  "center,middle"
	});

	var custo_cell = {
		fill:         c.hoursCellBG,
		stroke:       c.strokeColor,
		stroke_width: 1,
		stroke_pos:   "inside",
		rx:           5
	};

	var xOffset    = (conf.xOffset)?conf.xOffset+0:0;
	var xTxtOffset = (conf.xTxtOffset)?conf.xTxtOffset+0:0;
	var now        = new Date();
	var min        = now.getMinutes()>29 ? 30:0;
	var ts         = dateToDraw.getTime();
	var vpWidth    = ctx.viewportWidth;
	var vpHeight   = 32; //vpHeight is actually 72
	var width      = 250;
	var height     = 32;
	var x          = (vpWidth - width) / 2 + xOffset;
	var y          = (vpHeight - height) / 2;

	// NGM.trace('vpWidth: '+ vpWidth + ' width: '+ width+ ' x: '+ x);

	ctx.beginObject();
	ctx.clear();

	now.setMinutes(min);
	now.setSeconds(0);
	now.setMilliseconds(0);
	now = now.getTime();

	if(ts == now){
		custo_cell.fill      = c.currentColor;
		custo_text.fill      = c.textColor;
		// custo_text.font_size = 19;
	} else if(ts < now){
		custo_text.fill = c.ctvColor;
	}

	Canvas.drawShape(ctx, "rect", [x, y, width, height], custo_cell);

	Canvas.drawText(ctx, getTimeHHMM(dateToDraw)+ " hrs" , new Rect(x + xTxtOffset, y, width, height), custo_text);

	ctx.drawObject(ctx.endObject());
	ctx.swapBuffers();
	return true;
};

//MGR función que pinta los nombres de los canales
epg.drawColHeaderCB = function drawColHeaderCB(data) {

	// NGM.dump(data);
	var ctx        = this.getContext("2d");
	var channelImg = data.images.url1X1;
	var margin     = epg.cellMargin;
	var marginLeft = 67;
	var y          = margin;
	var height     = 72 - margin;
	var txtWidth   = 38;
	var cellColor  = 'rgba(0,0,0,0)';
	var yFix       = -3;
	var cellCusto, drawBadge;

	if(!data.zapNumber){
		ctx.clear();
		return;
	}

	if(data.isCTV){
		cellColor = epg.colors.ctvColor;
		drawBadge = 'img/tv/anytime/AnytimetvON.png';
	}else if(data.isCtvRec){
		drawBadge = 'img/tv/anytime/AnytimetvOFF.png';
		cellColor = epg.colors.ctvRecColor;
	}

	cellCusto  = {
		fill: '0-'+cellColor+'|.9-rgba(0,0,0,0)',
		fill_coords: '0,0.5,1,.5'
	};
	ctx.beginObject();
	ctx.clear();

	// Canvas.drawShape(ctx, "rect", [0, y, ctx.viewportWidth, height], cellCusto);

	if(drawBadge){
		tp_draw.getSingleton().drawImage(drawBadge, ctx, 0, 4);
	}

	var custo = JSON_Complete({
		font_size : 18,
		fill : epg.colors.textColor,
		font_family : epg.fonts.defaultFont,
		text_align : "right,middle"
	});
	var str = data.name+"";
		 //isCtv

	Canvas.drawText(ctx, data.zapNumber+"", new Rect(marginLeft, y + yFix,txtWidth, height), custo);

	if(channelImg){
		tp_draw.getSingleton().drawImage(channelImg, ctx, marginLeft + txtWidth + 15, (height / 2)  + yFix - 14);
		//Zap | logo separator
		Canvas.drawShape(ctx, "rect", [marginLeft + txtWidth + 5, 25 + yFix, 1, 30], {fill: epg.colors.strokeColor});
	}

	//Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], {"fill":"rgba(255,255,255,.8)"});
	ctx.drawObject(ctx.endObject());
};

/**
 * Compares two dates and returns if it's past current or future considering precision.
 * @param  {Date} date1
 * @param  {Date} date2    - Defaults to the current date
 * @param  {int} precision - In seconds. By default we evaluate in 30 minute chunks so if date1 15:30 and date2 is 15:46 it is NOT considered to be current.
 * @return {int}           - -1 if it's in the past, 0 if it's current and 1 if it's in the future
 */
epg.compareDate = function compareDate(date1, date2, precision, trace) {
	if(!date1){
		NGM.trace('date 1 is not a date');
		NGM.trace(arguments.caller.callee.name);
		return false;
	}

	if(typeof precision === 'undefined'){
		precision = epg.cellSize; //60 * 30
	}

	if(!date2){
		date2 = new Date();
	}

	precision *= 1000;
	var now = date2.getTime();
	var toEvaluate = date1.getTime();

	now -= date2.getTimezoneOffset() * 60 *1000;
	toEvaluate -= date1.getTimezoneOffset() * 60 *1000;

	if (trace) {
		NGM.trace('Comparing: '+tsToString(toEvaluate, true) + 'UTC === ' + tsToString(now, true) + 'UTC');
	}

	var evaluatePast = function(now, toEvaluate){
		if(trace){
			NGM.trace((now % precision) / 1000 / 60 + 'min. - quitamos - min. ' + (toEvaluate % precision) / 1000 / 60);
			NGM.trace((now - now % precision) + ' > ' + (toEvaluate - toEvaluate % precision));
			NGM.trace(tsToString(now - now % precision, true) + ' > ' + tsToString(toEvaluate - toEvaluate % precision, true));
			NGM.trace((now - now % precision) > (toEvaluate - toEvaluate % precision));
		}
		return (now - now % precision) > (toEvaluate - toEvaluate % precision);
	};

	if(evaluatePast(now, toEvaluate)){
		if (trace) {
			NGM.trace('Is Past');
		}
		return -1;
	}

	//We sum precision to now and evaluate again. if it's now in the past it means that it's in our current block of time;
	if(evaluatePast(now + precision, toEvaluate)){
		if (trace) {
			NGM.trace('Is Present');
		}
		return 0;
	}

	if (trace) {
		NGM.trace('Is Future');
	}
	return 1;
};


/**
 * Draws the background for the hours row.
 * @param  {Object} _data
 * @return {void}
 */
epg.drawHeaderBg = function drawHeaderBg(_data){
	//This is not used in the new design.
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();

	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], {fill : 'red'});
	//Top border
	Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, 1], {fill: epg.colors.strokeColor});

	ctx.drawObject(ctx.endObject());
};

epg.drawInfo = function drawInfo(_data){
	NGM.trace('drawing info');

	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();

	var custo = {
		"fill" : "rgba(0,0,0,1)"
	};

	var custoName = this.themaData.custoTextName,
		custoDate = this.themaData.custoTextDescription,
		custoDes = this.themaData.custoTextDescription;

	var custo_text = JSON_Complete({
			"font_size" : 35,
			"fill" : "rgba(255,255,255,1)",
			"font_family": epg.fonts.defaultFont,
			"text_align" : "left,middle",
			"text_multiline": true
	});

	var x = 250;
	var w = 680;

	// if(!_data.error)
		//tp_draw.getSingleton().drawImage(_data.tvProgramImageUrlL,true,ctx, 0, 0,null,null,null,"destination-over");



	if(_data.error){
		custo.fill = "rgba(0,0,0,1)";
		// Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custo);
		tp_draw.getSingleton().drawImage("img/commons/0x0-Back_Wood-BW_HD.jpg",true,ctx, 0, 0,null,null,null,"destination-over");
		custo_text.font_size = 30;
		custo_text.text_align = "center,middle";
		Canvas.drawText(ctx, _data.msg, new Rect(0, -10, ctx.viewportWidth, ctx.viewportHeight), custo_text);
	}else{
		custo.fill = "rgba(0,0,0,.8)";
		//Canvas.drawShape(ctx, "rect", [0, 0, ctx.viewportWidth, ctx.viewportHeight], custo);
		//name
		//Canvas.drawText(ctx, _data.nameProgram+"", new Rect(x,0,w,80), custo_text);
		//date
		var date = fechaTexto(_data.dateStart) + " de " + _data.startTime + " hrs. - " + _data.endTime +" hrs.";
		Canvas.drawText(ctx, date, new Rect(x,91,w,50), custoDate);
		//category
		Canvas.drawText(ctx,_data.showType, new Rect(x+52,127,w,50), custoDate);
		//tp_draw.getSingleton().drawImage("imgs/commons/ratings/"+_data.clasif+".png",false,ctx,x,127);
		//description
		Canvas.drawText(ctx,_data.actors, new Rect(x,160,w,50), custoDes);
		//validación isLocked
		if(_data.isLocked)
			Canvas.drawText(ctx, "Lo sentimos, este programa se encuentra bloqueado.", new Rect(x,205,w,100), custoDate);
		else
			Canvas.drawText(ctx, _data.description, new Rect(x,205,w,100), custoDate);

		Canvas.drawShape(ctx, "rect", [x,120, w, 1], { fill : "rgba(100, 100, 100, 1)" });
		//logo
		//tp_draw.getSingleton().drawImage(_data.channelImageUrlL,true,ctx, 10, 21);

	}
	ctx.drawObject(ctx.endObject());
};


epg.prototype.toggleOnion = function toggleOnion(){
	// NGM.dump('toggle');
	this.onionState = !this.onionState;
	// NGM.dump(this.onionState);
	this.widgets.base.stateChange(!this.onionState?'enter':'exit');
};

epg.drawOnion = function drawOnion(_data){
	var ctx = this.getContext("2d");
	ctx.beginObject();
	ctx.clear();

	tp_draw.getSingleton().drawImage("DevsOnion.png", ctx, 0, 0);

	ctx.drawObject(ctx.endObject());

};
