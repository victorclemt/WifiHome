/**
 * This namespace is for common elements of the app.
 * @type {Object}
 */
var commons = {
	/**
	 * Rainbow table of month names. 
	 * It's recommended to use it in order to maintain consistency across the UI.
	 */
	'months': {
		0: "Enero",
		1: "Febrero",
		2: "Marzo",
		3: "Abril",
		4: "Mayo",
		5: "Junio",
		6: "Julio",
		7: "Agosto",
		8: "Septiembre",
		9: "Octubre",
		10: "Noviembre",
		11: "Diciembre"
	},
	/**
	 * Rainbow table of abreviated month names. 
	 * It's recommended to use it in order to maintain consistency across the UI.
	 */
	'months_abrv': {
		0: "Ene",
		1: "Feb",
		2: "Mar",
		3: "Abr",
		4: "May",
		5: "Jun",
		6: "Jul",
		7: "Ago",
		8: "Sep",
		9: "Oct",
		10: "Nov",
		11: "Dic"
	},

	/**
	 * Rainbow table of weekday names. 
	 * It's recommended to use it in order to maintain consistency across the UI.
	 */
	'weekdays': {
		0: "Domingo",
		1: "Lunes",
		2: "Martes",
		3: "Miércoles",
		4: "Jueves",
		5: "Viernes",
		6: "Sábado"
	},

	/**
	 * Rainbow table of abreviated weekday names. 
	 * It's recommended to use it in order to maintain consistency across the UI.
	 */
	'weekdays_abrv': {
		0: "Dom",
		1: "Lun",
		2: "Mar",
		3: "Mie",
		4: "Jue",
		5: "Vie",
		6: "Sab"
	}
};

function getHourFromTs(_ts){
	//Recibe un timestamp y lo convierte a formato 10:00
	var date = new Date(_ts);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	
	hours = hours < 10 ? "0" + hours : "" + hours;
	minutes = minutes < 10 ? "0" + minutes : "" + minutes;
	
	return hours + ":" + minutes;
}

function getProgramInfoStr(_program){
	//Recibe un programa y en base a la información 
	//que tenga construye la cadena que contiene la año | categoria | temporada/episodio
	
	//_program.year = "2015";
	//_program.season = "Temporada 4 Episiodio 12";
	
	var todayDate = new Date().getTime();
	if(_program.endTime < todayDate){
		//pasado
		var pasado = dateToText(_program.startTime);
		_program.timeProgram = pasado;
	}else{
		if(_program.startTime < todayDate && _program.endTime > todayDate){
				// presente
			var currentTimeProgram = _program.startTime ? timeLeft(_program.startTime, _program.endTime): "";
			_program.timeProgram = currentTimeProgram;
		}else{
				// futuro
			var future = dateToText(_program.startTime);
			_program.timeProgram = future;
		}
	}
	
	var str = "";
	if(_program.year)
		str = str + "<!placeholder=7>I<!placeholder=7>" + _program.year;
	if(_program.category)
		str = str + "<!placeholder=7>I<!placeholder=7>" +_program.category+"<!placeholder=7>I<!placeholder=7>"+_program.timeProgram;
	if(_program.season)
		str = str + "<!placeholder=7>I<!placeholder=7>" + _program.season;

	return str;
}


function getDetailData(_cadena){
	var str = "";
	if(_cadena)
		str = "<!placeholder=3>I<!placeholder=3>" + _cadena;
		
	return str;
}

function getVodInfoStr(_program){
	//Recibe un programa y en base a la información 
	//que tenga construye la cadena que contiene la año | categoria | temporada/episodio
	
	//_program.year = "2015";
	//_program.season = "Temporada 4 Episiodio 12";

	
	var str = "";
	if(_program.year)
		str = str + "<!placeholder=7>I<!placeholder=7>" + _program.year;
	if(_program.category)
		str = str + "<!placeholder=7>I<!placeholder=7>" + _program.category;
	if(_program.season)
		str = str + "<!placeholder=7>I<!placeholder=7>" + _program.season;

	return str;
}



function replaceAll(text, busca, remplaza){
    if (!text)
        return null;
	while(text.toString().indexOf(busca) != -1){
		text = text.toString().replace(busca, remplaza);
	
	
		text = text.replace('á', 'a');
		text = text.replace('é', 'e');
		text = text.replace('í', 'i');
		text = text.replace('ó', 'o');
		text = text.replace('ú', 'u');
		text = text.replace('Á', 'A');
		text = text.replace('É', 'E');
		text = text.replace('Í', 'I');
		text = text.replace('Ó', 'O');
		text = text.replace('Ú', 'U');
	}
	return text;
}

function getHoursMinutes(_hour){
	//Recibe un formato 00:00 hras/minutos
	var hours = _hour.slice(0,2) * 1;
	var minutes = _hour.slice(3,5) * 1;
	return {"hours": hours, "minutes": minutes};
}


function getNextTs(_hour){
	//Recibe un formato 00:00 hras/minutos
	//Sólo funcionará para horas después de las 20
	var hours = _hour.slice(0,2) * 1;
	var minutes = _hour.slice(3,5) * 1;
	var date = new Date();
	//Validar si es de madrugada	
	var hoursNow = date.getHours();
	var dawning = hoursNow <= 8 ? true : false;
	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(0);
	//Si es de madrugada quitar un día
	if(dawning)
		date.setTime(date.getTime()- 86400000);
	return date.getTime();
}


function shortFormatDate(_date){
	var day = short_days[_date.getDay()];
	var month = short_months[_date.getMonth()];
	var date = _date.getDate();
	return day + " " + date + ", " + month; 
}

function longFormatDate(_date){
	var day = full_days[_date.getDay()];
	var month = full_months[_date.getMonth()];
	var date = _date.getDate();
	return day + " " + date + " de " + month; 
}

function startTimeEndTime(_startTime, _endTime, _section){
		
		var durationProgram = (_endTime - _startTime) /60, // min	
			startHour = new Date(_startTime).getHours(),
			startHourM =  new Date(_startTime).getMinutes(),
			time;
		if(startHour || durationProgram){
			
			if(startHourM < 10)
				startHourM = "0" + startHourM;
			
			var endHour = new Date(_endTime).getHours(),
				endHourM =   new Date(_endTime).getMinutes();
			if(endHourM < 10)
				endHourM = "0" + endHourM;
			
			if(_section){
				time = startHour+":"+startHourM+" hrs/" + endHour+":"+endHourM+" hrs";
			}else{
				time = startHour+":"+startHourM+" hrs / " + endHour+":"+endHourM+" hrs";
			}
			
		}else{
			time = "--:-- / --:--";
		
		}
	
		return time;
}



function timeLeft(_startTime, _endTime){
	var tEnd = new Date(_endTime),//time End
		tStart = new Date(_startTime);//time Start
		tActual = new Date(),//time actual
		tTras = new Date(),//time trascurido
		tTotal = new Date(),//time total
		hrsIni,//horas inicio
		minIni,//minutos inicio
		hrsFin,//horas fin
		minFin,//minutos fin
		hrs,//horas restantes
		min,//minutos restantes
		minTotal;//minutos total
		
	tTotal.setHours(tEnd.getHours() - tStart.getHours(), tEnd.getMinutes() - tStart.getMinutes());//Timpo total
	minTotal = (_endTime - _startTime) /60; // duracion min
	tTras.setHours(tEnd.getHours() - tActual.getHours(), tEnd.getMinutes() - tActual.getMinutes()); //tiempo restante
	
	tTras.getHours()<10 ? hrs = "-0"+tTras.getHours() : hrs = "-"+tTras.getHours();
	tTras.getMinutes()<10 ? min = "0"+tTras.getMinutes() : min = tTras.getMinutes();
	
	return  hrs+":"+min+" hrs";
	
}

function percent(_startTime, _endTime, _width){
	var tEnd = new Date(_endTime),//time End
		tStart = new Date(_startTime);//time Start
		tActual = new Date(),//time actual
		tTotal = new Date(),//time total
		tTras = new Date(),//time trascurido
		minTotal,
		minRest,
		minTran,
		xProgreso;
			
	tTotal.setHours(tEnd.getHours() - tStart.getHours(), tEnd.getMinutes() - tStart.getMinutes());//Timpo total
	minTotal = ((_endTime - _startTime)/1000) /60; // duracion min
	tTras.setHours(tEnd.getHours() - tActual.getHours(), tEnd.getMinutes() - tActual.getMinutes()); //tiempo restante
	minRest = (tTras.getHours() * 60) + tTras.getMinutes();	 
	minTran = minTotal - minRest;
   	progress = (_width/minTotal)*minTran;
	
	return progress;
}


isoToStringAudio = function isoToStringAudio(_iso, _name){
	var complete = "";
	switch(_iso+""){
		case "spa":
			complete = "español";
		break;
		case "eng":
			complete = "inglés";
		break;
		case "undefined":
		case "und":
			complete = "Idioma no disponible";
		break;
		default:
			complete = ""+_name;
		break;
	}
	return complete;
}

isoToStringSub = function isoToStringSub(_iso){
	var complete = "";
	switch(_iso+""){
		case "spa":
			complete = "español";
			break;
		case "undefined":
		case "und":
			complete = "Subtitulo no disponible";
		break;
		default:
			complete = "sin subtitulos";
			break;
	}
	return complete;
}
function dateToText(ts){
	var date = new Date(ts);
	var fechaTxt = "";
	var today = new Date();
	var tsA = new Date(today.getTime() - ( 1 * 24 * 3600 * 1000));
		tsA.setHours(0);
		tsA.setMinutes(0);
		tsA.setSeconds(1);
		tsA.setMilliseconds(0);
		
	var tsM = new Date(today.getTime() + ( 1 * 24 * 3600 * 1000));
		tsM.setHours(0);
		tsM.setMinutes(0);
		tsM.setSeconds(1);
		tsM.setMilliseconds(0);
	
	if(date.getDate() != new Date().getDate()){
		if(date.getTime() == tsA.getTime()){
			fechaTxt=fechaTxt+"Ayer";
		}else{
			if(date.getTime() == tsM.getTime()){
				fechaTxt=fechaTxt+"Mañana";
			}else{
				switch(date.getDay()){
					case 0:
						fechaTxt=fechaTxt+"Domingo";
						break;
					case 1:
						fechaTxt=fechaTxt+"Lunes"
						break;
					case 2:
						fechaTxt=fechaTxt+"Martes"
						break;
					case 3:
						fechaTxt=fechaTxt+"Miércoles"
						break;
					case 4:
						fechaTxt=fechaTxt+"Jueves"
						break;
					case 5:
						fechaTxt=fechaTxt+"Viernes"
						break;
					case 6:
						fechaTxt=fechaTxt+"Sábado"
						break;
				}
			}
		}
	}else{
		fechaTxt=fechaTxt+"Hoy"
	}
	fechaTxt=fechaTxt+" "+date.getDate()+" ";
	switch(date.getMonth()){
		case 0:
			fechaTxt=fechaTxt+"Ene"
			break;
		case 1:
			fechaTxt=fechaTxt+"Feb"
			break;
		case 2:
			fechaTxt=fechaTxt+"Mar"
			break;
		case 3:
			fechaTxt=fechaTxt+"Abr"
			break;
		case 4:
			fechaTxt=fechaTxt+"May"
			break;
		case 5:
			fechaTxt=fechaTxt+"Jun"
			break;
		case 6:
			fechaTxt=fechaTxt+"Jul"
			break;
		case 7:
			fechaTxt=fechaTxt+"Ago"
			break;
		case 8:
			fechaTxt=fechaTxt+"Sep"
			break;
		case 9:
			fechaTxt=fechaTxt+"Oct"
			break;
		case 10:
			fechaTxt=fechaTxt+"Nov"
			break;
		case 11:
			fechaTxt=fechaTxt+"Dic"
			break;
	}
	return fechaTxt;
}

function returnDay(ts){
	var date = new Date(ts),
		day = date.getDate();
		return day;

}
function returnMonth(ts){
	var date = new Date(ts),
		month = null;
		
		switch(date.getMonth()){
		case 0:
			month = "Ene";
			break;
		case 1:
			month = "Feb";
			break;
		case 2:
			month = "Mar";
			break;
		case 3:
			month = "Abr";
			break;
		case 4:
			month = "May";
			break;
		case 5:
			month = "Jun";
			break;
		case 6:
			month = "Jul";
			break;
		case 7:
			month = "Ago";
			break;
		case 8:
			month = "Sep";
			break;
		case 9:
			month = "Oct";
			break;
		case 10:
			month = "Nov";
			break;
		case 11:
			month = "Dic";
			break;
	}
	return 	month;

}

function getQualities(_qualities){
	//Recibe un arreglo de las calidades de un Vod y retorna un texto  "SD, HD"
	
	var qualities =[];
	for(var x = 0; x < _qualities.length; x++){
		var aux = true;
		if(qualities.length > -1){
			for(var j = 0; j < qualities.length; j++){
				if(" "+_qualities[x].VodFormatVO.quality == qualities[j]){
					aux = false;
				}
			}
		}
		if(aux){
			qualities.push(" "+_qualities[x].VodFormatVO.quality);
		}
	}
	
	
	return qualities.toString();
}


function getLanguages(_languages){
	//Recibe un arreglo de las calidades de un Vod y retorna un texto  "SD, HD"
	
	var audios = [];
	    for(var i=0; i< _languages.length; i++){
		     
	     var aux =false;
	     var lang = _languages[i].VodFormatVO.audio;
	     
	     if(_languages[i].VodFormatVO.subTittle != "Sin Subtitulos"){
	     	lang = lang + " subtitulada";
	     }
	     
	     for(var j=0; j<audios.length; j++){
	     	if(audios[j] == " "+lang){
	     		aux = true;
	     		break;
	     	}
	     }
	     if(!aux)
	     	audios.push(" "+lang);
   	}
	
	
	return audios.toString();
}

function getLanguagesBuy(_languages,_quality){
	
	var audios = [];
	for(var i=0; i< _languages.length; i++){
		if(_languages[i].VodFormatVO.quality+"" == _quality+""){
		
		var aux =false;
		var lang = _languages[i].VodFormatVO.audio;
		
		 if(_languages[i].VodFormatVO.subTittle != "Sin Subtitulos"){
		     	lang = "Subtitulada";
		 }
		     
		     for(var j=0; j<audios.length; j++){
		     	if(audios[j] == lang){
		     		aux = true;
		     		break;
		     	}
		     }
		     if(!aux)
		     	audios.push(""+lang);
	
		}
				
	}
	//Agregar espacio entre audios. XFR
	var str = audios.toString();
	var res = str.replace(",", ", ")
	
	return res;

}

function getDateSearch(_tsStart, _tsEnd){
	//_tsStart = 1426392000000, _tsEnd = 1426403400000;
	var startDate = new Date(_tsStart);
	var endDate = new Date(_tsEnd);
	var _dateText = "";
	
	
	if(startDate.getDate() != new Date().getDate()){
		switch(startDate.getDay()){
			case 0:
				_dateText += "dom";
				break;
			case 1:
				_dateText += "lun";
				break;
			case 2:
				_dateText += "mar";
				break;
			case 3:
				_dateText += "mie";
				break;
			case 4:
				_dateText += "jue";
				break;
			case 5:
				_dateText += "vie";
				break;
			case 6:
				_dateText += "sab";
				break;
		}
	
	
	_dateText += " "+startDate.getDate()+" de ";
	
	switch(startDate.getMonth()){
		case 0:
			_dateText += "ene, ";
			break;
		case 1:
			_dateText += "feb, ";
			break;
		case 2:
			_dateText += "mar, ";
			break;
		case 3:
			_dateText += "abr, ";
			break;
		case 4:
			_dateText += "may, ";
			break;
		case 5:
			_dateText += "jun, ";
			break;
		case 6:
			_dateText += "jul, ";
			break;
		case 7:
			_dateText += "ago, ";
			break;
		case 8:
			_dateText += "sep, ";
			break;
		case 9:
			_dateText += "oct, ";
			break;
		case 10:
			_dateText += "nov, ";
			break;
		case 11:
			_dateText += "dic, ";
			break;
		}
	}else{
		_dateText += "Hoy de ";
	}
	
	_dateText += startDate.getHours()<10 ? "0"+startDate.getHours()+":" : startDate.getHours()+":" ;
	_dateText += startDate.getMinutes()<10 ? "0"+startDate.getMinutes() : startDate.getMinutes();
	
	_dateText += " - "
	
	_dateText += endDate.getHours()<10 ? "0"+endDate.getHours()+":" : endDate.getHours()+":";
	_dateText += endDate.getMinutes()<10 ? "0"+endDate.getMinutes() : endDate.getMinutes();
	
	_dateText += " hrs"
	
	return _dateText;
}
function getTimeFormat(_data){
	var time = _data;
	var min;
	var seg;
	
		min = time/60000;
  		min = parseInt(min);
  		time -= min*60000;
  		
  	seg= time/1000;
  		seg=parseInt(seg);
  		
  		
  	if(min<10){
  		min="0"+min;
  	}
  	if(seg<10){
  		seg="0"+seg;
  	}
  	
	return min+":"+seg;
	
	
}

//funciones de la epg

function getTimeHHMM(date){
   		var hour = date.getHours();
        var min = date.getMinutes();
        return (hour<10?"0"+hour:hour)+":"+(min<10?"0"+min:min);
};

function modulo(left, right){
   		return (((left%right)+right)%right)>>0;
};

function getDateEPGStr(program){
   		if(program)
   			var date = new Date(program.startTime * 1000);
   		else
   			var date = new Date();
   		
   		var now = new Date();
   		var dif = 0;	
   		
   		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
   		date.setMilliseconds(0);
   		
   		var dif = now - date;
   		var day = full_days[date.getDay()];
   		var txt = "";
   		
   		
   		if(dif==0){
			txt = "hoy, " + day;
		}else if(dif == 86400000){
			txt = "ayer, " + day;
		}else if(dif == -86400000){
			txt = "mañana, " + day;
		}else{
			txt = day + " " + date.getDate() + " de " + meses[date.getMonth()];
		}
 	
   		return txt.toLowerCase();
};


function paramsToString(params){
	var s = "";
	if(params.length > 0){
		for(var i = 0, l = params.length; i<l; i++){
			if(i == (l-1))
				s = s + params[i];
			else
				s = s + params[i]+ "&";
		}
	}
	return s;

}

function upperFirst(string){ 
	return string.charAt(0).toUpperCase() + string.slice(1); 
}


function replaceSpecialChars(text) {

    var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
    var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
    for (var i=0; i<acentos.length; i++) {
       text = text.replace(acentos.charAt(i), original.charAt(i));
    }
    return text;
}

function loadPaintImg(_url){
	//Función que pinta la imagen hasta que se descarga
	//Para transiciones de vodHome, menú y wizard VOD
	var o = {"home":this.home}; //Argumentos que mandamos a la función callback
	//Verificamos que la imagen esté en caché
	var img = NGM.imageCache.get(_url);
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

function imgLoadCb(url, img, arg){
	//Función callback que setea la imagen en el background principal
	//del HOME, adicional cambia el speed de entrada para lograr una 
	//mejor transición.
	if(img.size){
		var bg = arg.home.widgets.mainBg;
		bg.setData(img);
		bg.stateChange("enter",500);
	}	
//	delete img;
	//Importante siempre borrar la imagen para no llenar la buffer gráfico.
}


function setBackground(_url){

	var bg = this.home.widgets.mainBg;

	//Antes de la carga de la imagen pasamos a medium el background
	//para lograr el efecto de medium a enter
	bg.stateChange("medium");
	this.loadPaintImg(_url);
}

function encryptByDES(message, key) {
    // For the key, when you pass a string,
    // it's treated as a passphrase and used to derive an actual key and IV.
    // Or you can pass a WordArray that represents the actual key.
    // If you pass the actual key, you must also pass the actual IV.
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    // console.log(CryptoJS.enc.Utf8.stringify(keyHex), CryptoJS.enc.Hex.stringify(keyHex));
    // console.log(CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(key).toString(CryptoJS.enc.Hex)));
    // CryptoJS use CBC as the default mode, and Pkcs7 as the default padding scheme
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    // decrypt encrypt result
    // var decrypted = CryptoJS.DES.decrypt(encrypted, keyHex, {
    //     mode: CryptoJS.mode.ECB,
    //     padding: CryptoJS.pad.Pkcs7
    // });
    // console.log(decrypted.toString(CryptoJS.enc.Utf8));
    // when mode is CryptoJS.mode.CBC (default mode), you must set iv param
    // var iv = 'inputvec';
    // var ivHex = CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(iv).toString(CryptoJS.enc.Hex));
    // var encrypted = CryptoJS.DES.encrypt(message, keyHex, { iv: ivHex, mode: CryptoJS.mode.CBC });
    // var decrypted = CryptoJS.DES.decrypt(encrypted, keyHex, { iv: ivHex, mode: CryptoJS.mode.CBC });
    // console.log('encrypted.toString()  -> base64(ciphertext)  :', encrypted.toString());
    // console.log('base64(ciphertext)    <- encrypted.toString():', encrypted.ciphertext.toString(CryptoJS.enc.Base64));
    // console.log('ciphertext.toString() -> ciphertext hex      :', encrypted.ciphertext.toString());
    return encrypted.toString();
}
/**
 * Decrypt ciphertext by DES in ECB mode and Pkcs7 padding scheme
 * 
 * @param  {String} ciphertext(base64 string)
 * @param  {String} key
 * @return {String} plaintext
 *
 * @author Sun
 * @version 2013-5-15
 */
function decryptByDES(ciphertext, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    // direct decrypt ciphertext
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function toUpperCase(_data){
    if (!_data)
        return _data;
	var text = _data.toUpperCase();
        return text;
}

function log(s)
{
    NGM.trace(s);
}

var tsToString = function(ts, ms){
	var factor = ms ? 1 : 1000;
	var date = new Date(ts*factor);

	if(isNaN(date)){
		return "";
	}

	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	
	var seconds = date.getSeconds();
	seconds = (seconds > 10)?seconds + '':'0'+seconds;
	
	var minutes = date.getMinutes();
	minutes = (minutes > 10)?minutes + '':'0'+minutes;
	
	var day = date.getDate();
	day = (day > 10)?day + '':'0'+day;

	var month = date.getMonth() + 1;
	month = (month > 10)?month + '':'0'+month;

	return date.getFullYear() + '/' + month + '/' + day + ' @ ' +hours + ':' + minutes + ':' + seconds;
}
