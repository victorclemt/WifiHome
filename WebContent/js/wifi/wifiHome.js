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


    this.confirm =  [{text1:"Siguiente"}];

    this.wizard = [];

    // variable to remember if the input has the focus  
    this._inputHasFocus = false; 

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

    widgets.inputTipoSeguridad.setData('WPA');
    widgets.inputTipoSeguridad.stateChange("right");

    widgets.inputContrasena.setData('the best Password ever');
    widgets.inputContrasena.stateChange("right");

    // widgets.BtnSiguienteSSID.setData(this.confirm);
    // widgets.BtnSiguienteSSID.stateChange("enter");

    widgets.BtnAnteriorSSID.setData({buttonTxt:"Anterior"});
    widgets.BtnAnteriorSSID.stateChange("enter");

    widgets.BtnSiguiente.setData({buttonTxt:"Siguiente"})
    widgets.BtnSiguiente.stateChange("enter");

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

    var canvas = this.widgets.wifiText;
    var steps = this.widgets.steps;
    var inputNombreRed = this.widgets.inputNombreRed;
    var inputTipoSeguridad = this.widgets.inputTipoSeguridad;
    var inputContrasena = this.widgets.inputContrasena;
    var BtnSiguienteSSID = this.widgets.BtnSiguienteSSID;

    if (this._inputHasFocus) {
        var keyHandled = inputNombreRed.keyHandler(_key);
        if (keyHandled || _key === 'KEY_BACKSPACE') return true;
    }

    switch (_key) {
        case "KEY_TV_YELLOW":
            this.widgets.BtnAnteriorSSID.setFocus(false);
            break;

        case "KEY_TV_YELLOW_LONG":
            this.widgets.BtnAnteriorSSID.setFocus(true);
            break;

        case "KEY_TV_GREEN":
            if (this.mallaOn){
                this.widgets.malla.stateChange("exit");
                this.mallaOn = false;
            } else {
                this.widgets.malla.stateChange("enter");
                this.mallaOn = true;
            }
            
            break;
        // para acomodar las cosas    
       case "KEY_LEFT":
            this.client.lock();
            var scrolled = steps.scrollPrev();
            if (scrolled) this.scrollListPos--;
            if (this.scrollListPos == 0) {
                inputNombreRed.stateChange("center");
                inputTipoSeguridad.stateChange("right");
            }
            if (this.scrollListPos == 1) {
                inputTipoSeguridad.stateChange("center");
                inputContrasena.stateChange("right");
            }
            this.client.unlock();
            return true;
        case "KEY_RIGHT":
            this.client.lock();
            var scrolled = steps.scrollNext();
            if (scrolled) this.scrollListPos++;
            if (this.scrollListPos == 1) {
                inputNombreRed.stateChange("left");
                inputTipoSeguridad.stateChange("center");
            }
            if (this.scrollListPos == 2) {
                inputTipoSeguridad.stateChange("left");
                inputContrasena.stateChange("center");
            }
            this.client.unlock();
            return true;

        //The return of Carlos !
        case 'KEY_UP':
        case 'KEY_DOWN':
            // if (this.scrollListPos == 0) {

            // } else if (this.scrollListPos == 1) {

            // } else if (this.scrollListPos == 2) {

            // }
            if (this._inputHasFocus) {
                // remove the focus
                inputNombreRed.setFocus(false);
                this._inputHasFocus = false;
                BtnSiguienteSSID.setFocus(true);
            } else {
                // give the focus
                inputNombreRed.setFocus(true);
                this._inputHasFocus = true;
                BtnSiguienteSSID.setFocus(false);
            }
        break;

        // case "KEY_UP":
        //     canvas.animation.move(0, -20, 300, 0, true).start();
        //     NGM.trace("y");
        //     NGM.trace(this.y+=20);
        //     return true;
        // case "KEY_DOWN":
        //     canvas.animation.move(0, 20, 300, 0, true).start();
        //     NGM.trace("y");
        //     NGM.trace(this.y-=20);
        //     return true;


        case "KEY_BACK":
        case "KEY_IRBACK":
        case "KEY_MENU":
            this.home.closeSection(this);
            break;        
    }

    return true;

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

wifiHome.drawBtnSiguienteSSID = function drawBtnSiguienteSSID(_data){

  this.draw = function draw(focus) {
    var ctx = this.getContext("2d");
    ctx.beginObject();
    ctx.clear();    

  
  var custo_text = focus ? JSON.stringify(this.themaData.standarBlackFont) : JSON.stringify(this.themaData.standardFont);
    custo_text = JSON.parse(custo_text);
    
    if(focus){
      var custoW = {"fill": "rgba(255, 255, 255, 1)"};
      Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);  

    } else {
      custoW = {"fill":"rgba(0, 0, 255,1)"};
      Canvas.drawShape(ctx, "rect", [0,0,ctx.viewportWidth,ctx.viewportHeight], custoW);  
    }
    
    Canvas.drawText(ctx, _data.text1, new Rect(10, 0, ctx.viewportWidth-100, 32), custo_text);
        
    ctx.drawObject(ctx.endObject());
  } 
  
}

wifiHome.test2 = function test2(_data, focus) {
    wifiHome.heyDrawAPrettyButton.bind(this)(_data, focus);
}

wifiHome.test = function test(_data, focus) {
    wifiHome.heyDrawAPrettyButton.bind(this)(_data, focus);
}

wifiHome.heyDrawAPrettyButton = function heyDrawAPrettyButton(_data, focus) {
    // this.draw = function draw(focus) {
        NGM.trace("The vaule of focus is " + focus);
        var ctx = this.getContext("2d");
        ctx.beginObject();
        ctx.clear();

        var w = ctx.viewportWidth;

        var custo_text = focus ? JSON.stringify(this.themaData.standarGrayFont) : JSON.stringify(this.themaData.standardFont);
        custo_text = JSON.parse(custo_text);
        var custo = this.themaData.panel;

        NGM.dump(custo);

        Canvas.drawShape(ctx, "rect", [8,8,w-16,32], custo);
        Canvas.drawText(ctx, _data.buttonTxt, new Rect(60, 10, w - 16, 32), custo_text);

        ctx.drawObject(ctx.endObject());
    // }
}