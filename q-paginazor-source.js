/* $.fn.paginazor  -- (c) 2018 Hugsmiðjan ehf.  @preserve */
// Valur Sverrisson

// Requires:
//  - jQuery 1.9+
//  - eutils  (uses: $.lang() focusHere() )
//  - whenonscreen  (used for infinityload and loadLazyImages)

// Usage:
// $('.articlelist .boxbody').paginazor();

(function($) {

    var defaultCfg = {
          pagingSel: '> .paging',
          triggerSel: '.next a',
          ajaxSel: '.articlelist .boxbody',
          itemSel: '> .item',
          ajaxParams: 'justPicPos=pgmain',

          loadingClassTarget: 'html',
          loadLazyImages: false,
          infinityLoad: false, // true, false, 'notfirst'
          showPagesLeft: false,

          maintainStatusOnBack: true,
          clearStatusSelector: 'a:not(.pgmain a)',
          articleIdAttr: 'data-aid',
          scrollOffset: 100,
          scrollSpeed: 250,

          pagesLeftText: $.lang() === 'is' ? 'síður eftir' : 'pages left',
          loadMoreText: $.lang() === 'is' ? 'Hlaða fleiri greinum' : 'Load more articles',
        };

    var _ss = window.sessionStorage;

    // used for cfg.maintainStatusOnBack
    var _target = JSON.parse(_ss.getItem('pagingTarget'));
    var _targetPage = _target && parseInt(_target.pageNo, 10);
    var _targetItem = _target && _target.itemNo;
    var _paginazor = function (paginglist, cfg) {
            var infinityloadFirst = cfg.infinityLoad && cfg.infinityLoad !== 'notfirst';
            var page = 1;

            if ( cfg.loadLazyImages ) {
              _loadLazy(paginglist.find(cfg.itemSel));
            }
            _updatePager(paginglist.find(cfg.pagingSel), infinityloadFirst, cfg);

            paginglist.on('click.loadmore', (cfg.pagingSel + ' ' + cfg.triggerSel), function (e) {
              e.preventDefault();
              $(cfg.loadingClassTarget).addClass('ajax-wait');
              page++;

              $.get(
                  $(this).attr('href'),
                  cfg.ajaxParams
                )
                .done(function(data) {
                    data = $(data).find(cfg.ajaxSel).find(cfg.itemSel+','+cfg.pagingSel);
                    paginglist.find(cfg.pagingSel).replaceWith(data);

                    if ( cfg.loadLazyImages ) {
                      _loadLazy(data);
                    }
                    paginglist.trigger('listupdated', [{itemlist: data, page: page}]);

                    _updatePager(paginglist.find(cfg.pagingSel), cfg.infinityLoad, cfg);

                    if ( cfg.maintainStatusOnBack ) {
                      if ( _targetPage > page ) {
                        paginglist.find(cfg.pagingSel + ' ' + cfg.triggerSel).trigger('click.loadmore');
                      }
                      else if ( _targetPage === page ) {
                        var scrollTarget = paginglist.find('.item[data-aid="' + _targetItem + '"]');
                        if( scrollTarget.length ) {
                          var scrollpos = scrollTarget.offset().top - cfg.scrollOffset;
                          $('html, body').animate({ scrollTop: scrollpos }, cfg.scrollSpeed);
                          scrollTarget.focusHere();
                        }
                      }
                    }
                  })
                .always(function() {
                    $(cfg.loadingClassTarget).removeClass('ajax-wait');
                  });

            });

            if ( cfg.maintainStatusOnBack ) {
              paginglist.on('click.setstatus', cfg.itemSel, function () {
                var aid = $(this).attr(cfg.articleIdAttr);
                _ss.setItem('pagingTarget', JSON.stringify({pageNo: page, itemNo: aid}));
              });

              if ( _targetPage > page ) {
                paginglist.find(cfg.pagingSel + ' ' + cfg.triggerSel).trigger('click.loadmore');
              }

              // try to clear the paging storage when user clicks on someting not in the paging feed and related articles
              $(document).on('click', cfg.clearStatusSelector, function () {
                _ss.removeItem('pagingTarget');
              });
            }
        };

    var _updatePager = function ($paging, infinityload, cfg) {
            if ( !$paging.find(cfg.triggerSel).length ) {
              $paging.remove();
            }
            else {
              $paging.addClass('pagelist-active');
              var pageBtnText = cfg.loadMoreText;

              if ( cfg.showPagesLeft ) {
                var statusNums = $paging.find('.status').text().match(/\d+/g);
                if ( statusNums && statusNums[1] ) {
                  var pagesLeft = parseInt(statusNums[1], 10) - parseInt(statusNums[0], 10);
                  pageBtnText += ' <span>'+ pagesLeft + ' ' + cfg.pagesLeftText +'</span>';
                }
              }

              $paging.find(cfg.triggerSel).html(pageBtnText);
            }

            if ( infinityload ) {
              $paging
                .on('whenonscreen', function () {
                    $paging.find(cfg.triggerSel).trigger('click.loadmore');
                  })
                .whenOnScreen({ live: true, ranges: { visible: { top: '75%s' } } });
            }
      };

    var _loadLazy = function( listItems ) {
            listItems.find('ins.image')
                .on('whenonscreen', function () {
                    $(this)
                        .off('whenonscreen')
                        .css({ 'background-image': 'url('+$(this).attr('data-src')+')' })
                        .parent()
                            .addClass('lazy-loaded');
                  })
                .whenOnScreen({ live: true });
      };

  $.fn.paginazor = function (cfg) {
      cfg = $.extend(defaultCfg, cfg);
      return this.each(function() {
          _paginazor( $(this), cfg );
        });
    };

})(jQuery);
