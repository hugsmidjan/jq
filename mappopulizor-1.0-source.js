// encoding: utf-8
(function($){

  $.fn.mapPopulizor = function ( cfg ) {

    cfg = $.extend({
            listCont:          '<ul class="itemlist" />', // or element
            activeClass:       'maplist-active',  // container clas
            mappoints:         {},
            getXY:             function (bubbleBox, cfg) {
                                  // try to pull the item's id from it's link
                                  var link   = bubbleBox.find( 'h3 > a, span.more a').eq(0),
                                      itemId = link.length && link.attr('href').replace(/^.*\/(\d+)(\/|$)/, '$1');
                                  return cfg.mappoints[itemId] || { x:0, y:0 };
                                },
            itemselector:      'div.item',
            markerActiveClass: 'marker-active',
            liActiveClass:     'marker-active',

            x_flip:             1000,         // relative x-coodinate where 
            markerFlipClass:   'marker-flip',
            bubbleFlipClass:   'bubble-flip',
            dotOffset:         [0,0]          // x,y pixel offsets for marker placement (typically half the marker size)
          }, cfg );


    this
        .addClass( cfg.activeClass)
        .each(function(){
            var mapcontainer = $(this),
                map = $('<div class="map" />').appendTo(mapcontainer),
                listCont = cfg.listCont;

            // FIXME: find a more elegant way of doing this.
            // if `listCont` is selector then scope within mapContainer
            listCont = (typeof listCont == 'string'  &&  listCont.indexOf('<')==-1) ?
                            $(listCont, mapcontainer):
                            $(listCont);

            if (!listCont.closest('html').length) // FIXME: revert to simple `.parent().length` when jQuery fixes .parentNode for newly created elements. Ack!
            {
              listCont.appendTo(this);
            }

            $( cfg.itemselector , mapcontainer ).hide().each(function () {
                var bubbleBox = $( this );
                var title  = $.trim( bubbleBox.find( 'h3' ).eq( 0 ).text() );
                var link   = bubbleBox.find( 'h3 > a, span.more a')[0];
                var listItem = $( '<li><a href="'+ link.href +'">' + title + '</a></li>' ).appendTo(listCont);   // should link to bubbleBox -> id  // FIXME: more efficient to collect `listItem`s into an Array and append them all at once later
                var marker = $( '<a href="#" class="marker"><span /><i><b>' + title + '</b></i></a>' );
                var close  = $( '<a href="#" title="Loka" class="close">x</a>' );
                var c = cfg.getXY(bubbleBox, cfg);
                if ( c ) {

                  // remove links of headings
                  bubbleBox.find( 'h3' ).html( '<span>'+title+'</span>' );
                  $([ marker[0], bubbleBox.find('h3 span')[0], listItem.find('a')[0], close[0] ])
                      .bind('click', function (){
                          if (bubbleBox.is(':visible')) {
                            bubbleBox.stop().fadeOut(function (){ 
                              $( this ).css( 'opacity', '' );  // FIXME: check and see if this is still needed in 1.3.* 
                              listItem.removeClass(cfg.liActiveClass);
                            });
                            marker.removeClass(cfg.markerActiveClass);
                          }
                          else {
                            bubbleBox.stop().fadeIn(function () {
                              $( this ).css( 'opacity', '' );  // FIXME: check and see if this is still needed in 1.3.*
                              marker.addClass(cfg.markerActiveClass);
                            });
                            listItem.addClass(cfg.liActiveClass);
                          }
                          return false;
                        });
                  marker
                    .css({
                        left: c.x + cfg.dotOffset[0],
                        top: c.y + cfg.dotOffset[1]
                      })
                    .bind('mouseenter mouseleave', function (e) {
                        $( 'i', this )
                            .stop()
                            [e.type=='mouseenter'? 'fadeIn' : 'fadeOut'](function(){
                                $( this ).css( 'opacity', '' ); // FIXME: check and see if this is still needed in 1.3.*
                              });
                      });

                  if ( c.x >= cfg.x_flip ) {
                    bubbleBox.addClass(cfg.bubbleFlipClass);
                    marker.addClass(cfg.markerFlipClass);
                  }
                  bubbleBox
                      .css({
                          left: c.x + cfg.dotOffset[0],
                          top: c.y + cfg.dotOffset[1]
                        })
                      .hide()
                      .append( close );

                  map.append( bubbleBox );
                  map.prepend( marker );
                  
                }

              });


          });
    return this;
  }
  
})(jQuery);