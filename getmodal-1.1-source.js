// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.getModal v 1.1
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
//  Provides basic modal popup UI service on top of $.fn.fickle and
//  with close button, and curtain element
//
//
//  Depends on:
//    $.fn.fickle  v2.0
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

(function( $, undef, getModal ){

    getModal = $.getModal = function (cfg) {
        cfg = $.extend({}, getModal.defaults, cfg );
        var popup = $( cfg.template );

        var lang = $( cfg.opener || 'html' ).closest('[lang]').attr('lang') || 'en',
            closeBtn = popup.find( cfg.closebtnSel ),
            txt = getModal.i18n;
        txt = txt[ lang.substr(0,2) ] || txt.en;

        closeBtn
            .attr( 'title', txt.closeT||txt.close )
            .html( txt.close||txt.closeT );

        if ( cfg.content )
        {
          popup.find( cfg.bodySel )
              .append( cfg.content );
        }
        popup
            .data('popclosebtn', closeBtn)
            .data('popbody', popup.find( cfg.bodySel ))
            .addClass( cfg.className )
            .on('click', function (e) {
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
            .on('fickleopen', function (/* e */) {
                $(this).appendTo( cfg.appendTo || 'body' );
                if ( cfg.marginTop !== null  )
                {
                  var marginTop = cfg.marginTop;
                  marginTop = (marginTop===undef) ?
                                  $(window).scrollTop():
                              $.isFunction(marginTop) ?
                                  marginTop.call(this):
                                  marginTop;
                  $(this).find(cfg.winSel)
                      .css( 'margin-top', marginTop );
                }
              })
            .fickle(
                $.extend({
                    focusElm: cfg.winSel,
                    onClosed: function (/* e */) {
                        popup.remove();
                      }
                  },
                  cfg.fickle,
                  {
                    opener:      cfg.opener
                  })
              );

        lang = closeBtn = txt = undef;

        return popup;
      };



    getModal.defaults = {
        // modal:    false,   // Boolean: `true` prevents direct clicks on the .modalpop (curtain/container) from closing the modal.
        // className: '',     // String: additional class-name for the (outermost) modal container
        // content:   '',     // String/Elements - initial HTML content for the "body" element (as defined by the `bodySel` setting below)
        // marginTop: '',     // Integer/Function: specifies the margin-top value set to the "window" element (see `winSel` setting below)
                              // defaults to $(window).scrollTop() - unless explicitly set to `null`
        // appendTo:  'body', // Selector|Element: to which to append the modal
        // opener:    ''      // shortcut for fickle:{ opener:... } -- i.e. the button/element to which the focus should return when the modal closes
        // fickle:  ''        // $.fn.fickle configuration
        template: '<div class="modalpop">'+
                    '<span class="curtain"/>'+
                    '<div class="popwin">'+
                      '<div class="popbody"/>'+
                      '<a class="closebtn" href="#"/>'+
                    '</div>'+
                  '</div>',
        curtainSel:  '.curtain',    // Selector: describing the "curtain" element - defaults to '' - i.e. the .modalpop container itself.
        winSel:      '.popwin',
        bodySel:     '.popbody',
        closebtnSel: '.closebtn'
      };
    
    getModal.i18n = {
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

