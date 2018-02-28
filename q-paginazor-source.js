/* $.fn.paginazor  -- (c) 2018 Hugsmiðjan ehf.  @preserve */
// Valur Sverrisson

// Requires:
//  - jQuery 1.9+
//  - eutils  (uses: $.lang() )
//  - whenonscreen  (used for infinityload and loadLazyImages)

// Usage:
// $('.articlelist .boxbody').paginazor();

(function($) {

    var defaultCfg = {
          pagingSel: '.paging',
          triggerSel: '.next a',
          ajaxSel: '.articlelist .boxbody',
          itemSel: '> *:not(h2)',

          loadingClassTarget: 'html',
          loadLazyImages: false,
          infinityLoad: false, // true, false, 'notfirst'

          loadMoreText: $.lang() === 'is' ? 'Hlaða fleiri greinum' : 'Load more articles',
        };

    var _paginazor = function (paginglist, cfg) {
            var infinityloadFirst = cfg.infinityLoad && cfg.infinityLoad !== 'notfirst';

            if ( cfg.loadLazyImages ) {
              _loadLazy(paginglist.find(cfg.itemSel));
            }
            _updatePager(paginglist.find(cfg.pagingSel), infinityloadFirst, cfg);

            paginglist.on('click.loadmore', (cfg.pagingSel + ' ' + cfg.triggerSel), function (e) {
              e.preventDefault();
              !cfg.infinityLoad && $(cfg.loadingClassTarget).addClass('ajax-wait');

              $.get(
                  $(this).attr('href'),
                  'justPicPos=pgmain'
                )
                .done(function(data) {
                    data = $(data).find(cfg.ajaxSel + ' ' + cfg.itemSel);
                    paginglist.find(cfg.pagingSel).replaceWith(data);
                    if ( cfg.loadLazyImages ) {
                      _loadLazy(data);
                    }
                    _updatePager(paginglist.find(cfg.pagingSel), cfg.infinityLoad, cfg);
                  })
                .always(function() {
                    $(cfg.loadingClassTarget).removeClass('ajax-wait');
                  });

            });
        };

    var _updatePager = function ($paging, infinityload, cfg) {
            if ( !$paging.find(cfg.triggerSel).length ) {
              $paging.remove();
            }
            else {
              $paging.addClass('pagelist-active');
              $paging.find(cfg.triggerSel).text(cfg.loadMoreText);
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
                  console.log( $(this).attr('data-src') );
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
