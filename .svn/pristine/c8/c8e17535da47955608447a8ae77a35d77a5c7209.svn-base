// twitter.js
function twitter(_json, _options){
    this.super(_json, _options);
}

twitter.inherits(FormWidget);

twitter.prototype.getUser_linked = function getUser_linked(_token_linked,_token_secret_linked,callback){

	var url = "https://api.twitter.com/1.1/account/verify_credentials.json";
	var oauth_nonce = this.getNonce();
	var oauth_timestamp = parseInt(new Date().getTime()/1000, 10);
	var params = "oauth_consumer_key=" + tpng.app_Tokens.consumer_key + "&oauth_nonce=" + oauth_nonce + "&oauth_signature_method=HMAC-SHA1&oauth_timestamp=" + oauth_timestamp +"&oauth_token="+this.encodeData(_token_linked)+"&oauth_version=1.0";
	
	var oauth_signature = this.get_oauth_signature("GET",url,params,_token_secret_linked);
	
	var header = 'OAuth oauth_consumer_key='+tpng.app_Tokens.consumer_key+',oauth_signature_method="HMAC-SHA1",oauth_timestamp='+oauth_timestamp+',oauth_nonce='+oauth_nonce+',oauth_version="1.0",oauth_signature='+this.encodeData(oauth_signature)+',oauth_token='+this.encodeData(_token_linked);
	
	var xhr = new XMLHttpRequest();      
    	xhr.open("GET", url, true);    
   		xhr.setRequestHeader('Authorization',header);
    	xhr.overrideMimeType("text");    
     	xhr.onreadystatechange = function () {
     	if (xhr.readyState != 4) return;

        	if (xhr.status == 200) {
		       	 if (xhr.responseText) {
		       	 	this.profileUser = JSON.parse(xhr.responseText);
		       	 	callback(xhr,this.profileUser);
		       	 }
		}else if(xhr.status == 400){
			callback(xhr);
		}
        xhr = null;
    }.bind(this);
    xhr.send();
}

twitter.prototype.getNotifications_Hashtag = function getNotifications_Hashtag(name,callback){

	var url = "https://api.twitter.com/1.1/search/tweets.json";
	var oauth_nonce = this.getNonce();
	var oauth_timestamp = parseInt(new Date().getTime()/1000, 10);
	var params = "count=10&oauth_consumer_key=" + tpng.app_Tokens.consumer_key + "&oauth_nonce=" + oauth_nonce + "&oauth_signature_method=HMAC-SHA1&oauth_timestamp=" + oauth_timestamp +"&oauth_token="+this.encodeData(tpng.user_Tokens.access_token)+"&oauth_version=1.0&q="+this.encodeData(name)+"&result_type=recent";

	var oauth_signature = this.get_oauth_signature("GET",url,params,tpng.user_Tokens.access_token_secret);
	
	var header = 'OAuth oauth_consumer_key='+tpng.app_Tokens.consumer_key+',oauth_signature_method="HMAC-SHA1",oauth_timestamp='+oauth_timestamp+',oauth_nonce='+oauth_nonce+',oauth_version="1.0",oauth_signature='+this.encodeData(oauth_signature)+',oauth_token='+this.encodeData(tpng.user_Tokens.access_token);

	var xhr = new XMLHttpRequest();      
    	xhr.open("GET", url+"?q="+this.encodeData(name)+"&result_type=recent&count=10", true);    
   		xhr.setRequestHeader('Authorization',header);
    	xhr.overrideMimeType("text");    
     	xhr.onreadystatechange = function () {
        	if (xhr.readyState != 4) return;
        	if (xhr.status == 200) {
		       	 if (xhr.responseText) {
		       	 	this.tweet_Not = JSON.parse(xhr.responseText);
		       	 	callback(xhr);
		       	 }
		}else if(xhr.status == 400){
			callback(xhr);
		}
        xhr = null;
    }.bind(this);
    xhr.send();
}
twitter.prototype.getTweet = function getTweet(){
	return this.tweet_Not;
}
twitter.prototype.getProfileUser_linked = function getProfileUser_linked(){
	return this.profileUser;
}

twitter.prototype.get_oauth_signature = function get_oauth_signature(_method,_url, _params,_access_token_secret){
	//HOW-TO https://dev.twitter.com/docs/auth/creating-signature"
	/**********1 . Collecting the request method and URL**********/
	var signature_base_string = _method + "&" + this.encodeData(_url) + "&" + this.encodeData(_params);
	/**********2 . Getting a signing key*********/
	var signing_key = tpng.app_Tokens.consumer_token_secret + "&"+_access_token_secret;
	/**********3 . Calculating the signature**********/		
	
	var hash = CryptoJS.HmacSHA1(signature_base_string,signing_key);
  	var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
	 
	return hashInBase64;
}
twitter.prototype.encodeData= function encodeData(toEncode){
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

twitter.prototype.getNonce = function getNonce(){
	//HOW TO https://dev.twitter.com/discussions/12445
	var str = "abcdefghijklmnopqrstvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var min = 0;
	var max = str.length-1;
	var nonce = "";
	var index = 0;
	
	for(var i = 0; i < 32; i++){		
		index = Math.floor(Math.random() * (max - min + 1)) + min;
		nonce = nonce + str.charAt(index);
	}
	return nonce;
}
