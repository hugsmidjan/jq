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
            area:    '<a class="area"/>'
          }, cfg );

      this
          .each(function () {
              var img = $(this),
                  mapName = (img.attr('usemap')||'').substr(1),
                  mapElm = mapName ? $('map[name="'+ mapName +'"]').detach() : img.data('usemapElm') || [];
              if ( mapElm[0] )
              {
                $( img.data('usemapoverlay') || [] ).remove();

                img
                    .removeAttr('usemap')
                    .data( 'usemapElm', mapElm )
                    .one('load', function (e) {
                        var realImgW = parseInt(img.attr('width'), 10) || img.clone().appendTo('body').width(),
                            realImgH = parseInt(img.attr('height'), 10) || img.clone().appendTo('body').height(),
                            scaleX    = img.width() / realImgW,
                            scaleY    = img.height() / realImgH,
                            areaOffs,
                            protoArea = $(cfg.area),
                            imgOverlay = $(cfg.overlay)
                                .insertAfter(img)
                                .css({
                                    position: 'absolute',
                                    top:      img.position().top  + parseFloat(img.css('padding-top'))  + parseFloat(img.css('border-top-width')),
                                    left:     img.position().left + parseFloat(img.css('padding-left')) + parseFloat(img.css('border-left-width'))
                                    // apply no width/height dimentions to allow direct clicks on the image...
                                  });
                        img.data('usemapoverlay', imgOverlay);

                        mapElm.find('area')
                            .each(function (i) {
                                var area = $(this),
                                    labelText = area.attr('title'),
                                    xys = $.map( area.attr('coords').split(','), function ( val, i ) {
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
                                        left:     xys[0]*scaleX + areaOffs[0],
                                        top:      xys[1]*scaleY + areaOffs[1],
                                        width:    (xys[2] - xys[0]) * scaleX,
                                        height:   (xys[3] - xys[1]) * scaleY
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
