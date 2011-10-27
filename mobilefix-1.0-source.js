// encoding: utf-8
// Implement common tricks for mobile devices

(function(win, doc, ua, addEv) {

  // fix orientation change zoom bug in Safari Mobile on iOS devices
  // based on: https://gist.github.com/901295
  if (  /iPhone|iPad/.test(ua) && !/Opera Mini/.test(ua) ) {

    var qsa = 'querySelectorAll',
        meta = doc[qsa] ? doc[qsa]('meta[name=viewport]') : [];

    if ( meta[0] ) {
      var type = 'gesturestart',
          s = [1, 1],
          fix = function () {
              meta[meta.length - 1].content = 'width=device-width,minimum-scale='+ s[0] +',maximum-scale='+ s[1];
              doc.removeEventListener(type, fix, true);
            };
      fix();
      s = [.25, 1.6];
      doc[addEv](type, fix, true);

    }
  }


  // attempt to hide location bar in iPhone and Android devices by scrolling ever so slightly.
  // Based on: https://gist.github.com/1183357
  // If there's a hash, or addEventListener is undefined, stop here
  if( !location.hash && win[addEv] ) {
    var scrTo = 'scrollTo',
        scrTop = scrTo+'p',
        topVal = 1,
        getScrTop = function(){
            return scrTop in doc.body ? doc.body[scrTop] : 1;
          },
        //reset to 0 on bodyready, if needed
        bodycheck = setInterval(function(){
            if( doc.body ){
              clearInterval( bodycheck );
              topVal = getScrTop();
              win[scrTo]( 0, topVal === 1 ? 0 : 1 );
            }	
          }, 15 );
    //scroll to 1
    win[scrTo]( 0, 1 );
    win[addEv]( "load", function(){
      setTimeout(function(){
        //at load, if user hasn't scrolled more than 20 or so...
        if( getScrTop() < 20 ){
          //reset to hide addr bar at onload
          win[scrTo]( 0, topVal === 1 ? 0 : 1 );
        }
      }, 0);
    }, false );
  }


})(
  window,
  document,
  navigator.userAgent,
  'addEventListener'
);

