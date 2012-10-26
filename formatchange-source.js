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

    IE7-8 and Android Browser on Gingerbread (2.3), and other older browsers don't allow access
    to `:before/:after` so we fall back to reading 'font-family' on the the element itself.
    That trick doesn't work on it's own as Opera wont report imaginary font-faces, only the
    actual displayed font-face. (Opera is doing it right, however annoying it seems.)


    Event Binding:
    (Should occur before running $.formatChange() to capture the initial event.
    Otherwise you need to run $.formatChange(true); re-trigger the initial event.

        jQuery(window)
            .on('formatchange', function (e, F) {
                F.format      // the given name of the current format
                F.lastFormat  // the given name of the previous format (undefined at first)

                // Sugar flags: (available only if the `S` settings object is not disabled)
                F.isSmall     // true of the current format's name is a property of `S`
                F.isLarge     // true if not isSmall
                F.wasSmall    // true if oldFormat was defined as Small.
                F.wasLarge    // true if oldFormat was defined as Large.
                F.becameSmall // true when Small and oldFormat was either Large or undefined.
                F.becameLarge // true when Large and oldFormat was either Small or undefined.

                // do stuff
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
(function($, window, evName, getComputedStyle, F, elm, $elm, undefined){
  getComputedStyle = window.getComputedStyle;

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

        $(window).bind(evName, function (e, forceTrigger) {
            if ( !elm )
            {
              $elm = $('<'+ (cfg.tagName||'del') +' style="position:absolute;visibility:hidden;width:0;height:0;overflow:hidden;">f</del>')
                        .appendTo('body');
              elm = $elm[0];
              elm.id = cfg.elmId || 'mediaformat';
            }
            var oldFormat = forceTrigger ? undefined : F.format,
                newFormat = (getComputedStyle && getComputedStyle( elm, cfg.before?':before':':after' )
                                    .getPropertyValue('content').replace(/['"]/g,'')  // some browsers return a quoted string.
                            ) || $elm.css('font-family');
            if ( (newFormat !== oldFormat)  ||  forceTrigger )
            {
              F.format = newFormat;
              F.lastFormat = oldFormat;

              // Sugar: set simple flags grouping formats into either "small" or "large" categories.
              if ( cfg.S  &&!(extras&&extras.isSmall) )
              {
                F.isSmall =  cfg.S[newFormat];
                F.isLarge =  !F.isSmall;
                // NOTE: `was(Small|Large)` are both false if oldFormat is undefined
                // (i.e. on first run)
                F.wasSmall = oldFormat  &&  cfg.S[oldFormat];
                F.wasLarge = oldFormat  &&  !F.wasSmall;
                F.becameSmall = F.isSmall  &&  !F.wasSmall;
                F.becameLarge = F.isLarge  &&  !F.wasLarge;
              }

              $(window).trigger('formatchange', [F, oldFormat/* oldFormat is left in for backwards compatibility */]);
            }
          });
      }
      if ( F )
      {
        $(window).trigger(evName, [cfg===true]); // $.formatChange( true );  force-triggers an window.onformatchange event
        return F;
      }

    };

})(jQuery, window, 'resize.formatchange');