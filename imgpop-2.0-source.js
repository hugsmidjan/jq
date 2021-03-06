/* $.imgPopper 2.0  -- (c) 2017 Hugsmiðjan ehf.  @preserve */
// ----------------------------------------------------------------------------------
// jQuery.fn.imgPopper v 2.0
// ----------------------------------------------------------------------------------
// (c) 2017 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.8
//  - eutils 1.2
//  - x/hammer 1.1
//  - fickle 2.0
//  - getmodal 1.1

(function($) {

  $.imgPopper = {

    version: 2.0,

    defaultConfig: {
        modalClass: 'imgpopper',
        fadeInSpeed : 250, // set 1 for almost no animation
        fadeOutSpeed : 200, // set 1 for almost no animation
        marginTop: undefined, // set custom marginTop pos (Integer/Function). Defaults to win.scrollTop. null to disable.
        preloadImages : true, // set to false to disable preloading images in popup,
        ficle: {}, // extra fickle config
    },

    i18n: {
      en: {
        nextText:    'Next',
        prevText:    'Previous',
        closeText:   'Close',
        imageText:   'Image',
        ofTotalText: 'of',
      },
      is: {
        nextText:    'Næsta',
        prevText:    'Fyrri',
        closeText:   'Loka',
        imageText:   'Mynd',
        ofTotalText: 'af',
      },
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

    getImage : function ( linkElm ) {
        return $.inject(this.imgTempl, {
                    img   : linkElm.attr('href'),
                    alt   : linkElm.find('img').attr('alt') || linkElm.find('ins.image').data('alt') || '',
                    title : linkElm.find('img').attr('title') || linkElm.find('ins.image').data('title') || '',
                  });
      },
  };

  $.fn.imgPopper = function ( cfg ) {
    var _i18n = $.imgPopper.i18n;
    _i18n = _i18n[ $.lang() ] || _i18n.en;
    cfg = $.extend({}, $.imgPopper.defaultConfig, _i18n, cfg );

    var _hrefElms = this;
    var _idx;
    var _img;
    var _modal;

    var _updPager = function (pager, idx, total) {
      pager.find('li.prev').toggleClass( 'nav-end', !idx ); // at start
      pager.find('li.next').toggleClass( 'nav-end', idx===total-1 ); // at end
      pager.find('b').text( idx + 1 );
    };

    var _pageFunc = function (imgPop, idx, delta) {
          var newIdx = Math.min( Math.max( 0, idx+delta ), _hrefElms.length-1 );
          if ( newIdx !== idx) {
            _idx = newIdx;
            imgPop.find('.image').replaceWith( $.imgPopper.getImage( _hrefElms.eq(_idx) ) );
            _updPager(imgPop.find('.paging'), _idx, _hrefElms.length);

            if (cfg.preloadImages) {
              // preload ajacent images
              if (_idx !== 0) { (new Image()).src = _hrefElms[_idx-1].href; } // at start
              if (_idx !== _hrefElms.length-1)   { (new Image()).src = _hrefElms[_idx+1].href; } // at end
            }
          }
    };


    _hrefElms.on('click', function (e) {
        e.preventDefault();
        _img = $(this);
        _idx = _hrefElms.index(_img);
        var _paging = $('<div class="paging" />');
        var _imgPop = $('<div class="imgwrap" />');

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

        _updPager(_paging, _idx, _hrefElms.length);

        _imgPop
            .empty()
            .append( $.imgPopper.getImage( _hrefElms.eq(_idx) ) )
            .append( _paging )
            .hammer()
            .on('swipeleft', function (/* e */) {
              _pageFunc(_imgPop, _idx, 1);
            })
            .on('swiperight', function (/* e */) {
              _pageFunc(_imgPop, _idx, -1);
            });

        _modal = $.getModal({
                    opener:  _img,
                    className: cfg.modalClass,
                    marginTop: cfg.marginTop,
                    content: _imgPop,
                    fickle: $.extend({
                        fadein:  cfg.fadeInSpeed,
                        fadeout: cfg.fadeOutSpeed,
                        onClosed: function(){
                            $(window).off('keyup.imgpopper');
                            $(this).remove();
                          }
                      }, cfg.fickle)
                  });
        _modal.fickle('open');

        $(window)
            .on('keyup.imgpopper', function (e) {
                var delta = e.which === 37 ? // LEFT arrow == prev image
                              -1 :
                            e.which === 39 ? // RIGHT arrow == next image
                              1:
                              0;
                _pageFunc(_imgPop, _idx, delta);
              });

        _paging
            .on('click', 'li', function (e) {
                e.preventDefault();
                var delta = $(this).is('.next') ? 1 : -1;
                _pageFunc(_imgPop, _idx, delta);
              });
      });


    return this;
  };

})(jQuery);