// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.imgPopper v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.4
//  - fickle
//  - curtain

// appends a box to the body and pops it up with a curtain and fickle events
// Usage:
//  - $('a.popup').boxPopper();

(function($){

  $.fn.boxPopper = function ( cfg ) {
      var popupElm = this;
      if ( popupElm.length) {
        
        cfg = $.extend({
                topOffset: 50,
                removeOnClose: false,
                curtainColor: '#000000',
                curtainOpacity: '.70',
                curtainFixed: true,
              }, cfg );
        
        var curtainElm = $.curtain({
                    className: 'popup-curtain',
                    bg:        cfg.curtainColor,
                    opacity:   cfg.curtainOpacity,
                    fixed:     cfg.curtainFixed
                  }),
            lang = popupElm.lang(),
            closeText = lang == 'is' ? 'Loka' : 'Close';
        popupElm
            .hide()
            .appendTo('body')
            .addClass('popupblock')
            .before(curtainElm)
            .css({
                  top:        cfg.topOffset + $(window).scrollTop(),
                  marginLeft: - parseInt( popupElm.outerWidth() ) / 2
                })
            .fickle({
                fadein: 350,
                onOpen:   function (e) { curtainElm.fadeIn(100);  },
                onClose:  function (e) { popupElm.fadeOut(200, function() { curtainElm.fadeOut(100); }); },
                onClosed: function (e) { if (cfg.removeOnClose) { curtainElm.remove(); popupElm.remove(); } }
              })
            .append('<a class="close" href="#">'+ closeText +'</a>')
            .find('a.close')
                .bind('click', function (e) {
                    popupElm.fickle('close');
                    return false;
                  })
            .end()
            .fickle('open');
        curtainElm.bind('click', function (e) { popupElm.fickle('close'); });
      }
      return popupElm;
  };

})(jQuery);