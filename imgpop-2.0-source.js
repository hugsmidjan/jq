// ----------------------------------------------------------------------------------
// jQuery.fn.imgPopper v 2.0
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.7
//  - eutils 1.2
//  - fickle 2.0
//  - getmodal 1.1

(function($){

  $.imgPopper = {

    version: 2.0,

    defaultConfig: {
        fadeInSpeed : 250, // set 1 for almost no animation
        fadeOutSpeed : 200 // set 1 for almost no animation
    },

    i18n: {
      en: {
        nextText:    'Next',
        prevText:    'Previous',
        closeText:   'Close',
        imageText:   'Image',
        ofTotalText: 'of'
      },
      is: {
        nextText:    'Næsta',
        prevText:    'Fyrri',
        closeText:   'Loka',
        imageText:   'Mynd',
        ofTotalText: 'af'
      }
    },

    imgTempl :    '<div class="image">' +
                    '<span class="img"><img src="%{img}" alt="%{alt}" /></span>' +
                    '<strong class="title">%{title}</strong>' +
                    '<div class="desc">%{alt}</div>' +
                  '</div>',

    pagingTempl : '<div class="status">' +
                    '<strong>%{imageText}</strong> ' +
                    '<span><b class="count">%{num}</b> %{ofTotalText} %{total}</span>' +
                  '</div>' +
                  '<ul class="stepper">' +
                    '<li class="next"><a href="#">%{nextText}</a></li>' +
                    '<li class="prev"><a href="#">%{prevText}</a></li>' +
                  '</ul>'
  };

  var getImage = function( images, currentPos ) {
        var curImg = images.eq(currentPos),
            preloader = $('<img />');

        if (currentPos != 0)
        {
          preloader.attr('src', images.eq( currentPos - 1 ).attr('href') ); // preload prev
        }
        else if (currentPos != images.length-1)
        {
          preloader.attr('src', images.eq( currentPos + 1 ).attr('href') ); // preload next
        }

        return $.inject($.imgPopper.imgTempl, {
                                img   : curImg.attr('href'),
                                alt   : curImg.find('img').attr('alt')   || '',
                                title : curImg.find('img').attr('title') || ''
                              });
      },

      refreshPaging = function ( currentPos, imgCount, pager ) {
        pager.find('.nav-end').removeClass('nav-end');
        if ( currentPos == 0 )
        {
          pager.find('.prev').addClass('nav-end');
        }
        else if (currentPos == imgCount - 1)
        {
          pager.find('.next').addClass('nav-end');
        }
        pager.find('.count').text( currentPos + 1  );
      };

  $.fn.imgPopper = function ( cfg ) {

    var _i18n = $.imgPopper.i18n,
        _hrefElms = this,
        _idx,
        _img,
        _modal,
        _paging = $('<div class="paging" />'),
        _imgPop = $('<div class="imgwrap" />');

    _i18n = _i18n[ $.lang() ] || _i18n.en;
    cfg = $.extend({}, $.imgPopper.defaultConfig, _i18n, cfg );

    _hrefElms.on('click', function (e) {
        _img = $(this);
        _idx = _hrefElms.index(_img);

        _paging
            .empty()
            .append(
                $.inject($.imgPopper.pagingTempl, {
                              imageText   : cfg.imageText,
                              ofTotalText : cfg.ofTotalText,
                              nextText    : cfg.nextText,
                              prevText    : cfg.prevText,
                              total       : _hrefElms.length,
                              num         : _idx + 1
                            })
              );
        refreshPaging( _idx, _hrefElms.length, _paging );

        _imgPop
            .empty()
            .append( getImage( _hrefElms, _idx ) )
            .append( _paging );

        _modal = $.getModal({
                    opener:  _img,
                    content: _imgPop,
                    fickle: {
                        fadein:  cfg.fadeInSpeed,
                        fadeout: cfg.fadeOutSpeed
                      }
                  });

        _modal.addClass('imgpopper').fickle('open');

        _paging
            .delegate('li', 'click', function (e) {
                if ( $(this).is('.next') )
                {
                  _idx = _idx != _hrefElms.length - 1 ? _idx + 1 : _idx;
                }
                else
                {
                  _idx = _idx != 0 ? _idx - 1 : _idx;
                }

                refreshPaging( _idx, _hrefElms.length, _paging );

                _imgPop.find('.image').replaceWith( getImage( _hrefElms, _idx  ) );
                e.preventDefault();
              });

        e.preventDefault();
      });

    var keynav = function(e) {
        var keycode = e.which;
        if ( keycode == 27 ) // close on esc
        {
          _modal.fickle('close');
        }
        if ( keycode == 37 ) // prev image
        {
          _paging.find('.prev').trigger('click');
        }
        if ( keycode == 39 ) // next image
        {
          _paging.find('.next').trigger('click');
        }
      };
    $(window).on('keyup', keynav);

    return this;
  };

})(jQuery);