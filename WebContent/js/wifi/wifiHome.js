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
                              }
                            ];


    // this.confirm =  [{text1:"Siguiente"}];

    this.wizard = [];

    // variable to remember the position of the scrolllist
    this.scrollListPos = 0;
}


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
    
    } else {

    this.home.setBg("img/wifi/BACK-RedWifi.jpg");

    }

    var widgets = this.widgets;

    widgets.inputNombreRed.setData('Un SSID cualquiera');
    setGlobalFocusOn.bind(this)(widgets.inputNombreRed);

    widgets.inputTipoSeguridad.setData('WPA');

    widgets.inputContrasena.setData('the best Password ever');

    widgets.btnSiguienteSSID.setData({buttonTxt:"Siguiente"});

    widgets.btnAnteriorTipoSeguridad.setData({buttonTxt:"Anterior"});

    widgets.btnSiguienteTipoSeguridad.setData({buttonTxt:"Siguiente"});

    widgets.btnAnteriorContrasena.setData({buttonTxt:"Anterior"});

    this.widgets.malla.setData();
}


/*
 * Log a message when exiting the app.
 */
wifiHome.prototype.onExit = function onExit()
{   
    this.home.hideBg();
    this.home.hideHeader();


    NGM.trace("Exit WIFI CONFIGURATION");
}

wifiHome.prototype.onKeyPress = function onKeyPress(_key)
{
    NGM.trace("Mr., you received a key: " + _key);

    var widgets = this.widgets;

    var canvas = widgets.wifiText;
    var steps = widgets.steps;

    var inputBoxes = [widgets.inputNombreRed, widgets.inputTipoSeguridad, widgets.inputContrasena];
    var buttons = [[widgets.btnSiguienteSSID], [widgets.btnAnteriorTipoSeguridad, 
                widgets.btnSiguienteTipoSeguridad], [widgets.btnAnteriorContrasena]];

    if (this.inputHasFocus) {
        if (this.scrollListPos == 0) {
            // var keyHandled = inputNombreRed.keyHandler(_key);
            if (inputBoxes[0].keyHandler(_key) || _key === 'KEY_BACKSPACE') return true;
        }
        else if (this.scrollListPos == 1) {
            // var keyHandled = inputTipoSeguridad.keyHandler(_key);
            if (inputBoxes[1].keyHandler(_key) || _key === 'KEY_BACKSPACE') return true;
        }
        else if (this.scrollListPos == 2) {
            // var keyHandled = inputContrasena.keyHandler(_key);
            if (inputBoxes[2].keyHandler(_key) || _key === 'KEY_BACKSPACE') return true;
        }
    }

    switch (_key) {
        case "KEY_TV_GREEN":
            if (this.mallaOn){
                widgets.malla.stateChange("exit");
                this.mallaOn = false;
            } else {
                widgets.malla.stateChange("enter");
                this.mallaOn = true;
            }
            
            return true;
          
       case "KEY_LEFT":
       case "KEY_RIGHT":
            changeFocuses.bind(this)(this.scrollListPos, inputBoxes, buttons, false);
            return true;

        // Para demostrar que se puede hacer un desmadre 
        case "KEY_IRENTER":
            this.client.lock();
            var previousScrollListPos = this.scrollListPos; 
            if (this.scrollListPos == 0 && this.objectWithFocus.name.indexOf("Siguiente") !== -1) {
                var scrolled = steps.scrollNext();
                if (scrolled) ++this.scrollListPos;
            } else if (this.scrollListPos == 1) {
                if (this.objectWithFocus.name.indexOf("Anterior") !== -1) {
                    var scrolled = steps.scrollPrev();
                    if (scrolled) --this.scrollListPos;
                } else if (this.objectWithFocus.name.indexOf("Siguiente") !== -1) {
                    var scrolled = steps.scrollNext();
                    if (scrolled) ++this.scrollListPos;
                }
            } else if (this.scrollListPos == 2 && this.objectWithFocus.name.indexOf("Anterior") !== -1) {
                var scrolled = steps.scrollPrev();
                if (scrolled) --this.scrollListPos;
            }
            moveButtonsAndInputs(previousScrollListPos, this.scrollListPos, inputBoxes, buttons);
            changeFocuses.bind(this)(previousScrollListPos, inputBoxes, buttons);
            this.client.unlock();
            return true;

        //The return of Carlos !
        case 'KEY_UP':
        case 'KEY_DOWN':
            changeFocuses.bind(this)(this.scrollListPos, inputBoxes, buttons, true);
        return true;

        case "KEY_BACK":
        case "KEY_IRBACK":
        case "KEY_MENU":
            this.home.closeSection(this);
            return true;        
    }

    return true;
}

var moveButtonsAndInputs = function moveButtonsAndInputs(previousScrollListPos, scrollListPos, inputBoxes, buttons) {  
    inputBoxes[scrollListPos].stateChange("center");
    for (var i = 0, len = buttons[scrollListPos].length; i < len; i++) {
        buttons[scrollListPos][i].stateChange("center");
    }

    if (scrollListPos > previousScrollListPos) {
        inputBoxes[previousScrollListPos].stateChange("left");
        for (var i = 0, len = buttons[previousScrollListPos].length; i < len; i++) {
            buttons[previousScrollListPos][i].stateChange("left");
        }
    } else {
        inputBoxes[previousScrollListPos].stateChange("right");
        for (var i = 0, len = buttons[previousScrollListPos].length; i < len; i++) {
            buttons[previousScrollListPos][i].stateChange("right");
        }
    }
}

var changeFocuses = function changeFocuses(previousScrollListPos, inputBoxes, buttons, upOrDown) {
    if (this.scrollListPos != previousScrollListPos) {
        setGlobalFocusOn.bind(this)(inputBoxes[this.scrollListPos]);
    } else {
        if (this.objectWithFocus.name.indexOf("input") !== -1 && upOrDown) {
            setGlobalFocusOn.bind(this)(buttons[this.scrollListPos][buttons[this.scrollListPos].length - 1]);
        } else if (this.objectWithFocus.name.indexOf("input") === -1 && upOrDown) {
            setGlobalFocusOn.bind(this)(inputBoxes[this.scrollListPos]);
        } else if (this.objectWithFocus.name.indexOf("input") === -1 && !upOrDown && this.scrollListPos == 1) {
            if (this.objectWithFocus.name.indexOf("Siguiente") !== -1) {
                setGlobalFocusOn.bind(this)(buttons[this.scrollListPos][0]);
            } else {
                setGlobalFocusOn.bind(this)(buttons[this.scrollListPos][1]);
            }
        }
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
    
    tp_draw.getSingleton().drawImage("img/wifi/TITULO-Wizard.png", ctx, 264, 230);

    var custo_f = JSON.stringify(this.themaData.standardFont);
        custo_f = JSON.parse(custo_f);
    

    Canvas.drawText(ctx, _data.texto1 , new Rect(643,218,450,700 ),custo_f);

    custo_f.fill = "rgba(170,170,180,1)";

    Canvas.drawText(ctx, _data.texto2, new Rect(643,300,450,700),custo_f);
   
    Canvas.drawText(ctx, _data.texto3, new Rect(643,420,500,700),custo_f);

    Canvas.drawText(ctx, _data.textoSalir, new Rect(451,652,600,300),custo_f);


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