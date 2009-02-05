// TODO:
//  - Maybe?: create a "destroy" method that purges the jQuery collection/elements and _config from the cache and unbinds the 'resize' event handler.
//  - remove reliance on $.browser and use $.support instead

(function($){

  var _quirkyOldIE = !!($.browser.msie  && ( parseInt($.browser.version, 10) < 7 || document.compatMode == 'BackCompat' ) ),
      _heightAttribute = (_quirkyOldIE) ? 'height' : 'min-height',
      _evSet,
      _sets = [],
      _cfgs = [],
      _runningLock;
      _reRun = $.equalizeHeights = function (i) {
          if (!_runningLock) {
            _runningLock=1;
            i = _sets.length;
            while (i--) {  _sets[i].equalizeHeights(_cfgs[i]);  }
            _runningLock=0;
          }
        };


  $.fn.equalizeHeights = function( cfg ) {
    if (this.length)
    {

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


      if (!this.eqh_insets)
      {
        this.eqh_insets = 1; // prevent inifinite loops when looping through the _sets
        _sets.push( this );
        _cfgs.push( cfg );
      }

      if (!_evSet)
      {
        _evSet = 1;
        // for browser with ok resize events, redo on next occurence
        $( window ).bind( 'resize', _reRun );
        $( window ).load( _reRun );
      }

      // kick the renderer
      document.body.className += '';
    }

    return this;
  };


})(jQuery);

