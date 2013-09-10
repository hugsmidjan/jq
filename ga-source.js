// Google Universal Analytics
// prepares the window.ga object, and sets up a single-use ga.loadScript() method.
(function(window, ga){
  window.GoogleAnalyticsObject = 'ga';
  window.ga = ga = window.ga || function(){ (ga.q=ga.q||[]).push(arguments); };
  ga.l = 1*new Date();
  // Check for EU Cookie directive opt-out cookie called "cookie" (pun intended)
  // and disable the .loadScript method when applicable.
  ga.loadScript = ga.loadScript || (/(?:^|;)cookie=0/.test(document.cookie) ? function(){} : function(opts, doc, refNode, script) {
      doc=document;
      refNode=doc.getElementsByTagName('script')[0];
      script=doc.createElement('script');
      script.async = 1;
      script.src='//www.google-analytics.com/analytics'+(opts==='debug'?'_debug':'')+'.js';
      refNode.parentNode.insertBefore( script, refNode );
      ga.loadScript = function(){};
    });
})(window);
