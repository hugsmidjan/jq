/* Google analytics helpers  -- (c) 2017 Hugsmiðjan ehf.  @preserve */
// prepares the window.ga object, and sets up a single-use ga.loadScript() method.
(function (win, ga) {
  ga = win.ga = win.ga || function () { (ga.q=ga.q||[]).push(arguments); };
  win.GoogleAnalyticsObject = 'ga';
  ga.l = ga.l || 1*new Date();
  // Check for EU Cookie directive opt-out cookie called "cookie" (pun intended)
  // and disable the .loadScript method when applicable.
  ga.loadScript = ga.loadScript || (/(?:^|;\s*)cookie=0/.test(document.cookie) ? function () {} : function (opts, doc, refNode, script) {
      doc = document;
      refNode = doc.getElementsByTagName('script')[0];
      script = doc.createElement('script');
      script.async = 1;
      script.src = '//www.google-analytics.com/analytics'+(opts==='debug'?'_debug':'')+'.js';
      refNode.parentNode.insertBefore( script, refNode );
      ga.loadScript = function () {};
    });


  ga.eventPing = function (category, action, label, value, interaction) {
      ga('send', {
          hitType: 'event',
          eventCategory:  category,
          eventAction:    action,
          eventLabel:     label,
          eventValue:     value,
          nonInteraction: !interaction,
        });
  };

  ga.viewPing = function (url, title) {
      // The default behaviour is (now) to set the new url+title as a new value on the 'ga tracker',
      //   essentially redefining the 'current' page (e.g. in a single-page app).
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications

      ga('set', {
          'page': url,
          'title': title,
        });
      ga('send', 'pageview');

  };

})(window);
