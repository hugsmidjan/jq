// ----------------------------------------------------------------------------------
// jQuery.fn.menuOverflow v 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Þórarinn Stefánsson  -- http://www.thorarinn.com
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

/*
  The `menuOverflow` plugin detects horizontal menus with items overflowing into a second
  row of height. It then adds an additional li to the end of the overflowable ul
  and moves the overflowing list items into this new menu:

  <ul class="menu-overflowing"> <- 'this'
    (untouched list items)
    <li class="overflow">
      <a href="#">More...</a>
      <ul>
        (overflowing list items)
      </ul>
    </li>
  </ul>


  Forsendur:
    * li.overflow-menu má ekki vera absolute positioned fyrir ofan eða neðan valmyndina.
      Best að hann sé bara floated eins og rest.
    * Hæðin á fyrsta iteminu má ekki vera mjög misjöfn
  TODO:
    * Event-handling


  ------------------------------------------------------
  Usage:

    $('ul.menu').menuOverflow({
        wrapper:            '*',                 // Selector for a "closest" ancestor whose width the script
                                                    will be monitoring. defaults to '*', i.e. the menu element itself.
        itemSelector        '>li',               // selector to find the menu items
        overflowingClass:   'menu-overflowing',  // class name added to the original menu when overflowing
        overflowTempl:      '<li class="overflow"><a href="#" /><ul/></li>'
        togglerSelector:    'a',
        togglerText:        'More...',           // contents of menu-toggler link
        dropMenuSelector:   'ul',                // selector that finds the actual submenu container within `overflowTempl`
        delay:              0,                   // ms; delay until running script after each window resize event

        customHeightRep:    null,                // custom representative element to base height-offset comparisons on
        heightRepSelector:  '>li:not(.current)',  // selector used to pick a representative menu-item to base height-offset comparisons on.
        minWidthChange:     10,                  // px; when window widens, the overflow is re-evaluated for every N pixels of widening.
        heightThreshold:    1.5,                 // multiple; when the menu container (parent) is taller than N times the
                                                    height of the menu's first item, the menu is seen as overflowing.
        topThreshold:       0.5,                 // multiple; when an item's offsetTop is higher than that of the menu's first
                                                   item + (N times the height of first-item), the item is seen as overflowing.
      });

*/

(function($, undefined){

  $.fn.menuOverflow = function (cfg) {
      if ( this.length )
      {
        cfg = $.extend({ // cfg may be shared - as long as it's read-only
              //wrapper:            '*',
              itemSelector:       '>li',
              overflowingClass:   'menu-overflowing',
              overflowTempl:      '<li class="overflow"><a href="#" /><ul/></li>',
              //togglerSelector:    'a',
              togglerText:        'More...',
              //dropMenuSelector:   'ul',
              delay:              0,

              //customHeightRep:    null,
              heightRepSelector:  '>li:not(.current)',
              minWidthChange:     10,
              heightThreshold:    1.5,
              topThreshold:       0.5
            },
            cfg
          );
        this.each(function(){
            var origMenu    = $(this),
                menuWrap    = origMenu.closest( cfg.wrapper || '*' ), // defaults to origMenu
                knownWidth  = menuWrap.width(),
                droppables  = origMenu.find( cfg.itemSelector ),
                repElm      = cfg.customHeightRep  &&  $(cfg.customHeightRep),
                dropMenu    = $( cfg.overflowTempl ),
                dropMenuUl  = dropMenu.find( cfg.dropMenuSelector || 'ul' ),
                addedMenu   = false;

            dropMenu.find( cfg.togglerSelector || 'a' )
                .html( cfg.togglerText );

            var checkNav = function() {
                repElm      = cfg.customHeightRep ? repElm : origMenu.find( cfg.heightRepSelector );
                var firstHght   = repElm.outerHeight(true),
                    firstTop    = repElm.offset().top,
                    maxHeight   = firstHght * cfg.heightThreshold,
                    maxTop      = firstTop + (firstHght * cfg.topThreshold);

                if ( menuWrap.height() > maxHeight )
                {
                  // Items are wrapping
                  // Remove items from the menu!

                  if (!addedMenu) {
                    // insert the new menu
                    dropMenu.insertAfter( droppables.last() );
                    origMenu.addClass( cfg.overflowingClass );
                    addedMenu = true;
                  }

                  var menuItems = origMenu.find( cfg.itemSelector ).not( dropMenu );
                  //;;;window.console&&console.time('WrapCalculate');

                  var i = menuItems.length;
                  while ( i--  &&  dropMenu.offset().top > maxTop )
                  {
                    dropMenuUl.prepend( menuItems[i] );
                  }

                  knownWidth = menuWrap.width(); // update width
                  //;;;window.console&&console.timeEnd('WrapCalculate');

                }
                else if ( addedMenu  &&  menuWrap.width() > (knownWidth + cfg.minWidthChange) )
                {
                  // Add items back to the menu!

                  // Width has expanded more than N pixels since last run.
                  //;;;window.console&&console.time('Expanding');
                  var moreItems = dropMenuUl.children();
                  moreItems.each(function(i){
                      dropMenu.before(this);
                      // insert a micro delay for IE7 to allow its CSS rendering engine to catch up before we measure dropMenu's offset
                      if ( 8>parseInt((/MSIE ([\w.]+)/.exec(navigator.userAgent)||[])[1],10) )
                      {
                        dropMenu[0].className += '';
                      }
                      if ( dropMenu.offset().top > maxTop )
                      {
                        // Oops, went too far!
                        dropMenuUl.prepend(this); // revert last extraction
                        return false; // loop no further
                      }
                    });
                  if ( dropMenuUl.children().length == 0 )
                  {
                    dropMenu.remove();
                    origMenu.removeClass(cfg.overflowingClass);
                    addedMenu = false;
                  }
                  knownWidth = menuWrap.width(); // update width
                  //;;;window.console&&console.timeEnd('Expanding');
                }
              }; // end checkNav()


            $(window).bind('resize', function (e) { // check on resize
                if ( cfg.delay )
                {
                  clearTimeout( checkNavLayout );
                  var checkNavLayout = setTimeout(checkNav, cfg.delay);
                }
                else
                {
                  checkNav();
                }
              });
            //;;;window.console&&console.time('First-run');
            checkNav();
            //;;;window.console&&console.timeEnd('First-run');

        });
      } // end if
      return this;
    };

})(jQuery);
