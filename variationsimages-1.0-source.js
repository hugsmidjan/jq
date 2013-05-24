// ----------------------------------------------------------------------------------
// jQuery.fn.variationsImages v 1.0
// ----------------------------------------------------------------------------------
// (c) 2013 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
//  updates the active-state on product images based on the selected variation id
//  (plugs neatly into the Eplica product markup pattern.)
//
//  Depends on:
//    jQuery 1.7
//
(function($){

  var dataKey = 'variationimages-',
      pluginFunc;

  $.fn.variationsImages = pluginFunc = function ( cfg ) {
      cfg = $.extend({}, pluginFunc.defaults, cfg);
      this
          .addClass( cfg.containerClass  )
          .on('variationchanged', function ( e, variationId ) {
              variationId = variationId==='' ? null : variationId;  // treat empty-string ids as null

              var imgContainer = $(this),
                  images = imgContainer.find( cfg.itemSelector ),

                  defaultImgs = [],
                  activeImgs = images.filter(function () {
                      var imgItem = $(this),
                          variations = imgItem.attr( cfg.varAttr ),
                          isActive =  variations ?
                                          $.inArray( variationId,  variations.split(cfg.varDelim) ) > -1:
                                          variationId == null;  // images with no variations defined -- are automatically active when variationId is undefined

                      !variations  &&  defaultImgs.push( imgItem[0] );
                      imgItem.toggleClass( cfg.disabledClass, !isActive );
                      // initiate virgin imgs
                      if ( (cfg.activateAll||isActive)  &&  !imgItem.data( dataKey+'init' ) )
                      {
                        imgItem.data( dataKey+'init', true);
                        cfg.onFirstActivate  &&  cfg.onFirstActivate(imgItem);
                      }
                      return isActive;
                    });

              if ( !activeImgs[0]  &&  variationId!=null )
              {
                $( defaultImgs ).removeClass( cfg.disabledClass );
              }
              if ( cfg.clickFirstImg  &&  (activeImgs[0] || imgContainer.data( dataKey+'first' )) )
              {
                imgContainer.data( dataKey+'first', true );
                $( activeImgs[0]||defaultImgs[0] ).trigger('click');
              }
            });
      return this;
    };


  pluginFunc.defaults = {
      itemSelector:       '>*',         // sub-selector inside imgCont - to find the image items (default + for each variation)
      containerClass:  'variated',
      disabledClass:   'disabled',     // classname for items (see. itemSelector) that are inactive
      // turns simpler image links into proper thumbnail images right before `variationImageActive`
      varAttr: 'data-forvariation',
      varDelim: '|',
      onFirstActivate:   function (imgLi) {
          if ( !imgLi.is('.image') )
          {
            var link = imgLi.find('a');
            imgLi.addClass('image');
            link.addClass('img');
            $('<img/>')
                .attr({
                    src: link.attr('data-img'),
                    alt: link.text()
                  })
                .appendTo( link.empty() );
          }
        },
      initAll: false, // true causes items to be initialized immediately - instead of only when they become "active" for the first time.
      clickFirstImg: !!$.fn.bigimgSwitcher // flags whether first :visible imgItem should be 'clicked' to trigger `newbigimg`
    };

})(jQuery);


