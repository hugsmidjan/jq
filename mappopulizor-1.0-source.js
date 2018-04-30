/* $.mapPopulizor 1.0  -- (c) 2012 Hugsmiðjan ehf.  @preserve */
// ----------------------------------------------------------------------------------
// jQuery.fn.mapPopulizor v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Borgar Þorsteinsson  -- http://borgar.undraland.com
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

(function($){


  // turn something into an element
  var elementize = function ( something, defaultContainer)
  {
    if (defaultContainer)
    {
      // FIXME: find a more elegant way of doing this.
      // if the `something` is a selector then scope within `container`
      var element = (typeof something == 'string'  &&  something.indexOf('<')==-1) ?
                        $(something, defaultContainer):
                        $(something);
      if (!element.closest('html').length) // FIXME: revert to simple `.parent().length` when jQuery fixes .parentNode for newly created elements. Ack!
      {
        element.appendTo(defaultContainer);
      }
      return element;
    }
    return $(something);
  };


  $.mapPopulizor = {
    defaults: {
      mapElm:             '<div class="map" />',
      listCont:           '<ul class="itemlist" />', // or element
      closeBtn:           '<a href="#" title="Loka" class="closebtn">x</a>',

      activeClass:        'maplist-active',  // container clas
      mappoints:          {},
      getXY:              function (bubbleBox) { // try to pull the item's id from it's link
                              var url = this.getLinkUrl(bubbleBox),
                                  itemId = url  &&  url.replace(/^.*\/(\d+)(\/|$|.html)/, '$1');
                              return this.mappoints[itemId] || { x:0, y:0, f:1 }; // f: false marker, no id match
                            },

      markerTempl:        '<a href="#" class="marker"><span /><i><b>%{label}</b></i></a>',
      buildMarker:        function (bubbleBox) {
                              return $( $.inject(this.markerTempl, { label: this.getLabel(bubbleBox) }) );
                            },

      itemTempl:           '<li><a href="%{url}">%{label}</a></li>',
      buildItem:          function (bubbleBox) {
                              var props = {
                                      url:   this.getLinkUrl(bubbleBox) || '#',
                                      label: this.getLabel(bubbleBox)
                                    };
                              return $( $.inject(this.itemTempl, props) );
                            },

      labelSelector:      'h3',
      getLabel:           function (bubbleBox) { return $.trim( $(bubbleBox).find( this.labelSelector ).text() );  },

      linkSelector:       'h3 > a, span.more a',
      getLinkUrl:          function (bubbleBox) { return $(bubbleBox).find(this.linkSelector).attr('href'); },

      itemselector:       'div.item',
      markerActiveClass:  'marker-active',
      liActiveClass:      'marker-active',

      x_flip:              1000,         // relative x-coodinate where
      markerFlipClass:    'marker-flip',
      bubbleFlipClass:    'bubble-flip',
      dotOffset:          [0,0],          // x,y pixel offsets for marker placement (typically half the marker size)
      fadeSpeed:          [400, 400]      // fadein, fadeout speed
    }
  };



  $.fn.mapPopulizor = function ( cfg ) {

    cfg = $.extend({}, $.mapPopulizor.defaults, cfg );
    this
        .addClass( cfg.activeClass)
        .each(function(){
            var mapcontainer = $(this),
                map =          elementize(cfg.mapElm, mapcontainer),
                listCont =     elementize(cfg.listCont, mapcontainer);

            $( cfg.itemselector, mapcontainer ).hide().each(function () {
                var bubbleBox = $( this ),
                    listItem = cfg.buildItem( bubbleBox ).appendTo(listCont),   // should link to bubbleBox -> id  // FIXME: more efficient to collect `listItem`s into an Array and append them all at once later
                    marker = cfg.buildMarker( bubbleBox ),
                    close  = elementize( cfg.closeBtn ),
                    c = cfg.getXY( bubbleBox );

                if ( c ) {
                  $([ marker[0], bubbleBox.find('h3')[0], listItem.find('a')[0], close[0] ])
                      .bind('click', function (e){
                          if (bubbleBox.is(':visible')) {
                            bubbleBox.stop().fadeOut(cfg.fadeSpeed[1], function (){
                              $( this ).css( 'opacity', '' );  // FIXME: check and see if this is still needed in 1.3.*
                              listItem.removeClass(cfg.liActiveClass);
                            });
                            marker.removeClass(cfg.markerActiveClass);
                          }
                          else {
                            mapcontainer.find('a.marker-active').trigger('click').trigger('mouseleave').blur();
                            bubbleBox.stop().fadeIn(cfg.fadeSpeed[0], function () {
                              $( this ).css( 'opacity', '' );  // FIXME: check and see if this is still needed in 1.3.*
                              marker.addClass(cfg.markerActiveClass);
                            });
                            listItem.addClass(cfg.liActiveClass);
                          }
                          return false;
                        });
                  if( c.f )
                  {
                    marker.addClass('marker-false');
                  }
                  marker
                    .css({
                        left: c.x + cfg.dotOffset[0],
                        top: c.y + cfg.dotOffset[1]
                      })
                    .find('i')
                        .hide()
                    .end()
                    .bind('mouseenter mouseleave', function (e) {
                        $( 'i', this )
                            .stop()
                            [e.type=='mouseenter'? 'fadeIn' : 'fadeOut']( e.type=='mouseenter' ? cfg.fadeSpeed[0] : cfg.fadeSpeed[1], function(){
                                if (8>parseInt((/MSIE ([\w.]+)/.exec(navigator.userAgent)||[])[1],10)) { e.type=='mouseenter' ? $('body').addClass('hovering') : $('body').removeClass('hovering'); } // IE6 & 7 kicktrick for z-index correction
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