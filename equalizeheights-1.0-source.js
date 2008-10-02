(function($){

  var quirky = !!( $.browser.msie && ( parseInt($.browser.version, 10) < 7 || document.compatMode == 'BackCompat' ) ),         
      heightAttribute = (quirky) ? 'height' : 'min-height',
      evSet = false,
      sets = [];

	$.fn.extend({

		equalHeight: function( subselector ) {

      // if we get a subselector we simply recurse
      if ( subselector ) {
        
        return $( subselector, this ).equalHeight();
      
      }
      else {

        var maxHeight = 0;

        // find highest natural height
        this.each(function ( i ) {
          
          $( this ).css( heightAttribute, 0 );
          maxHeight = Math.max( $( this ).height(), maxHeight );

        });

        // assign new min-heights to collection
        this.each(function ( i ) {
          
          $( this ).css( heightAttribute, maxHeight );
          
        });

        // for browser with ok resize events, redo on next occurence
        if (!$.browser.msie && !this._noPush) {
  
          this._noPush = true;   // prevent inifinite loops when looping through the sets
          sets.push( this );
  
          // add resize event 
          if (!evSet) {
  
            evSet = true;
            
            $( window ).bind( 'resize', function() {
  
              for (var i = 0; i < sets.length; i++) {
                sets[i].equalHeight();
              }
              
            });
  
          }
        }
      }
      
      // kick the renderer
      document.body.className += '';  
      
      return this;
      
    }
  
  });

})(jQuery);