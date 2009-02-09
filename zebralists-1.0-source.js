// Requires jQuery 1.2.6 or 1.3
//
// Add the class "odd" to every other item in selected element lists.
// Offers a list of classNames for items to exclude and reset the zebra-striping effect.
// and a list of classNames for items to treat as sub-items and color the same as the previous item...
(function($){

  var defaults = {
    items : 'tr',
    subClasses : [],
    excludeClasses : [],
    oddClass  : 'odd',
    evenClass : '',
    activeSuffix : '-active'
  };

  jQuery.fn.zebraLists = function ( config ) {
    
    var _conf = jQuery.extend( {}, defaults, config );
    
    // convert odd/even class properties into classes array 
    if ( ! _conf.classes ) {
      _conf.classes = [ _conf.oddClass, _conf.evenClass ];
    }
    
    this.each(function (i) {
      
      var _blockElm = $( this );
      var n = -1;
      var l = _conf.classes.length;
      var _isOdd = false;
      var _sel = _conf.items;

      // scope row selection by tbody if selection is too simple
      if ( _sel == 'tr' && !/^(tbody)$/i.test( this.tagName ) ) {
        _sel = 'tbody > tr';
      }
      var _items = _blockElm.find( _sel ),
          _excluded = _items.filter( '.' + _conf.excludeClasses.join( ', .' ) ),
          _subitems = _items.filter( '.' + _conf.subClasses.join( ', .' ) );
          
      _items.each(function (i) {
        
        var _itm = jQuery( this );

        // remove all cases of row marker classes for row
        for (var c=0; c>=0; c--){
          _itm.removeClass( _conf.classes[ c ] );
        }
        
        // excluded rows reset the class counter
        if ( _excluded.index( _itm ) !== -1 ) {
          n = -1;
          return;
        }
        
        // make sure the item is not a "subitem"
        if ( _subitems.index( _itm ) === -1) { 
          n++;
        }

        _itm.addClass( _conf.classes[ n % l ] );

      })

    });
    return this;
  };

})(jQuery);