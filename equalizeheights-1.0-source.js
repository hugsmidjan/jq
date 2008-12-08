(function($){

  var _msie = $.browser.msie,
      _quirkyOldIE = !!(_msie  && ( parseInt($.browser.version, 10) < 7 || document.compatMode == 'BackCompat' ) ),
      _heightAttribute = (_quirkyOldIE) ? 'height' : 'min-height',
      _evSet,
      _sets = [],
      _cfgs = [],

      _reRun = function (i) {
          i = _sets.length;
          while (i--) {
            _sets[i].equalizeHeights(_cfgs[i]);
          }
        };

  $.fn.equalizeHeights = function( cfg ) {

    cfg = !cfg ? {} : (typeof cfg == 'boolean') ? { margins:cfg } : cfg;

    var _maxHeight = 0,
        _paddings = [];
    this
        // find highest natural height
        .each(function ( i ) {
            var _this = $( this );
            _this.css( _heightAttribute, 0 );
            var _totalHeight = _this.outerHeight(!!cfg.margins);
            _paddings[i] = _totalHeight - _this.height();
            _maxHeight = Math.max( _totalHeight, _maxHeight );
          })
        // assign new min-heights to collection
        .each(function( i ){
            $(this).css( _heightAttribute,  _maxHeight - _paddings[i] );
          });


    // for browser with ok resize events, redo on next occurence
    if (!_msie && !this.eqh_done)
    {
      this.eqh_done = 1;   // prevent inifinite loops when looping through the _sets
      _sets.push( this );
      _cfgs.push( cfg );

      if (!_evSet)
      {
        // add resize event 
        $( window ).bind( 'resize', _reRun );
      }
    }

    if (!_evSet)
    {
      _evSet = 1;
      $( window ).load( _reRun );
    }
    
    // kick the renderer
    document.body.className += '';  
    
    return this;
    
  };

})(jQuery);

