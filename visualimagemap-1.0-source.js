// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.visualImageMap v 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

(function($, undefined){
  var visualImageMap = 'visualImageMap',
      toFloat = parseFloat,
      toInt = parseInt,
      usemap = 'usemap';

  $.fn[visualImageMap] = function ( cfg ) {
      cfg = $.extend({
            overlay: '<div class="imgoverlay" />',
            area:    '<a class="area"/>'
          }, cfg );

      this
          .each(function () {
              var img = $(this),
                  mapName = (img.attr(usemap)||'').substr(1),
                  mapElm = mapName ? $('map[name="'+ mapName +'"]').detach() : img.data(usemap+'Elm') || [];
              if ( mapElm[0] )
              {
                $( img.data(usemap+'overlay') || [] ).remove();

                img
                    .removeAttr(usemap)
                    .data( usemap+'Elm', mapElm )
                    .one('load', function (e) {
                        var clone,
                            realDim = mapElm.data(usemap+'Sz') || [],
                            realImgW = realDim[0] || toInt(img.attr('width'), 10)  || (clone = img.clone().appendTo('body')).width(),
                            realImgH = realDim[1] || toInt(img.attr('height'), 10) || (clone = (clone || img.clone().appendTo('body'))).height(),
                            scaleX    = img.width() / realImgW,
                            scaleY    = img.height() / realImgH,
                            areaOffs,
                            protoArea = $(cfg.area),
                            imgOverlay = $(cfg.overlay)
                                .insertAfter(img)
                                .css({
                                    position: 'absolute',
                                    top:      img.position().top  + toFloat(img.css('padding-top'))  + toFloat(img.css('border-top-width')),
                                    left:     img.position().left + toFloat(img.css('padding-left')) + toFloat(img.css('border-left-width'))
                                    // apply no width/height dimentions to allow direct clicks on the image...
                                  });
                        clone  &&  clone.detach();
                        img.data(usemap+'overlay', imgOverlay);

                        mapElm.data( usemap+'Sz', [realImgW, realImgH] ); // store these away, in case the img[width|height] attributes get mangled later
                        mapElm.find('area')
                            .each(function (i) {
                                var area = $(this),
                                    labelText = area.attr('title'),
                                    xys = $.map( area.attr('coords').split(','), function ( val, i ) {
                                        return toInt( val, 10 );
                                      });
                                    areaElm = protoArea.clone(true);
                                if ( !areaOffs )
                                {
                                  areaElm
                                      .prependTo( imgOverlay ); // insert into the DOM to allow margin measurements
                                  areaOffs = [
                                      toInt(areaElm.css('margin-left'), 10)||0,  // x offset
                                      toInt(areaElm.css('margin-top'), 10)||0    // y offset
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

})(jQuery);
