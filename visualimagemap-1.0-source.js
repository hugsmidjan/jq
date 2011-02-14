// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.visualImageMap v 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

(function($, visualImageMap, undefined){

  $.fn[visualImageMap] = function ( cfg ) {
      cfg = $.extend({
            overlay: '<div class="imgoverlay" />',
            area:     '<a class="area"/>'
          }, cfg );

      this
          .each(function () {
              var img = $(this),
                  mapName = (img.attr('usemap')||'').substr(1),
                  mapElm = mapName ? $('map[name="'+ mapName +'"]').detach() : [];
              if ( mapElm[0] )
              {
                img
                    .removeAttr('usemap')
                    .one('load', function (e) {
                        var areaOffs,
                            protoArea = $(cfg.area),
                            imgOverlay = $(cfg.overlay)
                                .insertAfter(img)
                                .css({
                                    position: 'absolute',
                                    top:      img.position().top,
                                    left:     img.position().left
                                    // apply no width/height dimentions to allow direct clicks on the image...
                                  });

                        mapElm.find('area')
                            .each(function (i) {
                                var area = $(this),
                                    labelText = area.attr('title'),
                                    xys = $.map( area.attr('coords').split(','), function ( val ) {
                                        return parseInt( val, 10 );
                                      });
                                    areaElm = protoArea.clone(true);
                                if ( !areaOffs )
                                {
                                  areaElm
                                      .prependTo( imgOverlay ); // insert into the DOM to allow margin measurements
                                  areaOffs = [
                                      parseInt(areaElm.css('margin-left'), 10)||0,  // x offset
                                      parseInt(areaElm.css('margin-top'), 10)||0    // y offset
                                    ];
                                }
                                areaElm
                                    .text( labelText )
                                    .attr({
                                        href:  area.attr('href'),
                                        title: labelText
                                      })
                                    .css({
                                        position: 'absolute',
                                        left:     xys[0] + areaOffs[0],
                                        top:      xys[1] + areaOffs[1],
                                        width:    xys[2] - xys[0],
                                        height:   xys[3] - xys[1]
                                      })
                                    .prependTo( imgOverlay );
                              });
                      });
                if ( img[0].width )
                {
                  img.trigger( 'load' );
                }
              }
            });
      return this;
    };

})(jQuery, 'visualImageMap');
