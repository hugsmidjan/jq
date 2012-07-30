// ----------------------------------------------------------------------------------
// jQuery.formatChange
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
/*
    Monitors changes in `#mediaformat:after`'s `content` values
    as defined by the document's CSS code (See: http://adactio.com/journal/5429/),
    triggering custom window.onformatchange events when needed.

    NOTE: The current version always reports the format as `null`
    in IE8 and other browsers that don't support `window.getCurrentStyle()`
    or don't otherwise allow reading an element's `:before/:after` content.


    Event Binding:

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
        var S = jQuery.formatChange();
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

    Trigger manual refresh/format check any time:
        jQuery.formatChange();

    Teardown:
        jQuery.formatChange('disengage'); // does NOT unbind window.onformatchange handlers



*/
(function($, window, evName, s, elm, undefined){

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
                  // elm:    document.body, // element to monitor
                  // before: false,         // use ':before' instead of the default ':after'
                };
        s = $.extend({/* format: null */}, extras);
        if ( window.getComputedStyle )
        {
          $(window).bind(evName, function (e) {
              if ( !elm )
              {
                elm = $('<'+ (cfg.tagName||'del') +' style="position:absolute;visibility:hidden;width:0;height:0;overflow:hidden;"/>')
                          .appendTo('body')[0];
                elm.id = cfg.elmId || 'mediaformat';
              }
              var newFormat = window.getComputedStyle( elm, cfg.before?':before':':after' )
                                  .getPropertyValue('content')
                                      .replace(/['"]/g,''); // some browsers return a quoted string.
              if ( newFormat != s.format )
              {
                var oldFormat = s.format;
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
        $(window).trigger(evName);
        return s;
      }

    };

})(jQuery, window, 'resize.formatchange');