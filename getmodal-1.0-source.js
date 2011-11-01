// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.getModal v 1.0
// ----------------------------------------------------------------------------------
// (c) 2011 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
//  Provides basic modal popup UI service on top of $.fn.fickle and
//  with close button, and $.fn.curtain behaviour - 
//
//
//  Depends on:
//    $.fn.fickle  v1.0
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
            // modal:    false,   // Boolean: `true` prevents direct clicks on the .modalpop (curtain/container) from closing the modal.
            // className: '',     // String: additional class-name for the (outermost) modal container
            // content:   '',     // String/Elements - initial HTML content for the "body" element (as defined by the `bodySel` setting below)
            // marginTop: '',     // Integer/Function: specifies the margin-top value set to the "window" element (see `winSel` setting below)
                                  // defaults to $(window).scrollTop() - unless explicitly set to `null`
            // appendTo:  'body', // Selector|Element: to which to append the modal
            // opener:    ''      // shortcut for fickle:{ opener:... } -- i.e. the button/element to which the focus should return when the modal closes
            // fickle:  ''        // $.fn.fickle configuration (NOTE: getModal always sets the "focusTarget" option to falsy)
            template: '<div class="modalpop">'+
                        '<span class="curtain"/>'+
                        '<div class="popwin">'+
                          '<a class="focustarget" href="#">.</a>'+
                          '<div class="popbody"/>'+
                          '<a class="closebtn" href="#"/>'+
                        '</div>'+
                      '</div>',
            // curtainSel:  ''    // Selector: describing the "curtain" element - defaults to '' - i.e. the .modalpop container itself.
            winSel:      '.popwin',
            bodySel:     '.popbody',
            closebtnSel: '.closebtn'
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
          popup.find( cfg.bodySel )
              .append( cfg.content );
        }
        if ( cfg.marginTop !== null  )
        {
          popup
              .bind('fickleopen', function (/* e */) {
                  var marginTop = cfg.marginTop;
                  marginTop = (marginTop===undef) ?
                                  $(window).scrollTop():
                              $.isFunction(marginTop) ?
                                  marginTop.call(this):
                                  marginTop
                  $(this).find(cfg.winSel)
                      .css( 'margin-top', marginTop );
                });
        }
        popup
            .data('popclosebtn', closeBtn)
            .data('popbody', popup.find( cfg.bodySel ))
            .addClass( cfg.className )
            .bind('click', function (e) {
                var targ = e.target;
                if ( ( !cfg.modal  && 
                        ( targ == this  ||  
                          ( cfg.curtainSel  &&  targ == $(this).find(cfg.curtainSel)[0] )
                        )
                      )  ||  
                      $(targ).closest(cfg.closebtnSel)[0] 
                    )
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

