// Google Analytics (old schoool)
// prepares the window._gaq Array, and sets up a single-use _gaq.loadScript() method.
(function(win, ga){
  ga = win._gaq = win._gaq || [];


  // Check for EU Cookie directive opt-out cookie called "cookie" (pun intended)
  // and disable the .loadScript method when applicable.
  ga.loadScript = ga.loadScript || (/(?:^|;)cookie=0/.test(document.cookie) ? function(){} : function(opts, doc, refNode, script) {
      doc = document;
      refNode = doc.getElementsByTagName('script')[0];
      script = doc.createElement('script');
      script.async = 1;
      script.src = '//www.google-analytics.com/ga'+(opts==='debug'?'_debug':'')+'.js';
      refNode.parentNode.insertBefore( script, refNode );
      ga.loadScript = function(){};
    });
})(window);

