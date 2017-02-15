var getServices = {
  _singleton: null,
  getSingleton: function() {
    if (!this._singleton) {
      this._singleton = {	
		
		backEndServices :  {			
			"SEARCH_GET_RESULTS": 			{"service": "Search","type": "801", "isMon": false,  "section":"Búsqueda", "description": "Obtiene los resultados de una busqueda", "params":[]},	// HOME
			"SEARCH_RELATED_GET_RESULTS": 	{"service": "Search","type": "802", "isMon": false,  "section":"Búsqueda", "description": "Obtiene los resultados de una busqueda", "params":[]},	// HOME
			"ADMIN_GET_NOTIFICATIONS_REM": 	{"service": "Admin", "type": "0", "isMon": false,  "section":"HOME", "description": "Obtiene recordatorios, notificaciones, etc", "params":[]},	// HOME
			"ADMIN_SEND_CALL": 				{"service": "Admin", "type": "1", "isMon": false,  "section":"CALL", "description": "se envia el numero de la llamada", "params":[]},	// HOME
			"ADMIN_GET_CUSTOMER_DATA": 		{"service": "Admin", "type": "2", "isMon": false,  "section":"INSTALLER", "description": "Obtiene los parámetros del cliente", "params":[]},	
			"ADMIN_UPDATE_STATUS": 			{"service": "Admin", "type": "3", "isMon": false,  "section":"INSTALLER", "description": "Actualiza status del cliente", "params":[]},	
			"ADMIN_GET_TUTORIALS": 			{"service": "Admin", "type": "700", "isMon": false,  "section":"ARRANQUE", "description": "Obtiene el status del cliente y la sesión para transaccionar en el BE.", "params":[]},	// HOME
			"ADMIN_GET_CUSTOMER_STATUS": 	{"service": "Admin", "type": "600", "isMon": false,  "section":"ARRANQUE", "description": "Obtiene el status del cliente y la sesión para transaccionar en el BE.", "params":[]},	// HOME
			"ADMIN_GET_USER_PROFILE":  	 	{"service": "Admin", "type": "605", "isMon": false,  "section":"ARRANQUE", "description": "Obtiene el perfil del usuario logueado.", "params":[]},
			"ADMIN_SEND_ADMIN_PASSWORD":	{"service": "Admin", "type": "611", "isMon": false,  "section":"BlOQUEO", "description": "Obtiene el password del root", "params":[]},
			"ADMIN_SEND_USER_PASSWORD":		{"service": "Admin", "type": "612", "isMon": false,  "section":"BlOQUEO", "description": "Obtiene el password del usuario logueado.", "params":[]},
			"ADMIN_SEND_LOGOUT":			{"service": "Admin", "type": "608", "isMon": false,  "section":"LOGIN", "description": "Cierra la sesión del usuario logueado.", "params":[]},
			"ADMIN_SEND_LOGIN":				{"service": "Admin", "type": "607", "isMon": false,  "section":"LOGIN", "description": "Inicia sesión.", "params":[]},
			"ADMIN_GET_AVATARS":			{"service": "Admin", "type": "614", "isMon": false,  "section":"AVATARS", "description": "Obtiene la lista de avatares.", "params":[]},
			"ADMIN_GET_USERS":				{"service": "Admin", "type": "606", "isMon": false,  "section":"USERS", "description": "Obtiene la lista de usuarios", "params":[]},
			"ADMIN_GET_BLOCKED_CHANNELS":	{"service": "Admin", "type": "616", "isMon": false,  "section":"USERS", "description": "Obtiene la lista de usuarios", "params":[]},
			"ADMIN_NEW_USER":				{"service": "Admin", "type": "624", "isMon": false,  "section":"USERS", "description": "Crea un nuevo usuario", "params":[]},
			"ADMIN_GET_QUESTIONS":			{"service": "Admin", "type": "621", "isMon": false,  "section":"USERS", "description": "Obtiene la lista de preguntas", "params":[]},
			"ADMIN_SEND_ANSWER":			{"service": "Admin", "type": "622", "isMon": false,  "section":"USERS", "description": "Valida la respuesta a la pregunta secreta", "params":[]},
			"ADMIN_DEFAULTING":				{"service": "Admin", "type": "625", "isMon": false,  "section":"USERS", "description": "Parámetros para enrutamiento", "params":[]},
			"ADMIN_SET_PROFILE":			{"service": "Admin", "type": "615", "isMon": false,  "section":"PROFILE", "description": "Realiza cambios en el perfil", "params":[]},
			"ADMIN_GET_BANNERS":			{"service": "Admin", "type": "613", "isMon": false,  "section":"BANNERS", "description": "Obtiene los banners de los mosaicos.", "params":[]},
			"ADMIN_GET_MENU":				{"service": "Admin", "type": "609", "isMon": true,   "section":"MENU", 	  "description": "Obtiene el menú principal", "params":[]},
			"ADMIN_GET_SUBMENU":			{"service": "Admin", "type": "610", "isMon": false,  "section":"MENU", 	  "description": "Obtiene el un submenú", "params":[]},
			"ADMIN_GET_REMINDERS":			{"service": "Admin", "type": "617", "isMon": false,  "section":"RECORDATORIOS", "description": "Obtiene los recordatorios.", "params":[]},
			"ADMIN_GET_DEVICES":			{"service": "Admin", "type": "618", "isMon": false,  "section":"MENU", 	  "description": "Obtiene los dispositivos asociados a una cuenta", "params":[]},
			"ADMIN_NEW_ROOT":				{"service": "Admin", "type": "619", "isMon": false,  "section":"USERS", "description": "Crea el usuario root", "params":[]},
			"ADMIN_GET_NOTIFICATIONS":		{"service": "Admin", "type": "620", "isMon": false,  "section":"NOTIFICATIONS","description": "Obtiene las notificaciones", "params":[]},
			"ADMIN_GET_PROMOS":				{"service": "Admin", "type": "623", "isMon": false,  "section":"PROMOCIONES","description": "Obtiene las promociones", "params":[]},
			"ADMIN_NEW_USER":				{"service": "Admin", "type": "624", "isMon": false,  "section":"USERS", "description": "Crea un nuevo usuario", "params":[]},
			"ADMIN_GET_DESCRIPTION_ADDON":	{"service": "Admin", "type": "626", "isMon": false,  "section":"NOTIFICATIONS","description": "Obtiene descripcion del paquete a contratar HBO, FOX+, etc", "params":[]},
			"ADMIN_DELETE_NOTIFICATIONS":	{"service": "Admin", "type": "627", "isMon": false,  "section":"NOTIFICATIONS","description": "Elimina las notificaciones", "params":[]},
			"ADMIN_BUY_ADONS":				{"service": "Admin", "type": "628", "isMon": false,  "section":"ADDONS","description": "Contrata addons", "params":[]},
			"ADMIN_GET_INTEREACTIVE_PROMO":	{"service": "Admin", "type": "629", "isMon": false,  "section":"PROMOTIONS","description": "Muestra la promocion interactiva", "params":[]},
			"ADMIN_GET_SUCS_PROMOS":		{"service": "Admin", "type": "630", "isMon": false,  "section":"PROMOTIONS","description": "Muestra las sucursales", "params":[]},
			"ADMIN_GET_GALLERY_PROMOS":		{"service": "Admin", "type": "631", "isMon": false,  "section":"PROMOTIONS","description": "Muestra la galeria de promos", "params":[]},
			"ADMIN_GET_LIST_ADDON":			{"service": "Admin", "type": "632", "isMon": false,  "section":"NOTIFICATIONS","description": "Obtiene la lista de canales de un addon", "params":[]},
			"ADMIN_GET_DATA_HELP":			{"service": "Admin", "type": "633", "isMon": false,  "section":"HELP","description": "Obtiene la informacion de la ayuda", "params":[]},
			"ADMIN_GET_FAVORITE_APPS":		{"service": "Admin", "type": "634", "isMon": false,  "section":"APPS","description": "Muestra las apps favoritas del usuario", "params":[]},
			"ADMIN_GET_MAIL":				{"service": "Admin", "type": "635", "isMon": false,  "section":"SETUP","description": "Obtiene el correo del contrato del usuario", "params":[]},
			"ADMIN_GET_INVOICE":			{"service": "Admin", "type": "636", "isMon": false,  "section":"SETUP","description": "Obtiene la factura del contrato correspondiente", "params":[]},
			"ADMIN_SEND_BLOCK_CHANNEL":		{"service": "Admin", "type": "637", "isMon": false,  "section":"TV","description": "Manda el canal para bloquearlo", "params":[]},
			"ADMIN_UNLINK_DEVICE":			{"service": "Admin", "type": "638", "isMon": false,  "section":"DEVICES","description": "Desvincular dispositivo móvil", "params":[]},
			"ADMIN_APPS_CHANNEL":			{"service": "Admin", "type": "639", "isMon": false,  "section":"APPS","description": "Canal de aplicaciones", "params":[]},
			"ADMIN_SEND_EMAIL":				{"service": "Admin", "type": "640", "isMon": false,  "section":"LOGIN","description": "Envío de nip a correo", "params":[]},
			"ADMIN_SEND_USER_PARAMS":		{"service": "Admin", "type": "641", "isMon": false,  "section":"USERS","description": "Cambio parámetros users", "params":[]},
			"ADMIN_GET_SOCIAL_PARAMS":		{"service": "Admin", "type": "642", "isMon": false,  "section":"SOCIALNETWORKS","description": "Obtiene los parámetros de la red social","params":[]},
			"ADMIN_UNLINK_SOCIAL":			{"service": "Admin", "type": "643", "isMon": false,  "section":"SOCIALNETWORKS","description": "Vincula-Desvincula de red social", "params":[]},
			"ADMIN_GET_SOCIAL_CODE":		{"service": "Admin", "type": "644", "isMon": false,  "section":"SOCIALNETWORKS","description": "Obtiene el código para vincular las redes sociales", "params":[]},
			"ADMIN_CHECK_STATUS_CODE":		{"service": "Admin", "type": "645", "isMon": false,  "section":"SOCIALNETWORKS","description": "Verifica que el código para vincular no haya expirado", "params":[]},
			"ADMIN_GET_SOCIAL_NETWORKS":	{"service": "Admin", "type": "647", "isMon": false,  "section":"SOCIALNETWORKS","description": "Obtiene las redes sociales disponibles", "params":[]},
			"ADMIN_GET_FULL_MENU":			{"service": "Admin", "type": "667", "isMon": false,  "section":"MENU","description": "Obtiene el menú con sus respectivos submenus", "params":[]},
			"EPG_GET_CHANNEL_LIST":  	 	{"service": "Epg",   "type": "100", "isMon": false,  "section":"ARRANQUE", "description": "Obtiene el perfil del usuario logueado.", "params":[]},
			"EPG_GET_PROGRAM_INFO":  	 	{"service": "Epg",   "type": "102", "isMon": false,  "section":"ARRANQUE", "description": "Obtiene el perfil del usuario logueado.", "params":[]},
			"EPG_GET_CHANNEL_MATCHES": 	 	{"service": "Epg",   "type": "109", "isMon": false,  "section":"ARRANQUE", "description": "Obtiene el perfil del usuario logueado.", "params":["prefix", "ts"]},
			"EPG_GET_MOSAICS":  	 		{"service": "Epg",   "type": "112", "isMon": false,  "section":"MOSAICOS", "description": "Obtiene el mosaico actual con sus canales de categoría", "params":[]},
			"EPG_REMINDER":  	 			{"service": "Epg",   "type": "113", "isMon": false,  "section":"REMINDER", "description": "Agrega o elimina recordatorios en los programas", "params":[]},
			"EPG_GET_CHANNEL_PROGRAM":  	{"service": "Epg",   "type": "103", "isMon": false,  "section":"EPG"	 , "description": "Obtiene el perfil del usuario logueado.", "params":[]},
			"EPG_GET_PROGRAMS_CHANNELS": 	{"service": "Epg",   "type": "101", "isMon": true,  "section":"MINIGUIDE", "description": "Obtiene la programacion en live", "params":[]},
			"EPG_GET_PROGRAM":				{"service": "Epg",   "type": "107", "isMon": false,  "section":"RECOMMENDATIONS", "description": "Obtiene el programa de una recomendacion", "params":[]},
			"RECOMMENDATION_GET_PROGRAM": 	{"service": "Epg",	 "type": "114", "isMon": false,  "section":"RECOMMENDATIONS", "description": "Recomendaciones de live tv", "params":[]},
			"EPG_SEND_BOOKMARK_CTV":		{"service": "Epg",   "type": "115", "isMon": false,  "section":"CTV", "description": "Envia el bookmark de un ctv.", "params":[]},
			"EPG_RECORDING_NPVR":			{"service": "Epg",   "type": "116", "isMon": false,  "section":"CTV", "description": "", "params":[]},
			"EPG_ANYTIME_TV":				{"service": "Epg",   "type": "117", "isMon": false,  "section":"CTV", "description": "", "params":[]},
			"EPG_ANYTIME_TV_CHAP":			{"service": "Epg",   "type": "118", "isMon": false,  "section":"CTV", "description": "", "params":[]},
			"EPG_GET_PROGRAMS":				{"service": "Epg",	 "type": "119", "isMon": false,  "section":"SETUP", "description": "Obtiene la lista de programas.", "params":[]},
			"EPG_SET_PROGRAMS":				{"service": "Epg", "type": "120", "isMon": false,  "section":"SETUP", "description": "Agrega los programas que se grabaran en el perfil.", "params":[]},
			"EPG_GET_RECORDINGS":			{"service": "Epg", "type": "121", "isMon": false,  "section":"SETUP", "description": "Agrega los programas que se grabaran en el perfil.", "params":[]},
			"RECOMMENDATION_GET_DATA": 		{"service": "Recommendation", "type": "700", "isMon": false,  "section":"MINIGUIDE", "description": "Obtiene la programacion en live", "params":[]},
			"RECOMMENDATION_GET_ID_EPG": 	{"service": "Recommendation", "type": "701", "isMon": false,  "section":"RECOMMENDATIONS", "description": "", "params":[]},
			"RECOMMENDATION_GET_ID_VOD": 	{"service": "Recommendation", "type": "702", "isMon": false,  "section":"RECOMMENDATIONS", "description": "Recomendaciones por id de vod", "params":[]},
			"RECOMMENDATION_GET_EPG": 		{"service": "Recommendation", "type": "703", "isMon": false,  "section":"RECOMMENDATIONS", "description": "Recomendaciones por id del more info", "params":[]},
			"VOD_GET_CATEGORIES_LIST": 		{"service": "Vod", "type": "202", "isMon": false,  "section":"VOD", "description": "Obtiene las listas de las categorias de vod", "params":[]},
			"VOD_GET_CUSTOM_CAT_LIST": 		{"service": "Vod", "type": "220", "isMon": false,  "section":"VOD", "description": "Obtiene las listas de las categorias de vod", "params":[]},
			"VOD_GET_INFO":					{"service": "Vod", "type": "203", "isMon": false,  "section":"VOD", "description": "Obtiene el detalle de la pelicula", "params":[]},
			"VOD_ADD_WISHLIST":				{"service": "Vod", "type": "204", "isMon": false,  "section":"VOD", "description": "Agrega un vod a mi lista de deseos", "params":[]},
			"VOD_SEND_QUALIFY":				{"service": "Vod", "type": "205", "isMon": false,  "section":"VOD", "description": "Envia la calificacion de un vod", "params":[]},
			"VOD_RENT_MOVIE":				{"service": "Vod", "type": "206", "isMon": false,  "section":"VOD", "description": "Compra un vod", "params":[]},
			"VOD_GET_TRAILERS": 			{"service": "Vod", "type": "207", "isMon": false,  "section":"VOD", "description": "Obtiene los trailers del canal de trailers", "params":[]},
			"VOD_SEND_BOOKMARK":			{"service": "Vod", "type": "208", "isMon": false,  "section":"VOD", "description": "Guarda el bookmark de un vod", "params":[]},
			"VOD_GET_SEASONS_LIST":			{"service": "Vod", "type": "209", "isMon": false,  "section":"VOD", "description": "", "params":[]},
			"VOD_GET_SEASONS_LIST_2":		{"service": "Vod", "type": "210", "isMon": false,  "section":"VOD", "description": "", "params":[]},
			"VOD_GET_KIDS_LIST":			{"service": "Vod", "type": "211", "isMon": false,  "section":"VOD", "description": "", "params":[]},
			"VOD_GET_WIZZARD":				{"service": "Vod", "type": "212", "isMon": false,  "section":"VOD", "description": "", "params":[]},
			"VOD_SEND_QUALIFY_VODS":		{"service": "Vod", "type": "213", "isMon": false,  "section":"VOD", "description": "", "params":[]},
			"VOD_SEND_CODE":				{"service": "Vod", "type": "216", "isMon": false,  "section":"VOD", "description": "", "params":[]},
			"VOD_GET_AZ":					{"service": "Vod", "type": "217", "isMon": false,  "section":"VOD", "description": "", "params":["club","page"]},
			"VOD_GET_TEST_LIST":			{"service": "Vod", "type": "218", "isMon": false,  "section":"VOD", "description": "", "params":[]},
			"VOD_GET_AUTORIZATION":			{"service": "Vod", "type": "219", "isMon": false,  "section":"VOD", "description": "", "params":[]},
			"VOD_GET_CATE_VODS":			{"service": "Vod", "type": "221", "isMon": false,  "section":"VOD", "description": "", "params":[]},			
		},
		call: function(name, params, callback, server, be, method, timeout, ssl) {
			var host = ssl ? tpng.backend.url_ssl : tpng.backend.url;
			host = server ? server : host;
			var mac = tpng.backend.mac_address;
			var session = tpng.backend.session;     		
			var service = this.backEndServices[name].service;
			var type = this.backEndServices[name].type;
			var stbTs = new Date().getTime();
			method = "POST";
			if(method){
				//Por POST			
				var key = session ? ("session="+session) : ("mac="+mac);
				if(!params){var params = [];}
				params.push("type="+type);
				params.push(key);
				params.push("stbTs="+stbTs);
				var url = host + service; //Para Mike le dejo el type en el get
				//var url = host + service + "?type=" + type + "&session=" + session; //Esto es mientras arreglan en backend
			}else{
				//Por GET
				if(session)
					var url = host + service + "?type=" + type + "&session=" + session + "&stbTs=" + stbTs;
				else
					var url = host + service + "?type=" + type + "&mac=" + mac + "&stbTs=" + stbTs;
				
				if (params) {
					if(session)
						url = host + service + "?type=" + type + "&" + params.join("&") + "&session=" + session + "&stbTs=" + stbTs;
					else
						url = host + service + "?type=" + type + "&" + params.join("&") + "&mac=" + mac + "&stbTs=" + stbTs;
				} 	
			}
			//***********************************************************		
			if (callback){
		    	tp_httpRequest.getSingleton().send(url, callback, method, params, timeout, type);
		    } 
		}
	  }
	 }
	return this._singleton;
  }
};