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

    // variable to remember if the input has the focus  
    this.inputHasFocus = true;

    // variable to remember if the buttons have focus
    this.btnSiguienteHasFocus = false;
    this.btnAnteriorHasFocus = false;

    // variable to remember the position of the scrolllist
    this.scrollListPos = 0;
}


wifiHome.inherits(FormWidget);


wifiHome.prototype.onEnter = function onEnter(_data)
{


    NGM.trace("Entro Wifi Home");
    this.home = _data.home;
  
    this.home.showHeader();

    this.client.lock();
    if (this.firstTimer){

      this.home.setBg("img/wifi/BACK-General.jpg");
    

      this.widgets.steps.setData(this.wizardFirstTime); 
      this.widgets.steps.stateChange("enter"); 
    
    } else {

    this.home.setBg("img/wifi/BACK-RedWifi.jpg");

    }

    var widgets = this.widgets;

    widgets.inputNombreRed.setData('Un SSID cualquiera');
    widgets.inputNombreRed.stateChange("center");
    widgets.inputNombreRed.setFocus(true);

    widgets.inputTipoSeguridad.setData('WPA');
    widgets.inputTipoSeguridad.stateChange("right");

    widgets.inputContrasena.setData('the best Password ever');
    widgets.inputContrasena.stateChange("right");

    widgets.btnSiguienteSSID.setData({buttonTxt:"Siguiente"});
    widgets.btnSiguienteSSID.stateChange("center");

    widgets.btnAnteriorTipoSeguridad.setData({buttonTxt:"Anterior"});
    widgets.btnAnteriorTipoSeguridad.stateChange("enter");

    widgets.btnSiguienteTipoSeguridad.setData({buttonTxt:"Siguiente"});
    widgets.btnSiguienteTipoSeguridad.stateChange("enter");

    widgets.btnAnteriorContrasena.setData({buttonTxt:"Anterior"});
    widgets.btnAnteriorContrasena.stateChange("enter");

    this.widgets.malla.setData();
    this.widgets.malla.stateChange("exit");
    this.client.unlock();

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
    var inputNombreRed = widgets.inputNombreRed;
    var inputTipoSeguridad = widgets.inputTipoSeguridad;
    var inputContrasena = widgets.inputContrasena;
    var btnSiguienteSSID = widgets.btnSiguienteSSID;
    var btnAnteriorTipoSeguridad = widgets.btnAnteriorTipoSeguridad;
    var btnSiguienteTipoSeguridad = widgets.btnSiguienteTipoSeguridad;
    var btnAnteriorContrasena = widgets.btnAnteriorContrasena;

    var inputBoxes = [widgets.inputNombreRed, widgets.inputTipoSeguridad, widgets.inputContrasena];
    var buttons = [[widgets.btnSiguienteSSID], [widgets.btnAnteriorTipoSeguridad, 
                widgets.btnSiguienteTipoSeguridad], [widgets.btnAnteriorContrasena]];

    if (this.inputHasFocus) {
        if (this.scrollListPos == 0) {
            // var keyHandled = inputNombreRed.keyHandler(_key);
            if (inputNombreRed.keyHandler(_key) || _key === 'KEY_BACKSPACE') return true;
        }
        else if (this.scrollListPos == 1) {
            // var keyHandled = inputTipoSeguridad.keyHandler(_key);
            if (inputTipoSeguridad.keyHandler(_key) || _key === 'KEY_BACKSPACE') return true;
        }
        else if (this.scrollListPos == 2) {
            // var keyHandled = inputContrasena.keyHandler(_key);
            if (inputContrasena.keyHandler(_key) || _key === 'KEY_BACKSPACE') return true;
        }
    }

    switch (_key) {
        // case "KEY_TV_YELLOW":
        //     widgets.btnAnteriorSSID.setFocus(false);
        //     break;

        // case "KEY_TV_YELLOW_LONG":
        //     this.widgets.btnAnteriorSSID.setFocus(true);
        //     break;

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
            if (this.scrollListPos == 1) {
                if (this.btnSiguienteHasFocus) {
                    btnSiguienteTipoSeguridad.setFocus(false);
                    this.btnSiguienteHasFocus = false;
                    btnAnteriorTipoSeguridad.setFocus(true);
                    this.btnAnteriorHasFocus = true
                } else if (this.btnAnteriorHasFocus) {
                    btnSiguienteTipoSeguridad.setFocus(true);
                    this.btnSiguienteHasFocus = true;
                    btnAnteriorTipoSeguridad.setFocus(false);
                    this.btnAnteriorHasFocus = false
                }
            }
            return true;

        // Para demostrar que se puede hacer un desmadre 
        case "KEY_IRENTER":
            this.client.lock();
            var previousScrollListPos;
            if (this.scrollListPos == 0 && this.btnSiguienteHasFocus) {
                var scrolled = steps.scrollNext();
                if (scrolled) {
                    previousScrollListPos = this.scrollListPos;
                    ++this.scrollListPos;
                    moveButtonsAndInputs(previousScrollListPos, this.scrollListPos, inputBoxes, buttons);
                    changeFocuses.bind(this)(previousScrollListPos, inputBoxes, buttons);
                }
            } else if (this.scrollListPos == 1) {
                if (this.btnAnteriorHasFocus) {
                    var scrolled = steps.scrollPrev();
                    if (scrolled) {
                        previousScrollListPos = this.scrollListPos;
                        --this.scrollListPos;
                        moveButtonsAndInputs(previousScrollListPos, this.scrollListPos, inputBoxes, buttons);
                        changeFocuses.bind(this)(previousScrollListPos, inputBoxes, buttons);
                    }
                } else if (this.btnSiguienteHasFocus) {
                    var scrolled = steps.scrollNext();
                    if (scrolled) {
                        previousScrollListPos = this.scrollListPos;
                        ++this.scrollListPos;
                        moveButtonsAndInputs(previousScrollListPos, this.scrollListPos, inputBoxes, buttons);
                        changeFocuses.bind(this)(previousScrollListPos, inputBoxes, buttons);
                    }
                }
            } else if (this.scrollListPos == 2 && this.btnAnteriorHasFocus) {
                var scrolled = steps.scrollPrev();
                if (scrolled) {
                    previousScrollListPos = this.scrollListPos;
                    --this.scrollListPos;
                    moveButtonsAndInputs(previousScrollListPos, this.scrollListPos, inputBoxes, buttons);
                    changeFocuses.bind(this)(previousScrollListPos, inputBoxes, buttons);
                }
            }
            this.client.unlock();
            return true;

        //The return of Carlos !
        case 'KEY_UP':
        case 'KEY_DOWN':
            if (this.scrollListPos == 0) {
                if (this.inputHasFocus) {
                    // remove the focus
                    inputNombreRed.setFocus(false);
                    this.inputHasFocus = false;
                    btnSiguienteSSID.setFocus(true);
                    this.btnSiguienteHasFocus = true;
                } else {
                    // give the focus
                    inputNombreRed.setFocus(true);
                    this.inputHasFocus = true;
                    btnSiguienteSSID.setFocus(false);
                    this.btnSiguienteHasFocus = false;
                }

            } else if (this.scrollListPos == 1) {
                if (this.inputHasFocus) {
                    // remove the focus
                    inputTipoSeguridad.setFocus(false);
                    this.inputHasFocus = false;
                    btnSiguienteTipoSeguridad.setFocus(true);
                    this.btnSiguienteHasFocus = true;
                } else if(this.btnSiguienteHasFocus || this.btnAnteriorHasFocus) {
                    // give the focus
                    inputTipoSeguridad.setFocus(true);
                    this.inputHasFocus = true;
                    btnAnteriorTipoSeguridad.setFocus(false);
                    btnSiguienteTipoSeguridad.setFocus(false);
                    this.btnSiguienteHasFocus = false;
                    this.btnAnteriorHasFocus = false;
                }

            } else if (this.scrollListPos == 2) {
                if (this.inputHasFocus) {
                    // remove the focus
                    inputContrasena.setFocus(false);
                    this.inputHasFocus = false;
                    btnAnteriorContrasena.setFocus(true);
                    this.btnAnteriorHasFocus = true;
                } else {
                    // give the focus
                    inputContrasena.setFocus(true);
                    this.inputHasFocus = true;
                    btnAnteriorContrasena.setFocus(false);
                    this.btnAnteriorHasFocus = false;
                }
            }
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
            buttons[previousScrollListPos][i].setFocus(false);
        }
    } else {
        inputBoxes[previousScrollListPos].stateChange("right");
        for (var i = 0, len = buttons[previousScrollListPos].length; i < len; i++) {
            buttons[previousScrollListPos][i].stateChange("right");
            buttons[previousScrollListPos][i].setFocus(false);
        }
    }
}

var changeFocuses = function changeFocuses(previousScrollListPos, inputBoxes, buttons, upOrDown) {
    if (this.scrollListPos != previousScrollListPos) {
        inputBoxes[this.scrollListPos].setFocus(true);
        this.inputHasFocus = true;
        this.btnSiguienteHasFocus = false;
        this.btnAnteriorHasFocus = false;
        for (var i = 0, len = buttons[previousScrollListPos].length; i < len; i++) {
            buttons[previousScrollListPos][i].setFocus(false);
        }
    } else {
        if (this.inputHasFocus && upOrDown) {
            inputBoxes[this.scrollListPos].setFocus(false);
            this.inputHasFocus = false;
            buttons[this.scrollListPos][buttons[this.scrollListPos].length - 1].setFocus(true);
            this.btnSiguienteHasFocus = true;
        } else if (!this.inputHasFocus && upOrDown) {
            inputBoxes[this.scrollListPos].setFocus(true);
            this.inputHasFocus = true;
            for (var i = 0, len = buttons[this.scrollListPos].length; i < len; i++) {
                buttons[this.scrollListPos][i].setFocus(false);
            }
            this.btnSiguienteHasFocus = false;
            this.btnAnteriorHasFocus = false;
        } else if (!this.inputHasFocus && !upOrDown && this.scrollListPos == 1) {
            if (this.btnSiguienteHasFocus) {
                buttons[this.scrollListPos][0].setFocus(true);
                buttons[this.scrollListPos][1].setFocus(false);
            } else {
                buttons[this.scrollListPos][0].setFocus(false);
                buttons[this.scrollListPos][1].setFocus(true);
            }
        }
    }
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