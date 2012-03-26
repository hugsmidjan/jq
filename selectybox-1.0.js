// encoding: utf-8
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
//
//
(function($, selectyButton){

  var selectybox = $.fn.selectybox = function ( cfg ) {
          cfg = $.extend({}, defaultCfg, cfg);
          var button = $(cfg.button);
          this
              .wrap(cfg.wrapper)
              .each(function () {
                  var sel = $(this);
                      btn = $(cfg.button)
                                .text( sel.val() || cfg.emptyVal );
                  sel
                      .data(selectyButton, btn)
                      .before( btn );
                })
              .bind('focus blur', function (e) {
                  $(this).parent()
                      .toggleClass( cfg.focusClass, e.type == 'focus' );
                })
              .bind('change', function (e) {
                  var sel = $(this);
                  sel.data( selectyButton )
                      .text( sel.val() || cfg.emptyVal );
                })
              .css({ opacity: .0001 })
              .css( cfg.selectCSS )
              .parent()
                  .css( cfg.wrapperCSS );
        },

      defaultCfg = selectybox.defaults = {
          wrapper:        '<span class="selecty"/>',
          button:         '<span class="'+selectyButton+'"/>',
          focusClass:     'focused',
          btnValSelector: '.'+selectyButton,
          emptyVal:       '\u00a0 \u00a0 \u00a0',
          wrapperCSS:     { position: 'relative' },
          selectCSS:      { position: 'absolute', bottom:0, left:0 }
        };


})(jQuery, 'selecty-button');