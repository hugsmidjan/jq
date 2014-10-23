/* $.fn.selectybox 1.0  -- (c) 2012 Hugsmiðjan ehf. - MIT/GPL   @preserve */

// ----------------------------------------------------------------------------------
// jQuery.fn.selectybox v 1.0
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//
// Dual licensed under a MIT licence (http://en.wikipedia.org/wiki/MIT_License)
// and GPL 2.0 or above (http://www.gnu.org/licenses/old-licenses/gpl-2.0.html).
// ----------------------------------------------------------------------------------
//
// Allows simple styling of <select> boxes in a way that is both accessible and mobile friendly.
//
//
// Requires:  jQuery 1.6+
//
//
// Usage:
//  $('select').selectybox({ /* options */ });
//  $('select').selectybox('refresh');   // silently refresh the widget
//  $('select').selectybox('val', '10'); // silently updates <select>'s value
//  $('select').selectybox({'destroy'});
//
//  Returns the wrapper elements.
//
//
(function($){

  var dataKey = 'selecty-button-cfg',
      nsChangeEv = 'change.selectybox', // namespaced event to allow "quiet" updates.

      selectybox = $.fn.selectybox = function ( cfg, value ) {
          var selects = this;
          if ( cfg === 'refresh' )
          {
            selects.trigger(nsChangeEv);
          }
          else if ( cfg === 'val' )
          {
            selects
                .val(value)
                .trigger(nsChangeEv);
          }
          else if ( cfg === 'destroy' )
          {
            selects.each(function () {
                var sel = $(this),
                    conf = sel.data(dataKey);
                if ( conf )
                {
                  sel
                      .removeData(dataKey)
                      .css('opacity', '')
                      .parent()
                          .after( sel )
                          .remove();
                  $.each(conf.selectCSS||{}, function(prop){ sel.css(prop, ''); });
                }
              });
          }
          else
          {
            cfg = $.extend({}, defaultCfg, cfg);
            return selects.pushStack(
                selects.filter('select')
                    .data(dataKey, cfg)
                    .wrap(cfg.wrapper)
                    .each(function () {
                        var sel = $(this);
                        $(cfg.button)
                            .text( sel.find('option:selected').text() || cfg.emptyVal )
                            .insertBefore( sel );
                      })
                    .css({ opacity: 0.0001 })
                    .css( cfg.selectCSS )
                    .parent()
                        .css( cfg.wrapperCSS )
                        .on('focusin focusout', 'select', function (e) {
                            // update focus class
                            $(this).parent()
                                .toggleClass( cfg.focusClass, e.type === 'focusin' );
                          })
                        // keypress breaks arrow keys in sone browsers (Firefox,)
                        .on(nsChangeEv+' keyup', 'select', function (e) {
                            // update selecty-button text
                            var sel = $(this);
                            setTimeout(function(){
                                sel.prev()
                                    .text( sel.find('option:selected').text() || cfg.emptyVal );
                              }, 0);
                          })
                        .toArray()
              );
          }
          return selects;
        },

      defaultCfg = selectybox.defaults = {
          wrapper:        '<span class="selecty"/>',
          button:         '<span class="selecty-button"/>',
          focusClass:     'focused',
          emptyVal:       '\u00a0 \u00a0 \u00a0',
          wrapperCSS:     { position: 'relative' },
          selectCSS:      { position: 'absolute', bottom:0, left:0 }
        };



})(jQuery);