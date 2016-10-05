// ----------------------------------------------------------------------------------
// jQuery.fn.imgPopper v 2.0
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.8
//  - eutils 1.2
//  - fickle 2.0
//  - getmodal 1.1

(function($){

  $.imgPopper = {

    version: 2.0,

    defaultConfig: {
        fadeInSpeed : 250, // set 1 for almost no animation
        fadeOutSpeed : 200, // set 1 for almost no animation
        preloadImages : true // set to false to disable preloading images in popup
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
        _imgPop = $('<div class="imgwrap" />'),

        _updPager = function (pager, idx, total) {
          pager.find('li.prev').toggleClass( 'nav-end', !idx ); // at start
          pager.find('li.next').toggleClass( 'nav-end', idx===total-1 ); // at end
          pager.find('b').text( idx + 1 );
        };

    _i18n = _i18n[ $.lang() ] || _i18n.en;
    cfg = $.extend({}, $.imgPopper.defaultConfig, _i18n, cfg );

    _hrefElms.on('click', function (e) {
        e.preventDefault();
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

        _updPager(_paging, _idx, _hrefElms.length);

        _imgPop
            .empty()
            .append( $.imgPopper.getImage( _hrefElms.eq(_idx) ) )
            .append( _paging );

        _modal = $.getModal({
                    opener:  _img,
                    className: 'imgpopper',
                    content: _imgPop,
                    fickle: {
                        fadein:  cfg.fadeInSpeed,
                        fadeout: cfg.fadeOutSpeed,
                        onClosed: function(){
                            $(window).off('keyup.imgpopper');
                            $(this).remove();
                          }
                      }
                  })
                    .fickle('open');

        $(window)
            .on('keyup.imgpopper', function(e) {
                e.which===37 ? // LEFT arrow == prev image
                    _paging.find('.prev').trigger('click'):
                e.which===39 ? // RIGHT arrow == next image
                    _paging.find('.next').trigger('click'):
                    null;
              });

        _paging
            .on('click', 'li', function (e) {
                e.preventDefault();
                var li = $(this);
                if ( !li.is('.nav-end') )
                {
                  var delta = li.is('.next') ? 1 : -1;
                  _idx = Math.min( Math.max( 0, _idx+delta ), _hrefElms.length-1 );
                  _imgPop.find('.image').replaceWith( $.imgPopper.getImage( _hrefElms.eq(_idx) ) );
                  _updPager(_paging, _idx, _hrefElms.length);

                  if (cfg.preloadImages)
                  {
                    // preload ajacent images
                    if (_idx !== 0) { (new Image()).src = _hrefElms[_idx-1].href; } // at start
                    if (_idx !== _hrefElms.length-1)   { (new Image()).src = _hrefElms[_idx+1].href; } // at end
                  }
                }
              });
      });


    return this;
  };

})(jQuery);