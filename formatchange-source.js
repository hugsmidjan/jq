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
                F[format]      // the given name of the current format
                F[lastFormat]  // the given name of the previous format (undefined at first)
              // Methods that check if the current format and/or lastformat
              // match a given formatCategoryName and/or formatName
                F.is( formatName_or_formatCategoryName )  // matches against F[format]
                F.was( formatName_or_formatCategoryName ) // matches against F[lastFormat] - if defined
                F.became( formatCategoryName )   // returns true when current format has just entered a formatCategory
                F.left( formatCategoryName )     // returns true when current format has just exited a formatCategory

                // do stuff...
              })



    Initialization:
    (should normally happen after the Event binding - unless the event is Re-triggered later)

        var options = {
            // default options:
            tagName: 'del',         //
            elmId:   'mediaformat', //
            before:  false,         // set to `true` to use ':before' instead of the default ':after'
            // Small and Large are named format categories that can be used with the is|was|became|left methods.
            Small: { 'narrow':1, 'mobile':1 },
            Large: { 'tablet':1, 'desktop':1, 'wide':1 }
          };
        var S = jQuery.formatChange( options );

        alert( S.format );



    Trigger "soft" format check on-demand:
    (only triggers a "formatchange" event if the format
     has really changed since last time.)

        jQuery.formatChange();



    Re-trigger (forcefully) a format check:
    (F[lastFormat] becomes undefined)
    (optional namespace gets added to the formatchange event trigger)

        var forceEventTrigger = true; // <-- MUST be Boolean true
        var optionalEventNamespace = 'myNamespace';

        jQuery.formatChange( forceEventTrigger, optionalEventNamespace );



    Teardown:
    (NOTE: does NOT unbind window.onformatchange handlers)

        jQuery.formatChange( 'disengage' );




*/
(function($, window, evName, format, lastFormat, getComputedStyle, checkFormat, F, elm, $elm, undefined){
  getComputedStyle = window.getComputedStyle;

  $.formatChange = function (cfg, triggerNS ) {

      if ( cfg === 'disengage' )
      {
        $(window).unbind(evName);
        elm && elm.remove();
        F = elm = undefined;
      }
      else
      {
        var forceTrigger  = cfg===true;

        if ( !F )
        {
          cfg = $.extend({
                    // tagName: 'del',
                    // elmId:   'mediaformat',
                    // before:  false,  // set to `true` to use ':before' instead of the default ':after'
                    Small: { 'narrow':1, 'mobile':1 },
                    Large: { 'tablet':1, 'full':1, 'wide':1 }
                  }, cfg);

          checkFormat = function ( query, format ) {
              ;;;window.console&&console.log( ['ff '+query+' '+format] );
              return  query===format  ||  !!(cfg[query] && cfg[query][format]);
            };

          F = $.extend({
                  is:     function (fmt) {  return checkFormat(fmt,F[format]);  },
                  was:    function (fmt) {  return checkFormat(fmt,F[lastFormat]);  },
                  became: function (fmt) {  return checkFormat(fmt,F[format])  &&  !checkFormat(fmt,F[lastFormat]);  },
                  left:   function (fmt) {  return checkFormat(fmt,F[lastFormat])  &&  !checkFormat(fmt,F[format]);  }
                },
                // mix triggerNS into the F object to support the depricated "extras" paramter for $.formatChange()
                !forceTrigger&&triggerNS
              );

          $(window).bind(evName, function (e, evOpts) {
              evOpts = evOpts || {};
              if ( !elm )
              {
                $elm = $('<'+ (cfg.tagName||'del') +' style="position:absolute;visibility:hidden;width:0;height:0;overflow:hidden;"/>')
                          .appendTo('body');
                elm = $elm[0];
                elm.id = cfg.elmId || 'mediaformat';
              }
              var oldFormat = F[lastFormat] =
                                  evOpts.force ? undefined : F[format],
                  newFormat = F[format] =
                                  ( (getComputedStyle && getComputedStyle( elm, cfg.before?':before':':after' ).getPropertyValue('content')) ||
                                    $elm.css('font-family') ).replace(/['"]/g,''); // some browsers return a quoted strings.

              if ( (newFormat !== oldFormat)  ||  evOpts.force )
              {
                $(window).trigger('formatchange'+(evOpts.ns||''), [F, oldFormat] ); /* oldFormat is left in for backwards compatibility */
              }
            });
        }
        $(window)
            .trigger(evName, [ forceTrigger?{ force:1, ns:triggerNS?('.'+triggerNS):'' }:undefined ] ); // $.formatChange( true );  force-triggers an window.onformatchange event

        return F;
      }

    };

})(jQuery, window, 'resize.formatchange', 'format', 'lastFormat');