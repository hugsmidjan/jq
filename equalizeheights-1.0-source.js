(function($){

  var quirky = !!( $.browser.msie && ( parseInt($.browser.version, 10) < 7 || document.compatMode == 'BackCompat' ) ),         
      heightAttribute = (quirky) ? 'height' : 'min-height',
      evSet = false,
      sets = [];

  function rerun () {
    for (var i = 0; i < sets.length; i++) {
      sets[i].equalizeHeights();
    }
  }

  $.fn.extend({

    equalizeHeights: function( subselector ) {

      // if we get a subselector we recurse
      if ( subselector ) {
        return this.find( subselector ).equalizeHeights();
      }
      else {

        // find highest natural height
        var maxHeight = 0;
        this.each(function ( i ) {
          $( this ).css( heightAttribute, 0 );
          maxHeight = Math.max( $( this ).height(), maxHeight );
        });

        // assign new min-heights to collection
        this.css( heightAttribute, maxHeight );

        // for browser with ok resize events, redo on next occurence
        if (!$.browser.msie && !this._noPush) {
  
          this._noPush = true;   // prevent inifinite loops when looping through the sets
          sets.push( this );
  
          // add resize event 
          if (!evSet) {
            evSet = true;
            $( window ).bind( 'resize', rerun ).load( rerun );
          }
        }
        else {
          if (!evSet) {
            evSet = true;
            $( window ).load( rerun );
          }
        }
      }
      
      // kick the renderer
      document.body.className += '';  
      
      return this;
      
    }
  
  });

})(jQuery);