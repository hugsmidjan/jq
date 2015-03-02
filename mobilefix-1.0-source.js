/* Fixes for old iPhones  @preserve */
(function(win, doc, ua, addEv) {

  // fix orientation change zoom bug in Safari Mobile on iOS devices
  // based on: https://gist.github.com/901295
  if ( /iPhone|iPad/.test(ua) && / OS [456]/.test(ua) && !/Opera Mini/.test(ua) /* && doc[querySelectorAll] */ ) {

    var meta = doc.querySelectorAll('meta[name=viewport]');
    if ( meta[0] ) {
      meta = meta[meta.length - 1];
      var type = 'gesturestart';
      var minScale = 1;
      var maxScale = 1;
      var fix = function () {
              meta.content = 'width=device-width,minimum-scale='+ minScale +',maximum-scale='+ maxScale;
              doc.removeEventListener(type, fix, true);
            };
      doc[addEv](type, fix, true);
      fix();
      var cont = meta.content.replace(/\s/g,'') + ',';
      minScale = (cont.match(/minimum-scale=(.*?),/)||[])[1] || 0.25;
      maxScale = (cont.match(/maximum-scale=(.*?),/)||[])[1] || 1.6;
    }

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

