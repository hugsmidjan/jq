// Google Analytics (old schoool)
// prepares the window._gaq Array, and sets up a single-use window.gaHXM.loadScript() method.
window._gaq = window._gaq || [];

if ( !window.gaHXM ) {
    window.gaHXM = {
        // Check for EU Cookie directive opt-out cookie called "cookie" (pun intended)
        // and disable the gaHXM.loadScript method when applicable.
        loadScript: /(?:^|;\s*)cookie=0/.test(document.cookie) ?
            function () {}: // "cookie=0" means the user has been asked and rejected the analytics
            function (opts) {
                var script = document.createElement('script');
                script.async = 1;
                script.src = '//www.google-analytics.com/ga'+(opts==='debug'?'_debug':'')+'.js';
                var refNode = document.getElementsByTagName('script')[0];
                refNode.parentNode.insertBefore( script, refNode );
                window.gaHXM.loadScript = function () {};
            },
    };
}

window._gaq.loadScript = window.gaHXM.loadScript; // Because hypothetically old scripts might still use _gaq.loadScript.
