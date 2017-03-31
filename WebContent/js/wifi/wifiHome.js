/*  wifiHome.js
 *
 * @auth Victor Manuel Clemente López <victor.clemente@netgem.com>
 *
 * 
*/


FormWidget.registerTypeStandard("wifiHome");


function wifiHome(_json, _options)
{   
    this.super(_json, _options);
    this.mallaOn = false;

    this.firstTimer = true;
    this.wizardFirstTime =  [
                              {
                                texto1:"Sincroniza todos tus equipos Totalplay WiFi definiendo un nombre de red único para todos:", 
                                texto2:"NOMBRE DE RED (SSID)",
                                texto3:"Máximo 20 caracteres. No uses caracteres especiales. Podrás cambiarlo cuantas veces quieras.", 
                                textoSalir:"Presiona Menú/Atrás en tu control remoto para salir", 
                              },
                              {
                                texto1:"Por favor dinos qué clase de seguridad prefieres para la red de tu hogar:", 
                                texto2:"TIPO DE SEGURIDAD",
                                texto3:"Son dos tipos de seguridad que pueden ser utilizados por una red WiFi. Disponibles simultaneamente, en caso de que un dispositivo tenga incompatibilidad con WPA2 utiliza la versión WPA.", 
                                textoSalir:"Presiona Menú/Atrás en tu control remoto para salir", 
                              },
                              {
                                texto1:"Ahora define la contraseña única que utilizarás en todos tus equipos:", 
                                texto2:"CONTRASEÑA",
                                texto3:"Mínimo 10 caracteres. Recuerda incluir al menos una mayúscula y un número.", 
                                textoSalir:"Presiona Menú/Atrás en tu control remoto para salir", 
                              },
                              {
                    texto1:"SINCRONIZANDO EQUIPOS...", 
                    texto2:"Este proceso puede tardar hasta 2 minutos.",
                    texto3:"Presiona Menú/Atrás en tu control para salir"
                }
                            ];

    // this.syncScreenText = {
    //                 texto1:"SINCRONIZANDO EQUIPOS...", 
    //                 texto2:"Este proceso puede tardar hasta 2 minutos.",
    //                 texto3:"Presiona Menú/Atrás en tu control para salir"
    //             }


    // this.confirm =  [{text1:"Siguiente"}];

    this.wizard = [];

    // variable to remember the position of the scrolllist
    this.scrollListPos = 0;

    
}

wifiHome.screenName = "SSIDScreen";

wifiHome.inherits(FormWidget);


wifiHome.prototype.onEnter = function onEnter(_data)
{


    NGM.trace("Entro Wifi Home");
    this.home = _data.home;
  
    this.home.showHeader();

    if (this.firstTimer){

      this.home.setBg("img/wifi/BACK-General.jpg");
    

      this.widgets.steps.setData(this.wizardFirstTime); 
      this.widgets.steps.stateChange("enter");

      var widgets = this.widgets;

        widgets.inputNombreRed.setData('Un SSID cualquiera');
        setGlobalFocusOn.bind(this)(widgets.inputNombreRed);

        widgets.inputTipoSeguridad.setData('WPA');
        widgets.inputContrasena.setData('the best Password ever');

        widgets.btnSiguienteSSID.setData({buttonTxt:"Siguiente"});
        widgets.btnAnteriorTipoSeguridad.setData({buttonTxt:"Atrás"});
        widgets.btnSiguienteTipoSeguridad.setData({buttonTxt:"Siguiente"});
        widgets.btnAnteriorContrasena.setData({buttonTxt:"Atrás"});
        widgets.btnSincronizarContrasena.setData({buttonTxt:"Sincronizar"});

        this.widgetsInWifi = {
            SSIDScreen: [
                widgets.inputNombreRed,
                widgets.btnSiguienteSSID
            ],
            securityScreen: [
                widgets.inputTipoSeguridad,
                widgets.btnAnteriorTipoSeguridad,
                widgets.btnSiguienteTipoSeguridad
            ],
            passwordScreen: [
                widgets.inputContrasena,
                widgets.btnAnteriorContrasena,
                widgets.btnSincronizarContrasena
            ]
        };
    
    } else {

    this.home.setBg("img/wifi/BACK-RedWifi.jpg");

    }

    this.widgets.malla.setData();
}


/*
 * Log a message when exiting the app.
 */
wifiHome.prototype.onExit = function onExit()
{   
    this.home.hideBg();
    this.home.hideHeader();
    var widgets = this.widgets;

    if (this.firstTimer) {
        this.client.lock();
        wifiHome.screenName = "SSIDScreen";
        widgets.steps.stateChange("exit");
        widgets.steps.scrollTo(0);
        this.client.unlock();
    }

    NGM.trace("Exit WIFI CONFIGURATION");
}

wifiHome.prototype.onKeyPress = function onKeyPress(_key)
{
    NGM.trace("Mr., you received a key: " + _key);

    var widgets = this.widgets;

    switch (wifiHome.screenName) {
        case "SSIDScreen":
            this.onKeyPressSSID(_key);
            break;
        case "securityScreen":
            this.onKeyPressSecurity(_key);
            break;
        case "passwordScreen":
            this.onKeyPressPassword(_key);
            break;
        case "syncScreen":
            break;
    }

    switch(_key) {
        case "KEY_BACK":
        case "KEY_IRBACK":
        case "KEY_MENU":
            this.home.closeSection(this);
            break;

        case "KEY_TV_GREEN":
            if (this.mallaOn){
                widgets.malla.stateChange("exit");
                this.mallaOn = false;
            } else {
                widgets.malla.stateChange("enter");
                this.mallaOn = true;
            }
        break;
    }

    return true;
}

wifiHome.prototype.onKeyPressSSID = function onKeyPressSSID(_key) {
    var widgets = this.widgets;
    var inputBox = widgets.inputNombreRed;
    var btnSiguiente = widgets.btnSiguienteSSID;

    switch(_key) {
        case 'KEY_UP':
        case 'KEY_DOWN':
            if (this.objectWithFocus == inputBox) {
                setGlobalFocusOn.bind(this)(btnSiguiente);
            } else if (this.objectWithFocus == btnSiguiente){
                setGlobalFocusOn.bind(this)(inputBox);
            }
            break;
        case "KEY_IRENTER":
            if (this.objectWithFocus == btnSiguiente){
                this.client.lock();
                wifiHome.screenName = "securityScreen";
                widgets.steps.scrollNext();
                //move to the left the widgets in current screen
                this.widgetsInWifi.SSIDScreen.map(function(widget){
                    return widget.stateChange("left");
                });
                //move to the center the widgets in the next screen
                this.widgetsInWifi.securityScreen.map(function(widget){
                    return widget.stateChange("center");
                });
                //Giving focus to input
                setGlobalFocusOn.bind(this)(widgets.inputTipoSeguridad);
                this.client.unlock();
            } else if(this.objectWithFocus == inputBox) {
                this.home.openSection("keyboard",{
                        "home":this.home,
                        "type":"ks",
                        "text1":"Ingresa tu SSID: ",
                        "text2":"La búsqueda no puede estar vacía, inténtalo de nuevo",
                        "ok":"Aceptar",
                        "cancel":"Cancelar",
                        "parent" : this,
                        "valid":true}, false, ,true);
            }
        return true;
    }
}

wifiHome.prototype.onKeyPressSecurity = function onKeyPressSecurity(_key) {
    var widgets = this.widgets;
    var inputBox = widgets.inputTipoSeguridad;
    var btnSiguiente = widgets.btnSiguienteTipoSeguridad;
    var btnAnterior = widgets.btnAnteriorTipoSeguridad;

    switch(_key) {
        case 'KEY_UP':
        case 'KEY_DOWN':
            if(this.objectWithFocus == inputBox) {
                setGlobalFocusOn.bind(this)(btnSiguiente);
            } else if(this.objectWithFocus == btnSiguiente || this.objectWithFocus == btnAnterior) {
                setGlobalFocusOn.bind(this)(inputBox);
            }
            break;
        case 'KEY_LEFT':
        case 'KEY_RIGHT':
            if(this.objectWithFocus == btnSiguiente) {
                setGlobalFocusOn.bind(this)(btnAnterior);
            } else if(this.objectWithFocus == btnAnterior) {
                setGlobalFocusOn.bind(this)(btnSiguiente);
            }
            break;
        case 'KEY_IRENTER':
            if(this.objectWithFocus == btnSiguiente) {
                this.client.lock();
                wifiHome.screenName = "passwordScreen";
                widgets.steps.scrollNext();
                //move to the left the widgets in current screen
                this.widgetsInWifi.securityScreen.map(function(widget){
                    return widget.stateChange("left");
                });
                //move to the center the widgets in the next screen
                this.widgetsInWifi.passwordScreen.map(function(widget){
                    return widget.stateChange("center");
                });
                //Giving focus to input
                setGlobalFocusOn.bind(this)(widgets.inputContrasena);
                this.client.unlock();
            } else if (this.objectWithFocus == btnAnterior) {
                this.client.lock();
                wifiHome.screenName = "SSIDScreen";
                widgets.steps.scrollPrev();
                //move to the right the widgets in the current screen
                this.widgetsInWifi.securityScreen.map(function(widget){
                    return widget.stateChange("right");
                });
                //move to the center the widgets in the previous screen
                this.widgetsInWifi.SSIDScreen.map(function(widget){
                    return widget.stateChange("center");
                });
                //Giving focus to input
                setGlobalFocusOn.bind(this)(widgets.inputNombreRed);
                this.client.unlock();
            } else if(this.objectWithFocus == inputBox) {
                this.home.openSection("keyboard",{
                        "home":this.home,
                        "type":"ks",
                        "text1":"Ingresa tu tipo de seguridad: ",
                        "text2":"La búsqueda no puede estar vacía, inténtalo de nuevo",
                        "ok":"Aceptar",
                        "cancel":"Cancelar",
                        "parent" : this,
                        "valid":true}, false, ,true);
            }
    }
    return true;
}

wifiHome.prototype.onKeyPressPassword = function onKeyPressPassword(_key) {
    var widgets = this.widgets;
    var inputBox = widgets.inputContrasena;
    var btnAnterior = widgets.btnAnteriorContrasena;
    var btnSincronizar = widgets.btnSincronizarContrasena;

    switch(_key) {
        case 'KEY_UP':
        case 'KEY_DOWN':
            if(this.objectWithFocus == inputBox) {
                setGlobalFocusOn.bind(this)(btnSincronizar);
            } else if(this.objectWithFocus == btnAnterior || this.objectWithFocus == btnSincronizar) {
                setGlobalFocusOn.bind(this)(inputBox);
            }
            break;

        case 'KEY_LEFT':
        case 'KEY_RIGHT':
            if(this.objectWithFocus == btnSincronizar) {
                setGlobalFocusOn.bind(this)(btnAnterior);
            } else if(this.objectWithFocus == btnAnterior) {
                setGlobalFocusOn.bind(this)(btnSincronizar);
            }
            break;

        case "KEY_IRENTER":
            if (this.objectWithFocus == btnAnterior){
                this.client.lock();
                wifiHome.screenName = "securityScreen";
                widgets.steps.scrollPrev();
                //move to the right the widgets in current screen
                this.widgetsInWifi.passwordScreen.map(function(widget){
                    return widget.stateChange("right");
                });
                //move to the center the widgets in the previous screen
                this.widgetsInWifi.securityScreen.map(function(widget){
                    return widget.stateChange("center");
                });
                //Giving focus to input
                setGlobalFocusOn.bind(this)(widgets.inputTipoSeguridad);
                this.client.unlock();
            } else if(this.objectWithFocus == btnSincronizar) {
                this.client.lock();
                wifiHome.screenName = "syncScreen";
                // widgets.steps.appendData(this.syncScreenText);
                widgets.steps.updateData(this.wizardFirstTime, 2);

                widgets.steps.scrollNext();
                //move to the left the widgets in current screen
                this.widgetsInWifi.passwordScreen.map(function(widget){
                    return widget.stateChange("left");
                });
                //move to the center the widgets in the next screen
                this.client.unlock();
                
                
                // we start the http request to inform the ASC
                url = "http://httpbin.org/ip"; // regresa la ip
                //url = "http://httpbin.org/user-agent"; // regresar el agente que usa el user
                
                NGM.trace("HTTPREQUEST");
                tp_httpRequest.getSingleton().send(url, this.responseTR069.bind(this));



            } else if(this.objectWithFocus == inputBox) {
                this.home.openSection("keyboard",{
                        "home":this.home,
                        "type":"ks",
                        "text1":"Ingresa tu contraseña: ",
                        "text2":"La búsqueda no puede estar vacía, inténtalo de nuevo",
                        "ok":"Aceptar",
                        "cancel":"Cancelar",
                        "parent" : this,
                        "valid":true}, false, ,true);
            }
            break;
        // case "KEY_TV_YELLOW":
        //     inputBox.param.hidden = false;
        //     break;
        return true;
    }
}


wifiHome.prototype.responseTR069 = function responseTR069(_response){
    
    NGM.trace("Si se recibe una respuesta and we dump it ");
    NGM.dump(_response,3);
    if(_response.status == 200){
        
    }else{
        
    }
}

var setGlobalFocusOn = function setGlobalFocusOn(objectToFocus) {   
    if (this.objectWithFocus !== undefined) this.objectWithFocus.setFocus(false);
    this.objectWithFocus = objectToFocus;
    this.objectWithFocus.setFocus(true);
}

// Dibuja la malla al presionar enter para ver las dimensiones para el desarrollo.
wifiHome.drawMalla = function drawMalla(_data)
{
    var ctx = this.getContext("2d");
    ctx.beginObject();
    ctx.clear();

    tp_draw.getSingleton().drawImage("img/wifi/DevsOnion.png", ctx, 0, 0);

    ctx.drawObject(ctx.endObject());
}


wifiHome.drawMainSteps = function drawMainSteps(_data) {


  // this.draw = function draw(focus) {
    var ctx = this.getContext("2d");
    ctx.beginObject();
    ctx.clear();

    if(wifiHome.screenName !== "syncScreen") {
        tp_draw.getSingleton().drawImage("img/wifi/TITULO-Wizard.png", ctx, 264, 230);

        if(wifiHome.screenName === "passwordScreen") {
            tp_draw.getSingleton().drawImage("img/wifi/ICONO-VerOFF.png", ctx, 963, 326);
        }
        

        var custo_f = JSON.stringify(this.themaData.standardFont);
            custo_f = JSON.parse(custo_f);
        

        Canvas.drawText(ctx, _data.texto1 , new Rect(643,218,450,700 ),custo_f);

        custo_f.fill = "rgba(170,170,180,1)";

        Canvas.drawText(ctx, _data.texto2, new Rect(643,300,450,700),custo_f);
       
        Canvas.drawText(ctx, _data.texto3, new Rect(643,420,500,700),custo_f);

        Canvas.drawText(ctx, _data.textoSalir, new Rect(451,652,600,300),custo_f);
    } else if (wifiHome.screenName === "syncScreen") {
        tp_draw.getSingleton().drawImage("img/wifi/ICONO-SincronizarNJA.png", ctx, 578, 290, 100, 55);

        var custo_f = JSON.stringify(this.themaData.standardFont);
            custo_f = JSON.parse(custo_f);

        Canvas.drawText(ctx, _data.texto1, new Rect(509,394,450,700), custo_f);
        Canvas.drawText(ctx, _data.texto2, new Rect(464,440,450,700), custo_f);
        custo_f.fill = "rgba(170,170,180,1)";
        Canvas.drawText(ctx, _data.texto3, new Rect(451,652,600,300), custo_f);
    }

    ctx.drawObject(ctx.endObject());
  // };

};

wifiHome.drawBtnSiguienteSSID = function drawBtnSiguienteSSID(_data, focus) {
    wifiHome.heyDrawAPrettyButton.bind(this)(_data, focus);
}

wifiHome.drawBtnAnteriorTipoSeguridad = function drawBtnAnteriorTipoSeguridad(_data, focus) {
    wifiHome.heyDrawAPrettyButton.bind(this)(_data, focus);
}

wifiHome.drawBtnSiguienteTipoSeguridad = function drawBtnSiguienteTipoSeguridad(_data, focus) {
    wifiHome.heyDrawAPrettyButton.bind(this)(_data, focus);
}

wifiHome.drawBtnAnteriorContrasena = function drawBtnAnteriorContrasena(_data, focus) {
    wifiHome.heyDrawAPrettyButton.bind(this)(_data, focus);
}

wifiHome.drawBtnSincronizarContrasena = function drawBtnSincronizarContrasena(_data, focus) {
    wifiHome.heyDrawAPrettyButton.bind(this)(_data, focus);
}

wifiHome.heyDrawAPrettyButton = function heyDrawAPrettyButton(_data, focus) {
        var ctx = this.getContext("2d");
        ctx.beginObject();
        ctx.clear();

        var w = ctx.viewportWidth;

        var custo_text = focus ? JSON.stringify(this.themaData.standardFont) : JSON.stringify(this.themaData.standarGrayFont);
        custo_text = JSON.parse(custo_text);
        var custo = this.themaData.panel;

        Canvas.drawShape(ctx, "rect", [8,8,w-16,32], custo);
        Canvas.drawText(ctx, _data.buttonTxt, new Rect(60, 10, w - 16, 32), custo_text);

        ctx.drawObject(ctx.endObject());
}
