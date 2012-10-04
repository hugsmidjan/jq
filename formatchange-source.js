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
            .on('formatchange', function (e, s, oldFormat) {
                if ( s.format == 'mobile-landscape'  &&  oldFormat != 'tablet-portrait' )
                {
                  // do stuff
                }
                else if ( !s.isMobile[ oldFormat ] )
                {
                  // do stuff
                }
              })

    Initialization:
        jQuery.formatChange();
      ...or...
        jQuery.formatChange({
            // default options:
            tagName: 'del',
            elmId:   'mediaformat',
            before:  false
          });
      ...or...
        jQuery.formatChange(null, {
            isMobile: { 'mobile-portrait':true, 'mobile-landscape':true }
          });
      ...or...
        var S = jQuery.formatChange();
        alert(S.format);

    Trigger manual refresh/format check any time (useful after scripted CSS changes):
        jQuery.formatChange();

    Teardown:
        jQuery.formatChange('disengage'); // does NOT unbind window.onformatchange handlers



*/
(function($, window, evName, getComputedStyle, s, elm, undefined){

  $.formatChange = function (cfg, extras) {

      if ( cfg == 'disengage' )
      {
        $(window).unbind(evName);
        elm && elm.remove();
        s = elm = undefined;
      }
      else if ( !s )
      {
        cfg = cfg || {
                  // tagName: 'del',
                  // elmId:   'mediaformat',
                  // before:  false  // set to `true` to use ':before' instead of the default ':after'
                };
        s = $.extend({/* format: null */}, extras);
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
              if ( newFormat != s.format  ||  forceTrigger )
              {
                var oldFormat = forceTrigger ? undefined : s.format;
                s.format = newFormat;
                $(window).trigger('formatchange', [s, oldFormat]);
              }
            });
        }
        else
        {
          $(window)
              .one(evName, function (e) {
                  s.format = null;
                  $(window).trigger('formatchange', [s]);
                });
        }
      }
      if ( s )
      {
        $(window).trigger(evName, [cfg===true]); // $.formatChange( true );  force-triggers an window.onformatchange event
        return s;
      }

    };

})(jQuery, window, 'resize.formatchange', 'getComputedStyle');