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
                  '</ul>',

    getImage : function( linkElm ) {
        return $.inject(this.imgTempl, {
                    img   : linkElm.attr('href'),
                    alt   : linkElm.find('img').attr('alt')   || '',
                    title : linkElm.find('img').attr('title') || ''
                  });
      }
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
                              num         : _idx+1
                            })
              );
        _paging.find('b').text(_idx + 1  );

        _imgPop
            .empty()
            .append( $.imgPopper.getImage( _hrefElms.eq(_idx) ) )
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
                var li = $(this);
                if ( !li.is('.nav-end') )
                {
                  var delta = li.is('.next') ? 1 : -1;
                  _idx = Math.min( Math.max( 0, _idx+delta ), _hrefElms.length-1 );
                  var atStart = !_idx,
                      atEnd = _idx===_hrefElms.length-1;

                  _imgPop.find('.image').replaceWith( $.imgPopper.getImage( _hrefElms.eq(_idx) ) );
                  _paging.find('li.prev').toggleClass( 'nav-end', atStart );
                  _paging.find('li.next').toggleClass( 'nav-end', atEnd );
                  _paging.find('b').text( _idx + 1  );
                  // preload ajacent images
                  if (!atStart) { (new Image()).src = _hrefElms[_idx-1].href; }
                  if (!atEnd)   { (new Image()).src = _hrefElms[_idx+1].href; }
                }
                e.preventDefault();
              });

        e.preventDefault();
      });

    $(window)
        .on('keyup', function(e) {
            var keycode = e.which;
            keycode===27 ? // close on esc
                _modal.fickle('close'):
            keycode===37 ? // LEFT arrow == prev image
                _paging.find('.prev').trigger('click'):
            keycode===39 ? // RIGHT arrow == next image
                _paging.find('.next').trigger('click'):
                null;
          });

    return this;
  };

})(jQuery);