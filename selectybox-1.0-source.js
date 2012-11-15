// ----------------------------------------------------------------------------------
// jQuery.fn.selectybox v 1.0
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
// Allows simple styling of selectboxes in a way that is both a11y and mobile friendly.
//
//
// Requires:  jQuery 1.6+
//
//
// Usage:
//  $('select').selectybox({ /* options */ });
//
//  Returns the wrapper elements.
//
//
(function($, selectyButton){

  var selectybox = $.fn.selectybox = function ( cfg ) {
          cfg = $.extend({}, defaultCfg, cfg);
          var button = $(cfg.button),
              wrappers = this
                              .wrap(cfg.wrapper)
                              .each(function () {
                                  var sel = $(this);
                                      btn = $(cfg.button)
                                                .text( sel.find('option:selected').text() || cfg.emptyVal );
                                  sel
                                      .data(selectyButton, btn)
                                      .before( btn );
                                })
                              .bind('focus blur', function (e) {
                                  $(this).parent()
                                      .toggleClass( cfg.focusClass, e.type == 'focus' );
                                })
                              .bind('change keypress', function (e) {
                                  var sel = $(this);
                                  setTimeout(function(){
                                      sel.data( selectyButton )
                                          .text( sel.find('option:selected').text() || cfg.emptyVal );
                                    }, 0);
                                })
                              .css({ opacity: .0001 })
                              .css( cfg.selectCSS )
                              .parent()
                                  .css( cfg.wrapperCSS );
            return this.pushStack( wrappers );
        },

      defaultCfg = selectybox.defaults = {
          wrapper:        '<span class="selecty"/>',
          button:         '<span class="'+selectyButton+'"/>',
          focusClass:     'focused',
          emptyVal:       '\u00a0 \u00a0 \u00a0',
          wrapperCSS:     { position: 'relative' },
          selectCSS:      { position: 'absolute', bottom:0, left:0 }
        };


})(jQuery, 'selecty-button');