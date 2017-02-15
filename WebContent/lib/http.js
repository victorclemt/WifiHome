/*********
METHODS
**********
send

- Description:
Sends an HTTP Request using XMLHttpRequest Object.

- Invoke:
tp_httpRequest.getSingleton().send(url,callback)

- Params
url: url of the request
callback: callback function
*/

var tp_httpRequest = {
  _singleton: null,
  getSingleton: function() {
    if (!this._singleton) {
      this._singleton = {
        send: function(url, callback, _method, _params, _timeout, _service) {
		
			var response = {"status":null, "data":null, "error": {"error":null,"message":null, "suggest": ""}};
			var error = {"status":null,"error":null,"description":null};
			var timeout = _timeout ? _timeout : tpng.backend.timeout;
			var method = _method ? "POST" : "GET";
			
			app.log(" ");
			app.log(url);
			
			var xhr = XMLHttpRequest();
    		xhr.open(method, url, true);
    		xhr.overrideMimeType("text");

    		xhr.onreadystatechange = function () {
		    			if (xhr.readyState != 4) return;		        		        

				        tpng.backend.msResponse = new Date().getTime();
				        tpng.backend.request = url;		        
				        clearTimeout(xhr.httpRequestTimeout);
			       		response.status = xhr.status;

						//Timeout error & retries
				        if(tpng.app.retries < 3 && xhr.timeouted){
				        	app.log("retry(" + (tpng.app.retries) + "): ");
				        	xhr = null;
				        	tp_httpRequest.getSingleton().send(url, callback, _method, _params);
				        }else{
				        //HTTP response	
				        	if(response.status != 200){
				       			//HTTP Errors Managment
				       			tpng.app.retries = 0;
				       			response.data = "{}";				       			
				       			if(!xhr.responseText){
				       				//Errores 500 o con response text vacío
				       				app.log("BE ERROR: Empty Response/HTTP Code("+response.status+")");
				       				if(response.status == 0){
				       					response.error.error = "Tiempo agotado de espera";
					       				response.error.message= gettext("ERROR_MESSAGE_0");
					       				response.error.suggest = gettext("ERROR_SUGGEST");
				       				}else{
					       				response.error.error = gettext("ERROR_HTTP_TITLE");
					       				response.error.message= gettext("ERROR_MESSAGE");
					       				response.error.suggest = gettext("ERROR_SUGGEST");
					       			}
					       			response.status =  _service + "E" + response.status;
				       			}else{
				       				//Errores HTTP con response (400, 407, 403, 404, etc)
				       				app.log("BE ERROR: HTTP Code("+response.status+")");
				       				app.log(xhr.responseText);
				       				response.error.message = gettext("ERROR_HTTP_MESSAGE");
				       				//Validación de casos especiales.
				       				switch(response.status){
				       					case "407":
				       						response.error.message= gettext("ERROR_MESSAGE");
				       						response.error.suggest = gettext("ERROR_HTTP_407_SUGGEST");
				       					break;
				       									       					
				       					default:
				       						response.error.message= gettext("ERROR_MESSAGE");
				       						response.error.suggest = gettext("ERROR_SUGGEST");
				       					break;
				       				}
				       				response.status = _service + "E" + response.status;	
				       			}
				       			
				       		}else{	       				       				       			
				       			tpng.app.retries = 0;
				       			app.log("responded in: "+(tpng.backend.msResponse-tpng.backend.msRequest)+" milliseconds");	       				       			
				       			app.log(" ");				       			
				       			try{
									var textResponse = xhr.responseText + "";									
									if (settings.get("totalplay.backend.ott") == 1) {

/*									
										var re = /https:\/\/totalgo.totalplay.com.mx:444/gi,
											re2 = /https:\/\/ott.totalplay.com.mx/gi,
											re3 = /https:\/\/totalgo.totalplay.com.mx/gi,
											ott_url = settings.get("totalplay.backend.ott.url") || "http://200.38.126.38:8081";
											textResponse = textResponse.replace(re, ott_url);	
											textResponse = textResponse.replace(re3, ott_url);
*/											
									} 
									response.data = JSON.parse(textResponse);
				       			} catch(err){
				       					//ERROR EN EL FORMATO JSON
								 		app.log("Catch error: HTTP Code("+response.status+")");
								 		NGM.dump(xhr.responseText);
								 		response.data = "{}";
					       				response.error.error = gettext("ERROR_HTTP_JSON");
					       				response.error.message= ""+xhr.responseText;
					       				response.error.suggest = gettext("ERROR_SUGGEST");
					       				response.status = _service + "E" + response.status;	
								}
				       		}	       		
							xhr = null;
					        callback(response);
					        }
		        	       			       			     	       		
		    }
		    if(_method == "POST"){
		   		app.log("POST params: " + paramsToString(_params));
		   		xhr.send(paramsToString(_params));
		   	}else{
		   		xhr.send();		   	
		   	}
		   	
		    
		    tpng.backend.msRequest = new Date().getTime();		    
		    xhr.httpRequestTimeout = setTimeout(function(){               
                app.log("Request Timeout: " +(timeout/1000)+ " seconds.");
   				response.error.error = "Timeout";
   				response.error.message= "Tiempo de espera agotado para la solicitud: "+(timeout/1000)+ " segundos.";               
                this.abort();
                this.timeouted = true;
                tpng.app.retries++;               	
                }.bind(xhr)
            , timeout); // aquí iría un parametro del tiempo necesario del request   	
     	}//fin de la función send
      }
    }
    return this._singleton;
  }
};

