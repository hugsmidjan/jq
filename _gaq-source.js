// Google Analytics (old schoool)
// prepares a window._gaq Array, and sets up a single-use _gaq.loadScript() method.
(function(win, _gaq){
  win._gaq = _gaq = win._gaq || [];
  // Check for EU Cookie directive opt-out cookie called "cookie" (pun intended)
  // and disable the .loadScript method when applicable.
  _gaq.loadScript = _gaq.loadScript || (/(?:^|;)cookie=0/.test(document.cookie) ? function(){} : function(g,a,q) {
      g=document;a=g.getElementsByTagName('script')[0];q=g.createElement('script');
      q.async=1;q.src='//www.google-analytics.com/analytics.js';a.parentNode.insertBefore(q,a);
      _gaq.loadScript = function(){};
    });
})(window);

