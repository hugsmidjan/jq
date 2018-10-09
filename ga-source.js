/* Google analytics helpers  -- (c) 2017-2018 Hugsmiðjan ehf.  @preserve */
// sets up a single-use window.gaHXM.loadScript() method and view and event ping helpers.
(function (window) {
    if ( !window.ga ) {
        window.ga = function () { (window.ga.q=window.ga.q||[]).push(arguments); };
        window.GoogleAnalyticsObject = 'ga';
        window.ga.l = 1*new Date();
    }

    var gaHXM = window.gaHXM || {};

    // Check for EU Cookie directive opt-out cookie called "cookie" (pun intended)
    // and disable the .loadScript method when applicable.
    gaHXM.loadScript = gaHXM.loadScript || /(?:^|;\s*)cookie=0/.test(document.cookie) ?
        function () {}: // "cookie=0" means the user has been asked and rejected the analytics
        function (opts) {
            var script = document.createElement('script');
            script.async = 1;
            script.src = '//www.google-analytics.com/analytics'+(opts==='debug'?'_debug':'')+'.js';
            var refNode = document.getElementsByTagName('script')[0];
            refNode.parentNode.insertBefore( script, refNode );
            gaHXM.loadScript = function () {};
        };

    gaHXM.eventPing = gaHXM.eventPing || function (category, action, label, value, interaction) {
        window.ga('send', {
            hitType: 'event',
            eventCategory:  category,
            eventAction:    action,
            eventLabel:     label,
            eventValue:     value,
            nonInteraction: !interaction,
        });
    };

    gaHXM.viewPing = gaHXM.viewPing || function (url, title) {
        // The default behaviour is (now) to set the new url+title as a new value on the 'ga tracker',
        // essentially redefining the 'current' page (e.g. in a single-page app).
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications
        window.ga('set', {
            'page': url,
            'title': title,
        });
        window.ga('send', 'pageview');
    };

})(window);
