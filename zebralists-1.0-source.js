// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.zebraLists v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Borgar Þorsteinsson  -- http://borgar.undraland.com1
// ----------------------------------------------------------------------------------

// Requires jQuery 1.2.6 +
//
// Add the class "odd" to every other item in selected element lists.
// Offers a selector for items to exclude and reset the zebra-striping effect.
// and a selector for items to treat as sub-items and color the same as the previous item...
(function($){

  var _zebraLists = $.fn.zebraLists = function ( config ) {
      config = $.extend( {}, _defaults, config );

      // convert odd/even class properties into classes array
      var classes = config.classes || [ config.oddClass, config.evenClass ];

      this.each(function (i) {

        var _blockElm = $( this ),
            n = -1,
            l = classes.length,
            _classNames = $.trim(classes.join(' ')),
            _sel = config.items;

        if (!l) { return false; }

        // scope row selection by tbody if selection is too simple
        if ( _blockElm.is('table') && /^\s*> tr/.test(_sel) )
        {
          _sel = 'tbody ' + _sel;
        }

        _blockElm.find( _sel )
            .each(function (i, _itm) {
                n++;
                _itm = $(_itm);

                // remove all marker classNames
                _itm.removeClass( _classNames );

                // excluded rows reset the class counter
                if ( _itm.is( config.resetItems ) )
                {
                  n = -1;
                  return;
                }
                // make sure the item is not a "subitem"
                else if ( _itm.is( config.subItems ) )
                {
                  n--;
                }
                // set a fresh className
                _itm.addClass( classes[ n % l ] );
              });

      });
      return this;
    },

  _defaults = _zebraLists.defaults = {
      items:       '> tr:visible',
      subItems:    '.subrow',
      //resetItems:  '',
      oddClass:    'odd'
      //evenClass:   ''
      //classes:   [oddClass, evenClass(, nthClass)*]
    };

  
})(jQuery);


