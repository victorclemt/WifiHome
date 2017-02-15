// imdb.js
function imdb(_json, _options){
    this.super(_json, _options);
}

imdb.inherits(FormWidget);

imdb.prototype.getMovie =  function getMovie(_originalName,callback){
	var url = "http://www.omdbapi.com/?t="+this.encodeData(_originalName);
	var xhr =  new XMLHttpRequest();
    //xhr.sslVerify = false;
	    xhr.open("GET", url, true);
	    xhr.overrideMimeType("text");  
	    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;		
        if (xhr.status == 200) {
		       	 if (xhr.responseText) {
		       	 	this.detail = JSON.parse(xhr.responseText);
		       	    callback(xhr);
		       	 }
		}else if(xhr.status == 400){
			callback(xhr);
		}
        xhr = null;
    }.bind(this);
    xhr.send();
}

imdb.prototype.getImdbMovie = function getImdbMovie(){
	return this.detail;
}
imdb.prototype.encodeData= function encodeData(toEncode){
 if( toEncode == null || toEncode == "" ) return ""
 else {
    var result= encodeURIComponent(toEncode);
    // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
    return result.replace(/\!/g, "%21")
                 .replace(/\'/g, "%27")
                 .replace(/\(/g, "%28")
                 .replace(/\)/g, "%29")
                 .replace(/\*/g, "%2A")
                 .replace(/%2E/g, ".")
                 .replace(/%2D/g, "-")
                 .replace(/%5F/g, "_")
                 .replace(/%7E/g, "~");
 }
}