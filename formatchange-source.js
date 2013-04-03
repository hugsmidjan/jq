// ----------------------------------------------------------------------------------
// jQuery.formatChange
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//
// Dual licensed under a MIT licence (http://en.wikipedia.org/wiki/MIT_License)
// and GPL 2.0 or above (http://www.gnu.org/licenses/old-licenses/gpl-2.0.html).
// ----------------------------------------------------------------------------------
/*

    jQuery.formatChange() Monitors changes in `#mediaformat:after`'s `content` values
    as defined by the document's CSS code (See: http://adactio.com/journal/5429/)
    (falling back to `#mediaformat`'s `font-family` name when needed),
    triggering custom window.onformatchange events when needed.

    IE7-8 and Android Browser on Gingerbread (2.3), and other older browsers don't allow access
    to `:before/:after` so we fall back to reading 'font-family' on the the element itself.
    That trick doesn't work on it's own as Opera wont report imaginary font-faces, only the
    actual displayed font-face. (Opera is doing it right, however annoying it seems.)


    Event Binding:
    --------------------------------------------------------------------------
    (Should occur before running `$.formatChange()` to capture the initial event.
    Otherwise you need to run `$.formatChange(true)` to re-trigger the initial event.

        jQuery(window)
            .on('formatchange', function (e, media) {
                media.format      // the given name of the current format
                media.lastFormat  // the given name of the previous format (undefined at first)
              // Methods that check if the current format and/or lastformat
              // match a given formatCategoryName and/or formatName
                media.is( format_or_formatCategoryName )  // matches against media.format
                media.was( format_or_formatCategoryName ) // matches against media.lastFormat
                media.became( formatCategoryName )   // has current format has just entered a formatCategory?
                media.left( formatCategoryName )     // has current format has just exited a formatCategory?

                // do stuff...
              });



    Initialization:
    --------------------------------------------------------------------------
    (should normally happen after the Event binding - unless the event is Re-triggered later)

        var options = {
              // `Small` and `Large`  are named Format Categories that
              // can be used with the is|was|became|left methods.
              // These can be overridden, deleted or renamed, and new ones
              // can be added at will.
                Small: { 'narrow':1, 'mobile':1 },
                Large: { 'tablet':1, 'desktop':1, 'wide':1 }

              // Default config options:
                $tagName: 'del',         // tagname for the generated hidden element
                $elmId:   'mediaformat', // id for the generated element
                $before:  false,         // set to `true` to use ':before' instead of the default ':after'
              };
        var media = jQuery.formatChange( options );

        alert( media.format );



    Trigger "soft" format check on-demand:
    --------------------------------------------------------------------------
    (only triggers a "formatchange" event if the format has really changed since last time.)

        jQuery.formatChange();



    Re-trigger (forcefully) a format check:
    --------------------------------------------------------------------------
    (media.lastFormat becomes undefined)
    (optional namespace gets added to the formatchange event trigger)

        var forceEventTrigger = true; // <-- MUST be a Boolean true
        var eventNamespace = 'myNamespace'; // optional limiter on which event handlers get triggered.

        jQuery.formatChange( forceEventTrigger, eventNamespace );



    Teardown:
    --------------------------------------------------------------------------
    (NOTE: Does NOT unbind any window.onformatchange handlers - only the onResize CSS-polling)

        jQuery.formatChange( 'disengage' );




*/
(function(
    $,
    window,
    resize_formatchange,
    format,
    lastFormat,
    getComputedStyle,
    checkFormat,
    M,
    elm,
    F, // used by $.beget (if needed)
    undefined
){
  getComputedStyle = window.getComputedStyle;

  $.beget = $.beget || (F=function(){}) && function (proto, props) { // prototypal inheritence under jquery
      F.prototype = proto;
      return props ? $.extend(new F(), props) : new F();
    },


  $.formatChange = function (cfg, triggerNS ) {

      if ( cfg !== 'disengage' )
      {
        var forceTrigger = cfg===true;

        // Define the Format Info object if needed
        if ( !M )
        {
          cfg = $.extend({
                    // $tagName: 'del',
                    // $elmId:   'mediaformat',
                    // $before:  false,  // set to `true` to use ':before' instead of the default ':after'
                    Small: { 'narrow':1, 'mobile':1 },
                    Large: { 'tablet':1, 'full':1, 'wide':1 }
                  }, cfg);

          checkFormat = function ( query, format ) {
              return  query===format  ||  !!(cfg[query] && cfg[query][format]);
            };

          M = $.extend({
                  is:     function (fmt) {  return checkFormat(fmt,this[format]);  },
                  was:    function (fmt) {  return checkFormat(fmt,this[lastFormat]);  },
                  became: function (fmt) {  return checkFormat(fmt,this[format])  &&  !checkFormat(fmt,this[lastFormat]);  },
                  left:   function (fmt) {  return checkFormat(fmt,this[lastFormat])  &&  !checkFormat(fmt,this[format]);  }
                },
                // TEMPORARY: mix triggerNS into the F object to support
                // the DEPRICATED "extras" paramter for $.formatChange()
                !forceTrigger && triggerNS
              );

          // build and inject the hidden monitoring element
          elm = $('<'+ (cfg.$tagName||'del') +' style="position:absolute;visibility:hidden;width:0;height:0;overflow:hidden;"/>')
                          .attr('id', cfg.$elmId || 'mediaformat')
                          .appendTo('body');


          $(window).on(resize_formatchange, function (e, evOpts) {
              evOpts = evOpts || {};
              var oldFormat = M[lastFormat] = evOpts.force ? undefined : M[format],
                  newFormat = M[format] = ( (getComputedStyle && getComputedStyle( elm[0], cfg.$before?':before':':after' ).getPropertyValue('content')) ||
                                elm.css('font-family') )
                                    // some browsers return a quoted strings.
                                    .replace(/['"]/g,'');

              if ( (newFormat !== oldFormat)  ||  evOpts.force )
              {
                $(window).trigger(
                    'formatchange'+(evOpts.ns||''),
                    [$.beget(M), oldFormat] // TEMPORARY: `oldFormat` is temporarily left in for backwards compatibility
                  );
              }
            });
        }
        $(window).trigger(
            resize_formatchange,
            [ forceTrigger ? { force:1, ns:triggerNS?('.'+triggerNS):'' } : undefined ]
          );
      }
      else
      {
        $(window).off(resize_formatchange);
        elm && elm.remove();
        M = elm = undefined;
      }

      return M;

    };

})(jQuery, window, 'resize.formatchange', 'format', 'lastFormat');
