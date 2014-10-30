/* jQuery.fn.delayedHighlight 1.0  -- (c) 2010-2014 Hugsmiðjan ehf.   @preserve */

// ----------------------------------------------------------------------------------
// jQuery.fn.delayedHighlight v 1.0
// ----------------------------------------------------------------------------------
// (c) 2010-2013 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
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
          delegate:     'li',             // the elements to highlight ...
                                          // Set `delegate` to `''` or `null` to highlight the collection itself.
          holes:        null,             // sub-selector for elements that should work as holes in the delegate element
          className:    'focused',        // for highlighted elements
          delay:        500,              // ms, until highlighton
          delayOut:     300,              // ms, until highlightoff (applies when sticky !== true)
          focusDelay:    null,            // focusin delay. (Falls back to `delay` option.)
          focusDelayOut: null,            // focusout delay. (Falls back to `delayOut` option.)
          sticky:       false,            // when sticky, highlight stays on until a new element is highlighted (unless clickToggles is set)
          noBubble:     false,            // set to `true` to prevent the custom events from bubbling upwards from the list container
          click:        false,            // allow clicks to set highlight on without delay
          clickToggles: false,            // true makes clicks toggle the highlight on/off/on/off/etc.
          clickGrace:   300,              // ms, grace period after highlighton, during which clickToggles off is disabled.
          clickCancels: false,            // true makes clicks prevent the element to get highlighted  (useful for navigation menus with mega-menus)
          cancelOff:    'a, area, :input' // exceptions for click-triggered `highlightoff` when `clickToggles` is set
        });


  Each time .delayedHighlight highlights (or dims) an element, the custom events
  `highlighton` and `highlightoff` are triggered respectively.

  Before an element is highlighted/dimmed, the custom events
  `beforehighlighton` and `beforehighlightoff` are triggered,
  and e.preventDefault() during those events
  prevents the highlighting/dimming from happening.

  All those events bubble up to (but no further than) the original
  element container (the 'ul' in the example code above).

  Handlers for those events can therefore be bound to the container
  for custom funcionality, like so:

      jQuery('ul')
          .delayedHighlight()
          .bind('beforehighlighton', function (e) {
              // When applicable `e.fromTarget` points to the element that just turned off
              if ( $(e.target).is('.disabled') ) {
                e.preventDefault();
              }
            })
          .bind('beforehighlightoff', function (e) {
              if ( $(e.target).is('.pinnedopen') ) {
                e.preventDefault();
              }
            })
          .bind('highlighton', function (e) {
              // When applicable `e.fromTarget` points to the element that just turned off
              $(e.target).prepend('<img class="icon" src="star.gif" alt=""/>');
            })
          .bind('highlightoff', function (e) {
              $(e.target).find('img.icon').remove();
            });


  FIXME:
    * beforehighlightoff is not triggered on elements when auto-dimmed when highlighting a new element...
      Needs more thought...

*/
(function($, undefined){

  $.fn.delayedHighlight = function (cfg) {
      if ( this.length )
      {
        cfg = $.extend({
              //delegate:     'li',
              //holes:        null,
              className:    'focused',
              delay:        500,
              delayOut:     300,
              // focusDelay:    null, // defaults to delay
              // focusDelayOut: null, // defaults to delayOut
              onFocus:      true,
              // sticky:       false,
              // noBubble:     false,
              // click:        false,
              // clickToggles: false,
              clickGrace:   300,
              // clickCancels: false,
              cancelOff:    'a, area, :input'
            },
            cfg
          );
        var list = this,
            className =  cfg.className,
            delegate =   !('delegate' in cfg) ? 'li' : cfg.delegate, // make sure the default doesn't override explicitly falsy cfg.delegate values
            holes =      cfg.holes,

            evPrefix =   'highlight',
            onEvent =     evPrefix+'on',
            offEvent =    evPrefix+'off',
            befOnEvent =  'before'+onEvent,
            befOffEvent = 'before'+offEvent,

            wasClicked = evPrefix+'-wasclicked',

            onFocus = cfg.onFocus,

            _mouseover_focusin = 'mouseover' + (onFocus ? ' focusin':''),
            _mosueout_focusout =  'mouseout' + (onFocus ? ' focusout':''),
            _isDefaultPrevented = 'isDefaultPrevented',
            clrTimeout = clearTimeout,
            inTimeout,
            outTimeout,
            activeItem,
            currentHover,

            clickGrace = cfg.clickGrace,
            graceTimeout,
            justHighlighted;

        if ( cfg.noBubble )
        {
          // don't have the custom events bubble upwards from the list
          list
              .bind(
                  befOnEvent+' '+befOffEvent+' '+onEvent+' '+offEvent,
                  function (e) {  e.stopPropagation();  }
                );
        }


        var highlightOn = function (e) {
                if ( holes && $(e.target).closest(holes, this)[0] )
                {
                  highlightOff.call(this, e);
                }
                else
                {
                  var item = $(this);
                  clrTimeout( inTimeout );
                  clrTimeout( outTimeout );
                  (e.type.charAt(0)==='m')  &&  (currentHover = this);
                  inTimeout = setTimeout(function(){
                      var activeElm = activeItem && activeItem[0],
                          beforeEv;
                      if ( item[0] !== activeElm )
                      {
                        beforeEv = jQuery.Event( befOnEvent );
                        beforeEv.fromTarget = activeElm;
                        item.trigger(beforeEv);
                        if ( !beforeEv[_isDefaultPrevented]() )
                        {
                          if ( activeItem )
                          {
                            activeItem
                                .removeClass( className )
                                // IDEA: shouldn't we trigger befOffEvent here!?
                                .trigger( offEvent );
                          }
                          activeItem = item;
                          item
                              .addClass( className )
                              .trigger({ type:onEvent, fromTarget:activeElm });
                          if (clickGrace)
                          {
                            justHighlighted = item[0];
                            clrTimeout( graceTimeout );
                            graceTimeout = setTimeout(function(){ justHighlighted = undefined; }, clickGrace);
                          }
                        }
                      }
                    }, e.delay || (e.type==='focusin' && cfg.focusDelay) || cfg.delay );
                }
              },

            highlightOff = function (e) {
                var isClick = e.type==='click';
                clrTimeout( inTimeout );
                clrTimeout( outTimeout );
                if ( !cfg.sticky  ||  isClick )
                {
                  (e.type.charAt(0)==='m')  &&  (currentHover = undefined);
                  outTimeout = setTimeout(function(){
                      if ( activeItem  &&  activeItem[0] !== currentHover  ||  isClick )
                      {
                        var beforeEv = jQuery.Event( befOffEvent );
                        activeItem.trigger(beforeEv);
                        if ( !beforeEv[_isDefaultPrevented]() )
                        {
                          activeItem
                              .removeClass( className )
                              .trigger( offEvent );
                          activeItem = undefined;
                        }
                      }
                    }, e.delay || (e.type==='focusout' && cfg.focusDelayOut) || cfg.delayOut );
                }
              },

            handleClick = function (e) {
                var method = ( !activeItem  ||  this !== activeItem[0] ) ?
                                  highlightOn:
                              ( cfg.clickToggles  &&  this!==justHighlighted  &&  !$(e.target).closest( cfg.cancelOff||'' )[0]  ) ?
                                  highlightOff:
                                  undefined;
                method  &&  method.call( this, { type:'click', delay: 1 } );
              },

            cancelOnClick = function (/*e*/) {
                if ( !activeItem  ||  this !== activeItem[0] )
                {
                  var item = $(this);
                  item.data(wasClicked, true);
                  clearTimeout(item.data(wasClicked+'to'));
                  item.data(wasClicked+'to',
                      setTimeout(function(){ item.removeData(wasClicked); }, cfg.delay)
                    );
                }
              };


        delegate ?
            list
                .delegate(delegate, _mouseover_focusin, highlightOn)
                .delegate(delegate, _mosueout_focusout, highlightOff):
            list
                .bind(_mouseover_focusin, highlightOn)
                .bind(_mosueout_focusout, highlightOff);
        if ( cfg.click )
        {
          delegate ?
              list.delegate(delegate, 'click', handleClick):
              list.bind('click', handleClick);
        }
        else if ( cfg.clickCancels )
        {
          delegate ?
              list.delegate(delegate, 'click', cancelOnClick):
              list.bind('click', cancelOnClick);
          list
              .bind(befOnEvent, function (e) {
                  var item = $(e.target);
                  if ( item.data(wasClicked) )
                  {
                    e.preventDefault();
                    item.removeData(wasClicked);
                  }
                });
        }
      }

      return this;

    };

})(window.jQuery);
