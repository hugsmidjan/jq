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
              // static flags that indicate whether the current format and/or lastformat
              // match a given formatCategoryName and/or formatName
                media.isGroupname       // matched against media.format
                media.wasGroupname      // matched against media.lastFormat
                media.becameGroupname   // is but was not?
                media.leftGroupname     // was but is not?

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



    Trigger "refresh" whenever you feel like you might need it
    --------------------------------------------------------------------------
    (only triggers a "formatchange" event if the format has really changed since last time.)
    (but always updates the static media-format group flags .becameLarge, .leftSmall, etc...)
    (userful when CSS changes may have caused the format-names changes without any resize happening
    or when you have modified the contents of media.groups.)

        jQuery.formatChange();



    Forcefully re-trigger a format check:
    --------------------------------------------------------------------------
    (media.lastFormat becomes undefined - just like this event is being triggered for the first time)
    (optional namespace gets added to the formatchange event trigger)

        var forceEventTrigger = true; // <-- MUST be a Boolean true
        var eventNamespace = 'myNamespace'; // optional limiter on which event handlers get triggered.

        jQuery.formatChange( forceEventTrigger, eventNamespace );



    Teardown:
    --------------------------------------------------------------------------
    (NOTE: This does NOT unbind any window.onformatchange handlers
    - only the onResize CSS-polling and triggering of formatchage events.)

        jQuery.formatChange( 'disengage' );




*/
(function(
    $,
    window,
    resize_formatchange,
    format,
    lastFormat,
    getComputedStyle,
    media,
    _setStaticFlags,
    _checkFormat,
    oldFormat,
    elm,
    undefined
){
  getComputedStyle = window.getComputedStyle;

  // update the static group-related flags.
  _setStaticFlags = function () {
      for (var grpName in media.groups)
      {
        var grp = media.groups[grpName],
            is = !!(grp&&grp[media.format]),
            was = !!(grp&&grp[media.lastFormat]);
        media['is'+grpName] = is;
        media['was'+grpName] = was;
        media['became'+grpName] = is && !was;
        media['left'+grpName] = !is && was;
        !grp && (delete media.groups[grpName]); // delete when we've made sure all flags are set to false (cleanup)
      }
    };
  _checkFormat = function ( query, format ) {
      return  query===format  ||  !!(media.groups[query]  &&  media.groups[query][format]);
    };



  var formatChange  = $.formatChange = function (cfg, triggerNS ) {

      if ( cfg === 'disengage' )
      {
        $(window).off(resize_formatchange);
        elm && elm.remove();
        media = elm = undefined;
      }
      else
      {
        var forceTrigger = cfg===true;

        // Define the Format Info object if needed
        if ( !media )
        {
          cfg = $.extend(formatChange.config, cfg);

          media = formatChange.media = $.extend({
                  groups: formatChange.groups,
                  // DEPRICATED methods: (Instead use static media.isLarge, media.becameSmall, etc. flags)
                  is:     function (fmt) {  return  _checkFormat(fmt,this[format]);  },
                  was:    function (fmt) {  return  _checkFormat(fmt,this[lastFormat]);  },
                  became: function (fmt) {  return  _checkFormat(fmt,this[format]) && !_checkFormat(fmt,this[lastFormat]);  },
                  left:   function (fmt) {  return !_checkFormat(fmt,this[format]) &&  _checkFormat(fmt,this[lastFormat]);  }
                },
                // TEMPORARY: mix triggerNS into the F object to support
                // the DEPRICATED "extras" paramter for $.formatChange()
                !forceTrigger && triggerNS
              );
          // Treat all cfg properties starting with an Uppercase character
          // as a media-format group names - and move them into media.groups.
          $.each(cfg, function (key, value) {
              if ( /^[A-Z]/.test(key) ) {
                media.groups[key] = value;
              }
            });


          // build and inject the hidden monitoring element
          elm = $('<'+ (cfg.$tagName||'del') +' style="position:absolute;visibility:hidden;width:0;height:0;overflow:hidden;"/>')
                          .attr('id', cfg.$elmId || 'mediaformat')
                          .appendTo('body');

          $(window).on(resize_formatchange, function (e, evOpts) {
              evOpts = evOpts || {};
              var newFormat = (
                                (getComputedStyle && getComputedStyle( elm[0], cfg.$before?':before':':after' ).getPropertyValue('content'))  ||
                                elm.css('font-family')
                              ).replace(/['"]/g,''); // some browsers return a quoted strings.

              if ( newFormat !== oldFormat )
              {
                media[format] = newFormat;
                media[lastFormat] = oldFormat;
                oldFormat = newFormat;
                _setStaticFlags();
                $(window).trigger(
                    'formatchange'+(evOpts.ns||''),
                    [media, oldFormat] // TEMPORARY: `oldFormat` is temporarily left in for backwards compatibility
                  );
              }
              else if ( evOpts )
              {
                _setStaticFlags();
              }
            });
        }
        forceTrigger  &&  (oldFormat = undefined);
        $(window).trigger(
            resize_formatchange,
            [{ refresh:1,  ns:triggerNS?('.'+triggerNS):'' }]
          );
      }

      return media;

    };

  formatChange.config = {
      // $tagName: 'del',
      // $elmId:   'mediaformat',
      // $before:  false,  // set to `true` to use ':before' instead of the default ':after'
    };
  formatChange.groups = {
      Small: { 'narrow':1, 'mobile':1 },
      Large: { 'tablet':1, 'full':1, 'wide':1 }
    };


})(jQuery, window, 'resize.formatchange', 'format', 'lastFormat');
