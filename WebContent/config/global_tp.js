var tpng ={
	"backend":{													
		//"url": "http://10.213.12.163:9900/TPMCOREWeb/", //Desarrollo/QA 		
		//"url": "http://10.1.0.190/TPMCOREWeb/", //Pre-PROD
		//"url": "http://iptvcore.totalplay.com.mx/TPMCOREWeb/", //Producci�n	
		"url": "https://iptvcore.totalplay.com.mx/TPMCOREWeb/", //Producci�n
		//"url": "https://10.1.0.156/TPMCOREWeb/", //Producci�n	
		"mac_address": NGM.main.macAddress().toLowerCase(),	
		"version": "2.0",		
		"session": null,
		"request": "",
		"msRequest": 0,
		"msResponse": 0,
		"timeout": 5000,
		"retries": 0		
	},
	"stb":{
		"target": null,
		"key": "1PTVv3.0M1ddl3w4r3-tpngTpsg",
		"keyNip":"MDWIPTV2012",
		"ip": Netgem.middleware.connectionManager.activeConnection.currentIpAddress
	},
	"DST":{
		"beginDate": null,
		"endDate": null
	},
	"user":{
		"status": null,
		"profile": null,
		"networkImg": null,
		"unlock": false		
	},
	"app":{
		"version": "1",
		"subversion": "1",
		"isSafeMode": false,
		"isDev": false, //Determina si la versi�n que estamos corriendo es una versi�n de DEV
		"section": "",
		"channelList": [], 			//Lista completa de canales. Response de EPG 100.
		"channels": [],				//S�lo canales tipo C y S (canales y sonidos)
		"mosaics": [],				//Canales Interactive tipo Mosaico
		"channelIndex": 0,			//Indice del ChannelList
		"channelNumber": "", 		//Variable para guardar n�meros presionados por el usuario
		"currentChannel": null,		//Variable donde se guarda el canal actual
		"currentProgram": null,		//Variable donde se guarda el programa actual
		"lastChannel": null, 		//�ltimo canal sintonizado, se guardar� el objeto completo (Channel Object).
		"programInfo": "zap",
		"reloadPlayer": false,
		"showProgramInfo": true,	//Variable que indica 
		"safeNightStart": "12:00",	//Variable que indica cuando inicia el safe night
		"safeNightEnd": "",			//Variable que indica cuando termina safe night
		"safeNightDuration": 9*60, 	//Variable que indica la duraci�n del safeNight, sobreescribe el nightEnd. Est� en minutos.
		"safeNightOn": false,
		"unlockedPrograms": [],
		"lockedStream": false,
		"sections": [],				//Stack de secciones abiertas por el usuario		
		"audios": null,
		"audioIndex": 0,
		"subtitles": null,
		"subtitleIndex": 0,
		"lastWords": [],			//�ltimas b�squedas del usuario
		"lastNumbers": [],			//�ltimos n�meros del usuario
		"isInteractiveChannel": true,
		"twitter": false,
		"twitterApp": null,
		"unlock_pass": "1991",
		"new_version": false,
		"advertisingEnable" : false,
		"advertisingData": null,
		"ytUserAgent": null,
		"advertising":[],
		"headerButtons": [],
		"showTutorial": false,
		"firstTime": true,
		"section_tpm": null,
		"isDemoTv": false
	},
	"vod":{
		"tsUpdate": 0,
		"dataHome": null,
		"home_response": null,
		"dataAZ": null
	
	},
	"player":{
		"status": null
	},
	"thema":{
		"text_proportion": 1,
		"outline_fill": "rgba(30,30,30,1)",
		"outline_width": 1
		
	},
	"notifications":{
		"server": "http://10.1.0.217:8081/GetEvent"
	},
	"statistics":{
		"channels": [],
		"items": [],
		"sections": [],
		"ctvs": [],
		"startOvers": [],
		"vods":[],
		"apps": []
	},
	"netflix": {
		"tuneInByNumber": false,
		"fromMiniGuide": false,
		"link": {
			"type": "N",
			"ref": "app.netflix",
			"parameters":{"id": "remoteControl"}
		},
		"channelSurfing": false
	},
	"menu":{
		"tsMenu": 0, // TS en el que se actualizar� el men�. Se obtiene del servicio. La primera vez es cero.
		"lastMenuIndex": 0, //Indice del �ltimo men� accesado. La primera vez es -1.
		"lastSMenuIndex": -1, //Indice del �ltimo sub men� accesado. La primera vez es -1.
		"data": null, //Guarda los datos del men� en memoria hasta la pr�xima actualizaci�n. 
		"submenus": []
	},
	
	"timeLine": {
		"daysMinus": -7,
		"daysMore": 7
	},
	"user_Tokens":{ //Twitter Tokens
		"access_token":"2819846081-hZXDxtBCE7NTaZvPrSD4sN4mVQb9T6rOah5Idbc",
		"access_token_secret":"5w0kao82qIX00HOcq76WI9hfzsY5pzjXmR4ESoPhy84UQ"
	},
	"app_Tokens":{ //Twitter Tokens
		"consumer_key":"Hhd0zAHxtsl5oRaN5zh4UE376",
		"consumer_token_secret":"H5K7LfrfkaVL6D9zJJeYw6kS7ZrNwrEAxhQmDwIKgqqQtH25Pf"
	}
	
}