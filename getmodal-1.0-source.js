// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.getModal v 1.0
// ----------------------------------------------------------------------------------
// (c) 2011 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
//  Depends on:
//    $.fn.fickle  v1.0
//    $.fn.curtain v1.1  (optional)
//
//
//  Usage:
//      var modal = $.getModal({
//              content: '<p>Hello world!</p>'
//            });
//      modal.fickle('open');
//      modal.data('popbody').append('<p>Over!</p>');  // access modal "body" element
//      modal.data('popclosebtn').addClass('closer');  // access modal "close" link
//
//
//  Todo:
//    * add support for jQuery UI Position plugin
//

(function( $, undef ){

    $.getModal = function (cfg) {
        cfg = $.extend({
            // modal:    false,  // `true` means direct clicks on the .modalpop (curtain/container) DO NOT close the modal.
            // className: '',
            // content:   '',
            // marginTop: '',  // defaults to $(window).scrollTop() - unless explicitly set to `null`
            // appendTo:  'body',
            // opener:    ''      // shortcut for fickle:{ opener:... }
            // curtain:  '',   // $.fn.curtain configuration  -- set to `null` to disable the curtain functionality
            // fickle:  ''   // $.fn.fickle configuration (NOTE: getModal always sets the "focusTarget" option to falsy)
            template: '<div class="modalpop">'+
                        '<div class="popwin">'+
                          '<a class="focustarget" href="#">.</a>'+
                          '<div class="popbody"/>'+
                          '<a class="closebtn" href="#"/>'+
                        '</div>'+
                      '</div>',
            winSel:      '>.popwin',
            bodySel:     '>*>.popbody',
            closebtnSel: '>*>.closebtn'
          },
          $.getModal.defaults,
          cfg);

        var popup = $( cfg.template );

        var lang = $( cfg.opener || 'html' ).closest('[lang]').attr('lang') || 'en',
            closeBtn = popup.find( cfg.closebtnSel ),
            txt = $.getModal.i18n;
        txt = txt[ lang.substr(0,2) ] || txt.en;

        closeBtn
            .attr( 'title', txt.closeT||txt.close )
            .html( txt.close||txt.closeT );

        if ( cfg.content )
        {
          popup.find( cfg.bodySel ).append( cfg.content );
        }
        if ( cfg.marginTop !== null  )
        {
          popup
              .bind('fickleopen', function (/* e */) {
                  var marginTop = cfg.marginTop;
                  $(this).find(cfg.winSel)
                      .css( 'margin-top', (marginTop!==undef) ? marginTop : $(window).scrollTop() );
                });
        }
        if ( popup.curtain  &&  cfg.curtain !== null  )
        {
          popup
              .curtain( cfg.curtain||'' );
        }
        popup
            .data('popclosebtn', closeBtn)
            .data('popbody', popup.find( cfg.bodySel ))
            .addClass( cfg.className )
            .bind('click', function (e) {
                var targ = e.target;
                if ( (!cfg.modal && targ == this)  ||  $(targ).closest(cfg.closeSel)[0] )
                {
                  $(this).fickle('close');
                  return false;
                }
              })
            .fickle(
                $.extend({
                    onOpen: function (/* e */) {
                        $(this).appendTo( cfg.appendTo || 'body' );
                      },
                    onClosed: function (/* e */) {
                        popup.remove();
                      }
                  },
                  cfg.fickle,
                  {
                    focusTarget: '',
                    opener:      cfg.opener
                  })
              );

        lang = closeBtn = txt = undef;

        return popup;
      };

    
    $.getModal.i18n = {
        dk: {
            closeT: 'Close popup',
            close: 'Luk'
          },
        en: {
            closeT: 'Close popup',
            close: 'Close'
          },
        is: {
            closeT: 'Loka glugga',
            close: 'Loka'
          }
      };


}(jQuery));

