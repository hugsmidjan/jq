// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.imgPopper v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson          
//   * Einar Kristján Einarsson  -- einarkristjan (at) gmail.com
//   * Már Örlygsson             -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.2.6 (Runs OK in jQuery 1.3)
//  - eutils  (uses: $.inject() & $.setFocus() )

(function($){

  $.fn.imgPopper = function ( cfg ) {

    cfg = $.extend({
            fadeInSpeed : 250, // set 1 for almost no animation
            fadeOutSpeed : 200, // set 1 for almost no animation
            imgFadeSpeed : false, // fadespeed of popup image, false uses fadeInSpeed, 1 for no animation
            disableIeFading : 0, //disable fading in IE6, 7 & 8 to remove the animate opacity + png24 alpha bug
            setContainerWidth :0, //apply img outerwidth to the container-wrapper
            curtainColor : '#000000',
            curtainOpacity : '0.7',
            easeIn : 'swing',
            easeOut : 'swing',
            yOffset : 0, // offset from window top
            imgClose : false  //close popup when image is clicked
          }, cfg );

    var _navSelectors = 'li.next, li.prev',
        _closeSelectors = 'div.ipopup-container li.close a, div.ipopup-curtain, div.ipopup-container',
        _isOpen = false,
        _hrefElms = this,
        _ypos,
        _langIs = $('html').attr('lang') == 'is',
        _nextText = _langIs ? 'Næsta' : 'Next',
        _prevText = _langIs ? 'Fyrri' : 'Previous',
        _closeText = _langIs ? 'Loka' : 'Close',
        _imageText = _langIs ? 'Mynd' : 'Image',
        _ofTotalText = _langIs ? 'af' : 'of',
        _curtainTemp = '<div class="ipopup-curtain"></div>',
        _popupTemp = '<div class="ipopup-container">' +
            '<div class="ipopup-container-wrapper">' +
              '<a class="focustarget" style="position:absolute;left:auto;right:9999px;" href="#">.</a>' +
              '<div class="image">' +
                '<span class="img"><img src="%{img}" alt="%{alt}" /></span>' +
                '<strong class="title">%{title}</strong>' +
                '<div class="desc">%{alt}</div>' +
              '</div>' +
              '<div class="paging">' +
                '<div class="status">' +
                  '<strong>' + _imageText + '</strong> ' +
                  '<span><b>%{num}</b> ' + _ofTotalText + ' %{total}</span>' +
                '</div>' +
                '<ul class="stepper">' +
                  '<li class="next"><a href="#">' + _nextText + '</a></li>' +
                  '<li class="prev"><a href="#">' + _prevText + '</a></li>' +
                  '<li class="close"><a href="#">' + _closeText + '</a></small></li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
          '</div>';

    if(cfg.disableIeFading && $.browser.msie && parseInt($.browser.version,10) < 9) {
      cfg.fadeInSpeed = 0;
      cfg.fadeOutSpeed = 0;
    };
    
    var _curtain = $(_curtainTemp).hide();


    _hrefElms.bind('click', function (e) {
        var i = _hrefElms.index(this),
            _img = $(this).find('img').length ? $('img', this)[0] : '',

            _makeHTML = $.inject(_popupTemp, /* html to inject into */ {
                img    : $(this).attr('href'),
                title  : _img.title || '',
                alt    : _img.alt || '',
                num    : i+1,
                total  : _hrefElms.length
              }),

            _popup = $(_makeHTML).hide(),

            setWidth = function() {
                var popupImg = _popup.find('img');
                popupImg.each(function() {
                    $(this).bind('load readystatechange', function() {
                        _popup.find('div.ipopup-container-wrapper').css('width', popupImg.outerWidth());
                      });
                    this.src += ''; //IE force readystate hack
                  })
            };



        if(!_isOpen) {
          $('body')
            .append(_curtain)
            .append(_popup);
          _ypos = $(document).scrollTop() + cfg.yOffset;
          _curtain
              .css({'background-color' : cfg.curtainColor, opacity : '0', 'display' : 'block' })
              .animate({ opacity : cfg.curtainOpacity }, (cfg.fadeInSpeed / 2), cfg.easeIn, function(){
                  _popup
                      .css('top', _ypos)
                      .fadeIn(cfg.fadeInSpeed, cfg.easeIn)
                      .find('div.ipopup-container-wrapper')
                          .bind('click', function(e) {
                              if(!cfg.imgClose) {
                                e.stopPropagation();
                              }
                            });
                          //.setFocus();
                  if(cfg.setContainerWidth) { setWidth() };
                }); // animate in
          _isOpen = true;
        } else {
          $('body').append(_popup);
          _popup
              .css('top', _ypos)
              .find('img')
                  .hide()
                  .fadeIn(cfg.imgFadeSpeed || cfg.fadeInSpeed)
              .end()
              .show()
              .find('div.ipopup-container-wrapper')
                  .bind('click', function(e) {
                      if(!cfg.imgClose) {
                        e.stopPropagation();
                      }
                    });
          if(cfg.setContainerWidth) { setWidth() };
        }

        // next/prev buttons
        $(_navSelectors, _popup)
            .each(function(j){
                var idx = i + (j?-1:1);

                if(idx < 0 || idx >= _hrefElms.length)
                {
                  $(this).addClass('nav-end').find('a').removeAttr('href'); // both ends of the popup nav
                }
                else
                {
                  $(this)
                      .bind('click', function (e) {
                          _popup.remove();
                          $(window).unbind('keyup', keynav);
                          _hrefElms.eq(idx).trigger('click');
                          return false;
                        });
                }
              });

        // close popup
        $(_closeSelectors)
            .bind('click', function (e) {
                _popup.fadeOut(cfg.fadeOutSpeed, cfg.easeOut, function(){
                    _curtain.fadeOut(cfg.fadeOutSpeed, cfg.easeOut, function(){
                        $('body > div.ipopup-curtain, body > div.ipopup-container').remove();
                        $(window).unbind('keyup', keynav);
                        //_hrefElms.focus();
                      });
                  }); // animate out
                _isOpen = false;
                return false;
              });


        var keynav = function(e) {
            var keycode = e.keyCode;
            if ( keycode == 27 )
            {
              _curtain.trigger('click'); // close on esc
            }
            if ( keycode == 37 )
            {
              var prevTrigger = $('.paging .prev', _popup);
              prevTrigger.is('.nav-end') ? _curtain.trigger('click') : prevTrigger.trigger('click');  // prev image
            }
            if ( keycode == 39 )
            {
              var nextTrigger = $('.paging .next', _popup);
              nextTrigger.is('.nav-end') ? _curtain.trigger('click') : nextTrigger.trigger('click');  // next image
            }
          };
        $(window).bind('keyup', keynav);


        return false;

      });


    return this;
  };

})(jQuery);