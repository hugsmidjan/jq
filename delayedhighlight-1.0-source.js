// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.delayedHighlight v 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

/*
  The `delayedHighlight` plugin highlights list items on mouseenter/focusin
  after a specified delay (and optionally instantly when clicked).
  Highlight can be made optionally sticky - lasting until another item is highligthed
  (and/or optionally until the current item is clicked again).

  ------------------------------------------------------

  Usage:

      jQuery('ul').delayedHighlight({
          delegate:     'li',             // the elements to highlight
          className:    'focused',        // for highlighted elements
          delay:        500,              // ms, until highlighton
          delayOut:     300,              // ms, until highlightoff (applies when sticky !== true)
          sticky:       false,            // when sticky, highlight stays on until a new element is highlighted (unless clickToggles is set)
          click:        false,            // allow clicks to set highlight on without delay
          clickToggles: false,            // true makes clicks toggle the highlight on/off/on/off/etc.
          cancelOff:    'a, area, :input' // exceptions for click-triggered `highlightoff` when `clickToggles` is set
        });


  Each time .delayedHighlight highlights (or dims) an element, the custom events
  `highlighton` and `highlightoff` are triggered respectively.
  Those events bubble up to (but no further than) the original
  element container (the 'ul' in the example code above).

  Handlers for those events can therefore be bound to the container
  for custom funcionality, like so:

      jQuery('ul')
          .delayedHighlight()
          .bind('highlighton', function (e) {
              $(e.target).prepend('<img class="icon" src="star.gif" alt=""/>');
            })
          .bind('highlightoff', function (e) {
              $(e.target).find('img.icon').remove();
            });




*/
(function($, undefined){

  $.fn.delayedHighlight = function (cfg) {
      cfg = $.extend({
            //delegate:     'li',
            className:    'focused',
            //sticky:       false,
            //noBubble:     false,
            delay:        500,
            delayOut:     300,
            //clickToggles: false,
            //click:        false,
            cancelOff:    'a, area, :input'
          },
          cfg
        );
      var list = this,
          className =  cfg.className,
          delegate =   cfg.delegate  || 'li',
          evPrefix =   'highlight',
          inTimeout,
          outTimeout,
          activeItem,
          currentHover;

      if ( cfg.noBubble )
      {
        list
            .bind( evPrefix+'on '+evPrefix+'off', false ) // don't have the custom events bubble upwards from the list
      }

/**/
      var highlightOn = function (e) {
              var item = $(this);
              clearTimeout( outTimeout );
              (e.type.charAt(0)=='m')  &&  (currentHover = this);
              inTimeout = setTimeout(function(){
                  if ( !activeItem  ||  item[0] != activeItem[0] )
                  {
                    if ( activeItem )
                    {
                      activeItem
                          .removeClass( className )
                          .trigger( evPrefix+'off' );
                    }
                    activeItem = item;
                    item
                        .addClass( className )
                        .trigger( evPrefix+'on' );
                  }
                }, e.delayOut || cfg.delay);
            },

          highlightOff = function (e) {
              var isClick = e.type=='click';
              clearTimeout( inTimeout );
              if ( !cfg.sticky  ||  isClick )
              {
                (e.type.charAt(0)=='m')  &&  (currentHover = undefined);
                outTimeout = setTimeout(function(){
                    if ( activeItem  &&  activeItem[0] != currentHover  ||  isClick )
                    {
                      activeItem
                          .removeClass( className )
                          .trigger( evPrefix+'off' );
                      activeItem = undefined;
                    }
                  }, e.delayOut || cfg.delayOut);
              }
            };

      list
          .delegate(delegate, 'mouseover focusin', highlightOn)
          .delegate(delegate, 'mouseout focusout', highlightOff);
      if ( cfg.click )
      {
        list
          .delegate(delegate, 'click', function (e) {
              var method = ( !activeItem  ||  this != activeItem[0] ) ?
                                highlightOn:
                            ( cfg.clickToggles  &&  !$(e.target).closest( cfg.cancelOff||'' )[0]  ) ?
                                highlightOff:
                                undefined;
              method  &&  method.call( this, { type:'click', delayOut: 1 } );
            });
      }

      return this;
/**/

    };

})(jQuery);
