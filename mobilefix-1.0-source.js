/* Fixes for old iPhones  @preserve */
(function(win, doc, ua, addEv) {

  // fix orientation change zoom bug in Safari Mobile on iOS devices
  // based on: https://gist.github.com/901295
  if ( /iPhone|iPad/.test(ua) && / OS [4567]/.test(ua) && !/Opera Mini/.test(ua) /* && doc[querySelectorAll] */ ) {

    // counter the input[placeholder] orientationchange layout bug in iPhone+iOS6
    // http://stackoverflow.com/q/12670931/16271
    if ( /iPhone/.test(ua) ) {
      win[addEv]('orientationchange', function(){
        /*
          var s = doc.documentElement.style;
          s.display = 'none';
          setTimeout(function(){ s.display = 'block'; }, 0);
        */
          setTimeout(function(docElm){
              (docElm=document.documentElement).className = docElm.className;
            }, 0);
        }, true);
    }
  }

})(
  /* win =   */ window,
  /* doc =   */ document,
  /* ua =    */ navigator.userAgent,
  /* addEV = */ 'addEventListener'
);

