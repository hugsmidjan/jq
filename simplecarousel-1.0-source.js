// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.simpleCarousel v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Borgar Þorsteinsson  -- http://borgar.undraland.com
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

(function($){

  var defaults = {
          
          item      : '.item',
          container : '',
          speed     : 600,
          easing    : 'swing',
          //wrap      : false,
          initCallback : function(){},
          nextBtnTemplate : '<a href="#" class="next"></a>',
          prevBtnTemplate : '<a href="#" class="prev"></a>',
          labelNext: '&rarr;',
          labelPrev: '&larr;',
          titleNext: 'Next panel',
          titlePrev: 'Previous panel'
        },

      moveTo = function ( px, conf ) {
          conf.container
            .stop()
            .animate(
                { scrollLeft: px }, 
                conf.speed, 
                conf.easing,
                function () { updateIndicator( conf ); }
              );
        },

      buildControls = function ( conf ) {
          var ctrl = $('<div class="controls screen"></div>');
          // don't make back/fwd buttons for single screens
          if (conf.numScreens > 1) {
            ctrl
                .append(
                    $( conf.nextBtnTemplate )
                      .html( conf.labelNext )
                      .attr('title',  conf.titleNext || conf.labelNext || '' )
                      .bind('click', function(){
                          var px = conf.container.scrollLeft() + conf.windowSize;
                          px = Math.ceil( px / conf.windowSize ) * conf.windowSize;
                          px = ( conf.wrap && px > conf.maxScroll ) ? 0 : Math.min( conf.maxScroll, px ) ;
                          conf.currentPage += px == 0 ? -conf.numScreens+1 : 1;
                          //;;;window.console&&console.log(conf.currentPage, conf.numScreens);
                          moveTo( px, conf );
                          return false;
                        })
                  )
                .append(
                    $( conf.prevBtnTemplate )
                      .html( conf.labelPrev )
                      .attr('title',  conf.titlePrev || conf.labelPrev || '' )
                      .bind('click', function(){
                          var px = conf.container.scrollLeft() - conf.windowSize;
                          px = Math.floor( px / conf.windowSize ) * conf.windowSize;
                          px = ( conf.wrap && px < 0 ) ? conf.maxScroll : Math.max( 0, px );
                          conf.currentPage += px == conf.maxScroll ? conf.numScreens-1 : -1;
                          moveTo( px, conf );
                          return false;
                        })
                  );
          }
          ctrl.append('<div class="direct"></div>');
          return ctrl;
        },

        updateIndicator = function ( conf ) {
            //var dir = $( '.direct', conf.controls );
            $('span.i', conf.controls)
                .removeClass( 'current' ) // deactivate old current
                .eq( conf.currentPage )
                    .addClass( 'current' );
          };


  $.fn.simpleCarousel = function( config ) {

    return this.each(function(){

        var conf = $.extend( {}, defaults, config ),
            handle = conf.handle = $( this ),
            container = conf.container = handle.wrap( '<div class="container"></div>' ).parent();

        handle.addClass( 'carousel-active' );

        container.scrollLeft( 0 );
        conf.windowSize = container.width();

        var itemsWidth = 0;
        conf.items = $( conf.item, handle ).each(function(){
            itemsWidth += $(this).outerWidth();
          });

        var itemsPadded = Math.ceil( itemsWidth / conf.windowSize ) * conf.windowSize;

        conf.maxScroll   = itemsPadded - conf.windowSize;
        conf.numScreens  = itemsPadded / conf.windowSize;
        handle.width( itemsPadded );

        conf.itemsPerPage = Math.ceil( conf.items.length / conf.numScreens );

        // build controls and add them
        conf.controls = buildControls( conf );
        var indicators = '';
        for (var i=0; i<conf.numScreens; i++) {
          indicators += '<span class="i"><i>' + (i+1) + '</i></span>';
        }
        $('.direct', conf.controls).append( indicators );

        container.after( conf.controls );
        conf.currentPage = 0;
        updateIndicator( conf );

        conf.initCallback( conf );
      });

  };


})(jQuery);