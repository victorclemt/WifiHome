// ***************************************************************************
// * Debug
// ***************************************************************************
//DBG_registerModule(grid, "GRID", settings.get("debug.widget.grid"), "Grid widget");

// ***************************************************************************
// * Notes :
// * Traces show that time is split as:
// *    - 50% to get datas
// *    - 50% to draw the canvas
// ***************************************************************************

/*
	Virtual clients hierarchy:
	client "HGridWidget"
		-> colHeaderClientContainer
			-> colHeaderClient
		-> rowHeaderClientContainer
			-> rowHeaderClient
		-> gridClientContainer
			-> gridClient

 */
/**
 * Represents a grid with a headerColumn and a headerRow
 * @constructor
 */
function HGridWidget(param, options)
{

	NGM.trace("HGRID.JS - Create grid");

	var zIndex          = param.zIndex - 0,
		w               = param.w - 0,
		h               = param.h - 0,
		colHeaderHeight = param.colHeader.h ? param.colHeader.h-0 : 0,
		rowHeaderWidth  = param.rowHeader.w ? param.rowHeader.w-0 : 0,
		rowHeaderMargin = param.rowHeader.margin ? param.rowHeader.margin-0 : 0;

	// NGM.trace(rowHeaderMargin);
	this.super(param, options);

	var virtualClient = Anim.VirtualClient;
	// main client
	var client = this.client = new virtualClient("HGridWidget", zIndex, h, w);

	client.compositerClient.screen=true;

	// column header clients
	var colHeaderClientContainer = this.colHeaderClientContainer = new virtualClient("colHeaderClientContainer", zIndex + 1, colHeaderHeight, w);
	colHeaderClientContainer.animation.setParent(client).move(0, rowHeaderWidth+rowHeaderMargin).setEnable(true).start();
	colHeaderClientContainer.compositerClient.screen=true;

	var colHeaderClient = this.colHeaderClient = new virtualClient("colHeaderClient", zIndex, colHeaderHeight, w);
	this.colHeaderClient.animation.setParent(colHeaderClientContainer).setEnable(true).start();
	this.colHeaderClient.height = colHeaderHeight;

	// row header clients
	var rowHeaderClientContainer = this.rowHeaderClientContainer = new virtualClient("rowHeaderClientContainer", zIndex + 1, h, rowHeaderWidth);
	rowHeaderClientContainer.animation.setParent(client).move(colHeaderHeight, 0).setEnable(true).start();
	rowHeaderClientContainer.compositerClient.screen=true;

	var rowHeaderClient = this.rowHeaderClient = new Anim.VirtualClient("rowHeaderClient", zIndex, h, rowHeaderWidth);
	rowHeaderClient.animation.setParent(rowHeaderClientContainer).setEnable(true).start();
	rowHeaderClient.width = rowHeaderWidth;

	// grid clients
	var gridClientHeight = h-colHeaderHeight;
	var gridClientContainer = this.gridClientContainer = new virtualClient("gridClientContainer", zIndex, gridClientHeight, w-rowHeaderWidth-rowHeaderMargin);
	gridClientContainer.animation.setParent(client).move(colHeaderHeight, rowHeaderWidth+rowHeaderMargin).setEnable(true).start();
	gridClientContainer.compositerClient.screen=true;

	var gridClient = this.gridClient = new virtualClient("gridClient", zIndex, gridClientHeight, w-rowHeaderWidth-rowHeaderMargin);
	gridClient.animation.setParent(gridClientContainer).setEnable(true).start();
	gridClient.height = gridClientHeight;

	this.anim   = this.newAnimationFromJSON(param, client);
	this.parent = options.parent;
	this.json   = param;
	this.speed  = param.speed-0;
	this.width  = w;
	this.height = h;
	this.custo  = options.custo;
	this.draw   = param.draw;
	this.events = param.events;
	this.ratio  = param.ratio ? param.ratio : 1;
	this.container = options.container;
	// this.anim.setParent(options.container).setEnable(true).start();
	this.anim.setEnable(true).start().setParent(this.container);

	// define vertical scroll method (cell or numeric step)
	var step = this.verticalScrollStep = param.verticalScrollStep;
	if (step>=0){
		this.verticalScrollStep = step -0;
	}

	NGM.trace('Default step', step);

	this.defaultStep = step / this.ratio;

	this.longPressVScrollStep = param.longPressVScrollStep -0;

	// define scroll rule to the edges
	this.toTheEdgeStep = param.scrollToTheEdge ? this.defaultStep : 0;

	// Focus
	var focusTop = param.focusTop >= 0 ? param.focusTop-0: this.height/2;
	this.focus = {
		"top"     : focusTop,
		"topValue": focusTop/this.ratio,
	};

	this.resetLongPress();

	this.asyncTimer = {};
}

HGridWidget.inherits(Widget);

//HGridWidget.prototype._cellCount = 0;
HGridWidget.prototype.refreshDelay = 0;

HGridWidget.prototype.lockCount = {};
/**
 * Used instead of client.lock() to debug the lock/unlock actions on the clients
 *
 * @param  {Anim.VirtualClient}
 * @param  {string}              The name of the client
 * @return {void}
 */
HGridWidget.prototype.lockClient = function lockClient(client, clientName)
{
	this.lockCount[clientName] = (this.lockCount[clientName])?this.lockCount[clientName]:0;
	++this.lockCount[clientName];
	// NGM.trace('"'+arguments.callee.caller.name + '" is locking "' + clientName + '" count: ' + this.lockCount[clientName]);
	// NGM.dump(this.lockCount);
	return client.lock();
};

/**
 * Used instead og client.unlock() to debug the lock/unlock actions on the clients
 *
 * @param  {Anim.VirtualClient}
 * @param  {string}              The name of the client
 * @return {void}
 */
HGridWidget.prototype.unlockClient = function unlockClient(client, clientName)
{
	this.lockCount[clientName] = (this.lockCount[clientName])?this.lockCount[clientName]:0;
	--this.lockCount[clientName];
	// NGM.trace('"'+arguments.callee.caller.name + '" is unlocking "' + clientName+ '" count: ' + this.lockCount[clientName]);
	// NGM.dump(this.lockCount);
	return client.unlock();
};

 HGridWidget.prototype.setData = function setData(data)
{
	// NGM.trace("HGRID.JS - el data que llega es ");
	// NGM.dump(data, 2);

	var focusId = null;
	if (this.focus.column) {
	   // focusId = _.modulo(this.focus.column.id-this.column.atLeft, this.column.number);
	}

	var gridClient = this.gridClient;
	this.lockClient(gridClient, 'gridClient');


	this.purge();

	// Global widget init
	this.init(focusId);

	// set refresh datas callback
	this.safeZone        = (data.safeZone)?data.safeZone:0;
	this.dataRefreshCB   = data.vertical.getDataCB;
	this.headerRefreshCB = data.vertical.getHeaderCB;

	this.maxVerticalValue = data.vertical.maxValue;
	this.minVerticalValue = data.vertical.minValue;


	this.safeZone = this.safeZone / this.ratio;

	//---------------------------------------

	// Init column headers
	var colHeader = this.colHeader = data.horizontal.items,
		colLength = this.colLength = colHeader.length,
		dataHorizontalOriginValue  = data.horizontal.originValue;

	//MGR Encontrar el indice del canal de origen.
	for (var colIndex = colLength; colIndex--;) {
		if (colHeader[colIndex] === dataHorizontalOriginValue) break;
	}

	// init references values
	gridClient.topValue = 0;
	this.autoSetBottomValue(gridClient);

	 // define main cell as origin
	var dataVerticalOriginValue = data.vertical.originValue;
	this.verticalOrigin = dataVerticalOriginValue;
	this.setGridClientReferenceValue(dataVerticalOriginValue);

	if (data.focusTopValue) {
		this.focus.topValue = data.focusTopValue;
		// this.focus.top = data.focusTopValue * this.ratio;
	}

	// draw display columns (col header + cells)
	var column = this.column;
	column[-1] = column.H;


	var indexData = colIndex - this.focus.column.id,
		nb = column.number;

	// NGM.trace("1 xochitl nb -> " + nb);
	//nb = nb - 1;

	/* !Begins init column */
	for (var i = -1; i < nb; i++) {
		var col = column[i];
		//NGM.trace("*****************************");
		// NGM.dump(col,2);
		if (i >=0 ){
			this.drawColHeader(col, indexData++);
		}
		this.initColumn(col);

	}

	// set Focus
	this.focusCellUpdate();

	this.unlockClient(gridClient, 'gridClient');


};

/**
 * Calculates and sets the bottom value based on the client height, the ratio and the topValue
 * @param  {VirtualClient} client
 * @return {Number}        The bottomValue
 */
HGridWidget.prototype.autoSetBottomValue = function autoSetBottomValue(client)
{
	client.bottomValue = client.topValue + (client.height / this.ratio);
	// NGM.trace('height: ' + client.height + ' bottomValue: ' + client.bottomValue);
	return client.bottomValue;
};

HGridWidget.prototype.init = function init(focusId)
{
	var gridClient      = this.gridClient,
		rowHeaderClient = this.rowHeaderClient,
		colHeaderClient = this.colHeaderClient;

	// init field column
	var securityObject    = 2,
		param             = this.json,
		paramColumn       = param.column,
		paramColumnNumber = paramColumn.number - 0,
		paramColumnFocus  = (focusId === null? paramColumn.focus - 0 : focusId),
		column            = this.column = {
							"top"      : 0,
							"number"   : paramColumnNumber + securityObject,
							"width"    : (this.width - rowHeaderClient.width) / paramColumnNumber >> 0,
							"atLeft"   : 0,
							"atRight"  : paramColumnNumber + securityObject -1,
							};

	// init clients position
	this.clientScroll(gridClient, 0, 0);
	this.clientScroll(rowHeaderClient, 0, 0);
	this.clientScroll(colHeaderClient, 0, 0);

	// init left references values for columns and headers
	var nb = column.number;
	for (var i=0; i < nb; i++) {
		colHeaderClient[i] = {"left" : 0};
		column[i] = {"left" : 0, "id": i};
	}

	// init column["H"]
	rowHeaderClient = {"left" : 0};
	column.H        = {"left" : 0, "id": "H"};

	// Reset focus data
	this.focus.column = column[paramColumnFocus ? paramColumnFocus : paramColumnNumber % 2 >> 0];
	delete this.focus.cell;
};

HGridWidget.prototype.purge = function purge()
{
	//DBG_func(grid);

	// Remove cells
	var col = this.column,
		len = col.number;
	for (var i = 0; i < len; i++) {
		var cells = col[i].cells;
		var nb    = cells.length;
		for (var j = 0; j < nb; j++) {
			this._cellOnRemoveEvent(cells[j]);
		}
	}

	var colHeaderClient = this.colHeaderClient;
	for (i = 0; i < len; i++) {
		delete colHeaderClient[i];
	}

	// delete all client & canvas
	delete this.column;

	// Purge focus info
	var focus = this.focus;

	this._focusUnsetTimer();

	this.focus = {
		"top"     : focus.top,
		"topValue": focus.topValue,
	};

	this.asyncTimerPurge();
};

HGridWidget.prototype.destroy = function destroy()
{
	// delete parental link
	delete this.parent;
};



/****************************************************************************
* State change Management
*
*****************************************************************************/
HGridWidget.prototype.stateChange = function stateChange(name)
{
	if (name == this.state) return;
	// Update state name
	this.state = name;

	// animation
	HGridWidget.superClass.stateChange.call(this, name);

	// temp
	this.saveClientPos(this.colHeaderClient, 0, 0);
	this.saveClientPos(this.gridClient, 0, 0);
};



/****************************************************************************
* Drawing of name of channels
*
*****************************************************************************/
HGridWidget.prototype.drawColHeader = function drawColHeader(curColumn, colData)
{

	//NGM.trace("HGRID.js - drawColHeader");


	var column          = this.column,
		columnWidth     = column.width,
		headerLength    = this.colHeader.length,
		colHeaderClient = this.colHeaderClient;

	if (headerLength === 0)
		return;

	//X2colData = _.modulo(colData, headerLength);

	// link header field with column field
	curColumn.dataColIndex = colData;

	if(!this.colHeader[colData]) //no sé por qué siempre sale una extra... XFR
		return;

	// draw column header
	var colHeader = {
		"width":  columnWidth,
		"height": colHeaderClient.height,
		"left":   curColumn.left + (columnWidth * (curColumn.id - 1)),
		"data":   this.colHeader[colData],
	};



	var curColHeaderClient = colHeaderClient[curColumn.id];
	var canvas = curColHeaderClient[0].canvas;
	if (!canvas) {
		canvas = new Canvas.JSCanvas();
		canvas.init(colHeader.height, colHeader.width);
		canvas.animation.setParent(colHeaderClient).setEnable(true).start();
		canvas.custo = this.custo;
	}
	canvas.animation.move(0, colHeader.left).start();
	colHeader.canvas = canvas;

	// user draw CB
	var drawCB = this.draw.colHeader;

	//WAX 5 -> HARDCODEANDO EL CALLBACK DEL DRAW YA QUE EN EL JSON NO PUEDO PONER FUNCTIONS
	drawCB = epg.drawColHeaderCB;

	if (typeof drawCB == "function"){


		drawCB.call(canvas, colHeader.data, colHeader.data===this.colHeader[this.focus.column.dataColIndex]);
	}

	// store canvas
	curColHeaderClient[0] = colHeader;
};

HGridWidget.prototype.drawCell = function drawCell(cell, parent)
{
	var canvas = cell.canvas = new Canvas.JSCanvas();
	canvas.custo = this.custo;

	// init canvas and context
	try {
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//  I don't know why there was this hardcoded size limit but it was truncating programs longer than four hours //
		//  so I commented it out.                                                                                     //
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		/*if (cell.height >= 2048) {
			//NGM.trace("cell.height: "+cell.height+ ". change to 1980");
			cell.height = 1980;
		}*/
		var top = Math.floor(cell.top * this.ratio);
		canvas.init(cell.height, cell.width);
		canvas.animation.setParent(parent).move(top, cell.left).setEnable(true).start();

		// draw content
		this.drawCellContent(cell, canvas, false, false);
	}
	catch (e) {
		NGM.trace('Error hgrid.drawCell');
		NGM.dump(e);
	}
};

HGridWidget.prototype.drawCellContent = function drawCellContent(cell, canvas, focus, refresh)
{
	// call user draw CB
	//NGM.trace("HGRID.js - drawCellContent " + cell);
	//NGM.dump(cell.data);
	//XFR: este código sólo evaluaba el cell, pero yo puse data.channel para que no pusiera las horas.
	if(!cell){
		return;
	}

	//cell.drawingCB = epg.drawCellCB;
	this.updateCellVisibility(cell);
	cell.drawingCB.call(canvas, cell.data, focus, cell.visibleTop, cell.visibleBottom);
	if (refresh) canvas.getContext("2d").swapBuffers();

};


HGridWidget.prototype.updateCellVisibility = function updateCellVisibility(cell)
{
	var prevVisibleTop = cell.visibleTop;
	var prevVisibleBottom = cell.visibleBottom;
	var data = cell.data;
	var topValue = this.gridClient.topValue;
	var bottomValue = this.gridClient.bottomValue;

	if (data.gridTop < topValue && data.gridBottom > topValue) {
		cell.visibleTop = Math.round(cell.height*(topValue-data.gridTop)/(data.gridBottom-data.gridTop));
	} else {
		cell.visibleTop = 0;
	}

	if (data.gridBottom > bottomValue && data.gridTop < bottomValue) {
		cell.visibleBottom = Math.round(cell.height - cell.height*(data.gridBottom-bottomValue)/(data.gridBottom-data.gridTop));
	} else {
		cell.visibleBottom = cell.height;
	}

	//NGM.trace("prevVisibleTop: "+prevVisibleTop+", visibleTop: "+cell.visibleTop+", prevVisibleBottom: "+prevVisibleBottom+", visibleBottom: "+cell.visibleBottom);
	if (prevVisibleTop === cell.visibleTop && prevVisibleBottom === cell.visibleBottom) {
		return ""; //no change
	} else {
		var diff = (cell.visibleBottom - prevVisibleBottom) - (cell.visibleTop - prevVisibleTop);
		if (diff > 0) {
			return "more"; // more pixels visible
		} else if (diff === 0) {
			return "equal";
		} else {
			return "less";
		}
	}
};

HGridWidget.prototype.redrawCells = function redrawCells(cells)
{
	var client = this.client;
	this.lockClient(client, 'client');
	for (var i=cells.length-1; i>=0; i--) {
		var cell = cells[i];
		cell.drawingCB.call(cell.canvas, cell.data, false, cell.visibleTop, cell.visibleBottom);
		cell.canvas.getContext("2d").swapBuffers();
	}
	this.unlockClient(client, 'client');
};

HGridWidget.prototype.refreshCell = function refreshCell(cell)
{
	// Refresh cell
	this.drawCellContent(cell, cell.canvas, false, true);

	// Focus cell refreshed

	var focus  = this.focus;
	if (cell == focus.cell) {
		var canvas = focus.canvas;
		if (canvas) this.drawCellContent(cell, canvas, true, true);
	}
};

/****************************************************************************
* Column fill / remove management
*
*****************************************************************************/
HGridWidget.prototype.initColumn = function initColumn(column)
{
	// NGM.trace('Init columns: ');
	// NGM.dump(column);

	//NGM.trace("HGRID.js - column " +  column);
	// Remove column cells
	var cells  = column.cells;
	var length = cells.length;

	for (var i = 0; i < length; i++) {
		this._cellOnRemoveEvent(cells[i]);
	}
	column.cells = [];

	// Fill complete
	var gridClient = this.gridClient,
		step       = this.defaultStep;

	// NGM.trace('Init COlumn - top:' + gridClient.topValue +' bottom: '+ gridClient.bottomValue);
	// NGM.trace('Init COlumn - top:' + tsToString(gridClient.topValue) +' bottom: '+ tsToString(gridClient.bottomValue));
	this.fillColumn(column, "bottom", gridClient.topValue - step, gridClient.bottomValue + step);
};

HGridWidget.prototype.fillColumn = function fillColumn(column, where, fromValue, toValue)
{
	//column.cells = [{"name":"cell1"},{"name":"cell2"},{"name":"cell3"},{"name":"cell4"}];
	//NGM.trace("fill column -> " + column + "  --  " + where + "  --  " + fromValue + "  --  " + toValue);
	// NGM.dump(column,3);

	var dataCb, drawCB, client, id;

	// Check
	if (toValue <= fromValue) {
		//NGM.trace("Bad values: " + fromValue + "/" + toValue, ""+column.id);
		return 0;
	}


	// Type of col
	id = column.id;
	this.draw.cell = epg.drawCellCB;
	switch (id) {
		case "H":

			//NGM.trace("esta es la HHHH" + where);
			dataCb = this.headerRefreshCB;
			drawCb = epg.drawRowHeaderCB;
			client = this.rowHeaderClient;
			id = 1;

			break;

		default:
			dataCb = this.dataRefreshCB;
			drawCb = this.draw.cell;
			client = this.gridClient;
			break;
	}


	//NGM.trace("======================================= " );
	//NGM.dump(this.colHeader[column.dataColIndex]);
	//NGM.trace("values: " + fromValue + "/" + toValue, ""+column.id);
	//NGM.trace("======================================= " );

	var list   = dataCb.call(this.parent, this.colHeader[column.dataColIndex], fromValue, toValue),
		length = list.length;
	//NGM.trace("----------------------> (((((fillColumn)))) ------> " + column.dataColIndex);

	if (!length) {
		if(column.dataColIndex >= 0){
			NGM.trace("NO cell found between " + tsToString(fromValue) + " and " + tsToString(toValue) + " (" + where + ")", "" + column.id, column.dataColIndex);
		}

		// NGM.dump(list);
		// NGM.dump(column);
		// NGM.dump(this.colHeader, 2);
		return 0;
	}
	var count;
	var columnWidth = this.column.width,
		left        = column.left + (columnWidth * (id - 1)),
		ratio       = this.ratio,
		vOrigin     = this.verticalOrigin,
		cellList    = column.cells,
		cellNb      = cellList.length;

	switch (where) {
		case "top":
			// Check
			if (cellNb > 0 && list[length-1].gridBottom > cellList[0].gridTop) {
				//DBG_warn(grid, "Overlapping cells");
				list[length-1].gridBottom = cellList[0].gridTop;
			}
			break;

		case "bottom":
			// Check
			if (cellNb > 0 && list[0].gridTop < cellList[cellNb-1].gridBottom) {
				//DBG_warn(grid, "Overlapping cells");
				list[0].gridTop = cellList[cellNb-1].gridBottom;
			}
			break;
	}

	cellList = where == "top" ? [] : column.cells;

	// For each data
	for (var i = 0; i < length; i++) {
		var data   = list[i];

		var height = data.gridBottom - data.gridTop,
			cell   = {
				"data":      data,
				"left":      left,
				"top":       data.gridTop - vOrigin,
				"height":    Math.ceil(height * ratio),
				"width":     columnWidth,
				"drawingCB": (data.drawCb)?data.drawCb:drawCb,
			};
			//if (column.id != "H") this._cellCount++;

		if(!cell){
			// NGM.trace('No cell');
			continue;
		}

		this.drawCell(cell, client);

		// Add
		cellList.push(cell);
	}

	if (where == "top") {
		list  = column.cells;
		count = list.length;
		for (i = 0; i < count; i++) {
			cellList.push(list[i]);
		}
	}

	// Update cell list
	column.cells = cellList;

	// Return number of new cells
	return length;



   /*
	//DBG_info(grid, "Found " + length + " cell(s) between " + fromValue + " and " + toValue + " (" + where + ")", "" + column.id);

	// Shortcuts
		*/
};

HGridWidget.prototype.updateColumns = function updateColumns()
{
	var gridClient = this.gridClient,
		step       = this.defaultStep,
		top        = gridClient.topValue    - step,
		bottom     = gridClient.bottomValue + step;

	// For each column
	var column = this.column,
		nb     = column.number;
	//nb = nb - 1; //xochitl
	//NGM.trace("2 nb: " + nb);
	for (var i = -1; i < nb; i++) {
		var col   = column[i],
			cells = col.cells,
			len   = cells.length;

		// No data
		if (!len) {
			this.initColumn(col);
			continue;
		}

		// get first and last cell
		var cell0 = cells[0],
			cell1 = cells[len-1],
			data0 = cell0.data,
			top0  = data0.gridTop,
			retry = false;

		// Top
		if (top0 > top) {
			// Add
			if (this.fillColumn(col, "top", top, top0 - 1) > 0) {
				// Update cells as it may have change
				cells = col.cells;
			}
		} else if (data0.gridBottom < top) {
			// Remove cell 0
			this._cellOnRemoveEvent(cell0);
			cells.shift();
			// And re-test the next one
			retry = true;
		}

		// Bottom
		var data1   = cell1.data,
			bottom1 = data1.gridBottom;
		if (bottom1 < bottom) {
			// Add
			this.fillColumn(col, "bottom", bottom1 + 1, bottom);

		} else if (data1.gridTop > bottom) {
			// Remove the last cell
			this._cellOnRemoveEvent(cell1);
			cells.pop();
			// And re-test the previous one
			retry = true;
		}

		if (retry)
			i--;
	}
};

HGridWidget.prototype.updateGridClientReferenceValue = function updateGridClientReferenceValue(addValue)
{

	var gridClient = this.gridClient;
	var newTop    =  gridClient.topValue    + addValue;
	var newBottom =  gridClient.bottomValue + addValue;

	if(addValue > 0 && newBottom > this.maxVerticalValue){
		//NGM.trace(newBottom +' > '+ this.maxVerticalValue);
		return false;
	}

	if(addValue < 0 && newTop < this.minVerticalValue){
		//NGM.trace(newTop +' < '+ this.minVerticalValue);
		return false;
	}


	// NGM.trace('bottom value: '+ gridClient.bottomValue );
	// NGM.trace('addValue: '+ addValue);
	// NGM.trace('top value: '+ newTop % 1800 + ' '+ tsToString(newTop));
	this.setGridClientReferenceValue(newTop);
	return true;
};

HGridWidget.prototype.canScrollDown =	function canScrollDown() {
	return this.gridClient.bottomValue + this.bottomStep < this.maxVerticalValue;
};

HGridWidget.prototype.canScrollUp =	function canScrollUp() {
	// NGM.trace('Can scroll down?');
	// NGM.dump(this.gridClient.topValue - this.topStep+' > '+this.minVerticalValue);
	// NGM.dump(this.gridClient.topValue - this.topStep > this.minVerticalValue);
	return this.gridClient.topValue - this.topStep > this.minVerticalValue;
};

/**
 * Updates the grid's top and bottom values.
 * @param {number} value Top value
 */
HGridWidget.prototype.setGridClientReferenceValue = function setGridClientReferenceValue(value)
{
	var gridClient = this.gridClient;
	// NGM.trace('setting top: '+ value + ' mod: '+ value % this.defaultStep);

	gridClient.topValue    = value;
	this.autoSetBottomValue(gridClient);
};

/****************************************************************************
* Key Handler
*
*****************************************************************************/
HGridWidget.prototype.keyHandler = function keyHandler(keyName)
{
	if(this.ignoreKeyPress === true) {
		return true;
	}

//long press specual handling is disabled because it looks really bad with our setup
	//this.updateLongPress();

	var i;

	switch (keyName) {
		case "KEY_DOWN":
			//NGM.trace("left: "+this.column.atLeft);
			//NGM.trace("right: "+this.column.atRight);
			//NGM.trace("focus: "+this.focus.column.id);
			// don't scroll grid if not at the edge of the grid

			// NGM.dump(this.focus.column)
			// NGM.dump(this.column);
			// We sum 2 to the column id so we don't select the incomplete bottom column.
			 if (modulo(this.focus.column.id+2, this.column.number) !== this.column.atRight) {
				 this.focusColumnChange(1);
				 return true;
			 } else {
				 return this.moveRight();
			 }
		break;

		case "KEY_UP":
			// NGM.dump(this.focus.column)
			// NGM.dump(this.column);
			// don't scroll grid if not at the edge of the grid
			if (modulo(this.focus.column.id-1, this.column.number) !== this.column.atLeft) {
				this.focusColumnChange(-1);
				return true;
			} else {
				return this.moveLeft();
			}
		break;

		case "KEY_LEFT":
//            NGM.trace("gridClient.topValue: "+this.gridClient.topValue);
//            NGM.trace("focus.topValue: "+this.focus.topValue);

			if (this.prevCellIsInvisible()) {
				return this.moveUp();
			} else {
				this.focus.topValue = this.prevCellRelativeTopValue();
				if (this.focus.topValue < 0) {
					this.focus.topValue = 0;
				}
				this.focusCellUpdate();

				return true;
			}
		break;
			//return this.moveUp();

		case "KEY_RIGHT":
//            NGM.trace("gridClient.topValue: "+this.gridClient.topValue);
//            NGM.trace("focus.topValue: "+this.focus.topValue);
			// debugger;
			if (this.nextCellIsInvisible()) {

				return this.moveDown();
			} else {
				this.focus.topValue = this.nextCellRelativeTopValue();
				this.focusCellUpdate();
				return true;
			}
			//return this.moveDown();
		break;
		case "KEY_TV_RED":  //page anterior
			//TODO find a better solution
			for(i=0; i<this.json.column.number; i++) {
				setTimeAlarm(i*this.speed, this.moveLeft.bind(this));
			}
			this.ignoreKeyPress = true;
			setTimeAlarm(this.speed*(this.json.column.number-1), this.unignoreKeyPress.bind(this));
		return true;

		case "KEY_TV_GREEN": //page siguiente
			//TODO find a better solution
			for(i=0; i<this.json.column.number; i++) {
				setTimeAlarm(i*this.speed, this.moveRight.bind(this));
			}
			this.ignoreKeyPress = true;
			setTimeAlarm(this.speed*(this.json.column.number-1), this.unignoreKeyPress.bind(this));
		return true;
	}
	return false;
};

HGridWidget.prototype.getNextCell = function() {
	var focus = this.focus;

	// Look for cell
	var value  = this.gridClient.topValue + focus.topValue,
		cells  = focus.column.cells,
		length = cells.length;

	for (var i = 0; i < length; i++) {
		var data = cells[i].data;

		// Too early ?
		if (data.gridTop <= value) continue;

		return cells[i];
	}

	return null;
};

HGridWidget.prototype.nextCellIsInvisible = function() {
	var nextCell = this.getNextCell();
	if (nextCell) {
		return this.gridClient.bottomValue - this.safeZone <= nextCell.data.gridTop;
	} else {
		return true;
	}
};

HGridWidget.prototype.nextCellRelativeTopValue = function() {
	var nextCell = this.getNextCell();
	if (nextCell) {
		return nextCell.data.gridTop - this.gridClient.topValue;
	} else {
		return 1800*3;
	}
};

HGridWidget.prototype.getPrevCell = function() {
	var focus = this.focus;

	// Look for cell
	var value  = this.gridClient.topValue + focus.topValue,
		cells  = focus.column.cells,
		length = cells.length;

	for (var i = length-1; i >= 0; i--) {
		var data = cells[i].data;

		// Too early ?
		if (data.gridBottom > value) continue;

		return cells[i];
	}

	return null;
};

HGridWidget.prototype.prevCellIsInvisible = function() {
	var prevCell = this.getPrevCell();
	if (prevCell) {
//        NGM.trace("this.gridClient.topValue: "+this.gridClient.topValue);
//        NGM.trace("prevCell.data.gridBottom: "+prevCell.data.gridBottom);
		return this.gridClient.topValue + this.safeZone  >= prevCell.data.gridBottom;
	} else {
		return true;
	}
};

HGridWidget.prototype.prevCellRelativeTopValue = function() {
	var prevCell = this.getPrevCell();
	if (prevCell) {
		return prevCell.data.gridTop - this.gridClient.topValue;
	} else {
		return 0;
	}
};

HGridWidget.prototype.unignoreKeyPress = function() {
	this.ignoreKeyPress = false;
};

HGridWidget.prototype.resetLongPress = function resetLongPress() {
	this.longPress = 0;
};

HGridWidget.prototype.updateLongPress = function updateLongPress() {
	this.longPressTimer();
	this.longPress++;
};

HGridWidget.prototype.longPressTimer = function longPressTimer()
{
	var id = this.longPressTimerId;
	if (id) {
		unsetTimeAlarm(id);
		delete this.longPressTimerId;
	}
	this.longPressTimerId = setTimeAlarm(this.speed+50, this.resetLongPress, true, this);
};

// ***************************************************************************
// * Async timers
// ***************************************************************************
HGridWidget.prototype.asyncTimerCheck = function asyncTimerCheck(a, b)
{
	var asyncTimer = this.asyncTimer;
	if (asyncTimer[a]) return false;
	if (asyncTimer[b]) {
		unsetTimeAlarm(asyncTimer[b]);
		delete asyncTimer[b];
	}
	return true;
};
// ***************************************************************************
HGridWidget.prototype.asyncTimerPurge = function asyncTimerPurge()
{
	var asyncTimer = this.asyncTimer;
	for (var i in asyncTimer) {
		unsetTimeAlarm(asyncTimer[i]);
	}
	this.asyncTimer = {};
};
// ***************************************************************************



/****************************************************************************
* Moves and scrolls management
*
*****************************************************************************/
HGridWidget.prototype.moveRight = function moveRight()
{
	if(this.fireEvent('shouldScroll', 0, 1) === false){
		return false;
	}

	if (!this.asyncTimerCheck("right", "left")) return false;

	var client             = this.client,
		colHeaderClient    = this.colHeaderClient,
		gridClient         = this.gridClient,
		speed              = this.speed,
		column             = this.column,
		columnAtLeft       = column.atLeft,
		curColumn          = column[columnAtLeft],
		columnWidth        = column.width,
		columnNumber       = column.number,
		curColHeaderClient = colHeaderClient[columnAtLeft];

	// adjust client left position
	var leftAdjust = columnWidth * columnNumber;
	curColumn.left += leftAdjust;
	curColHeaderClient.left += leftAdjust;

	// set a new left and right column
	var columnAtRight = columnAtLeft;
	column.atRight = columnAtRight;
	column.atLeft++;
	if (column.atLeft > columnNumber-1)
		column.atLeft = 0;

	// Async Call cells management
	this.asyncTimer.right = setTimeAlarm(1, this._asyncRight, true, this, columnAtRight);

	// Clients scroll
	this.lockClient(client, 'client');
	this.clientScroll(colHeaderClient,
					  colHeaderClient.left - columnWidth,
					  colHeaderClient.top,
					  speed);
	this.clientScroll(gridClient,
					  gridClient.left - columnWidth,
					  gridClient.top,
					  speed);
	this.unlockClient(client, 'client');

	// focus update
	this.focusColumnChange(1);

	return true;
};
HGridWidget.prototype._asyncRight = function _asyncRight(me, columnAtRight)
{
	delete me.asyncTimer.right;

	// refresh right column and header datas
	var column = me.column[columnAtRight];
	me.drawColHeader(column, me.getDataColIndex("right"));
	me.initColumn(column);
};

HGridWidget.prototype.moveLeft = function moveLeft()
{
	if(this.fireEvent('shouldScroll', 0, -1) === false){
		return false;
	}

	// Check timers
	if (!this.asyncTimerCheck("left", "right")) return false;

	var client             = this.client,
		colHeaderClient    = this.colHeaderClient,
		gridClient         = this.gridClient,
		speed              = this.speed,
		column             = this.column,
		columnAtRight      = column.atRight,
		curColumn          = column[columnAtRight],
		columnWidth        = column.width,
		columnNumber       = column.number,
		curColHeaderClient = colHeaderClient[columnAtRight];

	// adjust client left position
	var leftAdjust = columnWidth * columnNumber;
	curColumn.left -= leftAdjust;
	curColHeaderClient.left -= leftAdjust;

	// set a new left and right column
	var columnAtLeft = columnAtRight;
	column.atLeft = columnAtLeft;
	column.atRight--;
	if (column.atRight < 0)
		column.atRight = columnNumber-1;

	// Async call cells management
	this.asyncTimer.left = setTimeAlarm(1, this._asyncLeft, true, this, columnAtLeft);

	// Clients scroll
	this.lockClient(client, 'client');
	this.clientScroll(colHeaderClient,
					  colHeaderClient.left + columnWidth,
					  colHeaderClient.top,
					  speed);
	this.clientScroll(gridClient,
					  gridClient.left + columnWidth,
					  gridClient.top,
					  speed);
	this.unlockClient(client, 'client');

	// focus update
	this.focusColumnChange(-1);

	return true;
};
HGridWidget.prototype._asyncLeft = function _asyncLeft(me, columnAtLeft)
{
	delete me.asyncTimer.left;

	// refresh left column and header datas
	var column = me.column[columnAtLeft];
	me.drawColHeader(column, me.getDataColIndex("left"));
	me.initColumn(column);
};

HGridWidget.prototype.moveUp = function moveUp()
{
	var scrollValue;
	//this.focus.topValue = 1800-1; //so after scrolling, will find the right cell to focus after minus 1800
	if (this.focus.topValue <= 1800) {
		this.focus.topValue += 1800; // so it doesn't change focus after scrolling
	}

	if (this.longPress>1 && this.longPressVScrollStep){
		scrollValue = -this.longPressVScrollStep;
	} else {
		scrollValue = -this.topStep;
	}

	// NGM.trace(scrollValue);
	// scroll animation and cell management
	return this.verticalScrollTo("up", scrollValue);
};

HGridWidget.prototype.moveDown = function moveDown()
{
	var scrollValue;
	//this.focus.topValue = 1800*3; //so after scrolling, will find the right cell to focus after minus 1800
	if (this.focus.topValue >= 5400) {
		this.focus.topValue -= 1800; // so it doesn't change focus after scrolling
	}
	if (this.longPress>1 && this.longPressVScrollStep){
		scrollValue = this.longPressVScrollStep;
	} else {
		scrollValue = this.bottomStep;
	}

	// scroll animation and cell management
	return this.verticalScrollTo("down", scrollValue);
};

HGridWidget.prototype.verticalScrollTo = function verticalScrollTo(dir, scrollValue)
{
	//NGM.trace(grid, "Scroll direction =" + dir);

	if (!this.asyncTimerCheck(dir, dir == "up" ? "down" : "up")) return false;

	//DBG_info(grid, "Scroll value =" + scrollValue);

	if (!scrollValue)
		return false;

	// NGM.trace('SCrolling step: '+ scrollValue);
	// Un set Focus timer Id
	this._focusUnsetTimer();

	// Update top and bottomn references values
	if(!this.updateGridClientReferenceValue(scrollValue)){
		return false;
	}

	// find the cells that need to be updated
	var cell, ret, extendBottom;
	var updateBeforeScroll = [];
	var updateAfterScroll = [];
	var cells = this.getCellsList();
	for (i=cells.length-1; i>=0; i--) {
		cell = cells[i];

		extendBottom = (dir === "down" && cell.visibleBottom !== cell.height)? true : false;
		ret = this.updateCellVisibility(cell);
		if (ret === "") {
			continue;
		}
		else if (extendBottom) {
			updateBeforeScroll.push(cell);
		} else {
			updateAfterScroll.push(cell);
		}
	}

	// launch async canvas management (remove and add)
	this.asyncTimer[dir] = setTimeAlarm(1, this._asyncVertical, true, this, dir);

	// scroll clients
	var client          = this.client,
		gridClient      = this.gridClient,
		rowHeaderClient = this.rowHeaderClient,
		ratio           = this.ratio,
		speed           = this.speed;

	this.redrawCells(updateBeforeScroll);

	this.lockClient(client, 'client');
	this.clientScroll(rowHeaderClient,
					  rowHeaderClient.left,
					  rowHeaderClient.top - scrollValue * ratio,
					  speed);
	this.clientScroll(gridClient,
					  gridClient.left,
					  gridClient.top - scrollValue * ratio,
					  speed);
	this.unlockClient(client, 'client');

	setTimeAlarm(speed, this.redrawCells.bind(this), true, updateAfterScroll);

	// Update focus cell
	this.focusCellUpdate();

	return true;
};

HGridWidget.prototype._asyncVertical = function _asyncVertical(me, dir)
{
	delete me.asyncTimer[dir];

	//DBG_info(grid, "Fill async, direction = " + dir);

	me.updateColumns();

	//calculate steps after updating columns
	//this is needed when focus.topValue === 0
	var focus = me.focus;
	//NGM.trace(focus.topValue);
	if (focus.topValue === 0) {
		// Look for cell
		var value  = me.gridClient.topValue + focus.topValue,
			cells  = focus.column.cells,
			length = cells.length;

		for (var i = 0; i < length; i++) {
			var data = cells[i].data;
			if (data.gridBottom <= value) continue;
			if (data.gridTop > value) break;

			me._stepUpdate(i);
			break;
		}
	}
};

HGridWidget.prototype._stepUpdate = function _stepUpdate(cellIndex)
{
	// always half an hour
	this.topStep = 1800;
	this.bottomStep = 1800;

//    if (this.longPress>1)
//         return;
//
//    var focus       = this.focus,
//        focusValue  = this.gridClient.topValue + focus.topValue,
//        defaultStep = this.defaultStep,
//        column      = focus.column,
//        cellList    = column.cells,
//        cellData    = focus.cell.data;
//
//    // Top
//    if (cellIndex > 0) {
//        var topStep = focusValue - cellList[cellIndex-1].data.gridTop;
//        //NGM.trace("topStep 3:"+topStep);
//    } else {
//        var topStep = focusValue - cellData.gridTop;
//        //NGM.trace("topStep 4:"+topStep);
//    }
//    if (topStep > defaultStep) topStep = defaultStep;
//    if (topStep < 1) {
//        topStep = defaultStep/4; // to make sure it's not zero (a bug somewhere that it's zero even when there is a cell next to it)
//    }
//    this.topStep = topStep;
//
//    // Bottom
//    if (cellIndex < cellList.length - 1) {
//        //NGM.trace("cellIndex:" +cellIndex);
//        //_.each(cellList, function(item) {NGM.dump(item.data.program);});
//        var bottomStep = cellList[cellIndex+1].data.gridTop - focusValue;
//        //NGM.trace("bottomStep 3:"+bottomStep);
//    } else {
//        var bottomStep = cellData.gridBottom - focusValue;
//        //NGM.trace("bottomStep 4:"+bottomStep);
//    }
//    //NGM.trace("defaultStep :"+this.defaultStep);
//    if (bottomStep > defaultStep) bottomStep = defaultStep;
//    if (bottomStep < 1) {
//        //NGM.trace("this.gridClient.topValue: "+this.gridClient.topValue);
//        //NGM.trace("focus.topValue: "+focus.topValue);
//        bottomStep = defaultStep/4; // to make sure it's not zero (a bug somewhere that it's zero even when there is a cell next to it)
//    }
//    this.bottomStep = bottomStep;

	//DBG_info(grid, "New margins: " + (this.topStep * this.ratio) + "/" + (this.bottomStep * this.ratio));
};

HGridWidget.prototype.clientScroll = function clientScroll(client, left, top, speed)
{
	this.saveClientPos(client, left, top);
	client.animation.move(top, left, speed).start();
	// NGM.trace('SCrolling', left, top);

	/* This check is here as an ugly solution to epg reveiving the scroll event twice. */
	if(client !== this.gridClient){
		return;
	}
	this.fireEvent('scroll',  client, left, top, speed);
};

HGridWidget.prototype.saveClientPos = function saveClientPos(client, left, top)
{
	client.left = left;
	client.top  = top;
};

HGridWidget.prototype.getDataColIndex = function getDataColIndex(direction)
{
	var column= this.column ,
		datas = this.colHeader.length,
		newDataSelectedIndex_H;

	// get new data column focus
	if (direction == "right") {
		newDataSelectedIndex_H = (column[column.atRight].dataColIndex + column.number) % datas;
	} else {
		newDataSelectedIndex_H = (column[column.atLeft].dataColIndex - column.number) % datas;
	}
	if (newDataSelectedIndex_H<0)
		newDataSelectedIndex_H = datas + newDataSelectedIndex_H;

	return newDataSelectedIndex_H;
};


/****************************************************************************
* Focus
*
*****************************************************************************/
HGridWidget.prototype.focusColumnChange = function focusColumnChange(step)
{
	var focus = this.focus;
	var prevIndex = focus.column.id;
	this.columnChanged = true;

	// Column number
	var column = this.column,
		max    = column.number,
		index  = (focus.column.id + step) % max;
	if (index < 0) index += max;

	var nextCol = column[index];

	if(!nextCol.cells.length){
		return false;
	}

	// NGM.trace(this.colLength + ' :length - nextCol.dataColIndex: '+nextCol.dataColIndex);

	//We rest 2 because we start counting at 0 and we have a filler last column.
	if(nextCol.dataColIndex > this.colLength  - 2 ){
		return false;
	}

	focus.column = nextCol;
	// Column has changed so focus too !
	delete focus.cell;

	this.drawColHeader(column[prevIndex], column[prevIndex].dataColIndex);

	// set new cell focus (centering at this stage)
	this.focusCellUpdate();
};

HGridWidget.prototype.focusCellUpdate = function focusCellUpdate()
{
	var focus = this.focus;

	// Look for cell
	var value  = this.gridClient.topValue + focus.topValue,
		cells  = focus.column.cells,
		length = cells.length;

	for (var i = 0; i < length; i++) {
		var data = cells[i].data;

		// Too early ?
		if (data.gridBottom <= value){
			continue;
		}

		// Too late ?
		if (data.gridTop > value){
			break;
		}

		//DBG_info(grid, "New focus index: " + i);
		this.focusCellSet(cells[i]);
		this._stepUpdate(i);
		return true;
	}

	//DBG_info(grid, "No focus found\n");

	// One tile up !

	// if (i > 1) {
	// 	this.topStep = Math.min(this.defaultStep, value - cells[i-1].data.gridTop);
	// } else {
	// 	this.topStep = this.toTheEdgeStep;
	// }

	// // One tile down
	// if (i < length) {
	// 	this.bottomStep = Math.min(this.defaultStep, cells[i].data.gridBottom - value);
	// } else {
	// 	this.bottomStep = this.toTheEdgeStep;
	// }

	// No focus
	this.focusCellSet(null);

	return false;
};

HGridWidget.prototype.focusCellSet = function focusCellSet(newCell)
{
	//DBG_info(grid, "");

	var focus = this.focus;

	// Change data
	focus.cell = newCell;

	// Remove old focus canvas
	this._focusCanvasOff();

	// Focus timer Id unset
	this._focusUnsetTimer();

	// Focus timer id restart
	focus.timerId = setTimeAlarm(this.speed+50, this._focusCanvasOn.bind(this), true);

	return true;
};

/* Draws the cell */
HGridWidget.prototype._focusCanvasOn = function _focusCanvasOn()
{
	//DBG_info(grid, "");
	var ratio      = this.ratio;
	var column     = this.column;
	var focus      = this.focus;
	var cell       = focus.cell;
	var gridClient = this.gridClient;

	// Timer ended
	delete focus.timerId;

	// init canvas focus
	var canvas   = focus.canvas = new Canvas.JSCanvas();
	var x = cell.top * ratio;
	var y = cell.left;

	canvas.custo = this.custo;
	canvas.init(cell.height, cell.width);
	canvas.compositerClient.name = "Focus";

	// this.lockClient(gridClient, 'gridClient');

	// draw user Cb
	this.drawCellContent(cell, canvas, true);


	canvas.animation.setParent(this.gridClient)
					.setEnable()
					.zIndex(2)
					.move(x, y)
					.show(0)
					.start();
	//highlight the column in focus
	if (this.columnChanged === true) {
		this.drawColHeader(focus.column, focus.column.dataColIndex);
		this.columnChanged = false;
	}

	// this.unlockClient(gridClient, 'gridClient');
	// JSON grid event CB call if exists
	this.fireEvent('onCellFocus', cell, canvas, {x: x, y: y}, this.gridClient, this.parent);

};

HGridWidget.prototype._focusCanvasOff = function _focusCanvasOff()
{
	//DBG_info(grid, "");

	var focus  = this.focus,
		canvas = focus.canvas;

	if (!canvas) return false;

	// Let the animation finish before destroying
	canvas.animation.hide(0).start();
	Animation_autoDestroy(canvas);
//    delete canvas;

	// JSON grid event CB call if exists
	var cb = this.events.onCellBlur;
	if (typeof cb == "function")
	   cb.call(this.parent);

	return true;
};

HGridWidget.prototype._focusUnsetTimer = function _focusUnsetTimer()
{
	// Focus timer id reset
	var timerId = this.focus.timerId;
	if (timerId) {
		unsetTimeAlarm(timerId);
	}
};


/*****************************************************************************
* Tools
*
*****************************************************************************/
HGridWidget.prototype.getFocusCellIndex = function getFocusCellIndex()
{
	var focus = this.focus;
	if (focus) {
		var cellFocus = focus.cell,
			colCells  = focus.column.cells,
			len       = colCells.length;

		for (var i = 0; i < len; i++) {
			if (cellFocus == colCells[i]) {
				return i;
			}
		}
	}
};

HGridWidget.prototype._cellOnRemoveEvent = function _cellOnRemoveEvent(cell)
{
	var cellData   = cell.data,
		onRemoveCB = cellData.eventCB.onRemove;

	//app.log("Remove: " + (--this._cellCount) + ", " + onRemoveCB);
	if (typeof onRemoveCB == "function")
		onRemoveCB(cellData);
};

/**
 * Fires an event. Only supports a single observer per event.
 * Any extra arguments will be passed to the callcak.
 *
 * @param  {string}   eventName   The name of the event to fire
 * @return {void}
 */
HGridWidget.prototype.fireEvent = function fireEvent(eventName) {
	var args =[];
	var cb = this.events[eventName];

	if(typeof cb != 'function'){
		return;
	}

	args.push.apply(args, arguments);
	args.shift();

	return cb.apply(null, args);
};


/*****************************************************************************
* External methods
*
*****************************************************************************/


/**
 * A very simple event handler, only supports a single observer per event.
 * @param  {string}   evname   The name of the event
 * @param  {Function} callback
 * @return {void}
 */
HGridWidget.prototype.observeEvent = function observeEvent(evname, callback) {
	this.events[evname] = callback;
};

HGridWidget.prototype.getFocusData = function getFocusData()
{
	return this.focus.cell.data;
};

HGridWidget.prototype.getTopValue = function getTopValue()
{
	return this.gridClient.topValue;
};

HGridWidget.prototype.getFocusAbsoluteTopValue = function getFocusAbsoluteTopValue()
{
	return this.gridClient.topValue + this.focus.topValue;
};

HGridWidget.prototype.getBottomValue = function getBottomValue()
{
	return this.gridClient.bottomValue;
};

HGridWidget.prototype.getCellsList = function getCellsList()
{
	var cellsList = [],
		col       = this.column,
		len       = col.number;

	for (var i = 0; i < len; i++) {
		var cells = col[i].cells;
		var nb    = cells.length;
		for (var j = 0; j < nb; j++) {
			cellsList.push(cells[j]);
		}
	}
	return cellsList;
};

HGridWidget.prototype.gridIsEmpty = function gridIsEmpty()
{
	var col = this.column,
		len = col.number;

	for (var i = 0; i < len; i++) {
		if (col[i].cells.length)
			return false;
	}
	return true;
};

HGridWidget.prototype.refreshDisplay = function refreshDisplay()
{
	//DBG_info(grid, "Refresh display called by " + arguments.callee.caller.name);
	//NGM.trace(arguments.callee.name + " called by " + arguments.callee.caller.name);

	var col = this.column,
		len = col.number;
	for (var i = 0 ; i < len; i++) {
		this.initColumn(col[i]);
	}
	this.focusCellUpdate();
};

HGridWidget.prototype.drawCurrentColumnHeader = function ()
{
	this.drawColHeader(this.focus.column, this.focus.column.dataColIndex);
};

HGridWidget.prototype.getFocusColumnHeaderData = function ()
{
	return this.colHeader[this.focus.column.dataColIndex];
};

HGridWidget.prototype.refreshFocusCell = function ()
{
	this.refreshCell(this.focus.cell);
};

HGridWidget.prototype.hasVisibleCells = function (offset)
{
	offset = offset || 0;

	var col       = this.column,
		len       = col.number;

	for (var i = 0; i < len; i++) {
		if (i === col.atLeft || i === col.atRight) {
			continue;
		}

		var cells = col[i].cells;
		var nb    = cells.length;
		for (var j = 0; j < nb; j++) {
			if ((cells[j].data.gridBottom > this.getTopValue() + offset) && (cells[j].data.gridTop < this.getBottomValue() + offset)) {
				//this is a hack as the grid shouldn't know anything about the content
				if (!cells[j].data.program.isDummy) {
					return true;
				}
			}
		}
	}
	return false;
};

HGridWidget.prototype.hasVisibleCellsInFocusColumn = function (offset)
{
	offset = offset || 0;

	var cells = this.focus.column.cells;
	var nb    = cells.length;
	for (var j = 0; j < nb; j++) {
		if ((cells[j].data.gridBottom > this.getTopValue() + offset) && (cells[j].data.gridTop < this.getBottomValue() + offset)) {
			return true;
		}
	}
	return false;
};