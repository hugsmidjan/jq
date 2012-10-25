// ----------------------------------------------------------------------------------
// jQuery.formatChange
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
/*
    Monitors changes in `#mediaformat:after`'s `content` values
    as defined by the document's CSS code (See: http://adactio.com/journal/5429/)
    (falling back to `#mediaformat`'s `font-family` name when needed),
    triggering custom window.onformatchange events when needed.

    NOTE: The current version always reports the format as `null`
    in IE8 and other browsers that don't support `window.getCurrentStyle()`
    or don't otherwise allow reading an element's `:before/:after` content.
    Android Browser on Gingerbread (2.3) and older also doesn't allow access
    to `:before/:after` so we fall back to reading 'font-family' on the the element itself.
    That trick doesn't work on it's own as Opera wont report imaginary font-faces,
    only the actual displayed font-face. They're doing it right, but in this case it's really annoying.


    Event Binding:
    (Should occur before running $.formatChange() to capture the initial event.
    Otherwise you need to run $.formatChange(true); re-trigger the initial event.

        jQuery(window)
            .on('formatchange', function (e, F, oldFormat) {
                F.format // 'named'
                if ( F.format == 'mobile-landscape'  &&  oldFormat != 'tablet-portrait' )
                {
                  // do stuff
                }
                else if ( !F.isMobile[ oldFormat ] )
                {
                  // do stuff
                }
              })


    Initialization:

        jQuery.formatChange();

        //...or...

        jQuery.formatChange({
            // default options:
            tagName: 'del',         //
            elmId:   'mediaformat', //
            before:  false,         // set to `true` to use ':before' instead of the default ':after'
            // S is a lookup hash for "formats" that classify as "small". All other are defined as big.
            // set it to null or false to disable the simple small/large checking
            S:       { 'narrow':1, 'mobile':1 }
          });

        //...or...

        var S = jQuery.formatChange();
        alert( S.format );

        //...or...

        var S = jQuery.formatChange(null, { someProp: 'Some value for S' });
        alert( S.someProp );


    Trigger manual refresh/format check any time:
    (Useful after scripted CSS changes)

        jQuery.formatChange();


    Teardown:

        jQuery.formatChange('disengage'); // does NOT unbind window.onformatchange handlers



*/
(function($, window, evName, getComputedStyle, F, elm, undefined){

  $.formatChange = function (cfg, extras) {

      if ( cfg === 'disengage' )
      {
        $(window).unbind(evName);
        elm && elm.remove();
        F = elm = undefined;
      }
      else if ( !F )
      {
        cfg = $.extend({
                  // tagName: 'del',
                  // elmId:   'mediaformat',
                  // before:  false,  // set to `true` to use ':before' instead of the default ':after'
                  S: { 'narrow':1, 'mobile':1 }
                }, cfg);

        F = $.extend({/* format:null */}, extras);

        if ( window[getComputedStyle] )
        {
          $(window).bind(evName, function (e, forceTrigger) {
              if ( !elm )
              {
                elm = $('<'+ (cfg.tagName||'del') +' style="position:absolute;visibility:hidden;width:0;height:0;overflow:hidden;"/>')
                          .appendTo('body')[0];
                elm.id = cfg.elmId || 'mediaformat';
              }
              var newFormat = window[getComputedStyle]( elm, cfg.before?':before':':after' )
                                  .getPropertyValue('content').replace(/['"]/g,'')  // some browsers return a quoted string.
                            || window[getComputedStyle]( elm, null ).getPropertyValue('font-family');
              if ( (newFormat !== F.format)  ||  forceTrigger )
              {
                var oldFormat = forceTrigger ? undefined : F.format;
                F.format = newFormat;

                // Sugar: set simple flags grouping formats into either "small" or "large" categories.
                if ( cfg.S )
                {
                  F.isSmall =  cfg.S[F.format];
                  F.isLarge =  !F.isSmall;
                  // NOTE: `was(Small|Large)` are both false if oldFormat is undefined
                  // (i.e. on first run)
                  F.wasSmall = oldFormat  &&  cfg.S[oldFormat];
                  F.wasLarge = oldFormat  &&  !F.wasSmall;
                  F.becameSmall = F.isSmall  &&  !F.wasSmall;
                  F.becameLarge = F.isLarge  &&  !F.wasLarge;
                }

                $(window).trigger('formatchange', [F, oldFormat]);
              }
            });
        }
        else
        {
          $(window)
              .one(evName, function (/* e */) {
                  F.format = null;
                  $(window).trigger('formatchange', [F]);
                });
        }
      }
      if ( F )
      {
        $(window).trigger(evName, [cfg===true]); // $.formatChange( true );  force-triggers an window.onformatchange event
        return F;
      }

    };

})(jQuery, window, 'resize.formatchange', 'getComputedStyle');