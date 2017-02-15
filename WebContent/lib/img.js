/******************************************************************************
- Description:
Image management. Draws images asynchronously according to the
parameters sent.

- Invoke:
1. tp_draw.getSingleton().drawImage(url, remote, ctx, x, y);
2. tp_draw.getSingleton().drawImage(url, remote, ctx, x, y, w, h);

- Params
url: image URL (STRING)
remote: true if the resource is remote, false if it is local. (BOOLEAN)
ctx : context. (OBJECT)
******************************************************************************/

var tp_draw = {
    _singleton  : null,
    _loader: new ImageLoader(),
    _cacheConfig: {
        "expireIn": settings.get("totalplay.cache.image.expireIn")-0 ? settings.get("totalplay.cache.image.expireIn") : 12*60*60
    },
    getSingleton: function() {
        if (!this._singleton) {
            tp_draw._loader.persistent = true;
            tp_draw._loader.expiration = tp_draw._cacheConfig.expireIn;
            this._singleton = {
                drawImage: function() {
                    var url = arguments[0];
                    if (!url) {
                        return;
                    }

                   //Ya no utilizaremos el arguments[1], para local o remota.
                    url = url + "";
                    // Create an option object for drawing
                    var o = {"ctx":arguments[1], "x":arguments[2], "y":arguments[3], "w":arguments[4], "h":arguments[5], "drawingFunction": arguments[6], "composition":arguments[7],  "scaleType":arguments[8]};

                    var img = tp_draw._loader.load(url, url, {"callback": this.imgLoadCb.bind(this), "expiration": tp_draw._cacheConfig.expireIn }, o);
                    if (img) {
                        this.imgLoadCb(url, img, o);
                    }
                },

                imgLoadCb : function(url, img, arg) {
                	
                    // Error cases
                    if (!url) { 
                         return;
                    }    
                    
                    if (!img || !img.width) {
                         return;
                    }    
                    
                    var ctx = arg.ctx;
                   
                    if (!ctx || !ctx.viewportWidth) {
                        return;
                    }

                    // Picture display params
                    var w_display =  arg.w ? arg.w : img.width;
                    var h_display =  arg.h ? arg.h : img.height;
	 
	                ctx.save();                   
                    ctx.globalCompositeOperation = (arg.composition) ? arg.composition : "source-over";
                    if (arg.scaleType != "aspectFit") {
                        ctx.drawImage(img, arg.x, arg.y, w_display, h_display);
                    } else {
                        var bX = arg.x,
                        bY = arg.y,
                        bW = w_display,
                        bH = h_display;
                        var scaleFactor = Math.min(img.width / w_display, img.height / h_display),
                        x = (bX - arg.x) * scaleFactor,
                        y = (bY - arg.y) * scaleFactor,
                        w = bW * scaleFactor,
                        h = bH * scaleFactor;
                        ctx.drawImage(img, x>>0, y>>0, w>>0, h>>0, bX, bY, bW, bH);
                    }
                    
                    if (arg.drawingFunction){
                    	arg.drawingFunction();
                    }
                    
                    ctx.swapBuffers();
                    ctx.restore();
                    
                    

//                    delete img;
                                                  
                }
            }
        }
        return this._singleton;
    }
}
