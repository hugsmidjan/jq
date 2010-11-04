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


  ------------------------------------------------------

  TODO:
    * add a (default on) 'sticky' option to allow non-sticky highlights


*/
(function($){

  var runCount = 0,
      ts = '.dh'+(new Date()).getTime() +'-',
      evPrefix = 'highlight',
      inEvs = 'mouseenter focusin',
      outEvs = 'mouseleave focusout',
      inEvRe = /(er|in)$/;

  $.fn.delayedHighlight = function (cfg) {
      cfg = $.extend({
            //delegate:     'li',
            className:    'focused',
            //sticky:       false,
            delay:        500,
            delayOut:     300,
            //clickToggles: false,
            //click:        false,
            cancelOff:    'a, area, :input'
          },
          cfg
        );
      var list = this,
          dataSuffix = ts+(runCount++);
          className =  cfg.className,
          delegate =   cfg.delegate  || 'li';

      list
          .bind( evPrefix+'on '+evPrefix+'off', false )
          .delegate(delegate, outEvs+(cfg.sticky?'':' '+inEvs), function (e) {
              var inorout = inEvRe.test(e.type) ? 'out' : 'in';
              clearTimeout( list.data( 'timeout-'+ inorout + dataSuffix ) );
            })
          .delegate(delegate, inEvs+(cfg.sticky?'':' '+outEvs)+(cfg.click?' click':''), function (e) {
              var item = $(this),
                  isClick =  e.type == 'click';
                  isInEvent = cfg.sticky ? !isClick : inEvRe.test(e.type),
                  isOutEvent = !isInEvent  &&  !isClick,
                  inorout = isInEvent ? 'in' : 'out';

              if ( (!isClick  &&  (!cfg.sticky || isInEvent))  ||  // always process if not click (and not sticky or just inEvent)
                    // In case of a click, process only if...
                    // ...the item is not currently focued (results in "highlighton")
                    item[0]!=(list.data( 'item'+dataSuffix )||[])[0]  ||
                    // ...or .clickToggles is true and the e.target isn't one of the .cancelOff elements... (results in "highlightoff")
                    (cfg.clickToggles  &&  !$(e.target).closest(cfg.cancelOff||'', this)[0])
                  )
              {
                var timeoutName = 'timeout-'+ inorout + dataSuffix;
                clearTimeout( list.data( timeoutName ) );
                list.data( timeoutName,
                    setTimeout(
                        function(){
                            var activeItem = $( list.data( 'item'+dataSuffix ) ),
                                isActive = activeItem[0] == item[0],
                                remove;
                            if ( !isActive  ||  !cfg.sticky  || (isClick && cfg.clickToggles) )
                            {
                              className  &&  activeItem.removeClass( className );
                              activeItem.trigger( evPrefix+'off' );
                              remove = true;
                            }
                            if ( !isActive  &&  !isOutEvent )
                            {
                              className && item.addClass( className );
                              item.trigger( evPrefix+'on' );
                              list.data( 'item'+dataSuffix, item );
                              remove = false;
                            }
                            remove  &&  list.removeData( 'item'+dataSuffix );
                          },
                        isClick? 0 : isInEvent ? cfg.delay : cfg.delayOut
                      )
                  );
              }
            });

      return this;
    };

})(jQuery);
