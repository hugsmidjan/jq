// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.bigimgSwitcher v 1.0
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
//  Live switches a list of image thumbnails to display a big image.
//  (plugs neatly into the Eplica product/article .imagebox markup pattern.)
//
//  Depends on:
//    jQuery 1.7
//
(function($){

  $.fn.bigimgSwitcher = function (cfg) {
      cfg = $.extend({
                itemSelector:  'li',           // selector to find (thumbnail) list items
                cloneSelector: '>*',           // selector used to find the element to clone inside each item
                currentClass:  'current',      // className applied to the current (thumbnail) list item
                bigimgTmpl:    '<div class="bigimage"><a class="img"/></li>',
                //insertElm:     null,         // Selector/Element. Defaults to the container itself.
                insertion:     'before',       // method used for inserting bigimgTmpl relative to insertElm
                bigSrc:        'data-medimg',  // attr-name on the cloned element or a
                                               // function (clonedElm) { return 'bigimgSrcUrl'; }
                bigimgReplace: '.img',         // selector for the item inside bigimgTmpl that should be replaced
                hideSingles:   true            // hide (remove) thumbnails lists with only one item
              }, cfg);

      return this.each(function () {

            var container = $(this),
                imgItems = container.find( cfg.itemSelector ),
                bigImgItem = $( cfg.bigimgTmpl ),
                lastCurrent,
                switchBigimg = function (e) {
                    e && e.preventDefault();
                    if ( lastCurrent != this )
                    {
                      var clickedItem = $(this),
                          clonedElm = clickedItem.find( cfg.cloneSelector ).clone(),
                          newSrc =  $.isFunction(cfg.bigSrc) ?
                                        cfg.bigSrc(clonedElm):
                                        clonedElm.attr( cfg.bigSrc );
                          //zoomUrl = imgLink.attr('href');

                      if ( newSrc )
                      {
                        var img = clonedElm.is('img') ? clonedElm : clonedElm.find('img');
                        img.attr('src', newSrc);
                      }

                      clickedItem.addClass( cfg.currentClass );
                      lastCurrent && $(lastCurrent).removeClass( cfg.currentClass );
                      lastCurrent = clickedItem[0];

                      bigImgItem.find( cfg.bigimgReplace )
                          .replaceWith( clonedElm );

                      container
                          .trigger('newbigimg', [{
                              cfg:cfg,
                              item:clickedItem,
                              bigimg:bigImgItem
                            }]);
                    }
                  };

            // insert the bigElm
            $( !cfg.insertElm ? container : cfg.insertElm.charAt ? container.find(cfg.container) : cfg.insertElm )
                [cfg.insertion]( bigImgItem );

            container
                .on('click.makeBig', cfg.itemSelector, switchBigimg);

            container.find( cfg.itemSelector ).first()
                    .each(switchBigimg);

          if ( cfg.hideSingles  &&  imgItems.length == 1 )
          {
            imgItems.remove();
          }
        });
    };

})(jQuery);