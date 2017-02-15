/*
Copyright © Total Play Telecomunicaciones, S.A. de C.V. 2016.
*/

FormWidget.registerTypeStandard("home");

function home(_json, _options){
	//Identificar si es una versión de DEV (para evitar métodos y funciones con privilegios)
	tpng.app.isDev = settings.get("setup.targetsubversion") ? false : true;

	//Twitter
	this.tw = new twitter();

    if(!tpng.app.isDev){
    	/* manage YouTube background download if setting chromium.startbackgrounddelay is > 0 -NGM */
	    this.bw = new FormWidget(null, {name:"BackgroundFormWidget"});
	    this._chromiumInstances = null;
	    NGM.eventExporter.registerEvent("chromium", "*", this.onChromiumEvent.bind(this));
	    this.startBackgroundChromium();

	    /* make YouTube application available in DIAL server -NGM*/
	    NGM.dial.registerApplication("YouTube", this.onYouTubeDial, this);
    }

    //Constructor
    this.super(_json, _options);
    this.home_data = _options.userData;
    this.popUpSchedule = [];

    //Backend Settings
    var url = settings.get('totalplay.backend.url');
    if(url) tpng.backend.url = url;

    //Recuperar el tamaño de letra, si es que existe
    var text_proportion = settings.get("totalplay.iptvcore.text_proportion");
    if(text_proportion) tpng.thema.text_proportion = text_proportion;

	//Fecha de construcción del binario
    if(!tpng.app.isDev){
	    var build = settings.getVariable("build");
	    if (build) {
	        var i = build.indexOf(" - ");
	        var build = " ("+build.substr(i + 3) + ")";
	    }
	 }

    //Notas sobre la versión y trace para identicar que source code está tomando la STB
    var notes = "FIX SOMBREADO MENU/ FIX REF BANCARIAS /MENSAJES DE ERROR - QA2";
    app.log ("  ");
    app.log("*********** TPNG 3." + tpng.app.version + "." + tpng.app.subversion + " (" + notes + ") " + build + " ************");
    app.log ("  ");

    // only immediately after boot time
    var splashmaxdelay = (settings.get("tpng.splashmaxdelay") - 0) || 10;
    if (app.runningTime < splashmaxdelay * 1000)
        this.videoSplash();
}

home.inherits(FormWidget);

/***************************************************************************
Events Section
***************************************************************************/

home.prototype.onExit = function onExit(){
	//Limpiamos el timer del reloj y tmb limpiamos el player
	unsetTimeAlarm(this.updateRefresh);
	unsetTimeAlarm(this.notificationsTimer);
    this.widgets.player.setData();
    if(!tpng.app.isDev) {
        if (this.bw.formUnsetChild)
            this.bw.formUnsetChild("*");
    }
    NGM.trace("EXIT TPNG 3." + tpng.app.version);
}

home.prototype.onStreamEvent = function onStreamEvent(event) {

	switch(event.type){
		case "start":
			this.getAudios();
     		this.getSubtitles();
		break;
        case "error":
            //NGM.dump(event,2);
            // fall thru
        case "end":
            if (this.splashStartupTimer > 0) {
                unsetTimeAlarm(this.splashStartupTimer);
                this.splashStartupTimer = 0;
            }
            var url = event.target.propertyGet("name");
            this.widgets.player.setData(null);
            if (url == this.splashVideo) {
                var cb = this.splashCB;
                if (typeof cb == "function")
                    cb();
                this.splashCB = null;
            }
            break;
        default:
            ;
            break;
	}
	if(this.objectChild){
		this.objectChild.onStreamEvent(event);
	}
}

home.prototype.getSubtitles = function getSubtitles(){
	var player = this.widgets.player,
		subtitles = [],
		subs = player.getSubtitleTracks();
		//NGM.dump(subs.list,2);
		//NGM.dump(player.player);
}
/***************************************************************************
OnEnter - Entrando a la aplicación
***************************************************************************/
//Temporal para Crackle
home.prototype.changeHosts = function changeHosts(_data){
	NGM.trace("  ");
	NGM.trace(" ************************************ ");
	NGM.trace("MODIFICANDO HOST");
	NGM.trace(" ************************************ ");
	NGM.trace(" ");
	
	var ip = settings.get('totalplay.smartliving.rhc_ip');
	ip = ip ? ip : "192.168.100.32";
	
	var jid = settings.get('totalplay.smartliving.rhc_jid');
	jid = jid ? jid :  "totalplayvida04.prodeasystems.net";
	
	var host = ip + " " + jid;
	
	NGM.trace("ESCRIBIENDO EN HOST: " + host );	
	NGM.trace(" ");
	NGM.trace(" ");
			
	//Netgem.middleware.connectionManager.addHosts(host);
}


home.prototype.onEnter = function onEnter(_data){
	
	//Agrega IPs al archivo HOSTS para simular el proceso de autodiscovery
	//this.changeHosts();
	
	//Disconnected Ethernet Screen
	Netgem.middleware.connectionManager.attachEvent("linkdown",this.showAlertDisconnected.bind(this,"img/commons/desconexion.jpg"));
    Netgem.middleware.connectionManager.attachEvent("linkup",this.hideAlertDisconnected.bind(this));
    // Add callback for connected
    Netgem.middleware.connectionManager.addEventListener("connected", this.handleNetworkConnected.bind(this), true);

	if(_data.section){
		this.startup.bind(this).delay(1000);
		setTimeout(function(){
		_data.section.formClose();
		}.bind(this), 3000);
   	}else{
            var hotKey = typeof NGM.main.getLastHotKey == "function" ? NGM.main.getLastHotKey() : null;
            var bStartup = true;
            if (hotKey) {
                log("hotKey: "+hotKey);
                if (hotKey == KEY_NAME_NETFLIX) {
                    this.openLink(tpng.netflix.link);
                    bStartup = false;
                } else {
                    var ytparams = hotKey.match(/KEY_TV_YOUTUBE\?(.*)/)[1];
                    this._ytparams = ytparams;
                }
            }
            if (bStartup)
		this.startup();
	}
    
}

home.prototype.onYouTubeDial = function onYouTubeDial(type, value, value2)
{
    console.warn("YouTubeDial %s: %s %s", type, value, value2);
    switch (type) {
    case "start":
        /* YouTube app must be started */
        this.openYouTubeApplication(false, value);
        break;
    case "stop":
        NGM.dial.setApplicationStatus("YouTube", "stopped");
        // use MENU key to close YouTube
        if (tpng.app.reloadPlayer) {
            TvTop.dispatchKey.delay(100, TvTop, new Packages.org.w3c.dom.events.KeyEvent(0)["KEY_MENU"]);
        }
        break;
    case "status":
        break;
    }
}

home.prototype.getYouTubeUrl = function getYouTubeUrl(preload, params)
{
    var url = "https://www.youtube.com/tv";
    var extra = [];
    if (!params)
        extra.push("launch=" + (preload ? "preload" : "menu"));
    var additional = NGM.dial.getAdditionalDataUrl("YouTube");
    if (additional)
        extra.push(additional);
    if (params)
        extra.push(params);
    if (extra.length)
        url += "?" + extra.join("&");
    return url;
}

home.prototype.getUserAgent = function getUserAgent()
{
    var userAgent = settings.get("app.chromium.useragent");
    if (!userAgent)
        userAgent = "chromium/<CHROMIUMMAJORVERSION>, Totalplay_STB_<CPUVENDORPREFIX><CPUCHIPID><CPUCHIPREVISION>/<VERSION> (Netgem, <PRODUCT>, <YTWIRE>)";
    else
    if (userAgent == "-") {
        // means use chromium default
        userAgent = "";
    }
    return userAgent;
}

/* if <preload>, YouTube is started in background mode */

home.prototype.openYouTubeApplication = function openYouTubeApplication(preload, params)
{
    var url = this.getYouTubeUrl(preload, params);
    if (preload) {
        /* start in background */
        var userAgent = this.getUserAgent();
	this.bw.formOpenChild("app.html5",
                              {"keyType": "yt","userAgent": userAgent},
                              url);
    }
    else {
        /* make sure no other FormWidget is opened */
        this.formUnsetChild("*");
        this.openLink({type:"H",youtube:true,ref:url});
    }
    NGM.dial.setApplicationStatus("YouTube", "running");
}

/* keep track of number and state of chromium instances and try
 *
 *    YouTube background loading if all instances have been destroyed */
home.prototype.onChromiumEvent = function onChromiumEvent(e)
{
    var type = e.type;
    var id = e.data.id;
    console.info("onChromiumEvent %s, %s, data: %s", e.type, e.data.id, e.data.data);
    var instances = this._chromiumInstances;
    if (type === "destroy") {
        if (instances) {
            NGM.dial.setApplicationStatus("YouTube", "stopped");
            delete instances[id];
            if (!Object.getOwnPropertyNames(instances).length) {
                // no more chromium instances
                 this._chromiumInstances = null;
                 this.startBackgroundChromium();
            }
        }
    }
    else {
       // update state of given instance id
      if (!instances) {
         this._chromiumInstances = instances = {};
      }
      instances[id] = type;
      var url = e.data.data;
      if (type === "explore" && this.bw.formChildList.length &&
          typeof url === "string" &&
          url.match(/:\/\/www\.youtube\.com\/.*\?v=/)) {
          // preloaded YT has been activated (using DIAL Smooth Pairing) - show it
          console.info("Showing preloaded YouTube to play a video (via smooth pairing)");
          this.openYouTubeApplication();
      }
   }
}

home.prototype.startBackgroundChromium = function startBackgroundChromium(start)
{
    if (start) {
        if (this._chromiumInstances) {
            console.info("startBackgroundChromium: instance already running");
            return;
        }
        console.info("startBackgroundChromium: starting YouTube");
        // start YouTube as child of Background form (not visible) if there is no other chromium instance
        this.openYouTubeApplication(true);
    }
    else {
        // delay actual start
        var delay = settings.get('chromium.startbackgrounddelay') >> 0;
        if (delay > 0) {
            console.info("startBackgroundChromium in %d seconds", delay);
            this.startBackgroundChromium.delay(delay * 1000, this, true);
        }
        else {
            console.info("startBackgroundChromium: not activated");
        }
    }
}

home.prototype.handleNetworkConnected = function handleNetworkConnected(e)
{
    app.log("handleNetworkEvent: " + e.type);

    // refresh
    tpng.stb.ip = Netgem.middleware.connectionManager.activeConnection.currentIpAddress;

    if (!tpng.backend.session) {
        // try to startup now
        this.startup();
    }
}

home.prototype.showAlertDisconnected = function showAlertDisconnected(url, checkLink){
    if (checkLink) {
        var netState = this.networkState();
        if (netState != "nolink")
            return;
    }
    NGM.trace("showAlertDisconnected: " + tpng.app.section);
    tpng.app.section_tpm = tpng.app.section;
    tpng.app.section = "";
    this.closeAllNew(true);
    this.widgets.player.stateChange("exit");
    this.setBg(url);
}

home.prototype.hideAlertDisconnected = function hideAlertDisconnected(){
	NGM.trace("hideAlertDisconnected");
	tpng.app.section = tpng.app.section_tpm ? tpng.app.section_tpm : "home";
    tpng.app.section_tmp = null;
    this.widgets.player.stateChange("enter");
    this.hideBackground();
}

/***************************************************************************
Safe Mode
***************************************************************************/

home.prototype.initSafeMode = function initSafeMode(){
	tpng.app.isSafeMode = true;
	var list = NGM.main.getChannelList();
	//La lista de canales al menos siempre trae uno, el de la aplicación TPNG
	if(list.length > 1){
		tpng.app.channels = [];
		for(var i = 1, l= list.length; i<l ;i++){
			if(list[i].zapNumber>799)
				break;

			tpng.app.channelList.push(this.formatSTBChannel(list[i]));
		}
		tpng.user.profile = {
			"alias": 		"totalplay",
			"clasif": 		"D",
			"urlAvatar" : 	"imgs/home/safe_avatar_blue.png"
		}


		var channels = this.widgets.channels;
		tpng.app.channelIndex = 0;
		channels.setData(tpng.app.channelList,tpng.app.channelIndex);
		this.checkNetworkId = this.checkNetwork.repeat(5*60000, this);
	}else{
		NGM.trace("no tiene XML");
                var ip = tpng.stb.ip;
                var s = "Tu dispositivo no cuenta servicio de televisión ("+ tpng.backend.mac_address + ").";
                if (ip)
                    s += "\n(red local: "+ip + ")";
		this.openSection("error", {"home": this, "title": "Error","code": "XML",
						"message":s,
						"suggest":"Comunícate al Centro de Atención a Clientes.",
						"home": this}, false);

	}
}

home.prototype.checkNetwork = function checkNetwork (){
	this.startup();
}

home.prototype.formatSTBChannel = function formatSTBChannel(_channel){
	var channel = {
		"ChannelVO":{
			"description": "No disponible",
			"alias": "TS",
			"isCatchUp": "N",
			"isFavorite": "N",
			"isRecordable": "N",
			"isZap": "Y",
			"type": "C",
			"name": _channel.name,
			"numLang": 0,
			"numSubs": 0,
			"number": _channel.zapNumber,
			"images": {"url1X1": "img/commons/SafeModeIcon1x1.png"}
		}
	}
	return channel;
}

/***************************************************************************
Ethernet desconectado
***************************************************************************/

home.prototype.networkState = function networkState(){
	if(!tpng.app.isDev){
	    var cxManager = Netgem.middleware.connectionManager;
	    var defaultConnection = cxManager.defaultConnection;
	    var link = defaultConnection.link;
	    var isWiFi = defaultConnection.interfaceType == defaultConnection.INTERFACE_WIFI;

	    if (!link && !isWiFi)
	        return "nolink";

	    var netUp = cxManager.isNetworkUp();
        if (!netUp)
	        return "disconnected";
	}
    return "connected";
}

/***************************************************************************
Startup process
***************************************************************************/
home.prototype.forceStartup = function forceStartup()
{
    if (this.splashStartupTimer > 0)
        unsetTimeAlarm(this.splashStartupTimer);
    this.splashStartupTimer = 0;
    this.startup(true);
}

//Paso 1: Obtener el estado del cliente
home.prototype.startup = function startup(){
    var netState = this.networkState();

    app.log("[startup] netState=" + netState);
    switch (netState) {
    default:
        return;

    case "nolink":
        this.showAlertDisconnected.delay(7000, this,"img/commons/desconexion.jpg", true);
        return;

    case "connected":
        break;
    }
	tpng.backend.session = null; // para asegurarnos que pida por mac_address
	var target = settings.get('setup.targetname');
	target = target ? target.slice(0,5): "n20-1";

	//Desarrollo - Quitar antes de mandar a producción
	//target = "n25-1"; // STB n25 v1
	//target = "n25-4"; // STB n25 v3
	//target = "n20-1";
	target = "n27-1";

	var password = tpng.backend.mac_address.replace( /:/g, "");
	var ciphertext = encryptByDES(password, tpng.stb.key);
	tpng.stb.target = devices[target];
    tpng.netflix_allowChannelSurfing = settings.get("account.service.netflix.allowchannelsurfing") - 0;

	//Nombrar la STB para YT dial
	var boxName = settings.get("account.service.dial.boxname");
	var defaultBoxName = tpng.stb.target + "-" + tpng.backend.mac_address.substring(9);
	var customName = settings.get("tp.customName");

	if(!customName){
		settings.set("tp.customName",1);
		settings.set("account.service.dial.boxname",defaultBoxName);
	}

	var params = ["version="+tpng.backend.version , "userAgent=" + tpng.stb.target, "passwd=" + ciphertext];
	getServices.getSingleton().call("ADMIN_GET_CUSTOMER_STATUS", params,  this.responseStartSetup.bind(this), null, null, null, 10000);

}

home.prototype.responseStartSetup = function responseStartSetup(response){
	if(response.status == 200){
		if(tpng.app.isSafeMode){
			unsetTimeAlarm(this.checkNetworkId);
			tpng.app.isSafeMode = false;
		}
		tpng.backend.session = response.data.ResponseVO.session; 	//Sesión
		tpng.user.status = response.data.ResponseVO.code;			//Status del Cliente
		tpng.notifications.server = response.data.notificationUrl; 	//IP del servidor de notificaciones
		tpng.app.ytUserAgent = response.data.ytUserAgent; 	//IP del servidor de notificaciones
		tpng.app.showTutorial = response.data.showTutorial;

		NGM.dump(response.data,2);


		tpng.app.sections = []; 									//Limpiar la pila de secciones

		/* Registrar YouTube para DIAL must NOT be done since DIAL is
                   handled here for YouTube
		   Netgem.applications.main.applicationList_register("youtubetv", "form",
		   "app.html5?" + encodeURIComponent(tpng.app.ytUserAgent), { "dial": "YouTube", "url": "http://www.youtube.com/tv?additionalDataUrl=" }, true);
        */

        switch(tpng.user.status){
			case 0:
 				//Cliente nuevo
 				this.openSection("installer",{"home": this}, true);
			break;

			case 6://Cliente DEMO (puntos de venta) TODO
			case 1:
				//Cliente activo con usuario logueado(siempre debe entrar aquí)
				if(tpng.user.status == 6) tpng.app.isDemoTv = true;
				getServices.getSingleton().call("ADMIN_GET_USER_PROFILE", "", this.responseSendProfileInfoInit.bind(this));

			break;
			case 2:
 				//Cliente sin usuario root (nuevas instalaciones)
 				NGM.trace("NO HAY USUARIO ROOT");
 				this.openSection("setup",{"home": this}, true);
			break;
			case 3:
				this.openSection("login", {"home": this}, true);
 				//Cliente activo sin usuarios logueados (login)
			break;
			case 4:
       			//Cliente enrutado por cobranza (moroso)
       			this.openSection("defaulting",{"home": this}, true);
			break;

			case -1:
				//Cliente no aprovisionado (no existe en la base de datos)
				this.openSection("error", {"home": this, "title": "Error de aprovisionamiento","code":-1,
								"message":"Tu dispositivo no está registrado en Totalplay ("+ tpng.backend.mac_address + ").",
								"suggest":"Comunícate al Centro de Atención a Clientes",
								"home": this}, false);
			break;
			case -3:
				//Cliente mal aprovisionado (el modelo de dispositivo no coincide con el guardado en la BD)
				this.openSection("error", {"home": this, "title": "Error de aprovisionamiento","code":-3,
								"message":"El modelo de este dispositivo no coincide con el modelo registrado en tu compra. ",
								"suggest":"Comunícate al Centro de Atención a Clientes",
								"home": this}, false);
			break;
			default:
				//Cliente con estatus desconocido
			break;
		}

	}else if(response.error){
		NGM.trace("error");
		if(!tpng.app.isSafeMode)
			this.initSafeMode();
	}else{
		NGM.trace("error2");
	}

}
//Paso 2: Obtener el perfil del usuario logueado
home.prototype.responseSendProfileInfoInit = function responseSendProfileInfoInit(response){
	if(response.status == 200 && response.data.ProfileVO){
		tpng.user.profile = response.data.ProfileVO;
		tpng.user.callCenterPhone = response.data.callCenterPhone;
		tpng.app.safeNightStart = tpng.user.profile.safeNightStart;
		tpng.app.safeNightDuration = tpng.user.profile.safeNightPeriod * 60; //TODO: Cambiar la duración desde BE, por ahora 8 hras.
		var tsEnd = getNextTs(tpng.app.safeNightStart) + (tpng.app.safeNightDuration * 60 * 1000);
		tpng.app.safeNightEnd = getHourFromTs(tsEnd);
		//TODO: Validar si el usuario es test para desplegar la máscara de test.
		getServices.getSingleton().call("EPG_GET_CHANNEL_LIST", "",  this.responseSendSuscriptorChannels.bind(this));
	}else if(response.error && response.status != 200){
		//this.openSection("error", {"home": this, "title": gettext("ERROR_TITLE"),"code":response.status, "message":response.error.message,"suggest":response.error.suggest, "home": this}, false);
		if(!tpng.app.isSafeMode)
			this.initSafeMode();
	}else{
		this.openSection("login",{"home": this});
	}
}


//Paso 3: Obtener la lista de canales por usuario y sintonizar canal 1.
home.prototype.responseSendSuscriptorChannels = function responseSendSuscriptorChannels(response){
	if(response.status == 200){
		tpng.app.lastChannel = null;
		tpng.app.channelList = response.data.ResponseVO.channels;
		this.setChannelLists(tpng.app.channelList);
		if(this.updateChannelIndex){
			this.updateChannelIndex = false;
			tpng.app.channelIndex = this.findChannelIndex(tpng.app.channelIndex);
		}else{
			tpng.app.channelIndex = 0; //Cuando se cierra sesión se debe de recuperar el canal 1. //por el momento 254
		}
		//Setear los botones del header
		this.setHeaderButtons();

		//Proceso de notificaciones y recordatorios. Por el momento quedará cada hora.
		//Primero ejecuto una vez el proceso
		this.notificationsProcess();
		unsetTimeAlarm(this.notificationsTimer);
		this.notificationsTimer = this.notificationsProcess.bind(this).repeat(60 * 60000); //normalmente son 60

		var channels = this.widgets.channels;
		channels.setData(tpng.app.channelList,tpng.app.channelIndex);
		
		//#demo tv
		if(tpng.app.isDemoTv)	this.formOpenChild("demoTv",,{"home": this});

	}else if(response.error){
		//this.openSection("error", {"home": this, "title": gettext("ERROR_TITLE"),"code":response.status, "message":response.error.message,"suggest":response.error.suggest, "home": this}, false);
		if(!tpng.app.isSafeMode)
			this.initSafeMode();
	}
}



home.onFocusHeaderButtons = function onFocusHeaderButtons(_focus, _data){

		var toolTips = this.widgets.headerTooltips;
		if(_focus){
	    	toolTips.setDataAnimated({"x": _data.item.x, "text": _data.item.caption}, {"toState": "enter"});
	    	//this.widgets.headerButtons_off.animation.zIndex(4).start();
	    	//toolTips.stateChange("enter");
	    	//this.timerToShowButton = toolTips.stateChange.delay(500, toolTips, "exit");
		} else {

			unsetTimeAlarm(this.timerToShowButton);
			this.timerToShowButton = null;
			toolTips.stateChange("exit");

		}
}



home.prototype.notificationsProcess = function notificationsProcess(_callback){
	//Enviando estadísticas
	//1-Menú
	//2-More info
	//3-VOD Info
	/*
	channels = id - permanencia (en segundos)
	ctvs = idEpg - permanencia (en segundos)
	startOver = idEpg
	sections = id de sección (por definir, necesito armar el catálogo final de secciones) - ts
	items = idItem - id launching point (sugiero que sea el mismo id de sección que arriba) - ts
	apps = id - id launching point (igual que arriba) - ts
	*/
	app.log("[PROCESO DE NOTIFICACIONES/ESTADISTICAS] Se ejecto a las: " + new Date().toString());
	var tsTest = new Date().getTime();
	var statistics = this.formatStatistics();

	if(statistics){
		var params = [
					  "channels="+statistics[0],
					  "ctvs="+statistics[1],
					  "vods="+statistics[2],
					  "items="+statistics[3],
					  "startOver="+statistics[4],
					  "sections="+statistics[5],
					  "apps="+statistics[6],
					  "ip="+tpng.stb.ip
					  ];
		NGM.dump(params,2);
	}else{
		var params = null;
	}
	if(_callback)
		getServices.getSingleton().call("ADMIN_GET_NOTIFICATIONS_REM", params,  _callback.bind(this),null, null, "POST");
	else
		getServices.getSingleton().call("ADMIN_GET_NOTIFICATIONS_REM", params,  this.responseGetNotifications.bind(this),null, null, "POST");
}



home.prototype.responseGetNotifications = function responseGetNotifications(response){
	if(response.status == 200){
		//1. Recibo notificaciones, recordatorios y mensajes.
		var notifications = response.data.ResponseVO.arrayNotifications;
		var status = response.data.ResponseVO.statusSuscriptor;
		var updateChannelsTs = response.data.ResponseVO.updateChannelsTs;
		var ts = new Date().getTime();

		NGM.trace(" ");
		NGM.trace("TS BACKEND: " + (new Date(updateChannelsTs)));
		NGM.trace(" ");
		
		if(status == 4){
			this.openSection("defaulting",{"home": this}, true);
		}else{
			app.log("[PROCESO DE NOTIFICACIONES/ESTADISTICAS] Se encontraron: " + notifications.length  + " notificaciones/recordatorios.");

			//2. Recibo las promociones para el cambio de canal. Es opcional
			if(response.data.ResponseVO.arrayBanners){
				tpng.app.advertising = true;
				tpng.app.advertisingData = response.data.ResponseVO.arrayBanners[0].ItemVO;
				if(this.widgets.programInfoBack.stateGet() == "enter"){
					this.widgets.programInfoBack.redraw();
				}
			}else{
				tpng.app.advertising = false;
			}
			//3. Recordatorios y notificaciones
			//TODO: proceso para limpiar el array de timers
			this.cleanScheduleTimers();
			if(notifications.length > 0){
				var displayDelay,
					n = null;
				for(var i = 0, l = notifications.length; i < l; i++){
					n = notifications[i].NotificationVO;
					var type = n.type == "R" ? "RECORDATORIO" : "NOTIFICACION";
					app.log(type + " [" + new Date(n.displayDate) + "]");
					displayDelay = n.displayDate - new Date().getTime();
					this.scheduleNotification(n, notifications);
					this.popUpSchedule.push();
					this.popUpSchedule[i] = this.showPopUp.bind(this,n,true).delay(displayDelay);	//Producción
					n,displayDelay = null;
				}
				app.log(" ");
			}

			if(!tpng.app.firstTime && (ts < updateChannelsTs)){
				this.updateChannelListBg();
			}else{
				tpng.app.firstTime = false;
			}

			if(tpng.user.profile.socialNetworks){ //validar si hay alguna vinculada
				//Validar cual es la red social vinculada
				for(var i = 0, l = tpng.user.profile.socialNetworks.length; i<l; i++){
					if(tpng.user.profile.socialNetworks[i].SocialNetworkVO.selected)
						break;
				}
				var network = tpng.user.profile.socialNetworks[i].SocialNetworkVO;
				app.log(" ");
				app.log(" ");
				app.log("OBTENIENDO IMAGEN DE RED SOCIAL: " + network.alias);
				app.log(" ");
				app.log(" ");
				tpng.user.profile.network = "" + network.alias;
				tpng.user.profile.network = tpng.user.profile.network.toLowerCase();
				this.getNetworkImage(network);
			}
		}
	}
    if (this._ytparams) {
        this.onYouTubeDial.delay(100, this, "start", this._ytparams);
        this_ytparams = null;
    }
}

home.prototype.scheduleNotification = function scheduleNotification(){
	//Después de revisar las reglas vemos como lo presentaré
}

home.prototype.cleanScheduleTimers = function cleanScheduleTimers(){
	if(this.popUpSchedule.length > 0){
		for(var i = 0, l = this.popUpSchedule.length; i < l; i++){
			unsetTimeAlarm(this.popUpSchedule[i]);
		}
	}
	this.popUpSchedule = [];
}



home.prototype.updateChannelListBg = function updateChannelListBg(){
	NGM.main.dmsCheck();
	getServices.getSingleton().call("ADMIN_GET_USER_PROFILE", "", this.responseUpdateChannelListBg_1.bind(this));

}

home.prototype.responseUpdateChannelListBg_1 = function responseUpdateChannelListBg_1(response){
	getServices.getSingleton().call("EPG_GET_CHANNEL_LIST", "",  this.responseUpdateChannelListBg.bind(this));
}
home.prototype.responseUpdateChannelListBg = function responseUpdateChannelListBg(response){
	if(response.status == 200){
		tpng.app.lastChannel = null;
		tpng.app.channelList = response.data.ResponseVO.channels;
		this.setChannelLists(tpng.app.channelList);
		var channels = this.widgets.channels;
		channels.list = response.data.ResponseVO.channels;
		channels.refresh();
	}
}



//Paso 4: Obtener la información del programa actual en cada zapping.
home.onFocusChannelList = function onFocusChannelList(_focus, _data){
	unsetTimeAlarm(this.onFocusDelayVar);
	if(_focus){
		if(this.avoidChannelDelay){
			//Cuando viene del tuneInByNumber evitamos el delay
			this.avoidChannelDelay = false;
			tpng.app.lastChannel = tpng.app.currentChannel;
			tpng.app.currentChannel = _data.item.ChannelVO;
			this.getProgramInfo(tpng.app.currentChannel);
		}else{
			//En el zapping ponemos un pequeño delay
			//TODO: VER POR QUÉ ESTÁ EL DELAY A UN SEGUNDO, SEGÚN YO ES PARA CONTROLAR ALGO DEL ONKYEPRESSHOME
			//POR EL MOMENTO LO BAJARÉ A 10 MS
			this.onFocusDelayVar = this.onFocusDelay.bind(this, _data.item.ChannelVO).delay(10);
			//PRUEBAS PARA MEJORAR PERFORMANCE DEL ZAPPING
			//this.onFocusDelay(_data.item.ChannelVO);
		}
	}

}

home.prototype.onFocusDelay = function onFocusDelay(_channel){
	if(tpng.app.section != "animation"){ //Si está vacío significa que ya le dieron OK y está buscando las recomendaciones
		tpng.app.lastChannel = tpng.app.currentChannel;
		tpng.app.currentChannel = _channel;
		/*
		//PRUEBAS PARA MEJORAR EL PERFORMANCE DEL ZAPPING
		tpng.app.section = "home";
		tpng.app.currentProgram = {"isLocked": false, "name":"pruebas"}
		this.tuneIn(tpng.app.currentChannel, tpng.app.currentProgram);
		*/
		this.getProgramInfo(tpng.app.currentChannel);
	}

}

/***************************************************************************
HEADER/BG
***************************************************************************/

home.prototype.getHeaderButtons = function getHeaderButtons(){
	//Lleno los botones del header
	//Los "x" se deberían de modificar conforme al número de botones
	
		 	
	var buttons = [
		{"index":"1","selected": false, "x": 965, "caption": "CAMBIAR DE USUARIO", "action":"LOGOUT","img_on": tpng.user.profile.images.url1X1A, "img_off": tpng.user.profile.images.url1X1A, "img_over": tpng.user.profile.images.url1X1A, "clip":"circle"},
		{"index":"2","selected": false, "x": 1018, "caption": "BÚSQUEDA", "action":"SEARCH","img_on":"img/commons/header/BusquedaON.png","img_off":"img/commons/header/BusquedaOFF.png","img_over":"img/commons/header/BusquedaOVER.png"},
		{"index":"3","selected": false, "x": 1071, "caption": "¿NECESITAS AYUDA?", "action":"HELP","img_on":"img/commons/header/AyudaON.png","img_off":"img/commons/header/AyudaOFF.png","img_over":"img/commons/header/AyudaOVER.png"},
	];
	
	if(Netgem.applications.monitgemcompanion && Netgem.applications.monitgemcompanion.status() == "connected"){
		buttons.push({"index":"4","selected": false, "x": 1124, "caption": "¿DESACTIVAR MONITOREO?", "action":"MONITORING","img_on":"img/commons/header/NetMonON.png","img_off":"img/commons/header/NetMonOFF.png","img_over":"img/commons/header/NetMonOVER.png"});
	}

	return buttons;
}

home.prototype.setHeaderButtons = function setHeaderButtons(){
	tpng.app.headerButtons = this.getHeaderButtons();
	this.widgets.headerButtons.setData(tpng.app.headerButtons);
	var buttonsOn = this.getHeaderButtonsOn();
	this.widgets.headerButtons_off.setData(buttonsOn, 1);	
	this.widgets.headerButtons.setFocus(false);

}


home.prototype.showHeader = function showHeader(_params){
	var w = this.widgets,
		header = w.mainHeader, //fondo del header
		watch = w.mainWatch,
		buttons = w.headerButtons,
		back = w.back,
		tooltips = w.headerTooltips,
		listButtons_off = w.headerButtons_off;
	//TODO, validar cuando el header sea simple, para login y pantallas de esas

	//	back.setData(); // *** ELIMINAR
	//	back.stateChange("enter"); // *** ELIMINAR

	header.setData(_params);
	w.mainHeader_off.setData({"text":"BÚSQUEDA"});
	watch.setData({"time": new Date().toTimeString().slice(1,6) + " hrs", "date": shortFormatDate(new Date())});

	if(!_params.simple)buttons.stateChange("enter");
	header.stateChange("enter");
	watch.stateChange("enter");

	buttons.refresh();
	listButtons_off.refresh();
	header.refresh();
	watch.refresh();

	listButtons_off.focusIndex = 3;

	if(_params.section){
		buttons.setFocus(false);
		tooltips.stateChange("exit");
		if(_params.section == "help"){
			this.refreshHeader(2, "selected", true);
		}else if(_params.section == "search"){
			this.refreshHeader(1, "selected", true);
		}
	}


	unsetTimeAlarm(this.updateRefresh);
	this.updateRefresh = this.refreshWatch.bind(this).repeat(5*1000);
}

home.prototype.getHeaderButtonsOn = function getHeaderButtonsOn(){

	var buttonsOn = [
		{"index":"1","selected": false, "x": 965, "caption": "CAMBIAR DE USUARIO", "action":"LOGOUT","img_on": tpng.user.profile.images.url1X1A, "img_off": tpng.user.profile.images.url1X1A, "img_over": tpng.user.profile.images.url1X1A, "clip":"circle"},
		{"index":"2","selected": false, "x": 1018, "caption": "BÚSQUEDA", "action":"SEARCH","img_on":"img/commons/header/BusquedaON.png","img_off":"img/commons/header/BusquedaOFF.png","img_over":"img/commons/header/BusquedaOVER.png"},
		{"index":"3","selected": false, "x": 1071, "caption": "¿NECESITAS AYUDA?", "action":"HELP","img_on":"img/commons/header/AyudaON.png","img_off":"img/commons/header/AyudaOFF.png","img_over":"img/commons/header/AyudaOVER.png"},
	];
	
	return buttonsOn;
}

home.prototype.refreshHeader = function refreshHeader(_index, _property, _value){
	var w = this.widgets,
		headerButtons = w.headerButtons;
	tpng.app.headerButtons[_index][_property] = _value ;
	headerButtons.data =  tpng.app.headerButtons;
	headerButtons.refresh();
}

home.prototype.hideHeader = function hideHeader(){
	var w = this.widgets,
		header = w.mainHeader,
		watch = w.mainWatch,
		buttons_off = w.headerButtons_off,
		buttons = w.headerButtons;

	tpng.app.headerButtons = this.getHeaderButtons();
	unsetTimeAlarm(this.updateRefresh);

	this.client.lock();
		watch.stateChange("exit");
		header.stateChange("exit");
		buttons_off.stateChange("exit");
		buttons.stateChange("exit");
	this.client.unlock();
	
	var buttonsOn = this.getHeaderButtonsOn();
	buttons_off.setData(buttonsOn, 1);
	buttons.setData(tpng.app.headerButtons);
	buttons.setFocus(false);
	buttons_off.setFocus(false);
}




home.prototype.refreshWatch = function refreshWatch(){
	var w = this.widgets,
		watch = w.mainWatch;
	watch.setData({"time": new Date().toTimeString().slice(1,6) + " hrs", "date": shortFormatDate(new Date())});
	watch.refresh();

}



home.prototype.isHeaderVisible = function isHeaderVisible(){
	var w = this.widgets,
		header = w.mainHeader;
	var visible = header.stateGet() == "enter" ? true : false;
	return visible;
}

home.prototype.setBg = function setBg(_url,_layer){
    var w = this.widgets,
    bg = w.mainBg;
    bg.setDataAnimated({"url":_url, "layer":_layer});
    bg.refresh();
    if (bg.stateGet() != "enter")
    	bg.stateChange("enter");
}

home.prototype.hideBg = function hideBg(_url, _bCounter){
	var w = this.widgets,
	bg = w.mainBg;
	bg.setData();
	bg.refresh();
	bg.stateChange("exit");

    if (_bCounter) {
        this.hideLoadingCounter();
    }
}


home.prototype.showLockedStream = function showLockedStream(_error){
	var w = this.widgets,
	player = w.player,
	bg = w.mainBg;
	player.setData();
	player.stateChange("exit");
	bg.setData({"url": "img/commons/0x0-Back_Wood-BW_HD.jpg", "error": _error});
	bg.stateChange("enter");
	bg.refresh();
	tpng.app.lockedStream = true;
}



home.prototype.hideLockedStream = function hideLockedStream(_error){
	var w = this.widgets,
	player = w.player,
	bg = w.mainBg;
	bg.stateChange("exit");
}


home.prototype.hideProgramInfo = function hideProgramInfo(_simple){
	var w = this.widgets,
		programInfo = w.programInfo,
		channels = w.channels,
		safeMode = w.safeModeHeader
		back = w.programInfoBack;

	this.client.lock();
	     programInfo.stateChange("exit");
	     channels.stateChange("exit");
	     back.stateChange("exit");
	this.client.unlock();

	if(tpng.app.isSafeMode){
		safeMode.stateChange("exit");
	}

	tpng.app.section = "home";
}

/***************************************************************************
PENDIENTES DE ORDENAR
***************************************************************************/
home.prototype.openLink = function openLink(_link, _section, _from, _id, _item){
	//TODO: por el momento agregué el item en el menú, si backend me lo agrgea las imágenes en el link
	//lo quito de la función.

	NGM.dump(_item,3);

	if(!_link)
		return;
    
    var netState = this.networkState();
    if (netState == "nolink") {
        NGM.trace("Ignoring openLink in " + netState + " state");
        return;
    }
	
	//Actions
	if(_link.action){
		var stbTs = new Date().getTime();
		var url = tpng.backend.url + "Actions";
		var params = _link.action.split(",");
		params.push("session=" + tpng.backend.session);
		params.push("stbTs="+stbTs);
		tp_httpRequest.getSingleton().send(url, null, "POST", params);
	}
	
	NGM.trace(" ");
	NGM.trace(" ");
	NGM.trace("......................................................");
	NGM.trace("ABRIENDO EL LINK:");
	NGM.dump(_link,2);
	NGM.trace("......................................................");
	NGM.trace(" ");
	NGM.trace(" ");

	//Revisar de donde salió el link
	_from = _from ? _from : sections_id[_uu().formName];
	//Guardar estadísticas de Links
	tpng.statistics.items.push({"id":_link.id, "ts": new Date().getTime(), "value": (_from ? _from : 0) });

	//Exclusivo para aplicaciones
	if(_link.type == "E" || _link.type == "I" || _link.type == "N" || _link.type == "H"){
		this.closeAllApp(true);
		tpng.app.reloadPlayer = true;
	}

	NGM.trace(" ");

	switch(_link.type){
		case "E":
			this.setBg(_item.images.url18X18);
			NGM.trace("EXTERNA");
			tpng.app.section = "";
			this.formOpenChild("app.html", {"formData": {
					"form.url": _link.ref,
					"form.title": "",
					"modalChild": "true"},
					"launcher":{"nobg":"true"}},
					{"tpng": tpng, "home": this, "params": _link.parameters});

		break;
		case "I":
			NGM.trace("INTERNA");
			window.onBlur = this.onBlur.bind(this);
   			window.onFocus = this.onFocus.bind(this);
			NGM.main.open(_link.ref);
			this.internalAppOpened = true;
		break;
		case "N":
			//FIX: Netflix cada vez que se abre cierra TPNG por lo que las estadisticas se pierden.
			//Enviarlas antes de abrir netflix.

			unsetTimeAlarm(this.notificationsTimer);
			this.notificationsProcess(this.callbackNetflix.bind(this,_link));


		break;
		case "S":
			NGM.trace("SECCION");
			var store = _link.ref == "anytimePlayer" || _link.ref == "programDetail" || _link.ref == "vodPlayer" || _link.ref == "vodWizzard" || _link.ref == "vodDetail" ? false : true;
			this.openSection(_link.ref,{"home": this, "parameters": _link.parameters}, store);

		break;
		case "C":
			NGM.trace("CANAL " + _link.parameters.channel );
	    	this.tuneInByNumber(_link.parameters.channel,null, null, true);
		break;
		case "H":
            // hide background and stop counter
            this.hideBg(null, true);
			NGM.trace("HTML5");
	 	   	//this.setBackground(_app.launcher);
  	        	var url = "" + _link.ref;
                        var userAgent = this.getUserAgent();
        	    	if (_link.youtube || url.match(/:\/\/www.youtube.com\//)) {
                	// use correct url for YouTube (including DIAL stuff)
               	 		if (!_link.youtube)
          	         		 url = this.getYouTubeUrl();
                		if (this.bw.formChildList.length) {
                	     		//display preloaded YouTube app
               	    			 this.formMoveChild(this.bw.formChildList[0]);
               	 		}
               	 		else {
			    		this.formOpenChild("app.html5", {"keyType": "yt", "userAgent": userAgent},  url);
            	    		}
                                NGM.dial.setApplicationStatus("YouTube", "running");
            		}
          	  	else {
        	        	// do not use YT keys for non YT app
				this.formOpenChild("app.html5", _link.parameters, url);
	    		}
		break;
	}
}

home.prototype.callbackNetflix = function callbackNetflix(_link, retry = 0){
	NGM.trace(" ");
	NGM.trace(" ");
	NGM.trace(" ");
	NGM.trace(" ");
	NGM.trace("CALLBACK NUEVO DE NETFLIX");
	NGM.dump(_link);

	if(_link.parameters){
 		_link.parameters['exitCallback'] = this.onFocus.bind(this);
 	}else{
 		NGM.trace("CALLBACK");
 		_link.parameters = {"exitCallback": this.onFocus.bind(this)};
 	}
 	if(_link.parameters.id){ //Siempre tomo como mandatorio el ID que venga de la BD
 		var id = _link.parameters.id;
 	}else{ //Sino hay nada en la BD debe ser un launching point de cambio de canal (epg, channelsurfing, channelNumber)
 		if(tpng.netflix.fromMiniGuide){
 			tpng.netflix.fromMiniGuide = false;
 			var id = "epg";
 		}else{
 			var id = tpng.netflix.channelSurfing ? "channelSurfing" : "channelNumber";
 		}
 	}
	var index = this.widgets.channels.selectIndex;
	var paramsN = {
					"id": id,
					"category": _link.parameters.category,
					"chID": tpng.app.currentChannel.number,
					"prevChID": tpng.app.channelList[index-1].ChannelVO ? tpng.app.channelList[index-1].ChannelVO.number : -1,
					"nextChID": tpng.app.channelList[index+1].ChannelVO ? tpng.app.channelList[index+1].ChannelVO.number : -1
				};
    if (tpng.netflix_allowChannelSurfing)
        paramsN.allowChannelSurfing = true;
    dump(paramsN);
    if (tpng.netflix_allowChannelSurfing) {
        // make sure no other FormWidget is opened
        if (this.delayedAppTimer)
            unsetTimeAlarm(this.delayedAppTimer);
        this.delayedAppTimer = 0;
        var form = this.formChildList[0];
        if (retry < 30) {
            // for Netflix, must wait for form to be closed (up to 15s)
            var isNetflix = form && form.toString().indexOf("app.netflix") >= 0;
            if (isNetflix) {
                // reset _name to prevent opening the MENU when returning to TV
                this.delayedAppTimer = this.callbackNetflix.delay(500, this, _link, (retry || 0) + 1);
                return;
            }
        }
        
        this.formUnsetChild("*");
        // open in form child
        this.formOpenChild(_link.ref, {}, paramsN);
        tpng.app.reloadPlayer = tpng.app.currentChannel.type != "I";
    } else {
        // open as new app
        Netgem.applications.main.liveList_openTemporaryApplication(_link.ref, {}, paramsN);
    }
 	this.internalAppOpened = true;
}

home.prototype.openSection = function openSection(_name, _params, _store, _section, _nest){
	var player = this.widgets.player;
	var bg = this.widgets.mainBg;


	if(_name){
		if(_store)
			tpng.app.sections.push({"name": _name, "params": _params});

		if(_section)
			_section.formClose();
			
		if(!_nest && this.formHasChild()){
			var c = this.formGetChild();
            var isNetflix = c.toString().indexOf("app.netflix") >= 0;
            // leave Netflix alone
            if (!isNetflix) {
                c.formClose();
            }
		}

		if(tpng.app.currentChannel.type == "C" || tpng.app.currentChannel.type == "M"){
			if(noPlayerSections.indexOf(_name)!= -1 && !_nest){
				//Este trace es temporal mientras termina ciclo de QA
				//NGM.trace(" ");
				//NGM.trace("noPlayerSection: " + _name + " /Canal tipo C y tipo M");
				player.setData();
				player.stateChange("exit");
			}else if(noChangePlayerSections.indexOf(_name)!= -1){
				//Este trace es temporal mientras termina ciclo de QA
				//NGM.trace(" ");
				//NGM.trace("1 nochangePlayerSection: " + _name + " /Canal tipo C y tipo M");
				//NGM.trace("1 bg.data " + bg.data + "player.stateGet() " + player.stateGet() + "   " + tpng.app.lockedStream);
				//No hago nada con el player, pero si está en vacío lo reanudo
				if(player.stateGet() == "exit" && !tpng.app.lockedStream){
					this.tuneIn(tpng.app.currentChannel);
				}else if(player.stateGet() == "exit" && tpng.app.lockedStream && !bg.data){
					tpng.app.programInfo = "guide";
					this.getProgramInfo(tpng.app.currentChannel);
				}
			}else if(miniPlayerSections.indexOf(_name)!= -1){
				//Este trace es temporal mientras termina ciclo de QA
				//NGM.trace(" ");
                //NGM.trace("miniPlayerSection: " + _name + " /Canal tipo C y tipo M" );
				player.setData();
				player.stateChange("mini");

			}else if(miniPlayerSectionsB.indexOf(_name)!= -1){
				//NGM.trace(" ");
                //NGM.trace("miniPlayerSectionB: " + _name + " /Canal tipo C y tipo M" );
				player.setData();
				player.stateChange("miniB");

			}else if(player.stateGet() == "exit" && !tpng.app.lockedStream && !_nest){
				//NGM.trace(" ");
				//NGM.trace("deberia reanudar el player..." + tpng.app.currentChannel.name);
				this.tuneIn(tpng.app.currentChannel);
			}
		}else{
			//canales de música
			if(noPlayerSections.indexOf(_name)!= -1 && !_nest){
				//NGM.trace(" ");
				//NGM.trace("noPlayerSection: " + _name + " /Canal tipo " + tpng.app.currentChannel.type);
				bg.setData();
				bg.stateChange("exit");
				bg.refresh();
			}else if(noChangePlayerSections.indexOf(_name)!= -1){
				//NGM.trace(" ");
				//NGM.trace("noChangePlayerSection: " + _name + " /Canal tipo " + tpng.app.currentChannel.type);
				if(player.stateGet() == "exit" && !tpng.app.lockedStream && tpng.app.currentChannel.type == "S"){
					this.tuneIn(tpng.app.currentChannel);
				}
			}else if(miniPlayerSections.indexOf(_name)!= -1){
				//NGM.trace(" ");
				//NGM.trace("miniPlayerSection: " + _name + " /Canal tipo " + tpng.app.currentChannel.type);
				bg.setData();
				bg.stateChange("exit");
				bg.refresh();
			}else{
				//Esto quiere decir que el widget no está en CONSTANTS
			}
		}


		if(cleanBgSections.indexOf(_name)!= -1){
			bg.setData();
			bg.refresh();
		}

		//tpng.statistics.channels.push({"id": -5, "ts": new Date().getTime()});
		NGM.trace("------------------------------");
		NGM.trace("ABRIENDO: " + _name);
		NGM.trace("------------------------------");
		if(_nest){
			var child = this.formOpenChild(_name, null, _params);
			child.nest = _nest;
		}else{
			this.formOpenChild(_name, null, _params);
		}

	}
}

home.prototype.closeAll = function closeAll(_section){
	this.hideHeader();
	tpng.app.sections = [];
	if(_section)
		_section.formClose();

	if(this.formHasChild()){
		var c = this.formGetChild();
		c.formClose();
	}

}
home.prototype.closeAllNew = function closeAllNew(_clean){
	var player = this.widgets.player;
	//Limpiando las secciones
	if(_clean) tpng.app.sections = [];
	this.hideHeader();
	//Cerrando las secciones
	if(this.formChildList.length > 0){
		for(var i = this.formChildList.length-1, l = 0; i >= l ; i--){
			NGM.trace("[CLOSE ALL] Closing: " + this.formChildList[i].formName);
			var c = this.formChildList[i];
			if(c) c.formClose();
			c = null;
		}
	}
	//Regresando el player
	if(player.stateGet() == "exit" && !tpng.app.lockedStream && tpng.app.currentChannel.type != "I"){
		this.tuneIn(tpng.app.currentChannel);
	}
}

home.prototype.closeAllApp = function closeAllApp(_clean){
	var player = this.widgets.player;
	//Limpiando las secciones
	if(_clean) tpng.app.sections = [];
	this.hideHeader();
	//Cerrando las secciones
	if(this.formChildList.length > 0){
		for(var i = this.formChildList.length-1, l = 0; i >= l ; i--){
			NGM.trace("[CLOSE ALL] Closing: " + this.formChildList[i].formName);
			var c = this.formChildList[i];
			if(c) c.formClose();
			c = null;
		}
	}
	//Regresando el player
	player.setData();
	player.stateChange("exit");
}


home.prototype.openVODSection = function openVODSection(_name, _params, _section, _no_store){
	if(_section){
		if(!_no_store)
			tpng.app.sections.push({"name": _name, "params": _params});

		var child = _section.formOpenChild(_name, ,_params);
		child.vodSection = true;
	}
}


home.prototype.closeSection = function closeSection(_section, _search){
	var player = this.widgets.player;
	var bg = this.widgets.mainBg;

	if(_section){
		if(tpng.app.sections.length >= 0){



			var last = tpng.app.sections[tpng.app.sections.length-1].name;

			NGM.trace(" ");
			NGM.trace("------------------------------------------ ");
			NGM.trace("CLOSE SECTION TRACES (ES TEMPORAL PARA QA)");
			NGM.trace("------------------------------------------ ");
			NGM.trace("ULTIMA SECCION STACK: " + last);
			NGM.trace("SECCION A CERRAR: " + _section.formName);
			NGM.trace("SECCION ANIDADA " + (_section.nest?true:false));
			NGM.trace(" ");
			NGM.trace(" ");

			if(last == _section.formName)
				tpng.app.sections.pop();

			var parent = tpng.app.sections[tpng.app.sections.length - 1];

			if(_section.vodSection){
				NGM.trace(" ");
				NGM.trace("CERRANDO SECCION VOD");
				NGM.trace(" ");
				_section.formClose();
				return;
			}

			if(_section.nest){
				NGM.trace(" ");
				NGM.trace("CERRANDO SECCION ANIDADA");
				NGM.trace(" ");
				_section.formClose();
				return;
			}

			if(parent){
				this.openSection(parent.name, parent.params, false, _section);
			}else{
				if(_search){
					_section.formClose();
					this.tuneInByNumber(tpng.app.currentChannel.number, true,null,false);
				}else{
					NGM.trace("ULTIMA SECCION, YA LLEGO EN EL HOME");
					NGM.trace(" ");
					NGM.trace(" ");
					
					//#demo tv
					if(tpng.app.isDemoTv) this.formOpenChild("demoTv",,{"home": this});
					
					//Cuando llego al home y por alguna razón el player
					//está en "exit" lo reanudamos con tuneIn
					_section.formClose();
					//NGM.trace("player la la la: " + player.stateGet() + " tpng.app.currentChannel.type: " + tpng.app.currentChannel.type);
					if(player.stateGet() == "exit" && tpng.app.currentChannel.type != "I"){
						NGM.trace("CASO DONDE LLEGO AL HOME, ES CANAL Y NO HAY PLAYER");
						
					



						if(tpng.app.lockedStream && !bg.data){
							var error = {
										"error":   gettext("BLOCKED_PROGRAM_ERROR"),
										"cause":   gettext("BLOCKED_PROGRAM_RT_CAUSE"),
										"suggest": gettext("BLOCKED_PROGRAM_SUGGEST"),
										"img": "img/tv/BloqCLASIF.png"
										};
							this.showLockedStream(error);

						}else if (!tpng.app.lockedStream){
							
							this.tuneIn(tpng.app.currentChannel);
						}

					}else if(tpng.app.currentChannel.type == "I" && !bg.data){
						//validar canales de musica y de apps
						//Esto quiere decir que llego a un canal interactivo o de música y no tenía BG
						NGM.trace("CASO DONDE LLEGO AL HOME, ES INTERACTIVO Y NO TENIA BG");
						this.tuneIn(tpng.app.currentChannel);
					}
				}
			}
		}else{
			//Este es el caso que cierra una sección que no fue almacenada
			//como MENU, TIMELINE, ETC
			if(_section)
				_section.formClose();
		}

	}
}

home.prototype.takeOutProgramInfo = function takeOutProgramInfo(_number, getProgramInfo){
	unsetTimeAlarm(this.hideProgramInfoDelay);
	this.hideProgramInfo();
}

home.prototype.setChannelLists = function setChannelLists(_channels){
	//Función que forma la lista de canales por tipo.
	tpng.app.channels = [];
	tpng.app.mosaics  = [];

	for(var i = 0, l = _channels.length; i < l ; i++){
		if(_channels[i].ChannelVO.type == "C" || _channels[i].ChannelVO.type == "S")
			tpng.app.channels.push(_channels[i]);
		if(_channels[i].ChannelVO.type == "I" ){ //TODO: Agregar && _channels[i].ChannelVO.link.ref == "mosaic"
			if(_channels[i].ChannelVO.link.ref == "mosaic")
				tpng.app.mosaics.push(_channels[i]);
		}
	}
}

home.prototype.findChannelIndex = function findChannelIndex(_number, _channels){
	var channels = _channels ? _channels : tpng.app.channelList;
	var channel = null;
	for(var i = 0, l = channels.length ; i < l ; i++){
		channel = channels[i].ChannelVO;
		if(channel.number == _number){
			return i;
		}else if(i < (l-1)){
			channel = null;
			channel = channels[i+1].ChannelVO;
			if(_number < channel.number ){
				return i+1;
			}
		}

	}
	return 0;
}


home.prototype.findChannel = function findChannel(_number, _channels){
	//return channel;
	var channels = _channels ? _channels : tpng.app.channelList;
	var channel = null;
	for(var i = 0, l = channels.length ; i < l ; i++){
		channel = channels[i].ChannelVO;
		if(channel.number == _number){
			return channel;
		}else if(i < (l-1)){
			channel = null;
			channel = channels[i+1].ChannelVO;
			if(_number < channel.number ){
				return channel;
			}
		}

	}
	return channels[0].ChannelVO;
}


/*PRUEBAS DE PUBLICIDAD EN BARRA DE CANALES*/
home.prototype.onKeyPressAdvertising = function onKeyPressAdvertising(_key){
	var w = this.widgets,
		strokeFocus = w.strokeFocusNotifications,
		popUp = w.notificationsPopUp;

	switch(_key){
    	case "KEY_TV_CHNL_UP":
	    case "KEY_TV_CHNL_UP_LONG":
	    	  this.nextChannel();
	    break;
    	case "KEY_TV_CHNL_DOWN":
	    case "KEY_TV_CHNL_DOWN_LONG":
	    	this.prevChannel();
    	break;
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
			this.takeOutProgramInfo();
    		this.setChannelNumber(_key.substr(_key.length-1,1),true);
		break;
		case "KEY_TV_AUDIO":
    		this.changeAudio();
    	break;
    	case "KEY_TV_SUBTITLE":
    		this.changeSubtitle();
    	break;
    	case "KEY_CAPS_LOCK":
		case "KEY_TV_SWAP":
			if(tpng.app.lastChannel){
				channels.setData();
				this.tuneInByNumber(tpng.app.lastChannel.number);
			}
		break;
		case "KEY_INFO":
		case "KEY_IRENTER":
			if(this.gettingInfo){ //Bandera que me dice que ya termino de cargar la info, fix para error al agregar la publicidad =(
				if(tpng.app.lockedStream){ //Si está bloqueado
		    		this.takeOutProgramInfo();
					this.openSection("unlockProgram",{"home":this, "channel": tpng.app.currentChannel, "program": tpng.app.currentProgram},false);
				}else{
					if(!tpng.app.isSafeMode){
							if(tpng.app.currentChannel.type == "I"){
								if(tpng.app.currentChannel.link)
									this.openLink(tpng.app.currentChannel.link);
								else
									NGM.trace("ERROR: NO TIENE LINK Y ES INTERACTIVO");
							}else{
								if(tpng.app.twitterApp){
									this.closeSection(tpng.app.twitterApp);
			    				}
			    				tpng.app.programInfo = "more";
								tpng.app.section = "animation"; //un section fake para controlar la animación
								this.getProgramInfo(tpng.app.currentChannel);
							}
					}
				}
			}
		break;

    	case "KEY_TV_VOD":
	    	this.takeOutProgramInfo();
			this.openSection("vodHome", {"name": "vodHome", "home":this}, true);
		break;
    	case "KEY_UP":
    	case "KEY_DOWN":
    	case "KEY_LEFT":
    	case "KEY_RIGHT":
    		if(this.gettingInfo){
	    		unsetTimeAlarm(this.hideProgramInfoDelay);
				this.hideProgramInfoDelay = this.hideProgramInfo.bind(this).delay(10000); //10 segundos más
	    		this.widgets.channelsAdvertising.stateChange("enter");
	    		tpng.app.section = "advertisingComplete";
	    	}
    	break;

    	case "KEY_MENU":
    	case "KEY_IRBACK":
	    	if(this.gettingInfo){
    			this.takeOutProgramInfo();
    		}
    	break;

    }
	return true;
}

home.prototype.onKeyPressAdvertisingComplete = function onKeyPressAdvertisingComplete(_key){
	var w = this.widgets,
		advertising = w.channelsAdvertising;

	switch(_key){
		case "KEY_TV_CHNL_UP":
	    case "KEY_TV_CHNL_UP_LONG":
	    	  this.nextChannel();
	    break;
    	case "KEY_TV_CHNL_DOWN":
	    case "KEY_TV_CHNL_DOWN_LONG":
	    	this.prevChannel();
    	break;
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
			this.takeOutProgramInfo();
    		this.setChannelNumber(_key.substr(_key.length-1,1),true);
		break;
		case "KEY_TV_AUDIO":
    		this.changeAudio();
    	break;
    	case "KEY_TV_SUBTITLE":
    		this.changeSubtitle();
    	break;
    	case "KEY_CAPS_LOCK":
		case "KEY_TV_SWAP":
			if(tpng.app.lastChannel){
				channels.setData();
				this.tuneInByNumber(tpng.app.lastChannel.number);
			}
		break;
    	case "KEY_IRENTER":
    	case "KEY_INFO":
    		if(advertising.data.link && tpng.app.advertisingEnable){
    			this.takeOutProgramInfo();
    			this.openLink(advertising.data.link);
    		}
    	break;
    	case "KEY_UP":
    	case "KEY_DOWN":
    	case "KEY_LEFT":
    	case "KEY_RIGHT":
    	case "KEY_MENU":
    	case "KEY_IRBACK":
    		unsetTimeAlarm(this.hideProgramInfoDelay);
			this.hideProgramInfoDelay = this.hideProgramInfo.bind(this).delay(3000); //5 segundos más
			tpng.app.section = "advertising";
    		advertising.stateChange("hide");
    	break;

    }
	return true;
}

/*******************************************/

home.prototype.hideLoadingCounter = function hideLoadingCounter(){
	//TODO: Hacerlo bien, con cualquier tecla cancelo el contador
 	if(this.widgets.loadingCounter) {
        this.widgets.loadingCounter.stateChange("exit");
        unsetTimeAlarm(this.loadingCounterTimer);
        this.loadingCounterTimer = null;
    }
    if (this.autoLaunchDelay) {
        unsetTimeAlarm(this.autoLaunchDelay);
        this.autoLaunchDelay = null;
    }
}


/***************************************************************************
OnKeyPress Section
***************************************************************************/
home.prototype.onKeyPress = function onKeyPress(_key){
	this.hideLoadingCounter(_key);
    if (_key == KEY_NAME_NETFLIX) {
        return true;
    }
	switch(tpng.app.section){
		case "info":
		case "home": //Sobre la TV
			unsetTimeAlarm(this.autoLaunchDelay);
			this.onKeyPressHome(_key);
		break;
		case "advertising": //Publicidad compacta
			unsetTimeAlarm(this.autoLaunchDelay);
			this.onKeyPressAdvertising(_key);
		break;
		case "advertisingComplete": //Publicidad extendida
			unsetTimeAlarm(this.autoLaunchDelay);
			this.onKeyPressAdvertisingComplete(_key);
		break;
		//Terminan los onkeypress que controlan canales

		case "channelBar":
			this.onKeyPressChannelBar(_key);
		break;

		case "search":
			this.onKeyPressSearch(_key);
		break;
		case "locked":
			this.onKeyPressLocked(_key);
		break;
		case "popUp":
			this.onKeyPressPopUp(_key);
		break;
		case "popUpLink":
			this.onKeyPressPopUpLink(_key);
		break;
		/*
		case "help":
		 	this.onKeyPressHelp(_key);
		break;
		case "avatar":
		 	this.onKeyPressAvatar(_key);
		break;
		*/
		case "moreInfoTop":
			this.onKeyPressMoreInfo_Top(_key);
		break;
		case "moreInfoBottom":
			this.onKeyPressMoreInfo_Bottom(_key);
		break;
		case "header":
		 	this.onKeyPressHeader(_key);
		break;
		case "exit_info":
			this.onKeyPressExit_Info(_key);
		break;
	}
	
	return true;
}


home.prototype.onKeyPressHome = function onKeyPressHome(_key){
	//Keys sobre la TV (cuando ya está oculta la barra de canales)
	var w = this.widgets,
		channels = w.channels,
		advertising = w.channelsAdvertising;

	//El OK/Más Info lo sacaré del switch y lo pondré en un if

	if((_key == "KEY_INFO" || _key == "KEY_IRENTER") && (tpng.app.section == "home" || tpng.app.section == "info")) //Si presiona OK o INFO sobre LIVE
	{
		if(this.gettingInfo){ //Bandera que me dice que ya termino de cargar la info, fix para error al agregar la publicidad =(
				if(tpng.app.lockedStream){ //Si está bloqueado
					if(tpng.app.section == "info")
		    			this.takeOutProgramInfo();
					this.openSection("unlockProgram",{"home":this, "channel": tpng.app.currentChannel, "program": tpng.app.currentProgram},false);
				}else{
					if(!tpng.app.isSafeMode){
						if(tpng.app.section == "info" || tpng.app.section == "home"){
							if(tpng.app.currentChannel.type == "I"){ //Si es un canal interactivo
								if(tpng.app.currentChannel.link)
									this.openLink(tpng.app.currentChannel.link, null, 2);
								else
									NGM.trace("ERROR: NO TIENE LINK Y ES INTERACTIVO");
							}else{
								if(tpng.app.twitterApp){ //Twitter
									this.closeSection(tpng.app.twitterApp);
			    				}
			    				tpng.app.programInfo = "more";
								tpng.app.section = "animation"; //un section fake para controlar la animación
								this.getProgramInfo(tpng.app.currentChannel);
							}
						}
					}
				}
			}



	}else if (_key == "KEY_IRENTER" && tpng.app.currentChannel.type == "C" && !tpng.app.isSafeMode){
		//YA NO HAGO NADA
	}


	switch(_key){
        case KEY_NAME_EXIT:
            if (this.formHasChild()){
                var c = this.formGetChild();
                c.formClose();
                this.showProgramInfo(true);
            }
            break;

		case "KEY_TV_CHNL_UP":
	    case "KEY_TV_CHNL_UP_LONG":
	    	  this.hideLoadingCounter();
	    	  this.nextChannel();
	    break;
    	case "KEY_TV_CHNL_DOWN":
	    case "KEY_TV_CHNL_DOWN_LONG":
	    	this.hideLoadingCounter();
	    	this.prevChannel();
    	break;
   	   	case "KEY_TV_AUDIO":
   	   		this.hideLoadingCounter();
    		this.changeAudio();
    	break;
    	case "KEY_TV_SUBTITLE":
    		this.hideLoadingCounter();
    		this.changeSubtitle();
    	break;
    	case "KEY_CAPS_LOCK":
		case "KEY_TV_SWAP":
			if(tpng.app.lastChannel){
				channels.setData();
				this.tuneInByNumber(tpng.app.lastChannel.number);
			}
		break;
		case "KEY_TV_0":
			if(tpng.app.isSafeMode){
    			this.safeModeModeSetup(false,"0");
			}else
				this.setChannelNumber(_key.substr(_key.length-1,1),true);
		break;
		case "KEY_TV_1":
		case "KEY_TV_2":
		case "KEY_TV_3":
		case "KEY_TV_4":
		case "KEY_TV_5":
		case "KEY_TV_6":
		case "KEY_TV_7":
		case "KEY_TV_8":
		case "KEY_TV_9":
			if(tpng.app.section == "info")
				this.takeOutProgramInfo();
    		this.setChannelNumber(_key.substr(_key.length-1,1),true);
		break;


		//Teclas shortcuts
		case "KEY_UP":
    	case "KEY_MENU":
    		if(this.gettingInfo){ //Bandera que me dice que ya termino de cargar la info, fix para error al agregar la publicidad =(
	    		if(!tpng.app.isSafeMode){
					tpng.app.twitter = false;
		    		if(tpng.app.section == "info")
		    			this.takeOutProgramInfo();
                    this.openSection("menu", {"home":this}, true);
                    if (tpng.app.currentChannel.link.type == "N") {
                        // must go somewhere when pressing MENU on Netflix
                        this.nextChannel.delay(2000, this);
                    }
	    		}else{
	    			this.safeModeModeSetup(true,"");
	    		}
	    	}
    	break;

		case "KEY_GUIDE":
    	case "KEY_DOWN":
    		if(this.gettingInfo){ //Bandera que me dice que ya termino de cargar la info, fix para error al agregar la publicidad =(
	    		if(!tpng.app.isSafeMode){
					tpng.app.twitter = false;
		    		if(tpng.app.section == "info")
			    		this.takeOutProgramInfo();
					this.openSection("miniGuide", {"home":this}, true);
				}
			}
		break;

		case "KEY_LEFT":
		case "KEY_RIGHT":
			if(this.gettingInfo){ //Bandera que me dice que ya termino de cargar la info, fix para error al agregar la publicidad =(
				if(!tpng.app.isSafeMode){
					tpng.app.twitter = false;
					if(tpng.app.currentChannel.type == "C"){
						if(tpng.app.section == "info")
				    		this.takeOutProgramInfo();
			    		this.openSection("timeline", {"home":this}, true);
			    	}
		    	}
		    }
    	break;

    	case "KEY_TV_VOD":
    		if(this.gettingInfo){ //Bandera que me dice que ya termino de cargar la info, fix para error al agregar la publicidad =(
	    		if(!tpng.app.isSafeMode){
					if(tpng.app.section == "info")
		    			this.takeOutProgramInfo();
					this.openSection("vodHome", {"name": "vodHome", "home":this}, true);
					//this.openSection("vodAZ", {"name": "vodAZ", "home":this}, true);
				}
			}
		break;

    	case "KEY_IRBACK":
    		if(this.gettingInfo && tpng.app.section == "info"){
    			this.takeOutProgramInfo();
    		}
    	break;

        case "KEY_TV_RED":
            this.openSection("wifiHome", {"name": "wifiHome", "home":this}, true);
        break;

    	/*
    	case "KEY_TV_RED":
    		var n = {"message":"Contrata el plan Unidos con Todo con 3 meses gratis Â¡CÃ¡mbiate ya!","notId":2,"displayDate":1459881000000,"displayTime":10000,"openUrl":"home/showPopup","subject":"Besos ilimitados","link":{"id":"5_2","ref":"promotions_template_1","images":{"url18X18":"http://iptvcore.totalplay.com.mx:80/TPMCOREWeb/MasterImage?mimId=171041","url1X1":"http://iptvcore.totalplay.com.mx:80/TPMCOREWeb/MasterImage?mimId=171040"},"auto":false,"parameters":{"prmId":"37"},"type":"S"},"images":{"url18X18":"http://iptvcore.totalplay.com.mx:80/TPMCOREWeb/MasterImage?mimId=171041","url1X1":"http://iptvcore.totalplay.com.mx:80/TPMCOREWeb/MasterImage?mimId=171040"},"backGroundColor":"0.5-rgba(71,78,85,1)|1-rgba(71,78,85,1)","from":"Unidos con Todo","type":"N"};
    		this.showPopUp(n);
    		unsetTimeAlarm(this.hidePopUpDelay);
			this.hidePopUpDelay = this.hidePopUp.bind(this).delay(n.displayTime);//10 segundos
    	break;
    	case "KEY_TV_GREEN":
    		var n = {"message":"","notId":2,"displayDate":1459881300000,"displayTime":5000,"subject":"","link":{"id":"5_2","ref":"promotions_template_1","images":{"url18X18":"http://iptvcore.totalplay.com.mx:80/TPMCOREWeb/MasterImage?mimId=163639"},"auto":false,"parameters":{"prmId":"37"},"type":"S"},"images":{"url18X18":"http://iptvcore.totalplay.com.mx:80/TPMCOREWeb/MasterImage?mimId=163639"},"channels":[1],"backGroundColor":"rgba(255,255,255,1)","from":"","type":"I"};
    		this.showPopUp(n);
    		unsetTimeAlarm(this.hidePopUpDelay);
			this.hidePopUpDelay = this.hidePopUp.bind(this).delay(n.displayTime);//10 segundos
    	break;
    	case "KEY_TV_YELLOW":
    		var n = {"message":"","notId":3,"displayDate":1459881600000,"displayTime":5000,"subject":"","link":{"id":"5_3","ref":"promotions_template_1","images":{"url18X18":"http://iptvcore.totalplay.com.mx:80/TPMCOREWeb/MasterImage?mimId=176851"},"auto":false,"parameters":{"prmId":"37"},"type":"S"},"images":{"url18X18":"http://iptvcore.totalplay.com.mx:80/TPMCOREWeb/MasterImage?mimId=176851"},"channels":[1],"backGroundColor":"rgba(248,128,0,1)","from":"","type":"I"};
    		this.showPopUp(n);
    		unsetTimeAlarm(this.hidePopUpDelay);
			this.hidePopUpDelay = this.hidePopUp.bind(this).delay(n.displayTime);//10 segundos
    	break;
    	*/

        case KEY_NAME_NETFLIX:
    		if(this.gettingInfo){ //Bandera que me dice que ya termino de cargar la info, fix para error al agregar la publicidad =(
				if(tpng.app.section == "info")
	    			this.takeOutProgramInfo();
				this.openLink(tpng.netflix.link,null,15);
			}
		break;

	}
	return true;
}

home.prototype.onKeyPressPopUp = function onKeyPressPopUp(_key){
	var w = this.widgets,
		strokeFocus = w.strokeFocusNotifications,
		popUp = w.notificationsPopUp;

	switch(_key){
    	case "KEY_IRBACK":
    		this.hidePopUp();
    	break;

    	case "KEY_UP":
		   	tpng.app.section = "popUpLink";
		   	unsetTimeAlarm(this.hidePopUpDelay);
		   	strokeFocus.stateChange("exit");
		   	popUp.setData({"objeto":this._object, "focus":true});
		   	popUp.refresh();
	    break;

	    case "KEY_IRENTER":
		   	unsetTimeAlarm(this.hidePopUpDelay);
		    this.hidePopUp();
	    break;

    }
	return true;
}

home.prototype.onKeyPressPopUpLink = function onKeyPressPopUpLink(_key){
	var w = this.widgets,
		strokeFocus = w.strokeFocusNotifications,
		popUp = w.notificationsPopUp;

	switch(_key){
    	case "KEY_IRBACK":
    		this.hidePopUp();
    	break;

    	case "KEY_IRENTER":
    		this.hidePopUp();
    		this.openLink(popUp.data.objeto.link, null,8);
    	break;

	     case "KEY_DOWN":
		    tpng.app.section = "popUp";
		    popUp.setData({"objeto":this._object, "focus":false});
		   	popUp.refresh();
		   	unsetTimeAlarm(this.hidePopUpDelay);
		    strokeFocus.stateChange("enter");
    		this.hidePopUpDelay = this.hidePopUp.bind(this).delay(3000)//3 segundos
	    break;

    }
	return true;
}



home.prototype.safeModeModeSetup = function safeModeModeSetup(firstTime,value){
	var that = this;
	if(tpng.app.isSafeMode){
		if(firstTime){
			this.secretKey = "";
		}else{
			this.secretKey = this.secretKey + value;
			clearTimeout(this.safeModeTimer);
			this.safeModeTimer = setTimeout(
					function (){
						this.secretKey = "";
					}
			, 1000);//3 seg y se limpia
			if(this.secretKey == "000"){
				NGM.application.open("setup", {'title': "setup", "url": "setup"});
				//abre el setup
				//timer para borrar
				clearTimeout(this.safeModeTimer);
			}
		}
	}
}

/***************************************************************************
Cambio de Canal con teclado numérico
***************************************************************************/
//1. Mostrar la barra de canal, en esta se pinta el número enviado por el usuario.
//Después de medio segundo intacto llama la función findChannelMatches que busca
//los canales que empiezan con los números enviados, ejemplo "25" mandaría lo que encuentre en 25, 250 - 259.
home.prototype.setChannelNumber = function setChannelNumber(_number, getProgramInfo){
	//Limpiando timers de tuneIn y FindMatches
	unsetTimeAlarm(this.tuneInByNumberDelay);
	unsetTimeAlarm(this.findChannelMatchesDelay);
	unsetTimeAlarm(this.getProgramMatchesDelay);
	//Validación de los números enviados
	if(_number && tpng.app.channelNumber.length < 3){
		tpng.app.section = "channelBar";
		tpng.app.channelNumber = tpng.app.channelNumber + _number;
		//Eliminamos estos traces!!!
		//NGM.trace("numero --> " + tpng.app.channelNumber);
		this.startTs = new Date().getTime();
		//Este timer es para el delay del tunein, el tuneIn necesita un delay para poder guardar las teclas del usuario,
		//En TPNG 2.0 teníamos 1500, aquí intentaremos con 1000, en caso de ser menos de 2 números lo subiremos a 3000.
		//var timer = tpng.app.channelNumber.length < 3 ? 2000 : 1000;
		this.showChannelBar(tpng.app.channelNumber);

		//mejorar lo de cargando, quitar el foco y no permitir el scrollnext/prev
		if(tpng.app.channelNumber.length < 3){
			var matchesTimer = 1000; //Este delay tiene que ser menor que el caso donde hay 3 números. Es decir que 1000.
			this.findChannelMatchesDelay = this.findChannelMatches.bind(this, tpng.app.channelNumber, true, true).delay(matchesTimer);
		}else{
			NGM.trace("ELSE presiono 3 numeros");
			//Le quite el delay
			this.tuneInByNumberDelay = this.tuneInByNumber.bind(this, tpng.app.channelNumber, true, true).delay(10);
		}

	}else if (tpng.app.channelNumber.length == 3){
		//Si el usuario presiono demasiado rápido el tercer número lo envía inmediatamente
		//al número presionado. Bug de TPNG 2.0
		NGM.trace("ELSE presiono 3 numeros muy rapido");
		tpng.app.section = ""; //Limpio la sección para evitar que seleccionen algo durante el delay de la sintonización
		this.tuneInByNumber(tpng.app.channelNumber, true, true);
	}
}
//En caso de encontrar canales que coinciden con el número presionado muestra una lista con ellos, en caso
//que no encuentre coincidencias muestra un mensaje diciendo que lo llevará al próximo canal.
//TODO: VALIDAR SAFE MODE
home.prototype.findChannelMatches = function findChannelMatches(_channel){
	//Encuentra los canales que coinciden con el presionado por el usuario.
	//Prepara el delay para obtener los programas de los canales encontrados.
	unsetTimeAlarm(this.getProgramMatchesDelay);
	var matches = this.getChannelMatches(_channel);
	this.showChannelMatches(matches);
	if(matches.length > 0){
		//Si encuentra coincidencias después de un segundo inactivo hace la petición para traer
		//la programación actual de los canales encontrados. Se obtienen de backend.
		if(!tpng.app.isSafeMode){
			unsetTimeAlarm(this.getProgramMatchesDelay);
	  		this.getProgramMatchesDelay = this.getProgramMatches.bind(this, _channel).delay(500);
	  	}else{
	  		unsetTimeAlarm(this.tuneInByNumberDelay);
			this.tuneInByNumberDelay = this.tuneInByNumber.bind(this, tpng.app.channelNumber, true, true).delay(1000); //Delay de 5 segundos para cambiar de canal
	  	}

	}else{
		//Como no se encontraron coincidencias limpio el timer y pongo algo menor
		this.showNoMatchesMessage();
		tpng.app.section = ""; //Limpio la sección para evitar que seleccionen algo durante el delay de la sintonización
		unsetTimeAlarm(this.tuneInByNumberDelay);
		this.tuneInByNumberDelay = this.tuneInByNumber.bind(this, tpng.app.channelNumber, true, true).delay(1000); //Delay de 5 segundos para cambiar de canal
	}
}

home.prototype.getProgramMatches = function getProgramMatches(_channel){
	tpng.app.section = "";
	var params = ["ts="+new Date().getTime() , "prefix=" + _channel];
	getServices.getSingleton().call("EPG_GET_CHANNEL_MATCHES", params, this.responseGetChannelMatches.bind(this));
}

home.prototype.responseGetChannelMatches = function responseGetChannelMatches(response){
	tpng.app.section = "channelBar";
	if(response.status == 200){
		NGM.trace("en el backend se encontraron: " + response.data.ResponseVO.channels.length + " coincidencias.");
		if(response.data.ResponseVO.channels.length > 0){
			var matches = response.data.ResponseVO.channels;
			this.showChannelMatches(matches);
		}else{
			NGM.trace("ERROR: El backend no está enviando coincidencias");
		}
	}else if(response.error){
		//Este caso no lleva una pantalla de error, pero lo mostraré en consola
		NGM.dump(response.error,2);
	}
	//Siempre mandamos el tuneIn, independientemente si el backend respondió o no.
	//Revisar el tiempo del delay, a mi se me hacen mucho 3seg, pero para Mike es poco pq tarda en querer scrollear.
	var w = this.widgets,
		matches = w.channelMatches;
	unsetTimeAlarm(this.tuneInByNumberDelay);
	this.tuneInByNumberDelay = this.tuneInByNumber.bind(this,  matches.selectItem.ChannelVO.number, true, true).delay(3000);

}
home.prototype.showNoMatchesMessage = function showNoMatchesMessage(){
	var message = this.widgets.channelMessage;
		message.setData();
		message.stateChange("enter");
}

home.prototype.showChannelMatches = function showChannelMatches(_channels){
	var w = this.widgets,
		matches = w.channelMatches;

	w.rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line": false, "position": ""});
	w.leftArrow.setData({"url": "" ,"line": true, "position": "left"});
	w.leftArrow.stateChange("enter");

	if(_channels.length > 4){
	    w.rightArrow.stateChange("enter");
	}else{
	    w.rightArrow.stateChange("exit");
	}
	matches.setData(_channels);
	matches.stateChange("enter");
	matches.refresh();

}

home.prototype.onKeyPressChannelBar = function onKeyPressChannelBar(_key){
	var w = this.widgets,
		matches = w.channelMatches,
		leftArrow = w.leftArrow,
		rightArrow = w.rightArrow;
	switch(_key){

			case "KEY_MENU":
			case "KEY_IRBACK":
				unsetTimeAlarm(this.tuneInByNumberDelay);
				unsetTimeAlarm(this.findChannelMatchesDelay);
				unsetTimeAlarm(this.getProgramMatchesDelay);
				this.hideChannelBar();
			break;
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
	    		this.setChannelNumber(_key.substr(_key.length-1,1),true);
			break;
			case "KEY_LEFT":
			case "KEY_RIGHT":
				//Checar este comportamiento con los diseñadores
				_key == "KEY_LEFT" ? matches.scrollPrev() : matches.scrollNext();
				unsetTimeAlarm(this.tuneInByNumberDelay);
				this.tuneInByNumberDelay = this.tuneInByNumber.bind(this, matches.selectItem.ChannelVO.number, true, true).delay(5000); //Delay de 5 segundos para cambiar de canal
				//Flechas para canales
				if(matches.maxItem > 4){
					if(matches.selectIndex >= 4){
						leftArrow.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
						leftArrow.stateChange("enter");
					}
					if(matches.selectIndex == (matches.maxItem-1)){
						rightArrow.setData({"url": "" ,"line":true, "position": "right"});
						rightArrow.stateChange("enter");
					}
					if(matches.selectIndex == 0){
						leftArrow.setData({"url":"", "line":true, "position": "left"});
						leftArrow.stateChange("enter");
					}
					if(matches.selectIndex < 4){
						rightArrow.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
						rightArrow.stateChange("enter");
					}

				}

			break;
			case "KEY_IRENTER":
                    var number = matches.selectItem.ChannelVO.number;
                    if (!number)  {
                        // if too quick after digit, must find 'manually'
                        var channel = this.findChannel(tpng.app.channelNumber);
                        number = channel.number;
                    }
                    if (number) {
                        unsetTimeAlarm(this.getProgramMatchesDelay);
                        unsetTimeAlarm(this.tuneInByNumberDelay);
                        unsetTimeAlarm(this.findChannelMatchesDelay);
                        this.tuneInByNumber(number, true, true);
                    }
			break;
	}
	return true;
}

home.prototype.getChannelMatches = function getChannelMatches(_channel){
	NGM.trace(" ");
	NGM.trace(" ");
	var matches = [];
	var number = "";
	var channel = null;
	//Ver con BE si los canales INTERACTIVE entrarán en estas coincidencias, en teoria sí.
	for(var i = 0, l = tpng.app.channelList.length; i <l ; i++){
		number = tpng.app.channelList[i].ChannelVO.number.toString();
		channel = tpng.app.channelList[i].ChannelVO;
		if(_channel == number.substr(0,_channel.length)){
			matches.push(tpng.app.channelList[i]);
		}
		number = "";
		channel = null;
	}
	NGM.trace("se encontraron en TPNG: " + matches.length + " coincidencias.");
	return matches;
}

home.prototype.showChannelBar = function showChannelBar(_number){
	var w = this.widgets,
		bar = w.channelNumberBar;
		bar.setData({"number": _number});
		if(bar.stateGet()=="exit")bar.stateChange("enter");
		bar.refresh();
}

home.prototype.hideChannelBar = function hideChannelBar(_number){
	unsetTimeAlarm(this.getProgramMatchesDelay);
	var w = this.widgets,
		bar = w.channelNumberBar,
		matches = w.channelMatches,
		leftArrow = w.leftArrow,
		rightArrow = w.rightArrow,
		message = w.channelMessage;

	//Evaluamos que los widgets existan.
	if(rightArrow)
		rightArrow.stateChange("exit");
	if(leftArrow)
		leftArrow.stateChange("exit");
	if(matches)
		matches.stateChange("exit");
	if(message)
		message.stateChange("exit");
	bar.stateChange("exit");
	tpng.app.channelNumber="";
	tpng.app.section = "home";
}


/***************************************************************************
TuneIn Section
***************************************************************************/
home.prototype.tuneInByNumber = function tuneInByNumber(_number, _showProgramInfo, _hideChannelBar, _closeAll){
	var channels = this.widgets.channels;
	var player = this.widgets.player;



	//Convertirlo a número por si teclean "001" se vaya al 1
	_number = _number * 1;

	NGM.trace("_number: " + _number);

	if(_closeAll){
		//Hacemos un close all para cerrar todos (Caso especial en los players)
		//TODO: Implementar este nuevo src en el closeAll
		this.hideHeader();
		tpng.app.sections = [];
		if(this.formChildList.length > 0){
			for(var i = this.formChildList.length-1, l = 0; i >= l ; i--){
				NGM.trace("[CLOSE ALL] Closing: " + this.formChildList[i].formName);
				var c = this.formChildList[i];
				if(c) c.formClose();
				c = null;
			}
		}
	}
	if(_hideChannelBar){
		//Truco para settear el numero en la barra antes de sintonizar
		if(tpng.app.channelNumber != _number){
			this.showChannelBar(_number);
		}
		tpng.app.channelNumber = ""; //Limpiar variable
		this.hideChannelBar(); //Esconder barra de canales
        if (this.widgets.channelMatches)
            this.widgets.channelMatches.setData();        
	}
	//Traces Temporales
	this.endTs = (new Date().getTime()) - this.startTs;
	/*
	NGM.trace(" ");
	NGM.trace(" ");
	NGM.trace("delay en funcion tuneInByNumber: " + this.endTs);
	NGM.trace(" ");
	NGM.trace(" ");
	*/
	//PARA HACER EL EFECTO DE QUE SINTONIZA MÁS RÁPIDO LIMPIO EL PLAYER
	player.setData();
	player.stateChange("exit");
	//El onfocus del channelList tiene un delay para el zapping CH+/CH-
	//Para el tuneInBynumber evitaré ese delay con una bandera
	this.avoidChannelDelay = true;
	//Continuo con la función normal, busco el canal y hago un set Data.
	var index = this.findChannelIndex(_number); //Verificar que el canal esté en tu paquete, sino encontrar el más próximo.
	channels.setData(tpng.app.channelList,index);
	channels.refresh();
	tpng.netflix.channelSurfing = false;
}


home.prototype.nextChannel = function nextChannel(_channel, doPrev){
	/*	   
    var children = this.formChildList;
    var n   = children.length;
    for (var i = n; --i >= 0; ) {
        var c = children[i];
        var isNetflix = c && c.toString().indexOf("app.netflix") >= 0;
        // leave Netflix alone
        if (!isNetflix) {
            this.formUnsetChild(c);
        } else {
            log("leave form alone "+c.toString());                
        }
    }
    */
	var channels = this.widgets.channels;
	var programInfo = this.widgets.programInfo;
	unsetTimeAlarm(this.onFocusDelayVar);
	unsetTimeAlarm(this.hideProgramInfoDelay);
	this.gettingInfo = false;
    if (doPrev)
        channels.scrollPrev();
    else
        channels.scrollNext();
	tpng.netflix.channelSurfing = true;
	this.getProgramInfoSimple(channels.selectItem.ChannelVO);
}

home.prototype.prevChannel = function prevChannel(_channel){
    this.nextChannel(_channel, true);
}

//FALTA EL TUNE IN --- COMO FALTA CÓDIGO ESTÁ MÁS ABAJO

/***************************************************************************
Parental Section
***************************************************************************/

home.prototype.isLockedFunction = function isLockedFunction(_program){
	var ratingChannel = _program.rating.level,
		ratingUser = userRatings[tpng.user.profile.rating],
		isLocked = ratingChannel > ratingUser;
	if(tpng.app.unlockedPrograms.indexOf(_program.id)!=-1)
		isLocked = false; //Esta desbloqueado por el root
	//TODO, cuando limpiar esto.. supongo que cada 12 hras, en el envío de estadísticas.
	return isLocked;
}

home.prototype.unlockProgram = function unlockProgram(_channel, _program){
	NGM.trace("unlocking");
	this.hideLockedStream();
	tpng.app.currentProgram.isLocked = false;
	tpng.app.unlockedPrograms.push(tpng.app.currentProgram.id);
	this.tuneIn(tpng.app.currentChannel, tpng.app.currentProgram);
	//por ahora me saltaré la parte donde desbloquea (llamar al js y etc)
	//y sólo emularé que lo desbloqueo
}

/***************************************************************************
Get Program Info Section
***************************************************************************/
home.prototype.getProgramInfoSimple = function getProgramInfoSimple(_channel){

	var channel = NGM.main.getChannelByZap(_channel.number);
	var program = null;
	var src = null;
	_tunein = _tunein ? _tunein : true;

	if(_channel.type == "C" || _channel.type == "S"){
		src = "STB";
		program = NGM.epg.createByIndex(channel, 0);

		if((!program.name || program.name == "Programa desconocido") && !tpng.app.isSafeMode){
			program = {"name": " ", "parentalRating": program.parentalRating};
		}
	 }else if(_channel.type == "I" || _channel.type == "M"){
	 	src = "INTERACTIVE";
	 	var now = new Date().getTime();
	 	program = {"name": _channel.name, "tsStart": now, "tsEnd": now + (60000*60), "parentalRating": _channel.rating};
	 }
	//tpng.app.currentChannel = _channel;	 XFR: No estoy seguro si esto afecte, pero le afectaba al prev channel
	this.mapProgramInfoSimple(program, src);

}

home.prototype.mapProgramInfoSimple = function mapProgramInfoSimple(_program, _src){
		var w = this.widgets,
			programInfo = w.programInfo,
			back = w.programInfoBack;

		tpng.app.currentProgram = _program;

		if(_src == "STB"){
			var program = JSON.stringify(_program);
			program = JSON.parse(program);
			program.id = _program.id*1;
			program.duration = _program.duration;
			program.description = _program.description;
			program.parentalRating = _program.parentalRating;

			program.startTime = _program.startTime * 1000;
			program.endTime = _program.endTime * 1000;

			//TODO ver porque la primera vez no pinta el banner de publicidad
			if(!back.data || back.data.draw == "more"){	back.setData(program);}
			programInfo.setData(program);

			tpng.app.advertisingEnable = false;
			this.showProgramInfo(true);
		}
}



home.prototype.showProgramInfo = function showProgramInfo(_simple){
	var w = this.widgets,
		programInfo = w.programInfo,
		channels = w.channels,
		safeMode = w.safeModeHeader,
		back = w.programInfoBack;

	var state = programInfo.stateGet();
	var state_back = back.stateGet();

	//TODO-> revisar esto pq hay veces que entra de more a enter
	if(state_back != "enter"){
		back.stateChange("enter");
	}

	this.client.lock();
	     if(state != "enter"){ //TODO: revisar que no le pegue a OK - more info
	     	programInfo.stateChange("enter");
	     	channels.stateChange("enter");
	     }else{
	     	programInfo.refresh();
	     	channels.refresh();
	     }
	this.client.unlock();

	if(tpng.app.isSafeMode){
		safeMode.setData();
		safeMode.stateChange("enter");
	}

	//Mostrar info sin publicidad (todo normal como antes)
	tpng.app.section = "info";
	this.gettingInfo = _simple ? false : true;
	unsetTimeAlarm(this.hideProgramInfoDelay);
	this.hideProgramInfoDelay = this.hideProgramInfo.bind(this, _simple).delay(5000);



}
//MAIN PROGRAM INFO, DE AQUÍ SE LANZA EL TUNEIN, CONTROL PARENTAL ETC
home.prototype.getProgramInfo = function getProgramInfo(_channel){
	var channel = NGM.main.getChannelByZap(_channel.number);
	var program = null;
	var src = null;
	_tunein = _tunein ? _tunein : true;

	if(_channel.type == "C" || _channel.type == "S"){
		src = "STB";
		program = NGM.epg.createByIndex(channel, 0);
	 }else if(_channel.type == "I" || _channel.type == "M"){
	 	src = _channel.type == "I" ? "INTERACTIVE" : "MOSAIC";
	 	program = {"name": _channel.name, "tsEnd": 0, "tsStart":0, "parentalRating": _channel.rating};
	 }

	tpng.app.currentChannel = _channel;

	if((!program.name || program.name == "Programa desconocido") && !tpng.app.isSafeMode){
		//No hay EPG, llamar servicio EPG 102
		this.getProgramInfoBE(_channel.number, _channel.lchId);
	}else{
		//Si hay EPG, mando el SRC que puede ser STB o INTERACTIVE
		this.mapProgramInfo(program, src);
	}

}

home.prototype.mapProgramInfo = function mapProgramInfo(_program, _src, force){
    if (!force && this.splashStartupTimer) {
        this.splashCB = this.mapProgramInfo.bind(this, _program, _src, true);
        return;
    }
		var w = this.widgets,
			programInfo = w.programInfo,
			back = w.programInfoBack;


                var program = {};
                try {
                    program = JSON.stringify(_program);
                    if (program)
                        program = JSON.parse(program);
                    else
                        program = {};
                } catch(e)
                {
                    program = {};
                }

		//TODO: faltan los actores.
		if(_src == "STB"){
			program.id = _program.id*1;
			program.duration = (_program.duration/60);
			program.description = _program.description;
			program.parentalRating = _program.parentalRating;

			program.startTime = _program.startTime * 1000;
			program.endTime = _program.endTime * 1000;

			program.tweetFeed = _program.country;
			program.isPopular = _program.credits.actor;
			program.useRootPassword = _program.program.credits.presenter;
			program.hasReminder = false; //ver si puedo sacarlo de notifications
			program.rating = programRatingsSTB[program.parentalRating];
		}else if(_src == "BE"){
			program.rating = programRatingsBE[program.parentalRating];
		}else if(_src == "INTERACTIVE" || _src == "MOSAIC"){
				NGM.trace(" ");
				NGM.trace(" ");
//				NGM.dump(program);
		}
		if(!tpng.app.isSafeMode){ //EN SAFE MODE NO FUNCIONA EL ISLOCKED
			program.isChannelCtv = tpng.app.currentChannel.isCtv; //Ver si no le pega cuando lo llamen de las guías
			program.isChannelNpvr = tpng.app.currentChannel.isNpvr;
			program.isLocked = this.isLockedFunction(program);
			//Los programas D ni C ya no serán "Programa Bloqueado" sólo la descripción
			program.name = program.name;
		}
		tpng.app.currentProgram = program;


		if(tpng.app.currentChannel.type == "C"){
			var ms = (tpng.app.currentProgram.endTime) - (new Date().getTime());
			NGM.trace(" ");
			NGM.trace("FALTA " +  Math.round((ms/1000)/60) + " MIN PARA QUE TERMINE: " + tpng.app.currentProgram.name);
			NGM.trace(" ");

                        if (ms > 0) {
                            unsetTimeAlarm(this.updateProgramDelay);
                            this.updateProgramDelay = this.updateProgramInfo.bind(this,tpng.app.currentProgram).delay(ms);
                        }
		}


		//EVALUAR tpng.app.programInfo:
		//zap: cuando estás cambiando de canal y tiene que sintonizar, es el default
		//info: sólo actualiza el tpng.app.currentProgram
		//more: actualiza la información y muestra el moreInfo
		//TRACES PARA QA - DESARROLLO
		//NGM.trace("1. tpng.app.section: " + tpng.app.section);
		//NGM.trace("2. tpng.app.programInfo: " + tpng.app.programInfo + " / " +_src);

		//PANTALLA DE BIENVENIDA
		//1. Verificar si hay una versión instalada
		var lastVersion = settings.get("tpng.lastVersionInstalled");
   		var actualVersion = settings.get("app.main.version") + '-' + settings.get("app.main.subversion");
        if (!lastVersion || lastVersion != actualVersion){
			//En caso de que no exista una versión guardada, guardamos el setting
            if (!tpng.app.isDev && tpng.app.showTutorial)
                tpng.app.new_version = true;        	            
		    settings.set("tpng.lastVersionInstalled", actualVersion);
        }else{
        	tpng.app.new_version = false;
        }


		if(tpng.app.programInfo == "zap"){
			if(_src != "MOSAIC"){

				if(!back.data || back.data.draw == "more"){	back.setData(program);}
				programInfo.setData(program);

				if(!tpng.app.new_version || tpng.app.isDev){
					tpng.app.advertisingEnable = true;
					this.showProgramInfo();
				}
			}
			this.tuneIn(tpng.app.currentChannel, program);
		}else if(tpng.app.programInfo == "guide" || tpng.app.programInfo == "timeline"){
			tpng.app.programInfo = "zap"; //regreso el valor default del program info
			this.tuneIn(tpng.app.currentChannel, program);
		}else if(tpng.app.programInfo == "update"){
			tpng.app.programInfo = "zap"; //Le regreso el valor default
			this.checkStream(tpng.app.currentChannel, program);
		}else{
			var action = tpng.app.programInfo;
			tpng.app.programInfo = "zap"; //regreso el valor default del program info
			if(action == "more"){
				program.draw = "more";
				program.ChannelVO = tpng.app.currentChannel;
				this.showMoreInfo(program);
			}
		}

		//3.Cambiar la bandera a false y lanzar la pantalla de bienvenida
		if(tpng.app.new_version && !tpng.app.isDev && tpng.app.showTutorial){
			this.openSection("welcome",{"home": this}, false);
			tpng.app.section = "home";
			this.gettingInfo = true;
			tpng.app.new_version = false;
		}

}

home.prototype.updateProgramInfo = function updateProgramInfo(_program){
	NGM.trace("UPDATING PROGRAM INFO");
	tpng.app.programInfo = "update";
	this.getProgramInfo(tpng.app.currentChannel);
}

home.prototype.checkStream = function checkStream(_channel, _program){
	//NGM.trace("CHECKING STREAM");
	//Esta función bloquea o desbloquea un canal para safe night o control parental.
	//Para que funcione tiene que cumplir con las siguientes condiciones
	//1. El usuario tiene que estar en LIVE (sólo HOME)
	//2. El canal actual tiene que ser de tipo C (No audio, No Interactivos, No mosaicos)

	//TODO: cómo hacer para que no salte el player... pq no quiero hacer un set data pero tmp quiero hacer un nuevo tunein
	var player = this.widgets.player;
	if(tpng.app.sections.length == 0 && (tpng.app.section == "info" || tpng.app.section == "home") && tpng.app.currentChannel.type == "C"){
		//NGM.trace("PASO LA VALIDACION");
		this.tuneIn(_channel, _program, true);
	}
}

home.prototype.getProgramInfoBE = function getProgramInfoBE(_number, _id){
	var params = ["channel=" + _number, "lchId=" + _id];
	getServices.getSingleton().call("EPG_GET_PROGRAM_INFO", params, this.responseGetProgramInfoBE.bind(this));
}

home.prototype.responseGetProgramInfoBE = function responseGetProgramInfoBE(response){
	if(response.status == 200){
		this.mapProgramInfo(response.data.ResponseVO.program.ProgramVO, "BE");
	}else if(response.error){
		NGM.dump(response.error,2);
		var now = new Date().getTime();
		this.mapProgramInfo({"name": "Programa desconocido", "startTime": now, "endTime": now + (60000*60)}, "BE");
	}
}


home.prototype.isSafeNight = function isSafeNight(_program){

	var tsStart = getNextTs(tpng.app.safeNightStart);
	var tsEnd = tsStart + (tpng.app.safeNightDuration * 60 * 1000);
	var now = new Date().getTime();
	//NGM.trace(" ");
	//NGM.trace("SAFE NIGHT START: " + new Date(tsStart));
	//NGM.trace("SAFE NIGHT END: " + new Date(tsEnd));
	//NGM.trace(" ");
	if(now >= tsStart && now <= tsEnd){
		return true;
	}else{

	}
}



home.prototype.isSafeNightEnabled = function isSafeNightEnabled(_program){
	//Aquí evaluariamos las demás variables si indican si un programa estará o no bloqueado
	//1. Si el usuario tiene activo el setting de safe night //tpng.user.profile.safeNight
	//2. Si el programa es clasificación C o D //_program.rating.level > 2
	//3. Si el programa ya está desbloqueado por el root > //tpng.app.unlockedPrograms.indexOf(tpng.app.currentProgram.id)==-1

	//NGM.trace("EL USUARIO TIENE ACTIVO SAFE NIGHT");

	//Para guías
	if(this.isSafeNight() && tpng.user.profile.isSafeNight)
		tpng.app.safeNightOn = true;
	else
		tpng.app.safeNightOn = false;

	if(this.isSafeNight() && tpng.user.profile.isSafeNight && _program.rating.level > 4 && tpng.app.unlockedPrograms.indexOf(tpng.app.currentProgram.id)==-1){
		return true;
	}else{
		tpng.app.safeNightOn = false;
		false;
	}

}

home.prototype.turnOnSafeNight = function turnOnSafeNight(){
	var player = this.widgets.player;
	player.setData();
	player.stateChange("exit");
	var error = {
					"error":   gettext("BLOCKED_PROGRAM_ERROR"),
					"cause":   gettext("BLOCKED_PROGRAM_SN_CAUSE") + tpng.app.safeNightStart + " hrs. " + gettext("BLOCKED_PROGRAM_SN_CAUSE_2") + tpng.app.safeNightEnd + " hrs. ",
					"suggest": gettext("BLOCKED_PROGRAM_SUGGEST")
					}
	this.showLockedStream(error);

}

home.prototype.tuneIn = function tuneIn(_channel, _program, _checkStream){
	var w = this.widgets,
		player = w.player,
		bg = w.mainBg;

	if(this.isSafeNightEnabled(_program)){
		NGM.trace("PROGRAMA BLOQUEADO POR SAFE NIGHT: " + _program.name);
		var error = {
					"error":   gettext("BLOCKED_PROGRAM_ERROR"),
					"cause":   gettext("BLOCKED_PROGRAM_SN_CAUSE") + tpng.app.safeNightStart + " hrs. " + gettext("BLOCKED_PROGRAM_SN_CAUSE_2") + tpng.app.safeNightEnd + " hrs. ",
					"suggest": gettext("BLOCKED_PROGRAM_SUGGEST"),
					"img": "img/tv/BloqNOCSEG.png"
					}
		this.showLockedStream(error);
	}else if (_program.isLocked){
		NGM.trace("PROGRAMA BLOQUEADO POR CLASIFICACION: " + _program.name);
		var error = {
					"error":   gettext("BLOCKED_PROGRAM_ERROR"),
					"cause":   gettext("BLOCKED_PROGRAM_RT_CAUSE"),
					"suggest": gettext("BLOCKED_PROGRAM_SUGGEST"),
					"img": "img/tv/BloqCLASIF.png"
					};
		this.showLockedStream(error);
	}else{
		tpng.app.lockedStream = false; //TMP ver si aquí es el mejor lugar para ponerlo
		if(_channel){
			var channel = NGM.main.getChannelByZap(_channel.number);
			bg.stateChange("exit");

			//Estadísticas - canales
			tpng.statistics.channels.push({"id": _channel.lchId, "value": _channel.number, "ts": new Date().getTime()});

			//TODO: CAMBIAR A SWITCH CASE YA ESTÁ MUY ANIDADO ESTE IF
			if(_channel.type == "C"){
				if(!_checkStream ){
					//Limpiar el background
					bg.setData();
					bg.stateChange("exit");
					//Ver que tipo de canal es: TS, HLS o HLSAD
                    // for OTT recognize HLS channels
                    if (!_channel.alias && _channel.url && _channel.url.match(/\.m3u8/i))
                        _channel.alias = "HLS";
					NGM.trace("alias: " + _channel.alias);
					switch(_channel.alias){
						case "TS":
							if(channel){
								player.setData(channel);
							}else{
								NGM.trace("url del backend");
								player.setData(_channel.url);
							}
						break;
						case "HLSAD":
						case "HLS":
							var vm = _channel.isEncrypted ? 1 : 0;
							player.setData();
				    		player.setData(_channel.url,{"playerType": "hls", "seekable": true, "noInfo": true, "playerProperties":{"forceVM": vm}});
						break;
					}
					player.stateChange("enter");

				}
			}else if(_channel.type == "S"){
					this.setBg(_channel.images.url18X18);
					player.setData(channel);
					player.stateChange("enter");

			}else if(_channel.type == "I"){
					//Canales interactivos: Trailes (S), Youtube (H), Netflix (N), TuneIn (E), etc.
					//Por ahora la validación de netflix la haré a través de la numeración, si el cambio es aprovado
					//Modificaremos el type en backend
                    var autoLaunch = _channel.link.type == "N" && tpng.netflix_allowChannelSurfing;
					if(!autoLaunch) {
						this.setBg(_channel.images.url18X18);
					}
					player.setData();
			     	player.stateChange("exit");
			     	if(_channel.link){
			     		switch(_channel.link.type){
			     			case "S":
			     				//Falta evaluar el auto para las "S"
			     				if(_channel.link.auto){
				     				this.takeOutProgramInfo();
				     				if(_channel.link.parameters){
				     					_channel.link.parameters.home = this;
				     				}else{
				     					_channel.link.parameters = {"home": this};
				     				}
				     				this.openSection(_channel.link.ref,_channel.link.parameters, false);
			     				}
			     			break;
			     			default:
			     				//Lanzar automáticamente una app
			     				//Para netflix mientras cambiamos el backend validamos con el número
			     				if(autoLaunch) {
			     					bg.setData();
									bg.stateChange("exit");
			     					this.autoLaunchApp(_channel.link);
			     				} else
			     				if(_channel.link.auto){
			     					this.secondsLoading = 8;
						     		this.widgets.loadingCounter.setData(this.secondsLoading);
						     		this.widgets.loadingCounter.stateChange("enter");
						     		unsetTimeAlarm(this.loadingCounterTimer);
									this.loadingCounterTimer = this.updateLoadingCounter.bind(this).repeat(1000); //normalmente son 60
						     		unsetTimeAlarm(this.autoLaunchDelay);
						            this.autoLaunchDelay = this.autoLaunchApp.bind(this, _channel.link).delay(this.secondsLoading*1000);//Lo desaparezco en 10 seg
						     	}
			     			break;
			     		}
			     	}
			}else if(_channel.type == "M"){
	     		player.setData();
		     	player.stateChange("exit");
		     	this.takeOutProgramInfo();
		     	if(_channel.link){
		     		_channel.link.parameters.home = this;
		     		this.openSection(_channel.link.ref,_channel.link.parameters, false);
		     	}
	     	}
		}
	}
}

home.prototype.updateLoadingCounter = function updateLoadingCounter(_counter){
	this.secondsLoading --;
	var counter = this.widgets.loadingCounter;

	if(this.secondsLoading > 0){
		counter.setData(this.secondsLoading);
		counter.refresh();
	}else{
		unsetTimeAlarm(this.loadingCounterTimer);
		counter.stateChange("exit");
		//this.widgets.myLoadingIndicator.stop();
	}
}

home.prototype.autoLaunchApp = function autoLaunchApp(_link){
    this.setBg();
	this.takeOutProgramInfo();
	this.openLink(_link);
}

/***************************************************************************
TRABAJANDO > > > > > > > > > > > > > PENDIENTE DE ORDENAR
***************************************************************************/
home.prototype.onKeyPressLocked = function onKeyPressLocked(_key){
	var channels = this.widgets.channels;
	switch(_key){
		case "KEY_TV_GREEN":
    		//this.openSection("devOnion", {"home":this}, true);
    	break;
	    case "KEY_IRENTER":
	    	 this.unlockProgram();
	    break;
    }
	return true;
}

home.prototype.onKeyPressMoreInfo_Top = function onKeyPressMoreInfo_Top(_key){
	var w = this.widgets,
		buttons_top = w.buttons_top,
		buttons_bottom = w.buttons_bottom,
		tooltipsSocialNetwork = w.tooltipsSocialNetwork,
		_program = w.programInfo.data;

	switch(_key){

		case "KEY_INFO":
		 	this.hideMoreInfo();
			this.openSection("programDetail",{"home":this, "program": _program},false);
		break;

		case "KEY_MENU":
	    case "KEY_IRBACK":
	    	if(tpng.app.twitter){
	    		this.tweetFeed();
	    	}
    	  this.hideHeader();
    	  this.hideMoreInfo();
         break;


        case "KEY_LEFT":
			if(buttons_top.scrollPrev()){
			}else{
				if(recommendations.maxItem>0){
					buttons_top.setFocus(false);
					tpng.app.section = "moreInfoRecommendations";
					recommendations.setFocus(true);
				}
			}
    	break;
     	case "KEY_RIGHT":
    		buttons_top.scrollNext();
    	break;
    	case "KEY_UP":
			clearTimeout(this.timerFocusButtons);
    		//this.enableSearchHeader();
			tpng.app.section = "header";
    		buttons_top.setFocus(false);//TODO hacerlo bien: disableMoreInfo
    		w.headerButtons.stateChange("exit");
			w.mainHeader_off.stateChange("enter");
			w.headerButtons_off.stateChange("enter");
			w.headerButtons_off.setFocus(true);
			this.enableHeaderHome();
    	break;
    	case "KEY_DOWN":
    		tpng.app.section = "moreInfoBottom";
    		buttons_top.setFocus(false);
    		buttons_bottom.setFocus(true);
    	break;

	   case "KEY_IRENTER":
	   		switch(buttons_top.selectItem.action){
				case "ONTWEETFEED":
					this.hideHeader();
	    	  		this.hideMoreInfo();
					if(tpng.app.currentProgram.tweetFeed)
	    				this.tweetFeed();
	    		break;
	    		case "OFFTWEETFEED":
					if(buttons_top.selectItem.tooltip == "DESACTIVAR"){
						buttons_top.selectItem.tooltip = "ACTIVAR";
						buttons_top.selectItem.action = "ONTWEETFEED";
						tpng.app.twitter = false;
						this.closeSection(tpng.app.twitterApp);
						tooltipsSocialNetwork.setData({"position_x": buttons_top.selectItem.position_x, "text":buttons_top.selectItem.tooltip});
						tooltipsSocialNetwork.refresh();
					}
				break;

	    	}// TERMINA SWITCH
	    break;

    }
	return true;
}


home.prototype.onKeyPressMoreInfo_Bottom = function onKeyPressMoreInfo_Bottom(_key){
	var w = this.widgets,
		buttons_top = w.buttons_top,
		buttons_bottom = w.buttons_bottom,
		button_back = w.button_back,
		_program = w.programInfo.data,
		rightArrowButtons = w.rightArrowButtons,
		leftArrowButtons = w.leftArrowButtons,
		headerButtons = w.headerButtons;


	switch(_key){
		case "KEY_INFO":
		 	this.hideMoreInfo();
			this.openSection("programDetail",{"home":this, "program": _program},false);
		break;

		case "KEY_MENU":
	    case "KEY_IRBACK":
	    	  if(tpng.app.twitter)
    				this.tweetFeed();
	    	  this.hideHeader();
	    	  this.hideMoreInfo();
	    break;

    	case "KEY_LEFT":
			if(buttons_bottom.scrollPrev()){
				if(buttons_bottom.maxItem > 5){
					if(buttons_bottom.selectIndex == 0){
						leftArrowButtons.setData({"url":"", "line":true, "position": "left"});
						leftArrowButtons.refresh();
						button_back.stateChange("enter");
					}
					if(buttons_bottom.selectIndex+1 <= (buttons_bottom.maxItem-5)){
						rightArrowButtons.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
						rightArrowButtons.refresh();
					}
				}

			}else{
				tpng.app.section = "exit_info";
		    	button_back.setFocus(true);
	    		buttons_bottom.setFocus(false);
			}

    	break;

    	case "KEY_RIGHT":
			buttons_bottom.scrollNext();
			if(buttons_bottom.maxItem > 5){
				if(buttons_bottom.selectIndex >= 5){
					leftArrowButtons.setData({"url":"img/tv/arrowLeftOn.png", "line":false, "position": "left"});
					leftArrowButtons.refresh();
					button_back.stateChange("exit");
					}
				}
			if(buttons_bottom.selectIndex == (buttons_bottom.maxItem-1)){
				rightArrowButtons.setData({"url": "" ,"line":true, "position": "right"});
				rightArrowButtons.refresh();
			}
	  	break;

    	case "KEY_UP":
    		buttons_bottom.setFocus(false);
    		if(buttons_top.list.length > 0){
    			tpng.app.section = "moreInfoTop";
    			buttons_top.setFocus(true);
    		}else{
    			//No hay botones en top, se salta a header
				tpng.app.section = "header";
				headerButtons.stateChange("exit");
				w.mainHeader_off.stateChange("enter");
				w.headerButtons_off.stateChange("enter");
				w.headerButtons_off.setFocus(true);
				this.enableHeaderHome();
    		}
    	break;

   	    case "KEY_IRENTER":
	    	//var _program = buttons_bottom.selectItem;
			switch(buttons_bottom.selectItem.action){
				case "SEARCH":
					this.hideMoreInfo();
					this.openSection("search",{"home":this, "pattern": _program.name, "related":true, "channel":tpng.app.currentChannel.number, "epgId":tpng.app.currentProgram.id},true, ,false);
				break;
				case "LOCKCHANNEL":
					this.openSection("unlockProgram",{"home":this, "channel": tpng.app.currentChannel, "program": tpng.app.currentProgram, "section": "home", "blockChannel": true},true);
				break;
				case "ONTWEETFEED":
					this.hideHeader();
	    	  		this.hideMoreInfo();
					if(tpng.app.currentProgram.tweetFeed)
	    				this.tweetFeed();

	    		break;
	    		case "OFFTWEETFEED":
					if(buttons_bottom.selectItem.label == "Desactivar Tweet Feed"){
						buttons_bottom.selectItem.label = "Activar Tweet Feed";
						tpng.app.twitter = false;
						this.closeSection(tpng.app.twitterApp);
					}else{
						this.hideHeader();
	    	  			this.hideMoreInfo();
						if(tpng.app.currentProgram.tweetFeed){
	    					this.tweetFeed();
	    				}
					}
					buttons_bottom.redraw();

	    		break;
				case "HELP":
					this.hideMoreInfo();
					this.openSection("help",{"home":this},true, ,false);
				break;
				case "AUDIOS":
					this.changeAudio();
				break;
				case "SUB":
					this.changeSubtitle();
				break;
				case "INFO":
					this.hideMoreInfo();
					this.openSection("programDetail",{"home":this, "program": _program},false);
				break;
				case "START_OVER":
					this.hideHeader();
					this.hideMoreInfo();
					this.openSection("startOverPlayer",{"home":this, "program": _program},false);
				break;
				case "BACK":
				  if(tpng.app.twitter){
	    			     this.tweetFeed();
	    		           }
				  this.hideHeader();
	    		          this.hideMoreInfo();
				break;
				case "REMINDER":
					this.setReminder(_program.id);
    			break;
   				case "RECORDING":
		    		getServices.getSingleton().call("EPG_RECORDING_NPVR", ["epgId="+_program.id],  this.responseRecording.bind(this));
	    		break;
	    		default:
	    			var parameters = recommendations.selectItem.ItemVO.link;
    				this.hideMoreInfo();
					this.openLink(buttons_bottom.selectItem.ItemVO.link);
	    		break;
			}
	    	break;
    }
	return true;
}


home.prototype.onKeyPressHeader = function onKeyPressHeader(_key){
		var w = this.widgets,
		buttons_top = w.buttons_top,
		buttons_bottom = w.buttons_bottom,
		recommendations = w.recommendations,
		program = w.programInfo.data,
		headerButtons = w.headerButtons,
		headerButtons_off = w.headerButtons_off;

	switch(_key){
    	case "KEY_LEFT":
    		//headerButtons.scrollPrev();
    		if(headerButtons_off.scrollPrev()){
				w.mainHeader_off.setData({"text": headerButtons_off.selectItem.caption, "index": headerButtons_off.selectItem.index});
    		 	w.mainHeader_off.refresh();
    	 	}
    	break;
    	case "KEY_RIGHT":
    		//headerButtons.scrollNext();
			if(headerButtons_off.scrollNext()){
    	 		w.mainHeader_off.setData({"text": headerButtons_off.selectItem.caption, "index": headerButtons_off.selectItem.index});
    	 		w.mainHeader_off.refresh();
    	 	}
    	break;
    	case "KEY_MENU":
		case "KEY_IRBACK":
    	case "KEY_DOWN":
    		headerButtons_off.setFocus(false);
    		if(buttons_top.list.length > 0){//Sí hay botones en top, bajamos a top
    			tpng.app.section = "moreInfoTop";
    			buttons_top.setFocus(true);

    		}else{//No hay botones en top, bajamos a bottom
  	  			tpng.app.section = "moreInfoBottom";
    			buttons_bottom.setFocus(true);
    		}
			this.disableHeaderHome();
			headerButtons.stateChange("enter");
    		headerButtons_off.stateChange("exit");
    		w.mainHeader_off.stateChange("exit");
    		headerButtons_off.setFocus(false);
    	break;
    	 case "KEY_IRENTER":
    	 	var section = _uu().formName;
    	 	switch(headerButtons_off.selectItem.action){
    	 		case "HELP":
		 			if(section != "help"){
	    	 			this.hideMoreInfo();
	    	 			this.openSection("help",{"home":this},true);
		    	 		headerButtons_off.stateChange("exit");
   						w.mainHeader_off.stateChange("exit");
   						headerButtons_off.setFocus(false);
   						headerButtons.stateChange("enter");
	    	 		}


    	 		break;

    	 		case "SEARCH":
    	 			this.openSection("keyboard",{
						"home":this,
						"type":"k",
						"text1":"Ingresa tu búsqueda: ",
						"text2":"La búsqueda no puede estar vacía, inténtalo de nuevo",
						"ok":"Aceptar",
						"cancel":"Cancelar",
						"parent" : this,
						"valid":true}, false, ,true);
    	 		break;
    	 		case "LOGOUT":
    	 			this.openSection("logout",{"home":this},false, null, true);
    	 		break;
    	 	}

		break;
    }
	return true;
}

home.prototype.onKeyPressExit_Info = function onKeyPressExit_Info(_key){
	var widgets = this.widgets,
	buttons_bottom = widgets.buttons_bottom,
	buttons_top = widgets.buttons_top,
	headerButtons = widgets.headerButtons,
	button_back = widgets.button_back;

	switch(_key){

		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_IRENTER":
	    	  this.hideHeader();
	    	  this.hideMoreInfo();
		break;

		case "KEY_RIGHT":
    		tpng.app.section = "moreInfoBottom";
    		buttons_bottom.setFocus(true);
    		button_back.setFocus(false);
		break;

		case "KEY_UP":
    		button_back.setFocus(false);
    		if(buttons_top.list.length > 0){
    			tpng.app.section = "moreInfoTop";
    			buttons_top.setFocus(true);
    		}else{
    			//No hay botones en top, se salta a header
				tpng.app.section = "header";
				headerButtons.stateChange("exit");
				widgets.mainHeader_off.stateChange("enter");
				widgets.headerButtons_off.stateChange("enter");
				widgets.headerButtons_off.setFocus(true);
				this.enableHeaderHome();
    		}
		break;

	}

	return true;
}

home.onFocusButton_back = function onFocusButton_back(_focus, _data){
   	var widgets = this.widgets;

	if(_focus){
    	if(tpng.app.section == "exit_info"){
        	widgets.buttons_bottom.setFocus(false);
        }

    	this.timerFocusButtons = setTimeout(function (){
	   		widgets.tooltip_button_back.setData({"x": 0, "text": "REGRESAR"});
   			widgets.tooltip_button_back.stateChange("enter");
		}.bind(this), 500);

	}else{
		widgets.tooltip_button_back.stateChange("exit");
		clearTimeout(this.timerFocusButtons);
	}
}


home.onFocusButtonsTop = function onFocusButtonsTop(_focus,_data){
	var widgets = this.widgets;

	if(_focus){
	   	this.timerFocusButtons = setTimeout(function (){
			widgets.tooltipsSocialNetwork.setData({"position_x": widgets.buttons_top.selectItem.position_x, "text":widgets.buttons_top.selectItem.tooltip});
			widgets.tooltipsSocialNetwork.stateChange("enter");
		}.bind(this), 500);

	}else{
		widgets.tooltipsSocialNetwork.stateChange("exit");
		clearTimeout(this.timerFocusButtons);
	}

}

home.onFocusButtonsBottom = function onFocusButtonsBottom(_focus,_data){
	var widgets = this.widgets;

   	if(_focus){
    	if(tpng.app.section == "exit_info"){
        	widgets.buttons_bottom.setFocus(false);
        }
   }

}

home.prototype.enableSearchHeader = function enableSearchHeader(){
	var w = this.widgets,
		buttons = w.headerButtons,
		buttons_off = w.headerButtons_off;

		tpng.app.section = "header";
		buttons.stateChange("exit");
		buttons.setFocus(false);

		w.mainHeader_off.setData({"text":"BÚSQUEDA"});
		var buttonsOn = this.getHeaderButtonsOn();
		buttons_off.setData(buttonsOn, 1);		
		this.client.lock();
			w.mainHeader_off.stateChange("enter");
			buttons_off.stateChange("enter");
			buttons_off.redraw();
			buttons_off.setFocus(true);
		this.client.unlock();

		var speed = 150;
		var alpha = 150;
		var moveY = 50;

		var section = _uu();
		if(section.formName != "home"){
			var player = this.widgets.player;
			if(player.state == "start" && player.stateGet()!= "exit" && player.stateGet()!= "enter"){
				var state = player.curState[player.stateGet()];
				player.animation.move(state.x, state.y + moveY, speed).start();
				player.animation.alpha(alpha,speed).start();
			}
			section.animation.alpha(alpha,speed).start();
			section.animation.move(0,moveY,speed).start();
			w.mainHeader_off.animation.move(0,0,150).start();
			w.mainHeader.animation.move(0,0,150).start();
			w.mainWatch.animation.move(1027,15,150).start();

		}

}
home.prototype.disableSearchHeader = function disableSearchHeader(){
	var w = this.widgets,
		buttons_off = w.headerButtons_off,
		mainHeader_off = w.mainHeader_off,
		buttons = w.headerButtons;

		mainHeader_off.setData({"text":" "});
		mainHeader_off.refresh();
		mainHeader_off.stateChange("exit");

		buttons_off.stateChange("exit");
		buttons.stateChange("enter");
	    buttons.setFocus(false);
		tpng.app.section = "home";

		var speed = 150;
		var alpha = 150;
		var moveY = 50;
		var player = this.widgets.player;
		if(player.state == "start" && player.stateGet()!= "exit" && player.stateGet()!= "enter"){
			var state = player.curState[player.stateGet()];
			player.animation.move(state.x, state.y, speed).start();
			player.animation.alpha(alpha,speed).start();
		}

		_uu().animation.alpha(255,150).start();
		_uu().animation.move(0,0,150).start();

		mainHeader_off.animation.move(0,-10,150).start();
		w.mainHeader.animation.move(0, -20,150).start();
		w.mainWatch.animation.move(1027,0,150).start();


}

home.prototype.enableHeaderHome = function enableHeaderHome(){

	var w = this.widgets;
		w.mainHeader_off.animation.move(0,0,150).start();
		w.mainHeader.animation.move(0,0,150).start();

		w.rightArrowButtons.stateChange("exit");
		w.leftArrowButtons.stateChange("exit");

		//w.mainHeader_off.setData({"text":"BÚSQUEDA"});
		//w.headerButtons_off.setData(tpng.app.headerButtons, 1);

		w.mainWatch.animation.move(1027,5,150).start();

		w.programInfoBack.animation.alpha(150,412,150).start();
		w.programInfoBack.animation.move(0,412,150).start();

		w.programInfo.animation.alpha(150,412,150).start();
		w.programInfo.animation.move(0,412,150).start();

		w.buttons_bottom.animation.alpha(150,55,150).start();
		w.buttons_bottom.animation.move(0,55,150).start();

		w.buttons_top.animation.alpha(150,55,150).start();
		w.buttons_top.animation.move(0,55,150).start();


		w.button_back.animation.move(0,55,150).start();
	    w.button_back.animation.alpha(150,55,150).start();

}

home.prototype.disableHeaderHome = function disableHeaderHome(){
	var w = this.widgets;

   		w.mainHeader_off.animation.move(0,-6,150).start();
		w.mainHeader.animation.move(0,-16,150).start();

		w.mainHeader_off.refresh();

		w.rightArrowButtons.stateChange("enter");
		w.leftArrowButtons.stateChange("enter");

		w.mainWatch.animation.move(1027,0,150).start();
		w.programInfo.animation.alpha(255,200).start();
		w.programInfo.animation.move(0,362,150).start();

		w.programInfoBack.animation.alpha(255,200).start();
		w.programInfoBack.animation.move(0,362,150).start();


		w.buttons_bottom.animation.alpha(255,200).start();
		w.buttons_bottom.animation.move(0,0,150).start();

		w.buttons_top.animation.alpha(255,200).start();
		w.buttons_top.animation.move(0,0,150).start();

		w.button_back.animation.alpha(255,200).start();
		w.button_back.animation.move(0,0,150).start();
}

home.prototype.onKeyPressSearch = function onKeyPressSearch(_key){
	var w = this.widgets,
		buttons_top = w.buttons_top,
		buttons_bottom = w.buttons_bottom,
		recommendations = w.recommendations,
		avatar = w.strokeAvatar,
		help = w.mainHelp,
		search = w.searchInput;

	switch(_key){


    	case "KEY_RIGHT":
    		if(this.formGetChild().formName != "help"){
	    		unsetTimeAlarm(this.timeHelp);
	    		tpng.app.section = "help";
	    		help.setData({"focus": true, "nameForm": this.formGetChild().formName});
    			help.refresh();
    			search.setFocus(false);
    			search.setData("buscar");
				search.stateChange("enter");
    		}else{
    			tpng.app.section  = "avatar";
    			search.setFocus(false);
    			search.setData("buscar");
				search.stateChange("enter");
				avatar.setData({"focus": true});
				avatar.refresh();
    		}

		break;

		case "KEY_IRENTER":
			this.openSection("keyboard",{
						"home":this,
						"type":"k",
						"text1":"Ingresa tu búsqueda: ",
						"text2":"La búsqueda no puede estar vacía, inténtalo de nuevo",
						"ok":"Aceptar",
						"cancel":"Cancelar",
						"parent" : this,
						"valid":true}, false, ,true);
		break;
		case "KEY_MENU":
		case "KEY_IRBACK":
		case "KEY_DOWN":
			//HABILITAR FOCUS, REDRAWS, ETC
			//this.disableSearchHeader();
			tpng.app.section  = "moreInfoTop";
			buttons_top.setFocus(true);
    	    w.mainHelp.setData({"focus": false});
		break;

    }
	return true;
}

/***************************************************************************
PROGRAM INFO (MÁS INFO)
***************************************************************************/
// ***** NUEVA FUNCION
home.prototype.responseRecording =  function responseRecording(response){
	var widgets = this.widgets;

	if(response.status == 200){
		if(widgets.buttons_bottom.selectItem.label == "Grabar"){
			widgets.buttons_bottom.selectItem.label = "Dejar de grabar";
		}else{
			widgets.buttons_bottom.selectItem.label = "Grabar";
		}
		widgets.buttons_bottom.redraw();

	}else{
		this.openSection("miniError", {"home": this.home,"code":responseCode.status}, false);
	}

}

home.prototype.showMoreInfo = function showMoreInfo(_program, _section, _keyCallback){
	if(_keyCallback){
		//Si fue llamado de otra sección se puede enviar un callback para que se ejecute al final de la animación. Normalmente para recuperarl el onKeyPress
		this.keyCallback = _keyCallback;
	}

	NGM.trace("SHOW MORE INFO");

	var w = this.widgets,
		programInfo = w.programInfo,
		channels = w.channels,
		c = w.infoContainer,
		header = w.mainHeader,
		back = w.programInfoBack;


	unsetTimeAlarm(this.hideProgramInfoDelay);

	//1. Setting datos
	programInfo.setDataAnimated(_program);
	back.setData(_program);

	//2.Animación base: program info y header
	this.client.lock();
		channels.stateChange("exit");
		back.stateChange("more");
		programInfo.stateChange("more");
		this.showHeader();
	this.client.unlock();

	w.buttons_bottom.animation.alpha(255,200).start();
	w.buttons_bottom.animation.move(0,0,150).start();

	w.button_back.animation.alpha(255,200).start();
	w.button_back.animation.move(0,0,150).start();


	//3.Obtener las recomendaciones, sólo sino está en safe mode
	if(!tpng.app.isSafeMode){
		this.getRecommandations(_program.id, _program.ChannelVO.number);
	}else{
		//Si está en safe mode le muestro los botones
	}


}

home.prototype.getRecommandations = function getRecommandations(_idEpg, _channel){
	var params = ["epgId="+_idEpg,"channel=" + _channel, "advertising=" + (tpng.app.advertising ? "Y" : "N") ];
	getServices.getSingleton().call("RECOMMENDATION_GET_EPG", params, this.responseGetRecommandations.bind(this), null, null, null, 300);
}

home.prototype.responseGetRecommandations = function responseGetRecommandations(response){
	var w = this.widgets,
		buttons_top = w.buttons_top,
		buttons_bottom = w.buttons_bottom,
		button_back = w.button_back,
		rightArrowButtons = w.rightArrowButtons,
		leftArrowButtons = w.leftArrowButtons,
		recommendations = w.recommendations;

	var recommendation = response.data.ResponseVO.recomendationArray ? response.data.ResponseVO.recomendationArray : null;
	var program = this.widgets.programInfo.data;

	var buttons_data = this.getButtons(program, null, recommendation);

	buttons_bottom.setData(buttons_data.bottom,0);
	buttons_top.setData(buttons_data.top,0);
	button_back.setData([{"id":"0","text": "REGRESAR"}]);

	var _state = "enter_"+buttons_data.bottom.length+"";
	if(buttons_data.bottom.length > 5){
		rightArrowButtons.setData({"url":"img/tv/arrowRightOn.png", "line":false, "position": "right"});
		_state = "enter_"+5;
	}else if(buttons_data.bottom.length <= 5){
		rightArrowButtons.setData({"url": "" ,"line":true, "position": "right"});
	}

	// flechas

	leftArrowButtons.setData({"url": "" ,"line":true, "position": "left"});
	leftArrowButtons.stateChange("enter");
	rightArrowButtons.stateChange(_state);

	//Llamar función de Mau que muestra los widgets uno tras otro
	buttons_top.setFocus(false);
	if(buttons_bottom.list.length > 1){
		buttons_bottom.focusIndex = 2;
	}else{
		buttons_bottom.focusIndex = 1;
	}
	buttons_bottom.setFocus(false);
	buttons_bottom.setFocus(true);
	this.showMoreInfoButtonsBar(buttons_top, 100, buttons_bottom, 200, button_back, 200);

}

home.prototype.showMoreInfoButtonsBar = function showMoreInfoButtonsBar(firstButtonBar, firstButtonBarDelay, secondButtonBar, secondButtonBarDelay, thirdButtonBar, thirdButtonBarDelay){

	if (firstButtonBar){
		var buttonsEnter = function(){firstButtonBar.stateChange("enter");};
		firstButtonBar.buttonsEnterTimer = buttonsEnter.delay(firstButtonBarDelay, null);
		this.showMoreInfoButtonsBar(secondButtonBar, secondButtonBarDelay, thirdButtonBar, thirdButtonBarDelay);
	}else{
		if(this.keyCallback){
			//Revisar si hay un callback para ejecutarlo, limpiamos la variable en la que lo guardamos.
			var callback = this.keyCallback
			this.keyCallback = null;
			callback();
		}else{
			//Le damos un delay de 1 segundo al control del moreInfo, esto para evitar que se encimen.
			this.onKeyPressControlDelay.bind(this,"moreInfoBottom").delay(1000);
		}
		return;
	}
};


home.prototype.getButtons = function getButtons(_program,_section, _recommendation){
	if(!_program)
		return null;
	else{
		var program_type = null,
			program_fill = null,
			buttons_top = [],
			buttons_bottom = [],
			now = new Date().getTime();



		//XFR: AJUSTE GRÁFICO DE BOTONERAS, TODOS LOS BOTONES IMPORTANTES IRAN A BOTTOM Y EN TOP SERÁN LAS REDES
		//BOTONES TOP
		//***********************************************************************************************
		//                        BOTONES BOTTOM
		//***********************************************************************************************
		//Tweet Feed
		if(_program.tweetFeed && !_program.statusPlayer){
			if(tpng.app.sections.length == 0 && _section != "full_info"){
				if(tpng.app.twitter)
					buttons_top.push({"text":"TweetFeed", "tooltip": "DESACTIVAR", "action":"OFFTWEETFEED", "position_x": 256, "color": "rgba(240,240,250,1)", "img": "img/tv/badge_tweetON.png"});
				else
					buttons_top.push({"text":"TweetFeed", "tooltip": "ACTIVAR", "action":"ONTWEETFEED", "position_x": 256, "color": "rgba(240,240,250,1)", "img": "img/tv/badge_tweetON.png"});
			}
		}
		//***********************************************************************************************
		//                        BOTONES BOTTOM
		//***********************************************************************************************
		//EL PRIMER CAMBIO IMPORTANTE ES QUE LA RECOMENDACIÓN
		if(_recommendation.length > 0){
			buttons_bottom.push(_recommendation[0]);
		}

		//Colores
		if(_program.endTime < now){
			//PROGRAMAS PASADOS
			if(_program.ChannelVO.isCtv && _program.isCtvRecorded){
				//PROGRAMAS GRABADOS EN CANALES ANYTIME
				program_type = "PAST_ANYTIME";
				program_fill = "0-rgba(190, 50, 120, 1)|1-rgba(120, 30, 70, 1)";
			}else if(_program.ChannelVO.isNpvr){
				//PROGRAMAS DE CANALES NPVR
				if(_program.isNpvrRecorded){
					program_type = "PAST_NPVR";
					program_fill = "0-rgba(190, 50, 120, 1)|1-rgba(120, 30, 70, 1)";
				}else{
					program_type = "PAST_NPVR";
					program_fill = "0-rgba(85, 95, 105, 1)|1-rgba(45,45,55, 1)";
				}
			}else{
				//PROGRAMAS PASADOS SIN GRABAR (CON O SIN NPVR)
				program_type = "PAST";
				program_fill = "0-rgba(85, 95, 105, 1)|1-rgba(45,45,55, 1)";
			}

			//Reproducir,Grabar / Dejar de Grabar,Más información
			if(_program.ChannelVO.isCtv && _program.isCtvRecorded && !_program.statusPlayer){
				buttons_bottom.push({"label":"Reproducir","action":"PLAY","img_on":"img/commons/buttons_on/btn_ReproducirON.png","img_off": "img/commons/buttons_off/btn_ReproducirOFF.png","fill":program_fill});
			}else if(_program.ChannelVO.isNpvr){
				if(_program.isNpvrRecorded && !_program.statusPlayer)
					buttons_bottom.push({"label":"Reproducir","action":"PLAY","img_on":"img/commons/buttons_on/btn_ReproducirON.png","img_off": "img/commons/buttons_off/btn_ReproducirOFF.png","fill":program_fill});

				if(_program.isNpvrChecked)
					buttons_bottom.push({"label":"Dejar de grabar","action":"RECORDING","img_on": "img/commons/buttons_on/btn_GrabarON.png","img_off":"img/commons/buttons_off/btn_GrabarOFF.png","fill":program_fill});
				else
					buttons_bottom.push({"label":"Grabar","action":"RECORDING","img_on": "img/commons/buttons_on/btn_GrabarON.png","img_off":"img/commons/buttons_off/btn_GrabarOFF.png","fill":program_fill});
			}

		}else if(_program.startTime < now && _program.endTime > now){
			//PROGRAMAS LIVE
			program_type = "LIVE";
			program_fill = "0-rgba(30, 120, 160, 1)|1-rgba(10, 70, 100, 1)";

			//Validación de star over
			var isStartover = _program.ChannelVO.isStartover == undefined ? _program.isStartover : _program.ChannelVO.isStartover;
			if(_section != "full_info" && isStartover && !tpng.app.lockedStream && !_program.profileLoked)
				buttons_bottom.push({"label":"Ver desde el inicio","action":"START_OVER","img_on":"img/commons/buttons_on/btn_ReproducirON.png","img_off": "img/commons/buttons_off/btn_ReproducirOFF.png","fill":program_fill});
			//Audios y Subtítulos
			if(tpng.app.audios.length>1)
				buttons_bottom.push({"label":"Idiomas","action":"AUDIOS","img_on": "img/commons/buttons_on/btn_IdiomasON.png","img_off":"img/commons/buttons_off/btn_IdiomasOFF.png","fill":program_fill});
			if(tpng.app.subtitles.length>1)
				buttons_bottom.push({"label":"Subtítulos","action":"SUB","img_on": "img/commons/buttons_on/btn_SubtitulosON.png","img_off":"img/commons/buttons_off/btn_SubtitulosOFF.png","fill":program_fill});

		}else{
			program_type = "FUTURE";
			program_fill = "0-rgba(85, 95, 105, 1)|1-rgba(45,45,55, 1)";


			//Reproducir,Grabar / Dejar de Grabar,Más información
			if(_program.ChannelVO.isNpvr){
				if(_program.isNpvrChecked)
					buttons_bottom.push({"label":"Dejar de grabar","action":"RECORDING","img_on": "img/commons/buttons_on/btn_GrabarON.png","img_off":"img/commons/buttons_off/btn_GrabarOFF.png","fill":program_fill});
				else
					buttons_bottom.push({"label":"Grabar","action":"RECORDING","img_on": "img/commons/buttons_on/btn_GrabarON.png","img_off":"img/commons/buttons_off/btn_GrabarOFF.png","fill":program_fill});
			}

			if(_program.hasReminder)
				buttons_bottom.push({"label":"No Recordar","action":"REMINDER","img_on": "img/commons/buttons_on/btn_RecordarON.png","img_off":"img/commons/buttons_off/btn_RecordarOFF.png","fill":program_fill});
			else
				buttons_bottom.push({"label":"Recordar","action":"REMINDER","img_on": "img/commons/buttons_on/btn_RecordarON.png","img_off":"img/commons/buttons_off/btn_RecordarOFF.png","fill":program_fill});
		}
		/*
		Reproducir,Ver desde el incio,Timeshift,Grabar en DD,Grabar / Dejar de Grabar,Recordar / Dejar de recordar
		Cambiar Idioma,Cambiar subtítulos,Más información,Programas Similares,Bloquear / Desbloquear Canal
		*/
		if(_section != "full_info" && !_program.profileLoked && _program.parentalRating != "D"){
			buttons_bottom.push({"label":"Más información","action":"INFO","img_on": "img/commons/buttons_on/btn_InfoON.png","img_off":"img/commons/buttons_off/btn_InfoOFF.png","fill":program_fill});
		}
		if(!_program.profileLoked){
			var label = _program.category == "Series" ? "Más episodios" : "Contenido Relacionado";
			buttons_bottom.push({"label":label,"action":"SEARCH","img_on":"img/commons/buttons_on/btn_SimilaresON.png","img_off": "img/commons/buttons_off/btn_SimilaresOFF.png","fill":program_fill});
		}

		//if(_program.ChannelVO.number != 1)
		//	buttons_bottom.push({"label":"Bloquear Canal","action":"LOCKCHANNEL","img_on":"img/commons/buttons_on/btn_BloquearON.png","img_off": "img/commons/buttons_off/btn_BloquearOFF.png","fill":program_fill});

		//buttons_bottom.push({"label":"Problemas","action":"HELP","img_on":"img/commons/buttons_on/btn_ProblemasON.png","img_off": "img/commons/buttons_off/btn_ProblemasOFF.png","fill":program_fill});

		return {"top": buttons_top, "bottom": buttons_bottom};
	}
}


home.prototype.onKeyPressControlDelay = function onKeyPressControlDelay(_section){
	tpng.app.section = _section;
}


home.prototype.cancelMoreInfoButtonsBar = function cancelMoreInfoButtonsBar(firstButtonBar, secondButtonBar, thirdButtonBar){
	if (nul != firstButtonBar.buttonsEnterTimer){
		unsetTimeAlarm(firstButtonBar.buttonsEnterTimer);
		firstButtonBar.buttonsEnterTimer = null;
	}
	if (secondButtonBar){
		this.cancelMoreInfoButtonsBar(secondButtonBar, thirdButtonBar);
	}else {
		return;
	}
};


home.prototype.hideMoreInfo = function hideMoreInfo(_section){
	var w = this.widgets,
		programInfo = w.programInfo,
		buttons_top = w.buttons_top,
		buttons_bottom = w.buttons_bottom,
		rightArrowTop = w.rightArrowTop,
		rightArrowButtons = w.rightArrowButtons,
		leftArrowButtons = w.leftArrowButtons,
		button_back = w.button_back,
		tooltipsSocialNetwork = w.tooltipsSocialNetwork,
		tooltip_button_back = w.tooltip_button_back,
		rightArrowBottom = w.rightArrowBottom,
		back = w.programInfoBack;


	if(_section){
		//programInfo.stateChange("full_exit");//animación desvaneciendo 20px para el full
		//back.stateChange("full_exit");//animación desvaneciendo 20px para el full
		//Antes tenía el parametro de 0,1000
		programInfo.stateChange("exit");//siempre regresarlo a exit por los cambios de canal
		back.stateChange("exit");//siempre regresarlo a exit por los cambios de canal
	}else{
		w.buttons_top.animation.alpha(255,200).start();
		w.buttons_top.animation.move(0,0,150).start();
		//back.stateChange("more_exit");//animación desvaneciendo 20px
		//programInfo.stateChange("more_exit");//animación desvaneciendo 20px
		//back.stateChange("exit",0,1000);//siempre regresarlo a exit por los cambios de canal
		//Antes tenía el parametro de 0,1000
		back.stateChange("exit");//siempre regresarlo a exit por los cambios de canal
		programInfo.stateChange("exit");//siempre regresarlo a exit por los cambios de canal
	}
	this.client.lock();
		buttons_bottom.stateChange("exit");
		buttons_top.stateChange("exit");
		button_back.stateChange("exit");
		rightArrowButtons.stateChange("exit");
		leftArrowButtons.stateChange("exit");
		tooltipsSocialNetwork.stateChange("exit");
		tooltip_button_back.stateChange("exit");
	this.client.unlock();

	tpng.app.section = "home";

	clearTimeout(this.timerFocusButtons);
}

/***************************************************************************
Player's Functions
***************************************************************************/

home.prototype.playVideo = function playVideo(_url, _format, _position, _state, _vm){
//Para reproducir VOD, CTV y mosaicos.

	var player = this.widgets.player;
	_vm = _vm ? 1 : 0;
	_format = _format + "";

	switch(_format){
		case "HLS":
		    player.setData();
		    player.setData(_url,{"playerType": "hls", "startPosition": _position, "seekable": true, "noInfo": true, "playerProperties":{"forceVM": _vm}});
			player.stateChange("enter");
			tpng.player.status = "PLAY"; //para players anytime/vod
		break;
		case "MOSAIC":
			player.setData();
			player.setData(_url,{"playerType": "dvb"});
			player.stateChange("mosaic_enter");
		break;
		case "VIDEO":
		    player.setData(_url,{"playerType": "hls", "startPosition": _position, "seekable": true, "noInfo": true, "playerProperties":{"forceVM": _vm}});
			_state = _state ? _state : "promo";
			player.stateChange(_state);
		break;
		case "MPG4":
			NGM.trace("url: " + _url);
		    player.setData();
		    player.setData(_url, {"noInfo": true});
			player.stateChange("enter");
		break;
	}
}

home.prototype.playerGetProperty = function playerGetProperty(_property){
	var player = this.widgets.player,
		r = 0;
	switch(_property){
		case "DURATION":
			r = player.propertyGet("duration");
			break;
		case "POSITION":
			r = player.propertyGet("position");
			break;
	}
	return r;
}

home.prototype.setPlayerStatus = function setPlayerStatus(_status, _option){
	//función que sirve para manejar los trick modes
	var player = this.widgets.player;
	switch(_status){
		case "PAUSE":
			tpng.player.status = "PAUSE";
			player.pause();
		break;
		case "PLAY":
			tpng.player.status = "PLAY";
			player.play();
		break;
		case "STOP":
			tpng.player.status = "STOP";
			player.setData();
			player.stateChange("exit");
		break;
		case "SPEED":
			tpng.player.status = "SPEED";
			_option = _option * 5;
			player.speedSet(_option);
		break;
		case "SEEK":
			tpng.player.status = "SEEK";
			var lastForm = tpng.app.sections[tpng.app.sections.length-1];
			_option = _option - 0;
			player.seek(_option);
		break;
	}
}


home.prototype.getAudios = function getAudios(){
	var player = this.widgets.player,
		tracks = this.widgets.audioSubtitleList;
	var current = player.getAudioTracks().current;
	var audios = [];
	tpng.app.audios = [];
	if(player.getAudioTracks()){
		audios = player.getAudioTracks().list;
	}
	for (var i=0, l = audios.length; i < l; i++) {
		tpng.app.audios.push({"str": isoToStringAudio(audios[i].iso, audios[i].name), "value": audios[i].value, "audio":true});
		if (audios[i].value == current) {
            tpng.app.audioIndex = i;
        }else{
        	tpng.app.audioIndex = i+1;
        }
	}
}
home.prototype.changeAudio = function changeAudio(){
	var tracks = this.widgets.audioSubtitleList;
	if(tpng.app.audios.length > 1)
		tracks.setData(tpng.app.audios, tpng.app.audioIndex);
    this.nextAudio();
}
home.prototype.nextAudio = function nextAudio(){
	if (tpng.app.audios.length == 0) {
        return;
    }
    var player = this.widgets.player,
    	tracks = this.widgets.audioSubtitleList;
    tpng.app.audioIndex++;
    tpng.app.audioIndex %= tpng.app.audios.length;
    player.setAudioTrack(tpng.app.audios[tpng.app.audioIndex].value);
    tracks.scrollNext();
    tracks.stateChange("enter");
    unsetTimeAlarm(this.hideTrackDelay);
	this.hideTrackDelay = this.hideTracks.bind(this).delay(1500);
}

home.prototype.hideTracks = function hideTracks(){
	this.widgets.audioSubtitleList.stateChange("exit");
}

home.prototype.getSubtitles = function getSubtitles(){
	var player = this.widgets.player,
		subtitles = [],
		current = player.getSubtitleTracks().current;

	tpng.app.subtitles = [];
	tpng.app.subtitleIndex = 0;

	if (player.getSubtitleTracks()) {
		subtitles = player.getSubtitleTracks().list;
	}
	for (var i = 0, l = subtitles.length; i < l; i ++) {
		tpng.app.subtitles.push({"str": isoToStringSub(subtitles[i].iso), "value": subtitles[i].value, "audio":false});
		if (subtitles[i].value == current) {
            tpng.app.subtitleIndex = i;
        }else{
        	tpng.app.subtitleIndex = i+1;
        }
	}
}

home.prototype.changeSubtitle = function changeSubtitle(){
	var tracks = this.widgets.audioSubtitleList;
	if(tpng.app.subtitles.length > 1)
		tracks.setData(tpng.app.subtitles, tpng.app.subtitleIndex);
    this.nextSubtitle();
}

home.prototype.nextSubtitle = function nextSubtitle(){
	if (tpng.app.subtitles.length == 0) {
        return;
    }
    var player = this.widgets.player,
    	tracks = this.widgets.audioSubtitleList;
    tpng.app.subtitleIndex++;
    tpng.app.subtitleIndex %= tpng.app.subtitles.length;
    player.setSubtitleTrack(tpng.app.subtitles[tpng.app.subtitleIndex].value);
    tracks.scrollNext();
    tracks.stateChange("enter");
    unsetTimeAlarm(this.hideTrackDelay);
	this.hideTrackDelay = this.hideTracks.bind(this).delay(2500);
}
home.prototype.setReminder = function setReminder(_idProgram){
	var params = ["idEpg="+_idProgram];
	getServices.getSingleton().call("EPG_REMINDER", params, this.responseReminder.bind(this));
}


home.prototype.responseReminder = function responseReminder(response){
	if(response.status == 200){

	var buttons_bottom = this.widgets.buttons_bottom;
		if(buttons_bottom.selectItem.label == "Recordar"){
			buttons_bottom.selectItem.label = "No recordar";
		}else{
			buttons_bottom.selectItem.label = "Recordar";
		}
			buttons_bottom.redraw();

	}
}

home.prototype.hideBackground = function hideBackground(_url){
	var w = this.widgets,
	bg = w.mainBg;
	var data = _url ? {"url":_url} : null;
	bg.setData(data);
	bg.stateChange("exit");
}

/***************************************************************************
NOTIFICACIONES - TODO ACOMODAR
***************************************************************************/




home.prototype.showPopUp = function showPopUp(_object, _scheduled){

	var popUp = this.widgets.notificationsPopUp,
		player = this.widgets.player,
		strokeFocus = this.widgets.strokeFocusNotifications;

	this._object = _object;
	//NGM.trace("show pop up: " + tpng.app.currentProgram.isLocked);

	if(_object.type == "I"){
		//TODO: falta agregar el filtro de que sólo se vea en el canal que lo programo
		if(_uu().formName == "home"){ //Es decir que está en LIVE //TODO: falta agregar lo de canales
			if(_object.channels){
				if(_object.channels.indexOf(tpng.app.currentChannel.number) != -1)
					this.openSection("interactiveMsg",{"notification":_object, "home": this} , false);
				else
					NGM.trace("HAY UNA NOTIFICACION PERO NO ESTA EN LOS CANALES PROGRAMADOS");
			}else{
				//Sino viene no le importa en el canal que esté
				this.openSection("interactiveMsg",{"notification":_object, "home": this} , false);
			}
		}
	}else{
		popUp.setData({"objeto":this._object, "focus":false});
		strokeFocus.setData();
		var section = _uu().formName;
		//Validar que no esté bloqueado el canal


			if(section == "home" && tpng.app.section == "home" && !tpng.app.currentProgram.isLocked && tpng.app.currentChannel.type == "C" && !tpng.app.safeNightOn){
				this.popUpShown = true;
				popUp.stateChange("enter");
				player.stateChange("notification");
				strokeFocus.stateChange("enter");
				this.setBg(this._object.images.url18X18);
				tpng.app.section = "popUp";
			}else{
				if(section != "anytimePlayer" && section != "vodPlayer" && section != "startOverPlayer" && section != "login"){
					popUp.stateChange("enter");
				}
			}

		if(_scheduled){
			//Quiere decir que esta es una notificación o recordatorio que viene desde
			//el proceso de schedule, por lo que mandaremos a cerrarlo
			unsetTimeAlarm(this.hidePopUpDelay);
			this.hidePopUpDelay = this.hidePopUp.bind(this).delay(_object.displayTime);//10 segundos
		}

	}
}

home.prototype.hidePopUp = function hidePopUp(){
	var popUp = this.widgets.notificationsPopUp,
		player = this.widgets.player,
		strokeFocus = this.widgets.strokeFocusNotifications;

	if(this.popUpShown){
		this.popUpShown = false;
		var url = "";
		this.setBg(url);
		player.stateChange("enter");
	}

	popUp.stateChange("exit");
	strokeFocus.stateChange("exit");

	if(tpng.app.section == "popUp" || tpng.app.section == "popUpLink")
		tpng.app.section = "home";
}



home.prototype.onFocus = function onFocus(){
	if(tpng.app.reloadPlayer){
		this.hideBg();
		this.tuneIn(tpng.app.currentChannel,"enter");
		tpng.app.section = "home";
		tpng.app.reloadPlayer = false;
		this.internalAppOpened = false;
		tpng.app.sections = [];
    }
}

home.prototype.onBlur = function onBlur(){

}

home.prototype.onKeyPressHelp = function onKeyPressHelp(_key){

	var w = this.widgets,
		help = w.mainHelp,
		avatar = w.strokeAvatar;

	switch(_key){

	    case "KEY_IRENTER":


		break;

    	case "KEY_DOWN":
			tpng.app.section  = "moreInfoTop";
			w.buttons_top.setFocus(true);
    	    help.setData({"focus": false});
    		help.redraw();
    	break;

    	case "KEY_LEFT":
    		help.setData({"focus": false});
    		help.redraw();
    		this.enableSearchHeader();
		break;

		case "KEY_RIGHT":
			tpng.app.section  = "avatar";
		    help.setData({"focus": false});
    		help.redraw();
			avatar.setData({"focus": true});
			avatar.stateChange("enter");
			avatar.refresh();
		break;

    }
	return true;
}

home.prototype.onKeyPressAvatar = function onKeyPressAvatar(_key){

	var w = this.widgets,
		help = w.mainHelp,
		avatar = w.strokeAvatar;

	switch(_key){

    	case "KEY_DOWN":
			tpng.app.section  = "moreInfoTop";
			w.buttons_top.setFocus(true);
			avatar.setData({"focus": false});
			avatar.redraw();
    	break;

    	case "KEY_LEFT":
    	if(this.formGetChild().formName != "help"){
	    		tpng.app.section = "help";
	    		avatar.setData({"focus": false});
	    		avatar.refresh();
				avatar.stateChange("enter");
	    		help.setData({"focus": true, "nameForm": this.formGetChild().formName});
    			help.redraw();
    	}else{
    	 	this.enableSearchHeader();
    		avatar.setData({"focus": false});
			avatar.stateChange("enter");
			avatar.refresh();

    	}

	  	break;

    }
	return true;
}



home.prototype.updateChannelList = function updateChannelList(_dmsCheck, _channel, _section, _screen){
	//Quitar el player
	var player = this.widgets.player;
	var bg = this.widgets.mainBg;
	player.setData();
	player.stateChange("exit");

	NGM.trace(" ");
	NGM.trace(" ");
	NGM.trace(" ");
	NGM.trace(" ");
	NGM.trace(" ");
	NGM.trace("updateChannelList " + _screen);
	if(_screen){
	}else{
		bg.setData();
	}

	tpng.app.programInfo = "guide"; //Para que no muestre la guia
	//dmsCheck para bajar la lista de canales en casos como compras de add-ons
	if(_dmsCheck)
		NGM.main.dmsCheck();
	this.updateChannelIndex = true;
	tpng.app.channelIndex = _channel;
	this.updateChannelsDelay.bind(this,_channel,_section,_empty).delay(2000);
}

//WEB SERVICES SECTION

home.prototype.updateChannelsDelay = function updateChannelsDelay(_channel,_section,_empty){
	if(_channel)
		tpng.app.channelIndex = _channel;
	if(_section){
		tpng.app.sections=[];
		this.closeSection(_section,_empty);
	}
	getServices.getSingleton().call("EPG_GET_CHANNEL_LIST", "",  this.responseSendSuscriptorChannels.bind(this));
}

home.prototype.showPopUpWS = function showPopUpWS(_notification){
		this.showPopUp(_notification, section);
		unsetTimeAlarm(hidePopUpDelay);
		this.hidePopUpDelay = this.hidePopUp.bind(this).delay(11000);//3 segundos
}

home.prototype.tweetFeed = function tweetFeed(){
	tpng.app.twitter = true;
   	this.openSection("tweetFeed",{"home":this,"status": tpng.app.twitter},false,null,true);
}

home.prototype.formatStatistics = function formatStatistics(){
	//Canales
	var i = 0, l = 0, s = "", seconds = 0;
	var now = new Date();
	var statistics = [];

	if(tpng.statistics.channels.length == 0)
		return null;

	//Channels [0]
	if(tpng.statistics.channels.length > 0){
		for(i = 0, l = tpng.statistics.channels.length;i<l;i++){
			if(i<(l-1)){
				seconds = (tpng.statistics.channels[i+1].ts - tpng.statistics.channels[i].ts)/1000;
				seconds = Math.round(seconds);
			}else{
				seconds = (now.getTime() - tpng.statistics.channels[i].ts) / 1000;
				seconds = Math.round(seconds);
			}
			if(tpng.statistics.channels[i].id > 0){
				s = s + tpng.statistics.channels[i].ts + "-" + tpng.statistics.channels[i].id + "-" + seconds;
				if( (i+1) == tpng.statistics.channels.length)
					s = s + "";
				else{
					s = s + ",";
				}
			}
		}
	}else{
		s = s + "";
	}

	var lastChannel = tpng.statistics.channels[tpng.statistics.channels.length-1];
	lastChannel.ts = new Date().getTime();
	tpng.statistics.channels = [lastChannel];

	NGM.trace("canales: " + s);
	statistics.push(s);
	s = "";

	//Anytimes [1]
	if(tpng.statistics.ctvs.length > 0){
		for(i = 0, l = tpng.statistics.ctvs.length;i<l;i++){
				s = s  + tpng.statistics.ctvs[i].ts + "-" + tpng.statistics.ctvs[i].id + "-" + tpng.statistics.ctvs[i].value;
				if( (i+1) == tpng.statistics.ctvs.length)
					s = s + "";
				else
					s = s + ",";
		}

	}else{
		s = s + "";
	}

	NGM.trace("anytimes: " + s);
	statistics.push(s);
	s = "";
	tpng.statistics.ctvs = [];

	//VODS [2]
	if(tpng.statistics.vods.length > 0){
		for(i = 0, l = tpng.statistics.vods.length;i<l;i++){
				s = s + tpng.statistics.vods[i].ts + "-" + tpng.statistics.vods[i].id + "-" + tpng.statistics.vods[i].value;
				if( (i+1) == tpng.statistics.vods.length)
					s = s + "";
				else
					s = s + ",";
		}

	}else{
		s = s + "";
	}

	NGM.trace("vods: " + s);
	statistics.push(s);
	s = "";
	tpng.statistics.vods = [];

	//ITEMS [3]
	if(tpng.statistics.items.length > 0){
		for(i = 0, l = tpng.statistics.items.length;i<l;i++){
				s = s  + tpng.statistics.items[i].ts + "-" + tpng.statistics.items[i].id + "-" + tpng.statistics.items[i].value ;
				if( (i+1) == tpng.statistics.items.length)
					s = s + "";
				else
					s = s + ",";
		}

	}else{
		s = s + "";
	}

	NGM.trace("items: " + s);
	statistics.push(s);
	s = "";
	tpng.statistics.items = [];

	//STARTOVERS - no sé si saldrá aún por lo que envío siempre vacías
	//Anytimes [1]
	if(tpng.statistics.startOvers.length > 0){
		for(i = 0, l = tpng.statistics.startOvers.length;i<l;i++){
				s = s  + tpng.statistics.startOvers[i].ts + "-" + tpng.statistics.startOvers[i].id + "-" + tpng.statistics.startOvers[i].value;
				if( (i+1) == tpng.statistics.startOvers.length)
					s = s + "";
				else
					s = s + ",";
		}

	}else{
		s = s + "";
	}

	NGM.trace("startOvers: " + s);
	statistics.push(s);
	s = "";
	tpng.statistics.startOvers = [];

	//SECTIONS - por el momento lo dejaré vacío, aún no tengo el catálogo de secciones
	statistics.push("");
	//APPS - hay un problema porque las apps ya no tienen ID, sólo los ITEMS
	statistics.push("");


	return statistics;
}

home.prototype.getNetworkImage = function getNetworkImage(_network){
	var alias = _network.alias + "";
	switch(alias.toLowerCase()){
		case "instagram":
			var user_id = _network.value2;
			var token = _network.value1;
			var url = "https://api.instagram.com/v1/users/"+user_id+"/?access_token="+token;
			tp_httpRequest.getSingleton().send(url, this.responseGetImageNetwork.bind(this));
		break;
		case "twitter":
			var access_token = _network.value1;
			var access_token_secret = _network.value2;
			this.tw.getUser_linked(access_token,access_token_secret,this.getUser_linked.bind(this));
		break;
		case "facebook":
			var username = _network.value2;
			tpng.user.profile.networkImg = "http://graph.facebook.com/"+username+"/picture?type=small";
			tpng.user.profile.networkImgL = "http://graph.facebook.com/"+username+"/picture?type=large";
			tpng.user.profile.networkAlias = _network.user + "";
		break;
	}
}

home.prototype.getUser_linked = function getUser_linked(responseCode, profile){
	if(responseCode.status == 200){
			var data = profile;
			tpng.user.profile.networkImg = data.profile_image_url;
			tpng.user.profile.networkImgL = data.profile_image_url.replace("_normal","");
			tpng.user.profile.networkAlias = "@" + data.screen_name;
	}else{
		NGM.trace("error");
	}
}


home.prototype.responseGetImageNetwork = function responseGetImageNetwork(response_err, responseCode){
	if(responseCode.status == 200){
		var data = responseCode.responseObject.data;
		tpng.user.networkImg = data.profile_picture;
		tpng.user.profile.userName = data.username;
	}else{
		NGM.trace("error");
	}
}

home.prototype.videoSplash = function videoSplash()
{
    var splashVideo;
    if (settings.get("totalplay.iptvcore.splashvideo") - 0) {
        var splashVideo = "lib:/libraries/iusacell/video/splash.mp4";
        var file = Netgem.fileSystemCollection.getFile(splashVideo);
        if (!(file.nlink > 0))
            splashVideo = null;
    }
            
    if (splashVideo) {
        this.splashVideo = splashVideo;
        this.widgets.player.setData(splashVideo, {"playerType": splashVideoType || "avtype", "noInfo": true});
        // safety startup after 7 seconds
        this.splashStartupTimer = this.forceStartup.delay(7000, this);
    }
}





//TPNG WEBSERVICES
try {
NGM.http.create(
         [

         {
         "name" : "home",
         "prefix" : "showPopUp",
         "onStart" : function httpServer_onStart(event, params, rawData,userData) {
             event.setHeader("Content-Type", "application/json");

             //Pruebas GET/POST
			 NGM.dump(event);

             //Verificar si vienen parámetros para mostrar en el popUp
              if(rawData){

                  var home = _uu();
                  var data = {"from":     rawData.from,
                             "subject": rawData.subject,
                             "message": rawData.message
                        };
	             home.showPopUpWS(data);
	             var output = {
	                 "status" : 1,
	                 "message" : "Notificación mostrada correctamente."
             	 };
             }else{
             	var output = {
	                 "status" : 2,
	                 "message" : "No se recibieron parámetros."
             	 };

             }


             event.setObject(output);
             event.code = event.HTTP_OK;
         }
     },
     
     
    {
         "name" : "home",
         "prefix" : "getSession",
         "onStart" : function httpServer_onStart(event, params, rawData,userData) {
           	 event.setHeader("Content-Type", "application/json");
           	 var output = {
	                 "session" : tpng.backend.session
             	 };
             event.setObject(output);
             event.code = event.HTTP_OK;
         }
     },

     {
         "name" : "home",
         "prefix" : "getSection",
         "onStart" : function httpServer_onStart(event, params, rawData,userData) {
           	 event.setHeader("Content-Type", "application/json");
           	 var output = {
	                 "section" : _uu().formName
             	 };
             event.setObject(output);
             event.code = event.HTTP_OK;
         }
     }



     ],
     {
         "name" : "TPNG",
         "enable" : true
     }
     );

} catch(e)
{}

