function gettext(str) {
	
var app_texts = {};
	

app_texts["code"]="Texto";

//new errors
app_texts["ERROR_MESSAGE"]="ESTA PANTALLA NO CARG� CORRECTAMENTE.";
app_texts["ERROR_MESSAGE_0"]="TIEMPO DE ESPERA AGOTADO.";
app_texts["ERROR_SUGGEST"]="Presiona OK para intentarlo de nuevo.";
app_texts["ERROR_HTTP_407_SUGGEST"]="Por favor, reinicie el equipo.";
app_texts["ERROR_HTTP_MESSAGE"]="SERVICIO NO DISPONIBLE.";


//Errores
app_texts["ERROR_HTTP_TITLE"]="Servicio no disponible";
app_texts["ERROR_HTTP_503_MESSAGE"]="Ocurri� error inesperado en el servidor.";
app_texts["ERROR_HTTP_SUGGEST"]="Por favor, int�ntalo m�s tarde.";
app_texts["ERROR_HTTP_407_SUGGEST"]="Por favor, reinicie el equipo.";
app_texts["ERROR_HTTP_JSON"]="Error de Sintaxis JSON.";
app_texts["ERROR_TITLE"]="Ocurri� un error...";
app_texts["ERROR_PUSH"]="Presiona OK para regresar a la tv.";
app_texts["CHANNEL"]="Canal";
app_texts["DASH"]="-";
app_texts["HEADER_RECOMMENDATIONS"]="Podr�an interesarte (en vivo):";

//Errores control parental
app_texts["BLOCKED_PROGRAM"]="Programa Bloqueado";
app_texts["BLOCKED_PROGRAM_ERROR"]  ="Lo sentimos pero este programa est� bloqueado.";
app_texts["BLOCKED_PROGRAM_SUGGEST"]="Presiona OK para ingresar el NIP de seguridad";
app_texts["BLOCKED_PROGRAM_SN_CAUSE"]  ="El modo noche segura se activa autom�ticamente para los programas con clasificaci�n D a partir de las ";
app_texts["BLOCKED_PROGRAM_SN_CAUSE_2"] ="y finaliza a las ";
app_texts["BLOCKED_PROGRAM_RT_CAUSE"]  ="Tu clasificaci�n es demasiada baja para ver este programa.";

//NPVR

app_texts["NPVR_CHANNEL_MESSAGE"]="*Este canal no permite que grabes su contenido.";

return app_texts[str];	
	
};
